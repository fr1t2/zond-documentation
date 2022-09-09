---
docstatus: DRAFT  # one of {DRAFT, 30%, 90%, COMPLETE}
id: node-cli-wallet
title: Zond Node CLI Wallet
hide_title: false
hide_table_of_contents: false
sidebar_label: Zond Node - CLI Wallet
sidebar_position: 1
pagination_label: Zond Node - CLI Wallet
custom_edit_url: https://github.com/theqrl/documentation/edit/master/docs/basics/what-is-qrl.md
description: Zond Node CLI Wallet
keywords:
  - docs
  - node
  - wallet
image: /assets/img/icons/yellow.png
slug: /wallet/node/node-cli-wallet
---

:::caution DOCUMENT STATUS 
<span>This document is in: <b>{frontMatter.docstatus}</b> status and needs additional input!</span>

- Need information on what the Dilithium address is used for, and how it is derived (paragraph or 2)
- What is different from this command and the `zond-cli dilithium-key add` command?
- Need information on what the XMSS address is used for, and how it is derived (paragraph or 2)
:::


:::note NOTE: ZOND NODE RERQUIRED
All of these commands require the zond node is installed and the `zond-cli` executable is accessible in the current directory.
:::

### Address Identification

Both types of addresses generate a 42 character (*20 bytes prefixed with 0x*) public key. 

The first Byte after the `0x` prefix indicates the address type: `10` for XMSS and `20` Dilithium.

| Address | Identification Byte | Type  |
|--|--|--|
| 0x1005003ea6ed78d597e7411a8ddbc2dffd8839e5| `0x10...` | XMSS Address |
| 0x20bf1acdae054f4194e0c132b489e8f9099caf8c| `0x20...` | Dilithium Address |

Additional differences can be seen in the secret keys for both address types.

|  Address Type | Secret Key  |
|---- |---|
| Dilithium Secret Key | 0xdf37d59bd41017c0477fc23df044df2ece1fa6df87e03be50657b0336211b55d7f8c19c66b44bf033a798da2c3901c38 |
| XMSS Secret Key | 0x1005004dd2e5bbe5e699c3ca55f71acc61b57cc5b44519967d0fba0bacfc3fcfbcdbf806e7edd44a5b837e570ec517b41747e7 |

## Generate New Dilithium Address

```bash
./zond-cli wallet add-dilithium

# Response
Added New Dilithium Address:  0x20bf1acdae054f4194e0c132b489e8f9099caf8c
Wallet Created
```

This creates a new Dilithium address into file wallet.json created in the directory the command is issued.

#### Example Dilithium Keypair

```
Public Key: 0x20bf1acdae054f4194e0c132b489e8f9099caf8c
Secret Key: 0xdf37d59bd41017c0477fc23df044df2ece1fa6df87e03be50657b0336211b55d7f8c19c66b44bf033a798da2c3901c38`
Mnemonic:   task less orphan driver blaser agony lip canvas vague fee comic text plush wheel tech saloon allot laws cried butler reply strand mighty outer home faint aedes police mix close mosque serial
```

### List Addresses

```bash
./zond-cli wallet list

##Response
# Index   Address                                     Balance
  1       0x20bf1acdae054f4194e0c132b489e8f9099caf8c  0
```

### Show Secret Keys


```bash
./zond-cli wallet secret

##Response
# Index  Public Address                              Hex Seed                                                                                            Mnemonic 
  1      0x20bf1acdae054f4194e0c132b489e8f9099caf8c  0xdf37d59bd41017c0477fc23df044df2ece1fa6df87e03be50657b0336211b55d7f8c19c66b44bf033a798da2c3901c38  task less orphan driver blaser agony lip canvas vague fee comic text plush wheel tech saloon allot laws cried butler reply strand mighty outer home faint aedes police mix close mosque serial
```


## Generate New XMSS Address

```bash
./zond-cli wallet add-xmss
```
This will generate a new `wallet.json` file in the directory the command is issued. If this file exists, the new address will be appended to the address list in the wallet.

#### Tree Height

By default the Zond CLI generates an XMSS wallet addresses with a tree `--height 10`, creating 1,024 available OTS keys for signing. 

The tree height is adjustable at creation, though larger tree's will require some additional time to generate. This height can not later be changed.

Any funds left in an address with all OTS keys used will be lost. These funds must be sent to an address with available OTS keys *before* all keys are used in the current address.

:::danger Track OTS Key use to avoid locking funds!
There is nothing that can be done once funds are locked in an address without keys available to sign a transaction.
:::

| Tree Height | Available Keys | Info |
|--- | --- |--- |
| 4  | 16  | Only 16 available OTS keys |
| 8  | 256 | Ledger hardware limitations limit to this height |
| 10 | 1,024 | Default wallet height, able to send 2 transactions a day for a year |
| 12 | 4,096 | Can send 11 transactions a day for a year, or one tx a day for 11 years |
| 14 | 16,384 | Can send 44 transactions a day for a year, or one tx a day for 44 years | |
| 16 | 65,536 | Can send 179 transactions a day for a year, or one tx a day for 179 years | |
| 18 | 262,144 | Can send 700 transactions a day for a year, may take some time to open |

#### Example XMSS Keypair

```
Public Key: 0x1005003ea6ed78d597e7411a8ddbc2dffd8839e5
Secret Key: 0x1005004dd2e5bbe5e699c3ca55f71acc61b57cc5b44519967d0fba0bacfc3fcfbcdbf806e7edd44a5b837e570ec517b41747e7`
Mnemonic:   badge filled feat colt rumble glow older digit fort invest slump bounce lemon gaul egypt often lent witty artful soon drag woke swap liz touch synod exempt riot libya inset share layman birth lick
```

### List Addresses


```bash
./zond-cli wallet list

##Response
# Index   Address                                     Balance
  1       0x1005003ea6ed78d597e7411a8ddbc2dffd8839e5  0
````

### Show Secret Keys


```bash
./zond-cli wallet secret

##Response
# Index  Public Address                              Hex Seed                                                                                            Mnemonic 
  1      0x1005003ea6ed78d597e7411a8ddbc2dffd8839e5  1005004dd2e5bbe5e699c3ca55f71acc61b57cc5b44519967d0fba0bacfc3fcfbcdbf806e7edd44a5b837e570ec517b41747e7badge filled feat colt rumble glow older digit fort invest slump bounce lemon gaul egypt often lent witty artful soon drag woke swap liz touch synod exempt riot libya inset share layman birth lick
```


## Transfer From Dilithium

```bash
./zond-cli tx transferFromDilithium --account-index 1 --chain-id 1 --to "0x202d32684da044f95790081d3b7faa67c52dd538" --nonce 1 --amount 1000 --gas 1 --gas-price 1 --wallet-file wallet.json --broadcast
``` 