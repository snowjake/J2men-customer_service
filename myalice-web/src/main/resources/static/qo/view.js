$(function(){
	var q = new Qo();
	q.init( );
	
	
})

var Qo = function(){}

Qo.prototype = {
	loadRecord: function(){
		var id = $.getParam("id");
		$.mypost("/qo/queryOrder" , {id:id} , function(json){
			/*显示工单信息*/
			var html= "<h4 class=\"media-heading\" >" + json.user.username + "：" + json.questionOrder.questionContent
			+ "</h4>" + json.questionOrder.createTime; 
			$("#qo_content").html( html ); 
			
			/*显示工单进度*/
			var state = json.questionOrder.state ; 
			if(state == 3){
				$("#reply_are").hide();
			}
			var isHave = false ;
			var lis = $("#flow").find("*[key]"); 
			for(var x=0;x<lis.length;x++){
				var li = lis[x];
				var key = $(li).attr("key");
				$(li).addClass("active");
				if(key == state){
					isHave=true;
					break;
				} 
			}
			if(!isHave){$(lis).removeClass("active");}
			
			/*显示工单咨询记录*/
			var qo_record_html = $("#qo_record").html()
			var records = json.records; 
			var recordHtml = "" ;
			for(var x=0;x<records.length;x++){
				var newHtml = qo_record_html;
				var usertype = records[x].usertype; 
				if(usertype==1){
					newHtml = newHtml.replace("\{commitUser\}","<span>系统管理员&nbsp;&nbsp;</span>"+records[x].commitUser);
				}else{
					newHtml = newHtml.replace("\{commitUser\}",records[x].commitUser);
				}
				newHtml = newHtml.replace("\{content\}",records[x].content);
				newHtml = newHtml.replace("\{createTime\}",records[x].createTime);
				recordHtml+=newHtml;
			}
			$("#qo_data").html( recordHtml );
			
			
			/* 显示附件*/
			var attachments = json.attachments; 
			var attachmentHtml = "" ;
			for(var x=0;x<attachments.length;x++){
				attachmentHtml+="<a href='/pub/showImg?imgPath="+attachments[x].url+"' target='_blank'><img style='width:50px;height:50px;' src='/pub/showImg?imgPath="+attachments[x].url+"'/></a>" ; 
			}  
			$("#qo_order").html( attachmentHtml ); 
		},"json")  
	},init:function(){
		var _this = this ;
		$.mypost("/pub/orderType" , {type:"orderState"} , function(json){
			var html="";
			for(key in json){
				html += "<li key='" + key + "'><a>" + json[key] + "</a></li>" ;
			}
			$("#flow").html(html); 
			_this.loadRecord();
		},"json"); 
		
		$("#btnSubmitContent").click(_this.postSubmit);
		$("#closeOrder").click(_this.closeOrder); 
	},
	postSubmit:function(){
		var content = $("#content").val();
		var id = $.getParam("id");
		var postThis = this;
		$.mypost("/qo/addRecord" , {questionOrderId:id ,content:content} , function(json){
			if(!json.suc){
				bootbox.alert( json.msg ) ;
				return ;
			}
			window.location=window.location;
		},"json")
	},closeOrder:function(){
		var itemThis = this ;  
		var id = $.getParam("id"); 
		$.mypost("/qo/changeState" , {"state":3,id:id} , function(json){
			if(json.suc){
				window.location=window.location;
			}else{
				bootbox.alert( json.msg );
			}
		} , "json");
	},
	reloadPage : function(){
		window.location=window.location;
	}
}