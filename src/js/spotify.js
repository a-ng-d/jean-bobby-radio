import { $ } from './global';
import { spotify, radio } from './data';
import { updateTrack } from './player';

// Events
export const
 tokenEvent = document.addEventListener('ready', getSpotifyToken),
 storageEvent = window.addEventListener('storage', () => {
		if (localStorage.getItem(spotify.cache)) {
			updateTrack()
		}
	});

// Get OAuth2 token by sending the query code from the URL and store it into local storage
export function getSpotifyToken() {

	const params = new URLSearchParams(window.location.search);
	const code = params.get('code');

	const headers = {
		'Content-type': 'application/x-www-form-urlencoded'
	};
	const formUrlEncoded = new URLSearchParams({
		'client_id': spotify.clientId,
		'client_secret': spotify.clientSecret,
		'grant_type': 'authorization_code',
		'code': code,
		'redirect_uri': radio.url
	});

	if (code != null && code != 'access_denied') {
		fetch(
			spotify.tokenUrl,
			{
				method: 'POST',
				headers: headers,
				body: formUrlEncoded
			}
		)
			.then(response => {
				console.log(`${response.url}: ${response.status}`);
				if (response.status != 401 && response.status != 400) {
					return response.json()
				} else {
					return signIntoSpotify()
				}
			})
			.then(json => {
				if (json != undefined) {
					localStorage.setItem(spotify.cache, JSON.stringify(json));
					window.close()
				}
			})
			.catch(error => console.error(error))
	} else {
		return signIntoSpotify()
	}

};

// Refresh token after its first expiration. It works once.
export function refreshSpotifyToken() {

	const access = JSON.parse(localStorage.getItem('$spotify_access')),
				headers = {
					'Content-type': 'application/x-www-form-urlencoded',
					'Authorization': `Basic ${btoa(`${spotify.clientId}:${spotify.clientSecret}`)}`
				},
				formUrlEncoded = new URLSearchParams({
					'grant_type': 'refresh_token'
				});

	try {
		formUrlEncoded.append('refresh_token', access.refresh_token)
	} catch (error) {
		formUrlEncoded.append('refresh_token', null)
	}

	fetch(
		spotify.tokenUrl,
		{
			method: 'POST',
			headers: headers,
			body: formUrlEncoded
		}
	)
		.then(response => {
			console.log(`${response.url}: ${response.status}`);
			if (response.status != 401 && response.status != 400) {
				return response.json()
			} else {
				localStorage.removeItem(spotify.cache);
				return signIntoSpotify()
			}
		})
		.then(json => {
			if (json != undefined) {
				localStorage.setItem('$spotify_access', JSON.stringify(json));
			}
		})
		.catch(error => console.error(error))

};

// Display a log in button to exchange the query code for a token
function signIntoSpotify() {
	const signInButton = `<button class=\'spotify__btn button button--secondary\'>
													<a href=\'${spotify.authUrl}?client_id=${spotify.clientId}&response_type=code&redirect_uri=${encodeURIComponent(radio.url)}\' target=\'_blank\'></a>
													Sign into Spotify to get provider
												</button>`;
	$('.provider p').innerHTML = signInButton
};
