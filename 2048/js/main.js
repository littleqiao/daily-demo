var board = new Array();
var score = 0;
//记录每一个格子是否发生碰撞
var hasConflicted = new Array();

//记录滑动开始和结束的坐标
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function(){
	prepareForMobile();
	newgame();
});

function prepareForMobile(){
	if(documentWidth > 500){
		gridContainerWidth = 500;
		cellSpace = 20;
		cellSideLength = 100;
	}else{
		$("#grid-container").css('width',gridContainerWidth - 2 * cellSpace);
		$("#grid-container").css('height',gridContainerWidth - 2 * cellSpace);
		$("#grid-container").css('padding',cellSpace);
		$("#grid-container").css('border-radius',0.02 * gridContainerWidth);

		$(".grid-cell").css('width',cellSideLength);
		$(".grid-cell").css('height',cellSideLength);
		$(".grid-cell").css('border-radius',0.02 * cellSideLength);
	}

}

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
				theNumberCell.css('top',getPosTop(i,j)+cellSideLength * 0.5);
				theNumberCell.css('left',getPosLeft(i,j)+cellSideLength * 0.5);
			}else{
				theNumberCell.css('width',cellSideLength);
				theNumberCell.css('height',cellSideLength);
				theNumberCell.css('top',getPosTop(i,j));
				theNumberCell.css('left',getPosLeft(i,j));
				theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color',getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
			}

			hasConflicted[i][j] = false; 
		}
	}
	$(".number-cell").css("line-height",cellSideLength+"px");
	$(".number-cell").css("font-size",0.6 * cellSideLength+"px");
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

//获取触摸起始坐标，并加以相应逻辑,来实现移动端的操作
document.addEventListener('touchstart',function(event){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
});

document.addEventListener('touchend',function(event){
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;

	var vectorx = endx - startx;
	var vectory = endy - starty;

	if(Math.abs(vectorx) > Math.abs(vectory)){
		//在x轴上的滑动
		if(vectorx > 0){
			//move right
			if(moveRight()){
				generateOneNumber();
				isgameover();
			}
		}else{
			//move left
			if(moveLeft()){
				generateOneNumber();
				isgameover();
			}
		}
	}else{
		//在y轴上的滑动
		if(vectory > 0){
			//move down
			if(moveDown()){
				generateOneNumber();
				isgameover();
			}
		}else{
			//move up
			if(moveUp()){
				generateOneNumber();
				isgameover();
			}
		}
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

