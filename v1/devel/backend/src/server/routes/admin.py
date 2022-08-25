from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Api, Resource, reqparse, fields, marshal_with, abort
from sqlalchemy import inspect, desc

from server import model
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

import smtplib
from . import history
from .util import role_required

bp = Blueprint('admin',__name__,url_prefix='/admin')
api = Api(bp)

# https://stackoverflow.com/questions/1958219/convert-sqlalchemy-row-object-to-python-dict
def object_as_dict(obj):
    return {c.key: getattr(obj, c.key)
                for c in inspect(obj).mapper.column_attrs}

user_fields = {
    'id': fields.Integer,
    'username': fields.String,
    'email': fields.String,
    'created_on': fields.DateTime(dt_format='rfc822'),
    'updated_on': fields.DateTime(dt_format='rfc822'),
    'pending': fields.Boolean,
    'active': fields.Boolean,
    'role': fields.String(attribute="role.name")
    }

role_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'users': fields.List(fields.String(attribute='username'))
    }

history_fields = {
    'id': fields.Integer,
    'username': fields.String,
    'action': fields.String,
    'timestamp': fields.DateTime(dt_format='rfc822'),
    }

application_fields = {
    'id': fields.Integer,
    'firstname': fields.String,
    'lastname': fields.String,
    'email': fields.String,
    'phonenumber': fields.String,
    'university': fields.String,
    'city': fields.String,
    'state': fields.String,
    'country': fields.String,
    'field': fields.String,
    'graduation': fields.String,
    'supervisor_name': fields.String,
    'supervisor_email': fields.String,
    'supervisor_phone': fields.String,
    'why_attend': fields.String,
    'experience': fields.String,
    'research_area': fields.String,
    'other': fields.String,
    'created_on': fields.DateTime(dt_format='rfc822'),
    'updated_on': fields.DateTime(dt_format='rfc822'),
    'approved': fields.Boolean,
    'trash': fields.Boolean,
    'apptype': fields.String(attribute="apptype.description"),
    'degree': fields.String(attribute="degree.description"),
    'housing_pref': fields.String(attribute="housing_pref.description")
    }

degree_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    }
    
housing_pref_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    }

apptype_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    }

class HandleUsers(Resource):

    parser = reqparse.RequestParser(trim=True)
    parser.add_argument('username',required=True)
    parser.add_argument('password',required=True)
    parser.add_argument('email',required=True)
    parser.add_argument('active',type=bool)
    parser.add_argument('pending',type=bool)
    parser.add_argument('role',required=True)

    @role_required('admin')
    @marshal_with(user_fields, envelope='users')
    def get(self):
        return model.User.query.order_by(model.User.id).all()

    @role_required('admin')
    @marshal_with(user_fields, envelope='users')
    def post(self):

        data = self.parser.parse_args()
        data = model.filter_columns(model.User, data, extra=['password'])

        rolename = data['role']
        data['role'] = model.Role.query.filter_by(name=rolename).first_or_404()

        user = model.User(**data)
        model.db.session.add(user)
        model.db.session.commit()

        return user,200

class HandleUser(Resource):

    parser = reqparse.RequestParser(trim=True)
    parser.add_argument('username')
    parser.add_argument('password')
    parser.add_argument('email')
    parser.add_argument('active',type=bool)
    parser.add_argument('pending',type=bool)
    parser.add_argument('role')

    @role_required('admin')
    @marshal_with(user_fields, envelope='user')
    def get(self, user_id):
        return model.User.query.filter_by(id=user_id).first_or_404()

    @role_required('admin')
    @marshal_with(user_fields, envelope='user')
    def patch(self, user_id):

        data = self.parser.parse_args()
        data = model.filter_columns(model.User, data, extra=['password'])

        if data['role']:
            rolename = data['role']
            data['role'] = model.Role.query.filter_by(name=rolename).first_or_404()

        user = model.User.query.filter_by(id=user_id).first_or_404()

        for key,value in data.items():
            if value is not None:
                setattr(user, key, value)

        model.db.session.commit()

        return user

    @role_required('admin')
    def delete(self, user_id):

        user = model.User.query.filter_by(id=user_id).first_or_404()

        model.db.session.delete(user)
        model.db.session.commit()

        return  

class HandleRoles(Resource):

    @role_required('admin')
    @marshal_with(role_fields, envelope='roles')
    def get(self):
        return model.Role.query.order_by(model.Role.id).all()

class HandleHistory(Resource):

    @role_required('admin')
    @marshal_with(history_fields, envelope='history')
    def get(self):
        return model.History.query.order_by(desc(model.History.timestamp)).all()

class HandleApplications(Resource):

    @role_required(['member','manager','admin'])
    @marshal_with(application_fields, envelope='applications')
    def get(self):
        return model.Application.query.order_by(model.Application.id).all()

