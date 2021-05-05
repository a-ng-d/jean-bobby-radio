import { $ } from './global';

export function makeWelcome(string, isOnair) {

  const actions = {
    true: 'welcome--onair',
    false: 'welcome--offair'
  };

  const wel = document.createElement('div');
  wel.id = 'welcome';
  wel.className = actions[isOnair];

  const h = document.createElement('p');
  h.innerHTML = spanForEachWord(string);
  h.classList.add('p--flex-label')

  wel.append(h)
  document.body.append(wel)

  function spanForEachWord(string) {
    let html = '';
    const words = string.split(' ');
    words.forEach((word) => {
      html = html.concat(`<span>${word}</span>`)
    });
    return html
  };

  setTimeout(() => document.body.classList.replace('dom--unloaded', 'dom--isrunning'), 100);

  setTimeout(removeWelcome, 6000);

  function removeWelcome() {
    document.body.classList.replace('dom--isrunning', 'dom--loaded');
    wel.addEventListener('animationend', (e) => {
      e.target.remove()
    })
  }

}
