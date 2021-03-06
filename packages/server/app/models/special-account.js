const { DataTypes, Model } = require('sequelize');
const Joi = require('joi');
const { ConnectionInformationSchema } = require('./connection-information');
const { AssociationChangesSchema } = require('./association-changes');

/**
 * This class represents a special account (e.g.: admin).
 */
class SpecialAccount extends Model {
  /**
   * Initialization function.
   *
   * @param sequelize
   * @returns {Model}
   */
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
      },
    }, {
      sequelize,
    });
  }


  /**
   * Set associations for the model.
   *
   * @param models
   */
  static associate({ ConnectionInformation, Permission }) {
    this.belongsTo(ConnectionInformation, { as: 'connection' });

    this.belongsToMany(Permission, { through: 'SpecialAccountPermissions', as: 'permissions' });
  }
}

const SpecialAccountSchema = Joi.object({
  id: Joi.number().integer(),
  code: Joi.string().regex(/^[0-9]{4,}$/),
  description: Joi.string(),
  connection: ConnectionInformationSchema,

  _embedded: Joi.object({
    permissions: AssociationChangesSchema,
  }),
});

module.exports = {
  SpecialAccount,
  SpecialAccountSchema,
};
