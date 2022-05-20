import * as diagHandler from './diagramHandler';
import './style.css';

// Canvas id
const CANVAS = 'canvas';
const DEFAULT_MODE = 'm';

// Get UI components
const importDiagBtn = document.querySelector('#importDiag');
const exportDiagBtn = document.querySelector('#exportDiag');
const exportDiagSvgBtn = document.querySelector('#exportDiagSvg');

/**
 * Inizialitazion function: creates a new Editor based on the DEFAULT_MODE constant and displays a blank diagram
 */
function initializeCanvas() {
  // Instantiate the editor
  diagHandler.createEditor(DEFAULT_MODE, CANVAS);
  // Load the blank diagram template
  diagHandler.displayBlankDiagram();
}

/**
 * Diagram import event listener
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
 * Export BPMN diagram event listener
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
 * Export SVG diagram event listener
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

/**
 * Undo / Redo action event listener
 */
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'z') diagHandler.undoAction();
  else if (e.ctrlKey && e.key === 'y') diagHandler.redoAction();
});

initializeCanvas();
