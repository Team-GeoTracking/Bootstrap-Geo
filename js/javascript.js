//global variables
var msg = $('p#msg');
var errormsg = $('p#errormsg');
var gmap = navigator.geolocation;
var path = [];
var mapholder = document.getElementById('mapholder');
var mapa;


//watch position button
function watchLocation(){
	msg.html("Watching Location...");

	if (gmap) {
		//errormsg.html("Working");
		gmap.watchPosition(showPosition);

	} else{
		errormsg.html("Not Working");
	};
}
function showPosition(position) {

	var lat = position.coords.latitude;
	var lon = position.coords.longitude;
	latlon = new google.maps.LatLng(lat,lon);
	path.push(latlon);
	//map settings
	var myOptions = {
		center:latlon,
		zoom:18,
		mapTypeId:google.maps.MapTypeId.ROADMAP
	}

	//map creation
	var map = new google.maps.Map(mapholder,myOptions);
	
	//place marker
	marker = new google.maps.Marker({position: latlon, map: map});

	//add line
    var polyline = new google.maps.Polyline({ map: map, path: path, strokeColor: '#0000FF', strokeOpacity: 0.7, strokeWeight: 4});

    //display coordinates
	document.getElementById('coordinates').innerHTML = path;
}
function addPath() {

	var lat = 14.5861074;
	var lon = 121.0586205;
	latlon = new google.maps.LatLng(lat,lon);

	var myOptions = {
		center : latlon,
		zoom : 14,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	}

	mapa = new google.maps.Map(mapholder,myOptions);

	google.maps.event.addListener(mapa, "click", function (e) {
    //lat and lng is available in e object
    var latLng = e.latLng;
    path.push(latLng);
    marker = new google.maps.Marker ( { position : path[0], map : mapa, icon : "startIcon.png", title : "Start Point" } );
    document.getElementById('coordinates').innerHTML = path;
    var polyline = new google.maps.Polyline({ map: mapa, path: path, strokeColor: '#0000FF', strokeOpacity: 0.7, strokeWeight: 4});});

}

function savePath(){
	msg.html("Saving Location...");

	//string
	obj = JSON.stringify(path);
	console.log(obj);
	console.log(typeof obj);

	//object
	console.log(path);
	console.log(typeof path);
	//getting the username assigning a variable
	var name = $('input#username').val();
	//ajax
	$.post('save.php',{obj : obj, name:name},function (data) {
		//alert(data);
		errormsg.html("Done!")
	})
	var lastLocation = path.length-1;
	marker = new google.maps.Marker ( { position : path[lastLocation], map : mapa, title : "End Point"} );
}

function viewPathHistory(){
	msg.html("Viewing Location History...");

	var name = $('input#username').val();
	$.post('viewpathhistory.php',{name : name},
		function (data) {
			var pathHistory = [];

			console.log(data);
			console.log(typeof data);

			//encoding string to object
			var result = eval('('+data+')');

			//split string to array containing number
			//latitudes
			var latintArray = result.lat.split(',').map(Number);

			//longitudes
			var lonintArray = result.lon.split(',').map(Number);


			//var lat = latintArray[0];
			//var lon = lonintArray[0];
			//latlon = new google.maps.LatLng(lat,lon);
			
			//pushing the latintArray and lonintArray to path Array
			for (var i = 0; i < latintArray.length; i++) {
				var x = new google.maps.LatLng( latintArray[i] , lonintArray[i] );
				pathHistory.push(x);
			};

			var myOptions = {
				center : pathHistory[0],
				zoom : 12,
				mapTypeId : google.maps.MapTypeId.ROADMAP
			}

			var map = new google.maps.Map(mapholder,myOptions);
			//marker = new google.maps.Marker ( { position : x, map : map } );

			var polyline = new google.maps.Polyline({ map: map, path: pathHistory, strokeColor: '#0000FF', strokeOpacity: 0.7, strokeWeight: 4});


			// fit path on map

			//make the points visible on current map
			var latlonBounds = new google.maps.LatLngBounds();
			for (var i = 0; i < pathHistory.length ; i++) {
				latlonBounds.extend(pathHistory[i]);
			};
			//centering the path
			map.fitBounds(latlonBounds);

			//adding start point
			marker = new google.maps.Marker ( { position : pathHistory[0], map : map, icon : "startIcon.png", title : "Start Point" } );

			//adding last point
			var lastLocation = (pathHistory.length-1);
			marker = new google.maps.Marker ( { position : pathHistory[lastLocation], map : map, title : "End Point" } );			
			pathHistory = [];
		}
	);
}



function image(){
	var image = document.getElementById('image').files[0];
	console.log(image.name);
	console.log(image.type);
	console.log(image.size);

	var pic = new FormData();    
	pic.append( 'file', $('#image')[0].files[0] );
	console.log(pic);
	console.log(typeof pic);

	//var name = $('input#username').val();

	$.ajax({
		url: 'image.php',
		data: pic,
		processData: false,
		contentType: false,
		type: 'POST',
		success: function(data){
			alert(data)
			console.log('upload success!')
			//$('#data').empty();
			//$('#data').append(data);
		}
	});
}

