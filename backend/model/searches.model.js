const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Searches = sequelize.define('Search', {
    // Model attributes are defined here
    search_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    search_keyword: {
        type: DataTypes.STRING,
        allowNull: false
    },
    attributes: {
        type: DataTypes.STRING,
        allowNull: false
    },
    min_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    max_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    max_rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_results: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    search_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
}, {
    tableName: 'role',
    createdAt: false,
    updatedAt: false
    // Other model options go here
});


module.exports = Searches;