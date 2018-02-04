var map = null;
var markers = [];
var markersTest = null;
var reffMarker = null;
var iconRed = null;
var iconBlue = null;
var reffCircle = null;

function InitializeMapResources()
{
    var mapOptions = {
        center: new google.maps.LatLng(-25.439347, -49.268849),
        zoom: 14,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP]
        },                      
    }                

    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    iconRed = {
        url: "marker_red.svg", // url
        scaledSize: new google.maps.Size(40, 40) // scaled size
    };

    iconBlue = {
        url: "marker_blue.svg", // url
        scaledSize: new google.maps.Size(40, 40) // scaled size
    };    

    if(reffMarker == null)
    {
        reffMarker = new google.maps.Marker({
            icon: iconBlue,
            draggable: true,
            map: map
        }); 

        reffMarker.setAnimation(google.maps.Animation.DROP);                     
    }    

    google.maps.event.addListener(map, 'click', MapClickCallback);

    DrawReffCircle(map.getCenter());
}

function ReffMarkerCallback()
{
    $('#lineModalLabel').html('Histórico ' + this.title);

    $('#markerInfo').modal();
}

function SetMapRadius(radiusSize){
    reffCircle.setRadius(radiusSize);
}

function DrawReffCircle(latLng){
    if(reffCircle == null){
        google.maps.Circle.prototype.contains = function(latLng) {
            return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
        }   

        reffCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            radius: 300,
            editable: true,
            draggable: true
          });        

        reffCircle.bindTo('center', reffMarker, 'position');

        google.maps.event.addListener(reffCircle, 'radius_changed', function() {
            $('#radiusSlider').slider('setValue', reffCircle.getRadius());

            $('#radiusLabel').html(reffCircle.getRadius().toFixed(0) + " m"); 
        });              
    }

    reffCircle.setCenter(latLng);
}

function MapClickCallback(mapElement){
    DrawReffCircle(mapElement.latLng);    
}

function FilterInsideRegion(samples){
    return samples.filter(t => reffCircle.contains(new google.maps.LatLng(t.latitude, t.longitude)));
}

function FilterOutsideRegion(samples){
    return samples.filter(t => !reffCircle.contains(new google.maps.LatLng(t.latitude, t.longitude)));
}

function PrintRegionMarkers(samplesInside, samplesOutside){
    RemoveMarkers();

    samplesInside.forEach(s => {
        AddMarker(s.timestamp, s.latitude, s.longitude, s.amplitude, iconRed);
    });    

    samplesOutside.forEach(s => {
        AddMarker(s.timestamp, s.latitude, s.longitude, s.amplitude, iconBlue);
    });    
}

function AddMarker(timestamp, latitude, longitude, dB, image) {
    var marker = new google.maps.Marker({
        position: {lat: latitude, lng: longitude},
        title: moment(timestamp).format('HH:mm:ss DD/MM/YYYY') + ' / ' + String(dB.toFixed(2)) + ' dB',
        icon: image,
        map: map
    });   

    markers.push(marker);    
}

function RemoveMarkers()
{
    if(markers.length==0)
        return;

    markers.forEach(element => {
        element.setMap(null);
    });

    markers = [];
}