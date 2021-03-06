const logger = require('../../logger');
const { Kommission } = require('../models/kommission');
const { Barman } = require('../models/barman');
const {
  createUserError, createServerError, cleanObject, setAssociations,
} = require('../../utils');
const { sequelize } = require('../../bootstrap/sequelize');

/**
 * Return all kommissions of the app.
 *
 * @returns {Promise<Array>} Kommissions
 */
async function getAllKommissions() {
  logger.verbose('Kommission service: get all kommissions');
  return Kommission.findAll({
    order: [
      ['name', 'ASC'],
    ],
  });
}


/**
 * Create a kommission.
 *
 * @param newKommission {Kommission} partial kommission
 * @param _embedded {Object} Object containing associations to update, see swagger for more information.
 * @return {Promise<Kommission|Errors.ValidationError>} The created kommission with its id
 */
async function createKommission(newKommission, _embedded) {
  logger.verbose('Kommission service: creating a new kommission named %s', newKommission.name);

  const transaction = await sequelize().transaction();
  try {
    await newKommission.save({ transaction });
  } catch (err) {
    logger.warn('Kommission service: Error while creating kommission', err);
    await transaction.rollback();
    throw createServerError('ServerError', 'Error while creating kommission');
  }

  // Associations
  await setAssociations(_embedded, newKommission, null, transaction, true);

  await transaction.commit();
  return newKommission;
}


/**
 * Get a kommission by its id.
 *
 * @param kommissionId {number} Kommission id
 * @return {Promise<Kommission>} The wanted kommission.
 */
async function getKommissionById(kommissionId) {
  logger.verbose('Kommission service: get kommission by id %d', kommissionId);

  const kommission = await Kommission.findByPk(kommissionId, {
    include: [
      {
        model: Barman,
        as: 'barmen',
      },
    ],
  });


  if (!kommission) throw createUserError('UnknownKommission', 'This kommission does not exist');

  return kommission;
}


/**
 * Update an kommission.
 * This will copy only the allowed changes from the `updatedKommission`
 * into the current kommission.
 * This means, with this function, you can not change everything like
 * the `createdAt` field or others.
 *
 * @param kommissionId {number} kommission id
 * @param updatedKommission {Kommission} Updated kommission, constructed from the request.
 * @param _embedded {Object} Object containing associations to update, see swagger for more information.
 * @return {Promise<Kommission>} The updated kommission
 */
async function updateKommission(kommissionId, updatedKommission, _embedded) {
  const currentKommission = await Kommission.findByPk(kommissionId, {
    include: [
      {
        model: Barman,
        as: 'barmen',
      },
    ],
  });

  if (!currentKommission) throw createUserError('UnknownKommission', 'This kommission does not exist');

  logger.verbose('Kommission service: updating kommission named %s %s', currentKommission.id, currentKommission.name);

  const transaction = await sequelize().transaction();

  try {
    await currentKommission.update(cleanObject({
      name: updatedKommission.name,
      description: updatedKommission.description,
    }), { transaction });
  } catch (err) {
    logger.warn('Kommission Service : error while updating a kommission', err);
    await transaction.rollback();
    throw createServerError('Server Error', 'Error while updating a kommission');
  }

  // Associations
  await setAssociations(_embedded, currentKommission, null, transaction);

  await transaction.commit();
  return currentKommission.reload();
}

/**
 * Delete an kommission.
 *
 * @param kommissionId {number} kommission id.
 * @return {Promise<Kommission>} The deleted kommission
 */
async function deleteKommission(kommissionId) {
  logger.verbose('Kommission service: deleting kommission with id %d', kommissionId);

  const kommission = await Kommission.findByPk(kommissionId);

  if (!kommission) throw createUserError('UnknownKommission', 'This kommission does not exist');

  await kommission.destroy();

  return kommission;
}


module.exports = {
  getAllKommissions,
  createKommission,
  updateKommission,
  getKommissionById,
  deleteKommission,
};
