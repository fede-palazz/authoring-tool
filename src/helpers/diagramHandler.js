import Modeler from 'bpmn-js/lib/Modeler';
import Viewer from 'bpmn-js/lib/Viewer';
import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer';
import TokenSimulationViewer from 'bpmn-js-token-simulation/lib/viewer';
import TokenSimulationModeler from 'bpmn-js-token-simulation/lib/modeler';
import BLANK_DIAGRAM from '../assets/diagrams/new-diagram.bpmn';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css';

let editor;
let commandStack;
let zoomScroll;
// Current diagram mode
//let mode = ""; TODO: Work on diagram toggle mode

/**
 * Instantiate a new BPMN Editor
 * @param {String} editorMode Editor typology {"v": Viewer, "n": NavigatedViewer, "m": Modeler}
 * @param {String} canvas Canvas container id
 */
function createEditor(editorMode, canvas, callback) {
  if (editor !== undefined) return;
  switch (editorMode) {
    case 'm': // Modeler
      editor = new Modeler({
        container: `#${canvas}`,
        keyboard: {
          bindTo: document,
        },
        additionalModules: [TokenSimulationModeler],
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
        additionalModules: [TokenSimulationViewer],
      });
      break;
    case 'n': // NavigatedViewer
      editor = new NavigatedViewer({
        container: `#${canvas}`,
        keyboard: {
          bindTo: document,
        },
        additionalModules: [TokenSimulationViewer],
      });
      break;
  }
  zoomScroll = editor.get('zoomScroll');

  // Set diagram events callback
  eventsListener(callback);
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

function eventsListener(callback) {
  editor.on('tokenSimulation.toggleMode', (event) => {
    callback('toggleSimulation', event);
  });
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
