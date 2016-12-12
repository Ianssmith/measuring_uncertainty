// sentiment analysis using AFINN english word list: http://www2.imm.dtu.dk/pubdb/views/publication_details.php?id=6010


var sentiment = require('sentiment')
var fs = require('fs');

var a = fs.readFileSync('data/Asthma.txt', "utf-8").split('\n')
var w = fs.readFileSync('data/Well_Visit.txt', "utf-8").split('\n')

var commentHa = ["usp_as_comment_rec_clinic",
"usp_as_comment_clinicvisit",
"usp_as_comment_ca",
"usp_as_comment_pca1",
"usp_as_comment_pca2",
"usp_as_comment_pca_overall",
"usp_as_comment_rec_clinic",
"usp_as_comment_overall",
"usp_as_comment_ec",
"usp_as_comment_comm",
"usp_as_comment_assess",
"usp_as_comment_pe",
"usp_as_other_comment_hm",
"usp_as_comment_mtp",
"usp_as_comment_ps",
"usp_as_comment_pa"]

var commentHw = [
"usp_wv_comment_clinicvisit",
"usp_wv_comment_rec_clinic",
"usp_wv_comment_pca1",
"usp_wv_comment_pca2",
"usp_wv_comment_pca_overall",
"usp_wv_comment_overall",
"usp_wv_comment_ec",
"usp_wv_comment_ca",
"usp_wv_comment_comm",
"usp_wv_comment_assess",
"usp_wv_comment_pe",
"usp_wv_other_comment_hm",
"usp_wv_comment_mtp",
"usp_wv_comment_ps",
"usp_wv_comment_pa"]

var A = []
var W = []

//split into multidim arrays

for(var i=0;i<a.length;i++){
		A.push(a[i].split("\t"))
}

for(var i=0;i<w.length;i++){
		W.push(w[i].split("\t"))
}

//isolate location of comment variables

var Ha = []
for(var i=0;i<A[0].length;i++){
	for(var j=0;j<commentHa.length;j++){
		if(A[0][i] == commentHa[j]){
			Ha.push(i);
		}
	}
}
//console.log(Ha)
//[ 59, 73, 86, 121, 124, 129, 134, 139, 165, 187 ]


var Hw = []
for(var i=0;i<W[0].length;i++){
	for(var j=0;j<commentHw.length;j++){
		if(W[0][i] == commentHw[j]){
			Hw.push(i);
		}
	}
}
//console.log(Hw)
//[ 59, 73, 85, 120, 130, 135, 140, 146, 163, 184 ]

//
var commentArrA = [];
var sentA = []
for(var i=0;i<Ha.length;i++){
	var j=0;
	commentArrA[j] = "comment_corp";
	sentA[j] = "Sentiment_score";
	for(var j=1;j<A.length-1;j++){
		commentArrA[j] = commentArrA[j]+A[j][Ha[i]]
		sentA[j] = sentiment(commentArrA[j])
	}
}
//console.log(commentArrA)
		
var commentArrW = [];
for(var i=0;i<Hw.length;i++){
	var j=0;
	commentArrW[j] = "comment_corp";
	for(var j=1;j<W.length-1;j++){
		commentArrW[j] = commentArrW[j]+W[j][Hw[i]]
	}
}
//console.log(commentArrW)

var sentA = []
sentA[0] = "Sentiment_score";
for(var j=1;j<commentArrA.length;j++){
	sentA[j] = sentiment(commentArrA[j]).score
}
//console.log(JSON.stringify(sentA))

var sentW = []
sentW[0] = "Sentiment_score";
for(var j=1;j<commentArrW.length;j++){
	sentW[j] = sentiment(commentArrW[j]).score
}
//console.log(JSON.stringify(sentW))

for(var i=0;i<A.length;i++){
	A[i].push(commentArrA[i])
	A[i].push(sentA[i])
}
for(var i=0;i<W.length;i++){
	W[i].push(commentArrW[i])
	W[i].push(sentW[i])
}

for(var i=0;i<A.length;i++){
	//console.log(A[i][192])
}


/*
var temp;
for(var i=0;i<W.length;i++){
	temp = "";
	for(var j=0;j<W[0].length;j++){
		temp += W[i][j] 
		temp += "\t";
	}
		console.log(temp)
}
*/
var temp;
for(var i=0;i<A.length;i++){
	temp = "";
	for(var j=0;j<A[0].length;j++){
		temp += A[i][j] 
		temp += "\t";
	}
		console.log(temp)
}


