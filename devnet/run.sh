# Init with genesis file
# geth --datadir node1/ init 20acc_genesis.json
# geth --datadir node2/ init 20acc_genesis.json

# Unlock a list of account
# geth --unlock "0x407d73d8a49eeb85d32cf465507dd71d507100c1,0,5,e470b1a7d2c9c5c6f03bbaa8fa20db6d404a0c32"

# List account in node
# geth account list --datadir node1
# geth account list --datadir node2

# Create preset password for all acc from all node
# for j in {1..2}; do
#     if [ ! -d "node$j" ]; then
#         mkdir "node$j"
#     fi
#     if [ ! -d "node$j/pwd" ]; then
#         mkdir "node$j/pwd"
#     fi
#     for i in {0..9}; do
#         printf "acc_pass_$i\n" > "./node$j/pwd/$i.txt"; 
#         printf "acc_pass_$i\n" >> "./node$j/all_pass.txt"
#     done
# done

#Create account from preset passwords
# for j in {1..2}; do
#     for pwd in `ls -1v ./node$j/pwd/`; do
#         geth account new --datadir "node$j/" --password "./node$j/pwd/$pwd"
#     done
# done

# Genesis file
# puppeth
