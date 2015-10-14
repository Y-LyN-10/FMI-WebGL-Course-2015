var gl;		// глобален WebGL контекст
var glprog;	// глобална GLSL програма

var engine = (function() {
	'use strict';

	// Sorry, but the given code doesn't follow JS quality code conventions
	// I use my own getContext function from Problem 2, solved in class
	function getContext(id) {
		var canvas = document.getElementById(id);

		if (!canvas) {
			alert('Sorry, canvas with id ' + id + ' is not found');
			return null;
		} else {
			var context = canvas.getContext("webgl");

			if (!context) {
				context = canvas.getContext("experimental-webgl");

				if (!context) {
					alert("Sorry, no WebGL context found");
					return null;
				}
			}

			return context;
		}
	}

	function getShader(id, type) {
		var source = document.getElementById(id).text;
		var shader = gl.createShader(type);

		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			alert(gl.getShaderInfoLog(shader));
			return null;
		}

		return shader;
	}

	function run(idv, idf) {
		var vShader = getShader(idv, gl.VERTEX_SHADER);
		var fShader = getShader(idf, gl.FRAGMENT_SHADER);

		if (!vShader || !fShader) {
			return null;
		}

		var shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vShader);
		gl.attachShader(shaderProgram, fShader);
		gl.linkProgram(shaderProgram);

		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			alert(gl.getProgramInfoLog(shaderProgram));
			return null;
		}

		gl.useProgram(shaderProgram);
		return shaderProgram;
	}

	return {
		getContext: getContext,
		run: run
	};
}());