const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize.config");

const IpAddress = sequelize.define(
  "IpAddress",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    search_id: DataTypes.TEXT,
    ip_address: DataTypes.TEXT,
  },
  {
    tableName: "ip_addresses",
    timestamps: false,
  }
);

// Define associations
IpAddress.associate = (models) => {
  // IpAddress belongs to Search
  IpAddress.belongsTo(models.Search, {
    foreignKey: 'search_id',
    as: 'search'
  });
};

module.exports = IpAddress;
