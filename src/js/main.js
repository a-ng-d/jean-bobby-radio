//- Main JS

// Global
const
		freq = 10000,
		cta = $('.play-cta__btn'),
		notifState = $('input[name=\'switch\']'),
		playState = $('input[name=\'play\']');

let
	toggle = false;

function $(elmt) {
	return document.querySelector(elmt)
};

function cl(elmt) {
	return $(elmt).classList
};

// Datas
const
	radio = {
		title: 'Jean-Bobby Radio',
		url: 'http://localhost:8080'
	},

	stream = {
		domain: 'http://broadcaster.jean-bobby-radi.ovh:8000',
		mount: '/jbradio'
	},

	spotify = {
		authUrl: 'https://accounts.spotify.com/authorize',
		tokenUrl: 'https://accounts.spotify.com/api/token',
		playlistId: '65SJCvnRdfbLpyxTVCglYJ',
		clientId: '604d5e8d826c4489977f4ef0a046b19d',
		clientSecret: 'd7f885def89e4d408b6ea88c9bf67ab2'
	},

	shazam = {
		artist: 'François Juno',
		title: 'L\'an 1999',
		provider: 'Mr. ¯\_(ツ)_/¯'
	}

// Plyr
const player = new Plyr('.player', {
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

// Play button toggle
function playJB() {

	if (toggle) {
		player.pause();
		playState.checked = false;
		displayTrack(false);
		cl('.track').add('track--paused')
		cl('.track').remove('track--played')

		toggle = false;
	} else {
		player.play();
		playState.checked = true;
		displayTrack(true);
		cl('.track').remove('track--paused')
		cl('.track').add('track--played')

		toggle = true;
	}

};

// Streaming status
function getStatus() {

	fetch(stream.domain + stream.mount)
		.then(response => {
			console.log(`${response.url}: ${response.status}`);
			if (response.status === 200) {
				onAir()
			} else {
				offAir()
			}
		})
		.catch(error => offAir());

};

function onAir() {

	console.log('On air');

	cl('.status').remove('status--off-air');
	cl('.status').add('status--on-air');

	cl('.play-cta__btn').remove('play-cta__btn--unactive');

	cl('input[name=\'play\']').remove('input--unactive');

};

function offAir() {

	console.log('Off air');

	cl('.status').remove('status--on-air')
	cl('.status').add('status--off-air');

	cl('.play-cta__btn').add('play-cta__btn--unactive');

	cl('input[name=\'play\']').add('input--unactive');
	playState.checked = false;

	displayTrack(false);

	toggle = false;

};

// Notifications status
function getNotificationsStatus() {

	navigator.permissions.query({name: 'notifications'})
		.then(permission => {
			if (permission.state == 'denied') {
				cl('.switch').add('switch--unactive')
			}
			permission.onchange = function() {
				if (permission.state == 'denied') {
					cl('.switch').add('switch--unactive')
				} else {
					cl('.switch').remove('switch--unactive')
				}
			}
		})

};

// Notifications enabler
function enableNotifications() {

	navigator.permissions.query({name: 'notifications'})
		.then(permission => {
			if (permission.state !== 'granted') {
				Notification.requestPermission();
				notifState.checked = false
			}
			permission.onchange = function() {
				if (permission.state == 'granted') {
					notifState.checked = true
				} else {
					notifState.checked = false
				}
			}
		})

};

// Spotify authentication token
function getSpotifyToken() {

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
					return localStorage.setItem('$spotify_access', JSON.stringify(json))
				}
			})
			.catch(error => console.error(error))
	} else {
		return signIntoSpotify()
	}

};

function refreshSpotifyToken() {

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

function signIntoSpotify() {
	const signInButton = '<button class=\'button button--secondary\' onclick=\'jumpIntoSpotify()\'>Sign into Spotify to get provider</button>';
	$('.provider p').innerHTML = signInButton
};

function jumpIntoSpotify() {
	window.open(`${spotify.authUrl}?client_id=${spotify.clientId}&response_type=code&redirect_uri=${encodeURIComponent(radio.url)}`)
};

// Get metadata (provider, artist, title)
// Artist and title
async function sha() {

	return await fetch(`${stream.domain}/status-json.xsl`)
		.then(response => {
			console.log(`${response.url}: ${response.status}`);
			return response.json()
		})
		.then(json => getTrackTitle(json))
		.catch(error => console.error(error));

	function getTrackTitle(datas) {

		let arr, title;

		try {
			title = datas.icestats.source.title
		} catch(error) {
			title = undefined
		};

		if (title == undefined || title == ' / ') {
			shazam.artist = 'Here is…';
			shazam.title = 'an advertising break…'
		} else {
			arr = title.split(' / ');
			shazam.artist = arr[0];
			shazam.title = arr[1]
		};

		return shazam

	}

};

// Provider
async function zam() {

	const ano = 'Mr. ¯\_(ツ)_/¯',
				access = JSON.parse(localStorage.getItem('$spotify_access')),
				headers = {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				};

	try {
		headers.Authorization = `Bearer ${access.access_token}`
	} catch (error) {
		headers.Authorization = null
	}

	return await fetch(
		`https://api.spotify.com/v1/playlists/${spotify.playlistId}/tracks?market=FR&fields=items(added_by%2C%20track(artists(name)%2C%20name))`,
		{
			headers: headers
		})
			.then(response => {
				console.log(`${response.url}: ${response.status}`)
				if (response.status != 401 && response.status != 400) {
					return response.json()
				} else {
					return refreshSpotifyToken()
				}
			})
			.then(json => {
				if (json != undefined) {
					return matchCurrentListening(json.items)
				} else {
					shazam.provider = ano;
					return shazam
				}
			})
			.catch(error => console.error(error));

	async function matchCurrentListening(datas) {

		await sha();
		let results = datas.filter(data =>
			data.track.name.includes(shazam.title) == true
		);

		if (results == undefined || results.length == 0) {
			shazam.provider = ano;
			return shazam
		} else {
			return await getProvider(results[0].added_by.id)
		}

	};

	async function getProvider(id) {

		return await fetch(
			`https://api.spotify.com/v1/users/${id}`,
			{
				headers: headers
			})
				.then(response => {
					console.log(`${response.url}: ${response.status}`)
					if (response.status != 401) {
						return response.json()
					} else {
						return refreshSpotifyToken()
					}
				})
				.then(json => {
					if (json != undefined) {
						shazam.provider = json.display_name;
						return shazam
					}
				})
				.catch(error => console.error(error))

	}

};

// Whole track infos
async function letsShazam() {

	await sha();
	await zam();

	return shazam

};

async function displayTrack(bool) {

	if (bool) {
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
				window.open(document.URL);
			};
		}
	}

};

document.addEventListener('load', getStatus());
document.addEventListener('load', getNotificationsStatus());
document.addEventListener('load', getSpotifyToken())
