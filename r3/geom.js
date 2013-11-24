// Number of points around circle (inherent to geometry pattern)
// Probably won't change ....
var GSEGS 		= 6 ;
var DA 			= 2.39982772 ;
var PHI 		= ( 1 + Math.sqrt(5) ) / 2 ;

// G sprite cell radius (canvas coords)
var GCELL_RAD	= 120 ;

// Draw window size
// Works like this:
// Center iDF in draw window (called "i" here for short)
// 
//  |--------i-------|
// [00, 01, 02, 03, 04, 05, 06, 07]
//
//
// Paint all cells from beginning to end of draw window
//
//  |-------> increment i by C_DFINC
//          |--------i-------|
// [00, 01, 02, 03, 04, 05, 06, 07]
//
// Paint all cells again ... rinse and repeat
// 
// NOTE: Cell opacity (GSPR_O) needs to be tweaked
// When changing these values because of more/less layers painted
// Eg. DFWIN_SIZE halves, GSPR_O doubles (roughly)
var DFWIN_SIZE 	= 8 ;
var DFINC 		= 2 ;

// "organic" factor range for painting geom. cells
var GORG_MIN 	= 5 ;
var GORG_MAX 	= 25 ;

// Organic factor for a complete geometry cycle. Randomized each time.
var _gOrg ;

// ms Delay before fading out geom. canvas after drawing
var GFDELAY 	= 4400 ;

// "Geometry Draw Queue"
// Contains center points, radii for geometry cells
// Ordered in the correct sequence for drawing
var _GDQ 		= [] ;

// Actual organic factor
// Randomized at beginning of geom cycle,
// Stays the same until next cycle
var _gOrg		= 0 ;

// 0 = clockwise, 1 = ccw. Default draw order is clockwise (0)
var _gDir 		= 0 ;

// Tracks 'center point' of drawing window
// Starts at half DFWIN_SIZE
var _iDF 		= DFWIN_SIZE / 2 ;

// Index within drawing window ... runs from 0 to DFWIN_SIZE
// Resets once DFWIN_SIZE is reached, then _iDF is incremented
var _iDFLoc 	= _iDF - DFWIN_SIZE / 2 ;

// Canvas/Context for G foreground
var _CNG, _CXG ;

// Canvas/Context for G background
var _CNB, _CXB ;

// Canvas/Context for G Cell sprite
var _CNC, _CXC ;

var _bgIdx = 0 ;

var _GDQ = [] ;

// 0 = clockwise, 1 = ccw. Default draw order is clockwise (0).
// Swapped for each geometry draw cycle
var _gDir = 0 ;

// Interval for geometry drawing routine (drawFaded())
// Gets set and cleared dynamically as new geometry is generated in _GDQ
var _IDG ;

function initGeom()
{
	_CNG = document.getElementById('cnv-g') ;
	_CXG = _CNG.getContext('2d') ;

	_CNB = document.getElementById('cnv-b') ;
	_CXB = _CNB.getContext('2d') ;

	_CNC = document.getElementById('cnv-c') ;
	_CXC = _CNC.getContext('2d') ;

	initGCnvFG() ;
	initGCnvBG() ;

	renderGCellSprite() ;
}

function startGeom()
{
	window.setInterval('drawFaded()', 10) ;
	window.setInterval('doGCycle()', 10000) ;
	window.setInterval('nextBG()', 60000) ;
}

function initGCnvFG()
{
	// Paint background onto canvas
	var img = document.getElementById('bg-'+_bgIdx);
	_CXG.drawImage(img, 0, 0, 256, 192, 0, 0, 512, 384) ;
}

function initGCnvBG()
{
	// Paint background onto canvas
	var img = document.getElementById('bg-'+_bgIdx);
	_CXB.drawImage(img, 0, 0, 256, 192, 0, 0, 512, 384) ;
}

function renderGCellSprite()
{
    var cR 	= 255 ;
    var cG 	= 255 ;
    var cB 	= 255 ;

    var o 	= 0.25 ;

    // Creating separate vars for readability
    var cx  = 120 ;
    var cy 	= 120 ;
    var r 	= 120 ;

    var rg 	= _CXC.createRadialGradient(cx, cy, 10, cx, cy, r) ;

    console.log('renderGCellSprite running ...') ;
    rg.addColorStop(0, 		'rgba('+cR+', '+cG+', '+cB+', 0.0)') ;
    rg.addColorStop(0.6, 	'rgba('+cR+', '+cG+', '+cB+', 0.0)') ;
    rg.addColorStop(0.9, 	'rgba('+cR+', '+cG+', '+cB+', '+ 0.2 * o +')') ;
    rg.addColorStop(1, 		'rgba('+cR+', '+cG+', '+cB+', '+ 0.2 * o +')') ;

    _CXC.beginPath() ;
    _CXC.arc(cx, cy, r, 0, 2 * Math.PI, false) ;
    _CXC.fillStyle = rg ;
    _CXC.fill() ;
}