class HandleApplication(Resource):

    parser = reqparse.RequestParser(trim=True)
    parser.add_argument('approved',type=bool)
    parser.add_argument('trash',type=bool)

    @role_required(['member', 'manager', 'admin'])
    @marshal_with(application_fields, envelope='application')
    def get(self, app_id):
        return model.Application.query.filter_by(id=app_id).first_or_404()

    @role_required(['manager', 'admin'])
    @marshal_with(application_fields, envelope='application')
    def patch(self, app_id):

        data = self.parser.parse_args()
        data = model.filter_columns(model.Application, data)

        app = model.Application.query.filter_by(id=app_id).first_or_404()

        for key,value in data.items():
            if value is not None:
                setattr(app, key, value)

        model.db.session.commit()

        return app

    @role_required(['manager', 'admin'])
    def delete(self, app_id):

        app = model.Application.query.filter_by(id=app_id).first_or_404()

        model.db.session.delete(app)
        model.db.session.commit()

        return  

class ListPending(Resource):

    @role_required('admin')
    @marshal_with(user_fields, envelope='users')
    def get(self):
        return model.User.query.filter_by(pending=True).all()

def SendSignupApprovedEmail(user):

    sender_email = 'no-reply@ingeo.datatransport.org'
    receiver_email = user.email

    body = []
    body.append('InGeO Account Ready')
    body.append('')
    body.append('Your InGeO account is ready to use.')
    body.append('')
    body.append('You can sign in here: https://ingeo.datatransport.org/home/sign-in')
    body.append('')
    body.append('Regards,')
    body.append('The InGeo team.')
    body.append('')
    body.append('If you have any questions, please email us at ingeo-team@ingeo.datatranport.org')
    body.append('')

    body = '\n'.join(body)

    message = MIMEMultipart('alternative')
    message['Subject'] = 'Your InGeO account is ready'
    message['From'] = sender_email
    message['To'] = receiver_email

    message.attach(MIMEText(body,"plain"))

    smtp = smtplib.SMTP('localhost')
    smtp.sendmail(sender_email,receiver_email,message.as_string())
    smtp.quit()

def SendSignupDeniedEmail(user):

    sender_email = 'no-reply@ingeo.datatransport.org'
    receiver_email = user.email

    body = []
    body.append('InGeO Account Denied')
    body.append('')
    body.append('Sorry, we are not able to create an account for you at this time.')
    body.append('')
    body.append('If you have any questions, please email us at ingeo-team@ingeo.datatranport.org')
    body.append('')
    body.append('Regards,')
    body.append('The InGeo team.')
    body.append('')

    body = '\n'.join(body)

    message = MIMEMultipart('alternative')
    message['Subject'] = 'Your InGeO account request has been denied'
    message['From'] = sender_email
    message['To'] = receiver_email

    message.attach(MIMEText(body,"plain"))

    smtp = smtplib.SMTP('localhost')
    smtp.sendmail(sender_email,receiver_email,message.as_string())
    smtp.quit()

    get_jwt_identity()

class ApproveUser(Resource):

    parser = reqparse.RequestParser()
    parser.add_argument('username',type=str,required=True)

    @role_required('admin')
    def post(self):

        data = self.parser.parse_args()
        username = data['username']

        user = model.User.query.filter_by(username=username).first()

        if not user:
            return {'message':'Unknown user'},401

        user.pending=False
        user.active=True

        try:
            model.db.session.commit()
        except:
            model.db.session.rollback()

        SendSignupApprovedEmail(user)
        history.add_entry(get_jwt_identity(),'Approved %s' % username)

        return {'message':'approved'},200

class DenyUser(Resource):

    parser = reqparse.RequestParser()
    parser.add_argument('username',type=str,required=True)

    @role_required('admin')
    def post(self):

        data = self.parser.parse_args()
        username = data['username']

        user = model.User.query.filter_by(username=username).first()

        if not user:
            return {'message':'Unknown user'},401

        user.pending=False
        user.active=False

        try:
            model.db.session.commit()
        except:
            model.db.session.rollback()

        SendSignupDeniedEmail(user)
        history.add_entry(get_jwt_identity(),'Denied %s' % username)

        return {'message':'denied'},200

api.add_resource(HandleUsers,       '/users')
api.add_resource(HandleUser,        '/users/<user_id>')
api.add_resource(HandleRoles,       '/roles')
api.add_resource(HandleHistory,     '/history')
api.add_resource(HandleApplications,'/applications')
api.add_resource(HandleApplication, '/applications/<app_id>')
api.add_resource(ListPending,       '/pending')
api.add_resource(ApproveUser,       '/approve')
api.add_resource(DenyUser,          '/deny')

