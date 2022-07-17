import * as diagHandler from '../helpers/diagramHandler';
import * as storageHandler from '../helpers/storageHandler';
import * as router from '../helpers/router';

const CANVAS_ID = 'canvas';
const EDITOR_MODE = 'v';

const ViewerComponent = {
  render() {
    return `   
      <div id="canvas"></div>
  
      <!-- Bottom toolbar -->
        <div class="toolbar sub-toolbar" id="toolbar">
        
          <!-- Export diagram (BPMN) button -->
          <a class="hidden-link" id="exportDiag" download="diagram.bpmn"
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
          <a class="hidden-link" id="exportDiagSvg" download="diagram.svg"
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
  init(diagName = '') {
    this.setListeners();
    initializeCanvas();
    if (storageHandler.exists(diagName))
      diagHandler.displayDiagram(storageHandler.loadDiagram(diagName));
    else router.navigate('/');
  },
  setListeners() {
    /**
     * Export BPMN button event listener
     */
    document.querySelector('#exportDiag').addEventListener('click', () => {
      const exportDiagBtn = document.querySelector('#exportDiag');
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
    document.querySelector('#exportDiagSvg').addEventListener('click', () => {
      const exportDiagSvgBtn = document.querySelector('#exportDiagSvg');
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
     * Change diagram zoom event listener
     */
    document.querySelectorAll('div.zoom-bar > button').forEach((elem) => {
      elem.addEventListener('click', () => {
        handleZoom(elem);
      });
    });
  },
};

/**
 * Initialize a blank canvas
 */
function initializeCanvas() {
  // Instantiate the modeler
  diagHandler.createEditor(EDITOR_MODE, CANVAS_ID, handleEvents);
  // Load the blank diagram template
  diagHandler.displayBlankDiagram();
}

/**
 * Callback function used to handle diagram events
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
 * @param {Boolean} hide If true, hide the bottom toolbar, otherwise display it
 */
function toggleToolbar(hide) {
  const toolbar = document.querySelector('#toolbar');
  hide ? toolbar.classList.add('hidden') : toolbar.classList.remove('hidden');
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

export { ViewerComponent };
