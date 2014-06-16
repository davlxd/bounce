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
* Underlying file transfer implementation is node exec call `rsync`
* File transfer could happen between any two hosts
* So a collection of all hosts' pubkey must be stored in every host's .ssh/authorized_keys