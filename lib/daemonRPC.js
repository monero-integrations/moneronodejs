/**
 * 
 * moneronodejs/daemonRPC
 * 
 * A class for making calls to a Monero daemon's RPC API using Node.js
 * https://github.com/monero-integrations/moneronodejs
 * 
 * @author     Monero Integrations Team <support@monerointegrations.com> (https://github.com/monero-integrations)
 * @copyright  2018
 * @license    MIT
 * 
 */
'use strict'

var request = require('request-promise');

class daemonRPC {
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
  }

  /**
   *
   * Execute command on the Monero RPC API
   *
   * @param  string  method  RPC method to call
   * @param  ojbect  params  Options to include (optional)
   *
   * @return string  Call result
   *
   */
  _run(method, params = '') {
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

  /**
   *
   * Look up how many blocks are in the longest chain known to the node
   *
   * @return object  Example: {  
   *   "count": 993163,  
   *   "status": "OK"  
   * }  
   *
   */
  getblockcount() {
    return this._run('getblockcount');
  }

  /**
   *
   * Look up a block's hash by its height
   *
   * @param  array   height   Height of block to look up 
   *
   * @return string  Example: 'e22cf75f39ae720e8b71b3d120a5ac03f0db50bba6379e2850975b4859190bc6'
   *
   */
  on_getblockhash(height) {
    if (typeof height == 'undefined') {
      throw new Error('Error: Height required');
    }

    let params = { height: height };

    return this._run('on_getblockhash', params);
  }

  /**
   *
   * Retrieve a block template that can be mined upon
   *
   * @param  string  wallet_address  Address of wallet to receive coinbase transactions if block is successfully mined
   * @param  int     reserve_size    Reserve size 
   *
   * @return object  Example: {
   *   "blocktemplate_blob": "01029af88cb70568b84a11dc9406ace9e635918ca03b008f7728b9726b327c1b482a98d81ed83000000000018bd03c01ffcfcf3c0493d7cec7020278dfc296544f139394e5e045fcda1ba2cca5b69b39c9ddc90b7e0de859fdebdc80e8eda1ba01029c5d518ce3cc4de26364059eadc8220a3f52edabdaf025a9bff4eec8b6b50e3d8080dd9da417021e642d07a8c33fbe497054cfea9c760ab4068d31532ff0fbb543a7856a9b78ee80c0f9decfae01023ef3a7182cb0c260732e7828606052a0645d3686d7a03ce3da091dbb2b75e5955f01ad2af83bce0d823bf3dbbed01ab219250eb36098c62cbb6aa2976936848bae53023c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001f12d7c87346d6b84e17680082d9b4a1d84e36dd01bd2c7f3b3893478a8d88fb3",
   *   "difficulty": 982540729,
   *   "height": 993231,
   *   "prev_hash": "68b84a11dc9406ace9e635918ca03b008f7728b9726b327c1b482a98d81ed830",
   *   "reserved_offset": 246,
   *   "status": "OK"
   * }
   *
   */
  getblocktemplate(wallet_address, reserve_size) {
    if (typeof wallet_address == 'undefined') {
      throw new Error('Error: Wallet address required');
    }
    if (typeof reserve_size == 'undefined') {
      throw new Error('Error: Reserve size required');
    }
    
    let params = {
      wallet_address: $wallet_address,
      reserve_size: $reserve_size
    };

    return this._run('getblocktemplate', params);
  }

  /**
   *
   * Submit a mined block to the network
   *
   * @param  string  block  Block blob data string
   *
   * @return string  // TODO: example
   *
   */
  submitblock(block) {
    if (typeof block == 'undefined') {
      throw new Error('Error: Block blob required');
    }

    return this._run('submitblock', $block);
  }
}

module.exports = daemonRPC;
