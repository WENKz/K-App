#!/usr/bin/env node

/* eslint-disable no-console,require-jsdoc */

if (process.getuid && process.getuid() !== 0) {
    console.error('You have to run this tool as root');
    process.exit(1);
}

if (process.platform === 'win32') {
    console.error('This tool does not work on Windows at this moment');
    process.exit(1);
}

const inquirer = require('inquirer');

const account = require('./init/account');
const backup = require('./init/backup');
const jwt = require('./init/jwt');
const mysql = require('./init/mysql');
const proxy = require('./init/proxy');
const systemd = require('./init/systemd');


const configuration = {};


//=======================
//     Ask Questions
//=======================

async function askAll() {
    await systemd.askQuestions(configuration);
    await mysql.askQuestions(configuration);
    await backup.askQuestions(configuration);
    await proxy.askQuestions(configuration);
    await jwt.askQuestions(configuration);
    await account.askQuestions(configuration);
}

async function confirmConfig() {

    console.log('==============================');
    console.log('Current configuration:');

    systemd.confirmConfig(configuration);
    mysql.confirmConfig(configuration);
    backup.confirmConfig(configuration);
    proxy.confirmConfig(configuration);
    jwt.confirmConfig(configuration);
    account.confirmConfig(configuration);


    const answers = await inquirer.prompt([{
        type: 'confirm',
        name: 'continue',
        message: 'Do you to proceed with the installation?',
        default: true
    }]);

    return answers.continue;
}

async function configAll() {
    await systemd.configure(configuration);
    await mysql.configure(configuration);
    await backup.configure(configuration);
    await proxy.configure(configuration);
    await account.configure(configuration);
}

async function main() {
    do await askAll(); while (!await confirmConfig());

    console.log('Starting installation...');
    await configAll();
    console.log('Installation done!');
}

main().catch(e => console.error('Error while configuring :', e));
