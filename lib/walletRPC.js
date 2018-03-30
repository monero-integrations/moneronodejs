/**
 * moneronodejs/walletRPC
 * 
 * A class for making calls to monero-wallet-rpc using Node.js
 * https://github.com/monero-integrations/moneronodejs
 * 
 * @author     Monero Integrations Team <support@monerointegrations.com> (https://github.com/monero-integrations)
 * @copyright  2018
 * @license    MIT
 */
'use strict'

var request = require('request-promise');

/**
 * @class walletRPC
 * @param {string} hostname - RPC hostname
 * @param {number} port - RPC port
 * @param {string} user - RPC username
 * @param {string} pass - RPC password
 * @param {string} protocol - RPC protocol
 *
 *   OR
 *
 * @param {object} params - The same parameters above in any order as an object/dictionary
 */
class walletRPC {
  constructor(hostname = '127.0.0.1', port = 28083, user = undefined, pass = undefined, protocol = 'http') {
    if (typeof hostname == 'object') { // Parameters can be passed in as object/dictionary
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
   * Execute command on the monero-wallet-rpc API
   *
   * @function _run
   * @param {string} ethod - RPC method to call
   * @param {string} arams - Options to include (optional)
   *
   * @returns {object} - Method result, possibly including error object
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
   * Look up wallet balance
   *
   * @function get_balance
   *
   * @returns {object} - Example: {
   *   balance: 140000000000,
   *   unlocked_balance: 50000000000
   * }
   */
  get_balance() {
    return this._run('get_balance');
  }
  
  /**
   * Alias of get_balance
   *
   * @function getbalance
   *
   * @returns {object}
   */
  getbalance() {
    return this._run('getbalance');
  }
  
  /**
   * Look up wallet address(es)
   *
   * @function get_address
   * @param{{number}}ccount_index -- Index of account to look up   (optional)
   * @param({number})ddress_index -- Index of subaddress to look up (optional)
   *
   * @returns {object} - Example: {
   *   address: 'A2XE6ArhRkVZqepY2DQ5QpW8p8P2dhDQLhPJ9scSkW6q9aYUHhrhXVvE8sjg7vHRx2HnRv53zLQH4ATSiHHrDzcSFqHpARF',
   *   addresses: [
   *     {
   *       address: 'A2XE6ArhRkVZqepY2DQ5QpW8p8P2dhDQLhPJ9scSkW6q9aYUHhrhXVvE8sjg7vHRx2HnRv53zLQH4ATSiHHrDzcSFqHpARF',
   *       address_index: 0,
   *       label: 'Primary account',
   *       used: true
   *     }, {
   *       address: 'Bh3ttLbjGFnVGCeGJF1HgVh4DfCaBNpDt7PQAgsC2GFug7WKskgfbTmB6e7UupyiijiHDQPmDC7wSCo9eLoGgbAFJQaAaDS',
   *       address_index: 1,
   *       label: '',
   *       used: true
   *     }
   *   ]
   * }
   */
  get_address() {
    return this._run('get_address');
  }

  /** 
   * Alias of get_address
   *
   * @function getaddress
   * @param{{number}}ccount_index -- Index of account to look up   (optional)
   * @param({number})ddress_index -- Index of subaddress to look up (optional)
   *
   * @returns {object}
   */
  getaddress() {
    return this._run('getaddress');
  }
  
  /**
   * Create a new subaddress
   *
   * @function create_address
   * @param {number} account_index - The index of the account in which to create new subaddress
   * @param {string} label - Label to apply to new address
   *
   * @returns {object} - Example: {
   *   address: "Bh3ttLbjGFnVGCeGJF1HgVh4DfCaBNpDt7PQAgsC2GFug7WKskgfbTmB6e7UupyiijiHDQPmDC7wSCo9eLoGgbAFJQaAaDS"
   *   address_index: 1
   * }
   */
  create_address(account_index = 0, label = undefined) {
    let params = { account_index: account_index, label: label };
    let method = this._run('create_address', params);

    let save = this.store(); // Save wallet state after subaddress creation

    return method;
  }
  
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
  
  /**
   *
   * Delete an entry from the address book
   *
   * @param  array   index  Index of the address book entry to remove
   * 
   */
  delete_address_book(index) {
    if (typeof index == 'undefined') {
      throw new Error('Error: Entry index required');
    }

    let params = { index: index };
    return this._run('delete_address_book', params);
  }
  
  /**
   *
   * Rescan the blockchain for spent outputs
   * 
   */
  rescan_spent() {
    return this._run('rescan_spent');
  }
  
  /**
   *
   * Start mining in the Monero daemon
   *
   * @param  number   threads_count         Number of threads with which to mine
   * @param  boolean  do_background_mining  Mine in backgound?
   * @param  boolean  ignore_battery        Ignore battery?  
   * 
   */
  start_mining(threads_count, do_background_mining, ignore_battery) {
    if (typeof threads_count == 'undefined') {
      throw new Error('Error: Threads required');
    }
    if (typeof do_background_mining == 'undefined') {
      throw new Error('Error: Background mining boolean required');
    }
    if (typeof ignore_battery == 'undefined') {
      throw new Error('Error: Inore battery boolean required');
    }

    let params = { threads_count: threads_count, do_background_mining: do_background_mining, ignore_battery: ignore_battery };
    return this._run('start_mining', params);
  }
  
  /**
   *
   * Stop mining
   * 
   */
  stop_mining() {
    return this._run('stop_mining');
  }
  
  /**
   *
   * Get a list of available languages for your wallet's seed
   * 
   * @return array  List of available languages
   *
   */
  get_languages() {
    return this._run('get_languages');
  }

  /**
   *
   * Send monero to a number of recipients.  Parameters can be passed in individually (as listed below) or as an array (as listed at bottom.)  If multiple destinations are required, use the array format and use
   * 
   * @param  string  amount       Amount to transfer
   * @param  string  address      Address to transfer to
   * @param  number  mixin        Mixin number                                (optional)
   * @param  number  index        Account to send from                        (optional)
   * @param  number  priority     Payment ID                                  (optional)
   * @param  string  pid          Payment ID                                  (optional)
   * @param  number  unlock_time  UNIX time or block height to unlock output  (optional)
   * 
   *   OR
   * 
   * @param  object  params        Array containing any of the options listed above, where only amount and address are required
   *
   * @return object  Example: {
   *   "amount": "1000000000000",
   *   "fee": "1000020000",
   *   "tx_hash": "c60a64ddae46154a75af65544f73a7064911289a7760be8fb5390cb57c06f2db",
   *   "tx_key": "805abdb3882d9440b6c80490c2d6b95a79dbc6d1b05e514131a91768e8040b04"
   * }
   *
   */
  transfer(amount, address = '', mixin = 6, index = 0, priority = 2, pid = '', unlock_time = 0) {
    if (typeof amount == 'object') { // Parameters can be passed in as object/dictionary
      let params = amount;

      if (params['destinations']) {
        let destinations = params['destinations'];

        for (let i = 0; i < Object.keys(destinations).len; i++) {
          if (!destinations[i]['amount']) {
            throw new Error('Error: Amount required for each destination');
          }
          if (!destinations[i]['address']) {
            throw new Error('Error: Address required for each destination');
          }

          // Convert from moneroj to tacoshi (piconero)
          destinations[$i]['amount'] = destinations[$i]['amount'] * 1000000000000;
        }
      } else {
        if (params['amount']) {
          amount = params['amount'];
        } else {
          throw new Error('Error: Amount required');
        }
        if (params['address']) {
          address = params['address'];
        } else {
          throw new Error('Error: Address required');
        }
    
        // Convert from moneroj to tacoshi (piconero)
        let new_amount = amount  * 1000000000000;

        let destinations = { amount: new_amount, address: address };
      }
      mixin = params['mixin'] || 6;
      index = params['index'] || 0;
      pid = params['payment_id'] || '';
      priority = params['priority'] || 2;
      unlock_time = params['unlock_time'] || 0;
      let do_not_relay = params['do_not_relay'] || false;
    } else { // Legacy parameters used
      if (typeof amount == 'undefined') {
        throw new Error('Error: Amount required');
      }
      if (typeof address == 'undefined' || !$address) {
        throw new Error('Error: Address required');
      }
    
      // Convert from moneroj to tacoshi (piconero)
      let new_amount = amount  * 1000000000000;

      let destinations = { amount: new_amount, address: address };
    }

    let params = { destinations: destinations, mixin: mixin, get_tx_key: true };
    params['index'] = index;
    params['payment_id'] = pid;
    params['priority'] = priority;
    params['unlock_time'] = unlock_time;
    params['do_not_relay'] = do_not_relay;

    let method = this._run('transfer', params);
    save = this.store(); // Save wallet state after transfer

    return method;
  }
  
  /**
   *
   * Same as transfer, but splits transfer into more than one transaction if necessary
   *
   */
  transfer_split(amount, address = '', mixin = 6, index = 0, priority = 2, pid = '', unlock_time = 0) {
    if (typeof amount == 'object') { // Parameters can be passed in as object/dictionary
      let params = amount;

      if (params['destinations']) {
        let destinations = params['destinations'];

        for (let i = 0; i < Object.keys(destinations).len; i++) {
          if (!destinations[i]['amount']) {
            throw new Error('Error: Amount required for each destination');
          }
          if (!destinations[i]['address']) {
            throw new Error('Error: Address required for each destination');
          }

          // Convert from moneroj to tacoshi (piconero)
          destinations[$i]['amount'] = destinations[$i]['amount'] * 1000000000000;
        }
      } else {
        if (params['amount']) {
          amount = params['amount'];
        } else {
          throw new Error('Error: Amount required');
        }
        if (params['address']) {
          address = params['address'];
        } else {
          throw new Error('Error: Address required');
        }
    
        // Convert from moneroj to tacoshi (piconero)
        new_amount = amount * 1000000000000;

        destinations = { amount: new_amount, address: address };
      }
      mixin = params['mixin'] || 6;
      index = params['index'] || 0;
      pid = params['payment_id'] || '';
      priority = params['priority'] || 2;
      unlock_time = params['unlock_time'] || 0;
      let do_not_relay = params['do_not_relay'] || false;
    } else { // Legacy parameters used
      if (typeof amount == 'undefined') {
        throw new Error('Error: Amount required');
      }
      if (typeof address == 'undefined' || !$address) {
        throw new Error('Error: Address required');
      }
    
      // Convert from moneroj to tacoshi (piconero)
      new_amount = amount * 1000000000000;

      destinations = { amount: new_amount, address: address };
    }

    let params = { destinations: destinations, mixin: mixin, get_tx_key: true };
    params['index'] = index;
    params['payment_id'] = pid;
    params['priority'] = priority;
    params['unlock_time'] = unlock_time;
    params['do_not_relay'] = do_not_relay;

    let method = this._run('transfer_split', params);
    save = this.store(); // Save wallet state after transfer

    return method;
  }
  
  /**
   *
   * Save wallet
   *
   */
  store() {
    return this._run('store');
  }
  
  /**
   *
   * Send all dust outputs back to the wallet's, to make them easier to spend (and mix)
   *
   */
  sweep_dust() {
    return this._run('sweep_dust');
  }
  
  /**
   *
   * Send all unlocked balance to an address
   * 
   * @param  string  address       Address to transfer to
   * @param  number  below_amount  Only send outputs below this amount         (optional)
   * @param  number  mixin         Mixin number                                (optional)
   * @param  number  index         Account to send from                        (optional)
   * @param  number  priority      Payment ID                                  (optional)
   * @param  string  pid           Payment ID                                  (optional)
   * @param  number  unlock_time   UNIX time or block height to unlock output  (optional)
   * 
   *   OR
   * 
   * @param  object  params        Array containing any of the options listed above, where only amount and address are required
   *
   * @return object  Example: {
   *   "amount": "1000000000000",
   *   "fee": "1000020000",
   *   "tx_hash": "c60a64ddae46154a75af65544f73a7064911289a7760be8fb5390cb57c06f2db",
   *   "tx_key": "805abdb3882d9440b6c80490c2d6b95a79dbc6d1b05e514131a91768e8040b04"
   * }
   *
   */
  sweep_all(address, below_amount = 0, mixin = 6, index = 0, priority = 2, pid = '', unlock_time = 0) {
    if (typeof address == 'object') { // Parameters can be passed in as object/dictionary
      let params = address;

      if (params['address']) {
        address = params['address'];
      } else {
        throw new Error('Error: Address required');
      }

      if (params['below_amount']) {
        // Convert from moneroj to tacoshi (piconero)
        let new_below_amount = params['below_amount'] * 1000000000000;
      }
      mixin = params['mixin'] || 0;
      index = params['index'] || 0;
      priority = params['priority'] || 2;
      pid = params['payment_id'] || '';
      unlock_time = params['unlock_time'] || 0;
      let do_not_relay = params['do_not_relay'] || false;
    } else { // Legacy parameters used
      if (typeof address == 'undefined' || !$address) {
        throw new Error('Error: Address required');
      }

      // Convert from moneroj to tacoshi (piconero)
      let new_below_amount = below_amount * 1000000000000;
    }

    let params = { address: address, mixin: mixin, get_tx_key: true };
    params['below_amount'] = new_below_amount;
    params['index'] = index;
    params['payment_id'] = pid;
    params['priority'] = priority;
    params['unlock_time'] = unlock_time;
    params['do_not_relay'] = do_not_relay;

    let method = this._run('sweep_all', params);
    save = this.store(); // Save wallet state after transfer

    return method;
  }
  
  /**
   *
   * Get a list of incoming payments using a given payment id
   *
   * @param  string  payment_id  Payment ID to look up
   *
   * @return object  Example: {
   *   "payments": [{
   *     "amount": 10350000000000,
   *     "block_height": 994327,
   *     "payment_id": "4279257e0a20608e25dba8744949c9e1caff4fcdafc7d5362ecf14225f3d9030",
   *     "tx_hash": "c391089f5b1b02067acc15294e3629a463412af1f1ed0f354113dd4467e4f6c1",
   *     "unlock_time": 0
   *   }]
   * }
   *
   */
  get_payments(payment_id) {
    if (typeof payment_id == 'undefined') {
      throw new Error('Error: Payment ID required');
    }

    let params = { payment_id: payment_id };
    return this._run('get_payments', params);
  }
  
  /**
   *
   * Get a list of incoming payments using a given payment ID (or a list of payments IDs) from a given height
   *
   * @param  string  payment_id        Payment ID to look up
   * @param  string  min_block_height  Height to begin search
   *
   * @return object  Example: {
   *   "payments": [{
   *     "amount": 10350000000000,
   *     "block_height": 994327,
   *     "payment_id": "4279257e0a20608e25dba8744949c9e1caff4fcdafc7d5362ecf14225f3d9030",
   *     "tx_hash": "c391089f5b1b02067acc15294e3629a463412af1f1ed0f354113dd4467e4f6c1",
   *     "unlock_time": 0
   *   }]
   * }
   *
   */
  get_bulk_payments(payment_id, min_block_height) {
    if (typeof payment_id == 'undefined') {
      throw new Error('Error: Payment ID required');
    }
    if (typeof min_block_height == 'undefined') {
      throw new Error('Error: Minimum block height required');
    }

    let params = { payment_id: payment_id, min_block_height: min_block_height };
    return this._run('get_bulk_payments', params);
  }
  
  /**
   *
   * Show information about a transfer with a given transaction ID
   *
   * @param  string  txid  Transaction ID to look up
   *
   * @return object  Example: {
   *   "transfer": {
   *     "amount": 10000000000000,
   *     "fee": 0,
   *     "height": 1316388,
   *     "note": "",
   *     "payment_id": "0000000000000000",
   *     "timestamp": 1495539310,
   *     "txid": "f2d33ba969a09941c6671e6dfe7e9456e5f686eca72c1a94a3e63ac6d7f27baf",
   *     "type": "in"
   *   }
   * }
   *
   */
  get_transfer_by_txid(txid) {
    if (typeof txid == 'undefined') {
      throw new Error('Error: TX ID required');
    }

    let params = { txid: txid };
    return this._run('get_transfer_by_txid', params);
  }
  
  /**
   *
   * Create a new wallet
   *
   * @param  string  filename  Filename to use for new wallet
   * @param  string  password  Password to use for new wallet
   *
   */
  create_wallet(filename = 'monero_wallet', password = null) {
    let params = { filename: filename, password: password, language: 'English' };
    return this._run('create_wallet', params);
  }
  
  /**
   *
   * Open a wallet
   *
   * @param  string  filename  Filename to use for new wallet
   * @param  string  password  Password to use for new wallet
   *
   * @return object  Example: 
   *
   */
  open_wallet(filename = 'monero_wallet', password = null) {
    let params = { filename: filename, password: password };
    return this._run('open_wallet', params);
  }
  
  /**
   *
   * Sign a string
   *
   * @param  string  data  Data to sign
   *
   * @return object  Example: {
   *   "signature": "SigV1Xp61ZkGguxSCHpkYEVw9eaWfRfSoAf36PCsSCApx4DUrKWHEqM9CdNwjeuhJii6LHDVDFxvTPijFsj3L8NDQp1TV"
   * }
   *
   */
  sign(data) {
    if (typeof data == 'undefined') {
      throw new Error('Error: Data to sign required');
    }
    
    let params = { string: data };
    return this._run('sign', params);
  }
}

module.exports = walletRPC;
