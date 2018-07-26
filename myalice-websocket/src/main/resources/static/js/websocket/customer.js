var socket = null;
var supporterSessionId = null;

var connOptions = {
		sessionId : getUUID
}

var selfAppend1 = "<div class='customer_lists clearfix'><div class='my-name'>我 ";
var selfAppend2 = "</div><table class='msg' cellspacing='0' cellpadding='0'><tbody><tr><td class='lt'></td><td class='tt'></td><td class='rt'></td></tr><tr><td class='lm'></td><td class='mm'>";
var selfAppend3 = "</td><td class='rm'><span></span></td></tr><tr><td class='lb'></td><td class='bm'></td><td class='rb'></td></tr><tr><td></td><td class='time'></td><td></td></tr></tbody></table></div>";

var otherAppend1 = "<div class='alice_lists clearfix'><div class='alice-name'>Alice ";
var otherAppend2 = "</div><div class='header_img alice1 fl'></div><table class='msg' cellspacing='0' cellpadding='0'><tbody><tr><td class='lt'></td><td class='tt'></td><td class='rt'></td></tr><tr><td class='lm'><span></span></td><td class='mm'><span>";
var otherAppend3 = "</span></td><td class='rm'></td></tr><tr><td class='lb'></td><td class='bm'></td><td class='rb'></td></tr><tr><td></td></tr></tbody></table></div>";

var selfImageAppend1 = "<div class='customer_lists clearfix'><div class='my-name'>我 ";
var selfImageAppend2 = "</div><table class='msg' cellspacing='0' cellpadding='0'><tbody><tr><td class='lt'></td><td class='tt'></td><td class='rt'></td></tr><tr><td class='lm'></td><td class='mm'><img class='message-img' src='";
var selfImageAppend3 = "'></td><td class='rm'><span></span></td></tr><tr><td class='lb'></td><td class='bm'></td><td class='rb'></td></tr><tr><td></td><td class='time'></td><td></td></tr></tbody></table></div>";

var otherImageAppend1 = "<div class='alice_lists clearfix'><div class='alice-name'>Alice ";
var otherImageAppend2 = "</div><div class='header_img alice1 fl'></div><table class='msg' cellspacing='0' cellpadding='0'><tbody><tr><td class='lt'></td><td class='tt'></td><td class='rt'></td></tr><tr><td class='lm'><span></span></td><td class='mm'><span><img class='message-img' src='http://";
var otherImageAppend3 = "'></span></td><td class='rm'></td></tr><tr><td class='lb'></td><td class='bm'></td><td class='rb'></td></tr><tr><td></td></tr></tbody></table></div>";

//var selfImageAppend1 = "<div class='customer_lists clearfix'><div class='my-name'>我 ";
//var selfImageAppend2 = "<div class='dialog'><i class='i_arr'></i><span class='e_tips'></span><span class='err' style='display: none;'></span><table border='0' cellpadding='0' cellspacing='0'><tbody><tr><td class='lt'></td><td class='tt'></td><td class='rt'></td></tr><tr><td class='lm'></td><td class='mm'><div class='cont'><a rel='gallery' class='image-file' href='";
//var selfImageAppend3 = "'><img class='message-img' src='";
//var selfImageAppend4 = "'></a></div></td><td class='rm'></td></tr><tr><td class='lb'></td><td class='bm'></td><td class='rb'></td></tr></tbody></table></div></div></div>";

//var otherImageAppend1 = "<div class='alice_lists clearfix'><div class='alice-name'>Alice ";
//var otherImageAppend2 = "<div class='dialog'><i class='i_arr'></i><span class='e_tips'></span><table border='0' cellpadding='0' cellspacing='0'><tbody><tr><td class='lt'></td><td class='tt'></td><td class='rt'></td></tr><tr><td class='lm'></td><td class='mm'><div class='cont'><div><a rel='gallery' class='image-file' href='";
//var otherImageAppend3 = "'><img class='message-img' src='";
//var otherImageAppend4 = "'></a></div></div></td><td class='rm'></td></tr><tr><td class='lb'></td><td class='bm'></td><td class='rb'></td></tr></tbody></table></div></div></div>";

var userMsgs = {};
var userNames = {};

