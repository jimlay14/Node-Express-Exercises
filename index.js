const express = require('express');
const app = express();
const port = process.env.Port || 8080;
const COMPLETE = 'complete';
const INCOMPLETE = 'incomplete';

var bodyParser = require('body-parser');
var toDoList = require('./todo.json').myToDoList;
var idIterator = toDoList.length+1; //unique identifier



app.use(bodyParser.urlencoded({ extended: true }));

//Using EJS for simplifying templating and enabling UI interaction for routes
app.set('view engine', 'ejs');
app.use(express.json());

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

/* 
      Activity 1

      Complete the following routes to manage a todo list. 

*/

app.get('/', (req, res) => res.render('index', {toDoList: toDoList, updateId: 1}));
app.get('/index', (req, res) => res.render('index', {toDoList: toDoList, updateId: 1}));


//Create a route that will insert a new activity
//Inserts activity into session, but does not save/overwrite todo.json
app.post('/activity', (req, res) => {
  var newTask = {
      id: idIterator,
      item: req.body.newTitle,
      status: req.body.newStatus === COMPLETE ? COMPLETE : INCOMPLETE
  };
  idIterator++; //increment simple id generator
  toDoList.push(newTask); //add to list
  res.redirect("/"); //return to index
});

//Create a route that will retrieve an activity by its ID and display the information of it (name, status, etc)
//Returning in simple json string format
app.route('/activity/:id')
  .get((req, res) => {

    console.log('get!');
    var idFound = false;
    for(var i = 0; i < toDoList.length; i++){

      //Using double equals here as parameter type will not match value in todo.json
      if(toDoList[i].id == req.params.id){
        idFound = true;
        res.send(toDoList[i]);
      }
    }

    //Rudimentary 404 error
    if(!idFound){
      res.send("404 - The activity you are looking for was not found");
    }
})
.put((req, res) => {
  //Sample call: 
  // curl -X PUT -H "Content-Type: application/json" -d '{"id":"1","newTitle":"update email", "newStatus": "complete"}' http://localhost:8080/activity/1

  var id = req.body.id;
  var newTask = {
        id: id,
        item: req.body.newTitle,
        status: req.body.newStatus === COMPLETE ? COMPLETE : INCOMPLETE
    };
  
    var idFound = false;
    for(var i = 0; i < toDoList.length; i++){
      if(toDoList[i].id == id){
        toDoList[i] = newTask;
      }
    }
  toDoList.push(newTask); //add to list if Id is new
  res.send(newTask); //display updated task
  return;
});

/*
    Activity 2

    Using the following API -- https://dog.ceo/dog-api/breeds-list a route to retrieve breed data.

    Notes - no authentication required with this API
          - you may use any library for making the http requests (axios, fetch, etc..)
    
*/

//This route will allow a user to pass in a specific dog breed and retrieve the list of results
//API call used here is https://dog.ceo/api/breed/hound/images
app.get('/breedImages/:breed', (req, res) => {
  const axios = require('axios');
  var breed = req.params.breed;
  var breedImages = [];

  axios.get('https://dog.ceo/api/breed/' + breed +'/images')
    .then(response => {
        var images = response.data.message;
        for(var i = 0; i < images.length; i++){
          //since multiple breed names can be retrieved (heh) from the response (hound-afghan, hound-blood, etc)
          //parse the url with a simple split to get a shorter unique identifier than the full url 
          var urlSplit = images[i].split("/");

          breedImages.push({
            url: images[i],
            text: urlSplit[urlSplit.length - 1]
          });
        }
        //console.log(response.data.status);
        // console.log(response.data);
        res.render('dogs', {breed: breed, breedImages: breedImages});
    })
    .catch(error => {
        //log error
        console.log(error);

        //pass 404 error message to user
        if(error.response.status == '404'){
          res.send("404 - We are sorry, the breed you searched for does not appear in our search");
        } else {
          //log error but don't show error code to user
          //console.log(error);
          res.send("There was an error displaying this webpage");
        }
    });

});

/*

    Activity 3

    Assume you need to look up a user from a database and it may take a few seconds to complete.
    You have another function that will then look up that users permissions after getting the user information.

    Convert the userLookup and getUserPermission functions into a promise chain or use async/await to make sure the userPermissions are not called before a user is returned 


*/

app.get('/asyncTest', (req, res) => {

  //Add promise syntax to userLookup
  const userLookup = (user) => {
    return new Promise(resolve =>  {
        setTimeout(() => {
        resolve(user);
      }, 5000);
    });
  };

  //Add await call to getUserPermissions
  async function getUserPermissions(user) {
    console.log('looking up user permissions');
    result = await userLookup(user);
    console.log(`The user lookup returned => ${result}`);
    res.send(`The user lookup returned => ${result}`);
  };

  getUserPermissions('user1234');
  
});

/*

  Activity 4

  Suppose you have a URL that will be different between your TEST and PRODUCTION environments.
  How would you create an environment variable in node.js so that the url would not need to be hard coded?

*/

//The most effective way to go about this will be to create a .env file from which we can get the url to use
app.get('/envVar', (req, res) => {

  //Require dotenv library
  const dotenv = require('dotenv');
  dotenv.config();

  //Set variable from .env file (DEV_URL used here as an example)
  const myVar = process.env.DEV_URL;
  console.log(`my environment variable is ${myVar}`);
  res.send(`my environment variable is ${myVar}`);
});