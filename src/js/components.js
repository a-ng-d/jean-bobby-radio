import { $ } from './global';

let toggle = false;

export const
		playBtn = $('.play-cta__btn'),
		notifBtn = $('.switch--now-playing'),
		notifState = $('input[name=\'switch\']'),
		playState = $('input[name=\'play\']'),
    toggleBtn = $('.button__toggle');

export function infosCard(elmt, callback) {

  if (elmt != undefined) {
    if (toggle) {

      elmt.classList.replace('icard--expanded', 'icard--collapsed')
      toggle = false

    } else {

      elmt.classList.replace('icard--collapsed', 'icard--expanded')
      callback()
      toggle = true

    }
  }

}

export function refreshForm() {
  $('iframe').src = $('iframe').src
}
