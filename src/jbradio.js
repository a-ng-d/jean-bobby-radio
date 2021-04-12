// Jean-Bobby Radio main script

// Bundle assets and stylesheets
/// Bundle stylesheets
import sass from './stylesheets/main.sass';
import css from '../node_modules/plyr/dist/plyr.css'

/// Bundle assets
import png from './assets/images/jean-bobby-icon.png';
import pttrn from './assets/images/pattern.png';
import svg from './assets/images/mono-sheet.svg';

// Global
import { playBtn, notifBtn } from './js/global';

// Data models
import { radio, stream, spotify, shazam } from './js/data';

// Player
import { updateTrack, playJB } from './js/player';

// Now playing track
/// Notifications
import { getNotificationsStatus, enableNotifications } from './js/notification';

/// Spotify token
import { getSpotifyToken } from './js/spotify';

/// Shazam!
import letsShazam from './js/shazam';

// Patch double lottie animation
import { patchJbIsFlying } from './js/animation';

playBtn.addEventListener('click', playJB);
notifBtn.addEventListener('click', enableNotifications);

document.addEventListener('ready', getSpotifyToken);
document.addEventListener('ready', getNotificationsStatus);
document.addEventListener('ready', updateTrack);
document.addEventListener('ready', patchJbIsFlying);
window.addEventListener('storage', () => {
	if (localStorage.getItem(spotify.cache)) {
		updateTrack()
	}
});
