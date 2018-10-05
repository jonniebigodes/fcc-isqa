# FCC-ISQA

This repository contains the implementation of the Information Security and Quality Assurance Projects for [Freecodecamp].


The challenges are the following
  - [Metric-Imperial Converter](https://fcc-isqa.herokuapp.com/metrics)
  - [Issue Tracker](https://fcc-isqa.herokuapp.com/issuetracker)
  - [Personal Library](https://fcc-isqa.herokuapp.com/books)
  - [Stock Price Checker](https://fcc-isqa.herokuapp.com/stockdata)
  - [Anonymous Message Board](https://fcc-isqa.herokuapp.com/messageboards)

# Methodology used

Instead of creating a single repo for each challenge and as i'm familiar with github i condensed the api challenges in one package/repo.
As it's not in direct contradiction of the rules and/or objective.
In terms of development methodology i used the following:
  
  - /src/
    - this folder contains the implementation of the projects. 
  - /src/client
    - Inside this folder are the components i.e views used for the challenges
  - /src/server
    - Inside is the server implementation of the project
  - /dist/
    - This folder contains the release(aka build files) for the client.
  - /lib/
    - This folder will contain the server and it's dependencies minified.


### Tech

This set of challenges uses a number of open source projects to work properly:
* [React] - Great Javascript library for Building user interfaces
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework 
* [Parcel] - fast packaging framework for deployment
* [Mongodb] - Best of relational with the innovations of NOSQL
* [Axios]   - Simple Promise based http request package
* [Helmet] - Express.js security with HTTP headers.


And of course the implementation of the projects themselves are open source with a [git-repo-url]
 on GitHub.

### Installation from source

fcc-isqa  requires [Node.js](https://nodejs.org/) v6+ to run.

Clone the repo from [here](https://github.com/jonniebigodes/fcc-isqa.git).

Install the dependencies and devDependencies and start the server.

```sh
$ cd folder to contain the app
$ npm install 
$ npm run devserver

Open url http://localhost:5000
```


License
----

MIT


**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   
   [git-repo-url]: <https://github.com/jonniebigodes/fcc-isqa.git>
   [node.js]: <http://nodejs.org>
   [express]: <http://expressjs.com>
   [React]: <https://facebook.github.io/react/>
   [Parcel]: <https://parceljs.org/>
   [Mongodb]: <https://www.mongodb.com/>
   [PlGh]:  <https://github.com/jonniebigodes/fcc-isqa/tree/master/plugins/github/readme.md>
   [Axios]: <https://github.com/axios/axios>
   [Helmet]: <https://helmetjs.github.io/>
   [Freecodecamp]:<https://www.freecodecamp.org/>
  