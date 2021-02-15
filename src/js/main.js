//- Main JS

// Global
const
		freq = 10000,
		cta = $('.play-cta__btn'),
		notifState = $('input[name="switch"]'),
		playState = $('input[name="play"]');

let
	toggle = false;

function $(elmt) {
	return document.querySelector(elmt)
};

function cl(elmt) {
	return $(elmt).classList
};

// Datas
const radio = {
	title: 'Jean-Bobby Radio',
	url: 'http://localhost:8080'
};

const stream = {
	domain: 'http://broadcaster.jean-bobby-radi.ovh:8000',
	mount: '/jbradio'
};

const spotify = {
	authUrl: 'https://accounts.spotify.com/authorize',
	tokenUrl: 'https://accounts.spotify.com/api/token',
	playlistId: '65SJCvnRdfbLpyxTVCglYJ',
	clientId: '604d5e8d826c4489977f4ef0a046b19d',
	clientSecret: 'd7f885def89e4d408b6ea88c9bf67ab2'
};

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
		playSt.checked = false;
		displayTrack(false);

		toggle = false;
	} else {
		player.play();
		playSt.checked = true;
		displayTrack(true);

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

	cl('input[name="play"]').remove('input--unactive');

};

function offAir() {

	console.log('Off air');

	cl('.status').remove('status--on-air')
	cl('.status').add('status--off-air');

	cl('.play-cta__btn').add('play-cta__btn--unactive');

	cl('input[name="play"]').add('input--unactive');
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

// Get metadata (provider, artist, title)
// Artist and title
async function shazam() {

	return await fetch(`${stream.domain}/status-json.xsl`)
		.then(response => {
			console.log(`${response.url}: ${response.status}`);
			if (response.ok) {
				return response.json()
			} else {
				return 'Something went wrong'
			}
		})
		.then(json => getTrackTitle(json))
		.catch(error => console.error(error));

	function getTrackTitle(datas) {
		let obj, arr, title;

		try {
			title = datas.icestats.source.title;
		} catch {
			title = undefined
		}

		if (title == undefined) {
			obj = {
				artist: 'Here is…',
				title: 'an advertising break…'
			}
		} else {
			arr = title.split(' - ');
			obj = {
				artist: arr[0],
				title: arr[1]
			}
		};

		return obj
	}

};

// Provider
async function prozam() {

	let obj;
	const err = 'You have to log in Spotify',
				ano = 'Mr. ¯\_(ツ)_/¯';

	return await fetch(
		`https://api.spotify.com/v1/playlists/${spotify.playlistId}/tracks?market=FR&fields=items(added_by%2C%20track(artists(name)%2C%20name))`,
		{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${spotify.token}`
			}
		})
			.then(response => {
				console.log(`${response.url}: ${response.status}`)
				if (response.ok) {
					return response.json()
				} else {
					return err
				}
			})
			.then(json => {
				if (json != err) {
					matchCurrentListening(json.items)
				} else {
					obj = {
						provider: 'You have to log in Spotify'
					};
					return obj
				}
			})
			.catch(error => console.error(error));

	async function matchCurrentListening(datas) {
		const letsShazam = await shazam();
		let result = datas.filter(data =>
			data.track.name.includes(letsShazam.title) == true
		);
		if (result == []) {
			return ano
		} else {
			return await getProvider(result[0].added_by.id)
		}
	};

	async function getProvider(id) {
		return await fetch(
			`https://api.spotify.com/v1/users/${id}`,
			{
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${spotify.token}`
				}
			})
				.then(response => {
					console.log(`${response.url}: ${response.status}`)
					if (response.ok) {
						return response.json()
					} else {
						return err
					}
				})
				.then(json => {
					obj = {
						provider: json.display_name
					};
					return obj
				})
				.catch(error => console.error(error))

	}

};

// Whole track infos
async function shapro() {

	let obj;

	const letsShazam = await shazam(),
				letsProzam = await prozam();

	obj = {
		artist: letsShazam.artist,
		title: letsShazam.title,
		provider: letsProzam.provider
	};

	return obj

};

async function displayTrack(bool) {

	if (bool) {
		const letsShaPro = await shapro();

		$('.provider p').innerHTML = `${letsShaPro.provider} presents…`;
		$('.artist p').innerHTML = letsShaPro.artist;
		$('.title p').innerHTML = letsShaPro.title;

		if (notificationsSt.checked == true) {
			var notification = new Notification('Now playing…', {
				icon: '../assets/images/jean-bobby-icon.png',
				body: `${letsShaPro.artist}・${letsShaPro.title}・from your dear ${letsShaPro.provider}`
			});
			notification.onclick = function() {
				window.open(document.URL);
			};
		}
	}

};

document.addEventListener('load', getStatus());
document.addEventListener('load', getNotificationsStatus());
