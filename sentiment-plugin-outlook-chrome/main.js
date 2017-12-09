var outlook;


function refresh(f) {
	console.log('refresh');
  	if( (/in/.test(document.readyState)) || (typeof Outlook === undefined) ) {
    	setTimeout('refresh(' + f + ')', 1000);
  	} else {
    	f();
  	}
}

hashCode = function(str) {
  var hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};


var mail_hash_map = [];
var get_local_sentiment = function(mail_content) {
	var hash = hashCode(mail_content);
	if (typeof mail_hash_map[hash] === "undefined") {
		return undefined;
	}

	return mail_hash_map[hash];
}

var set_local_sentiment = function(mail_content, sentiment) {
	var hash = hashCode(mail_content);
	return mail_hash_map[hash] = sentiment;
}


handle_sentiment_result = function(mail, sentiment) {
	var mail_header = outlook.dom.get_mail_header(mail);
	console.log('===>> handle_sentiment_result sentiment', mail, sentiment);
	
	var color = "";
	if (sentiment === 'very_negative') {
		color = "red";
	} else if (sentiment === 'negative') {
		color = "red";
	} else if (sentiment === 'neutral') {
		color = "black";
	} else if (sentiment === 'positive') {
		color = "green";
	} else if (sentiment === 'very_positive') {
		color = "green";
	}
	console.log("color", color);
	mail_header.setAttribute("style", "color:" + color);
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

  	console.log('===>> Hello,', outlook.get.user_email());
  	outlook.observe.on_load(function() {
		console.log('===>> outlook loaded');
		var args = {
			email: outlook.get.user_email()
		}
		$.post( "https://sentiment.ehelpbd.org:8921/loadsettings", args, function( retData ) {
			
		});

		outlook.observe.on_email_selected(function(mail) {
			console.log('===>> in main proccess sentiment', mail);
			
			var mail_content = outlook.dom.get_mail_content_container(mail);
			if (typeof mail_content === "undefined") {
				return ;
			}

			var mail_content_text = mail_content.innerText;
			var local_result = get_local_sentiment(mail_content_text);
			if (typeof local_result !== "undefined") {
				console.log("===>> local_result ", local_result)
				handle_sentiment_result(mail, local_result);
				return ;
			}

			var data = {};

			data.content = mail_content_text;
			data.datetime = '';

			data.id = '';

			data.from = '';
			data.to = '';
			
			data.account_type = 'outlook';
			data.source_browser = 'chrome';


			$.post( "https://sentiment.ehelpbd.org:8921/sentiment", data, function( retData ) {
			    if (retData.code==200) {
			    	console.log("===>> post result", retData.sentiment);
			    	set_local_sentiment(mail_content_text, retData.sentiment);
			    	handle_sentiment_result(mail, retData.sentiment);
			    }
			});
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
