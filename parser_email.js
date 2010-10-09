var   sys   = require('sys')
    , utils = require('./utils')
;

// events for discoverability
exports.EVENTS = [ "onError" ];

exports.parser_email = function parser_email () { return new EmailParser() }
exports.EmailParser = EmailParser;

function EmailParser () {
	this.content        = '';
	this.headers        = null;
	this.body           = null;
}

EmailParser.prototype.setContent = function(content) {
	this.content = content;
}

EmailParser.prototype.parseMail = function() {
	var mail = utils.parse_part(this.content);
	this.headers = mail.header;
	this.body    = mail.body;
	
	this.parseBody();
}

EmailParser.prototype.parseBody = function() {
	//sys.puts(sys.inspect(this.body));
	//sys.puts(sys.inspect(this.header));
	if (!this.headers['content-type']) {
		this.headers['content-type'] = { 'value': 'text/plain' };
	}
	sys.puts('Have a content type: ' + this.headers['content-type'].value);
	switch (this.headers['content-type'].value) {
	case 'text/plain':
		this.body = [{ 'content-type': 'text/plain', 'content': this.bodyContent }];
		break;
	case 'multipart/mixed':
		var content = utils.parse_multitype(this.body, this.headers['content-type'].border);
		break;
	default:
		sys.puts('Unknown content type: ' + this.headers['content-type'].value);
		sys.puts(sys.inspect(this.headers['content-type']));
		break;
	}
}

