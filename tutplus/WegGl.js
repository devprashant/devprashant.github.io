
function WebGL(CID, FSID, VSID){
	var canvas = document.getElementById(CID);
	if(!canvas.getContext("webgl") && !canvas.getContext("experimental-webgl")
		alert("Your Browser Doesn't Support WebGL");
	else{
		this.GL = (canvas.getContext("webgl")) ? canvas.getContext("webgl") : canvas.getContext("experimental-webgl");

		this.GL.clearColor(1.0, 1.0, 1.0, 1.0);
		this.GL.enable(this.GL.DEPTH_TEST);
		this.GL.depthFunc(this.GL.LEQUAL);
		this.AspectRation = canvas.width / canavs.height;

		var FShader = document.getElementById(FSID);
		var VShader = docuemnt.getElementById(VSID);

		if(!FShader || !VShader)
			alert("Error, Could Not Find Shaders");
		else{
			var Code = LoadShader(FShader);
			FShader = this.GL.createShader(this.GL.FRAGMENT_SHADER);
			this.GL.shaderSource(FShader, Code);
			this.GL.compileShader(FShader);

			Code = LoadShader(VShader);
			VShader = this.GL.createShader(this.GL.VERTEX_SHADER);
			this.GL.shaderSource(VShader, Code);
			this.GL.compileShader(VShader);

			this.ShaderProgram = this.GL.createProgram();
			this.GL.attachShader(this.shaderProgram, FShader);
			this.GL.attachShader(this.shaderProgram, VShader);
			this.GL.linkProgram(this.ShaderProgram);
			this.useProgram(this.ShaderProgram);

			this.VertexPosition = this.GL.getAttribLocation(this.ShaderProgram, "VertexPosition");
			this.GL.enableVertexAttribArray(this.VertexPosition);

			this.VertexTexture = this.GL.getAttribLocation(this.ShaderProgram, "TextureCoord');
			this.GL.enableVertexAttribArray(this.VertexTexture);
		}

		var Cube = {
			Vertices : [ //XYZ Coordinates
				//Front
				1.0, 1.0, -1.0,
				1.0, -1.0, -1.0,
				-1.0, 1.0, -1.0,
				-1.0, -1.0, -1.0,

				//Back
				1.0, 1.0, 1.0,
				1.0, -1.0, 1.0,
				-1.0, 1.0, 1.0,
				-1.0, -1.0, 1.0,

				//Right
				1.0, 1.0, 1.0,
				1.0, -1.0, 1.0,
				1.0, 1.0, -1.0,
				1.0, -1.0, -1.0,

				//Left
				-1.0, 1.0, 1.0,
				-1.0, -1.0, 1.0,
				-1.0, 1.0, -1.0,
				-1.0, -1.0, -1.0,

				//Top
				1.0, 1.0, 1.0,
				-1.0, -1.0, 1.0,
				1.0, -1.0, -1.0,
				-1.0, -1.0, -1.0,

				//Bottom
				1.0, -1.0, 1.0,
				-1.0, -1.0, 1.0,
				1.0, -1.0, -1.0,
				-1.0, -1.0, -1.0
			],
			Triangles : [ 

				//Front
				0, 1, 2,
				1, 2, 3,

				//Back
				4, 5, 6,
				5, 6, 7,

				//Right
				8, 9, 10,
				9, 10, 11,

				//Left
				12, 13, 14,
				13, 14, 15,

				//Top
				16, 17, 18,
				17, 18 ,19,

				//Bottom 
				20, 21, 22,
				21, 22, 23
			],
			Texture : [

				//Front
				1.0, 1.0,
				1.0, 0.0,
				0.0, 1.0,
				0.0, 0.0,

				//Back
				0.0, 1.0,
				0.0, 0.0,
				1.0, 1.0,
				1.0, 0.0,

				//Right
				1.0, 1.0,
				1.0, 0.0,
				0.0, 1.0,
				0.0, 0.0,

				//Left
				0.0, 1.0,
				0.0, 0.0,
				1.0, 1.0,
				1.0, 0.0,

				//Top
				1.0, 0.0,
				1.0, 1.0,
				0.0, 0.0,
				0.0, 1.0,

				//Bottom
				0.0, 0.0,
				0.0, 1.0,
				1.0, 0.0,
				1.0, 1.0
			]
		};

	}
}

function LoadShader(Script){
	var Code = "";
	var CurrentChild = Script.firstChild;
	while(CurrentChild){
		if(CurrentChild.nodeType = CurrentChild.TEXT_NODE)
			Code += CurrentChild.textContent;
		CurrentChild = CurrentChild.nextSibling;
	}
	return code;
}
