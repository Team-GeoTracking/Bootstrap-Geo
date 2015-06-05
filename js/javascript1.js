//global variables
var msg = $('p#msg');
var errormsg = $('p#errormsg');
var gmap = navigator.geolocation;
var path = [];
var mapholder = document.getElementById('mapholder');


//watch position button
function watchLocation(){

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
		zoom : 12,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	}

	var map = new google.maps.Map(mapholder,myOptions);

	google.maps.event.addListener(map, "click", function (e) {
    //lat and lng is available in e object
    var latLng = e.latLng;
    path.push(latLng);
    marker = new google.maps.Marker ( { position : path[0], map : map } );
    document.getElementById('coordinates').innerHTML = path;
    var polyline = new google.maps.Polyline({ map: map, path: path, strokeColor: '#0000FF', strokeOpacity: 0.7, strokeWeight: 4});});

}

function savePath(){
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
}

function viewPathHistory(){
	msg.html("Viewing Location History...");

	var name = $('input#username').val();
	$.post('viewpathhistory.php',{name : name},
		function (data) {


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
				path.push(x);
			};

			var myOptions = {
				center : path[0],
				zoom : 12,
				mapTypeId : google.maps.MapTypeId.ROADMAP
			}

			var map = new google.maps.Map(mapholder,myOptions);
			//marker = new google.maps.Marker ( { position : x, map : map } );

			var polyline = new google.maps.Polyline({ map: map, path: path, strokeColor: '#0000FF', strokeOpacity: 0.7, strokeWeight: 4});


			// fit path on map

			//make the points visible on current map
			var latlonBounds = new google.maps.LatLngBounds();
			for (var i = 0; i < path.length ; i++) {
				latlonBounds.extend(path[i]);
			};
			//centering the path
			map.fitBounds(latlonBounds);
		}
	);
}