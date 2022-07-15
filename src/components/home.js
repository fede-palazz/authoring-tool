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
    this.setEventListeners();
  },
  setEventListeners() {
    document.querySelector('#newDiag').addEventListener('click', newDiagram);

    /**
     * Import diagram button event listener
     */
    document.querySelector('#importDiag').addEventListener('click', () => {
      document.querySelector('#importDiagHidden').click();
    });

    /**
     * Hidden file upload field event listener
     */
    document
      .querySelector('#importDiagHidden')
      .addEventListener('click', (event) => {
        event.stopPropagation();
      });

    /**
     * Hidden file upload field on file change event listener
     */
    document
      .querySelector('#importDiagHidden')
      .addEventListener('change', () => {
        const importDiagBtnHidden = document.querySelector('#importDiagHidden');
        // Null check for the selected file diagram
        if (!importDiagBtnHidden.files) return;

        // File extension check
        let fileName = importDiagBtnHidden.value;
        fileName = fileName
          .substring(fileName.lastIndexOf('\\') + 1)
          .replace(/ /g, '_');
        if (fileName.split('.').pop() !== 'bpmn') {
          alert('Only files with .bpmn extension can be submitted!');
          // Reset the file choice
          importDiagBtnHidden.value = '';
          return;
        }
        // Read the selected local diagram and display it
        //diagHandler.fetchAndDisplay(importDiagBtnHidden.files[0]);
        router.navigate(`/v?${fileName}`);
      });
  },
  destroy() {},
};

function newDiagram(e) {
  e.stopPropagation();
  router.navigate('/m');
}

export { HomeComponent };
