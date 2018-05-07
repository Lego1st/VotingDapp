import json

genesis = json.load(open("genesis.json", "r"))

accounts = []
node_files = ['', 'node1/accounts.txt', 'node2/accounts.txt']

for i in range(1, 3, 1):
    with open(node_files[i], "r") as infile:
        x = infile.read()[:-1]
        accounts.extend(x.split('\n'))

data = {}
for account in accounts:
    acc = account[2:]
    data[acc] = {}
    data[acc]['balance'] = "0x200000000000000000000000000000000000000000000000000000000000000"
genesis["alloc"] = data

with open("20acc_genesis.json", "w") as outfile:
    json.dump(genesis, outfile)