//- Main JS

// Global
const
		domain = 'http://broadcaster.jean-bobby-radi.ovh:8000',
		mount = '/jbradio',
		streamUrl = domain + mount,
		title = 'Jean-Bobby Radio',
		playlistID = '65SJCvnRdfbLpyxTVCglYJ',
		token = 'BQBYAWMcjY-euKjnMdMeZrc73Xqo_paAddNlXWtJEImk4Qp1YKIgKBYNMB0hwCKgQtt7jR6THwmknh4f8hmFSzxG-kX8t0Qr0ZBhgc1r77QAWPG73fzuvtZ9Ct2r8ZWhoobWRg',
		freq = 10000,
		cta = $('.play-cta__btn');

let
	toggle = false;

const
	notificationsSt = $('input[name="switch"]'),
	playSt = $('input[name="play"]');

function $(elmt) {
	return document.querySelector(elmt)
};

function cl(elmt) {
	return $(elmt).classList
};

// Plyr
const player = new Plyr('.player', {
	title: title,
	controls: [
		'mute',
		'volume',
		'airplay'
	]
});

player.source = {
	type: 'audio',
	title: 'Place du Village - Spotify',
	sources: [
		{
			src: streamUrl,
			type: 'audio/mpeg',
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

	fetch(streamUrl)
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
	playSt.checked = false;

	metadata(false);

	toggle = false;
};

// Streaming metadatas (artist and title)
function shazam() {
	try {
		var url = streamUrl + '/metadata';
		var eventSource = new EventSource(url);
				if (permission.state == 'denied') {
					cl('.switch').add('switch--unactive')
				} else {
					cl('.switch').remove('switch--unactive')

		eventSource.onmessage = function(event) {
			var metadata = JSON.parse(event.data);
			var artistTitle = metadata['metadata'];

			nextTrack(artistTitle);
			if(player.playing == true) {
				notification(artistTitle)
			} else {}
		}
	} catch(error) {
		var errorMessage = 'Unknown 🙈';
		nextTrack(errorMessage);
// Get metadata (provider, artist, title)
// Artist and title
async function shazam() {

	return await fetch(`${domain}/status-json.xsl`)
		.then(response => {
			console.log(`${response.url}: ${response.status}`);
			if (response.ok) {
				return response.json()
			}
		})
		.then(json => getTrackTitle(json))
		.catch(error => console.error(error));

	function getTrackTitle(datas) {
		let obj, arr, title;
		title = datas.icestats.source.title;
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

	return await fetch(
		`https://api.spotify.com/v1/playlists/${playlistID}/tracks?market=FR&fields=items(added_by%2C%20track(artists(name)%2C%20name))`,
		{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		})
			.then(response => {
				if (response.ok) {
					return response.json()
				}
			})
			.then(json => matchCurrentListening(json.items))
			.catch(error => console.error(error));

	async function matchCurrentListening(datas) {
		const letsShazam = await shazam();
		let result = datas.filter(data =>
			data.track.name.includes(letsShazam.title) == true
		);
		return await getProvider(result[0].added_by.id)
	};

	async function getProvider(id) {
		return await fetch(
			`https://api.spotify.com/v1/users/${id}`,
			{
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				}
			})
				.then(response => {
					if (response.ok) {
						return response.json()
					}
				})
				.then(json => {
					let obj = {
						provider: json.display_name
					};
					return obj
				})
				.catch(error => console.error(error))

	}

};

// Whole track infos
async function shapro() {

	const letsShazam = await shazam(),
				letsProzam = await prozam();

	if (letsProzam.provider == undefined) {
		letsProzam.provider = '¯\_(ツ)_/¯'
	};

	let obj = {
		artist: letsShazam.artist,
		title: letsShazam.title,
		provider: letsProzam.provider
	};

	return obj
};
				icon: '../assets/images/jean-bobby-icon.png',
				body: track,
			});
			notification.onclick = function() {
				window.open(document.URL);
			};
		} else {

		}
	}
};

function metadata(boolean) {
	if(boolean == true) {
		cl('.metadata h6').add('shazam--drawer');
		cl('.metadata h6').add('shazam--animation');
	} else if(boolean == false) {
		cl('.metadata h6').remove('shazam--drawer');
		cl('.metadata h6').remove('shazam--animation');
	}
};

document.addEventListener('load', getStatus());
document.addEventListener('load', rlStatus());
document.addEventListener('DOMContentLoaded', shazam())
