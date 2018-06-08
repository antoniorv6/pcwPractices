var _WIDTH_ = 360,
	_HEIGTH_ = 240;

var OriginalMatrix = [],
	PuzzleMatrix = [],
	regions,
	puzzlewidth,
	puzzleheight,
	dimension,
	actualState = 0,
	first = -1,
	second = -1,
	difficulty,
	fil1,fil2,col1,col2,
	movements = 0,
	isphotoPlaced = false,
	elapsedSeconds = 0,
	interval = setInterval(IncrementTime, 1000),
	disordered = 0;

function setGame()
{
	let dificulty = document.getElementById("dificulty").value;
	console.log(dificulty);

	cv =document.querySelector("#cv02");
	ResetCanvas(cv);

	switch(Number(dificulty))
	{
		case 0:
			puzzlewidth = 6;
			puzzleheight = 4;
			dimension = 60;
			difficulty = 2;
		break;

		case 1:
			puzzlewidth = 9;
			puzzleheight = 6;
			dimension = 40;
			difficulty = 3;
		break;

		case 2:
			puzzlewidth = 12;
			puzzleheight = 8;
			dimension = 30;
			difficulty = 4;
		break;
	}

	initMatrixes();
	
	DrawPuzzle();
	
	DrawLines();

}

function StartGame()
{
	if(actualState == 0 && isphotoPlaced == true)
	{
		actualState = 1;
		elapsedSeconds = 0;
		disorderMatrix();
		document.getElementById("start").disabled = true;
		document.getElementById("uploadPhoto").disabled = true;	
		document.getElementById("dificulty").disabled = true;
		document.getElementById("end").disabled = false;
		document.getElementById("help").disabled = false;
		document.querySelector('.Itson').innerHTML += 
		`<h3>El juego está en marcha</h3>
		<p id="disordered">Quedan ${disordered} piezas por colocar</p>
		<p id="punctuation">Movimientos: ${movements}</p>
		<p id="time" Tiempo transcurrido: ${elapsedSeconds} segundos</p>`;
		CountDisorderedPieces();

	}
}

function IncrementTime()
{
	if(actualState == 1)
	{
		elapsedSeconds++;
		let counter = document.getElementById('time');
		counter.innerText = `Tiempo transcurrido: ${elapsedSeconds} segundos`;
	}
}

function UpdateMovements()
{
	document.getElementById('punctuation').innerHTML = `Movimientos: ${movements}`;
}

function disorderMatrix()
{
	let ctr = puzzleheight;

	while(ctr>0)
	{
		console.log("desordeno");
		fil1 = Math.floor(Math.random()*puzzlewidth);
		fil2 = Math.floor(Math.random()*puzzlewidth);
		col1 = Math.floor(Math.random()*puzzleheight);
		col2 = Math.floor(Math.random()*puzzleheight);
		first = PuzzleMatrix[fil1][col1];
		second = PuzzleMatrix[fil2][col2];
		console.log(first);
		console.log(second);
		Swap();
		ctr--;
	}

	RedrawCanvas();
}

function initMatrixes()
{
	OriginalMatrix = [];
	PuzzleMatrix = [];
	for(var i=0; i<puzzlewidth; i++)
	{
		OriginalMatrix[i] = [];
		PuzzleMatrix[i] = [];

		for(var j=0; j<puzzleheight; j++)
		{
			OriginalMatrix[i][j] = String(i) + String(j);
			PuzzleMatrix[i][j] = String(i) + String(j);
		}
	}

	console.log(OriginalMatrix);

}

function prepareCanvas()
{
	let cvs = document.querySelectorAll('canvas');

	cvs.forEach(function(canvas)
	{
		canvas.width = _WIDTH_;
		canvas.height = _HEIGTH_;
	});

	setGame();
	drawText();
	manageDragDrop();
	manageClick();
	manageHover();
}

function drawText()
{
	let canvas = document.querySelector('#cv01'),
		ctx = canvas.getContext('2d');

	ctx.font = '18px Arial';
	ctx.textAlign = 'center';
	ctx.fillText("Haz click o arrastra una imagen aquí", _WIDTH_/2, _HEIGTH_/2);
}

