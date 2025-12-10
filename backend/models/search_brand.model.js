const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize.config");

const SearchBrand = sequelize.define(
  "SearchBrand",
  {
    search_id: { type: DataTypes.TEXT, primaryKey: true },
    brand_id: { type: DataTypes.BIGINT, primaryKey: true },
  },
  {
    tableName: "search_brands",
    timestamps: false,
  }
);

module.exports = SearchBrand;
