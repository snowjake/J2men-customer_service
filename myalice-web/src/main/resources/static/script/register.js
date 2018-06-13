

var Register = function(){}

Register.prototype = {
	init:function(){
		$("#loginbtn").click(function(){
			var username = $.trim($("#username").val());
			var email = $.trim($("#email").val());
			var password = $.trim($("#password").val());
			var password1 = $.trim($("#password1").val());
			var code = $.trim($("#code").val());
			if(username == ""){
				bootbox.alert( "用户名不能为空" ) ;
				return ; 
			}
			if(email == ""){
				bootbox.alert( "邮箱不能为空" ) ;
				return ; 
			}
			
			if(password == ""){
				bootbox.alert( "密码不能为空" ) ;
				return ; 
			}
			
			if(password != password1){
				bootbox.alert( "两次密码输入不一致" ) ;
				return ; 
			} 
			if(code == ""){
				bootbox.alert( "验证码不能为空" ) ; 
				return ; 
			}
			$.mypost("/pub/user/insert" , {username:username,email:email,password:password,password1:password1 ,code:code}
			, function(json){
				if(json.suc){
					window.location="/admin/login.html";
					return ; 
				}
				bootbox.alert( json.msg ) ;
			},"json")
		});
	}
}

$( function(){
	var register = new Register();
	register.init() ; 
})