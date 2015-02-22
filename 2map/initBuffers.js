var recPathVertexPositionBuffer;

function initBuffers(){
	recPathVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, recPathVertexPositionBuffer);
	var vertices = [
		 1.0,  1.0, 0.0,
		-1.0,  1.0, 0.0,
		 1.0, -1.0, 0.0,
		-1.0, -1.0, 0.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	recPathVertexPositionBuffer.itemSize = 3;
	recPathVertexPositionBuffer.numItems = 4;
}