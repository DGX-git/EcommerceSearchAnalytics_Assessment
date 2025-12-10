const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize.config");

const SearchMetric = sequelize.define(
  "SearchMetric",
  {
    search_id: { type: DataTypes.TEXT, primaryKey: true },
    min_price: DataTypes.DECIMAL,
    max_price: DataTypes.DECIMAL,
    min_rating: DataTypes.DECIMAL,
    total_results: DataTypes.INTEGER,
  },
  {
    tableName: "search_metrics",
    timestamps: false,
  }
);

// Define associations
SearchMetric.associate = (models) => {
  // SearchMetric belongs to Search
  SearchMetric.belongsTo(models.Search, {
    foreignKey: 'search_id',
    as: 'search'
  });
};

module.exports = SearchMetric;
