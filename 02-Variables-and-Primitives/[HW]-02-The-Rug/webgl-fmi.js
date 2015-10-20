var gl, glprog, aXY, aRGB, u_RES, colorLocation;
var FLOATS = Float32Array.BYTES_PER_ELEMENT;

var engine = (function() {
    'use strict';
    var canvas;

    // Get the canvas element & check webGL context
    function getContext(id) {
        canvas = document.getElementById(id);

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

    // Main function to run the program
    function run(idv, idf) {
        var vShader = getShader(idv, gl.VERTEX_SHADER);
        var fShader = getShader(idf, gl.FRAGMENT_SHADER);

        if (!vShader || !fShader) return null;

        var shaderProgram = gl.createProgram();

        gl.attachShader(shaderProgram, vShader);
        gl.attachShader(shaderProgram, fShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.log(gl.getProgramInfoLog(shaderProgram));
            return null;
        }

        gl.useProgram(shaderProgram);

        return shaderProgram;
    }

    // Compile shader
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

    // Draw rug with threads
    function drawRugWithThreads(rw, rh){
        var cw = canvas.width, ch = canvas.height;

        // FIXME: This line shouldn't be here
        u_RES = gl.uniform2f(u_RES, canvas.width, canvas.height);

        // Create a buffer
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(aXY);
        gl.vertexAttribPointer(aXY, 2, gl.FLOAT, false, 0, 0);

        // draw 50 random rectangles in random colors
        for (var ii = 0; ii < 300; ++ii) {
            if(ii === 0){
                setRectangle(gl, (cw - rw) / 2, (ch - rh) / 2, rw, rh);
            }

            // Setup a random rectangle
            if(ii > 0 && ii < 150){
                setRectangle(gl, randomInt(rw), (ch - rh) / 2, randomInt(4), randomInt(-((ch - rh) / 2)));
            } else if(ii >= 150){
                setRectangle(gl, randomInt(rw), ch - ((ch - rh) / 2), randomInt(4), randomInt((ch - rh) / 2));
            }

            // Set a random color.
            gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);

            // Draw the rectangle.
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    }

    // Returns a random integer from 0 to range - 1.
    function randomInt(range) {
        return Math.floor(Math.random() * range);
    }

    // Fills the buffer with the values that define a rectangle.
    function setRectangle(gl, x, y, width, height) {
        var x1 = x;
        var x2 = x + width;
        var y1 = y;
        var y2 = y + height;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2]), gl.STATIC_DRAW);
    }

    return {
        run: run,
        getContext: getContext,
        drawRugWithThreads: drawRugWithThreads
    };
}());