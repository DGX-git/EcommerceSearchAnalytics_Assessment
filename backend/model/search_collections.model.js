const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Search_Collections = sequelize.define('Search_Collection', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    search_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    collection_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'search_collections',
    createdAt: false,
    updatedAt: false
    // Other model options go here
});


module.exports = Search_Collections;