//DEFINICION DE CLASES Y METODOS DE VARIABLES
function RequestInterface()
{
	var baseURL = 'rest/';

	this.geturl = function(url)
	{
		console.log(baseURL + url);
		return baseURL + url;
	}

	this.setBaseURL = function(newURL)
	{
		baseURL = newURL;
	}

}

function UserManagement()
{
	this.setLogin = function(user)
	{
		sessionStorage.setItem('login', user);
	}

	this.setKey = function(auth)
	{
		sessionStorage.setItem('key', auth);
	}

	this.getLogin = function()
	{
		return sessionStorage.getItem('login');
	}

	this.getKey = function()
	{
		return sessionStorage.getItem('key');
	}

	this.logout = function()
	{
		sessionStorage.removeItem('login');
		sessionSotrage.removeItem('key');
	}

	this.isUserLoggedIn = function()
	{
		if(sessionStorage.getItem('login') == null)
			return false;

		return true;
	}
}

function ModalManagement()
{
	var isModalSet = false;

	this.changeStatus = function(status)
	{
		isModalSet = status;
	}

	this.getModalStatus = function()
	{
		return isModalSet;
	}
}

function FileManager()
{
	var lastImagesrc = undefined;

	this.getLastSrc = function()
	{
		return lastImageSrc;
	}

	this.setNewSrc = function(src)
	{
		lastImagesrc = src;
	}
}

//DEFINICION DE METODOS COMPLEJOS

RequestInterface.prototype.getRequestFETCH = function(url, callbacksuccess)
{
	fetch(this.geturl(url)).
		then(
				function(result)
				{
					callbacksuccess(result);
				},
				function(error)
				{
					console.log('error');
				}		
			);
}

RequestInterface.prototype.getRequestAJAX = function(url, callbacksuccess)
{
	xhr = new XMLHttpRequest();

	xhr.open('GET', this.geturl(url), true);

	xhr.onload = function()
	{
		callbacksuccess(xhr.responseText);
	}

	xhr.send();
}

RequestInterface.prototype.postRequestAJAX = function (url, form, callbacksuccess, isHeaderRequired, isUserRequired)
{
	let formData = new FormData(form),
		xhr = new XMLHttpRequest();

	xhr.open('POST', this.geturl(url), true);
	xhr.onload = function()
	{
		callbacksuccess(xhr.responseText);
	}

	if(isHeaderRequired)
	{
		xhr.setRequestHeader('Authorization', userManager.getKey());
	}

	if(isUserRequired)
	{
		formData.append('l', userManager.getLogin())
	}

	xhr.send(formData);
}

RequestInterface.prototype.postRequestFETCH = function (url, form, callbacksuccess, isHeaderRequired, isUserRequired)
{
	let formData = new FormData(form);
	let data = {'method':'POST', 'body': formData};

	if(isUserRequired)
	{
		formData.append('l', userManager.getLogin())
	}

	if(isHeaderRequired)
	{
		let header = {'Authorization' : userManager.getKey()}
		data["headers"] = header;
	}

	fetch(this.geturl(url), data).then(
		function(result)
		{
			callbacksuccess(result);
		},
		function(error)
		{

		});

}

ModalManagement.prototype.setModalZone = function()
{
	if(!this.getModalStatus())
	{
		let body = document.querySelector('body'),
			modal = document.createElement("div"),
			modalCont = document.createElement("div");

		//Esta zona la podeis editar como queráis, yo creo que es la forma mas facil de hacer un modal tranquilamente, pero ya como querais
		modal.id = "mensajemodal";
		modal.classList.add('modal');
		modalCont.classList.add('modal-content');
		modal.appendChild(modalCont);	
		body.insertBefore(modal, body.firstChild);
		this.changeStatus(true);
	}
}

ModalManagement.prototype.openModal = function(success, title, message)
{
	//******PODEIS PERSONALIZAR COMO QUERAIS******//

	if(this.getModalStatus())
	{
		document.getElementById('mensajemodal').style.display = 'block';

		if(success)
		{
			document.querySelector('.modal-content').innerHTML += `<h3 class="success">${title}</h3>
			${message}
			<button onclick="modalManager.closeModal()">Volver</button>`;
		}
		else
		{
			document.querySelector('.modal-content').innerHTML += `<h3 class="fail">${title}</h3>
			${message}
			<button onclick="modalManager.closeModal()">Volver</button>`;
		}
	}
}

ModalManagement.prototype.closeModal = function()
{
	//******PODEIS PERSONALIZAR COMO QUERAIS******//
	if(this.getModalStatus())
	{
		document.getElementById('mensajemodal').style.display = 'none';
		document.querySelector('.modal-content').innerHTML = null;
	}
}

FileManager.prototype.chargePhoto = function(file, callbacksuccess)
{
	if(file.files[0]!=null && this.checkExtension(file.files[0]))
	{
		let fr = new FileReader();

			fr.onload = function()
				{
					let img = new Image();
					img.onload = function()
					{
						// Devuelve toda la etiqueta img preparada para lo que queramos suuuuh
						fileManager.setNewSrc(img.src);
						callbacksuccess(img);
					};
					img.src = fr.result;
				}

		fr.readAsDataURL(file.files[0]);
	}
}

FileManager.prototype.checkExtension = function(file)
{
	if(file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/gif' || file.type == 'image/svg')
		return true;
	return false;
}


let reqInterface = new RequestInterface(),
	userManager = new UserManagement();
	modalManager = new ModalManagement();
	fileManager = new FileManager();
