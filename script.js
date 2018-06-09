var counter = 1
function pruebaGet()
{
	reqInterface.getRequestAJAX('receta/6', procesaJSON);

	function procesaJSON(objJSON)
	{
		/*
		Si uso FETCH

		objJSON.json().then(function(json){
			console.log(json);
			let body = document.querySelector('body'),
				newEl = document.createElement('p');

			newEl.innerText = json.FILAS[0].nombre;

			body.appendChild(newEl);

		});
		*/
		//Si uso AJAX
		
		let json = JSON.parse(objJSON);
		console.log(json);
	}

}

function pruebaPost(formulario)
{
	reqInterface.postRequestFETCH('login/', formulario, login_ok, false, false);

	function login_ok(response)
	{
		//SI LO HAGO CON FETCH

		response.json().then(function(responsejs)
		{
			console.log(responsejs);
			userManager.setLogin(responsejs.login);
			userManager.setKey(responsejs.clave);

			console.log(userManager.getLogin());
			console.log(userManager.getKey());
		});

		//SI LO HAGO CON AJAX
		
		/*
			let responsejs = JSON.parse(response);
			console.log(responsejs);
			userManager.setLogin(responsejs.login);
			userManager.setKey(responsejs.clave);

			console.log(userManager.getLogin());
			console.log(userManager.getKey());
		*/
	}

	return false;
}

function postComment(formulario)
{
	reqInterface.postRequestFETCH('receta/6/comentario', formulario, comment_ok, true, true);

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

function AddCanvas()
{
	document.querySelector('body').innerHTML += '<br>'
	cvManager.addNewCanvas('cv0' + counter, 420, 360);
	document.querySelector('body').innerHTML += `<br><input type="file" onchange = "cvManager.drawImageOnCanvas(this,'cv0' + ${counter})">
												 <br><button onclick = "cvManager.resetCanvas('cv0' + ${counter} )">Resetea</button>`;
	console.log(cvManager.getCanvasArray());
	counter ++;
}


