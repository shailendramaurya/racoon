const thumbnail = document.getElementById('thumbnail');
const title = document.getElementById('title');
const videoDataContainer = document.getElementById('videoData');
const [yt, piped, ytify] = videoDataContainer.getElementsByTagName('a');
const table = document.querySelector('tbody');
const loader = document.getElementById('loader');

// Default api link in case fetching all instances fails
const apiList = ['https://pipedapi.kavin.rocks'];

fetch('https://piped-instances.kavin.rocks')
	.then(res => res.json())
	.then(data => {
		apiList.pop();
		data.map(_ => apiList.push(_.api_url))
	});

	// Subsequently remove emojis & special characters (excluding spaces)

const removeEmojis = url => url.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "").replace(/[^a-zA-Z0-9 ]/g, '');


function generateRandomStr(length) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * charactersLength);
		result += characters.charAt(randomIndex);
	}
	return result;
}


// paramerer data is an array in the form [type,codec,quality,download()]
function createRow(data) {
	const tr = document.createElement('tr');
	for (let i = 0; i < 4; i++) {
		const td = document.createElement('td');
		td.scope = 'col';
		i === 3 ?
			td.appendChild(data[3],data[4]) :
			td.textContent = data[i];
		tr.appendChild(td);
	}
	table.appendChild(tr);
}

function createDownloadLink(url,name) {
	const btn = document.createElement('p');
	btn.className = 'download';
	btn.addEventListener('click', () => {
		loader.classList.remove('hidden');
		fetch('https://racoon.shailendramaurya.workers.dev/?link=' + encodeURIComponent(url))
			.then(res => res.json())
			.then(data => {
				if (!data.success) throw new Error('failed to load');
				const fileUrl = 'https://racoon-dl.shailendramaurya.workers.dev/uploads/' + data.filename;

				const a = document.createElement('a');
				a.href = 'https://sm.likesyou.org/song.php?fileName=' +
					encodeURIComponent(name) +
					'.' +
					format +
					'&fileUrl=' +
					fileUrl + '&nocache=' + generateRandomStr(5);
				a.download = '';
				a.click();
			})
			.catch(_ => alert(_))
			.finally(() => loader.classList.add('hidden'));

	})

	return btn;
}


function fetchStreamInfo(id, instance = 0) {
	if (!id) return;
	loader.classList.remove('hidden');
	fetch(apiList[instance] + '/streams/' + id)
		.then(res => res.json())
		.then(data => {

			if (videoDataContainer.classList.contains('hidden'))
				videoDataContainer.classList.remove('hidden');
			const title = removeEmojis(data.title);
			thumbnail.src = `https://img.youtube.com/vi_webp/${id}/hqdefault.webp`;
			title.src = title;
			yt.href = 'https://youtu.be/' + id;
			piped.href = 'https://piped.video/watch?v=' + id;
			ytify.href = 'https://ytify.netlify.app?s=' + id;

			data.videoStreams
				.filter(_ => !_.videoOnly)
				.forEach(_ => createRow([
					'Video',
					_.format,
					_.quality,
					createDownloadLink(_.url),
					title
					]));

			data.audioStreams
				.forEach(_ => createRow([
					'Audio',
					_.format,
					_.quality,
					createDownloadLink(_.url),
					title
					]));
		})
		.catch(() => {
			if (instance < apiList.length)
				fetchStreamInfo(id, instance + 1);
		})
		.finally(() => {
			loader.classList.add('hidden');
		})
}


function id(url) {
	const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(shorts\/)|(watch\?))\??v?=?([^#&?]*).*/;
	const match = url.match(regExp);
	return match && match[7].length == 11 ? match[7] : false;
}


// form action 

document.forms[0].addEventListener('submit', _ => {
	_.preventDefault();
	fetchStreamInfo(id(_.target.firstElementChild.value));
});


// url query param
const queryParam = new URL(location.href).searchParams;
if (queryParam.has('link'))
	fetchStreamInfo(id(queryParam.get('link')));