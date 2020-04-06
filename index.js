const express = require('express');
const app = express();
const port = process.env.Port || 8080;
const COMPLETE = 'complete';
const INCOMPLETE = 'incomplete';


var bodyParser = require('body-parser');
var toDoList = require('./todo.json').myToDoList,
    idIterator = toDoList.length+1; //unique identifier



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

app.get('/', (req, res) => res.render('index', {toDoList: toDoList}));

//Create a route that will retrieve an activity by its ID and display the information of it (name, status, etc)
app.get('/activity/:id', (req, res) => {});

//Create a route that will insert a new activity
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

//Create a route that will edit an existing activity
app.put('/activity/:id', (req, res) => {});

/*
    Activity 2

    Using the following API -- https://dog.ceo/dog-api/breeds-list a route to retrieve breed data.

    Notes - no authentication required with this API
          - you may use any library for making the http requests (axios, fetch, etc..)
    
*/

//This route will allow a user to pass in a specific dog breed and retrieve the list of results
app.get('/breedImages/:breed', (req, res) => {});

/*

    Activity 3

    Assume you need to look up a user from a database and it may take a few seconds to complete.
    You have another function that will then look up that users permissions after getting the user information.

    Convert the userLookup and getUserPermission functions into a promise chain or use async/await to make sure the userPermissions are not called before a user is returned 


*/

app.get('/asyncTest', (req, res) => {
  const userLookup = () => {
    setTimeout(() => {
      return 'user1234';
    }, 5000);
  };

  const getUserPermissions = user => {
    console.log(`The user lookup returned => ${user}`);
  };

  userLookup();
  getUserPermissions();
});

/*

  Activity 4

  Suppose you have a URL that will be different between your TEST and PRODUCTION environments.
  How would you create an environment variable in node.js so that the url would not need to be hard coded?

*/

app.get('envVar', (req, res) => {
  //set your env var here
  const myVar = ``;
  console.log(`my environment variable is ${myVar}`);
});
