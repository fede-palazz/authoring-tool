import Modeler from 'bpmn-js/lib/Modeler';
import Viewer from 'bpmn-js/lib/Viewer';
import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer';
import BLANK_DIAGRAM from './assets/diagrams/new-diagram.bpmn';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';

// Editor type
let editor;
// Command stack
let commandStack;
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
      });
      break;
    case 'v': // Viewer
      editor = new Viewer({
        container: `#${canvas}`,
        keyboard: {
          bindTo: document,
        },
      });
      break;
    case 'n': // NavigatedViewer
      editor = new NavigatedViewer({
        container: `#${canvas}`,
        keyboard: {
          bindTo: document,
        },
      });
      break;
  }
  // Initialize commandStack
  commandStack = editor.get('commandStack');
}

/**
 * Export the current diagram into its xml representation
 * @returns {String} XML Encoded BPMN diagram
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

export {
  createEditor,
  exportDiagram,
  fetchAndDisplay,
  displayBlankDiagram,
  undoAction,
  redoAction,
};
