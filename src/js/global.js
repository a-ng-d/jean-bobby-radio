export const
		playBtn = $('.play-cta__btn'),
		notifBtn = $('.switch'),
		notifState = $('input[name=\'switch\']'),
		playState = $('input[name=\'play\']');

export let
	toggle = false;

export function $(elmt) {
	return document.querySelector(elmt)
};

export function cl(elmt) {
	return $(elmt).classList
}
