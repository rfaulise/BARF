
//===================================================
// Index.js
// Page: homepage
// Author: Andrew Birkholz
//===================================================
var express = require('express');
var router = express.Router();
var gnApi = global.gnApi;
var viewTitle = "Gracenote eyeQ";


//===================================================
// Routes /\/foo(.*)/
//===================================================

//Homepage

router.get('/', function(req, res) {	
	var contrib = "Brad Pitt";
	var params = setParams('Contributor Name',contrib);
	setRange(0, 20)
	global.gnApi.searchContributor(contrib, function(err, result) {
		renderResult(res, 'index', 'contributor', params, result, err);
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





