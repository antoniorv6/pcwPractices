function checkLogin(logged)
{
	switch(logged)
	{
		case 0:
			if(sessionStorage.getItem('usuario') != null)
			{
				window.location.replace("index.html");
			}
		break;
		case 1:
			if(sessionStorage.getItem('usuario') == null)
			{
				window.location.replace("index.html");
			}
		break;
	}
}

function checkReceiptIsValid()
{
	let id = getvariablesURL('id');
	if(id == undefined)
	{
		window.location.replace("index.html");
	}
}

function anyadir()
{
	//let ul = document.getElementById('hola');
	let ul = document.querySelector('#hola'),
		li = document.createElement('li');
	
	li.innerHTML = '<a href = "http://www.ua.es">Enlacedelaua</a>'
	//li.textContent = '<a href = "http://www.ua.es">Enlacedelaua</a>';
	ul.insertBefore(li, ul.querySelector('li:nth-of-type(2)'));

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
    if(results == null)
    	return undefined;
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
			localStorage.setItem('searchURL', c_url);
			localStorage.setItem('searchURL', url);
					var totalpaginas = 0;
					if(texto.TOTAL_COINCIDENCIAS>6)
					{
						totalpaginas = Math.ceil(texto.TOTAL_COINCIDENCIAS/6);
					}
					localStorage.setItem("paginas", totalpaginas);
					localStorage.setItem("actual", 0);
					console.log(totalpaginas);
					writeReceiptObject(texto, 1);	
		},

		
	function(error){
		console.log('ERORR');
	});
});
}

function ProccessQuickSearch(form)
{
	let formdata = new FormData(form);
	window.location.replace('buscar.html?type=2&t='+formdata.get('text'));
	return false;
}

function QuickSearch()
{
    let c_url = 'rest/receta/?t='+getvariablesURL('t')+'&lpag=6';

	fetch(c_url).then(function(response){
		response.json().then(function(texto)
		{
			localStorage.setItem('searchURL', c_url);
			localStorage.setItem('searchURL', url);
					var totalpaginas = 0;
					if(texto.TOTAL_COINCIDENCIAS>6)
					{
						totalpaginas = Math.ceil(texto.TOTAL_COINCIDENCIAS/6);
					}
					localStorage.setItem("paginas", totalpaginas);
					localStorage.setItem("actual", 0);
					console.log(totalpaginas);
			writeReceiptObject(texto, 1);	
		}, 
	function(error){
		console.log('ERORR');
	})

	});
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
			case 2:
				console.log("QuickSearch");
				QuickSearch();
			break; 
		} 
	}
	else 
	{
		console.log("No buscar");
		pedirRecetasFetch(0);		
	}	
}

