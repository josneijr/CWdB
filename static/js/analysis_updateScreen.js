function RefreshPage(){
    //Mostrar a tela de carregamento
    $('#loading').show();

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
            //Imprime a quantidade de samples encontrada no intervalo solicitado
            $('#totalSamples').html(samples.length.toString());

            console.log('Achei esses: ');
            console.log(samples);

            var belowLimiar = samples.filter(x => x.amplitude<dbLimiar);
            var overLimiar = samples.filter(x => x.amplitude>=dbLimiar);            

            $('#lowerThanVal').html(belowLimiar.length.toString());
            $('#greaterThanVal').html(overLimiar.length.toString());  
            
            if(samples.length !== 0){
                $('#progressbarLower').width(100*(belowLimiar.length/samples.length) + '%');
                $('#progressbarGreater').width(100*(overLimiar.length/samples.length) + '%');
            }
            else{
                $('#progressbarLower').width(0);
                $('#progressbarGreater').width(0);
            }

            //UpdateGraph(samples);

            //Apaga a tela de carregamento
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