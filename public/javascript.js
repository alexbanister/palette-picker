/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

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
  $('.color' + position).css('background', color);
  $('.color' + position).css('color', color);
  $('.color-letter').css('background', 'none');
  $('[data-id=' + position + ']').find('h3').text(color);
};

const shuffleColors = () => {
  for (var i = 0; i < 5; i++) {
    const locked = lockedPositions.find(pos => pos === i + 1);
    let color = generateColor();
    while (currentColors.includes(color)) {
      color = generateColor();
    }
    if (!locked) {
      setOneColor(color, i + 1);
    }
  }
};

const toggleLocked = e => {
  const position = $(e.target).closest('[data-id]').data('id');
  const locked = lockedPositions.find(pos => pos === position);
  if (locked) {
    lockedPositions = lockedPositions.filter(pos => pos !== position);
    $('[data-id=' + position + ']').find('img').attr('src', 'images/keep.svg');
  } else {
    lockedPositions = [...lockedPositions, position];
    $('[data-id=' + position + ']').find('img').attr('src', 'images/locked.svg');
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
};

const loadPalettes = projectId => {
  const currentProjectPalette = getPalette(projectId);
};

const getProjects = () => {
  return fetch('/api/v1/projects').then(response => response.json()).then(parsedResponse => parsedResponse);
};

const getPalette = projectId => {
  return fetch(`/api/v1/projects/${projectId}/palettes`).then(response => response.json()).then(parsedResponse => parsedResponse);
};

$(window).on('load', () => {
  buildProjectsMenu();
});
$('[name="shuffle-colors"]').on('click', shuffleColors);
$('.lock').on('click', toggleLocked);

/***/ })
/******/ ]);