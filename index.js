const thumbnail = document.getElementById('thumbnail');
const title = document.getElementById('title');
const videoDataContainer = document.getElementById('videoData');
const [yt, piped, ytify] = videoDataContainer.getElementsByTagName('a');
const table = document.querySelector('tbody');
// Default api link in case fetching all instances fails

const apiList = ['https://pipedapi.kavin.rocks'];

fetch('https://piped-instances.kavin.rocks')
	.then(res => res.json())
	.then(data => {
		apiList.pop();
		data.map(_ => apiList.push(_.api_url))
	});



// paramerer data is an array in the form [type,codec,quality,download()]
function createRow(data) {
	const tr = document.createElement('tr');
	for (let i = 0; i < 4; i++) {
		const td = document.createElement('td');
		td.scope = 'col';
		i === 3 ?
			td.appendChild(data[i]) :
			td.textContent = data[i];
		tr.appendChild(td);
	}
	table.appendChild(tr);
}

function createDownloadLink(url) {
	const btn = document.createElement('p');
	btn.textContent='⬇️';
	btn.addEventListener('click', () => {
		/*
		download the url to your server
		pass download action to the event listener
		*/
	})

	return btn;
}


function fetchStreamInfo(id, instance = 0) {
	if (!id) return;
	fetch(apiList[instance] + '/streams/' + id)
		.then(res => res.json())
		.then(data => {

			if (videoDataContainer.classList.contains('hidden'))
				videoDataContainer.classList.remove('hidden');

			thumbnail.src = `https://img.youtube.com/vi_webp/${id}/hqdefault.webp`;
			title.src = data.title;
			yt.href = 'https://youtu.be/' + id;
			piped.href = 'https://piped.video/watch?v=' + id;
			ytify.href = 'https://ytify.netlify.app?s=' + id;

			data.videoStreams.filter(_=>!_.videoOnly).forEach(_ => createRow(['Video', _.format, _.quality, createDownloadLink(_.url)]));

			data.audioStreams.forEach(_ => createRow(['Audio', _.format, _.quality, createDownloadLink(_.url)]));
		})
		.catch(() => {
			if (instance < apiList.length)
				fetchStreamInfo(id, instance + 1);
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