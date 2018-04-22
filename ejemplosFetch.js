function pedirRecetas()
{
	let url = './rest/receta/'
	let listilla = document.querySelector('#listilla')

	fetch(url).then(
		function(response)
		{
			if(response.ok)
			{
				response.json().then(function(datos)
				{
					console.log(datos);
					datos.FILAS.forEach(function(e)
					{
						listilla.innerHTML += `<li>${e.nombre}</li>`;
					});
				});

			}
			else
			{
				console.log('ERROR');
				return;
			}
		}
		,function(error)
		{
			console.log('ERROOOOOORJODER')
		});
	
}

function hacerLogin()
{
	let url = './rest/login/';
	let fd = new FormData();

	fd.append('login', 'usuario1');
	fd.append('pwd', 'usuario1');

	fetch(url, {'method':'POST', 'body' : fd}).then(
		function(response)
		{
			if(response.ok)
			{
				response.json().then(function(datos)
				{
					console.log(datos);
					sessionStorage.setItem('usuario', JSON.stringify(datos.login));
					sessionStorage.setItem('key', JSON.stringify(datos.clave));
					console.log(sessionStorage.getItem('usuario'));
				});
				
				
			}
			else
			{
				return;
			}
		}, 
		function(error)
		{
			console.log('ERROR');
		});

}

function postComment()
{
	let url = './rest/receta/1/comentario',
		fd = new FormData();
		usu = sessionStorage.getItem('usuario');
		clave = sessionStorage.getItem('key');

		console.log(clave);
    fd.append('l', JSON.parse(usu));
    fd.append('titulo', 'HOLA');
    fd.append('texto', 'QUIERO SEXO BRUTO');

	fetch(url, {'method' : 'POST', 'body' : fd, 'headers' : 

		{'Authorization': JSON.parse(clave)}

		}).then(function(response)
	{
		if(response.ok)
		{
			console.log('Comentario enviado!!!');
			response.json().then(
				function(datos)
				{
					console.log(datos);
				});
		}
		else
		{
			console.log(response)	
		}
	},
	function(error)
	{
		console.log('ERRORAZO PUTO');
	});
}