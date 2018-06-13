var socket = null;
var customerSelected = null;
var lastCustomerSelected = null;

var userAppend10 = "<li id='";
var userAppend11 = "pre'></li><li id='";
var userAppend2 = "' class='no-msg current' onclick='selectCustomer(this);'><a href='javascript:;'><span class='icon icon_0'><em class='em em_0'></em></span><div class='category'><div class='user_name'>";
var userAppend30 = "</div><div class='user_close' onclick='removeUser(\"";
var userAppend31 = "\")'>&times;</div></div></a></li>";

var msgServiceAppend1 = "<div class='chat-txt' data-rel='history'><div class='chat-area customer'><p class='name'>";
var msgServiceAppend2 = "</p><div class='dialog'><table border='0' cellpadding='0' cellspacing='0'><tbody><tr><td class='lt'></td><td class='tt'></td><td class='rt'></td></tr><tr><td class='lm'></td><td class='mm'><div class='cont'><div>";
var msgServiceAppend3 = "</div></div></td><td class='rm'></td></tr><tr><td class='lb'></td><td class='bm'></td><td class='rb'></td></tr></tbody></table></div></div></div>";

var msgCustomerAppend1 = "<div class='chat-txt' data-rel='history'><div class='chat-area service'><p class='name'>";
var msgCustomerAppend2 = "</p><div class='dialog'><table border='0' cellpadding='0' cellspacing='0'><tbody><tr><td class='lt'></td><td class='tt'></td><td class='rt'></td></tr><tr><td class='lm'></td><td class='mm'><div class='cont'><div>";
var msgCustomerAppend3 = "</div></div></td><td class='rm'></td></tr><tr><td class='lb'></td><td class='bm'></td><td class='rb'></td></tr></tbody></table></div></div></div>";

var selfImageAppend1 = "<div class='chat-txt'><div class='chat-area customer'><p class='name'>"
var selfImageAppend2 = "</p><div class='dialog'><i class='i_arr'></i><span class='e_tips'></span><span class='err' style='display: none;'></span><table border='0' cellpadding='0' cellspacing='0'><tbody><tr><td class='lt'></td><td class='tt'></td><td class='rt'></td></tr><tr><td class='lm'></td><td class='mm'><div class='cont'><a rel='gallery' class='image-file' href='";
var selfImageAppend3 = "'><img class='message-img' src='";
var selfImageAppend4 = "'></a></div></td><td class='rm'></td></tr><tr><td class='lb'></td><td class='bm'></td><td class='rb'></td></tr></tbody></table></div></div></div>";

var otherImageAppend1 = "<div class='chat-txt' data-rel='history'><div class='chat-area service'><p class='name'>";
var otherImageAppend2 = "</p><div class='dialog'><i class='i_arr'></i><span class='e_tips'></span><table border='0' cellpadding='0' cellspacing='0'><tbody><tr><td class='lt'></td><td class='tt'></td><td class='rt'></td></tr><tr><td class='lm'></td><td class='mm'><div class='cont'><div><a rel='gallery' class='image-file' href='";
var otherImageAppend3 = "'><img class='message-img' src='";
var otherImageAppend4 = "'></a></div></div></td><td class='rm'></td></tr><tr><td class='lb'></td><td class='bm'></td><td class='rb'></td></tr></tbody></table></div></div></div>";

var faqAppend1 = "<li><p class='bg-1'><strong>问题：</strong><span class='s-3'><a target='_blank' href='";
	faqAppend2 = "'>";
	faqAppend3 = "</a></span></p></li>";

var userMsgs = {};
var userNames = {};

var connOptions = {
		sessionId : getUUID
}

function selectCustomerById(customerId) {
    customerSelected = customerId;
    showHistory(customerId, userMsgs[customerId]);
}

function selectCustomer(customerItem) {
    var customerId = customerItem.id;
    if (customerItem.style != undefined) {
        customerItem.style.setProperty("background", "#435f7b");
    }
    if (lastCustomerSelected != null && lastCustomerSelected.id != customerId && lastCustomerSelected.style != undefined) {
        lastCustomerSelected.style.setProperty("background", "#707D8A");
    }
    lastCustomerSelected = customerItem;
    selectCustomerById(customerId);
}

function addCustomer(id, userName, logo) {
    userMsgs[id] = new Array();
    userNames[id] = userName;
    $(".u-lst").append(userAppend10 + id + userAppend11 + id + userAppend2 + userName + userAppend30 + id + userAppend31);
}

function clearTalkDialog() {
    $.each($(".im-chat-list div.chat-txt"), function (n, value) {
        value.remove();
    });
}

function removeUser(id) {
    $("#"+ id).remove();
    $("#"+ id +"pre").remove();
    clearTalkDialog();
}

