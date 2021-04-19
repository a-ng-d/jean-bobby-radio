export let
	io = {
		state: false,

		get getState() {
			return this.state
		},

		set setState(newState) {
			return this.state = newState
		}
	};

export function $(elmt) {
	return document.querySelector(elmt)
};

export function each$(elmt) {
	return document.querySelectorAll(elmt)
};

export function cl(elmt) {
	return $(elmt).classList
}
