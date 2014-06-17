#! /usr/bin/env sh

# Distribute public key

function do_dist() {
    #ssh-copy-id twer@$1
    ssh -n $1 "cd bounce; node ./index.js ~/images >> client.log &"
}


while read line; do
    do_dist "$line"
done < ../peers-list.txt

