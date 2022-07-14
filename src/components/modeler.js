import * as diagHandler from '../helpers/diagramHandler';

const CANVAS_ID = 'canvas';
const EDITOR_MODE = 'm';

const ModelerComponent = {
  render() {
    return `
               
      <div id="${CANVAS_ID}"></div>
  
      <!-- Bottom toolbar -->
      <div class="toolbar" id="toolbar">
        <div class="sub-toolbar">
          <!-- Create blank diagram button -->
          <button id="newDiag" class="icon-btn">
            <span
              class="material-icons md-light"
              alt="New diagram"
              title="Create blank diagram"
            >
              add_circle
            </span>
          </button>
  
          <!-- Import local diagram button -->
          <button id="importDiag" class="icon-btn">
            <span
              class="material-icons md-light"
              alt="Import diagram"
              title="Import local diagram"
            >
              file_upload
            </span>
            <input id="importDiagHidden" type="file" accept=".bpmn" hidden />
          </button>
        </div>
        <div class="sub-toolbar">
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
    //TODO: if diagName != '', then check for a saved diagram with that name
    this.setListeners();
    initializeCanvas();
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
     * Ask to save/discard pending changes to the diagram
     */
    // window.addEventListener('beforeunload', (event) => {
    //   event.preventDefault();
    //   event.returnValue = '';
    // });
  },
  destroy() {
    /**
     * Undo / Redo action event listener
     */
    document.removeEventListener('keydown', handleUndo);

    // window.removeEventListener('beforeunload', (event) => {
    //   event.preventDefault();
    //   event.returnValue = '';
    // });
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
  console.log(toolbar);
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

function handleUndo(e) {
  if (e.ctrlKey && e.key === 'z') diagHandler.undoAction();
  else if (e.ctrlKey && e.key === 'y') diagHandler.redoAction();
}

export { ModelerComponent };
