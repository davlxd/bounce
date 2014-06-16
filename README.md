Bounce
======

Distribute a file from one host to many host exponentially

means:

* distribute the file from provider to just one host,
* then using that host as a provider too, distribute the file to two hosts,
* four hosts
* ...

Prerequisite
------------
* Install Node and npm
* Underlying file transfer implementation is node exec call `rsync`, so you must have rsync installed on every host
* File transfer could happen between any two hosts, so a collection of all hosts' pubkey must be stored in every host's .ssh/authorized_keys
* Configure iptables on every host to allow this happen
* After all, you can tweak my code