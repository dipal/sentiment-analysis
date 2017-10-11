var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');
var sha1 = require('sha1');
var Client = require('node-rest-client').Client;
var client = new Client();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var con = mysql.createConnection({
  host: "localhost",
  user: "sentiment",
  password: "sentiment",
  database: "sentiment"
});


con.connect(function(err) {
	if (err) {
		console.log(err);
	} else {
		console.log("Connected!");
	}
});

var sslOptions = {
	key: fs.readFileSync('/etc/letsencrypt/live/d.hirebd.com/privkey.pem'),
  	cert: fs.readFileSync('/etc/letsencrypt/live/d.hirebd.com/cert.pem'),
  	ca: fs.readFileSync('/etc/letsencrypt/live/d.hirebd.com/chain.pem')
};


data = {
   "user1" : {
      "name" : "mahesh",
      "password" : "password1",
      "profession" : "teacher",
      "id": 1
   },
   "user2" : {
      "name" : "suresh",
      "password" : "password2",
      "profession" : "librarian",
      "id": 2
   },
   "user3" : {
      "name" : "ramesh",
      "password" : "password3",
      "profession" : "clerk",
      "id": 3
   }
}



retrieveSentiment = function(content, onSentimentReceived) {
    var args = {
            data: content,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
    };
    client.post("http://d.hirebd.com:9000/?properties={%22annotators%22:%22sentiment%22,%22outputFormat%22:%22json%22}", args, function (data, response) {
        onSentimentReceived(data, response);
    });
}

calculateSentiment = function (content, onSentimentCalculated) {
    retrieveSentiment(content, function(response) {
        console.log(response);
        onSentimentCalculated('neutral'):
    });
}



app.get('/checkdb', function (req, res) {
	console.log( "REQUEST: checkdb" );
	res.type('json');

	con.query("SELECT 1", function (err, result, fields) {
		if (err) {
			console.log(err);
			res.end(JSON.stringify({"code":500}));
		} else {
			console.log("DB OK");
			res.end(JSON.stringify({"code":200}));
		}
	});
})

app.get('/', function (req, res) {
	console.log( "REQUEST: index");
	res.type('html');
	res.end( "It Works. Sentiment Server. Please contact at dipal.soul@gmail.com for details API support." );
})

app.post('/test', function (req, res) {
	console.log( "REQUEST: test" );
	res.type('json');

	console.log( req.body );
	res.end(JSON.stringify({"code":200}));
})


app.post('/testsentiment', function (req, res) {
	console.log( "REQUEST: testsentiment" );
	res.type('json');

    var args = {
            data: req.body,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
    };
    console.log(req.body);
    client.post("http://d.hirebd.com:9000/?properties={%22annotators%22:%22sentiment%22,%22outputFormat%22:%22json%22}", args, function (data, response) {
        console.log(data);
        //console.log(response);
        console.log('got stanford nlp data');
	    res.end(JSON.stringify({"code":200, "data":data}));
    });
})



app.post("/sentiment", function (req, res) {
	console.log("REQUEST: sentiment");
	console.log( req.body );
	res.type('json');

	var ret = {};
	var contenthash = sha1(req.body.content);
	console.log(contenthash);
	calculateSentiment(req.body.content);
	con.query("SELECT hash, sentiment from email where hash = ?", [contenthash], function(err, result, fields) {
		if (err) {
			console.log(err);
			ret["code"] = 500;
			ret["reason"] = "DB error";
			res.end( JSON.stringify(ret) );
		} else {
			var sentimentValue = 0;
			if (result.length == 0) {
				sentimentValue = calculateSentiment(req.body.content);
				con.query("INSERT INTO email (hash, content, account_type, sentiment, source_browser, email_id, email_from, email_to, email_datetime) VALUES (?) ",[[contenthash, req.body.content, req.body.account_type, sentimentValue, req.body.source_browser, req.body.id, req.body.from, req.body.to, req.body.datetime]], function(err, result) {
					if (err) {
						console.log(err);
					} else {
						console.log(result);
					}
				});
			} else {
				con.query("UPDATE email set query_times = query_times + 1 WHERE hash = ?", [contenthash], function(err, result) {
                });
			}
			
			ret["sentiment"] = sentimentValue;
			ret["code"] = 200;
			console.log(result);
			res.end( JSON.stringify(ret) );
		}
	});
})





var server = https.createServer(sslOptions, app).listen(8921, function() {
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at https://%s:%s", host, port)

});

/*
var server = app.listen(8921, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
*/
