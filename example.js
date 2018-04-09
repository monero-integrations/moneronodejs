var Monero = require('./index.js');

// Connect synchronously
// var daemonRPC = new Monero.daemonRPC();
// var daemonRPC = new Monero.daemonRPC('127.0.0.1', 28081, 'user', 'pass', 'http'); // Example of passing in parameters
// var daemonRPC = new Monero.daemonRPC({ port: 28081, protocol: 'https'); // Parameters can be passed in as an object/dictionary
var daemonRPC = new Monero.daemonRPC({ hostname: '127.0.0.1', port: 28081 });

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

// Autoconnect asynchronously (with a promise)
new Monero.daemonRPC({ autoconnect: true })
.then((daemonRPC) => {
  // return daemonRPC;
  daemonRPC.getblockcount()
  .then(blocks => {
    console.log(blocks['count'] - 1);
  });
})
.catch((error) => {
  console.error(error);
});
