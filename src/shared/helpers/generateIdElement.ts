function generateIdElement() {
	return `${Math.random().toString(36).substr(2, 5)}`
};

export default generateIdElement;