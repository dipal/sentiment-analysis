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
			var mail_header = outlook.dom.get_mail_header(mail);
			console.log('===>> mail header', mail_header);
			
			var mail_content = outlook.dom.get_mail_content_container(mail);
			if (typeof mail_content === "undefined") {
				return ;
			}
			console.log(mail_content.innerText);
			var hash = hashCode(mail_content.innerText);
			console.log(hash);
			var color = "";
			if (hash%3 === 0) {
				color = "black";
			} else if (hash%3 === 1) {
				color = "red";
			} else {
				color = "green";
			}
			console.log("color", color);
			mail_header.setAttribute("style", "color:" + color);
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
