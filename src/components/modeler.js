import * as diagHandler from '../helpers/diagramHandler';

const ModelerComponent = {
  render() {
    return `
               
      <div id="canvas"></div>
  
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
  init(diagName = '') {},
  destroy() {},
};

export { ModelerComponent };
