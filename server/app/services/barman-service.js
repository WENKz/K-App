const logger = require('../../logger');
const sequelize = require('../../db');
const { Barman, Kommission, Role } = require('../models');
const { createUserError, createServerError, cleanObject, hash } = require('../../utils');

/**
 * Return all barmen of the app.
 *
 * @returns {Promise<Array>} Barmen
 */
async function getAllBarmen() {

    logger.verbose('Barman service: get all barmen');
    return await Barman.findAll();
}

/**
 * Create a Barman.
 *
 * @param newBarman {Barman} partial member
 * @return {Promise<Barman|Errors.ValidationError>} The created barman with its id
 */
async function createBarman(newBarman) {

    logger.verbose('Barman service: creating a new barman named %s %s', newBarman.firstName, newBarman.lastName);
    return await newBarman.save();
}

/**
 * Get a Barman by his id.
 * @param barmanId {number} Barman Id
 * @returns {Promise<Barman>} Barmen
 */
async function getBarmanById(barmanId) {

    logger.verbose('Barman service: get a barman by his id %d', barmanId);

    const barman = await Barman.findById(barmanId);

    if (!barman) throw createUserError('UnknownBarman', 'This Barman does not exist');

    return await barman;
}

/**
 * Update a barman
 * This will copy only the allowed changes from the `updatedBarman`
 * into the current barman.
 * This means, with this function, you can not change everything like
 * the `createdAt` field or others.
 *
 * @param barmanId {number} barman id
 * @param updatedBarman {Barman} Updated barman, constructed from the request.
 * @param _embedded {Object} Object containing associations to update, see swagger for more information.
 * @return {Promise<Barman>} The updated barman
 */
async function updateBarmanById(barmanId, updatedBarman, _embedded) {
    const currentBarman = await Barman.findById(barmanId, {
        include: [
            {
                model: Kommission,
                as: 'kommissions'
            },
            {
                model: Role,
                as: 'roles'
            }
        ]
    });

    if (!currentBarman) throw createUserError('UnknownBarman', 'This Barman does not exist');

    logger.verbose('Barman service: updating barman named %s %s', currentBarman.firstName, currentBarman.lastName);

    const transaction = await sequelize.transaction();

    try {
        await currentBarman.update(cleanObject({
            firstName: updatedBarman.firstName,
            lastName: updatedBarman.lastName,
            nickname: updatedBarman.nickname,
            facebook: updatedBarman.facebook,
            dateOfBirth: updatedBarman.dateOfBirth,
            flow: updatedBarman.flow,
            active: updatedBarman.active
        }), { transaction });


        // If connection information is changed
        if (updatedBarman.connection) {
            const co = await currentBarman.getConnection();

            const coData = {
                username: updatedBarman.connection.username,
                password: hash(updatedBarman.connection.password)
            };

            // If there is no connection yet, create one
            if (!co) {
                await currentBarman.createConnection(cleanObject(coData), { transaction });
            } else {
                await co.update(cleanObject(coData), { transaction });
            }
        }
    } catch (err) {
        logger.warn('Barman service: Error while updating barman', err);
        await transaction.rollback();
        throw createServerError('ServerError', 'Error while updating barman');
    }

    // Associations
    if (_embedded) {
        for (const associationKey of Object.keys(_embedded)) {
            const value = _embedded[associationKey];

            if (associationKey === 'godFather') {
                const wantedGodFather = await Barman.findById(value);

                if (!wantedGodFather) {
                    await transaction.rollback();
                    throw createUserError('UnknownBarman', `Unable to find god father with id ${wantedGodFather}`);
                }

                await currentBarman.setGodFather(wantedGodFather, { transaction });

            } else if (associationKey === 'kommissions') {
                try {
                    if (value.add && value.add.length > 0) {
                        await currentBarman.addKommissions(value.add, { transaction });
                    }
                    if (value.remove && value.remove.length > 0) {
                        await currentBarman.removeKommissions(value.remove, { transaction });
                    }
                } catch (err) {
                    await transaction.rollback();
                    throw createUserError('UnknownKommission', 'Unable to associate barman with provided kommissions');
                }
            } else if (associationKey === 'roles') {
                try {
                    if (value.add && value.add.length > 0) {
                        await currentBarman.addRoles(value.add, { transaction });
                    }
                    if (value.remove && value.remove.length > 0) {
                        await currentBarman.removeRoles(value.remove, { transaction });
                    }
                } catch (err) {
                    await transaction.rollback();
                    throw createUserError('UnknownRole', 'Unable to associate barman with provided roles');
                }
            } else {
                await transaction.rollback();
                throw createUserError('BadRequest', `Unknown association '${associationKey}', aborting!`);
            }
        }
    }

    await transaction.commit();
    return currentBarman;
}

/**
 * Delete a Barman.
 *
 * @param barmanId {number} barman id
 * @returns {Promise<Barman>} The deleted barman
 */
async function deleteBarmanById(barmanId) {

    logger.verbose('Barman service: deleting member with id %d', barmanId);

    const barman = await Barman.findById(barmanId);

    if (!barman) throw createUserError('UnknownBarman', 'This Barman does not exist');

    await barman.destroy();

    return barman;
}

module.exports = {
    getAllBarmen,
    createBarman,
    getBarmanById,
    deleteBarmanById,
    updateBarmanById,
};
