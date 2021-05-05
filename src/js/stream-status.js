import { cl, io } from './global';
import { stream } from './data';
import { player } from './player';
import { playState } from './components';
import { makeWelcome } from './welcome';

let i = 0,
		j = 0;

export function onAir() {

	console.log('ON AIR');

	cl('.status').replace('status--off-air', 'status--on-air');

	cl('.play-cta__btn').remove('play-cta__btn--unactive');

	cl('input[name=\'play\']').remove('input--unactive');

	if (i < 1) {
		makeWelcome(stream.onair, true)
	};

	i++

};

// The streaming music is down or off
export function offAir() {

	console.log('OFF AIR');

	cl('.status').replace('status--on-air', 'status--off-air')

	cl('.play-cta__btn').add('play-cta__btn--unactive');

	cl('input[name=\'play\']').add('input--unactive');
	playState.checked = false;
	player.stop();

	cl('.track').replace('track--end', 'track--start');

	io.setState = false;

	if (j < 1) {
		makeWelcome(stream.offair, false)
	};

	j++

};
