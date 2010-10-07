var   sys       = require('sys')
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
	this.body   = mail.join("\r\n\r\n");
	
	this.parseHeader();
	this.parseBody();
}

EmailParser.prototype.parseHeader = function() {
	if (this.header == '') {
		error(this, "Empty Header");
	}
	var headers = this.header.split("\r\n");
}

EmailParser.prototype.parseBody = function() {
	if (this.body == '') {
		error(this, "Empty Body");
	}
}

