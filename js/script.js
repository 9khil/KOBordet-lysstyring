//  00:17:88:14:E3:9A
var requestURL = "http://10.1.101.147/api/newdeveloper/lights";
var groupRequestURL = "http://10.1.101.147/api/newdeveloper/groups/0"; 

//testUrls
var requestURL =  "http://192.168.1.120/api/newdeveloper/lights";
var groupRequestURL =  "http://192.168.1.120/api/newdeveloper/groups/0";

var bulbs;
var bulbsOn = false;
var discoMode = false;

var workHex = "FFFFCC";




function initialize() {
	var xmlHttp = new XMLHttpRequest(); //returns a XMLHttpRequest object  
    var mimeType = "text/plain";  
    xmlHttp.open('GET', requestURL, true);  // true : asynchrone false: synchrone  
    xmlHttp.setRequestHeader('Content-Type', mimeType);    
    xmlHttp.send();
    xmlHttp.onreadystatechange=function()
	  {
		if (xmlHttp.readyState==4 && xmlHttp.status==200)
	    {
	    	bulbs = JSON.parse(xmlHttp.response);
	    	getBulbState();

	    }
	  }
 }  




	if(document.getElementById('colorPickerAll')){
		document.getElementById('colorPickerAll').addEventListener('change', function(){
				var hex = this.value.substr(1);
				changeAllXY("["+colors.hexToCIE1931(hex)+"]");
		});
	}

	
	



/*********
Funny stuff 
**********/

/*camera*/
function getColorFromCam(){
	changeAllXY("["+colors.hexToCIE1931($("#color").text().substring(21))+"]")
	changeAllBri("[" + $("#brightness").text().substring(26) + "]");
}

function onError(errorId,errorMsg) {
	console.log(errorMsg);
}			

function changeCamera() {
	$.scriptcam.changeCamera($('#cameraNames').val());
}

function onWebcamReady(cameraNames,camera,microphoneNames,microphone,volume) {
	$.each(cameraNames, function(index, text) {
		$('#cameraNames').append( $('<option></option>').val(index).html(text) )	
	}); 
	$('#cameraNames').val(camera);
}

function onMotion(motion,brightness,color,motionx,motiony) {
	$('#brightness').html('Brightness level (0-255): '+brightness);
	$('#color').html('Average color (hex): '+color);
	$('#colordiv').css('background-color','#'+color);
}


/**********
Bulb presets
**********/

function workMode(){
	changeAllXY("["+colors.hexToCIE1931(workHex)+"]");
	changeAllBri(180);
	changeAllSat(180);
}

function chillMode(){
	//random colors

	
	for(var i = 1; i<=Object.size(bulbs); i++){
		
		var hue = Math.round(Math.random() * 32000);
		changeHue(i,Math.round(hue));

		var bri = Math.round(Math.random() * 255);
		changeBri(i,Math.round(bri));

		var sat = Math.round((Math.random()*50) + 205);
		changeSat(i,Math.round(sat));
	}

}

function toggleDiscoMode(){
	var audio = document.getElementById('funkyTown');
	if(discoMode){
		audio.play();
		discoModeOn();
	}
	else
		audio.pause();
		
}

function discoModeOn(){
	
	for(var i = 1; i<=Object.size(bulbs); i++){
		
		var hue = Math.round(Math.random() * 32000);
		changeHue(i,Math.round(hue));

		var bri = Math.round(Math.random() * 255);
		changeBri(i,Math.round(bri));

		var sat = Math.round((Math.random()*50) + 205);
		changeSat(i,Math.round(sat));
	}
	
	if(discoMode)
		setTimeout(discoModeOn,500);
}

/**********
Bulb control
***********/

function toggleAll(value){
	var url = groupRequestURL + '/action';
	var request = '{"on": ' + value + '}';
	bulbsOn = !bulbsOn;
	toggleBulbButtons();
	pushToBulbs(url, request);
}


