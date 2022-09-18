---
docstatus: DRAFT  # one of {DRAFT, 30%, 90%, COMPLETE}
id: node-cli
title: Zond Node CLI
hide_title: false
hide_table_of_contents: false
sidebar_label: Zond Node - CLI
sidebar_position: 5
pagination_label: Zond Node - CLI
custom_edit_url: https://github.com/theQRL/zond-documentation/edit/main/docs/Node/node-cli.md
description: Zond Node CLI
keywords:
  - docs
  - node
image: /assets/img/icons/yellow.png
slug: /node/node-cli
---


:::caution DOCUMENT STATUS 
<span>This document is in: <b>{frontMatter.docstatus}</b> status and needs additional input!</span>

- Need example commands/responses for TX types
- Need example commands/responses for genesis commands
- Need example commands/responses for dev commands

:::


The `zond-cli` gives users and developers the most basic means to interact with the QRL network for fundamental chain operations. Allowing users to create new wallet files, sign transactions and more.

In order to use the `zond-cli` zond must be installed. It is not necessary to use sync the node to use the cli, however you will need the address and port of a publicly available node to interact with the chain.

Follow the [Zond POS Node Installations Instructions](/node/node-installation) to get started 


## CLI Help

All command line options have a help file available to assist in the use of the `./zond-cli --help` command. 

```
NAME:
   Zond CLI - Zond CLI

USAGE:
   zond-cli [global options] command [command options] [arguments...]

VERSION:
   0.0.1

COMMANDS:
   wallet         Commands to manage Zond Wallet
   dilithium-key  Commands to manage Dilithium Keys
   tx             Commands to generate tx
   genesis        Helps to generate a genesis block
   dev            Developer only command
   help, h        Shows a list of commands or help for one command

GLOBAL OPTIONS:
   --help, -h     show help (default: false)
   --version, -v  print the version (default: false)
```

Additional help is available in most categories. Include the command before the `--help` flag: 

`./zond-cli wallet --help`

```
NAME:
   Zond CLI wallet - Commands to manage Zond Wallet

USAGE:
   Zond CLI wallet command [command options] [arguments...]

COMMANDS:
   add-xmss       Adds a new XMSS address into the Wallet
   add-dilithium  Adds a new Dilithium address into the Wallet
   list           List all addresses in a Wallet
   secret         Show hexseed & mnemonic for the addresses in Wallet
   help, h        Shows a list of commands or help for one command

OPTIONS:
   --wallet-file value  (default: "wallet.json")
   --help, -h           show help (default: false)
   --version, -v        print the version (default: false)
```

Help goes even further: 

`./zond-cli wallet add-xmss --help`:

```   
NAME:
   Zond CLI wallet add-xmss - Adds a new XMSS address into the Wallet

USAGE:
   Zond CLI wallet add-xmss [command options] [arguments...]

OPTIONS:
   --height value  (default: 10)
   --help, -h      show help (default: false)
```

## Global Options

These options allow advanced functionality

```
GLOBAL OPTIONS:
   --help, -h     show help (default: false)
   --version, -v  print the version (default: false)
```



## Commands

These commands are to be entered in a command line interface with the `zond-cli` installed on the same machine. 

Some of the commands listed here require a running node to broadcast the transactions. 

## `wallet`

This command allows wallet generation, secret key retrieval and address and balance information.

#### `wallet --help`

```
NAME:
   Zond CLI wallet - Commands to manage Zond Wallet

USAGE:
   Zond CLI wallet command [command options] [arguments...]

COMMANDS:
   add-xmss       Adds a new XMSS address into the Wallet
   add-dilithium  Adds a new Dilithium address into the Wallet
   list           List all addresses in a Wallet
   secret         Show hexseed & mnemonic for the addresses in Wallet
   help, h        Shows a list of commands or help for one command

OPTIONS:
   --wallet-file value  (default: "wallet.json")
   --help, -h           show help (default: false)
   --version, -v        print the version (default: false)
```

#### `wallet` Additional Options

| **Command_Options** | **Required** | **Format** | **Comments** |
| --- | --- |---| -- |
| --wallet-file | *No* | STRING | Location of wallet file (defaults to current directory where command is issued) |

### `wallet add-xmss`

```
NAME:
   Zond CLI wallet add-xmss - Adds a new XMSS address into the Wallet

USAGE:
   Zond CLI wallet add-xmss [command options] [arguments...]

OPTIONS:
   --height value  (default: 10)
   --help, -h      show help (default: false)
```

#### `wallet add-xmss` Additional Options

| **Command_Options** | **Required** | **Format** | **Comments** |
| --- | --- |---| -- |
| --height | *No* | INT | Height of XMSS tree (Min 4, Max 18) |

#### `wallet add-xmss` Example Command

```bash
./zond-cli wallet add-xmss --height 12
```
#### `wallet add-xmss` Response

```
Added New XMSS Address:  0x100500176d7b913edcc8ce5309a335cb1ff7fc9d
Wallet Created
```

### `wallet add-dilithium`

```
NAME:
   Zond CLI wallet add-dilithium - Adds a new Dilithium address into the Wallet

USAGE:
   Zond CLI wallet add-dilithium [command options] [arguments...]

OPTIONS:
   --help, -h  show help (default: false)
```

#### `wallet add-dilithium` Example Command

```bash
./zond-cli wallet add-dilithium
```

