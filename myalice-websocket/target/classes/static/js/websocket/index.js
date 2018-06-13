function e() {
    var e = this;
    e.chats = {},
        e.currentConnection = null,
        e.pin = $("#pin").val(),
        n.ohterPara.pin = $("#pin").val(),
        e.p_appId = $("#customerAppId").val() ? $("#customerAppId").val() : "im.customer",
        e.soa_aid = $("#soa_aid").val(),
        e.relate = null,
        e.count = 0,
        e.isSendChat = !0,
        e.defaultEntry = $("#defaultSellerEntry").val(),
        e.defaultJdEntry = $("#defaultJdEntry").val(),
        e.urlConnection = {},
        e.connectErrCount = 0,
        e.connectErrAll = 0,
        e.registerAppid = "",
        e.pcount = 0,
        e.pollTimer = "",
        e.midArr = [],
        e.appEntryCon = {
            "im.waiter": "web_sessions_sj",
            "jd.waiter": "web_sessions_jd",
            "jr.waiter": "web_sessions_jr",
            "zb.waiter": "web_sesssions_zb"
        },
        e.pollErrorTtl = 5e3,
        e.pollTimeout = 2e4,
        e.showNewInfo = !1
}
var t = require("connection")
    , i = require("api")
    , n = require("utils")
    , r = require("msg")
    , a = require("grade")
    , o = require("common")
    , s = require("upload")
    , d = require("relate")
    , c = require("langs")
    , l = require("dialog")
    , p = require("scrollbar");
