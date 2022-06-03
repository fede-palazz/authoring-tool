import * as diagHandler from './diagramHandler';
import 'bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css';
import './style.css';
import './assets/icons/zoom-in.svg';
import './assets/icons/zoom-out.svg';
import './assets/icons/reset-zoom.svg';
import './assets/icons/export-diag.svg';
import './assets/icons/export-svg.svg';
import './assets/icons/import-diag.svg';
import './assets/icons/new-diag.svg';

// Canvas id
const CANVAS = 'canvas';
// Editor default mode
const EDITOR_MODE = 'm';

// Get UI components
const newDiagBtn = document.querySelector('#newDiag');
const importDiagBtn = document.querySelector('#importDiag');
const importDiagBtnHidden = document.querySelector('#importDiagHidden');
const exportDiagBtn = document.querySelector('#exportDiag');
const exportDiagSvgBtn = document.querySelector('#exportDiagSvg');

// ***************
// ** FUNCTIONS **
// ***************

/**
 * Initialize a blank canvas
 */
function initializeCanvas() {
  // Instantiate the editor
  diagHandler.createEditor(EDITOR_MODE, CANVAS, handleEvents);
  // Load the blank diagram template
  diagHandler.displayBlankDiagram();
}

/**
 * Handle the different types of zoom events
 * @param {HTMLElement} element HTML zoom button
 */
function handleZoom(element) {
  switch (element.name) {
    case 'resetZoomBtn':
      diagHandler.resetZoom();
      break;
    case 'zoomInBtn':
      diagHandler.zoomIn();
      break;
    case 'zoomOutBtn':
      diagHandler.zoomOut();
      break;
  }
}

function loadBlankCanvas() {
  // TODO: Check whether the current diagram has pending changes
  diagHandler.displayBlankDiagram();
}

/**
 * Handle diagram specific events
 * @param {String} eventName
 * @param {Event} event
 */
function handleEvents(eventName, event) {
  switch (eventName) {
    case 'toggleSimulation':
      event.active ? toggleToolbar(true) : toggleToolbar(false);
      break;
  }
}

/**
 * Toggle bottom toolbar visibility
 */
function toggleToolbar(hide) {
  const toolbar = document.querySelector('#toolbar');
  hide ? toolbar.classList.add('hide') : toolbar.classList.remove('hide');
}

// *********************
// ** EVENT LISTENERS **
// *********************

/**
 * New diagram button event listener
 */
newDiagBtn.addEventListener('click', loadBlankCanvas);

/**
 * Import diagram button event listener
 */
importDiagBtn.addEventListener('click', () => {
  importDiagBtnHidden.click();
});

/**
 * Hidden file upload field event listener
 */
importDiagBtnHidden.addEventListener('click', (event) => {
  event.stopPropagation();
});

/**
 * Hidden file upload field on file change event listener
 */
importDiagBtnHidden.addEventListener('change', () => {
  // Null check for the selected file diagram
  if (!importDiagBtnHidden.files) return;

  // File extension check
  const fileName = importDiagBtnHidden.value;
  if (fileName.split('.').pop() !== 'bpmn') {
    alert('Only files with .bpmn extension can be submitted!');
    // Reset the file choice
    importDiagBtnHidden.value = '';
    return;
  }
  // Read the selected local diagram and display it
  diagHandler.fetchAndDisplay(importDiagBtnHidden.files[0]);
});

/**
 * Export BPMN button event listener
 */
exportDiagBtn.addEventListener('click', () => {
  diagHandler
    .exportDiagram()
    .then((xmlDiag) => {
      // Make the href attribute point to the diagram xml
      exportDiagBtn.setAttribute(
        'href',
        'data:application/bpmn20-xml;charset=UTF-8,' + xmlDiag
      );
    })
    .then(() => {
      // Wait 10ms
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 10);
      });
    })
    .then(() => {
      // Reset the href attribute of the anchor element
      exportDiagBtn.setAttribute('href', '');
    });
});

/**
 * Export SVG button event listener
 */
exportDiagSvgBtn.addEventListener('click', () => {
  diagHandler
    .exportDiagramSVG()
    .then((svgDiag) => {
      // Make the href attribute point to the diagram xml
      exportDiagSvgBtn.setAttribute(
        'href',
        'data:application/bpmn20-xml;charset=UTF-8,' + svgDiag
      );
    })
    .then(() => {
      // Wait 10ms
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 10);
      });
    })
    .then(() => {
      // Reset the href attribute of the anchor element
      exportDiagSvgBtn.setAttribute('href', '');
    });
});

/**
 * Undo / Redo action event listener
 */
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'z') diagHandler.undoAction();
  else if (e.ctrlKey && e.key === 'y') diagHandler.redoAction();
});

/**
 * Change diagram zoom event listener
 */
document.querySelectorAll('div.zoom-bar > button').forEach((elem) => {
  elem.addEventListener('click', () => {
    handleZoom(elem);
  });
});

// TODO: ask to save/discard pending changes to the diagram
// window.addEventListener('beforeunload', (event) => {
//   event.preventDefault();
//   event.returnValue = '';
//
// });

initializeCanvas();
