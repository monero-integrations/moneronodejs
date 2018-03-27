'use strict'

var request = require('request-promise');

class daemonRPC {
  constructor(host = '127.0.0.1', port = '28081', protocol = 'http') {
    this.host = host;
    this.port = port;
    this.protocol = protocol;
  }
}

module.exports = daemonRPC;
