---
docstatus: DRAFT  # one of {DRAFT, 30%, 90%, COMPLETE}
id: node-installation
title: Zond Node Installation
hide_title: false
hide_table_of_contents: false
sidebar_label: Zond Node - Installation
sidebar_position: 3
pagination_label: Zond Node - Installation
custom_edit_url: https://github.com/theqrl/documentation/edit/master/docs/basics/what-is-qrl.md
description: Zond Node Installation
keywords:
  - docs
  - Node node-installation
  - Install Zond
image: /assets/img/icons/yellow.png
slug: /node/node-installation
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


:::caution DOCUMENT STATUS 
<span>This document is in: <b>{frontMatter.docstatus}</b> status and needs additional input!</span>

- Need install instructions for MacOS
- Need install instruction for Windows
:::


Installation instructions for The QRL POS Project Zond node installation. This document covers getting started installing the Zond node software and will allow interaction with the Zond blockchain, as well as additional tools.

With the Zond node you can:

- Stake Zond on the network


### Requirements

- Golang 



## Current Zond Install Instructions

These are temporary installation instructions to get started with running a zond node.

:::danger
These instructions will change frequently as we develop the node software. Check back often as these will be kept up to date until the final solution is in place.
:::


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

:::info Minimum Node Hardware Requirements
There are some basic requirements that must be met to run a Zond node. See the [Zond Node Requirements](node-requirements) documentation for more info.
:::

Follow the directions below to get started running a Zond POS Node.

<Tabs
    defaultValue="ubuntu"
    groupId="os"
    values={[
        {label: 'Ubuntu', value: 'ubuntu'},
        {label: 'MacOS', value: 'macos'},
        {label: 'Windows', value: 'windows'},
    ]}>

<TabItem value="ubuntu">

## Zond Ubuntu Installation
Installation instructions for the Zond Node on Ubuntu.

Tested in the latest LTS version `Ubuntu 20.04`

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
```

:::tip 
This is the recommended installation method, and most common way to run a Zond Node.
:::

</TabItem>
<TabItem value="macos">

## Zond MacOS Installation
Installation instructions for the Zond Node on MacOS. Tested with the latest MacOS version `Big Sur 11.6`


```bash

```

> FIXME!! Need to update install instructions for MacOS

</TabItem>
<TabItem value="redhat">

## Zond Windows Installation
Installation instructions for the Zond Node on Windows.

```bash

```

> FIXME!! Need to update install instructions for Windows


</TabItem>
</Tabs>






## Running Zond

After successful installation of the Zond node the command line tools are available immediately. For more information see the [Zond Node CLI Documentation](node-cli).

The node software runs in the current shell, to run the node in the background, use something like `screen` to disconnect the shell from the running node allowing syncing to happen in the background.

See the [screen documentation](https://www.gnu.org/software/screen/manual/screen.html) for more information and installation instructions.

#### `gzond`

To begin the syncing process run the node software.

```sh
./gzond
```

Output looks something like this.

```
[2022-09-07 18:22:12]  INFO Current Block Slot Number 2918 Hash 0xce165cf88728259eb6cf533373cf8622190685437fb4cb7c1ad000d1f9e1c1a7
[2022-09-07 18:22:12]  INFO Main Chain Loaded Successfully
[2022-09-07 18:22:12]  INFO Listening at /ip4/0.0.0.0/tcp/15005/p2p/QmbtFJzvdMHS6sfBFnBQTLVg2rj6pj7wRjjwnSYfBzReBT
[2022-09-07 18:22:12]  INFO Running download monitor
[2022-09-07 18:22:22]  INFO Minting Block #2919
[2022-09-07 18:22:22]  INFO Added Block #2919 0xa6836b628c70a028b1b9b3d531b3edcc97bddde37bb9ff4a6343075bcc3529e3
[2022-09-07 18:22:22]  INFO Protocol Txs Count 2 | Txs Count 0
```

This will start the node software, create a default node directory at `~/.qrl` and begin syncing blocks from the known peers.


##### Stop The Node

Use `ctl+c` to stop the node in a linux terminal

```
[2022-09-07 18:22:23]  INFO Shutting Down POS
[2022-09-07 18:22:23]  INFO Shutting Down Node
```

