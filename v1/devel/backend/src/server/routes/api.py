from flask import (
    Blueprint, jsonify, request, current_app,
    render_template, url_for, redirect
    )
from flask_restful import Api, Resource, reqparse, abort, fields, marshal_with
from flask_mail import Message

from server import db, pages, model

import requests

bp = Blueprint('api',__name__,url_prefix='/api',template_folder='templates')
api = Api(bp)

station_fields = {
    'id':       fields.Integer,
    'name':     fields.String,
    'label':    fields.String,
    'status':   fields.String
    }

camera_fields = {
    'id':          fields.Integer,
    'station':     fields.String,
    'instrument':  fields.String
}

processed_data_fields = {
    'id':           fields.Integer,
    'timestamp':    fields.DateTime(dt_format='iso8601')
}

processed_fields = {
    'name':     fields.String,
    'data':     fields.List(fields.Nested(processed_data_fields))
}

meshnode_fields = {
    'id':           fields.Integer,
    'name':         fields.String,
    'label':        fields.String,
    'created_on':   fields.DateTime(dt_format='iso8601'),
    'updated_on':   fields.DateTime(dt_format='iso8601'),
    'checked_on':   fields.DateTime(dt_format='iso8601'),
    'latitude':     fields.Float,
    'longitude':    fields.Float
}

fusionproduct_fields = {
    'id':       fields.Integer,
    'name':     fields.String,
    'title':    fields.String,
    'label':    fields.String,
    'order':    fields.Integer,
}

fusiondata_fields = {
    'id':           fields.Integer,
    'timestamp':    fields.DateTime(dt_format='iso8601')
}

statistics_product_fields = {
    'id':       fields.Integer,
    'name':     fields.String,
    'title':    fields.String,
    'label':    fields.String,
    'order':    fields.Integer,
}

statistics_data_fields = {
    'id':           fields.Integer,
    'timestamp':    fields.DateTime(dt_format='iso8601')
}


@bp.route('/page/<path:path>')
def get_page(path):
    page = pages.get_or_404(path)
    return jsonify(dict(content=page))

class HandleActiveStations(Resource):

    @marshal_with(station_fields, envelope='stations')
    def get(self):

        mcs = model.SystemModel.query.filter_by(name='mcs').first_or_404().id
        active = model.Status.query.filter_by(name='active').first_or_404().id

        query = (
                model.Station.query
                .filter_by(model_id=mcs, status_id=active)
                .order_by(model.Station.name)
                )

        return query.all()

class HandleStations(Resource):

    @marshal_with(station_fields, envelope='stations')
    def get(self):

        mcs = model.SystemModel.query.filter_by(name='mcs').first_or_404()

        query = (
            db.session.query(
                model.Station,
                model.Status
            )
            .join(model.Status)
            .filter(model.Station.model_id==mcs.id)
            .order_by(model.Station.name)
            )

        results = []

        for station, status in query.all():
            entry = dict(
                id = station.id,
                name = station.name,
                label = station.label,
                status = status.name
            )
            results.append(entry)

        
        return results 

class HandleMeshNodes(Resource):
 
    @marshal_with(meshnode_fields, envelope='meshnodes')
    def get(self):

        group = model.MeshGroup.query.filter_by(name='mango').first_or_404()
    
        query = (
            model.MeshNode.query
            .filter_by(group_id=group.id, active=True)
            .order_by(model.MeshNode.name)
            )

        return query.all()

class HandleCameras(Resource):

    @marshal_with(camera_fields, envelope='cameras')
    def get(self):

        query = (
                db.session.query(
                    model.StationInstrument,
                    model.Station, 
                    model.Instrument
                )
                .join(model.Station)
                .join(model.Instrument)
                .order_by(model.Station.name, model.Instrument.name)
                )

        results = []

        for stationinstrument, station, instrument in query.all():
            entry = dict(
                id=stationinstrument.id,
                station=station.name, 
                instrument=instrument.name
                )
            results.append(entry)

        return results 

class HandleProcessedData(Resource):

    @marshal_with(processed_fields, envelope='processed')
    def get(self, station_name, instrument_name):
        
        station = model.Station.query.filter_by(name=station_name).first_or_404() 
        instrument = model.Instrument.query.filter_by(name=instrument_name).first_or_404() 
        stationinstrument = model.StationInstrument.query.filter_by(
            station_id=station.id,
            instrument_id=instrument.id
            ).first()

        # Lets a page gracefully show no data for this source rather than an error. 
        # This is useful when scrolling through sites that might not have all of the
        # same instrumentation.

        if not stationinstrument:
            return []

        products = model.ProcessedProduct.query.all()

        result = [] 

        for product in products:

            query = (
                model.ProcessedData.query
                .filter_by(stationinstrument_id=stationinstrument.id, product_id=product.id)
                .order_by(model.ProcessedData.timestamp)
                )

            result.append(dict(name=product.name, data=query.all()))

        return result 

class HandleFusionProducts(Resource):
 
    @marshal_with(fusionproduct_fields, envelope='products')
    def get(self):

        query = (
            model.FusionProduct.query
            .order_by(model.FusionProduct.order)
            )

        return query.all()

class HandleFusionData(Resource):

    @marshal_with(fusiondata_fields, envelope='fusiondata')
    def get(self, product_name):
        product = model.FusionProduct.query.filter_by(name=product_name).first_or_404() 

        datafiles = (
            model.FusionData.query
            .filter_by(product_id=product.id)
            .order_by(model.FusionData.timestamp)
            )

        return datafiles.all()

class HandleStatisticsProducts(Resource):
 
    @marshal_with(statistics_product_fields, envelope='products')
    def get(self):

        query = (
            model.StatisticProduct.query
            .order_by(model.StatisticProduct.order)
            )

        return query.all()

class HandleStatisticsData(Resource):

    #@marshal_with(statistics_data_fields, envelope='statistics_data')
    def get(self, product_name):

        product = model.StatisticProduct.query.filter_by(name=product_name).first_or_404() 

        if (product_name == 'uptime-table'):
            url = 'https://data.mangonetwork.org/data/transport/mango/var/uptime-table.json'
            return requests.get(url).json()

        #datafiles = (
        #    model.FusionData.query
        #    .filter_by(product_id=product.id)
        #    .order_by(model.FusionData.timestamp)
        #    )

        #return datafiles.all()
        return [] 


api.add_resource(HandleStations,            '/stations')
api.add_resource(HandleProcessedData,       '/processed/<station_name>/<instrument_name>')
api.add_resource(HandleFusionProducts,      '/fusion')
api.add_resource(HandleFusionData,          '/fusion/<product_name>')
api.add_resource(HandleStatisticsProducts,  '/statistics')
api.add_resource(HandleStatisticsData,      '/statistics/<product_name>')
api.add_resource(HandleCameras,             '/cameras')
api.add_resource(HandleMeshNodes,           '/meshnodes')