#### `wallet add-dilithium` Response

```
Added New Dilithium Address:  0x200117c87b91da26b8c1aa823cad3b6ad30f7e8d
Wallet Created
```

### `wallet list`

```
NAME:
   Zond CLI wallet list - List all addresses in a Wallet

USAGE:
   Zond CLI wallet list [command options] [arguments...]

OPTIONS:
   --help, -h  show help (default: false)
```

#### `wallet list` Example Command

```bash
./zond-cli wallet list
````


#### `wallet list` Response

```
1   0x100500176d7b913edcc8ce5309a335cb1ff7fc9d  0
2   0x200117c87b91da26b8c1aa823cad3b6ad30f7e8d  0
```


### `wallet secret`

```
NAME:
   Zond CLI wallet secret - Show hexseed & mnemonic for the addresses in Wallet

USAGE:
   Zond CLI wallet secret [command options] [arguments...]

OPTIONS:
   --help, -h  show help (default: false)
```
#### `wallet secret` Example Command

```bash
./zond-cli wallet secret
```

#### `wallet secret` Response


```
1   0x100500176d7b913edcc8ce5309a335cb1ff7fc9d  0x1005005d9d825d672a16b7cec06e3249237ce9353728d6f887b0b43269f94a4a4b725da030f0ef7aff69d97a6970b7ff746f32  badge filled gleam straw glare issue bike length scent thing evade deaf travel fluent chilly inert martin arrest crate pass excuse pitch isaac sudden couch award lawn was sturdy plump insane list jockey vienna
2   0x200117c87b91da26b8c1aa823cad3b6ad30f7e8d  0xacb1c27e20245fb9e7ddfe703ba9466b7120684ab88849255663ab76acf684b15d4d27f762846ce398e01530554d3cd2  punish brainy liable acute grace panel tactic took detour needle hood barrel helium proud matrix mutiny found depict keeper son macro best fast linen grudge endure thorn mode bench albeit fasten smooth
```


---

## `dilithium-key`

CLI interface to manage Dilithium keys using the `zond-cli`. 

:::info
Keys are generated by default into a file named `dilithium_keys` in the directory the command is issued and will look for a wallet.json file in the same directory. See additional options to change default file locations.
:::

#### `dilithium-key --help`

```
NAME:
   Zond CLI dilithium-key - Commands to manage Dilithium Keys

USAGE:
   Zond CLI dilithium-key command [command options] [arguments...]

COMMANDS:
   add      Adds dilithium key from existing wallet
   list     List all dilithium keys
   help, h  Shows a list of commands or help for one command

OPTIONS:
   --wallet-file value  (default: "wallet.json")
   --help, -h           show help (default: false)
   --version, -v        print the version (default: false)
```


#### `dilithium-key` Additional Options

| **Command_Options** | **Required** | **Format** | **Comments** |
| --- | --- |---| -- |
| --wallet-file | *No* | STRING | Location of wallet file (defaults to current directory where command is issued) |

### `dilithium-key add`

```
NAME:
   Zond CLI dilithium-key add - Adds dilithium key from existing wallet

USAGE:
   Zond CLI dilithium-key add [command options] [arguments...]

OPTIONS:
   --wallet-file value    (default: "wallet.json")
   --account-index value  (default: 1)
   --output value         (default: "dilithium_keys")
   --help, -h             show help (default: false)
```
#### `dilithium-key add` Additional Options

| **Command_Options** | **Required** | **Format** | **Comments** |
| --- | --- |---| -- |
| --wallet-file | *No* | STRING | Location of wallet file (defaults to current directory where command is issued) |
| --account-index | *Yes* | INT | Index value of the key |
| --output | *No* | STRING | Location of dilithium key file (defaults to `dilithium_keys` in the current directory where command is issued) |


#### `dilithium-key add` Example Command

```bash
./zond-cli dilithium-key add --account-index 1
```

#### `dilithium-key add` Response

```
Added Dilithium Key
```

### `dilithium-key list`

```
NAME:
   Zond CLI dilithium-key list - List all dilithium keys

USAGE:
   Zond CLI dilithium-key list [command options] [arguments...]

OPTIONS:
   --src value  (default: "dilithium_keys")
   --help, -h   show help (default: false)
