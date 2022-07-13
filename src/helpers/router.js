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

/**
 * Navigate to the specified hash URL and display the corresponding component
 * @param {String} hashUrl Hash portion of the URL
 */
function navigate(hashUrl = '') {
  // Get path and diagName from the hash URL
  const [path, diagName] = parseUrl(hashUrl);

  // Remove global event listeners
  if (currentComponent) currentComponent.destroy();
  // Find the component based on the current path
  currentComponent = findComponentByPath(path);

  // Remove currently displayed component
  const app = document.getElementById('app');
  while (app.hasChildNodes()) app.removeChild(app.firstChild);

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

/**
 * Parse the submitted hash URL and split it into path and diagram name parts. Use the current one if a blank URL is provided.
 * @param {String} hashUrl Hash portion of the URL
 * @returns {Array} Splitted hash URL: [path, diagName]
 */
function parseUrl(hashUrl) {
  // No hash URL passed to the router, set to the current one
  if (!hashUrl) hashUrl = location.hash.slice(1);

  // Separate path and diagName (if present)
  const [path, diagName] =
    hashUrl.indexOf('?') != -1 ? hashUrl.split('?') : [hashUrl, ''];

  // Check for path validity
  return !isValidPath(path) || path === '/' ? ['/', ''] : [path, diagName];
}

/**
 * Check whether a path is valid or not
 * @param {String} path Path portion of the hash URL
 * @returns {Boolean} True if the path passed as parameter is valid, false otherwise
 */
function isValidPath(path) {
  return getRouteByPath(path) ? true : false;
}

/**
 * Get the component that matches the path
 * @param {String} path Path portion of the hash URL
 * @returns {Object} Requested component whether a match is found (if the path is not correct, return HomeComponent)
 */
function findComponentByPath(path) {
  return getRouteByPath(path)?.component || HomeComponent;
}

/**
 * Search for a match within the routes array and return the corresponding route
 * @param {String} path Path that has to match with the one of a route entry
 * @returns {Object || undefined} Requested route object if exists, undefined otherwise
 */
function getRouteByPath(path) {
  return routes.find((r) => r.path.match(new RegExp(`^\\${path}$`, 'gm')));
}

/**
 * Get the path portion from an hash URL. Use the current one if a blank URL is provided.
 * @returns {String} Currently displayed path
 */
function getPath(hashUrl = '') {
  return parseUrl(hashUrl).at(0);
}

/**
 * Get the diagram name portion from an hash URL. Use the current one if a blank URL is provided.
 * @returns {String} Currently displayed diagram name
 */
function getDiagName(hashUrl = '') {
  //TODO: Decide whether the router should decode the name or not
  return parseUrl(hashUrl).at(1);
}

export { navigate, getPath, getDiagName };
