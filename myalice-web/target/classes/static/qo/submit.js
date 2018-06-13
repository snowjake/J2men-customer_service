var canUpload = ['jpg', 'jpeg', 'bmp', 'png', 'gif']
$( function(){
	/*加载select下拉框数据*/
	loadOrderType();
	/*提交表单数据*/
	$("#btnSubmit").click( function(){
		var formData = new FormData($('#subForm')[0]); 
		var token = Cookies.get("XSRF-TOKEN");
		var questionType = $("#questionType").val();
		if(questionType==""){
			bootbox.alert("请选择问题分类");
			return;
		}
		var questionContent = $("#questionContent").val();
		if(questionContent==""){
			bootbox.alert("请输入问题描述");
			return;
		}
		
		var attachments = $(".attachments");
		for(var x=0;x<attachments.length;x++){
			var fileName = $(attachments[x]).val();
			if(fileName!=""){
				var index1 = fileName.lastIndexOf(".")  + 1 ;  
				var ext = fileName.substring( index1 );
				var flag =false ;    
				for(var i=0;i<canUpload.length;i++){
					var item=canUpload[i];
					if(item==ext){
						flag=true;
						break;
					}
				}
				if(!flag){
					bootbox.alert("不允许上传该格式的文件，支持文件格式：" + canUpload);
					return ;
				}
			}
		}
		
		$.ajax({
			"url":"/qo/upload" ,
			enctype: 'multipart/form-data',
			type: 'POST',
			headers:{ 
		    	"X-XSRF-TOKEN":token 
		    },
		    data: formData ,
		    cache: false ,
		    dataType:"json" ,
	        contentType: false ,
	        processData: false ,
	        xhr: function() { 
	            myXhr = $.ajaxSettings.xhr();
	            if(myXhr.upload){
	                myXhr.upload.addEventListener('progress',function(e){
	                	if(e.lengthComputable){
	                		//$('progress').attr({value:e.loaded,max:e.total});
	                		console.log( "loaded:" + e.loaded + ", total:" + e.total ) ; 
	                	}
	                }, false);
	            }
	            return myXhr;
	        },
	        success:function(responseText){
	        	if(!responseText.suc){
	        		bootbox.alert(responseText.msg); 
	        	}else{
	        		bootbox.alert(responseText.msg);
	        		window.location = '/qo/list.html' ; 
	        	}
	        },
	        error:function(e){
	        	bootbox.alert( "上传文件失败" );
	        }
		})
	});
} )


function loadOrderType(){
	$.mypost("/pub/orderType" , {type:"orderType"} , function(json){
		var html="<option value=''>请选择</option>"
		for(var i in json){
			html+="<option value='"+i+"'>"+json[i]+"</option>";
		}
		$("#questionType").html(html); 
	},"json")
}