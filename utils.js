var   sys   = require('sys')
;

exports.parse_header_block = parse_header_block;
function parse_header_block(content) {
	var result      = new Array();
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

exports.parse_multitype = parse_multitype;
function parse_multitype(content, border) {
	content = content.split(border);
	for (var i = 0; i < content.length; i++) {
		content[i] = parse_part(content[i]);
	}
}

exports.parse_part = parse_part;
function parse_part(content) {
	content     = explode(content, "\r\n\r\n", 2);
	if (content.length == 2) {
		return { 'header': parse_header_block(content[0]), 'body': content[1] }
	} else {
		return { 'header': content[0], 'body': '' }
	}
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

