//import Modeler from "bpmn-js/lib/Modeler";
import BpmnViewer from "bpmn-js/lib/Viewer";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "./style.css";
import diagram from "./assets/pizza-diagram.bpmn";

var viewer = new BpmnViewer({ container: "#canvas" });

// create a modeler
//const modeler = new Modeler({ container: "#canvas" });

function fetchDiagram(url) {
  return fetch(url).then((response) => response.text());
}

async function loadDiagram() {
  //const diagram = await fetchDiagram("./pizza-diagram.bpmn");

  try {
    await viewer.importXML(diagram);
    viewer.get("canvas").zoom("fit-viewport");
  } catch (err) {
    console.log("Error", err);
  }
}

loadDiagram();
console.log("Funzia");
