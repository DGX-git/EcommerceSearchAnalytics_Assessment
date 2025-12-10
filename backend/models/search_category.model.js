const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize.config");

const SearchCategory = sequelize.define(
  "SearchCategory",
  {
    search_id: { type: DataTypes.TEXT, primaryKey: true },
    category_id: { type: DataTypes.BIGINT, primaryKey: true },
  },
  {
    tableName: "search_categories",
    timestamps: false,
  }
);

module.exports = SearchCategory;
