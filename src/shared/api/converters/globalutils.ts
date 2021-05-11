function initDelay(milliseconds: number) {
	return new Promise(res => {
		setTimeout(()=> {
			res('=)');
		}, milliseconds);
	})
}

export {
	initDelay,
}