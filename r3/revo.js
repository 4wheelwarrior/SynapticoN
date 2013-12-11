
// Image element for revolver barrel
var _IMR ;

// Cylinder index
// indices 0 - 4 contain player-facing bullets, starting at TDC going CCW
// indices 5 - 9 contain game-facing bullets, starting at TDC going CW
var _ICYL = 0 ;

// Hit/Miss queue
var _HMQ = [] ;

// Bullet elements
var _BUL = [] ;

// DOM element for cylinder <div>
var _CYL ;


var WCYL			= 150 ;		// Width/Height of revolver cylinder (pixels)
var RCBR			= 35 ;		// Radius from center to chambers
var WBUL			= 44 ;		// Width/Height of bullets (pixels)
var CCNT			= 3 ;		// Chamber count (used to calculate angle increments)

function initRevo()
{
	_CYL = document.getElementById('revolver-cyl') ;

	initBullets() ;
}

function startRevo()
{
	return 1 ;
}

// Distribute bullet elements around revolver chambers
// _BULLETS array (used for turning elements on/off as bullets load/unload)
// _ICYL tracks which cylinder we're on, using same index system ...
//    note, this means bullet DIRECTION is encoded into the index itself
function initBullets()
{
	var x, y ;
	var ang ;
	var el ;

	// Distribute player-facing bullets, counterclockwise
	for(var i = 0; i < 3; i++)
	{
		el = document.createElement('img') ;
		
		// Initialize x,y to center of cylinder
		x = Math.round(WCYL/2) ;
		y = x ;

		ang = Math.PI / 2 + i * 2 * Math.PI / CCNT ;

		x = Math.round( x + RCBR * Math.cos(ang) - 44 / 2 ) ;
		y = Math.round( y - RCBR * Math.sin(ang) - 44 / 2 ) ;
		
		el.src 				= 'bullet-pf.png' ;
		el.style.position 	= 'absolute' ;
		el.style.left 		= x + 'px' ;
		el.style.top 		= y + 'px' ;
		el.style.display 	= 'none' ;
		el.id    			= 'bf' + i ;

		_CYL.appendChild(el) ;
		_BUL.push(el) ;
	}
	

	// Distribute game-facing bullets, clockwise
	for(var i = 0; i > -3; i--)
	{
		el = document.createElement('img') ;
		
		// Initialize x,y to center of cylinder
		x = Math.round( WCYL / 2 ) ;
		y = x ;

		ang = Math.PI / 2 + i * 2 * Math.PI / CCNT ;

		x = Math.round( x + RCBR * Math.cos(ang) - WBUL / 2 ) ;
		y = Math.round( y - RCBR * Math.sin(ang) - WBUL / 2 ) ;
		
		el.src 				= 'bullet-gf.png' ;
		el.style.position 	= 'absolute' ;
		el.style.left 		= x + 'px' ;
		el.style.top 		= y + 'px' ;
		el.style.display 	= 'none' ;
		el.id    			= 'br' + Math.abs(i) ;

		_CYL.appendChild(el) ;
		_BUL.push(el) ;
	}
}

function addBullet(isGameFacing)
{
	// If cyl is currently loaded with player-facing bullets
	// and we're loading a game-facing bullet, clear out cylinder
	if(_ICYL < 3 && isGameFacing)
	{
		unloadCyl() ;
		_ICYL = 3 ;
	}

	// If cyl is currently loaded with game-facing bullets
	// and we're loading a player-facing bullet, clear out cylinder
	if(_ICYL > 3 && !isGameFacing)
	{
		unloadCyl() ;
		_ICYL = 0 ;
	}

	_BUL[_ICYL].style.display = 'block' ;

	if(isGameFacing)
		_BUL[_ICYL].style.webkitTransform = 'rotate('+randomInt(0,360)+'deg)' ;

	_ICYL++ ;
}

function unloadCyl()
{
	for(var i = 0; i < _BUL.length; i++)
	{
		_BUL[i].style.display = 'none' ;
		if(i > 2) _BUL[i].src = 'bullet-gf.png' ;
	}
}

function fireAtGame()
{
	// Fire 1st round, kick back
	console.log('Fire 1') ;
	// Cancel timing function here if snap back is preferred ...
	_CYL.style.webkitTransform = 'scale( 1.2, 1.2 )' ;
	_BUL[3].src = 'bullet-gf-fired.png' ;

	// Snap home, rotate to next chamber
	window.setTimeout(function(){
		_CYL.style.webkitTransform = 'rotate( 120deg ) scale( 1, 1 )' ;
	}, 500) ;

	// Fire 2nd round, kick back
	window.setTimeout(function(){
		CYL.style.webkitTransform = 'rotate( 120deg ) scale( 1.2, 1.2 )' ;
		_BUL[4].src = 'bullet-gf-fired.png' ;
	}, 1000) ;

	// Snap home, rotate to next chamber
	window.setTimeout(function(){
		_CYL.style.webkitTransform = 'rotate( 240deg ) scale( 1, 1 )' ;
	}, 1500) ;

	// Fire 3rd round, kick back
	window.setTimeout(function(){
		_BUL[5].src = 'bullet-gf-fired.png' ;
		_CYL.style.webkitTransform = 'rotate( 240deg ) scale( 1.2, 1.2 )' ;
	}, 2000) ;


	// Snap home, spin back to zero, unload cylinders
	window.setTimeout(function(){
		unloadCyl() ;
		_CYL.style.webkitTransform = 'rotate( 0deg ) scale( 1, 1 )' ;
		_ICYL = 0 ;
	}, 2500) ;
}

// Kick back, towards player (when firing at game)
function cylBack()
{
	_CYL.style.backgroundSize = '170px 170px' ;

	_CYL.style.width = '170px' ;
	_CYL.style.height = '170px' ;

	_CYL.style.left = '431px' ;
	_CYL.style.top = '585px' ;
}

function cylHome()
{
	_CYL.style.backgroundSize = '150px 150px' ;

	_CYL.style.width = '150px' ;
	_CYL.style.height = '150px' ;

	_CYL.style.left = '441px' ;
	_CYL.style.top = '595px' ;
}

// Kick back, away from player (when firing at ... player)
function cylFwd()
{
	_CYL.style.backgroundSize = '130px 130px' ;

	_CYL.style.width = '130px' ;
	_CYL.style.height = '130px' ;

	_CYL.style.left = '451px' ;
	_CYL.style.top = '605px' ;
}

function fireAtPlayer()
{
	return true ;
}