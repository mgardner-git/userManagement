var express = require('express');
var app = express();
const fs = require('fs');
const dataPath = "./data/";

app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
   res.send('Hello World');
});

app.get("/api/groups", function(request, response) {
	fs.readFile(dataPath + "groups.json", 'utf8', (err, data) => {
      if (err) {
        throw err;
      }

      response.send(JSON.parse(data));
    });
});

//expects a request parameter groupId to filter out users in that group
app.get("/api/usersNotInGroup", function(request, response) {
	fs.readFile(dataPath + "allUsers.json", "utf8", (err,data) => {
		if (err) {
			throw err;
		}
		let allUsers = JSON.parse(data);
		console.log(request.query.groupId);
		
		
		if (request.query.groupId) {
			
			let filteredUsers = [];
			for (let index = 0; index < allUsers.length; index++) {
				let checkUser = allUsers[index];
				console.log("Checking user " + checkUser.username);
				let isUserInGroup = false;
				for (let groupIndex = 0; groupIndex < checkUser.groups.length; groupIndex++) {
					console.log(checkUser.groups[groupIndex]);
					if (checkUser.groups[groupIndex] == request.query.groupId) {
						console.log("User " + checkUser.username + " is in group " + request.query.groupId);
						isUserInGroup = true;
					}
				}
				if (!isUserInGroup) {
					filteredUsers.push(checkUser);
				}
			}

			response.send(filteredUsers);
		} else {
			response.send(allUsers);
		}
		
	});
});

//expects a request parameter groupId - returns all users who are members of that group
app.get("/api/usersInGroup", function(request, response) {
	fs.readFile(dataPath + "allUsers.json", "utf8", (err,data) => {
		if (err) {
			throw err;
		}
		let allUsers = JSON.parse(data);		
		
		if (request.query.groupId) {			
			let filteredUsers = [];
			for (let index = 0; index < allUsers.length; index++) {
				let checkUser = allUsers[index];
				
				let isUserInGroup = false;
				for (let groupIndex = 0; groupIndex < checkUser.groups.length; groupIndex++) {				
					if (checkUser.groups[groupIndex] == request.query.groupId) {
						isUserInGroup = true;
					}
				}
				if (isUserInGroup) {
					filteredUsers.push(checkUser);
				}
			}			
			response.send(filteredUsers);
		} else {
			throw "You must supply  a groupId for this service"
		}
		
	});
});


var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})