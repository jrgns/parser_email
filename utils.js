exports.parse_header_block = parse_header_block;
function parse_header_block(content) {
	var result      = new Array();
	var header_arr  = content.split("\r\n");
	var current_key = false;
	for(var i = 0; i < header_arr.length; i++) {
		tupple = header_arr[i].split(':', 2);
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
			var tuple        = extra[i].split('=', 2);
			if (tuple.length == 2) {
				result[tuple[0]] = trim(tuple[1]);
			} else {
				result[tuple[0]] = '';
			}
		}
	}
	return result;
}

exports.parse_multitype = parse_multitype;
function parse_multitype(content, border) {
	//TODO
}

exports.trim = trim;
function trim(string) {
	return string.replace(/^\s*|\s*$/, '')
}

exports.parse_part = parse_part;
function parse_part (content) {
	content     = content.split("\r\n\r\n", 2);
	if (content.length == 2) {
		return { 'header': content[0], 'content': content[1] }
	} else {
		return { 'header': '', 'content': content[0] }
	}
}

