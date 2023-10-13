const themes = [
	{ // Indigo
		"--main": "#3949ab",
		"--hover": "#303f9f",
		"--focus": "rgba(57, 73, 171.0 .125)",
		"--inverse": "#FFF",
		"--hoverDark": "#3f51b5",
		"--focusDark": "rgba(57, 73, 171, 0.25)"
},
	{ // Blue
		"--main": "#1e88e5",
		"--hover": "#1976d2",
		"--focus": "rgba(30, 136, 229, 0.125)",
		"--inverse": "#FFF",
		"--hoverDark": "#2196f3",
		"--focusDark": "rgba(30, 136, 229, 0.25)"
}
];

let i = 0;

setInterval(() => {
	if (i === themes.length) i = 0;
	const theme = themes[i];
	for (vars in theme)
		document.querySelector(':root').style.setProperty(vars, theme[vars]);
	i++;
}, 2000);