var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var topSearchVolumeRouter = require('./routes/topSearchVolume');
var trendingKeywordsRouter = require('./routes/trendingKeywords');
var attributeTrendsRouter = require('./routes/attributeTrends');
var brandSearchVolumeRouter = require('./routes/brandSearchVolume');
var categoryDemandRouter = require('./routes/categoryDemand');
var categoryOrCollectionMappingAccuracyRouter = require('./routes/catergoryOrCollectionMappingAccuracy');
var conversionIntentFunnelRouter = require('./routes/conversionIntentFunnel');
var crossSearchPatternRouter = require('./routes/crossSearchPatterns');
var highExitSearchesRouter = require('./routes/highExitSearches');
var keywordClusteringRouter = require('./routes/keywordClustering');
var lowResultSearchesRouter = require('./routes/lowResultSearches');
var newVsReturningCustomerSearchesRouter = require('./routes/newVsReturningCustomerSearches');
var priceIntentSegmentRouter = require('./routes/priceIntentSegments');
var ratingSensitivityRouter = require('./routes/ratingSensitivity');
var searchByLocationOrRegionRouter = require('./routes/searchByLocationOrRegion');
var searchFailRateRouter = require('./routes/searchFailRate');
var seasonalityTrendsRouter = require('./routes/seasonalityTrends');
var synonymMissesRouter = require('./routes/synonymMisses');
var trendingKeywordsRouter = require('./routes/trendingKeywords');
var searchAddToCartConversionRouter = require('./routes/searchAddToCartConversion');
var zeroResultsSearchesRouter = require('./routes/zeroResultsSearches');

var cors = require("cors");


var app = express();
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Mount all routers on root path
app.use('/', [
  indexRouter,
  usersRouter,
  trendingKeywordsRouter,
  attributeTrendsRouter,
  brandSearchVolumeRouter,
  categoryDemandRouter,
  categoryOrCollectionMappingAccuracyRouter,
  conversionIntentFunnelRouter,
  crossSearchPatternRouter,
  highExitSearchesRouter,
  keywordClusteringRouter,
  lowResultSearchesRouter,
  newVsReturningCustomerSearchesRouter,
  priceIntentSegmentRouter,
  ratingSensitivityRouter,
  searchByLocationOrRegionRouter,
  searchFailRateRouter,
  seasonalityTrendsRouter,
  synonymMissesRouter,
  topSearchVolumeRouter,
  searchAddToCartConversionRouter,
  zeroResultsSearchesRouter
]);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // return JSON error response
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
