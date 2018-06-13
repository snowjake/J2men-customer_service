var sock = new SockJS("/endpointChat");
var stomp = Stomp.over(sock); 



function sendSpittle(text) {
    stomp.send("/chat", {}, JSON.stringify({ 'name': text }));//3
}

$(function(){
	$("#sendMessage").click(function(){
		var message = $.trim($("#message").val());  
		if("" == message){
			bootbox.alert("回复内容不能为空"); 
			return ; 
		}
		sendSpittle(message);
		$("#message").val("");	
	});
	
	$.mypost("/pub/loadUserinfo" , {} , function(data){
		stomp.connect(data.username, data.username, function(frame){
		    stomp.subscribe("/user/queue/notifications", handleNotification);
		});
	},"json")
})

function handleNotification(message){
	var body = message.body ; 
	var json = eval("("  + body + ")") ;
	appendContent(json.clazz, json.date , json.anwser , json.name); 
} 

function appendContent(clazz , date , anwser , name){
	var oddItemHtml = $("#odd_item").html();
	oddItemHtml = oddItemHtml.replace("\{class\}" , clazz);
	oddItemHtml = oddItemHtml.replace("\{date\}" , date);
	oddItemHtml = oddItemHtml.replace("\{content\}" , anwser);
	oddItemHtml = oddItemHtml.replace("\{name\}" , name); 
	$("#online_content").append(oddItemHtml);
	$("#nurse").scrollTop( $("#nurse")[0].scrollHeight ) ; 
}