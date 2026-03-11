import './style.css';
import lightThemeIcon from './images/light-svgrepo-com.svg';
import darkThemeIcon from './images/night-svgrepo-com.svg';
import { displayController } from './scripts/display-controller.js';
import { imageController } from './scripts/image-controller.js';

window.addEventListener('DOMContentLoaded', () => {
  for (const controller of [displayController, imageController]) {
    controller.initDOMVariables();
  }

  pageTheme();
});

function pageTheme() {
  const toggleBtn = document.getElementById('theme-modes');
  const html = document.querySelector('html');

  if (!toggleBtn) return;

  function updateIcon(isDark) {
    toggleBtn.src = isDark ? lightThemeIcon : darkThemeIcon;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') {
    html.classList.add('dark-mode');
    updateIcon(true);
  } else updateIcon(false);

  toggleBtn.addEventListener('click', () => {
    html.classList.toggle('dark-mode');

    const isDark = html.classList.contains('dark-mode');
    updateIcon(isDark);
  });
}
