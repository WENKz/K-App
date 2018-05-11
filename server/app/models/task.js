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
        // eslint-disable-next-line
        this.prototype.toJSON = function () {
            const values = Object.assign({}, this.get());
            delete values.kommissionId;
            return values;
        };

        return super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false
            },

            deadline: DataTypes.DATE,

            state: DataTypes.ENUM('Not started', 'In progress', 'Done', 'Abandoned'),

            description: DataTypes.STRING,
        }, {
            sequelize,
            updatedAt: false
        });
    }


    /**
     * Set associations for the model
     * @param models
     */
    static associate(models) {
        this.belongsToMany(models.Barman, { through: models.TaskBarmanWrapper, as: 'barmen' });
        this.belongsTo(models.Kommission, {
            as: 'kommission',
            foreignKey: {
                allowNull: false
            }
        });
    }
}

const TaskSchema = Joi.object().keys({
    id: Joi.number().integer(),
    name: Joi.string(),
    description: Joi.string(),
    deadline: Joi.date().iso(),
    state: Joi.string().valid('Not started', 'In progress', 'Done', 'Abandoned'),
    _embedded: Joi.object().keys({
        barmen: AssociationChangesSchema,
        kommissionId: Joi.number().integer(),
    })
});

module.exports = {
    Task,
    TaskSchema
};