function toggle(id){
	var url = requestURL + "/"+id + "/state";
	var request = '{"on": '+!bulbs[id].on+'}';
	bulbs[id].on = !bulbs[id].on;
	pushToBulbs(url, request);
}


 function pushToBulbs(url, request){
	var xmlHttp = new XMLHttpRequest(); //returns a XMLHttpRequest object  
	var mimeType = "text/plain";  
	xmlHttp.open('PUT', url, false);  // true : asynchrone false: synchrone  
    xmlHttp.setRequestHeader('Content-Type', mimeType);    
    xmlHttp.send(request); 
    
}

function getBulbState(){
 	var xmlHttp = new XMLHttpRequest(); //returns a XMLHttpRequest object  
 	var mimeType = "text/plain";  
    xmlHttp.open('GET', groupRequestURL , true);  // true : asynchrone false: synchrone  
    xmlHttp.setRequestHeader('Content-Type', mimeType);    
    xmlHttp.send();

    xmlHttp.onreadystatechange=function()
	{
		if (xmlHttp.readyState==4 && xmlHttp.status==200)
	    {
	    	var response = JSON.parse(xmlHttp.response);
	    	for(var i = 1; i <= Object.size(bulbs); i++){
	    		bulbs[i].on = response.action.on;
	    	}
	    	if(bulbs[1].on)
	    		toggleBulbButtons();

	    	toggleLoader();
    	}
	}

	
 }


/**********
Bulb bri/sat/hue functions
***********/

/* SINGLE */
function changeHue(id,value){
	var url = requestURL + "/"+id + "/state";
	var request = '{"hue": '+value+'}';
	pushToBulbs(url, request);
}

function changeBri(id,value){
	var url = requestURL + "/"+id + "/state";
	var request = '{"bri": '+value+'}';
	pushToBulbs(url, request);
}

function changeSat(id,value){
	var url = requestURL + "/"+id + "/state";
	var request = '{"sat": '+value+'}';
	pushToBulbs(url, request);
}

function changeXY(id,value){
	var url = requestURL + "/"+id + "/state";
	var request = '{"xy": '+value+'}';
	pushToBulbs(url, request);
}


/* ALL */
function changeAllXY(value){
	var url = groupRequestURL + '/action';
	var request = '{"xy": '+value+'}';
	pushToBulbs(url, request);
}

function changeAllBri(value){
	var url = groupRequestURL + '/action';
	var request = '{"bri": '+value+'}';
	pushToBulbs(url, request);
}

function changeAllSat(value){
	var url = groupRequestURL + '/action';
	var request = '{"sat": '+value+'}';
	pushToBulbs(url, request);
}

/**********
 random helper functions 
 ***********/

 Object.size = function(obj){
	var size = 0, key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};

function toggleBulbButtons(){
	$("#turnLampsOff, #turnLampsOn, #modeSelectors").toggleClass('active');	
}

function toggleLoader(){
	$("#loader, #onOffToggles").toggleClass('active');
}

/***********
Evnt listeners
************/

if(document.getElementById('turnLampsOn')){
	document.getElementById('turnLampsOn').addEventListener("click", function(){
		toggleAll(true);
	})
}

if(document.getElementById('turnLampsOff')){
	document.getElementById('turnLampsOff').addEventListener("click", function(){
		discoMode = false;
		toggleDiscoMode();
		toggleAll(false);
	})
}

if(document.getElementById('workMode')){
	document.getElementById('workMode').addEventListener("click", function(){
		discoMode = false;
		toggleDiscoMode();
		workMode();
	})
}

if(document.getElementById('chillMode')){
	document.getElementById('chillMode').addEventListener("click", function(){
		discoMode = false;
		toggleDiscoMode();
		chillMode();
	})
}

if(document.getElementById('brightness')){
	document.getElementById('brightness').addEventListener("change", function(){
		changeAllBri(this.value);
	})
}


if(document.getElementById('discoMode')){
	document.getElementById('discoMode').addEventListener('click', function(){	
		discoMode = !discoMode;
		toggleDiscoMode();
	});

};