```


#### `dilithium-key list` Additional Options

| **Command_Options** | **Required** | **Format** | **Comments** |
| --- | --- |---| -- |
| --wallet-file | *No* | STRING | Location of wallet file (defaults to current directory where command is issued) |
| --account-index | *Yes* | INT | Index value of the key |


#### `dilithium-key list` Example Command

```bash
./zond-cli dilithium-key list
```

#### `dilithium-key list` Response

```
Index #0    
    PK: 0x57326a15821657763265390f35f29d0191cafe8163b82687b97976ac208ee8bcc06e60e802bf6ba46fd2699db8ef00ef64d919862043f254cf8f929b29c0d29bb69dfbd8862186289c6ebc064178f593762be7bebbe91b21e88c07b0716aa50a020eb7a2c960aa2490be24707181bc2d6324cfa1197f5237c3bd0b0370cdbc85d28fce6cb13b06fc272e7ed5d7fd77e54f694a2f87e1a068016f64942fe536e78f4f254f05e8bfb913f06880cb345805689869309e5ca5e7026014e21bd1a0540b9d792573d0905a371016c3c3e7ffe853fc3e4d0c8791f3f8dc6d7d25515af29986bd8d0df5140a53a5461c86246866fefcb6b4430113e440d9d4f3d251038b4c461d84465f5576153431fad34fd8da8999d8c0a26cbdbf336fd83829b69826f3cedd285eec8b94131d1105917a2232efa734badc5a51b712180c9b3a8d0f33155e33e99ebb7f81cfaa9f03287cf6502d98154bad5c109a8f092f84e4096155aa979b7a1f703f7a58d925e689228374afbf95e0af8641ee96cc48b7e046727641234d922a9da07bf31b150106fc0fbf106ad19b882570e3c750cebc54718af91c327001d65ae66c364993998ccc1273cff6b3f7d794d78a4c47c032b738223133a5792769945e2edace365bcc33602bf07c09cfb88a4a6d96ffe00e667584e2d5541eb955ee6df38b2caf26ee11190e4611e4d8d5691d803a798e9a3a22462e4ec32269878159bad4d4614085dac66812793bb5b07fa7bd6baf99be818fa0360f9fb20e5012fd7bb6c614ef9942382b7d7036ae556c191fc69b2963114ecb44647e4b2deef2a52ab770d6e20b3fa759a83df7cfb5840e19519a9eef00addb7bb4478b0d81d6dd59f950328651781b6e74f75649daab6a8096fee1fdd4c5dcbbdf0344f026c48ae832ab98d8a6902f12ffcb6c325f0a489a576c3c51a5fe0d786a8edb4ee266321ce0cf9545cc2af44acb0d6ecec475a281f17c0a58b44a8c9a79224995d72550004b2b66d7a2374c245ed75d81ffc7777e7aaaa742df5e18e49c26cddc83db50c21e1c2871a8cc4dadddb0c5858066cffe238a1da7ef955885bc3396750effcd3c0753f82a0c13fe07584628af9e8d832f41284b115bd415c960cb35c7c13b25cbaaebde903dff391340e5682e33b7af820e5c250116fae62dff1c74e2293be4ebd5b2265ff7a941750b538e5c074f4845414dea455c58a4ce1745c32a7bdf1fd1719c24fa464d16d8db8cf14fbfe4d7b3b7713fa9fcf0e9937899dd6195f406aa1e8a05085c8ee8db0cee9336dbe37c65c88954cf5f6b625f211ba92f63394b8e1e993c2969d474da5a04a526fd22194f301389b2ae3d329e93b34ca44390a620cbb7fe6246c288d5c864f07c5e743ffbc1d7097b3b2e5c9d5e7af5a7024fe2faeb96406873e61325c567bf2725308850dd713bf29387d209e7a48e14da04c35df06c65ed416c330800f00ed3027c1c38594d592291dddfc3ec08a09446be0c8f9ee1962926e988aba3af0e3f12c4903e3e521d5870a0c555ad4fde34bc7c9e3fde4cc4abb329f5071b62da740f9d9360d8c9e65ceba9a3fde150dae77c7fcd1405cca90ef5d24974b8c8cb3341e885faae21939290cb692fb3e841f2aacfef356b8eb4538e413f37f483c3f7e93c5d227609f95296e17aa8c0ccd556816267fbddd663e07d1e8ea542015c05478cd73cfd71be6bc8a411e965e21dd04eb0261d9235ee3d92f95fb2f3dedd4bafc6f83692d646d7ea82b708d6ba8a2ce46660e0fae95e7cea4aa13f1e86e575f5739af3a4a5a3a095deaf20d81a9c5487070a003af294fb199c72f0f807e3bc24ab8f1203422aab3842a5d3a41ecba6a3f1d4e3ffd2aa72946da8b0731ccfc40cff6fbaa7705dfc9fd30f42efe060b0fd0734c40ce084d62d083678cc11f636e832a811f69828de28fa51dbd10b97c0d33469f59b0cf0ceaf263f2d0f96ec6dc0ae2440ff068b5cc486321305e1025af9d2314c175fa72c04f9dee8c41106175b7f7d6b5a5d3887105a48e8bf98fbde6e99368f64ab51187beaff5204f8fa98959795576495df5ffefc078a  
    SK: 0x57326a15821657763265390f35f29d0191cafe8163b82687b97976ac208ee8bc7975a2dcae2cd40dc363eb3cb2a21b8faecceeb3cd81fc4b3002917b6c8d800f29c8b8725066133c1ef52f5b182d32684da044f95790081d3b7faa67c52dd5381cab25ee51c0bdadd5995200f509e05d43947116189800a602065601522559151aaa014828208a825a315693275828847859224a889484015438202684689914aa82a792a96a43397931852537883a1248344351356972343388342261065215943040999285760600745181a2257109521648986009a03a12265949a820564816920032570a233676361a6588a6919859094310357123762aa83632a582303149698434354149690275788658a6a97997450782871868185477530a3708618a96455423480762a218815a04a604763084984842431a394751170523a8568a69247908010369372211a8a08a66a84358026207403a17211a52864556a96737162872777a8303211048216a6495503557967856843703827469a8870412363570817586a4a92852055442253783195677073802630385149a9008188aa33849457959446073369108606171232a166516088870a156068905571aa367339a49486462601267a876476aa645320a435621383064201780767784434a72009134755498467103720a4845379599801036a8191025699842a4aa4280216848622691046438228148480a336138583093a5892773924913396288510922816949682554123a1a8460613796708807976556810306730173930970536347278429901539989986464185317300946334a5763471272a79813596019a962a8049a3a9139510361435950698aa605372813445060592928a93056667975894aa5048613473a0645471aa06495a97850a21170225a5645a079a991454439aa53738a034687523552373a423652041721207aaa46603535a452744286a734013a82391365a563570647219332a187809a65753aa0443a76460109085a81aa206585377065a4a923090595851930872a0779aa1961924958a7aa2867050214150a788385656268508718a06a13a86627497787468504462977595294a4134012233128586520129240415506132009a3773414826927011aa337a7379038088460023384073879097780131191313560491146146781964a6a6356502738184791737a97988568219195451306315916276a05a6173974930431a24787802663962921924a98a04870858541551a21699905016a0015183a365912278280822a304660546a2153429a15412956a381655a4282123599a14a085440a9240647077882a924665418458015491965327078a522624a34988440995540180927888229524680367a66583923388142312a393241661055439a517727486062a065428504a2893645903856191a02176717088a527065950223476382121803035404399202225149293262508381264136883440239441247489095688310743640762515172302739380a7957085674641354257187a41336a68466172a1930a35963182a28052214352044740456a9018092799787888889950866129aa0633099a8609133a0764a69557348a241773113617a11764343990389758a42a954805422291a14600314155129827521026730605a325a72559a4946a9887999152199a1182a681351642719681a2138846022907555824aa0240433948869676858424923950459213021373a097a6a4a2a3177686646455dc69ea335620b4d73f80057d64856e8dd48bf63a0a8da8cc2b4208b417e8fc3b52bd929796e43813e3a9761b05443863c976da3d5ad39df5b69465f676587768412cba39c036957c80713108c21e9a085be84f080c6a2a62e715fa3622de7daed051c51a84c7e04a97a2b9534e522ab3a6930a542adb90736608676baea529fd08f376b591fe25f4016a61bc15e407872319bccaa5609ef0d74c169f172ffc0cdeed7b7c3a653cb9d85727bd1e6614f14e799caae4f3a0ba2028cc99d9e61ae9f946e39022100c8256f28c3cc7c8b42c3145e9501c4c4f8951d3070a0ff96e8b62251a348d749171d5c9b872efec160038b7149c0c19eb47c636fc052a26b59b1bb8f8c63b429a9181d139d663d689031741439d7362b9bd0d033a46beaa52aa07e9c09d02de5a53d1542fca6b7319141ca7b8e163acea49d6f9c7b52b8bd6b3c7666dfd5877625719b86ac318c92dbe0c1b16b4d9b45e77b7ece0ff8083689ae040cbf4dcd12cdbff5aa57d9b73928787475ce66d511289421ae398c2bb513e6b9056e0d1bc9a3ff92de21441cbf2d8fbbaa09e4cfdd5483f74be27f0054596786375ac315ade3b38ca24360027a3de84474ba19e20fe4d485eb1c31d75255debd738012e8b708e13e191e85d1d1b8ee12e9a714686cc0606029989c08f52ece01849581581969cd99c572b57e7c802ada28654755763e1c896e738e4eb4d7cc406c35a209993fa91e9e10971f822788aeca101197e6ab5bf055b7a285a116ce0bc3a8e97b7394a676f0e97d7dbe1f9655b6599cbd4186645acff9ee7ec25842150868eb1dfb55629c8c0a442bf12c9718ee05e2e032a6cf495e193ea802976659a49b4cdcd94699e6304eba4d954aff773e07366e6ac2dcd48ed79a425081a6cc3681973b46e5ff2780b6f53dac1894380eeab16c76cf82b00c6fb7d935e0255edc9bb780ae0df5934fd9f65d68f1ed366a7499153ee796c7feb8b863ac092f44f848f69cc70a00e71be869122219df71b87a4a401f311985c12f8294fcab5ef7a84712651900b842991906e2afb03c0adc0c66713aa123749bf369b66414319fdd1e13e8d8969390665f2ad997e89ae2674934cd6722a13c96768b33105ea36a53506fc1ba25e33bd5c52e5ed6ea97b324b5afd3ea0a1f3588982461daf3efca79be69f068c643e063cd98344c056dbe6282a04a81be671e02707dbf0516f1d78b46e017dfb59fe949e11cb29943509a02de822c0f5f2e8d5047f2aa4698a5818c0da42e697a30b562a61a1c6a6ce97e94e44cca17eed465e7703a677d1541c4ea4380c78330b2a736463dcf4af1303997c75568d1dc6505c8a77f41c6efdf19f0a22dc3d8aab58efdb9a3118c0f7ec63858446f6a2da9b5d1f35322a8de62b1f633ced6e83566be725350131e0c7e63696f787c9b35c99f2379cf0ee217b733d06ceca0f4b724f1598f4a6a8701432a25ffaf83f012a2d9b9f891da3b7fa5fdaf28877c8a78e042b78bf085f43a566ec51ca1a3db79fb3df74b7e82ae40efe9ba5f2e0fbd662dff3b466bab91aa7c6d8d3d43d5d0eebb31d60d45c204c003ac274b0b019ca03f39862da4a27dded09b01e22407e937e0a3d0cecff642c16e16e9137b58a03141a68047b900483bbca739de0183fedf742226ba9a6a3c01052d0d1e2e498b8703415bd7c1ee1f7918733ef01448a439c296c9d66f43fe8facb59730bc466dc2845fc81d53f13a9c04d5d10734563e540c242062668f887f1999ce361f167d6dc82b62e0bdc95d3da53c5ce4a41a20c5f4366cdc335d961301641ad8c8dfb115fde3bdbcf1033bb0e2e07a42520d6e1bffbca3d579c42a3d50f970cf909224dd91fb23b2612aaccb445e022af2f20b37bd767760548fc96c0342a1b71a5da9f531f1c95eba46d14fab1751f39aa950420f0448367f016ef521f07234b7a98ce8e3827dd759dc5c99bbbb983555cb2c1a29390435b583194e8dfb29b6057d5a68c3f4a24ced8a6b9b67e178d3f871b83fb1cd40a14f35590207682eaa0fd4dae52f390e06287ccebe05b9e9d8a44f5497fc084dcc9284a91edd841a9270617141baf96f6fc312abb4cf980f916ae33a9f36126c0b9a6c411151f3a81e72842385d3e32cadecbbe14bca55b34a05399e6e59e81b540c0410778d25f5e9ddd2411b6e2abf383f4f97b053327a0a0455d3778a40c8abbafbf673834c26e98c31b78bde5092daf58dff8c1fde35d3d079191f4dce170005b8a3f5786c72f91848b3c81112569412a7ed1c96158ae5caf1bba007f387b0fe865bcd8b8c25cc8c223a593f6a545621710b4b605ba9c21dd9f5bbf8547a733ccbbbb707c8596d60e0a64511e233c7e5a075b05706bd4a8c8e81764860ba2ed7003c393fa22544a2c5f93f746846098678b6c2fb238c833f5005078e38e1ff85244ac95c4e506f5110aeb3a9a521e2839b8c2279ec78f7038df9be775252976a59ecc634a42f0892cd10194518ce631679a7588607e1ec869fdb74277c7a41a397038c3d099d4866eec97d40d63918173875fa90e02c4e662bc089a8494b0627255dcd56eb8dc806e97c053aae6848d2e549001cf7c2f786e8b06c510dae5f82eb829b70f4592f08370fd0a1b963167a3fe54f93e85d295f042e7b7d15c18204a44be73affd5fcced6968f20972547f7b647f89e8570e3d57d781d36ee95e8a740fc26fb3a214a3a3627bd4bf0b35d272984dc1960a6a77d68743d8ad20e25dbc6758555b1c9b6a3bab7b83d1eb054dd841e6c5a657a1af4e45e3a1d20584a19ff38747c837e021bdc3b2fcacaceb14a1faa1c3d0704774b956f5148cb13eaa8c9fe640d63c668021546f7976ea111a3568b5069298509f5991c93d515bf37d5569e786bcc1808b5e9d09e9d6ec1c01e6e814a912cec0397aeb84477de611a2673d900210f2a9362498ea1c619255ab7f2dffd1d11d4e195adeacbe94644737c2ce2cf94fa1d49c9f76b99857719d54779491d11fc0db1ebb62d2bbafc2c6ab1229f0aeedd8696debfcc4e1accc922d7c9575300f56e5d8dad83399f463d2f5919bd5f45012194132cb55dc013a92db5ec5d6ea179da0edd87e282b8d0888b79ab96443eff675107f45c01e39bcf802d6b8223cc30c2c21b12a0e9c37f79c04e7e3da91