n.soaPara._token_ = n.cookie("soa_aid"),
    n.soaPara.appId = $("#customerAppId").val(),
    n.soaPara._pin_ = n.cookie("pin"),
    n.ohterPara.p_appId = $("#customerAppId").val() ? $("#customerAppId").val() : "im.customer",
    n.ohterPara.timeDifference = 0,
    e.prototype.init = function() {
        var e = this;
        "360.customer" == n.soaPara.appId && (e._specialDeal(),
            c.errorPic = c.error360Pic),
            e._getUserInfo(),
            e._getConnections(),
            e._getUnread(),
            e._toolInit(),
            e._evt(),
            e._btnBindEvtSend(),
            e._sendSet(),
            e._sendPaste(),
            e._chatAuto(),
            e._visibilityChange(),
            window.setInterval(function() {
                e._GetOfflineMsg()
            }, 15e3),
            e._searchLeft()
    }
    ,
    e.prototype.register = function() {
        var e = this
            , t = (e._getUrlParms(),
        {});
        t.t = (new Date).getTime();
        var r = $("#entry").val();
        t.entry = r,
            n.ajax(i.register, t, "get", "text", function(t) {
                if (t) {
                    var t = n.string2json(t);
                    n.basePara._wid_ = t.window,
                        n.soaPara._wid_ = t.window,
                        e.registerAppid = t.appId,
                        e.appEntryCon = "undefined" != typeof t.appEntryConfig ? t.appEntryConfig : e.appEntryCon,
                        e.pollErrorTtl = "undefined" != typeof t.pollErrorTtl ? t.pollErrorTtl : e.pollErrorTtl,
                        e.pollTimeout = "undefined" != typeof t.pollTimeout ? t.pollTimeout : e.pollTimeout,
                        e.from360Mall = t.from360Mall || !1;
                    var i = "undefined" != typeof t.time ? t.time : 0;
                    n.ohterPara.timeDifference = i - (new Date).getTime(),
                        e.init()
                }
            })
    }
    ,
    e.prototype._initScrollBar = function() {
        var e = $(".scrollBar");
        e.each(function(e, t) {
            new p({
                nodes: t
            })
        })
    }
    ,
    e.prototype._getUserInfo = function() {
        var e = this
            , t = $(".user-info")
            , r = {
            pin: e.pin
        }
            , o = {
            dataType: "user",
            action: "byPin",
            param: n.json2string(r)
        };
        n.ajax(i.userInfo, o, "get", "json", function(i) {
            if (i) {
                var r = i
                    , o = r.avatar;
                if (o && (o = o.replace(/^http(s)?\:/, ""),
                        t.find(".u-pic img").attr("src", o)),
                        t.find(".u-name a").html(r.nickname),
                        t.find(".u-level .rank").addClass("r" + a.getLevel(r.level)),
                        t.find(".u-level .rank s").parent("a").attr("title", a.getGrade(r.level)),
                    "jr.waiter" == e.registerAppid)
                    t.find(".u-level .rank").addClass("jr"),
                        e._getJrVip();
                else {
                    var s = i.plus || 0
                        , d = '<a href="//plus.jd.com/index" target="_blank"><i class="i' + s + '"></i></a>';
                    t.find(".u-level .rank").append($(d))
                }
                var c = n.cookie("web_gift_" + e.pin);
                1 != c && e._getVipGift()
            }
        })
    }
    ,
    e.prototype._getJrVip = function() {
        var e = this
            , t = $(".user-info")
            , r = {
            pin: e.pin,
            platform: "PC"
        }
            , a = {
            dataType: "user",
            action: "getJrInfo",
            param: n.json2string(r)
        };
        n.ajax(i.userInfo, a, "get", "json", function(e) {
            if (e) {
                var i = e.jrVip || 0;
                if (2 == i) {
                    var n = '<a href="//sale.jd.com/act/VveJizHbQh72jCr.html" target="_blank"><i class="i' + i + '"></i></a>';
                    t.find(".u-level .rank").append($(n))
                }
            }
        })
    }
    ,
    e.prototype._getVipGift = function() {
        var e = this
            , t = {
            pin: e.pin,
            type: 0
        }
            , r = {
            dataType: "user",
            action: "getGiftInfo",
            param: n.json2string(t)
        };
        n.ajax(i.userInfo, r, "get", "json", function(t) {
            if (t && t.giftNum > 0) {
                var i = t.giftAdd || "//vip.jd.com/"
                    , r = $('<div class="im-pop-gift" id="im-pop-gift"><div class="sub"><div class="close"><a clstag="pageclick|keycount|w_web_201701061|14" href="javascript:;"></a></div><p><a clstag="pageclick|keycount|w_web_201701061|13" href="' + i + '" target="_blank">礼包</a></p></div></div>');
                $("#im-pop-gift").length < 0 ? a.show() : r.appendTo(".im-edit-area");
                var a = $("#im-pop-gift");
                a.find(".close").off().on("click", function() {
                    a.hide(),
                        n.setCookie(encodeURIComponent("web_gift_" + e.pin), 1, "d7")
                })
            }
        })
    }
    ,
    e.prototype._getUrlParms = function() {
        for (var e = {}, t = decodeURIComponent(window.location.search.substring(1)), i = t.split("&"), n = !1, r = 0; r < i.length; r++) {
            var a = i[r].indexOf("=");
            if (a != -1) {
                var o = i[r].substring(0, a)
                    , s = i[r].substring(a + 1);
                "sku" == o && (n = !0),
                    e[o] = unescape(s)
            }
        }
        var d = $("#groupId").val()
            , c = $("#entry").val();
        return "undefined" != typeof d && d && (e.groupId = d),
        "undefined" != typeof c && c && (e.entry = c),
        n && (e.pid = e.sku,
            n = !1),
            e
    }
    ,
    e.prototype._getVenderInfo = function() {
        var e = this
            , t = e.urlConnection;
        e.urlConnection.info = "undefined" != typeof e.urlConnection.info ? e.urlConnection.info : {},
        "undefined" != typeof e.urlConnection.groupId && e.urlConnection.groupId && (e.urlConnection.info.groupId = e.urlConnection.groupId);
        var r = function(t) {
            var i, r;
            "undefined" != typeof e.urlConnection.venderId && 0 != e.urlConnection.venderId ? (i = e.urlConnection.venderId,
                r = 1 != i ? "undefined" != typeof t.venderName ? t.venderName : c.venderName : "jr.waiter" == t.appId ? c.jrVenderName : "360.customer" == n.soaPara.appId ? c.mall360VenderName : "undefined" != typeof t.venderName ? t.venderName : c.jdVenderName) : r = c.jdVenderName,
                e.urlConnection.venderName = r,
                e.urlConnection.info.venderName = r
        }
            , a = function(t) {
            var i = "";
            switch (type = t.type || "",
                type) {
                case 1:
                case 3:
                case 7:
                    i = "undefined" != typeof t.venderId && 0 != t.venderId ? t.venderId : "";
                    break;
                case 2:
                    i = "undefined" != typeof t.supplierCode && t.supplierCode ? t.supplierCode : t.venderId || "";
                    break;
                default:
                    i = "undefined" != typeof t.venderId && 0 != t.venderId ? t.venderId : ""
            }
            e.urlConnection.type = type,
                e.urlConnection.info.venderId = i,
                e.urlConnection.venderId = i
        };
        "undefined" != typeof e.urlConnection && (a(e.urlConnection),
            r(e.urlConnection));
        var o = function() {
            e.urlConnection.info.venderId = t.venderId;
            var o = {};
            o.entry = t.entry,
                "undefined" != typeof t.shopId ? o.shopId = t.shopId : "undefined" != typeof t.groupId ? o.groupId = t.groupId : "undefined" != typeof t.venderId && (o.venderId = t.venderId),
            "undefined" != typeof t.pid && (o.pid = t.pid),
                n.ajaxCMD(i.venderInfo, {
                    info: n.json2string(o)
                }, "get", "json", function(t) {
                    if (t) {
                        if ("undefined" != typeof t.errorCode && t.errorCode && 4281 == t.errorCode)
                            return void e._getshadow();
                        e.urlConnection.avatar = t.avatar,
                        "undefined" != typeof t.supplierCode && (e.urlConnection.info.supplierCode = t.supplierCode),
                            e.urlConnection.type = t.type,
                            a(t),
                            r(t)
                    }
                })
        }
            , s = function() {
            e.urlConnection.info.pid = t.pid;
            var o = {
                pid: t.pid,
                clientType: "comet"
            }
                , s = {
                dataType: "product",
                action: "getProduct2",
                param: n.json2string(o)
            };
            n.ajaxCMD(i.productInfo, s, "get", "json", function(t) {
                if (t) {
                    if ("undefined" != typeof t.errorCode && t.errorCode && 4281 == t.errorCode)
                        return void e._getshadow();
                    a(t),
                        r(t);
                    var i = t.imgurl;
                    i = i ? i.replace(/^http(s)?\:/, "") : c.errorPic,
                        e.urlConnection.info.pidImgURL = i,
                        e.urlConnection.info.url = t.url || "",
                        e.urlConnection.info.pidName = "undefined" != typeof t.name ? t.name : c.pidName,
                        e.urlConnection.info.pidprice = "undefined" != typeof t.price2 ? t.price2 : c.noPrice
                }
            })
        }
            , d = function() {
            e.urlConnection.info.orderId = t.orderId;
            var o = {
                pin: e.pin,
                orderId: t.orderId + ""
            }
                , s = {
                dataType: "order",
                action: "getOrderDetail",
                param: n.json2string(o)
            };
            n.ajaxCMD(i.userOrder, s, "get", "json", function(t) {
                if (t) {
                    if ("undefined" != typeof t.errorCode && t.errorCode && 4281 == t.errorCode)
                        return void e._getshadow();
                    a(t),
                        r(t);
                    var i = t.products[0].imageUrl || null
                        , o = "//img12.360buyimg.com/N6/" + t.products[0].imageUrl;
                    o = i ? o.replace(/^http(s)?\:/, "") : c.errorPic,
                        e.urlConnection.info.orderImg = o,
                        e.urlConnection.info.orderprice = t.orderPrice,
                        e.urlConnection.info.orderTime = n.formatDate(new Date(t.time), "yyyy-MM-dd HH:mm")
                }
            })
        }
            , l = function() {
            if ("jd.waiter" == e.registerAppid || "jr.waiter" == e.registerAppid) {
                var t = {
                    venderId: 1,
                    appId: e.registerAppid,
                    type: 3,
                    venderName: c.jdVenderName
                };
                a(t),
                    r(t)
            } else
                o()
        };
        if ("undefined" != typeof t.pid)
            s(),
                l();
        else if ("undefined" != typeof t.orderId)
            d(),
                l();
        else if ("undefined" != typeof t.venderId || "undefined" != typeof t.shopId || "undefined" != typeof t.groupId)
            l();
        else if ("undefined" != typeof t.entry) {
            var p = {
                venderId: 1,
                type: 3,
                appId: e.registerAppid,
                venderName: c.jdVenderName
            };
            a(p),
                r(p)
        }
    }
    ,
    e.prototype._getConnections = function() {
        var e = this;
        e.urlConnection = e._getUrlParms(),
            e.urlConnection.appId = e.registerAppid;
        e.urlConnection;
        "undefined" != typeof e.urlConnection && e._getVenderInfo(),
            setTimeout(function() {
                n.ajax(i.contacts, {}, "get", "json", function(i) {
                    if (i) {
                        if ("undefined" != typeof e.urlConnection) {
                            for (var r = [], a = !0, o = 0, s = i.length; o < s; o++)
                                for (var d in i[o])
                                    if ("venderId" == d && i[o][d] == e.urlConnection.venderId) {
                                        i[o].entry = e.urlConnection.entry,
                                            i[o].appId = "undefined" != typeof e.urlConnection.appId ? e.urlConnection.appId : i[o].appId,
                                            i[o].pid = e.urlConnection.pid,
                                            i[o].venderName = e.urlConnection.venderName,
                                            i[o].orderId = e.urlConnection.orderId;
                                        for (var l in e.urlConnection.info)
                                            i[o].info = "undefined" != typeof i[o].info ? i[o].info : {},
                                                i[o].info[l] = e.urlConnection.info[l];
                                        if ("undefined" != typeof e.urlConnection.jimi_flag) {
                                            var p = e.urlConnection.jimi_flag.toLowerCase();
                                            i[o].info.jimiFlag = 1 == p || 1 == p || "true" == p
                                        }
                                        if ("undefined" != typeof e.urlConnection.jimiFlag) {
                                            var p = e.urlConnection.jimiFlag.toLowerCase();
                                            i[o].info.jimiFlag = 1 == p || 1 == p || "true" == p
                                        }
                                        r = i.splice(o, 1),
                                            a = !1;
                                        break
                                    }
                            if (a && (i.push(e.urlConnection),
                                    a = !1),
                                r.length > 0)
                                i.splice(0, 0, r[0]);
                            else {
                                var m = i.length;
                                r = i.splice(m - 1, 1),
                                    i.splice(0, 0, r[0])
                            }
                        }
                        $.each(i, function(i, r) {
                            0 != i && (r.entry = e.appEntryCon[r.appId]),
                            "360.customer" == n.soaPara.appId && 1 == r.venderId && (r.venderName = c.mall360VenderName);
                            var a = new t(r);
                            a.create(),
                                e.chats[r.venderId] = a,
                            0 == i && (e.currentConnection = a,
                                e._initChatPram(e.currentConnection),
                                n.ohterPara.venderId = r.venderId,
                                n.ohterPara.appId = r.appId,
                                n.ohterPara.groupId = r.groupId,
                                n.ohterPara.type = r.type)
                        }),
                            setTimeout(function() {
                                e._getStatus()
                            }, 20),
                            e._poll(),
                            e._chatListEvt()
                    }
                })
            }, 20)
    }
    ,
    e.prototype._getStatus = function() {
        var e = this
            , t = []
            , r = e.chats;
        for (var a in r) {
            var o = {};
            o.appId = r[a].appId,
                o.venderId = r[a].venderId,
            "undefined" != typeof r[a].info.supplierCode && (o.supplierCode = r[a].info.supplierCode),
                t.push(o)
        }
        for (var s = [], d = 0, c = t.length; d < c; d += 5)
            s.push(t.slice(d, d + 5));
        $.each(s, function(e, t) {
            n.ajaxCMD(i.venderStatus, {
                body: n.json2string(t)
            }, "post", "json", function(e) {
                if (e) {
                    for (var t = 0, i = e.length; t < i; t++)
                        $("#listDetails li").length > 0 && $("#listDetails li").each(function() {
                            $(this).attr("appId") == e[t].appId && $(this).attr("venderId") == e[t].venderId && 0 === e[t].online && $(this).addClass("off")
                        });
                    var n = $("#listDetails li.current").hasClass("off");
                    n ? $(".im-header").find("h1").addClass("off") : $(".im-header").find("h1").removeClass("off")
                }
            })
        })
    }
    ,
    e.prototype._getInitUnread = function() {
        var e = this
            , t = []
            , r = e.chats;
        for (var a in r) {
            var o = {};
            o.appId = r[a].appId,
                o.venderId = r[a].venderId,
            "undefined" != typeof r[a].info.supplierCode && (o.supplierCode = r[a].info.supplierCode),
                t.push(o)
        }
        for (var s = [], d = 0, c = t.length; d < c; d += 5)
            s.push(t.slice(d, d + 5));
        var l = {
            app: n.ohterPara.p_appId,
            pin: n.ohterPara.pin,
            clientType: "comet"
        };
        l = n.json2string(l),
            $.each(s, function(t, r) {
                n.ajaxCMD(i.initUnread, {
                    uid: l,
                    aid: n.soaPara._token_,
                    param: n.json2string(r)
                }, "post", "jsonp", function(t) {
                    if (t || "undefined" == typeof t.body) {
                        var i = t.body;
                        if (i)
                            for (var n = 0, r = i.length; n < r; n++)
                                $("#listDetails li").length > 0 && $("#listDetails li").each(function() {
                                    $(this).attr("appId") == i[n].appId && $(this).attr("venderId") == i[n].venderId && ($(this).hasClass("current") ? e.chats[i[n].venderId].prevNum = 0 : e.chats[i[n].venderId].prevUnrdNo = i[n].num,
                                        e.chats[i[n].venderId].changeUnreadSign())
                                })
                    }
                })
            })
    }
    ,
    e.prototype._getUnread = function() {
        n.ajax(i.unreadMsg, {}, "get", "json", function(e) {})
    }
    ,
    e.prototype._getReceipt = function(e) {
        n.ajax(i.receptReceipt, {
            acks: e
        }, "post", "text", function() {})
    }
    ,
    e.prototype._initChatPram = function(e) {
        n.ohterPara.venderName = e.venderName,
            n.ohterPara.venderId = e.venderId,
            n.ohterPara.groupId = e.groupId,
            n.ohterPara.appId = e.appId
    }
    ,
    e.prototype._chatListEvt = function() {
        var e = this;
        $("#listDetails .u-lst>li").click(function() {
            var t = $(this);
            if (t.hasClass("current"))
                return !1;
            t.addClass("current").siblings().removeClass("current");
            var i = t.attr("venderid");
            e.currentConnection = e.chats[i];
            var a = e.currentConnection;
            e.chats[n.ohterPara.venderId].chatMessage = $(".im-chat-list").html(),
                e._sayHelloToSever(),
            0 != a.info.pid && "undefined" != typeof a.info.pid || 0 != a.info.orderId && "undefined" != typeof a.info.orderId || e._clearBoard(),
                e._initChatPram(a),
                a.unOneHistory ? ($(".im-chat-list").html(e.chats[n.ohterPara.venderId].chatMessage),
                    $(".im-chat-list .chat-txt[data-rel=ratTag]").remove(),
                    r.imgLightBox(),
                    a._moreListInfo("history", "#clickMore", "_getHistory"),
                    $(".im-chat-list .chat-txt .err[data-send=send]").each(function() {
                        var t = $(this)
                            , i = {
                            sendTime: t.attr("data-time"),
                            text_in_json: t.attr("data-content"),
                            isOptFlag: t.attr("data-optFlag")
                        };
                        e._bindErrorMsgClick(i, i.sendTime)
                    }),
                    r.resetChatBox()) : a._initHistory(),
                $.each(e.currentConnection.unreadMsg, function(t, i) {
                    e._parseMsg(i, 1)
                }),
                a.readMsg(),
                e._headRefresh(),
                e._evaQRefresh(),
                e._widgetRefresh(),
                a.changeUnreadSign()
        }),
            s.upload(),
        e.currentConnection && e.currentConnection.dom.trigger("click")
    }
    ,
    e.prototype._sayHelloToSever = function() {
        var e = this
            , t = e.currentConnection
            , i = r.getServerTime();
        !t.unOneHistory && "undefined" != typeof t.info.pid && t.info.pid > 0 ? setTimeout(function() {
            var a = {
                id: t.pid,
                img: t.info.pidImgURL,
                name: t.info.pidName,
                url: t.info.url,
                type: "product"
            };
            e._sendToOrderPdc(a, "product", i),
                r.showNewMsg(a, e.pin, n.curTime(), i, !0, !1, !1, "isOrderPid")
        }, 10) : !t.unOneHistory && "undefined" != typeof t.info.orderId && t.info.orderId > 0 ? setTimeout(function() {
            var a = {
                id: t.orderId,
                img: t.info.orderImg,
                price: t.info.orderprice,
                time: t.info.orderTime,
                type: "order"
            };
            e._sendToOrderPdc(a, "order", i),
                r.showNewMsg(a, e.pin, n.curTime(), i, !0, !1, !1, "isOrderPid")
        }, 10) : e._sendToHello()
    }
    ,
    e.prototype._initAllocate = function() {}
    ,
    e.prototype._btnBindEvtSend = function() {
        var e = this
            , t = r.getServerTime();
        $(".im-right-sidebar .btn-1").die("click").live("click", function() {
            e.currentConnection;
            if ($(this).hasClass("J_pid_send")) {
                var i = {
                    id: $(this).attr("pid"),
                    img: $(this).attr("src"),
                    name: $(this).attr("name"),
                    url: $(this).attr("pidUrl"),
                    type: "product"
                };
                $(this).parents(".im-list-pinfo").length || (i.tips = "顾客通过点击web咚咚【最近浏览】信息发送："),
                $(".order_wapper").length > 0 && l.shadeLayer.closed(),
                    e._sendToOrderPdc(i, "product", t),
                    r.showNewMsg(i, e.pin, n.curTime(), t, !0, !1, !1, "isOrderPid")
            } else if ($(this).hasClass("J_oreder_send")) {
                var a = {
                    id: $(this).attr("orderId"),
                    img: $(this).attr("orderImg"),
                    price: $(this).attr("orderprice"),
                    time: $(this).attr("orderTime"),
                    tips: "顾客通过点击web咚咚【我的订单】信息发送：",
                    type: "order"
                };
                $(".order_wapper").length > 0 && l.shadeLayer.closed(),
                    e._sendToOrderPdc(a, "order", t),
                    r.showNewMsg(a, e.pin, n.curTime(), t, !0, !1, !1, "isOrderPid")
            }
        })
    }
    ,
    e.prototype._choseCategoryId = function() {
        function e() {
            var e = $(this).attr("data-group");
            $(this).addClass("current"),
                $(this).siblings().removeClass("current"),
                n.ohterPara.groupId = e,
                t.currentConnection.groupId = e,
                t.currentConnection.info.groupId = e;
            var a = parseInt($(this).attr("data-op"));
            $("#order_wapper .loadingMore").attr("data-type", a);
            var o = r.getServerTime();
            if (a > 0)
                switch (a) {
                    case 1:
                        i._initOrderPic(a),
                            l.shadeLayer.init("order_wapper"),
                            $("#order_scroller .btn-1").die("click").live("click", function() {
                                if (t.currentConnection.info.action = 2,
                                        t.currentConnection.isPoll = !1,
                                        t.currentConnection.isSendMsg = !0,
                                        t.isSendChat = !0,
                                    $(this).parents(".nomorOrderPic").length > 0)
                                    r.showSystemMessage(n.__G(c.tips_conect_2, {
                                        0: t.currentConnection.venderName
                                    }), "chat_init", null, "fixed-top"),
                                        t._sendToHello(),
                                        l.shadeLayer.closed();
                                else {
                                    i.info.orderId = $(this).attr("orderId"),
                                        i.info.orderImg = $(this).attr("orderImg"),
                                        i.info.orderprice = $(this).attr("orderprice"),
                                        i.info.orderTime = $(this).attr("orderTime");
                                    var e = {
                                        id: i.info.orderId,
                                        img: i.info.orderImg,
                                        price: i.info.orderprice,
                                        time: i.info.orderTime,
                                        type: "order"
                                    };
                                    r.showSystemMessage("正在连接<strong>" + t.currentConnection.venderName + "</strong>客服，请稍等...", "chat_init", null, "fixed-top"),
                                        l.shadeLayer.closed(),
                                        t._sendToOrderPdc(e, "order", o),
                                        r.showNewMsg(e, t.pin, n.curTime(), o, !0, !1, !1, "isOrderPid")
                                }
                            });
                        break;
                    case 2:
                    case 3:
                        i._initOrderPic(a),
                            l.shadeLayer.init("order_wapper"),
                            $("#order_scroller .btn-1").die("click").live("click", function(e) {
                                if (t.currentConnection.info.action = 2,
                                        t.currentConnection.isPoll = !1,
                                        t.currentConnection.isSendMsg = !0,
                                        t.isSendChat = !0,
                                    $(this).parents(".nomorOrderPic").length > 0)
                                    r.showSystemMessage(n.__G(c.tips_conect_2, {
                                        0: t.currentConnection.venderName
                                    }), "chat_init", null, "fixed-top"),
                                        t._sendToHello(),
                                        l.shadeLayer.closed();
                                else {
                                    i.info.pid = $(this).attr("pid"),
                                        i.info.pidImgURL = $(this).attr("src"),
                                        i.info.pidName = $(this).attr("name");
                                    var a = {
                                        id: i.info.pid,
                                        img: i.info.pidImgURL,
                                        name: i.info.pidName,
                                        url: $(this).attr("url"),
                                        type: "product"
                                    };
                                    r.showSystemMessage("正在连接<strong>" + t.currentConnection.venderName + "</strong>客服，请稍等...", "chat_init", null, "fixed-top"),
                                        l.shadeLayer.closed(),
                                        t._sendToOrderPdc(a, "product", o),
                                        r.showNewMsg(a, t.pin, n.curTime(), o, !0, !1, !1, "isOrderPid")
                                }
                            })
                }
            else
                t.currentConnection.info.action = 2,
                    t.currentConnection.isPoll = !1,
                    t.currentConnection.isSendMsg = !0,
                    t.isSendChat = !0,
                    r.showSystemMessage(n.__G(c.tips_conect_2, {
                        0: t.venderName
                    }), "chat_init", null, "fixed-top"),
                    t._sendToHello()
        }
        var t = this
            , i = t.currentConnection;
        $("#categoryList li").die("click").live("click", e)
    }
    ,
    e.prototype._createChatGroup = function(e) {}
    ,
    e.prototype._evt = function() {
        var e = this;
        $("#sendMsg").click(function() {
            var t = r.getTextIn();
            if (null == t)
                return r.showSystemMessage("消息不能为空！", "chat_blank", null, null, "once"),
                    e._clearInput(),
                    !1;
            var i = t
                , a = $("<div></div>").html(i)
                , s = a.html() + ""
                , d = s.length;
            if (d > 400)
                return o.systemInfo("最多只允许发布350个字符，请删除多余部分再发送！"),
                    !1;
            if (0 == d)
                return r.showSystemMessage("消息不能为空！", "chat_blank", null, null, "once"),
                    e._clearInput(),
                    !1;
            var c = r.getServerTime();
            r.showNewMsg(i, e.pin, n.curTime(), c, !0),
                e._clearInput(),
                setTimeout(function() {
                    e._clearInput()
                }, 10),
                e._sendMsg(t, c)
        }),
            $("body").bind("imguploaded", function(t, i, n, r) {
                e._sendImg(i, n, r)
            })
    }
    ,
    e.prototype._sendMsg = function(e, t, r, a) {
        var o = this
            , s = o.currentConnection
            , d = {};
        if (d.jimiFlag = s.info.jimiFlag,
            null != e) {
            var c = e
                , l = "";
            switch (r) {
                case "order":
                case "pid":
                    l = "text",
                        d.content = c;
                    break;
                case "image":
                    l = "image",
                        d.url = c;
                    break;
                case "risk":
                    l = "risk",
                        s.info.action = 0,
                        d.code = o.code;
                    break;
                default:
                    l = "text",
                        d.content = c
            }
        } else
            l = "risk",
                s.info.action = 0,
                d.code = o.code;
        for (var p in s.info)
            "action" != p && (0 != o.currentConnection.info[p] && "" != s.info[p] || delete s.info[p]),
            "ct" == p && c != s.firstMsg && delete s.info[p];
        c == s.firstMsg && (s.info.ct = 3),
            d.appId = s.appId,
            d.info = n.json2string(s.info),
            d.type = l,
        c != s.firstMsg && (o.currentConnection.lastMsg = {
            datetime: t,
            type: d.type
        },
            "undefined" != typeof d.url ? o.currentConnection.lastMsg.url = d.url : o.currentConnection.lastMsg.content = d.content,
            o.chats[o.currentConnection.venderId].changeUnreadSign());
        var m = {
            sendTime: t,
            text_in_json: e,
            isOptFlag: r
        };
        n.ajax(i.sendMsg + "?t=" + (new Date).getTime(), d, "post", "json", function(e) {
            var i = d ? d : {};
            i.sendTime = t,
                o._msgHandle(e, m, i, a)
        }, null, function() {
            o.currentConnection.firstMsg != c && (o._errorShowHtml(m),
                o._bindErrorMsgClick(m, t))
        })
    }
    ,
    e.prototype._errorShowHtml = function(e) {
        var t = e.sendTime
            , i = $("#err_" + t);
        i.show().removeClass("err_load"),
            i.attr("data-send", "send"),
            i.attr("data-time", t),
            i.attr("data-content", e.text_in_json),
            i.attr("data-optFlag", e.isOptFlag)
    }
    ,
    e.prototype._bindErrorMsgClick = function(e, t) {
        var i = this;
        $("#err_" + t).unbind("click").bind("click", function() {
            $("#err_" + t).addClass("err_load"),
                i._sendMsg(e.text_in_json, t, e.isOptFlag)
        })
    }
    ,
    e.prototype._changeStatus = function(e) {
        var t = $(".u-lst li.current");
        e ? (t.removeClass("off"),
            $(".im-header").find("h1").removeClass("off")) : (t.addClass("off"),
            $(".im-header").find("h1").addClass("off"))
    }
    ,
    e.prototype._msgHandle = function(e, t, i, a) {
        var o = t.sendTime
            , s = t.text_in_json
            , d = this;
        if (!e)
            return void (d.firstMsg != s && (d._errorShowHtml(t),
                d._bindErrorMsgClick(t, o)));
        var l = e.code;
        switch (r.resetFixedTips(),
            d._resetBindFoot(d.riskSendTime),
            l) {
            case 1:
                d._clearInput(),
                    d._chatReady(e.data),
                    d._changeStatus(!0),
                    $("#err_" + o).hide().removeClass("err_load").removeAttr("data-send"),
                    n.ohterPara.groupId = e.groupId,
                    d.currentConnection.groupId = e.groupId,
                d.currentConnection.waitMsgArr.length > 0 && $.each(d.currentConnection.waitMsgArr, function(e, t) {
                    var i = t.content;
                    "image" == t.type && (i = t.url),
                        setTimeout(function() {
                            d._sendMsg(i, t.sendTime, t.type)
                        }, 200)
                }),
                    d.currentConnection.waitMsgArr = [];
                var p = "undefined" != typeof e.time ? e.time : 0;
                p && (n.ohterPara.timeDifference = p - (new Date).getTime());
                break;
            case 181:
                if (d.currentConnection.waitMsgArr.push(i),
                    e.data.length <= 0)
                    return;
                var m = e.data;
                r.showNewMsg(m, "", n.curTime(), o, !1, !1, !1, "isGroupFlag"),
                    d._choseCategoryId();
                break;
            case 182:
                r.showSystemMessage("客服MM不在线，您也可以等会儿再进行咨询~", "chat_offLine", null, null, "once"),
                    d._changeStatus();
                break;
            case 183:
                d._difluent(e);
                break;
            case 184:
                r.showSystemMessage("您好，客服MM暂时不能为您提供服务~", "chat_risk_no", null, null, "once");
                break;
            case 192:
                d._resetRiskCode(d.riskSendTime),
                    r.showSystemMessage("网络异常，请重新输入验证码", "chat_risk", null, null, "once");
                break;
            case 185:
                r.showRiskCode(e.data, o),
                    d._bindRiskCode(o),
                    d.isPoll = !1;
                break;
            case 186:
                r.showRiskCode(e.data, o),
                    d._bindRiskCode(o),
                    d._unBindRiskCode(d.riskSendTime),
                    d.stopPoll = !0,
                    r.showSystemMessage("您好，验证码输入错误，请重新输入", "chat_risk", null, null, "once");
                break;
            case 187:
                d.isPoll = !1,
                    d.stopPoll = !0,
                    d._unBindRiskCode(d.riskSendTime),
                    r.showSystemMessage("您好，验证码输入错误次数过多~", "chat_risk", null, null, "once");
                break;
            case 179:
                d.isPoll = !0;
                var u = "恭喜您，输入正确！";
                r.showSystemMessage(u, "chat_risk", null, null, "once"),
                d.currentConnection.waitMsgArr.length > 0 && $.each(d.currentConnection.waitMsgArr, function(e, t) {
                    var i = t.content;
                    "image" == t.type && (i = t.url),
                        setTimeout(function() {
                            d._sendMsg(i, t.sendTime, t.type)
                        }, 200)
                }),
                    d.currentConnection.waitMsgArr = [],
                    d._poll();
                break;
            case 180:
                d._changeStatus();
                break;
            case 188:
                d.currentConnection.info.action = 3,
                    $("#err_" + o).hide().removeClass("err_load").removeAttr("data-send"),
                    d._changeStatus();
                break;
            case 191:
                d.currentConnection.info.action = 4,
                d.firstMsg != s && (d._errorShowHtml(t),
                    d._bindErrorMsgClick(t, o),
                    r.showSystemMessage(n.__G(c.tips_server_8), "msgsend_error")),
                    d._changeStatus();
                break;
            case 189:
                d.currentConnection.info.action = 3,
                d.firstMsg != s && (d._errorShowHtml(t),
                    d._bindErrorMsgClick(t, o),
                    r.showSystemMessage(n.__G(c.tips_server_8), "msgsend_error")),
                    d._changeStatus();
                break;
            case 138:
            case 173:
                r.showSystemMessage(n.__G(c.tips_server_2), "msgsend_error");
                break;
            case 198:
                d.currentConnection.info.action = 1,
                d.firstMsg != s && (d._errorShowHtml(t),
                    d._bindErrorMsgClick(t, o),
                    r.showSystemMessage(n.__G(c.tips_server_8), "msgsend_error"));
                break;
            default:
                d.currentConnection.info.action = 1,
                    r.showSystemMessage(n.__G(c.tips_server_8), "msgsend_error", null, null, "once"),
                    d._changeStatus()
        }
        a && a(e)
    }
    ,
    e.prototype._difluent = function(e) {
        var t = this
            , i = ($("#cpin").val(),
            "")
            , r = e.data.groupId ? e.data.groupId : ""
            , a = e.data.appId ? e.data.appId : ""
            , o = e.data.shuntEntry || ""
            , s = e.data.supplierCode ? e.data.supplierCode : e.data.venderId;
        s && a ? (i = "/chat/index.action?venderId=" + s + "&appId=" + a + "&entry=" + o,
        1 == t.currentConnection.venderId && r && (i += "&groupId=" + r)) : (i = e.data.url + "&jimiFlag=1&venderId=" + t.currentConnection.info.venderId + "&token=" + n.cookie("aid") + "&groupId=" + r + "&entry=" + o,
        t.shopId && (i = i + "&shopId=" + t.shopId),
        t.sku && (i = i + "&sku=" + t.sku),
        t.currentConnection.info.orderId && (i = i + "&orderId=" + t.currentConnection.info.orderId),
        t.currentConnection.info.pid && (i = i + "&pid=" + t.currentConnection.info.pid)),
            window.location.href = i
    }
    ,
    e.prototype._clearBoard = function() {
        $("#scrollDiv").find(".chat-txt").remove()
    }
    ,
    e.prototype._clearInput = function() {
        $("#text_in").html("")
    }
    ,
    e.prototype._chatReady = function(e) {
        var t = this;
        t.count++,
            t.currentConnection.isBegan = 1,
            t._intoChat(e)
    }
    ,
    e.prototype._headRefresh = function() {
        var e = this
            , t = e.currentConnection
            , i = $(".im-header")
            , n = ""
            , r = $("#listDetails li.current").hasClass("off");
        if (r ? i.find("h1").addClass("off") : i.find("h1").removeClass("off"),
            1 == t.type)
            if (n = '<em class="em em_1"></em>',
                "undefined" != typeof t.shopId) {
                var a = "//mall.jd.com/index-" + t.shopId + ".html";
                i.find(".enter").attr("href", a).show()
            } else
                i.find(".enter").attr("href", "javascript:;").hide();
        else
            n = 2 == t.type ? '<em class="em em_2"></em>' : 3 == t.type ? '<em class="em em_0"></em>' : "";
        var o = i.find("h1 em");
        o.length ? o.replaceWith(n) : i.find("h1").prepend($(n)),
            $("#logoTitle").html(t.venderName)
    }
    ,
    e.prototype._widgetRefresh = function() {
        var e = this;
        e.relate = new d(e.currentConnection),
            e.relate.change(e.currentConnection),
            e._toolReset()
    }
    ,
    e.prototype._evaQRefresh = function() {
        var e = this
            , t = e.currentConnection;
        "undefined" != typeof t.groupId && n.ajax(i.evaluateQ, {
            t: (new Date).getTime(),
            appId: t.appId,
            groupId: t.groupId
        }, "get", "json", function(e) {
            e && (n.ohterPara.newEvaQ = e)
        })
    }
    ,
    e.prototype._loadFace = function() {
        0 == $("#j_popFace .im-table-face").length && $("#j_popFace").jdExpressionv4({
            imgClick: function(e) {
                var t = e.target.id
                    , i = this.getImg(t);
                r.insertImg(i),
                    $("#text_in").trigger("focus"),
                    $("#expressionButton").removeClass("im-icon-face-current"),
                    $("#j_popFace").hide()
            }
        })
    }
    ,
    e.prototype._initRatPop = function(e) {
        var t = this
            , i = (new Date).getTime()
            , n = o.buildRatHtml(i, e);
        if ($("#eval_rat").length <= 0) {
            var r = $('<div class="im-pop-star" id="eval_rat"><div class="t"><div class="close"><a href="javascript:;"></a></div></div><div class="m"></div><div class="b"></div></div>');
            r.find(".m").append($(n)),
                r.appendTo(".im-edit-toolbar"),
                o.rat($("#rat_" + i), !0),
                t._setDegreeHandle(i)
        }
    }
    ,
    e.prototype._setDegreeHandle = function(e) {
        var t = this
            , a = "#rat_" + e;
        o.bindDegreebtn(a, function(e, a) {
            function o() {
                var e = a.reasonItem.split(",")
                    , t = 1;
                return $.each(e, function(e, i) {
                    t *= i
                }),
                    t
            }
            var s = t.currentConnection;
            if ($("#eval_rat").css("display", "none"),
                    !t.currentConnection.isBegan)
                return r.showSystemMessage(n.__G(c.tips_server_19), "evaluate", null, null, "once"),
                    !1;
            if (t.currentConnection.isDegree)
                return r.showSystemMessage(n.__G(c.tips_server_17), "evaluate", null, null, "once"),
                    !1;
            if (s.lastEvaluateTime && (new Date).getTime - s.lastEvaluateTime < 1e4)
                return void r.showSystemMessage(n.__G(c.tips_server_20), "evaluate", null, null, "once");
            t.currentConnection.lastEvaluateTime = (new Date).getTime();
            var d = {
                appId: s.appId,
                t: (new Date).getTime(),
                score: a.degree,
                evaluate: a.suggest,
                evaqId: o
            };
            return s.groupId ? d.groupId = s.groupId : d.venderId = s.venderId,
                n.ajax(i.evaluate, d, "POST", "json", function(i) {
                    var a = i;
                    if (a && a.errorCode && 4281 == a.errorCode)
                        return void t._getshadow();
                    if (1 == a.code)
                        r.showSystemMessage(n.__G(c.tips_server_13, {
                            0: s.info.venderName
                        }), "degree"),
                            $(e).find("img").unbind().die(),
                            $(e).find(".btn").addClass("btn_no").unbind("click"),
                            $(e).find(".inner").unbind("click"),
                            $(e).find("textarea").attr("readonly", !0),
                        1 == $(e).parents(".eval_rat").length && $(e).parents(".eval_rat").hide(),
                            t.currentConnection.isDegree = 1;
                    else {
                        if (162 == a.code)
                            return r.showSystemMessage(n.__G(c.tips_server_18), "degree", null, null, "once"),
                                void (t.currentConnection.isDegree = 1);
                        if (161 == a.code || 163 == a.code)
                            return void r.showSystemMessage(n.__G(c.tips_server_16), "degreeFail", null, null, "once")
                    }
                }),
                !0
        })
    }
    ,
    e.prototype._initRuleTips = function() {
        var e = $('<a clstag="pageclick|keycount|w_web_201701061|24" href="javascript:;" class="rule" id="ruleBtn"> <i class="im-rule"></i> <span class="im-txt">怎么发截图？</span></a>')
            , t = $('<div class="im-pop-rule"><div class="sub"><div class="close"><a href="javascript:;"></a></div><p>将您已截好的图片直接粘贴至输入框中即可（说明：目前暂不支持IE浏览器）</p></div></div>');
        e.insertBefore(".im-icon-out a:first"),
            t.appendTo(".im-edit-toolbar"),
            $("#ruleBtn").hover(function() {
                $(this).trigger("click")
            }, function() {
                var e = $(this).attr("class")
                    , t = $(this).parent().siblings("div.im-pop-" + e);
                t.hide()
            })
    }
    ,
    e.prototype._starTips = function() {
        var e = this
            , t = $('<div class="im-star-tips" id="star_tips"><div class="sub"><div class="close"><a clstag="pageclick|keycount|w_web_201701061|12" href="javascript:;"></a></div><p>聊完记得给客服MM一个评价哟</p></div></div>');
        $("#star_tips").length > 0 ? i.show() : t.appendTo(".im-edit-area");
        var i = $("#star_tips");
        i.find(".close").off().on("click", function() {
            i.hide();
            var t = r.getServerTime()
                , a = new Date(new Date((new Date).toLocaleDateString()).getTime() + 864e5 - 1).getTime()
                , o = parseInt(Math.abs(a - t) / 1e3);
            n.setCookie(encodeURIComponent("invite" + e.pin), 1, "s" + o)
        })
    }
    ,
    e.prototype._toolInit = function() {
        var e = this
            , t = n.cookie("invite" + e.pin);
        1 != t && e._starTips(),
            e._initRuleTips(),
            e._loadFace(),
            $("#text_in").on("click focus", function() {
                $("#eval_rat").hide(),
                    $(".im-pop-face").hide()
            }),
            $(".im-icon-out a").click(function() {
                var t = $(this).attr("class");
                if ("expressionButton" == $(this).attr("id"),
                    "degreeButton" == $(this).attr("id")) {
                    if (e.currentConnection.isDegree)
                        return void r.showSystemMessage(c.tips_server_16, "degree", null, null, "once");
                    0 == $(".im-pop-star .starInfo img").length && (e._evaQRefresh(),
                        e._initRatPop(n.ohterPara.newEvaQ),
                        o.rat($(".im-pop-star .rat_box"), !1),
                        $("#scrollDiv").click(function(e) {
                            $("#eval_rat").hide()
                        }),
                        $("#eval_rat .close").click(function(e) {
                            $("#eval_rat").hide()
                        }))
                }
                var i = $(this).parent().siblings("div.im-pop-" + t);
                0 == i.length && $(this).parent().siblings("div").hide(),
                    "block" == i.css("display") ? i.css("display", "none") : (i.css("display", "block"),
                        i.siblings("div").hide())
            }),
            $("#scrollDiv").delegate("[data-group]", "click", function() {
                e.currentConnection.groupId = $(this).attr("data-group"),
                    $("#text_in").attr("contenteditable", !0)
            })
    }
    ,
    e.prototype._toolReset = function() {
        $("#eval_rat").length && $("#eval_rat").remove()
    }
    ,
    e.prototype._sendImg = function(e, t, i) {
        var n = this
            , r = (n.currentConnection,
            (new Date).getTime());
        n._sendMsg(e, r, "image")
    }
    ,
    e.prototype._intoChat = function(e) {
        var t = this;
        t._initData(e),
            t._showToHello()
    }
    ,
    e.prototype._initData = function(e) {
        var t = this;
        t.currentConnection.isPoll = !1,
            t._resetOrderPid()
    }
    ,
    e.prototype._resetOrderPid = function() {}
    ,
    e.prototype._showToHello = function() {
        var e = this
            , t = ""
            , i = e.currentConnection;
        if (i.info.orderId && "" != i.info.orderId ? t = {
                id: i.info.orderId,
                img: i.info.orderImg,
                price: i.info.orderprice,
                time: i.info.orderTime
            } : i.info.pid && "" != i.info.pid && (t = {
                id: i.info.pid,
                img: i.info.pidImgURL,
                name: i.info.pidName,
                url: i.info.url
            }),
                i.isSendMsg) {
            e.currentConnection.isSendMsg = !1;
            var a = "";
            1 == i.info.venderId ? ("jr.waiter" == e.urlConnection.appId && (a = "您好，<strong>京东金融客服</strong>很高兴为您服务！"),
                a = "360.customer" == n.soaPara.appId ? "您好，<strong>360商城官方客服</strong>很高兴为您服务！" : "您好，<strong>京东客服</strong>很高兴为您服务！") : a = "您好，<strong>" + i.venderName + "</strong>客服很高兴为您服务！",
                r.showSystemMessage(a, "chat_create", "success", null, "once")
        }
    }
    ,
    e.prototype._sendToHello = function() {
        var e = this
            , t = {}
            , i = (new Date).getTime()
            , r = e.currentConnection;
        t = n.__G(c.txt_msg_1, {
            0: e.pin
        }),
        r.info.orderId && "" != r.info.orderId && (t = t + "，" + n.__G(c.txt_order_3) + r.info.orderId),
        r.info.pid && "" != r.info.pid && (t = t + "，商品编号：" + r.info.pid),
            r.firstMsg = t,
        e.isSendChat && (e._sendMsg(t, i),
            e.isSendChat = !1),
        r.isPoll || e._poll()
    }
    ,
    e.prototype._sendToOrderPdc = function(e, t, i) {
        var a = this
            , o = {}
            , s = a.currentConnection;
        if ("order" == t) {
            var d = e.price ? e.price : ""
                , l = e.time ? e.time : "";
            o = "[" + n.__G(c.txt_order_3) + e.id + "," + n.__G(c.txt_order_4) + d + "," + n.__G(c.txt_order_6) + l + "]"
        } else
            "product" == t && (o = "https://item.jd.com/" + e.id + ".html");
        e.tips && (o = e.tips + o);
        var i = i || r.getServerTime();
        a._sendMsg(o, i, "order"),
        s.isPoll || a._poll(),
            a.isSendChat = !1
    }
    ,
    e.prototype._poll = function() {
        var e = this;
        e.currentConnection.isPoll = !0;
        var t = ((new Date).getTime(),
        {
            aid: n.soaPara._token_
        });
        if (!e.stopPoll) {
            null != e.currentConnection.cur_ajax_request && e.currentConnection.cur_ajax_request.abort();
            try {
                e.currentConnection.cur_ajax_request = n.ajaxpoll(i.getMsg, t, "get", "json", e.pollTimeout, !1, function(t) {
                    var i = t.responseText;
                    if ("string" == typeof i && (i = n.string2json(i)),
                            i) {
                        if (i.errorCode && 4281 == i.errorCode)
                            return e.isPoll = !1,
                                void e._getshadow();
                        if (110 == i.code || 111 == i.code) {
                            var r = i.url + encodeURIComponent(window.location.href);
                            return void (window.location.href = r)
                        }
                        e._parseMsg(i),
                            e.currentConnection.connecttime = 0,
                            i = null,
                            e._poll()
                    } else
                        e.stopPoll = !0,
                            clearTimeout(e.pollTimer),
                            e.pollTimer = setTimeout(function() {
                                e.stopPoll = !1,
                                    e._poll()
                            }, e.pollErrorTtl)
                }, function(t) {
                    e._postErrorLog(t)
                }, function(e) {})
            } catch (t) {
                e._postErrorLog(t),
                    clearTimeout(e.pollTimer),
                    e.stopPoll = !1,
                    e._poll()
            }
        }
    }
    ,
    e.prototype._postErrorLog = function(e) {
        var t = this
            , r = void 0;
        e.stack || (r = e.getResponseHeader("reponse-id"));
        var a = {
            status: e.status,
            error: e.statusText,
            message: e.message,
            pin: t.pin,
            responseId: r,
            os: navigator.userAgent
        }
            , o = {
            info: n.json2string(a)
        };
        t.cur_errorLog = n.ajax(i.errorLog, o, "get", "json", function(e) {})
    }
    ,
    e.prototype._GetOfflineMsg = function() {
        var e = this;
        e.cur_offlineMsg = n.ajax(i.offlineMsg, {}, "get", "json", !1, function(t) {
            var i = t.responseText;
            if (i && ("string" == typeof i && (i = n.string2json(i)),
                "" != i)) {
                if (i && i.errorCode && 4281 == i.errorCode)
                    return e.isPoll = !1,
                        void e._getshadow();
                e._parseMsg(i),
                    e.currentConnection.connecttime = 0,
                    i = null
            }
        })
    }
    ,
    e.prototype._parseMsg = function(e, t) {
        var i = this
            , a = i.currentConnection;
        if (e) {
            var o = e;
            $.isArray(e) || (o = [],
                o.push(e));
            var s = []
                , d = 0
                , c = []
                , l = {}
                , p = "";
            $.each(o, function(e, o) {
                "string" == typeof o && (o = n.string2json(o));
                var m = {}
                    , u = {};
                if (t)
                    return void i._parseHandel(o, t);
                if (o.mid) {
                    if (i.midArr.length > 0) {
                        var f = n.arrContains(i.midArr, o.mid);
                        if (f !== !1)
                            return;
                        i.midArr.push(o.mid)
                    } else
                        i.midArr.push(o.mid);
                    m = {
                        mid: o.mid,
                        sender: o.from.pin,
                        app: o.from.app
                    },
                        c[e] = m
                }
                if ("undefined" != typeof o.body.chatinfo && "undefined" != typeof o.body.chatinfo.venderId ? p = o.body.chatinfo.venderId : "undefined" != typeof o.body.chatinfo && "undefined" != typeof o.body.venderId && (p = o.body.venderId),
                        "undefined" != typeof o.body && "undefined" != typeof o.body.chatinfo && "undefined" != typeof o.body.chatinfo.venderId && o.body.chatinfo.venderId != a.venderId ? (l.venderId = o.body.chatinfo.venderId,
                            i._removeMid(o.mid, l.venderId, "midUnreaddArr"),
                            i.chats[o.body.chatinfo.venderId].unreadMsg.push(o),
                            p = l.venderId) : "undefined" != typeof o.body && "undefined" != typeof o.body.venderId && o.body.venderId != a.venderId ? (l.venderId = o.body.venderId,
                            i._removeMid(o.mid, l.venderId, "midUnreaddArr"),
                            i.chats[o.body.venderId].unreadMsg.push(o),
                            p = l.venderId) : (o.mid && (i._removeMid(o.mid, i.currentConnection.venderId, "midArr"),
                            u = {
                                mid: o.mid,
                                sender: o.from.pin,
                                app: o.from.app
                            },
                            s[d] = u,
                            d++),
                            a.lastMsg = o,
                            l = i._parseHandel(o)),
                        i.chats[l.venderId].changeUnreadSign(),
                    p == a.venderId) {
                    var h = "";
                    "undefined" != typeof document.hidden ? h = "hidden" : "undefined" != typeof document.mozHidden ? h = "mozHidden" : "undefined" != typeof document.msHidden ? h = "msHidden" : "undefined" != typeof document.webkitHidden && (h = "webkitHidden"),
                    document[h] && (i.showNewInfo = !0,
                        r.newMsgRemind.show())
                }
            }),
            c.length > 0 && i._getReceipt(n.json2string(c)),
            s.length > 0 && a._readReceipt(n.json2string(s))
        }
    }
    ,
    e.prototype._visibilityChange = function() {
        var e, t, i, n = this;
        "undefined" != typeof document.hidden ? (e = "hidden",
            i = "visibilitychange",
            t = "visibilityState") : "undefined" != typeof document.mozHidden ? (e = "mozHidden",
            i = "mozvisibilitychange",
            t = "mozVisibilityState") : "undefined" != typeof document.msHidden ? (e = "msHidden",
            i = "msvisibilitychange",
            t = "msVisibilityState") : "undefined" != typeof document.webkitHidden && (e = "webkitHidden",
            i = "webkitvisibilitychange",
            t = "webkitVisibilityState");
        var a = function() {
            n.showNewInfo && (document[t] ? (n.showNewInfo = !1,
                r.newMsgRemind.clear()) : r.newMsgRemind.show())
        };
        "undefined" != typeof document.addEventListener ? document.addEventListener(i, a, !1) : document.attachEvent(i, a)
    }
    ,
    e.prototype._localStorage = function(e) {
        var e = e || {}
            , t = e.data
            , i = e.localType
            , r = e.sendTime
            , a = e.text_in_json
            , o = e.isOptFlag
            , s = e.dataJson
            , d = this
            , c = d.currentConnection
            , l = {};
        if (t) {
            var p = t;
            return $.isArray(t) || (p = [],
                p.push(t)),
                "send" == i ? (d.chats[c.venderId].chatMessage = d.chats[c.venderId].chatMessage || [],
                    p.localType = i,
                    p.sendTime = r,
                    p.textInJson = a,
                    p.isOptFlag = o,
                    p.dataJson = s,
                    void d.chats[c.venderId].chatMessage.push(p)) : void $.each(p, function(e, t) {
                    "string" == typeof t && (t = n.string2json(t)),
                    "undefined" != typeof t.body.chatinfo && "undefined" != typeof t.body.chatinfo.venderId && (l.venderId = t.body.chatinfo.venderId),
                    "undefined" != typeof t.body.venderId && "undefined" != typeof t.body.venderId && (l.venderId = t.body.venderId),
                        l.venderId = l.venderId || c.venderId;
                    var r = d.chats[l.venderId];
                    if (t.mid) {
                        if (r.midArr = r.midArr || [],
                            r.midArr.length > 0) {
                            var a = n.arrContains(r.midArr, t.mid);
                            if (a !== !1)
                                return
                        }
                        r.midArr.push(t.mid),
                            n.sortNumber(r.midArr)
                    }
                    r.chatMessage = r.chatMessage || [],
                        t.localType = i,
                        r.chatMessage.push(t)
                })
        }
    }
    ,
    e.prototype._matchMsgSpe = function(e) {
        var t = []
            , e = e
            , i = new RegExp("(http://|http:|https://|https:|//)(item.jd.com/|item.m.jd.com/)([^d]*)(.html|.htm)","gim")
            , n = new RegExp("(http://|http:|https://|https:|//)(wq.jd.com/item/view?sku=)([^d]*)","gim");
        return (i.test(e) || n.test(e)) && (t = e.match(i)),
            t
    }
    ,
    e.prototype._parseHandel = function(e) {
        var t = this
            , i = e.type
            , a = {};
        a.venderId = t.currentConnection.venderId;
        var s = r.getServerTime();
        switch (i) {
            case "chat_message":
                var d = e.body
                    , c = "";
                d.keyWordPrompt && r.showSystemMessage(d.keyWordPrompt, "key_word_prompt"),
                    c = "image" == d.type ? r.imgGallary(d.url) : "file" == d.type ? '<div class="msg_file"><p>' + d.name + '</p><div class="btn"><a class="btn_1" href="' + d.url.replace(/^http(s)?\:/, "") + '">下载</a></div></div>' : d.content,
                    a.content = c,
                    a.time = e.datetime.split(" ")[1];
                var l = t._matchMsgSpe(c);
                if (l.length > 0) {
                    var p = 1;
                    l = n.unique(l),
                        $.each(l, function(t, i) {
                            var n = i.match(/\d+/)[0];
                            try {
                                r.getProduct(n, c, e, null, p)
                            } catch (t) {
                                r.showNewMsg(c, e.from.pin, e.datetime.split(" ")[1], s, !1)
                            }
                        })
                } else
                    try {
                        r.showNewMsg(c, e.from.pin, e.datetime.split(" ")[1], s, !1)
                    } catch (e) {}
                t.count = t.count + 1;
                break;
            case "send_web_msg":
            case "chat":
                var c = e.body.msgtext || e.data.msgtext;
                "string" == typeof c && (c = n.string2json(c)),
                    a.content = c,
                    a.time = e.datetime.split(" ")[1];
                var m = e.from;
                try {
                    r.showNewMsg(c.D, m.app, e.datetime.split(" ")[1], s, !1)
                } catch (e) {}
                t.count = t.count + 1;
                break;
            case "chat_transfer_notice":
                var u = e.data || e.body;
                r.showSystemMessage("正在为您转接,请稍后！", "kf-transfer", null, "fixed-top"),
                "string" == typeof u && (u = n.string2json(u)),
                t.receiver && (t.receiver = u.waiter,
                    t.groupId = u.groupId),
                    t.currentConnection.isDegree = !1,
                    r.showSystemMessage("已经为您转接到新的客服", "m-transfer");
                break;
            case "sys_msg":
                var d = e.body
                    , c = d.content;
                try {
                    r.showNewMsg(c, e.from.pin, e.datetime.split(" ")[1], s, !1)
                } catch (e) {}
                break;
            case "chat_invite_evaluate":
                var u = e.data || e.body;
                "string" == typeof u && (u = n.string2json(u));
                var f = u.msg || u.msgtext;
                if ("string" != typeof f && (f = n.string2json(f)),
                        f) {
                    f = f.replace(/#E-yaoping/, "");
                    try {
                        r.showNewMsg(f, u.waiter, n.curTime(), s, !1)
                    } catch (e) {}
                }
                try {
                    r.showNewMsg("", t.currentConnection.venderId, n.curTime(), s, !1, !1, !1, "isRatTag"),
                        o.rat($("#rat_" + s), !1),
                        t._setDegreeHandle(s)
                } catch (e) {}
        }
        return a
    }
    ,
    e.prototype._removeMid = function(e, t, i) {
        var r = this
            , a = !1
            , o = {};
        if (o = "undefined" != typeof t && "undefined" != typeof r.chats[t] ? "undefined" != typeof r.chats[t][i] ? r.chats[t][i] : [] : r.midArr,
            o.length > 0) {
            var s = n.arrContains(o, e);
            s !== !1 ? a = !0 : o.push(e)
        } else
            o.push(e);
        return !1
    }
    ,
    e.prototype._showCurrentMsg = function(e) {
        var t = this
            , i = e.venderId;
        t.currentConnection._showlastMsg(e, $(".u-lst li[venderid=" + i + "]"))
    }
    ,
    e.prototype._bindRiskCode = function(e) {
        var t = this;
        $("#sendRisk_" + e).live("click", function() {
            var i = $(this).prev("input").val();
            t.riskSendTime = e,
                "" != $.trim(i) ? (t.code = i,
                    t._sendMsg(null, (new Date).getTime(), null, function(e) {
                        var i = e.code;
                        192 != i && 187 != i && 186 != i && 185 != i && 184 != i && 179 != i && (t.isPoll = !0,
                        t.riskSendTime && r.showSystemMessage("恭喜您，输入正确！", "chat_risk", null, null, "once"))
                    })) : $("#tipsRisk_" + e).html("* 验证码不能为空！").show()
        }),
            $("#sendRisk_" + e).prev("input").keyup(function() {
                $("#tipsRisk_" + e).html("").hide()
            })
    }
    ,
    e.prototype._unBindRiskCode = function(e) {
        $("#sendRisk_" + e).addClass("btn_blue_no").die("click"),
            $("#sendRisk_" + e).prev("input").attr("readonly", !0)
    }
    ,
    e.prototype._resetRiskCode = function(e) {
        var t = this;
        if (e) {
            var i = $("#sendRisk_" + e).prev("input");
            i.val("").removeAttr("readonly"),
                $("#sendRisk_" + e).removeClass("btn_blue_no"),
                t._bindRiskCode(e)
        }
    }
    ,
    e.prototype._resetBindFoot = function(e) {
        var t = this;
        t._unBindRiskCode(e),
            $("#tipsRisk_" + e).html("").hide()
    }
    ,
    e.prototype._sendSetsBr = function(e) {
        var t = n.browerType();
        if ("MSIE" == t) {
            var i = document.selection
                , a = i.createRange()
                , o = "<br />";
            a.pasteHTML(o),
                a.collapse(!1),
                a.select()
        } else
            "Firefox" == t ? r.insertImg("<br />") : r.insertImg("<br /><br />");
        e.preventDefault ? e.preventDefault : e.returnValue = !1
    }
    ,
    e.prototype._sendSet = function() {
        function e() {
            $("#hotkey1").hasClass("current") || $("#hotkey2").hasClass("current") || $("#hotkey1").addClass("current"),
                $(document).keydown(function(e) {
                    var e = e || window.event
                        , i = e.keyCode || e.which;
                    if (!e.ctrlKey && 13 == i) {
                        if ($("#hotkey1").hasClass("current"))
                            return $("#sendMsg").trigger("click"),
                                !1;
                        if ($("#hotkey2").hasClass("current"))
                            return t._sendSetsBr(e),
                                !1
                    }
                    if (e.ctrlKey && 13 == i) {
                        if ($("#hotkey1").hasClass("current"))
                            return t._sendSetsBr(e),
                                !1;
                        $("#hotkey2").hasClass("current") && $("#sendMsg").trigger("click")
                    }
                }),
                $(".im-send-set-list li").unbind("click").bind("click", function() {
                    $(this).hasClass("current") || ($(this).addClass("current"),
                        $(this).siblings().removeClass("current")),
                        i.removeClass("im-show")
                })
        }
        var t = this
            , i = $(".im-pop-send-set.cbut");
        $("#change").click(function() {
            i.hasClass("im-show") ? i.removeClass("im-show") : i.addClass("im-show")
        }),
            e()
    }
    ,
    e.prototype._sendPaste = function() {
        function e(e) {
            var t = e.getAsFile ? e.getAsFile() : e
                , i = new FileReader
                , n = $("#text_in").html();
            i.onload = function(e) {
                $("#text_in").html(n);
                var t = new Image;
                t.src = e.target.result;
                var i = {
                    title: "是否发送图片",
                    context: '<div class="sendImgBox"><p><img src="' + e.target.result + '" class="sendImg"></p><div class="foot-btn" ><a class="btn-cancel" id="sendImg_cancel" href="javascript:">取消</a><a class="btn-ok" id="sendImg_send" href="javascript:">发送</a></div></div>'
                };
                l.shadeLayer.init("orther_new", "540", i),
                    $("#sendImg_cancel").click(function() {
                        l.shadeLayer.closed()
                    }),
                    $("#sendImg_send").click(function() {
                        s.uploadBase64(e.target.result),
                            l.shadeLayer.closed()
                    })
            }
                ,
                i.readAsDataURL(t)
        }
        var t = document.getElementById("text_in");
        t.addEventListener("paste", function(t) {
            var i, n, r, a = t || window.event, o = a.clipboardData, s = 0;
            if (o) {
                if (i = o.items,
                        r = o.files,
                    r && r.length)
                    return void e(r[0]);
                if (!i)
                    return;
                for (; s < i.length; s++)
                    if ("file" === i[s].kind && i[s].type.match(/^image\//i)) {
                        n = i[s];
                        break
                    }
                n && e(n)
            }
        })
    }
    ,
    e.prototype._getshadow = function(e) {
        $(".im-edit-btn-area").addClass("im-edit-btn-no"),
            $("#sendMsg").unbind("click"),
            $("#listDetails .u-lst>li").unbind("click"),
            $(".im-tab li").unbind("click"),
            $("#categoryList li").die("click").unbind("click"),
            $(".im-list01 a").die("click").unbind("click");
        var t = {
            title: "提示",
            context: "您已在其他页面发起咨询，当前咨询已失效，<a class='a_blue' href='javascript:;' onclick='location.reload(false);'> 请点击这里重新咨询</a>!"
        };
        r.showSystemMessage("您的账号已经在异地登录，退出本次咨询", "chat_another", null, null, "once"),
            l.shadeLayer.init("orther_new", "420", t)
    }
    ,
    e.prototype._searchLeft = function() {
        $(".u-search input[type='text']").keyup(function() {
            $(this).prev("a").trigger("click");
            var e = $("#listDetails .category span")
                , t = $(".u-search input[type='text']").attr("value");
            "" == t && $("#listDetails .u-lst li").show();
            for (var i = 0; i < e.length; i++)
                e.eq(i).html().search(t) != -1 ? $("#listDetails .u-lst li").eq(i).show() : $("#listDetails .u-lst li").eq(i).hide()
        })
    }
    ,
    e.prototype._chatAuto = function() {
        function e() {
            var e = $(window).width();
            if (e >= 1200)
                $(".im-content").css({
                    "margin-left": "-600px",
                    width: "1200px"
                }),
                    $(".im-right-sidebar").css({
                        width: "339px"
                    }),
                    $(".im-chat-window").css({
                        "margin-right": "340px"
                    });
            else if ($(".im-right-sidebar").css({
                    width: "299px"
                }),
                    $(".im-chat-window").css({
                        "margin-right": "300px"
                    }),
                e < 1200 & e > 960) {
                var t = -(e / 2);
                $(".im-content").css({
                    "margin-left": t + "px",
                    width: e + "px"
                })
            } else
                e <= 960 && $(".im-content").css({
                    "margin-left": "-483px",
                    width: "966px"
                })
        }
        e(),
            $(window).resize(function() {
                e()
            })
    }
    ,
    e.prototype._specialDeal = function() {
        c.errorPic = c.error360Pic,
            $(".im-right-sidebar").on("click", ".ask-lastviews a", function(e) {
                return e.preventDefault(),
                    !1
            }),
            $(".im-right-sidebar").on("click", ".im-my-order a", function(e) {
                return e.preventDefault(),
                    !1
            }),
            $(".im-chat-list").on("click", "a.list-li-a", function(e) {
                return e.preventDefault(),
                    !1
            })
    }
    ,
    module.exports = e
}