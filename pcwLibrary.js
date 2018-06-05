//DEFINICION DE CLASES Y METODOS DE VARIABLES
function RequestInterface()
{
	var baseURL = 'rest/';
	var authorizationHeader = {};

	this.geturl = function(url)
	{
		console.log(baseURL + url);
		return baseURL + url;
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
}

function ModalManagement()
{
	//TODO ==> Mañana me meto al tema de modals
}

//DEFINICION DE METODOS COMPLEJOS

RequestInterface.prototype.getRequest = function(url, callbacksuccess)
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

RequestInterface.prototype.postRequest = function (url, form, callbacksuccess, isHeaderRequired, isUserRequired)
{
	let formData = new FormData(form),
		xhr = new XMLHttpRequest();

	xhr.open('POST', this.geturl(url), true);
	xhr.onload = function()
	{
		let response = JSON.parse(xhr.responseText);
		callbacksuccess(response);
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

let reqInterface = new RequestInterface(),
	userManager = new UserManagement();
