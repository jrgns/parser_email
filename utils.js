var   util = require('util')
;

exports.parse_header_block = parse_header_block;
function parse_header_block(content) {
	var result      = new Array();
	if (content == '') {
		return result;
	}
	var header_arr  = content.split(/\r\n|\n/);
	var current_key = false;
	var extra       = false;
	for (var i = 0; i < header_arr.length; i++) {
		tupple = explode(header_arr[i], ':', 2);
		if (header_arr[i].match(/^\s+/) || tupple.length < 2) {
			if (current_key && header_arr[i].match(/^\s+/)) {
				//util.log('Adding [' + header_arr[i] + '] to ' + current_key);
				result[current_key] += ' ' + trim(header_arr[i]);
				extra = true;
			} else {
				util.debug('Invalid Header: ' + header_arr[i]);
			}
			continue;
		}
		var key     = tupple[0].toLowerCase();
		//util.log('Working with ' + key);
		current_key = key;
		result[key] = tupple[1];
	}
	for (key in result) {
		result[key] = parse_header(result[key]);
	}
	return result;
}

exports.parse_header = parse_header;
function parse_header(header) {
	var result    = {};
	var extra = false;
	header        = header.split(';');
	result.value  = trim(header[0]);
	//Start from second element
	for(var i = 1; i < header.length; i++) {
		if (header[i] == '') {
			continue;
		}
		extra = true;
		var tupple = explode(header[i], '=', 2);
		var h_name = trim(tupple[0]);
		//util.log('Extra Name: (' + i + ')' + h_name);
		if (tupple.length == 2) {
			result[h_name] = trim(tupple[1]).replace(/^"/, '').replace(/"$/, '');
		} else {
			result[h_name] = '';
		}
	}
	return result;
}

exports.parse_body_block = parse_body_block;
function parse_body_block(content, headers) {
	if (!headers['content-type']) {
		headers['content-type'] = { 'value': 'text/plain' };
	}
	var main_type = headers['content-type'].value.split("\/", 1) + '';
	util.log('Have a content type: ' + headers['content-type'].value);
	util.log('Main Type: ' + main_type);
	switch (main_type) {
	case 'text':
		return [{ 'content-type': headers['content-type'].value, 'content': content }];
		break;
	case 'multipart':
		content = parse_multitype(content, headers['content-type'].boundary);
		break;
	case 'application':
	case 'image':
		content = content.replace(/\r\n/mg, '');
		break;
	default:
		util.debug('Unknown content type: ' + headers['content-type'].value);
		util.debug('Unknown content type: ' + main_type);
		util.debug(util.inspect(headers['content-type']));
		break;
	}
	return content;
}

exports.parse_multitype = parse_multitype;
function parse_multitype(content, boundary) {
	if (!content || !boundary) {
		return false;
	}
	util.log('Working with boundary ' + boundary);
	if (content.substr(0, boundary.length + 2) != ('--' + boundary)) {
		util.debug('Invalid Multi Part');
		return false;
	}

    var regexp = new RegExp('--' + boundary + '\\r?\\n', 'mg');
    //util.debug(util.inspect(regexp));
	content = content.split(regexp);
	util.debug('Content Length: ' + content.length);
	//Skip the first part, as it's empty
	for (var i = 1; i < content.length; i++) {
	    inner = true;
	    util.log('Parsing Part ' + i + ': ' + boundary);
	    content[i] = parse_part(content[i]);
	}
	return content;
}

exports.parse_part = parse_part;
function parse_part(content) {
	var temp = content.split(/\r?\n\r?\n/gm);
	content = new Array();
	content.push(temp[0]);
	content.push(temp.slice(1).join("\n\n"));

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
