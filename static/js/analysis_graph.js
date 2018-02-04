var chartObj = null;  

var data = {
    datasets: [{
        label: 'Timeline',
        data: [],
        backgroundColor: '#A4458C'    
    }]
};

var options = {
    
    fill: false,
    responsive: true,
    maintainAspectRatio: false,
    elements: {
        line: {
            tension: 0, // disables bezier curves
        }
    },
    pan: {
        enabled: true,
        mode: 'x',
     },    
     zoom: {
        enabled: true,
        mode: 'x',
    },     
    legend: {
        display: false
    },
    title: {
        display: false
    },
    scales: {
        xAxes: [{
            type: 'time',
            display: true,
            scaleLabel: {
                display: true,
                labelString: "Data/Hora",
            }
        }],

        yAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: "dB",
            }
        }]
    }
};

function InitializeGraph(){
    var ctx = document.getElementById("myChart").getContext('2d');

    chartObj = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

function UpdateGraph(samples){
    if(samples.length==0){
        return;
    }

    var formatedSamples = [];

    console.log("Aqui ok");
    console.log(samples);

    samples.forEach(s => {
        var obj = {
            x: moment(s.data, 'YYYY-MM-DDTHH:mm:SS.000Z'),
            y: s.amplitude
        };

        formatedSamples.push(obj);
    });

    console.log("Aqui ok 2");
    console.log(formatedSamples);

    //var startDate = moment(formatedSamples[0].x, 'YYYY-MM-DDTHH:mm:ss').toDate();
    //var endDate = moment(formatedSamples[formatedSamples.length-1].x, 'YYYY-MM-DDTHH:mm:ss').toDate();

    addData(chartObj, formatedSamples);
}     

function addData(chart, data) {
    chartObj.data.datasets[0].data = data;

    chartObj.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}