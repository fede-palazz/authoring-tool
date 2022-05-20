import * as diagHandler from './diagramHandler';
import './style.css';

// Canvas id
const CANVAS = 'canvas';
const DEFAULT_MODE = 'm';

// Get UI components
const importDiagBtn = document.querySelector('#importDiag');
const exportDiagBtn = document.querySelector('#exportDiag');
const exportDiagSvgBtn = document.querySelector('#exportDiagSvg');
const zoomBar = document.querySelector('.zoom-bar');

// ***************
// ** FUNCTIONS **
// ***************

/**
 * Initialize a blank canvas
 */
function initializeCanvas() {
  // Instantiate the editor
  diagHandler.createEditor(DEFAULT_MODE, CANVAS);
  // Load the blank diagram template
  diagHandler.displayBlankDiagram();
}

// *********************
// ** EVENT LISTENERS **
// *********************

/**
 * Import diagram button event listener
 */
importDiagBtn.addEventListener('change', () => {
  // Null check for the selected file diagram
  if (!importDiagBtn.files) return;

  // File extension check
  const fileName = importDiagBtn.value;
  if (fileName.split('.').pop() !== 'bpmn') {
    alert('Only files with .bpmn extension can be submitted!');
    // Reset the file choice
    importDiagBtn.value = '';
    return;
  }
  // Read the selected local diagram and display it
  diagHandler.fetchAndDisplay(importDiagBtn.files[0]);
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
zoomBar.addEventListener('click', (e) => {
  switch (e.target.name) {
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
});

initializeCanvas();
