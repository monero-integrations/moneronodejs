# Monero Library
A Monero library written in Node.js by the Monero-Integrations team.

## How It Works
This library has two main parts: a Monero daemon JSON RPC API wrapper, `daemonRPC.js`, and a Monero wallet (`monero-wallet-rpc`) JSON RPC API wrapper, `walletRPC.js`.

## Configuration
### Requirements
 - Monero daemon
 - Node.js

Debian (or Ubuntu) are recommended.


---

1. Start the Monero daemon (`monerod`)
```bash
monerod --testnet --detach
```

2. Start the Monero wallet RPC interface (`monero-wallet-rpc`)
```bash
monero-wallet-rpc --testnet --rpc-bind-port 28083 --disable-rpc-login --wallet-dir /path/to/wallet/directory
```

3. Edit `example.js` with your the IP address of `monerod` and `monero-wallet-rpc` (use `127.0.0.1:28081` and `127.0.0.1:28083`, respectively, for testnet, or `38081` and `38083` for stagenet)

4. Run `example.js` with `node example.js`.  If everything has been set up correctly, information from your Monero daemon and wallet will be displayed
