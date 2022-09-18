---
docstatus: DRAFT  # one of {DRAFT, 30%, 90%, COMPLETE}
id: node-private-network
title: Zond Node Private Network
hide_title: false
hide_table_of_contents: false
sidebar_label: Zond Node - Private Network
sidebar_position: 7
pagination_label: Zond Node - Private Network
custom_edit_url: https://github.com/theQRL/zond-documentation/edit/main/docs/Node/node-private-network.md
description: Zond Node Private Network
keywords:
  - docs
  - Node
image: /assets/img/icons/yellow.png
slug: /node/node-private-network
---


:::caution DOCUMENT STATUS 
<span>This document is in: <b>{frontMatter.docstatus}</b> status and needs additional input!</span>

These instructions will change frequently as we develop the node software. Check back often as these will be kept up to date until the final solution is in place.
:::

Use these docs to launch a private development network, not connected to the main project.

These are temporary installation instructions to get started with running a DEVELOPMENT zond node on a private network.



### Install Instructions

Assuming you are using a Linux distribution:

```bash
#0. Remove any old install files
rm -rf ~/.zond/data
rm -rf ~/.zond/dilithium_keys

#0.1 Clone repo
git clone https://github.com/theqrl/zond ~/zond
cd ~/zond

#1. Build zond-cli and bootstrap files
go build ./cmd/zond-cli
# Now bootstrap files
./zond-cli dev genesis-bootstrap

#2. Copy the foundation dilithium address provided in step 1 and set the variable `binFoundationDilithiumAddress` in config/config.go  with the new foundation dilithium address value:
# Line #278 https://github.com/theZond/zond/blob/d0e8278421223b74320b6e64223fed55c0802802/config/config.go#L278
######
binFoundationDilithiumAddress, err := misc.HexStrToBytes("FOUNDATION_DILITHIUM_ADDRESS_FROM_STEP_#1")
######

#3. Create new devnet block directory
mkdir ~/zond/block/genesis/devnet

#4. Copy the bootstrap files `prestate.yml and genesis.yml` into the new directory from step #3
cp ~/zond/bootstrap/prestate.yml ~/zond/block/genesis/devnet/prestate.yml
cp ~/zond/bootstrap/genesis.yml ~/zond/block/genesis/devnet/genesis.yml

#5. Create the hidden `.zond` directory for the node files and copy in the dilithium keys generated during the bootstrap process.
mkdir ~/.zond
cp ~/zond/bootstrap/dilithium_keys ~/.zond

#6. Build the node using Golang and the configuration provided
cd ~/zond
go build ./cmd/gzond

#7. Start the node using the new `gzond` command
./gzond

```


### Update

To update the development node build picking up the latest changes run the following commands, ensure the node is stopped.

```bash
cd ~/zond
git pull && go build ./cmd/gzond && go build ./cmd/zond-cli && ./zond-cli --help && ./gzond
````

