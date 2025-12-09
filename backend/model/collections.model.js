const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Collections = sequelize.define('Collection', {
    // Model attributes are defined here
    collection_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    collection_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'collections',
    createdAt: false,
    updatedAt: false
    // Other model options go here
});


module.exports = Collections;