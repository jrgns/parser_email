var   sys  = require('sys')
;

// events for discoverability
exports.EVENTS = [ "onError" ];

exports.parser_email = function parser_email () { return new EmailParser() }
exports.EmailParser = EmailParser;

function EmailParser () {
	this.content = '';
	this.header  = '';
	this.body    = '';
	
}

EmailParser.prototype.setContent = function(content) {
	this.content = content;
}

EmailParser.prototype.parseMail = function() {
	if (this.content == '') {
		error(this, "Empty Content");
	}
	var mail = this.content.split("\r\n\r\n");
	sys.puts('Mail with ' + mail.length + ' components');
	this.header = mail[0];
	delete(mail[0]);
	//The substr removes the four characters added to the string by join
	//Join does this because we used delete(mail[0]);
	this.body   = mail.join("\r\n\r\n").substr(4);
	
	this.parseHeaders();
	this.parseBody();
}

EmailParser.prototype.parseHeaders = function() {
	if (this.header == '') {
		error(this, 'Empty Header');
	}
	var headers     = new Array();
	var header_arr  = this.header.split("\r\n");
	var current_key = false;
	for(var i = 0; i < header_arr.length; i++) {
		tupple = header_arr[i].split(':');
		if (header_arr[i].match(/^\s+/) || tupple.length < 2) {
			if (current_key && header_arr[i].match(/^\s+/)) {
				//sys.puts('Adding [' + header_arr[i] + '] to ' + current_key);
				headers[current_key] += "\r\n" + header_arr[i];
			} else {
				sys.puts('Invalid Header: ' + header_arr[i]);
			}
			continue;
		}
		var key     = tupple[0].toLowerCase();
		//sys.puts('Working with ' + key);
		current_key = key;
		delete(tupple[0]);
		var value   = tupple.join(':').substr(1).replace(/^\s*|\s*$/, '');
		headers[key] = value;
	}
	sys.puts(sys.inspect(headers));
}

EmailParser.prototype.parseBody = function() {
	if (this.body == '') {
		error(this, "Empty Body");
	}
}

