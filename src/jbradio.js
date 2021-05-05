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

// Now playing track infos
// Player
import { trackEvent, playBtnEvent } from './js/player';

/// Notifications
import { notifEvent, notifBtnEvent } from './js/notification';

/// Spotify token when starting
import { tokenEvent, storageEvent } from './js/spotify';
