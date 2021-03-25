import lottie from 'lottie-web';
import { $ } from './global';
import * as animationData from '../assets/animation/data.json';

export const jbIsFlying =
  lottie.loadAnimation({
  	container: $('.animation'),
   	renderer: 'svg',
   	loop: true,
   	autoplay: false,
   	animationData: animationData,
    rendererSettings: {
      progressiveLoad: false,
      hideOnTransparent: true,
      id: 'jb-is-flying'
    }
  });
