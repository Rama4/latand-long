var fs = require('fs');
var readline = require('readline');
var request = require('request');

var rd = readline.createInterface({
    input: fs.createReadStream(__dirname+'/testdata.txt'),
    //output: process.stdout,
    output: fs.createWriteStream(__dirname+'/output.txt'),
    console: false
});

var obj,loc;
var gurl = "https://maps.googleapis.com/maps/api/geocode/json";
var key = "AIzaSyDzqJJls0klYm5quJzvzELae22bFrV7Ga8";
rd.on('line', function(line) {
    var arr = line.split("$");
    request(gurl+"?address="+arr[4]+"&key="+key, function (error, response, body)
    {
		if(error) console.log(error);
		else{
			var res = JSON.parse(body).results;
			obj = {
					name:arr[0],
					phone: arr[1],
					email:arr[2],
					bloodGroup: arr[3],
					location:  {coordinates:res.length ? res[0].geometry.location : "unknown" , type : "Point"},
					reachability:{call:true,sms:true,email:true},
					category: "taxi",
					provider:true 
				};
				var str = "{ \"user\" : "+JSON.stringify(obj)+"}";
				// instead of console.log, we can write the object(str) into some text file
				console.log(str);
				request({
				  method: 'POST',
				  url: 'http://api.dowhistle.com/api/user',
				  headers: {
				    'Content-Type': 'application/json'
				  },
				  body:str
				}, function (error, response, body) {
				    // instead of console.log, we can write the object(str) into some text file
				  console.log('Response:', body);
				});
			}
    });
});

