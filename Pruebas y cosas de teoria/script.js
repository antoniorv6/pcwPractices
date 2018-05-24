var _ANCHO_ = 360,
 	_ALTO_ = 360,
 	r 		= 3;

function prepararCanvas()
{
	let cv = document.querySelector("#canvas1");

	cv.width = _ANCHO_;
	cv.height = _ALTO_;
}

function dibujarRect01(color)
{
	let cv = document.querySelector("#canvas1"),
		ctx = cv.getContext('2d'),
		x = document.querySelector("#x").value,
		y = document.querySelector("#y").value;
	ctx.lineWidth = 2;
	ctx.strokeStyle = color.value;
	ctx.strokeRect(x,y,100,60);

}

function rellenarRect01(color)
{
	let cv = document.querySelector("#canvas1"),
		ctx = cv.getContext('2d'),
		x = document.querySelector("#x").value,
		y = document.querySelector("#y").value;

	ctx.fillStyle = color.value;
	ctx.fillRect(x,y,100,60);

}

function pintarTexto()
{
	let cv = document.querySelector("#canvas1"),
		ctx = cv.getContext('2d'),
		x = document.querySelector("#x").value,
		y = document.querySelector("#y").value;

	ctx.font = '32px Arial bold';

	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';

	ctx.strokeText('holy faking shiat!!', cv.width/2, cv.height/2);

}

function dibujarLinea()
{
		let cv = document.querySelector("#canvas1"),
		ctx = cv.getContext('2d');

		ctx.beginPath();
		ctx.strokeStyle = '#aa0';
		ctx.moveTo(100,100);
		ctx.lineTo(160, 100);
		ctx.lineTo(160, 170);
		ctx.lineTo(75,150);
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = "#a00";
		ctx.rect(10,10,60 ,30);

		ctx.stroke();
}

function limpiarCanvas()
{
	let cv = document.querySelector("#canvas1"),
		ctx = cv.getContext('2d');

	ctx.clearRect(0,0, cv.width, cv.height);
	//cv.width = cv.width;
}


////PARTE 2 //////

function prepareCanvas()
{
	let cvs = document.querySelectorAll('canvas');

	cvs.forEach(function(e)
	{
		e.width = _ANCHO_;
		e.height = _ALTO_;
	});

	//DRAG AND DROP
	let cv01 = document.querySelector('#cv01');
	cv01.ondragover = function(e)
	{
		e.stopPropagation();
		e.preventDefault(); //return false;
	};

	cv01.ondrop = function(e)
	{
		e.preventDefault();
		let fichero = e.dataTransfer.files[0];
		console.log(fichero);

		let fr = new FileReader();

		fr.onload = function()
		{
			let img = new Image();
			img.onload = function()
			{
				let ctx = cv01.getContext('2d');
				ctx.drawImage(img, 0 ,0, cv01.width, cv01.height);
			};
			img.src = fr.result;
		};

		fr.readAsDataURL(fichero);
	};

	//EVENTOS DE RATON

	let cv02 = document.querySelector("#cv02");
	cv02.onmousemove = function(e)
	{
		let x = e.offsetX,
			y = e.offsetY,
			[col, fila] = sacarFilaCol(e),
			ctx01		= cv01.getContext('2d'),
			ctx02  		= cv02.getContext('2d'),
			dim 		= cv02.width/r,
			imgdata     = ctx01.getImageData(col*dim, fila*dim,dim,dim);
		
		let fc = cv02.getAttribute('data-FC');

		if(fc)
		{
			fc = JSON.parse(fc);
			if(fc.fila == fila && fc.col == col)
				return
		}

		console.log("repintando");
		cv02.width = cv02.width;
		ctx02.putImageData(imgdata, col*dim, fila*dim);
		document.querySelector("#posclick").textContent = `(${x}, ${y
		})`;

		divide();

		fc = {'fila':fila, 'col' : col};
		cv02.setAttribute('data-FC', JSON.stringify(fc))
	};

	cv02.onmouseenter = function(e)
	{
		let x = e.offsetX,
			y = e.offsetY;
		document.querySelector("#posenter").textContent = `(${x}, ${y
		})`;
	};

	cv02.onmouseleave = function(e)
	{
		let x = e.offsetX,
			y = e.offsetY;
		document.querySelector("#posleave").textContent = `(${x}, ${y
		})`;
	};

	cv02.onmousedown = function(e)
	{
		let x = e.offsetX,
			y = e.offsetY;
		document.querySelector("#posdown").textContent = `(${x}, ${y
		})`;
	};

	cv02.onmouseup = function(e)
	{
		let x = e.offsetX,
			y = e.offsetY;
		document.querySelector("#posup").textContent = `(${x}, ${y
		})`;
	};

	cv02.onclick = function(e)
	{
		let x 			= e.offsetX,
			y 			= e.offsetY,
			[col, fila] = sacarFilaCol(e),
			ctx01		= cv01.getContext('2d'),
			ctx02  		= cv02.getContext('2d'),
			dim 		= cv02.width/r,
			imgdata     = ctx01.getImageData(col*dim, fila*dim,dim,dim);
			
		ctx02.putImageData(imgdata, col*dim, fila*dim);
		document.querySelector("#posclick").textContent = `(${x}, ${y
		})`;

		divide();


	};



}

