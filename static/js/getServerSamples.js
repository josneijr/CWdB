//startDate: data/hora iniciais
//endDate: data/hora finais
//return: array contendo os samples encontrados (vazio caso não encontre nada)
var GetServerSamples = function(startDate, endDate) {
            
    return new Promise(function(resolve, reject) {
        
        var timePickerData = {
            initialDate: moment(startDate).format('DD/MM/YYYY HH:mm:ss'), 
            finalDate: moment(endDate).format('DD/MM/YYYY HH:mm:ss')
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

var GetServerTimeline = function(latitude, longitude, radius) {
            
    return new Promise(function(resolve, reject) {
        
        var sampleData = {
            latitude: latitude,
            longitude: longitude,
            radius: radius
        };

        $.ajax({
            type: "POST",
            url: "/getTimeline",
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