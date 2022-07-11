import './css/style.css';
import './css/home.css';
import './css/canvas.css';
import './assets/idea-logo-small.png';
import * as router from './helpers/router';

window.addEventListener('load', () => {
  router.navigate('');
});

window.addEventListener('hashchange', () => {
  console.log('Hash changed');
  router.navigate('');
});

document.querySelector('.title-container a').addEventListener('click', () => {
  router.navigate('/');
});
