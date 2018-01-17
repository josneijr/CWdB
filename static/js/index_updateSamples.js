function UpdateSamples(){
                
    var drp = $('#daterange').data('daterangepicker');

    var timePickerData = {
        initialDate: moment(drp.startDate).format('DD/MM/YYYY HH:mm:ss'), 
        finalDate: moment(drp.endDate).format('DD/MM/YYYY HH:mm:ss')
    };

    $.ajax({
        type: "POST",
        url: "/getInterval",
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(timePickerData),
        async: true,
        timeout: 10000,
        
        success: function (samples) {

            console.log('Ajax success: ' + samples);  

            //CreateMarkers(samples);
            //CreateHeatMap(samples);
        },
        error: function(result) {
            console.log('Ajax error: ' + result);  
        }
    });               
}