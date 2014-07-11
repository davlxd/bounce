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
* Install Node and NPM on every host
* Configure iptables on every host to allow this happen (refers to `helper/add-iptables-exception.sh`)
* Figure out a way to start this process on every client host (refers to `helper/start-bounce-on-client.sh`)



Usage
-----
* Start client:
  * `$ node ./index.js <directory to store to file>`
* Start server:
  * `$ node ./index.js <file to distribute>`

Quick Start
-----------
* Start `bounce` on every client hosts
  * You can use `helper/start-bounce-on-client.sh`
* Run server
  * `$ node ./index.js <file to distribute>`
