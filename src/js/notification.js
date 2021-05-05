import { cl } from './global';
import { notifBtn } from './components';

// Events
export const
	  notifBtnEvent = notifBtn.addEventListener('click', enableNotifications),
		notifEvent = document.addEventListener('DOMContentLoaded', getNotificationsStatus);

function getNotificationsStatus() {

	navigator.permissions.query({name: 'notifications'})
		.then(permission => {
			if (permission.state == 'denied') {
				cl('.switch').add('switch--unactive')
			}
			permission.onchange = function() {
				if (permission.state == 'denied') {
					cl('.switch').add('switch--unactive');
				} else {
					cl('.switch').remove('switch--unactive');
				}
			}
		})

};

// Notifications enabler
function enableNotifications() {

	navigator.permissions.query({name: 'notifications'})
		.then(permission => {
			if (permission.state !== 'granted') {
				Notification.requestPermission();
				notifState.checked = false;
			}
			permission.onchange = function() {
				if (permission.state == 'granted') {
					notifState.checked = true;
				} else {
					notifState.checked = false;
				}
			}
		})

}
