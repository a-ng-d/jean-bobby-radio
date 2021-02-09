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

function notification(track) {
	var isChecked = $('#switch').checked;
	if(Notification.permission !== 'granted')
		Notification.requestPermission();
	else {
		if(isChecked == true) {
			var notification = new Notification('Now playing', {
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
