const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const hbs =  require('hbs');
const PORT = process.env.PORT || 3000;
const path = require('path');
const fs = require('fs');
const{pushUsersArray} = require('./utils/users');

app.use(express.static(path.join(__dirname,'/public')));
app.set('view engine','hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({secret:'A Secret'}));
hbs.registerPartials(path.join(__dirname,'/views/partials'));


app.get('/signup',(req,res) => {
	if(typeof req.session.email !== "undefined"){
		res.redirect('profile');
	}else{
		res.render('signup');	
	}
	
});

var saveUserDataInFile = (req,res,next) => {
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
};

app.post('/signup', saveUserDataInFile, (req,res) => {
	res.send("Signup successfull!!!");
});

app.get('/login',(req,res) => {
	if(typeof req.session.email !== "undefined"){
		res.redirect('profile');
	}
	else{
	res.render('login');
}
});

var getUserData = (email,password) => {
	var userObj = JSON.parse(fs.readFileSync('data.json'));
	var noDuplicateUsers = userObj.filter((user) => user.pass === password && user.email === email);
	if(noDuplicateUsers.length > 0){
		return true;
	}
	else{
		return false;
	}
};

var saveSession = (req,res,next) => {		//Middlware to establish session
	let email = req.body.email;
	let pass = req.body.pass;
	if(getUserData(email, pass)){
		req.session.email = email;
		req.session.pass = pass;
		next();
	}
	else{
		console.log("FALSE");
	}
};

app.post('/login', saveSession, (req,res) => {	//POST /login handler to redirect the request to
	res.redirect('profile');					//profile page after setting up session	
});

app.get('/profile', (req,res) => {					//GET /profile will be rendered with profile
	if(typeof req.session.email === 'undefined'){	//or will be redirected if not in session
		res.redirect('login');
	}
	else{
	let email = req.session.email;
	res.render('profile',{
		Uname: email
	});
}
});

/*app.get('/dashboard', (req,res) => {
	if(req.session.user){
		res.send(`Hello ${req.session.user}. You are in dashboard`);	
	}
	else{
		res.redirect('/login');
	}
});*/

app.get('/logout', (req,res) => {
	if(typeof req.session.email === 'undefined'){	
		res.redirect('login');
	}
	else{
	req.session.destroy();
	res.redirect('login');
}
});



app.listen(PORT, () => {
	console.log(`Server listening at ${PORT}...`);
});