var express = require('express');
var app = express();
const fs = require('fs');
const dataPath = "./data/";

app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  response.header("Access-Control-Allow-Methods", "PUT,GET,HEAD,POST");
  
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

/*
	Expects 2 parameters userId, and groupId.  Removes the given user from the given group.  Throws an error 
	if either parameter is missing, or if that user is not in that group.
*/
app.put("/api/removeUserFromGroup", function(request, response) {

	if (!request.query.groupId) {
		throw "You must supply a groupId for this service";
	}
	if (!request.query.userId) {
		throw "You must supply a userId for this service";
	}
	
	fs.readFile(dataPath + "allUsers.json", "utf8", (err,data) => {
		if (err) {
			throw err;
		} else {
			let allUsers = JSON.parse(data);
			let userFound = false;
			for (let index = 0; index < allUsers.length; index++) {
				let checkUser = allUsers[index];
				if (checkUser.id == request.query.userId) {
					userFound = true;
					let groupFound = false;
					for (let gIndex = 0; gIndex < checkUser.groups.length; gIndex++) {
						let checkGroup = checkUser.groups[gIndex];
						if (checkGroup == request.query.groupId) {
							groupFound = true;
							checkUser.groups.splice(gIndex,1); //remove this group from this user's groups
						}
					}
					if (!groupFound) {
						throw "User " + checkUser.username + " does not belong to group " + request.query.groupId;
					}
				}
			}
			if (!userFound) {
				throw "User " + request.query.userId + " does not exist.";
			}
			fs.writeFile(dataPath + "allUsers.json", JSON.stringify(allUsers), (err) => {
				if (err) {
					throw err
				} else {
					response.send(JSON.stringify("User " + request.query.userId  + " was removed from group #" + request.query.groupId));
				}
			});
		}
	});
});

app.put("/api/addUserToGroup", function(request, response) {

	if (!request.query.groupId) {
		throw "You must supply a groupId for this service";
	}
	if (!request.query.userId) {
		throw "You must supply a userId for this service";
	}
	
	fs.readFile(dataPath + "allUsers.json", "utf8", (err,data) => {
		if (err) {
			throw err;
		} else {
			let allUsers = JSON.parse(data);
			let userFound = false;
			for (let index = 0; index < allUsers.length; index++) {
				let checkUser = allUsers[index];
				if (checkUser.id == request.query.userId) {
					userFound = true;
					checkUser.groups.push(request.query.groupId);
				}
			}
			if (!userFound) {
				throw "User " + request.query.userId + " does not exist.";
			}
			fs.writeFile(dataPath + "allUsers.json", JSON.stringify(allUsers), (err) => {
				if (err) {
					throw err
				} else {
					response.send(JSON.stringify("User " + request.query.userId  + " was added to group #" + request.query.groupId));
				}
			});
		}
	});
});


var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})