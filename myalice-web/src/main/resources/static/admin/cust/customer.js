var loadDataUrl = "/admin/listdata";
$(function(){
	var page = $.getWellParam("page");
	var pageNum=1;
	if(page!=""){
		pageNum=page; 
	}
	loadData(loadDataUrl,{pageNum:pageNum})
})

function loadData(url,param){
	$.mypost(url, param , function(data){
		showData($("#cstData"),data.list) ; 
		$('#pageToolbar').html(""); 
		$('#pageToolbar').Paging({current:data.pageNum,pagesize:data.pageSize,count:data.total,callback:function(page,size,count){
			console.log( '当前第 ' +page +'页,每页 '+size+'条,总页数：'+count+'页' ) ;
			loadData(loadDataUrl , {pageNum:page});   
		}});
	} , "json")
}

function btnSearch(page){
	var username = $("#username").val();
	var email = $("#email").val();
	loadData(loadDataUrl,{pageNum:page,username:username,email:email})
}

function enableUser(enable){
	var usernames = $(".checkbox_username");	
	var param = usernames.serialize();  
	$.mypost("/admin/user/enable?enable="+enable , param , function(data){
		btnSearch($('.ui-paging-container').find(".focus").attr("data-page"));
		bootbox.alert(data.msg); 
	},"json")
}
function authorize(username){
	authorizeUser(username,1); 
}

function cancel(username){
	authorizeUser(username,0); 
}
/*设置管理*/
function authorizeUser(username,userType){
	$.mypost("/admin/user/authorize" , {username:username , userType:userType} , function( json ){
		if(json.suc){
			btnSearch($.getWellParam("page"));
		}
		bootbox.alert(json.msg);
	} , "json" )
}
