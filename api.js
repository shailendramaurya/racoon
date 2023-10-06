// Default api link in case fetching all instances fails
const apiList = ['https://pipedapi.kavin.rocks'];

fetch('https://piped-instances.kavin.rocks')
	.then(res => res.json())
	.then(data => {
		apiList.shift();
		data.map(_ => apiList.push(_.api_url))
	});

export default function fetchStreamInfo(id, instance = 0) {
	return fetch(apiList[instance] + '/streams/' + id)
		.then(res => res.json())
		.catch(() => {
			if (instance == apiList.length)
				return;
			fetchStreamInfo(id, instance + 1);
		})
}

