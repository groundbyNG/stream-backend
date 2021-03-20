const WebSocket = require('ws');
const isAuth = require('../server/helpers/isAuth');
const broadcastCtrl = require('../server/broadcast/broadcast.controller');

class WebSocketWrapper {
  constructor(config) {
    this.server = new WebSocket.Server(config);
    this.server.on('connection', broadcastCtrl);

    this.server.on('close', (err) => {
      console.log('close', err);
    });
    
    this.server.on('err', (err) => {
      console.log('err', err);
    });

    this.handleUpgrade = this.handleUpgrade.bind(this);
  }

  handleUpgrade (request, socket, head) {
    console.log('hello');
    // This function is not defined on purpose. Implement it with your own logic.
    isAuth(request, socket, (client) => {
      this.server.handleUpgrade(request, socket, head, (ws) => {
        this.server.emit('connection', ws, request, client);
      });
    });
  }
}

module.exports = WebSocketWrapper;
