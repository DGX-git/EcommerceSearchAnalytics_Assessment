const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize.config");

const Search = sequelize.define(
  "Search",
  {
    search_id: { type: DataTypes.TEXT, primaryKey: true },
    customer_id: { type: DataTypes.BIGINT },
    search_keyword: DataTypes.TEXT,
    attributes: DataTypes.JSONB,
    min_price: DataTypes.DECIMAL,
    max_price: DataTypes.DECIMAL,
    min_rating: DataTypes.DECIMAL,
    total_results: DataTypes.INTEGER,
    search_date: DataTypes.DATE,
  },
  {
    tableName: "searches",
    timestamps: false,
  }
);

// Define associations
Search.associate = (models) => {
  Search.belongsTo(models.Customer, {
    foreignKey: "customer_id",
    as: "customer"
  });

  Search.hasOne(models.SearchMetric, {
    foreignKey: "search_id",
    as: "metrics"
  });

  Search.belongsToMany(models.Brand, {
    through: models.SearchBrand,
    foreignKey: "search_id",
    as: "brands"
  });

  Search.belongsToMany(models.Category, {
    through: models.SearchCategory,
    foreignKey: "search_id",
    as: "categories"
  });

  Search.belongsToMany(models.Collection, {
    through: models.SearchCollection,
    foreignKey: "search_id",
    as: "collections"
  });

  Search.hasMany(models.IpAddress, {
    foreignKey: "search_id",
    as: "ip_addresses"
  });
};

module.exports = Search;
