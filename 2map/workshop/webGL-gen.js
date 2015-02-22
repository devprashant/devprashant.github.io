var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();
function mvPushMatrix(){
	var copy = mat4.create();
	mat4.set(mvMatrix, copy);
	mvMatrixStack.push(copy);
}

function mvPopMatrix(){
	if (mvMatrixStack.length == 0){
		throw "Invlaid mvPopMatrix!";
	}
	mvMatrix =mvMatrixStack.pop();
}

function degToRad(degrees){
	return degrees * Math.PI / 180;
}

function setMatrixUniforms(){
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
} 
var rTri = 0;
var rSquare = 0;
function drawScene(){
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	mat4.identity(mvMatrix);

	//drawing triangle
	mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);
	mvPushMatrix();
	mat4.rotate(mvMatrix, degToRad(rTri), [0, 1, 0]);

	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);

	mvPopMatrix();

	//drawing square
	mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);
	mvPushMatrix();
	mat4.rotate(mvMatrix, degToRad(rSquare), [1, 0, 0]);

	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
	mvPopMatrix();

}

var lastTime =0;
function animate(){
	var timeNow = new Date().getTime();
	if (lastTime != 0){
		var elapsed = timeNow - lastTime;

		rTri += (90 * elapsed) / 1000.0;
		rSquare += (75 * elapsed) /1000.0;
	}
	lastTime = timeNow;
}

function tick(){
	requestAnimationFrame(tick);
	drawScene();
	animate();
}


function webGLStart(){
	var canvas = document.getElementById("2map");
	initGL(canvas);
	initShaders();
	initBuffers();

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	tick();
}