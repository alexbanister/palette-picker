import $ from 'jquery';
import {
  getProjects,
  getPalette,
  postProjects,
  postPalette,
  deleteProjects,
  deletePalette } from './api';

var lockedPositions = [];
var currentColors = [];

const generateColor = () => {
  const red = generateColorValue();
  const green = generateColorValue();
  const blue = generateColorValue();
  return `#${red}${green}${blue}`;
};

const generateColorValue = () => {
  const value = Math.floor(Math.random() * 255).toString(16);
  return value.length === 1 ? '0' + value : value;
};

const setOneColor = (color, position) => {
  $('.color'+position).css('background', color);
  $('.color'+position).css('color', color);
  $('.color-letter').css('background', 'none');
  $('[data-id='+position+']').find('h3').text(color);
};

const shuffleColors = () => {
  for (var i = 1; i <= 5; i++) {
    const locked = lockedPositions.find( pos => pos === i);
    let color = generateColor();
    while (currentColors.includes(color)) {
      color = generateColor();
    }
    if (!locked) {
      setOneColor(color, i);
    }
  }
};

const toggleLocked = (e) => {
  const position = $(e.target).closest('[data-id]').data('id');
  const locked = lockedPositions.find( pos => pos === position);
  if (locked) {
    lockedPositions = lockedPositions.filter( pos => pos !== position);
    $('[data-id='+position+']').find('img').attr('src', 'images/keep.svg');
  } else {
    lockedPositions = [...lockedPositions, position];
    $('[data-id='+position+']').find('img').attr('src', 'images/locked.svg');
  }
};

const buildProjectsMenu = async () => {
  const allProjects = await getProjects();
  allProjects.forEach(project => {
    renderProjectInMenu(project);
  });
  loadPalettes($('[name="current-project"]').val());
};

const renderProjectInMenu = (project) => {
  $('[name="current-project"]').append($('<option>', {
    value: project.id,
    text: project.name,
    selected: true
  }));
};

const loadPalettes = async (projectId) => {
  $('.palettes').html('');
  const currentProjectPalette = await getPalette(projectId);
  if (!currentProjectPalette.length) {
    $('.palettes').html('<h4>This Project has no palettes</h4>');
  } else {
    currentProjectPalette.forEach( palette => {
      renderPalette(palette);
    });
  }
};

const renderPalette = (palette) => {
  $('.palettes').find('h4').remove();
  $('.palette-template').clone(true)
    .removeClass('palette-template')
    .addClass('project-palettes')
    .prependTo('.palettes')
    .data('paletteId', palette.id)
    .data('projectId', palette.projectId)
    .find('h5').text(palette.name)
    .closest('div')
    .find('.color-swatch').each( (i, element) => {
      $(element).css('background', palette[`color${i+1}`])
      .data('color', palette[`color${i+1}`]);
    });
};

const savePalette = async (e) => {
  e.preventDefault();
  let palette = {
    name: $('[name="palette-name"]').val()
  };
  for (var i = 1; i <= 5; i++) {
    palette = Object.assign(palette, { [`color${i}`]: $(`[data-id="${i}"]`).find('h3').text() });
  }
  const id = await postPalette(palette, $('[name="current-project"]').val());
  palette = Object.assign(palette, { id });
  renderPalette(palette);
  $('[name="palette-name"]').val('');
};

const createProject = async (e) => {
  e.preventDefault();
  const name = $('[name="new-project"]').val();
  const { id } = await postProjects(name);
  renderProjectInMenu({ name, id });
  $('.palettes').html('<h4>This Project has no palettes</h4>');
  $('[name="new-project"]').val('');
};

const selectPalette = (e) => {
  const palette = $(e.target).closest('div').find('.color-swatch');
  let colors = [];
  $(palette).each( (i, color) => {
    colors = [...colors, $(color).data('color')];
  });
  colors.forEach( (color, i) => {
    setOneColor(color, i+1);
  });
};

const destroyPalette = async (e) => {
  const palette = $(e.target).closest('div');
  const paletteId = $(palette).data('paletteId');
  const projectId = $('[name="current-project"]').val();
  await deletePalette(projectId, paletteId);
  removePalette(palette);
};

const removePalette = (palette) => {
  $(palette).remove();
  if (!$('.palettes').find('div').length) {
    $('.palettes').html('<h4>This Project has no palettes</h4>');
  }
};

const destroyProject = async () => {
  const { id } = await deleteProjects($('[name="current-project"]').val());
  $('[name="current-project"]').find(`[value="${id}"]`).remove();
  loadPalettes($('[name="current-project"]').val());
};

$(document).ready( () => {
  buildProjectsMenu();
  shuffleColors();
});
$('[name="shuffle-colors"]').on('click', shuffleColors);
$('.lock').on('click', toggleLocked);
$('[name="save-palette"]').on('click', savePalette);
$('[name="create-project"]').on('click', createProject);
$('[name="current-project"]').on('change', (e) => {
  loadPalettes(e.target.value);
});
$('.palette-select, .current-palette').on('click', selectPalette);
$('.palette-delete').on('click', destroyPalette);
$('[name="delete-project"]').on('click', destroyProject);
