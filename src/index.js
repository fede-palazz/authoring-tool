import * as diagHandler from "./diagramHandler";
import "./style.css";

// Canvas id
const CANVAS = "canvas";

// Get UI components
const importDiagBtn = document.querySelector("#importDiag");
const exportDiagBtn = document.querySelector("#exportDiag");

// Instantiate the editor
diagHandler.createEditor("m", CANVAS);

/**
 * Diagram import event listener
 */
importDiagBtn.addEventListener("change", () => {
  // Null check for selected diagram
  if (!importDiagBtn.files) return;

  // File extension check
  const fileName = importDiagBtn.value;
  if (fileName.split(".").pop() !== "bpmn") {
    alert("Only .bpmn files can be submitted!");
    // Reset the file choice
    importDiagBtn.value = "";
    return;
  }
  // Read the selected local diagram and display it
  diagHandler.fetchAndDisplay(importDiagBtn.files[0]);
});

/**
 * Export diagram event listener
 */
exportDiagBtn.addEventListener("click", () => {
  diagHandler
    .exportDiagram()
    .then((xmlDiag) => {
      // Make the href attribute point to the diagram xml
      exportDiagBtn.setAttribute(
        "href",
        "data:application/bpmn20-xml;charset=UTF-8," + xmlDiag
      );
    })
    .then(() => {
      // Wait 10ms
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 10);
      });
    })
    .then(() => {
      // Reset the href attribute of the anchor element
      exportDiagBtn.setAttribute("href", "");
    });
});
