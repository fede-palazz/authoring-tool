let diagrams;
const ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const ID_LENGTH = 15;

/**
 * Initialize the diagrams array by getting them from local storage
 */
function init() {
  diagrams = JSON.parse(localStorage.getItem('diagrams')) || [];
}

/**
 * Save and serialize a new diagram and return its id
 * @param {String} name
 * @param {XMLDocument} diagram
 * @returns Diagram id
 */
function saveDiagram(name, diagram) {
  const id = generateId();
  diagrams.push({
    name,
    diagram,
    id,
  });
  serializeDiagrams();
  return id;
}

/**
 * Update a saved XML diagram
 * @param {String} id Diagram id to update
 * @param {XMLDocument} diagram Updated XML diagram
 */
function updateDiagram(id, diagram) {
  getDiagramObj(id).diagram = diagram;
  serializeDiagrams();
}

/**
 * Get the in-memory array of saved diagrams
 * @returns Diagrams array (name, id)
 */
function getDiagramsList() {
  const diagramList = [];
  diagrams.forEach((diagram) => {
    diagramList.push({
      name: diagram.name,
      id: diagram.id,
    });
  });
  return diagramList;
}

/**
 * Save the in-memory diagrams array to the localstorage
 */
function serializeDiagrams() {
  localStorage.setItem('diagrams', JSON.stringify(diagrams));
}

/**
 * Permanently delete a saved diagram
 * @param {String} id Diagram id to delete
 */
function deleteDiagram(id) {
  diagrams = diagrams.filter((elem) => elem.id !== id);
  serializeDiagrams();
}

/**
 * Clear the in-memory diagrams array
 */
function clear() {
  diagrams = [];
}

/**
 * Get a saved diagram's name
 * @param {String} id Diagram id
 * @returns Diagram name
 */
function getName(id) {
  return getDiagramObj(id)?.name;
}

/**
 * Get the XML diagram representation
 * @param {String} id Diagram id
 * @returns Requested XML diagram
 */
function getDiagram(id) {
  return getDiagramObj(id)?.diagram;
}

/**
 * Get a saved diagram object
 * @param {String} id Diagram id
 * @returns Diagram object
 */
function getDiagramObj(id) {
  return diagrams.find((elem) => elem.id === id);
}

/**
 * Check whether a diagram with the specified id exists
 * @param {String} id
 * @returns True if the diagram exists, false otherwise
 */
function exists(id) {
  return getDiagramObj(id) ? true : false;
}

/**
 * Generate a fixed length random string id
 * @returns Random id
 */
function generateId() {
  let id = '';
  for (var i = 0; i < ID_LENGTH; i++)
    id += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  return id;
}

init();

export {
  saveDiagram,
  updateDiagram,
  getName,
  getDiagram,
  getDiagramsList,
  deleteDiagram,
  clear,
  exists,
};
