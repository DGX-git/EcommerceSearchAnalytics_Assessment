const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Search_Metrics = sequelize.define('Search_Metrics', {
    // Model attributes are defined here
    metrics_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    search_id: {
        type: DataTypes.INTEGER,
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
    min_rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_results: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    tableName: 'search_metrics',
    createdAt: false,
    updatedAt: false
    // Other model options go here
});


module.exports = Search_Metrics;