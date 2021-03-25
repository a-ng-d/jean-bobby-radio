import Plyr from 'plyr';
import { playState, cl, $, toggle, notifState } from './global';
import { radio, stream, shazam } from './data';
import letsShazam from './shazam';

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

// Play button
export function playJB() {

	if (toggle) {
		player.pause();
		playState.checked = false;
		cl('.track').replace('track--end', 'track--start');

		toggle = false
	} else {
		player.play();
		playState.checked = true;
		cl('.track').replace('track--start', 'track--end');

		toggle = true
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
			icon: '../assets/images/jean-bobby-icon.png',
			body: `${shazam.artist}・${shazam.title}・from your dear ${shazam.provider}`
		});
		notification.onclick = function() {
			window.open(document.URL)
		};
	}

}
