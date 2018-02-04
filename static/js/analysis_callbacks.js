$('#minDbSlider').on('slide', function(sliderValue){
    $('#minDbLabel').html(sliderValue.value + " dB"); 
})

$('#radiusSlider').on('slide', function(sliderValue){
    
    reffCircle.setRadius(sliderValue.value);

    $('#radiusLabel').html(sliderValue.value + " m"); 
})

$('#applyButton').on('click', function(){
    //Mostrar a tela de carregamento
    $('#loading').show();    

    OnApply();
});

$(document).ready(function () {

    $('#autoclosable-btn-info').prop("disabled", true);
    $('.alert-autocloseable-info').show();

    $('.alert-autocloseable-info').delay(4000).fadeOut( "slow", function() {
        // Animation complete.
        $('#autoclosable-btn-info').prop("disabled", false);
    });

});