# K-App
K-App application repository

## Usage

### Pre-Requisites

To launch the project you will need:
- [NodeJS](https://nodejs.org/en/) version 8.7.x or higher.
- [MySQL](https://dev.mysql.com/downloads/mysql) version 5.7 or higher.


### Getting the sources

You can download the latest release from [here](https://github.com/K-fet/K-App/releases).

### Configuring

All the configuration is in [here](/server/config) :
- _logger.js_: Configuration of the logger [winston](https://github.com/winstonjs/winston).
- _web.js_: Configuration of the web server, like ssl, port of the application, etc.


### Compiling assets and starting the server

1. Run `npm install`.
2. Run `npm build`.
3. Run `npm run prod`.


### Updating

TODO.


## Development

In addition to the default pre-requisites, you will need:

- Git. For [windows](https://git-scm.com/downloads), for linux : `sudo apt-get install git`

Optional:
- Text editor: Visual code https://code.visualstudio.com/
- Or a full IDE: [Webstorm](https://www.jetbrains.com/webstorm/)
    (student licence available) 

### Environment

Clone the repo: `git clone https://github.com/K-fet/K-App.git`.

Install dependencies: `npm install`.

### Launching server and client

#### Back

The back use [expressjs](https://expressjs.com). 
It can be launch with `npm run dev:back`.

It will be available at http://localhost:3000.
For now you have to restart it manually when you make modifications.


#### Front

The front is an angular 2 application. It uses _angular-cli_.
You can start developing front with `npm run dev:front`.

The app will be launch at http://localhost:4200. 
It will automatically be reloaded when you edit angular files. 

It will only launch the front so all API calls will not work.
(You can use `npm run dev` to start the back and the front).

All API requests made at the angular app will be transferred to the server.
