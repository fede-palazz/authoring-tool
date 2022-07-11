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

function navigate(hashUrl) {
  // Remove global event listeners
  if (currentComponent) currentComponent.destroy();

  // Parse the url
  const [path, diagName] = parseUrl(hashUrl);
  console.log(`${path}, ${diagName}`);

  // Find the component based on the current path
  currentComponent = findComponentByPath(path, routes);

  // Remove currently displayed component
  const app = document.getElementById('app');
  while (app.hasChildNodes()) {
    app.removeChild(app.firstChild);
  }

  // Render the new component in the "app" placeholder
  app.innerHTML = currentComponent.render();

  // Inizialize the component
  if (currentComponent != HomeComponent && diagName) {
    currentComponent.init(diagName);
    history.replaceState(null, null, `#${path}?${diagName}`);
  } else {
    currentComponent.init();
    history.replaceState(null, null, `#${path}`);
  }
}

function parseUrl(hashUrl) {
  // No path passed as param -> set to the current one
  if (!hashUrl) hashUrl = location.hash.slice(1);

  // Separate path and diagName (if present)
  const [path, diagName] =
    hashUrl.indexOf('?') != -1 ? hashUrl.split('?') : [hashUrl, ''];

  // Check for url validity
  return !isValidPath(path) ? ['/', ''] : [path, diagName];
}

function isValidPath(path) {
  return (
    routes.find((r) => r.path.match(new RegExp(`^\\${path}$`, 'gm'))) || false
  );
}

/**
 * Extract the path from the hash portion of the url
 * @returns {String} path
 */
// function parseLocation() {
//   return location.hash.slice(1).substring(0, 2).toLowerCase() || '/';
// }

function findComponentByPath(path, routes) {
  const route =
    routes.find((r) => r.path.match(new RegExp(`^\\${path}$`, 'gm'))) ||
    undefined;
  return route ? route.component : HomeComponent;
}

export { navigate };
