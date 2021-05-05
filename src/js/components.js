import { $, each$ } from './global';

let toggle = false;

// Elements
export const
		playBtn = $('.play-cta__btn'),
		notifBtn = $('.switch--now-playing'),
		notifState = $('input[name=\'switch\']'),
		playState = $('input[name=\'play\']'),
    toggleBtn = each$('.button__icon--toggle');

// Events
export const
	toggleBtnEvent =
		toggleBtn.forEach((btn) => {
			btn.addEventListener('click', infosCard)
		});

// Infos Card
function infosCard(event) {

	const card = event.path[2];
	const btn = event.target;

  if (card != undefined) {
    if (toggle) {
			close()
    } else {
      open()
    }
  };

	function closingRules(event) {

		const path = event.path;
		const target = event.target;
		let isCardContent = false;
		let ctn = 0;

		path.forEach((value) => {

			const className = value.className
			ctn++;

			if (className === 'icard__content' || target === btn) {
				isCardContent = true
			};

			if (ctn === path.length) {

				if (!isCardContent) {
					return close()
				}

			}

		})

	};

	function open() {
		card.classList.replace('icard--collapsed', 'icard--expanded');
		window.addEventListener('click', closingRules, true);
		if (card.className.match('feedback')) {
			$('.feedback .icard__content').innerHTML = "<iframe src='https://chilipepper.io/form/insane-darkbrown-guajillo-bc4bef56-91d0-46cd-9e64-b4cf0c27cf5e'></iframe>"
		}
		toggle = true
	};

	function close() {
		card.classList.replace('icard--expanded', 'icard--collapsed');
		window.removeEventListener('click', closingRules, true)
		btn.checked = false;
		toggle = false
	}

}
