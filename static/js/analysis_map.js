var map = null;
var reffMarker = null;
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
            console.log('teste_raio: '+ reffCircle.getRadius());
        });              
    }

    reffCircle.setCenter(latLng);
}

function MapClickCallback(mapElement){
    DrawReffCircle(mapElement.latLng);    
}

function TESTE(latitude, longitude){

    console.log(latitude);
    console.log(longitude);

    $('#loading').show();

    var drp = $('#daterange').data('daterangepicker');

    GetServerTimeline(latitude, longitude, 100)
        .then(function(samples){
            console.log(samples.length);

            $('#loading').hide();
        })
        .catch(function(errorMsg){
            console.log(errorMsg);

            $('#loading').hide();
        })
}                    