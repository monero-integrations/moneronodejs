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
  
  /**
   *
   * Look up wallet address
   *
   * @return object  Example: {
   *   "address": "427ZuEhNJQRXoyJAeEoBaNW56ScQaLXyyQWgxeRL9KgAUhVzkvfiELZV7fCPBuuB2CGuJiWFQjhnhhwiH1FsHYGQGaDsaBA"
   * }
   *
   */
  getaddress() {
    return this._run('getaddress');
  }
  
  /**
   *
   * Look up wallet balance
   *
   * @return object  Example: {
   *   "balance": 140000000000,
   *   "unlocked_balance": 50000000000
   * }
   *
   */
  getbalance() {
    return this._run('getbalance');
  }
  
  /**
   *
   * Look up current height of wallet
   *
   * @return object  Example: {
   *   "height": 994310
   * }
   *
   */
  getheight() {
    return this._run('getheight');
  }
  
  /**
   *
   * Look up transfers
   *
   * @param  string  input_type   Transfer type; must be 'in', 'out', 'pending', 'failed', 'pool', 'filter_by_height', 'min_height', or 'max_height'
   * @param  string  input_value  Input value of above
   *
   * @return object  Example: {
   *   "pool": [{
   *     "amount": 500000000000,
   *     "fee": 0,
   *     "height": 0,
   *     "note": "",
   *     "payment_id": "758d9b225fda7b7f",
   *     "timestamp": 1488312467,
   *     "txid": "da7301d5423efa09fabacb720002e978d114ff2db6a1546f8b820644a1b96208",
   *     "type": "pool"
   *   }]
   * }
   *
   */
  get_transfers(input_type, input_value) {
    if (typeof input_type == 'undefined') {
      throw new Error('Error: Input type required');
    }
    if (typeof input_value == 'undefined') {
      throw new Error('Error: Input value required');
    }

    let params = { input_type: input_value };
    return this._run('get_transfers', params);
  }
  
  /**
   *
   * Look up incoming transfers
   *
   * @param  string  type  Type of transfer to look up; must be 'all', 'available', or 'unavailable' (incoming transfers which have already been spent)
   *
   * @return object  Example: {
   *   "transfers": [{
   *     "amount": 10000000000000,
   *     "global_index": 711506,
   *     "spent": false,
   *     "tx_hash": "&lt;c391089f5b1b02067acc15294e3629a463412af1f1ed0f354113dd4467e4f6c1&gt;",
   *     "tx_size": 5870
   *   },{
   *     "amount": 300000000000,
   *     "global_index": 794232,
   *     "spent": false,
   *     "tx_hash": "&lt;c391089f5b1b02067acc15294e3629a463412af1f1ed0f354113dd4467e4f6c1&gt;",
   *     "tx_size": 5870
   *   },{
   *     "amount": 50000000000,
   *     "global_index": 213659,
   *     "spent": false,
   *     "tx_hash": "&lt;c391089f5b1b02067acc15294e3629a463412af1f1ed0f354113dd4467e4f6c1&gt;",
   *     "tx_size": 5870
   *   }]
   * }
   */
  incoming_transfers(type = 'all') {
    let params = { transfer_type: type };
    return this._run('incoming_transfers', params);
  }
  
  /**
   *
   * Look up wallet view key
   *
   * @return object  Example: {
   *   "key": "7e341d..."
   * }
   *
   */
  view_key() {
    let params = { key_type: 'view_key' };
    return this._run('query_key', params);
  }
  
  /**
   *
   * Look up wallet spend key
   *
   * @return object  Example: {
   *   "key": "2ab810..."
   * }
   *
   */
  spend_key() {
    let params = { key_type: 'spend_key' };
    return this._run('query_key', params);
  }
  
  /**
   *
   * Look up wallet spend key
   *
   * @return object  Example: {
   *   "key": "2ab810..."
   * }
   *
   */
  mnemonic() {
    let params = { key_type: 'mnemonic' };
    return this._run('query_key', params);
  }
  
  /**
   *
   * Make an integrated address from the wallet address and a payment ID
   *
   * @param  string  payment_id  Payment ID to use when generating an integrated address (optional)
   *
   * @return object  Example: {
   *   "integrated_address": "4BpEv3WrufwXoyJAeEoBaNW56ScQaLXyyQWgxeRL9KgAUhVzkvfiELZV7fCPBuuB2CGuJiWFQjhnhhwiH1FsHYGQQ8H2RRJveAtUeiFs6J"
   * }
   *
   */
  make_integrated_address(payment_id = null) {
    let params = { payment_id: payment_id };
    return this._run('make_integrated_address', params);
  }
  
  /**
   *
   * Retrieve the standard address and payment ID corresponding to an integrated address
   *
   * @param  string  integrated_address  Integrated address to split
   *
   * @return object  Example: {
   *   "payment_id": "&lt;420fa29b2d9a49f5&gt;",
   *   "standard_address": "427ZuEhNJQRXoyJAeEoBaNW56ScQaLXyyQWgxeRL9KgAUhVzkvfiELZV7fCPBuuB2CGuJiWFQjhnhhwiH1FsHYGQGaDsaBA"
   * }
   *
   */
  split_integrated_address(integrated_address) {
    if (typeof integrated_address == 'undefined') {
      throw new Error('Error: Integrated address required');
    }
    
    if (typeof integrated_address == 'undefined') {
      throw new Error('Error: Integrated address required');
    }

    let params = { integrated_address: integrated_address };
    return this._run('split_integrated_address', params);
  }
  
  /**
   *
   * Stop the wallet, saving the state
   *
   */
  stop_wallet() {
    return this._run('stop_wallet');
  }

  /**
   *
   * Create a payment URI using the official URI spec
   *
   * @param  string  address         Address to include
   * @param  string  amount          Amount to request
   * @param  string  recipient_name  Name of recipient    (optional)
   * @param  string  #description     Payment description  (optional)
   *
   * @return object  Example: 
   *
   */
  make_uri(address, amount, recipient_name = null, description = null) {
    if (typeof address == 'undefined') {
      throw new Error('Error: Address required');
    }
    if (typeof amount == 'undefined') {
      throw new Error('Error: Amount required');
    }

    // Convert from moneroj to tacoshi (piconero)
    let new_amount = amount * 1000000000000;
       
    let params = { address: address, amount: new_amount, payment_id: '', recipient_name: recipient_name, tx_description: description };
    return this._run('make_uri', params);
  }

  /**
   *
   * Parse a payment URI to get payment information
   *
   * @param  string  uri  Payment URI
   *
   * @return object  Example: {
   *   "uri": {
   *     "address": "44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A",
   *     "amount": 10,
   *     "payment_id": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
   *     "recipient_name": "Monero Project donation address",
   *     "tx_description": "Testing out the make_uri function."
   *   }
   * }
   *
   */
  parse_uri(uri) {
    if (typeof uri == 'undefined') {
      throw new Error('Error: Payment URI required');
    }

    let params = { uri: uri };
    return this._run('parse_uri', params);
  }
  
  /**
   *
   * Rescan blockchain from scratch
   *
   */
  rescan_blockchain() {
    return this._run('rescan_blockchain');
  }
  
  /**
   *
   * Set arbitrary string notes for transactions
   *
   * @param  array  txids  Array of transaction IDs (strings) to apply notes to
   * @param  array  notes  Array of notes (strings) to add 
   *
   */
  set_tx_notes(txids, notes) {
    if (typeof txids == 'undefined') {
      throw new Error('Error: Transaction IDs required');
    }
    if (typeof notes == 'undefined') {
      throw new Error('Error: Notes required');
    }

    let params = { txids: txids, notes: notes };
    return this._run('set_tx_notes', params);
  }
  
  /**
   *
   * Get string notes for transactions
   *
   * @param  array  txids  Array of transaction IDs (strings) to look up
   *
   */
  get_tx_notes(txids) {
    if (typeof txids == 'undefined') {
      throw new Error('Error: Transaction IDs required');
    }

    let params = { txids: txids };
    return this._run('get_tx_notes', params);
  }
  
  /**
   *
   * Verify a signature on a string
   *
   * @param  string   data       Signed data
   * @param  string   address    Address that signed data
   * @param  string   signature  Signature to verify
   *
   * @return boolean  good       Verification status
   * 
   */
  verify(data, address, signature) {
    if (typeof data == 'undefined') {
      throw new Error('Error: Signed data required');
    }
    if (typeof address == 'undefined') {
      throw new Error('Error: Signing address required');
    }
    if (typeof signature == 'undefined') {
      throw new Error('Error: Signature required');
    }

    let params = { data: data, address: address, signature: signature };
    return this._run('verify', params);
  }
  
  /**
   *
   * Export a signed set of key images
   *
   * @return  array  signed_key_images  Array of signed key images
   *
   */
  export_key_images() {
    return this._run('export_key_images');
  }
  
  /**
   *
   * Import a signed set of key images
   *
   * @param  array   signed_key_images  Array of signed key images
   *
   * @return number  height
   * @return number  spent
   * @return number  unspent
   * 
   */
  import_key_images(signed_key_images) {
    if (typeof signed_key_images == 'undefined') {
      throw new Error('Error: Signed key images required');
    }

    let params = { signed_key_images: signed_key_images };
    return this._run('import_key_images', params);
  }
  
  /**
   *
   * Retrieve entries from the address book
   *
   * @param  array   entries  Array of indices to return from the address book
   *
   * @return array   entries  Array of entries returned from the address book
   * 
   */
  get_address_book(entries) {
    if (typeof entries == 'undefined') {
      throw new Error('Error: Entry indices required');
    }

    let params = { entries: entries };
    return this._run('get_address_book', params);
  }
  
  /**
   *
   * Retrieve entries from the address book
   *
   * @param  string  address      Address to add to address book
   * @param  string  payment_id   Payment ID to use with address in address book (optional)
   * @param  string  description  Description of address                         (optional)
   *
   * @return number  index        Index of address in address book
   * 
   */
  add_address_book(address, payment_id, description) {
    if (typeof address == 'undefined') {
      throw new Error('Error: Address required');
    }
    if (isset(payment_id)) {
      if (payment_id) {
        params['payment_id'] = payment_id;
      }
    }
    if (isset(description)) {
      if (description) {
        params['description'] = description;
      }
    }

    let params = { address: address };
    return this._run('add_address_book', params);
  }
}

module.exports = walletRPC;