function showNearby() {
	msg.html("Showing Nearby...");

	if (gmap) {
		//errormsg.html("Working");
		gmap.getCurrentPosition(showNearbyPeople);
		
	} else{
		errormsg.html("Not Working");
	};

}

function showNearbyPeople(pos) {
	var marker = [];
	var lat = pos.coords.latitude;
	var lon = pos.coords.longitude;
	latlon = new google.maps.LatLng(lat,lon);

	//path.push(latlon);
	//map settings
	var myOptions = {
		center:latlon,
		zoom:18,
		mapTypeId:google.maps.MapTypeId.ROADMAP
	}

	//map creation
	var map = new google.maps.Map(mapholder,myOptions);
	
	//place marker
	marker[0] = new google.maps.Marker({position: latlon, map: map, icon : {url :"avatars/superman.png", anchor: new google.maps.Point(16, 14)}});
	marker[1] = new google.maps.Marker({position: new google.maps.LatLng(14.586140295307683, 121.05801969766617), map: map, icon : {url : "avatars/captainamerica.png", anchor: new google.maps.Point(16, 14)}});
	marker[2] = new google.maps.Marker({position: new google.maps.LatLng(14.586469956800912, 121.05791509151459), map: map, icon : {url : "avatars/flash.png", anchor: new google.maps.Point(16, 14)}});
	marker[3] = new google.maps.Marker({position: new google.maps.LatLng(14.585933932153246, 121.05842538177967), map: map, icon : {url : "avatars/greenlantern.png", anchor: new google.maps.Point(16, 14)}});
	marker[4] = new google.maps.Marker({position: new google.maps.LatLng(14.586719149413094, 121.05851590633392), map: map, icon : {url : "avatars/hulk.png", anchor: new google.maps.Point(16, 14)}});
	marker[5] = new google.maps.Marker({position: new google.maps.LatLng(14.586397275569222, 121.05906307697296), map: map, icon : {url : "avatars/spiderman.png", anchor: new google.maps.Point(16, 14)}});
	marker[6] = new google.maps.Marker({position: new google.maps.LatLng(14.585670461932832, 121.05895578861237), map: map, icon : {url : "avatars/thor.png", anchor: new google.maps.Point(16, 14)}});
	marker[7] = new google.maps.Marker({position: new google.maps.LatLng(14.58547318353183, 121.05837643146515), map: map, icon : {url : "avatars/wolverine.png", anchor: new google.maps.Point(16, 14)}});
	marker[8] = new google.maps.Marker({position: new google.maps.LatLng(14.586667234308827, 121.05904161930084), map: map, icon : {url : "avatars/batman.png", anchor: new google.maps.Point(16, 14)}});
	marker[9] = new google.maps.Marker({position: new google.maps.LatLng(14.58663608524038, 121.05947077274323), map: map, icon : {url : "avatars/flash.png", anchor: new google.maps.Point(16, 14)}});
	marker[10] = new google.maps.Marker({position: new google.maps.LatLng(14.58667761733065, 121.06015741825104), map: map, icon : {url : "avatars/hulk.png", anchor: new google.maps.Point(16, 14)}});
	marker[11] = new google.maps.Marker({position: new google.maps.LatLng(14.585981953785064, 121.06081187725067), map: map, icon : {url : "avatars/wolverine.png", anchor: new google.maps.Point(16, 14)}});
	marker[12] = new google.maps.Marker({position: new google.maps.LatLng(14.585950804619674, 121.05695888400078), map: map, icon : {url : "avatars/captainamerica.png", anchor: new google.maps.Point(16, 14)}});
	marker[13] = new google.maps.Marker({position: new google.maps.LatLng(14.585140924772725, 121.05942785739899), map: map, icon : {url : "avatars/thor.png", anchor: new google.maps.Point(16, 14)}});

	var circleRadius = $('input#radius').val();

	if (circleRadius == "") {
		circleRadius = 90;
	};


	// Add circle overlay
	var circle = new google.maps.Circle({
	  map: map,
	  radius: parseFloat(circleRadius),
	  fillColor: '#AA0000'
	});
	//bind the circle on marker
	circle.bindTo('center', marker[0], 'position');

	for (var i = 0; i < marker.length; i++) {
		var circlebounds = circle.getBounds().contains(marker[i].getPosition());
		if (!circlebounds) {
			marker[i].setMap(null);
		};
	};

	map.fitBounds(circle.getBounds());

	// //return true if the marker is within circle else false
	// var circlebounds = circle.getBounds().contains(marker[1].getPosition());
	// var circlebounds2 = circle.getBounds().contains(marker[2].getPosition());

	// console.log(circlebounds);
	// console.log(circlebounds2);


	// if (!circlebounds) {
	// 	marker[1].setMap(null);
	// }

	// if (!circlebounds2) {
	// 	marker[2].setMap(null);
	// }

	//document.getElementById('coordinates').innerHTML = path;
}