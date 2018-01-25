var map = null;
var heatmap = null;
var markers = [];
var samples = [];
var reffMarker = null;
var iconRed = null;

function InitializeMapResources()
{
    var iconSize = 40; //px

    iconRed = {
        url: "marker_red.svg", // url
        scaledSize: new google.maps.Size(iconSize, iconSize) // scaled size
    };

    iconBlue = {
        url: "marker_blue.svg", // url
        scaledSize: new google.maps.Size(iconSize, iconSize) // scaled size
    };    
}

function RemoveMarkers()
{
    markers = [];
}

function RemoveHeatMap()
{
    heatmap.setMap(null);
}

function CreateMarkers(mapData)
{
    if(markers.length != 0)
        RemoveMarkers();

    mapData.forEach(element => {
        AddMarker(element.timestamp, element.latitude, element.longitude, element.amplitude);
    });
}

function CreateHeatMap(mapData)
{
    if(heatmap)
        RemoveHeatMap();

    var heatMapData = [];

    mapData.forEach(element => {
        heatMapData.push({location: new google.maps.LatLng(element.latitude, element.longitude), weight: element.amplitude});
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatMapData,
        map: map,
        radius: 40
        });        
}

function MarkerCallback()
{
    $('#lineModalLabel').html('Histórico ' + this.title);

    $('#markerInfo').modal();
}

function AddMarker(timestamp, latitude, longitude, dB) {
    var marker = new google.maps.Marker({
        position: {lat: latitude, lng: longitude},
        title: moment(timestamp).format('HH:mm:ss DD/MM/YYYY') + ' / ' + String(dB.toFixed(2)) + ' dB',
        icon: iconRed
    });

    marker.addListener('click', MarkerCallback);    

    markers.push(marker);    
}

function SetMarkersVisibility(visible){
    markers.forEach(element => {
        element.setMap(visible ? map : null);
    });
}

function SetHeatMapVisibility(visible){
    heatmap.setMap(visible ? map : null);
}

function CreateRefferenceMarker(mapElement){
    if(reffMarker == null)
    {
        reffMarker = new google.maps.Marker({
            icon: iconBlue
        });

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });        

        reffMarker.addListener('click', function() {
            infowindow.open(map, reffMarker);
        });   
        
        infowindow.open(map, reffMarker);
    }
    
    reffMarker.setAnimation(google.maps.Animation.DROP);    
    reffMarker.setPosition(mapElement.latLng);
    reffMarker.setMap(map);

    TESTE(mapElement.latLng.lat(), mapElement.latLng.lng());
}

var contentString = '<div id="content">'+
                        '<h3 id="firstHeading" class="firstHeading">Histórico da Região</h1>'+
                        '<div id="bodyContent class="center-block">'+
                            '<button type="button" class="btn btn-info btn-md center-block" data-toggle="modal" data-target="#markerInfo">Abrir</button>' +
                        '</div>'+
                    '</div>';

function TESTE(latitude, longitude){

    console.log(latitude);
    console.log(longitude);

    $('#loading').show();

    var drp = $('#daterange').data('daterangepicker');

    GetServerTimeline(latitude, longitude, 100)
        .then(function(samples){
            console.log(samples.length);

            CreateMarkers(samples);
            CreateHeatMap(samples);

            $('#loading').hide();
        })
        .catch(function(errorMsg){
            console.log(errorMsg);

            $('#loading').hide();
        })
}                    