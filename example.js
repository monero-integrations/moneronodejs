var Monero = require('./index.js');

var daemonRPC = new Monero.daemonRPC();
// var daemonRPC = new Monero.daemonRPC('127.0.0.1', 28081, 'user', 'pass', 'http'); // Example of passing in parameters
// var daemonRPC = new Monero.daemonRPC({ port: 28081, protocol: 'https'); // Parameters can be passed in as an object/dictionary

daemonRPC.getblockcount()
.then(height => {
  console.log(height);
});

var walletRPC = new Monero.walletRPC();

walletRPC.create_wallet('monero_wallet', '')
.then(new_wallet => {
  walletRPC.open_wallet('monero_wallet', '')
  .then(wallet => {
    walletRPC.getaddress()
    .then(balance => {
      console.log(balance);
    });
  });
});
