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
  //
  database('projects').select()
    .then((projects) => {
      const sendBack = Object.assign(
        {},
        { projects },
        {
          randomProjectName: generateRandomName(),
          randomPaletteName: generateRandomName()
        }
      );
      response.status(200).json(sendBack);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});
app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  if (!project.name){
    return response
        .status(422)
        .send({ error: 'Missing a name property.' });
  }

  database('projects').insert(project, 'id')
    .then(project => {
      response.status(201).json({ id: project[0], randomProjectName: generateRandomName() });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});
app.delete('/api/v1/projects/:projectId', (request, response) => {
  const id = request.params.projectId;
  database('palettes').where('project_id', id).del()
    .then( () => {
      return database('projects').where('id', id).del();
    })
    .then( () => {
      response.status(204).json({ id });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});
app.get('/api/v1/projects/:projectId/palettes', (request, response) => {
  database('palettes').where('project_id', request.params.projectId).select()
    .then(palettes => response.status(200).json(palettes))
    .catch(error => {
      response.status(500).json({ error });
    });
});
app.post('/api/v1/projects/:projectId/palettes', (request, response) => {
  const palette = Object.assign({}, request.body, { project_id: request.params.projectId });
  for (let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5']) {
    if (!palette[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, color1: <String>, color2: <String>, color3: <String>, color4: <String>, color5: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('palettes').insert(palette, 'id')
    .then(palette => {
      response.status(201).json({ id: palette[0], randomPaletteName: generateRandomName() });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});
app.delete('/api/v1/projects/:projectId/palettes/:palletId', (request, response) => {
  const id = request.params.palletId;
  database('palettes').where('id', id).del()
    .then( () => {
      response.status(204).json({ id });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});
app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
