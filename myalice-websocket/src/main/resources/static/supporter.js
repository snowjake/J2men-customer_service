var socket = null;

var append1 = "<div class='col-md-12'><table id='conversation' class='table table-striped'><thead><tr><th>Greetings ";
var append2 = "</th></tr></thead><tbody id='";
var	append3 = "'></tbody></table></div>";

var connOptions = {
		sessionId : getUUID
}

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
    	$("#connName").html("This is : " + socket._generateSessionId);
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
        $("#talkContent").html("");
        $("#customerSelect").html("");
        $("#customerSelect").val("");
    }
    $("#greetings").html("");
}

function connect() {
    socket = new SockJS('http://localhost:8080/supporter', undefined, connOptions);
    socket.onopen = function() {
        console.log('open');
        setConnected(true);
    };
    socket.onmessage = function(e) {
        console.log('message', e.data);
        var content = $.parseJSON(e.data);
        if (content) {
        	if (content.type=="supporter_assign") {
        		$("#customerSelect").append("<option id='option_" + content.content.sessionId + "' value='" + content.content.sessionId + "'>" + content.content.sessionId + "</option>");
        		$("#talkContent").append(append1 + content.content.userName + append2 + content.content.sessionId + append3);
        		console.log('history', content.history);
        		showHistory(content.content.sessionId, content.history);
        	} if (content.type=="supporter_talk") {
        		showOther(content.content.sessionId, content.content.talkContent);
        	} if (content.type=="customer_of_supporter_close") {
        		$("#" + content.content.sessionId).parent().parent().remove();
        		$("#option_" + content.content.sessionId).remove();
        	}
        }
    };
    socket.onclose = function() {
    	console.log('close');
    };
}

function disconnect() {
	socket.close();
    setConnected(false);
}

function sendName() {
	var message = createMessage();
	socket.send(createMessage());
	showSelf($('#customerSelect').val(), $('#name').val());
}

function createMessage() {
	return JSON.stringify({'type':'customer_talk', 'content':{'sessionId':$('#customerSelect').val(), 'talkContent': $('#name').val()}})
}

function showHistory(key, histories) {
	$.each(histories, function (n, value) {
        if (value.type == "0") {
        	showOther(key, value.content);
        } else if (value.type == "1") {
        	showSelf(key, value.content);
        }
    });
}

function showOther(key, message) {
    $("#" + key).append("<tr><td><font color='red'>" + message + "</font></td></tr>");
}

function showSelf(key, message) {
	if (key==undefined || key==null || key=='') {
		alert("请先选择客户，再发消息！");
	} else {
		$("#" + key).append("<tr><td><font color='blue'>" + message + "</font></td></tr>");
	}
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
});