function writeReceiptObject(texto, type)
{
	console.log(texto);
	let c_seccion = document.querySelector('#receipts');
	c_seccion.innerHTML = null;

	var shower = 1;
	if(localStorage.getItem("paginas")>0)
		shower = localStorage.getItem("paginas");

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
				<li><button onclick="FirstPag(${type});">Primera</button></li>
				<li><button onclick="DecrementPag(${type});"><span class="icon-left-big"></span></button></li>
				<li><button>`+(Number(localStorage.getItem('actual'))+1)+` de `+shower+`</button></li>
				<li><button onclick="IncrementPag(${type});"><span class="icon-right-big"></span></button></li>
				<li><button onclick="LastPag(${type});">Última</button></li>
			</ul>`
}

function LastPag(type)
{
	if(type == 0)
	{
		if(localStorage.getItem("actual")<localStorage.getItem("paginas")-1)
		{
			localStorage.setItem("actual", Number(localStorage.getItem("paginas")-1));
			pedirRecetasFetch(localStorage.getItem("actual"));
		}
	}
	else
	{
		if(localStorage.getItem("actual")<localStorage.getItem("paginas")-1)
		{
			localStorage.setItem("actual", Number(localStorage.getItem("paginas")-1));
			retakeSearchReceipts(localStorage.getItem("paginas")-1);
		}	
	}
}

function FirstPag(type)
{
	if(type == 0)
	{
		if(localStorage.getItem("actual")!=0)
		{
			localStorage.setItem("actual", 0);
			pedirRecetasFetch(0);
		}
	}
	else
	{
		if(localStorage.getItem("actual")!=0)
		{
			localStorage.setItem("actual", 0);
			retakeSearchReceipts(0);
		}
	}
}

function IncrementPag(type)
{
	if(type == 0)
	{
		if(Number(localStorage.getItem("actual")) + 1 < localStorage.getItem("paginas"))
		{
			localStorage.setItem("actual", Number(localStorage.getItem("actual"))+1);
			pedirRecetasFetch(localStorage.getItem("actual"));
		}
	}
	else
	{
		if(Number(localStorage.getItem("actual")) + 1 < localStorage.getItem("paginas"))
		{
			console.log(Number(localStorage.getItem("actual"))+1);
			localStorage.setItem("actual", Number(localStorage.getItem("actual"))+1);
			retakeSearchReceipts(localStorage.getItem("actual"));
		}
	}
}

function DecrementPag(type)
{
	if(type == 0)
	{
		if(localStorage.getItem("actual") - 1 >= 0)
		{
			localStorage.setItem("actual", Number(localStorage.getItem("actual")-1));
			pedirRecetasFetch(localStorage.getItem("actual"));
		}
	}
	else
	{
		if(localStorage.getItem("actual") - 1 >= 0)
		{
			localStorage.setItem("actual", Number(localStorage.getItem("actual")-1));
			retakeSearchReceipts(localStorage.getItem("actual"));
		}
	}
}

function retakeSearchReceipts(pag)
{
	fetch(localStorage.getItem('searchURL')+'&pag='+pag+'&lpag=6').then(function(response){
		response.json().then(function(texto)
		{
			writeReceiptObject(texto, 1);	
		},

		
	function(error){
		console.log('ERORR');
	});
	});
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
			var totalpaginas = Math.ceil(texto.TOTAL_COINCIDENCIAS/6);
			console.log(totalpaginas);
			localStorage.setItem("paginas", totalpaginas);
			localStorage.setItem("actual", pag);
			writeReceiptObject(texto, 0);	
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
	xhr.send(formulario);

	return false;
}


function BuscarPorFormulario(form)
{
	var flag = false;
	let formulario = new FormData(form);
	c_seccion = document.querySelector('#receipts');
	let url = 'rest/receta/?pag=0&lpag=6';
	
	//Procesamos los datos de la búsqueda
	if(formulario.get('nombre') != "")
	{
		flag = true;
		url += '&n=' + formulario.get('nombre');	
	}
	if(formulario.get('ingredientes') != "")
	{
		flag = true;
		url += '&i=' + formulario.get('ingredientes');	
	}
	
	if(formulario.get('dificultad') != "")
	{
		flag = true;
		url += '&d=' + formulario.get('dificultad');
	}

	if(formulario.get('comensales') != "")
	{
		flag = true;
		url += '&c=' + formulario.get('comensales');
	}

	if(formulario.get('autor') != "")
	{
		flag = true;
		url += '&a=' + formulario.get('autor');
	}

	if(formulario.get('mintiempo')!="" && formulario.get('maxtiempo')!="")
	{
		//Toca comparar los tiempos
		if(Number(formulario.get('maxtiempo'))>Number(formulario.get('mintiempo')))
		{
			url += '&di=' + formulario.get('mintiempo');
			url+= '&df=' + formulario.get('maxtiempo');
			flag = true;
		}
	}
	else
	{
		if(formulario.get('mintiempo')!="")
		{
			url += '&di=' + formulario.get('mintiempo');
			flag = true;
		}

		if(formulario.get('maxtiempo')!="")
		{
			url += '&df=' + formulario.get('maxtiempo');
			flag = true;
		}

	}
	//Terminamos de procesar todos los datos de búsqueda
	console.log(url);

	if(flag)
	{
	//Procesamos la petición GET con la URL
		fetch(url).then(function(response){
			response.text().then(function(texto)
			{
				let objJSON = JSON.parse(texto);
				//console.log(objJSON.FILAS.length);
				c_seccion.innerHTML = null;
				if(objJSON.FILAS.length == 0)
				{
					c_seccion.innerHTML += '<h3 class="errorbusqueda">NO SE HA ENCONTRADO NINGUNA RECETA</h3>';
				}
				else
				{
					localStorage.setItem('searchURL', url);
					var totalpaginas = 0;
					if(objJSON.TOTAL_COINCIDENCIAS>6)
					{
						totalpaginas = Math.ceil(objJSON.TOTAL_COINCIDENCIAS/6);
					}
					localStorage.setItem("paginas", totalpaginas);
					localStorage.setItem("actual", 0);
					console.log(totalpaginas);
					writeReceiptObject(objJSON,1);	
				}
			});
		}, 
		function(error){
			console.log('ERORR');
		});
	}

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
			openModal(0, r.DESCRIPCION, 0);	
		}
		else
		{
			openModal(1, "Te has registrado correctamente en Fooder's Choice ¡Disfruta de tu experiencia!", 0);
		}
	};

	xhr.send(formulario);

	return false;
}

function openModal(type,message,parameter)
{
	let c_seccion = document.querySelector('#mensajemodal');
	c_seccion.innerHTML = null;
	var newSpace = document.createElement('div');
	newSpace.setAttribute('class', 'contenidomodal');
	if(type == 0)
	{
		newSpace.innerHTML += '<h3 class="modalHeaderFail"> ERROR</h3>';
	}
	else
	{
		newSpace.innerHTML += `<h3 class="modalHeaderSuccess">ENHORABUENA</h3>`;
	}

	newSpace.innerHTML += `<div class="modalcontent">${message}<br><br><button onclick="closeModal(${parameter})">De acuerdo</button></div>`;
	c_seccion.appendChild(newSpace);
	c_seccion.style.display = "block";
}

function closeModal(clean)
{
	let c_seccion = document.querySelector('#mensajemodal');
	c_seccion.style.display = "none";

	switch(clean)
	{
		case 1:
			let c_form = document.querySelector('form');
			c_form.reset();
		break;
		case 2:
			loadReceipt();
		break;
	}
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
								<p><time datetime="${objJSON.fecha}"><span class="icon-calendar"></span> ${objJSON.fecha} </time></p>
								<p>Dificultad:${objJSON.dificultad}
								</p>
								<p> <span class="icon-food"></span>${objJSON.comensales}</p>
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
								LoadCommentsPage();
							}
							else
							{
								let valoraciones = document.querySelector(".valoraciones");
								valoraciones.innerHTML = `<article class="valoracion"><p>Para poder hacer valoraciones,
								debes estar <a href="login.html">logueado</a></p></article>`;
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

function LoadCommentsPage()
{
	let valoraciones = document.querySelector(".valoraciones");
	let url = './formulario.html';
	fetch(url).then(function(response)
		{
			response.text().then(function(formulario)
			{
				valoraciones.innerHTML = formulario;
			});
		},
		function(error)
		{
			console.log("Erroooor");
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
		let objJSON = JSON.parse(xhr.responseText);
		if (objJSON.RESULTADO == "OK") 
		{
			openModal(1,"Comentario enviado correctamente", 2);
		}
		else
		{
			openModal(0,"Error al enviar el comentario", 0);
		}
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
		openModal(1, "Voto emitido correctamente", 2);
	};

	xhr.setRequestHeader('Authorization', usu.clave);
	xhr.send(fd);
	return false;
}

//Añadir nuevas receticas

var titulo;
var Ingredients = 0;
var contador = 0;
var fotos = [];
var sources = [];

function AddPhotoInput()
{
	let space = document.querySelector("#photosplace");
	var newSpace = document.createElement('div');
	var id = "ficha"+contador;
	newSpace.setAttribute('id', id );
	newSpace.innerHTML += 
	`<label for="fotos">
	 	<img id="foto`+contador+`"src="./img/upload-empty.png" alt="foto1" onclick="ChangeImgSource(this)">
	 </label>
	 <input class="hide" name="`+contador+`" id="`+contador+`" type="file" onchange="ChangeImgSource(this)" required>
	 <label for="`+contador+`"><span class="icon-folder-open-empty" aria-hidden="true">&nbsp;&nbsp;Seleccionar archivo</span></label>
	 <button onclick="return EliminateSpace(${id});">Eliminar</button>
	 <textarea id=des${id} cols="20" rows="5" maxlength="250" placeholder="Añade una descripción de no más de 250 caracteres"></textarea>`;

	 console.log("ficha"+contador);
	 space.appendChild(newSpace);

	 contador++;
}

function checkIngredients()
{ 
	let list = document.querySelector('#ingredientslist')
	let numberOfIngredients = list.childElementCount;
	if(numberOfIngredients > 0)
	{
		for(var i=0; i<=list.children.length; i++)
	  	{
	  		console.log(list.children[i].childElementCount);
	  		if(list.children[i]!= undefined && list.children[i].tagName == 'LI' && list.children[i].childElementCount == 0)
	  		{
	      		return true;
	      	}
	    }
	}
	return false;
}

function PostNewRecepee(form)
{
	if(fotos.length > 0)
	{
		if(checkIngredients())
		{
			let xhr = new XMLHttpRequest(),
			formulario = new FormData(form),
			url = 'rest/receta/',
			usu = JSON.parse(sessionStorage.getItem('usuario'));

			if(xhr)
			{	
				
				formulario.append('l', usu.login);

				xhr.open('POST', url, true);

				xhr.onload = function()
				{
					let response = JSON.parse(xhr.responseText);
					console.log(response);
					if(response.RESULTADO == 'OK')
					{
						PostIngredients(response.ID, usu);
						for(var i=0; i<=contador ; i++)
		     			{
	             			if(document.getElementById("ficha"+i)!=null)
	             			{
	             				PostPhoto(response.ID, i, usu);
	             			}
	             		}
	             		openModal(1, `Se ha subido correctamente la receta: ${form.n.value}`, 1);
	             		for(var i=0; i<=contador; i++)
	             		{
	             			var identifier = "ficha"+i;
	             			console.log(identifier);
	             			EliminateSpace(identifier);
	             		}
	             		let editableList = document.querySelector('#ingredientslist');
	             		editableList.innerHTML = null;
					}
					else
					{
						let response = JSON.parse(xhr.responseText);
						console.log(response);
					}
				};
				
				xhr.setRequestHeader('Authorization', usu.clave);
	        	xhr.send(formulario);
			}
		}
		else
		{
			openModal(0,"La receta debe tener ingredientes",0);
		}
	}
	else
	{
		openModal(0,"Debes subir al menos una foto para poder crear la receta",0);
	}

	return false;
}

function PostPhoto(id, position, usuario)
{
	let xhr = new XMLHttpRequest(),
		form  = new FormData()
  		url = 'rest/receta/' + id + '/foto',
		descripcion = document.getElementById("desficha" + position).value;
		if(xhr)
		{
		    form.append('l',usuario.login);
		    form.append('t',descripcion);
		    form.append('f',fotos[position]);

		    xhr.open('POST', url, true);
		    xhr.onload = function(){
		       
		       let response = JSON.parse(xhr.responseText);

		       if(response.RESULTADO == "OK")
		       {
		         console.log("FOTO SUBIDA CORRECTAMENTE")
		       } 
		       else 
		       {
		         	openModal(0,"Error al subir las fotografias",0);
		       }
		    };
		    xhr.setRequestHeader('Authorization', usuario.clave);
		    xhr.send(form);
		}
}

function PostIngredients(receipt, usuario)
{
	let xhr = new XMLHttpRequest(),
  		url = 'rest/receta/' + receipt + '/ingredientes',
  		fd  = new FormData();
  		ingredientList = document.querySelector('#ingredientslist'),
  		sendIngredients = [];

  	if(xhr)
  	{
	  	for(var i=0; i<ingredientList.children.length; i++)
	  	{
	  		if(ingredientList.children[i]!= undefined && ingredientList.children[i].tagName == 'LI' && ingredientList.children[i].childElementCount == 0)
	  		{
	      		sendIngredients.push(ingredientList.children[i].innerText);
	      	}
	    }

	    fd.append('l',usuario.login);
	    fd.append('i',JSON.stringify(sendIngredients));

	    xhr.open('POST', url, true);

	    xhr.onload = function()
	    {
	       let response = JSON.parse(xhr.responseText);
	       if(response.RESULTADO == "OK"){
	         console.log("INGREDIENTES SUBIDOS CORRECTAMENTE");
	       } 
	       else 
	       {			
	       		openModal(0,"Error al subir los ingredientes",0);
	       }
	    };
	}
    
    xhr.setRequestHeader('Authorization', usuario.clave);
    xhr.send(fd);
}


function ChangeImgSource(source)
{
	if(source.type == "file"){
  	if(source.files[0]!=null){

  		var nombre = "";
	    var tam = source.files[0].size;
	    var foto = document.getElementById("foto" + source.id);
  		console.log(nombre);

	    if(tam>300000)
	    {
	      openModal(0, "El fichero supera el tamaño máximo permitido", 0);
	    } 
	    else 
	    {
	    	var reader  = new FileReader();
	    	reader.onloadend = function (e) 
	    	{
    			nombre = e.target.result;
    			foto.src = nombre;
    			sources.push(nombre);
	      		fotos.push(source.files[0]);

  			}

  			reader.readAsDataURL(source.files[0]);
	      
	    }
	}
  } 

  //CLICK EN LA IMAGEN
  else
  {
  	var num_img = source.id.split('foto');
  	document.getElementById(num_img[1]).click();
  }

}

function EliminateSpace(space)
{
  console.log(space);
  let id;
  if(space.id == undefined)
  {
  	id = space.split("ficha");
  }
  else
  {
  	id = space.id.split("ficha");
  }
  id = "foto" + id[1];
  let src = document.getElementById(id).src;
  let index = -1;
  for(var i=0; i<fotos.length; i++)
  {
    if(sources[i] == src)
    {
      console.log("encontrada");
      index = i;
    }
  }

  if(index > -1)
  {
    fotos.splice(index, 1);
    sources.splice(index, 1);
  }

  let container;
  if(space.id == undefined)
  {
  	container = document.getElementById(space);
  }
  else
  {
  	container = document.getElementById(space.id);
  }
  container.parentNode.removeChild(container);
  contador --;

  return false;

}

//Parte de los ingredientes
function AddIngredient()
{
	let ingredient = document.querySelector("#ingredient");
	let editableList = document.querySelector("#ingredientslist");
	if(ingredient.value != "")
	{
		editableList.innerHTML += `<li>${ingredient.value}</li>`;
		ingredient.value = "";
	}

	Ingredients++;

	return false;
}



