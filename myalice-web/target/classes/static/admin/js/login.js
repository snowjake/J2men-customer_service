$(function(){
	
	if("true" == $.getParam('error')){
		bootbox.alert( "账号或者密码输入错误"); 
	}
	$("#loginbtn").click( function(){
		var token = Cookies.get("XSRF-TOKEN"); 
		$("#myalice_token").val(token) ; 
		$("#loginFrm").submit() ; 
	}); 
})