// load express
var express = require('express');
var favicon = require('serve-favicon')
var moment = require('moment');
var path = require('path')
var bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var app = express();
// Or you can simply use a connection uri
const sequelize = new Sequelize('d1kh27c8o2l0fs', 'otnvrlqgbycpkc', 'de77ec57a12623f410456b9f049e71c974c15a81197ceef08067e777ddbe8bcf', {
    host: 'ec2-107-21-224-61.compute-1.amazonaws.com',
    port: 5432,
    dialect: 'postgres',

    dialectOptions: {
        ssl: true
      },

    pool: {
      max: 14,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
});


const Sample = sequelize.define('sample', {
    data: {
      type: Sequelize.DATE
    },
    latitude: {
      type: Sequelize.FLOAT
    },
    longitude: {
        type: Sequelize.FLOAT
      },
    amplitude: {
        type: Sequelize.FLOAT
    }
});  

sequelize
  .authenticate()
  .then(() => {
    console.log('DB: Connection has been established successfully.');
  })
  .catch(err => {
    console.error('DB: Unable to connect to the database:', err);
  });

app.use(favicon(__dirname + '/public/favicon.ico'));

// set the view engine to ejs
app.set('view engine', 'ejs');

// set resources dirs
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/static/css'));
app.use(express.static(__dirname + '/static/js'));

// to support JSON-encoded bodies
app.use(bodyParser.json());       

// index page (whenever we enter without a second URL)
app.get('/', function (req, res) {
    res.render('index');
});

app.get('/analysis', (req, res) => {
    res.render('analysis');
});

app.get('/about', (req, res) => {
    res.render('about');
});

// start server, using either the heroku given port or the 3000, for local debugging
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port ' + listener.address().port);
});

//Pegar dados em um intervalo de data/hora
app.post('/getInterval', function(req, res){

    var attributes = ['initialDate', 'finalDate', 'limiardB'];

    if(!CheckNewDataAttribute(attributes, req.body)){
        res.error('{"message": "bad_data"}');
        return;
    }
    else{
        console.log('New date range request! From ' + 
                    req.body.initialDate.toLocaleString() + 
                    ' until ' + 
                    req.body.finalDate.toLocaleString());                    
        console.log();
    }

    var initialDate = moment(req.body.initialDate, 'DD/MM/YYYY HH:mm:ss').toDate();
    var endDate = moment(req.body.finalDate, 'DD/MM/YYYY HH:mm:ss').toDate();
    var limiardB = req.body.limiardB;

    Sample.findAll({ 
        where: {
            data:{
                [Op.gte]: initialDate,
                [Op.lte]: endDate
            },
            amplitude:{
                [Op.gte]: limiardB
            }
        } 
        })
        .then(response => {
            console.log("Samples encontrados!");
            console.log("Total: " + response.length);

            res.json(response.map(t => t.get()));
        })
        .catch(
            res.json("Erro:1")
        )
    
    return;
});

//Pegar dados em um intervalo de data/hora
app.post('/getRegion', function(req, res){

    var attributes = ['startTime', 'finalTime', 'latMin', 'latMax', 'lngMin', 'latMax'];

    if(!CheckNewDataAttribute(attributes, req.body)){
        res.error('{"message": "bad_data"}');
        return;
    }
    else{
        console.log('New region request! On LATITUDES ' +
                    req.body.latMin + '/' + req.body.latMax + 
                    ' and LONGITUDES '+
                    req.body.lngMin + '/' + req.body.lngMax + 
                    ' between dates ' +
                    req.body.startTime + ' / ' + req.body.finalTime);                    
        console.log();
    }

    var startTime = req.body.startTime;
    var finalTime = req.body.finalTime;
    var latMin = req.body.latitude;
    var latMax = req.body.longitude;
    var lngMin = req.body.latitude;
    var lngMax = req.body.longitude;    

    Sample.findAll({ 
        where: {
            data:{
                [Op.gte]: startTime,
                [Op.lte]: finalTime
            },
            latitude:{
                [Op.gte]: latMin,
                [Op.lte]: latMax,
            },
            longitude:{
                [Op.gte]: lngMin,
                [Op.lte]: lngMax,
            }
        } 
        })
        .then(response => {
            res.json(response.map(t => t.get()));
        })
        .catch({
        })
});

//Middleware para receber os dados do hardware
app.post('/receiveData', function(req, res){

    //Os dados vem em formato JSON, portanto, podemos usar os componentes direto!
    console.log('New data arrived at ' + new Date().toLocaleString());

    var samples = req.body;

    console.log('Number of arrived samples: ' + samples.length);

    samples.forEach(function(sample){
        //Checar se todas as propriedades estão no lugar
        var attributes = ['timestamp', 'lat', 'long', 'value'];

        if(!CheckNewDataAttribute(attributes, sample)){
            return;
        }
        else{
            console.log('ts: ' + sample.timestamp);
            console.log('lat/long: ' + sample.lat + '/' + sample.long);
            console.log('value: ' + sample.value);
        }

        var dt = moment(sample.timestamp, ).toDate();

        dt.setHours(dt.getHours-2);

        //Save in DB
        Sample.sync({force: false}).then(() => {
            // Table created
            Sample.create({
                data: moment(sample.timestamp, 'MM/DD/YYYY HH:mm:ss').toDate(),
                latitude: sample.lat,
                longitude: sample.long,
                amplitude: sample.value
            });
        });
    });

    res.send('ok');
    return;
});

const CheckNewDataAttribute = (attributesNames, obj) => attributesNames.map(t => { 
    var b = obj.hasOwnProperty(t);
    if (!b)
        console.log('Missing parameter: ' + t);
    return b;
}).reduce((a,b) => a && b);

app.get('*', (req, res) => {
    if (req.accepts('html')) {
        // Respond with html page.
        res.render('404');
    }
    else if (req.accepts('json')) {
        // Respond with json.
        res.status(404).send({ error: 'Not found' });
    }
    else {
        // Default to plain-text. send()
        res.status(404).type('txt').send('Not found');
    }
});
