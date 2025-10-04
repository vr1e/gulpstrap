setInterval(function () {
	const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
	const title = document.querySelector('h1.title');

	title.style.color = randomColor;
	console.log(
		'Title color changed to' + '%c ' + randomColor,
		'color: ' + randomColor
	);
}, 3000);
