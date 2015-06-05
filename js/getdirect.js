var map;
var markers = [];
var geocoder = new google.maps.Geocoder();
function geocodePosition(pos,box_no) {
  geocoder.geocode( {
    latLng: pos
  }, function(responses) {
    if (responses && responses.length > 0) {
        if(box_no == '1') {
            updateMarkerAddress1(responses[0].formatted_address);
        } else {
            updateMarkerAddress2(responses[0].formatted_address);
        }
      } else {
        if(box_no == '1') {
            updateMarkerAddress1('Cannot determine address at this location.');
        }
        else{
            updateMarkerAddress2('Cannot determine address at this location.');
        }
    }
  });
}

function updateMarkerPosition(latLng) {
    var str =  latLng.lat() +" "+ latLng.lng();
  $('#info').val(str);
}

function updateMarkerAddress1(str) {
  $('#address1').val(str);
}

function updateMarkerAddress2(str) {
  $('#address2').val(str);
}

// drag end
    var mj;
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var rendererOptions = {
      draggable: true
    };
function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
    var chicago = new google.maps.LatLng(41.850033, -87.6500523);
    var mapOptions = {
      zoom: 6,
      center: chicago
    }
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 6,
    center: chicago
  });
// direction service code
directionsDisplay.setMap(map);
// search box defined here
  var input1 = $('.pac-input')[0];
  var input2 = $('.pac-input')[1];
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  var searchBox1 = new google.maps.places.SearchBox((input1));
  var searchBox2 = new google.maps.places.SearchBox((input2));
 // search function start here
  google.maps.event.addListener(searchBox1, 'places_changed', function() {
      console.log("searchbox 1");
    var places = searchBox1.getPlaces();
    if (places.length == 0) {
      return;
    }

    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }
    // For each place, get the icon, place name, and location.
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      // Create a marker for each place.
       marker = new google.maps.Marker({
        map: map,
        title: place.name,
        position: place.geometry.location,
        draggable: true
      });

    $(".latitude").val(place.geometry.location.lat());
    $(".longitude").val(place.geometry.location.lng());
    updateMarkerPosition(marker.getPosition());
    geocodePosition(marker.getPosition(),'1');
    google.maps.event.addListener(marker, 'dragend', function() {
    geocodePosition(marker.getPosition(),'1');
    $(".latitude").val(marker.getPosition().lat());
    $(".longitude").val(marker.getPosition().lat());
  });
  markers.push(marker);
  bounds.extend(place.geometry.location);
    }
    if($('#address2').val().length > 0 && $('#address2').val() != 'undefined')
    {
        console.log("searchbox 1 make route");
        setTimeout(function() {
            calcRoute();
        }, 500);
    }
    else{
        map.fitBounds(bounds);
        map.setZoom(9);
    }
  });
google.maps.event.addListener(searchBox2, 'places_changed', function() {
    console.log("searchbox 2");
  var places1 = searchBox2.getPlaces();
  if (places1.length == 0) {
    return;
  }
  for (var i = 0, marker; marker = markers[i]; i++) {
    marker.setMap(null);
  }
  // For each place, get the icon, place name, and location.
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0, place; place = places1[i]; i++) {
    // Create a marker for each place.
    marker = new google.maps.Marker({
          map: map,
          title: place.name,
          position: place.geometry.location,
          draggable: true
    });
    
    $(".latitude2").val(place.geometry.location.lat());
    $(".longitude2").val(place.geometry.location.lng());
    updateMarkerPosition(marker.getPosition());
    geocodePosition(marker.getPosition(),'2');
    google.maps.event.addListener(marker, 'dragend', function() {
      geocodePosition(marker.getPosition(),'2');
      $(".latitude2").val(marker.getPosition().lat());
      $(".longitude2").val(marker.getPosition().lat());
    });
    markers.push(marker);
    bounds.extend(place.geometry.location);
    }
    if($('#address1').val().length > 0 && $('#address1').val() != 'undefined') {
        console.log("searchbox 2 make route");
        setTimeout(function() {
            calcRoute();
        }, 500);
    } else {
        map.fitBounds(bounds);
        map.setZoom(9);
    }
});
//   google.maps.event.addListener(map, 'bounds_changed', function() {
//   var bounds = map.getBounds();
//   searchBox2.setBounds(bounds);
//   map.setZoom(10);
// });
}
//initial function close here
// calculate route function
function calcRoute() {
  var start = $('#address1').val();
  var end = $('#address2').val();
  var request = {
      origin: start,
      destination: end,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.WALKING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      console.log("Done");
      var route = response.routes[0];
    }
  });
}
//to compute total distance function
function computeTotalDistance(result) {
  var total = 0;
  var myroute = result.routes[0];
  for (var i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
  total = total / 1000.0;
  document.getElementById('total').innerHTML = total + ' km';
}
google.maps.event.addDomListener(window, 'load', initialize);