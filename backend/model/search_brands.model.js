const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Search_Brands = sequelize.define('Search_Brand', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    search_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    brand_id: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'search_brands',
    createdAt: false,
    updatedAt: false
    // Other model options go here
});


module.exports = Search_Brands;