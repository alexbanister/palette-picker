import $ from 'jquery';
import { getProjects, getPalette } from './api';

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
  for (var i = 0; i < 5; i++) {
    const locked = lockedPositions.find( pos => pos === i+1);
    let color = generateColor();
    while (currentColors.includes(color)) {
      color = generateColor();
    }
    if (!locked) {
      setOneColor(color, i+1);
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
    $('[name="current-project"]').append($('<option>', {
      value: project.id,
      text: project.name
    }));
  });
  loadPalettes(allProjects[0].id);
};

const loadPalettes = async (projectId) => {
  const currentProjectPalette = await getPalette(projectId);
  currentProjectPalette.forEach( palette => {
    renderPalette(palette);
  });
};

const renderPalette = (palette) => {
  $('.palette-template').clone(true)
    .removeClass('palette-template')
    .addClass('project-palettes')
    .prependTo('.palettes')
    .data('id', palette.id)
    .data('projectId', palette.projectId)
    .find('h5').text(palette.name)
    .closest('div')
    .find('.color-swatch').each( (i, element) => {
      $(element).css('background', palette[`color${i+1}`]);
    });
};

$(window).on('load', () => {
  buildProjectsMenu();
  shuffleColors();
});
$('[name="shuffle-colors"]').on('click', shuffleColors);
$('.lock').on('click', toggleLocked);
