import { spotify, stream, shazam } from './data';
import { refreshSpotifyToken } from './spotify';
import { offAir, onAir } from './stream-status';

// Get the artist, the title and the provider from Spotify
export default async function letsShazam() {

	await sha();
	await zam();

	return shazam

};

// Get the artist and the title from the Icecast server stats
async function sha() {

	return await fetch(`${stream.domain}/status-json.xsl`)
		.then(response => {
			if(response.ok) {
				return response.json()
			} else {
				return offAir()
			}
			// console.log(`${response.url}: ${response.status}`); // debug

		})
		.then(json => getTrackTitle(json))
		.catch(error => console.error(error));

	function getTrackTitle(datas) {

		let arr, title;

		if (datas.icestats.source == undefined) {
			offAir()
		} else {
			title = datas.icestats.source.title

			if (title == ' / ') {
				shazam.artist = 'Jean-Bobby Radio';
				shazam.title = 'All over the World'
			} else {
				arr = title.split(' / ');
				shazam.artist = arr[0];
				shazam.title = arr[1]
			};

			onAir();

			return shazam
		}

	}

};

// Get the provider that matches the Icecast track
async function zam() {

	const ano = 'Mr. ¯\\_(ツ)_/¯',
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
				// console.log(`${response.url}: ${response.status}`) // debug
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
					// console.log(`${response.url}: ${response.status}`) // debug
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

}
