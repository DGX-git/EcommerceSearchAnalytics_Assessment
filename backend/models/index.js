const sequelize = require('../config/sequelize.config');

// Import all models
const Search = require('./search.model');
const Customer = require('./customer.model');
const Brand = require('./brand.model');
const Category = require('./category.model');
const Collection = require('./collection.model');
const SearchMetric = require('./search_metric.model');
const IpAddress = require('./ip_address.model');
const SearchBrand = require('./search_brand.model');
const SearchCategory = require('./search_category.model');
const SearchCollection = require('./search_collection.model');

// Create models object
const models = {
  Search,
  Customer,
  Brand,
  Category,
  Collection,
  SearchMetric,
  IpAddress,
  SearchBrand,
  SearchCategory,
  SearchCollection,
  sequelize
};

// Initialize all associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
