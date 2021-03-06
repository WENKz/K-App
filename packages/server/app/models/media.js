const { Model, DataTypes } = require('sequelize');
const Joi = require('joi');

/**
 * This class represent a Media.
 */
class Media extends Model {
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

      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      sequelize,
      updatedAt: false,
    });
  }


  /**
   * Set associations for the model
   */
  static associate() {}
}

const MediaSchema = Joi.object({
  id: Joi.number().integer(),
  url: Joi.string().uri({ scheme: ['https'] }),
  type: Joi.string(),
});

module.exports = {
  Media,
  MediaSchema,
};
