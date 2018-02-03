$('#markers').click(function(obj){
    if($("#markers").hasClass("active"))
    {
        $("#markers").removeClass("active");
        SetMarkersVisibility(false);
    }
    else
    {
        $("#markers").addClass("active");
        SetMarkersVisibility(true);
    }    
});

$('#heatMap').click(function(obj){
    if($("#heatMap").hasClass("active"))
    {
        $("#heatMap").removeClass("active");
        SetHeatMapVisibility(false);
    }
    else
    {
        $("#heatMap").addClass("active");
        SetHeatMapVisibility(true);
    }    
});

$('#daterange').on('apply.daterangepicker', function(ev, picker) {
    UpdateSamples();
});  

$('#slider_dB').on('slide', function(sliderValue){
    $('#sliderValue').html("min " + sliderValue.value + " dB"); 
});

$('#slider_dB').on('slideStop', function(sliderValue){
    UpdateSamples();
});