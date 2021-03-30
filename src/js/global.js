export const
		playBtn = $('.play-cta__btn'),
		notifBtn = $('.switch'),
		notifState = $('input[name=\'switch\']'),
		playState = $('input[name=\'play\']');

export let
	io = {
		state: false,

		get getState() {
			return this.state
		},

		set setState(newState) {
			return this.state = newState
		}
	};

export function $(elmt) {
	return document.querySelector(elmt)
};

export function cl(elmt) {
	return $(elmt).classList
}
