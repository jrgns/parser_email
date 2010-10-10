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
}

