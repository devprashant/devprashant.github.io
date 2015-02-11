function WebGL(CID, FSID, VSID){
	var canvas = document.getElementById(CID);
	if(!canvas.getContext("webgl") && !canvas.getContext("experimental-webgl")
		alert("Your Browser Doesn't Support WebGL");
	else {
		this.GL = (canvas.getContext("webgl")) ? canvas.getContext("webgl") : canvas.getContext("experimental-webgl");
		
		this.GL.clearColor(1.0, 1.0, 1.0, 1.0);
		this.GL.enable(this.GL.DEPTH_TEST);
		this.GL.depthFunc(this.GL.LEQUAL);
		this.AspectRatio = canvas.width / canvas.height;

		var FShader = document.getElementById(FSID);
		var VShader = document.getElementByID(VSID);
		
		if(!FShader || !VShader)
			alert("Error, Could Not Find Shaders");
		else{
			var Code = LoadShader(FShader);
			FShader = this.GL.createShader(this.GL.FRAGMENT_SHADER);
			this.GL.shaderSource(FShader, Code);
			this.GL.compileShader(FShader);

			Code = LoadShader(VShader);
			VShader = this.GL.createShader(this.GL.VERTEX_SHADER);
			this.GL.shaderSouce(VShader, Code);
			this.GL.compileShader(VShader);

			this.ShaderProgram = this.GL.createProgram();
			this.GL.attachShader(this.ShaderProgram, FShader);
			this.GL.attachShader(this.ShaderProgram, VShader);
			this.GL.linkProgram(this.ShaderProgram);
			this.GL.useProgram(this.ShaderProgram);

			this.VertexPosition = this.GL.getAttribLocation(this.ShaderProgram, "VertexPosition");
			this.GL.enableVertexAttribArray(this.VertexPosition);

			this.VertexTexture = this.GL.getAttribLocation(this.ShaderProgram, "TextureCoord");
			this.GL.enableVertexAttribArray(this.VertexTexture);
			
	}
}
