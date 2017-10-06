var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');
var sha1 = require('sha1');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
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

app.post("/sentiment", function (req, res) {
	console.log("REQUEST: sentiment");
	console.log( req.body );
	res.type('json');

	var ret = {};
	var contenthash = sha1(req.body.content);
	console.log(contenthash);
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
				con.query("INSERT INTO email (hash, details, account_type, sentiment, source_browser) VALUES (?) ",[[contenthash, req.body.content, req.body.account_type, sentimentValue, req.body.source_browser]], function(err, result) {
					if (err) {
						console.log(err);
					} else {
						console.log(result);
					}
				});
			} else {
				sentimentValue = result[0].sentiment
			}
			
			ret["sentiment"] = sentimentValue;
			ret["code"] = 200;
			console.log(result);
			res.end( JSON.stringify(ret) );
		}
	});
})




function calculateSentiment(content) {
	return 'neutral';
}


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
