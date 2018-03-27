/**
 * 
 * moneronodejs/daemonRPC
 * 
 * A class for making calls to monero-wallet-rpc using Node.js
 * https://github.com/monero-integrations/moneronodejs
 * 
 * @author     Monero Integrations Team <support@monerointegrations.com> (https://github.com/monero-integrations)
 * @copyright  2018
 * @license    MIT
 * 
 */
'use strict'

var request = require('request-promise');

class walletRPC {
  constructor(hostname = '127.0.0.1', port = '28081', user = '', pass = '', protocol = 'http') {
    if (typeof hostname == 'object') { // parameters can be passed in as object/dictionary
      let params = hostname;
      this.hostname = params['hostname'] || '127.0.0.1';
      this.port = params['port'] || port;
      this.user = params['user'] || user;
      this.pass = params['pass'] || pass;
      this.protocol = params['protocol'] || protocol;
    } else {
      this.hostname = hostname;
      this.port = port;
      this.user = user;
      this.pass = pass;
      this.protocol = protocol;
    }

    this._run('get_balance'); // This line is necessary in order to do the initial handshake between this wrapper and monero-wallet-rpc; without it, the first request to the wrapper fails (subsequent request succeed, though.)
  }

  /**
   *
   * Execute command on the monero-wallet-rpc API
   *
   * @param  string  method  RPC method to call
   * @param  string  params  Options to include (optional)
   *
   * @return string  Call result
   *
   */
  _run(method, params) {
    let options = {
      forever: true,
      json: {'jsonrpc': '2.0', 'id': '0', 'method': method}
    };

    if (params)
      options['json']['params'] = params;
    if (this.user) {
      options['auth'] = {
        'user': this.user,
        'pass': this.pass,
        'sendImmediately': false
      }
    }

    return request.post(`${this.protocol}://${this.hostname}:${this.port}/json_rpc`, options)
    .then((result) => {
      if (result['result']) {
        return result['result'];
      } else {
        return result;
      }
    }); // TODO catch
  }
}

module.exports = walletRPC;
