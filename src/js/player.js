import Plyr from 'plyr';
import { cl, $, io } from './global';
import { radio, stream, shazam } from './data';
import letsShazam from './shazam';
import { startAnimation, stopAnimation } from './animation';
import { playState, notifState, playBtn } from './components';

// Events
export const
  trackEvent = document.addEventListener('ready', updateTrack);

// Set up the html5 player
export const player = new Plyr('.player', {
	title: radio.title,
	controls: [
		'mute',
		'volume',
		'airplay'
	]
});

player.source = {
	type: 'audio',
	title: radio.title,
	sources: [
		{
			src: stream.domain + stream.mount,
			type: 'audio/mpeg'
		}
	]
};

// Events
export const
	playBtnEvent = playBtn.addEventListener('click', playJB);

// Play button
export function playJB() {

	let u;

	if (io.getState) {
		player.pause(); // player
		stopAnimation(); // animation loop
		playState.checked = false; // button state
		// now playing
		cl('.track').replace('track--end', 'track--start');
		clearInterval(u);

		io.setState = false // switch
	} else {
		player.play(); // player
		startAnimation(); // animation loop
		playState.checked = true; // button state
		// now playing
		cl('.track').replace('track--start', 'track--end');
		u = setInterval(updateTrack, 60000);

		io.setState = true // switch
	}

};

// Update now playing track infos
export async function updateTrack() {

	await letsShazam();

	$('.provider p').innerHTML = `${shazam.provider} presents…`;
	$('.artist p').innerHTML = shazam.artist;
	$('.title p').innerHTML = shazam.title;

	if (notifState.checked == true) {
		var notification = new Notification('Now playing…', {
			icon: './images/jean-bobby-icon.png',
			body: `${shazam.artist}・${shazam.title}・from your dear ${shazam.provider}`
		});
		notification.onclick = function() {
			window.open(document.URL)
		};
	}

}
