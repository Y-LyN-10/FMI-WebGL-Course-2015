
var gl;		// глобален WebGL контекст


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
	
	return context;
}