const { Model, DataTypes } = require('sequelize');

/**
 * This class represents a member.
 */
class Member extends Model {

    /**
     * Initialization function.
     *
     * @param sequelize Sequelize instance
     * @returns {Model}
     */
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            },

            lastName: {
                type: DataTypes.STRING,
                allowNull: false
            },

            school: DataTypes.STRING,

            active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        }, {
            sequelize,

            // Do not delete row, even when the user delete is account
            paranoid: true
        });
    }


    /**
     * Set associations for the model.
     *
     * @param models
     */
    static associate(models) { // eslint-disable-line no-unused-vars
    }
}

module.exports = {
    Member
};