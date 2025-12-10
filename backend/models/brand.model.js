const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize.config");

const Brand = sequelize.define(
  "Brand",
  {
    brand_id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    brand_name: { type: DataTypes.TEXT, unique: true },
  },
  {
    tableName: "brands",
    timestamps: false,
  }
);

// Define associations
Brand.associate = (models) => {
  Brand.belongsToMany(models.Search, {
    through: models.SearchBrand,
    foreignKey: "brand_id",
    as: "searches"
  });
};

module.exports = Brand;