function connect() {
    socket = new SockJS('/supporter', undefined, connOptions);
    socket.onopen = function() {
        console.log('open');
    };
    socket.onmessage = function(e) {
        var content = $.parseJSON(e.data);
        if (content) {
        	if (content.type=="supporter_assign") {
        	    console.log("supporter_assign");
                addCustomer(content.content.sessionId, content.content.userName, content.content.userLogo);
                addHistory(content.content.sessionId, content.history);
                selectCustomerById(content.content.sessionId);
                if (lastCustomerSelected == null) {
                    $(".u-lst li")[1].style.setProperty("background", "#435f7b");
                    lastCustomerSelected = $(".u-lst li")[1];
                }
        	} if (content.type=="supporter_talk") {
                console.log("supporter_talk");
        	    addOther(content.content.sessionId, content.content.talkContent);
        		showOther(content.content.sessionId, content.content.talkContent);
        	} if (content.type == "supporter_image_talk") {
                console.log("supporter_image_talk");
                addOtherImage(content.content.sessionId, content.content.talkContent);
                showOtherImage(content.content.sessionId, content.content.talkContent)
            } if (content.type=="customer_of_supporter_close") {
                console.log("customer_of_supporter_close");
                removeUser(content.content.sessionId);
                $.each($(".u-lst li"), function (n, value) {
                    value.remove();
                });
        	}
        }
    };
    socket.onclose = function() {
    	console.log('close');
    };
}

function sendMsg() {
    var sendValue = $('#text_in')[0].innerHTML;
	var message = createMessage(sendValue);
	socket.send(message);
	addSelf(customerSelected, sendValue);
	showSelf(customerSelected, sendValue);
    $('#text_in')[0].innerHTML='';
    document.getElementById("scrollDiv").lastElementChild.scrollIntoView();
}

function sendImage(imageInfo) {
    var sendValue = imageInfo;
    var message = createImageMessage(sendValue);
    console.log("send image");
    console.log(message);
    socket.send(message);
    showSelfImage(customerSelected, sendValue);
    $('#text_in')[0].innerHTML='';
    document.getElementById("scrollDiv").lastElementChild.scrollIntoView();
}

function createMessage(sendValue) {
	return JSON.stringify({'type':'customer_talk', 'content':{'sessionId':customerSelected, 'talkContent': sendValue}})
}

function createImageMessage(sendValue) {
    return JSON.stringify({'type':'customer_image_talk', 'content':{'sessionId':customerSelected, 'talkContent': sendValue}})
}

function addHistory(key, histories) {
    $.each(histories, function (n, value) {
        if (value.type == "0") {
            addOther(key, value.content);
        } else if (value.type == "1") {
            addSelf(key, value.content);
        } else if (value.type == "2") {
            addOtherImage(key, value.content);
        } else if (value.type == "3") {
            addSelfImage(key, value.content);
        }
    });
}

function addOther(key, message) {
    userMsgs[key].push({type:'0', content:message});
}

function addSelf(key, message) {
    userMsgs[key].push({type:'1', content:message});
}

function addOtherImage(key, message) {
    userMsgs[key].push({type:'2', content:message});
}

function addSelfImage(key, message) {
    userMsgs[key].push({type:'3', content:message});
}

function showHistory(key, histories) {
    $.each(histories, function (n, value) {
        if (value.type == "0") {
            showOther(key, value.content);
        } else if (value.type == "1") {
            showSelf(key, value.content);
        } else  if (value.type == "2") {
            showOtherImage(key, value.content);
        } else if (value.type == "3") {
            showSelfImage(key, value.content);
        }
    });
    document.getElementById("scrollDiv").lastElementChild.scrollIntoView();
}

function showOther(key, message) {
    if (key == customerSelected) {
        $(".im-chat-list").append(msgCustomerAppend1 + userNames[key] + msgCustomerAppend2 + message + msgCustomerAppend3);
    }
}

function showSelf(key, message) {
    if (key == customerSelected) {
        $(".im-chat-list").append(msgServiceAppend1 + "alice" + msgServiceAppend2 + message + msgServiceAppend3);
    }
}

function showSelfImage(key, image) {
    if (key == customerSelected) {
        $(".im-chat-list").append(selfImageAppend1 + userNames[key] + selfImageAppend2 + image + selfImageAppend3 + image + selfImageAppend4);
    }
}

function showOtherImage(key, image) {
    if (key == customerSelected) {
        $(".im-chat-list").append(otherImageAppend1 + userNames[key] + otherImageAppend2 + image + otherImageAppend3 + image + otherImageAppend4);
    }
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
            $('#text_in')[0].innerHTML='';
        }
    };
    i.readAsDataURL(t);
}

function addFAQItem(data) {
	$("#faq").append(faqAppend1 + data.url + faqAppend2 + data.summary + faqAppend3);
}

document.addEventListener("dragenter", function (win) {
    win.stopPropagation();
    win.preventDefault();
}, false);
document.addEventListener("dragleave", function (win) {
    win.stopPropagation();
    win.preventDefault();
}, false);

document.addEventListener("dragover", function (win) {
    win.stopPropagation();
    win.preventDefault();
}, false);
document.addEventListener("drop", function (win) {
    win.stopPropagation();
    win.preventDefault();

    e(win.dataTransfer.files[0]);

}, false);

$(function () {
    connect();
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $("#howToSendImg").on('click', function(e){
        var displayValue = $('#howToSendImgContent').css("display");
        if (displayValue == 'block') {
            $('#howToSendImgContent').css("display", "none");
        } else if (displayValue == "none") {
            $('#howToSendImgContent').css("display", "block");
        }
    });
    $( "#sendMsg" ).click(function() { sendMsg(); });
    document.getElementById("text_in").addEventListener("paste", function(t) {
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
                $('#text_in')[0].innerHTML='';
                return true;
            }
        }
    });
    console.log("get begin")
    $.get("/websocket/faq/list",function(data,status){
    	console.log(data.length)
    	for (i = 0; i< data.length; i++) {
    		addFAQItem(data[i]);
    	}
      });
    console.log("get end")
});

