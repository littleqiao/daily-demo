var board = new Array();
var score = 0;
//记录每一个格子是否发生碰撞
var hasConflicted = new Array();

$(document).ready(function(){
	newgame();
});

function newgame(){
	//初始化格子
	init();
	//随机在两个格子生成数字
	generateOneNumber();
	generateOneNumber();
}

function init(){
	for(var i=0 ; i<4 ; i++){
		for(var j=0 ; j<4 ; j++){
			var gridCell = $('#grid-cell-' + i + '-' + j);
			gridCell.css('top',getPosTop(i,j));
			gridCell.css('left',getPosLeft(i,j));
		}
	}

	for( var i=0 ; i<4 ; i++ ){
		board[i] = new Array();
		hasConflicted[i] = new Array();
		for( var j =0 ; j<4 ; j++ ){
			board[i][j] = 0;
			hasConflicted[i] = false;
		}
	}

	updateBoardView();
}

function updateBoardView(){

	$(".number-cell").remove();
	for(var i=0 ; i<4 ; i++){
		for(var j=0 ; j<4 ; j++){
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var theNumberCell = $('#number-cell-' + i + '-' + j );

			if(board[i][j] == 0){
				theNumberCell.css('width','0px');
				theNumberCell.css('height','0px');
				theNumberCell.css('top',getPosTop(i,j)+50);
				theNumberCell.css('left',getPosLeft(i,j)+50);
			}else{
				theNumberCell.css('width','100px');
				theNumberCell.css('height','100px');
				theNumberCell.css('top',getPosTop(i,j));
				theNumberCell.css('left',getPosLeft(i,j));
				theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color',getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
			}

			hasConflicted[i][j] = false; 
		}
	}
}

function generateOneNumber(){
	if(nospace(board)){
		return false;
	}else{
		//随机一个位置
		var randx = parseInt(Math.floor(Math.random()*4));
		var randy = parseInt(Math.floor(Math.random()*4));
		//判断这个位置上是否可用
		while(true){
			if(board[randx][randy] == 0){
				break;
			}else{
				randx = parseInt(Math.floor(Math.random()*4));
				randy = parseInt(Math.floor(Math.random()*4));
			}
		}

		//随机一个数字 2或4 50%
		var randNumber = Math.random()<0.5?2:4;
			
		//在随机的位置上显示随机的数字
		board[randx][randy] = randNumber;
		showNumberWithAnimation(randx,randy,randNumber);
	
		return true;
	}
}

$(document).keydown(function(event){
	switch(event.keyCode){
		case 37://left
			if(moveLeft()){
				generateOneNumber();
				isgameover();
			}
			break;
		case 38://up
			if(moveUp()){
				generateOneNumber();
				isgameover();
			}
			break;
		case 39://right
			if(moveRight()){
				generateOneNumber();
				isgameover();
			}
			break;
		case 40://down
			if(moveDown()){
				generateOneNumber();
				isgameover();
			}
			break;
		default://default
			break;

	}
});

function isgameover(){
	if(nospace(board) && nomove(board)){
		gameover();
	}
}

function gameover(){
	alert("少年，继续努力啊！");
}

function moveLeft(){
	if(!canMoveLeft(board)){
		return false;
	}else{
		//move left
	for( var i=0 ; i<4 ; i++ ){
		for( var j=1 ; j<4 ; j++ ){
			if(board[i][j] != 0){
				for( var k=0 ; k<j ; k++){
					if(board[i][k] == 0 && noBlock(i,k,j,board)){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if(board[i][k] == board[i][j] && noBlock(i,k,j,board) && !hasConflicted[i][k]){
						//move
						showMoveAnimation(i,j,i,k);
						//add
						board[i][k] += board[i][k];
						board[i][j] = 0; 
						//add score
						score += board[i][k];
						updateScore(score);
						continue;
					}
				}
			}
		}
	}
		setTimeout("updateBoardView()",200);
		return true;
	}
}

function moveRight(){
	if(!canMoveRight(board)){
		return false;
	}else{
		//move right
	for( var i=0 ; i<4 ; i++ ){
		for( var j=2 ; j>=0 ; j-- ){
			if(board[i][j] != 0){
				for( var k=3 ; k>j ; k--){
					if(board[i][k] == 0 && noBlock(i,j,k,board)){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if(board[i][k] == board[i][j] && noBlock(i,j,k,board) && !hasConflicted[i][k]){
						//move
						showMoveAnimation(i,j,i,k);
						//add
						board[i][k] *= 2;
						board[i][j] = 0; 
						//add score
						score += board[i][k];
						updateScore(score);
						continue;
					}
				}
			}
		}
	}
		setTimeout("updateBoardView()",200);
		return true;
	}
}



function moveUp(){
	if(!canMoveUp(board)){
		return false;
	}else{
		//move up
		for( var j=0 ; j<4 ; j++){
			for( var i=1 ; i<4 ; i++){
				if(board[i][j] != 0){
					for( var k=0 ; k<i ; k++){
						if(board[k][j] == 0 && noBlockV(j,k,i,board)){
							showMoveAnimation(i,j,k,j);
							board[k][j] = board[i][j];
							board[i][j] = 0;
							continue;
						}
						else if(board[k][j] == board[i][j] && noBlockV(j,k,i,board) && !hasConflicted[k][j]){
							showMoveAnimation(i,j,k,j);
							board[k][j] *= 2;
							board[i][j] = 0;
							//add score
							score += board[k][j];
							updateScore(score);
							continue;
						}
					}
				}
			}
		}
		setTimeout("updateBoardView()",200);
		return true;
	}
}

function moveDown(){
	if(!canMoveDown(board)){
		return false;
	}else{
		//move down
		for( var j=0 ; j<4 ; j++){
			for( var i=2 ; i>=0 ; i--){
				if(board[i][j] != 0){
					for( var k=3 ; k>i ; k--){
						if(board[k][j] == 0 && noBlockV(j,i,k,board)){
							showMoveAnimation(i,j,k,j);
							board[k][j] = board[i][j];
							board[i][j] = 0;
							continue;
						}
						else if(board[k][j] == board[i][j] && noBlockV(j,i,k,board) && !hasConflicted[k][j]){
							showMoveAnimation(i,j,k,j);
							board[k][j] *= 2;
							board[i][j] = 0;
							//add score
							score += board[k][j];
							updateScore(score);
							continue;
						}
					}
				}
			}
		}
		setTimeout("updateBoardView()",200);
		return true;
	}
}

