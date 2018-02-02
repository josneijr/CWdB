$('#slider_dB').on('slideStop', function(sliderValue){
    RefreshPage();
})

$('#slider_dB').on('slide', function(sliderValue){
    $('#sliderValue').html(sliderValue.value + "dB"); 
})

$('#daterange').on('apply.daterangepicker', function(ev, picker) {          
    RefreshPage();
});  