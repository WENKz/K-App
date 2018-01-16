const authService = require('../services/auth-service');
const { createUserError } = require('../../utils');


/**
 * Login a user by responding with a JWT.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function login(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (!username
        || typeof username !== 'string'
        || !password
        || typeof password !== 'string'
    ) {
        throw createUserError(
            'BadRequest',
            'The body has not the good structure {username: string, password: string).'
        );
    }

    const jwt = await authService.login(username, password);

    res.json({
        jwt
    });
}

/**
 * Refresh a token while revoking the current one.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function refresh(req, res) {
    const jwt = await authService.refresh(req.user.jit);

    res.json({
        jwt
    });
}


/**
 * Logout a user.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function logout(req, res) {
    await authService.logout(req.user.jit);

    res.send({});
}

module.exports = {
    login,
    logout,
    refresh
};