export const getQueryString = (variable) => {
	let query = window.location.search.substring(1);
	let vars = query.split('&');
	for (let i = 0; i < vars.length; i++) {
		let pair = vars[i].split('=');
		if (pair[0] === variable) {
			return pair[1];
		}
	}
	return false;
}

export const  isWeixn = () => {
	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true;
	} else {
		return false;
	}
}
