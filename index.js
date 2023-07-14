var api = "https://pipedapi.kavin.rocks/streams/";

const dModal = new mdb.Modal(document.getElementById('exampleModal'));

function setServer(url, name){
  api=url+"/streams/";
  document.getElementById("dropdownMenuLink").innerHTML=name;
}

function developer(){
 Swal.fire({
  title: 'Shailendra Maurya',
  imageUrl: 'https://avatars.githubusercontent.com/u/87139652?v=4',
  imageWidth: 250,
  imageHeight: 250,
  imageAlt: 'Shailendra Maurya',
  html:
    'A passionate web developer & a medico, ' +
    '<a href="mailto:info@shailen.onweb.im">Email</a> ',
  showCloseButton: true,
  showCancelButton: false,
  focusConfirm: false,
  confirmButtonText:
    '<i class="fa fa-thumbs-up"></i> Awesome!',
  confirmButtonAriaLabel: 'Thumbs up, Awesome !'
}) 
}

function about(){
  Swal.fire({
  title: 'Racoon',
  imageUrl: 'logo.png',
  imageWidth: 200,
  imageHeight: 200,
  imageAlt: 'Racoon',
  html:
    'Racoon is lightweight YouTube downloader written in HTML, JS with mdb library, it uses piped API for fetching data',
  showCloseButton: true,
  showCancelButton: false,
  focusConfirm: false,
  confirmButtonText:
    '<i class="fa fa-thumbs-up"></i> Great!',
  confirmButtonAriaLabel: 'Thumbs up, Great !'
}) 
}

async function getServer(){
await fetch('https://piped-instances.kavin.rocks')
	.then(res => res.json())
	.then(data => {
	  const fragment = document.createDocumentFragment();
	  
		for (const instance of data) {
			const name = instance.name;
			const url = instance.api_url;
			
			var li = document.createElement("li");
			li.innerHTML=`
			<a class="dropdown-item" href="javascript:setServer('${url}','${name}')">${name}</a>
			`;
			fragment.appendChild(li);
		}
		document.querySelector(".dropdown-menu").appendChild(fragment);
	})
	.catch(err => {
		Swal.fire(
  'Offline??',
  'Try reloading the app OR check Internet, because fetching server instances failed',
  'warning'
).then((result) => {
  /* Read more about isConfirmed, isDenied below */
  if (result.isConfirmed) {
  location.reload();
  }
})
			
	});
}

getServer();

function id(url){
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(shorts\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}


function downloader(url, name, format) {
  const loader = document.createElement("div");
  loader.innerHTML=`Generating Link... <div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`;

console.log(url);

const modal = document.querySelector(".modal-body");
modal.innerHTML=""
modal.appendChild(loader);

  dModal.toggle();
  const upload_api="http://f0841623.xsph.ru/api.php?link="+encodeURIComponent(url);
  fetch(upload_api)
  .then(response=>response.json())
  .then(data=>{
    if(data.success){
      modal.removeChild(loader);
      modal.innerHTML="Download link generated successfully 🎉 <br><br>";
      const dButton = document.getElementById("btn-download");
      dButton.classList.remove("disabled");
      dButton.addEventListener("click", function(){
        // Retrieve the file URL from the API response
var fileUrl = "http://f0841623.xsph.ru/uploads/"+data.filename;

var a = document.createElement("a");
a.href="http://f0841623.xsph.ru/file.php?fileName="+name+"."+format+"&fileUrl="+fileUrl;
a.download=""
document.body.appendChild(a);

      const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

Toast.fire({
  icon: 'success',
  title: 'Download will be Started Soon 🎉'
})
dModal.hide();
      // Trigger the download
a.click();
      document.body.removeChild(a);
      });
    }
    else{
      modal.innerHTML=JSON.stringify(data);
    }
  })
}




function getVid(){
  var url = document.getElementById("form1").value;
  if(!id(url)){
    const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

Toast.fire({
  icon: 'error',
  title: 'Enter a valid YouTube link'
})
return;
  }
  const globalLoader = document.getElementById("globalLoader");
  globalLoader.style.display="block";
  fetch(api+id(url))
  .then(response=>response.json())
  .then(data => {
    var title = data.title;
    var desc = data.description;
    document.querySelector(".img-fluid").setAttribute("src", "https://img.youtube.com/vi/"+id(url)+"/0.jpg");
    document.querySelector(".card").style.display="block";
    
    document.querySelector(".card-title").innerHTML=title;
    
    const tbody = document.getElementsByTagName("tbody")[0]; // Get the first tbody element
    tbody.innerHTML="";
    globalLoader.style.display="none";
    let rowNumber = 1;
    //video streams
for (let i = 0; i < data.videoStreams.length; i++) {
  const stream = data.videoStreams[i];

  if (!stream.videoOnly) {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td scope="col">${rowNumber}</td>
      <td scope="col">Video</td>
      <td scope="col">${stream.quality}</td>
      <td scope="col"><button type="button" class="btn btn-success" onclick="downloader('${data.videoStreams[i].url}', '${title}', 'mp4')">
  <i class="fas fa-download"></i>
</button></td>
    `;
    
    tbody.appendChild(newRow);
    rowNumber++;
  }
}


    
//audio streams
for (let i = 0; i < data.audioStreams.length; i++) {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td scope="col">${rowNumber}</td>
    <td scope="col">Audio</td>
    <td scope="col">${data.audioStreams[i].quality}</td>
    <td scope="col"><button type="button" class="btn btn-info" onclick="downloader('${data.audioStreams[i].url}', '${title}', 'mp3')">
  <i class="fas fa-download"></i>
</button></td>
  `;
  
  tbody.appendChild(newRow);
  rowNumber++;
}

      
    document.getElementById("form1").value="";
  })
  .catch(err=>{
    Swal.fire(
  'Oh no !',
  'Error while fetching video details, Retry or check Internet Connection',
  'error'
)
        globalLoader.style.display="none";
    
  })
  

}



function download(){
  document.getElementById("download-btn").innerHTML=`Download&nbsp;&nbsp;<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
  document.querySelector(".table").style.visibility="visible";
  
}