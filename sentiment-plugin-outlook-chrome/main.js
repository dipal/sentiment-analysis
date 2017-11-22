var outlook;


function refresh(f) {
	console.log('refresh');
  	if( (/in/.test(document.readyState)) || (typeof Outlook === undefined) ) {
    	setTimeout('refresh(' + f + ')', 1000);
  	} else {
    	f();
  	}
}

var main = function(){
  	// NOTE: Always use the latest version of gmail.js from
  	// https://github.com/KartikTalwar/gmail.js
  	console.log('main');
  	try {
  		outlook = new Outlook();
  	} catch (err) {
  		setTimeout('refresh(' + main + ')', 1000);
  		console.log(err);
  		return ;
  	}

  	console.log('Hello,', outlook.get.user_email());
  	outlook.observe.on_load(function() {
		console.log('outlook loaded');
		var args = {
			email: outlook.get.user_email()
		}
		$.post( "https://d.hirebd.com:8921/loadsettings", args, function( retData ) {
			
		});
		
	// 	gmail.observe.on('view_email', function(email) {
	// 		console.log('individual email opened', email);  // gmail.dom.email object
	// 		var emailData = email.data();
	// 		var data = {};

	// 		data.content = extractPrimaryMailContent(emailData.content_plain);
	// 		data.datetime = emailData.datetime;

	// 		data.id = email.id;

	// 		data.from = email.from().name + " <" + email.from().email + ">";
	// 		data.to = "";
	// 		var to = email.to();
	// 		var tolen = to.length;
	// 		for (t=0; t<tolen; t++) {
	// 			data.to = data.to + to[t].name + " <" + to[t].email + ">";
	// 		}

	// 		data.account_type = 'gmail';
	// 		data.source_browser = 'chrome';

	// 		console.log(data);
	// 		$.post( "https://d.hirebd.com:8921/sentiment", data, function( retData ) {
	// 			    if (retData.code==200) {
	// 			    	var color = "";
	// 			    	if (retData.sentiment == 'very_negative') {
	// 			    		color = "red";
	// 			    	} else if (retData.sentiment == 'negative') {
	// 			    		color = "red";
	// 			    	} else if (retData.sentiment == 'neutral') {
	// 			    		color = "black";
	// 			    	} else if (retData.sentiment == 'positive') {
	// 			    		color = "green";
	// 			    	} else if (retData.sentiment == 'very_positive') {
	// 			    		color = "green";
	// 			    	}

	// 			    	email.from(email.from().email, "<font color='" + color + "'>" + email.from().name + "</font>");
	// 			    }
	// 		});
	// 	});
	// });
	});
}


refresh(main);