```

---

## `tx`

:::caution NEEDS IMPROVEMENT
- Add example commands and responses for each tx type
:::

#### `tx --help`

```
NAME:
   Zond CLI tx - Commands to generate tx

USAGE:
   Zond CLI tx command [command options] [arguments...]

COMMANDS:
   stake                        Generates a signed stake transaction using Dilithium account
   transferFromXMSS             Generates a signed transfer transaction using XMSS account
   transferFromDilithium        Generates a signed transfer transaction using Dilithium account
   deployContractFromDilithium  Deploys a smart contract using Dilithium account
   callContractFromDilithium    Calls contract using Dilithium account
   offChainCallContract         Off-chain contract call
   help, h                      Shows a list of commands or help for one command

OPTIONS:
   --help, -h     show help (default: false)
   --version, -v  print the version (default: false)

```

### `tx stake`

```
NAME:
   Zond CLI tx stake - Generates a signed stake transaction using Dilithium account

USAGE:
   Zond CLI tx stake [command options] [arguments...]

OPTIONS:
   --wallet-file value     (default: "wallet.json")
   --account-index value   (default: 1)
   --chain-id value        (default: 1)
   --dilithium-file value  (default: "dilithium_keys")
   --amount value          (default: 0)
   --gas value             (default: 0)
   --gas-price value       (default: 0)
   --nonce value           (default: 1)
   --std-out               (default: true)
   --broadcast             (default: false)
   --remote-addr value     (default: "127.0.0.1:19009")
   --output value          (default: "stake_transactions.json")
   --help, -h              show help (default: false)
