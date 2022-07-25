import './css/style.css';
import './css/home.css';
import './css/canvas.css';
import './assets/idea-logo-small.png';
import * as router from './helpers/router';

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
  if (event.storageArea.length === 0) {
    // Delete in-memory diagrams
    storageHandler.clear();
    // Navigate to homepage
    router.navigate('/');
  }
});

document.querySelector('.title-container a').addEventListener('click', () => {
  // TODO: Don't navigate straight to homepage in modeler mode
  router.navigate('/');
});
