function mongo_packageJSONCreator() {
    const pack = `
    {
        "name": "tentaql",
        "version": "1.0.0",
        "description": "Automated GraphQL Schema Creator",
        "main": "server.js",
        "scripts": {
          "start": "node server/index.js",
          "dev": "nodemon server/index.js"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/TentaQL/tentaQL.git"
        },
        "babel": {
          "presets": [
            "@babel/env"
          ]
        },
        "keywords": [
          "GraphQL",
          "MongoDB",
          "Schema"
        ],
        "author": "Anna Brakowska, Jonathan Schwartz, Jonah Wilkoff, Alan Thompson",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/TentaQL/tentaQL/issues"
        },
        "dependencies": {
          "@babel/cli": "^7.1.5",
          "@babel/core": "^7.1.6",
          "@babel/node": "^7.0.0",
          "@babel/preset-env": "^7.1.6",
          "express": "^4.16.4",
          "express-graphql": "^0.7.1",
          "graphql": "^14.0.2",
          "mongoose": "^5.3.13",
          "open": "0.0.5"
        }
      }
  `;
  return pack;
  }
  
  module.exports = mongo_packageJSONCreator;