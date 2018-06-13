$(function(){
	$.mypost("/pub/orderType" , {} , function(text){
		$("#questionType").attr("fun" , text );
		btnSearch($.getWellParam("page")) ; 
	},"text")
})

function btnSearch(page){
	var question = new Question();
	question.initData(page); 
}

var Question = function(){}

Question.prototype = {
	initData:function(pageId){
		pageId = "" == pageId ? 1 : pageId ;
		var _this = this ;
		var title = $("#title").val();
		var id = $("#id").val();
		$.mypost("/admin/question/list" , {title : title , id:id , pageId:pageId,ztime:new Date().getTime() } , function( json ){
			_this.loadPageBtn( json ); 
			showData($("#questionTable"),json.docs) ; 
		} , "json") 
	},
	loadPageBtn:function(data){
		var _this = this ;
		$('#pageToolbar').html(""); 
		/*分页按钮,初始化*/
		$('#pageToolbar').Paging({current : data.pageId , pagesize:data.size ,count:data.docCount ,callback:function(page,size,count){
			console.log( '当前第 ' +page +'页,每页 '+size+'条,总页数：'+count+'页' ) ; 
			_this.initData( page ); 
		}});
	}
}


function update(id){
	window.location="/admin/question/addData.html?id=" + id ; 
}


function deleteFun(id){
	
	bootbox.confirm("是否确认删除该问题！" , function(result){
		if(result){
			$.mypost("/admin/question/delete" , { id:id } , function( json ){
				bootbox.alert(json.msg); 
				window.setTimeout(function(){
					var pageid = $(".focus").attr("data-page");
					if(pageid != null){
						btnSearch(pageid);
					}else{
						btnSearch(1);
					}
				},1000)
			} , "json")
		}
	})
	
}