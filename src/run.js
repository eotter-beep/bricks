"use strict";

document.addEventListener( "gsui", ( { detail: d } ) => console.warn( `uncatched event: "${ d.$event }"`, d.$args, d.$target ) );

const GS_DAW_BASE_WIDTH = 1720;
const GS_DAW_BASE_HEIGHT = 980;
const GS_DAW_MIN_SCALE = .72;
const GS_DAW_MAX_SCALE = 1.18;

function gsApplyAutoScale() {
	const scaleW = window.innerWidth / GS_DAW_BASE_WIDTH;
	const scaleH = window.innerHeight / GS_DAW_BASE_HEIGHT;
	const scale = Math.max( GS_DAW_MIN_SCALE, Math.min( GS_DAW_MAX_SCALE, Math.min( scaleW, scaleH ) ) );

	document.documentElement.style.setProperty( "--gsui-autoScale", scale.toFixed( 3 ) );
	document.documentElement.style.setProperty( "font-size", `${ 16 * scale }px` );
}

window.addEventListener( "resize", gsApplyAutoScale, { passive: true } );
window.addEventListener( "orientationchange", gsApplyAutoScale, { passive: true } );
gsApplyAutoScale();

new Promise( resolve => {
	const el = $( "#splashScreen" );
	const elTitle = $( "#splashScreen-title" );
	const elStart = $( "#splashScreen-start" );
	const elFirefox = $( "#splashScreen-firefox" );

	GSUonFirefox
		? elFirefox.$css( "display", "block" )
		: elFirefox.$remove();
	el.$addAttr( "data-loaded" );
	$( "#splashScreen-logo" ).$addAttr( "data-ready" );
	if ( window.CSS && CSS.supports( "clip-path: inset(0 1px 2px 3px)" ) ) {
		elTitle.$addAttr( "enable" );
	}
	elStart.$onclick( () => {
		elTitle.$rmAttr( "enable" );
		el.$addAttr( "data-starting" );
		GSUsetTimeout( resolve, .1 );
	} ).$rmAttr( "disabled" );
	localStorage.removeItem( "cookieAccepted" );
} )
	.then( () => GSUloadJSFile( "assets/gsuiLibrarySamples-v1.js" ) )
	.then( () => GSUloadJSFile( "assets/gsuiWaveletList-v1.js" ) )
	.then( () => {
		const daw = new GSDAW();
		const el = $( "#splashScreen" );

		// window.$daw = daw.getDAWCore();
		el.$addAttr( "data-started" );
		GSUsetTimeout( () => el.$remove(), .8 );
	} );
