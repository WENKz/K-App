const logger = require('../../logger');
const { ConnectionInformation } = require('../models/');
const { createUserError, verify } = require('../../utils');

/**
 * This function check the code of a user (ConnectionInformation).
 *
 * @param userId {number} ConnectionInformation id
 * @param code Code to check
 * @returns {Promise<boolean>} Return true if the code is correct
 */
async function checkCode(userId, code) {

    const user = await ConnectionInformation.findById(userId);

    const account = await user.getSpecialAccount();

    if (!account) {
        throw createUserError('NotSpecialAccount', 'Only special accounts with permissions can do this action');
    }

    return await verify(account.code, code);
}

module.exports = {
    checkCode
};
