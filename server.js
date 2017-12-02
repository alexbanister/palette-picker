const express = require('express');
//import express lib
const environment = process.env.NODE_ENV || 'development';
//set environment to running env or development
const configuration = require('./knexfile')[environment];
//import knex configuration for environment
const database = require('knex')(configuration);
//import knex with current configuration
const app = express();
//create new instance of express app
const bodyParser = require('body-parser');
//import body parser for JSON
const generateRandomName = require('random-name-generator');
//import my random name generator for fun and entertaining palette and project name suggestions

app.use(bodyParser.json());
//use body parser to parse all JSON objects
app.use(bodyParser.urlencoded({ extended: true }));
//set what bodies body parser should parse
app.use(express.static(__dirname + '/public'));
//serve static assets from /public dir
app.set('port', process.env.PORT || 3000);
//set the port to run on to the env port or 3000

app.locals.title = 'Palette Picker';
//give the app a name

app.get('/api/v1/projects', (request, response) => {
//set a GET endpoint for projects
  database('projects').select()
  //query db table 'projects' for all records
    .then((projects) => {
    //pass query results to callback
      const sendBack = Object.assign(
      //set 'sendBack' to new object
        {},
        //assigns to empty object
        { projects },
        //add the query results to the sendBack object
        {
        //open new object
          randomProjectName: generateRandomName(),
          //add a key for random project name with a value of a random name from func
          randomPaletteName: generateRandomName()
          //add a key for random palette name with a value of a random name from func
        }
        //close object
      );
      //close callback
      response.status(200).json(sendBack);
      //respond to GET request with status 200 and JSON formatted object of query results and random names
    })
    //close happy path of GET request
    .catch((error) => {
    //if query returns errors set sad path for GET request and open callback
      response.status(500).json({ error });
      //respond with status 500 and JSON formatted errors from query
    });
    //close sad path call back
});
//close GET endpoint
app.post('/api/v1/projects', (request, response) => {
//set POST endpoint for projects
  const project = request.body;
  //set project to the body of the POST request

  if (!project.name){
  //check if the request has a name key:value pair
    return response
    //return the response object if no name
        .status(422)
        //set response status to 422
        .send({ error: 'Missing a name property.' });
        //set error message to response object
  }
  //close if

  database('projects').insert(project, 'id')
  //insert new project into db table 'projects' and return the id
    .then(project => {
    //open callback with db insert return value
      response.status(201).json({ id: project[0], randomProjectName: generateRandomName() });
      //send response object with status to 201 and JSON object with the new project ID and new random name
    })
    //close callback
    .catch(error => {
    //open catch callback if db query returns errors
      response.status(500).json({ error });
      //send response with status 500 and JSON object with error
    });
    //close catch
});
//close POST
app.delete('/api/v1/projects/:projectId', (request, response) => {
//create DELETE projects endpoint
  const id = request.params.projectId;
  //set project id from fetch/endpoint URL
  database('palettes').where('project_id', id).del()
  //delete from table 'palettes' where project id matches. removes all palettes for the project being deleted
    .then( () => {
    //start .then callback
      return database('projects').where('id', id).del();
      //query table 'project' to delete the project with the id passed in the URL
    })
    //close callback
    .then( () => {
    //start .then callback
      response.status(204).json({ id });
      //send response object with status 204 and JSON object with removed project's id
    })
    //close callback
    .catch(error => {
    //open catch callback for errors
      response.status(500).json({ error });
      //send response object with status 500 and JSON object with error
    });
    //close catch callback
});
//close delete endpoint
app.get('/api/v1/projects/:projectId/palettes', (request, response) => {
//create GET endpoint for palettes
  database('palettes').where('project_id', request.params.projectId).select()
  //select all palettes from table 'palettes' that have a project id matching the id passed in the URL
    .then(palettes => response.status(200).json(palettes))
    //return db query, send response object with status 200 and JSON object of all palettes
    .catch(error => {
    //open .catch for errors
      response.status(500).json({ error });
      //send response object with status 500 and JSON object with error
    });
    //close catch callback
});
//close GET endpoint
app.post('/api/v1/projects/:projectId/palettes', (request, response) => {
//create POST endpoint for new palettes
  const palette = Object.assign({}, request.body, { project_id: request.params.projectId });
  //build object from project id passed in URL and request object
  for (let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5']) {
  //iterate over an array of all the required values in the new palette object
    if (!palette[requiredParameter]) {
    //check if each value is in the object
      return response
      //return a response object if any values are missing
        .status(422)
        //set status to 422
        .send({ error: `Expected format: { name: <String>, color1: <String>, color2: <String>, color3: <String>, color4: <String>, color5: <String> }. You're missing a "${requiredParameter}" property.` });
        //add error message text to response object
    }
    //close if
  }
  //close for loop

  database('palettes').insert(palette, 'id')
  //insert into table 'palettes' the values from the new palette object
    .then(palette => {
    //open then for response
      response.status(201).json({ id: palette[0], randomPaletteName: generateRandomName() });
      //send response object with status 200 and JSON object with new palette id and new random name
    })
    //close callback
    .catch(error => {
    //open catch callback for errors
      response.status(500).json({ error });
      //send response object with status 500 and JSON object with error
    });
    //close catch
});
//close POST endpoint
app.delete('/api/v1/projects/:projectId/palettes/:palletId', (request, response) => {
//create DELETE endpoint for deleting a palette
  const id = request.params.palletId;
  //set id to palette id passed in URL
  database('palettes').where('id', id).del()
  //delete palette in table 'palettes' where id matches
    .then( () => {
    //open response callback
      response.status(204).json({ id });
      //send response object with status 200 and JSON object with deleted palette id
    })
    //close callback
    .catch(error => {
    //open .catch callback to handle errors
      response.status(500).json({ error });
      //send response object with status 500 and JSON object with error
    });
    //close catch
});
//close delete endpoint
app.listen(app.get('port'), () => {
//set app to listen on port set at top of file
  // eslint-disable-next-line no-console
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  //log in terminal when the app is running
});
//close listen block

module.exports = app;
//export app for mocha to be able to access it and run it for testing
