// Jean-Bobby Radio main script

// Bundle assets and stylesheets
/// Bundle stylesheets
import sass from './stylesheets/main.sass';
import css from '../node_modules/plyr/dist/plyr.css'

/// Bundle assets
import png from './assets/images/jean-bobby-icon.png';
import jpg from './assets/images/jean-bobby.jpg';
import svg from './assets/images/mono-sheet.svg';

// Global
import { playBtn, notifBtn, spotifyBtn, playState, notifState, toggle, $, cl } from './js/global';

// Data models
import { radio, stream, spotify, shazam } from './js/data';

// Player
import { player, updateTrack, playJB } from './js/player.js';

// Stream status
import getStatus from './js/stream-status';

// Now playing track
/// Notifications
import { getNotificationsStatus, enableNotifications } from './js/notification';

/// Spotify token
import { getSpotifyToken, refreshSpotifyToken, signIntoSpotify } from './js/spotify';

/// Shazam!
import letsShazam from './js/shazam';

playBtn.addEventListener('click', playJB);
notifBtn.addEventListener('click', enableNotifications);

document.addEventListener('ready', getStatus);
document.addEventListener('ready', getSpotifyToken);
document.addEventListener('ready', getNotificationsStatus);
document.addEventListener('ready', updateTrack);
window.addEventListener('storage', () => {
	if (localStorage.getItem(spotify.cache)) {
		updateTrack()
	}
})
