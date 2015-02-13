
function WebGL(CID, FSID, VSID){
	var canvas = document.getElementById(CID);
	if(!canvas.getContext("webgl") && !canvas.getContext("experimental-webgl"))
		alert("Your Browser Doesn't Support WebGL");
	else{
		this.GL = (canvas.getContext("webgl")) ? canvas.getContext("webgl") : canvas.getContext("experimental-webgl");

		this.GL.clearColor(1.0, 1.0, 1.0, 1.0);
		this.GL.enable(this.GL.DEPTH_TEST);
		this.GL.depthFunc(this.GL.LEQUAL);
		this.AspectRatio = canvas.width / canvas.height;

		var FShader = document.getElementById(FSID);
		var VShader = document.getElementById(VSID);

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
			this.GL.attachShader(this.ShaderProgram, FShader);
			this.GL.attachShader(this.ShaderProgram, VShader);
			this.GL.linkProgram(this.ShaderProgram);
			this.GL.useProgram(this.ShaderProgram);

			this.VertexPosition = this.GL.getAttribLocation(this.ShaderProgram, "VertexPosition");
			this.GL.enableVertexAttribArray(this.VertexPosition);

			this.VertexTexture = this.GL.getAttribLocation(this.ShaderProgram, "TextureCoord");
			this.GL.enableVertexAttribArray(this.VertexTexture);
		}

		this.Draw = function(Object, Texture){
			var VertexBuffer = this.GL.createBuffer();

			this.GL.bindBuffer(this.GL.ARRAY_BUFFER, VertexBuffer);
			this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(Object.Vertices), this.GL.STATIC_DRAW);
			this.GL.vertexAttribPointer(this.VertexPosition, 3, this.GL.FLOAT, false, 0, 0);

			var TextureBuffer = this.GL.createBuffer();

			this.GL.bindBuffer(this.GL.ARRAY_BUFFER, TextureBuffer);
			this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(Object.Texture), this.GL.STATIC_DRAW);
			this.GL.vertexAttribPointer(this.VertexTexture, 2 , this.GL.FLOAT, false, 0, 0 );

			var TriangleBuffer = this.GL.createBuffer();
			this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, TriangleBuffer);
			this.GL.bufferData(this.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(Object.Trinagles), this.GL.STATIC_DRAW);

			var PerspectiveMatrix = MakePerspective(45, this.AspectRatio, 1, 10000.0);
			var TransformMatrix = MakeTransform(Object);

			this.GL.activeTexture(this.GL.TEXTURE0);
			this.GL.bindTexture(this.GL.TEXTURE_2D, Texture);
			this.GL.uniform1i(this.GL.getUniformLocation(this.ShaderProgram, "uSampler"), 0);

			var pmatrix = this.GL.getUniformLocation(this.ShaderProgram, "PerspectiveMatrix");
			this.GL.uniformMatrix4fv(pmatrix, false, new Float32Array(PerspectiveMatrix));

			var tmatrix = this.GL.getUniformLocation(this.ShaderProgram, "TransformationMatrix");
			this.GL.uniformMatrix4fv(tmatrix, false, new Float32Array(TransformMatrix));

			this.GL.drawElements(this.GL.TRIANGLES, Object.Trinagles.length, this.GL.UNSIGNED_SHORT, 0);


		};
		
		this.LoadTexture = function(Img){
			var TempTex = this.GL.createTexture();
			this.GL.bindTexture(this.GL.TEXTURE_2D, TempTex);

			this.GL.pixelStorei(this.GL.UNPACK_FLIP_Y_WEBGL, true);

			this.GL.texImage2D(this.GL.TEXTURE_2D, 0, this.GL.RGBA, this.GL.RGBA, this.GL.UNSIGNED_BYTE, Img);

			this.GL.texParameteri(this.GL.TEXTURE_2D, this.GL.TEXTURE_MAG_FILTER, this.GL.LINEAR);
			this.GL.texParameteri(this.GL.TEXTURE_2D, this.GL.TEXTURE_MIN_FILTER, this.GL.LINEAR_MIPMAP_NEAREST);
			this.GL.generateMipmap(this.GL.TEXTURE_2D);

			this.GL.bindTexture(this.GL.TEXTURE_2D, null);
			return TempTex;
		};
	}
}

