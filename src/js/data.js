export const
	radio = {
		title: 'Jean-Bobby Radio',
		url: 'http://localhost:8080'
	},

	stream = {
		domain: 'https://live.jean-bobby.radio.fm',
		mount: '/jbradio',
		status: '/status-json.xsl',
		onair: 'JB Radio 24/7 sound system is on-air 🥳',
		offair: 'JB Radio 24/7 sound system is off-air 😴'
	},

	spotify = {
		authUrl: 'https://accounts.spotify.com/authorize',
		tokenUrl: 'https://accounts.spotify.com/api/token',
		playlistId: '65SJCvnRdfbLpyxTVCglYJ',
		clientId: null,
		clientSecret: null,
		cache: '$spotify_access'
	},

	shazam = {
		artist: null,
		title: null,
		provider: null
	}
