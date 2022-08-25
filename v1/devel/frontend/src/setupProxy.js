const { createProxyMiddleware } = require('http-proxy-middleware');

const port = process.env.REACT_APP_API_PORT 
const api = process.env.REACT_APP_API_URL 
const auth = process.env.REACT_APP_AUTH_URL
const admin = process.env.REACT_APP_ADMIN_URL
const socketio = process.env.REACT_APP_SOCKETIO_URL
const url = 'http://127.0.0.1:'+port.toString()

module.exports = function(app) {
    app.use(socketio, createProxyMiddleware({ 'target': url, 'ws': true }));
    app.use(api,      createProxyMiddleware({ 'target': url })); 
    app.use(auth,     createProxyMiddleware({ 'target': url })); 
    app.use(admin,    createProxyMiddleware({ 'target': url })); 
};