```

#### `tx stake` Additional Options

| **Command_Options** | **Required** | **Format** | **Comments** |
| --- | --- |---| -- |
| --wallet-file| *No* | STRING | default: "wallet.json" |
| --account-index| *Yes* | INT | default: 1 |
| --chain-id| *No* | INT | default: 1 |
| --dilithium-file| *No* | STRING | default: "dilithium_keys" |
| --amount | *Yes* | INT | default: 0 |
| --gas | *Yes* | INT | default: 0 |
| --gas-price | *Yes* | INT | default: 0 |
| --nonce  | *Yes* | INT | default: 1 |
| --std-out | *No* | BOOLEAN | default: true |
| --broadcast | *No* | BOOLEAN | default: false |
| --remote-addr | *No* | STRING | default: "127.0.0.1:19009" |
| --output  | *No* | STRING | default: "stake_transactions.json" |

#### `tx stake` Example Command


```bash
./zond/zond-cli tx stake --account-index 1 --amount 10000000000000 --gas 1000 --gas-price 0 --nonce 0 --broadcast --remote-addr 45.76.43.83:19009
```

This will create a `dilithium_keys` file in the local directory the command was issued. Move this file to the root Zond node directory `~/.zond/dilithium_keys` to begin staking.

#### `tx stake` Response


```bash
{
  "chainId": "1",
  "nonce": "15",
  "pk": "l/M/dy/8KnnkEHJ7L72Ft8U/ApLUzAQSgcqJeV0HCKoIBdB0VS7e1IhCf/GzPtCamsk5SzkGG8AVoPUxfGjfhvie7s0FaNuA70XDJQYAXEGAVZd+1K5zsCzqYFFt1jOOAeLMoPDip9l7FNT5DzsD+WKET0T9GUVWBU8Ofumrl3YlUtXUiJqHlkFcoagDiN6ktCj74VHiJdPxqdN2eQTbKhQd1i70lXg/S7ZPVgYo4ziIA84HxnGuIWwbsC48tKC9y+qm/xU9bAooqsdCcuMBb9jCz/luvfpdLZ2gC+XQjS4ihVWb5X+YrV8YopeK3ZeWCKU/3lJiKUGJms8uHSKtJr67bZRCnxgBOcwzBNvYr7t7RI+VX1Jyf1u49ogcGaSMdNeSiEUk/2QlCM8mhJbJLq8E5ecJVn7w9fosJktZmeQhFpC4W06HICPmC7w74XCOLZpYFU7puTGgo7jIM6+BuvovpgElh6vivsnwND9Nao8LfywmWnNzj4s6kfyFbrOTDRRXrlD6C4IuDla1gZo6+bp70wJ3mpCbFS424mtBIyj7/zbxKpzvN9ag6k7VaJMJ3kzBpWR+xMHhxTN4+08WIVnSmYSxJECJN8j3xyQQXo5luP3BIZI3AjAYkBFBEDNo8XphZGQdyi7CF6/XSLry1g9z5N1HwDpzGX+sUg+BfXY/aM8dl1UayaxkF+BPOpAa0sQXEW40A2hWZzd0lQyAEY3qtr4WCGmkMmTWjMU3idHMXabRP9b/bPCGQ5G0e8FvCb0L3mS47NnUZjf8W2YRTIouEn5ehq4yz2IlTR86UGQZsPwA7bigNmMQZ+ypKrLLX9IGuVEnW7enCUXTQTSJyDhoXJ1/pq7Wxs5iwvZdCqQC6FYUMBqkBlhbygKnKY2OfWqh4zKSRmGz9bG95A8g65bEKEIYfwAT/mKVp31s0wBn/Ni8RSVeoSwVQfO7fgokxMGoa3CjhRbc/mwzUKHsMCIITUsBIMzDg6tEpnftfrqgpvqfnKuG8xVYvRP+cBGZiADMyb+O36FRy+PXCfcZeNsmMAayN41h1zC2NCmYxtDHdPAw1Jn4NOI+J6OXx/ymBbOQGQ+izcG1P+ile1OdJEGeJkNWWdq/dxh//lnn3qHGdMRFHJ+DaW25z7X5bh39wFPN4MhAMMPNWbcsGnYzCvH7Mt8wd5PI0IdSxEwvlisFS3qNzduvbOpfDMA2GHzw4gSkuc92IqlJMs4trqUL0Vm3LxeAGExe2WePS2UHtb4XKsnlbk0krTlMXA51h8HdUUqi5CNhP1xgnEFQFzSHC2pRM0yqqtav3PqmyZsuK2VOhGRebIn8XrcTEL4qdzNOwvemIwG2OiWwKnYAtfG1/wK+tk3lAQmaj1KiPzkCUsR6UhzC293gPQAVtZNd/U9t9C3nVLOQ6Jp/bHeoVr1r3HzShwNwm3ErASOm9D6V7oEx4YY8YgWWCSEcwP/0/2/8HyuJz7pN6PfUg4NqqnCfiuqb4h61Mbhwsp7I0ftLusTSBoDyTV4v2jQUe1NXLKnE0MOV5QkmVouRwLBBPVJ62nPJRop/T04xCDQYzrPfOL2fJLG5c2ky8yNgzK6sISZt0gLxNKM5OsiNYgcLAPhHyfqiWJRTigdJATQojN7BDwqdVxIuQR1//ZUE56SP1ntaqt0iL3xUpZakjshjZJRdoIfJf6bpl1HpEPzMe43aTRakYsp4mh6oH0XZV9otOSuW3kIrowd35hSmOscsaJ3q8uTaXg/7ms5zd/Eb2nDlpE/QmUR2P6li+D1KN4FTsy7GUdeCyVJEs0OXAc891qKcXrwdKmbB9fNqhKehgUglGvmIqppKDQ+mHfKHj0kkMH4VBvEjou6mQtbUY71adMcYzqcMnbdO1FhDz/VezsTK0TRHrPbxm+Qpnjt+tre7CpdzJuJJInxv+eiCJxxpvW2SBVIbKsb1ZG9f1ls9iFy5Zeo=",
  "signature": "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",
  "gas": "2000000",
  "gasPrice": "10000",
  "hash": "ytUbghWZ46sWDkmZYaItUEnbcATbpJ8xtM9J8v1dt70=",
  "stake": {
    "amount": "100000000000000"
  }
}
Transaction successfully broadcasted
````
### `tx transferFromXMSS`

