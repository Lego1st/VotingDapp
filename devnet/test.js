const EthereumTx = require('ethereumjs-tx')
const privateKey = Buffer.from('80724f16d25457db6a20da1fc7c3a4d6bf5bbf76151ff81f79a55d3ab70fc7e6', 'hex')

var contractAdrress = '0xaa9153babb4d918ec7cac0790a182b8a18802cd4'
var myAdrress = '0x20301b7f0b6341775493e1bc21b64c7e6a6597fe'
const txParams = {
  from: myAdrress,
  to:contractAdrress,
  nonce: '0x00',
  gasPrice: '1', 
  gasLimit: '0x9710',
  value: '0x00', 
  data: '0x656afdee13e002030b331d6e',
  // EIP 155 chainId - mainnet: 1, ropsten: 3
  chainId: 1812
}

const tx = new EthereumTx(txParams)
tx.sign(privateKey)
const serializedTx = tx.serialize()