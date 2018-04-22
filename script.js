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
		response.text().then(function(texto)
		{
			let objJSON = JSON.parse(texto);
			console.log(objJSON.FILAS.length);
			c_seccion.innerHTML = null;
			for(let k in objJSON.FILAS)
			{
				c_seccion.innerHTML += 
				`<article>
				<div>
				<a href="receta.html"><h2>` + objJSON.FILAS[k].nombre + `</h2></a>
				</div>
				<div class="content">
				<img src='fotos/`+ 
				objJSON.FILAS[k].fichero 
				+`'alt="foto de la receta">
				<p><a href="buscar.html?type=1&a=`+objJSON.FILAS[k].autor+`"><strong><span class="icon-user"></span>`+
				objJSON.FILAS[k].autor
				+`</strong></a></p>
				<span class="icon-calendar"></span><time datetime="`+
				objJSON.FILAS[k].fecha
				+`">`+
				objJSON.FILAS[k].fecha
				+`</time>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo, exercitationem, accusamus. Possimus odio vel voluptas corporis, voluptate deserunt laudantium pariatur, odit sit eaque quisquam maiores voluptatibus id sequi. Itaque deleniti, officia odit repellat ad! Sed doloribus dolores cumque. Quae, cumque.</p>
					<ul>
						<li><span class="icon-thumbs-up"></span>`+objJSON.FILAS[k].positivos+`</li>
						<li><span class="icon-thumbs-down"></span>`+objJSON.FILAS[k].negativos+`</li> 
						<li><span class="icon-comment"></span>`+objJSON.FILAS[k].comentarios+`</li>
					</ul>		
				</div>
				</article>`;
			}

			c_seccion.innerHTML += 
			`<ul>
				<li><button>Primera</button></li>
				<li><button onclick="pedirRecetasFetch(-1);"><span class="icon-left-big"></span></button></li>
				<li><button>`+(Number(sessionStorage.getItem('actual'))+1)+`</button></li>
				<li><button onclick="pedirRecetasFetch(1);"><span class="icon-right-big"></span></button></li>
				<li><button>Última</button></li>
			</ul>`	
		});
	}, 
	function(error){
		console.log('ERORR');
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
			texto.FILAS.forEach(function(objJSON)
			{
				c_seccion.innerHTML += 
				`<article>
				<div>
				<a href="receta.html"><h2>` + objJSON.nombre + `</h2></a>
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
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo, exercitationem, accusamus. Possimus odio vel voluptas corporis, voluptate deserunt laudantium pariatur, odit sit eaque quisquam maiores voluptatibus id sequi. Itaque deleniti, officia odit repellat ad! Sed doloribus dolores cumque. Quae, cumque.</p>
					<ul>
						<li><span class="icon-thumbs-up"></span>`+objJSON.positivos+`</li>
						<li><span class="icon-thumbs-down"></span>`+objJSON.negativos+`</li> 
						<li><span class="icon-comment"></span>`+objJSON.comentarios+`</li>
					</ul>		
				</div>
				</article>`;
			}

				
		);

		c_seccion.innerHTML += 
			`<ul>
				<li><button>Primera</button></li>
				<li><button onclick="pedirRecetasFetch(-1);"><span class="icon-left-big"></span></button></li>
				<li><button>`+(Number(sessionStorage.getItem('actual'))+1)+`</button></li>
				<li><button onclick="pedirRecetasFetch(1);"><span class="icon-right-big"></span></button></li>
				<li><button>Última</button></li>
			</ul>`
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



function pedirRecetasFetch(increment)
{
	if(sessionStorage.getItem('actual') == null)
	{	
		m_pagActual += increment;
		sessionStorage.setItem('actual', m_pagActual);
	}
	else
	{
		if(Number(sessionStorage.getItem('actual'))+increment>=0)
			sessionStorage.setItem('actual', Number(sessionStorage.getItem('actual'))+increment);
		else
			return;
	}

	console.log(increment);
	console.log(sessionStorage.getItem('actual'));
	let c_url = 'rest/receta/?pag='+sessionStorage.getItem('actual')+'&lpag=6'
		c_seccion = document.querySelector('#receipts');

		c_seccion.innerHTML = null;
	fetch(c_url).then(function(response){
		response.json().then(function(texto)
		{
			if (texto.FILAS.length == 0) 
			{
				pedirRecetasFetch(-1);
				return;
			}
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
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo, exercitationem, accusamus. Possimus odio vel voluptas corporis, voluptate deserunt laudantium pariatur, odit sit eaque quisquam maiores voluptatibus id sequi. Itaque deleniti, officia odit repellat ad! Sed doloribus dolores cumque. Quae, cumque.</p>
					<ul>
						<li><span class="icon-thumbs-up"></span>`+objJSON.positivos+`</li>
						<li><span class="icon-thumbs-down"></span>`+objJSON.negativos+`</li> 
						<li><span class="icon-comment"></span>`+objJSON.comentarios+`</li>
					</ul>		
				</div>
				</article>`;
			}

				
		);

		c_seccion.innerHTML += 
			`<ul>
				<li><button>Primera</button></li>
				<li><button onclick="pedirRecetasFetch(-1);"><span class="icon-left-big"></span></button></li>
				<li><button>`+(Number(sessionStorage.getItem('actual'))+1)+`</button></li>
				<li><button onclick="pedirRecetasFetch(1);"><span class="icon-right-big"></span></button></li>
				<li><button>Última</button></li>
			</ul>`
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
	let url = 'rest/receta/?';
    
    var first_par = true;
	
	//Procesamos los datos de la búsqueda
	if(formulario.get('nombre') != "")
	{
		if(first_par)
		{
			url += 'n=' + formulario.get('nombre');
			first_par = false;
		}
		else
			url += '&n=' + formulario.get('nombre');
		
	}
	if(formulario.get('ingredientes') != "")
	{
		if(first_par)
		{
			url += 'i=' + formulario.get('ingredientes');
			first_par = false;
		}
		else
			url += '&i=' + formulario.get('ingredientes');
		
	}
	
	if(formulario.get('dificultad') != "")
	{
		if(first_par)
		{
			url += 'd=' + formulario.get('dificultad');
			first_par = false;
		}
		else
			url += '&d=' + formulario.get('dificultad');
		
	}

	if(formulario.get('comensales') != "")
	{
		if(first_par)
		{
			url += 'c=' + formulario.get('comensales');
			first_par = false;
		}
		else
			url += '&c=' + formulario.get('comensales');
		
	}

	if(formulario.get('autor') != "")
	{
		if(first_par)
		{
			url += 'a=' + formulario.get('autor');
			first_par = false;
		}
		else
			url += '&a=' + formulario.get('autor');
		
	}

	if(formulario.get('mintiempo')!="" && formulario.get('maxtiempo')!="")
	{
		//Toca comparar los tiempos
		if(Number(formulario.get('maxtiempo'))>Number(formulario.get('mintiempo')))
		{
			if(first_par)
			{
				url += 'di=' + formulario.get('mintiempo');
				first_par = false;
			}
			else
				url += '&di=' + formulario.get('mintiempo');
			
			url+= '&df=' + formulario.get('maxtiempo');
			
		}
	}
	else
	{
		if(formulario.get('mintiempo')!="")
		{
			if(first_par)
			{
				url += 'di=' + formulario.get('mintiempo');
				first_par = false;
			}
			else
				url += '&di=' + formulario.get('mintiempo');
		}

		if(formulario.get('maxtiempo')!="")
		{
			if(first_par)
			{
				url += 'df=' + formulario.get('maxtiempo');
				first_par = false;
			}
			else
				url += '&df=' + formulario.get('maxtiempo');
		}

	}
	//Terminamos de procesar todos los datos de búsqueda
	console.log(url);

	if(first_par == true)
	{
		pedirRecetasFetch(0);
	}


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
				for(let k in objJSON.FILAS)
				{
					c_seccion.innerHTML += 
					`<article>
					<div>
					<a href="receta.html"><h2>` + objJSON.FILAS[k].nombre + `</h2></a>
					</div>
					<div class="content">
					<img src='fotos/`+ 
					objJSON.FILAS[k].fichero 
					+`'alt="foto de la receta">
					<p><a href="buscar.html?type=1&a=`+objJSON.FILAS[k].autor+`"><strong><span class="icon-user"></span>`+
					objJSON.FILAS[k].autor
					+`</strong></a></p>
					<span class="icon-calendar"></span><time datetime="`+
					objJSON.FILAS[k].fecha
					+`">`+
					objJSON.FILAS[k].fecha
					+`</time>
					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo, exercitationem, accusamus. Possimus odio vel voluptas corporis, voluptate deserunt laudantium pariatur, odit sit eaque quisquam maiores voluptatibus id sequi. Itaque deleniti, officia odit repellat ad! Sed doloribus dolores cumque. Quae, cumque.</p>
						<ul>
							<li><span class="icon-thumbs-up"></span>`+objJSON.FILAS[k].positivos+`</li>
							<li><span class="icon-thumbs-down"></span>`+objJSON.FILAS[k].negativos+`</li> 
							<li><span class="icon-comment"></span>`+objJSON.FILAS[k].comentarios+`</li>
						</ul>		
					</div>
					</article>`;
				}

				c_seccion.innerHTML += 
				`<ul>
					<li><button>Primera</button></li>
					<li><button onclick="pedirRecetasFetch(-1);"><span class="icon-left-big"></span></button></li>
					<li><button>`+(Number(sessionStorage.getItem('actual'))+1)+`</button></li>
					<li><button onclick="pedirRecetasFetch(1);"><span class="icon-right-big"></span></button></li>
					<li><button>Última</button></li>
				</ul>`
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

	fetch(url).then(function(response)
		{
			response.json().then(function(objJSON)
				{
					console.log(objJSON);
				});
		},
		function(error)
		{

		});



}

//url_string = window.location.href

/*
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
*/
