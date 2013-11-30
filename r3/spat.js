// Counting number of shots ...
var _iDeath = 0 ;

// Start in random quadrant
var _IQ ;

// Quadrant padding
var QPAD = 100 ;

// Do a blood spray centered at cx,cy
// fanning out between a1 and a2
// reaching out to average radius of rNom
// with 'p' particle count
var BPSIZE_MIN = 10 ;
var BPSIZE_MAX = 90 ;
var SPRAYR_ORG = 30 ;
var RDRIP 	   = 20 ; // max radius which will drip

// Drip registry ... for blood drips
var _DREG = [] ;

// Counter for drip registry (used for shifting size and position every n'th iteration)
var _iDreg = 0 ;

// Interval calling updateDREG() 
var _IDRIP ;

// Canvas/Context for spatter overlay
var _CNS, _CXS ;

// Blood particle <img>
var _IMB ;

function initSpatter()
{
	_CNS = document.getElementById('cnv-spatter') ;
	_CXS = _CNS.getContext('2d') ;

	_IMB = document.getElementById('p-blood') ;

	// Start in random quadrant
	_IQ = randomInt(0,3)
}

function startSpatter()
{
	return true ;
}

function runDeathSequence()
{
	/*
	window.clearInterval(_IBSP) ;
	window.clearInterval(_IGCY) ;
	window.clearInterval(_ITMR) ;
	window.clearInterval(_IUSR) ;

	_cnvG.style.display 	= 'none' ;
	_cnvGB.style.display 	= 'none' ;
	_elSC.style.display 	= 'none' ;
	_cnvSP.style.display 	= 'block' ;
	_cnvGL.style.display 	= 'block' ;
	_elBC.style.display 	= 'none' ;
	_elSC.style.display     = 'none' ;

	_elBGlo.style.display   = 'none' ;
	_elRGlo.style.opacity   = 1 ;

	// Turn off rocker switch
	_elRS.style.backgroundPosition = '0px 72px' ;
	*/
	document.getElementById('crt-blank').style.display = 'block' ;
	document.getElementById('spatter-mask').style.display = 'block' ;
	document.getElementById('seg').style.display = 'none' ;
	
	_IDRIP 	= window.setInterval('updateDREG()',200) ;
	fireRound() ; // will call itself 3x

	/*
	_elCyl.style.webkitTransform = 'rotate(360deg)' ;
	_elCyl.style.webkitTransition = '-webkit-transform 1s, top 4s' ;
	_elCyl.style.top = '200px' ;

	window.setTimeout(function(){
		_elCyl.style.webkitTransform = 'rotate(-360deg)' ;
		unloadCyl() ;
		deathSeq() ;

		document.getElementById('red-matte').style.display = 'block' ;
	
		window.setTimeout(function(){
			document.getElementById('red-matte').style.opacity = 0.3 ;
		},2000) ;

		window.setTimeout(function(){
			_elCyl.style.display = 'none' ;
		},3000) ;
	},3000) ;

	*/
}

function fireRound()
{
	var cx, cy ;
	var x, y ;
	var qLoc ;

	// If we've recursed enough, return
	if(_iDeath > 2) return ;

	// Pick random cx, cy from quadrant
	var qb = getQuadrantBounds(_IQ) ;
	cx = randomInt(qb[0], qb[1]) ;
	cy = randomInt(qb[2], qb[3]) ;
	
	// Copy quadrant index into local var so timeout
	// triggers on proper quadrant
	// (otherwise it'd be incremented already after 500ms timeout ...)
	qLoc = _IQ ;

	window.setTimeout(function(){sprayBlood(qLoc)},500) ;

	_IQ++ ;

	// Cycle back to quadrant zero
	if(_IQ > 3) _IQ = 0 ;

	// Increment recursion counter, call again
	window.setTimeout('fireRound()',randomInt(400,1000)) ;
	_iDeath++ ;
}

function sprayBlood(iQ)
{
	var cx, cy ;
	var xMin, yMin, xMax, yMax ;
	var rMax ;

	var qb = getQuadrantBounds(iQ) ;

	xMin = qb[0] ;
	xMax = qb[1] ;
	yMin = qb[2] ;
	yMax = qb[3] ;

	cx = randomInt(xMin, xMax) ;
	cy = randomInt(yMin, yMax) ;

	// Inner ring
	rMax = randomInt(50,300) ;
	formSpatter(cx, cy, rMax) ;

	// Mid Ring
	rMax = randomInt(250,500) ;
	formSpatter(cx, cy, rMax) ;

	// Outer ring
	rMax = randomInt(400,800) ;
	formSpatter(cx, cy, rMax) ;
}

