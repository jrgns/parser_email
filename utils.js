var   sys   = require('sys')
;

exports.parse_header_block = parse_header_block;
function parse_header_block(content) {
	var result      = new Array();
	if (content == '') {
		return result;
	}
	var header_arr  = content.split("\r\n");
	var current_key = false;
	for(var i = 0; i < header_arr.length; i++) {
		tupple = explode(header_arr[i], ':', 2);
		if (header_arr[i].match(/^\s+/) || tupple.length < 2) {
			if (current_key && header_arr[i].match(/^\s+/)) {
				//sys.puts('Adding [' + header_arr[i] + '] to ' + current_key);
				result[current_key] += "\r\n" + header_arr[i];
			} else {
				sys.puts('Invalid Header: ' + header_arr[i]);
			}
			continue;
		}
		var key     = tupple[0].toLowerCase();
		//sys.puts('Working with ' + key);
		current_key = key;
		result[key] = parse_header(tupple[1]);
	}
	return result;
}

exports.parse_header = parse_header;
function parse_header(header) {
	var result    = {};
	header        = header.split(';');
	result.value  = trim(header[0]);
	if (header[1]) {
		var extra = trim(header[1]).split('&');
		for (var i = 0; i < extra.length; i++) {
			var tupple = explode(extra[i], '=', 2);
			if (tupple.length == 2) {
				result[tupple[0]] = trim(tupple[1]);
			} else {
				result[tupple[0]] = '';
			}
		}
	}
	return result;
}

exports.parse_body_block = parse_body_block;
function parse_body_block(content, headers) {
	if (!headers['content-type']) {
		headers['content-type'] = { 'value': 'text/plain' };
	}
	sys.puts('Have a content type: ' + headers['content-type'].value);
	switch (headers['content-type'].value) {
	case 'text/plain':
	case 'text/html':
		return [{ 'content-type': 'text/plain', 'content': this.content }];
		break;
	case 'multipart/mixed':
		content = parse_multitype(content, headers['content-type'].boundary);
		break;
	case 'multipart/alternative':
		content = parse_multitype(content, headers['content-type'].boundary);
		break;
	default:
		sys.puts('Unknown content type: ' + headers['content-type'].value);
		sys.puts(sys.inspect(headers['content-type']));
		break;
	}
	return content;
}

exports.parse_multitype = parse_multitype;
function parse_multitype(content, boundary) {
	if (!content || !boundary) {
		return false;
	}
	sys.puts('Working with boundary ' + boundary);
	if (content.substr(0, boundary.length + 2) != ('--' + boundary)) {
		sys.puts('Invalid Multi Part');
		return false;
	}
	
	content = content.split('--' + boundary + "\r\n");
	for (var i = 0; i < content.length; i++) {
		content[i] = parse_part(content[i]);
	}
	return content;
}

exports.parse_part = parse_part;
function parse_part(content) {
	content    = explode(content, "\r\n\r\n", 2);
	var header = parse_header_block(content[0]);
	if (content.length == 2) {
		var body = parse_body_block(content[1], header);
	} else {
		var body = '';
	}
	return { 'header': header, 'body': body }
}

exports.trim = trim;
function trim(string) {
	return string.replace(/^\s*|\s*$/, '')
}

exports.explode = explode;
function explode(string, delim, limit) {
	if (!limit) {
		return string.split(delim);
	}
	var parts  = string.split(delim);
	
	var result = parts.slice(0, limit - 1);
	result.push(parts.slice(limit - 1).join(delim));
	return result;
}

