
# Chatbox

A simple chatbox app adapted from Socket.io's chat example, it allows file transfer and image/video can be rendered directly. 


## How to use

```
$ cd chatbox
$ npm install
$ node index.js
```

And point your browser to `http://localhost:4321`.

To embed this chatbox into a web page, just copy paste the content in public/index.html to the page you want to have chatbox, then change all `http://localhost` to your domain name (don't forget the one in client.js). 

## Other features

* User can change nickname at any time.
* Show recent chat history.
* Sound notification when new user join or receive new message.
* Support unstable Internet connection.
* If you want to magnify images, just include fancybox library.
* Admin can run JavaScript on users' browser (use with cautious).

## Future plan

* Improve chat history feature, currently only storing latest 20 messages
* Improve file transfer support, currently file larger than 10MB may fail to transfer due to timeout, and client side may freeze once receive large file.
* Add admin authentication.

## Demo

You can see how it looks at my own blog here: [http://lifeislikeaboat.com](http://lifeislikeaboat.com). The chatbox is minimized at left bottom by default.

## Screenshot

![screenshot](/Screenshot.png?raw=true "Screenshot")



