function pruebaGet()
{
	reqInterface.getRequestFETCH('receta/6', procesaJSON);

	function procesaJSON(objJSON)
	{
		objJSON.json().then(function(json){
			console.log(json);
			let body = document.querySelector('body'),
				newEl = document.createElement('p');

			newEl.innerText = json.FILAS[0].nombre;

			body.appendChild(newEl);

		});
	}

}

function pruebaPost(formulario)
{
	reqInterface.postRequest('login/', formulario, login_ok, false, false);

	function login_ok(response)
	{
		let responsejs = JSON.parse(response);
		console.log(responsejs);
		userManager.setLogin(responsejs.login);
		userManager.setKey(responsejs.clave);

		console.log(userManager.getLogin());
		console.log(userManager.getKey());
	}

	return false;
}

function postComment(formulario)
{
	reqInterface.postRequest('receta/6/comentario', formulario, comment_ok, true, true);

	function comment_ok(response)
	{
		console.log(response);
	}

	return false;
}

function cargaFichero(file)
{
	fileManager.chargeFile(file, hola);

	function hola()
	{}
}

function cargaFoto(file)
{
	fileManager.chargePhoto(file, funcion);

	function funcion(photo)
	{
		console.log(photo);
		document.querySelector('.placerPhoto').appendChild(photo);
	}
}


