window.onload = 
function PageInitialSet(){
    //Inicia o gráfico, ainda vazio
    InitializeGraph();            
    
    var startDate = new Date();

    startDate.setHours(startDate.getHours() - 24);

    $('#minDbSlider').slider({
        id: "sliderDB",
        formatter: function(value) {
        }
    });   

    $('#radiusSlider').slider({
        formatter: function(value) {
        }
    });     

    $('#daterange').daterangepicker({
        timePicker: true,
        timePicker24Hour: true,
        timePickerIncrement: 1,
        startDate: startDate,
        endDate: new Date(),
        locale: {
            format: 'DD/MM/YYYY HH:mm'
        }
    }); 

    //Update page info
    OnApply();                
}

function OnApply(){

    //Mostrar a tela de carregamento
    $('#loading').show();

    try{
        //Pegamos o componente do dateRange
        var drp = $('#daterange').data('daterangepicker');

        //Pegamos o limiar de db escolhido
        var dbLimiar = $('#minDbSlider').slider('getValue');

        //Escrevemos o limiar nos labels correspondentes na página
        $('#minDbLabel').html(dbLimiar + " dB");    
        $('#lowerThanDB').html('Pontos abaixo de ' + dbLimiar + "dB");    
        $('#greaterThanDB').html('Pontos acima de ' + dbLimiar + "dB");      

        //Pegamos o raio escolhido
        var radius = $('#radiusSlider').slider('getValue');

        //Setamos no label
        $('#radiusLabel').html(radius + " m");    

        //Setamos no mapa
        SetMapRadius(radius);

        //Pegamos a posição atual no mapa
        var latMin = 0;
        var latMax = 0;
        var lngMin = 0;
        var lngMax = 0;

        if(reffCircle.getBounds().getNorthEast().lat() < reffCircle.getBounds().getSouthWest().lat()){
            latMin = reffCircle.getBounds().getNorthEast().lat();
            latMax = reffCircle.getBounds().getSouthWest().lat();
        }
        else{
            latMin = reffCircle.getBounds().getSouthWest().lat();
            latMax = reffCircle.getBounds().getNorthEast().lat();        
        }

        if(reffCircle.getBounds().getNorthEast().lng() < reffCircle.getBounds().getSouthWest().lng()){
            lngMin = reffCircle.getBounds().getNorthEast().lng();
            lngMax = reffCircle.getBounds().getSouthWest().lng();
        }
        else{
            lngMin = reffCircle.getBounds().getSouthWest().lng();
            lngMax = reffCircle.getBounds().getNorthEast().lng();        
        }    

        //Vamos pedir para o server nos mandar os samples no intervalo escolhido
        GetServerRegion(drp.startDate, drp.endDate, latMin, latMax, lngMin, lngMax)
            //Caso tudo tenha dado certo ao pegar os samples
            .then(function(samples){
                //Evita os valores NaN
                samples = samples.filter(t => t.amplitude!=null);

                //Filtra pra ver quais REALMENTE estão no círculo
                var samplesInside = FilterInsideRegion(samples);
                var samplesOutside = FilterOutsideRegion(samples);

                var belowLimiar = samplesInside.filter(x => x.amplitude<dbLimiar);
                var overLimiar = samplesInside.filter(x => x.amplitude>=dbLimiar);            

                $('#lowerThanVal').html(belowLimiar.length.toString());
                $('#greaterThanVal').html(overLimiar.length.toString());  
                
                //Imprime a quantidade de samples encontrada no intervalo solicitado
                $('#totalSamples').html(samplesInside.length.toString());

                if(samplesInside.length !== 0){
                    $('#progressbarLower').width(100*(belowLimiar.length/samplesInside.length) + '%');
                    $('#progressbarGreater').width(100*(overLimiar.length/samplesInside.length) + '%');
                }
                else{
                    $('#progressbarLower').width(0);
                    $('#progressbarGreater').width(0);
                }

                //Imprime em tela os samples que estão dentro da região
                PrintRegionMarkers(belowLimiar, overLimiar);

                //Imprime os dados no gráfico
                UpdateGraph(belowLimiar);

                //Esconde a tela de carregamento
                $('#loading').hide();                
            })
            //Caso algo tenha dado errado
            .catch(function(errorMsg){
                //Loga o erro no console
                console.log(errorMsg);

                //Esconde a tela de carregamento
                $('#loading').hide();                
            })    
    }
    catch(e){
        //Esconde a tela de carregamento
        $('#loading').hide();
    }
}