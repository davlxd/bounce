#! /usr/bin/env sh

# Distribute public key

function do_dist() {
    #ssh-copy-id twer@$1
    ssh -n $1 "sudo iptables -I INPUT 1 -p tcp --dport 7105 -j ACCEPT"
    ssh -n $1 "sudo iptables -I INPUT 1 -p tcp --dport 5017 -j ACCEPT"
}


while read line; do
    do_dist "$line"
done < ../peers-list.txt

