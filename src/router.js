import { HomeComponent } from './components/home';
import { ViewerComponent } from './components/viewer';
import { ModelerComponent } from './components/modeler';

// Define router routes
const routes = [
  { path: '/', component: HomeComponent },
  { path: '/v', component: ViewerComponent },
  { path: '/m', component: ModelerComponent },
];
let currentComponent = HomeComponent;

export default function () {
  // Find the component based on the current path
  const path = parseLocation();

  // If there's no matching route, get the "Error" component
  //   const { component = HomeComponent } = findComponentByPath(path, routes) || {};
  // Remove global event listeners
  currentComponent.destroy();
  currentComponent =
    findComponentByPath(path, routes).component || HomeComponent;

  const app = document.getElementById('app');
  while (app.hasChildNodes()) {
    app.removeChild(app.firstChild);
  }

  // Render the component in the "app" placeholder
  app.innerHTML = currentComponent.render();

  currentComponent.init();
}

/**
 * Extract the path from the hash portion of the url
 * @returns {String} path
 */
function parseLocation() {
  return location.hash.slice(1).substring(0, 2).toLowerCase() || '/';
}

function findComponentByPath(path, routes) {
  return (
    routes.find((r) => r.path.match(new RegExp(`^\\${path}$`, 'gm'))) ||
    undefined
  );
}
