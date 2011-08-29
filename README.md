parser_email
============

I needed a parser for Email, so I wrote one. At the moment it doesn't do much but parse the headers. Feel free to contribute.

Install
-------

npm install parser_email

Example
-------

This assumes that the file is saved somewhere on the file system, but it can easily be any type of incoming stream.

    var   fs        = require('fs')
        , util      = require('util')
        , em_parse  = require('parser_email')

    var mail = '';
    var path_to_email = '~/emails/email.eml';

    stream = fs.ReadStream(path_to_email);
    stream.setEncoding('ascii');

    stream.on('data', function(data) {
    	mail += data;
    });

    stream.on('close', function () {
    	parser = new EParser(mail);

        //At the moment Email Parser emit's one event: part
        parser.on('part', function (type, body) {
            util.log('Received a part of type ' + type);
        });

        parser.execute();
    });
