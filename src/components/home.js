import * as router from '../helpers/router';
import * as storageHandler from '../helpers/storageHandler';

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
    console.log(storageHandler.getDiagramsList());
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
      .addEventListener('change', importDiagram);
  },
};

function newDiagram(e) {
  e.stopPropagation();
  router.navigate('/m');
}

function importDiagram(e) {
  const importDiagBtnHidden = e.target;
  // Null check for the selected file diagram
  if (!importDiagBtnHidden.files) return;
  // Diagram XML
  const file = importDiagBtnHidden.files[0];
  // Diagram name
  let fileName = importDiagBtnHidden.value;
  // Remove fake path
  fileName = fileName
    .substring(fileName.lastIndexOf('\\') + 1)
    .replace(/ /g, '_');

  // File extension check
  if (fileName.split('.').pop() !== 'bpmn') {
    alert('Only files with .bpmn extension can be submitted!');
    // Reset the file choice
    importDiagBtnHidden.value = '';
    return;
  }
  // Fetch and save opened diagram inside local storage
  fetchAndSave(fileName, file);
}

function fetchAndSave(fileName, file) {
  if (!file) throw new Error('Error: received file is null!');
  let fr = new FileReader();

  // Load event: reading finished, no errors
  fr.onload = () => {
    // Save diagram to local storage
    const id = storageHandler.saveDiagram(fileName, fr.result);
    // Pass the diagram id to the editor
    router.navigate(`/v?${id}`);
  };
  // Error occured during file reading
  fr.onerror = (err) => {
    throw new Error('An error occured during file reading: ' + err);
  };
  // Read the .bpmn file as plain text
  fr.readAsText(file);
}

export { HomeComponent };
