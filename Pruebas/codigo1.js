function anyadir()
{
	//let ul = document.getElementById('hola');
	let ul = document.querySelector('#hola'),
		li = document.createElement('li');
	
	li.innerHTML = '<a href = "http://www.ua.es">Enlacedelaua</a>'
	//li.textContent = '<a href = "http://www.ua.es">Enlacedelaua</a>';
	ul.insertBefore(li, ul.querySelector('li:nth-of-type(2)'));

}


function cambiar()
{
	let ul = document.querySelector('#hola');

	ul.outerHTML = `<article>
						<h3>Título del artículo</h3>
						<p>kadfjlkdsfjakldfjaskldfj</p>
					</article>`;

}


function pedirEntradas()
{
	let xhr = new XMLHttpRequest(),
		url = 'rest/receta/?u=6';

	xhr.open('GET', url, true);

	xhr.onload = function()
	{
		console.log(xhr.responseText);

		let objJSON = JSON.parse(xhr.responseText),
			div = document.querySelector('#recetas');

		div.innerHTML = '<ul>';

		objJSON.FILAS.foreach(e=>
		{
			console.log(e);
			div.innerHTML += `<li>${e.nombre}</li>`;
		});

		div.innerHTML += '</ul>';

	};

	xhr.onerror = function()
	{
		console.log('Erroraso');
	};

	xhr.send();
}

function pedirEntradasFetch()
{
	let url = 'rest/receta/?u=6',
		div = document.querySelector('#recetas');

	fetch(url).then(function(response){
		response.text().then(function(texto)
		{
			console.log(texto);
			let objJSON = JSON.parse(texto);
			console.log(objJSON.FILAS.length);
			for(let k in objJSON.FILAS)
			{
				console.log(objJSON.FILAS[k].nombre);
			}
		});
	}, 
	function(error){
		console.log('ERORR');
	});
}

function hacerLogin(frm)
{
	let fd = new FormData(frm)
		xhr = new XMLHttpRequest(),
		url = 'rest/login/';

	xhr.open('POST',url, true);
	
	xhr.onload = function()
	{
		console.log(xhr.responseText);
		let r = JSON.parse(xhr.responseText);

		if(r.RESPUESTA = 'OK')
		{
			console.log(r);
			sessionStorage.setItem('usuario',xhr.responseText);
		}
		else
		{
			console.log('ERROR');
		}
	};
	
	xhr.setRequestHeader('Authentication', clave);

	xhr.send(fd);

	return false;
}

function dejarComentario()
{
	let xhr = new XMLHttpRequest(),
		url = 'rest/receta/1/comentario/',
		fd = new FormData(),
		usu;
		
		if(!sessionStorage.getItem('usuario'))
			return false;
		usu = JSON.parse(sessionStorage.getItem('usuario'));


	fd.append('titulo', 'Hola, soy Luján');
	fd.append('texto', 'Odio PCW');
	fd.append('l', usu.login);

	xhr.open('POST',url,true);
	xhr.onload = function()
	{
		console.log(xhr.responseText);
	};
	xhr.setRequestHeader('Authorization', usu.clave);
	xhr.send(fd);
}