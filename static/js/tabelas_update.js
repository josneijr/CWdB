var samples = [];

function UpdateTables(){
    //Mostrar a tela de carregamento
    $('#loading').show();

    //Pegamos o componente do dateRange
    var drp = $('#daterange').data('daterangepicker');

    //Pegamos o limiar de db escolhido
    var dbLimiar = $('#slider_dB').slider('getValue');

    //Escrevemos o limiar nos labels correspondentes na página
    $('#sliderValue').html(dbLimiar + "dB");    
    $('#lowerThanDB').html('Pontos abaixo de ' + dbLimiar + "dB");    
    $('#greaterThanDB').html('Pontos acima de ' + dbLimiar + "dB");      

    //Vamos pedir para o server nos mandar os samples no intervalo escolhido
    GetServerSamples(drp.startDate, drp.endDate)
        //Caso tudo tenha dado certo ao pegar os samples
        .then(function(samples){
            //Imprime a quantidade de samples encontrada no intervalo solicitado
            $('#totalSamples').html(samples.length.toString());

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