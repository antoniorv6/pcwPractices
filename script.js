var _WIDTH_ = 360,
	_HEIGTH_ = 240;

var OriginalMatrix = [],
	PuzzleMatrix = [],
	regions,
	puzzlewidth,
	puzzleheight;

function setGame()
{
	let dificulty = document.getElementById("dificulty").value;
	console.log(dificulty);

	switch(Number(dificulty))
	{
		case 0:
			puzzlewidth = 6;
			puzzleheight = 4;
		break;

		case 1:
			puzzlewidth = 9;
			puzzleheight = 6;
		break;

		case 2:
			puzzlewidth = 12;
			puzzleheight = 8;
		break;
	}

	initMatrixes();
	DrawLines();

}

function initMatrixes()
{
	for(var i=0; i<puzzleheight; i++)
	{
		OriginalMatrix[i] = [];
		PuzzleMatrix[i] = [];

		for(var j=0; j<puzzlewidth; j++)
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

	manageDragDrop();
}

function manageDragDrop()
{
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
		PutImageOnCanvas1(fichero);
	};
}

function UploadPhoto(file)
{
	if(file.type == "file"){
	  	
	  	if(file.files[0]!=null)
	  	{
	  		PutImageOnCanvas1(file.files[0]);
		}
  } 
}

function PutImageOnCanvas1(e)
{
	console.log(e);

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

	fr.readAsDataURL(e);
}


function DrawLines()
{
	let cv 	    = document.querySelector('#cv02'),
		ctx	    = cv02.getContext('2d'),
		dimw 	= cv.width/puzzlewidth; 
		dimh    = cv.height/puzzleheight;

	ResetCanvas(cv);
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#a00';
	for(let i = 1; i<puzzlewidth; i++)
	{
 		ctx.moveTo(i*dimw,0);
		ctx.lineTo(i*dimw,cv.height);

		ctx.moveTo(0, i*dimh);
		ctx.lineTo(cv.width , i*dimh);
	}

	ctx.stroke();
}


function ResetCanvas(cv)
{
	cv.width = cv.width;
}