```
NAME:
   Zond CLI tx transferFromXMSS - Generates a signed transfer transaction using XMSS account

USAGE:
   Zond CLI tx transferFromXMSS [command options] [arguments...]

OPTIONS:
   --wallet-file value    (default: "wallet.json")
   --account-index value  (default: 1)
   --ots-key-index value  (default: 0)
   --chain-id value       (default: 1)
   --data value           
   --nonce value          (default: 1)
   --std-out              (default: true)
   --broadcast            (default: false)
   --remote-addr value    (default: "127.0.0.1:19009")
   --to value             
   --amount value         (default: 0)
   --gas value            (default: 0)
   --gas-price value      (default: 0)
   --help, -h             show help (default: false)

```

#### `tx transferFromXMSS` Additional Options

| **Command_Options** | **Required** | **Format** | **Comments** |
| --- | --- |---| -- |
| --wallet-file | *No* | STRING | default: "wallet.json" |
| --account-index | *Yes* | INT | default: 1 |
| --ots-key-index | *Yes* | INT | default: 0 |
| --chain-id | *No* | INT | default: 1 |
| --data | *No* | STRING |  |
| --nonce | *Yes* | INT | default: 1 |
| --std-out | *No* | BOOLEAN | default: true |
| --broadcast | *No* | BOOLEAN | default: false |
| --remote-addr | *No* | STRING | default: "127.0.0.1:19009" |
| --to | *No* | STRING |  |
| --amount  | *Yes* | INT | default: 0  |
| --gas  | *Yes* | INT | default: 0  |
| --gas-price | *Yes* | INT | default: 0  |
 
