#! /usr/bin/env sh

# Distribute public key

function do_dist() {
    #ssh-copy-id twer@$1
    ssh -n $1 "ps aux | grep 'node' | grep 'index.js' | grep -v 'bash'"
}


while read line; do
    do_dist "$line"
done < ../peers-list.txt

