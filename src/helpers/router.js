import { HomeComponent } from '../components/home';
import { ViewerComponent } from '../components/viewer';
import { ModelerComponent } from '../components/modeler';

// Define router routes
const routes = [
  { path: '/', component: HomeComponent },
  { path: '/v', component: ViewerComponent },
  { path: '/m', component: ModelerComponent },
];
// Component currently displayed
let currentComponent;

export default function () {
  // Remove global event listeners
  if (currentComponent) currentComponent.destroy();

  // Current path
  const path = parseLocation();
  // Find the component based on the current path
  currentComponent = findComponentByPath(path, routes);

  // App's root element
  const app = document.getElementById('app');
  while (app.hasChildNodes()) {
    app.removeChild(app.firstChild);
  }

  // Render the component in the "app" placeholder
  app.innerHTML = currentComponent.render();

  // Inizialize the component
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
  const route =
    routes.find((r) => r.path.match(new RegExp(`^\\${path}$`, 'gm'))) ||
    undefined;
  return route ? route.component : HomeComponent;
}
