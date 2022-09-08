---
docstatus: DRAFT  # one of {DRAFT, 30%, 90%, COMPLETE}
id: node-api
title: Zond Node API
hide_title: false
hide_table_of_contents: false
sidebar_label: Zond Node - API
sidebar_position: 5
pagination_label: Zond Node - API
custom_edit_url: https://github.com/theqrl/documentation/edit/master/docs/basics/what-is-qrl.md
description: Zond Node API
keywords:
  - docs
  - node
  - advanced
image: /assets/img/icons/yellow.png
slug: /node/node-api
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


:::caution DOCUMENT STATUS 
<span>This document is in: <b>{frontMatter.docstatus}</b> status and needs additional input!</span>

THIS API IS UNDER HEAVY DEVELOPMENT!!

Things *WILL* change frequently and will likely break as we work through to the final product.

Please be patient!

---

Needed:

- Explainer for connecting and API info
- command examples and responses from each call

:::






In order for a software application to interact with the Zond blockchain - either by reading blockchain data or sending transactions to the network - it must connect to an Zond POS node.

[JSON-RPC](https://www.jsonrpc.org/specification) is a stateless, light-weight remote procedure call (RPC) protocol. It defines several data structures and the rules around their processing. It is transport agnostic in that the concepts can be used within the same process, over sockets, over HTTP, or in many various message passing environments. It uses JSON (RFC 4627) as data format.


:::info
The functionality of the API has been developed to match Ethereum API and should make integration to existing systems simple. 
:::



## Conventions {#conventions}

### Hex value encoding {#hex-encoding}

Two key data types get passed over JSON: *unformatted* byte arrays and *quantities*. Both are passed with a hex encoding but with different requirements for formatting.

#### Quantities {#quantities-encoding}

When encoding quantities (integers, numbers): encode as hex, prefix with "0x", the most compact representation (slight exception: zero should be represented as "0x0").

Here are some examples:

- 0x41 (65 in decimal)
- 0x400 (1024 in decimal)
- WRONG: 0x (should always have at least one digit - zero is "0x0")
- WRONG: 0x0400 (no leading zeroes allowed)
- WRONG: ff (must be prefixed 0x)

### Unformatted data {#unformatted-data-encoding}

When encoding unformatted data (byte arrays, account addresses, hashes, bytecode arrays): encode as hex, prefix with "0x", two hex digits per byte.

Here are some examples:

- 0x41 (size 1, "A")
- 0x004200 (size 3, "\0B\0")
- 0x (size 0, "")
- WRONG: 0xf0f0f (must be even number of digits)
- WRONG: 004200 (must be prefixed 0x)

### The default block parameter {#default-block}

The following methods have an extra default block parameter:

- [eth_getBalance](#eth_getbalance)
- [eth_getCode](#eth_getcode)
- [eth_getTransactionCount](#eth_gettransactioncount)
- [eth_getStorageAt](#eth_getstorageat)
- [eth_call](#eth_call)

When requests are made that act on the state of Ethereum, the last default block parameter determines the height of the block.

The following options are possible for the defaultBlock parameter:

- `HEX String` - an integer block number
- `String "earliest"` for the earliest/genesis block
- `String "latest"` - for the latest mined block
- `String "pending"` - for the pending state/transactions

## Examples

On this page we provide examples of how to use individual JSON_RPC API endpoints using the command line tool, [curl](https://curl.se). These individual endpoint examples are found below in the [Curl examples](#curl-examples) section. Further down the page, we also provide an [end-to-end example](#usage-example) for compiling and deploying a smart contract using a Geth node, the JSON_RPC API and curl.

## Curl examples {#curl-examples}

Examples of using the JSON_RPC API by making [curl](https://curl.se) requests to an Ethereum node are provided below. Each example
includes a description of the specific endpoint, its parameters, return type, and a worked example of how it should be used.

The curl requests might return an error message relating to the content type. This is because the `--data` option sets the content type to `application/x-www-form-urlencoded`. If your node does complain about this, manually set the header by placing `-H "Content-Type: application/json"` at the start of the call. The examples also do not include the URL/IP & port combination which must be the last argument given to curl (e.g. `127.0.0.1:8545`). A complete curl request including these additional data takes the following form:

```shell
curl -H "Content-Type: application/json" -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}' 127.0.0.1:8545
```

## Gossip, State, History {#gossip-state-history}

A handful of core JSON-RPC methods require data from the Ethereum network, and fall neatly into three main categories: _Gossip, State, and History_. Use the links in these sections to jump to each method, or use the table of contents to explore the whole list of methods.

### Gossip Methods {#gossip-methods}

> These methods track the head of the chain. This is how transactions make their way around the network, find their way into blocks, and how clients find out about new blocks.

- [eth_blockNumber](#eth_blocknumber)
- [eth_sendRawTransaction](#eth_sendrawtransaction)

### State Methods {#state_methods}

> Methods that report the current state of all the data stored. The "state" is like one big shared piece of RAM, and includes account balances, contract data, and gas estimations.

- [eth_getBalance](#eth_getbalance)
- [eth_getStorageAt](#eth_getstorageat)
- [eth_getTransactionCount](#eth_gettransactioncount)
- [eth_getCode](#eth_getcode)
- [eth_call](#eth_call)
- [eth_estimateGas](#eth_estimategas)

### History Methods {#history_methods}

> Fetches historical records of every block back to genesis. This is like one large append-only file, and includes all block headers, block bodies, uncle blocks, and transaction receipts.

- [eth_getBlockTransactionCountByHash](#eth_getblocktransactioncountbyhash)
- [eth_getBlockTransactionCountByNumber](#eth_getblocktransactioncountbynumber)
- [eth_getUncleCountByBlockHash](#eth_getunclecountbyblockhash)
- [eth_getUncleCountByBlockNumber](#eth_getunclecountbyblocknumber)
- [eth_getBlockByHash](#eth_getblockbyhash)
- [eth_getBlockByNumber](#eth_getblockbynumber)
- [eth_getTransactionByHash](#eth_gettransactionbyhash)
- [eth_getTransactionByBlockHashAndIndex](#eth_gettransactionbyblockhashandindex)
- [eth_getTransactionByBlockNumberAndIndex](#eth_gettransactionbyblocknumberandindex)
- [eth_getTransactionReceipt](#eth_gettransactionreceipt)
- [eth_getUncleByBlockHashAndIndex](#eth_getunclebyblockhashandindex)
- [eth_getUncleByBlockNumberAndIndex](#eth_getunclebyblocknumberandindex)






































## Connection Info

This API is available with the base Zond node software and by default runs on `127.0.0.1:4545` of the local computer it's installed on. 

To allow connections to the public port, you must modify [line #47 in zond/node/node.go](https://github.com/theQRL/zond/blob/d0e8278421223b74320b6e64223fed55c0802802/node/node.go#L47) that reads:

`HTTPHost: "127.0.0.1",`  to `HTTPHost: "0.0.0.0",`

Then recompile the node software and restart.

```bash
go build ./cmd/gzond

./gzond
```

:::info
See the [Node Installation Docs](/node/node-installation) for information on building the node.
:::


## Default Block Parameter

The following methods have an extra default block parameter:

- [zond_getBalance](#zond_getbalance)

When requests are made that act on the state of Zond, the last default block parameter determines the height of the block.

The following options are possible for the defaultBlock parameter:

- `HEX String` - an integer block number
- `String "earliest"` for the earliest/genesis block
- `String "latest"` - for the latest mined block
- `String "pending"` - for the pending state/transactions










zond_getHeaderByNumber
zond_getHeaderByHash
zond_getBlockByNumber
zond_getBlockByHash
zond_getCode
zond_getStorageAt
zond_call
zond_getBlockTransactionCountByNumber
zond_getBlockTransactionCountByHash
zond_getTransactionByBlockNumberAndIndex
zond_getTransactionByBlockHashAndIndex
zond_sendRawTransaction





## `zond_chainId`

Retrieves the chainId from the node. 

<Tabs
    defaultValue="usage"
    className="unique-tabs"
    groupId="zond_chainId"
    values={[
        {label: 'Usage', value: 'usage'},
        {label: 'code', value: 'code'},
    ]}>

<TabItem value="usage">

chainId identifies the current chain and is used for replay protection

:::note
Returns the chainId as a hex value ie: `0x1` indicating that the chainId is 1
:::

</TabItem>

<TabItem value="code" label="Code">

Example code below.

<Tabs
    defaultValue="shreq"
    className="unique-tabs"
    groupId="zond_chainId-code"
    values={[
        {label: 'Curl Request', value: 'shreq'},
        {label: 'JS Request', value: 'jsreq'},
        {label: 'Python Request', value: 'pyreq'},
        {label: 'Response', value: 'resp'},
        {label: 'Error', value: 'err'},
    ]}>
<TabItem value="shreq" label="Curl Request" default>

```bash
curl -H "Content-Type: application/json" -X POST --data '{"jsonrpc":"2.0","method":"zond_chainId","params":[],"id":"1"}' 127.0.0.1:4545
```
</TabItem>    
<TabItem value="jsreq" label="Request" default>

```js {} 
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function zond_chainId() {
  const { stdout, stderr } = await exec(`curl -s -H "Content-Type: application/json" -X POST --data '{"jsonrpc":"2.0","method":"zond_chainId","params":[],"id":"1"}' 127.0.0.1:4545`);
  if (stderr) {
    console.error(`error: ${stderr}`);
  }
  return stdout;
}

zond_chainId().then(function(id){
  console.log(JSON.parse(id))
})

```
</TabItem>
<TabItem value="pyreq" label="Python Request" default>

```py {}
import json
import requests

payload = {"jsonrpc":"2.0","method":"zond_chainId","params":[],"id":"1"}
chainId = requests.post("http://127.0.0.1:4545", headers={"Content-Type": "application/json"}, data=json.dumps(payload))

print(chainId.text)
```
</TabItem>
<TabItem value="resp" label="Response" default>

```json 
{"jsonrpc":"2.0","id":1,"result":"0x1"}
```
</TabItem>
<TabItem value="err" label="Error" default>

```json title="Too Many Arguments Given "
{"jsonrpc":"2.0","id":1,"error":{"code":-32602,"message":"too many arguments, want at most 0"}}
```
</TabItem>
</Tabs>

</TabItem>
</Tabs>
<br />

---

## `zond_blockNumber`

BlockNumber returns the block number of the chain head or latest block number.

<Tabs
    defaultValue="usage"
    className="unique-tabs"
    groupId="zond_blockNumber"
    values={[
        {label: 'Usage', value: 'usage'},
        {label: 'code', value: 'code'},
    ]}>

<TabItem value="usage">

Get the chains latest block height.

:::note
Results are returned in hex formatting ie: `0xf90` indication the chain is on block `3984`
:::

</TabItem>

<TabItem value="code" label="Code">

Example code below.

<Tabs
    defaultValue="shreq"
    className="unique-tabs"
    groupId="zond_blockNumber-code"
    values={[
        {label: 'Curl Request', value: 'shreq'},
        {label: 'JS Request', value: 'jsreq'},
        {label: 'Python Request', value: 'pyreq'},
        {label: 'Response', value: 'resp'},
        {label: 'Error', value: 'err'},
    ]}>
<TabItem value="shreq" label="Curl Request" default>

```bash
curl -H "Content-Type: application/json" -X POST --data '{"jsonrpc":"2.0","method":"zond_blockNumber","params":[],"id":"1"}' 127.0.0.1:4545
```
</TabItem>    
<TabItem value="jsreq" label="Request" default>

```js {} 
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function zond_blockNumber() {
  const { stdout, stderr } = await exec(`curl -s -H "Content-Type: application/json" -X POST --data '{"jsonrpc":"2.0","method":"zond_blockNumber","params":[],"id":"1"}' 127.0.0.1:4545`);
  if (stderr) {
    console.error(`error: ${stderr}`);
  }
  return stdout;
}

zond_blockNumber().then(function(block){
  console.log(JSON.parse(block))
})
```
</TabItem>
<TabItem value="pyreq" label="Python Request" default>

```py {}
import json
import requests

payload = {"jsonrpc":"2.0","method":"zond_blockNumber","params":[],"id":"1"}
blockNumber = requests.post("http://127.0.0.1:4545", headers={"Content-Type": "application/json"}, data=json.dumps(payload))

print(blockNumber.text)
```
</TabItem>
<TabItem value="resp" label="Response" default>

```json 
{"jsonrpc":"2.0","id":"1","result":"0xf95"}
```
</TabItem>
<TabItem value="err" label="Error" default>

```json title="Too Many Arguments Given"
{"jsonrpc":"2.0","id":"1","error":{"code":-32602,"message":"too many arguments, want at most 0"}}
```
</TabItem>
</Tabs>

</TabItem>
</Tabs>
<br />

---

## `zond_getBalance`

#### zond_getBalance Request


1. `DATA`, 20 Bytes - Zond address to check for balance.
2. `QUANTITY|TAG` - integer block number (hex), or the string `"latest"`, `"earliest"` or `"pending"`, see the [default block parameter](#default-block-parameter)



#### zond_getBalance Response

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| | |  |
|  |  |  |

#### zond_getBalance Response Data

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
|  |  |  |




<Tabs
    defaultValue="usage"
    className="unique-tabs"
    groupId="zond_getBalance"
    values={[
        {label: 'Usage', value: 'usage'},
        {label: 'code', value: 'code'},
    ]}>

<TabItem value="usage">

:::note

:::

</TabItem>

<TabItem value="code" label="Code">

Example code below.

<Tabs
    defaultValue="shreq"
    className="unique-tabs"
    groupId="zond_getBalance-code"
    values={[
        {label: 'Curl Request', value: 'shreq'},
        {label: 'JS Request', value: 'jsreq'},
        {label: 'Python Request', value: 'pyreq'},
        {label: 'Response', value: 'resp'},
        {label: 'Error', value: 'err'},
    ]}>
<TabItem value="shreq" label="Curl Request" default>

```bash
curl -H "Content-Type: application/json" -X POST --data '{"jsonrpc":"2.0","method":"zond_getBalance","params":["0x20748ad4e06597dbca756e2731cd26094c05273a", "latest"],"id":1}' 45.76.43.83:4545
```
</TabItem>    
<TabItem value="jsreq" label="Request" default>

```js {} 
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function zond_getBalance() {
  const { stdout, stderr } = await exec(`curl -s -H "Content-Type: application/json" -X POST --data '{"jsonrpc":"2.0","method":"zond_getBalance","params":["0x20748ad4e06597dbca756e2731cd26094c05273a", "latest"],"id":"1"}' 127.0.0.1:4545`);
  if (stderr) {
    console.error(`error: ${stderr}`);
  }
  return stdout;
}

zond_getBalance().then(function(balance){
  console.log(JSON.parse(balance))
})
```
</TabItem>
<TabItem value="pyreq" label="Python Request" default>

```py {}
import json
import requests

payload = {"jsonrpc":"2.0","method":"zond_getBalance","params":["0x20748ad4e06597dbca756e2731cd26094c05273a", "latest"],"id":"1"}
balance = requests.post("http://127.0.0.1:4545", headers={"Content-Type": "application/json"}, data=json.dumps(payload))

print(balance.text)
```
</TabItem>
<TabItem value="resp" label="Response" default>

```json 
{"jsonrpc":"2.0","id":1,"result":"0x0"}
```
</TabItem>
<TabItem value="err" label="Error" default>

```json title="No Address Given"
{"jsonrpc":"2.0","id":1,"error":{"code":-32602,"message":"invalid argument 0: hex string has length 0, want 40 for common.Address"}}
```

```json title="Address Missing 0x Prefix"
{"jsonrpc":"2.0","id":1,"error":{"code":-32602,"message":"invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go value of type common.Address"}}
```

```json title="Address Invalid"
{"jsonrpc":"2.0","id":1,"error":{"code":-32602,"message":"invalid argument 0: json: cannot unmarshal invalid hex string into Go value of type common.Address"}}
```





</TabItem>
</Tabs>

#### Required Data 

| Parameter | Example | Notes |
| :---: | :---: | :---: | 
| `address` | 0x20748ad4e06597dbca756e2731cd26094c05273a | 0x prefixed zond address, either XMSS or Dilithium |


</TabItem>
</Tabs>
<br />

---

















######################################################################################

---

## template

Check if a QRL address is valid. Returns `{"valid": "True"}` if the QRL Address is valid. 

#### A Request

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
|  |  |  |

#### A Response

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
| | |  |
|  |  |  |

#### A Response Data

| **Parameter** | **Type** | **Description** |
| --- | --- | --- |
|  |  |  |



<Tabs
    defaultValue="usage"
    className="unique-tabs"
    groupId="A"
    values={[
        {label: 'Usage', value: 'usage'},
        {label: 'code', value: 'code'},
    ]}>

<TabItem value="usage">

:::note

:::

</TabItem>

<TabItem value="code" label="Code">

Example code below.

<Tabs
    defaultValue="shreq"
    className="unique-tabs"
    groupId="A-code"
    values={[
        {label: 'Curl Request', value: 'shreq'},
        {label: 'JS Request', value: 'jsreq'},
        {label: 'Python Request', value: 'pyreq'},
        {label: 'Response', value: 'resp'},
        {label: 'Error', value: 'err'},
    ]}>
<TabItem value="shreq" label="Curl Request" default>

```bash

```
</TabItem>    
<TabItem value="jsreq" label="Request" default>

```js {} 

```
</TabItem>
<TabItem value="pyreq" label="Python Request" default>

```py {}

```
</TabItem>
<TabItem value="resp" label="Response" default>

```json 

```
</TabItem>
<TabItem value="err" label="Error" default>

```json title=""

```
</TabItem>
</Tabs>

#### Required Data 

| Configuration | Default | Notes |
| :---: | :---: | :---: | 
| `A` |  |  |


</TabItem>
</Tabs>
<br />

---