function manageClick()
{
	let cv02 = document.querySelector('#cv02'),
		cv01 = document.querySelector('#cv01');

	cv02.onclick = function(e)
	{
		if(actualState == 1)
		{
			let [col, row] = sacarFilaCol(e);

			if(first == -1)
			{
				console.log("Pongo la primera");
				first = PuzzleMatrix[row][col];
				fil1 = row;
				col1 = col;
				console.log(first);
				DrawSelection();
			}
			else
			{
				console.log("Pongo la segunda");
				second = PuzzleMatrix[row][col];
				fil2 = row;
				col2 = col;
				console.log(second);
				DrawSelection();
				Swap();
				RedrawCanvas();
				movements++;
				UpdateMovements();
				CountDisorderedPieces();
				CheckVictory();
			}
		}
	}

	cv01.onclick = function(e)
	{
		if(actualState == 0)
		{
			document.querySelector('#uploadPhoto').click();
		}
	}
}

function Swap()
{
	PuzzleMatrix[fil1][col1] = second;
	PuzzleMatrix[fil2][col2] = first;

	first = -1;
	second = -1;
	DrawSelection();
}

function manageDragDrop()
{
	let cv01 = document.querySelector('#cv01');

	cv01.ondragover = function(e)
	{
		e.stopPropagation();
		e.preventDefault(); //return false;
		cv01.style.border = '1px solid #9ecaed';
		cv01.style.borderColor = '#9ecaed';
		cv01.style.boxShadow = '0 0 10px #9ecaed';
	};

	cv01.ondrop = function(e)
	{
		e.preventDefault();
		let fichero = e.dataTransfer.files[0];
		PutImageOnCanvas1(fichero);
		cv01.style.border = '1px solid #234';
		cv01.style.boxShadow = 'none';
	};

	cv01.ondragleave = function(e)
	{
		e.stopPropagation();
		e.preventDefault(); //return false;
		cv01.style.border = '1px solid #234';
		cv01.style.boxShadow = 'none';
	}
}

function manageHover()
{
	let cv01 = document.querySelector('#cv02'),
		ctx1 = cv01.getContext('2d');
	
	cv02.onmousemove = function(e)
	{
		[col, row] = sacarFilaCol(e);

		let fc = cv02.getAttribute('data-FC');

		if(fc)
		{
			fc = JSON.parse(fc);
			if(fc.row == row && fc.col == col)
				return
		}

		if(isphotoPlaced)
		{
			RedrawCanvas();
			ctx1.lineWidth = 2;
			ctx1.strokeStyle = "blue";
			ctx1.strokeRect(row*dimension,col*dimension,dimension,dimension);

			fc = {'row':row, 'col' : col};
			cv02.setAttribute('data-FC', JSON.stringify(fc))
		}
	}
}

function sacarFilaCol(e)
{
	let dim = e.target.width/puzzlewidth,
		fila = Math.floor(e.offsetX/dim),
		columna = Math.floor(e.offsetY/dim);

	return [columna, fila];
}

function UploadPhoto(file)
{
	if(file.type == "file")
	{
	  	if(file.files[0]!=null)
	  	{
	  		PutImageOnCanvas1(file.files[0]);
		}
  	} 
}

function PutImageOnCanvas1(e)
{
	if(actualState == 0)
	{
		console.log(e.type);
		if(e.type == 'image/jpeg' || e.type == 'image/png' || e.type == 'image/gif' || e.type == 'image/svg')
		{
			let fr = new FileReader();

			fr.onload = function()
				{
					let img = new Image();
					img.onload = function()
					{
						ResetCanvas(cv01);
						let ctx = cv01.getContext('2d');
						ctx.drawImage(img, 0 ,0, cv01.width, cv01.height);
						DrawPuzzle();
						DrawLines();
					};
					img.src = fr.result;
					isphotoPlaced = true;
				};

			fr.readAsDataURL(e);
		}
	}
	else
		console.log("NO");
}


function DrawLines()
{
	let cv 	    = document.querySelector('#cv02'),
		ctx	    = cv02.getContext('2d'),
		dimw 	= cv.width/puzzlewidth,
		dimh    = cv.height/puzzleheight,
		color   = document.getElementById('colorpicker').value;
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = color;
	for(let i = 1; i<puzzlewidth; i++)
	{
 		ctx.moveTo(i*dimw,0);
		ctx.lineTo(i*dimw,cv.height);

		if(i<puzzlewidth-difficulty)
		{
			ctx.moveTo(0, i*dimh);
			ctx.lineTo(cv.width , i*dimh);
		}
	}

	ctx.stroke();

	//Cambiamos el color del colorPicker
	document.querySelector('.pickColor').style.background = document.getElementById('colorpicker').value;
}

