var gmail;


function refresh(f) {
  	if( (/in/.test(document.readyState)) || (typeof Gmail === undefined) ) {
    	setTimeout('refresh(' + f + ')', 10);
  	} else {
    	f();
  	}
}


var main = function(){
  	// NOTE: Always use the latest version of gmail.js from
  	// https://github.com/KartikTalwar/gmail.js
  	gmail = new Gmail();
  	console.log('Hello,', gmail.get.user_email());
  	gmail.observe.on('load', function() {
		console.log('gmail loaded');
		gmail.observe.on("http_event", function(params) {
				  console.log("http_event url data:", params);
		})

		gmail.observe.on("unread", function(id, url, body, xhr) {
				  console.log("unread id:", id, "url:", url, 'body', body, 'xhr', xhr);
		})

		gmail.observe.on("read", function(id, url, body, xhr) {
				  console.log("read id:", id, "url:", url, 'body', body, 'xhr', xhr);
		})

		gmail.observe.on("delete", function(id, url, body, xhr) {
				  console.log("delete id:", id, "url:", url, 'body', body, 'xhr', xhr);
		})

		gmail.observe.on("mark_as_spam", function(id, url, body, xhr) {
				  console.log("mark_as_spam id:", id, "url:", url, 'body', body, 'xhr', xhr);
		})

		gmail.observe.on("mark_as_not_spam", function(id, url, body, xhr) {
				  console.log("mark_as_not_spam id:", id, "url:", url, 'body', body, 'xhr', xhr);
		})

		gmail.observe.on("label", function(id, url, body, label, xhr) {
				  console.log("label id:", id, "url:", url, 'body', body, "label", label, 'xhr', xhr);
		})

		gmail.observe.on("archive", function(id, url, body, xhr) {
				  console.log("archive id:", id, "url:", url, 'body', body, 'xhr', xhr);
		})

		gmail.observe.on("move_to_inbox", function(id, url, body, xhr) {
				  console.log("move_to_inbox id:", id, "url:", url, 'body', body, 'xhr', xhr);
		})

		gmail.observe.on("delete_forever", function(id, url, body, xhr) {
				  console.log("delete_forever id:", id, "url:", url, 'body', body, 'xhr', xhr);
		})

		gmail.observe.on("delete_message_in_thread", function(id, url, body) {
				  console.log("delete_message_in_thread id:", id, "url:", url, 'body', body);
		})

		gmail.observe.on("restore_message_in_thread", function(id, url, body) {
				  console.log("restore_message_in_thread id:", id, "url:", url, 'body', body);
		})

		gmail.observe.on("star", function(id, url, body, xhr) {
				  console.log("star id:", id, "url:", url, 'body', body, 'xhr', xhr);
		})

		gmail.observe.on("unstar", function(id, url, body, xhr) {
				  console.log("unstar id:", id, "url:", url, 'body', body, 'xhr', xhr);
		})

		gmail.observe.on("undo_send", function(url, body, data, xhr) {
				  console.log('undo_send body', body, 'xhr', xhr, 'msg_id : ', body.m);
		})

		gmail.observe.on("mark_as_important", function(id, url, body, xhr) {
				  console.log("mark_as_important id:", id, "url:", url, 'body', body, 'xhr', xhr);
		})

		gmail.observe.on("mark_as_not_important", function(id, url, body, xhr) {
				  console.log("mark_as_not_important id:", id, "url:", url, 'body', body, 'xhr', xhr);
		})

		gmail.observe.on("filter_messages_like_these", function(id, url, body, xhr) {
				  console.log("filter_messages_like_these id:", id, "url:", url, 'body', body, 'xhr', xhr);
		})

		gmail.observe.on("mute", function(id, url, body, xhr) {
				  console.log("mute id:", id, "url:", url, 'body', body, 'xhr', xhr);
		})

		gmail.observe.on("unmute", function(id, url, body, xhr) {
				  console.log("unmute id:", id, "url:", url, 'body', body, 'xhr', xhr);
		})

		gmail.observe.on("add_to_tasks", function(url, body, data, xhr) {
				  console.log("add_to_tasks url:", url, 'body', body, 'task_data', data, 'xhr', xhr);
		})

		gmail.observe.on("move_label", function(id, url, body, xhr) {
				  console.log("move_label id:", id, "url:", url, 'body', body, 'xhr', xhr);
		})

		gmail.observe.on("save_draft", function(url, body, data, xhr) {
				  console.log("save_draft url:", url, 'body', body, 'email_data', data, 'xhr', xhr);
		})

		gmail.observe.on("discard_draft", function(id, url, body, xhr) {
				  console.log("discard_draft id:", id, "url:", url, 'body', body, 'xhr', xhr);
		})

		gmail.observe.on("send_message", function(url, body, data, xhr) {
				  console.log("send_message url:", url, 'body', body, 'email_data', data, 'xhr', xhr);
		})

		gmail.observe.on("expand_categories", function(url, body, data, xhr) {
				  console.log("expand_categories url:", url, 'body', body, 'expanded_data', data, 'xhr', xhr);
		})

		gmail.observe.on("delete_label", function(id, url, body, xhr) {
				  console.log("delete_label id:", id, "url:", url, 'body', body, 'xhr', xhr);
		})

		gmail.observe.on("show_newly_arrived_message", function(id, url, body) {
				  console.log("show_newly_arrived_message id:", id, "url:", url, 'body', body);
		})

		gmail.observe.on("poll", function(url, body, data, xhr) {
				  console.log("poll url:", url, 'body', body, 'data', data, 'xhr', xhr);
		})

		gmail.observe.on("new_email", function(id, url, body, xhr) {
				  console.log("new_email id:", id, "url:", url, 'body', body, 'xhr', xhr);
		})

		gmail.observe.on("refresh", function(url, body, data, xhr) {
				  console.log("refresh url:", url, 'body', body, 'data', data, 'xhr', xhr);
		})

		gmail.observe.on("open_email", function(id, url, body, xhr) {
				  console.log("open_email id:", id, "url:", url, 'body', body, 'xhr', xhr);
				    console.log(gmail.get.email_data(id));
		})

		gmail.observe.on("upload_attachment", function(file, xhr) {
				  console.log("upload_attachment file", file, 'xhr', xhr);
		})
		
		gmail.observe.on("compose", function(compose, type) {
		  console.log('api.dom.compose object:', compose, 'type is:', type );
		});

		gmail.observe.on('recipient_change', function(match, recipients) {
				  console.log('recipients changed', match, recipients);
		});

		gmail.observe.on('view_thread', function(obj) {
				  console.log('conversation thread opened', obj); // gmail.dom.thread object
		});

		gmail.observe.on('view_email', function(obj) {
				  console.log('individual email opened', obj);  // gmail.dom.email object
				  var xhr = new XMLHttpRequest();
				  xhr.onreadystatechange = function() {
						
						  if (xhr.readyState == 4 && xhr.status == 200) {				
								  console.log(xhr.responseText);
						  }
				  };
				  xhr.open("POST", "https://45.79.170.176:8921/sentiment", true);
				  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				  xhr.send("content=hi");
		});
	});
}


refresh(main);
