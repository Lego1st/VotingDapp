var keythereum = require("keythereum");

// var datadir = "/home/lego1st/Meow/VotingDapp/devnet/node1/";

// Synchronous
var keyObject = {"address":"d05d7078001a5dc2b054f9103e3a0b20809c7812","crypto":{"cipher":"aes-128-ctr","ciphertext":"f0c4a0e6ef39ca320a9ae261edd150afbf40ce2c493a0e2c2e83c54c1ac3c6cd","cipherparams":{"iv":"1f0010cbd33b4252ff5089481527161c"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"a86264ef049415a4fd17dc41a4083d31d125c1cf083e1dbba48688de0d85ce3d"},"mac":"95d0076bac5d4994bd77da540c0cbba3d17ae86434ae67e2c7b9487302d7f5d1"},"id":"d735a803-c1b6-405e-948f-01ee2d17fbdc","version":3}
var privateKey = keythereum.recover("acc_pass_9", keyObject);
console.log(privateKey.toString('hex'));
