import * as router from '../helpers/router';
import * as storageHandler from '../helpers/storageHandler';

const HomeComponent = {
  render: () => {
    return `
        <div id="home-container">
          <div id="recent-diagrams-container">
            <h2 class="subtitle">Recently opened</h2>
            <div id="no-diagrams-message">
            <p>Nothing to show here...</p>
            <p>Try to create a new diagram or opening an existing one</p>
            </div>
              <ul id="recent-diagrams-list">
                <template id="list-item-template">
                  <li class="recent-diagrams-item">
                    <p>New diagram</p>
                    <span
                      class="material-icons md-dark"
                    >
                    delete
                    </span>
                  </li>
                </template>
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
    displayRecentDiagrams();
    this.setEventListeners();
  },
  setEventListeners() {
    /**
     * On delete diagram event listener
     */
    document
      .querySelectorAll('.recent-diagrams-item')
      .forEach((elem) => elem.addEventListener('click', openDiagram));

    /**
     * On delete diagram event listener
     */
    document
      .querySelectorAll('.recent-diagrams-item > span')
      .forEach((elem) => elem.addEventListener('click', deleteDiagram));

    /**
     * Create new blank diagram event listener
     */
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

/**
 * Fetch the selected local diagram and display it through the viewer
 * @param {Event} e
 */
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
    .replace(/ /g, '_') // Remove spaces
    .replace(/\(|\)/g, ''); // Remove brackets
  const extension = fileName.split('.').pop();

  // File extension check
  if (extension !== 'bpmn') {
    alert('Only files with .bpmn extension can be submitted!');
    // Reset the file choice
    importDiagBtnHidden.value = '';
    return;
  }
  // Remove extension from diagram name
  fileName = fileName.substring(0, fileName.lastIndexOf('.bpmn'));
  // Fetch and save opened diagram inside local storage
  fetchAndSave(fileName, file).then((diagId) => {
    // Pass the diagram id to the editor
    router.navigate(`/v?${diagId}`);
  });
}

/**
 * Read a local diagram file and save it to localstorage
 * @param {String} fileName
 * @param {File} file
 */
function fetchAndSave(fileName, file) {
  if (!file) throw new Error('Error: received file is null!');
  return new Promise((resolve, reject) => {
    let fr = new FileReader();
    // Load event: reading finished, no errors
    fr.onload = () => {
      // Save diagram to local storage and return its id
      resolve(storageHandler.saveDiagram(fileName, fr.result));
    };
    // Error occured during file reading
    fr.onerror = (err) => {
      reject(new Error('An error occured during file reading: ' + err));
    };
    // Read the .bpmn file as plain text
    fr.readAsText(file);
  });
}

/**
 * Display a list of recently opened diagrams
 */
function displayRecentDiagrams() {
  // Get template element
  const template = document.querySelector('#list-item-template');
  // Get diagrams list element
  const listElem = document.getElementById('recent-diagrams-list');
  // Fetch diagrams list
  const diagList = storageHandler.getDiagramsList();

  // Check whether the list is not empty
  if (diagList.length !== 0) {
    document.getElementById('no-diagrams-message').remove();
  } else return;

  diagList.forEach((elem) => {
    // Clone the template node
    const listItemElem = template.content.firstElementChild.cloneNode(true);
    // Set diagram id as data attribute
    listItemElem.dataset.diagId = elem.id;
    // Set diagram name
    listItemElem.querySelector('p').innerText = elem.name;
    // Append item to the list
    listElem.appendChild(listItemElem);
  });
}

/**
 * Delete the selected diagram from the list and the storage
 * @param {Event} e
 */
function deleteDiagram(e) {
  e.stopImmediatePropagation();
  // Fetch diagram id to delete
  const id = e.target.parentNode.dataset.diagId;
  storageHandler.deleteDiagram(id);
  // Refresh page
  router.navigate();
}

/**
 * Open the selected diagram with the viewer
 * @param {Event} e
 */
function openDiagram(e) {
  e.stopImmediatePropagation();
  router.navigate(`/v?${e.target.dataset.diagId}`);
}

export { HomeComponent };
