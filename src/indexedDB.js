import Dexie from 'dexie';

let db = new Dexie('palettePicker');

db.version(1).stores({
  projects: 'id, name',
  palettes: 'id, project_id, name, color1, color2, color3, color4, color5'
});

export const saveOfflineProjects = (project) => {
  return db.projects.add(project);
};

export const loadOfflineProjects = () => {
  return db.projects.toArray();
};

export const saveOfflinePalettes = (palette) => {
  return db.palettes.add(palette);
};

export const loadOfflinePalettes = (projectId) => {
  return db.palettes.where({ project_id: projectId }).toArray();
};
