---
docstatus: DRAFT  # one of {DRAFT, 30%, 90%, COMPLETE}
id: node-api
title: Zond Node API
hide_title: false
hide_table_of_contents: false
sidebar_label: Zond Node - API
sidebar_position: 6
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

Things *WILL* change frequently and will likely break as we work through to the final product.Please be patient!

---
Needed:
- Explainer for connecting and API info
- command examples and responses from each call

FIXME:
- When user config is supported change the API public port configuration data in [Connection Info](#connection-info)
- zond_getCode - Need to update with working example that returns code
- zond_call - Need to update with good response from call
- zond_getLogs - Need to update with good response from call
- Define data in list for zond_getHeaderByNumber #usage section
:::


In order for a software application to interact with the Zond blockchain - either by reading blockchain data or sending transactions to the network - it must connect to an Zond POS node.

[JSON-RPC](https://www.jsonrpc.org/specification) is a stateless, light-weight remote procedure call (RPC) protocol. It defines several data structures and the rules around their processing. It is transport agnostic in that the concepts can be used within the same process, over sockets, over HTTP, or in many various message passing environments. It uses JSON (RFC 4627) as data format.


:::info
The functionality of the API has been developed to match Zond API and should make integration to existing systems simple. 
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

- [zond_getBalance](#zond_getbalance)
- [zond_getCode](#zond_getcode)
- [zond_getStorageAt](#zond_getstorageat)
- [zond_call](#zond_call)

When requests are made that act on the state of Zond, the last default block parameter determines the height of the block.

The following options are possible for the defaultBlock parameter:

- `HEX String` - an integer block number
- `String "earliest"` for the earliest/genesis block
- `String "latest"` - for the latest mined block
- `String "pending"` - for the pending state/transactions

## Examples

On this page we provide examples of how to use individual JSON_RPC API endpoints using the command line tool, [curl](https://curl.se). These individual endpoint examples are found below in the [Curl examples](#curl-examples) section.

## Curl examples {#curl-examples}

Examples of using the JSON_RPC API by making [curl](https://curl.se) requests to an Zond node are provided below. Each example
includes a description of the specific endpoint, its parameters, return type, and a worked example of how it should be used.

The curl requests might return an error message relating to the content type. This is because the `--data` option sets the content type to `application/x-www-form-urlencoded`. If your node does complain about this, manually set the header by placing `-H "Content-Type: application/json"` at the start of the call. The examples also do not include the URL/IP & port combination which must be the last argument given to curl (e.g. `127.0.0.1:8545`). A complete curl request including these additional data takes the following form:

```shell
curl -H "Content-Type: application/json" -X POST --data '{"jsonrpc":"2.0","method":"zond_chainId","params":[],"id":67}' 127.0.0.1:8545
```

## Gossip, State, History {#gossip-state-history}

A handful of core JSON-RPC methods require data from the Zond network, and fall neatly into three main categories: _Gossip, State, and History_. Use the links in these sections to jump to each method, or use the table of contents to explore the whole list of methods.

### Gossip Methods {#gossip-methods}

> These methods track the head of the chain. This is how transactions make their way around the network, find their way into blocks, and how clients find out about new blocks.

- [zond_blockNumber](#zond_blocknumber)
- [zond_sendRawTransaction](#zond_sendrawtransaction)

### State Methods {#state_methods}

> Methods that report the current state of all the data stored. The "state" is like one big shared piece of RAM, and includes account balances, contract data, and gas estimations.

- [zond_getBalance](#zond_getbalance)
- [zond_getStorageAt](#zond_getstorageat)
- [zond_getCode](#zond_getcode)
- [zond_call](#zond_call)

### History Methods {#history_methods}

> Fetches historical records of every block back to genesis. This is like one large append-only file, and includes all block headers, block bodies, uncle blocks, and transaction receipts.

- [zond_getBlockTransactionCountByHash](#zond_getblocktransactioncountbyhash)
- [zond_getBlockTransactionCountByNumber](#zond_getblocktransactioncountbynumber)
- [zond_getBlockByHash](#zond_getblockbyhash)
- [zond_getBlockByNumber](#zond_getblockbynumber)
- [zond_getTransactionByBlockHashAndIndex](#zond_gettransactionbyblockhashandindex)
- [zond_getTransactionByBlockNumberAndIndex](#zond_gettransactionbyblocknumberandindex)


## Connection Info

This API is available with the base Zond node software and by default runs on `127.0.0.1:4545` of the local computer it's installed on. 

:::caution
Setting this API host configuration will change as development progresses. This will move into a user configuration file eventually.
:::


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

## JSON-RPC API METHODS

### `zond_chainId`

`zond_chainId` returns the current chainId from the connected node and is used for replay protection between Zond chains, such as Mainnet and testnet. 

ChainId is hashed into each transaction, differentiating chains at the signature level. 

#### Zond Chain ID's

These are the chainId's currently implemented:

| ChainId | HEX | Chain | Notes | 
|---------|-----|-------|-------|
| 0 | 0x0 | | |
| 1 | 0x1 | Mainnet | Default `chainId` used for mainnet |

<Tabs
    defaultValue="code"
    className="unique-tabs"
    groupId="zond_chainId"
    values={[
        {label: 'Code', value: 'code'},
        {label: 'Usage', value: 'usage'},
    ]}>

<TabItem value="usage">

#### Method

*POST*

#### Parameters

*None*

#### Returns

| Return Value | Type | Description | 
|---------|-----|-------|
| chainId | INT |  Hex integer value of the connected network chainId |

</TabItem>

<TabItem value="code" label="Code">

Retrieves the chainId from the connected node. 

<Tabs
    defaultValue="shreq"
    className="unique-tabs"
    groupId="zond_chainId-code"
    values={[
        {label: 'Curl Request', value: 'shreq'},
        {label: 'JS Request', value: 'jsreq'},
        {label: 'Python Request', value: 'pyreq'},
    ]}>
<TabItem value="shreq" label="Curl Request" default>

```bash
curl --location --request POST 'http://45.76.43.83:4545' \
--header 'Content-Type: application/json' \
--data-raw '{"jsonrpc":"2.0","method":"zond_chainId","params":[],"id":"1"}'

```

</TabItem>    
<TabItem value="jsreq" label="Request" default>

```js {} 
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'http://45.76.43.83:4545',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "jsonrpc": "2.0",
    "method": "zond_chainId",
    "params": [],
    "id": "1"
  })

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});

```
</TabItem>
<TabItem value="pyreq" label="Python Request" default>

```py {}
import requests
import json

url = "45.76.43.83:4545"

payload = json.dumps({
  "jsonrpc": "2.0",
  "method": "zond_chainId",
  "params": [],
  "id": "1"
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

```
</TabItem>

</Tabs>

<Tabs
    defaultValue="resp"
    className="unique-tabs"
    groupId="zond_chainId-resp"
    values={[
        {label: 'Response', value: 'resp'},
        {label: 'Error', value: 'err'},
    ]}>
<TabItem value="resp" label="Response" default>

```json 
{
    "jsonrpc": "2.0",
    "id": "1",
    "result": "0x1"
}
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



### `zond_blockNumber`

`zond_blockNumber` returns the block number of the latest block number (*chain head*) from the peer node connected.

<Tabs
    defaultValue="code"
    className="unique-tabs"
    groupId="zond_blockNumber"
    values={[
        {label: 'Code', value: 'code'},
        {label: 'Usage', value: 'usage'},
    ]}>

<TabItem value="usage">

#### Method

*POST*

#### Parameters

*None*

#### Returns

| Return Value | Type |  Description | 
|---------|-----|-------|
| QUANTITY | INT  | Hex integer value of the current block the node has synced (*chain head*) |

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
    ]}>
<TabItem value="shreq" label="Curl Request" default>

```bash
curl --location --request POST 'http://45.76.43.83:4545' \
--header 'Content-Type: application/json' \
--data-raw '{"jsonrpc":"2.0","method":"zond_blockNumber","params":[],"id":"1"}'
```

</TabItem>    
<TabItem value="jsreq" label="Request" default>

```js {} 
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'http://45.76.43.83:4545',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "jsonrpc": "2.0",
    "method": "zond_blockNumber",
    "params": [],
    "id": "1"
  })

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});

```
</TabItem>
<TabItem value="pyreq" label="Python Request" default>

```py {}
import requests
import json

url = "http://45.76.43.83:4545"

payload = json.dumps({
  "jsonrpc": "2.0",
  "method": "zond_blockNumber",
  "params": [],
  "id": "1"
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

```
</TabItem>
</Tabs>

<Tabs
    defaultValue="resp"
    className="unique-tabs"
    groupId="zond_blockNumber-resp"
    values={[
        {label: 'Response', value: 'resp'},
        {label: 'Error', value: 'err'},
    ]}>
<TabItem value="resp" label="Response" default>

```json 
{
    "jsonrpc": "2.0",
    "id": "1",
    "result": "0x109b"
}
```

:::note
All results are returned in hex formatting ie: `0xf90` indication the chain is on block `3984`
:::

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


### `zond_getBalance`

Returns the balance contained in the wallet for the given block, or one of: *latest*, *earliest*, *pending*. 

- *latest* - Returns the latest address value known to the chain
- *earliest* - Returns the first know balance from the address
- *pending* - Returns balance pending any current transactions

> See the [default block parameters](#default-block-parameter) section for more info

<Tabs
    defaultValue="code"
    className="unique-tabs"
    groupId="zond_getBalance"
    values={[
        {label: 'Code', value: 'code'},
        {label: 'Usage', value: 'usage'},
    ]}>

<TabItem value="usage">

#### Method

*POST*

#### Parameters

| Field | Type | Required |  Description | 
|---------|-----|-----|-------|
| address | DATA | true  | Zond address to check for balance |
| blockNrOrHash | QUANTITY\TAG | true | integer block number (hex), or the string `"latest"`, `"earliest"` or `"pending"`, see the [default block parameter](#default-block-parameter) | 

#### Returns

| Return Value | Type |  Description | 
|---------|-----|-------|
| Balance | INT (hex) | Balance returned as Hex integer for the address given |  

</TabItem>

<TabItem value="code" label="Code">

Required parameters: `address` (*hex*), `blockNrOrHash` (*rpc.BlockNumberOrHash*)

<Tabs
    defaultValue="shreq"
    className="unique-tabs"
    groupId="zond_getBalance-code"
    values={[
        {label: 'Curl Request', value: 'shreq'},
        {label: 'JS Request', value: 'jsreq'},
        {label: 'Python Request', value: 'pyreq'},
    ]}>
<TabItem value="shreq" label="Curl Request" default>

```bash
curl --location --request POST 'http://45.76.43.83:4545' \
--header 'Content-Type: application/json' \
--data-raw '{"jsonrpc":"2.0","method":"zond_getBalance","params":["0x200117c87b91da26b8c1aa823cad3b6ad30f7e8d", "latest"],"id":1}'
```
</TabItem>    
<TabItem value="jsreq" label="Request" default>

```js {} 
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'http://45.76.43.83:4545',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "jsonrpc": "2.0",
    "method": "zond_getBalance",
    "params": [
      "0x200117c87b91da26b8c1aa823cad3b6ad30f7e8d",
      "latest"
    ],
    "id": 1
  })

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});

```
</TabItem>
<TabItem value="pyreq" label="Python Request" default>

```py {}
import requests
import json

url = "http://45.76.43.83:4545"

payload = json.dumps({
  "jsonrpc": "2.0",
  "method": "zond_getBalance",
  "params": [
    "0x200117c87b91da26b8c1aa823cad3b6ad30f7e8d",
    "latest"
  ],
  "id": 1
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

```
</TabItem>
</Tabs>

<Tabs
    defaultValue="resp"
    className="unique-tabs"
    groupId="zond_getBalance-resp"
    values={[
        {label: 'Response', value: 'resp'},
        {label: 'Error', value: 'err'},
    ]}>
<TabItem value="resp" label="Response" default>

```json 
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": "0x38d7ea4c68000"
}
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

:::note
Balance result returned as a HEX value with the `0x` prefix included.
:::

</TabItem>
</Tabs>
<br />



### `zond_getHeaderByNumber`

`zond_getHeaderByNumber` returns the requested canonical block header.

- When blockNr is -1 the chain head is returned.
- When blockNr is -2 the pending chain head is returned.



<Tabs
    defaultValue="code"
    className="unique-tabs"
    groupId="zond_getHeaderByNumber"
    values={[
        {label: 'Code', value: 'code'},
        {label: 'Usage', value: 'usage'},
    ]}>

<TabItem value="usage">

#### Method

*POST*

#### Parameters

| Field | Type | Required |  Description | 
|---------|-----|-----|-------|
| BlockNumber | INT (hex) | true | BlockNumber to return block header data |

#### Returns

| Return Value | Type |  Description | 
|---------|-----|-------|
| Object | INT (hex) | Block header Data object, or null when no block was found |  

##### Return Object Definition

- **baseFeePerGas -** * *
- **gasLimit -** *Block Gas Limit *
- **gasUsed -** *Total Gas used in block *
- **hash -** *Block hash *
- **number -** *Block Number *
- **parentHash -** *Parent block header hash *
- **receiptsRoot -** * *
- **stateRoot -** * *
- **timestamp -** *Block timestamp *
- **transactionsRoot -** * *

</TabItem>

<TabItem value="code" label="Code">

Required parameters: `BlockNumber` (*hex*, *integer*)

<Tabs
    defaultValue="shreq"
    className="unique-tabs"
    groupId="zond_getHeaderByNumber-code"
    values={[
        {label: 'Curl Request', value: 'shreq'},
        {label: 'JS Request', value: 'jsreq'},
        {label: 'Python Request', value: 'pyreq'},
    ]}>
<TabItem value="shreq" label="Curl Request" default>

```bash
curl --location --request POST 'http://45.76.43.83:4545' \
--header 'Content-Type: application/json' \
--data-raw '{"jsonrpc":"2.0","method":"zond_getHeaderByNumber","params":["0x0"],"id":"1"}'
```
</TabItem>    
<TabItem value="jsreq" label="Request" default>

```js {} 
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'http://45.76.43.83:4545',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "jsonrpc": "2.0",
    "method": "zond_getHeaderByNumber",
    "params": [
      "0x0"
    ],
    "id": "1"
  })

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});

```
</TabItem>
<TabItem value="pyreq" label="Python Request" default>

```py {}
import requests
import json

url = "http://45.76.43.83:4545"

payload = json.dumps({
  "jsonrpc": "2.0",
  "method": "zond_getHeaderByNumber",
  "params": [
    "0x0"
  ],
  "id": "1"
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

```
</TabItem>
</Tabs>

<Tabs
    defaultValue="resp"
    className="unique-tabs"
    groupId="zond_getHeaderByNumber-resp"
    values={[
        {label: 'Response', value: 'resp'},
        {label: 'Error', value: 'err'},
    ]}>
<TabItem value="resp" label="Response" default>

```json 
{
    "jsonrpc": "2.0",
    "id": "1",
    "result": {
        "baseFeePerGas": "0x0",
        "gasLimit": "0x5f5e100",
        "gasUsed": "0x0",
        "hash": "0xdf035d2e1b1b2133339612e747af7a5b1a1cb91d802b13c0636d7624c23158cb",
        "number": "0x0",
        "parentHash": "0x4f75747369646520436f6e746578742050726f626c656d000000000000000000",
        "receiptsRoot": "0x",
        "stateRoot": "0x",
        "timestamp": "0x631659e9",
        "transactionsRoot": "0x"
    }
}
```
</TabItem>
<TabItem value="err" label="Error" default>

```json title="No Header Number Given"
{"jsonrpc":"2.0","id":"1","error":{"code":-32602,"message":"missing value for required argument 0"}}
```
</TabItem>
</Tabs>
</TabItem>
</Tabs>
<br />


### `zond_getHeaderByHash`

GetHeaderByHash returns the requested header by hash.


<Tabs
    defaultValue="code"
    className="unique-tabs"
    groupId="zond_getHeaderByHash"
    values={[
        {label: 'Code', value: 'code'},
        {label: 'Usage', value: 'usage'},
    ]}>

<TabItem value="usage">

#### Method

*POST*

#### Parameters

| Field | Type | Required |  Description | 
|---------|-----|-----|-------|
| BlockHash | DATA (hex) | true | 32 Byte hash of block to return block header data from |

#### Returns

| Return Value | Type |  Description | 
|---------|-----|-------|
| Object | INT (hex) | Block header Data object, or null when no block was found |  

##### Return Object Definition

- **baseFeePerGas -** * *
- **gasLimit -** *Block Gas Limit *
- **gasUsed -** *Total Gas used in block *
- **hash -** *Block hash *
- **number -** *Block Number *
- **parentHash -** *Parent block header hash *
- **receiptsRoot -** * *
- **stateRoot -** * *
- **timestamp -** *Block timestamp *
- **transactionsRoot -** * *

</TabItem>

<TabItem value="code" label="Code">

Required parameters: `BlockHash` (*hex*, *32 bytes*)

<Tabs
    defaultValue="shreq"
    className="unique-tabs"
    groupId="zond_getHeaderByHash-code"
    values={[
        {label: 'Curl Request', value: 'shreq'},
        {label: 'JS Request', value: 'jsreq'},
        {label: 'Python Request', value: 'pyreq'},
    ]}>
<TabItem value="shreq" label="Curl Request" default>

```bash
curl --location --request POST 'http://45.76.43.83:4545' \
--header 'Content-Type: application/json' \
--data-raw '{"jsonrpc":"2.0","method":"zond_getHeaderByHash","params":["0xabd949f67f478d458d22e5c2722c4bf0e8d11a2eb5b51126d9d473410b9df581"],"id":"1"}'
```
</TabItem>    
<TabItem value="jsreq" label="Request" default>

```js {} 
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'http://45.76.43.83:4545',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "jsonrpc": "2.0",
    "method": "zond_getHeaderByHash",
    "params": [
      "0xabd949f67f478d458d22e5c2722c4bf0e8d11a2eb5b51126d9d473410b9df581"
    ],
    "id": "1"
  })

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});

```
</TabItem>
<TabItem value="pyreq" label="Python Request" default>

```py {}
import requests
import json

url = "http://45.76.43.83:4545"

payload = json.dumps({
  "jsonrpc": "2.0",
  "method": "zond_getHeaderByHash",
  "params": [
    "0xabd949f67f478d458d22e5c2722c4bf0e8d11a2eb5b51126d9d473410b9df581"
  ],
  "id": "1"
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

```
</TabItem>
</Tabs>


<Tabs
    defaultValue="resp"
    className="unique-tabs"
    groupId="zond_getHeaderByHash-resp"
    values={[
        {label: 'Response', value: 'resp'},
        {label: 'Error', value: 'err'},
    ]}>
<TabItem value="resp" label="Response" default>

```json 
{
    "jsonrpc": "2.0",
    "id": "1",
    "result": {
        "baseFeePerGas": "0x0",
        "gasLimit": "0x5f5e100",
        "gasUsed": "0x0",
        "hash": "0xabd949f67f478d458d22e5c2722c4bf0e8d11a2eb5b51126d9d473410b9df581",
        "number": "0x3",
        "parentHash": "0xdf035d2e1b1b2133339612e747af7a5b1a1cb91d802b13c0636d7624c23158cb",
        "receiptsRoot": "0x",
        "stateRoot": "0x",
        "timestamp": "0x63165aa2",
        "transactionsRoot": "0x"
    }
}
```
</TabItem>
<TabItem value="err" label="Error" default>


</TabItem>
</Tabs>

</TabItem>
</Tabs>
<br />

### `zond_getBlockByNumber`

GetBlockByNumber returns the requested canonical block.

- When `blockNr` is -1 the chain head is returned.
- When `blockNr` is -2 the pending chain head is returned.
- When `fullTx` is true all transactions in the block are returned, otherwise only the transaction hash is returned.

<Tabs
    defaultValue="code"
    className="unique-tabs"
    groupId="zond_getBlockByNumber"
    values={[
        {label: 'Code', value: 'code'},
        {label: 'Usage', value: 'usage'},
    ]}>

<TabItem value="usage">

#### Method

*POST*

#### Parameters

| Field | Type | Required |  Description | 
|---------|-----|-----|-------|
| number | QUANTITY|TAG | true | integer (hex) of a block number, or the string "earliest", "latest" or "pending", as in the [default block parameter](#default-block-parameter). |
| fullTx | Boolean | true | If true it returns the full transaction objects, if false only the hashes of the transactions. |

#### Returns

| Return Value | Type |  Description | 
|---------|-----|-------|
| Object | INT (hex) | A block object, or null when no block was found |  

##### Return Object Definition


- **baseFeePerGas** - 
- **gasLimit** - QUANTITY - the maximum gas allowed in this block.
- **gasUsed** - QUANTITY - the total used gas by all transactions in this block.
- **hash** - DATA, 32 Bytes - hash of the block. null when its pending block
- **number** - QUANTITY - the block number. null when its pending block.
- **parentHash** -  DATA, 32 Bytes - hash of the parent block.
- **receiptsRoot** - DATA, 32 Bytes - the root of the receipts trie of the block.
- **stateRoot** - DATA, 32 Bytes - the root of the final state trie of the block.
- **timestamp** - QUANTITY - the unix timestamp for when the block was collated.
- **protocolTransactions** - Array - Array of transaction objects, or 32 Bytes transaction hash
- **transactionsRoot** - DATA, 32 Bytes - the root of the transaction trie of the block.


</TabItem>

<TabItem value="code" label="Code">

Required parameters: `number` (*hex*, *integer*), `fullTx` (*boolean*)

<Tabs
    defaultValue="shreq"
    className="unique-tabs"
    groupId="zond_getBlockByNumber-code"
    values={[
        {label: 'Curl Request', value: 'shreq'},
        {label: 'JS Request', value: 'jsreq'},
        {label: 'Python Request', value: 'pyreq'},
    ]}>
<TabItem value="shreq" label="Curl Request" default>

```bash
curl --location --request POST 'http://45.76.43.83:4545' \
--header 'Content-Type: application/json' \
--data-raw '{"jsonrpc":"2.0","method":"zond_getBlockByNumber","params":["0x3", true],"id":1}'
```
</TabItem>    
<TabItem value="jsreq" label="Request" default>

```js {} 
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'http://45.76.43.83:4545',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "jsonrpc": "2.0",
    "method": "zond_getBlockByNumber",
    "params": [
      "0x3",
      true
    ],
    "id": 1
  })

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});

```
</TabItem>
<TabItem value="pyreq" label="Python Request" default>

```py {}
import requests
import json

url = "http://45.76.43.83:4545"

payload = json.dumps({
  "jsonrpc": "2.0",
  "method": "zond_getBlockByNumber",
  "params": [
    "0x3",
    True
  ],
  "id": 1
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

```
</TabItem>
</Tabs>
<Tabs
    defaultValue="resp"
    className="unique-tabs"
    groupId="zond_getBlockByNumber-resp"
    values={[
        {label: 'Response', value: 'resp'},
        {label: 'Error', value: 'err'},
    ]}>
<TabItem value="resp" label="Response" default>

With `fullTx` set to `false` returning only transaction hashes from the block:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "baseFeePerGas": "0x0",
    "gasLimit": "0x5f5e100",
    "gasUsed": "0x0",
    "hash": "0xb136341669d7b375c0d2d7f544ec48392911a6e8e6972b880f6b741bb5ee0cc5",
    "number": "0x3",
    "parentHash": "0xaa2577455bbe6ebb9f7a00646af3b3d5b385c596ce75f7af162ce5711f82afbb",
    "protocolTransactions": [
      "Ih0kq54vF827mpatAvWlbwhG8ickIbHt7ZLi0wVTV9w=",
      "25pO27YDqLEstfnfVx8yA1nBvatQ2Z6A675WPYXqeEs="
    ],
    "receiptsRoot": "0x",
    "stateRoot": "0x435f20116252cfaaf9def5a075eb9f76332199ada66995a709f0dacc15ff08e9",
    "timestamp": "0x63213466",
    "transactions": [],
    "transactionsRoot": "0x"
  }
}
```

With `fullTx` set to `true` returning all transaction data from the block:

```json 
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "baseFeePerGas": "0x0",
        "gasLimit": "0x5f5e100",
        "gasUsed": "0x0",
        "hash": "0xabd949f67f478d458d22e5c2722c4bf0e8d11a2eb5b51126d9d473410b9df581",
        "number": "0x3",
        "parentHash": "0xdf035d2e1b1b2133339612e747af7a5b1a1cb91d802b13c0636d7624c23158cb",
        "protocolTransactions": [
            {
                "blockHash": "0xabd949f67f478d458d22e5c2722c4bf0e8d11a2eb5b51126d9d473410b9df581",
                "blockNumber": "0x3",
                "from": "0x2034ffee0f25410910d57b36121edfe272fb1796",
                "hash": "0xfec6288fca392b53234fa45a1710251bbf843bffbdb8ad5c08806163bb2eefa6",
                "nonce": "0x1",
                "transactionIndex": "0x0",
                "blockProposerReward": "0x12a05f200",
                "attestorReward": "0x77359400",
                "feeReward": "0x0",
                "type": "0x0",
                "chainId": "0x0",
                "signature": "0xe810effad4f7d616dfe27432f5a9c4980635a5e9a3ddee9cd6f09eb961527d362f454ff8d2157217f3102dc12dc815437034a0371e5423a312c36a09d73952fb45f6bda28343feac00427ecbc5fcc88c3fcd15309c19acaec6c4bc43361e057866f16d68194da35f882c8d23605c4aa262edad403001be990b6692c1120f932e5e63a2805621fb0d57ea6dbd8e6c744c4c4ecb8c9845f55362cf7758388dcbdd434c1af2bd708a02d9af63afd9135d6c6685f15182f6b8f4a155f0a61805057b7c2b2af3dfa0006e39f3235ebe013c8eeb9b16b9a109e57945fed5b2e7f0bfa7bec32528231c7ee04af3dd2625588314ccd55c3427f8cfb18f15864e3360e1f8dc85b04b28b57d7d2bc181f282b7ce67266f3f7bc4c7a82a80a6b6d05e0f9504b5102e69b5be274350f2e26c6b72b739b9ae5c83fe35c3add22d1751cd16b7a3fcc7b249065c311119c6b861b601c7a12635241198ee2294f7997ae7bc423a88b2e8c5514981a06ee10ccfdfc7a07472f98c37745e1e87df46fa741cb05343283a7627ad57514d3199fa792b4a390c48102f6357e1acefb11bfff2fd00d55181c0c7d5e502b21fe62af62ef63076da8f0ede888af1908a1604eccd81cb99cdf0f71f5a29b16263ed409672ff070a30ac075df0dc350534b720c85c332726b5f718e1a9af4093cec152e2926311fe724de333efa0707b40d67d07e3070f3998c418085d5de5f4d88115a45dd1e20463b28d061365394440a5fda852ce59482b58b2f92a89fa80420fba7deaf555157c49b2384ba58a583a258c70dafa24e9c78987ca6b76c8b8ab10f9af8032e8266b7e73edf1fe84efd5b487811840a6654fe96cc039ab5f24f8353f91e881acced19cc0462c3e69ba5dd0cb34dc29c56cdcd756092d13a213351523377b619ab76f45fba16d37b421484f389c8d94a96e25d3da24f1c537dbbcb4356bc43acd0a5c395c8debce73e3dc1e01e89139e5c55caae89f185c9e33eefec3b1805c5071e9227525358835ca3c3adc6d99ed5b5a1e406b8e9b3e70b04b506a1ae0db650e205aef7d2048012eaab3b2a560b9012d70fc8fb636aa739716d22c20637f46fb76a6278d3a1e74ba953a7ee020b7bf6168395ab9c6fccf8bc3b987616eeb6885b345b6a539f8aea7fea71b868e20165cf686865e1428b3d24328ecdff8c8aafb241c6ccc422e136ec3c90832626758b51c8e6edf7ffc313763b68a2861733aaf6fb36aa4276fccb012fb910f3485f0aea96be0087d21bc3fb91e8ca3e4c7fda0d52e4540b5addb127be7a3b687e07176f375871e47a0f41cf8b83ed17fd36e815e8116eb9a1c9d6026394cb01cf5c363cc1f5473e52fe52ca7972cb4fe0f32b555bb6c5c699f39dedea8ed5b8216112ab6946c854eac539463addf366f30a6e582286c9eb601382a6d474854ba36aeb928c38eb8e9a59c9d4f72a6a95f3c2547038d505934d4cf69c0312daa64f53dd73f0710a8a6eaa6154f9c8a5a05cead9f415169ea2b4e62c2fd311adb522eac0201e24e7ddcec14fa8342b18a171470edba80a67b5273ddebcb48f48bfe563952090574d6169babb1f4db239701587f69264ced538ab41dd89faa5e99188d4b724d903be3965b90a89195e566f11d5104deeeb4503d2ba14974777f70d38d3db1eb9cf50702502dc3fb3df270fe157e22b5fa6797889e9f9facc39a4d7c9f7437482574f205082bb04f11dd8497b76aa11f90bca0e7c82ef45f4434ad52a49f894e1376867344153afa616956f614843d66921a2b5a9129aa802550a3e1e325324a21a0d893cf924ded9a28addea32eb2fd435e752581ba99a35f1709757313cc07e72f279dfc6f024ba6ffb97b16f2874cf228542b673d5fcda91b914580eaafb5956a066916a96c5c63029f362cbc5d4090b4c30789ac3e315c5ab23da0cbb77e71b8aee8d4404912b4540067addf0e472f728a922be7fc3cc6c4cdf573b9929d526a2537afee8622be9417593a5f73df97749f2b835bd1596fbc6c5044dae1bc96575bf1051cecd99b574135546d4c9d8e1d9c5183050b018ad59adc0b163b08909e3d81aa81bdcfbd54be3847bf66c5094fbb9fe0038faab74acab1508a2d38af2642713f6e65b81f3a7e1a6054cb3edfa9eefc3c31d075c4297158d104f4437fd5673537ef740b59ff5cf84fd42a4e40e34aa8a4fa37d929bf598f47e533224bcccd075485b420c8d578adcd63f0955edf142253a75159d75de3131578263cf3c880197b92dc654c60bd0a3564f76e4c5f8f61f02330ee973a76fcdbfeb7fbb2611cb1e88104d74b1634c6792dbc0da0e9035f592539809f51261f3e3f07e0deae25812f41af3cdf0ebb3831197b7f7a1c46f05df837ac7ded46e0a6cbd0b962901c73857f6f859dc8ef1daba5a0f6f7825673c3ca0aead095a7543ce6277cbb8d41c02422a5ad540f634dc884d8e4f30fa30aabc4274e36f1df86a67087965a2b10fe2cb0f73358ac1dc3a9515137f3057fd96dbe407af1b3671a6b16958f6a4d77409c81e00627b284932aa7729602a0d1f77640435eb08573ba025e360aede2f0c7d66940b9724bfce08f08a5d9e6076b80a69703f2c302728efbb7bb4684183c9519fd481f63260d8a4fe1d88ef633907a0c47a3bbc645cb58ad8a2ee24866bb691ba16f55a85bec2b743ccd89b8d5b0c3fdc13d8370c89633d48411c390a6b1e5ba3d47c075850f932cb2654c2686c3f2a23c8c1ba4cde2db06f8790a45c02d78f1602202d1ca2edb05c0c9af8c0b61cdc2afb084ed7f8fd5bfd036fffb8dfe520289cc0fe6116cc1e8a26e434a16278410538c9d7942e92982f753e6daba46661cd4d6695b8035972a1b0e81c8be6c558bb2745433d53a8f4fea37fdd6d46587e8ddc4a93e2562f86ca09bf2faf930eef0a81d55d7656cf1fd5e91833f1943709ed5931662603906e0f88a34701230ec106dad8d26d543d7974638cb838eaa59fe5220f0684e82eefb237413f2d85e74be335668e4064dc14f567680dfbc4a51b60e2168358b6447f1e4c2171813d2c1f5cd7892f789ef560d5a9547fd7dbc9c6ea9c6d34a91cde7aedccc9d14ea1d66a0cb482e2ac33bcc945e53bb354e037f9e5106641a85eee579da5b9a120b6927093cab158ea829ca05b0d5d65b20d8b7313df128251e98c65c64979b3c86e563bcd70bc52efc736a0a702a0e9fca4cb4929900d273fd1c55606ea031fb5d8866187f3616f98ef44361344cfdf309a343d325d59ab2c1fa27923362f4364ac566d55e6d57bbdad4f72a8e3dc46f71a3851843ada49aa64239a7a73faae013bd4751de630af95cf0fe946e0b3b32ca2c11cd66ed214797856e2f09921d57fb44753dc87bfe51afacdd137bd993fd594be700d51c75f9b9116cb8022bcde7f1d6985ecbe52d1dd04792cb1cf55dfdbdb917edc068b160eb9fd01122c5b0534a27977237c8b4f57023af36b2084858aae5f78084e6787de6a36f8d42ea5857db6e35bc4bb604e6ba4942af67c7ce4e649111e09e56050858fb34fd363941cca9e2c574010891ef0603a1cd83cdaf18a7231e477286a550cc7adfc6f153d762049399422e6d702d46d983a2296c95310f22364658080910222c494b597dbce5e7eceefa050b22353c5d61777c9da8b8c9cfd6dce4e6f40e12132136414a557e869fa1b5b7b8bcd8e7eefe1d2155576a73789c9ea1a9c7d3e6f2f911143a434a4f6f7d82899a9ba3aed6edeff24c410008f22040d4c1c00260090129104b00c000c80420280d00800d145100253233d45a06c9480f",
                "pk": "0x9de51a34d4a1c86fc997fde60f53437d9bf277db70c98d39388b0e07bc9d6cb98ba53bde228fe4d15b45882a82f877f0510cd931ab90e78d1cb6d50dc6bb771743f5690a676d9d17f99dbc7e62b75fe207ae6a6792aa4befff65674c111b89d93827d4ea0bad3928ef65e5b079e84cb09cf1488f88df155395c58d1292f63bc4f2d8fd23b4659f1edb03466bce28f694edb2bb3849b286103c383fd71ae9d5633fe8ec75bf69d472f3b7bcf10e05515b5e3d11ce092652864d160baa91fa0c4330178e6f7961e2b13e67a2748935e68f536ba49e66f4b98ed27e9c9abf4dbd3877249bb4a9eb7c4c59f6b7f72d67e1269e04a0760ed4f3c8e8d8f7482ef4377718ca7f40393f133f58bfbe5995b04487943cfee5ed6e2856cbdfa6704d0457337594f2db2b3cdf9062ba83a68d19c446fcb2c3a5193314ab8af9561d32d84825a1182bfb745e4cf12516d2d16fcd6c2c23894660fa3b31d32d6b1e4da13ac8c482bbbeca35d568c001b2297ad7fa1ad0ce4e8bfece2ffc456a063b9967dea78e290e553f4c013ec73121081d44bf6a9275852add72b1f5030c490196bc72c3e6f70d789065c7e7693270f376222f054794d7dfd818bf8f1fc460e05357a1569f0b60a5b7099a6cad2a6d026902b72579d3a4ff9c82e2c50bca59e3f6f1d510c971ec3b195d06b34e8e77ad5b4d1efebc9fe8bc5fdd2760a641f3610e90eb233a2da0ceb20ea98d05576358d55a9cb467818ba82afd5b497c2e6d6296e82a63b9f636d612ee5c208a2dd69f34abc21bcf4466924008869068e08acd1bedc30ef68d0f73803018968f00adf354cc1a96af22686a6817bd4b1c390467b7a7ac9daf883331a4dfe3e2b11989c3d40ae840ea89d32a03efe962395513f152597c8004b5a77b0d6510c00946b968f24b38e09d289a511149bc20d6f4a7b31e68f3b9fa7faf5abde524b1499515d992617ba75f60ee3ab491777aae4eec2dd054cdaa5cad451954514cf78cb69c701784fb7552c353b3834180f1071716cde1787a6ce5d9c8bd95bde5de07a2c61437d0075406df1c49021b0db26b39ef8de6258e0246194803f6123abf283eaa0ec956779c86e20c5ce60026b8a48ca0cad23ba202c1e4223e208b46872f89b58b9c59f73fb9da39e9a39b30a6c796e66c1d5b696f8d90deea5b1c61755a65953194cec848debe84f4f28c785e4335322ede12e9611d178964842b70be4e9d8147412864d34e72f8a696d19948af3fa9310c37dc23ce58fec90ff1ae45e09ceda258e13d7e33b367dba9ff6241fc3691a3d75730bb14935cd110324ebf5c52ca8d066b691e018551410a195e4881e5d32637c6adc3d2e7683a860d16e0a934dd3c67efcdffc7971266f3db64bb3bfafe613064964a8642785fed3b0086ed6a17701a5663ae9f731f200744be4424788ec970f6a63fe2596a84271809c91de61b140cbe073e1e9be22e3a431441a7d3f31e61f811ed7c5b517b730ab68f63163958d93eda2635490ee092357ded61f77f079ed02c1cfc06ac0bff26c3ca307de89e9248e1e3e09e3a1e2e4700e291f80863f638d8169464b03887b5058cd278c7a663172bdc176b103959fa31571ac3d7d4afacfda10d976257390f3bcbc4081a8e5ff63cf22da019ab42f6293c6106d3d5a8c33397e81935707f91e580d3595d5afef1b3b1f900bb8e21720d1dfb9f9378ec31313023a3615b74460f27a1a3f6d9ed11f1da9bd6f161bc27f0038a11ea00c162ae6efe906ecdddeecc0007bc1d92d5410a56612fd2c43a62f9aa419111f32029b00f96890a7b06fd5545a2d7ae27e6b7f52c46e55354f0f7cca21e455b69b38fb2085bd42dd29f6a98cbecd3190a61d631e59df648b192d82ab0139d445b0060a7b460dce7b3f418644e5a281afae54948d56148e6c38621e5ce67a80cafce7117e6289dc6dfeb44dcf6bfb59b39cd1498a8c3e22019ba8b6b62445b42568799d2a6f8c1c2c842e114a727107b576491e5766a572ac27576b9dfd21da084e86a923a71cc9907c37e981c18b3e31774a4c3fe798be8d418bbd68576e7e5e31335f1f006"
            },
            {
                "blockHash": "0xabd949f67f478d458d22e5c2722c4bf0e8d11a2eb5b51126d9d473410b9df581",
                "blockNumber": "0x3",
                "from": "0x204a48d411c5cc973c7e9afdd3c2301bfc049eac",
                "hash": "0x2b8bf0e35f039b297b182e8d68fe9aa2f7f5f25a57d9786cf4b25c5d90aa596a",
                "nonce": "0x1",
                "transactionIndex": "0x1",
                "type": "0x1",
                "chainId": "0x0",
                "signature": "0xc009f81cbf02919e48610fffb91865cda948492b3c78e24fd10827ca60c5be39c6d0b025b468ae3beda4c0e960123693e47568f24ea1f11ba100d9cfef188ba0be87eb2c4b532d00b9ce32327d30025c8bb5847ebbe081b613f29e69345d5c4aebaefb81744c248d5e8a85ed88bb0c1c3b311b473b6784de9475a670424c56017181ffdf3729dc11e077b2853178015b4bdb2193b38ac92cdbe0edb4bd6af6d49fc53dc7cc0e917caf921d39d7fe293ead3a3e789e15d9f7c8a98f873f33cf64c7d209c6df9543f43498077e04f712011b5e11aea0678fff9cc5fbdc9b47c30ba0e3e6b1b14b0444d699f7d82082142fe0a1f12733598fdda0f225bac4e46e48d9b92f0eb6472eba9502688a6c9894ec3106019cf9fb6994e15342bf985c06fe7b7ce2c9011c077a4bcc701a21467ab183f95cdc4e9c062c0a7156987144b5e1d98d33b572fbe9a1bf07c250d957e1d17b4c6406f28ff3c71a308db6d591504225e604ccd3210ac1923dcb6bc9fbffbe1fe12d3f4739d778e93201a1293ff941b18e5d6995dfb20b993d74f1bdf5fb0a3135cf5612fe3764213fcf9c72caef23fcbe0bfd16cee1bbdf45fe23607894b2ffecb127de0b7d1d5c32f394c2217da532a403264863ed8345ae6e3d945e61bde61dd6b7bb509629b32a02d1712362ae6a9b601dc91afd8b644d4f657f59f192248b0a387333f8fdbb363e38f8d94bc720fd41c64770e3fb685425d212238cc2e4355e7600e499ebda19651786489276c8c39ba099024053ae1ea7c6b2f32db342e501042da8f7fbfa9d1dcb3932405ff12cb589410446cc39163d89dea5a12ec3abe18fbbf7a2fb3b0b7c5f0f77331d42ab97973ec77f4934be106f3c43a580750ed62ab921d1df92c4c02626aa198c91689845d1a75d4fba525fe85029e99f04f92c03ab4fbf5268d1f26a597d70b3fa308bb25582c42936d3bdbe60704034c05241cbdb4fbbe791c0f92f0de54f0d2d751cacabda787332b3a5e3eb3c0844011d82f9c1aee55f9559f66ebad27131cc7f6a6f6dcd73b00aa7a93c37e78831d789430ad707541033c919ad2005cb210d1d75835de75885d429fe8440e6af3c0aff0eed1d33957e4008d83a442ea88fb7d564c133d79dce1417351a2169ef11045d34e094e6e352634225a7365fcf48a1ead7a873d941a7cecd11bf54f7c286f774973f22535a0eddbbb7dd795a099c7bef89ab6d78ae1d3c6649c019c8b1aa6c2d0de2a15f79ffcc9b93846a92f9e8987e64254da406edc7da584a988eb9f96ff37a8233993afe530c112d0098feb64b4041ebdf68fbf825d405a219a4203503a38c701698ce016c6d09f5a9c84e4ba21a3d41533cc4bf0cc8202724f7bac3f1472703cf2cd8c784c03537a9725c0e286c1df5b58f22d93a37e4d08fef0773bf77bf778d6ae7683534daeb02178afdb350391686c6c65ea31c97eecec464b7a991aa2b18bdfaa6fa77a4d0fa0913f3ab7ed597205824fdd259b20a6cd48cb557d6971981bdf095345a3918c8a53e631f27fec8753957969ca7e636703fabeab4d4264a7c0b899d4440f324dde2b4b4e8274afe804e250002e242dd2ee217a060c087045e0e71cb3674ce1a098baafb88ad003163863e3349483a0d097bcf59d15641235a8e3272dc8407c3a10b5f0e687f22acc54a81dcad094b8d444f97460852edd2fc1dad6ff87ce366268e1bd155848d2f7fa488030cb820109134e69f509a5552c4f2ad79e7d7ac6c37997e2bb34a0576a1025df0032844cf83b4bae6b0a97e0d542cf27dc991fda55a0c69cf5322f700e75db6d874e7d62946dce2b02c5a363fb454acdb1d8d323fad735453a2877f02bd79170277e03050196241f13a9ae2a4b60d52e17a5edf4eac640db052fc1cffc7ba0b3ded8c4a575e27287a8b33b7e5b6649c25ccea754ddd3efd2ced0e3ccd054efe6f94fccf487bf9e65122ec9c3c833a376837289374c8bfccf163386ca6845d899999562bec92d4603eb5cb384ddf0cc0470ba7d22c797c8452f7b7fa90755e060d233332a05a8b4a77df09177eaf18b6db6652b7068b8a4b67702d254539457b76c431d9b8c6877d54255df887d0f36a1f5d9d97af400cf536adb8ad912066e73a8f00e992a12e6bfb635c48c419cc1944eff530b2ba699074e4935dad9d5251d958fd96d853d756f240f31c06d80aba756cb36a71b202b98b3de30dd09ce923d7ed3b49715dad1aef30106d90d5e53bb32a413dcdf208cde773323d700c7a619ae460b56c722c41667bf13cb511f2722643ac98ed010e0401cd9ba2b669ead3b12e35526a7bf5d1d2579173d6dbae8762544f9842430c0bf683c762d25429db46ffca5c093cc0bda1f7f4bbb32c2b328289bfef0de779c6dda133c84d54adb81ceee986e34bb09aeeecc93bf0bf5d19a94b59ebde5361fc6a53ef72dd9facacc282a79e85e106968b3aef249b35af0645402d25ae53a421a0ffc669950c845402e1e41395759741cc21856e660fba200d2af6372e30e4b53798dadd16d54828c72056c1aba90f0623d1a9e5de03a72a94aac7a0e73b40e5d06eb8afdac65a81e37822c6fe5e0e7aba7bc451ac4786fcd915bb3fe26d28943cf0990e78879c368046636e8aa6670255ed47607f055b66a690d3c056b6907df08c06d03ad0254fae995ef86474566e32f23a8db0f0d3d487aa622db5dd144ed9280f517cc2927de48b645c083739b1f4f3dc07373d7f14d4288da3330d488cebdb3e8c18fd5cd8c3c25c13f17c1025313eca84301fb87ad3963b89cae59d6c2344a8706baf76641e1ab94a08351b32ff581a15c1296edaa089c58d81b585bdb3f89f3115db397ceda358fc41e3f682f5b33928af2cd653e3e8706e8035d61682242065890a094af6773a6ee6e63ca9f3ac9befa5868e213c159256c41fcf29edec9caedec1a7414037e9c6fa62f48adfaab79b6f2fdddc2dac57a4b76d6fdadbf4b0cf655a379d5b93e117bd6f3a0766299336539b7de06479ce79364b674d067f965434d5b6d948ca7db50e578402792274a30a0d7884f43a282ee4b3d8504d65fe1e98e8cf4c13a3f30a838e1b27ac9f676a0b1be1efa61bb1ec70e952cdaa22c942f64e7b9f3ba98ae89f96ba05bd82606edb44fe23e13419dc7d482f3471ec6c3efa9fe20bf37deaea5d3c4cc0129e3152c42cd2795c4029eee42a5a21acba78eb5db01fb6dfdc0aca6cbdc4ba1ca3f0d4aef9e8142acefeeac6dc9558fc85294c4d3417c0a69a7c92bc9098c5a07a397142c4ecda1eb19f3cb76259fd16a6aecb3709ce097b92c59f20bea37cad9ca47c3b2bacb11b0ff4a2084253f9e92c8e1900828cbd3e4963369ebc3f7b15008b7b60839248751ae3015df5dcecf5bb8b7dbe9c6fec2fcc556d3d5283da3ead99b5e926f2605da1bd9cd26dff4be08f40c9a30ae1f793603f576e49451e5f365f718f7dc6b376ad9501a62ee87a07f22f90ebd505d9adc64c092a22bf81d69916d17f72e8ed1457c833734942c666f730bce7032da17f291ab093ab015589a9a8661c217183d6f018a19aef49224c2b9c9e030ca5ec176dd3bc2ad1db37f0eef3e80d7f280d828eadb2a0030b23280717262e3b074a75779fcfe2131b1f2b4f5a5b6b6d99a0a1aeb3b6c2010913333b50546c748791c4e6edf0185a6e87d9e7f1f8171b1d2a53567892a7b0b2bee912200691780882224910100804849900b00020aa4c028088a0102482418614800e1fe972202e2f03",
                "pk": "0x460c4a789b0d7db215996cb46c851fc2b72438baf7b8bee9dea75e04346671331300bbf9fc30db250602f07aaa2c6b479eb561870f0c6b9358e3a63bdf7af29cd17df65bc893068ba1705544a90c42bfc0b8f0da0d0726e4c420a1edbffd7dc4986209bf4de34b58b04beab34ea0790119eeee365bdb3af93b63363ac849dca02fe85777e03d9d675c40a82cb29beb2952534d737acf689aae7ffcc6a2df6f30405d4bd610f76097a51391248b81d19ddb982407d698361b8bd1b7688bc5b496b8f69d36c1dfaeb56fe30a66df47e5e9433726e89c3fccd7e65fe8f5af71957d697692ac8c496caed75f3d961c4ba35c375c3980dcb4caf4a8c69fb7ef9cf6103031d7a7b11626bfd50b0bf4ab7b0905644b4cc4b1ca75cde56930c3a6cacc1794ed661ab84bf9c19e199a2cbe9d5a63c1a29a4c5d9f476fe5980cf9877da5095dccf9561987144ce7355440dc7519e539fd3700c8ccb5a883c5f13c52f0849cc498486d1e66a6b98898110b328bfe297474c267e20753f9f90709e026f143651a341d7ddb9454372cf5b312d5b6f043e8d34b8fb53bb9ebd1d923276efa24fef86d46c8630b6d2653fff62ebefa581423a75e9583258487573e1a694ada4c67d6d5ac66b64f71665990c63d5aa5195c994d9e407b0b0f8adf870103cc107b95a716e91ac9a64b1a7d7b8604c90d179e4b147093c9dd5e3085a26d8c0d2115656c047fc95015d778ceb9bae86a4bd503e06a152053073892cf372aeaf82b2432848f2685163d62834b0f7e3c208794a1f2b61e4fa87cf77aab3b252e69cd979abe6f49dffd9f290e67eea866f8820eb53b45aa74f98b371440cfa599b0415dcfe6eead06154733a655df7d382f7af92ec189a17668123aa6f3b0be6867aa0aff90b05eda707bc272bc84d34d25c5df5a40b1848d5dcf9f8860f13395c7dce07136edbd4a58a910983f80bf3e1d1ab4d920ea0b4a6cb354280725394c753e62f1c9ebe064cb7263780671f702119d245e0b9cf20ca0254baed766cadaa0503643324a69879c8ba2838032d522fe6c6c6140bbb1f1417a22cb356b2982dbcb7acdf0c512cf40f6b3ab47a2087f512897d257e8b19fc717fd0c0cddfa3b7602c5f7d091a86c33765583debaa1f72944569dae481734c459adf69f54873baac0301ff23339b7f9362eae9680d474f9006af07c09accc50734bbea3e1a946b15a8b79c9945f801cb60d18200215ed86212baa4e28f56e850b76300f3ea8554a72a26138ea06ab10088df4737ca86304431d4299afbd5d59d90e5428e617d967d147ba2cb929e707ec9662849ec5e7a0ef64fb2b206626ee8b4167ef814524a4b3e8df0b893609104fc88c050cd15363e9675f0546116b63ccfc4e8cb83041b0fd6968260c1d5a2af8da7e2c30eb94ea83944fa4ff4051cd074fe5dae5fc0d241eb8148816f747aa244e9e3c59afabcc0017e668d28a055af172dcda67bfb88428fe8dec4696043c5cd00379e06c8203f5575cc08c84e86e2d10ae7809d606c06e5392a656e923a90571634a0420461a076eabefe3eb8f83ea73fd322224fdb0f346cacf2f842688fc00cedeb80a13675627bc949a5911b8fef3af2aa3840c4d5f2e912330bc3e76fc0372f98696f5d827df7a2bdae0d760d551279962020b7a590ea2c0ac73044de9b87a425a41d94e95c6fe3418c18ad359a1b121c4315d741ada954e6c6d180a10b10d6459a46a20b346359c770928a77a1877f5319a6a23b7f6027439569dbbba4ed1305793a85b8476f75a940380ad9844b78e6ef45909d81b7ac462d531020a54a276f31afaa9ec2e9b1534763bb3e0403549ad7f9f53382ce457e2fde733fff921e6273ce42b69e6dc18d2e1fe88a6e63c415b66b65a2a90b087c08c5e719f8403a2fc08f12338e67ab1abd7ad158b1a8f2318e9a38f7ec738993685f615043ff3d3956a39576b71dd0afc79ecf15215b9d33b8b0ff8f93f0652385da2cb84ced6090fd516ba4dbd580d20e29a3f43e0d19d59d597f9ab257046fa3f9a1c2eca350b004eb8a36716f2755f9d123ff126076c18f5e3426db75e"
            }
        ],
        "receiptsRoot": "0x",
        "stateRoot": "0x",
        "timestamp": "0x63165aa2",
        "transactions": [],
        "transactionsRoot": "0x"
    }
}
```

</TabItem>
<TabItem value="err" label="Error" default>
</TabItem>
</Tabs>
</TabItem>
</Tabs>
<br />


### `zond_getBlockByHash`

`zond_getBlockByHash` returns information about a block by hash. When `fullTx` is `true` all transactions in the block are returned in full detail, otherwise only the transaction hash is returned.


<Tabs
    defaultValue="code"
    className="unique-tabs"
    groupId="zond_getBlockByHash"
    values={[
        {label: 'Code', value: 'code'},
        {label: 'Usage', value: 'usage'},
    ]}>

<TabItem value="usage">

#### Method

*POST*

#### Parameters

| Field | Type | Required |  Description | 
|---------|-----|-----|-------|
| hash | DATA (hex) | true | DATA, 32 Bytes - Hash of a block |
| fullTx | Boolean | true | If true it returns the full transaction objects, if false only the hashes of the transactions. |

#### Returns

| Return Value | Type |  Description | 
|---------|-----|-------|
| Object | Block Object | A block object, or null when no block was found |  

##### Return Object Definition


- **baseFeePerGas** - 
- **gasLimit** - QUANTITY - the maximum gas allowed in this block.
- **gasUsed** - QUANTITY - the total used gas by all transactions in this block.
- **hash** - DATA, 32 Bytes - hash of the block. null when its pending block
- **number** - QUANTITY - the block number. null when its pending block.
- **parentHash** -  DATA, 32 Bytes - hash of the parent block.
- **receiptsRoot** - DATA, 32 Bytes - the root of the receipts trie of the block.
- **stateRoot** - DATA, 32 Bytes - the root of the final state trie of the block.
- **timestamp** - QUANTITY - the unix timestamp for when the block was collated.
- **protocolTransactions** - Array - Array of transaction objects, or 32 Bytes transaction hash
- **transactionsRoot** - DATA, 32 Bytes - the root of the transaction trie of the block.


</TabItem>

<TabItem value="code" label="Code">

Required parameters: `hash` (*hex*, *data*), `fullTx` (*boolean*)

<Tabs
    defaultValue="shreq"
    className="unique-tabs"
    groupId="zond_getBlockByHash-code"
    values={[
        {label: 'Curl Request', value: 'shreq'},
        {label: 'JS Request', value: 'jsreq'},
        {label: 'Python Request', value: 'pyreq'},
    ]}>
<TabItem value="shreq" label="Curl Request" default>

```bash
curl --location --request POST 'http://45.76.43.83:4545' \
--header 'Content-Type: application/json' \
--data-raw '{"jsonrpc":"2.0","method":"zond_getBlockByHash","params":["0xabd949f67f478d458d22e5c2722c4bf0e8d11a2eb5b51126d9d473410b9df581", true],"id":1}'
```
</TabItem>    
<TabItem value="jsreq" label="Request" default>

```js {} 
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'http://45.76.43.83:4545',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "jsonrpc": "2.0",
    "method": "zond_getBlockByHash",
    "params": [
      "0xabd949f67f478d458d22e5c2722c4bf0e8d11a2eb5b51126d9d473410b9df581",
      true
    ],
    "id": 1
  })

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});

```
</TabItem>
<TabItem value="pyreq" label="Python Request" default>

```py {}
import requests
import json

url = "http://45.76.43.83:4545"

payload = json.dumps({
  "jsonrpc": "2.0",
  "method": "zond_getBlockByHash",
  "params": [
    "0xabd949f67f478d458d22e5c2722c4bf0e8d11a2eb5b51126d9d473410b9df581",
    True
  ],
  "id": 1
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

```
</TabItem>
</Tabs>

<Tabs
    defaultValue="resp"
    className="unique-tabs"
    groupId="zond_getBlockByHash-resp"
    values={[
        {label: 'Response', value: 'resp'},
        {label: 'Error', value: 'err'},
    ]}>
<TabItem value="resp" label="Response" default>

With `fullTx` set to `false` returning only transaction hashes from the block:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "baseFeePerGas": "0x0",
    "gasLimit": "0x5f5e100",
    "gasUsed": "0x0",
    "hash": "0xb136341669d7b375c0d2d7f544ec48392911a6e8e6972b880f6b741bb5ee0cc5",
    "number": "0x3",
    "parentHash": "0xaa2577455bbe6ebb9f7a00646af3b3d5b385c596ce75f7af162ce5711f82afbb",
    "protocolTransactions": [
      "Ih0kq54vF827mpatAvWlbwhG8ickIbHt7ZLi0wVTV9w=",
      "25pO27YDqLEstfnfVx8yA1nBvatQ2Z6A675WPYXqeEs="
    ],
    "receiptsRoot": "0x",
    "stateRoot": "0x435f20116252cfaaf9def5a075eb9f76332199ada66995a709f0dacc15ff08e9",
    "timestamp": "0x63213466",
    "transactions": [],
    "transactionsRoot": "0x"
  }
}
```

With `fullTx` set to `true` returning all transaction data from the block:

```json 
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "baseFeePerGas": "0x0",
        "gasLimit": "0x5f5e100",
        "gasUsed": "0x0",
        "hash": "0xabd949f67f478d458d22e5c2722c4bf0e8d11a2eb5b51126d9d473410b9df581",
        "number": "0x3",
        "parentHash": "0xdf035d2e1b1b2133339612e747af7a5b1a1cb91d802b13c0636d7624c23158cb",
        "protocolTransactions": [
            {
                "blockHash": "0xabd949f67f478d458d22e5c2722c4bf0e8d11a2eb5b51126d9d473410b9df581",
                "blockNumber": "0x3",
                "from": "0x2034ffee0f25410910d57b36121edfe272fb1796",
                "hash": "0xfec6288fca392b53234fa45a1710251bbf843bffbdb8ad5c08806163bb2eefa6",
                "nonce": "0x1",
                "transactionIndex": "0x0",
                "blockProposerReward": "0x12a05f200",
                "attestorReward": "0x77359400",
                "feeReward": "0x0",
                "type": "0x0",
                "chainId": "0x0",
                "signature": "0xe810effad4f7d616dfe27432f5a9c4980635a5e9a3ddee9cd6f09eb961527d362f454ff8d2157217f3102dc12dc815437034a0371e5423a312c36a09d73952fb45f6bda28343feac00427ecbc5fcc88c3fcd15309c19acaec6c4bc43361e057866f16d68194da35f882c8d23605c4aa262edad403001be990b6692c1120f932e5e63a2805621fb0d57ea6dbd8e6c744c4c4ecb8c9845f55362cf7758388dcbdd434c1af2bd708a02d9af63afd9135d6c6685f15182f6b8f4a155f0a61805057b7c2b2af3dfa0006e39f3235ebe013c8eeb9b16b9a109e57945fed5b2e7f0bfa7bec32528231c7ee04af3dd2625588314ccd55c3427f8cfb18f15864e3360e1f8dc85b04b28b57d7d2bc181f282b7ce67266f3f7bc4c7a82a80a6b6d05e0f9504b5102e69b5be274350f2e26c6b72b739b9ae5c83fe35c3add22d1751cd16b7a3fcc7b249065c311119c6b861b601c7a12635241198ee2294f7997ae7bc423a88b2e8c5514981a06ee10ccfdfc7a07472f98c37745e1e87df46fa741cb05343283a7627ad57514d3199fa792b4a390c48102f6357e1acefb11bfff2fd00d55181c0c7d5e502b21fe62af62ef63076da8f0ede888af1908a1604eccd81cb99cdf0f71f5a29b16263ed409672ff070a30ac075df0dc350534b720c85c332726b5f718e1a9af4093cec152e2926311fe724de333efa0707b40d67d07e3070f3998c418085d5de5f4d88115a45dd1e20463b28d061365394440a5fda852ce59482b58b2f92a89fa80420fba7deaf555157c49b2384ba58a583a258c70dafa24e9c78987ca6b76c8b8ab10f9af8032e8266b7e73edf1fe84efd5b487811840a6654fe96cc039ab5f24f8353f91e881acced19cc0462c3e69ba5dd0cb34dc29c56cdcd756092d13a213351523377b619ab76f45fba16d37b421484f389c8d94a96e25d3da24f1c537dbbcb4356bc43acd0a5c395c8debce73e3dc1e01e89139e5c55caae89f185c9e33eefec3b1805c5071e9227525358835ca3c3adc6d99ed5b5a1e406b8e9b3e70b04b506a1ae0db650e205aef7d2048012eaab3b2a560b9012d70fc8fb636aa739716d22c20637f46fb76a6278d3a1e74ba953a7ee020b7bf6168395ab9c6fccf8bc3b987616eeb6885b345b6a539f8aea7fea71b868e20165cf686865e1428b3d24328ecdff8c8aafb241c6ccc422e136ec3c90832626758b51c8e6edf7ffc313763b68a2861733aaf6fb36aa4276fccb012fb910f3485f0aea96be0087d21bc3fb91e8ca3e4c7fda0d52e4540b5addb127be7a3b687e07176f375871e47a0f41cf8b83ed17fd36e815e8116eb9a1c9d6026394cb01cf5c363cc1f5473e52fe52ca7972cb4fe0f32b555bb6c5c699f39dedea8ed5b8216112ab6946c854eac539463addf366f30a6e582286c9eb601382a6d474854ba36aeb928c38eb8e9a59c9d4f72a6a95f3c2547038d505934d4cf69c0312daa64f53dd73f0710a8a6eaa6154f9c8a5a05cead9f415169ea2b4e62c2fd311adb522eac0201e24e7ddcec14fa8342b18a171470edba80a67b5273ddebcb48f48bfe563952090574d6169babb1f4db239701587f69264ced538ab41dd89faa5e99188d4b724d903be3965b90a89195e566f11d5104deeeb4503d2ba14974777f70d38d3db1eb9cf50702502dc3fb3df270fe157e22b5fa6797889e9f9facc39a4d7c9f7437482574f205082bb04f11dd8497b76aa11f90bca0e7c82ef45f4434ad52a49f894e1376867344153afa616956f614843d66921a2b5a9129aa802550a3e1e325324a21a0d893cf924ded9a28addea32eb2fd435e752581ba99a35f1709757313cc07e72f279dfc6f024ba6ffb97b16f2874cf228542b673d5fcda91b914580eaafb5956a066916a96c5c63029f362cbc5d4090b4c30789ac3e315c5ab23da0cbb77e71b8aee8d4404912b4540067addf0e472f728a922be7fc3cc6c4cdf573b9929d526a2537afee8622be9417593a5f73df97749f2b835bd1596fbc6c5044dae1bc96575bf1051cecd99b574135546d4c9d8e1d9c5183050b018ad59adc0b163b08909e3d81aa81bdcfbd54be3847bf66c5094fbb9fe0038faab74acab1508a2d38af2642713f6e65b81f3a7e1a6054cb3edfa9eefc3c31d075c4297158d104f4437fd5673537ef740b59ff5cf84fd42a4e40e34aa8a4fa37d929bf598f47e533224bcccd075485b420c8d578adcd63f0955edf142253a75159d75de3131578263cf3c880197b92dc654c60bd0a3564f76e4c5f8f61f02330ee973a76fcdbfeb7fbb2611cb1e88104d74b1634c6792dbc0da0e9035f592539809f51261f3e3f07e0deae25812f41af3cdf0ebb3831197b7f7a1c46f05df837ac7ded46e0a6cbd0b962901c73857f6f859dc8ef1daba5a0f6f7825673c3ca0aead095a7543ce6277cbb8d41c02422a5ad540f634dc884d8e4f30fa30aabc4274e36f1df86a67087965a2b10fe2cb0f73358ac1dc3a9515137f3057fd96dbe407af1b3671a6b16958f6a4d77409c81e00627b284932aa7729602a0d1f77640435eb08573ba025e360aede2f0c7d66940b9724bfce08f08a5d9e6076b80a69703f2c302728efbb7bb4684183c9519fd481f63260d8a4fe1d88ef633907a0c47a3bbc645cb58ad8a2ee24866bb691ba16f55a85bec2b743ccd89b8d5b0c3fdc13d8370c89633d48411c390a6b1e5ba3d47c075850f932cb2654c2686c3f2a23c8c1ba4cde2db06f8790a45c02d78f1602202d1ca2edb05c0c9af8c0b61cdc2afb084ed7f8fd5bfd036fffb8dfe520289cc0fe6116cc1e8a26e434a16278410538c9d7942e92982f753e6daba46661cd4d6695b8035972a1b0e81c8be6c558bb2745433d53a8f4fea37fdd6d46587e8ddc4a93e2562f86ca09bf2faf930eef0a81d55d7656cf1fd5e91833f1943709ed5931662603906e0f88a34701230ec106dad8d26d543d7974638cb838eaa59fe5220f0684e82eefb237413f2d85e74be335668e4064dc14f567680dfbc4a51b60e2168358b6447f1e4c2171813d2c1f5cd7892f789ef560d5a9547fd7dbc9c6ea9c6d34a91cde7aedccc9d14ea1d66a0cb482e2ac33bcc945e53bb354e037f9e5106641a85eee579da5b9a120b6927093cab158ea829ca05b0d5d65b20d8b7313df128251e98c65c64979b3c86e563bcd70bc52efc736a0a702a0e9fca4cb4929900d273fd1c55606ea031fb5d8866187f3616f98ef44361344cfdf309a343d325d59ab2c1fa27923362f4364ac566d55e6d57bbdad4f72a8e3dc46f71a3851843ada49aa64239a7a73faae013bd4751de630af95cf0fe946e0b3b32ca2c11cd66ed214797856e2f09921d57fb44753dc87bfe51afacdd137bd993fd594be700d51c75f9b9116cb8022bcde7f1d6985ecbe52d1dd04792cb1cf55dfdbdb917edc068b160eb9fd01122c5b0534a27977237c8b4f57023af36b2084858aae5f78084e6787de6a36f8d42ea5857db6e35bc4bb604e6ba4942af67c7ce4e649111e09e56050858fb34fd363941cca9e2c574010891ef0603a1cd83cdaf18a7231e477286a550cc7adfc6f153d762049399422e6d702d46d983a2296c95310f22364658080910222c494b597dbce5e7eceefa050b22353c5d61777c9da8b8c9cfd6dce4e6f40e12132136414a557e869fa1b5b7b8bcd8e7eefe1d2155576a73789c9ea1a9c7d3e6f2f911143a434a4f6f7d82899a9ba3aed6edeff24c410008f22040d4c1c00260090129104b00c000c80420280d00800d145100253233d45a06c9480f",
                "pk": "0x9de51a34d4a1c86fc997fde60f53437d9bf277db70c98d39388b0e07bc9d6cb98ba53bde228fe4d15b45882a82f877f0510cd931ab90e78d1cb6d50dc6bb771743f5690a676d9d17f99dbc7e62b75fe207ae6a6792aa4befff65674c111b89d93827d4ea0bad3928ef65e5b079e84cb09cf1488f88df155395c58d1292f63bc4f2d8fd23b4659f1edb03466bce28f694edb2bb3849b286103c383fd71ae9d5633fe8ec75bf69d472f3b7bcf10e05515b5e3d11ce092652864d160baa91fa0c4330178e6f7961e2b13e67a2748935e68f536ba49e66f4b98ed27e9c9abf4dbd3877249bb4a9eb7c4c59f6b7f72d67e1269e04a0760ed4f3c8e8d8f7482ef4377718ca7f40393f133f58bfbe5995b04487943cfee5ed6e2856cbdfa6704d0457337594f2db2b3cdf9062ba83a68d19c446fcb2c3a5193314ab8af9561d32d84825a1182bfb745e4cf12516d2d16fcd6c2c23894660fa3b31d32d6b1e4da13ac8c482bbbeca35d568c001b2297ad7fa1ad0ce4e8bfece2ffc456a063b9967dea78e290e553f4c013ec73121081d44bf6a9275852add72b1f5030c490196bc72c3e6f70d789065c7e7693270f376222f054794d7dfd818bf8f1fc460e05357a1569f0b60a5b7099a6cad2a6d026902b72579d3a4ff9c82e2c50bca59e3f6f1d510c971ec3b195d06b34e8e77ad5b4d1efebc9fe8bc5fdd2760a641f3610e90eb233a2da0ceb20ea98d05576358d55a9cb467818ba82afd5b497c2e6d6296e82a63b9f636d612ee5c208a2dd69f34abc21bcf4466924008869068e08acd1bedc30ef68d0f73803018968f00adf354cc1a96af22686a6817bd4b1c390467b7a7ac9daf883331a4dfe3e2b11989c3d40ae840ea89d32a03efe962395513f152597c8004b5a77b0d6510c00946b968f24b38e09d289a511149bc20d6f4a7b31e68f3b9fa7faf5abde524b1499515d992617ba75f60ee3ab491777aae4eec2dd054cdaa5cad451954514cf78cb69c701784fb7552c353b3834180f1071716cde1787a6ce5d9c8bd95bde5de07a2c61437d0075406df1c49021b0db26b39ef8de6258e0246194803f6123abf283eaa0ec956779c86e20c5ce60026b8a48ca0cad23ba202c1e4223e208b46872f89b58b9c59f73fb9da39e9a39b30a6c796e66c1d5b696f8d90deea5b1c61755a65953194cec848debe84f4f28c785e4335322ede12e9611d178964842b70be4e9d8147412864d34e72f8a696d19948af3fa9310c37dc23ce58fec90ff1ae45e09ceda258e13d7e33b367dba9ff6241fc3691a3d75730bb14935cd110324ebf5c52ca8d066b691e018551410a195e4881e5d32637c6adc3d2e7683a860d16e0a934dd3c67efcdffc7971266f3db64bb3bfafe613064964a8642785fed3b0086ed6a17701a5663ae9f731f200744be4424788ec970f6a63fe2596a84271809c91de61b140cbe073e1e9be22e3a431441a7d3f31e61f811ed7c5b517b730ab68f63163958d93eda2635490ee092357ded61f77f079ed02c1cfc06ac0bff26c3ca307de89e9248e1e3e09e3a1e2e4700e291f80863f638d8169464b03887b5058cd278c7a663172bdc176b103959fa31571ac3d7d4afacfda10d976257390f3bcbc4081a8e5ff63cf22da019ab42f6293c6106d3d5a8c33397e81935707f91e580d3595d5afef1b3b1f900bb8e21720d1dfb9f9378ec31313023a3615b74460f27a1a3f6d9ed11f1da9bd6f161bc27f0038a11ea00c162ae6efe906ecdddeecc0007bc1d92d5410a56612fd2c43a62f9aa419111f32029b00f96890a7b06fd5545a2d7ae27e6b7f52c46e55354f0f7cca21e455b69b38fb2085bd42dd29f6a98cbecd3190a61d631e59df648b192d82ab0139d445b0060a7b460dce7b3f418644e5a281afae54948d56148e6c38621e5ce67a80cafce7117e6289dc6dfeb44dcf6bfb59b39cd1498a8c3e22019ba8b6b62445b42568799d2a6f8c1c2c842e114a727107b576491e5766a572ac27576b9dfd21da084e86a923a71cc9907c37e981c18b3e31774a4c3fe798be8d418bbd68576e7e5e31335f1f006"
            },
            {
                "blockHash": "0xabd949f67f478d458d22e5c2722c4bf0e8d11a2eb5b51126d9d473410b9df581",
                "blockNumber": "0x3",
                "from": "0x204a48d411c5cc973c7e9afdd3c2301bfc049eac",
                "hash": "0x2b8bf0e35f039b297b182e8d68fe9aa2f7f5f25a57d9786cf4b25c5d90aa596a",
                "nonce": "0x1",
                "transactionIndex": "0x1",
                "type": "0x1",
                "chainId": "0x0",
                "signature": "0xc009f81cbf02919e48610fffb91865cda948492b3c78e24fd10827ca60c5be39c6d0b025b468ae3beda4c0e960123693e47568f24ea1f11ba100d9cfef188ba0be87eb2c4b532d00b9ce32327d30025c8bb5847ebbe081b613f29e69345d5c4aebaefb81744c248d5e8a85ed88bb0c1c3b311b473b6784de9475a670424c56017181ffdf3729dc11e077b2853178015b4bdb2193b38ac92cdbe0edb4bd6af6d49fc53dc7cc0e917caf921d39d7fe293ead3a3e789e15d9f7c8a98f873f33cf64c7d209c6df9543f43498077e04f712011b5e11aea0678fff9cc5fbdc9b47c30ba0e3e6b1b14b0444d699f7d82082142fe0a1f12733598fdda0f225bac4e46e48d9b92f0eb6472eba9502688a6c9894ec3106019cf9fb6994e15342bf985c06fe7b7ce2c9011c077a4bcc701a21467ab183f95cdc4e9c062c0a7156987144b5e1d98d33b572fbe9a1bf07c250d957e1d17b4c6406f28ff3c71a308db6d591504225e604ccd3210ac1923dcb6bc9fbffbe1fe12d3f4739d778e93201a1293ff941b18e5d6995dfb20b993d74f1bdf5fb0a3135cf5612fe3764213fcf9c72caef23fcbe0bfd16cee1bbdf45fe23607894b2ffecb127de0b7d1d5c32f394c2217da532a403264863ed8345ae6e3d945e61bde61dd6b7bb509629b32a02d1712362ae6a9b601dc91afd8b644d4f657f59f192248b0a387333f8fdbb363e38f8d94bc720fd41c64770e3fb685425d212238cc2e4355e7600e499ebda19651786489276c8c39ba099024053ae1ea7c6b2f32db342e501042da8f7fbfa9d1dcb3932405ff12cb589410446cc39163d89dea5a12ec3abe18fbbf7a2fb3b0b7c5f0f77331d42ab97973ec77f4934be106f3c43a580750ed62ab921d1df92c4c02626aa198c91689845d1a75d4fba525fe85029e99f04f92c03ab4fbf5268d1f26a597d70b3fa308bb25582c42936d3bdbe60704034c05241cbdb4fbbe791c0f92f0de54f0d2d751cacabda787332b3a5e3eb3c0844011d82f9c1aee55f9559f66ebad27131cc7f6a6f6dcd73b00aa7a93c37e78831d789430ad707541033c919ad2005cb210d1d75835de75885d429fe8440e6af3c0aff0eed1d33957e4008d83a442ea88fb7d564c133d79dce1417351a2169ef11045d34e094e6e352634225a7365fcf48a1ead7a873d941a7cecd11bf54f7c286f774973f22535a0eddbbb7dd795a099c7bef89ab6d78ae1d3c6649c019c8b1aa6c2d0de2a15f79ffcc9b93846a92f9e8987e64254da406edc7da584a988eb9f96ff37a8233993afe530c112d0098feb64b4041ebdf68fbf825d405a219a4203503a38c701698ce016c6d09f5a9c84e4ba21a3d41533cc4bf0cc8202724f7bac3f1472703cf2cd8c784c03537a9725c0e286c1df5b58f22d93a37e4d08fef0773bf77bf778d6ae7683534daeb02178afdb350391686c6c65ea31c97eecec464b7a991aa2b18bdfaa6fa77a4d0fa0913f3ab7ed597205824fdd259b20a6cd48cb557d6971981bdf095345a3918c8a53e631f27fec8753957969ca7e636703fabeab4d4264a7c0b899d4440f324dde2b4b4e8274afe804e250002e242dd2ee217a060c087045e0e71cb3674ce1a098baafb88ad003163863e3349483a0d097bcf59d15641235a8e3272dc8407c3a10b5f0e687f22acc54a81dcad094b8d444f97460852edd2fc1dad6ff87ce366268e1bd155848d2f7fa488030cb820109134e69f509a5552c4f2ad79e7d7ac6c37997e2bb34a0576a1025df0032844cf83b4bae6b0a97e0d542cf27dc991fda55a0c69cf5322f700e75db6d874e7d62946dce2b02c5a363fb454acdb1d8d323fad735453a2877f02bd79170277e03050196241f13a9ae2a4b60d52e17a5edf4eac640db052fc1cffc7ba0b3ded8c4a575e27287a8b33b7e5b6649c25ccea754ddd3efd2ced0e3ccd054efe6f94fccf487bf9e65122ec9c3c833a376837289374c8bfccf163386ca6845d899999562bec92d4603eb5cb384ddf0cc0470ba7d22c797c8452f7b7fa90755e060d233332a05a8b4a77df09177eaf18b6db6652b7068b8a4b67702d254539457b76c431d9b8c6877d54255df887d0f36a1f5d9d97af400cf536adb8ad912066e73a8f00e992a12e6bfb635c48c419cc1944eff530b2ba699074e4935dad9d5251d958fd96d853d756f240f31c06d80aba756cb36a71b202b98b3de30dd09ce923d7ed3b49715dad1aef30106d90d5e53bb32a413dcdf208cde773323d700c7a619ae460b56c722c41667bf13cb511f2722643ac98ed010e0401cd9ba2b669ead3b12e35526a7bf5d1d2579173d6dbae8762544f9842430c0bf683c762d25429db46ffca5c093cc0bda1f7f4bbb32c2b328289bfef0de779c6dda133c84d54adb81ceee986e34bb09aeeecc93bf0bf5d19a94b59ebde5361fc6a53ef72dd9facacc282a79e85e106968b3aef249b35af0645402d25ae53a421a0ffc669950c845402e1e41395759741cc21856e660fba200d2af6372e30e4b53798dadd16d54828c72056c1aba90f0623d1a9e5de03a72a94aac7a0e73b40e5d06eb8afdac65a81e37822c6fe5e0e7aba7bc451ac4786fcd915bb3fe26d28943cf0990e78879c368046636e8aa6670255ed47607f055b66a690d3c056b6907df08c06d03ad0254fae995ef86474566e32f23a8db0f0d3d487aa622db5dd144ed9280f517cc2927de48b645c083739b1f4f3dc07373d7f14d4288da3330d488cebdb3e8c18fd5cd8c3c25c13f17c1025313eca84301fb87ad3963b89cae59d6c2344a8706baf76641e1ab94a08351b32ff581a15c1296edaa089c58d81b585bdb3f89f3115db397ceda358fc41e3f682f5b33928af2cd653e3e8706e8035d61682242065890a094af6773a6ee6e63ca9f3ac9befa5868e213c159256c41fcf29edec9caedec1a7414037e9c6fa62f48adfaab79b6f2fdddc2dac57a4b76d6fdadbf4b0cf655a379d5b93e117bd6f3a0766299336539b7de06479ce79364b674d067f965434d5b6d948ca7db50e578402792274a30a0d7884f43a282ee4b3d8504d65fe1e98e8cf4c13a3f30a838e1b27ac9f676a0b1be1efa61bb1ec70e952cdaa22c942f64e7b9f3ba98ae89f96ba05bd82606edb44fe23e13419dc7d482f3471ec6c3efa9fe20bf37deaea5d3c4cc0129e3152c42cd2795c4029eee42a5a21acba78eb5db01fb6dfdc0aca6cbdc4ba1ca3f0d4aef9e8142acefeeac6dc9558fc85294c4d3417c0a69a7c92bc9098c5a07a397142c4ecda1eb19f3cb76259fd16a6aecb3709ce097b92c59f20bea37cad9ca47c3b2bacb11b0ff4a2084253f9e92c8e1900828cbd3e4963369ebc3f7b15008b7b60839248751ae3015df5dcecf5bb8b7dbe9c6fec2fcc556d3d5283da3ead99b5e926f2605da1bd9cd26dff4be08f40c9a30ae1f793603f576e49451e5f365f718f7dc6b376ad9501a62ee87a07f22f90ebd505d9adc64c092a22bf81d69916d17f72e8ed1457c833734942c666f730bce7032da17f291ab093ab015589a9a8661c217183d6f018a19aef49224c2b9c9e030ca5ec176dd3bc2ad1db37f0eef3e80d7f280d828eadb2a0030b23280717262e3b074a75779fcfe2131b1f2b4f5a5b6b6d99a0a1aeb3b6c2010913333b50546c748791c4e6edf0185a6e87d9e7f1f8171b1d2a53567892a7b0b2bee912200691780882224910100804849900b00020aa4c028088a0102482418614800e1fe972202e2f03",
                "pk": "0x460c4a789b0d7db215996cb46c851fc2b72438baf7b8bee9dea75e04346671331300bbf9fc30db250602f07aaa2c6b479eb561870f0c6b9358e3a63bdf7af29cd17df65bc893068ba1705544a90c42bfc0b8f0da0d0726e4c420a1edbffd7dc4986209bf4de34b58b04beab34ea0790119eeee365bdb3af93b63363ac849dca02fe85777e03d9d675c40a82cb29beb2952534d737acf689aae7ffcc6a2df6f30405d4bd610f76097a51391248b81d19ddb982407d698361b8bd1b7688bc5b496b8f69d36c1dfaeb56fe30a66df47e5e9433726e89c3fccd7e65fe8f5af71957d697692ac8c496caed75f3d961c4ba35c375c3980dcb4caf4a8c69fb7ef9cf6103031d7a7b11626bfd50b0bf4ab7b0905644b4cc4b1ca75cde56930c3a6cacc1794ed661ab84bf9c19e199a2cbe9d5a63c1a29a4c5d9f476fe5980cf9877da5095dccf9561987144ce7355440dc7519e539fd3700c8ccb5a883c5f13c52f0849cc498486d1e66a6b98898110b328bfe297474c267e20753f9f90709e026f143651a341d7ddb9454372cf5b312d5b6f043e8d34b8fb53bb9ebd1d923276efa24fef86d46c8630b6d2653fff62ebefa581423a75e9583258487573e1a694ada4c67d6d5ac66b64f71665990c63d5aa5195c994d9e407b0b0f8adf870103cc107b95a716e91ac9a64b1a7d7b8604c90d179e4b147093c9dd5e3085a26d8c0d2115656c047fc95015d778ceb9bae86a4bd503e06a152053073892cf372aeaf82b2432848f2685163d62834b0f7e3c208794a1f2b61e4fa87cf77aab3b252e69cd979abe6f49dffd9f290e67eea866f8820eb53b45aa74f98b371440cfa599b0415dcfe6eead06154733a655df7d382f7af92ec189a17668123aa6f3b0be6867aa0aff90b05eda707bc272bc84d34d25c5df5a40b1848d5dcf9f8860f13395c7dce07136edbd4a58a910983f80bf3e1d1ab4d920ea0b4a6cb354280725394c753e62f1c9ebe064cb7263780671f702119d245e0b9cf20ca0254baed766cadaa0503643324a69879c8ba2838032d522fe6c6c6140bbb1f1417a22cb356b2982dbcb7acdf0c512cf40f6b3ab47a2087f512897d257e8b19fc717fd0c0cddfa3b7602c5f7d091a86c33765583debaa1f72944569dae481734c459adf69f54873baac0301ff23339b7f9362eae9680d474f9006af07c09accc50734bbea3e1a946b15a8b79c9945f801cb60d18200215ed86212baa4e28f56e850b76300f3ea8554a72a26138ea06ab10088df4737ca86304431d4299afbd5d59d90e5428e617d967d147ba2cb929e707ec9662849ec5e7a0ef64fb2b206626ee8b4167ef814524a4b3e8df0b893609104fc88c050cd15363e9675f0546116b63ccfc4e8cb83041b0fd6968260c1d5a2af8da7e2c30eb94ea83944fa4ff4051cd074fe5dae5fc0d241eb8148816f747aa244e9e3c59afabcc0017e668d28a055af172dcda67bfb88428fe8dec4696043c5cd00379e06c8203f5575cc08c84e86e2d10ae7809d606c06e5392a656e923a90571634a0420461a076eabefe3eb8f83ea73fd322224fdb0f346cacf2f842688fc00cedeb80a13675627bc949a5911b8fef3af2aa3840c4d5f2e912330bc3e76fc0372f98696f5d827df7a2bdae0d760d551279962020b7a590ea2c0ac73044de9b87a425a41d94e95c6fe3418c18ad359a1b121c4315d741ada954e6c6d180a10b10d6459a46a20b346359c770928a77a1877f5319a6a23b7f6027439569dbbba4ed1305793a85b8476f75a940380ad9844b78e6ef45909d81b7ac462d531020a54a276f31afaa9ec2e9b1534763bb3e0403549ad7f9f53382ce457e2fde733fff921e6273ce42b69e6dc18d2e1fe88a6e63c415b66b65a2a90b087c08c5e719f8403a2fc08f12338e67ab1abd7ad158b1a8f2318e9a38f7ec738993685f615043ff3d3956a39576b71dd0afc79ecf15215b9d33b8b0ff8f93f0652385da2cb84ced6090fd516ba4dbd580d20e29a3f43e0d19d59d597f9ab257046fa3f9a1c2eca350b004eb8a36716f2755f9d123ff126076c18f5e3426db75e"
            }
        ],
        "receiptsRoot": "0x",
        "stateRoot": "0x",
        "timestamp": "0x63165aa2",
        "transactions": [],
        "transactionsRoot": "0x"
    }
}
```
</TabItem>
<TabItem value="err" label="Error" default>


</TabItem>
</Tabs>
</TabItem>
</Tabs>
<br />



### `zond_getCode`

GetCode returns the code stored at the given address in the state for the given block number.

:::caution
Need to update with working example
:::

<Tabs
    defaultValue="code"
    className="unique-tabs"
    groupId="zond_getCode"
    values={[
        {label: 'Code', value: 'code'},
        {label: 'Usage', value: 'usage'},
    ]}>

<TabItem value="usage">


#### Method

*POST*

#### Parameters

| Field | Type | Required |  Description | 
|---------|-----|-----|-------|
| address | DATA | true  | Zond address to check for code |
| blockNrOrHash | QUANTITY\TAG | true | integer block number (hex), or the string `"latest"`, `"earliest"` or `"pending"`, see the [default block parameter](#default-block-parameter) | 

#### Returns

| Return Value | Type |  Description | 
|---------|-----|-------|
| code | DATA (hex) | The code from the given address. |  


</TabItem>

<TabItem value="code" label="Code">

Required parameters: `address` (*hex*), `blockNrOrHash` (*rpc.BlockNumberOrHash*)

<Tabs
    defaultValue="shreq"
    className="unique-tabs"
    groupId="zond_getCode-code"
    values={[
        {label: 'Curl Request', value: 'shreq'},
        {label: 'JS Request', value: 'jsreq'},
        {label: 'Python Request', value: 'pyreq'},
    ]}>
<TabItem value="shreq" label="Curl Request" default>

```bash
curl --location --request POST 'http://45.76.43.83:4545' \
--header 'Content-Type: application/json' \
--data-raw '{"jsonrpc":"2.0","method":"zond_getCode","params":["0x20d3b46b6f8dceca60278bf19f58c3859465cdc5", "0xabd949f67f478d458d22e5c2722c4bf0e8d11a2eb5b51126d9d473410b9df581"],"id":1}'
```
</TabItem>    
<TabItem value="jsreq" label="Request" default>

```js {} 
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'http://45.76.43.83:4545',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "jsonrpc": "2.0",
    "method": "zond_getCode",
    "params": [
      "0x20d3b46b6f8dceca60278bf19f58c3859465cdc5",
      "0xabd949f67f478d458d22e5c2722c4bf0e8d11a2eb5b51126d9d473410b9df581"
    ],
    "id": 1
  })

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});

```
</TabItem>
<TabItem value="pyreq" label="Python Request" default>

```py {}
import requests
import json

url = "http://45.76.43.83:4545"

payload = json.dumps({
  "jsonrpc": "2.0",
  "method": "zond_getCode",
  "params": [
    "0x20d3b46b6f8dceca60278bf19f58c3859465cdc5",
    "0xabd949f67f478d458d22e5c2722c4bf0e8d11a2eb5b51126d9d473410b9df581"
  ],
  "id": 1
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

```
</TabItem>
</Tabs>

<Tabs
    defaultValue="resp"
    className="unique-tabs"
    groupId="zond_getCode-resp"
    values={[
        {label: 'Response', value: 'resp'},
        {label: 'Error', value: 'err'},
    ]}>
<TabItem value="resp" label="Response" default>

```json 
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": "0x600160008035811a818181146012578301005b601b6001356025565b8060005260206000f25b600060078202905091905056"
}
```
</TabItem>
<TabItem value="err" label="Error" default>

</TabItem>
</Tabs>
</TabItem>
</Tabs>
<br />

### `zond_getStorageAt`

GetStorageAt returns the storage from the state at the given address, key and block number. 

The `rpc.LatestBlockNumber` and `rpc.PendingBlockNumber` meta block numbers are also allowed.


<Tabs
    defaultValue="code"
    className="unique-tabs"
    groupId="zond_getStorageAt"
    values={[
        {label: 'Code', value: 'code'},
        {label: 'Usage', value: 'usage'},
    ]}>

<TabItem value="usage">


#### Method

*POST*

#### Parameters

| Field | Type | Required |  Description | 
|---------|-----|-----|-------|
| address | DATA | true  | address of the storage |
| key | QUANTITY (string) | true | integer of the position in the storage. | 
| blockNrOrHash | QUANTITY\TAG | true | integer block number (hex), or the string `"latest"`, `"earliest"` or `"pending"`, see the [default block parameter](#default-block-parameter) | 


#### Returns

| Return Value | Type |  Description | 
|---------|-----|-------|
| code | DATA (hex) |  the value at this storage position. |  


#### **Example**

Calculating the correct position depends on the storage to retrieve. Consider the following contract deployed at `0x295a70b2de5e3953354a6a8344e616ed314d7251` by address `0x391694e7e0b0cce554cb130d723a9d27458f9298`.

```
contract Storage {
    uint pos0;
    mapping(address => uint) pos1;
    function Storage() {
        pos0 = 1234;
        pos1[msg.sender] = 5678;
    }
}
```

Retrieving the value of pos0 is straight forward:

```js
curl -X POST --data '{"jsonrpc":"2.0", "method": "zond_getStorageAt", "params": ["0x295a70b2de5e3953354a6a8344e616ed314d7251", "0x0", "latest"], "id": 1}' localhost:8545
{"jsonrpc":"2.0","id":1,"result":"0x00000000000000000000000000000000000000000000000000000000000004d2"}
```

Retrieving an element of the map is harder. The position of an element in the map is calculated with:

```js
keccack(LeftPad32(key, 0), LeftPad32(map position, 0))
```

This means to retrieve the storage on pos1["0x391694e7e0b0cce554cb130d723a9d27458f9298"] we need to calculate the position with:

```js
keccak(
  decodeHex(
    "000000000000000000000000391694e7e0b0cce554cb130d723a9d27458f9298" +
      "0000000000000000000000000000000000000000000000000000000000000001"
  )
)
```

The geth console which comes with the web3 library can be used to make the calculation:

```js
> var key = "000000000000000000000000391694e7e0b0cce554cb130d723a9d27458f9298" + "0000000000000000000000000000000000000000000000000000000000000001"
undefined
> web3.sha3(key, {"encoding": "hex"})
"0x6661e9d6d8b923d5bbaab1b96e1dd51ff6ea2a93520fdc9eb75d059238b8c5e9"
```

Now to fetch the storage:

```js
curl -X POST --data '{"jsonrpc":"2.0", "method": "zond_getStorageAt", "params": ["0x295a70b2de5e3953354a6a8344e616ed314d7251", "0x6661e9d6d8b923d5bbaab1b96e1dd51ff6ea2a93520fdc9eb75d059238b8c5e9", "latest"], "id": 1}' localhost:8545
{"jsonrpc":"2.0","id":1,"result":"0x000000000000000000000000000000000000000000000000000000000000162e"}
```

</TabItem>

<TabItem value="code" label="Code">

Required parameters: `address` (*hex*), `key` (string), `blockNrOrHash` (*rpc.BlockNumberOrHash*)

<Tabs
    defaultValue="shreq"
    className="unique-tabs"
    groupId="zond_getStorageAt-code"
    values={[
        {label: 'Curl Request', value: 'shreq'},
        {label: 'JS Request', value: 'jsreq'},
        {label: 'Python Request', value: 'pyreq'},
    ]}>
<TabItem value="shreq" label="Curl Request" default>

```bash
curl --location --request POST 'http://45.76.43.83:4545' \
--header 'Content-Type: application/json' \
--data-raw '{"jsonrpc":"2.0","method":"zond_getStorageAt","params":["0x20d3b46b6f8dceca60278bf19f58c3859465cdc5", "0x0", "latest"],"id":1}'
```
</TabItem>    
<TabItem value="jsreq" label="Request" default>

```js {} 
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'http://45.76.43.83:4545',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "jsonrpc": "2.0",
    "method": "zond_getStorageAt",
    "params": [
      "0x20d3b46b6f8dceca60278bf19f58c3859465cdc5",
      "0x0",
      "latest"
    ],
    "id": 1
  })

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});

```
</TabItem>
<TabItem value="pyreq" label="Python Request" default>

```py {}
import requests
import json

url = "http://45.76.43.83:4545"

payload = json.dumps({
  "jsonrpc": "2.0",
  "method": "zond_getStorageAt",
  "params": [
    "0x20d3b46b6f8dceca60278bf19f58c3859465cdc5",
    "0x0",
    "latest"
  ],
  "id": 1
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

```
</TabItem>
</Tabs>
<Tabs
    defaultValue="resp"
    className="unique-tabs"
    groupId="zond_getStorageAt-resp"
    values={[
        {label: 'Response', value: 'resp'},
        {label: 'Error', value: 'err'},
    ]}>
<TabItem value="resp" label="Response" default>

```json 
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": "0x0000000000000000000000000000000000000000000000000000000000000000"
}
```
</TabItem>
<TabItem value="err" label="Error" default>

</TabItem>
</Tabs>

</TabItem>
</Tabs>
<br />


### `zond_call`

Executes a new message call immediately without creating a transaction on the block chain.


Call executes the given transaction on the state for the given block number. Additionally, the caller can specify a batch of contract for fields overriding.

:::note
This function doesn't make and changes in the state/blockchain and is useful to execute and retrieve values.
:::

:::caution
Need to update with good response from call
:::

<Tabs
    defaultValue="code"
    className="unique-tabs"
    groupId="zond_call"
    values={[
        {label: 'Code', value: 'code'},
        {label: 'Usage', value: 'usage'},
    ]}>

<TabItem value="usage">


#### Method

*POST*

#### Parameters

| Field | Type | Required |  Description | 
|---------|-----|-----|-------|
| args | Object | true |  The transaction call object |
| blockNrOrHash | QUANTITY\TAG | true | integer block number (hex), or the string `"latest"`, `"earliest"` or `"pending"`, see the [default block parameter](#default-block-parameter) | 

**Args Parameters**

Args provided in array.

| Field | Type | Required |  Description | 
|---------|-----|-----|-------|
| from | DATA (20 Bytes) | false  | address of the storage |
| to | DATA (20 Bytes) | true  | address of the storage |
| gas | QUANTITY (Uint64) | false  | Integer of the gas provided for the transaction execution. zond_call consumes zero gas, but this parameter may be needed by some executions. |
| MaxFeePerGas | QUANTITY (Uint64) | false  | |
| MaxPriorityFeePerGas | QUANTITY (Uint64) | false  |   |
| Value | QUANTITY (string) | false | Integer of the value sent with this transaction | 
| Nonce | QUANTITY\TAG | true | integer block number (hex), or the string `"latest"`, `"earliest"` or `"pending"`, see the [default block parameter](#default-block-parameter) | 
| Data | DATA| false | | Hash of the method signature and encoded parameters. |
| AccessList | | | | |
| ChainID | | | | |

#### Returns

| Return Value | Type |  Description | 
|---------|-----|-------|
| code | DATA (hex) |  the value at this storage position. |  


</TabItem>

<TabItem value="code" label="Code">

- Required parameters: `args` (*object*), `blockNrOrHash` (*rpc.BlockNumberOrHash*)
- Required Args Parameters: {`to`, `Nonce`}

<Tabs
    defaultValue="shreq"
    className="unique-tabs"
    groupId="zond_call-code"
    values={[
        {label: 'Curl Request', value: 'shreq'},
        {label: 'JS Request', value: 'jsreq'},
        {label: 'Python Request', value: 'pyreq'},
    ]}>
<TabItem value="shreq" label="Curl Request" default>

```bash
curl --location --request POST 'http://45.76.43.83:4545' \
--header 'Content-Type: application/json' \
--data-raw '{"jsonrpc": "2.0", "id": 1, "method": "zond_call", "params": [{"from": "0x20748ad4e06597dbca756e2731cd26094c05273a", "chainId": "0x0", "nonce": "0x0", "gas": "0x61184", "gasPrice": "0x2710", "to": "0xbc96cf604092dc53c5021fb122ddb2dffad75821", "value": "0x0", "data": ""}, {"blockNumber": "latest"}] }'
```
</TabItem>    
<TabItem value="jsreq" label="Request" default>

```js {} 
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'http://45.76.43.83:4545',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "jsonrpc": "2.0",
    "id": 1,
    "method": "zond_call",
    "params": [
      {
        "from": "0x20748ad4e06597dbca756e2731cd26094c05273a",
        "chainId": "0x0",
        "nonce": "0x0",
        "gas": "0x61184",
        "gasPrice": "0x2710",
        "to": "0xbc96cf604092dc53c5021fb122ddb2dffad75821",
        "value": "0x0",
        "data": ""
      },
      {
        "blockNumber": "latest"
      }
    ]
  })

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});

```
</TabItem>
<TabItem value="pyreq" label="Python Request" default>

```py {}
import requests
import json

url = "http://45.76.43.83:4545"

payload = json.dumps({
  "jsonrpc": "2.0",
  "id": 1,
  "method": "zond_call",
  "params": [
    {
      "from": "0x20748ad4e06597dbca756e2731cd26094c05273a",
      "chainId": "0x0",
      "nonce": "0x0",
      "gas": "0x61184",
      "gasPrice": "0x2710",
      "to": "0xbc96cf604092dc53c5021fb122ddb2dffad75821",
      "value": "0x0",
      "data": ""
    },
    {
      "blockNumber": "latest"
    }
  ]
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

```
</TabItem>
</Tabs>

<Tabs
    defaultValue="resp"
    className="unique-tabs"
    groupId="zond_call-resp"
    values={[
        {label: 'Response', value: 'resp'},
        {label: 'Error', value: 'err'},
    ]}>
<TabItem value="resp" label="Response" default>

```json 
HELP
```
</TabItem>
<TabItem value="err" label="Error" default>

```json title="Insufficient Gas for tx"
{
    "jsonrpc": "2.0",
    "id": 1,
    "error": {
        "code": -32000,
        "message": "err: insufficient funds for gas * price + value: address 0x20748aD4e06597DbcA756E2731CD26094C05273a have 0 want 3977000000 (supplied gas 397700)"
    }
}
```

```json title="Insufficient funds for Gas in wallet"
{
    "jsonrpc": "2.0",
    "id": 1,
    "error": {
        "code": -32000,
        "message": "err: insufficient funds for gas * price + value: address 0x20748aD4e06597DbcA756E2731CD26094C05273a have 0 want 3977000000 (supplied gas 397700)"
    }
}
```


</TabItem>
</Tabs>

</TabItem>
</Tabs>
<br />


### `zond_getBlockTransactionCountByNumber`

Returns the number of transactions in a block matching the given block number.

<Tabs
    defaultValue="code"
    className="unique-tabs"
    groupId="zond_getBlockTransactionCountByNumber"
    values={[
        {label: 'Code', value: 'code'},
        {label: 'Usage', value: 'usage'},
    ]}>

<TabItem value="usage">

#### Method

*POST*

#### Parameters

| Field | Type | Required |  Description | 
|---------|-----|-----|-------|
| blockNr | QUANTITY\TAG | true | integer block number (hex), or the string `"latest"`, `"earliest"` or `"pending"`, see the [default block parameter](#default-block-parameter) | 


#### Returns

| Return Value | Type |  Description | 
|---------|-----|-------|
| transactions | QUANTITY (*int*) |  integer of the number of transactions in this block. |  


</TabItem>

<TabItem value="code" label="Code">

- Required parameters: `blockNr` (*QUANTITY\TAG*)

<Tabs
    defaultValue="shreq"
    className="unique-tabs"
    groupId="zond_getBlockTransactionCountByNumber-code"
    values={[
        {label: 'Curl Request', value: 'shreq'},
        {label: 'JS Request', value: 'jsreq'},
        {label: 'Python Request', value: 'pyreq'},
    ]}>
<TabItem value="shreq" label="Curl Request" default>

```bash
curl --location --request POST 'http://45.76.43.83:4545' \
--header 'Content-Type: application/json' \
--data-raw '{"jsonrpc":"2.0","method":"zond_getBlockTransactionCountByNumber","params":["0x0"],"id":1}'
```
</TabItem>    
<TabItem value="jsreq" label="Request" default>

```js {} 
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'http://45.76.43.83:4545',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "jsonrpc": "2.0",
    "method": "zond_getBlockTransactionCountByNumber",
    "params": [
      "0x0"
    ],
    "id": 1
  })

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});

```
</TabItem>
<TabItem value="pyreq" label="Python Request" default>

```py {}
import requests
import json

url = "http://45.76.43.83:4545"

payload = json.dumps({
  "jsonrpc": "2.0",
  "method": "zond_getBlockTransactionCountByNumber",
  "params": [
    "0x0"
  ],
  "id": 1
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

```
</TabItem>
</Tabs>

<Tabs
    defaultValue="resp"
    className="unique-tabs"
    groupId="zond_getBlockTransactionCountByNumber-resp"
    values={[
        {label: 'Response', value: 'resp'},
        {label: 'Error', value: 'err'},
    ]}>
<TabItem value="resp" label="Response" default>

```json 
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": "0x191"
}
```
</TabItem>
<TabItem value="err" label="Error" default>


</TabItem>
</Tabs>

</TabItem>
</Tabs>
<br />

### `zond_getBlockTransactionCountByHash`

Returns the number of transactions in the block with the given hash.

<Tabs
    defaultValue="code"
    className="unique-tabs"
    groupId="zond_getBlockTransactionCountByHash"
    values={[
        {label: 'Code', value: 'code'},
        {label: 'Usage', value: 'usage'},
    ]}>

<TabItem value="usage">

#### Method

*POST*

#### Parameters

| Field | Type | Required |  Description | 
|---------|-----|-----|-------|
| blockHash | DATA (*hex*) | true | 32 Bytes hash of a block | 

#### Returns

| Return Value | Type |  Description | 
|---------|-----|-------|
| transactions | QUANTITY (*int*) |  integer of the number of transactions in this block. |  

</TabItem>

<TabItem value="code" label="Code">

- Required parameters: `blockHash` (*DATA*)

<Tabs
    defaultValue="shreq"
    className="unique-tabs"
    groupId="zond_getBlockTransactionCountByHash-code"
    values={[
        {label: 'Curl Request', value: 'shreq'},
        {label: 'JS Request', value: 'jsreq'},
        {label: 'Python Request', value: 'pyreq'},
    ]}>
<TabItem value="shreq" label="Curl Request" default>

```bash
curl --location --request POST 'http://45.76.43.83:4545' \
--header 'Content-Type: application/json' \
--data-raw '{"jsonrpc":"2.0","method":"zond_getBlockTransactionCountByHash","params":["0xdf035d2e1b1b2133339612e747af7a5b1a1cb91d802b13c0636d7624c23158cb"],"id":1}'
```
</TabItem>    
<TabItem value="jsreq" label="Request" default>

```js {} 
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'http://45.76.43.83:4545',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "jsonrpc": "2.0",
    "method": "zond_getBlockTransactionCountByHash",
    "params": [
      "0xdf035d2e1b1b2133339612e747af7a5b1a1cb91d802b13c0636d7624c23158cb"
    ],
    "id": 1
  })

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});

```
</TabItem>
<TabItem value="pyreq" label="Python Request" default>

```py {}
import requests
import json

url = "http://45.76.43.83:4545"

payload = json.dumps({
  "jsonrpc": "2.0",
  "method": "zond_getBlockTransactionCountByHash",
  "params": [
    "0xdf035d2e1b1b2133339612e747af7a5b1a1cb91d802b13c0636d7624c23158cb"
  ],
  "id": 1
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

```
</TabItem>
</Tabs>

<Tabs
    defaultValue="resp"
    className="unique-tabs"
    groupId="zond_getBlockTransactionCountByHash-resp"
    values={[
        {label: 'Response', value: 'resp'},
        {label: 'Error', value: 'err'},
    ]}>
<TabItem value="resp" label="Response" default>

```json 
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": "0x191"
}
```
</TabItem>
<TabItem value="err" label="Error" default>


</TabItem>
</Tabs>
</TabItem>
</Tabs>
<br />


### `zond_getTransactionByBlockNumberAndIndex`

GetTransactionByBlockNumberAndIndex returns the transaction for the given block number and index.

<Tabs
    defaultValue="code"
    className="unique-tabs"
    groupId="zond_getTransactionByBlockNumberAndIndex"
    values={[
        {label: 'Code', value: 'code'},
        {label: 'Usage', value: 'usage'},
    ]}>

<TabItem value="usage">

#### Method

*POST*

#### Parameters

| Field | Type | Required |  Description | 
|---------|-----|-----|-------|
| blockNr | QUANTITY\TAG | true | integer block number (hex), or the string `"latest"`, `"earliest"` or `"pending"`, see the [default block parameter](#default-block-parameter) | 
| index | QUANTITY (*int*) | true | the transaction index position |

#### Returns

| Return Value | Type |  Description | 
|---------|-----|-------|
| Object | Transaction Object | A transaction object, or null when no block was found |  

##### Return Object Definition

- **blockHash -** 
- **blockNumber -** 
- **from -** 
- **gas -** 
- **gasPrice -** 
- **hash -** 
- **nonce -** 
- **to -** 
- **transactionIndex -** 
- **value -** 
- **type -** 
- **chainId -** 
- **signature -** 
- **pk -** 


</TabItem>

<TabItem value="code" label="Code">

- Required parameters: `blockNr` (*QUANTITY\TAG*), `index` (*int*)

<Tabs
    defaultValue="shreq"
    className="unique-tabs"
    groupId="zond_getTransactionByBlockNumberAndIndex-code"
    values={[
        {label: 'Curl Request', value: 'shreq'},
        {label: 'JS Request', value: 'jsreq'},
        {label: 'Python Request', value: 'pyreq'},
    ]}>
<TabItem value="shreq" label="Curl Request" default>

```bash
curl --location --request POST 'http://45.76.43.83:4545' \
--header 'Content-Type: application/json' \
--data-raw '{"jsonrpc":"2.0","method":"zond_getTransactionByBlockNumberAndIndex","params":["0x0", "0x1"],"id":1}'
```
</TabItem>    
<TabItem value="jsreq" label="Request" default>

```js {} 
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'http://45.76.43.83:4545',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "jsonrpc": "2.0",
    "method": "zond_getTransactionByBlockNumberAndIndex",
    "params": [
      "0x0",
      "0x1"
    ],
    "id": 1
  })

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});

```
</TabItem>
<TabItem value="pyreq" label="Python Request" default>

```py {}
import requests
import json

url = "http://45.76.43.83:4545"

payload = json.dumps({
  "jsonrpc": "2.0",
  "method": "zond_getTransactionByBlockNumberAndIndex",
  "params": [
    "0x0",
    "0x1"
  ],
  "id": 1
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

```
</TabItem>
</Tabs>

<Tabs
    defaultValue="resp"
    className="unique-tabs"
    groupId="zond_getTransactionByBlockNumberAndIndex-resp"
    values={[
        {label: 'Response', value: 'resp'},
        {label: 'Error', value: 'err'},
    ]}>
<TabItem value="resp" label="Response" default>

```json 
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "blockHash": "0xdf035d2e1b1b2133339612e747af7a5b1a1cb91d802b13c0636d7624c23158cb",
        "blockNumber": "0x0",
        "from": "0x2065964b91ea677fd22f7029e2ac0cb506a87636",
        "gas": "0x7530",
        "gasPrice": "0x2710",
        "hash": "0x0771a6c7fe9b6b5db115b4a05a8bd46b270037ca837303204dd3778778338a2a",
        "nonce": "0x2",
        "to": "0x20b9128ba1f6357f9b09181bf982d2ec9e7c8228",
        "transactionIndex": "0x1",
        "value": "0x640b5eece000",
        "type": "0x2",
        "chainId": "0x0",
        "signature": "0x84b40ced3539940f05400a9636922c17b60e1cef57ea8a4df7043eaa42ad0cd47db2a02b427d47d50b15b3dc3631930fb4e517bef0b3940a89ca6c94ee95e7e4f1a81c5ff41873e14dc64900494419810b0eeee9345827b6ca111f918c3a06f583cc70193f7919bdbe531265322a2b973d38220e78d214002379071327fd4429b746f63c38f8457f47b53ff5acb3114646386b88ceaa8b7bd8ca064bdc5305fa1e2aaef18598b37e2529df7ab7c911648fc6c326f30fc4ff398c408337311b0db62ea364c5db784d87cd8008a7d5f88ac4e8dc4b74416444b6e55075a72174d0386cd8788c99b8e1ff2d7c3054811b53994b1c96ee9e2023160decd3d05270577c327963c9feece0243f9d5b3f9a6657debed570424c54d4eedd647a1c19c66c7853b6d3a824397951469fbcc82cfd9ba3ec910e2f4a409385f385c56f2ee2fa9d935120a62c6271fbdae7ef2401e7038ff75170947c4df8a1545137794a8fadc4f91877d1dc481f74cdf37dd4f4b3d25a1e7fbada85e7ec7c88567ab412b68645e1b75de823f51d1ec5d83f3a2499549d8a5c15caf02a9b6288903bca749b90a3bce8663d31f7ee7bc4d2777e6599aba615bab1e1b89220f9a9c7c237ec5a8cba98803d6c7f52e8744cb34ef975207e231c9420c34475168fdd3bb8c43726648b56ebdb70bd62a0e61c76a903abf5e0a8a407f60fe0ab6d93f39ffd5b3dd7d93fa06d31e9490ae945d3afee45791dea998455c344b0f5fb43f595eed52530088dbc81b1c0355a9081b23c8fd3000e0377db8d74ee279ff02370f7f009ce5d857caa1e74a33ba9c4bbb66b48ccdd46e3000d14c650c238e8ad841ce274c5a41629fb1f07b85b02938a9d70defc53ab451b434a7039da8f50bed5edab7563da192bb0ff7087b84e7d0e2fe407e7bbfcf0aa8072f135422f18ec3cd1a4d8bed0f4510097c12f9e5e51f696ccc1bf243041c391b36a6d306b7cecde26e3901b10656b17cfaba696ebf69561915b33c856766b4b53a8eae31f5ba3bb088e0f8ba53d4de30a785e39f387ab44b4e936e52f655a51c633bbed3eb365b475ce23331a467b92c3eb9989dbc62bd6aa88a4bdb7853a8840cb36ae4a17b2a0d22154d631eb7c3b27faa41e9badb07e43894a7028617da721a71c7099791b2729a2ead1678a61358fca3ea4e3d0ad61eefe18a546953f573519f4e309c10660b161317c56d07c8ced506cffb113c3e1d0a589eb0d6641d6798ca7dd171d18d51b3f36c913277c96a5372dcec97b07a5e1b44a21cbcf02006d37e7d2e273395afd67421e9378c2760053f85280c5f1c7b386b05b4014522f656b3731ec5a262c9a95c1404acc20b26d041491af9eab7fc3d4a84d3950846a1da6592d49878d1a519346a40c6784fd451bb6d57c00f53cdf8cbd3a589a4ebfc21c91d92d578f81e5c59dc2859ec81dc860c4b96b67012c2b26e91a81640b12a7de8639488409ca5e58755f7b1c4581c17cc942bd58a70fca7e20ae00ba92b550f6d606faa8f417b5e1a419b0549b0eeeea2b4cfcee796d68808bb3a33e3317de7b57fb1b56768de08e5b845d8b01e4d3e60db1a9f1de6278c82919b39a287ae5b71b6c7f0c971a3891455044430a88d2ecdefc0e5bb67714d4804b0ae80284bee73b6ba2454f2b503c5e1ffc686eb6c9b64b84794b3503c8a276c844b58b7929fdab7351b12abefe64a9f00792fd3236e6e06679b48f0886ee09ad283ee0a65df2c3c81c925c5fa34b7cca2d7fe3e02a941fcde5bc808beb07a1c302239381f562d09a77fbbcf6bc08b02824ae9927cd4802e2d18a837a35b11ee9e6bd42296165765c2fcdbb8119f81e7ed79b9b7e2ebe697e44a7c7b036efe5fa921e40b55efb9b628ad922f505f3ab41d6971aad4e962b77f7880adf4674f969957e3fed43a2ae30297510fcfeb92156cc5dd0e66e5afc8af6e18bd4f5efbd47b07b568e84dbed1df230ec40f2b9a6a71a581c2af68014a9ff28d6dd9ce1eec2520f7bf4c44557daea2373b8c3b74b912cafc9ed36975341633912d7b96b1348ca9516a6f713dd95aac9ddb6b2eca67ce628e07f164fe174cb2eec93deaa7af29ed62d1a311ec87ac744fe10778e58fbbe630185fe0226174c8cb818e27235a3be055c44ae4779714df48339c9e2a2521a65a4c91a8c73e56bd38cc05d0ad6d1c6211e1870d4d430333d2b7f0cc2962632741330025c9ce51ce75d01daadf2030b708c51260b25015aeb26c9c7ec209eb7d99d889ca295b820309b5c5d300b66cf9d831f919fc3751400a6496d5b14c66763c6c02af966bb1f353edb38cb6b5b22fa7d890d37cff7ce944c8cca992145351f5b83728a33cdc811867ae3a9241b394a952f51c9681c536d60a7ea6012e24f1afd187f4114b0449db2337a7e0cf71d7c35758761fbfe4597985b0f2bef4b859aad1cb828b267ddb9505f2cfe18f4ea80b4b0b981c3be450692fe88ff0336608b80b024b5ee86c23dcf245896370949d5d100524b18a99a627eac4d0e0a28248a0c0592721bf0003d8318d3b131134f0326143cdc72857f870f79a0a1204de5fb06198f5fe31a26b06230e6c6fbdc565284f6260461ca7a0d83ba7bcfe6383048bd5b6e3d6d8dc7790a6e4bd8a5b51db3f2d994650540506b0092285b76ec9ab93424a79b441645730ea7f5046d26b75015308bd2f03c0eaa0ce7f8e4ab9d0c9cdd4fcecc8b37cc13b30253f6164831cc38263238fd14c51e45a03a945f552d6e3c2f7361de99017fdf4eca10ab59d2a54e9a3d0b12955de84b02980c2aa21af65a1ffd8682bceffd1722f95254fbf4f503ffc66a0ee6b73b98e9671bad4359af4216ebd8c6b1bc8db30b66796e068fb3bc02ac7db6e15b464018ac5139ef152fd7f003adecf61f64356d26b37b08ba5d8199f9b71c6ee6c910405d32391222b3349b6540d77ad80c75e79194617cc2a4ec2015883f74ba0a6a5ab8db6b7694113809b30fcacbd5dd52aaabf7d2bb63e6d3419f887a0f2b64c550a72ed2f605f0e51cfd5d33607214b6b59684f6f33ded0f1090c1550601ec6bfeaf48d9dfb88380a80fcbe11e1a3ffc9190aeca5dc3053d8788be5f5a8dd427b957c069f1cd7b9673df8bc1e1a1376d6bd41ad9a81b0e5bb3e33dc855cf8193f5daf25702a7246eefcf80546b9f9a43de0e86b271449bf35eb6984feac88e3f9b2c8f2e2510021e32fc267b0b7bf4a6b426858530e89712bc31a735066d46daa70bfd504879cd4895c3f4dc25d4687e1c3da9b378a1db58ef87b3774de0c1a88247b3cb990606e09735e5952aca007153e9f04c83e4526ce56b3e0d77b50811d2f1d08f475500b3bcf045db5793ba43c1067044a1eba80923fa86d019895b2d604b844b4b40169a3070b780e5d56bc72cd3041b8322ba26be930bc3d0c0e25fedeac52786456e9075dfd6a6e3015ffb42e81b34ed77659e3a47100fc3a9b70d90bca512f0740ee160a4b7186edcb5c89f1be27297f205b4ff542a1f98bd07b2d926f5c5b1698a016f096921d4125a3fbb9a30995f808ee5db61b0d8683b03b4d5a572def6128bad16c5343895311a9b3a1770402917f8a341a0116825258a3719ad3747a8f3940c16273c4c05475a5d7071788db3d4dee931555874929cbccbd6fc183338405d6192b6c0ccdadcebf4f7f9fc0a0e121d50676f7182889b9ca4aab5dddedff7f8fd021d2132353944459badb0b1c2d5e1e4020604c82c00c0a0044710201b05983aa80180226c9200025440040098004600509b874a7bf8ea0f",
        "pk": "0x16832c161d47289b25afea85a9c57301831ff5787214f03e0c4b848dc79aec23389bb455602a61741f393583ff6ecd59c7351159347f751977f816660240d5d79dff2097f4b87f6cf3a34b6feefd31316e85061f2753f5b5d30e18525b66551d1c3c0677307e902162316a4e8d7ee7e7ac38ca5be6ff45c5aa3334d267f95147f151cdd6c37aa4520ffb1f63276fa9048de2b222b3ddbaf690051bc6755e922c96ee9529b8450e00422aa02d64ea6bf2371a93a0eee54a46b6c381764aeed6234dd7a78f50758b5379afcf5c0a291dededf18f474cefc4b182d1d0bf2abfc85cd641ea04ee733a8e2c851df695e22f63da4e65504fd037cd1ae7d607461a1da580c0711ef5349b065623d43d15789b3ee6da213222481cdb20663e05cef6c6499f18f6480e2ae4dc9bc479e0f51d5d5723609661ff2265bff7d82f9f896adfc3d63b5b60a117c3c23ae416c12125d4219b1527f78c972d87384df1a970ea6ee67eafda7139b381562f7d2fe11cf3ba300872d76a840bb7992bd03d0039c981d4d1e871be08ea772a383930e0baca11d560de5c7a296cd5db2c78a39a9d25ab89c95889a360eed97648be1f6e88e04f757bbf7a9c65012b0a078ba0cfd12ee4ef159c9844eb016ef909118a756a323c50b63f9c6ef682e062999ca1fa8929fd3adccac7133fb4827d7d4cef84d4390a5e551a20b2c1c14a52140fa3aad38e835db69ee9b7700bf47c67fbd6104569638ff5e3fd2144e7b4985d125c845170bb478e1ab2dfa2e6af3f491bbdf220702c91b8052b9e2852e9f2a58fdbe0419404496773204bf8ccb77e7ca3a4b468ce07236c649fcbca3f2131c5ad8f699bfed8dbc8be6967d2f463ddbe0956fe5bd04092401d132bf562081ce3012cbd0c08262fb3ca80c7a2e388fd4a5cf14d16260479b08a02c6b5a93159ddae315ec715aec401832ba5606be97762a204c97eb707877125c42181b4033796b7b1cbee495f353c1e15f25ea6bc2ba937c65f968ef4229d636004c54b2771ff6a176d147439a2e7bce8a531c8c81109f56290fa866e53787eac21a33df62a05ee3c38e7692240a55d1e1f3b6d5ed407600f786b13c17139da82b5bdbf13ef759f3e9f223d19d96ff6adac12c7bc6fc2c0548da38fc76a6b9a9e584e347140c652c24245db0793f1431e023ee512ffc1291929139c748e490b9342d80bff97dc350500f6cf6e208f90d6ff989a1fb7c5fab0c15af5616fb2f0c014edda2702a9d35de04a5552ae40bc3ba2bb42cf152305172f690fbaf426327e4992d3cb3883052c4b7de23a29917e50ad8305126635d2a5db09ff3f5c6b5803995dfe1da186e149bbef857fdaac411933c614db2ee388f96869451631aa28430c2ee649bbf847b0af7994232d3fb5a90004504240e9cc5940365bfc9cce03cffcc4807be19528713dc8b6a9c779fff6ab4f6eebbfe67e4b3b73a15303e05e123549abce312b84d74cd90c70d8b95603877e072a1dbfd4b3a4945d33905f7927d9e6181cdb0d38fde5ffc9bd5e4fdb71d7376c808c184938910798e16c8296baa96917cf4e60d9750267f8707b019e7e81cef236a3def3aa2bdeadc2f564f862f6c85419caf0c9e0b60fc86b34068969167c11840ecb958b5ecd45c42ff165eef9b48b994c2fa5de7a28a9c1ccc6c42e8c6400d27ef082a0f3205ee4c57e1281aab5c4bf07cbd2101e2b0dc85e486b6e5c8300e61599a2f77fe16ffce6504f763030e5c04872ed5c8611bbad5155616dd2074b2423908b1c1d546721b04d5df7a2279137be111127c19271643ab2a487f9b8c1511691021c66ec5eadec7968dbafe0148ba7f9897d2f8fe05e8be09db6250f404878f5d4a957dff73ad4773e0aca21d8ee6a905c395f46cfa211501a7218a304dfb52dcfa28b99e21652769311612cab78b882135d2a50e27f331f570574adad9d079c93c52a23cd0d32adfe68207eac9784c897ffd0d186f1c6d2d089c217fa179720e8195666dab861338a2bc5d7eaaa1dac10e6bee6cb8665590f723fa3f7b0479d45ec900d070dea09bdb2305dac8133551cac9fd35f58f1"
    }
}
```
</TabItem>
<TabItem value="err" label="Error" default>

```json title=""

```
</TabItem>
</Tabs>
</TabItem>
</Tabs>
<br />


### `zond_getTransactionByBlockHashAndIndex`

GetTransactionByBlockHashAndIndex returns the transaction for the given block hash and index.


<Tabs
    defaultValue="code"
    className="unique-tabs"
    groupId="zond_getTransactionByBlockHashAndIndex"
    values={[
        {label: 'Code', value: 'code'},
        {label: 'Usage', value: 'usage'},
    ]}>

<TabItem value="usage">


#### Method

*POST*

#### Parameters

| Field | Type | Required |  Description | 
|---------|-----|-----|-------|
| blockHash | DATA (*hex*) | true | 32 Bytes hash of a block | 
| index | QUANTITY (*int*) | true | the transaction index position |

#### Returns

| Return Value | Type |  Description | 
|---------|-----|-------|
| Object | Transaction Object | A transaction object, or null when no block was found |  

##### Return Object Definition

:::caution
HELP!!
:::

</TabItem>

<TabItem value="code" label="Code">

- Required parameters: `blockHash` (*QUANTITY\TAG*), `index` (*int*)

<Tabs
    defaultValue="shreq"
    className="unique-tabs"
    groupId="zond_getTransactionByBlockHashAndIndex-code"
    values={[
        {label: 'Curl Request', value: 'shreq'},
        {label: 'JS Request', value: 'jsreq'},
        {label: 'Python Request', value: 'pyreq'},
    ]}>
<TabItem value="shreq" label="Curl Request" default>

```bash
curl --location --request POST 'http://45.76.43.83:4545' \
--header 'Content-Type: application/json' \
--data-raw '{"jsonrpc":"2.0","method":"zond_getTransactionByBlockHashAndIndex","params":["0xdf035d2e1b1b2133339612e747af7a5b1a1cb91d802b13c0636d7624c23158cb", "0x0"],"id":1}'
```
</TabItem>    
<TabItem value="jsreq" label="Request" default>

```js {} 
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'http://45.76.43.83:4545',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "jsonrpc": "2.0",
    "method": "zond_getTransactionByBlockHashAndIndex",
    "params": [
      "0xdf035d2e1b1b2133339612e747af7a5b1a1cb91d802b13c0636d7624c23158cb",
      "0x0"
    ],
    "id": 1
  })

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});

```
</TabItem>
<TabItem value="pyreq" label="Python Request" default>

```py {}
import requests
import json

url = "http://45.76.43.83:4545"

payload = json.dumps({
  "jsonrpc": "2.0",
  "method": "zond_getTransactionByBlockHashAndIndex",
  "params": [
    "0xdf035d2e1b1b2133339612e747af7a5b1a1cb91d802b13c0636d7624c23158cb",
    "0x0"
  ],
  "id": 1
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

```
</TabItem>
</Tabs>


<Tabs
    defaultValue="resp"
    className="unique-tabs"
    groupId="zond_getTransactionByBlockHashAndIndex-resp"
    values={[
        {label: 'Response', value: 'resp'},
        {label: 'Error', value: 'err'},
    ]}>
<TabItem value="resp" label="Response" default>

```json 
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "blockHash": "0xdf035d2e1b1b2133339612e747af7a5b1a1cb91d802b13c0636d7624c23158cb",
        "blockNumber": "0x0",
        "from": "0x2065964b91ea677fd22f7029e2ac0cb506a87636",
        "gas": "0x7530",
        "gasPrice": "0x2710",
        "hash": "0xf47abf9b8585ab6ca909b6f8529822ca95e4984f1d4f0e160ca5b77475c6765c",
        "nonce": "0x1",
        "to": "0x20177149ddf6dc544475955ac36369b6646e75e5",
        "transactionIndex": "0x0",
        "value": "0x640b5eece000",
        "type": "0x2",
        "chainId": "0x0",
        "signature": "0x47bd81f1b4d5077329928a3534be8906c1868d584cd86a54fb7722c55a940251cdd426c5b24c11688aeeecd3f425510a725e18844e5ea9c2f2723e0519b18ffb271640b90e1b2763af537e408b1d0c8b2e5760495275204e4f65616e49e376834ef3a3cd147cb527785f862a5a9b88c3550c5dabe8780a87254f26c3d7cfdf473160761f703b1b0a9037218f5485cbc517d79cade43c2745fd287d1e7bdcc0a429f08c1b1c04e45183ea7df8f37102672e05a611a9e5f43003b72e3927835bc30a95724c691fcecd4ae4fc6d39bb0500a4bfeb2676899705dbff42cdc2e081bec692ca665d0235970a7932a74ab483250a22752263f3d9e4df197c1498b2757e009b39ec5a129be7759418ed25ff68e2f80113165cfffd679a1c0e82bd5c626c8639b0e508ba9529689fac9a72addff613dcc49bcddeb7ec3408fdc9cb5cd2c51345030487bfc012f06d658c8065728be6f23402da97424508dd1b0c9644ed1ba44c4b1ccbd07f785d7ccf4b4823a6344cc95329f7646f7cbcabee7fb7de10936980f560b582622cb23babeeb7fcace8c20598bacae487a487a5569ea28e1c55367b27a688aedb6901f84bf9a11106cf6f2cea03518a1141efbbf9e5e83394677e82ed2b9768bee3f322119a3b5db703d6f9e45aef2ace516285cb4124a1737d933375d4e0049121102fde4682871974df94ea6b93c55bc70231e26421a20e193eedd9a76ab95203fd2b2ba7a5553c85cdc118ba6d5091398d7e656798c8d1dbe73e0e2e5da6987a06dc811e855fb88d5cac75640eb755eb1086955fd83b4f2d10010e58100a7d24d10d433567fd74bf18a35d21df2870e73ba8d57ee76eed317ed56aab49ea5ef3eeaa79ba353f9ad3b45d646d528cfe6e1991148b497256f091d6a004b940d3e5acd94ed211aa117cda93362f5e07a8d50057aadf5473ceeec1d42d96807484441052ea64c23ac04bad7154f8816f9788e1b381d8528f9e1298895d24381d0d923793da51353ee68cd4ce090a1fd05cc3405101c6301b7e97de38d08040a4fa5997dc0f2de6de102fece76bd89b0050b6d540577968a4d43b480fd17f8889690c66da0db649b90a24bb718805a4e247878501b1904367bcae585dc51093567f28c16115dcbe36f83c321b366af475f716ac272394f44aca3ff4787c9dce187d0bcbd02a93c25d9765f69c34d9b21265917e25da09f7083d2c7ab1b32e2ce8e5d56792be3e826211177561cdcb2371cebd2610276c17d8719a25b7ed300617c5850165f0217e52fa5d2266fc7572a9247e2b442ee46726e5aaeaded70609ba7389535ce66f461b65a82120a1a0a782c91048bf15a5b9f4af0fc0db77005064086536a323f008588a2b7fa28b2002a6ef8c5c8afc81368bea6237c811040c534e6648ce1af5a72ab07a16c1773b0889759e4feafe71284f72bb07b98f7849f1b387251fbd854ea53b70d0ed3867c8b46c2193380eaca7f7aca76e15ad752dbc38c8b59e5b924e27c978893bec4824ba08c254edef3edf084daff31cdf7a03003bbbdefd9bd22bc454a8bc94f6a63df7ef26fd22592ceabb2b166aac82cab2287475d4293daff368723d4927a5b7f17ab9b5a7c3f0234b98a2adcf572bc6dce09ef9e850e878620590af8e2f5a3ee0c6cde130587c9ab4c721c24e22475c2c800c4eb133239183816ae30787864ffa7a81fdabe624a5f968fc6f52afb72446f905d14ece00bd38a00e5df8d418f7ec719cf8d1af104878416ec4df4fa514444d49ba168013844a787f714515065fae8b07aacf7492cc7e0e59c7fe12bd05fc4b96b3da3479e8abbc19074b70f8173714f3ad46876724edba848cc28637e54a5836762d7aab1356fdf324b26cfe2f6c6b379d9a48eb1af8a6bc38f46b9472a00899e0d5742e4065ebbeda5887470c6c2935066a56ac1e97794aa61048cd72b6d47555a0f8577ab15a3ce3defcc0f249aa7320e97b0dce943f325c39cef62494f93aa4509b95c9a52d632f48f8ce7505cb7fd1d06c108dc1ebce1f8146305dfe9c103e2e5dbd1bd693acab149633c00a60d16bee788944276b890d58149661939d25c9220aa5b640937637fdec4991a65341eb82acffe1d2496e55e69caec5639e30c7e713a5d65e43ef63836b94e95b6757c91ba31ca486bf2ab722addeb34426c95f73c5d36b94808bc4e422bb8de645d10a45882a3cc587f46346e501efb8163fda1a2d352f357365508c57a43155a4fb1c153c78500820e52084656c52e75d7b0de27391deec74e49da456da96dfcf42ae804e620015c3e2390d8c6f7492601ff335b490ded0ffc9d44f3d46b8515b95a8f3d899ea9ec3e1b07f10e6b4bbddfd94c2fea849289feb6ff8f590729a8059e6219d9ffb0e156b50f9279add0b25893684b4740984849dc13f4f372d52ec48f450f43e48c168644398f393ebb05d936f0e6cb320c80689bf92f18cb40788a957fb0f2f9f98171d47162a7187f4552f546ab600c4ed7e0bb92e7ac470fe40ab7a340e36bf122d38713c432f937371444727528207553fbfa9d1428ec905c465f3e8cb0257158e85780d28b198fbe891e59a4394748a26f77dcd40cba764caf3fa902941894235205235072bf1e76002af105a2dae6880c6434d7b6cdaa07f1ae1a1e91a8db087864f842b7ff5514428a9506573a45103b5f42567587da4cf89ddf137364f90cc74bae72d7d650768aaaae15c787f6bb75ffdcba5031a38a7c2fcfb37c8bf31595cb37b798f752d6a1c284770b0d5f1b8692bfb23407ed7b0835b63e23b6852250bfa7984c36a80dd5f8fb55bf5d13e3180bffc72177ba3a553f8cb9ea1f22246f473df29f7bc89aedc838e9375d1a25c5fcbd6d6a53c325321cc792fc225b9027faf00e0d23a96c01a59d9cf6c06cbbe16be57485d8b40d3b27716134ff91162d5cd2de2fa5df19d4487ed20ac2f3a74bb338468fae4be476c295805eb141baead42b5765d42f744adba60528657c4776599fb203a4a6f33f17edcddfea3f56bf628c873c9a7c46e05f2c4762a9b912d3db5fbd9457e77f63ae7b653702a48ae3d44c53a3d6d737a731dd919b30c4d842c76f4f28f9509a9a2755759f370293b8c414577392ea3ac876f0aabbc75801513949f53cedab8e1d3790f094ad98ec55362f5de5862236fe801f27bc2b80d80a5226f588faf984c322be5e78affd84d9b750797520da5443d3f9f8ad92efd8ba98f7dfd0bc7210ecd55e6cf6aac3f64bc8a2d256eab429e9ac841d360e73c66f3a3229985f044e4a1e0243cf0e7579251c96e3eb10e58aacedd89f71efd82c806879d74aa0c671081fbcd06a276595aac89b92edc4784c7d3d1edd2ec882f4177ff3cf97d032ff2ef3909e12350264bb4fc55a79e2c8b08503065b9149c448e3abd99c2a410862c2a1c0a2bd70e799e1a158c4e38cfc72831b7cc23ec0f22fcb7b0b397fe2ff0f2012157fbbbea73cb3ccaa7bdcbf089c87e4d5d1e52659bf2ebbd7bd5c9b5f6c647d9c359dabc1675026d21c665146a7d535cbe85ff26284b529cc6d5ac8cd51ed9019b218fdbe524305a2cfb3dee36583918be781ad0a87708338a9b1f44e3b56db5e8faa7d72c9263d9121e2e3f510b363a436375a8acb1b5babcc4ccd6dcddff4d55758ba2a4b0b5c5d6e7f1042f3c464d555a626d719eaacfddedf70c25363f465587929495a1c6c7d8daf5fb111b2e3a4152647677848ba3bec5cfd2ebf940440040a08b85000420502a05c00a2600a146484064aa00240400088181228fbff51f5d18da6d01",
        "pk": "0x16832c161d47289b25afea85a9c57301831ff5787214f03e0c4b848dc79aec23389bb455602a61741f393583ff6ecd59c7351159347f751977f816660240d5d79dff2097f4b87f6cf3a34b6feefd31316e85061f2753f5b5d30e18525b66551d1c3c0677307e902162316a4e8d7ee7e7ac38ca5be6ff45c5aa3334d267f95147f151cdd6c37aa4520ffb1f63276fa9048de2b222b3ddbaf690051bc6755e922c96ee9529b8450e00422aa02d64ea6bf2371a93a0eee54a46b6c381764aeed6234dd7a78f50758b5379afcf5c0a291dededf18f474cefc4b182d1d0bf2abfc85cd641ea04ee733a8e2c851df695e22f63da4e65504fd037cd1ae7d607461a1da580c0711ef5349b065623d43d15789b3ee6da213222481cdb20663e05cef6c6499f18f6480e2ae4dc9bc479e0f51d5d5723609661ff2265bff7d82f9f896adfc3d63b5b60a117c3c23ae416c12125d4219b1527f78c972d87384df1a970ea6ee67eafda7139b381562f7d2fe11cf3ba300872d76a840bb7992bd03d0039c981d4d1e871be08ea772a383930e0baca11d560de5c7a296cd5db2c78a39a9d25ab89c95889a360eed97648be1f6e88e04f757bbf7a9c65012b0a078ba0cfd12ee4ef159c9844eb016ef909118a756a323c50b63f9c6ef682e062999ca1fa8929fd3adccac7133fb4827d7d4cef84d4390a5e551a20b2c1c14a52140fa3aad38e835db69ee9b7700bf47c67fbd6104569638ff5e3fd2144e7b4985d125c845170bb478e1ab2dfa2e6af3f491bbdf220702c91b8052b9e2852e9f2a58fdbe0419404496773204bf8ccb77e7ca3a4b468ce07236c649fcbca3f2131c5ad8f699bfed8dbc8be6967d2f463ddbe0956fe5bd04092401d132bf562081ce3012cbd0c08262fb3ca80c7a2e388fd4a5cf14d16260479b08a02c6b5a93159ddae315ec715aec401832ba5606be97762a204c97eb707877125c42181b4033796b7b1cbee495f353c1e15f25ea6bc2ba937c65f968ef4229d636004c54b2771ff6a176d147439a2e7bce8a531c8c81109f56290fa866e53787eac21a33df62a05ee3c38e7692240a55d1e1f3b6d5ed407600f786b13c17139da82b5bdbf13ef759f3e9f223d19d96ff6adac12c7bc6fc2c0548da38fc76a6b9a9e584e347140c652c24245db0793f1431e023ee512ffc1291929139c748e490b9342d80bff97dc350500f6cf6e208f90d6ff989a1fb7c5fab0c15af5616fb2f0c014edda2702a9d35de04a5552ae40bc3ba2bb42cf152305172f690fbaf426327e4992d3cb3883052c4b7de23a29917e50ad8305126635d2a5db09ff3f5c6b5803995dfe1da186e149bbef857fdaac411933c614db2ee388f96869451631aa28430c2ee649bbf847b0af7994232d3fb5a90004504240e9cc5940365bfc9cce03cffcc4807be19528713dc8b6a9c779fff6ab4f6eebbfe67e4b3b73a15303e05e123549abce312b84d74cd90c70d8b95603877e072a1dbfd4b3a4945d33905f7927d9e6181cdb0d38fde5ffc9bd5e4fdb71d7376c808c184938910798e16c8296baa96917cf4e60d9750267f8707b019e7e81cef236a3def3aa2bdeadc2f564f862f6c85419caf0c9e0b60fc86b34068969167c11840ecb958b5ecd45c42ff165eef9b48b994c2fa5de7a28a9c1ccc6c42e8c6400d27ef082a0f3205ee4c57e1281aab5c4bf07cbd2101e2b0dc85e486b6e5c8300e61599a2f77fe16ffce6504f763030e5c04872ed5c8611bbad5155616dd2074b2423908b1c1d546721b04d5df7a2279137be111127c19271643ab2a487f9b8c1511691021c66ec5eadec7968dbafe0148ba7f9897d2f8fe05e8be09db6250f404878f5d4a957dff73ad4773e0aca21d8ee6a905c395f46cfa211501a7218a304dfb52dcfa28b99e21652769311612cab78b882135d2a50e27f331f570574adad9d079c93c52a23cd0d32adfe68207eac9784c897ffd0d186f1c6d2d089c217fa179720e8195666dab861338a2bc5d7eaaa1dac10e6bee6cb8665590f723fa3f7b0479d45ec900d070dea09bdb2305dac8133551cac9fd35f58f1"
    }
}
```
</TabItem>
<TabItem value="err" label="Error" default>


</TabItem>
</Tabs>
</TabItem>
</Tabs>
<br />


### `zond_sendRawTransaction`

SendRawTransaction will add the signed transaction to the transaction pool. The sender is responsible for signing the transaction and using the correct nonce.

<Tabs
    defaultValue="code"
    className="unique-tabs"
    groupId="zond_sendRawTransaction"
    values={[
        {label: 'Code', value: 'code'},
        {label: 'Usage', value: 'usage'},
    ]}>

<TabItem value="usage">

#### Method

*POST*

#### Parameters

| Field | Type | Required |  Description | 
|---------|-----|-----|-------|
| rpcTx | DATA (*array*) | true | The signed transaction data in `RPCIncomingTransaction` array. | 

#### Returns

| Return Value | Type |  Description | 
|---------|-----|-------|
| tx_hash | DATA (*32 bytes hex*) | the transaction hash, or the zero hash if the transaction is not yet available |  

</TabItem>

<TabItem value="code" label="Code">

- Required parameters: `rpcTx` (*array*)

<Tabs
    defaultValue="shreq"
    className="unique-tabs"
    groupId="zond_sendRawTransaction-code"
    values={[
        {label: 'Curl Request', value: 'shreq'},
        {label: 'JS Request', value: 'jsreq'},
        {label: 'Python Request', value: 'pyreq'},
    ]}>
<TabItem value="shreq" label="Curl Request" default>

```bash
curl --location --request POST 'http://45.76.43.83:4545' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "zond_sendRawTransaction",
    "params": [
        {
            "from": "0x2037a4a9c085d7d9185b8b2a830682a80ff83d00",
            "chainId": "0x1",
            "nonce": "0x0",
            "gas": "0x1e8480",
            "gasPrice": "0x2710",
            "to": "0xbc96cf604092dc53c5021fb122ddb2dffad75821",
            "value": "0x0",
            "gasLimit": "0x1e8480",
            "signature": "0x9e3461871f77d53c79af5c19e0bd7840f5c7fd6abf349e03a2253bb2e7df47e5a24675f052de6a88222d8f35b3b86e32ba86eabd1d978c4b49d9a187d80765a5025186eb81fe059039fb394f681addd80a5e96f406f24c1e4bef968bec583d3a147c1be17c409a6a49bd0dcbd42751e47ab900c5bfaca6db2eebf1f1b441c66a80eafc6ff4a0b658516614e8f91ecc0ca30331d24fa23aeefa82bd5b523322f76e8121392bad7f04554b40f0ef5c3b41321d0666b6693f6e43f4b21de616d87f96197358a7dc949fef656cd804a1f7bfa7273031b8499258d0e32cbe97d646b7ba15579d2b50cbcd159c53fbbcbdcf901f99d1ddb66b025c1cefa572f6d45383f6a547c2162f6a5133b5461614c19c025c2e3f660b0a36f975b2fe3cc476ebc8f23eaf0eefddcb19204ee66d46b6579071454d35217eed1e299fedf032ffaf125e322b092051019a8ea52f197919f201b207ef3963eba48dd7789025f5264d859a8e68eb3b4e3818221eb9b29ad8b1fe2ed63dd8141d2f866c214a558325f953527fef5649c14d1d339de4aa3b16e7ee940f5673437a948c366235a4192d5aa285699800c110fe173669094d278ffe8ee9be8ff4a64dc11df84506203d7976142d26ed39330bdc38c2e011b253746fb241628fdc9099f0f40aaca77e0cd648fc548cf259aa9776c5faf177345651b85281b231e07c2fb27a151416c2b0c6586c030756270208210f606344af47f152dd0c8b2800bc52984f8f304dc60f45ae97630bcba30a41dc30204583833dcedbe1424662c21b100b92ed232d2e30e1cb61d22bfc2d7b7a7c85f54f32b115dd47a0df0bd89c7b47e6c6fad6efecbe9f0663c5e1d9276d689c70f1ff25f88670af5e4503d737b1c318878a524ee4be9de820f339f03336d968b3f1c7b63da180100ca5a0139694b0f63deea86e5f35600eae33f83a2e7bc362eae53612bbfae592ea38a6df69220d33504a339e8e60d23fef712c610b2355dd7e0b4ae4261fb62f29c427a7c64ee93daac0c56d63168d74cbdc9f3e13601b4df1faab8d21fe6b24d2d3900e565ce2d6d7330fd7c30b9778f8191f3f131aa0e68454ba3aa69ceafcb7bfae5279fefc493245956f0746266b28a7d96d979468fa22dae32204785f5bdb11cdedf8ceedfca0827e98208210210649ebcbd9ef1d45f08756ef0b29b07a332180a2264fe084f9266f313aa00fafcad875b75caf968db8e2b0949badc08bce7697bb7bea56850c761f29bbf7ac7c8bf1c5ea8975eb010c42748b3862273ff6b58ba45890fb54e921f177c1a478bf409738ebfcba696bbab0d65b9bc63d9c99e1c92fa7b09036f16f35383492fe95dd88452cee26ccb6492f00ebc4b3e6fd059395061938e82f486daabc5662cfa84f1ae851292e51c940f0ab7e9e1436d62644dabe77f026146bbeea9af3e575b19d0fa0e19208adc4570d84d4687ca1734f2c875f590630d3c761a840cd53d488ed0fbaca9d5ea8e608dd67881426ceab9407c16831c128199b01a5df1640eb57b3082290292a9e0eacfcc033aa5a00b1b125f1b9ff3aceb0a8b5b1954656394d85b74241f70e74c73b0774aa23080850a9141a3b725659f0be9261ecd372239edfd846dd4c341ab7977d0ba0f6c80cc1986c21c21df3246a6df59612467eb726b733e0e007943c3186156cf3ddf33157f1d3fd43a45552ae0ed111e773643e7c297ed99f6c91faeef07ffc0695c893a859d590c29057b5a2e534ebb87ba109f7c00daa1c79f4d8de426925aaf3f8fc517c524bf744c8d62fbca663c4b798c3057574064f6d6dca2cf6dcb5eaa3a469e87b0f94c55fd56c2a26d50e6dfc9741f2aadc44fb05e8a9f00369261f86e754b92693f87fbf13bebb222ce563f6c8648a08dbd7c2a515af5c68f7c982251ee3c5c03bd8ad90e00d4d7ea8a65d031bcb7fc24f0af00c2ac994a60d5144b07863fca84e282d4dbdaeaee79b202ac9ea27d5bd5116f728cd8bf67381d3ed152e78d95a4d88f3d74337861fb3b3884b77cc65bed4243627bd7893e06d0151c95f5b8c7fd5a580b9ff872a6a5903eef2ea106e206e36195b189c5be815cec886840652734edff8d5d3787ff1d0ad152812b756d2c565f72da7642694aa7b5aea8660a7f770ea46844f2fd4f00d40c97fb48988753483c61de0abcc89d2fe09b8fc15c0870ed0a2a8775b168617dd5e5feb029c20f755c2917b4e812ddfa5526ae00f416706ae99e61d8511b52f06949bbdf7f70ca82db90a158f043d60503315cfd42e7393a11eeb227bd9913f9fcc7a87c0e3c1f2342263a5aaa3801c7cc4e8bc1103aa3e95bb393395dac90bded0f92e8c9a0c8c2de693d5157baa29cafd25372a7bbd62d13fc95e7ce49ca9ca257069123164e1f6626891fed064edc08cc438ea02b528777e12a4137df13d9ed89d23699af9b26fb9f2a8c6e32ad4a7c3005d505f94e8b493b4736d6b909b0e4f4eb4a04d11937d98feb39975b6d596907ddef9ed92a562d2812cb6023057d6abe52947bca568ca94583675f5b967dc70a54ff23ae8e85853bca9a93874ca59ff45ea98741f5c58618dfc26a6f8d50092198879348c223a4e8d81954c6dc7e67e1675c90354db07997b608b1449a2eef801809da10f3f730b3acfe3c537500b9cfa1b6d3285b99563bcf00cfb3fc62e5eaf4c747b235968cce528b377adfe5093d3ea0f19bacdd134ee370c179c7ad6de03a106dbbb6abec04e2945b0b0127443c12854331edd70d6c5071f072254e65e0cb27487b00359e2790bec2ea8b7b0e2640ca25949a505da0da7698cbb0f8fb197392dca97f961b2dfb077085cb4feb1707bd372a629f6989d56e0259e957ed71a0a671bd97de74e2299cd0c3446b9110f8fa00a02f9ed980b3d38f9a915203e7f41d56f5da1c38649796c7b7aa0be904f8091c4f857f0ae39e7f5cd30747c81c91e59e12ac1ec628a8452231f562c495602dc98db442d8eb5d1550b7ec62c8628652569a14dde0d0d79645abffb878c76e29ab45876db07b73cd7ad2390b442dc1c147fb02ce34520344c27105ff4c7ea6d3d63754b87e2040d3d4d4cf50bc1a116708bc13c08d10f46a5f6101078856cc876d2bf14f0189bca889cce6fe0f03fcae5244be658c6093cbcdc4ad85eb9350db181bc860de604cfff5ca41dda23efef982ea11552c28a8855146640178acd22f07d381d2057c61414e91cbffa675a9cf597496d17d393e12716c5704bd0b6259af30865a027c479455552ceac14baa1953620c14c34fb7282b54d5b732a01058df79dddffd4daf6c9e6702b60f120afb3a4b51dfb509a6318c1f31e6169ccc3ca5a2c35cd9d1fa5d56ecf8a3bada91de2b4bf84e048cba552f2154cf9b39f3a610e98ce7cf200f0dbdcba3c17f99cb3d2fe59161ca89eda4caca280d5e62d52b01e9ed350e1fffb11f052ca3b285884e630d3cb492544470c920f2137fff140a24a011504dc5ec4980c5d85ac15e49ee3da90b7038f1d3b86b33220141ec258bc34a8cd2bb20f548b54fd31fc353dafefe327fd191d1ce61330eea444159b9c7022ba0d11b4367bd28a8bd08e5039ec66b92110e1d6b0fc0aa43cca7ee753e82e6c3112202c3b4d173439738f9099a2a8abacb7bfc5d5d8e8f0182a517e819ba8b5bfc0dbebf1fd022129353a5e919ea1c9caf9001b2d4e508094c3cceaeceef2f4f7090e25394a5b646a6b919294a7c9cde0e6f21a00b020009100081404083c44054828918b8418100c08a98821402807090120aa67f51f0d8cca0a",
            "data": "0x60806040526040518060400160405280601381526020017f536f6c6964697479206279204578616d706c6500000000000000000000000000815250600390816200004a9190620004a7565b506040518060400160405280600781526020017f534f4c425945580000000000000000000000000000000000000000000000000081525060049081620000919190620004a7565b506012600560006101000a81548160ff021916908360ff160217905550348015620000bb57600080fd5b506040516200178f3803806200178f8339818101604052810190620000e19190620006f2565b81818160039081620000f49190620004a7565b508060049081620001069190620004a7565b50505062000148600560009054906101000a900460ff1660ff16600a6200012e9190620008fa565b60646200013c91906200094b565b6200015060201b60201c565b505062000a15565b80600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254620001a19190620009ac565b9250508190555080600080828254620001bb9190620009ac565b925050819055503373ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051620002229190620009f8565b60405180910390a350565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680620002af57607f821691505b602082108103620002c557620002c462000267565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026200032f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620002f0565b6200033b8683620002f0565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600062000388620003826200037c8462000353565b6200035d565b62000353565b9050919050565b6000819050919050565b620003a48362000367565b620003bc620003b3826200038f565b848454620002fd565b825550505050565b600090565b620003d3620003c4565b620003e081848462000399565b505050565b5b818110156200040857620003fc600082620003c9565b600181019050620003e6565b5050565b601f82111562000457576200042181620002cb565b6200042c84620002e0565b810160208510156200043c578190505b620004546200044b85620002e0565b830182620003e5565b50505b505050565b600082821c905092915050565b60006200047c600019846008026200045c565b1980831691505092915050565b600062000497838362000469565b9150826002028217905092915050565b620004b2826200022d565b67ffffffffffffffff811115620004ce57620004cd62000238565b5b620004da825462000296565b620004e78282856200040c565b600060209050601f8311600181146200051f57600084156200050a578287015190505b62000516858262000489565b86555062000586565b601f1984166200052f86620002cb565b60005b82811015620005595784890151825560018201915060208501945060208101905062000532565b8683101562000579578489015162000575601f89168262000469565b8355505b6001600288020188555050505b505050505050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b620005c882620005ac565b810181811067ffffffffffffffff82111715620005ea57620005e962000238565b5b80604052505050565b6000620005ff6200058e565b90506200060d8282620005bd565b919050565b600067ffffffffffffffff82111562000630576200062f62000238565b5b6200063b82620005ac565b9050602081019050919050565b60005b83811015620006685780820151818401526020810190506200064b565b60008484015250505050565b60006200068b620006858462000612565b620005f3565b905082815260208101848484011115620006aa57620006a9620005a7565b5b620006b784828562000648565b509392505050565b600082601f830112620006d757620006d6620005a2565b5b8151620006e984826020860162000674565b91505092915050565b600080604083850312156200070c576200070b62000598565b5b600083015167ffffffffffffffff8111156200072d576200072c6200059d565b5b6200073b85828601620006bf565b925050602083015167ffffffffffffffff8111156200075f576200075e6200059d565b5b6200076d85828601620006bf565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60008160011c9050919050565b6000808291508390505b60018511156200080557808604811115620007dd57620007dc62000777565b5b6001851615620007ed5780820291505b8081029050620007fd85620007a6565b9450620007bd565b94509492505050565b600082620008205760019050620008f3565b81620008305760009050620008f3565b816001811462000849576002811462000854576200088a565b6001915050620008f3565b60ff84111562000869576200086862000777565b5b8360020a91508482111562000883576200088262000777565b5b50620008f3565b5060208310610133831016604e8410600b8410161715620008c45782820a905083811115620008be57620008bd62000777565b5b620008f3565b620008d38484846001620007b3565b92509050818404811115620008ed57620008ec62000777565b5b81810290505b9392505050565b6000620009078262000353565b9150620009148362000353565b9250620009437fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff84846200080e565b905092915050565b6000620009588262000353565b9150620009658362000353565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615620009a157620009a062000777565b5b828202905092915050565b6000620009b98262000353565b9150620009c68362000353565b9250828201905080821115620009e157620009e062000777565b5b92915050565b620009f28162000353565b82525050565b600060208201905062000a0f6000830184620009e7565b92915050565b610d6a8062000a256000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c806342966c681161007157806342966c681461016857806370a082311461018457806395d89b41146101b4578063a0712d68146101d2578063a9059cbb146101ee578063dd62ed3e1461021e576100a9565b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100fc57806323b872dd1461011a578063313ce5671461014a575b600080fd5b6100b661024e565b6040516100c391906109be565b60405180910390f35b6100e660048036038101906100e19190610a79565b6102dc565b6040516100f39190610ad4565b60405180910390f35b6101046103ce565b6040516101119190610afe565b60405180910390f35b610134600480360381019061012f9190610b19565b6103d4565b6040516101419190610ad4565b60405180910390f35b610152610585565b60405161015f9190610b88565b60405180910390f35b610182600480360381019061017d9190610ba3565b610598565b005b61019e60048036038101906101999190610bd0565b61066f565b6040516101ab9190610afe565b60405180910390f35b6101bc610687565b6040516101c991906109be565b60405180910390f35b6101ec60048036038101906101e79190610ba3565b610715565b005b61020860048036038101906102039190610a79565b6107ec565b6040516102159190610ad4565b60405180910390f35b61023860048036038101906102339190610bfd565b610909565b6040516102459190610afe565b60405180910390f35b6003805461025b90610c6c565b80601f016020809104026020016040519081016040528092919081815260200182805461028790610c6c565b80156102d45780601f106102a9576101008083540402835291602001916102d4565b820191906000526020600020905b8154815290600101906020018083116102b757829003601f168201915b505050505081565b600081600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040516103bc9190610afe565b60405180910390a36001905092915050565b60005481565b600081600260008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546104629190610ccc565b9250508190555081600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546104b89190610ccc565b9250508190555081600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461050e9190610d00565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516105729190610afe565b60405180910390a3600190509392505050565b600560009054906101000a900460ff1681565b80600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546105e79190610ccc565b92505081905550806000808282546105ff9190610ccc565b92505081905550600073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516106649190610afe565b60405180910390a350565b60016020528060005260406000206000915090505481565b6004805461069490610c6c565b80601f01602080910402602001604051908101604052809291908181526020018280546106c090610c6c565b801561070d5780601f106106e25761010080835404028352916020019161070d565b820191906000526020600020905b8154815290600101906020018083116106f057829003601f168201915b505050505081565b80600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546107649190610d00565b925050819055508060008082825461077c9190610d00565b925050819055503373ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516107e19190610afe565b60405180910390a350565b600081600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461083d9190610ccc565b9250508190555081600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546108939190610d00565b925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516108f79190610afe565b60405180910390a36001905092915050565b6002602052816000526040600020602052806000526040600020600091509150505481565b600081519050919050565b600082825260208201905092915050565b60005b8381101561096857808201518184015260208101",
            "pk": "0xdc9db9e697137c6ae66588249aef9620012e592fb2e2913db038f6d2acaba0435f1d3d22f9ca30bbef5d910eef47747837937ba028cb934ab79a5688d6ecf3cec6f6c51f6a0743fee3df8c9733fe835380f19983f15320631af20826ab83913e1881fadf71f9c3232ff7f7ba956052fc51ae8b398b37245ac19f1398f01f27350f80fd2c35314c8b51da049b8ae524dd92c6c953d85187fc01ec2f72235dd2d04a73aa5c57e849275bc0c6debb88002813b7eaeac52b3e5815d3ae1c1e33b02e4d37cdcb6abf3b77953730427acfc63a15ad13ae968982af4b25158dc4deded65581c6f41e7ce2840829103ae0e55d38eed4ff90ea51e346111d2d230e0385ab078b25a297a52776882113866ef3bf486eae3ea1e005cd82e4858803da8c972ce832d5b08c07120e57b2a67b1ba431bd8e219734f6cc382c0a625d85a9074ba5c7d42cf4c2fd88400add6915f0a014611add4f44807ec597df8e2556c57198a4c073d27e1e6db59ff54a25ecd01a82ce00840c5e4d5df13f7ff729f017677aa005c6271513d22b1d9ec6754f3b36fa5fe5df870e4fc2563028e68b1c8321f894629b3239dcefe4382106c210c71a124abe0bd6cf1c05e9b84bd15150312cb2ba07cbe66994548870526ef8c3bf6d03d8194d9098a6ee6d9459ad81ff064b2d7da4bf2e09b38ca084f41457e347ea99b5f04f54f6880e12e2a8379a70021bec5b79638923ab5298918d5efa4c1e0e1552df84db3e6bd7764ffac28e57c222762b94b44a5d12ae1be2c638802eadfc6ff692c9de78e322ead0fb0c15b39980cb26ad46cc86b69e42b4d449faffe5e15bb7b4085b89bb0e8bf9b424cc528a047320ca83c268cfd023a69e8c8665cafd95a14d978d6616a3f63bf4befb92a01b4fa1948a9141dbdde852205ab1bdd92a8fd08a0284c7ed54cff14cffc13b14a37474718dcf82df0a5127caf1bdd28f700e612a4dd4d12c46378ec528c5757a03b0a07fa23e429b9d82362d7f8ab13404cc41d7c204d60c0e416035732419a03d8d5f2fb33c22e30076fe515dc7e0e8b1d2aa985b7f273f28b593ba8eb2eab4ff47b06f32643a856abbadf0ba00d103b066414f414f66a45846e0b441bafc287e3a30f6279f3effc6f9ed8139a590bf684ad0cf13c5d74094d0f252179ccbaee6f1b5960dc59b0c62fb5ba2555ac4050c4dae93803011917e53c554f62e463816940a25bf9dce5b57a60aa74d30a81209ccafd06961fe32c3bc691bc530bbb32b68115b5322d3089274c77f35cb7fc79cf5f05f3eb770c85e4fe5ae5041c76d9cc0d8fcd163afdcabcc034c57d57ba05a3d4dec9f8f25ad89866c9cb531c1e908becb4cb607d3cb041be0c4822098b9f1589a0366cc38a5937b5da289a163b9e33fa4907e70d76767b451c1c02ead31dc639fa55cf3d347837c2ebd3fef1689a7cc4d05442da59ad9eb785ccc6853f74609f964c3f179ae18e786ae60e0923911ff909b48a770d8b45d08b3236b8c34ad70bdb8fb601c5c2cc8bc00a52968d342177c8b409b4952dfeefe142abc757cf17ab902e8e09f17a39709c836e1a6eb7f53c1a6cf98c4504681017d47ddc75a53553c734870cbcb6ffd38698c60704be5d57e64095b4ff80f3a2df9223f7d6531168297f67c2d476ebe89de0058f8d67f68a332b462f9b2b411da2cef9761a7ca6aeba04792bff2b065085c53e6d9e8ea351a60f1b5e16ce5c204fbbed795db2db981132adef9aef3017b4a2968984d8b9eeba8816d2a50fbc48363d538981cb2f98e108ee44b6bcb4707b0a7c9795b532891fb3f8babb36ea7f63ab72d41ba0bfffc90f3c7e22ba8b4e80d698a2dda2fb28616176e5249aee15ba29ca010e648ababc08dcec56f1d3c5ced667cd2b1a11efbd74189b230cdb856fa5d7eca57d12b6e8e4a0692f17b9c361295cda47edcc77c8f65a7a66d2431e797045360033633308b7191f04dcd7c39d903ada6b433b11e9a2431d6f1e5495db695f79edcd3d24f0d59e2a2d35a362cebfaae45af1e8be67a01a89e3f2fa0fbc9770b37ab2cdcd35839788d018d30f9b6e0d050da4b50cb"
        }
    ]
}'
```
</TabItem>    
<TabItem value="jsreq" label="Request" default>

```js {} 
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'http://45.76.43.83:4545',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "jsonrpc": "2.0",
    "id": 1,
    "method": "zond_sendRawTransaction",
    "params": [
      {
        "from": "0x2037a4a9c085d7d9185b8b2a830682a80ff83d00",
        "chainId": "0x1",
        "nonce": "0x0",
        "gas": "0x1e8480",
        "gasPrice": "0x2710",
        "to": "0xbc96cf604092dc53c5021fb122ddb2dffad75821",
        "value": "0x0",
        "gasLimit": "0x1e8480",
        "signature": "0x9e3461871f77d53c79af5c19e0bd7840f5c7fd6abf349e03a2253bb2e7df47e5a24675f052de6a88222d8f35b3b86e32ba86eabd1d978c4b49d9a187d80765a5025186eb81fe059039fb394f681addd80a5e96f406f24c1e4bef968bec583d3a147c1be17c409a6a49bd0dcbd42751e47ab900c5bfaca6db2eebf1f1b441c66a80eafc6ff4a0b658516614e8f91ecc0ca30331d24fa23aeefa82bd5b523322f76e8121392bad7f04554b40f0ef5c3b41321d0666b6693f6e43f4b21de616d87f96197358a7dc949fef656cd804a1f7bfa7273031b8499258d0e32cbe97d646b7ba15579d2b50cbcd159c53fbbcbdcf901f99d1ddb66b025c1cefa572f6d45383f6a547c2162f6a5133b5461614c19c025c2e3f660b0a36f975b2fe3cc476ebc8f23eaf0eefddcb19204ee66d46b6579071454d35217eed1e299fedf032ffaf125e322b092051019a8ea52f197919f201b207ef3963eba48dd7789025f5264d859a8e68eb3b4e3818221eb9b29ad8b1fe2ed63dd8141d2f866c214a558325f953527fef5649c14d1d339de4aa3b16e7ee940f5673437a948c366235a4192d5aa285699800c110fe173669094d278ffe8ee9be8ff4a64dc11df84506203d7976142d26ed39330bdc38c2e011b253746fb241628fdc9099f0f40aaca77e0cd648fc548cf259aa9776c5faf177345651b85281b231e07c2fb27a151416c2b0c6586c030756270208210f606344af47f152dd0c8b2800bc52984f8f304dc60f45ae97630bcba30a41dc30204583833dcedbe1424662c21b100b92ed232d2e30e1cb61d22bfc2d7b7a7c85f54f32b115dd47a0df0bd89c7b47e6c6fad6efecbe9f0663c5e1d9276d689c70f1ff25f88670af5e4503d737b1c318878a524ee4be9de820f339f03336d968b3f1c7b63da180100ca5a0139694b0f63deea86e5f35600eae33f83a2e7bc362eae53612bbfae592ea38a6df69220d33504a339e8e60d23fef712c610b2355dd7e0b4ae4261fb62f29c427a7c64ee93daac0c56d63168d74cbdc9f3e13601b4df1faab8d21fe6b24d2d3900e565ce2d6d7330fd7c30b9778f8191f3f131aa0e68454ba3aa69ceafcb7bfae5279fefc493245956f0746266b28a7d96d979468fa22dae32204785f5bdb11cdedf8ceedfca0827e98208210210649ebcbd9ef1d45f08756ef0b29b07a332180a2264fe084f9266f313aa00fafcad875b75caf968db8e2b0949badc08bce7697bb7bea56850c761f29bbf7ac7c8bf1c5ea8975eb010c42748b3862273ff6b58ba45890fb54e921f177c1a478bf409738ebfcba696bbab0d65b9bc63d9c99e1c92fa7b09036f16f35383492fe95dd88452cee26ccb6492f00ebc4b3e6fd059395061938e82f486daabc5662cfa84f1ae851292e51c940f0ab7e9e1436d62644dabe77f026146bbeea9af3e575b19d0fa0e19208adc4570d84d4687ca1734f2c875f590630d3c761a840cd53d488ed0fbaca9d5ea8e608dd67881426ceab9407c16831c128199b01a5df1640eb57b3082290292a9e0eacfcc033aa5a00b1b125f1b9ff3aceb0a8b5b1954656394d85b74241f70e74c73b0774aa23080850a9141a3b725659f0be9261ecd372239edfd846dd4c341ab7977d0ba0f6c80cc1986c21c21df3246a6df59612467eb726b733e0e007943c3186156cf3ddf33157f1d3fd43a45552ae0ed111e773643e7c297ed99f6c91faeef07ffc0695c893a859d590c29057b5a2e534ebb87ba109f7c00daa1c79f4d8de426925aaf3f8fc517c524bf744c8d62fbca663c4b798c3057574064f6d6dca2cf6dcb5eaa3a469e87b0f94c55fd56c2a26d50e6dfc9741f2aadc44fb05e8a9f00369261f86e754b92693f87fbf13bebb222ce563f6c8648a08dbd7c2a515af5c68f7c982251ee3c5c03bd8ad90e00d4d7ea8a65d031bcb7fc24f0af00c2ac994a60d5144b07863fca84e282d4dbdaeaee79b202ac9ea27d5bd5116f728cd8bf67381d3ed152e78d95a4d88f3d74337861fb3b3884b77cc65bed4243627bd7893e06d0151c95f5b8c7fd5a580b9ff872a6a5903eef2ea106e206e36195b189c5be815cec886840652734edff8d5d3787ff1d0ad152812b756d2c565f72da7642694aa7b5aea8660a7f770ea46844f2fd4f00d40c97fb48988753483c61de0abcc89d2fe09b8fc15c0870ed0a2a8775b168617dd5e5feb029c20f755c2917b4e812ddfa5526ae00f416706ae99e61d8511b52f06949bbdf7f70ca82db90a158f043d60503315cfd42e7393a11eeb227bd9913f9fcc7a87c0e3c1f2342263a5aaa3801c7cc4e8bc1103aa3e95bb393395dac90bded0f92e8c9a0c8c2de693d5157baa29cafd25372a7bbd62d13fc95e7ce49ca9ca257069123164e1f6626891fed064edc08cc438ea02b528777e12a4137df13d9ed89d23699af9b26fb9f2a8c6e32ad4a7c3005d505f94e8b493b4736d6b909b0e4f4eb4a04d11937d98feb39975b6d596907ddef9ed92a562d2812cb6023057d6abe52947bca568ca94583675f5b967dc70a54ff23ae8e85853bca9a93874ca59ff45ea98741f5c58618dfc26a6f8d50092198879348c223a4e8d81954c6dc7e67e1675c90354db07997b608b1449a2eef801809da10f3f730b3acfe3c537500b9cfa1b6d3285b99563bcf00cfb3fc62e5eaf4c747b235968cce528b377adfe5093d3ea0f19bacdd134ee370c179c7ad6de03a106dbbb6abec04e2945b0b0127443c12854331edd70d6c5071f072254e65e0cb27487b00359e2790bec2ea8b7b0e2640ca25949a505da0da7698cbb0f8fb197392dca97f961b2dfb077085cb4feb1707bd372a629f6989d56e0259e957ed71a0a671bd97de74e2299cd0c3446b9110f8fa00a02f9ed980b3d38f9a915203e7f41d56f5da1c38649796c7b7aa0be904f8091c4f857f0ae39e7f5cd30747c81c91e59e12ac1ec628a8452231f562c495602dc98db442d8eb5d1550b7ec62c8628652569a14dde0d0d79645abffb878c76e29ab45876db07b73cd7ad2390b442dc1c147fb02ce34520344c27105ff4c7ea6d3d63754b87e2040d3d4d4cf50bc1a116708bc13c08d10f46a5f6101078856cc876d2bf14f0189bca889cce6fe0f03fcae5244be658c6093cbcdc4ad85eb9350db181bc860de604cfff5ca41dda23efef982ea11552c28a8855146640178acd22f07d381d2057c61414e91cbffa675a9cf597496d17d393e12716c5704bd0b6259af30865a027c479455552ceac14baa1953620c14c34fb7282b54d5b732a01058df79dddffd4daf6c9e6702b60f120afb3a4b51dfb509a6318c1f31e6169ccc3ca5a2c35cd9d1fa5d56ecf8a3bada91de2b4bf84e048cba552f2154cf9b39f3a610e98ce7cf200f0dbdcba3c17f99cb3d2fe59161ca89eda4caca280d5e62d52b01e9ed350e1fffb11f052ca3b285884e630d3cb492544470c920f2137fff140a24a011504dc5ec4980c5d85ac15e49ee3da90b7038f1d3b86b33220141ec258bc34a8cd2bb20f548b54fd31fc353dafefe327fd191d1ce61330eea444159b9c7022ba0d11b4367bd28a8bd08e5039ec66b92110e1d6b0fc0aa43cca7ee753e82e6c3112202c3b4d173439738f9099a2a8abacb7bfc5d5d8e8f0182a517e819ba8b5bfc0dbebf1fd022129353a5e919ea1c9caf9001b2d4e508094c3cceaeceef2f4f7090e25394a5b646a6b919294a7c9cde0e6f21a00b020009100081404083c44054828918b8418100c08a98821402807090120aa67f51f0d8cca0a",
        "data": "0x60806040526040518060400160405280601381526020017f536f6c6964697479206279204578616d706c6500000000000000000000000000815250600390816200004a9190620004a7565b506040518060400160405280600781526020017f534f4c425945580000000000000000000000000000000000000000000000000081525060049081620000919190620004a7565b506012600560006101000a81548160ff021916908360ff160217905550348015620000bb57600080fd5b506040516200178f3803806200178f8339818101604052810190620000e19190620006f2565b81818160039081620000f49190620004a7565b508060049081620001069190620004a7565b50505062000148600560009054906101000a900460ff1660ff16600a6200012e9190620008fa565b60646200013c91906200094b565b6200015060201b60201c565b505062000a15565b80600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254620001a19190620009ac565b9250508190555080600080828254620001bb9190620009ac565b925050819055503373ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051620002229190620009f8565b60405180910390a350565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680620002af57607f821691505b602082108103620002c557620002c462000267565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026200032f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620002f0565b6200033b8683620002f0565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600062000388620003826200037c8462000353565b6200035d565b62000353565b9050919050565b6000819050919050565b620003a48362000367565b620003bc620003b3826200038f565b848454620002fd565b825550505050565b600090565b620003d3620003c4565b620003e081848462000399565b505050565b5b818110156200040857620003fc600082620003c9565b600181019050620003e6565b5050565b601f82111562000457576200042181620002cb565b6200042c84620002e0565b810160208510156200043c578190505b620004546200044b85620002e0565b830182620003e5565b50505b505050565b600082821c905092915050565b60006200047c600019846008026200045c565b1980831691505092915050565b600062000497838362000469565b9150826002028217905092915050565b620004b2826200022d565b67ffffffffffffffff811115620004ce57620004cd62000238565b5b620004da825462000296565b620004e78282856200040c565b600060209050601f8311600181146200051f57600084156200050a578287015190505b62000516858262000489565b86555062000586565b601f1984166200052f86620002cb565b60005b82811015620005595784890151825560018201915060208501945060208101905062000532565b8683101562000579578489015162000575601f89168262000469565b8355505b6001600288020188555050505b505050505050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b620005c882620005ac565b810181811067ffffffffffffffff82111715620005ea57620005e962000238565b5b80604052505050565b6000620005ff6200058e565b90506200060d8282620005bd565b919050565b600067ffffffffffffffff82111562000630576200062f62000238565b5b6200063b82620005ac565b9050602081019050919050565b60005b83811015620006685780820151818401526020810190506200064b565b60008484015250505050565b60006200068b620006858462000612565b620005f3565b905082815260208101848484011115620006aa57620006a9620005a7565b5b620006b784828562000648565b509392505050565b600082601f830112620006d757620006d6620005a2565b5b8151620006e984826020860162000674565b91505092915050565b600080604083850312156200070c576200070b62000598565b5b600083015167ffffffffffffffff8111156200072d576200072c6200059d565b5b6200073b85828601620006bf565b925050602083015167ffffffffffffffff8111156200075f576200075e6200059d565b5b6200076d85828601620006bf565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60008160011c9050919050565b6000808291508390505b60018511156200080557808604811115620007dd57620007dc62000777565b5b6001851615620007ed5780820291505b8081029050620007fd85620007a6565b9450620007bd565b94509492505050565b600082620008205760019050620008f3565b81620008305760009050620008f3565b816001811462000849576002811462000854576200088a565b6001915050620008f3565b60ff84111562000869576200086862000777565b5b8360020a91508482111562000883576200088262000777565b5b50620008f3565b5060208310610133831016604e8410600b8410161715620008c45782820a905083811115620008be57620008bd62000777565b5b620008f3565b620008d38484846001620007b3565b92509050818404811115620008ed57620008ec62000777565b5b81810290505b9392505050565b6000620009078262000353565b9150620009148362000353565b9250620009437fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff84846200080e565b905092915050565b6000620009588262000353565b9150620009658362000353565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615620009a157620009a062000777565b5b828202905092915050565b6000620009b98262000353565b9150620009c68362000353565b9250828201905080821115620009e157620009e062000777565b5b92915050565b620009f28162000353565b82525050565b600060208201905062000a0f6000830184620009e7565b92915050565b610d6a8062000a256000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c806342966c681161007157806342966c681461016857806370a082311461018457806395d89b41146101b4578063a0712d68146101d2578063a9059cbb146101ee578063dd62ed3e1461021e576100a9565b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100fc57806323b872dd1461011a578063313ce5671461014a575b600080fd5b6100b661024e565b6040516100c391906109be565b60405180910390f35b6100e660048036038101906100e19190610a79565b6102dc565b6040516100f39190610ad4565b60405180910390f35b6101046103ce565b6040516101119190610afe565b60405180910390f35b610134600480360381019061012f9190610b19565b6103d4565b6040516101419190610ad4565b60405180910390f35b610152610585565b60405161015f9190610b88565b60405180910390f35b610182600480360381019061017d9190610ba3565b610598565b005b61019e60048036038101906101999190610bd0565b61066f565b6040516101ab9190610afe565b60405180910390f35b6101bc610687565b6040516101c991906109be565b60405180910390f35b6101ec60048036038101906101e79190610ba3565b610715565b005b61020860048036038101906102039190610a79565b6107ec565b6040516102159190610ad4565b60405180910390f35b61023860048036038101906102339190610bfd565b610909565b6040516102459190610afe565b60405180910390f35b6003805461025b90610c6c565b80601f016020809104026020016040519081016040528092919081815260200182805461028790610c6c565b80156102d45780601f106102a9576101008083540402835291602001916102d4565b820191906000526020600020905b8154815290600101906020018083116102b757829003601f168201915b505050505081565b600081600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040516103bc9190610afe565b60405180910390a36001905092915050565b60005481565b600081600260008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546104629190610ccc565b9250508190555081600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546104b89190610ccc565b9250508190555081600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461050e9190610d00565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516105729190610afe565b60405180910390a3600190509392505050565b600560009054906101000a900460ff1681565b80600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546105e79190610ccc565b92505081905550806000808282546105ff9190610ccc565b92505081905550600073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516106649190610afe565b60405180910390a350565b60016020528060005260406000206000915090505481565b6004805461069490610c6c565b80601f01602080910402602001604051908101604052809291908181526020018280546106c090610c6c565b801561070d5780601f106106e25761010080835404028352916020019161070d565b820191906000526020600020905b8154815290600101906020018083116106f057829003601f168201915b505050505081565b80600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546107649190610d00565b925050819055508060008082825461077c9190610d00565b925050819055503373ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516107e19190610afe565b60405180910390a350565b600081600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461083d9190610ccc565b9250508190555081600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546108939190610d00565b925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516108f79190610afe565b60405180910390a36001905092915050565b6002602052816000526040600020602052806000526040600020600091509150505481565b600081519050919050565b600082825260208201905092915050565b60005b8381101561096857808201518184015260208101",
        "pk": "0xdc9db9e697137c6ae66588249aef9620012e592fb2e2913db038f6d2acaba0435f1d3d22f9ca30bbef5d910eef47747837937ba028cb934ab79a5688d6ecf3cec6f6c51f6a0743fee3df8c9733fe835380f19983f15320631af20826ab83913e1881fadf71f9c3232ff7f7ba956052fc51ae8b398b37245ac19f1398f01f27350f80fd2c35314c8b51da049b8ae524dd92c6c953d85187fc01ec2f72235dd2d04a73aa5c57e849275bc0c6debb88002813b7eaeac52b3e5815d3ae1c1e33b02e4d37cdcb6abf3b77953730427acfc63a15ad13ae968982af4b25158dc4deded65581c6f41e7ce2840829103ae0e55d38eed4ff90ea51e346111d2d230e0385ab078b25a297a52776882113866ef3bf486eae3ea1e005cd82e4858803da8c972ce832d5b08c07120e57b2a67b1ba431bd8e219734f6cc382c0a625d85a9074ba5c7d42cf4c2fd88400add6915f0a014611add4f44807ec597df8e2556c57198a4c073d27e1e6db59ff54a25ecd01a82ce00840c5e4d5df13f7ff729f017677aa005c6271513d22b1d9ec6754f3b36fa5fe5df870e4fc2563028e68b1c8321f894629b3239dcefe4382106c210c71a124abe0bd6cf1c05e9b84bd15150312cb2ba07cbe66994548870526ef8c3bf6d03d8194d9098a6ee6d9459ad81ff064b2d7da4bf2e09b38ca084f41457e347ea99b5f04f54f6880e12e2a8379a70021bec5b79638923ab5298918d5efa4c1e0e1552df84db3e6bd7764ffac28e57c222762b94b44a5d12ae1be2c638802eadfc6ff692c9de78e322ead0fb0c15b39980cb26ad46cc86b69e42b4d449faffe5e15bb7b4085b89bb0e8bf9b424cc528a047320ca83c268cfd023a69e8c8665cafd95a14d978d6616a3f63bf4befb92a01b4fa1948a9141dbdde852205ab1bdd92a8fd08a0284c7ed54cff14cffc13b14a37474718dcf82df0a5127caf1bdd28f700e612a4dd4d12c46378ec528c5757a03b0a07fa23e429b9d82362d7f8ab13404cc41d7c204d60c0e416035732419a03d8d5f2fb33c22e30076fe515dc7e0e8b1d2aa985b7f273f28b593ba8eb2eab4ff47b06f32643a856abbadf0ba00d103b066414f414f66a45846e0b441bafc287e3a30f6279f3effc6f9ed8139a590bf684ad0cf13c5d74094d0f252179ccbaee6f1b5960dc59b0c62fb5ba2555ac4050c4dae93803011917e53c554f62e463816940a25bf9dce5b57a60aa74d30a81209ccafd06961fe32c3bc691bc530bbb32b68115b5322d3089274c77f35cb7fc79cf5f05f3eb770c85e4fe5ae5041c76d9cc0d8fcd163afdcabcc034c57d57ba05a3d4dec9f8f25ad89866c9cb531c1e908becb4cb607d3cb041be0c4822098b9f1589a0366cc38a5937b5da289a163b9e33fa4907e70d76767b451c1c02ead31dc639fa55cf3d347837c2ebd3fef1689a7cc4d05442da59ad9eb785ccc6853f74609f964c3f179ae18e786ae60e0923911ff909b48a770d8b45d08b3236b8c34ad70bdb8fb601c5c2cc8bc00a52968d342177c8b409b4952dfeefe142abc757cf17ab902e8e09f17a39709c836e1a6eb7f53c1a6cf98c4504681017d47ddc75a53553c734870cbcb6ffd38698c60704be5d57e64095b4ff80f3a2df9223f7d6531168297f67c2d476ebe89de0058f8d67f68a332b462f9b2b411da2cef9761a7ca6aeba04792bff2b065085c53e6d9e8ea351a60f1b5e16ce5c204fbbed795db2db981132adef9aef3017b4a2968984d8b9eeba8816d2a50fbc48363d538981cb2f98e108ee44b6bcb4707b0a7c9795b532891fb3f8babb36ea7f63ab72d41ba0bfffc90f3c7e22ba8b4e80d698a2dda2fb28616176e5249aee15ba29ca010e648ababc08dcec56f1d3c5ced667cd2b1a11efbd74189b230cdb856fa5d7eca57d12b6e8e4a0692f17b9c361295cda47edcc77c8f65a7a66d2431e797045360033633308b7191f04dcd7c39d903ada6b433b11e9a2431d6f1e5495db695f79edcd3d24f0d59e2a2d35a362cebfaae45af1e8be67a01a89e3f2fa0fbc9770b37ab2cdcd35839788d018d30f9b6e0d050da4b50cb"
      }
    ]
  })

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});

```
</TabItem>
<TabItem value="pyreq" label="Python Request" default>

```py {}
import requests
import json

url = "http://45.76.43.83:4545"

payload = json.dumps({
  "jsonrpc": "2.0",
  "id": 1,
  "method": "zond_sendRawTransaction",
  "params": [
    {
      "from": "0x2037a4a9c085d7d9185b8b2a830682a80ff83d00",
      "chainId": "0x1",
      "nonce": "0x0",
      "gas": "0x1e8480",
      "gasPrice": "0x2710",
      "to": "0xbc96cf604092dc53c5021fb122ddb2dffad75821",
      "value": "0x0",
      "gasLimit": "0x1e8480",
      "signature": "0x9e3461871f77d53c79af5c19e0bd7840f5c7fd6abf349e03a2253bb2e7df47e5a24675f052de6a88222d8f35b3b86e32ba86eabd1d978c4b49d9a187d80765a5025186eb81fe059039fb394f681addd80a5e96f406f24c1e4bef968bec583d3a147c1be17c409a6a49bd0dcbd42751e47ab900c5bfaca6db2eebf1f1b441c66a80eafc6ff4a0b658516614e8f91ecc0ca30331d24fa23aeefa82bd5b523322f76e8121392bad7f04554b40f0ef5c3b41321d0666b6693f6e43f4b21de616d87f96197358a7dc949fef656cd804a1f7bfa7273031b8499258d0e32cbe97d646b7ba15579d2b50cbcd159c53fbbcbdcf901f99d1ddb66b025c1cefa572f6d45383f6a547c2162f6a5133b5461614c19c025c2e3f660b0a36f975b2fe3cc476ebc8f23eaf0eefddcb19204ee66d46b6579071454d35217eed1e299fedf032ffaf125e322b092051019a8ea52f197919f201b207ef3963eba48dd7789025f5264d859a8e68eb3b4e3818221eb9b29ad8b1fe2ed63dd8141d2f866c214a558325f953527fef5649c14d1d339de4aa3b16e7ee940f5673437a948c366235a4192d5aa285699800c110fe173669094d278ffe8ee9be8ff4a64dc11df84506203d7976142d26ed39330bdc38c2e011b253746fb241628fdc9099f0f40aaca77e0cd648fc548cf259aa9776c5faf177345651b85281b231e07c2fb27a151416c2b0c6586c030756270208210f606344af47f152dd0c8b2800bc52984f8f304dc60f45ae97630bcba30a41dc30204583833dcedbe1424662c21b100b92ed232d2e30e1cb61d22bfc2d7b7a7c85f54f32b115dd47a0df0bd89c7b47e6c6fad6efecbe9f0663c5e1d9276d689c70f1ff25f88670af5e4503d737b1c318878a524ee4be9de820f339f03336d968b3f1c7b63da180100ca5a0139694b0f63deea86e5f35600eae33f83a2e7bc362eae53612bbfae592ea38a6df69220d33504a339e8e60d23fef712c610b2355dd7e0b4ae4261fb62f29c427a7c64ee93daac0c56d63168d74cbdc9f3e13601b4df1faab8d21fe6b24d2d3900e565ce2d6d7330fd7c30b9778f8191f3f131aa0e68454ba3aa69ceafcb7bfae5279fefc493245956f0746266b28a7d96d979468fa22dae32204785f5bdb11cdedf8ceedfca0827e98208210210649ebcbd9ef1d45f08756ef0b29b07a332180a2264fe084f9266f313aa00fafcad875b75caf968db8e2b0949badc08bce7697bb7bea56850c761f29bbf7ac7c8bf1c5ea8975eb010c42748b3862273ff6b58ba45890fb54e921f177c1a478bf409738ebfcba696bbab0d65b9bc63d9c99e1c92fa7b09036f16f35383492fe95dd88452cee26ccb6492f00ebc4b3e6fd059395061938e82f486daabc5662cfa84f1ae851292e51c940f0ab7e9e1436d62644dabe77f026146bbeea9af3e575b19d0fa0e19208adc4570d84d4687ca1734f2c875f590630d3c761a840cd53d488ed0fbaca9d5ea8e608dd67881426ceab9407c16831c128199b01a5df1640eb57b3082290292a9e0eacfcc033aa5a00b1b125f1b9ff3aceb0a8b5b1954656394d85b74241f70e74c73b0774aa23080850a9141a3b725659f0be9261ecd372239edfd846dd4c341ab7977d0ba0f6c80cc1986c21c21df3246a6df59612467eb726b733e0e007943c3186156cf3ddf33157f1d3fd43a45552ae0ed111e773643e7c297ed99f6c91faeef07ffc0695c893a859d590c29057b5a2e534ebb87ba109f7c00daa1c79f4d8de426925aaf3f8fc517c524bf744c8d62fbca663c4b798c3057574064f6d6dca2cf6dcb5eaa3a469e87b0f94c55fd56c2a26d50e6dfc9741f2aadc44fb05e8a9f00369261f86e754b92693f87fbf13bebb222ce563f6c8648a08dbd7c2a515af5c68f7c982251ee3c5c03bd8ad90e00d4d7ea8a65d031bcb7fc24f0af00c2ac994a60d5144b07863fca84e282d4dbdaeaee79b202ac9ea27d5bd5116f728cd8bf67381d3ed152e78d95a4d88f3d74337861fb3b3884b77cc65bed4243627bd7893e06d0151c95f5b8c7fd5a580b9ff872a6a5903eef2ea106e206e36195b189c5be815cec886840652734edff8d5d3787ff1d0ad152812b756d2c565f72da7642694aa7b5aea8660a7f770ea46844f2fd4f00d40c97fb48988753483c61de0abcc89d2fe09b8fc15c0870ed0a2a8775b168617dd5e5feb029c20f755c2917b4e812ddfa5526ae00f416706ae99e61d8511b52f06949bbdf7f70ca82db90a158f043d60503315cfd42e7393a11eeb227bd9913f9fcc7a87c0e3c1f2342263a5aaa3801c7cc4e8bc1103aa3e95bb393395dac90bded0f92e8c9a0c8c2de693d5157baa29cafd25372a7bbd62d13fc95e7ce49ca9ca257069123164e1f6626891fed064edc08cc438ea02b528777e12a4137df13d9ed89d23699af9b26fb9f2a8c6e32ad4a7c3005d505f94e8b493b4736d6b909b0e4f4eb4a04d11937d98feb39975b6d596907ddef9ed92a562d2812cb6023057d6abe52947bca568ca94583675f5b967dc70a54ff23ae8e85853bca9a93874ca59ff45ea98741f5c58618dfc26a6f8d50092198879348c223a4e8d81954c6dc7e67e1675c90354db07997b608b1449a2eef801809da10f3f730b3acfe3c537500b9cfa1b6d3285b99563bcf00cfb3fc62e5eaf4c747b235968cce528b377adfe5093d3ea0f19bacdd134ee370c179c7ad6de03a106dbbb6abec04e2945b0b0127443c12854331edd70d6c5071f072254e65e0cb27487b00359e2790bec2ea8b7b0e2640ca25949a505da0da7698cbb0f8fb197392dca97f961b2dfb077085cb4feb1707bd372a629f6989d56e0259e957ed71a0a671bd97de74e2299cd0c3446b9110f8fa00a02f9ed980b3d38f9a915203e7f41d56f5da1c38649796c7b7aa0be904f8091c4f857f0ae39e7f5cd30747c81c91e59e12ac1ec628a8452231f562c495602dc98db442d8eb5d1550b7ec62c8628652569a14dde0d0d79645abffb878c76e29ab45876db07b73cd7ad2390b442dc1c147fb02ce34520344c27105ff4c7ea6d3d63754b87e2040d3d4d4cf50bc1a116708bc13c08d10f46a5f6101078856cc876d2bf14f0189bca889cce6fe0f03fcae5244be658c6093cbcdc4ad85eb9350db181bc860de604cfff5ca41dda23efef982ea11552c28a8855146640178acd22f07d381d2057c61414e91cbffa675a9cf597496d17d393e12716c5704bd0b6259af30865a027c479455552ceac14baa1953620c14c34fb7282b54d5b732a01058df79dddffd4daf6c9e6702b60f120afb3a4b51dfb509a6318c1f31e6169ccc3ca5a2c35cd9d1fa5d56ecf8a3bada91de2b4bf84e048cba552f2154cf9b39f3a610e98ce7cf200f0dbdcba3c17f99cb3d2fe59161ca89eda4caca280d5e62d52b01e9ed350e1fffb11f052ca3b285884e630d3cb492544470c920f2137fff140a24a011504dc5ec4980c5d85ac15e49ee3da90b7038f1d3b86b33220141ec258bc34a8cd2bb20f548b54fd31fc353dafefe327fd191d1ce61330eea444159b9c7022ba0d11b4367bd28a8bd08e5039ec66b92110e1d6b0fc0aa43cca7ee753e82e6c3112202c3b4d173439738f9099a2a8abacb7bfc5d5d8e8f0182a517e819ba8b5bfc0dbebf1fd022129353a5e919ea1c9caf9001b2d4e508094c3cceaeceef2f4f7090e25394a5b646a6b919294a7c9cde0e6f21a00b020009100081404083c44054828918b8418100c08a98821402807090120aa67f51f0d8cca0a",
      "data": "0x60806040526040518060400160405280601381526020017f536f6c6964697479206279204578616d706c6500000000000000000000000000815250600390816200004a9190620004a7565b506040518060400160405280600781526020017f534f4c425945580000000000000000000000000000000000000000000000000081525060049081620000919190620004a7565b506012600560006101000a81548160ff021916908360ff160217905550348015620000bb57600080fd5b506040516200178f3803806200178f8339818101604052810190620000e19190620006f2565b81818160039081620000f49190620004a7565b508060049081620001069190620004a7565b50505062000148600560009054906101000a900460ff1660ff16600a6200012e9190620008fa565b60646200013c91906200094b565b6200015060201b60201c565b505062000a15565b80600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254620001a19190620009ac565b9250508190555080600080828254620001bb9190620009ac565b925050819055503373ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051620002229190620009f8565b60405180910390a350565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680620002af57607f821691505b602082108103620002c557620002c462000267565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026200032f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620002f0565b6200033b8683620002f0565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600062000388620003826200037c8462000353565b6200035d565b62000353565b9050919050565b6000819050919050565b620003a48362000367565b620003bc620003b3826200038f565b848454620002fd565b825550505050565b600090565b620003d3620003c4565b620003e081848462000399565b505050565b5b818110156200040857620003fc600082620003c9565b600181019050620003e6565b5050565b601f82111562000457576200042181620002cb565b6200042c84620002e0565b810160208510156200043c578190505b620004546200044b85620002e0565b830182620003e5565b50505b505050565b600082821c905092915050565b60006200047c600019846008026200045c565b1980831691505092915050565b600062000497838362000469565b9150826002028217905092915050565b620004b2826200022d565b67ffffffffffffffff811115620004ce57620004cd62000238565b5b620004da825462000296565b620004e78282856200040c565b600060209050601f8311600181146200051f57600084156200050a578287015190505b62000516858262000489565b86555062000586565b601f1984166200052f86620002cb565b60005b82811015620005595784890151825560018201915060208501945060208101905062000532565b8683101562000579578489015162000575601f89168262000469565b8355505b6001600288020188555050505b505050505050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b620005c882620005ac565b810181811067ffffffffffffffff82111715620005ea57620005e962000238565b5b80604052505050565b6000620005ff6200058e565b90506200060d8282620005bd565b919050565b600067ffffffffffffffff82111562000630576200062f62000238565b5b6200063b82620005ac565b9050602081019050919050565b60005b83811015620006685780820151818401526020810190506200064b565b60008484015250505050565b60006200068b620006858462000612565b620005f3565b905082815260208101848484011115620006aa57620006a9620005a7565b5b620006b784828562000648565b509392505050565b600082601f830112620006d757620006d6620005a2565b5b8151620006e984826020860162000674565b91505092915050565b600080604083850312156200070c576200070b62000598565b5b600083015167ffffffffffffffff8111156200072d576200072c6200059d565b5b6200073b85828601620006bf565b925050602083015167ffffffffffffffff8111156200075f576200075e6200059d565b5b6200076d85828601620006bf565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60008160011c9050919050565b6000808291508390505b60018511156200080557808604811115620007dd57620007dc62000777565b5b6001851615620007ed5780820291505b8081029050620007fd85620007a6565b9450620007bd565b94509492505050565b600082620008205760019050620008f3565b81620008305760009050620008f3565b816001811462000849576002811462000854576200088a565b6001915050620008f3565b60ff84111562000869576200086862000777565b5b8360020a91508482111562000883576200088262000777565b5b50620008f3565b5060208310610133831016604e8410600b8410161715620008c45782820a905083811115620008be57620008bd62000777565b5b620008f3565b620008d38484846001620007b3565b92509050818404811115620008ed57620008ec62000777565b5b81810290505b9392505050565b6000620009078262000353565b9150620009148362000353565b9250620009437fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff84846200080e565b905092915050565b6000620009588262000353565b9150620009658362000353565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615620009a157620009a062000777565b5b828202905092915050565b6000620009b98262000353565b9150620009c68362000353565b9250828201905080821115620009e157620009e062000777565b5b92915050565b620009f28162000353565b82525050565b600060208201905062000a0f6000830184620009e7565b92915050565b610d6a8062000a256000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c806342966c681161007157806342966c681461016857806370a082311461018457806395d89b41146101b4578063a0712d68146101d2578063a9059cbb146101ee578063dd62ed3e1461021e576100a9565b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100fc57806323b872dd1461011a578063313ce5671461014a575b600080fd5b6100b661024e565b6040516100c391906109be565b60405180910390f35b6100e660048036038101906100e19190610a79565b6102dc565b6040516100f39190610ad4565b60405180910390f35b6101046103ce565b6040516101119190610afe565b60405180910390f35b610134600480360381019061012f9190610b19565b6103d4565b6040516101419190610ad4565b60405180910390f35b610152610585565b60405161015f9190610b88565b60405180910390f35b610182600480360381019061017d9190610ba3565b610598565b005b61019e60048036038101906101999190610bd0565b61066f565b6040516101ab9190610afe565b60405180910390f35b6101bc610687565b6040516101c991906109be565b60405180910390f35b6101ec60048036038101906101e79190610ba3565b610715565b005b61020860048036038101906102039190610a79565b6107ec565b6040516102159190610ad4565b60405180910390f35b61023860048036038101906102339190610bfd565b610909565b6040516102459190610afe565b60405180910390f35b6003805461025b90610c6c565b80601f016020809104026020016040519081016040528092919081815260200182805461028790610c6c565b80156102d45780601f106102a9576101008083540402835291602001916102d4565b820191906000526020600020905b8154815290600101906020018083116102b757829003601f168201915b505050505081565b600081600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040516103bc9190610afe565b60405180910390a36001905092915050565b60005481565b600081600260008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546104629190610ccc565b9250508190555081600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546104b89190610ccc565b9250508190555081600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461050e9190610d00565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516105729190610afe565b60405180910390a3600190509392505050565b600560009054906101000a900460ff1681565b80600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546105e79190610ccc565b92505081905550806000808282546105ff9190610ccc565b92505081905550600073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516106649190610afe565b60405180910390a350565b60016020528060005260406000206000915090505481565b6004805461069490610c6c565b80601f01602080910402602001604051908101604052809291908181526020018280546106c090610c6c565b801561070d5780601f106106e25761010080835404028352916020019161070d565b820191906000526020600020905b8154815290600101906020018083116106f057829003601f168201915b505050505081565b80600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546107649190610d00565b925050819055508060008082825461077c9190610d00565b925050819055503373ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516107e19190610afe565b60405180910390a350565b600081600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461083d9190610ccc565b9250508190555081600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546108939190610d00565b925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516108f79190610afe565b60405180910390a36001905092915050565b6002602052816000526040600020602052806000526040600020600091509150505481565b600081519050919050565b600082825260208201905092915050565b60005b8381101561096857808201518184015260208101",
      "pk": "0xdc9db9e697137c6ae66588249aef9620012e592fb2e2913db038f6d2acaba0435f1d3d22f9ca30bbef5d910eef47747837937ba028cb934ab79a5688d6ecf3cec6f6c51f6a0743fee3df8c9733fe835380f19983f15320631af20826ab83913e1881fadf71f9c3232ff7f7ba956052fc51ae8b398b37245ac19f1398f01f27350f80fd2c35314c8b51da049b8ae524dd92c6c953d85187fc01ec2f72235dd2d04a73aa5c57e849275bc0c6debb88002813b7eaeac52b3e5815d3ae1c1e33b02e4d37cdcb6abf3b77953730427acfc63a15ad13ae968982af4b25158dc4deded65581c6f41e7ce2840829103ae0e55d38eed4ff90ea51e346111d2d230e0385ab078b25a297a52776882113866ef3bf486eae3ea1e005cd82e4858803da8c972ce832d5b08c07120e57b2a67b1ba431bd8e219734f6cc382c0a625d85a9074ba5c7d42cf4c2fd88400add6915f0a014611add4f44807ec597df8e2556c57198a4c073d27e1e6db59ff54a25ecd01a82ce00840c5e4d5df13f7ff729f017677aa005c6271513d22b1d9ec6754f3b36fa5fe5df870e4fc2563028e68b1c8321f894629b3239dcefe4382106c210c71a124abe0bd6cf1c05e9b84bd15150312cb2ba07cbe66994548870526ef8c3bf6d03d8194d9098a6ee6d9459ad81ff064b2d7da4bf2e09b38ca084f41457e347ea99b5f04f54f6880e12e2a8379a70021bec5b79638923ab5298918d5efa4c1e0e1552df84db3e6bd7764ffac28e57c222762b94b44a5d12ae1be2c638802eadfc6ff692c9de78e322ead0fb0c15b39980cb26ad46cc86b69e42b4d449faffe5e15bb7b4085b89bb0e8bf9b424cc528a047320ca83c268cfd023a69e8c8665cafd95a14d978d6616a3f63bf4befb92a01b4fa1948a9141dbdde852205ab1bdd92a8fd08a0284c7ed54cff14cffc13b14a37474718dcf82df0a5127caf1bdd28f700e612a4dd4d12c46378ec528c5757a03b0a07fa23e429b9d82362d7f8ab13404cc41d7c204d60c0e416035732419a03d8d5f2fb33c22e30076fe515dc7e0e8b1d2aa985b7f273f28b593ba8eb2eab4ff47b06f32643a856abbadf0ba00d103b066414f414f66a45846e0b441bafc287e3a30f6279f3effc6f9ed8139a590bf684ad0cf13c5d74094d0f252179ccbaee6f1b5960dc59b0c62fb5ba2555ac4050c4dae93803011917e53c554f62e463816940a25bf9dce5b57a60aa74d30a81209ccafd06961fe32c3bc691bc530bbb32b68115b5322d3089274c77f35cb7fc79cf5f05f3eb770c85e4fe5ae5041c76d9cc0d8fcd163afdcabcc034c57d57ba05a3d4dec9f8f25ad89866c9cb531c1e908becb4cb607d3cb041be0c4822098b9f1589a0366cc38a5937b5da289a163b9e33fa4907e70d76767b451c1c02ead31dc639fa55cf3d347837c2ebd3fef1689a7cc4d05442da59ad9eb785ccc6853f74609f964c3f179ae18e786ae60e0923911ff909b48a770d8b45d08b3236b8c34ad70bdb8fb601c5c2cc8bc00a52968d342177c8b409b4952dfeefe142abc757cf17ab902e8e09f17a39709c836e1a6eb7f53c1a6cf98c4504681017d47ddc75a53553c734870cbcb6ffd38698c60704be5d57e64095b4ff80f3a2df9223f7d6531168297f67c2d476ebe89de0058f8d67f68a332b462f9b2b411da2cef9761a7ca6aeba04792bff2b065085c53e6d9e8ea351a60f1b5e16ce5c204fbbed795db2db981132adef9aef3017b4a2968984d8b9eeba8816d2a50fbc48363d538981cb2f98e108ee44b6bcb4707b0a7c9795b532891fb3f8babb36ea7f63ab72d41ba0bfffc90f3c7e22ba8b4e80d698a2dda2fb28616176e5249aee15ba29ca010e648ababc08dcec56f1d3c5ced667cd2b1a11efbd74189b230cdb856fa5d7eca57d12b6e8e4a0692f17b9c361295cda47edcc77c8f65a7a66d2431e797045360033633308b7191f04dcd7c39d903ada6b433b11e9a2431d6f1e5495db695f79edcd3d24f0d59e2a2d35a362cebfaae45af1e8be67a01a89e3f2fa0fbc9770b37ab2cdcd35839788d018d30f9b6e0d050da4b50cb"
    }
  ]
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

```
</TabItem>
</Tabs>

<Tabs
    defaultValue="resp"
    className="unique-tabs"
    groupId="zond_sendRawTransaction-resp"
    values={[
        {label: 'Response', value: 'resp'},
        {label: 'Error', value: 'err'},
    ]}>
<TabItem value="resp" label="Response" default>

```json 
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331"
}
```
</TabItem>
<TabItem value="err" label="Error" default>


</TabItem>
</Tabs>
</TabItem>
</Tabs>
<br />


### `zond_getLogs`

:::caution
Need to update with good response from call
:::


<Tabs
    defaultValue="code"
    className="unique-tabs"
    groupId="zond_getLogs"
    values={[
        {label: 'Code', value: 'code'},
        {label: 'Usage', value: 'usage'},
    ]}>

<TabItem value="usage">

#### Method

*POST*

#### Parameters

| Field | Type | Required |  Description | 
|---------|-----|-----|-------|
|  |  |  |   | 
|  |  |  |  |


#### Returns

| Return Value | Type |  Description | 
|---------|-----|-------|
|  |   |  |  

##### Return Object Definition

</TabItem>

<TabItem value="code" label="Code">

- Required parameters: ` ` (*...*)

<Tabs
    defaultValue="shreq"
    className="unique-tabs"
    groupId="zond_getLogs-code"
    values={[
        {label: 'Curl Request', value: 'shreq'},
        {label: 'JS Request', value: 'jsreq'},
        {label: 'Python Request', value: 'pyreq'},
    ]}>
<TabItem value="shreq" label="Curl Request" default>

```bash
curl --location --request POST 'http://45.76.43.83:4545' \
--header 'Content-Type: application/json' \
--data-raw '{"jsonrpc":"2.0","method":"zond_getLogs","params":["0xf47abf9b8585ab6ca909b6f8529822ca95e4984f1d4f0e160ca5b77475c6765c", "0xdf035d2e1b1b2133339612e747af7a5b1a1cb91d802b13c0636d7624c23158cb", "0x0"],"id":1}'
```
</TabItem>    
<TabItem value="jsreq" label="Request" default>

```js {} 
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'http://45.76.43.83:4545',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "jsonrpc": "2.0",
    "method": "zond_getLogs",
    "params": [
      "0xf47abf9b8585ab6ca909b6f8529822ca95e4984f1d4f0e160ca5b77475c6765c",
      "0xdf035d2e1b1b2133339612e747af7a5b1a1cb91d802b13c0636d7624c23158cb",
      "0x0"
    ],
    "id": 1
  })

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});

```
</TabItem>
<TabItem value="pyreq" label="Python Request" default>

```py {}
import requests
import json

url = "http://45.76.43.83:4545"

payload = json.dumps({
  "jsonrpc": "2.0",
  "method": "zond_getLogs",
  "params": [
    "0xf47abf9b8585ab6ca909b6f8529822ca95e4984f1d4f0e160ca5b77475c6765c",
    "0xdf035d2e1b1b2133339612e747af7a5b1a1cb91d802b13c0636d7624c23158cb",
    "0x0"
  ],
  "id": 1
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

```
</TabItem>
</Tabs>


<Tabs
    defaultValue="resp"
    className="unique-tabs"
    groupId="zond_getLogs-resp"
    values={[
        {label: 'Response', value: 'resp'},
        {label: 'Error', value: 'err'},
    ]}>
<TabItem value="resp" label="Response" default>

```json 

```
</TabItem>
<TabItem value="err" label="Error" default>

```json title=""

```
</TabItem>
</Tabs>
</TabItem>
</Tabs>
<br />

### `zond_getReceipts`

:::caution
Need to update with good response from call
:::



<Tabs
    defaultValue="code"
    className="unique-tabs"
    groupId="zond_getReceipts"
    values={[
        {label: 'Code', value: 'code'},
        {label: 'Usage', value: 'usage'},
    ]}>

<TabItem value="usage">


#### Method

*POST*

#### Parameters

| Field | Type | Required |  Description | 
|---------|-----|-----|-------|
|  |  |  |   | 
|  |  |  |  |


#### Returns

| Return Value | Type |  Description | 
|---------|-----|-------|
|  |   |  |  

##### Return Object Definition

</TabItem>

<TabItem value="code" label="Code">

- Required parameters: ` ` (*...*)

<Tabs
    defaultValue="shreq"
    className="unique-tabs"
    groupId="zond_getReceipts-code"
    values={[
        {label: 'Curl Request', value: 'shreq'},
        {label: 'JS Request', value: 'jsreq'},
        {label: 'Python Request', value: 'pyreq'},
    ]}>
<TabItem value="shreq" label="Curl Request" default>

```bash
curl --location --request POST 'http://45.76.43.83:4545' \
--header 'Content-Type: application/json' \
--data-raw '{"jsonrpc":"2.0","method":"zond_getReceipts","params":["0xf47abf9b8585ab6ca909b6f8529822ca95e4984f1d4f0e160ca5b77475c6765c"],"id":1}'
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
</Tabs>

<Tabs
    defaultValue="resp"
    className="unique-tabs"
    groupId="zond_getReceipts-resp"
    values={[
        {label: 'Response', value: 'resp'},
        {label: 'Error', value: 'err'},
    ]}>
<TabItem value="resp" label="Response" default>

```json 

```
</TabItem>
<TabItem value="err" label="Error" default>

```json title=""

```
</TabItem>
</Tabs>

</TabItem>
</Tabs>
<br />


### `zond_getTransaction`

:::caution
Need to update with good response from call
:::

<Tabs
    defaultValue="code"
    className="unique-tabs"
    groupId="zond_getTransaction"
    values={[
        {label: 'Code', value: 'code'},
        {label: 'Usage', value: 'usage'},
    ]}>

<TabItem value="usage">

#### Method

*POST*

#### Parameters

| Field | Type | Required |  Description | 
|---------|-----|-----|-------|
|  |  |  |   | 
|  |  |  |  |


#### Returns

| Return Value | Type |  Description | 
|---------|-----|-------|
|  |   |  |  

##### Return Object Definition


</TabItem>

<TabItem value="code" label="Code">

- Required parameters: ` ` (*...*)

<Tabs
    defaultValue="shreq"
    className="unique-tabs"
    groupId="zond_getTransaction-code"
    values={[
        {label: 'Curl Request', value: 'shreq'},
        {label: 'JS Request', value: 'jsreq'},
        {label: 'Python Request', value: 'pyreq'},
        {label: 'Response', value: 'resp'},
        {label: 'Error', value: 'err'},
    ]}>
<TabItem value="shreq" label="Curl Request" default>

```bash
curl --location --request POST 'http://45.76.43.83:4545' \
--header 'Content-Type: application/json' \
--data-raw '{"jsonrpc":"2.0","method":"zond_getTransaction","params":["0xf47abf9b8585ab6ca909b6f8529822ca95e4984f1d4f0e160ca5b77475c6765c"],"id":1}'
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

<Tabs
    defaultValue="resp"
    className="unique-tabs"
    groupId="zond_getTransaction-resp"
    values={[
        {label: 'Response', value: 'resp'},
        {label: 'Error', value: 'err'},
    ]}>
<TabItem value="resp" label="Response" default>

```json 

```
</TabItem>
<TabItem value="err" label="Error" default>

```json title=""

```
</TabItem>
</Tabs>

</TabItem>
</Tabs>
<br />



### `zond_sendTx`


:::caution
Need to update with good response from call
:::

<Tabs
    defaultValue="code"
    className="unique-tabs"
    groupId="zond_sendTx"
    values={[
        {label: 'Code', value: 'code'},
        {label: 'Usage', value: 'usage'},
    ]}>

<TabItem value="usage">

#### Method

*POST*

#### Parameters

| Field | Type | Required |  Description | 
|---------|-----|-----|-------|
|  |  |  |   | 
|  |  |  |  |


**TransactionInterface**

- **Size -** 
- **PBData -** 
- **SetPBData -** 
- **Type -** 
- **ChainID -** 
- **Gas -** 
- **GasPrice -** 
- **Nonce -** 
- **PK -** 
- **Signature -** 
- **Hash -** 
- **AddrFrom -** 
- **AddrFromPK -** 
- **OTSIndex -** 
- **FromPBData -** 
- **GetSlave -** 
- **GetSigningHash -** 
- **SignXMSS -** 
- **SignDilithium -** 
- **ApplyStateChanges -** 
- **applyStateChangesForPK -** 
- **validateData -** 
- **Validate -** 
- **ApplyEpochMetaData -** 
- **AsMessage -** 

#### Returns

| Return Value | Type |  Description | 
|---------|-----|-------|
|  |   |  |  

##### Return Object Definition

</TabItem>

<TabItem value="code" label="Code">

- Required parameters: ` ` (*...*)

<Tabs
    defaultValue="shreq"
    className="unique-tabs"
    groupId="zond_sendTx-code"
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
</Tabs>


<Tabs
    defaultValue="resp"
    className="unique-tabs"
    groupId="zond_sendTx-resp"
    values={[
        {label: 'Response', value: 'resp'},
        {label: 'Error', value: 'err'},
    ]}>
<TabItem value="resp" label="Response" default>

```json 

```
</TabItem>
<TabItem value="err" label="Error" default>

```json title=""

```
</TabItem>
</Tabs>


</TabItem>
</Tabs>
<br />