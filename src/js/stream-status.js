import { cl, playState, io } from './global';
import { stream } from './data';
import { player } from './player';
import { stopAnimation } from './animation';

export function onAir() {

	console.log('ON AIR');

	cl('.status').replace('status--off-air', 'status--on-air'); // status tag

	cl('.play-cta__btn').remove('play-cta__btn--unactive'); // allow user to play

	cl('input[name=\'play\']').remove('input--unactive')

};

// The streaming music is down or off
export function offAir() {

	console.log('OFF AIR');

	cl('.status').replace('status--on-air', 'status--off-air'); // status tag

	cl('.play-cta__btn').add('play-cta__btn--unactive'); // avoid user to play

	// player
	cl('input[name=\'play\']').add('input--unactive');
	playState.checked = false;
	player.stop();

	stopAnimation(); // animation loop

	cl('.track').replace('track--end', 'track--start'); // hide track infos

	io.setState = false

};
