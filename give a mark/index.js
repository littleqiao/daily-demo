window.onload = function(){
	var odiv = document.getElementById("score");
	var oli = odiv.getElementsByTagName("li");
	var len = oli.length;
	var i = 0;

	for(i=0 ; i<len ; i++){
		oli[i].index = i;
		oli[i].onmouseover = function(){
			for(i=0 ; i<len ;i++){
				if(i <= this.index){
					oli[i].style.background = "url(star1.png) no-repeat ";
				}else{
					oli[i].style.background = "url(star.gif) no-repeat ";
				}
			}
		}


		oli[i].onmousedown=function(){
			alert('提交成功:'+(this.index+1)+'分');
		}
	}

}