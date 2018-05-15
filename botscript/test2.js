'use strict';
const Web3 = require('web3');

const addressProvider = 'http://127.0.0.1:8501';
const contractJson = '[{"constant":true,"inputs":[],"name":"creator","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"ballotAdr","type":"address"}],"name":"setBallotAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"ID","type":"string"},{"name":"state","type":"bytes32"}],"name":"register","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getRegisteredID","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ballotAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]';
const contractAddress = '0xc568417fcfcee1792fc509147b6ab4d12062344f';

const privateKey = '0x8f1cd07a7c442fb5aff5f425f0ecde83c7fe5a21e33452a514cd4ebaac634dff';
const walletAddress = '0x116c2d5814bf759124e6c307f6c56e27ef74b6a9';
// const walletAddress = '0x20301b7f0b6341775493e1bc21b64c7e6a6597fe';
// const webSocketProvider = new Web3.providers.WebsocketProvider(wsAddress + '');
// const web3 = new Web3(new Web3.providers.WebsocketProvider(wsAddress));
const web3 = new Web3(new Web3.providers.HttpProvider(addressProvider));
// const web3 = new Web3(new Web3.currentProvider);
// web3Provider = web3.currentProvider;
// web3 = new Web3(web3Provider);

const contract = new web3.eth.Contract(
  JSON.parse(contractJson),
  contractAddress
);
// change this to whatever contract method you are trying to call, E.G. SimpleStore("Hello World")
// contract.methods.register("555555555", "0x466c6f").call((err, data) => {
//   console.log(err);
//   console.log(data);
// })

// contract.methods.getRegisteredID().call((err, data) => {
//   console.log(err);
//   console.log(data);
// })

const query = contract.methods.register("555555555", "0x466c6f");
const encodedABI = query.encodeABI();
const tx = {
  from: walletAddress,
  to: contractAddress,
  gas: 8000000,
  data: encodedABI,
};

const account = web3.eth.accounts.privateKeyToAccount(privateKey);
// var estimatedGas = web3.eth.estimateGas(tx);
// console.log(tx);
web3.eth.accounts.signTransaction(tx, privateKey, (err, signed) =>  {
  const tran = web3.eth
    .sendSignedTransaction(signed.rawTransaction)
    .on('confirmation', (confirmationNumber, receipt) => {
      console.log('=> confirmation: ' + confirmationNumber);
    })
    .on('transactionHash', hash => {
      console.log('=> hash');
      console.log(hash);
    })
    .on('receipt', receipt => {
      console.log('=> reciept');
      console.log(receipt);
    })
    .on('error', console.error);
});