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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/data', trendingKeywordsRouter);
app.use('/data', attributeTrendsRouter);
app.use('/data', brandSearchVolumeRouter);
app.use('/data', categoryDemandRouter);
app.use('/data', categoryOrCollectionMappingAccuracyRouter);
app.use('/data', conversionIntentFunnelRouter);
app.use('/data', crossSearchPatternRouter);
app.use('/data', highExitSearchesRouter);
app.use('/data', keywordClusteringRouter);
app.use('/data', lowResultSearchesRouter);
app.use('/data', newVsReturningCustomerSearchesRouter);
app.use('/data', priceIntentSegmentRouter);
app.use('/data', ratingSensitivityRouter);
app.use('/data', searchByLocationOrRegionRouter);
app.use('/data', searchFailRateRouter);
app.use('/data', seasonalityTrendsRouter);
app.use('/data', synonymMissesRouter);
app.use('/data', topSearchVolumeRouter);
app.use('/data', searchAddToCartConversionRouter);
app.use('/data', zeroResultsSearchesRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
