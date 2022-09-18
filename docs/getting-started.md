---
docstatus: DRAFT  # one of {DRAFT, 30%, 90%, COMPLETE}
id: getting-started
title: Getting Started
hide_title: false
hide_table_of_contents: true
sidebar_label: Getting Started
sidebar_position: 1
pagination_label: Getting Started
custom_edit_url: https://github.com/fr1t2/documentation/edit/main/docs/getting-started.md
description: Getting started with the QRL Blockchain and ecosystem
keywords:
  - docs
  - intro
  - getting started
image: /assets/img/icons/yellow.png
slug: /

---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';


:::caution DOCUMENT STATUS 
<span>This document is in: <b>{frontMatter.docstatus}</b> status and needs additional input!</span>

- POS explainer, including cryptography used and any special considerations to be highlighted.
:::


Welcome to the Quantum Resistant Ledger Zond documentation! This is a work in progress and will be improved as we build project Zond. Ensure




### The QRL Mission

Provide enterprise grade security to the blockchain space with the future quantum threat in mind. Instead of relying on the classical secure elliptical curve cryptography to secure signatures The QRL has deployed XMSS, a NIST-approved post-quantum secure digital signature scheme.

By utilizing this post-quantum secure signature scheme from genesis, we are able to provide advanced asset protection now, as well as the future.




<Tabs
  defaultValue="node"
  groupID="zond"
  values={[
    { label: 'Zond Node', value: 'node', },
    { label: 'QRVM', value: 'qrvm', },
    { label: 'Wallet', value: 'wallet', },
  ]
}>



<TabItem value="node">

<h2>Zond Node Docs</h2>

:::note Project Zond
`Zond` is the code name given to Quantum Resistant Proof Of Stake Blockchain under development by the QRL team.
:::

Information on the new POS node as well as the `zond-cli` command line tools

<span><img src={frontMatter.image} alt='QRL logo' /></span>

</TabItem>

<TabItem value="qrvm">

<h2>QRVM - Quantum Resistant Virtual Machine</h2>

:::note
QRVM is built with Solidity, allowing an easy on ramp for currently developed tools on the Ethereum EVM system 
:::

QRVM is the worlds first quantum resistant virtual machine, utilizing quantum resistant cryptography to secure the smart contracts and on-chain operations.

</TabItem>



<TabItem value="wallet">

<h2>Zond Wallet</h2>

:::note
Project Zond implores 2 different wallet address schemes, each using different quantum resistant cryptography. Dilithium and XMSS addresses can be generated using the CLI tools 
:::

Information on everything wallet related for Project Zond 

</TabItem>


</Tabs>
