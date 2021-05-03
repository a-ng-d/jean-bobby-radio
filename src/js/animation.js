import lottie from 'lottie-web';
import { $, cl } from './global';
import * as data from '../assets/animation/data.json';

let trigger = false;

// Events
export const
  patchEvent = document.addEventListener('DOMContentLoaded', patchJbIsFlying);

const
  jbIsFlying =
    lottie.loadAnimation({
    	container: $('.play__animation'),
     	renderer: 'svg',
     	loop: true,
     	autoplay: false,
     	animationData: data,
      rendererSettings: {
        id: 'jb-is-flying'
      }
    });

function patchJbIsFlying() {
  $('#jb-is-flying:nth-child(2)').remove()
}

export function startAnimation() {
  trigger = false;
  jbIsFlying.setSpeed(1);
  jbIsFlying.goToAndPlay(0, true);
  cl('.play__animation').replace('play__animation--start', 'play__animation--end')
};

export function stopAnimation() {
  trigger = true;
  jbIsFlying.setSpeed(10);
  jbIsFlying.onLoopComplete = function() {
    if(trigger) {
      jbIsFlying.goToAndStop(0, true);
      cl('.play__animation').replace('play__animation--end', 'play__animation--start')
    }
  }
};
