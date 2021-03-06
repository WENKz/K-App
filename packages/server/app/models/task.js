const { Model, DataTypes } = require('sequelize');
const Joi = require('joi');
const { AssociationChangesSchema } = require('./association-changes');

/**
 * This class represent a Task.
 */
class Task extends Model {
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

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      deadline: DataTypes.DATE,

      state: DataTypes.ENUM('Not started', 'In progress', 'Done', 'Abandoned'),

      description: DataTypes.STRING,
    }, {
      sequelize,
      updatedAt: false,
    });
  }


  /**
   * Set associations for the model
   */
  static associate({ Barman, TaskBarmanWrapper, Kommission }) {
    this.belongsToMany(Barman, { through: TaskBarmanWrapper, as: 'barmen' });
    this.belongsTo(Kommission, {
      as: 'kommission',
      foreignKey: {
        allowNull: false,
      },
    });
  }

  /**
   * Convert task model into JSON document in order to send it to the client
   * @returns {String}
   */
  toJSON() {
    const values = { ...this.get() };
    delete values.kommissionId;
    return values;
  }
}

const TaskSchema = Joi.object({
  id: Joi.number().integer(),
  name: Joi.string(),
  description: Joi.string(),
  deadline: Joi.date().iso(),
  state: Joi.string().valid('Not started', 'In progress', 'Done', 'Abandoned'),
  _embedded: Joi.object({
    barmen: AssociationChangesSchema,
    kommissionId: Joi.number().integer(),
  }),
});

module.exports = {
  Task,
  TaskSchema,
};
