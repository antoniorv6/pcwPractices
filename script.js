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

var m_pagActual = 0;

function loadMenu()
{
	let menu = document.querySelector('#menu');
	menu.innerHTML = null;
	menu.innerHTML = `<li><label for="hamburguesa">&equiv;</label></li>
					<li><a href="index.html"><span class="icon-home-outline"></span><span>INICIO</span></a></li>
					<li><a href="buscar.html"><span class="icon-search"></span><span>BUSCAR</span></a></li>`;
	if(sessionStorage.getItem('usuario') == null)
	{
		menu.innerHTML += `<li><a href="login.html"><span class="icon-login"></span><span>LOGIN</span></a></li>
						  <li><a href="registro.html"><span class="icon-user-plus"></span><span>REGISTRO</span></a></li>`;
	}
	else
	{
		menu.innerHTML += `<li><a href="index.html" onclick = "Logout();"><span class="icon-logout"></span><span>LOGOUT</span></a></li>
						   <li><a href="nueva-receta.html"><span class="icon-list-add"></span><span>NUEVA RECETA</span></a></li>`;
	}

	menu.innerHTML += '<li><a href="acerca.html"><span class="icon-info-circled"></span><span>ACERCA DE</span></a></li>';
}

function Logout()
{
	sessionStorage.removeItem('usuario');
}

function getvariablesURL(nombre)
{
	url = window.location.href;
	nombre = nombre.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + nombre + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    return results[2];
}

function searchByAuthor()
{
	autor = getvariablesURL('a');
	console.log(autor);
	let c_url = 'rest/receta/?a='+autor;
		c_seccion = document.querySelector('#receipts');

	fetch(c_url).then(function(response){
		response.json().then(function(texto)
		{
			console.log(texto);
			writeReceiptObject(texto);	
		},

		
	function(error){
		console.log('ERORR');
	});
});
}


function QuickSearch(form)
{
	let formdata = new FormData(form);
	let c_url = 'rest/receta/?t='+formdata.get('text');
		c_seccion = document.querySelector('#receipts');

	fetch(c_url).then(function(response){
		response.json().then(function(texto)
		{
			writeReceiptObject(texto);	
		}, 
	function(error){
		console.log('ERORR');
	});
});

	return false;
}

