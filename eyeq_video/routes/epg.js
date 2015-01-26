
//===================================================
// Index.js
// Page: homepage
// Author: Andrew Birkholz
//===================================================
var express = require('express');
var router = express.Router();
var gnApi = global.gnApi;
var viewTitle = "EPG";
var http = require('http');


//===================================================
// Routes /\/foo(.*)/
//===================================================
/*
 * 1. Get Postal Code
 * 2. Select Provider
 * 3. Select Channels
 * 4. Set Time Period
 * 5. Set mode
 * 6. View programs
 */

router.get('/', function(req, res) {

	var zipcode = "55311";
	var params = setParams('provider',zipcode);
	setRange(0, 20)
	global.gnApi.tvProviderLookup(zipcode, null, null, function(err, result) {
		renderResult(res, 'epg', 'provider', params, result, err);
	});
});


router.get('/channel/provider/:gnid/', function(req, res) {	
	//Provider GNID
	///channel/provider/251483715-8B295B5CB89768C355DDAC3CB0FBF000
	var gnid = req.params.gnid;
	var params = setParams('channel',gnid);
	setRange(0, 100);
	global.gnApi.tvChannelLookup(gnid, "TVPROVIDER", null, function(err, result) {
		renderResult(res, 'epg', 'channel', params, result, err);
	});
	
});
router.get('/channel/:gnid/', function(req, res) {	
	//Channel GNID
	//251550442-B9D8743F211E4AB295AA460F9117A044
	var gnid = req.params.gnid;
	var params = setParams('channel',gnid);
	setRange(0, 100);
	global.gnApi.tvChannelFetch(gnid, null, null, function(err, result) {
		renderResult(res, 'epg', 'TV Channel', params, result, err);
	});
	
});

router.get('/tvgrid/:gnids/', function(req, res) {	
	//Channel GNIDS
	//251550442-B9D8743F211E4AB295AA460F9117A044+251536909-5A6A61A7A5E18F3D9F3F07DFCC8BC69E
	var gnids = req.params.gnids;
	var gnidArray = gnids.split("+");
	var params = setParams('tvgrid',gnidArray);

	//Set start and end date for airing
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	var hour = date.getHours();
	var endHour = hour + 5;
	var minutes = date.getMinutes();
	var startDate = +year+'-'+month+'-'+day+'T'+hour+':'+minutes;
	var endDate = +year+'-'+month+'-'+day+'T'+endHour+':00';	

	var modeInput = [];
	modeInput[0] = startDate;
	modeInput[1] = endDate;

	setRange(0, 100);
	global.gnApi.tvGridLookup(gnidArray, null, modeInput, function(err, result) {
		renderResult(res, 'epg', 'tvgrid', params, result, err);
	});
	
});

router.get('/program/:gnid/', function(req, res) {	
	//Program GNID
	//447254779-8D2968F3AD0FD43267BEB6AA5FE3DF3C 
	var gnid = req.params.gnid;
	var params = setParams('program', null, null, gnid);
	setRange(0, 100);
	global.gnApi.tvProgramFetch(gnid, null, null, function(err, result) {
		renderResult(res, 'epg', 'program', params, result, err);
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
		searchType:'epg',
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





