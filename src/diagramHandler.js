import Modeler from 'bpmn-js/lib/Modeler';
import Viewer from 'bpmn-js/lib/Viewer';
import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer';
import TokenSimulationModule from 'bpmn-js-token-simulation';
import BLANK_DIAGRAM from './assets/diagrams/new-diagram.bpmn';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';

let editor;
let commandStack;
let zoomScroll;
// Current diagram file
let diagramFile = null;
// Current diagram mode
//let mode = ""; TODO: Work on diagram toggle mode

/**
 * Instantiate a new BPMN Editor
 * @param {String} editorMode Editor typology: "v: Viewer, "n": NavigatedViewer, "m": Modeler
 * @param {String} canvas Canvas container id
 */
function createEditor(editorMode, canvas) {
  if (editor !== undefined) return;
  switch (editorMode) {
    case 'm': // Modeler
      editor = new Modeler({
        container: `#${canvas}`,
        keyboard: {
          bindTo: document,
        },
        additionalModules: [TokenSimulationModule],
      });
      // Initialize control variables
      commandStack = editor.get('commandStack');
      break;
    case 'v': // Viewer
      editor = new Viewer({
        container: `#${canvas}`,
        keyboard: {
          bindTo: document,
        },
        additionalModules: [TokenSimulationModule],
      });
      break;
    case 'n': // NavigatedViewer
      editor = new NavigatedViewer({
        container: `#${canvas}`,
        keyboard: {
          bindTo: document,
        },
        additionalModules: [TokenSimulationModule],
      });
      break;
  }
  zoomScroll = editor.get('zoomScroll');
}

/**
 * Export the current diagram into its xml representation
 * @returns {String} XML encoded BPMN diagram
 */
async function exportDiagram() {
  try {
    const { xml } = await editor.saveXML();
    return encodeURIComponent(xml);
  } catch (err) {
    console.log('Failed to serialize BPMN 2.0 xml', err);
  }
}

/**
 * Export the current diagram as svg xml representation
 * @returns {String} XML encoded SVG diagram
 */
async function exportDiagramSVG() {
  try {
    const { svg } = await editor.saveSVG();
    return encodeURIComponent(svg);
  } catch (err) {
    console.log('Failed to serialize SVG xml', err);
  }
}

/**
 * Fetch a local diagram and display it to the canvas
 * @param {File} file
 */
function fetchAndDisplay(file) {
  if (!file) throw new Error('Error: received file is null!');

  // Save current diagram file
  // Maybe it's better to save only the fileName (input value)
  diagramFile = file; // TODO: Am I going to use this?

  let fr = new FileReader();

  // Load event: reading finished, no errors
  fr.onload = () => {
    // Display the diagram
    displayDiagram(fr.result);
  };

  // Error occured during file reading
  fr.onerror = (err) => {
    throw new Error('An error occured during file reading: ' + err);
  };

  // Read the .bpmn file as plain text
  fr.readAsText(file);
}

/**
 * Override the current diagram with a blank canvas
 */
function displayBlankDiagram() {
  if (editor) displayDiagram(BLANK_DIAGRAM);
  else throw new Error('Editor is not defined!');
}

/**
 * Display a bpmn diagram passed as XML text
 * @param {String} diagram
 */
async function displayDiagram(diagram) {
  if (!diagram) return;
  try {
    await editor.importXML(diagram);
    editor.get('canvas').zoom('fit-viewport');
  } catch (err) {
    console.log(err);
  }
}

function undoAction() {
  commandStack.undo();
}

function redoAction() {
  commandStack.redo();
}

function zoomIn() {
  zoomScroll.stepZoom(1);
}

function zoomOut() {
  zoomScroll.stepZoom(-1);
}

function resetZoom() {
  zoomScroll.reset();
}

export {
  createEditor,
  exportDiagram,
  exportDiagramSVG,
  fetchAndDisplay,
  displayBlankDiagram,
  undoAction,
  redoAction,
  zoomIn,
  zoomOut,
  resetZoom,
};
