// load express
var express = require('express');
var favicon = require('serve-favicon')
var moment = require('moment');
var path = require('path')
var bodyParser = require('body-parser');
const Sequelize = require('sequelize');

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
      max: 5,
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

app.get('/tabelas', (req, res) => {
    res.render('tabelas');
});

app.get('/sobre', (req, res) => {
    res.render('sobre');
});

// start server, using either the heroku given port or the 3000, for local debugging
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port ' + listener.address().port);
});

//Pegar dados em um intervalo
app.post('/getInterval', function(req, res){

    console.log('New date request: ' + Object.keys(req.body));

    if(req.body.initialDate == null)
    {
        res.send('Missing initial date');    
    }

    if(req.body.finalDate == null)
    {
        res.send('Missing final date');    
    }

    var initialDate = moment(req.body.initialDate, 'DD/MM/YYYY HH:mm:ss').toDate();
    var endDate = moment(req.body.finalDate, 'DD/MM/YYYY HH:mm:ss').toDate();

    console.log('New date request: ' + initialDate.toLocaleString() + ' to ' + endDate.toLocaleString());

    res.send('ok');
});

//Middleware
app.post('/receiveData', function(req, res){

    //Os dados vem em formato JSON, portanto, podemos usar os componentes direto!
    console.log('New data arrived at ' + new Date().toLocaleString());
    
    //Checar se todas as propriedades estão no lugar
    var attributes = ['timestamp', 'lat', 'long', 'value'];

    if(!CheckNewDataAttribute(attributes, req.body)){
        res.send('bad_data');
        return;
    }
    else{
        res.send('ok');
        console.log('ts: ' + req.body.timestamp);
        console.log('lat/long: ' + req.body.lat + '/' + req.body.long);
        console.log('value: ' + req.body.value);
    }

    //Save in DB
    Sample.sync({force: false}).then(() => {
        // Table created
        Sample.create({
            data: moment(req.body.timestamp, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
            latitude: req.body.lat,
            longitude: req.body.long,
            amplitude: req.body.value
        });
    });
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
