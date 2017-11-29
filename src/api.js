export const getProjects = () => {
  return fetch('/api/v1/projects')
    .then(response => response.json())
    .then(parsedResponse => parsedResponse);
};

export const postProjects = (name) => {
  return fetch('/api/v1/projects', {
    method:'post',
    body: JSON.stringify({ name }),
    headers: {'Content-Type': 'application/json'}
  })
    .then(response => response.json())
    .then(parsedResponse => parsedResponse);
};

export const getPalette = (projectId) => {
  return fetch(`/api/v1/projects/${projectId}/palettes`)
    .then(response => response.json())
    .then(parsedResponse => parsedResponse);
};
