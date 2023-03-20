import * as diagService from '../helpers/diagramService';
import * as storageService from '../helpers/storageService';
import * as apiService from '../helpers/apiService';
import * as router from '../helpers/router';

const CANVAS_ID = 'canvas';
const EDITOR_MODE = 'm';

const ModelerComponent = {
  render() {
    return `
      <div id="${CANVAS_ID}"></div>
  
      <!-- Bottom toolbar -->
      <div class="toolbar" id="toolbar">
        <div class="sub-toolbar">
          <!-- Save diagram button -->
          <button id="saveDiag" class="icon-btn">
            <span
              class="material-icons md-light"
              alt="Save diagram"
              title="Save diagram"
            >
              save
            </span>
          </button>
  
          <!-- Save as new diagram button -->
          <button id="saveDiagAs" class="icon-btn">
            <span
              class="material-icons md-light"
              alt="Save as new diagram"
              title="Save diagram as"
            >
              save_as
            </span>
          </button>
        </div>

        <div class="sub-toolbar">
          <!-- Export diagram (BPMN) button -->
          <a class="hidden-link" id="exportDiag" download=""
            ><button class="icon-btn">
              <span
                class="material-icons md-light"
                alt="Export diagram as BPMN"
                title="Export diagram (BPMN)"
              >
                file_download
              </span>
            </button></a
          >
  
          <!-- Export diagram (SVG) button -->
          <a class="hidden-link" id="exportDiagSvg" download=""
            ><button class="icon-btn">
              <span
                class="material-icons md-light"
                alt="Export diagram as SVG"
                title="Export diagram (SVG)"
              >
                image
              </span>
            </button></a
          >
        </div>
      </div>

      <!-- Lateral edit bar -->
      <div class="edit-bar">
        <!-- Deploy diagram button -->
        <button class="icon-btn" id="deployDiag">
            <span
              class="material-icons md-light"
              alt="Deploy diagram"
              title="Deploy diagram"
              >publish</span
            >
        </button>
      </div>

      <!-- Lateral zoom bar -->
      <div class="zoom-bar">
        <!-- Reset zoom button -->
        <button class="icon-btn" name="resetZoomBtn">
          <span
            class="material-icons md-light"
            alt="Reset Zoom"
            title="Reset zoom"
            >center_focus_weak</span
          >
        </button>
  
        <!-- Zoom in button -->
        <button class="icon-btn" name="zoomInBtn">
          <span class="material-icons md-light" alt="Zoom In" title="Zoom in"
            >zoom_in</span
          >
        </button>
  
        <!-- Zoom out button -->
        <button class="icon-btn" name="zoomOutBtn">
          <span
            class="material-icons md-light"
            alt="Zoom Out"
            title="Zoom out"
            >zoom_out</span
          >
        </button>
      </div>
            `;
  },
  init(diagId = '') {
    this.setListeners();
    initializeCanvas();
    // diagId not null and valid
    if (diagId && storageService.exists(diagId)) {
      // load and display the diagram
      diagService.displayDiagram(storageService.getDiagram(diagId));
      // Set correct diagram name when exporting it
      setExportedDiagName(storageService.getDiagramName(diagId));
    }
    // diagId not null but invalid
    else if (diagId)
      // navigate to homepage
      router.navigate('/');
    // diagId is null
    else {
      // Remove save diagram button from DOM
      document.getElementById('saveDiag').remove();
      // Remove lateral edit bar from DOM
      document.querySelector('.edit-bar').remove();
      // Set default names for diagram export
      document.querySelector('#exportDiag').download = 'diagram.bpmn';
      document.querySelector('#exportDiagSvg').download = 'diagram.svg';
    }
  },
  setListeners() {
    /**
     * Save pending changes to current diagram
     */
    document.querySelector('#saveDiag').addEventListener('click', saveDiagram);

    /**
     * Save as new diagram event listener
     */
    document
      .querySelector('#saveDiagAs')
      .addEventListener('click', saveDiagramAs);

    /**
     * Export BPMN button event listener
     */
    document.querySelector('#exportDiag').addEventListener('click', exportDiag);

    /**
     * Export SVG button event listener
     */
    document
      .querySelector('#exportDiagSvg')
      .addEventListener('click', exportDiagSvg);

    /**
     * Undo / Redo action event listener
     */
    document.addEventListener('keydown', handleUndo);

    /**
     * Change diagram zoom event listener
     */
    document.querySelectorAll('div.zoom-bar > button').forEach((elem) => {
      elem.addEventListener('click', () => {
        handleZoom(elem);
      });
    });

    /**
     * On banner click event listener
     */
    document
      .querySelector('.title-container a')
      .addEventListener('click', preventNavigation);

    /**
     * Pending changes event listener
     */
    window.addEventListener('beforeunload', beforeUnload);

    /**
     * Deploy diagram event listener
     */
    document
      .getElementById('deployDiag')
      .addEventListener('click', deployDiagram);
  },
  destroy() {
    document.removeEventListener('keydown', handleUndo);
    window.removeEventListener('beforeunload', beforeUnload);
    document
      .querySelector('.title-container a')
      .removeEventListener('click', preventNavigation);
  },
};

