import { cl, playState, io } from './global';
import { stream } from './data';
import { player } from './player';

export default function getStatus() {

	fetch(stream.domain + stream.mount)
		.then(response => {
			console.log(`${response.url}: ${response.status}`);
			if (response.status === 200) {
				return onAir()
			} else {
				return offAir()
			}
		})
		.catch(error => offAir());

  // Everything rules and the player is ok to be played
  function onAir() {

  	console.log('ON AIR');

  	cl('.status').replace('status--off-air', 'status--on-air');

  	cl('.play-cta__btn').remove('play-cta__btn--unactive');

  	cl('input[name=\'play\']').remove('input--unactive')

  };

  // The streaming music is down or off
  function offAir() {

  	console.log('OFF AIR');

  	cl('.status').replace('status--on-air', 'status--off-air')

  	cl('.play-cta__btn').add('play-cta__btn--unactive');

  	cl('input[name=\'play\']').add('input--unactive');
  	playState.checked = false;
		player.stop();

  	cl('.track').replace('track--end', 'track--start');

  	io.setState = false

  };

};
