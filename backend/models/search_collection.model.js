const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize.config");

const SearchCollection = sequelize.define(
  "SearchCollection",
  {
    search_id: { type: DataTypes.TEXT, primaryKey: true },
    collection_id: { type: DataTypes.BIGINT, primaryKey: true },
  },
  {
    tableName: "search_collections",
    timestamps: false,
  }
);

module.exports = SearchCollection;