function getQuadrantBounds(iQ)
{
	var xMin, xMax, yMin, yMax ;

	if(iQ == 0){
		xMin = QPAD ;
		xMax = 512 - QPAD ;
		yMin = QPAD ;
		yMax = 384 - QPAD ;
	}

	if(iQ == 1){
		xMin = 512 - QPAD ;
		xMax = 1024 - QPAD ;
		yMin = QPAD ;
		yMax = 384 - QPAD ;
	}

	if(iQ == 2){
		xMin = QPAD; 
		xMax = 512 - QPAD ;
		yMin = 384 + QPAD ;
		yMax = 768 - QPAD ;
	}

	if(iQ == 3){
		xMin = 512 + QPAD ;
		xMax = 1024 - QPAD ;
		yMin = 384 + QPAD ;
		yMax = 768 - QPAD ;
	}

	return([xMin, xMax, yMin, yMax]) ;
}

// Basically calls doSpray a few times
// with different max radii to form full on splatter
function formSpatter(cx, cy, rMax)
{
	for(var i = 0; i < 5; i++)
	{
		//console.log('Running formSpatter with '+cx+', '+cy+', '+rMax) ;
		doSpray(cx, cy, rMax) ;
	}
}

// Does a single spray @ random angle
// centered at cx,cy with random radius
function doSpray(cx, cy, rMax)
{
	r = randomInt(50,rMax) ;

	a1 = randomInt(0, Math.floor(2 * Math.PI * 100)) / 100 ;
	a2 = a1 + randomInt(Math.PI * 25, Math.PI * 50) / 100 ;

	spray(cx, cy, a1, a2, r, 30) ;
}

function spray(cx, cy, a1, a2, rNom, p)
{
	var r ;
	var a ;

	var s ; // particle size

	var x, y ; // position of particle being plotted

	var a1int ;
	var a2int ;

	for(var i = 0; i < p; i++)
	{
		//if(a2 > a1) a = randomInt(Math.floor(a1 * 100), Math.floor(a2 * 100)) / 100 ;
		//if(a2 < a1) a = randomInt(Math.floor(a2 * 100), Math.floor(a1 * 100)) / 100 ;
		a1int = Math.floor(a1 * 100) ;
		a2int = Math.floor(a2 * 100) ;

		//console.log('randomizing angle between '+a1int+' and '+a2int) ;

		a = randomInt(a1int,a2int) / 100 ;

		r = rNom * ( randomInt((100 - SPRAYR_ORG),(100 + SPRAYR_ORG)) / 100 ) ;
		r = Math.floor(r) ;
		r = randomInt(0,r) ;

		s = randomInt(BPSIZE_MIN, BPSIZE_MAX) ;

		x = Math.floor(cx + r * Math.cos(a)) ;
		y = Math.floor(cy + r * Math.sin(a)) ;

		_CXS.drawImage(_IMB, 0, 0, 50, 50, x, y, s, s) ;

		if(s < RDRIP) _DREG.push([x,y,(s - 1),(y + randomInt(50,200))]) ;
	}
}

function updateDREG()
{
	var x, y, yFin, s, sOrg ;
	var t ;
	var p = 20 ;

	for(var i = 0; i < _DREG.length; i++)
	{
		// Randomly skip a draw every so often ... makes drips fall at diff. rates
		//var t = randomInt(0,100) ;
		//if(t < p) continue ;

		x 		= _DREG[i][0] ;
		y 		= _DREG[i][1] ;
		s 		= _DREG[i][2] ;
		yFin 	= _DREG[i][3] ;

		y += 1 ;

		// Calculate organic factor
		sOrg 	= s * ( randomInt((100 - 20), (100 + 40)) / 100) ;
		sOrg 	= Math.floor(sOrg) ;

		// Every 20th cycle, move x position
		if(!(_iDreg % 30))
		{
			x += randomInt(-2,2) ;
			_DREG[i][0] = x ;
		}

		// Re-center blood drip
		x -= Math.floor(Math.abs(sOrg - s) / 2) ;

		if(y > yFin) continue ;

		// Every 20th cycle, decrease drip size
		if(!(_iDreg % 15)) s-- ;	

		// Floor out size at 3
		if(s < 3) s = 3 ;

		// Paint a drip at the new y location
		_CXS.drawImage(_IMB, 0, 0, 50, 50, x, y, sOrg, sOrg) ;

		// Save new Y position into drip reg
		_DREG[i][1] = y ;
		_DREG[i][2] = s ;
	}

	_iDreg++ ;

	if(_iDreg > 10000) _iDreg = 0 ;
}