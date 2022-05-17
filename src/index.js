import Modeler from "bpmn-js/lib/Modeler";
import BpmnViewer from "bpmn-js/lib/Viewer";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "./style.css";

// var viewer = new BpmnViewer({ container: "#canvas" });

// Create a Modeler instance
const viewer = new Modeler({ container: "#canvas" });
const uploadField = document.querySelector("#uploadDiag");
const downloadBtn = document.querySelector("#downloadDiag");

// ********************
// ** DIAGRAM UPLOAD **
// ********************

/**
 * File upload event listener
 */
uploadField.addEventListener("change", () => {
  // Null check for selected diagram
  if (!uploadField.files) return;

  // File extension check
  const fileName = uploadField.value;
  if (fileName.split(".").pop() !== "bpmn") {
    alert("Only .bpmn files can be submitted!");
    // Reset the file choice
    uploadField.value = "";
    return;
  }
  // Read the selected local diagram and display it
  fetchAndDisplay(uploadField.files[0]);
});

/**
 * Fetch a local diagram and display it to the canvas
 * @param {File} file
 */
function fetchAndDisplay(file) {
  if (!file) throw new Error("Error: received file is null!");

  let fr = new FileReader();

  // Load event: reading finished, no errors
  fr.onload = () => {
    // Display the diagram
    displayDiagram(fr.result);
  };

  // Error occured during file reading
  fr.onerror = (err) => {
    throw new Error("An error occured during file reading: " + err);
  };

  // Read the .bpmn file as plain text
  fr.readAsText(file);
}

/**
 * Display a bpmn diagram passed as XML text
 * @param {String} diagram
 */
async function displayDiagram(diagram) {
  if (!diagram) return;
  try {
    await viewer.importXML(diagram);
    viewer.get("canvas").zoom("fit-viewport");
  } catch (err) {
    console.log(err);
  }
}
