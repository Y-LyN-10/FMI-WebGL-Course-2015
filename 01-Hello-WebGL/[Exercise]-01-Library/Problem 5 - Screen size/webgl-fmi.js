
var gl;		// глобален WebGL контекст
var glprog;	// глобална GLSL програма


// връща WebGL контекст, свързан с HTML елемент с даден id
function getContext(id)
{
	var canvas = document.getElementById(id);
	if (!canvas)
	{
		alert("Искаме canvas с id=\""+id+"\", а няма!");
		return null;
	}
	
	var context = canvas.getContext("webgl");
	if (!context)
	{
		context = canvas.getContext("experimental-webgl");
	}
	
	if (!context)
	{
		alert("Искаме WebGL контекст, а няма!");
	}
	
	return context;
}

// връща компилиран шейдър
function getShader(id,type)
{
	var source = document.getElementById(id).text;
	var shader = gl.createShader(type);

	gl.shaderSource(shader,source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS))
	{
		alert(gl.getShaderInfoLog(shader));
		return null;
	}
	
	return shader;
}


// връща готова програма
function getProgram(idv,idf)
{
	var vShader = getShader(idv,gl.VERTEX_SHADER);
	var fShader = getShader(idf,gl.FRAGMENT_SHADER);
			
	if (!vShader || !fShader) {return null;}
	
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram,vShader);
	gl.attachShader(shaderProgram,fShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS))
	{
		alert(gl.getProgramInfoLog(shaderProgram));
		return null;
	}

	gl.useProgram(shaderProgram);
	return shaderProgram;
}