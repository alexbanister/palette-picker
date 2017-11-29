const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('port', process.env.PORT || 3000);

app.locals.title = 'Palette Picker';
app.locals.projects = [
  {
    id: 1,
    name: 'First Project'
  }, {
    id: 2,
    name: 'Second Project'
  }, {
    id: 3,
    name: 'Third Project'
  }
];
app.locals.palettes = [
  {
    id: 1,
    projectId: 1,
    name: 'My Palette',
    color1: '#23edf1',
    color2: '#f19f23',
    color3: '#3323f1',
    color4: '#46f123',
    color5: '#f12361'
  }, {
    id: 2,
    projectId: 1,
    name: 'My Other Palette',
    color1: '#8a23f1',
    color2: '#daf123',
    color3: '#7e23f1',
    color4: '#479037',
    color5: '#e88ca8'
  }, {
    id: 3,
    projectId: 2,
    name: 'New Palette',
    color1: '#c4a5e3',
    color2: '#dee4ab',
    color3: '#c2a8e4',
    color4: '#a7db9c',
    color5: '#73223a'
  }
];

app.get('/api/v1/projects', (request, response) => {
  response.json(app.locals.projects);
});
app.post('/api/v1/projects', (request, response) => {
  const id = app.locals.projects[app.locals.projects.length-1].id+1;
  const newProject = Object.assign({}, request.body, { id });
  app.locals.projects = [...app.locals.projects, newProject];
  response.status(201).json(newProject);
});
app.get('/api/v1/projects/:projectId/palettes', (request, response) => {
  const projectId = parseInt(request.params.projectId);
  const palettes = app.locals.palettes.filter( palette => palette.projectId === projectId);
  response.json(palettes);
});
app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});
