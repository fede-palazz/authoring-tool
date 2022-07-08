const HomeComponent = {
  render: () => {
    return `
        <div id="home-container">
          <div id="recent-files-container">
            <h2 class="subtitle">Recently opened</h2>
            <hr>
              <ul id="recent-files">
                <li class="recent-files-item">Ciaooo</li>
                <li class="recent-files-item">Ciaooo</li>
                <li class="recent-files-item">Ciaooo</li>
              </ul>
          </div>
          <div class="home-toolbar">
            <!-- Create blank diagram button -->
            <button id="newDiag" class="home-icon-btn">
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
    document.querySelector('p').addEventListener('click', () => {
      console.log('Homepage event listener');
    });
    /**
     * Undo / Redo action event listener
     */
    document.addEventListener('keydown', undo);
  },
  destroy() {
    document.removeEventListener('keydown', undo);
  },
};

function undo(e) {
  if (e.ctrlKey && e.key === 'z') console.log('Undo');
  else if (e.ctrlKey && e.key === 'y') console.log('redo');
}

export { HomeComponent };