function connect() {
    socket = new SockJS('/customer', undefined, connOptions);
    socket.onopen = function() {
        console.log('open');
    };
    socket.onmessage = function(e) {
        console.log('message', e.data);
        var content = $.parseJSON(e.data);
        if (content) {
        	if (content.type=="customer_talk") {
        		showOther(content.content.talkContent);
        	} else if (content.type=="customer_image_talk") {
                showOtherImage(content.content.talkContent);
            } else if (content.type=="customer_assign") {
        		supporterSessionId = content.content.sessionId;
        	} else if (content.type=="customer_connect") {
        	    console.log("customer_connect");
        		showHistory(content.history);
        	}
        }
        
    };
    socket.onclose = function() {
    	supporterSessionId = null;
    	console.log('close');
    };
}

function disconnect() {
	socket.close();
}

function sendMessage() {
	socket.send(createMessage());
	showSelf($('#text-in').val());
    $('#text-in').val('');
    document.getElementById("chatcontent").lastElementChild.scrollIntoView();
}

function sendImage(imageInfo) {
    socket.send(createImage(imageInfo));
    showSelfImage(imageInfo);
    $('#text-in').val('');
    document.getElementById("chatcontent").lastElementChild.scrollIntoView();
}

function createMessage() {
	return JSON.stringify({'type':'supporter_talk', 'content':{'talkContent': $('#text-in').val()}})
}

function createImage(imageInfo) {
    return JSON.stringify({'type':'supporter_image_talk', 'content':{'talkContent': imageInfo}})
}

function showHistory(histories) {
	$.each(histories, function (n, value) {
        if (value.type == "0") {
        	showSelf(value.content);
        } else if (value.type == "1") {
        	showOther(value.content);
        } else if (value.type == "2") {
            showSelfImage(value.content);
        } else if (value.type == "3") {
            showOtherImage(value.content);
        }
    });
    document.getElementById("chatcontent").lastElementChild.scrollIntoView();
}

function showOther(message) {
    var appendContent = otherAppend1 + currentTime() + otherAppend2 + message + otherAppend3;
    $("#chatcontent").append(appendContent);
}

function showSelf(message) {
    var appendContent = selfAppend1 + currentTime() + selfAppend2 + message + selfAppend3;
    $("#chatcontent").append(appendContent);
}

function showSelfImage(image) {
    $("#chatcontent").append(selfImageAppend1 + selfImageAppend2 + image + selfImageAppend3);
}

function showOtherImage(image) {
    $("#chatcontent").append(otherImageAppend1 + otherImageAppend2 + image + otherImageAppend3);
}

function e(e) {
    var t = e.getAsFile ? e.getAsFile() : e
    var flag = true;
    if (t != null){
        if (t.size != undefined && t.size > 2097152) {
            alert("图片请小于2M");
            flag = false;
        }
    };
    if (!/image\/\w+/.test(t.type)) {
        alert("文件必须为图片！");
        flag = false;
    };
    var i = new FileReader;
    i.onload = function(e) {
        if (flag == true) {
            sendImage(e.target.result);
        } else {
            $('#text-in')[0].innerHTML='';
        }
    };
    i.readAsDataURL(t);
}

$(function () {
    connect();
    $( "#winsend" ).click(function() { sendMessage(); });

    $("#howToSendImg").on('click', function(e){
        var displayValue = $('#howToSendImgContent').css("display");
        if (displayValue == 'block') {
            $('#howToSendImgContent').css("display", "none");
        } else if (displayValue == "none") {
            $('#howToSendImgContent').css("display", "block");
        }
    });

    document.getElementById("text-in").addEventListener("paste", function(t) {
        var i, n, r, a = t || window.event, o = a.clipboardData, s = 0;
        if (o) {
            if (i = o.items,
                    r = o.files,
                r && r.length){
                return e(r[0]);
            }

            if (!i) {
                return false;
            }

            for (; s < i.length; s++)
                if ("file" === i[s].kind && i[s].type.match(/^image\//i)) {
                    n = i[s];
                    break
                }
            if (n) {
                e(n);
                $('#text-in')[0].innerHTML='';
                return true;
            }
        }
    })
});

