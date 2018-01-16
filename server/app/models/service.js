const { Model, DataTypes } = require('sequelize');

/**
 * This class represent a Service.
 */
class Service extends Model {

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
                autoIncrement: true
            },

            name: {
                type: DataTypes.STRING
            },

            startAt: {
                type: DataTypes.DATE,
                allowNull: false
            },

            endAt: {
                type: DataTypes.DATE,
                allowNull: false
            },

            nbMax: {
                type: DataTypes.INTEGER,
                validate: { min: 1 }
            }
        }, {
            sequelize,
            updatedAt: false,
            createdAt: false,

            // Do not really delete row
            paranoid: true
        });
    }


    /**
     * Set associations for the model
     * @param models
     */
    static associate(models) {
        this.belongsToMany(models.Barman, { through: models.ServiceWrapper });
        this.belongsTo(models.Category);
    }
}

module.exports = {
    Service
};