function doGCycle()
{
	// Clear draw queue, re-randomize oragnic factor
	_GDQ = [] ;
	_gOrg = randomInt(GORG_MIN, GORG_MAX) ;

	var rBase = randomInt(10,30) ;
	var aOff = 2 * Math.PI / randomInt(1,7) ;

	var cx = 512 / 2 ;
	var cy = 384 / 2 ;

	// Paint background onto canvas
	//var img = document.getElementById('bg-'+_bgIdx);

	//_ctxG.drawImage(img, 0, 0, 256, 192, 0, 0, 512, 384) ;
	//_ctxGB.drawImage(img, 0, 0, 256, 192, 0, 0, 512, 384) ;

	// Re-initialize foreground canvas to current colour
	initGCnvFG() ;
	initGCnvBG() ;

	_CNG.style.opacity = 1.0 ;

	// Calculate cell coordinates
	for(var i = 0; i < 3; i++)
	{
		calcFol(cx, cy, rBase * Math.pow(PHI,(i + 1)), (aOff + DA * (i + 1))) ;
	}

	// One more iteration ... (i will already be incremented from for() loop)
	calcSol(cx, cy, rBase * Math.pow(PHI,(i + 1)), (aOff + DA * (i + 1))) ;

	// If direction is reversed (_gDir = 1), reverse array
	if(_gDir) _GDQ.reverse() ;

	//console.log('Starting draw sequence, DQ size is '+_GDQ.length) ;
	// Start draw queue processor. Stopped when drawFaded() has no more elements
	_IDG = window.setInterval('drawFaded()', GDF_INT) ;

	// Flip draw direction for next cycle
	if(!_gDir) _gDir = 1 ;
	else _gDir = 0 ;
}

function drawFaded()
{
	//if(_PAUSEGDQ) return false ;

	// If we've reached the end of the draw queue,
	// Stop drawing, set fade out timer, reset for next cycle
	if(_iDFLoc >= _GDQ.length)
	{
		// Linger briefly, then fade
		window.setTimeout(function(){_CNG.style.opacity = 0}, GFDELAY) ;
		window.clearInterval(_IDG) ;

		// Reset draw pointers
		_iDF = DFWIN_SIZE / 2 ;
		_iDFLoc = _iDF - DFWIN_SIZE / 2 ;

		return ;
	}

	// If we've reached the end of the draw window...
	// Advance _iDF (center point) to next position
	// And position iDFLoc to the beginning of the new draw window
	if(_iDFLoc > _iDF + DFWIN_SIZE / 2)
	{
		_iDF += DFINC ;
		_iDFLoc = _iDF - DFWIN_SIZE  / 2 ;

		return ;
	}

	// Paint the cell
	drawGCell(_GDQ[_iDFLoc][0], _GDQ[_iDFLoc][1], _GDQ[_iDFLoc][2]) ;

	_iDFLoc++ ;
}

function drawGCell(cx, cy, rNom)
{
    // Apply organic factor to nominal radius
    var r = rNom * ( randomInt((100 - _gOrg),(100 + _gOrg)) / 100 ) ;
    r = Math.round(r) ;

    //console.log('Drawing with cx/cy/rNom/r '+cx+'/'+cy+'/'+rNom+' / '+r) ;

    // Calculate x, y of top left corner relative to center
    // Where cell will be placed
    var x = cx - r ;
    var y = cy - r ;

    _CXG.drawImage(_CNC, 0, 0, 240, 240, x, y, r * 2, r * 2) ;
}

function calcFol(cx, cy, r, ao){
    var a ;
    var x ;
    var y ;

    calcSol(cx, cy, r, ao) ;

    for(var i = 0; i < GSEGS; i++){
        a = ao + (i + 1) * (2 * Math.PI / GSEGS) ;

        x = Math.round(cx + 2 * r * Math.cos(a)) ;
        y = Math.round(cy + 2 * r * Math.sin(a)) ;

        calcSol(x, y, r, a) ;
    }
}

function calcSol(cx, cy, rNom, ao){
    var a ;
    var x ;
    var y ;

    // Round off radius before pushing into draw queue
    _GDQ.push([cx, cy, Math.round(rNom)]) ;

    for(var i = 0; i < GSEGS; i++){
        a = ao + (i + 1) * (2 * Math.PI / GSEGS) ;
        x = Math.round(cx + rNom * Math.cos(a)) ;
        y = Math.round(cy + rNom * Math.sin(a)) ;
        _GDQ.push([x, y, Math.round(rNom)]) ;
    }
}

function nextBG()
{
	// If we're on the last background already, we're done ... halt the game
	if(_bgIdx == 6)
	{
		halt() ;
		return ;
	}
    
    _bgIdx++ ;

    // Re-initialize background canvas to new colour
    initGCnvBG() ;
}