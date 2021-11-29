---
layout: post
title: "使用Nodejs-Express-MongoDB搭建服务器"
date: 2021-10-27 15:47:25 +0800
comments: true
categories: [web, nodejs, mongodb]
---

<!-- more -->

Demo source code on the github: [Github demo source code](https://github.com/hongchaozhang/nodejs-express-mongodb).

## Steps to start the server:

1. Clone the [Github demo source code](https://github.com/hongchaozhang/nodejs-express-mongodb).
2. install MongoDB with the steps from [Mac OSX 平台 MongoDB 的安装及管理](https://cloud.tencent.com/developer/article/1770288).
3. Config MongoDB and start it with `mongod --dbpath /usr/local/var/mongodb --logpath /usr/local/var/log/mongodb/mongo.log --fork`.
4. Start the server by running `node server.js`.
5. Test the APIs by curl or Postman (recommended).

### Note

#### nodejs version
If you meet the following error while running `node server.js`, check your nodejs version to make sure you are using 12 and above. `14.17.6` is tested. The error is:
```
/Users/hozhang/Develop/PracticeProjects/nodejs-express-mongodb/node_modules/whatwg-url/lib/encoding.js:2
const utf8Encoder = new TextEncoder();
ReferenceError: TextEncoder is not defined
```

#### How to start/shutdown MongoDB
1. After correctly configuring your MongoDB, use the following command to start it:
    `mongod --dbpath /usr/local/var/mongodb --logpath /usr/local/var/log/mongodb/mongo.log --fork`
2. After enter the mongo environment by running `mongo`, use the following command to shutdown the MongoDB:
    ```
    > use admin;
    > db.shutdownServer();
    ```

#### MongoDB Compass
Use the official UI tool to manage your MongoDB data: MongoDB Compass.

#### Postman
Use the Postman to act as a client. It is convenient to config/manage the request.

## code explanation
Refer to [Node.js, Express & MongoDb: Build a CRUD Rest Api example](https://www.bezkoder.com/node-express-mongodb-crud-rest-api/) for detailed code explanation.

## References

* [Mac OSX 平台 MongoDB 的安装及管理](https://cloud.tencent.com/developer/article/1770288)
* [Node.js, Express & MongoDb: Build a CRUD Rest Api example](https://www.bezkoder.com/node-express-mongodb-crud-rest-api/)