function DrawPuzzle()
{
	let cv01 = document.querySelector("#cv01"),
		cv02 = document.querySelector("#cv02"),
		ctx01		= cv01.getContext('2d'),
		ctx02  		= cv02.getContext('2d');

	for(var i=0; i<puzzlewidth; i++)
	{
		for(var j=0; j<puzzleheight; j++)
		{
			var [col,fila] = InterpretateMatrix(PuzzleMatrix[i][j]);
			let imgdata     = ctx01.getImageData(col*dimension, fila*dimension,dimension,dimension);
			ctx02.putImageData(imgdata, i*dimension, j*dimension);
		}
	}
}

function InterpretateMatrix(datapos)
{
	var number = Number(datapos),
		col = Math.floor(number/10),
		row = number%10;

	//Ya tenemos la fila y la columna de la matriz original en la matriz del puzzle

	e = [col,row];
	return e;
}

function ResetCanvas(cv)
{
	cv.width = cv.width;
}

function RedrawCanvas()
{
	let cv01 = document.querySelector("#cv02")
	ResetCanvas(cv01);
	DrawPuzzle();
	DrawLines();
	DrawSelection();
}

function CheckVictory()
{
	for(var i = 0; i<puzzlewidth; i++)
	{
		for(var j = 0; j<puzzleheight; j++)
		{
			if(OriginalMatrix[i][j] != PuzzleMatrix[i][j])
			{
				return;
			}
		}
	}

	openModal(1);
}

function EndGame()
{
	openModal(0);
}

function ShowHelp()
{
	RedrawCanvas();

	let cv2 = document.getElementById('cv02'),
		ctx = cv2.getContext('2d');

	for(var i = 0; i<puzzlewidth; i++)
	{
		for(var j = 0; j<puzzleheight; j++)
		{
			if(OriginalMatrix[i][j] == PuzzleMatrix[i][j])
			{
				ctx.lineWidth = 2;
				ctx.fillStyle = 'rgba(255,0,0,0.7)';
				ctx.fillRect(i*dimension, j*dimension, dimension, dimension);
			}
		}
	}
	DrawSelection();
}

function openModal(type)
{
	document.getElementById('mensajemodal').style.display = 'block';

	if(type == 1)
	{
		document.querySelector('.modal-content').innerHTML += `<h3 class="success">¡Enhorabuena!</h3>
		<h4>Has superado el puzzle</h4>
		<p>¡Has colocado bien todas las piezas!</p>
		<p>Movimientos realizados: ${movements}</p>
		<p>Te has estrujado el cerebro durante: ${elapsedSeconds} segundos</p>
		<button onclick="closeModal()">¡Bieeeen!</button>`;
	}
	else
	{
		document.querySelector('.modal-content').innerHTML += `<h3 class="fail">Fin del juego</h3>
		<h4>Al final no ha podido ser...</h4>
		<p>Te has dejado ${disordered} piezas por colocar bien</p>
		<p>Movimientos realizados: ${movements}</p>
		<p>Te has estrujado el cerebro durante: ${elapsedSeconds} segundos</p>
		<button onclick="closeModal()">Aceptar la derrota</button>`;
	}
	
}

function closeModal()
{
	document.getElementById('mensajemodal').style.display = 'none';
	document.querySelector('.modal-content').innerHTML = null;
	Reset();
}

function Reset()
{
	if(actualState == 1)
	{
		let cv1 = document.querySelector('#cv01'),
			cv2 = document.querySelector('#cv02');
		prepareCanvas();

		document.querySelector('.selector').innerHTML = 
		`<select id="dificulty" onchange="setGame();">
						<option value="0">Facil</option>
						<option value="1">Normal</option>
						<option value="2">Dificil</option>
					</select>`;
		document.querySelector('.Itson').innerHTML = null;
		document.getElementById('uploadPhoto').value = null;
		DrawLines();
		document.getElementById("start").disabled = false;
		document.getElementById("uploadPhoto").disabled = false;
		document.getElementById("end").disabled = true;
		document.getElementById("help").disabled = true;
		isphotoPlaced = false;	
		actualState = 0;
		initMatrixes();
	}
}

function CountDisorderedPieces()
{
	disordered = 0;
	for(var i = 0; i<puzzlewidth; i++)
	{
		for(var j = 0; j<puzzleheight; j++)
		{
			if(OriginalMatrix[i][j] != PuzzleMatrix[i][j])
			{
				disordered++;
			}
		}
	}

	document.getElementById('disordered').innerText = `Quedan ${disordered} piezas por colocar`;

}

function DrawSelection()
{
	let cv2 = document.getElementById('cv02'),
		ctx = cv2.getContext('2d');

	ctx.lineWidth = 2;
	ctx.fillStyle = 'rgba(0,0,255,0.6)';

	if(first != -1)
	{
		ctx.fillRect(fil1*dimension, col1*dimension, dimension, dimension);
	}
}

