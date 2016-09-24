function ajax(url,funseccse,funfalid){
	//1.创建一个ajax对象
	var oAjax = null;

	if(window.XMLHttpRequest){
		oAjax = new XMLHttpRequest();
	}else{
		oAjax = new ActiveXObject('Microsoft.XMLHTTP');
	}
	//2.连接服务器
	oAjax.open('GET',url,true);
	//3.发送请求
	oAjax.send();
	//4.接受服务器返回的响应
	oAjax.onreadystatechange = function(){
		if (oAjax.readyState == 4){
			if (oAjax.status == 200){
				funseccse(oAjax.responseText);
			}else{
				if(funfalid){
					funfalid();
				}
			}
		}
	};

}