import './style.css';
import './assets/idea-logo-small.png';
import router from './router';

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
