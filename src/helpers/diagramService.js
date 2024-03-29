import Modeler from 'bpmn-js/lib/Modeler';
import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer';
import TokenSimulationViewer from 'bpmn-js-token-simulation/lib/viewer';
import TokenSimulationModeler from 'bpmn-js-token-simulation/lib/modeler';
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule,
} from 'bpmn-js-properties-panel';
import camundaModdleDescriptors from 'camunda-bpmn-moddle/resources/camunda'; // use Camunda BPMN namespace
import BLANK_DIAGRAM from '../assets/diagrams/new-diagram.bpmn';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css';
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';

// Current editor instance (either Modeler or Viewer)
let editor;
// Current editor mode {"v": Viewer, "m": Modeler}
let editorMode;
let commandStack; // Modeler only
let zoomScroll; // Viewer and Modeler

/**
 * Instantiate a new BPMN Viewer
 * @param {String} canvas Canvas container id
 * @param {function} callback Diagram events handler
 */
function createViewer(canvas, callback) {
  // Set editor as Viewer
  editorMode = 'v';
  editor = new NavigatedViewer({
    container: `#${canvas}`,
    keyboard: {
      bindTo: document,
    },
    additionalModules: [TokenSimulationViewer],
  });
  // Initialize control variables
  zoomScroll = editor.get('zoomScroll');
  // Set diagram events callback
  eventsListener(editor, callback);
}

/**
 * Instantiate a new BPMN Modeler
 * @param {String} canvasId Canvas container id
 * @param {String} panelId Properties panel container id
 * @param {function} callback Diagram events handler
 */
function createModeler(canvasId, panelId, callback) {
  // Set editor as Modeler
  editorMode = 'm';
  editor = new Modeler({
    container: `#${canvasId}`,
    propertiesPanel: {
      parent: `#${panelId}`,
    },
    keyboard: {
      bindTo: document,
    },
    additionalModules: [
      TokenSimulationModeler,
      BpmnPropertiesPanelModule,
      BpmnPropertiesProviderModule,
      CamundaPlatformPropertiesProviderModule,
    ],
    moddleExtensions: {
      camunda: camundaModdleDescriptors,
    },
  });
  // Initialize control variables
  commandStack = editor.get('commandStack');
  // Initialize control variables
  zoomScroll = editor.get('zoomScroll');
  // Set diagram events callback
  eventsListener(editor, callback);
}

/**
 * Export the current diagram into its xml representation
 * @param {Boolean} format specify whether to format the XML output string
 * @returns {String} XML encoded BPMN diagram
 */
async function exportDiagram(format = false) {
  try {
    const { xml } = Boolean(format)
      ? await editor.saveXML({ format: true })
      : await editor.saveXML();
    return xml;
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
    return svg;
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
  if (!diagram || !editor) return;
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

function eventsListener(instance, callback) {
  instance.on('tokenSimulation.toggleMode', (event) => {
    callback('toggleSimulation', event);
  });
}

export {
  // createEditor,
  createViewer,
  createModeler,
  exportDiagram,
  exportDiagramSVG,
  fetchAndDisplay,
  displayBlankDiagram,
  displayDiagram,
  undoAction,
  redoAction,
  zoomIn,
  zoomOut,
  resetZoom,
};
