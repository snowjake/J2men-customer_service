var isSubmit = false ;
$( function(){
	loadOrderType(); 
	
	$("#btnSubmit").click(function(){
		if(isSubmit){return;}
		var questionType = $("#questionType").val();
		var question = $("#question").val();
		var answer = $("#subForm").find(".anwser").val();
		var answers = $("#subForm").find(".anwser") ;
		var answerText = new Array();
		for(var x=0;x<answers.length;x++){
			answerText.push( $(answers[x]).val() );  
		}
		//alert( answerText );
		var id = $("#id").val();
		if("" ==  questionType){
			bootbox.alert("请选择问题类型");
			return ;
		}
		if("" == question){
			bootbox.alert("请输入问题"); 
			return ;
		}
		if("" == answer){
			bootbox.alert("请输入答案"); 
			return ;
		}
		isSubmit = true;
		$.mypost("/admin/question/add" , {questionType:questionType , question:question ,
			anwser:answerText,"id":id } , function(json){
				isSubmit=false ; 
			if(json.suc){
				
				window.setTimeout(function(){
					window.location="/admin/question/listData.html";
				},1000)
				return ;
			}
			bootbox.alert(json.msg); 
		},"json")
	});
	
})

function loadOrderType(){
	$.mypost("/pub/orderType" , {type:"orderType"} , function(json){
		var html="<option value=''>请选择</option>"
		for(var i in json){
			html+="<option value='"+i+"'>"+json[i]+"</option>";
		}
		$("#questionType").html(html); 
		
		initUpdate() ;
	},"json")
}


function initUpdate(){ 
	var id = $.getParam("id") ;  
	
	if(null == id || "" == id){
		return ;
	}
	$.mypost("/admin/question/load" , {id:id} ,function(data){
		$("#questionType").val(data.questionType); 
		$("#question").val(data.title); 
		//$("#answer").val(data.anwser);
		var anwsers = data.anwser ; 
		var html = $("#anwser_html").html();
		var appendHtml = "" ; 
		for(x=0;x<anwsers.length;x++){
			var newhtml=html;
			anwsers[x]['index'] = x+1; 
			for(v in anwsers[x]){
				newhtml = newhtml.replace(new RegExp("\{" + v + "\}","gm") , anwsers[x][v]);
			}  
			appendHtml+=newhtml ; 
		}
		if(appendHtml == ""){
			html=html.replace(new RegExp("\{anwser\}","gm") , "");
			html=html.replace(new RegExp("\{index\}","gm") , "1");
			appendHtml=html; 
		}
		$("#anwserList").html( appendHtml );
		$("#id").val(data.question_id);
	},"json")
}

function addAnwser(){
	var html = $("#anwser_html").html();
	html=html.replace(new RegExp("\{anwser\}","gm") , "");
	html=html.replace(new RegExp("\{index\}","gm") ,  $("#anwserList").find(".anwser").length+1)  ;
	$("#anwserList").append( html );
}

function deleteAnwser(v){
	if($("#anwserList").find(".anwser").length == 1){ 
		bootbox.alert("至少保留一个答案"); 
		return ;
	}
	if(confirm("是否确认删除该答案")){
		var g = $(v).parents(".form-group");
		g.remove(); 
	}
}