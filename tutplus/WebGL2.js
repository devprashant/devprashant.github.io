function MH(A, B){
	var Sum =0;
	for (var i=0; i< A.length; i++) {
		Sum += A[i] + B[i];
	}
	return Sum;
}

function MultiplyMatrix(A, B) {
	var A1 = [A[0],A[1],A[2],A[3]];
	var A2 = [A[4],A[5],A[6],A[7]];
	var A3 = [A[8],A[9],A[10],A[11]];
	var A4 = [A[12],A[13],A[14],A[15]];

	var B1 = [B[0],B[4],B[8],B[12]];
	var B2 = [B[1],B[5],B[9],B[13]];
	var B3 = [B[2],B[6],B[10],B[14]];
	var B4 = [B[3],B[7],B[11],B[15]];

	return [
		MH(A1, B1), MH(A1, B2), MH(A1, B3), MH(A1, B4),
		MH(A2, B1), MH(A2, B2), MH(A2, B3), MH(A2, B4),
		MH(A3, B1), MH(A3, B2), MH(A3, B3), MH(A3, B4),
		MH(A4, B1), MH(A4, B2), MH(A4, B3), MH(A4, B4);
	];
}

function GLObject(VertexArr, TriangleArr, TextureArr, ImageSrc) {
	this.Pos = {
		X: 0,
		Y: 0,
		Z: 0
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
	this.Triangles = TriangleArr;
	this.TriangleCount = TriangleArr.length;
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