function sacarFilaCol(e)
{
	let dim = e.target.width/r,
		fila = Math.floor(e.offsetY/dim),
		columna = Math.floor(e.offsetX/dim);

	return [columna, fila];
}

function prueba01()
{
	let cv = document.querySelector('#cv01'),
		ctx = cv.getContext('2d');

	ctx.lineWidth = 2; 
	ctx.strokeStyle = '#a00';
	ctx.strokeRect(0,0,100,75);
}

function traslacion()
{
	let cv = document.querySelector('#cv01'),
		ctx = cv.getContext('2d');

	ctx.translate(20,50);
}

function rotacion()
{
	let cv = document.querySelector('#cv01'),
		ctx = cv.getContext('2d'),
		ang = 45;

	ctx.rotate(Math.PI * (ang/180));
}

function escalado()
{
	let cv = document.querySelector('#cv01'),
		ctx = cv.getContext('2d');

	ctx.scale(2,1);
}

function imagen01()
{
	let cv = document.querySelector('#cv01'),
		ctx = cv.getContext('2d'),
		img = new Image();

	img.onload = function()
	{
		ctx.drawImage(img,0,0,cv.width,cv.height);
	};
	img.src = './img.jpg';
}

function copiar01()
{
	let cv01 = document.querySelector('#cv01'),
		ctx01 = cv01.getContext('2d'),
		cv02 = document.querySelector('#cv02'),
		ctx02 = cv02.getContext('2d');

	ctx01.getImageData(0,0, cv01.width, cv01.height);
	imgData = ctx01.getImageData(0,0, cv01.width, cv01.height);
	ctx02.putImageData(imgData, 100,50, 50, 50, 100,80);
}

function copiar02()
{
	let cv01 = document.querySelector('#cv01'),
		ctx01 = cv01.getContext('2d'),
		cv02 = document.querySelector('#cv02'),
		ctx02 = cv02.getContext('2d');

	ctx01.getImageData(0,0, cv01.width, cv01.height);
	imgData = ctx01.getImageData(0,0, cv01.width, cv01.height);
	ctx02.putImageData(imgData, 0,0);
}

function divide()
{
	let cv 	    = document.querySelector('#cv02'),
		ctx	    = cv02.getContext('2d'),
		dim 	= cv.width/3; 

	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#a00';
	for(let i = 1; i<r; i++)
	{
		ctx.moveTo(i*dim,0);
		ctx.lineTo(i*dim,cv.height);

		ctx.moveTo(0, i*dim);
		ctx.lineTo(cv.width , i*dim);
	}

	ctx.stroke();
}
