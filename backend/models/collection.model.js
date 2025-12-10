const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize.config");

const Collection = sequelize.define(
  "Collection",
  {
    collection_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    collection_name: { type: DataTypes.TEXT, unique: true },
  },
  {
    tableName: "collections",
    timestamps: false,
  }
);

// Define associations
Collection.associate = (models) => {
  Collection.belongsToMany(models.Search, {
    through: models.SearchCollection,
    foreignKey: "collection_id",
    as: "searches"
  });
};

module.exports = Collection;
