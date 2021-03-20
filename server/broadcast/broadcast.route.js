const { wss } = require('../../config/websocket');
const broadcastCtrl = require('./broadcast.controller');

wss.on('connection', broadcastCtrl);
