var gl; // global object

var engine = (function() {
    'use strict';

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

    function start(id){
        gl = getContext(id);

        var vSource = document.getElementById("vshader").text;
        var fSource = document.getElementById("fshader").text;

        var vShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vShader, vSource);
        gl.compileShader(vShader);

        if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(vShader));
        }

        var fShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fShader, fSource);
        gl.compileShader(fShader);

        if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(fShader));
        }

        var shaderProgram = gl.createProgram();

        gl.attachShader(shaderProgram, vShader);
        gl.attachShader(shaderProgram, fShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert(gl.getProgramInfoLog(shaderProgram));
        }

        gl.useProgram(shaderProgram);

        gl.clearColor(1, 1, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // draw the point
        gl.drawArrays(gl.POINTS, 0, 1);
    }

    return {
        start: start
    };
}());