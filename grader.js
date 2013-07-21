#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var tempfile = "gradertempfile.txt";
var workfile = "gradertempfileout.txt";
var checkfile;
var checkoutputfile = "checkoutput.txt";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
//console.log(htmlfile);  
  var checks = loadChecks(checksfile).sort();
//console.log($);
//console.log(checks);
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

var saveurltofile = function(result, response)
{
    if (result instanceof Error) {
            console.error('Error: ' + util.format(response.message));
    } else {
//console.log(result);
            fs.writeFileSync(tempfile, result);
return tempfile;  
  }
};

var waiter = function()
{
//console.log('Thanks for waiting');

//console.log('checking file');
var checkJson = checkHtmlFile(tempfile, checkfile);
var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
fs.writeFileSync(checkoutputfile,outJson);
} 

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <html_url>', 'URL Path' )
	.parse(process.argv);
//console.log('hello');
//echo("hello");

checkfile = program.checks; 
    if(program.url != '')
	{

//console.log('inside');
	   
	    if(!fs.existsSync(tempfile))
	    {
		fs.writeFileSync(tempfile,'');
            }
	    if(!fs.existsSync(workfile))
	    {
		fs.writeFileSync(workfile,'');
	    }

	 //   rest.get(program.url).on('complete',saveurltofile);

rest.get(program.url).on('complete', function(result,response){
    if (result instanceof Error) {
            console.error('Error: ' + util.format(response.message));
    } else {
//console.log(result);                                                                          
            fs.writeFileSync(tempfile, result);
//return tempfile;
  }
});

 
setTimeout(waiter,2000);


	    }
    else
	{ 
	    var checkJson = checkHtmlFile(program.file, program.checks);
	   // }
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}


