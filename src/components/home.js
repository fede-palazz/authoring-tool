import * as router from '../helpers/router';

const HomeComponent = {
  render: () => {
    return `
        <div id="home-container">
          <div id="recent-files-container">
            <h2 class="subtitle">Recently opened</h2>
            <hr>
              <ul id="recent-files-list">
                <li class="recent-files-item">diagram_1</li>
                <li class="recent-files-item">diagram_2</li>
                <li class="recent-files-item">diagram_3</li>
              </ul>
          </div>
          <div class="home-toolbar">
            <!-- Create blank diagram button -->
            <button id="new-diag-btn" class="home-icon-btn">
              <span
                class="material-icons md-light md-36"
                alt="New diagram"
                title="Create blank diagram"
              >
                add_circle
              </span>
              <p>New diagram </p>
            </button>
    
            <!-- Import local diagram button -->
            <button id="import-diag-btn" class="home-icon-btn">
              <span
                class="material-icons md-light md-36"
                alt="Import diagram"
                title="Import local diagram"
              >
                file_upload
              </span>
              <p>Open diagram</p>
              <input id="importDiagHidden" type="file" accept=".bpmn" hidden />
            </button>
          </div>
        </div>

      
      `;
  },
  init() {
    /*
     * EVENT LISTENERS
     */
    document
      .querySelector('#new-diag-btn')
      .addEventListener('click', newDiagram);
    document
      .querySelector('#import-diag-btn')
      .addEventListener('click', importDiagram);
  },
  destroy() {},
};

function newDiagram(e) {
  e.stopPropagation();
  router.navigate('/m');
}

function importDiagram(e) {
  e.stopPropagation();
  router.navigate('/v');
}

export { HomeComponent };
