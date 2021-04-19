import { $, each$ } from './global';

let toggle = false;

export const
		playBtn = $('.play-cta__btn'),
		notifBtn = $('.switch--now-playing'),
		notifState = $('input[name=\'switch\']'),
		playState = $('input[name=\'play\']'),
    toggleBtn = each$('.button__toggle');

export function infosCard(event) {

	const card = event.path[2];
	const target = event.target;

  if (card != undefined) {
    if (toggle) {
			close()
    } else {
      open()
    }
  };

	function closingRules(event) {

		const className = event.target.className;

		if (typeof className != 'string') {
			return close()
		} else if (!className.match('icard__content') && event.target != target) {
			return close()
		}

	};

	function open() {
		card.classList.replace('icard--collapsed', 'icard--expanded');
		window.addEventListener('click', closingRules, true);
		toggle = true
	};

	function close() {
		card.classList.replace('icard--expanded', 'icard--collapsed');
		window.removeEventListener('click', closingRules, true)
		target.checked = false;
		toggle = false
	}

};

export function refreshForm() {
  $('iframe').src = $('iframe').src
}
