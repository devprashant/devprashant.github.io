function Mesh(){

	this.programLoaded = function(program){
		program.vertexPositionAttribute = gl.getAttribLocation(program, 'aVertexPosition');
		if (--this.materialaToLoad == 0){
			this.callback();
		}
	}

	this.init = function(jsonstring){
		var mesh = JSON.parse(jsonstring);
		this.vertexPosBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertexPositions), gl.STATIC_DRAW);
		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);

		this.materialsToLoad = mesh.materials.length;
		this.programs = [];
		var that = this;
		for (var m in mesh.materials){
			var material = mesh.materials[m];
			var prog = loadProgram(material.vertexshader, material.fragmentshader, function(prog) { that.programLoaded(prog); });this.vertexPosBuffer = gl.createBuffer();
			prog.numindices = material.numindices;
			this.programs.push(prog);
		}
	}
	this.load = function(file, callback){
		this.callback = callback;
		var that = this;
		loadFile(file, function(x) { that.init(x); }, false, true);
	};
	this.draw = function(){
		for (var p in this.programs){
			var program = this.programs[p];
			gl.useProgram(program);
			gl.enableVertexAttribArray(program.vertexPositionAttribute);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosBuffer);
			gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
			gl.drawElements(gl.TRIANGLES, program.numindices, gl.UNSIGNED_SHORT, start * 2);
			start += program.numindices;

		}
	};
}