var SEGPOS = [[12,7,1], [6,0,0], [0,7,1], [6,14,0], [19,14,0], [23,7,1], [19,0,0]] ;
var SEGTBL = [
	[0,1,1,1,1,1,1],
	[0,0,0,1,1,0,0],
	[1,0,1,1,0,1,1],
	[1,0,1,1,1,1,0],
	[1,1,0,1,1,0,0],
	[1,1,1,0,1,1,0],
	[1,1,0,0,1,1,1],
	[0,0,1,1,1,0,0],
	[1,1,1,1,1,1,1],
	[1,1,1,1,1,0,0]
] ;

var _C ; 	// Clock (time), expressed in seconds ...
var _S ;	// Score (++ every time 5 rounds collected)

// Time ticker interval
var _ITT ;

function initSeg()
{
	_C = 420 ;
	_S = 0 ;

	// "Time" segments
	drawSegments(674,685,0) ;
	drawSegments(705,685,1) ;
	drawSegments(737,685,2) ;

	// "Score" segments
	drawSegments(988,685,3) ;
	drawSegments(933,685,4) ;

	// Turn off segments
	setDigit(0,-1) ;
	setDigit(1,-1) ;
	setDigit(2,-1) ;
	setDigit(3,-1) ;
	setDigit(4,-1) ;
}

function startSeg()
{
	console.log('startSeg called ...') ;
	_ITT = window.setInterval('timeTick()',1100) ;
}

function drawSegments(x,y,i)
{
	var el ;

	for(var j = 0; j < 7; j++)
	{
		el = document.createElement('img') ;
		el.src = '7seg.png' ;
		el.style.position = 'absolute' ;
		el.style.zIndex = 2600 ;
		el.id = 'seg-'+i+'-'+j ;

		el.style.top 	= y + SEGPOS[j][0] + 'px' ;
		el.style.left 	= x + SEGPOS[j][1] + 'px' ;

		if(SEGPOS[j][2] == 1) el.style.webkitTransform = 'rotate(90deg)' ;

		document.getElementById('seg').appendChild(el) ;
	}
}

function setDigit(iDig,val)
{
	var id ;
	var el ;

	// If value is negative, turn off segments
	if(val < 0)
	{
		for(var i = 0; i < 7; i++)
		{
			id = 'seg-' + iDig + '-' + i ;
			document.getElementById(id).style.display = 'none' ;
		}

		return ;
	}

	// Iterate over truth table for digit we're displaying
	for(var i = 0; i < SEGTBL[val].length; i++)
	{
		id = 'seg-' + iDig + '-' + i ;
		el = document.getElementById(id) ;

		if(!SEGTBL[val][i]) el.style.display = 'none' ;
		if(SEGTBL[val][i]) el.style.display = 'block' ;
	}
}

function setScore(s)
{
	var sOnes, sTens ;

	// Break down digits
	if(s > 9)
	{
		sOnes = s % 10 ;
		sTens = Math.floor(s / 10) ;
	}
	else
	{
		sOnes = s ;
		sTens = -1 ;
	}

	// Clear display
	setDigit(3,-1) ;
	setDigit(4,-1) ;

	// Re-draw it, after a short flicker
	setDigit(3,sTens) ;
	setDigit(4,sOnes) ;
}

function setTimer(t)
{
	var tSecOnes, tSecTens, tMins ;

	setDigit(0,-1) ;
	setDigit(1,-1) ;
	setDigit(2,-1) ;

	// Break down digits
	if(t < 60)
	{
		tMins = -1 ;
		tSecTens = Math.floor(t / 10) ;
		tSecOnes = t % 10 ;
	}
	else
	{
		tMins = Math.floor(t / 60) ;
		t -= (60 * tMins) ;
		tSecTens = Math.floor(t / 10) ;
		tSecOnes = t % 10 ;
	}

	setDigit(0,tMins) ;
	setDigit(1,tSecTens) ;
	setDigit(2,tSecOnes) ;
}

function scorePlus()
{
	_S++ ;
	setScore(_S) ;
}

function timeTick()
{
	console.log('timeTick, value is ' + _C) ;
	if(_C < 0) return ;

	_C-- ;
	if((_C % 60) == 0) nextBG() ;
	setTimer(_C) ;
}