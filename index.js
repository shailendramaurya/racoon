function formatBytes(a,b=2){if(!+a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return`${parseFloat((a/Math.pow(1024,d)).toFixed(c))} ${["Bytes","KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"][d]}`}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const url = urlParams.get("url");
const ref = urlParams.get("ref");
const statusDiv = document.getElementById("status");

const status = {
  "loading": function(){
    statusDiv.innerHTML=``;
    statusDiv.innerHTML=`<i class="gg-loadbar-alt"></i>`;
  },
  "success": function(fileSize){
    statusDiv.innerHTML=``;
    statusDiv.innerHTML=`
 <i class="gg-check"></i><br><h4>`+fileSize+`</h4>`;
  }
}

function processUrl(x){
  if(url){
    document.getElementById('url').value=url;
    submit(x);
  }
  else{return}
}
processUrl(url);

function submit(x) {
  if(!x){return}
  var api = "https://co.wuk.sh/api/json";
  var url = encodeURIComponent(x);
  
  var vQuality = document.getElementById('vQuality').value || 720;
  var isAudioOnly = document.getElementById('isAudioOnly').checked || false;
  var aFormat = isAudioOnly ? (document.getElementById('aFormat').value || 'best') : null;

  const requestBody = {
    url: url,
    vQuality: vQuality,
    isAudioOnly: isAudioOnly,
    aFormat: aFormat
  };


  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(requestBody),
  };
status.loading();

  fetch(api, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Response data:', data);

      const fileUrl = data.url;
      // Fetch the file size
      fetch(fileUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('File download failed');
          }
          return response.headers.get('content-length');
        })
        .then(fileSize => {
          status.success(formatBytes(fileSize));

          // create a download link
          const downloadLink = document.createElement('a');
          downloadLink.href = fileUrl;
          downloadLink.download = 'file';
          downloadLink.click();
        })
        .catch(error => {
          console.error('Error downloading file:', error);
        });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}