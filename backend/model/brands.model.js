const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Brands = sequelize.define('Brand', {
    // Model attributes are defined here
    brand_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    brand_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'brand',
    createdAt: false,
    updatedAt: false
    // Other model options go here
});


module.exports = Brands;