const fs = require('fs');

var getUsersArray = () => {
	try{
		var userStr = fs.readFileSync('data.json');
		return JSON.parse(userStr);
	}
	catch(e){
		return [];
	}
};

var pushUsersArray = (newUser) => {
	
	
	if(typeof newUser.name !== "undefined" && newUser.name !== ""){
		var users = getUsersArray();
		var noDuplicateUsers = users.filter((user) => user.name ===newUser.name);
		if (noDuplicateUsers.length === 0){
		users.push(newUser);
		fs.writeFile('data.json', JSON.stringify(users,null,3),(err) =>  {
				if(err){
					console.log(err);
				}
			});
		}
	}

};

/*var getUserData = (email,password) => {
	var userObj = JSON.parse(fs.readFileSync('data.json'));
	var noDuplicateUsers = userObj.filter((user) => user.pass === password && user.email === email);
	if(noDuplicateUsers.length > 0){
		return true;
	}
	else{
		return false;
	}
};*/

/*var saveUserDataInFile = (req,res,next) => {
	let name = req.body.fname;
	let email = req.body.email;
	let pass = req.body.pass;
	let cid = req.body.cid;
	let roll = req.body.roll;
	var user = {
		name,
		email,
		pass,
		cid,
		roll
	}
	pushUsersArray(user);
	next();
};*/



module.exports = {
	getUsersArray,
	pushUsersArray,
}