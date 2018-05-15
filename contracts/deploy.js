Web3 = require('web3')
var web3 = new Web3();
provider = new Web3.providers.HttpProvider("http://localhost:8501")
web3.setProvider(provider);

function compileCode(fileName, contractName, web3) {
    fs = require('fs');
    code = fs.readFileSync(fileName).toString()
    solc = require('solc')
    compiledCode = solc.compile(code)
    abi = JSON.parse(compiledCode.contracts[':' + contractName].interface)

    return [abi, compiledCode]
}

function deployFromAddress(fileName, contractName, address, web3) {
    [abi, compiledCode] = compileCode(fileName, contractName, web3)

    // Da unlock luc goi deployFromByteCode roi nen o day k unlock lai.
    account = web3.eth.accounts.privateKeyToAccount('0x9b832743b2c39d1f13ee262ec326cebfe2e5c12b957a5019a2e33896a7ac8502');


    var myContract = new web3.eth.Contract(abi, address, {
        from: account.address,
        gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
    })

    myContract.methods.getVotePollInfo('0x74657374').call({
        from: account.address,
        // gas: 5000000,
        // gasPrice: '30000000000000'
    }).then(function (result) {
        console.log(result)
    })
}

function deployFromByteCode(fileName, contractName, web3) {
    [abi, compiledCode] = compileCode(fileName, contractName, web3)

    var contractClass = new web3.eth.Contract(abi)
    byteCode = '0x' + compiledCode.contracts[':' + contractName].bytecode

    account = web3.eth.accounts.privateKeyToAccount('0x9b832743b2c39d1f13ee262ec326cebfe2e5c12b957a5019a2e33896a7ac8502');

    web3.eth.personal.unlockAccount(account.address, 'acc_pass_2', 600)
        .then((response) => {
            console.log(response);
        })
        .then(() => {

            contractClass.deploy({
                data: byteCode,
                arguments: []
            }).send({
                from: account.address,
                gas: 5000000,
                gasPrice: '30000000000000'
            }).then(function (newContractInstance) {
                console.log(newContractInstance.options.address) // instance with the new contract address
                console.log(newContractInstance)

                newContractInstance.setProvider(provider)

                newContractInstance.methods.addVotePoll('0x74657374', 1).send({
                    from: account.address,
                    gas: 5000000,
                    gasPrice: '30000000000000'
                }).then(() => {
                    newContractInstance.methods.getVotePollInfo('0x74657374').call({
                        from: account.address,
                        // gas: 5000000,
                        // gasPrice: '30000000000000'
                    }).then(function (result) {
                        console.log(result)
                        console.log('test')
                        deployFromAddress(fileName, contractName, newContractInstance.options.address, web3)
                    })
                })
            })
        });

    // web3.eth.accounts.signTransaction(tx, privateKey, (err, signed) =>  {
    //     const tran = web3.eth
    //       .sendSignedTransaction(signed.rawTransaction)
    //       .on('confirmation', (confirmationNumber, receipt) => {
    //         console.log('=> confirmation: ' + confirmationNumber);
    //       })
    //       .on('transactionHash', hash => {
    //         console.log('=> hash');
    //         console.log(hash);
    //       })
    //       .on('receipt', receipt => {
    //         console.log('=> reciept');
    //         console.log(receipt);
    //       })
    //       .on('error', console.error);
    //   });
}

deployFromByteCode('Auth.sol', 'Ballot', web3)


