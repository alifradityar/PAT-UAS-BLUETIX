var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer'); 

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

var cradle = require('cradle');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(allowCrossDomain);

// RESERVATION PROVIDER

ReservationProvider = function() {
  this.connection= new (cradle.Connection)('127.0.0.1:5984');
  this.db = this.connection.database('blutix');
  this.db.create(function(err){
    /* do something if there's an error */
    console.log('error',err);
  });
};

ReservationProvider.prototype.exist = function(callback) {
    this.db.exists(function (err, exists) {
    if (err) {
      console.log('rata');
      console.log('error', err);
    } else if (exists) {
      console.log('the force is with you.');
    } else {
      console.log('database does not exists.');
    }
  });
};

ReservationProvider.prototype.findAll = function(callback) {
    this.db.view('reservation/all',function(error, result) {
      console.log('sonny');
      console.log(result);
      if( error ){
        callback(error)
      }else{
        console.log(result);
        var docs = [];
        result.forEach(function (row){
          docs.push(row);
        });
        callback(null, docs);
      }
    });
};

ReservationProvider.prototype.findById = function(id, callback) {
    this.db.get(id, function(error, result) {
        if( error ) callback(error)
        else callback(null, result)
      });
};

ReservationProvider.prototype.save = function(reservations, callback) {
    var db = this.db;
    if( typeof(reservations.length)=="undefined")
      reservations = [reservations];

    for( var i =0;i< reservations.length;i++ ) {
      reservation = reservations[i];
    }
    
    this.db.save('', reservations, function(error, result) {
      if( error ) callback(error)
      else {
        db.save('_design/reservation', {
          all: {
            map: function (doc) {
              emit(doc.name, doc);
            }
          }
        });
        callback(null, reservations)
      };
    });
};

var reservationProvider= new ReservationProvider(); 

// SCHEDULE PROVIDER

ScheduleProvider = function() {
  this.connection= new (cradle.Connection)('127.0.0.1:5984');
  this.db = this.connection.database('flight');
  this.db.create(function(err){
    /* do something if there's an error */
    console.log('error',err);
  });
};

ScheduleProvider.prototype.findAll = function(callback) {
    this.db.view('flight/all',function(error, result) {
      if( error ){
        callback(error)
      }else{
        console.log(result);
        var docs = [];
        result.forEach(function (row){
          docs.push(row);
        });
        callback(null, docs);
      }
    });
};

ScheduleProvider.prototype.findById = function(id, callback) {
    this.db.get(id, function(error, result) {
        if( error ) callback(error)
        else callback(null, result)
      });
};

ScheduleProvider.prototype.save = function(flights, callback) {
    var db = this.db;
    if( typeof(flights.length)=="undefined")
      flights = [flights];

    for( var i =0;i< flights.length;i++ ) {
      flight = flights[i];
    }
    
    this.db.save(flights, function(error, result) {
      if( error ) callback(error)
      else {
        db.save('_design/flight', {
          all: {
            map: function (doc) {
              emit(doc.name, doc);
            }
          }
        });
        callback(null, flights)
      };
    });
};

var scheduleProvider = new ScheduleProvider();

// ENDPOINT

app.get('/', function(req, res) {
    var out = {
        name: 'BluTix',
        version: 'Alpha 1',
        author: 'Alif Raditya Rochman',
    };
    res.json(out);
});

