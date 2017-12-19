#!/usr/bin/env node
const inquirer = require('inquirer');
const path = require('path');
const { overwriteOrNot } = require('./util');


/**
 *
 * @param configObj Cannot be null
 * @return {Promise<void>}
 */
async function askQuestions(configObj) {

    const questions = [
        {
            type: 'confirm',
            name: 'useBackup',
            message: 'Do you want to setup a automatic backup?',
            default: true
        },
        {
            type: 'input',
            name: 'backupDir',
            message: 'Where do you want your backups?',
            default: path.resolve(__dirname, '..', '..', 'backups'),
            when: answers => answers.useBackup
        },
        {
            type: 'list',
            name: 'frequency',
            choices: ['daily', 'hourly', 'weekly', 'monthly'],
            message: 'How often would you want to make a backup?',
            default: 'daily',
            when: answers => answers.useBackup
        },
        {
            type: 'input',
            name: 'deleteAfter',
            choices: ['daily', 'hourly', 'weekly', 'monthly'],
            message: 'Delete backup after how many days (0 for never)?',
            default: 30,
            when: answers => answers.useBackup,
            valid: input => {
                if (input >>> 0 === parseFloat(input)) return true;
                return 'You must enter a positive integer';
            }
        },
        {
            type: 'input',
            name: 'dbUser',
            message: 'Username?',
            default: () => {
                if (configObj.mysql && configObj.mysql.username) {
                    return configObj.mysql.username;
                }
                return 'kapp';
            },
            when: answers => answers.useBackup
        },
        {
            type: 'password',
            name: 'dbPassword',
            message: 'Password?',
            default: () => {
                if (configObj && configObj.mysql && configObj.mysql.password) {
                    return configObj.mysql.password;
                }
                return 'kapp';
            },
            when: answers => answers.useBackup
        },
    ];

    const answers = await inquirer.prompt(questions);

    if (!answers.useBackup) return;

    configObj.backup = {
        dir: answers.backupDir,
        username: answers.dbUser,
        password: answers.dbPassword,
        frequency: answers.frequency,
        deleteAfter: answers.deleteAfter

    };
}

/**
 * Install component.
 *
 * @param config
 * @return {Promise<void>}
 */
async function configure(config) {
    if (!config.backup) return;

    const timerFile = `
[Unit]
Description=Timer for daily backup of %i

[Timer]
OnCalendar=${config.backup.frequency}
Persistent=true

[Install]
WantedBy=timers.target
`;

    const backupFile = `
[Unit]
Description=Schedule of a backup of the k-app database

[Service]
Type=oneshot
ExecStart=${path.resolve(__dirname, '..', 'save-all.sh')}

Environment=BACKUP_DIR=${config.backup.dir}
Environment=MYSQL_UNAME=${config.backup.username}
Environment=MYSQL_PWORD=${config.backup.password}
Environment=MYSQL_DATABASE_NAME=${config.mysql.database}
Environment=KEEP_BACKUPS_FOR=${config.backup.deleteAfter}
`;

    await overwriteOrNot('/etc/systemd/system/kapp-save.timer', timerFile);
    await overwriteOrNot('/etc/systemd/system/kapp-save.service', backupFile);
}

module.exports = {
    askQuestions,
    configure
};
