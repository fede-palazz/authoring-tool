import * as diagService from '../helpers/diagramService';
import * as storageService from '../helpers/storageService';
import * as apiService from '../helpers/apiService';
import * as router from '../helpers/router';

const CANVAS_ID = 'canvas';

const ViewerComponent = {
  render() {
    return `   
      <div id="canvas" class="canvas">
      
        <!-- Bottom toolbar -->
          <div class="toolbar sub-toolbar" id="toolbar">
          
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
        
        <!-- Lateral edit bar -->
        <div class="edit-bar">
          <!-- Deploy diagram button -->
          <button class="icon-btn" id="deployDiagBtn">
              <span
                class="material-icons md-light"
                alt="Deploy diagram"
                title="Deploy diagram"
                >publish</span
              >
          </button>

          <!-- Edit diagram button -->
          <button class="icon-btn" id="editDiagBtn">
              <span
                class="material-icons md-light"
                alt="Edit diagram"
                title="Edit diagram"
                >edit</span
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
      </div>

          `;
  },
  init(diagId) {
    this.setListeners();
    initializeCanvas();
    if (storageService.exists(diagId)) {
      diagService.displayDiagram(storageService.getDiagram(diagId));
      // Set correct diagram name when exporting it
      setExportedDiagName(storageService.getDiagramName(diagId));
    } else router.navigate('/');
  },
  setListeners() {
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
     * Change diagram zoom event listener
     */
    document.querySelectorAll('div.zoom-bar > button').forEach((elem) => {
      elem.addEventListener('click', () => {
        handleZoom(elem);
      });
    });

    /**
     * Switch to edit mode event listener
     */
    document
      .getElementById('editDiagBtn')
      .addEventListener('click', editDiagram);

    /**
     * Deploy current diagram to the Teaming Engine
     */
    document
      .getElementById('deployDiagBtn')
      .addEventListener('click', deployDiagram);
  },
};

/**
 * Initialize a blank canvas
 */
function initializeCanvas() {
  // Instantiate the modeler
  diagService.createViewer(CANVAS_ID, handleEvents);
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
 * Export diagram in .bpmn format
 */
function exportDiag() {
  const exportDiagBtn = document.querySelector('#exportDiag');
  diagService
    .exportDiagram(true)
    .then((xmlDiag) => {
      // Make the href attribute point to the diagram xml
      exportDiagBtn.setAttribute(
        'href',
        'data:application/bpmn20-xml;charset=UTF-8,' +
          encodeURIComponent(xmlDiag)
      );
      // Wait 10ms
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 10);
      });
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
      return new Promise((resolve) => setTimeout(resolve, 10));
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

/**
 * Switch to edit diagram mode
 */
function editDiagram() {
  const diagId = router.getCurrentDiagId();
  router.navigate(`/m?${diagId}`);
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

export { ViewerComponent };
