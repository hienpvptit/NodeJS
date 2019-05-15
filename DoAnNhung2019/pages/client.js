var socket = io.connect();

socket.on("connect", function (data) {
    socket.emit("connection", "Connected");
});

socket.on("data", function (data) {
    // marker.position.lat = data[0].lat;
    // marker.position.lng = data[0].lng;

    //marker.position.lat(data[0].lat);
    //marker.position.lat(data[0].lng);

    //marker.position(data[0].lat, data[0].lng);
     marker = new google.maps.Marker({
         position: {
             lat: parseFloat(data[0].lat),
             lng: parseFloat(data[0].lng)
         },
         icon: icons,
         map: map
     });
});

var now = {
    lat: 20.9816749,
    lng: 105.7866145
};

var icons = "/pages/photos/icon-person.png";

var marker;

var map;

var geocoder;


function initMap() {
    map = new google.maps.Map(
        document.getElementById('map'), {
            zoom: 15,
            center: {
                lat: 20.9816749,
                lng: 105.7866145
            }
        });

    geocoder = new google.maps.Geocoder();

    marker = new google.maps.Marker({
        position: now,
        icon: icons,
        map: map
    });
    console.log(marker);


    // google.maps.event.addListener(map, 'click', function(event) {
    //     addMarker(event.latLng, map);
    // });

    marker.addListener('click', function() {
        geocoder.geocode({'latLng': marker.getPosition()}, function(results, status) {
            if(status=="OK"){
                var tmp = results[0].formatted_address;


                var infowindow = new google.maps.InfoWindow({
                    content: tmp
                });
                infowindow.open(map, marker);
            }
            else{
                //addressString = "Empty";
            }
        });

        //console.log(marker.getPosition().lat() + "," + marker.getPosition().lng());

    });
}

// setInterval(function () {
//     now.lat += 0.01;
//     now.lng += 0.01;
//     marker.setMap(null);
//     marker = new google.maps.Marker({
//         position: now,
//         icon: icons,
//         map: map
//     });
// }, 1000);

function showInformation() {
    console.log("test");
};

// function toggleBounce() {
//     if (marker.getAnimation() !== null) {
//         marker.setAnimation(null);
//     } else {
//         marker.setAnimation(google.maps.Animation.BOUNCE);
//     }
// }

// function addMarker(location, map) {
//
//     var marker = new google.maps.Marker({
//         position: location,
//         label: labels[labelIndex++ % labels.length],
//         map: map
//     });
// }