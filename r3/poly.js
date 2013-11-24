function drawPoly(ctx, cX, cY, r, vCount, aOffset)
{
	var pts = getPolyPts(cX, cY, r, vCount, aOffset) ;

	ctx.beginPath() ;

	ctx.moveTo(pts[0][0], pts[0][1]) ;

	for(var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]) ;

	ctx.closePath();

	ctx.lineWidth = 2 ;
  	ctx.strokeStyle = '#FFFFFF' ;

	ctx.stroke() ;
}

function drawRoundedPoly(ctx, cX, cY, r, cRad, vCount, aOffset)
{
	var pts ;

	// 1st coat (innermost edge)
	pts = getPolyPts(cX, cY, r - 7, vCount, aOffset) ;
	ctx.lineWidth = 3 ;
	drawRoundedPolyLayer(ctx, pts, cRad, 0.3) ;

	// 2nd coat
	pts = getPolyPts(cX, cY, r - 5, vCount, aOffset) ;
	ctx.lineWidth = 2 ;
	drawRoundedPolyLayer(ctx, pts, cRad, 0.5) ;

	// 3rd coat
	pts = getPolyPts(cX, cY, r-3, vCount, aOffset) ;
	ctx.lineWidth = 3 ;
	drawRoundedPolyLayer(ctx, pts, cRad, 0.3) ;
}

// Lifted from http://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
// Does all the work for drawRoundedPoly() far as putting pixels down
function drawRoundedPolyLayer(ctx, pts, cRad, opac)
{
	if (cRad > 0) pts = getRoundedPoints(pts, cRad);

	var pt = [] ;
	
	ctx.beginPath() ;

	for(var i = 0; i < pts.length; i++)
	{
    	pt = pts[i];

    	if (i == 0) ctx.moveTo(pt[0], pt[1])
   		else ctx.lineTo(pt[0], pt[1])

   		if (cRad > 0) ctx.quadraticCurveTo(pt[2], pt[3], pt[4], pt[5]);
    }

  	ctx.closePath();

  	ctx.strokeStyle = 'rgba(255,255,255,' + opac + ')' ;
  	ctx.stroke() ;
}

function drawCirclePoly(ctx, cx, cy, r)
{
    ctx.beginPath() ;
    ctx.lineWidth = 3 ;
	ctx.strokeStyle = 'rgba(255,255,255,0.3)' ;
	ctx.arc(cx, cy, r - 8, 0, 2 * Math.PI, false) ;
	ctx.stroke() ;

	// 3rd coat
	ctx.beginPath() ;
	ctx.lineWidth = 2 ;
	ctx.strokeStyle = 'rgba(255,255,255,0.5)' ;
	ctx.arc(cx, cy, r - 5, 0, 2 * Math.PI, false) ;
	ctx.stroke() ;

	
	// 4th coat (outermost edge)
	ctx.beginPath() ;
	ctx.lineWidth = 3 ;
	ctx.strokeStyle = 'rgba(255,255,255,0.3)' ;
	ctx.arc(cx, cy, r - 3, 0, 2 * Math.PI, false) ;
	ctx.stroke() ;
}

// Returns vertices for basic polygon shape
function getPolyPts(cX, cY, r, vCount, aOffset)
{
	var a = 0 ;
	var x = 0 ;
	var y = 0 ;

	var pts = [] ;

	for(var i = 0; i < vCount; i++)
	{
		a = aOffset + 2 * Math.PI / vCount * i ;
		x = cX + r * Math.cos(a) ;
		y = cY + r * Math.sin(a) ;

		pts.push([Math.round(x),Math.round(y)]) ;
	}

	return pts ;
}

// Takes an array of points from getPolyPts
// And generates points for quadratic curves
function getRoundedPoints(pts, cRad)
{
	var i1, i2, i3, p1, p2, p3 ;

	var prevPt = [] ;
	var nextPt = [] ;

    var len = pts.length ;
    var res = new Array(len) ;

  	for (i2 = 0; i2 < len; i2++)
  	{
	    i1 = i2 - 1 ;
	    i3 = i2 + 1 ;
	    
	    if (i1 < 0) 	i1 = len - 1 ;
	    if (i3 == len) 	i3 = 0 ;
	    
	    p1 = pts[i1];
	    p2 = pts[i2];
	    p3 = pts[i3];
	    
	    prevPt = getRoundedPoint( p1[0], p1[1], p2[0], p2[1], cRad, false ) ;
	    nextPt = getRoundedPoint( p2[0], p2[1], p3[0], p3[1], cRad, true ) ;
	    
	    res[i2] = [ prevPt[0], prevPt[1], p2[0], p2[1], nextPt[0], nextPt[1] ] ;
  	}

  	return res ;
}

function getRoundedPoint(x1, y1, x2, y2, cRad, first)
{
	var total 	= Math.sqrt( Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) ) ;
    var idx 	= first ? cRad / total : ( total - cRad ) / total ;
  	
  	return [ Math.round(x1 + (idx * (x2 - x1))), Math.round(y1 + (idx * (y2 - y1))) ] ;
}