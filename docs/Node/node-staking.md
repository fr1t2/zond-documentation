---
docstatus: DRAFT  # one of {DRAFT, 30%, 90%, COMPLETE}
id: node-staking
title: Zond Node Staking
hide_title: false
hide_table_of_contents: false
sidebar_label: Zond Node - Staking
sidebar_position: 4
pagination_label: Zond Node - Staking
custom_edit_url: https://github.com/theqrl/documentation/edit/master/docs/basics/what-is-qrl.md
description: Zond Node Staking
keywords:
  - docs
  - Node
image: /assets/img/icons/yellow.png
slug: /node/node-staking
---


:::caution DOCUMENT STATUS 
<span>This document is in: <b>{frontMatter.docstatus}</b> status and needs additional input!</span>
:::


The Proof of Stake (*POS*) system rewards validators for helping secure the network by staking a set amount of funds to use in the cryptographic generation of the next block. These instructions will get you started staking on the Zond Network.


## Staking Information

In order to stake on the Zond network, a user must lock up at minimum $$10,000 \text{QRL}$$ in a staking address. These funds are locked up for the duration of the epoch, or $$100$$ blocks through a `stake` transaction that is broadcast onto the network.

Once this transaction is accepted onto the chain, the users stake will not become valid until the next epoch, or $$100$$ blocks have passed. Funds must remain in the address and the dilithium_keys file must exist in the node's root directory `~/.zond`.

At the head of the epoch, the block proposers are selected and validators chosen for each block at random from all of the viable staking transactions on the chain. For the next 100 blocks the chosen Block Proposers and Validators generate blocks and create the chain with active transactions. At the start of the next epoch, another random 



### Staking Definitions

| Term | Definition | Synonyms | 
| :-----: |-----| :---: |
| Epoch | Every 100 blocks of time | *Staking Block*, *Staking Round* |
| Attestor | Dilithium Staking address  | *Validator* |
| Block Proposer | Staking address chosen to create the block | *Minter*, *Slot Leader* |
| Staking Keys  | `Dilithium_keys` file with keys associated to a Zond dilithium Address  | *key file* |



### Staking Rewards

| Staking Role | Reward |
| :---: | :---: | 
| Attestor | `2 QRL` |
| Block Proposer | `5 QRL + block TX Fees` | 



## Staking Instructions

In order to stake on Zond, a `Stake` transaction is made through the use of a Dilithium address. This stake transaction can create up to $$100$$ Dilithium public keys, each corresponding to a fixed staking amount (presently 10000 QRL).



### Requirements

The following things are required to begin the staking process. Follow the instructions for these items before continuing with this doc.

- A running Zond Node, connected to the public network and fully synced to the latest block
- Zond Dilithium Address in a wallet.json file with $$10,000 \text{QRL}$$ in that Dilithium Address address 

:::note
See the [zond-cli wallet documentation](/wallet/zond-cli/node-cli-wallet#generate-new-dilithium-address)
:::

### Generate Stake TX


With the Zond Node installed, and a fully funded dilithium address, generate the `dilithiul_keys` file to use for staking and broadcast the staking transaction.


:::info
This command expects there is a wallet.json file in the current directory. Use the `wallet-file` flag to specify another location.
::: 

```bash
./zond/zond-cli tx stake --account-index 1 --amount 10000000000000 --gas 1000 --gas-price 0 --nonce 0 --broadcast --remote-addr 45.76.43.83:19009
```

This will broadcast the stake transaction and output a `dilithium_keys` file into the current directory the command was issued. Move this file to the root node  directory `~/.zond/dilithium_keys`

- Amount is given in shor.
- `remote_addr` is only needed if you are not running a local node, instead using a remote node for the transaction


:::note
Find the address index using the `./zond-cli wallet list` command. [More information can be found here](node/node-cli#wallet-list)
:::


Restart the node to pickup this new key file.

### Validate Stake Balance

Using the API call `zond_getStakeBalance` to verify the stake balance for a given address. Replace the address with your staking address


```bash
curl --location --request POST 'http://45.76.43.83:4545' \
--header 'Content-Type: application/json' \
--data-raw '{"jsonrpc":"2.0","method":"zond_getStakeBalance","params":["0x200117c87b91da26b8c1aa823cad3b6ad30f7e8d", "latest"],"id":1}'
```

:::note
Additional information on the API calls available, see the [Zond API documentation](node/node-api#zond_getstakebalance).
:::

### Current Epoch Validators

To list all validators and Block Proposers in the current epoch, use the [`zond_getValidators` API call](/node/node-api#zond_getvalidators)


```bash
curl --location --request POST 'http://45.76.43.83:4545' --header 'Content-Type: application/json' --data-raw '{
    "jsonrpc": "2.0",
    "method": "zond_getValidators",
    "params": [],
    "id": "1"
}'
````

If you have been selected for staking functions, your staking address will be in this list. If you have just issued the stake transaction, you have to wait until the next epoch. 


## Un-Stake Funds


To remove the funds locked up in a staking address, allowing transfer and usage you must issue another stake transaction using the same dilithium address. This transaction will carry a value of 0 qrl, marking the stake empty and not valid for attestation or minting blocks.

These funds will become available after the next epoch after the transaction is accepted on the chain.


```bash
./zond/zond-cli tx stake --account-index 1 --amount 0 --gas 1000 --gas-price 0 --nonce 0 --broadcast --remote-addr 45.76.43.83:19009
```