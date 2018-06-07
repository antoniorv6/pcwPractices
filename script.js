function pruebaGet()
{
	reqInterface.getRequest('receta/6', procesaJSON);

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
		console.log(response);
		userManager.setLogin(response.login);
		userManager.setKey(response.clave);

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


