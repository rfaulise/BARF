
$(window).ready(function(){
	initiate_geolocation();
	
});

//Page active
$(document).ready(function(){
	setActiveInput();
});
$(document).on("click",'.show-more-button',function(){
	toggleResultRow(this);
});

$(document).on("click",'.toggle-row-link',function(){
	toggleResultRow(this);
});

//Trigger search
$(document).on("click",'#search-button-video',function(){
	sendVideoQuery();
});

$(document).on("keypress",'#video-search-input',function(e){
	if (e.keyCode == 13){
		sendVideoQuery();
	}
});

$(document).on("click",'#search-button',function(){
	sendMusicQuery();
});

$(document).on("keypress",'.search-input',function(e){
	if (e.keyCode == 13){
		sendMusicQuery();
	}
});

//Select all input value
$(document).on("click",'.copy',function(){
	$(this).select();
});


$(document).on("click",'.search-type',function(){
	var val = $(this).text();
	var input = $('#video-search-input');	
	
	$('#search-type-value').text(val);		
	$(input).attr("placeholder",val+"...");
	$(input).attr("disabled", false);
	$(input).val("");
	
});


$('#settings').popover({
	title: 'Gracenote API Settings',
	placement: 'auto',
	trigger:'click',
	html:true
});


$('#navmenu').popover({
	title: "Gracenote API's",
	placement: 'auto',
	trigger:'click',
	template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content" id="nav-menu-popover-content"></div></div>',
	content: "<div id='nav-menu'>"+ 
			 "<ul class='list-unstyled' id='nav-menu-list'>"+
			 	"<li class='nav-menu-item'><a href='#'><span class='glyphicon glyphicon-music'></span> <b>Music</b> <br>Artists, albums & tracks</a></li>"+
			 	"<li class='nav-menu-item'><a href='/video/'><span class='glyphicon glyphicon-film'></span> <b>Video</b><br> Works, contributors, series, seasons & products</a></li>"+
			 	"<li class='nav-menu-item'><a href='/epg/'><span class='glyphicon glyphicon-facetime-video'></span> <b>EPG</b><br>TV providers, channels, programs & airings</a></li>"+
			 "</ul>"+
			 "</div>",
	html:true
});


function toggleResultRow(clickedEle){
	var clickedClass = $(clickedEle).attr("class");
	
	
	if (clickedClass == 'show-more-button'){
		var thisTable = $(clickedEle).parent().parent().parent().parent();
		var display = $(thisTable).find(".toggle-section").css("display");
		$(thisTable).find(".toggle-section").toggle("fast");
		
		if (display == "none"){
			$(clickedEle).text("Show Less...");
		}else{
			$(clickedEle).text("Show More...");
		}
	}
	
	if (clickedClass == 'toggle-row-link'){
		var thisTR = $(clickedEle).parent();
		var toggleTR = $(thisTR).next();
		var display = $(toggleTR).css("display");
		
		if (display == "none"){
			$(clickedEle).find("font").text("Hide");
		}else{
			$(clickedEle).find("font").text("Show");
		}
		
		
		$(thisTR).next().toggle("fast");
	}
		
}

function setActiveInput(){
	
	var isMusic = $('.search-input').length;
	var isVideo = $('#video-search-input').length;
	
	if (isMusic){
		$('.search-input').each(function(){
			var val = $(this).val();
			if (val){
				$(this).focus();
			}
		});
	}

	
}


function sendVideoQuery(){
	
	var baseUrl = document.location.origin;
	var qryUrl;
	var searchVal = $('#video-search-input').val();
	var type = $('#search-type-value').text();	
	var searchType = $.trim(type);	
	
	if (searchVal == ''){
		return;
	}
	else{
		switch (searchType){
			case "Work Title":
				qryUrl ="/video/work/"+searchVal+"/rs/0";
				break;
			case "Work GNID":
				qryUrl = "/video/work/fetch/"+searchVal+"/rs/0";
				break;
			case "Series Title":
				qryUrl = "/video/series/"+searchVal+"/rs/0";
				break;
			case "Series GNID":
				qryUrl = "/video/series/fetch/"+searchVal+"/rs/0";
				break;
			case "Season GNID":
				qryUrl = "/video/season/fetch/"+searchVal+"/rs/0";
				break;
			case "Contributor Name":
				qryUrl = "/video/contributor/"+searchVal+"/rs/0";
				break;
			case "Contributor GNID":
				qryUrl = "/video/contributor/fetch/"+searchVal+"/rs/0";
				break;			
			case "Disc GNID":
				qryUrl = "/video/disc/fetch/"+searchVal+"/rs/0";
				break;		
		}

		window.location.href =  baseUrl + qryUrl;
		
	}
}



function sendMusicQuery(){
	var artistVal = $('#artist').val();
	var albumVal = $('#album').val();
	var trackVal = $('#track').val();
	var gnidVal = $('#gnid').val();
	var baseUrl = document.location.origin;
	var qryUrl = baseUrl;
	
	if (artistVal == '' && albumVal == '' && trackVal == '' && gnidVal == ''){
		return;
	}
	else
	{
		if (artistVal != ''){
			qryUrl = "/artist/"+artistVal;
		}
		
		if (albumVal != ''){
			qryUrl = qryUrl + "/album/"+albumVal;
		}
		
		if (trackVal != ''){
			qryUrl = qryUrl + "/track/"+trackVal;
		}
		
		if (gnidVal != ''){
			qryUrl = baseUrl+"/gnid/"+gnidVal;
		}
		
		window.location.href = qryUrl + "/rs/0";
	}
}



 
function initiate_geolocation() {
    navigator.geolocation.getCurrentPosition(handle_geolocation_query,handle_errors);
}

function handle_errors(error){

	var error;
    switch(error.code)
    {
        case error.PERMISSION_DENIED: 
        	error = "user did not share geolocation data";
        	break;
        case error.POSITION_UNAVAILABLE: 
        	error = "could not detect current position";
        	break;
        case error.TIMEOUT: 
        	error = "retrieving position timed out";
        	break;
        default: 
        	error = "unknown error";
        	break;
    }

    console.log("ERROR with Geolocation: "+error);
}

function handle_geolocation_query(position){
	var lat = position.coords.latitude;
	var lng = position.coords.longitude;
	getAddressInfo(lat,lng);
}

function getAddressInfo(latitude, longitude){
	var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=false';

	$.getJSON(url, function(data) {
		var address = data.results[0].formatted_address;
		var zipcode = data.results[0].address_components[7].long_name;

		$('.loader').hide();
		$('#address .addrVal').text(address);
		$('#zipcode .addrVal').text(zipcode);

	});
}




