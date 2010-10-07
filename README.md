parser_email
============

I needed a parser for Email, so I wrote one. At the moment it doesn't do much but parse the headers. Feel free to contribute.

Example
-------
    var   fs        = require('fs')
        , sys       = require('sys')
        , em_parse  = require('./parser_email')
    
    stream = fs.ReadStream(file);
    stream.setEncoding('ascii');
    stream.on('data', function(data) {
    	mail += data;
    });
    stream.on('close', function () {
    	parser = em_parse.parser_email();
    	parser.setContent(mail);
    	parser.parseMail();
    });