/**
 * Initialize a blank canvas
 */
function initializeCanvas() {
  // Instantiate the modeler
  diagService.createEditor(EDITOR_MODE, CANVAS_ID, handleEvents);
  // Load the blank diagram template
  diagService.displayBlankDiagram();
}

/**
 * Callback function used to handle diagram events
 * @param {String} eventName
 * @param {Event} event
 */
function handleEvents(eventName, event) {
  switch (eventName) {
    case 'toggleSimulation':
      event.active ? toggleToolbars(true) : toggleToolbars(false);
      break;
  }
}

/**
 * Save current diagram's pending changes
 */
async function saveDiagram() {
  const diagram = await diagService.exportDiagram();
  const diagramId = router.getCurrentDiagId();
  // Update the current diagram
  storageService.updateDiagram(diagramId, diagram);
}

/**
 * Save current diagram as a new one
 */
async function saveDiagramAs() {
  // Prompt for new diagram name
  let diagramName = prompt('Type a name for this diagram');
  if (diagramName === null) return;
  while (diagramName === '') {
    diagramName = prompt('You need to insert a valid diagram name');
    if (diagramName === null) return;
  }
  // Replace periods and blank spaces with underscores
  diagramName = diagramName.replace(/\.| /g, '_');
  // Save current diagram
  const diagram = await diagService.exportDiagram();
  // Save diagram to localstorage
  const diagId = storageService.saveDiagram(diagramName, diagram);
  // Open the saved diagram
  router.navigate(`/m?${diagId}`);
}

/**
 * Export diagram in .bpmn format
 */
function exportDiag() {
  const exportDiagBtn = document.querySelector('#exportDiag');
  diagService
    .exportDiagram()
    .then((xmlDiag) => {
      // Make the href attribute point to the diagram xml
      exportDiagBtn.setAttribute(
        'href',
        'data:application/bpmn20-xml;charset=UTF-8,' +
          encodeURIComponent(xmlDiag)
      );
      // Wait 10ms
      return new Promise((resolve) => setTimeout(resolve, 10));
    })
    .then(() => {
      // Reset the href attribute of the anchor element
      exportDiagBtn.setAttribute('href', '');
    });
}

/**
 * Export diagram in .svg format
 */
function exportDiagSvg() {
  const exportDiagSvgBtn = document.querySelector('#exportDiagSvg');
  diagService
    .exportDiagramSVG()
    .then((svgDiag) => {
      // Make the href attribute point to the diagram xml
      exportDiagSvgBtn.setAttribute(
        'href',
        'data:application/bpmn20-xml;charset=UTF-8,' +
          encodeURIComponent(svgDiag)
      );
      // Wait 10ms
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 10);
      });
    })
    .then(() => {
      // Reset the href attribute of the anchor element
      exportDiagSvgBtn.setAttribute('href', '');
    });
}

/**
 * Set diagram name for the .bpmn and .svg export functions
 * @param {String} diagName Diagram name
 */
function setExportedDiagName(diagName) {
  document.querySelector('#exportDiag').download = `${diagName}.bpmn`;
  document.querySelector('#exportDiagSvg').download = `${diagName}.svg`;
}

/**
 * Prevent pending changes looses
 */
function preventNavigation() {
  if (confirm('Sure? Changes you made may not be saved')) router.navigate('/');
}

/**
 * Toggle bottom and lateral toolbar visibility
 * @param {Boolean} hide If true, hide the toolbars, otherwise display them
 */
function toggleToolbars(hide) {
  const toolbar = document.querySelector('#toolbar');
  const editbar = document.querySelector('.edit-bar');
  if (hide) {
    toolbar.classList.add('hidden');
    editbar.classList.add('hidden');
  } else {
    toolbar.classList.remove('hidden');
    editbar.classList.remove('hidden');
  }
}

/**
 * Handle the different types of zoom events
 * @param {HTMLElement} element HTML zoom button
 */
function handleZoom(element) {
  switch (element.name) {
    case 'resetZoomBtn':
      diagService.resetZoom();
      break;
    case 'zoomInBtn':
      diagService.zoomIn();
      break;
    case 'zoomOutBtn':
      diagService.zoomOut();
      break;
  }
}

function handleUndo(e) {
  if (e.ctrlKey && e.key === 'z') diagService.undoAction();
  else if (e.ctrlKey && e.key === 'y') diagService.redoAction();
}

function deployDiagram() {
  const diagId = router.getCurrentDiagId();
  const diagram = storageService.getDiagram(diagId);
  const diagramName = storageService.getDiagramName(diagId);

  // Teaming Engine API call
  apiService
    .deployDiagram(diagram, diagId, diagramName)
    .then((result) => console.log(result));
}

/**
 * Prevent the loss of current pending changes
 * @param {Event} e
 */
function beforeUnload(e) {
  e.preventDefault();
  // e.returnValue = '';
}

export { ModelerComponent };
