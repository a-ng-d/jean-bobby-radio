//- plyr options

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
	return player.togglePlay()
};

function check() {
	if(toggle == true) {
		$('#check').checked = false;
		toggle = false;
	} else {
		$('#check').checked = true;
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
	toggle = false;
};

document.addEventListener('load', getStatus());
document.addEventListener('load', rlStatus());