function loadResearch()
{
	url = window.location.href;
	var regex = new RegExp("[?&]" + "type" + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if(results!=undefined)
    {
		switch(Number(results[2]))
		{
			case 1:
				console.log("Buscar por autor");
				searchByAuthor();
			break;
		}
	}
	else 
	{
		console.log("No buscar");
		pedirRecetasFetch(0);		
	}	
}

function writeReceiptObject(texto, pagina)
{
	console.log(texto);
	texto.FILAS.forEach(function(objJSON)
			{
				c_seccion.innerHTML += 
				`<article>
				<div>
				<a href="receta.html?id=${objJSON.id}"><h2>` + objJSON.nombre + `</h2></a>
				</div>
				<div class="content">
				<img src='fotos/`+ 
				objJSON.fichero 
				+`'alt="foto de la receta">
				<p><a href="buscar.html?type=1&a=`+objJSON.autor+`"><strong><span class="icon-user"></span>`+
				objJSON.autor
				+`</strong></a></p>
				<span class="icon-calendar"></span><time datetime="`+
				objJSON.fecha
				+`">`+
				objJSON.fecha
				+`</time>
				<p>`+objJSON.elaboracion+`</p>
					<ul>
						<li><span class="icon-thumbs-up"></span>`+objJSON.positivos+`</li>
						<li><span class="icon-thumbs-down"></span>`+objJSON.negativos+`</li> 
						<li><span class="icon-comment"></span>`+objJSON.comentarios+`</li>
					</ul>		
				</div>
				</article>`;
			});

	c_seccion.innerHTML += 
			`<ul>
				<li><button onclick="FirstPag();">Primera</button></li>
				<li><button onclick="DecrementPag();"><span class="icon-left-big"></span></button></li>
				<li><button>`+(Number(localStorage.getItem('actual'))+1)+` de `+localStorage.getItem("paginas")+`</button></li>
				<li><button onclick="IncrementPag();"><span class="icon-right-big"></span></button></li>
				<li><button onclick="LastPag();">Última</button></li>
			</ul>`
}

function LastPag()
{
	if(localStorage.getItem("actual")!=localStorage.getItem("paginas")-1)
	{
		localStorage.setItem("actual", Number(localStorage.getItem("paginas")-1));
		pedirRecetasFetch(localStorage.getItem("actual"));
	}
}

function FirstPag()
{
	if(localStorage.getItem("actual")!=0)
	{
		localStorage.setItem("actual", 0);
		pedirRecetasFetch(0);
	}
}

function IncrementPag()
{
	if(localStorage.getItem("actual") + 1 <= localStorage.getItem("paginas")-1)
	{
		localStorage.setItem("actual", Number(localStorage.getItem("actual")+1));
		pedirRecetasFetch(localStorage.getItem("actual"));
	}
}

function DecrementPag()
{
	if(localStorage.getItem("actual") - 1 >= 0)
	{
		localStorage.setItem("actual", Number(localStorage.getItem("actual")-1));
		pedirRecetasFetch(localStorage.getItem("actual"));
	}
}

function pedirRecetasFetch(pag)
{
	console.log(pag);
	console.log("SessionStorage: " + localStorage.getItem('actual'));
	let c_url = 'rest/receta/?pag='+pag+'&lpag=6'
		c_seccion = document.querySelector('#receipts');

		c_seccion.innerHTML = null;
		fetch(c_url).then(function(response){
		response.json().then(function(texto)
		{
			writeReceiptObject(texto);
			var totalpaginas = Math.ceil(texto.TOTAL_COINCIDENCIAS/6);
			console.log(totalpaginas);
			localStorage.setItem("paginas", totalpaginas);
			localStorage.setItem("actual", pag);	
		},

		
	function(error){
		console.log('ERORR');
	});
});
}




function Login(form)
{
	let formulario = new FormData(form)
		xhr = new XMLHttpRequest(),
		url = 'rest/login/';
		clave = undefined;
	xhr.open('POST',url, true);
	
	xhr.onload = function()
	{
		console.log(xhr.responseText);
		let r = JSON.parse(xhr.responseText);
		if(r.RESULTADO == 'ERROR')
		{
			console.log("entro al error");
			let c_error = document.querySelector('.error_message');
			c_error.innerHTML = '<h3 class="error"> ERROR: '+r.DESCRIPCION+'</h3>';		
		}
		else
		{
			clave = r.clave;
			sessionStorage.setItem('usuario',xhr.responseText);
			sessionStorage.setItem('clave', clave);
			window.location.replace("./index.html");
		}
	};

	xhr.setRequestHeader('Authentication', clave);
	console.log(clave);
	xhr.send(formulario);

	return false;
}


function BuscarPorFormulario(form)
{
	let formulario = new FormData(form);
	c_seccion = document.querySelector('#receipts');
	let url = 'rest/receta/?pag=0&lpag=6';
	
	//Procesamos los datos de la búsqueda
	if(formulario.get('nombre') != "")
	{
		url += '&n=' + formulario.get('nombre');	
	}
	if(formulario.get('ingredientes') != "")
	{

		url += '&i=' + formulario.get('ingredientes');	
	}
	
	if(formulario.get('dificultad') != "")
	{
		url += '&d=' + formulario.get('dificultad');
	}

	if(formulario.get('comensales') != "")
	{
		url += '&c=' + formulario.get('comensales');
	}

	if(formulario.get('autor') != "")
	{
		url += '&a=' + formulario.get('autor');
	}

	if(formulario.get('mintiempo')!="" && formulario.get('maxtiempo')!="")
	{
		//Toca comparar los tiempos
		if(Number(formulario.get('maxtiempo'))>Number(formulario.get('mintiempo')))
		{
			url += '&di=' + formulario.get('mintiempo');
			url+= '&df=' + formulario.get('maxtiempo');
		}
	}
	else
	{
		if(formulario.get('mintiempo')!="")
		{
			url += '&di=' + formulario.get('mintiempo');
		}

		if(formulario.get('maxtiempo')!="")
		{
			url += '&df=' + formulario.get('maxtiempo');
		}

	}
	//Terminamos de procesar todos los datos de búsqueda
	console.log(url);

	//Procesamos la petición GET con la URL
	fetch(url).then(function(response){
		response.text().then(function(texto)
		{
			let objJSON = JSON.parse(texto);
			console.log(objJSON.FILAS.length);
			c_seccion.innerHTML = null;

			if(objJSON.FILAS.length == 0)
			{
				c_seccion.innerHTML += '<h3 class="errorbusqueda">NO SE HA ENCONTRADO NINGUNA RECETA</h3>';
			}
			else
			{
				writeReceiptObject(texto);
			}
		});
	}, 
	function(error){
		console.log('ERORR');
	});

	return false;
}

function Register(request)
{
	let formulario = new FormData(request)
		xhr = new XMLHttpRequest(),
		url = 'rest/usuario/';
		clave = undefined;
	xhr.open('POST',url, true);
	
	xhr.onload = function()
	{
		console.log(xhr.responseText);
		let r = JSON.parse(xhr.responseText);
		if(r.RESULTADO == 'ERROR')
		{
			let c_seccion = document.querySelector('#mensajemodal');
			let mensajeModal = document.querySelector('.contenidomodal');
			mensajeModal.innerHTML = '<h3 class="modalHeaderFail"> ERROR</h3><div class="modalcontent"><p>'+r.DESCRIPCION+'</p> <button onclick="closeModal()">Vuelve a intentarlo</a></div>';
			c_seccion.style.display = "block";		
		}
		else
		{
			let c_seccion = document.querySelector('#mensajemodal');
			let mensajeModal = document.querySelector('.contenidomodal');
			mensajeModal.innerHTML = `<h3 class="modalHeaderSuccess">ENHORABUENA</h3>
			<div class="modalcontent"><p>Te has registrado correctamente en Fooder's Choice ¡Disfruta de tu experiencia!</p>
			<a href="index.html">¡De acuerdo!</a></div>`;
			c_seccion.style.display = "block";
			console.log(r);
		}
	};

	xhr.send(formulario);

	return false;
}

function closeModal()
{
	let c_seccion = document.querySelector('#mensajemodal');
	c_seccion.style.display = "none";
}

function checkUsr(usrname)
{
	console.log(usrname);
	let c_url = 'rest/login/' + usrname;
	c_seccion = document.querySelector('#message');

	if(usrname.length < 6)
	{
		c_seccion.innerHTML = `<p class="modalHeaderFail">Por favor, escriba un nombre de usuario con longitud mayor a 6 caracteres</p>`
	}
	else
	{


	fetch(c_url).then(function(response){
		response.text().then(function(texto)
		{
			let objJSON = JSON.parse(texto);
			if (objJSON.DISPONIBLE == true) 
			{
				c_seccion.innerHTML = `<p class="modalHeaderSuccess">Nombre de usuario disponible</p>`
			}
			else
			{
				c_seccion.innerHTML = `<p class="modalHeaderFail">Nombre de usuario no disponible, escoja otro por favor</p>`
			}
		});
	}, 
	function(error){
		console.log('ERORR');
	});
	}

	return false;
}

function loadReceipt()
{
	console.log('Allá vamos');

	let valor = getvariablesURL('id');
	console.log(valor);

	let url = 'rest/receta/' + valor;

	let fichareceta = document.querySelector(".fichareceta");
	let valoraciones = document.querySelector(".valoraciones");

	fetch(url).then(function(response)
		{
			response.json().then(function(texto)
				{
					fichareceta.innerHTML = null;
					texto.FILAS.forEach(function(objJSON)
					{
						console.log(localStorage.getItem("showingPhoto"));
						fichareceta.innerHTML +=
						`<h2>${objJSON.nombre}</h2>
							<article>
								<h2><a href="receta.html">Datos generales</a></h2>
									<ul>
										<li><button onclick="PhotoBefore()"><span class="icon-left-big"></span></button></li>
										<li id="photo"></li>
										<li><button onclick="NextPhoto();"><span class="icon-right-big"></span></button></li>
										<p id="description"></p>
									</ul>
									<ul>
											<li><span class="icon-thumbs-up"></span>${objJSON.positivos}</li>
											<li><span class="icon-thumbs-down"></span>${objJSON.negativos}</li> 
											<li><span class="icon-comment"></span>${objJSON.comentarios}</li>
									</ul>
							</article>
							<article>
								<a href="buscar.html?type=1&a=`+objJSON.autor+`"><h4><span class="icon-user"></span>${objJSON.autor}</h4></a>
								<p><time datetime="2017-02-14 20:00"><span class="icon-calendar"></span> 14-02-2017 20:00 </time></p>
								<p>Dificultad: 
									<span class="icon-fire"></span>
									<span class="icon-fire"></span>
									<span class="icon-fire"></span> 
								</p>

								<p> <span class="icon-food"></span> 4</p>
							</article>
							<article>
								<h2>Ingredientes</h2>
								<ul id= "ingredients">
								</ul>
							</article>
							<article>	
										<h2>Elaboración:</h2>
										<p>${objJSON.elaboracion}</p>
							</article>`;

							if(sessionStorage.getItem("usuario")!=null)
							{
								valoraciones.innerHTML = 
								`<article class="valoracion">
									<h2>¡Deja tu opinión!</h2>
										<div>
											<button onclick="Evaluate(1);"><span class="icon-thumbs-up"></span></button>
											<button onclick="Evaluate(0);"><span class="icon-thumbs-down"></span></button>
										</div>
									<br>

									<form onsubmit="return postComment(this);">
										
										<label>Título del comentario:</label>
										<input type="text" name="titulo" maxlength="50" required>

										<label>Comentario:</label>
										<textarea required name="texto" rows="5"></textarea>
										
										<input type="submit" value="Enviar comentario">

									</form>
								
								</article>`;
							}

					});
					LoadReceiptPhotos(valor);
					LoadIngredients(valor);
					LoadComments(valor);
				});
		},
		function(error)
		{
			console.log("El server funciona jejejejejej");
		});
		
}

function LoadReceiptPhotos(id)
{
	let url = 'rest/receta/'+id+'/fotos';
	let lielement = document.querySelector("#photo");
	fetch(url).then(function(response)
		{
			response.json().then(function(texto)
				{
					console.log(texto.FILAS);
					localStorage.setItem("actualPhotos", JSON.stringify(texto.FILAS));
					localStorage.setItem("photosCounter", 0);
					localStorage.setItem("showingPhoto", texto.FILAS[0].fichero);
					localStorage.setItem("showingPhotoDescription", texto.FILAS[0].texto);

					console.log(localStorage.getItem("actualPhotos"));
					console.log(localStorage.getItem("photosCounter"));
					console.log(localStorage.getItem("showingPhoto"));

					LoadActualPhoto();

				});
		},
		function(error)
		{
			console.log("Erroooor");
		});

}

function NextPhoto(increment)
{
	var counter = Number(localStorage.getItem("photosCounter"));

	let photos = JSON.parse(localStorage.getItem("actualPhotos"));

	if(counter+1 < photos.length)
	{
		localStorage.setItem("photosCounter", counter + 1);
		localStorage.setItem("showingPhoto", photos[counter+1].fichero);
		localStorage.setItem("showingPhotoDescription", photos[counter+1].texto);
	}
	else
	{
		localStorage.setItem("photosCounter", 0);
		localStorage.setItem("showingPhoto", photos[0].fichero);
		localStorage.setItem("showingPhotoDescription", photos[0].texto);
	}

	LoadActualPhoto();
}

function PhotoBefore()
{
	var counter = Number(localStorage.getItem("photosCounter"));

	let photos = JSON.parse(localStorage.getItem("actualPhotos"));

	if(counter-1 >= 0)
	{
		localStorage.setItem("photosCounter", counter - 1);
		localStorage.setItem("showingPhoto", photos[counter-1].fichero);
		localStorage.setItem("showingPhotoDescription", photos[counter-1].texto);
	}
	else
	{
		localStorage.setItem("photosCounter", photos.length-1);
		localStorage.setItem("showingPhoto", photos[photos.length-1].fichero);
		localStorage.setItem("showingPhotoDescription", photos[photos.length-1].texto);
	}

	LoadActualPhoto();
}

function LoadActualPhoto()
{
	let lielementphoto = document.querySelector("#photo");
	let lielementdescription = document.querySelector("#description");
	lielementphoto.innerHTML = `<img src="fotos/${localStorage.getItem("showingPhoto")}" alt="foto de la receta">`;
	lielementdescription.innerHTML = localStorage.getItem("showingPhotoDescription");

}

function LoadIngredients(id)
{
	let url = 'rest/receta/'+id+'/ingredientes';
	let listaIngredientes = document.querySelector('#ingredients');

	listaIngredientes.innerHTML = null;

	fetch(url).then(function(response)
		{
			response.json().then(function(texto)
				{
					texto.FILAS.forEach(function(objJSON)
					{
						listaIngredientes.innerHTML += `<li>${objJSON.nombre}</li>`;
					});
				});
		},
		function(error)
		{
			console.log("Erroooor");
		});
}

function LoadComments(id)
{
	let url = 'rest/receta/'+id+'/comentarios';
	let listaComentarios = document.querySelector('.comentarios');

	listaComentarios.innerHTML = null;

	fetch(url).then(function(response)
		{
			response.json().then(function(texto)
				{
					texto.FILAS.forEach(function(objJSON)
					{
						console.log(objJSON);
						listaComentarios.innerHTML += 
						`<article>
							<h3>${objJSON.titulo}</h3>
							<p><span class="icon-user"></span>${objJSON.autor}</p>
							<span class="icon-calendar"></span><time datetime="${objJSON.fecha}">${objJSON.fecha}</time>
							<p>${objJSON.texto}</p>
							
						</article>`;
					});
				});
		},
		function(error)
		{
			console.log("Erroooor");
		});
}

function postComment(form)
{
	let id = getvariablesURL('id');
	let xhr = new XMLHttpRequest(),
		url = 'rest/receta/'+id+'/comentario/',
		fd = new FormData(form),
		usu = JSON.parse(sessionStorage.getItem('usuario'));
		
	if(!sessionStorage.getItem('usuario'))
		return false;

	fd.append('l', usu.login);

	xhr.open('POST',url,true);
	
	xhr.onload = function()
	{
		console.log(xhr.responseText);
		loadReceipt();
	};

	xhr.setRequestHeader('Authorization', usu.clave);
	xhr.send(fd);

	return false;
}

function Evaluate(valoracion)
{
	let id = getvariablesURL('id');
	let xhr = new XMLHttpRequest(),
		url = 'rest/receta/'+id+'/voto/'+valoracion,
		usu = JSON.parse(sessionStorage.getItem('usuario'));
		fd = new FormData();


	if(!sessionStorage.getItem('usuario'))
		return false;

	fd.append('l', usu.login);

	xhr.open('POST',url,true);
	
	xhr.onload = function()
	{
		loadReceipt();
	};

	xhr.setRequestHeader('Authorization', usu.clave);
	xhr.send(fd);
	return false;
}

