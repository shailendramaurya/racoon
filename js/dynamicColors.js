let colorIndex = 0;

fetch('assets/themes.json')
	.then(_ => _.json())
	.then(themes => {
		setTimeout(() => {
			if (colorIndex === themes.length) colorIndex = 0;
			const theme = themes[colorIndex];
			for (vars in theme)
				document.querySelector(':root').style.setProperty(vars, theme[vars]);
			colorIndex++;
		}, 3000);
	});