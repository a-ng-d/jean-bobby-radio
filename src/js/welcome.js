import { $, css } from './global';

export function makeWelcome(string, isOnair) {

  const actions = {
    true: 'welcome--onair',
    false: 'welcome--offair'
  };

  const wel = document.createElement('div');
  wel.id = 'welcome';
  wel.className = actions[isOnair];

  const h = document.createElement('h1');
  h.innerHTML = spanForEachWord(string);

  wel.append(h)
  document.body.append(wel)

  function spanForEachWord(string) {
    let html = '';
    const words = string.split(' ');
    words.forEach((word) => {
      html = html.concat(`<span>${word}</span>`)
    });
    return html
  }

  window.addEventListener('load', () => setTimeout(removeWelcome, 4000))

};

function removeWelcome() {
  document.body.classList.replace('dom--unloaded', 'dom--loaded');
  setTimeout(() => $('#welcome').remove(), 400)
}
