const HomeComponent = {
  render: () => {
    return `
        <div id="home-container">
          <div id="recent-files-container">
            <h2 class="subtitle">Recently opened</h2>
            <hr>
              <ul id="recent-files-list">
                <li class="recent-files-item">Ciaooo</li>
                <li class="recent-files-item">Ciaooo</li>
                <li class="recent-files-item">Ciaooo</li>
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
            <button id="importDiag" class="home-icon-btn">
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
  },
  destroy() {},
};

function newDiagram() {
  history.replaceState(null, null, '#/v');
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}

export { HomeComponent };
