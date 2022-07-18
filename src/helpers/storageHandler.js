let diagrams;
const ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const ID_LENGTH = 15;

function init() {
  diagrams = JSON.parse(localStorage.getItem('diagrams')) || [];
}

/**
 * Save
 * @param {*} name
 * @param {*} diagram
 * @returns
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

function updateDiagram(id, diagram) {
  getDiagramObj(id).diagram = diagram;
  serializeDiagrams();
}

function getDiagram(id) {
  return getDiagramObj(id)?.diagram;
}

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

function serializeDiagrams() {
  localStorage.setItem('diagrams', JSON.stringify(diagrams));
}

function deleteDiagram(id) {
  diagrams = diagrams.filter((elem) => elem.id !== id);
  serializeDiagrams();
}

function getName(id) {
  return getDiagramObj(id)?.name;
}

function getDiagramObj(id) {
  return diagrams.find((elem) => elem.id === id);
}

function exists(id) {
  return getDiagramObj(id) ? true : false;
}

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
  exists,
};
