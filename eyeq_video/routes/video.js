
//===================================================
// Index.js
// Page: homepage
// Author: Andrew Birkholz
//===================================================
var express = require('express');
var router = express.Router();
var gnApi = global.gnApi;
var viewTitle = "Video Web API";


//===================================================
// Routes /\/foo(.*)/
//===================================================

//Homepage

router.get('/', function(req, res) {	
	var work = "Friends";
	var params = setParams("Work Title", work);
	global.gnApi.searchWork(work, null, null, function(err, result) {
		renderResult(res, 'video', 'work', params, result, err);
	});
});


router.get('/work/:work/rs/:rs', function(req, res) {	
	var work = req.params.work;
	var params = setParams("Work Title", work);
	setRange(req.params.rs, null);
	global.gnApi.searchWork(work, null, null, function(err, result) {
		renderResult(res, 'video', 'work', params, result, err);
	});
});

router.get('/work/fetch/:gnid/rs/:rs', function(req, res) {	
	var gnid = req.params.gnid;
	var params = setParams("Work GNID", gnid);
	setRange(req.params.rs, null);
	global.gnApi.fetchWork(gnid, null, null, function(err, result) {
		renderResult(res, 'video', 'work', params, result, err);
	});
});

router.get('/series/:series/rs/:rs', function(req, res) {	
	var series = req.params.series;
	var params = setParams("Series Title", series);
	setRange(req.params.rs, null);
	global.gnApi.searchSeries(series, null, null, function(err, result) {
		renderResult(res, 'video', 'series', params, result, err);
	});
});

router.get('/series/fetch/:gnid/rs/:rs', function(req, res) {	
	var gnid = req.params.gnid;
	var params = setParams("Series GNID", gnid);
	setRange(req.params.rs, null);
	global.gnApi.fetchSeries(gnid, null, null, function(err, result) {
		renderResult(res, 'video', 'series', params, result, err);
	});
});

router.get('/season/fetch/:gnid/rs/:rs', function(req, res) {	
	var gnid = req.params.gnid;
	var params = setParams("Season GNID",gnid);
	setRange(req.params.rs, null);
	global.gnApi.fetchSeason(gnid, null, null, function(err, result) {
		renderResult(res, 'video', 'season', params, result, err);
	});
});

router.get('/contributor/:contributor/rs/:rs', function(req, res) {	
	var contributor = req.params.contributor;
	var params = setParams("Contributor Name",contributor);
	setRange(req.params.rs, null);
	global.gnApi.searchContributor(contributor, null, null, function(err, result) {
		renderResult(res, 'video', 'contributor', params, result, err);
	});
});

router.get('/contributor/fetch/:gnid/rs/:rs', function(req, res) {	
	var gnid = req.params.gnid;
	var params = setParams("Contributor GNID", gnid);
	setRange(req.params.rs, null);
	global.gnApi.fetchContributor(gnid, null, null, function(err, result) {
		renderResult(res, 'video', 'contributor', params, result, err);
	});
});

router.get('/disc/fetch/:gnid/rs/:rs', function(req, res) {	
	var gnid = req.params.gnid;
	var params = setParams("Disc GNID", gnid);
	setRange(req.params.rs, null);
	global.gnApi.fetchDisc(gnid, null, null, function(err, result) {
		renderResult(res, 'video', 'disc', params, result, err);
	});
});



//===================================================
// Local Functions
//===================================================
function setRange(rangeStart, rangeEnd){
	global.gnApi.setRange(rangeStart, rangeEnd);
}

function setParams(type, value){
	var params =[];
	params[0] = type;
	params[1] = value;
	return params;
}

function renderResult(res, view, type, params, result, error){
	checkError(error);	
	res.render(view, { 
		searchType:'video',
		resultType: type,
		title:viewTitle,
		searchParams:params,
		resultCount: result.length,
  		gnUserId: userId,
  		gnClientId: clientId,
  		gnClientTag: clientTag,
  		gnResponse: result,
   	});	
}

function checkError(error){
	if (error) {
		console.log("GnAPI ERROR: "+err);
	}
}



module.exports = router;





