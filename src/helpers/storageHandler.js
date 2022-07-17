let diagrams;

function init() {
  diagrams = JSON.parse(localStorage.getItem('diagrams')) || [];
}

function saveDiagram(name, diagram) {
  diagrams.push({
    name: name,
    diagram: diagram,
  });
  serializeDiagrams();
}

function loadDiagram(name) {
  return diagrams.find((elem) => elem.name === name)?.diagram;
}

function serializeDiagrams() {
  localStorage.setItem('diagrams', JSON.stringify(diagrams));
}

function exists(name) {
  return loadDiagram(name) ? true : false;
}

init();

export { saveDiagram, loadDiagram, exists };
