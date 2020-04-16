//- plyr options

// Plyr
var streamUrl = 'http://s2.free-shoutcast.com:18442/?type=http&nocache=5',
    title = 'Jean-Bobby Radio',
    toggle = false;

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
    document.getElementById('check').checked = false;
    toggle = false;
  } else {
    document.getElementById('check').checked = true;
    toggle = true;
  }
};

// Streaming status
function getStatus() {
  var req = new Request(streamUrl);

  fetch(req).then(function(response) {
    console.log('on air');
    document.querySelector('.status').classList.add('status--on-air');
  })
  .catch(function() {
    console.log('off air');
    document.querySelector('.status').classList.add('status--off-air');
    document.querySelector('.play-cta__btn').classList.add('play-cta__btn--unactive');
    document.querySelector('#check').classList.add('input--unactive');
  })
};

document.addEventListener('load', getStatus())
