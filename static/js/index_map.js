var map = null;
var heatmap = null;
var markers = [];

function CreateMarkers(mapData)
{
    mapData.forEach(element => {
        AddMarker(element.latitude, element.longitude, element.amplitude);
    });
}

function CreateHeatMap(mapData)
{
    var heatMapData = [];

    mapData.forEach(element => {
        heatMapData.push({location: new google.maps.LatLng(element.latitude, element.longitude), weight: element.amplitude});
        console.log(heatMapData);
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatMapData,
        map: map,
        radius: 40
        });        
}

function AddMarker(latitude, longitude, dB) {
    var marker = new google.maps.Marker({
        position: {lat: latitude, lng: longitude},
        title: String(dB) + ' dB'
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