function MakePerspective(FOV, AspectRatio, Closest, Farest){
	var YLimit = Closest * Math.tan(FOV * Math.PI / 360);
	var A = -( Farest + Closest ) / ( Farest - Closest );
	var B = -2 * Farest * Closest / ( Farest - Closest );
	var C = (2 * Closest) / ( (YLimit * AspectRatio) * 2 );
	var D = (2* Closest) / ( YLimit * 2);
	return [
		C, 0, 0, 0,
		0, D, 0, 0,
		0, 0, A, -1,
		0, 0, B, 0
	];
}

function LoadShader(Script){
	var Code = "";
	var CurrentChild = Script.firstChild;
	while(CurrentChild){
		if(CurrentChild.nodeType == CurrentChild.TEXT_NODE)
			Code += CurrentChild.textContent;
		CurrentChild = CurrentChild.nextSibling;
	}
	return Code;
}

var Cube = {
			Rotation : 0,
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
			Trinagles : [ 

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

function MH(A, B) {
    var Sum = 0;
    for (var i = 0; i < A.length; i++) {
        Sum += A[i] * B[i];
    }
    return Sum;
}
 
function MultiplyMatrix(A, B) {
    var A1 = [A[0], A[1], A[2], A[3]];
    var A2 = [A[4], A[5], A[6], A[7]];
    var A3 = [A[8], A[9], A[10], A[11]];
    var A4 = [A[12], A[13], A[14], A[15]];
 
    var B1 = [B[0], B[4], B[8], B[12]];
    var B2 = [B[1], B[5], B[9], B[13]];
    var B3 = [B[2], B[6], B[10], B[14]];
    var B4 = [B[3], B[7], B[11], B[15]];
 
    return [
    MH(A1, B1), MH(A1, B2), MH(A1, B3), MH(A1, B4),
    MH(A2, B1), MH(A2, B2), MH(A2, B3), MH(A2, B4),
    MH(A3, B1), MH(A3, B2), MH(A3, B3), MH(A3, B4),
    MH(A4, B1), MH(A4, B2), MH(A4, B3), MH(A4, B4)];
}

function GLObject(VertexArr, TrianlgeArr, TextureArr, ImageSrc){
	this.POS = {
		X: 0,
		Y:0,
		Z:0
	};
	this.Scale = {
		X: 1.0,
		Y: 1.0,
		Z: 1.0
	};
	this.Rotation = {
		X: 0,
		Y: 0,
		Z: 0
	};

	this.Vertices = VertexArr;
	this.Trianges = TrianlgeArr;
	this.TriangleCount = TrianlgeArr.length;
	this.TextureMap = TextureArr;
	this.Image = new Image();
	this.Image.onload = function(){
		this.ReadyState = true;
	};
	this.Image.src = ImageSrc;
	this.Ready = false;
	this.GetTransforms = function () {
    //Create a Blank Identity Matrix
    var TMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
 
    //Scaling
    var Temp = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    Temp[0] *= this.Scale.X;
    Temp[5] *= this.Scale.Y;
    Temp[10] *= this.Scale.Z;
    TMatrix = MultiplyMatrix(TMatrix, Temp);
 
    //Rotating X
    Temp = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    var X = this.Rotation.X * (Math.PI / 180.0);
    Temp[5] = Math.cos(X);
    Temp[6] = Math.sin(X);
    Temp[9] = -1 * Math.sin(X);
    Temp[10] = Math.cos(X);
    TMatrix = MultiplyMatrix(TMatrix, Temp);
 
 
    //Rotating Y
    Temp = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    var Y = this.Rotation.Y * (Math.PI / 180.0);
    Temp[0] = Math.cos(Y);
    Temp[2] = -1 * Math.sin(Y);
    Temp[8] = Math.sin(Y);
    Temp[10] = Math.cos(Y);
    TMatrix = MultiplyMatrix(TMatrix, Temp);
 
    //Rotating Z
    Temp = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    var Z = this.Rotation.Z * (Math.PI / 180.0);
    Temp[0] = Math.cos(Z);
    Temp[1] = Math.sin(Z);
    Temp[4] = -1 * Math.sin(Z);
    Temp[5] = Math.cos(Z);
    TMatrix = MultiplyMatrix(TMatrix, Temp);
 
 
    //Moving
    Temp = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    Temp[12] = this.Pos.X;
    Temp[13] = this.Pos.Y;
    Temp[14] = this.Pos.Z * -1;
 
    return MultiplyMatrix(TMatrix, Temp);
}
}

