var pMatrix = mat4.create();
var mvMatrix = mat4.create();

function setMatrixUniforms(){
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}


var actions = {};
var iv = null;

function keyMappings(){
	
	var keyMappings = { '37' : 'panleft', '38' : 'panup', '39' : 'panright', '40' : 'pandown'};

	for (var k in keyMappings){
		actions[keyMappings[k]] = false;
	}
	window.onkeydown = function(e){
			var kc = e.keyCode.toString();
			if (keyMappings.hasOwnProperty(kc)){
				actions[keyMappings[kc]] = true;
				if (!iv){
					iv = setInterval('drawScene();', 16);
				}
			}
		};

		window.onkeyup = function(e){
			var kc = e.keyCode.toString();
			if (keyMappings.hasOwnProperty(kc)){
				actions[keyMappings[kc]] = false;
			}
			for (var j in keyMappings){
				if (actions[keyMappings[j]]){
					return;
				}
			}
			iv = null;
		};
}

var offset = [-0.5, 0];
var scale = 1.35;

function drawScene(){
	offset[0] += -(actions.panleft ? scale / 25 : 0) + (actions.panright ? scale / 25 : 0);
	offset[1] += -(actions.pandown ? scale / 25 : 0) + (actions.panup ? scale / 25 : 0);
	gl.viewport(0,0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	mat4.identity(mvMatrix);

	mat4.translate(mvMatrix, [-1.5, 0.0, -30.0]);

	gl.bindBuffer(gl.ARRAY_BUFFER, recPathVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, recPathVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, recPathVertexPositionBuffer.numItems);
}

function webGLStart(){
	var canvas = document.getElementById("2map");
	
	initGL(canvas);
	initShaders();
	initBuffers();

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;

	drawScene();
	
}