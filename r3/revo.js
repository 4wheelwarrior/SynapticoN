
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

	// If we just loaded the last player-facing bullet, trigger death sequence
	if(_ICYL == 2)
	{
		runDeathSequence() ;
		_ICYL = 0 ;
		return ;
	}

	// If we just loaded the last game-facing bullet, trigger fireworks sequence
	if(_ICYL == 5)
	{
		unloadCyl() ;
		_ICYL = 0 ;
		scorePlus() ;
		return ;
	}

	_ICYL++ ;
}

function unloadCyl()
{
	for(var i = 0; i < _BUL.length; i++)
		_BUL[i].style.display = 'none' ;

	// Give 'er a spin
	//_elCyl.style.webkitTransform = 'rotate(360deg)' ;
}