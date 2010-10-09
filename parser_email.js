var   sys   = require('sys')
    , utils = require('./utils')
;

// events for discoverability
exports.EVENTS = [ "onError" ];

exports.parser_email = function parser_email () { return new EmailParser() }
exports.EmailParser = EmailParser;

function EmailParser () {
	this.content        = '';
	this.headerContent  = '';
	this.bodyContent    = '';
	this.headers        = new Array();
	this.body           = new Array();	
}

trim         = utils.trim;

EmailParser.prototype.setContent = function(content) {
	this.content = content;
}

EmailParser.prototype.parseMail = function() {
	if (this.content == '') {
		sys.puts("Empty Content");
		return false;
		error(this, "Empty Content");
	}
	var mail = utils.parse_part(this.content);
	this.headerContent = mail.header;
	this.bodyContent   = mail.content;
	
	this.parseHeaders();
	this.parseBody();
}

EmailParser.prototype.parseHeaders = function() {
	if (this.headerContent == '') {
		sys.puts("Empty Header");
		return false;
		error(this, 'Empty Header');
	}
	this.headers = utils.parse_header_block(this.headerContent);	
}

EmailParser.prototype.parseBody = function() {
	if (this.bodyContent == '') {
		sys.puts("Empty Body");
		return false;
		error(this, "Empty Body");
	}
	sys.puts(sys.inspect(this.headers));
	if (!this.headers['content-type']) {
		this.headers['content-type'] = { 'value': 'text/plain' };
	}
	sys.puts('Have a content type: ' + this.headers['content-type'].value);
	switch (this.headers['content-type'].value) {
	case 'text/plain':
		this.body = [{ 'content-type': 'text/plain', 'content': this.bodyContent }];
		break;
	case 'multipart/mixed':
		var content = parse_multitype(this.bodyContent, this.headers['content-type'].border);
		break;
	default:
		sys.puts('Unknown content type: ' + this.headers['content-type'].value);
		sys.puts(sys.inspect(this.headers['content-type']));
		break;
	}
}

