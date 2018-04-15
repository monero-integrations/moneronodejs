# Monero Library
A Monero library written in Node.js by the [Monero Integrations](https://monerointegrations.com) [team](https://github.com/sneurlax/moneronodejs/graphs/contributors).

[//]: # (Update contributors link to https://github.com/monero-integrations/moneronodejs/graphs/contributors if/when it is merged in)

**NOTE:** due to the existence of the [`monero-nodejs` package by PsychicCat](https://github.com/PsychicCat/monero-nodejs), `moneronodejs` will never be publishable on npm.  Thus, this repository is being finalized, archived, and continued as [`monerojs`](https://github/com/sneurlax/monerojs).  If the Monero Integrations team will merge this into [monero-ingtegrations/moneronodejs](https://github.com/monero-integrations/moneronodejs) then it will be revived and updated as needed, otherwise please refer to [`monerojs`](https://github/com/sneurlax/monerojs) for the latest code and best features.

[//]: # (Update monerojs repository link to https://github.com/monero-integrations/monerojs if/when it is merged in)

## How It Works
This library has two main parts: a Monero daemon JSON RPC API wrapper, `daemonRPC.js`, and a Monero wallet (`monero-wallet-rpc`) JSON RPC API wrapper, `walletRPC.js`.

## Configuration
### Requirements
 - Node.js

*Monero daemon now optional!*

## Installation
```bash
npm install monerojs
```
*`--save` optional*

## Usage
```js
const Monero = require('monerojs');

var daemonRPC = new Monero.daemonRPC({ autoconnect: true })
.then((daemon) => {
  daemonRPC = daemon;
  
  daemonRPC.getblockcount()
    .then(blocks => {
      console.log(blocks);
    });
  })
  .catch((err) => {
    console.error(err);
  });
```
