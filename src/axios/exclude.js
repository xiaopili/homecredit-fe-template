let excludeUrl = [
	'base-info'
];

let isExclude = (config) => {

	let adjust = false;
	excludeUrl.forEach(element => {
		if (element.indexOf(config.url > 0)){
			adjust = true
		}
	});
	return adjust;
}


export default isExclude;
