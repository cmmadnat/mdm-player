# mdm-player
player for any bittorrent website
Based on the popular bittorrent player. I decided to write a simple project to demonstate how easy you could turn any bittorrent website into your personal video portal, just like a youtube for any torrent website :D

** for educational use only, use as your own risk, no warrantee

## requirement
1. node.js (npm) you can install it buy download it from http://nodejs.org
2. install node-webkit as an application
```
sudo npm install -g node-webkit
```

## how to build and run?

1. install npm dependencies
  ```
  cd app
  npm install
  ```
2. go to index.html, edit baseurl (to the bittorrent website you are subscribed to), enter your username and password to that website as well.
  ```html
  var username = <username>
  var password = <password>
  var baseURL = <baseurl>
  <iframe href="<baseurl>/browse.php">
  ```
3. run from buildrun
  ```
  ./buildrun
  ```
## known issue
1. sometime the torrent doesn't work, i guess the problem comes with the fact that i don't have time to implement the file selector
2. after the torrent video is streamed to the vlc, i couldn't find the way to inform tracker of the application upload/download statistic. I hope there could be any workaround soon. maybe i could negotiate with the bittorrent website owner to overrule something to make this application works.