#### `tx transferFromXMSS` Example Command

#### `tx transferFromXMSS` Response

### `tx transferFromDilithium`

```
NAME:
   Zond CLI tx transferFromDilithium - Generates a signed transfer transaction using Dilithium account

USAGE:
   Zond CLI tx transferFromDilithium [command options] [arguments...]

OPTIONS:
   --wallet-file value    (default: "wallet.json")
   --account-index value  (default: 1)
   --chain-id value       (default: 1)
   --data value           
   --nonce value          (default: 1)
   --std-out              (default: true)
   --broadcast            (default: false)
   --remote-addr value    (default: "127.0.0.1:19009")
   --to value             
   --amount value         (default: 0)
   --gas value            (default: 0)
   --gas-price value      (default: 0)
   --help, -h             show help (default: false)
   
```

#### `tx transferFromDilithium` Additional Options

| **Command_Options** | **Required** | **Format** | **Comments** |
| --- | --- |---| -- |
| --wallet-file | *No* | STRING | default: "wallet.json" |
| --account-index | *Yes* | INT | default: 1 |
| --chain-id | *No* | INT | default: 1 |
| --data | *No* | STRING |  |
| --nonce | *Yes* | INT | default: 1 |
| --std-out | *No* | BOOLEAN | default: true |
| --broadcast | *No* | BOOLEAN | default: false |
| --remote-addr | *No* | STRING | default: "127.0.0.1:19009" |
| --to | *No* | STRING |  |
| --amount  | *Yes* | INT | default: 0  |
| --gas  | *Yes* | INT | default: 0  |
| --gas-price | *Yes* | INT | default: 0  |

#### `tx transferFromDilithium` Example Command

:::caution
Under Development - Use the [API call instead](/node/node-api)
:::

```bash
./zond-cli tx transferFromDilithium --account-index 1 --chain-id 1 --to "0x202d32684da044f95790081d3b7faa67c52dd538" --nonce 1 --amount 1000 --gas 1 --gas-price 1 --wallet-file wallet.json --broadcast
``` 

#### `tx transferFromDilithium` Response

### `tx deployContractFromDilithium`

```
NAME:
   Zond CLI tx deployContractFromDilithium - Deploys a smart contract using Dilithium account

USAGE:
   Zond CLI tx deployContractFromDilithium [command options] [arguments...]

OPTIONS:
   --wallet-file value    (default: "wallet.json")
   --account-index value  (default: 1)
   --chain-id value       (default: 1)
   --data value           
   --nonce value          (default: 1)
   --amount value         (default: 0)
   --gas value            (default: 0)
   --gas-price value      (default: 0)
   --std-out              (default: true)
   --broadcast            (default: false)
   --remote-addr value    (default: "127.0.0.1:19009")
   --help, -h             show help (default: false)
```

#### `tx deployContractFromDilithium` Additional Options

