import './css/style.css';
import './css/home.css';
import './css/canvas.css';
import './assets/idea-logo-small.png';
import './assets/teaming-logo-black.png';
import * as router from './helpers/router';
import * as storageHandler from './helpers/storageHandler';

window.addEventListener('load', () => {
  router.navigate();
});

window.addEventListener('hashchange', () => {
  router.navigate();
});

/**
 * On clear localstorage event listener
 */
window.addEventListener('storage', (event) => {
  if (event.storageArea.length !== 0) return;
  // Delete in-memory diagrams
  storageHandler.clear();
  // Navigate to homepage
  if (router.getCurrentPath() !== '/') router.navigate('/');
  else router.navigate();
});

document.querySelector('.title-container a').addEventListener('click', () => {
  // Prevent from loosing pending changes in modeler mode
  if (router.getCurrentPath() !== '/m') router.navigate('/');
});
