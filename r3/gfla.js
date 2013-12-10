var _CNN ;
var _CXN ;

function initGFla()
{
	_CNN = document.getElementById('cnv-n') ;
	_CXN = _CNN.getContext('2d') ;
}

function startGFla()
{
	return true ;
}

function doGFla()
{
	_CNN.style.display = 'block' ;
	_CNG.style.display = 'none' ;

	renderTorus() ;
	renderGNeg() ;

	window.setTimeout(function(){
		_CNN.style.display = 'none' ;
		_CNG.style.display = 'block' ;
	}, 2000) ;
}

function renderTorus()
{
	_CXN.globalCompositeOperation = 'source-over' ;
	_CXN.rect(0, 0, 512, 384) ;

	var grd = _CXN.createRadialGradient(256, 192, 10, 256, 192, 400) ;
	
	grd.addColorStop(0.1, 'rgba(0, 0, 40, 255)') ;
	grd.addColorStop(0.2, 'rgba(0, 0, 220, 255)') ;
	grd.addColorStop(0.6, 'rgba(0, 0, 0, 255)') ;

	_CXN.fillStyle = grd ;
	_CXN.fill() ;
}

function renderGNeg()
{
	_CXN.globalCompositeOperation = 'xor' ;

	for(var i = 0; i < _GDQ.length; i++)
	{
		drawGCellNeg(_GDQ[i][0], _GDQ[i][1], _GDQ[i][2]) ;
	}
}

function drawGCellNeg(cx, cy, r)
{
    // Calculate x, y of top left corner relative to center
    // Where cell will be placed
    var x = cx - r ;
    var y = cy - r ;

    _CXN.drawImage(_CNC, 0, 0, 240, 240, x, y, r * 2, r * 2) ;
}