const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize.config");

const Category = sequelize.define(
  "Category",
  {
    category_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: { type: DataTypes.TEXT, unique: true },
  },
  {
    tableName: "categories",
    timestamps: false,
  }
);

// Define associations
Category.associate = (models) => {
  Category.belongsToMany(models.Search, {
    through: models.SearchCategory,
    foreignKey: "category_id",
    as: "searches"
  });
};

module.exports = Category;
