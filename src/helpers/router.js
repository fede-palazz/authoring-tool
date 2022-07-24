import { HomeComponent } from '../components/home';
import { ViewerComponent } from '../components/viewer';
import { ModelerComponent } from '../components/modeler';

// Define router routes
const ROUTES = [
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
  // Flag that forces components reloading even with identical hash URLs
  let reload = false;
  // No hash URL passed to the router
  if (!hashUrl) {
    // Evaluate the current one
    hashUrl = location.hash.slice(1);
    // Force component re-rendering
    reload = true;
  }
  // Get path and diagName from the hash URL
  const [path, diagId] = parseUrl(hashUrl);

  // If new path and diagName are identical to the previous ones, then return
  if (!reload && getCurrentPath() === path && getCurrentDiagId() === diagId)
    return;

  // Remove global event listeners
  if (currentComponent) currentComponent.destroy?.();
  // Find the component based on the current path
  currentComponent = findComponentByPath(path);

  // Remove currently displayed component
  const app = document.getElementById('app');
  while (app.hasChildNodes()) app.removeChild(app.firstChild);

  // Render the new component in the "app" placeholder
  app.innerHTML = currentComponent.render();

  // Inizialize the component
  if (currentComponent != HomeComponent && diagId) {
    currentComponent.init(diagId);
    history.replaceState(null, null, `#${path}?${diagId}`);
  } else {
    currentComponent.init();
    history.replaceState(null, null, `#${path}`);
  }
}

/**
 * Parse the submitted hash URL and split it into path and diagram id parts. Use the current one if a blank URL is provided.
 * @param {String} hashUrl Hash portion of the URL
 * @returns {Array} Splitted hash URL: [path, diagId]
 */
function parseUrl(hashUrl) {
  // If the URL is blank, return the default route
  if (!hashUrl) return ['/', ''];
  // Separate path and diagName (if present)
  const [path, diagId] =
    hashUrl.indexOf('?') != -1 ? hashUrl.split('?') : [hashUrl, ''];
  // Check for path validity
  return !isValidPath(path) || path === '/' ? ['/', ''] : [path, diagId];
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
  return ROUTES.find((r) => r.path.match(new RegExp(`^\\${path}$`, 'gm')));
}

/**
 * Get the path portion of the current hash URL
 * @returns {String} Path
 */
function getCurrentPath() {
  return parseUrl(location.hash.slice(1)).at(0);
}

/**
 * Get the diagram id portion of the current hash URL
 * @returns {String} Diagram id
 */
function getCurrentDiagId() {
  return parseUrl(location.hash.slice(1)).at(1);
}

export { navigate, getCurrentPath, getCurrentDiagId };
