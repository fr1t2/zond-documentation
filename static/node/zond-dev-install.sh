#!/bin/bash

rm -rf ~/.zond
rm -rf ~/zond
rm -rf ~/Downloads/bootstrap-devnet 
rm -rf ~/Downloads/bootstrap-devnet.zip

git clone https://github.com/theQRL/zond ~/zond

wget https://zond-docs.theqrl.org/node/bootstrap-devnet.zip -O ~/Downloads/bootstrap-devnet.zip
unzip ~/Downloads/bootstrap-devnet.zip -d ~/Downloads/

cp -r ~/Downloads/bootstrap-devnet/block/genesis/devnet ~/zond/block/genesis/
cp ~/Downloads/bootstrap-devnet/config/config.go ~/zond/config/config.go

patch -u ~/zond/config/config.go -p0 <<'EOF'
@@ -178,7 +178,7 @@
 func GetUserConfig() (userConf *UserConfig) {
    node := &NodeConfig{
        EnablePeerDiscovery:     true,
-       PeerList:                []string{},
+       PeerList:                []string{"/ip4/45.76.43.83/tcp/15005/p2p/QmU6Uo93bSgU7bA8bkbdNhSfbmp7S5XJEcSqgrdLzH6ksT"},
        BindingIP:               "0.0.0.0",
        LocalPort:               15005,
        PublicPort:              15005,
EOF

cd zond
go build ~/zond/cmd/gzond
go build ~/zond/cmd/zond-cli