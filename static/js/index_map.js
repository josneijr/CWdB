var map = null;
var heatmap = null;
var markers = [];
var samples = [];
var iconRed = null;

function InitializeMapResources()
{
    var iconSize = 40; //px

    iconRed = {
        url: "marker_red.svg", // url
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

function AddMarker(timestamp, latitude, longitude, dB) {
    var marker = new google.maps.Marker({
        position: {lat: latitude, lng: longitude},
        title: moment(timestamp).format('HH:mm:ss DD/MM/YYYY') + ' / ' + String(dB.toFixed(2)) + ' dB',
        icon: iconRed
    });   

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