app.get('/schedule/init', function(req, res) {

    var schedules = [
        {
            id_penerbangan: 'GA1213',
            id_pesawat: 'BO7234',
            keberangkatan: 'CGK',
            kedatangan: 'BTJ',
            harga: 'Rp 824.000',
            maskapai: 'Garuda Indonesia',
            kelas: 'Ekonomi',
            kapasitas: '400',
            tgl_berangkat: '23/12/2014',
            wkt_berangkat: '08.00',
            wkt_sampai: '10.00'
        },
        {
            id_penerbangan: 'LA1213',
            id_pesawat: 'BO4523',
            keberangkatan: 'CGK',
            kedatangan: 'BTJ',
            harga: 'Rp 424.000',
            maskapai: 'Lion Air',
            kelas: 'Ekonomi',
            kapasitas: '400',
            tgl_berangkat: '23/12/2014',
            wkt_berangkat: '12.00',
            wkt_sampai: '14.00'
        },
        {
            id_penerbangan: 'GA1214',
            id_pesawat: 'BO8951',
            keberangkatan: 'CGK',
            kedatangan: 'BDO',
            harga: 'Rp 758.000',
            maskapai: 'Garuda Indonesia',
            kelas: 'Ekonomi',
            kapasitas: '400',
            tgl_berangkat: '23/12/2014',
            wkt_berangkat: '09.00',
            wkt_sampai: '10.30'
        },
        {
            id_penerbangan: 'SA1214',
            id_pesawat: 'BO7436',
            keberangkatan: 'CGK',
            kedatangan: 'BDO',
            harga: 'Rp 372.000',
            maskapai: 'Sriwijaya Air',
            kelas: 'Ekonomi',
            kapasitas: '400',
            tgl_berangkat: '23/12/2014',
            wkt_berangkat: '21.00',
            wkt_sampai: '22.30'
        },
        {
            id_penerbangan: 'SA1217',
            id_pesawat: 'BO7436',
            keberangkatan: 'CGK',
            kedatangan: 'SOC',
            harga: 'Rp 552.000',
            maskapai: 'Sriwijaya Air',
            kelas: 'Ekonomi',
            kapasitas: '400',
            tgl_berangkat: '23/12/2014',
            wkt_berangkat: '20.00',
            wkt_sampai: '22.00'
        },
        {
            id_penerbangan: 'LA1218',
            id_pesawat: 'BO7436',
            keberangkatan: 'CGK',
            kedatangan: 'DPS',
            harga: 'Rp 776.000',
            maskapai: 'Lion Air',
            kelas: 'Ekonomi',
            kapasitas: '400',
            tgl_berangkat: '23/12/2014',
            wkt_berangkat: '21.00',
            wkt_sampai: '23.30'
        }
    ];
    scheduleProvider.save(schedules, function(err, docs) {
        res.json(docs);
    });
});

app.get('/schedule/all', function(req, res){
    scheduleProvider.findAll(function(error, docs){
        console.log(error);
        setTimeout(function() {
            res.json(docs);    
        }, 2000);
    });
});

app.post('/schedule/find', function(req, res){
    scheduleProvider.findAll(function(error, docs){
        console.log(error);
        var data = req.body;
        var docsResult = [];
        for (var i=0;i<docs.length;i++){
            if (docs[i].keberangkatan == data.keberangkatan && docs[i].kedatangan == data.kedatangan && docs[i].tgl_berangkat == data.tgl_berangkat) {
                docsResult.push(docs[i]);
            }
        }
        setTimeout(function() {
            res.json(docsResult);    
        }, 2000);
    });
});

app.post('/schedule/id', function(req, res){
    scheduleProvider.findAll(function(error, docs){
        console.log(error);
        var data = req.body;
        var docsResult = [];
        for (var i=0;i<docs.length;i++){
            if (docs[i].id_penerbangan == data.id_penerbangan) {
                docsResult.push(docs[i]);
            }
        }
        setTimeout(function() {
            res.json(docsResult);    
        }, 2000);
    });
});

app.get('/schedule/clear', function(req, res) 
    scheduleProvider.delete(function(err, docs) {
        res.json(docs);
    });
});

app.get('/bandara/all', function(req, res){
    var out = {
        bandara: [
            {
                kode: 'BTJ',
                name: 'Sultan Iskandar Muda'
            },
            {
                kode: 'BDO',
                name: 'Husein Sastranegara'
            },
            {
                kode: 'CGK',
                name: 'Soekarno-Hatta'
            },
            {
                kode: 'SOC',
                name: 'Adisumarmo'
            },
            {
                kode: 'DPS',
                name: 'Ngurah Rai'
            }
        ]
    };
    res.json(out);
});

app.post('/reservation/new', function(req,res){
    var data = req.body;
     reservationProvider.save(data, function(error, docs) {
        res.json(docs);
    });
});

app.get('/reservation/all', function(req, res) {
    reservationProvider.findAll(function(error, docs){
        res.json(docs);    
    });
});

app.post('/reservation/find', function(req, res){
    reservationProvider.findAll(function(error, docs){
        console.log(error);
        var data = req.body;
        var docsResult = [];
        for (var i=0;i<docs.length;i++){
            if (docs[i].id_penerbangan == data.id_penerbangan && docs[i].email == data.email) {
                docsResult.push(docs[i]);
            }
        }
        res.json(docsResult); 
    });
});

app.get('/reservation/exist', function(req, res) {
    reservationProvider.exist(function(error, docs){
        
    });
});


app.listen(3000);

