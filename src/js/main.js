//- Main JS

// Global
var streamUrl = 'https://streams.radiomast.io/d18496eb-7d4a-4b80-aac1-757c7da9cb17',
		title = 'Jean-Bobby Radio',
		toggle = false,
		freq = 10000,
		cta = $('.play-cta__btn');

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
	if(toggle == true) {
		player.pause();
		$('#check').checked = false;
		metadata(false);

		toggle = false;
	} else {
		player.play();
		$('#check').checked = true;
		metadata(true);

		toggle = true;
	}
};

// Streaming status
function getStatus() {
	var req = new Request(streamUrl);

	fetch(req).then(function(response) {
		onAir();
	})
	.catch(function() {
		offAir();
	})
};

function rlStatus() {
	setInterval(getStatus, freq);
};

function onAir() {
	console.log('on-air');

	cl('.status').remove('status--off-air');
	cl('.status').add('status--on-air');

	cl('.play-cta__btn').remove('play-cta__btn--unactive');

	cl('#check').remove('input--unactive');
};

function offAir() {
	console.log('off-air');

	cl('.status').remove('status--on-air')
	cl('.status').add('status--off-air');

	cl('.play-cta__btn').add('play-cta__btn--unactive');
	
	cl('#check').add('input--unactive');
	$('#check').checked = false;

	metadata(false);
	
	toggle = false;
};

// Streaming metadatas (artist and title)
function shazam() {
	try {
		var url = streamUrl + '/metadata';
		var eventSource = new EventSource(url);

		eventSource.onmessage = function(event) {
			var metadata = JSON.parse(event.data);
			var artistTitle = metadata['metadata'];

			nextTrack(artistTitle);
			if(player.playing == true) {
				notification(artistTitle)
			} else {}
		}
	} catch(error) {
		var errorMessage = 'Unknown 🙈'

		console.log(errorMessage);
		console.log(error);
	}
};

function nextTrack(track) {
	cl('.metadata h6').add('shazam--fade-out')
	setTimeout(function() {
		$('.metadata h6').innerHTML = track;
		cl('.metadata h6').remove('shazam--fade-out')
	}, 2000);
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

function notification(track) {
	if (Notification.permission !== 'granted')
		Notification.requestPermission();
	else {
		var notification = new Notification('Now playing', {
			icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
			body: track,
		});
		notification.onclick = function() {
			window.open('localhost:8080');
		};
	}
};

document.addEventListener('load', getStatus());
document.addEventListener('load', rlStatus());
document.addEventListener('DOMContentLoaded', shazam())