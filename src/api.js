export const getProjects = () => {
  return fetch('/api/v1/projects').then(response => response.json()).then(parsedResponse => parsedResponse).catch(error => error);
};

export const postProjects = (name) => {
  return fetch('/api/v1/projects', {
    method: 'post',
    body: JSON.stringify({name}),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json()).then(parsedResponse => parsedResponse).catch(error => error);
};
export const deleteProjects = (projectId) => {
  return fetch(`/api/v1/projects/${projectId}`, {method: 'delete'}).then(response => response.json()).then(parsedResponse => parsedResponse).catch(error => error);
};

export const getPalette = (projectId) => {
  return fetch(`/api/v1/projects/${projectId}/palettes`).then(response => response.json()).then(parsedResponse => parsedResponse).catch(error => error);
};

export const postPalette = (palette, projectId) => {
  return fetch(`/api/v1/projects/${projectId}/palettes`, {
    method: 'post',
    body: JSON.stringify(palette),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json()).then(parsedResponse => parsedResponse).catch(error => error);
};

export const deletePalette = (projectId, paletteId) => {
  return fetch(`/api/v1/projects/${projectId}/palettes/${paletteId}`, {method: 'delete'}).then(response => response.json()).then(parsedResponse => parsedResponse).catch(error => error);
};
