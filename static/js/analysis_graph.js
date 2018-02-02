var chart = null;   

var options = {};

function InitializeGraph(){
    var ctx = document.getElementById("myChart").getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3]
            }]
        },
        options: options
    });
}

function UpdateGraph(samples){
    if(samples.length>=0)
    {
        var formatedSamples = [];

        samples.forEach(element => {
            var obj = {
                x: element.data,
                y: element.amplitude
            };

            formatedSamples.push(obj);
        });

        var startDate = moment(formatedSamples[0].x, 'YYYY-MM-DDTHH:mm:ss').toDate();
        var endDate = moment(formatedSamples[formatedSamples.length-1].x, 'YYYY-MM-DDTHH:mm:ss').toDate();

        graph2d.setItems(formatedSamples);
        
    }
}     