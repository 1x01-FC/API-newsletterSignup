//________Const Require Section________
const express = require("express");
const request = require("postman-request");
const https = require('https');


const app = express();

//________Body Parser alternative________
app.use(express.urlencoded({extended:true}));

//________Static Folder________
app.use(express.static("public"));

//________Tracking HTML File________
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//________SIGNUP ROUTE________
app.post("/", function(req, res){
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const email = req.body.email

  //________Construct Requesting Data________
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data); //Stringify Inputed Data

  //________Requesting and send back our data to mailchimp________

  const url = 'https://us21.api.mailchimp.com/3.0/lists/353ee88c79'; //url = "https://<dc>.api.mailchimp.com/3.0/lists/{listID}";

  const options = {
    method: 'POST',
    auth: 'fred:8a143ae654b71dff72fb3bdcc6faff00-us21',
  }

  const request = https.request(url, options, function(response){
    if (response.statusCode === 200) {
      res.sendFile(__dirname + '/success.html');
    } else {
      res.sendFile(__dirname + '/failure.html');
    }

      response.on('data', function(data) { //The on method attaches an event listener (a function) for a certain event:
        console.log(JSON.parse(data));


      });
  });

  request.write(jsonData);
  request.end();
// console.log("Welcome " + firstName + " " + lastName + ". A confirmation email has been sent to " + email + ".");

});

//________FAILURE ROUTE________
app.post('/failure', function(req, res) {
res.redirect('/');
//When clicked [Try Again] button in .html file,
 //1.triggers post request to /failure route [form action="/failure" method="post"]
 //2.is called by our server [app.post('/failure')] and is redirected to root / [res.redirect('/')]
 //3.triggers app.get('/') and sends signup page as file to be rendred on screen [res.sendFile(__dirname + '/signup.html')]
});

//________SUCCESS ROUTE________
app.post('/success.html', function (req, res) {
  res.redirect('/');
});

//________Local Hosting________
// app.listen(3000, function() {
//   console.log("Server is running on port 3000.");
// });

//________Local + Dynamic Hosting________
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});

// API KEY: 8a143ae654b71dff72fb3bdcc6faff00-us21
// List ID: 353ee88c79
