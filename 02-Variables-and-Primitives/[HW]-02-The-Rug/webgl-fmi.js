var gl, glprog, aXY, aRGB, u_RES, colorLocation;
var FLOATS = Float32Array.BYTES_PER_ELEMENT;

var engine = (function() {
    'use strict';
    var canvas; // изнесох го, за да мога да му взема width и height за резолюцията по-надолу

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

        // TODO: This line shouldn't be here
        u_RES = gl.uniform2f(u_RES, canvas.width, canvas.height);

        // Create a buffer
        var buffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(aXY);
        gl.vertexAttribPointer(aXY, 2, gl.FLOAT, false, 0, 0);

        // чергата - с правоъгълници
        var lines = 20;
        var sh = rh / lines;

        for(var str = 0; str < lines; str+=1){
            setRectangle(gl, (cw - rw) / 2, (ch - rh) / 2 + (str * sh), rw, randomInt(sh));

            // Set a random color.
            gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 0.8);

            // Draw the rectangle.
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }

        // set "borders"
        var borderCoords = [
            [(cw - rw) / 2, (ch - rh) / 2, 2, rh], // left
            [(cw - rw) / 2 + rw, (ch - rh) / 2, 2, rh], // right
            [(cw - rw) / 2, (ch - rh) / 2, rw, 2], // top
            [(cw - rw) / 2, (ch - rh) / 2 + rh - 2, rw, 2] // bottom
        ];

        borderCoords.forEach(function (side) {
            setRectangle(gl, side[0], side[1], side[2], side[3]);
            gl.uniform4f(colorLocation, 0, 0.5, 0.2, 1);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        });

        // draw 500 random rectangles in random colors for the threads
        for (var ii = 0; ii < 500; ++ii) {

            // top & bottom
            if(ii >= 0 && ii < 250){
                setRectangle(gl, randomInt(rw) + (cw-rw) / 2, (ch - rh) / 2, randomInt(4), randomInt(-50));
            } else {
                setRectangle(gl, randomInt(rw) + (cw-rw) / 2, ch - ((ch - rh) / 2), randomInt(4), randomInt(50));
            }

            // Set a random color.
            // TODO: прекалено често цветът е бял. Трябва да ги генерирам в range може би
            gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), Math.random());

            // Draw the rectangle.
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }

        //var strips = 11;
        //var stripsData = [];
        //
        //// draw strips
        //for (var s = 0; s < strips; s += 1) {
        //    // използвам примера от презентацията за гладък пръстен
        //    var N = 200;
        //
        //    // проблемът е, че другите труъгълници се рисуват с пиксели, а тук - не.
        //    // Нямам никаква идея как да го преобразувам.
        //
        //    for (var i = 0; i < N + 2; i++) {
        //        var a = 4 * Math.PI * i / N;
        //        var x1 = 4 / 6 * 0.6 * Math.cos(a), x2 = 0.6 * Math.sin(a);
        //        var y1 = 4 / 6 * 0.9 * Math.cos(a), y2 = 0.9 * Math.sin(a);
        //
        //        setStrip(gl, x1, x2, y1, y2);
        //    }
        //
        //    // Set a random color.
        //    gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), Math.random());
        //
        //    // Draw the rectangle.
        //    gl.drawArrays(gl.TRIANGLES, 0, 6);
        //}
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

        var coords = [ x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2];

        // това ми мирише - не ми изглежда никак оптимизирано да се изиква при всяко завъртане на цикъла
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);
    }

    //function arc(cx, cy, r, a, b, n) {
    //    var angle = a * Math.PI / 180;
    //    var dA = (b * Math.PI / 180) / n;
    //    var points = [];
    //    for (var i = 0; i <= n; i++) {
    //        var x = cx + r * Math.cos(angle + i * dA);
    //        var y = cy + r * Math.sin(angle + i * dA);
    //        points.push(x, y, 0);
    //    }
    //    return points;
    //}

    //function setStrip(gl, x1, x2, y1, y2){
    //    // но да е консистентно поне :D
    //    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x1, x2, y1, y2]), gl.STATIC_DRAW);
    //}

    return {
        run: run,
        getContext: getContext,
        drawRugWithThreads: drawRugWithThreads // TODO: да се премести в отделен модул. Няма какво да прави при библиотеката с конфигурациите.
    };
}());