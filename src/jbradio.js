// Jean-Bobby Radio main script

// Bundle assets and stylesheets
/// Bundle stylesheets
import sass from './stylesheets/main.sass';
import css from '../node_modules/plyr/dist/plyr.css'

/// Bundle assets
import png from './assets/images/jean-bobby-icon.png';
import pttrn from './assets/images/pattern.png';
import svg from './assets/images/mono-sheet.svg';

// Components
import { toggleBtnEvent } from './js/components';

// Player
import { trackEvent } from './js/player';

// Now playing track
/// Notifications
import { notifEvent, notifBtnEvent } from './js/notification';

/// Spotify token
import { tokenEvent, storageEvent } from './js/spotify';

// Patch double lottie animation
import { patchEvent } from './js/animation';
