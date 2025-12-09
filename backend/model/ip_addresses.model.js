const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const IP_Addresses = sequelize.define('IP_Addresse', {
    // Model attributes are defined here
    ip_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    search_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    search_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'ip_addresses',
    createdAt: false,
    updatedAt: false
    // Other model options go here
});


module.exports = IP_Addresses;