| **Command_Options** | **Required** | **Format** | **Comments** |
| --- | --- |---| -- |
| --wallet-file | *No* | STRING | default: "wallet.json" |
| --account-index | *Yes* | INT | default: 1 |
| --chain-id | *No* | INT | default: 1 |
| --data | *No* | STRING |  |
| --nonce | *Yes* | INT | default: 1 |
| --amount  | *Yes* | INT | default: 0  |
| --gas  | *Yes* | INT | default: 0  |
| --gas-price | *Yes* | INT | default: 0  |
| --std-out | *No* | BOOLEAN | default: true |
| --broadcast | *No* | BOOLEAN | default: false |
| --remote-addr | *No* | STRING | default: "127.0.0.1:19009" |

#### `tx deployContractFromDilithium` Example Command

#### `tx deployContractFromDilithium` Response


### `tx callContractFromDilithium`

```
NAME:
   Zond CLI tx callContractFromDilithium - Calls contract using Dilithium account

USAGE:
   Zond CLI tx callContractFromDilithium [command options] [arguments...]

OPTIONS:
   --wallet-file value    (default: "wallet.json")
   --account-index value  (default: 1)
   --chain-id value       (default: 1)
   --data value           
   --nonce value          (default: 1)
   --to value             
   --amount value         (default: 0)
   --gas value            (default: 0)
   --gas-price value      (default: 0)
   --std-out              (default: true)
   --broadcast            (default: false)
   --remote-addr value    (default: "127.0.0.1:19009")
   --help, -h             show help (default: false)
```

#### `tx callContractFromDilithium` Additional Options

| **Command_Options** | **Required** | **Format** | **Comments** |
| --- | --- |---| -- |
| --wallet-file | *No* | STRING | default: "wallet.json" |
| --account-index | *Yes* | INT | default: 1 |
| --chain-id | *No* | INT | default: 1 |
| --data | *No* | STRING |  |
| --nonce | *Yes* | INT | default: 1 |
| --to | *No* | STRING |  |
| --amount  | *Yes* | INT | default: 0  |
| --gas  | *Yes* | INT | default: 0  |
| --gas-price | *Yes* | INT | default: 0  |
| --std-out | *No* | BOOLEAN | default: true |
| --broadcast | *No* | BOOLEAN | default: false |
| --remote-addr | *No* | STRING | default: "127.0.0.1:19009" |

#### `tx callContractFromDilithium` Example Command

#### `tx callContractFromDilithium` Response



### `tx offChainCallContract`

```
NAME:
   Zond CLI tx offChainCallContract - Off-chain contract call

USAGE:
   Zond CLI tx offChainCallContract [command options] [arguments...]

OPTIONS:
   --contract-address value  
   --data value              
   --remote-addr value       (default: "127.0.0.1:19009")
   --help, -h                show help (default: false)
```

#### `tx offChainCallContract` Additional Options

| **Command_Options** | **Required** | **Format** | **Comments** |
| --- | --- |---| -- |
| --contract-address | *No* | STRING |  |
| --data | *No* | STRING |  |
| --remote-addr | *No* | STRING | (default: "127.0.0.1:19009") |

#### `tx offChainCallContract` Example Command

#### `tx offChainCallContract` Response



---

## `genesis`

:::caution NEEDS IMPROVEMENT
- Add example command and responses for genesis
- Explain the usage of the function
:::

#### `genesis --help`

```
NAME:
   Zond CLI genesis - Helps to generate a genesis block

USAGE:
   Zond CLI genesis command [command options] [arguments...]

COMMANDS:
   generate  Generates new genesis block & prestate file
   help, h   Shows a list of commands or help for one command

OPTIONS:
   --help, -h     show help (default: false)
   --version, -v  print the version (default: false)


```

### `genesis generate`

```
NAME:
   Zond CLI genesis generate - Generates new genesis block & prestate file

USAGE:
   Zond CLI genesis generate [command options] [arguments...]

OPTIONS:
   --chain-id value                   (default: 1)
   --stake-txs-filename value         (default: "stake_transactions.json")
   --validators-dilithium-keys value  (default: "dilithium_keys")
   --genesisFilename value            (default: "genesis.yml")
   --preStateFilename value           (default: "prestate.yml")
   --help, -h                         show help (default: false)
```

#### `genesis generate` Additional Options

| **Command_Options** | **Required** | **Format** | **Comments** |
| --- | --- |---| -- |
| --chain-id | *No* | INT | default: "stake_transactions.json" |
| --stake-txs-filename | *No* | INT | default: "dilithium_keys" |
| --validators-dilithium-keys | *No* | INT | default: "genesis.yml" |
| --genesisFilename | *No* | STRING | default: "prestate.yml" |
| --preStateFilename | *No* | BOOLEAN | default: false |

#### `genesis generate` Example Command

#### `genesis generate` Response

---

## `dev`


#### `dev --help`

```
NAME:
   Zond CLI dev - Developer only command

USAGE:
   Zond CLI dev command [command options] [arguments...]

COMMANDS:
   genesis-bootstrap  Bootstraps the process of generating genesis file with required wallets and transactions
   help, h            Shows a list of commands or help for one command

OPTIONS:
   --help, -h     show help (default: false)
   --version, -v  print the version (default: false)
```

### `dev genesis-bootstrap`

```
NAME:
   Zond CLI dev genesis-bootstrap - Bootstraps the process of generating genesis file with required wallets and transactions

USAGE:
   Zond CLI dev genesis-bootstrap [command options] [arguments...]

OPTIONS:
   --help, -h  show help (default: false)
```

#### `dev genesis-bootstrap` Example Command

#### `dev genesis-bootstrap` Response

---