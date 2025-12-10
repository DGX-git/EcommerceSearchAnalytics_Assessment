const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize.config");

const Customer = sequelize.define(
  "Customer",
  {
    customer_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_email: { type: DataTypes.TEXT, unique: true },
  },
  {
    tableName: "customers",
    timestamps: false,
  }
);

// Define associations
Customer.associate = (models) => {
  Customer.hasMany(models.Search, {
    foreignKey: "customer_id",
    as: "searches"
  });
};

module.exports = Customer;
