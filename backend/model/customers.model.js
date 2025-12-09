const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Customers = sequelize.define('Customer', {
    // Model attributes are defined here
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    customer_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    customer_email: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'customers',
    createdAt: false,
    updatedAt: false
    // Other model options go here
});


module.exports = Customers;