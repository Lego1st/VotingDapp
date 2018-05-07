import requests
import json
session = requests.Session()
method = 'eth_getBalance'
params = ["0xA4E7adb0CAe9b692C07649f2F6b49537a3de9885", "latest"]
# params = ["0x627bd61ce90284a741a654a75d03a1b8319a75d7", "latest"]
# params = []
PAYLOAD = {"jsonrpc":"2.0",
            "method":method,
            "params":params,
            "id":1}
PAYLOAD = json.dumps(PAYLOAD)
headers = {'Content-type': 'application/json'}

node_addresses = ['', 'http://127.0.0.1:8501', 'http://127.0.0.1:8502']
node_files = ['', 'node1/accounts.txt', 'node2/accounts.txt']
current_node = 1


response = session.post(node_addresses[current_node], data=PAYLOAD, headers=headers)

# List all account in a node
# f = open(node_files[current_node], "w")
# accounts = json.loads(response.content)['result']
# for account in accounts:
#     f.write(account+'\n')

print(response.content)