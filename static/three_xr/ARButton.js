import $ from 'jquery';
import {loadCamera } from "./experimental_features/load_camera.js"

class ARButton {

	static createButton( renderer, sessionInit = {} ) {
		const button = document.createElement( 'button' );
		$("#bottom_navigator_room").append($(button));
		stylizeElement(button);
		function showStartAR( /*device*/ ) {
			button.textContent = 'START AR';
			if ( sessionInit.domOverlay === undefined ) {
				var overlay = document.getElementById( 'ar_dom_overlay' );
				$("#object_found_indicator").css("display","flex");
				if ( sessionInit.optionalFeatures === undefined ) {
					sessionInit.optionalFeatures = [];
				}
				sessionInit.optionalFeatures.push( 'dom-overlay' );
				sessionInit.domOverlay = { root: overlay };
			}

			let currentSession = null;

			async function onSessionStarted( session ) {
				session.addEventListener( 'end', onSessionEnded );
				renderer.xr.setReferenceSpaceType( 'local' );
				await renderer.xr.setSession( session );
				button.textContent = 'STOP AR';
				sessionInit.domOverlay.root.style.display = '';
				currentSession = session;
			}

			function onSessionEnded( /*event*/ ) {
				currentSession.removeEventListener( 'end', onSessionEnded );
				button.textContent = 'START AR';
				currentSession = null;

			}

			//

			button.onclick = function () {
				if ( currentSession === null ) {
					loadCamera("#ar_dom_overlay");
					navigator.xr.requestSession( 'immersive-ar', sessionInit ).then( onSessionStarted );
				} else {
					currentSession.end();
				}
			};

		}

		function disableButton() {
			button.onclick = null;
		}

		function showARNotSupported() {
			disableButton();
			button.textContent = 'AR NOT SUPPORTED';

		}

		function stylizeElement( element ) {
			element.style.padding = '6px 28px';
			element.style.borderRadius = '20px';
			element.style.margin = '0px 20px';
			element.style.backgroundColor = '#722E9A';
			element.style.color = '#FFE863';
			element.style.zindex = '999';
		}

		if ( 'xr' in navigator ) {
			navigator.xr.isSessionSupported( 'immersive-ar' ).then( function ( supported ) {
				supported ? showStartAR() : showARNotSupported();
			} ).catch( showARNotSupported );
			return button;

		} else {

			const message = document.createElement( 'a' );

			if ( window.isSecureContext === false ) {

				message.href = document.location.href.replace( /^http:/, 'https:' );
				message.innerHTML = 'WEBXR NEEDS HTTPS'; // TODO Improve message

			} else {

				message.href = 'https://immersiveweb.dev/';
				message.innerHTML = 'WEBXR NOT AVAILABLE';

			}

			message.style.left = 'calc(50% - 90px)';
			message.style.width = '180px';
			message.style.textDecoration = 'none';

			stylizeElement( message );

			return message;
		}
	}

}

export default ARButton;
