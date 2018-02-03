$('#minDbSlider').on('slideStop', function(sliderValue){
    //RefreshPage();
})

$('#minDbSlider').on('slide', function(sliderValue){
    $('#minDbLabel').html(sliderValue.value + " dB"); 
})

$('#radiusSlider').on('slide', function(sliderValue){
    
    reffCircle.setRadius(sliderValue.value);

    $('#radiusLabel').html(sliderValue.value + " m"); 
})

$('#daterange').on('apply.daterangepicker', function(ev, picker) {          
    //RefreshPage();
});  

$('#applyButton').on('click', function(){
    RefreshPage();
})