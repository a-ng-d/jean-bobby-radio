export const
	radio = {
		title: 'Jean-Bobby Radio',
		url: 'http://localhost:8080'
	},

	stream = {
		domain: 'http://live.jean-bobby.radio.fm:8000',
		mount: '/jbradio',
		status: '/status-json.xsl'
	},

	spotify = {
		authUrl: 'https://accounts.spotify.com/authorize',
		tokenUrl: 'https://accounts.spotify.com/api/token',
		playlistId: '65SJCvnRdfbLpyxTVCglYJ',
		clientId: '604d5e8d826c4489977f4ef0a046b19d',
		clientSecret: 'd7f885def89e4d408b6ea88c9bf67ab2',
		cache: '$spotify_access'
	},

	shazam = {
		artist: null,
		title: null,
		provider: null
	}
