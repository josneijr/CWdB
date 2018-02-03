//startDate: data/hora iniciais
//endDate: data/hora finais
//return: array contendo os samples encontrados (vazio caso não encontre nada)
var GetServerSamples = function(startDate, endDate, limiardB) {
    
    return new Promise(function(resolve, reject) {
        
        var timePickerData = {
            initialDate: moment(startDate).format('DD/MM/YYYY HH:mm:ss'), 
            finalDate: moment(endDate).format('DD/MM/YYYY HH:mm:ss'),
            limiardB: limiardB
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
                resolve(samples);
            },
            error: function(error) {
                reject(Error("Erro ao solicitar amostras!"));
            }
        });
    });
}

var GetServerRegion = function(startTime, finalTime, latMin, latMax, lngMin, lngMax) {
            
    return new Promise(function(resolve, reject) {
        
        var sampleData = {
            startTime: startTime,
            finalTime: finalTime,
            latMin: latMin,
            latMax: latMax,
            lngMin: lngMin,
            lngMax: lngMax
        };

        $.ajax({
            type: "POST",
            url: "/getRegion",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(sampleData),
            async: true,
            timeout: 10000,
            
            success: function (samples) {
                resolve(samples);
            },
            error: function(error) {
                reject(Error("Erro ao solicitar amostras!"));
            }
        });
    });
}