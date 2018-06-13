
/**
 * 定义一些公共方法
 */

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s*|\s*$/g, "");
    };
}

if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (s1, s2) {
        return this.replace(new RegExp(s1, "gm"), s2);
    };
}

// 清除换行符，防止拼接的html标签被破坏
function cleanBr(str) {
    return str.replace(/\r\n|\n/g, ' ');
}

//解析url参数提取productId和source等
function parseURLParam(){
    var obj = new Object();
    var param = window.location.search;
    if(!param){
        return obj;
    }
    if(param[0] == '?') {
        param = param.substring(1,param.length);
    }
    var list = param.split("&");
    var flag = false;
    var skuId;
    for(var i =0;i<list.length;i++){
        if(list[i].indexOf("source") == 0){
            var source = list[i].split("=")[1];
            obj.source = source;
        }
        if(list[i].indexOf("productId") == 0){
            skuId = parseInt(list[i].split("=")[1]);
            obj.productId = skuId;
        }
        if(list[i].indexOf("testAddress") == 0){
            obj.testAddress = decodeURIComponent(list[i].split("=")[1]);
        }
        if(list[i].indexOf("pagetype") == 0){
            var pagetype = list[i].split("=")[1];
            obj.pagetype = pagetype;
        }
        if(list[i].indexOf("pagevalue") == 0){
            var pagevalue = list[i].split("=")[1];
            obj.pagevalue = pagevalue;
        }
        if(list[i].indexOf("c3") == 0){
            var c3 = list[i].split("=")[1];
            obj.c3 = c3;
        }
        if(list[i].indexOf("orderId") == 0){
            var orderId = list[i].split("=")[1];
            obj.orderId = orderId;
        }
        if(list[i].indexOf("venderId") == 0){
            var venderId = list[i].split("=")[1];
            obj.venderId = venderId;
        }
        if(list[i].indexOf("promotionId") == 0){
            var promotionId = list[i].split("=")[1];
            obj.promotionId = promotionId;
        }
        if(list[i].indexOf("terminal") == 0){
            var terminal = list[i].split("=")[1];
            obj.terminal = terminal;
        }
        if(list[i].indexOf("invitingUser") == 0){
            var invitingUser = list[i].split("=")[1];
            obj.invitingUser = invitingUser;
        }
        if(list[i].indexOf("chatId") == 0){
            var chatId = list[i].split("=")[1];
            obj.chatId = chatId;
        }
        if(list[i].indexOf("entry") == 0){
            var entry = list[i].split("=")[1];
            obj.entry = entry;
        }
        if(list[i].indexOf("referer") == 0){
            var referer = list[i].split("=")[1];
            obj.referer = referer;
        }
    }
    return obj;
}

function ReplaceTags(xStr){
    xStr = xStr.replace(/<\/?[^>]+>/gi, "");
    return xStr;
}

function replaceSpecialChart(inputStr){
    var temp = inputStr;
    if(temp != null){
        temp = temp.replaceAll("<", "&lt;");
        temp = temp.replaceAll(">", "&gt;");
        temp = temp.replaceAll("\"", "&quot;");
    }
    return temp;
}

function getPosition(ele){
    return {
        'top':$(ele).offset().top,
        'left':$(ele).offset().left
    };
}

function isCustomerEntrance() {
    return window.entrance == "customer";
}

//关闭浏览器
function windowclose() {
    var browserName = navigator.appName;
    if(browserName == "Netscape") {
        $(document).attr("title", "新的标签页");
        window.open('', '_self', '');
        window.close();
        window.location.replace("about:blank");
        var opened = window.open("about:blank", "_self");
        opened.opener = null;
        opened.close();
    } else {
        window.opener = null;
        window.open('', '_top');
        window.close();
    }
}

/**
 * 发送一个ajax请求，返回promise
 * @param url
 * @param data
 * @param sucessHandle
 * @param errorHandle
 * @returns {*}
 */
function statisticAjaxReq(url,data,sucessHandle,errorHandle){
    data = $.extend(data, {'source':window.jimiSource});
    return $.ajax({
        url:url,
        type:'post',
        dataType:'json',
        data:data,
        success:sucessHandle,
        error:errorHandle
    });
}

/**
 * 向大数据sp.jimi.jd.com，发送一个埋点请求
 * @param data
 */
function sendSpReq(data) {
    data = $.extend(data, {'source':window.jimiSource, '__':$.cookie('_robotAccess_'), '_':new Date().getTime()});
    $('<img src="//sp-jimi.jd.com/userAction/insert?'+ $.param(data) +'"/>');
}

function getLastestMonthOrder(callback){
    var isLogin = package("v.login").isLogin();
    if(!isLogin) {
        return;
    }
    $.ajax({
        type: "get",
        url:'/lastestMonthOrder/getLatestMonthOrderList.action?t=' + new Date().getTime(),
        success: callSuccess,
        dataType:"json"
    });
    function callSuccess(data){
        var orders = null;
        if(data && data.state && data.data){
            data.refreshContent = data.switchWare = false;
            var newAnswer = new AnswerFactory.createAnswer('orderList', data);
            var ele = $("#orderListDiv");
            newAnswer.show(ele, false, false);
            $(window).trigger("resize");
        } else {
            $("#orderListDiv").html('<div class="jimi-noOrder-jumbotron"><p>您最近没有订单哦～</p></div>');
        }
        callback && callback(data);
    };
}

//获取商品信息
function getProductInfo(){
    $.ajax({
        type: "get",
        url:'/product/getProductInfo.action?t=' + new Date().getTime(),
        data:{
            'productId':productId
        },
        success: callSuccess,
        dataType:"json"
    });
    function callSuccess(data){
        if(!data || !data.state){
            return ;
        }
        var newAnswer = new AnswerFactory.createAnswer(data.resultType, data);
        var ele = $("#productDetailDiv");
        newAnswer.show(ele, false, false);

        //根据商品信息修改人工客服链接
        var param = skipImParamBuild(data.wareDetailsBean);
        var skipURL = '//chat.jd.com/index.action?'+param;
        $(".service-online").find("a").attr("href",skipURL);

        //请求im-jsonp接口，看客服是否在线

        $.ajax({
            type: "get",
            url:'//chat1.jd.com/api/checkChat?pid='+productId,
            dataType:"jsonp",
            success:function(data){
                //urlParamObj.code = data.code;
                if(data.code!=1 && data.code!=3){//不显示人工客服
                    $(".service-online").hide();
                } else {
                    $(".service-online").show();
                }
            },
            error: function(data){
                $(".service-online").hide();
            }
        });

        $(window).trigger("resize");
    };
}

//拼接跳转im的参数
function skipImParamBuild(data){
    var param = "pid="+data.wid+"&";
    if(data.imageurl){
        var imageURL = data.imageurl;
        var re = /http:\/\/img.*.360buyimg.com\/n[^\/]*\/(.*)/ig;
        var r = "";
        while(r = re.exec(imageURL)){
            imageURL = r[1];
        }
        param = param+"imgUrl="+encodeURI(encodeURI(imageURL))+"&";
    }
    if(data.wmeprice){
        param = param+"price="+encodeURI(encodeURI(data.wmeprice))+"&";
    }
    if(data.stock){
        param = param+"stock="+encodeURI(encodeURI(data.stock))+"&";
    }
    if(data.averageScore){
        param = param+"score="+encodeURI(encodeURI(data.averageScore))+"&";
    }
    if(data.commentNum){
        param = param+"commentNum="+encodeURI(encodeURI(data.commentNum))+"&";
    }
    if(data.slogan){
        param = param+"advertiseWord="+encodeURI(encodeURI(data.slogan))+"&";
    }
    if(data.goodRate){
        var evaluationRate = data.goodRate;
        var index = evaluationRate.indexOf("%");
        evaluationRate = evaluationRate.substring(0,index);
        param = param+"evaluationRate="+encodeURI(encodeURI(evaluationRate))+"&";
    }
    if(data.service){
        param = param+"services="+encodeURI(encodeURI(data.service))+"&";
    }
    if(data.wname){
        param = param+"wname="+encodeURI(encodeURI(data.wname));
    }
    return param;
}

//前端显示一条消息
function showMes(name, message, obj) {
    if('我'==name){
        var question = new AnswerFactory.createAnswer('question', message);
        var ele = $("#chatcontent");
        question.show(ele, true, true);
        $("#text-in").val('');
    }else if('JIMI' == name){
        var data={
            'answer':message,
            'fe': true
        };
        var answer = new AnswerFactory.createAnswer('common', data);
        var ele = $("#chatcontent");
        answer.show(ele, true, true);
    }
    setScroll();
}

function replaceMsg(message,item){
    item.find('.mm .wel').html(message);
    setScroll();
}

//重置滚动条
function setScroll() {
    var $nano = $(".l-area-content .nano");
    $nano.nanoScroller({ alwaysVisible: true });
    $nano.nanoScroller({ scroll: 'bottom'});

    if($('.l-area-content').find('.normal').length>0){

        if($('.pane').css("display")=="block") {
            var $thumb=$('.l-area-content .thumb');
            var $normal=$('.l-area-content .normal');
            $normal.hide();
            $thumb.show();

            $('.top-banner').addClass("has-thumb");
            var view = package("v.adjustView");
            view.config({
                minHeight: 200,
                container: 0,
                chatcontent:154,//112聊天窗口高度+42顶部工具栏高度
                inputWidth: 16
            });
            view.adaptHeight();
        }
    }

}

//发错货场景查看更多需要特殊处理滚动位置
function scrollTo(node,parent,justify) {
    var $nano = $(".l-area-content .nano");
    var justify = justify || 10;
    $nano.nanoScroller({ alwaysVisible: true,scrollTop: node.get(0).offsetTop + parent.get(0).offsetTop + justify});
}


//自动设置滚动条，防止最后一条消息被遮住
function autoScroll() {
    var $lastDiv = $("#chatcontent>div:last");
    var lastTop = getPosition($lastDiv)["top"] + $lastDiv.height();
    var inputTop = getPosition($(".edit-block"))["top"];
    if (lastTop > inputTop && lastTop < inputTop + 110) {
        setScroll();
    }
}
/**
 * Created with JetBrains WebStorm.
 * User: yinyanming
 * Date: 13-8-19
 * Time: 下午3:38
 * To change this template use File | Settings | File Templates.
 */


/**
 * 查询配送选择地区
 *
 * @module view
 * @class v.shortcut.Dispatching
 * @constructor
 *
 */
package("v.shortcut.Dispatching", [], function (require, exports, moudle) {
  (function ($, window) {
    /**
     * 该方法调用区域选择组件
     * @param dom
     * @param onSccess 选择完成后回调
     * @param onShow 显示时的回调
     * @param onInit 生成选择框时的回调
     */
    function district(dom, onSccess, onShow, onInit) {
      $.ajax({
        type : "post",
        url : '/delivery/deliveryInitAddress.action?t=' + new Date().getTime(),
        dataType: "json",
        scriptCharset: "utf-8"
      }).success(function(json) {
        var initData = [];
        var initCodeArr = [];
        var areaData =  json.data;

        if (areaData.province) {
          initData.push(areaData.province);
          initCodeArr.push(areaData.province.selected.id);
        }
        if (areaData.city) {
          initData.push(areaData.city);
          initCodeArr.push(areaData.city.selected.id);
        }
        if (areaData.area) {
              initData.push(areaData.area);
              initCodeArr.push(areaData.area.selected.id);
        }
        if (areaData.fouth) {
          initData.push(areaData.fouth);
          initCodeArr.push(areaData.fouth.selected.id);
        }

        panda.ready(function(require, exports, module) {
          // select 1个不满足 需要支持4个
          var district = new panda.widget.manager.get(require("widget.District"), {
            target: panda.query(dom),
            url: "/delivery/getNextArea.action",
            select: 1,
            level: 4,
            title: areaData.address,
            initData: initData,
            initCode: initCodeArr,
            mouseLeaveHide: true,
            onShow: function() {
              (typeof onShow == "function") && onShow();
            },
            onClose: function() {
              $(".j_dispatchingBottom").remove();
            },
            format: function(response) {
              eval("response=" + response);
              var data = [];

              if(response && response.data) {
                for(var i=0;i<response.data.length;i++) {
                  var area = response.data[i];
                  data.push({
                      name: area.name,
                      id: area.id
                  });
                }
              }

              (typeof onInit == "function") && onInit();
              return data;
            },

            success: function(code, display) {
              (typeof onSccess == "function") && onSccess(code, display);
            },
            debug: false
          });
        });
      });
    }


      /**
       * 生成货到付款地址查询组件接口
       * @param dom 要生成的地方
       */
      exports.drawMsgCod = function (dom) {
        district(dom,
          function (code, display) {
            $(dom).find(".text div").html(display.join(""));
            //查询货到付款地址格式为：北京_东城区_内环到三环里@1_2802_2821
           // sendRequest(display.join("_") + "@" + code.join("_"), 0, "", "", "","");
          },
          null,
          //点击展开选择框
          function() {
            if($(dom).find(".j_content").is(":hidden")) {
              $(dom).find(".text").trigger("click");
            }
          }
        );
      };


    /**
     * 生成配送服务查询组件接口
     * @param dom 要生成的地方
     */
    exports.drawBuyConsult = function (dom, $select) {
      district(dom,
        function (code, display) {
          var result = display.join("");
          $(dom).find(".text div").html(result);
          $select.find(".text>div").html(result);
          $select.data("code", code);
          exports.searchService(code);
        },
        null,
        //点击展开选择框
        function() {
          if($(dom).find(".j_content").is(":hidden")) {
            $(dom).find(".text").trigger("click");
          }
        }
      );
    };

    /**
     * 封装Ajax 对结果过滤 正确调用回调函数 错误抛出错误事件
     *
     * @method ajax
     * @param {Object} service 数据接口对象
     * @param {Object} data Ajax的参数
     * @param {Function} callback 回调函数
     * @private
     */
    exports.draw = function(json) {
      var id = "districtarea";
      district($("#" + id)[0], function(code, display){
        $("#" + id).data("code", code);
        $(".text div", "#" + id).html(display.join(""));
        $(".j_dispatchingBottom").remove();
        exports.searchService(code);
      });
    };

    /**
     * 确定查询服务
     *
     * @method searchService
     * @param {String} id 触发的DOM元素id
     */
    exports.searchService = function(code) {
      var codeArr = code;
      var nameArr = ['provinceId', 'cityId', 'areaId', 'fouthId'];

      if (codeArr) {
        var param = {};
        $.each(codeArr, function(i, v) {
          param[nameArr[i]] = v;
        });


        $.ajax({
          type : "post",
          url : '/delivery/delivery.action?t=' + new Date().getTime(),
          data : param,
          dataType: "json",
          scriptCharset: "utf-8"
        }).success(function(json) {
          //不再在聊天窗口中显示内容
          //package("m.data.Transform").searchService(json, package("v.shortcut.SearchService").draw);

          var goodsqarea=$("#district-result");
          goodsqarea.html("");
          json.type = "service";
          json.id = "j_service" + (new Date()).getTime();
          var tmpl = package('%7B%7Bif%20type%20%3D%3D%20%22goodsServiceGuide%22%20%7D%7D%3Cul%20class%3D%22jimi-goodsquery%22%20xmlns%3D%22http%3A//www.w3.org/1999/html%22%3E%3Cli%3E%u8BF7%u8F93%u5165%26nbsp%3B%3Clabel%20class%3D%22red%22%3E%u5546%u54C1%u94FE%u63A5%3C/label%3E%26nbsp%3B%u6216%26nbsp%3B%3Clabel%20class%3D%22red%22%3E%u5546%u54C1%u7F16%u53F7%3C/label%3E%uFF0CJIMI%u5C06%u5E2E%u60A8%u67E5%u8BE2%u8BE5%u5546%u54C1%u4EAB%u53D7%u7684%u552E%u540E%u670D%u52A1%u3002%3C/li%3E%3Cli%20class%3D%22linkURL%22%3E%u5546%u54C1%u94FE%u63A5%uFF0C%u4F8B%u5982%3Ahttp%3A//item.jd.com/939616.html%3C/li%3E%3Cli%3E%u5546%u54C1%u7F16%u53F7%uFF0C%u5982%u4F55%u67E5%u770B%uFF1F%3C/li%3E%3Cli%3E1.%u6253%u5F00%u5546%u54C1%u9875%u9762%3C/li%3E%3Cli%3E2.%u5F80%u4E0B%u62C9%u9875%u9762%uFF0C%u67E5%u770B%u201C%u5546%u54C1%u4ECB%u7ECD%u201D%u4E2D%u7684%u5546%u54C1%u7F16%u53F7%3C/li%3E%3C/ul%3E%7B%7Belse%20type%20%3D%3D%20%22idError%22%7D%7D%3Cul%20class%3D%22jimi-goodsquery%22%3E%3Cli%3E%u60A8%u8F93%u5165%u7684%u5546%u54C1%u7F16%u53F7%u4E0D%u6B63%u786E%uFF0CJIMI%u8BC6%u522B%u4E0D%u4E86%u5462%3C/li%3E%3Cli%3E%u60A8%u8BD5%u8BD5%u91CD%u65B0%u67E5%u8BE2%u540E%u518D%u8F93%u5165%uFF1F%3C/li%3E%3Cli%3E1.%u6253%u5F00%u5546%u54C1%u9875%u9762%3C/li%3E%3Cli%3E2.%u5F80%u4E0B%u62C9%u9875%u9762%uFF0C%u67E5%u770B%3Clabel%20class%3D%22bold%22%3E%u5546%u54C1%u4ECB%u7ECD%3C/label%3E%u4E2D%u7684%u5546%u54C1%u7F16%u53F7%3C/li%3E%3Cli%3E%u5982%u679C%u60A8%u8FD8%u662F%u627E%u4E0D%u5230%u5546%u54C1%u7F16%u53F7%uFF0C%u53EF%u4EE5%u8054%u7CFB%20%3Ca%20class%3D%22blue%22%20onclick%3D%22transformOut%28%29%22%3E%u4EBA%u5DE5%u5BA2%u670D%3C/a%3E%20%u5594%u3002%3C/li%3E%3C/ul%3E%7B%7Belse%20type%20%3D%3D%20%22wareAfsDetailJumpError%22%7D%7D%3Cul%20class%3D%22jimi-goodsquery%22%3E%3Cli%3E%u60A8%u60F3%u67E5%u8BE2%u5546%u54C1884641%u7684%u4EC0%u4E48%u4FE1%u606F%u5462%uFF1F%3C/li%3E%3Cli%20class%3D%22blue%22%3E%u5546%u54C1%u57FA%u672C%u4FE1%u606F%3C/li%3E%3Cli%20class%3D%22blue%22%3E%u5546%u54C1%u4FC3%u9500%u4FE1%u606F%3C/li%3E%3Cli%20class%3D%22blue%22%3E%u552E%u540E%u670D%u52A1%3C/li%3E%3C/ul%3E%7B%7Belse%20type%20%3D%3D%20%22goodsService%22%7D%7D%3Cul%20class%3D%22jimi-goodsquery%22%20style%3D%22width%3A%20410px%22%3E%3Cli%3E%u60A8%u6240%u67E5%u8BE2%u7684%u5546%u54C1%u662F%uFF1A%3C/li%3E%3Cli%20class%3D%22image%22%3E%3Cimg%20src%3D%22/jimi/img/goods-image.png%22%20width%3D%2250px%22%20height%3D%2250px%22%3E%3Cspan%20class%3D%22blue%22%3E%u6C83%u5BB6%20%u590F%u88C5%u5706%u9886%u65E0%u8896%u80CC%u5FC3%u88D9%u5047%u4E24%u4EF6%u5957%u4F18%u8D28%u96EA%u7EBA%u8FDE%u8863%u88D9%206516%20%u6854%u8272%u706B%u70ED%u652F%u6301%u8D27%u5230%u4ED8%u6B3E%uFF01%3C/span%3E%3C/li%3E%3Cli%3E%u672C%u4EA7%u54C1%u5168%u56FD%u8054%u4FDD%uFF0C%u4EAB%u53D7%u4E09%u5305%u670D%u52A1%uFF0C%u8D28%u4FDD%u671F%u4E3A%uFF1A%u4E8C%u5E74%u8D28%u4FDD%3C/li%3E%3Cli%3E%u5982%u56E0%u8D28%u91CF%u95EE%u9898%u6216%u6545%u969C%uFF0C%u51ED%u5382%u5546%u7EF4%u4FEE%u4E2D%u5FC3%u6216%u7279%u7EA6%u7EF4%u4FEE%u70B9%u7684%u8D28%u91CF%u68C0%u6D4B%u8BC1%u660E%uFF0C%u4EAB%u53D77%u65E5%u5185%u9000%u8D27%uFF0C15%u65E5%u5185%u6362%u8D27%uFF0C15%u65E5%u4EE5%u4E0A%u5728%u8D28%u4FDD%u671F%u5185%u4EAB%u53D7%u514D%u8D39%u4FDD%u4FEE%u7B49%u4E09%u8D39%u4FDD%u4FEE%u7B49%u4E09%u5305%u670D%u52A1%uFF01%3C/li%3E%3Cli%3E%u552E%u540E%u670D%u52A1%u7535%u8BDD%uFF1A400-820-8387%3C/li%3E%3Cli%3E%u54C1%u724C%u5B98%u65B9%u7F51%u7AD9%uFF1A%3Ca%20class%3D%22blue%22%20target%3D%22_blank%22%20href%3D%22%23%22%3Ehttp%3A//www.fujisu.com/cn/%3C/a%3E%3C/li%3E%3C/ul%3E%7B%7Belse%20type%20%3D%3D%20%22JDGoodsService%22%7D%7D%3Cul%20class%3D%22jimi-goodsquery%22%20style%3D%22width%3A%20410px%22%3E%3Cli%3E%u60A8%u6240%u67E5%u8BE2%u7684%u5546%u54C1%u662F%uFF1A%3C/li%3E%3Cli%20class%3D%22image%22%3E%3Cimg%20src%3D%22/jimi/img/goods-image.png%22%20width%3D%2250px%22%20height%3D%2250px%22%3E%3Cspan%20class%3D%22blue%22%3E%u6C83%u5BB6%20%u590F%u88C5%u5706%u9886%u65E0%u8896%u80CC%u5FC3%u88D9%u5047%u4E24%u4EF6%u5957%u4F18%u8D28%u96EA%u7EBA%u8FDE%u8863%u88D9%206516%20%u6854%u8272%u706B%u70ED%u652F%u6301%u8D27%u5230%u4ED8%u6B3E%uFF01%3C/span%3E%3C/li%3E%3Cli%3E%u60A8%u67E5%u8BE2%u7684%u5546%u54C1%u4EAB%u53D7%3Clabel%20class%3D%22red%22%3E%u4EAC%u4E1C%u81EA%u8425%3C/label%3E%u5546%u54C1%u552E%u540E%u670D%u52A1%uFF0C%3Clabel%20class%3D%22blue%22%3E%u67E5%u770B%u552E%u540E%u670D%u52A1%u8BE6%u60C5%3C/label%3E%3C/li%3E%3C/ul%3E%7B%7Belse%20type%20%3D%3D%20%22threeGoodsService%22%7D%7D%3Cul%20class%3D%22jimi-goodsquery%22%20style%3D%22width%3A%20410px%22%3E%3Cli%3E%u60A8%u6240%u67E5%u8BE2%u7684%u5546%u54C1%u662F%uFF1A%3C/li%3E%3Cli%20class%3D%22image%22%3E%3Cimg%20src%3D%22/jimi/img/goods-image.png%22%20width%3D%2250px%22%20height%3D%2250px%22%3E%3Cspan%20class%3D%22blue%22%3E%u6C83%u5BB6%20%u590F%u88C5%u5706%u9886%u65E0%u8896%u80CC%u5FC3%u88D9%u5047%u4E24%u4EF6%u5957%u4F18%u8D28%u96EA%u7EBA%u8FDE%u8863%u88D9%206516%20%u6854%u8272%u706B%u70ED%u652F%u6301%u8D27%u5230%u4ED8%u6B3E%uFF01%3C/span%3E%3C/li%3E%3Cli%3E%u60A8%u67E5%u8BE2%u7684%u5546%u54C1%u4EAB%u53D7%3Clabel%20class%3D%22red%22%3E%u7B2C%u4E09%u65B9%u5356%u5BB6%3C/label%3E%u5546%u54C1%u552E%u540E%u670D%u52A1%uFF0C%u67E5%u770B%u552E%u540E%u670D%u52A1%u8BE6%u60C5%3Cbr%3E%u60A8%u4E5F%u53EF%u4EE5%u54A8%u8BE2%3Clabel%20class%3D%22red%22%3E%u5356%u5BB6%u5BA2%u670D%3C/label%3E%u5594%u3002%3C/li%3E%3C/ul%3E%7B%7Belse%20type%20%3D%3D%20%22service%22%7D%7D%3Cdiv%20class%3D%22jimi-chat-title%22%3E%u8BE5%u5730%u533A%u652F%u6301%u7684%u914D%u9001%u670D%u52A1%uFF1A%3C/div%3E%7B%7Beach%20data%7D%7D%3Cdiv%20class%3D%22delivery-detail%20clearfix%22%3E%7B%7Bif%20deliveryServiceName%20%3D%3D%20%22211%u9650%u65F6%u8FBE%22%7D%7D%3Cdiv%20class%3D%22delivery-detail-img1%20fl%22%3E%3C/div%3E%7B%7Belse%20deliveryServiceName%20%3D%3D%20%22%u5927%u5BB6%u7535211%22%7D%7D%3Cdiv%20class%3D%22delivery-detail-img6%20fl%22%3E%3C/div%3E%7B%7Belse%20deliveryServiceName%20%3D%3D%20%22%u8D27%u5230%u4ED8%u6B3E%22%7D%7D%3Cdiv%20class%3D%22delivery-detail-img2%20fl%22%3E%3C/div%3E%7B%7Belse%20deliveryServiceName%20%3D%3D%20%22%u5B9A%u65F6%u8FBE%22%7D%7D%3Cdiv%20class%3D%22delivery-detail-img7%20fl%22%3E%3C/div%3E%7B%7Belse%20deliveryServiceName%20%3D%3D%20%22%u5F00%u7BB1%u9A8C%u673A%22%7D%7D%3Cdiv%20class%3D%22delivery-detail-img3%20fl%22%3E%3C/div%3E%7B%7Belse%20deliveryServiceName%20%3D%3D%20%22%u81EA%u63D0%22%7D%7D%3Cdiv%20class%3D%22delivery-detail-img8%20fl%22%3E%3C/div%3E%7B%7Belse%20deliveryServiceName%20%3D%3D%20%22%u591C%u95F4%u914D%22%7D%7D%3Cdiv%20class%3D%22delivery-detail-img4%20fl%22%3E%3C/div%3E%7B%7Belse%20deliveryServiceName%20%3D%3D%20%22%u6781%u901F%u8FBE%22%7D%7D%3Cdiv%20class%3D%22delivery-detail-img9%20fl%22%3E%3C/div%3E%7B%7Belse%20deliveryServiceName%20%3D%3D%20%22%u7B2C%u4E09%u65B9%u914D%u9001%22%7D%7D%3Cdiv%20class%3D%22delivery-detail-img10%20fl%22%3E%3C/div%3E%7B%7Belse%20deliveryServiceName%20%3D%3D%20%22%u552E%u540E%u5230%u5BB6%22%7D%7D%3Cdiv%20class%3D%22delivery-detail-img11%20fl%22%3E%3C/div%3E%7B%7Belse%20deliveryServiceName%20%3D%3D%20%22%u514D%u8FD0%u8D39%22%7D%7D%3Cdiv%20class%3D%22delivery-detail-img12%20fl%22%3E%3C/div%3E%7B%7Belse%20deliveryServiceName%20%3D%3D%20%22%u5FEB%u901F%u9000%u6B3E%22%7D%7D%3Cdiv%20class%3D%22delivery-detail-img13%20fl%22%3E%3C/div%3E%7B%7Belse%20deliveryServiceName%20%3D%3D%20%22%u4EAC%u4E1C%u914D%u9001%22%7D%7D%3Cdiv%20class%3D%22delivery-detail-img14%20fl%22%3E%3C/div%3E%7B%7Belse%20deliveryServiceName%20%3D%3D%20%22%u5148%u6B3E%u9001%u4EAC%u8C46%22%7D%7D%3Cdiv%20class%3D%22delivery-detail-img15%20fl%22%3E%3C/div%3E%7B%7Belse%7D%7D%3Cdiv%20class%3D%22delivery-detail-img1%20fl%22%3E%3C/div%3E%7B%7B/if%7D%7D%20%3Cp%20class%3D%22title%22%3E%3Ca%20href%3D%22%24%7BdeliveryServiceDetailURL%7D%22%20target%3D%22_blank%22%3E%24%7BdeliveryServiceName%7D%3C/a%3E%3C/p%3E%3Cp%3E%24%7BdeliveryServiceExplain%7D%3C/p%3E%3C/div%3E%7B%7B/each%7D%7D%20%7B%7B/if%7D%7D');
//          $.template('template', unescape(tmpl));
          var html = $('<div></div>').append($.tmpl('template', json)).html();
          goodsqarea.html(html);
          $(window).trigger("resize");
        });
      }
    };


    exports.init = function() {
      //给消息中的货到付款选择区域绑定事件
      var $distMsg = $("#districtarea-msg");
      exports.drawMsgCod($distMsg[0]);
      $("[data-type=district-cod]").live("click", function (event) {
        if ($distMsg.is(":hidden")) {
          $distMsg.find(".j_content").hide();
          $distMsg.show();
        }
        var x = event.clientX;
        var y = event.clientY;
        var wHeight = $(window).height();
        var wWidth = $(window).width();
        var jHeight = $distMsg.find(".j_content").height();
        var jWidth = $distMsg.find(".j_content").width();
        $distMsg.find(".text").trigger("click");
        //可能会超出屏幕高度时
        if ((y + 230) > wHeight) {
          $distMsg.css("top", (y - jHeight - 70) + "px");
        } else {
          $distMsg.css("top", (y - 10) + "px");
        }
        //可能超出屏幕宽度时
        if ((x + 430) > wWidth) {
          $distMsg.css("left", (x - 20) + "px");
        } else {
          $distMsg.css("left", (x + 320) + "px");
        }
      });

      //处理快捷查询中的配送服务
      if(!$("#district-consult").length) {
        $("body").append('<div id="district-consult"></div>');
      }
      var $districtConsult = $("#district-consult").hide();
      var interval = null;
      var intervalWait = 5000;
      interval = setInterval(function() {
        var $districtSelect = $("#district-consult-select");
        if($districtSelect.length) {
          exports.drawBuyConsult($districtConsult[0], $("#district-consult-select"));
          clearInterval(interval);
        }
        intervalWait -= 100;
        if(intervalWait <= 0) {
          clearInterval(interval);
        }
      }, 100);
      var hideWhenMouseleave = true;
      $(document).on("click", "#district-consult a[data-value]", function() {
        hideWhenMouseleave = false;
      })
      $("#district-consult-select").live("mouseenter", function(event) {
        hideWhenMouseleave = true;
        if($districtConsult.is(":hidden")){
          $districtConsult.find(".j_content").hide();
          $districtConsult.show();
        }
        if($districtConsult.find(".j_content").is(":visible")) {
          return;
        }
        var $this = $(this);
        var offset = $this.offset();
        $districtConsult.find(".text").trigger("click");
        $districtConsult.css("top", offset.top + 2);
        $districtConsult.css("left", offset.left + $this.width() - 50);
        //加一条小白线，模拟遮住的效果
        var $whiteLine = $districtConsult.find('.district-line');
        if(!$whiteLine.length) {
          $whiteLine = $('<div class="district-line"></div>').appendTo($districtConsult.find(".j_content"));
        }
        $whiteLine.width($this.width() -2);
        var needHide = false;
        $this.unbind("mouseleave").bind("mouseleave", function() {
          needHide = true;
          hideCtl();
        }).unbind("mouseenter").bind("mouseenter", function() {
          needHide = false;
        });
        $districtConsult.unbind("mouseleave").bind("mouseleave", function() {
          needHide = true;
          hideCtl();
        }).unbind("mouseenter").bind("mouseenter", function() {
          needHide = false;
        });
        var hideTimeout = null;
        var hideCtl = function() {
          clearTimeout(hideTimeout);
          hideTimeout = setTimeout(function() {
            if(needHide && hideWhenMouseleave) {
              $districtConsult.hide();
              clearTimeout(offsetHideTimeout);
            }
          }, 50);
        };

        var offsetHideTimeout = null;
        (function() {
          var func = arguments.callee;
          clearTimeout(offsetHideTimeout);
          offsetHideTimeout = setTimeout(function() {
            var currentOffset = $this.offset();
            if(offset.top != currentOffset.top || offset.left != currentOffset.left) {
              $districtConsult.hide();
              clearTimeout(offsetHideTimeout);
            } else {
              func();
            }
          }, 50);
        }());

      });
    };


    /**
     * 地区选择
     *
     * @method district
     * @param {String} id 触发的DOM元素
     */
    exports.district = district;
  })(jQuery, window);
  return exports;
});
/**
 * Created by cdchenzhengguo on 2014/10/8.
 */

/**
 * 关注模块
 *
 * @module view
 * @class v.shortcut.follow
 *
 */
package("v.follow", [], function (require, exports, moudle) {
  (function($, window, document) {
    /**
     * 获取设置已关注样式
     * @param $ele
     */
    exports.getStatus = function($ele) {
      var productIds = [];
      $ele.find("a.note-btn").each(function(){
        var wid = $(this).attr("title", "加关注").attr("productid");
        wid && productIds.push(wid);
      });
      if(productIds.length > 0) {
        var url = '//follow.soa.jd.com/product/batchIsFollow?productIds=' + productIds.join(",") + '&callback=?';
        $.getJSON(url,function(re) {
          if(re.success) {
            var query = [];
            for(var wid in re.data) {
              if (re.data[wid]) {
                query.push("[productid=" + wid + "]");
              }
            }
            if(query.length > 0) {
              $ele.find("a.note-btn").filter(query.join(",")).addClass("noted").html("已关注").attr("title", "已关注");
            }
          }
        });
      }
    };
    /**
     * 绑定关注/取消关注事件
     */
    (function() {
      $(document).on("click", ".isAddNote", function(){
        var ele = $(this);
        ele.blur();
        var wid = ele.attr("productId");
        if(!ele.hasClass("noted")) {
          var url = '//t.jd.com/product/followProduct.action?productId='+wid;
          //$.getJSON(url);
          $('<img style="display:none" src="' + url + '"/>').appendTo("body").remove();
          $(this).addClass("noted").html("已关注").attr("title", "已关注");
        } else {
          if(window.confirm("确定要取消关注该商品吗？")) {
            var url = '//t.jd.com/product/cancelFollow.action?productId='+wid+'&callback=?';
            $.getJSON(url);
            $(this).removeClass("noted").html("加关注").attr("title", "加关注");
          }
        }
      });
    }());

  }(jQuery, window, document));
  return exports;
});
/**
 * Created by cdchenzhengguo on 2014/10/20.
 */

/**
 * 登录控制模块
 *
 * @module view
 * @class v.shortcut.login
 *
 */

package("v.login", [], function (require, exports, moudle) {
  (function($, window, document) {
    var module = 'v.login';
    var $jumbotronTipsParent = $("#orderListDiv").show();
    var $msgTipsParent = $(".l-area .l-area-content .nano");
    var loginHtml1 = '<a href="javascript:;" clstag="JIMI|keycount|home2014|dl1" data-module="' + module + '" data-func="showLoginDialog">登录</a>'
    var loginHtml2 = '<a href="javascript:;" clstag="JIMI|keycount|home2014|dl2" data-module="' + module + '" data-func="showLoginDialog">登录</a>'
    var msgTips = '<div class="jimi-noLogin-msgTips"><p>您还未登录，登录之后JIMI更懂您，请点击' + loginHtml1 + '</p></div>';
    var orderTips = '<div class="jimi-noLogin-jumbotron"><p>您还未登录，JIMI暂时无法查询到您的最近订单，请点击' + loginHtml2 + '</p></div>';

    var getWelcome = function() {//原前端实现轮播话术，现已废弃
      var welcomes = ["亲爱的，请问有什么可以帮到您的呢？",
                      "您好，很高兴为您服务。",
                      "有问题？那就来问JIMI吧。",
                      "您好，JIMI竭诚为您服务。",
                      "Hi，JIMI在的哦，有事儿您说话？"];
      var index = parseInt(Math.random()*welcomes.length) || 0;
      return welcomes[index];
    };
    //是否展示萌宠
    function getPet(){
      $.ajax({
        type: "get",
        url: '/isShowPet.action',
        dataType: "json",
        success: function(res) {
          if(res.isShowPet == true){
            //JIMI展示萌宠
            package("v.myjimi.adopt").init("");
            isMyJimi = true;
            $('#container #grkj').hide();
            $('#embed #grkj').show();
            $("#lyjimi").show();
          }else{
            package("v.myspace").init();
                $('#container #grkj').show();
                  //隐藏jimi萌宠
                 $('#lyjimi').hide();
          }
        },
        error:function(){
          //个人空间和我的JIMI展示
          package("v.myspace").init();
          //隐藏jimi萌宠
          $('#lyjimi').hide();
        }
      });
    }
    // 获取用户头像url
    exports.getUserImageUrl=function(){
      $.ajax({
          type: "get",
          url: '/imageUrl.action',
          dataType: "json",
          success:function(data){
            exports.userImageUrl=data.userImageUrl;
            //教jimi说话模块，头像设置
            $(".popup-teach .header_img_hover").css("backgroundImage","url("+data.userImageUrl+")");
          },
          error:function(){
            exports.userImageUrl='//static.360buyimg.com/jimi/img/defaultUserImage/defaultImgLarge.png';
        }
        })
    };


    var statisticUI = function(type) {
      statisticAjaxReq('/newData/dataAction.action', {type:type});
    };

    var logMsgLogin = function(type, question, answer) {
      statisticAjaxReq('/newData/questionTriggerLoginAction.action', {type:type, question:question, answer:answer});
    };

    exports.isLogin = function() {
      return window.isLogin == "1";
    };
    exports.getOrder=function(){//这里多此一举主要是让嵌入页不调用getLastestMonthOrder()方法
      getLastestMonthOrder();
    }

    exports.showNoLoginTips = function() {
      $jumbotronTipsParent.html(orderTips);
      $msgTipsParent.find(".jimi-noLogin-msgTips").remove();
      $msgTipsParent.append(msgTips);
     /*if($('.pretext').length==0){
        sendRequest("defineWelcome", 3)
     }*/

    sendRequest("welcome", 2, undefined, undefined, undefined, undefined, $("<p>"));

      if($("#chatcontent .jimi-noLogin-blank").length == 0) {
        $("#chatcontent").prepend('<div class="jimi-noLogin-blank" style="height: 30px;"></div>');
      }
//      if($("#chatcontent .jimi_lists").length == 0) {
////        showMes("JIMI", '<span class="visitor">' + getWelcome() + '</span>');
//     }
      exports.getUserImageUrl();//未登陆时获取默认用户头像
    };

    exports.delAllMsgTips = function() {
      $("#chatcontent .jimi_lists").has("[data-module='"+module+"']").remove();
    };

    exports.delOldMsgTips = function() {
      var $msgs = $("#chatcontent .jimi_lists").has("[data-module='"+module+"']").slice(0, -1).remove();
    };

    exports.showLoginDialog = function(callback, hideThickcloser) {
      var question = $(this).data("question");
      var isOrderTips = $(this).attr("clstag") == "JIMI|keycount|home2014|dl2";
      var isWelcomeTips = $(this).attr("clstag") == "JIMI|keycount|home2014|dl3";
      var $replaceMsg = $("#chatcontent .jimi_lists").has($(this));

      var msgTrigger = true;
      if(!question) {
        var $lstLogin = $("#chatcontent .jimi_lists:last").find("[data-module='"+module+"']");
        if($lstLogin.length) {
          $replaceMsg = $("#chatcontent .jimi_lists:last");
          question = $lstLogin.data("question");
          msgTrigger = false;
        }
      }

      //消息框触发登录点击统计
      if(question) {
        //console.log("消息框触发登录统计-点击登录", {type: 1, question: question, answer: ""});
        logMsgLogin(1, question);
        //console.log("消息框触发登录统计-登录埋点-点击", {type: 38});
        msgTrigger && statisticUI(38);
      }
      //登录成功后的回调
      jdModelCallCenter.settings.fn = callback || function() {
        window.isLogin = "1";

        //  显示我的JIMI页面
//        if (isMyJimi) {
//            package("v.myjimi.adopt").init("adopt");
//        }
        getPet();


        //移除登录提示
        $("#chatcontent .jimi-noLogin-blank").remove();
        $msgTipsParent.find(".jimi-noLogin-msgTips").remove();
        $jumbotronTipsParent.find(".jimi-noLogin-jumbotron").remove();
        //获取订单
        exports.getOrder();
        //获取登录用户头像---在登陆成功后就会被调用
        exports.getUserImageUrl();

        //去掉开头语：游客，欢迎您
        $("#chatcontent .jimi_lists").has(".visitor").remove();

        $('.rightframe').attr("src",$('.rightframe').attr("src"));

        //如果有question，说明是聊天窗口里的登录，重新发送问题请求，并替换原来的内容
        if(question) {
          //消息框触发登录成功统计
          var recordLoginSuccess = function(answer) {
            //console.log("消息框触发登录统计-登录成功", {type: 2, question: question, answer: answer});
            logMsgLogin(2, question, answer);
            //console.log("消息框触发登录统计-登录埋点-成功", {type: 42});
            msgTrigger && statisticUI(42);
          };
          sendRequest(question, 0, undefined,undefined,undefined,undefined, $replaceMsg, recordLoginSuccess);
          //如果没有question，说明是其他地方的登录，登录成功后直接删掉聊天窗口里的登录提示
        } else {

          //如果要再次请求欢迎语，那就先删除原来的欢迎语呢~~
          //现在只有正则去找了
          var $firstJimiTalks = $("#chatcontent .jimi_lists");
          $firstJimiTalks.each(function() {
            var $this = $(this);
            if(/usergrade\.jd\.com/.test($this.find("a").attr("href"))) {
              $this.remove();
            }
          });


          //再次请求欢迎语
          sendRequest("welcome", 2);
          //不再调用
//         if($('.wel').length==0){
//            sendRequest("defineWelcome", 3)
//          }

//         sendRequest("defineWelcome", 3);

          if (isOrderTips) {
            //console.log("订单-登录埋点-成功", {type: 40});
            statisticUI(40);
          } else if(isWelcomeTips) {
            //console.log("开头语-登录埋点-成功", {type: 41});
            statisticUI(41);
          } else {
            //console.log("顶部提示-登录埋点-成功", {type: 39});
            statisticUI(39);
          }
          exports.delAllMsgTips();
        }
      };
      jdModelCallCenter.login();
      if(hideThickcloser) {
        var interval = setInterval(function() {
          var $thickcloser = $("#thickcloser");
          if($thickcloser.length) {
            $thickcloser.remove();
            clearInterval(interval);
          }
        }, 50);
      }
    };
    exports.getLoginStatus=function(){
      /*初始化获取登录状态免登陆列表*/
      var indexParam = {t: new Date().getTime()};
      var postdata={};
      postdata.source=window.jimiSource;
      postdata.productId=window.productId;
      postdata.chatId=window.chatId;
      postdata.referer=window.referer;
      window.loginRequest = false;
      $.ajax({
        type: "get",
        url: '/indexJson.action?' + $.param(indexParam),
        data:postdata,
        dataType: "json",
        success: function(res) {
          if(res.idelPushInterval){
            window.idleTime=parseInt(res.idelPushInterval);
          }
          window.noLoginSourceList=JSON.parse(res.noLoginSourceList);
          window.source1=res.source;
          window.tomanual="false";    //右上角转人工图标显示开关
          window.tomanual=res.tomanual;
          window.wsDomain = res.wsDomain;
          window.wsSwitch = res.wsSwitch;
          exports.sessionId=res.sessionId;
          if(res.tomanual=="true"){
            $('.service-online').show();
          }else{
            $('.service-online').hide();
          }

          window.defaultInput=res.speechcraft;
          if(res.isLogin=="true"){
            window.isLogin="1";
            sendRequest("welcome", 2);
            // if($('.pretext').length==0){
            //   sendRequest("defineWelcome", 3)
            // }
            exports.getOrder();
            exports.getUserImageUrl();//获取登录用户头像---登录后，刷新页面会被调用
          }else{
            window.isLogin="0";
            if($.inArray(window.jimiSource || "other", window.noLoginSourceList) > -1){
              exports.showNoLoginTips();
           }else{
             exports.showLoginDialog(function () {
               window.location.reload();
             }, true);
            }
          }
          window.loginRequest = true;
        },
        error:function(){
          exports.showNoLoginTips();
          window.isLogin="0";
          window.noLoginSourceList=[];
//          exports.showLoginDialog(function () {
//            window.location.reload();
//          }, true);
        }
      });
      // 发送欢迎语
      sendRequest("defineWelcome", 3);
    }

    function getUserState() {
        $.ajax({
            type: "get",
            url: "/ask/getUserState.action?t=" + new Date().getTime(),
            dataType: "json",
            success: function (res) {
                window.userState = res;
                if (res) {
                    if ($msgTipsParent.find(".jimi-noLogin-msgTips").length > 0) {
                        //移除登录提示
                        $("#chatcontent .jimi-noLogin-blank").remove();
                        $msgTipsParent.find(".jimi-noLogin-msgTips").remove();
                        $jumbotronTipsParent.find(".jimi-noLogin-jumbotron").remove();

                        //获取订单
                        exports.getOrder();
                        //是否展示萌宠
                        getPet();
                        //尝试获取最后一个问题，并回答
                        var $lstLogin = $("#chatcontent .jimi_lists:last").find("[data-module='" + module + "']");
                        if ($lstLogin.length) {
                            var $replaceMsg = $("#chatcontent .jimi_lists:last");
                            var question = $lstLogin.data("question");
                            sendRequest(question, 0, undefined, undefined, undefined, undefined, $replaceMsg);
                        } else {
                            exports.delAllMsgTips();
                        }
                    }
                } else {
                    if ($.inArray(jimiSource || 'other', window.noLoginSourceList) > -1 && $msgTipsParent.find(".jimi-noLogin-msgTips").length == 0) {
                        exports.showNoLoginTips();
                        getPet();
                        if($('.masking-guide-start').length>0){//萌宠模态框
                            $('.masking-guide-start').remove();
                            $("#masterDiv").hide()
                        }
                    }
                }
            }
        });
    }
    function init() {
      getPet();
      exports.getLoginStatus();
      getUserState();
      setInterval(getUserState, 10 * 1000);
    }
    exports.init = init;
  }(jQuery, window, document));

  return exports;
});

package("v.shortcut.login", [], function(require, exports, moudle) {
  $(document).on("click", "[data-module='v.shortcut.login'], [data-module='v.login']", function() {
    var method = $(this).data("func");
    if(typeof(exports[method]) == "function") {
      exports[method].call(this);
    }
  });
  exports = package("v.login");
  return exports;
});

/**
 * Created by cdchenzhengguo on 2014/10/27.
 */

/**
 * 评价相关的模块，包括主动评价和邀评
 *
 * @module view
 * @class v.invite
 *
 */

package("v.invite", [], function (require, exports, moudle) {
  (function ($, window, document) {
    //邀评的source
    exports.logSource = 5;
    //主动评价的source
    exports.jimiSatisfySource = "0";
    //已经评价过
    exports.hasComment = false;
    //是否是5分评价
    exports.isFiveFeedback = false;
    //默认好评
    exports.defaultBestSatisfy = false;
    //在页面中关闭时显示评价
    exports.showFeedbackWhenClose = true;
//    var inputflag=false; //默认用户未输入
    //邀评的样式
    var inviteTemplate = 1,
        inviteStyle = 1,
        inviteBtnMsg = 1,
        evaluatetemplate = 10000;
    var isFromShortcut = false;
    //设置邀评的样式
    exports.setInviteTemplate = function(tId, eId) {
      inviteTemplate = tId;
      evaluatetemplate = eId || 10000;
      inviteStyle = ((tId-1)%3 + 1) || 1;
      inviteBtnMsg = inviteTemplate>3 ? 2 : 1;
    }

    var inviteMessages = {
      "1": "主人来都来了，评价一个先，拜托拜托～",
      "2": "JIMI给主人卖个萌，给个评价拜托拜托～",
      "3": "JIMI正在攒人品，主人快给个评价吧，拜托拜托～"
    };

    var hasShowed = false;
    exports.show = function() {
      if(hasShowed || exports.hasComment) return;
      hasShowed = true;

      if(exports.isFiveFeedback) {
        showMes("JIMI", inviteMessages[exports.inviteStyle] +
            '<div class="jimi-invite-5">\
            <ul class="invite-star-box clearfix">\
              <li class="invite-star" data-score="20" data-des="非常不满意"></li>\
              <li class="invite-star" data-score="40" data-des="不满意"></li>\
              <li class="invite-star" data-score="60" data-des="一般"></li>\
              <li class="invite-star" data-score="80" data-des="满意"></li>\
              <li class="invite-star" data-score="100" data-des="非常满意"></li>\
              <li class="invite-star-tips invite-start-tips-init">点击红心给JIMI打分</li>\
            </ul>\
            <div class="invite-jimi-img"><img src="//static.360buyimg.com/jimi/img/invite/jimi_'+exports.inviteStyle+'_0.gif"/></div>\
            <div class="jimi-invite-reason common-hide">\
            <p>主人，您为什么不喜欢我？</p>\
            <label class="radio-type"><input type="checkbox" name="invitereason-check" value="问题不能解答"> 问题不能解答</label> \
            <label class="radio-type"><input type="checkbox" name="invitereason-check" value="答非所问"> 答非所问</label> \
            <label class="radio-type"><input type="checkbox" name="invitereason-check" value="回答方式不满意"> 回答方式不满意</label> \
            <br/>\
            <input class="jimi-invite-reason-words" name="invitereason" type="text"/>\
            <p class="words-restrict words-restrict-color">您还可以输入100字</p>\
            </div>\
            <div class="err-tip" style="color: red; width: 176px; top: 100px; left: 75px;display: none;"></div>\
            <a class="common-btn common-hide" href="javascript:;">提交</a>\
            </div>'
        );
        var $inviteWrap = $("#chatcontent .jimi-invite-5:last");
        $inviteWrap.find(".invite-star").mouseenter(function() {
          var $this = $(this);
          $this.addClass("invite-star-hover");
          $this.prevAll('.invite-star').addClass("invite-star-hover");
          $this.nextAll('.invite-star').removeClass("invite-star-hover");
          $this.siblings('.invite-star-tips').removeClass('invite-start-tips-init').html($this.data('des'));
          var score = parseInt($this.data('score'));
          var src =  '//static.360buyimg.com/jimi/img/invite/jimi_'+inviteStyle+'_'+(score >= 80 ? '1' :'2')+'.gif';
          if($inviteWrap.find('.invite-jimi-img img').attr('src') != src) {
            $inviteWrap.find('.invite-jimi-img img').attr('src', src);
          }
        }).click(function() {
          var $this = $(this);
          $this.addClass('invite-start-selected').siblings('.invite-start-selected').removeClass('invite-start-selected');
          var score = parseInt($this.data('score'));
          $inviteWrap.find('.common-btn').removeClass('common-hide');
          if(score < 80) {
            $inviteWrap.find(".jimi-invite-reason").show();
          } else {
            $inviteWrap.find(".jimi-invite-reason").hide();
          }
          autoScroll();
        });
        $inviteWrap.find('.invite-star-box').mouseleave(function(){
          var $this = $(this);
          var $select = $this.find('.invite-start-selected');
          if(!$select.length) {
            $this.find('.invite-star').removeClass("invite-star-hover");
            $this.find('.invite-star-tips').addClass('invite-start-tips-init').html('点击红心给JIMI打分');
            $this.siblings('.invite-jimi-img').find('img').attr('src','//static.360buyimg.com/jimi/img/invite/jimi_'+inviteStyle+'_0.gif');
          } else {
            $select.addClass("invite-star-hover");
            $select.prevAll('.invite-star').addClass("invite-star-hover");
            $select.nextAll('.invite-star').removeClass("invite-star-hover");
            $select.siblings('.invite-star-tips').removeClass('invite-start-tips-init').html($select.data('des'));
            var src =  '//static.360buyimg.com/jimi/img/invite/jimi_'+inviteStyle+'_'+(parseInt($select.data('score')) >= 80 ? '1' :'2')+'.gif';
            if($inviteWrap.find('.invite-jimi-img img').attr('src') != src) {
              $inviteWrap.find('.invite-jimi-img img').attr('src', src);
            }
          }
        });

        $inviteWrap.find("input").iCheck({
          checkboxClass: 'icheckbox_square-blue',
          radioClass: 'iradio_square-blue',
          increaseArea: '20%' // optional
        });
        if(exports.defaultBestSatisfy) {
          $inviteWrap.find(".invite-star:last").trigger("mouseenter").trigger("click");
        }
        var timeout = null;
        var $reasonInput = $inviteWrap.find("[name=invitereason]");
        var tips = '输入您要反馈的内容';
        $reasonInput.focus(function() {
          $(this).css('color', '#333');
          if($(this).val() == tips) {
            $(this).val('')
          }
        }).blur(function() {
          if($(this).val() == '') {
            $(this).val(tips).css('color', '#ccc');
          }
        }).val(tips).css('color', '#ccc');

        var checkLength = function() {
          var leftLength = 100 - (($reasonInput.val()==tips) ? 0 : $reasonInput.val().length);
          if(leftLength >= 0) {
            $inviteWrap.find('.words-restrict').removeClass('common-red').addClass('words-restrict-color').html("您还可以输入"+leftLength+"字");
            return true;
          } else {
            $inviteWrap.find('.words-restrict').removeClass('words-restrict-color').addClass('common-red').html("您已超出"+(leftLength*-1)+"字");
            return false;
          }
        }
        $reasonInput.bind('input propertychange', checkLength);
        //Fix IE9 BUG
        if($.browser.msie && $.browser.version == "9.0") {
          setInterval(checkLength, 50);
        }

        $inviteWrap.find("a.common-btn").click(function() {
          var score = parseInt($inviteWrap.find(".invite-start-selected").data("score"));
          var $reasons = $inviteWrap.find("[name=invitereason-check]:checked");
          var reason = $.trim($reasonInput.val()).substr(0, 100);

          if(score<80 && $reasons.length==0 && (!reason || reason==tips)) {
            $inviteWrap.find(".err-tip").html("请勾选原因或给JIMI反馈，谢谢").show();
            clearTimeout(timeout);
            timeout = setTimeout(function() {
              $inviteWrap.find(".err-tip").fadeOut();
            }, 1000);
            return false;
          }
          if(score<80 && !checkLength()) {
            return false;
          }

          $reasons.each(function() {
            reason = $(this).val() + ',' + reason;
          });
          $inviteWrap.find('.common-btn').after('<div class="jimi-invite-thanks">感谢您的评价！</div>');

          //评价日志
          sessionSatisfied(score, reason, exports.logSource);
          //标记已经评价
          exports.hasComment = true;
          //阻止所有事件
          $inviteWrap.find(".invite-star, .common-btn").unbind();
          $inviteWrap.find(".common-btn").css("background-color", "#ccc");
          //3秒后消失
          setTimeout(function() {
            $("#chatcontent .jimi_lists").has('.jimi-invite-thanks').fadeOut();
          }, 3000);
        });


        //记录日志
        sessionSatisfied("18", null, exports.logSource);
      } else {
        showMes("JIMI", inviteMessages[inviteStyle] +
            '<div class="jimi-invite"'+(inviteBtnMsg==1?'':' style="width:295px;" ')+'>\
            <img src="//static.360buyimg.com/jimi/img/invite/jimi_'+inviteStyle+'_0.gif" width="120" height="120"/>\
            <div class="jimi-invite-control">\
            <a class="common-btn" data-invitetype="1" href="javascript:;">'+(inviteBtnMsg==1?'好评':'送鲜花')+'</a>\
            <a class="common-btn" data-invitetype="0" href="javascript:;">'+(inviteBtnMsg==1?'差评':'拍板砖')+'</a>\
            </div>\
            </div>'
        );
        var $inviteWrap = $("#chatcontent .jimi-invite:last");
        //默认高亮好评
        if(exports.defaultBestSatisfy) {
          $inviteWrap.find(".common-btn[data-invitetype='1']").addClass("common-btn-active");
        }
        $inviteWrap.find('a.common-btn').click(function() {
          var _this = $(this);
          var _parent = _this.parent().parent();
          var score = parseInt(_this.data('invitetype'));
          _parent.find('img').attr('src', '//static.360buyimg.com/jimi/img/invite/jimi_'+inviteStyle+'_'+(score=='1'?'1':'2')+'.gif');
          _parent.find('.jimi-invite-control').replaceWith('<div class="common-red jimi-invite-thanks">感谢您的评价！</div>');

          //评价日志
          sessionSatisfied(score, null, exports.logSource);
          //标记已经评价
          exports.hasComment = true;
          //3秒后消失
          setTimeout(function() {
            $("#chatcontent .jimi_lists").has($inviteWrap).fadeOut();
          }, 3000);
        });
        //记录日志
        sessionSatisfied("-1", null, exports.logSource);
      }
    };

    //主动评价初始化
    exports.feedbackInit = function() {
      var canComment=true;
      var undef = undefined;
      var $winCloseBtn = $("#winclose");
      var $winCloseBtn_top = $("#winclose_top");
      var $satisfyRegion = $(".satisfy");
      var $mask = $("#masterDiv");
      var $unsatisfyRegion = $("#unsatisfyRegion");
      var $satisfyBtn = $("#sat-y");
      var $unsatisfyBtn = $("#sat-n");
      var $JdefaultPanel = $(".satisfy-content");
      var $feedBackPanel = $("#J_feedback2"); //反馈面板
      var $closeFeedBtn = $("#J_closeFeed2");

      //JIMI1提交放右边 JIMI1上线
      $(".satisfy .submit-opt").html('<a class="post-btn" clstag="JIMI|keycount|home2014|myd2" href="javascript:;" style="margin-left:0;">提 交</a>\
    <a class="cancel-btn" href="javascript:;" style="margin-left:51px;">取 消</a>');

      var $postBtn = $(".satisfy .post-btn");
      var $cancelBtn = $(".satisfy .cancel-btn");
      var $closeBtn = $("i.close");
      var $errTip = $("#J_errTip2");
      var $radios = $("input[name='satisfied']");
      var mustCommentflag = true;

      /*这里是5分制评价，由这个变量控制，灰度分别部署时，先切版本，再修改这里*/
      var isFiveFeedback = package("v.invite").isFiveFeedback;
      if(!isFiveFeedback) {
        $(".satisfy-header").addClass("satisfy-header-new")
          .find("h3").html("您对JIMI的服务感到满意吗？");
        $(".submit-opt").hide();

        var jimi_eval_0 =  "//static.360buyimg.com/jimi/img/invite/jimi_eval_0.gif";
        var jimi_eval_1 =  "//static.360buyimg.com/jimi/img/invite/jimi_eval_1_" + evaluatetemplate + ".gif";
        var jimi_eval_2 =  "//static.360buyimg.com/jimi/img/invite/jimi_eval_2.gif";
        var html = '\
      <div class="satisfy-jimi-expression fl"><img height="128" width="128" src="'+jimi_eval_0+'"/></div>\
      <ul class="satisfy-radio fl">\
        <li class="satisfy-radio-' + evaluatetemplate + '-0"><a href="javascript:;" data-score="0"></a></li>\
        <li class="satisfy-radio-' + evaluatetemplate + '-1"><a href="javascript:;" data-score="1"></a></li>\
      </ul>\
    ';
        $(".unsatisfy-reason").hide();
        $("#unsatisfyRegion").hide().css("margin-top", "8px");
        $(".satisfy-choice").addClass("clearfix").css("padding", "0px 0px 10px 5px").html(html);
        var $img = $(".satisfy-jimi-expression img");
        $feedBackPanel.css("position", "absolute").css("left","80px").css("top", "80px");
        var setImgByScore = function(scroe) {
          if(scroe == 1) {
            if($img.attr("src") != jimi_eval_1) {
              $(".satisfy-jimi-expression img").attr("src", jimi_eval_1);
            }
          } else if(scroe == 0) {
            if($img.attr("src") != jimi_eval_2) {
              $(".satisfy-jimi-expression img").attr("src", jimi_eval_2);
            }
          } else {
            if($img.attr("src") != jimi_eval_0) {
              $(".satisfy-jimi-expression img").attr("src", jimi_eval_0);
            }
          }
        };
        $(".satisfy-radio a").on("click", function() {
          var $this = $(this).blur();
          var scroe = $this.data("score");
          $(".satisfy-radio a").removeClass("active");
          $this.addClass("active");
          if(scroe=="0") {
            //原因
            $(".submit-opt").show();
            $("#unsatisfyRegion").show();
          } else {
            $(".submit-opt").hide();
            $("#unsatisfyRegion").hide();
            //直接提交
            $postBtn.trigger("click");
          }
        });
        //2分的重写事件

      }
      if(isFiveFeedback) {
        var html = '\
    <input id="feedback100" type="radio" value="100" name="satisfied">\
    <label class="radio-type" for="feedback100">非常满意</label>\
    <input id="feedback80"  type="radio" value="80" name="satisfied">\
    <label class="radio-type" for="feedback80">满意</label>\
    <input id="feedback60"  type="radio" value="60" name="satisfied">\
    <label class="radio-type" for="feedback60">一般</label>\
    <input id="feedback40"  type="radio" value="40" name="satisfied">\
    <label class="radio-type" for="feedback40">不满意</label>\
    <input id="feedback20"  type="radio" value="20" name="satisfied">\
    <label class="radio-type" for="feedback20">非常不满意</label>\
    ';
        $(".satisfy-choice").css("padding", "20px 0 57px 20px").html(html);
        $(".satisfy-choice label").css("padding", "0 16px 0 0").css("margin-right", "0");
        $("#feedback100,#feedback80").on('ifChecked', function(){
          $unsatisfyRegion.hide();
        });
        $("#feedback60,#feedback40,#feedback20").on('ifChecked', function(){
          $unsatisfyRegion.show();
        });
        $radios = $("input[name='satisfied']");
      }

      $radios.on('ifChecked', function(){
        $errTip.hide();
      });

      $satisfyRegion.hide();

      $JdefaultPanel.find("input").iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%' // optional
      });

      $satisfyBtn.on('ifChecked', function(){
        $unsatisfyRegion.hide();
      });
      $unsatisfyBtn.on('ifChecked', function(){
        $unsatisfyRegion.show();
      });
      $cancelBtn.click(function (){
        $satisfyRegion.hide();
        $mask.hide();
        $errTip.hide();
      });
      $closeBtn.click(function() {
        $cancelBtn.trigger("click");
      });
      $radios.click(function (){
        $errTip.hide();
      });
      var hideTimeout = null;
      $postBtn.click(function(){
        var feedbackVal = $("input[name='satisfied']:checked").val();
        if(!isFiveFeedback) {
          feedbackVal = $(".satisfy-radio a.active").data("score");
        }
        var feedbackTxt = $.trim($("#reasonIntro").val());
        var reason = [];
        var reasonTxt = "";

        if(!isFiveFeedback && $unsatisfyRegion.is(":visible")
          && (feedbackTxt == "输入您要反馈的内容" || feedbackTxt == "")) {
          $errTip.css("width", "176px");
          $errTip.css("top", "265px");
          $errTip.css("left", "130px");
          $errTip.html("请输入您要反馈的内容哦，谢谢");
          $errTip.show();
          clearTimeout(hideTimeout);
          hideTimeout = setTimeout(function() {$errTip.fadeOut()}, 1500);
        } else if (mustCommentflag && feedbackVal == undefined){
          $errTip.css("width", "130px");
          $errTip.css("top", "100px");
          $errTip.css("left", "155px");
          $errTip.html("请选择您的评价，谢谢");
          $errTip.show();
          clearTimeout(hideTimeout);
          hideTimeout = setTimeout(function() {$errTip.fadeOut()}, 1500);
        } else if($unsatisfyRegion.is(":visible")
          && (feedbackTxt == "输入您要反馈的内容" || feedbackTxt == "")
          && !$("#reason1").is(":checked")
          && !$("#reason2").is(":checked")
          && !$("#reason3").is(":checked")
          ) {
          $errTip.css("width", "176px");
          $errTip.css("top", "240px");
          $errTip.css("left", "130px");
          $errTip.html("请勾选原因或给JIMI反馈，谢谢");
          $errTip.show();
          clearTimeout(hideTimeout);
          hideTimeout = setTimeout(function() {$errTip.fadeOut()}, 1500);
        } else {
          if (!canComment){
            return;
          }
          if(isFiveFeedback) {
            $JdefaultPanel.hide();
          } else {
            $(".satisfy-radio, #unsatisfyRegion,.submit-opt").hide();
            setImgByScore(feedbackVal);
          }
          if (isFromShortcut){
            $closeFeedBtn.hide();
          }
          if ($("#reason1").is(":checked")) reason.push($("#reason1").val());
          if ($("#reason2").is(":checked")) reason.push($("#reason2").val());
          if ($("#reason3").is(":checked")) reason.push($("#reason3").val());
          if (reason.length > 0){
            reasonTxt += reason.join(",");
          }
          if (feedbackTxt != "" && feedbackTxt != "输入文字"){
            reasonTxt += "," + feedbackTxt;
          }


          //TODO 发送新接口
          sessionSatisfied(feedbackVal, reasonTxt);

          exports.hasComment = true;


          $feedBackPanel.show();
          (function (){
            var now = 3;
            if (isFromShortcut){
              if(isFiveFeedback) {
                now = 1;
              } else {
                now = 2;
                $(".J_time").parent().hide();
              }
            }
            $(".J_time").text(now);
            var fn = function (){
              $(".J_time").text(now);
              if (now == 0){
                if (isFromShortcut){
                  $satisfyRegion.hide();
                  $feedBackPanel.hide();
                  $mask.hide();
                } else {
                  windowclose();
                }
                clearTimeout(fn);
              }
              now -= 1;
              setTimeout(fn, 1000);
            }
            setTimeout(fn, 0);
          })();
        }
      });
      /**
       满意度来源定义
       source: 0、主动点击评价
       source: 1、强制弹出评价 触发逻辑：1、用户点“关闭”按钮；
       2、用户ask.action中带有satisfyFlag: true时，点右上角关闭按钮
       Source: 2 邀评弹出评价 触发逻辑：1、用户点右上角关闭按钮，命中flow：0.5这个概率，然后弹出评价框
       Source: 5 主动邀评弹出评价 触发逻辑：用户聊天过程中命中后台设置规则，ask.action中有"inviteFlag":true时，弹出评价框
       **/
        //右上角关闭按钮逻辑
      $winCloseBtn_top.click(function(){
        // 已评价，直接关闭窗口
        isFromShortcut = false;
        if (exports.hasComment){
          windowclose();
          return;
        }
        //没操作，直接关闭窗口
        if ($('#chatcontent .customer_lists').length < 1){
          windowclose();
          return;
        }
        // 按照规则弹出满意度评价框
        if (isShowSatisfyModal){
          _showSatisfyMask();
          exports.jimiSatisfySource='1';
          if(package("v.invite").isFiveFeedback) {
            sessionSatisfied("18", null, "1");
          } else {
            sessionSatisfied("-1", null, "1");
          }

        }else{
          //按closingFlag弹出评价
          if(exports.showFeedbackWhenClose) {
            _showSatisfyMask();
            exports.jimiSatisfySource='2';
            if(package("v.invite").isFiveFeedback) {
              sessionSatisfied("18", null, 2);
            } else {
              sessionSatisfied("-1", null, "2");
            }


          } else {
            windowclose();
          }

        }

      });
      //显示满意度评价框逻辑
      function _showSatisfyMask(){
        var winH = $(window).height(),
          winW = $(window).width(),
          winPosT = (winH - 100) / 2,
          winPosL = (winW - 100) / 2;
        $mask.show().css({
          //height: winH,
          left: 0
        });
        $unsatisfyRegion.hide();
        $(".submit-opt").hide();
        $satisfyRegion.show().css({
          top: winPosT,
          left: winPosL,
          zIndex: 122
        });
        //默认最好评价
        if(exports.defaultBestSatisfy) {
          $radios.eq(0).iCheck('check');
        }
      }

      $winCloseBtn.click(function(){
        isFromShortcut = false;
        if (exports.hasComment){
          windowclose();
          return;
        }
        // 没操作，直接关闭窗口
        if ($('#chatcontent .customer_lists').length < 1){
          windowclose();
        } else {
          //下面的关闭也用closingFlag
          if(exports.showFeedbackWhenClose) {
            exports.jimiSatisfySource = '1';
            _showSatisfyMask();

            if(package("v.invite").isFiveFeedback) {
              sessionSatisfied("18", null, "1");
            } else {
              sessionSatisfied("-1", null, "1");
            }

          } else {
            windowclose();
          }

        }
      });

//      $("#reasonIntro").bind("keydown keyup change click",function(){
//          inputflag=true;
//      })
      $("#reasonIntro").bind("keydown keyup change mouseup mousedown click blur", function (){
        var text = $("#reasonIntro").val();
        var textLen = text.length;
        if(text == '输入您要反馈的内容'){
          return ;
        }
        if (textLen <= 100){
          canComment = true;
          $("#wordsRestrict").text("您还可以输入" + (100 - textLen) + "字").removeClass("red").addClass("words-restrict-color");
        } else {
          canComment = false;
          $("#wordsRestrict").text("您已超出" + (textLen - 100) + "字").removeClass("words-restrict-color").addClass("red");
        }
      });
      $("#reasonIntro").bind("focus", function (){
        var text = $("#reasonIntro").val();
        if ("输入您要反馈的内容" == text) {$("#reasonIntro").val("").css("color", "#333333");}
      });
      $("#reasonIntro").bind("blur", function (){
        var text = $("#reasonIntro").val();
        if ("" == text) {
          $("#reasonIntro").val("输入您要反馈的内容").css('color', '#CCCCCC');
        }
      });
      $closeFeedBtn.click(windowclose);
      $("#wordsRestrict").addClass("words-restrict-color");
    };

    //满意度评价点击
    $("#j_satisfy").click(function (){
      isFromShortcut = true;
      if(exports.hasComment){
        showMes("JIMI", "谢谢，您已对本次服务做出过评价了！");
       return;
      }
//      if (exports.hasComment){
//        showMes("JIMI", "谢谢，您已对本次服务做出过评价了！");
//        return;
//      }
      $("#text-in").blur();
      var $satisfyRegion = $(".satisfy");
      var $mask = $("#masterDiv");
      var $unsatisfyRegion = $("#unsatisfyRegion");
      var $feedBackPanel = $("#J_feedback2");
      var $JdefaultPanel = $(".satisfy-content");
      var $radios = $("input[name='satisfied']");

      var winH = $(window).height(),
        winW = $(window).width(),
        winPosT = (winH - 200) / 2,
        winPosL = (winW - 330) / 2;
      $mask.show().css({
        //height: winH,
        left: 0
      });
      $unsatisfyRegion.hide();
      $feedBackPanel.hide();
      $JdefaultPanel.show();
      $satisfyRegion.show().css({
        //top: winPosT,
        //left: winPosL,
        zIndex: 122
      });
      //$radios.attr("checked", false);
      $radios.iCheck('uncheck');
      $(".unsatisfy-reason input").iCheck('uncheck');

      exports.jimiSatisfySource='0';
      var isFiveFeedback = package("v.invite").isFiveFeedback;
      if(isFiveFeedback) {
        sessionSatisfied("18", null, "0");
      } else {
        sessionSatisfied("-1", null, "0");

        $(".submit-opt").hide();
        $(".satisfy-radio a").removeClass("active");
        $("#unsatisfyRegion").hide();
      }

      //默认最好评价
      if(exports.defaultBestSatisfy) {
        if(isFiveFeedback) {
          $radios.eq(0).iCheck('check');
        }
      }

    });


    //JIMI 提交会话满意度
    /**
     * 周鑫  2014-11-11 15:52:28
     正果，sessionStatisfiedType加2个字段
     template int，模板的编号
     templateext String，模板的扩展字段（默认好评，selected，无默认好评，unselect）
     还有这个哦，别忘记了哈
     */
    function sessionSatisfied(statisfied, reason, source){
      var data1 = {
        'statisfiedType' : statisfied,
        'source': source || exports.jimiSatisfySource,//表示满意度来源
        'evaluatetemplate': evaluatetemplate,
        'template': inviteTemplate,
        'templateext': exports.defaultBestSatisfy?'selected':'unselect',
        'entrance_source': window.jimiSource
      };

      if (reason) data1.unstatisfyReason = reason;
//      if(statisfied==0&&(source==0||source==1||source==2)) {
//        data1.inputflag = inputflag;
//      }else{
//        data1.inputflag=false;
//      }
     if(statisfied==1)  data1.unstatisfyReason=""//满意时将不满意原因给清空

      //这里判断是否满意
      $.ajax({
        type : "post",
        url : '/feedback/sessionStatisfiedType.action',
        data: data1
      });
    }
  }(jQuery, window, document))
  return exports;
});
/**
 * Created by cdchenzhengguo on 2014/11/20.
 */

/**
 * 聊天帮助模块，包含：JIMI猜您想问，FAQ，聊天中的一些事件处理（折叠答案，商品测评展开，商品换一组）
 *
 * @module view
 * @class v.chatHelper
 * @constructor
 *
 */
package("v.chatHelper", [], function (require, exports, moudle) {
  (function ($, window, document) {
    var questions = {result:[]};

    exports.isSuggestionHelp = Math.random() < 0.5;

    exports.draw = function() {
      //AB test，一部分显示再原来的suggestion中
      if(exports.isSuggestionHelp) {
        $("#text-in").on("click", function() {
          var value = $(this).val();
          setTimeout(function() {
            if(!value) {
              var html = '';
              $.each(questions.result, function(){
                html += '<li class="suggestion js-send-question"><a>'+this+'</a></li>';
              });
              if(html) {
                $("#sugguestions").html(html).show();
              }
            }
          }, 50);
        });
      } else {
        $.template('chathelper', unescape(package('tmpl.chathelper')));
        $("#container .chat-helper").remove();
        $("#chatcontent").after($.tmpl('chathelper', questions));
      }
    };

    exports.getQuestions = function() {
      setTimeout(function() {
        if(!questions.result.length) {
          exports.isSuggestionHelp = true;
          $(window).trigger("resize");
        }
      }, 350);
      $.ajax({
        type: "get",
        url: '//sp-jimi.jd.com/space/getConsults?__=' + $.cookie('_robotAccess_') +
          '&productId='+window.productId +'&source=' + window.jimiSource + '&callback=?&type=' +
          (isCustomerEntrance() ? '5' : '4'),
        success: function(data) {
          if(data && data.statusCode) {
            questions = data.obj;
          }
        },
        complete: function() {
          //如果suggest出错了，就用方案一显示
          if(!questions.result.length) {
            exports.isSuggestionHelp = true;
            $(window).trigger("resize");
            $(".chat-helper").remove();
          }
          exports.draw();
        },
        dataType: "jsonp"
      });
    };

    $(document).on('click', function() {
      if($('.chat-helper-guess-list').is(":visible")) {
        $('.chat-helper-guess-list').hide();
      }
    });
    $(document).on('click', '.chat-helper-guess-select', function(event) {
      $('.chat-helper-guess-list').toggle();
      event.stopPropagation();
    });
    $(document).on('click', '.chat-helper-guess-list a, #sugguestions .js-send-question a', function(event) {
      var $this = $(this);
      $this.blur();
      var question = $this.html();
      $('.chat-helper-guess-select span').html(question);
      $('.chat-helper-guess-list').hide();
      $('#sugguestions').hide();
      //todo 选中后要做的事情
      showMes("我", question);
      sendRequest(question, 0);
      event.stopPropagation();
    });
    /*换一组*/
    $(document).on("click", ".jimi-goods-list .change-btn", function() {
      $(this).blur();
      var $wrapper = $(this).siblings(".list-panel").find(".views");
      if($wrapper.is(':animated')) {
        return;
      }
      var top = parseInt($wrapper.css("margin-top"));
      var height = $wrapper.height();
      var nextTop = top - 98*3;
      if ((top - 98*3) * (-1) >= height) {
        $wrapper.stop().animate({"margin-top": "0px"}, 200, "swing", function() {
          autoScroll();
        });
      } else {
        $wrapper.stop().animate({"margin-top": nextTop + "px"}, 200);
      }
    });
    /*展开商品评测或天气*/
      $(document).on("click", ".expand-btn", function() {
        $(this).fadeOut();
        var $expandArea = $(this).parent().parent().find(".expand-area");
        if(!$expandArea.hasClass('animated')) {
          $expandArea.stop().animate({'max-height': '1000px'}, 500).addClass('animated');
          autoScroll();
        }
    });
    /*固定问题立即回答*/
    $(document).on("click", "[data-anwser]", function() {
      var $this = $(this);
      var answer = $this.data("anwser");
      if(answer) {
        showMes("JIMI", answer);
      }
    });
    /*模拟用户发送点当前内容咨询*/
    $(document).on("click", "[data-send]", function() {
      var $this = $(this);
      var answer = $this.data("send");
      if(answer) {
        showMes("我", answer);
        sendRequest(answer,0);
      }
    });
    // 列表式加载更多
    $(document).on("click",'.J_MoreList', function() {
        var $this = $(this);
        var $li = $this.siblings('ul').find('li');
        if($this.hasClass('up')){
            $li.each(function(i,k){
                if(i > 2){
                    $(this).hide();
                }
            });
            $this.removeClass('up');
            $this.find('.txt').html('收起更多');
        }else{
            $this.addClass('up');
            $li.show();
            $this.find('.txt').html('查看全部');
        }
    });
    //这部分可能已经废弃
    $(function(){
      $(".jimiClickSend").live("click",function(){
        var req = $(this).attr("question");
        sendRequest(req,0);
      });
      //洗涤提示
      $(".xiDiTips").live("click",function(){
        var questionId = $(this).attr("question");
        var showMsg = $(this).html()+"有哪些？";
        showMes("我",showMsg);
        sendRequest(questionId,0,undefined,"washTipsCommand");
      });
    });

    //点击选择问题开始
    /*
    $("#sugguestions").on("click", "ul li", function () {
      var text = $(this).text();
      $("#text-in").val(text).focus();
      $("#sugguestions").hide();
    });
    */

    function drawSuggestions(sugguestions) {
      var ul  = $('#sugguestions');
      if(ul == null || ul.length > 1){
        return;
      }
      var question =$("#text-in").val();

      var qestionArr = [];
      var length = sugguestions.length;
//      var indexList = [4, 3, 0, 1, 2];
      var indexList = [5, 4, 0, 1, 2, 3];
      //修改为最多只有6条答案
      for ( var i = 1; i < sugguestions.length + 1 && i < 7; i++) {
        var str = '';
        //1为faq,0为aiml
        var temp = sugguestions[i - 1].content;

        var reg = new RegExp("([" + question + "])", "ig");
        temp = temp.replace(reg, "<font color=\"red\">$1</font>");

        /* 这段蛋碎了
        for ( var j = 1; j < question.length + 1; j++) {
          if (!/.*[\u4e00-\u9fa5a-zA-Z0-9]+.*$/i.test(question.charAt(j - 1))) {
            continue;
          }
          //若这个字已经渲染了
          for(var k = 1; k < j; k++){
            if(question.charAt(j - 1) == question.charAt(k-1))
              break;
          }
          if(k < j){
            continue;
          }
          //这个字已经渲染过了
          var pos = 0;
          var newPos = 0;
          while ((newPos = temp.indexOf(question.charAt(j - 1), pos)) >= pos) {
            temp = temp.substring(0, newPos) + '<font color="red">'
              + temp.charAt(newPos) + '</font>'
              + temp.substring(newPos + 1);
            pos = newPos + 19;
          }
        }
        */
        var t = sugguestions[i - 1].content;
        t = replaceSpecialChart(t);

        //没有commandNo时，type为0
        //test
        //if(i==2){sugguestions[i - 1].commandNo="";}
        var type = sugguestions[i - 1].commandNo ? 1 : 0;
        var a="";//选中class
        if(sugguestions[i - 1].isDefault){
           a='hover';
//          var b=sugguestions[i - 1].content
//          if($("#text-in").val()!=b){
//            $("#text-in").val(b);//为了让选中状态的问题在敲回车时发送专属的请求，需要保证输入框和弹出框的问题保持一致
//          }
        }
        str += '<li class="suggestion '+ a + '" faqid="' + sugguestions[i-1].id + '" onclick="javascript:sendClick(' + type + ','
          + sugguestions[i - 1].id + ',\'' + t + '\',\'' + sugguestions[i - 1].commandNo + '\',null,'+i+',null,false,true,false);">';
        //增加热度统计数据 ; 这里统计放前面 是为了兼容ie6,ie7下 float:right元素自动换行问题.
        //这里不显示数字了
        if(false && sugguestions[i-1].counts){
          str += '<span class="suggestion-total fr">提问次数<span class="txt-green">'+sugguestions[i-1].counts +'</span>次</span>';
        }
        str += '<a>' + temp + '</a></li>';
        qestionArr[indexList[i-1]] = str;
      }
      //console.log(qestionArr);
      ul.html("");
      $("<ul>" + qestionArr.join("") + "</ul>").appendTo(ul);
      ul.data("data", sugguestions);
      ul.data("input", question);

      $(".suggestion").hover(
        function () {
          $(this).siblings(".hover").removeClass("hover");
          $(this).addClass("hover");
        },
        function () {
          $(this).removeClass("hover");
        }
      );
      $("#sugguestions").show();
    }

    function showSuggestions(text) {
      text = text.replaceAll("&lt;", "<");
      text = text.replaceAll("&gt;", ">");
      text = text.replaceAll("&quot;", "\"");
      text = text.replaceAll("&qpos;", "\'");
      text = text.replaceAll("&nbsp;", " ");
      text = text.replaceAll("&nbsp;", " ");
      text = text.replace(/<\/?.+?>/g, "");
      text = replaceSpecialChart(text);
      var promotionId = $("#promotionId").val();
      $.ajax({
        type : "post",
        url : '/keywordTips/keywordTips.action?t=' + new Date().getTime(),
        data : {
          'input':text,
          'source':jimiSource || '',
          'promotionId':promotionId,
          'productId': (productId==undefined)?'':productId
        },
        dataType : "JSON"
      }).success(function(data) {
        var obj = data;
        //返回为空，没有结果.
        var text = $("#text-in").val().trim();
        // console.log(text);
        if(obj == null || !obj.state || text.length <= 0 || obj.data == null || obj.data.length <= 0 || !(obj.data instanceof Array)){
          $("#sugguestions").hide();
          return ;
        }
        drawSuggestions(obj.data);
      });
    }

    exports.showSuggestions = showSuggestions;

    var thumbnailPath = "//static.360buyimg.com/jimi/img/answer/";
    //将答案中的js-thumbnail转换为缩略图形式
    function showThumbnail($ele) {
      var $thumbs = $ele.find(".js-thumbnail");
      if(!$thumbs.length) return;
      var dataLightbox = "lightbox-" + Math.random();
      $thumbs.each(function(i) {
        var $this = $(this);
        var height = $this.attr("h")||60;
        var width = $this.attr("w")||60;
        var title = $this.attr("title")||'';
        var src = $this.attr("src");
        var tempArr = src.split(".");
        tempArr.splice(-1, 0, 'thumb');
        var thumbSrc = tempArr.join(".");
        $this.replaceWith('<a class="jimi-thumb-link" data-title="'+title+'" data-lightbox="'+dataLightbox+'" href="'+thumbnailPath+src+'">' +
          '<i class="jimi-thumb-zoom"></i>' +
          '<img src="'+thumbnailPath+thumbSrc+'" width="'+width+'" height="'+height+'" />' +
          '</a>');
      });
    }

    exports.showThumbnail = showThumbnail;

  }(jQuery, window, document));

  return exports;
});

/**
 * Created by cdchenzhengguo on 2014/11/21.
 */
/**
 *
 * 个人空间
 * @module view
 * @class v.myspace
 * @constructor
 *
 */
package("v.myspace", [], function(require, exports, moudle) {
  (function() {
    var sessionId = $.cookie('_robotAccess_');
    var weatherUrl = "//sp-jimi.jd.com/space/getWeatherInfo?__=" + sessionId + "&callback=?&source=" + window.jimiSource;
    var hourUrl = "//sp-jimi.jd.com/space/getHourPush?__=" + sessionId + "&callback=?&source=" + window.jimiSource;
    var welcomeUrl = "//sp-jimi.jd.com/space/getCareWord?__=" + sessionId + "&callback=?&source=" + window.jimiSource;
    var questionUrl = "//sp-jimi.jd.com/space/getChatWord?__=" + sessionId + "&callback=?&source=" + window.jimiSource;

    var obj = {
      weather: null,
      msg: null
    };

    //50%概率显示个人空间
    //    exports.isShowMyspace = Math.random() < 0.5;
    exports.isShowMyspace = true;

    function getQuestion(type, callback) {
      var data = {
        'space-btn-tx': 1,
        'space-btn-xh': 2,
        'space-btn-ds': 3,
        'space-btn-yx': 4
      }
      var type = data[type];
      if (type) {
        $.ajax({
          type: "get",
          url: questionUrl + "&type=" + type,
          success: function(data) {
            if (data.statusCode && data.obj) {
              callback && callback(data.obj.result.question);
            }
          },
          dataType: "jsonp"
        });
      }
    };

    exports.draw = function() {
      // $.template('myspace', unescape(package('tmpl.myspace')));
      $.template('myspace', unescape('<div class="space-weather clearfix">{{if !weather}}<p>正在为您获取天气信息...</p>{{else}}<p><span>${weather.area}：</span><img alt="天气" title="${weather.title}" src="//static.360buyimg.com/jimi/img/weather${weather.img}"><span>${weather.info}</span></p>{{/if}}</div><div class="space-chat clearfix"><div class="space-chat-header"></div><div class="space-chat-box"><i class="space-chat-box-arrow"></i> <i class="space-chat-box-top"></i> <i class="space-chat-box-bottom"></i><div class="space-chat-box-content" id="space-chat-content">{{if !msg}} 主人，欢迎访问JIMI，JIMI是一只来自外太空的智能机器鹦鹉，能陪您聊天、解决您的问题，记得常来哈 {{else}} {{html msg}} {{/if}}</div></div></div><ul class="space-btn-group"><li class="space-btn-tx"><a href="javascript:;"><i></i>调戏JIMI</a></li><li class="space-btn-xh"><a href="javascript:;"><i></i>讲笑话</a></li><li class="space-btn-ds"><a href="javascript:;"><i></i>对诗</a></li></ul>'));
      $("#mySpace").html($.tmpl('myspace', obj)).show();
    };

    exports.getWelcome = function() {
      $.ajax({
        type: "get",
        url: welcomeUrl,
        success: function(data) {
          if (data.statusCode && data.obj) {
            obj.msg = data.obj.result;
            exports.draw();
          }
        },
        dataType: "jsonp"
      });
    };

    //整理天气数据，以便给模板访问
    function adaptWeather() {
      if (obj.weather) {
        var result = obj.weather;
        obj.weather.area = result.areaId;
        if (result.temperatureDay == -100) {
          obj.weather.info = parseInt(result.temperatureNight) + '°C';
          obj.weather.img = "/night/" + result.phenomenaIdNight + ".png";
          obj.weather.title = result.phenomenaStringNight;
        } else {
          obj.weather.info = parseInt(result.temperatureDay) + ' ~ ' + parseInt(result.temperatureNight) + '°C';
          obj.weather.img = "/day/" + result.phenomenaIdDay + ".png";
          obj.weather.title = result.phenomenaStringDay;
        }
      }
    };

    //获取天气数据
    exports.getWeather = function(callback) {
      $.ajax({
        type: "get",
        url: weatherUrl,
        success: function(data) {
          if (data.statusCode && data.obj) {
            obj.weather = data.obj.result;
            adaptWeather();
            exports.draw();
          }
        },
        dataType: "jsonp"
      });
    };

    //获取每小时的关怀
    exports.getCare = function(hour) {
      $.ajax({
        type: "get",
        url: hourUrl + "&timePoint=" + hour,
        success: function(data) {
          if (data.statusCode && data.obj) {
            obj.msg = data.obj.result;
            exports.draw();
          }
        },
        dataType: "jsonp"
      });
    };

    $(document).on("click", "#mySpace .space-btn-group li", function() {
      var $this = $(this);
      $this.find("a").blur();
      getQuestion($this.attr("class"), function(question) {
        if (question) {
          showMes("我", question);
          sendRequest(question, 0);
        }
      });
    });

    exports.init = function() {
      exports.getWelcome();
      exports.getWeather();
      //开头语保留5分钟
      setTimeout(function() {
        var oldHour = new Date().getHours();
        setInterval(function() {
          var currentHour = new Date().getHours();
          if (currentHour != oldHour) {
            oldHour = currentHour
            exports.getCare(currentHour);
          }
        }, 5 * 1000);
      }, 5 * 60 * 1000);
    };
  }(jQuery, window, document));
  return exports;
});
/**
 * Created by chenzhengguo on 2014/11/24.
 */

/**
 * 关闭相关的控制
 *
 * @module view
 * @class v.close
 * @constructor
 *
 */
package("v.close", [], function (require, exports, moudle) {
  (function ($, document) {
    exports.closingFlag = false;
    var hasShowed = false;
    exports.bindWindowClose = function() {
      /***关闭浏览器关闭提示邀评功能***/
      return false;
      //Fix IE a标签问题
      var aClicked = false;
      $(document).on("click", "a", function() {
        aClicked = true;
      });
      window.onbeforeunload = function() {
        if($.browser.msie && parseInt($.browser.version)<=10 && aClicked) {
          aClicked = false;
        } else {
          var tips = "离开之前点击左下角留下您的评价，您的鼓励是我们前进的动力！";
          if(exports.closingFlag && !package("v.invite").hasComment && !hasShowed && $('#chatcontent .customer_lists').length > 0) {
            //只弹一次关闭提示
            hasShowed = true;
            if(!$.browser.mozilla || $.browser.version=="11.0") {
              setTimeout(function () {
                package("v.invite").logSource = 6;
                package("v.invite").show();
              }, 200);
            }
            if(window.event) {
              window.event.returnValue = tips;
              return tips;
            }
            if(!$.browser.mozilla || $.browser.version=="11.0") {
              return tips;
            }
          }
        }
      }
    };

  }(jQuery, window.document));
  return exports;
});

/**
 * Created by chenzhengguo on 2014/12/22.
 */

/**
 * 调整各个内容的宽高，使正常显示
 * 窗口的拖动，最大化/最小化控制
 *
 * @module view
 * @class v.adjustView
 *
 */

package("v.adjustView", [], function (require, exports, moudle) {
  (function ($, window, document) {
    var adaptConfig = {
      minHeight: 630,
      container: 64,
      chatcontent: 259,
      navcontent: 104,
      inputWidth: 55
    };
    exports.config = function(settings) {
      $.extend(adaptConfig, settings);
    };

    var winState = false;
    //最大化对话窗口开始
    exports.fMaxWin = fMaxWin;
    exports.fMinWin = fMinWin;

    function fMaxWin() {
      $("body").addClass("jimi_revision");
      //$("#winmax").removeClass("full-screen").addClass("full-screen-quit").attr("clstag", "JIMI|keycount|home2014|c5");
      $("#winmax").attr('class', package('v.myjimi').skinBgConfig.full_screen_quit_bg[package('v.myjimi').skin_type])
          .attr("clstag", "JIMI|keycount|home2014|c5");
      $(".chat-block").data("__oldHeight__", $(".chat-block").height());
      $("#container").css("left", "0px");
      $("#container").css("right", "0px");
      $("#text-in").css("width", $(".edit-block").width() - 55);
      if ($("#text-in").val() != defaultInput) {
        $("#text-in").focus();
      }
      winState = true;

      return false;
    }

    function fMinWin() {
      $("body").removeAttr("class");
      //$("#winmax").removeClass("full-screen-quit").addClass("full-screen").attr("clstag", "JIMI|keycount|home2014|c4");
        $("#winmax").attr('class', package('v.myjimi').skinBgConfig.full_screen_bg[package('v.myjimi').skin_type])
            .attr("clstag", "JIMI|keycount|home2014|c5");
      $(".chat-block").height($(".chat-block").data("__oldHeight__"));
      $(".inputM").width($(".inputM").data("__oldWidth"));
      $("#text-in").css("width",$(".edit-block").width()- 55);
      if($("#text-in").val() != defaultInput){
        $("#text-in").focus();
      }
      winState = false;

      //初始化对话框位置
      var nWinW = $("#container").width(),
          nWinH = $("#container").height(),
          nObjL = Math.round(($(window).width() - nWinW) / 2),
          nObjT = Math.round(($(window).height() - nWinH) / 2);
      $("#container").css({
        right: "auto",
        left: nObjL
      });
    }

    $("#container .header .logo").mousedown(function(e){e.preventDefault();});

    //初始化对话框位置
    var nWinW = $("#container").width(),
        nWinH = $("#container").height(),
        nObjL = Math.round(($(window).width() - nWinW) / 2),
        nObjT = Math.round(($(window).height() - nWinH) / 2);
    $("#container").css({
      left: nObjL
    });
    //拖动对话框开始
    var bool = false,
        nOffsetX = 0,
        nOffsetY = 0,
        nPosX = 0,
        nPosY = 0;
    $("#container").mousedown(function (e) {
      //e.preventDefault();
      if(winState){
        //console.log("现在是最大化情况，点击不拖动");
        return;
      }

      var self=$(this);
      bool = true;
      //鼠标指针位置,点击相对的偏移值
      nOffsetX = e.pageX;
      nOffsetY = e.pageY;
      //container位置
      nPosX = self.offset().left;
      nPosY = self.offset().top;
    }).mouseup(function () {
      bool = false;
    });
    $("#chatcontent").parent().mousedown(function (e) {
      bool = false;
      e.stopPropagation();
    });
    $("#winmax, #winclose_top, .service-online, .container, .copyright").mousedown(function (e) {
      stopMovePropagation(e);
    });
    $(document).mousemove(function (e) {
      if (!bool) return;
      updateMouvePosition(e);
    }).mouseup(function(e){
      bool = false;
    });

    function stopMovePropagation(e){
      bool = false;
      e.stopPropagation();
    }
    function updateMouvePosition(e){
      var x = nPosX + e.pageX - nOffsetX,
        y = nPosY + e.pageY - nOffsetY,
        bW = $("#container").width() + x - $(window).width(),
        bH = $("#container").height() + y - $(window).height();
      if (bW < 0) {
        $("#container").css({
          left: x
        });
      }
      if (bH < 0) {
        $("#container").css({
          top: 0
        });
      } else {
        return;
      }
    }

    $(document).on("dblclick", "#container > .header", function() {
      $("#winmax").trigger("click");
    })

    $("#winmax").live("click", function () {
      if (winState) {
        fMinWin();
      } else {
        fMaxWin();
      }
      //触发resize事件，调整大小
      $(window).trigger("resize");
    });
    $("#containerMin").click(function () {
      $(this).hide(300);
      $("#container").show(300);
    });

    $("#chatcontent").mousedown(function(e) {
      e.stopPropagation();
    });

    //窗口大小调整
    var windowWidthOld = $(window).width();
    exports.adaptHeight = function() {
      var wh = $(window).height();
      var ww = $(window).width();
      if(wh < adaptConfig.minHeight) {
        wh = adaptConfig.minHeight;
      }
      if(ww != windowWidthOld) {
        windowWidthOld = ww;
        if (!winState) {
          fMinWin();
        }
      }



      $("#container").height(wh - adaptConfig.container);
      $("#chatcontent").height(wh - adaptConfig.chatcontent - (package("v.chatHelper").isSuggestionHelp?0:32));
      $("#navcontent").height($("#container").height() - adaptConfig.navcontent);
      if($("#jRightArea iframe").length > 0){
        $("#jRightArea iframe").attr("height", wh - adaptConfig.chatcontent - (package("v.chatHelper").isSuggestionHelp ? 0 : 32) + 132);
      }
     // $("#jRightArea iframe").length > 0 && $("#jRightArea iframe").attr("height", wh - adaptConfig.chatcontent - (package("v.chatHelper").isSuggestionHelp ? 0 : 32) + 132)

      $(".intro-bar").siblings(".nano").find(".content").each(function (index, el) {
        var item = $(this);
        setTimeout( function() {
          item.height($("#jRightArea").outerHeight() - $("#sidenav").outerHeight() - $(".intro-bar:visible").size() * $(".intro-bar").outerHeight());
        }, 10);
      });
      $("#buyConsultDiv, #orderListDiv, #mySpace, #productDetailDiv, #myJimi").parent().height($("#container").height() - adaptConfig.navcontent);
      $("#navcontent .nano").nanoScroller({
        alwaysVisible: false
      });

      $("#text-in").css("width",$(".edit-block").width()- adaptConfig.inputWidth);
    };

    $(window).bind("resize", exports.adaptHeight);


  }(jQuery, window, document))
  return exports;
});


/**
 * Created with JetBrains WebStorm.
 * User: chenzhengguo
 * Date: 14-9-2
 * Time: 下午8:28
 */


/**
 * open flash chart 生成
 *
 * @module view
 * @class v.openflashchart
 * @constructor
 *
 */
package("v.openflashchart", [], function (require, exports, moudle) {
  (function($, window) {
    //某个flash正在加载
    var flashLoading = false;
    var flashLoadingTime = 0;
    //open flash chart需要使用的回调函数，加载数据完成时执行
    window["ofc_ready"] = function() {
      //加载完毕
      flashLoading = false;
    };
    //格式化小数
    var formart = function(val, num) {
      var multiplicand = Math.pow(10, num);
      var result = Math.round(val * multiplicand) / multiplicand;
      return result;
    };

    //格式化数字
    var cuter = function(num) {
      var str = num.toString();
      var len = str.length, str2 = '', max = Math.floor(len / 3);
      for(var i = 0 ; i < max ; i++){
        var s = str.slice(len - 3, len);
        str = str.substr(0, len - 3);
        str2 = (',' + s) + str2;
        len = str.length;
      }
      str += str2;
      return str
    };

    /**
     * 根据图表类型生成数据
     * @param type
     * @param data
     */
    var getDataByType = function(type, data) {
      switch(type) {
        //data格式如：[{value:123, label:"好评"}, {value:12, label:"中评"}, {value:2, label:"差评"}]
        case "pie-reputation":
          var colors = ["#d01f3c", "#356aa0", "#C79810", "#33FF99"];
          var result = {
            "elements": [
              {
                "type": "pie",
                "colour": "#f08618",
                "width": 2,
                "font-size": 12,
                "start-angle": 0,
                "tip": "#val#个#label#",
                "radius": 40,
                "colours": [],
                "values": []
              }
            ],
            "bg_colour": "#ffffff"
          };
          var total = 0;
          for(var i = 0, length = data.length; i < length; i++) {
            total += data[i].value;
          }
          var percentTotal = 0;
          for(var i = 0, length = data.length; i < length; i++) {
            var percent = 0;
            if(total != 0) {
              if(i == length - 1) {
                percent = formart(100 - percentTotal, 2);
              }else {
                percent =  formart((Math.round(parseFloat(data[i].value / total) * 10000) / 10000) * 100, 2);
                percentTotal += percent;
              }
            }
            result.elements[0].values.push({
              "value": data[i].value,
              "label": data[i].label + "\n" + percent + "%"
            });
            result.elements[0].colours.push(colors[i % colors.length]);
          }
          return msJSON.stringify(result);
        case "line-price-trend":
          //data格式如：[{value:123, label:"9月1日"}, {value:122, label:"9月2日"}, {value:153, label:"9月3日"}]
          var result = {
            "elements":[
              {
                "type":      "line",
                "colour":    "#f08618",
                "width":     2,
                "font-size": 12,
                "values" :   [],
                "dot-style": {
                  "type": "solid-dot",
                  "dot-size": 4,
                  "halo-size": 0,
                  "colour": "#f08618",
                  "tip": "#x_label#<br>#val#元"
                }
              },
              {
                "colour":   "#006600",
                "font-size": 12,
                "type":      "tags",
                "values": [{"x":0, "y":0, "align-y":"center", "text":""}]
              },
              {
                "colour":   "#FF0033",
                "font-size": 12,
                "type":      "tags",
                "values": [{"x":0, "y":0, "align-y":"center", "text":""}]
              }
            ],
            "bg_colour": "#ffffff",
            "x_axis":{
              "colour":"#636363",
              "grid-colour":"#E8E8E8",
              "labels": {
                "labels": []
              },
              "offset": true,
              "steps": 1
            },
            "y_axis":{
              "labels": { "text": "#val#" },
              "colour":       "#636363",
              "grid-colour": "#E8E8E8",
              "offset":       0,
              "min":          0,
              "max":          1000,
              "steps":        200
             }
          };
          var min = {x: 0, y: data[0].value};
          var max = {x: 0, y: data[0].value};
          //求最大值和最小值
          for(var i = 0, length = data.length; i < length; i++) {
            result.elements[0].values.push(data[i].value);
            result.x_axis.labels.labels.push(data[i].label.toString());
            if(data[i].value < min.y) {
              min.x = i;
              min.y = data[i].value;
            }
            if(data[i].value > max.y) {
              max.x = i;
              max.y = data[i].value;
            }
          }
          //求差值，计算最大，最小
          var diff = max.y - min.y;
          var diffDigit = Math.round(diff).toString().length - 1;
          var minChart = Math.round(min.y/Math.pow(10,diffDigit)) * Math.pow(10,diffDigit) - Math.pow(10,diffDigit);
          var maxChart = Math.round(max.y/Math.pow(10,diffDigit)) * Math.pow(10,diffDigit) + Math.pow(10,diffDigit);
          result.y_axis.min = minChart < 0 ? 0 : minChart;
          result.y_axis.max = maxChart < 0 ? 0 : maxChart;
          var steps = Math.round((result.y_axis.max - result.y_axis.min) / 4);
          result.y_axis.steps = steps;
          var halfStep = steps/4;
          var minLoc = min.y - halfStep;
          if(minLoc < result.y_axis.min) {
            minLoc = result.y_axis.min + halfStep;
          }
          var maxLoc = max.y + halfStep;
          if(maxLoc > result.y_axis.max) {
            minLoc = result.y_axis.max - halfStep;
          }
          result.elements[1].values[0].x = min.x;
          result.elements[1].values[0].y = minLoc;
          result.elements[1].values[0].text = "最低：" + cuter(min.y) + "元";
          result.elements[2].values[0].x = max.x;
          result.elements[2].values[0].y = maxLoc;
          result.elements[2].values[0].text = "最高：" + cuter(max.y) + "元";
          return msJSON.stringify(result);
      }
    }

    /**
     * 获取DOM中的图表
     * @param $dom jq获取的dom
     */
    exports.createChartByElement = function($dom) {
      var whConf = {
        "pie-reputation":   ["235", "90"],
        "line-price-trend": ["450", "180"]
      };
      $dom.find("*[data-chartdata]").each(function(index, ele) {
        var $ele = $(ele);
        var chartData = $ele.data("chartdata");
        var data = null;
        if(chartData) {
          data = $.parseJSON(decodeURIComponent(chartData));
        }
        var id = $ele.attr("id");
        var type = $ele.data("charttype");
        setTimeout(function() {
            exports.createFlashChart(type, data, id, whConf[type][0], whConf[type][1]);
        }, 100);
      });
    };

    /**
     * 生成flash
     * @param type   图表类型，目前支持 pie-reputation line-price-trend
     * @param data   数据，如果数据为空，则从id中获取
     * @param id     装flash的dom id
     * @param width  flash宽度
     * @param height flash高度
     */
    exports.createFlashChart = function(type, data, id, width, height) {
      var $dom = $("#" + id);
      var args = arguments;
      //因为是共用一个回调函数，所以要等待其他flash加载完成后才开始加载
      if(flashLoading) {
        if(flashLoadingTime > 2000) {
          flashLoadingTime = 0;
          flashLoading = false;
        }
        setTimeout(function() {
          flashLoadingTime += 100;
          args.callee.apply(this, args);
        }, 100);
        return;
      }
      if(data === null || data.length == 0) {
        $dom.html("还没有对应数据哦！");
        return;
      }
      $dom.html() || $dom.html("数据加载中...");
      //开始加载
      flashLoading = true;
      //open flash chart需要使用的回调函数，在加载数据时执行
      window["open_flash_chart_data"] = function () {
        return getDataByType(type, data);
      };
      swfobject.embedSWF("./open-flash-chart.swf", id, width, height, "9.0.0", 'misc/skin/common/i/expressInstall.swf', null, {wmode: 'transparent'});
    };
  } (jQuery, window));
  return exports;
});


/**
 * 右边栏
 *
 * @module view
 * @class v.sidebar
 *
 */
package("v.sidebar", [], function (require, exports, moudle) {
  (function ($, window) {
    function displayContent(id) {
      $("#navcontent .navc-content").hide();
      $("#navcontent .js-navc-"+id).show();
      setTimeout(function() {
        $(window).trigger("resize");
      }, 200);
    }

    //如果没有订单数据，则调整tab样式
    function adjustTab(data) {
      if(!data || !data.state || !data.data) {
        $("#bydd").hide();
        $("#navcontent .js-navc-bydd").hide();
        if($("#bydd").hasClass("current")) {
          $("#bydd").siblings(".side-nav-item:first").trigger("mouseover");
        }
        if($("#sidenav .side-nav-item:visible").length < 3) {
          //如果这个时候个人空间还没有显示，那就显示吧，否则就只有显示两个tab了
          if(!$("#grkj").is(":visible")) {
            $("#grkj").show();
          } else {
            $("#sidenav .side-nav-item, #sidenav .tab_arrow").width("50%");
          }
        }
      }
    }

    //点击tab后blur
    $(document).on("click", "#sidenav .side-nav-item a", function() {
      $(this).blur();
    });

    /*店长推荐商品 上下滚动*/
    $(document).on("click", ".post-title .change-btn", function() {
      $(this).blur();
      var $wrapper = $(".post-goods-area-wrapper");
      if($wrapper.is(':animated')) {
        return;
      }
      var top = parseInt($(".post-goods-area-wrapper").css("top"));
      var height = $wrapper.height();
      var itemHeight = $wrapper.find(".post-goods-area").outerHeight();
      var nextTop = top - itemHeight;
      if ((top - itemHeight - 10) * (-1) >= height) {
        $wrapper.stop().animate({top: "0px"}, 200);
      } else {
        $wrapper.stop().animate({top: nextTop + "px"}, 200);
      }
    });

    //快捷查询滑动
    $(document).on("mouseover", "#sidenav .side-nav-item", function(){
      var $this = $(this);
      var left = $this.prevAll(":visible").length * ($this.prevAll(":visible:first").width() || 0);
      $(".tab_arrow").stop().animate({left: left}, 200);
      $this.parent().find("li.current").removeClass("current");
      $this.addClass("current");
      displayContent($this.attr("id"));
    });

    $(document).on("click", ".intro-bar", function (){
      //被点击的对象，如果是开启状态，则关闭
      var $this = $(this);
      var $triangle = $this.find(">div");
      if($triangle.hasClass("triangle-open")){
        $this.next().hide();
        $triangle.removeClass("triangle-open").addClass("triangle-close");
      } else {
        //先把其他的关闭
        var detailEle;
        $this.siblings().find(">div.triangle-open").removeClass("triangle-open").addClass("triangle-close");
        $this.siblings(".detail:visible").hide();
        $this.siblings(".nano:visible").hide();
        //再把这个展开
        $this.next().show();
        $triangle.removeClass("triangle-close").addClass("triangle-open");
      }
      setTimeout(function() {
        $(window).trigger("resize");
      }, 200);
      return false;
    });

    var needTrackHide = false;
    var $oderTrack = $("#orderTrack");
    $oderTrack.on("mouseover", function(){
      $(this).show();
    }).on("mouseout",function(){
      $(this).hide();
    });
    $("#navcontent").on("mouseout", function(){
      $("#orderTrack").hide();
    });
    $("#orderListDiv").on("mouseover", ".unfinish", function() {
      needTrackHide = false;
      var $this = $(this);
      setTimeout(function() {
        if(needTrackHide) return;
        var ele = $this;
        var orderId = $this.attr("orderNum");
        var position = getPosition(ele);
        ele.data("showOrder", true);
        $.ajax({
          type: "get",
          url:'/orderTrace/orderTrace.action?t=' + new Date().getTime(),
          data:{
            "orderId": orderId
          },
          dataType:"json"
        }).success(function(data) {
          var trackList = data.data;
          data.fe = true;
          var newList = [];
          for(var i=9,j=0; i > 0; i--,j++){
            var k = trackList.length - j - 1;
            if(k >= 0)
              newList[j] = trackList[k];
          }
          data.data = newList;
          var newAnswer = new AnswerFactory.createAnswer(data.resultType, data);
          if(position.top < 420){         //若这个全程跟踪的top小于420px;
            position.left -= 430;
            position.top  -= newList.length/2 * 40;
          }else{
            position.left -= 430;
            if(newList.length >= 2){
              position.top  -= (newList.length-2) * 40;
            }
          }
          newAnswer.show($oderTrack, false, false, position);
        });
      }, 200);
    }).on("mouseout", ".unfinish", function() {
      needTrackHide = true;
      $oderTrack.hide();
    });

    /*----处理快捷查询中的售后政策----*/
    $(document).on("keyup", "#productUrl", function(evt) {
      if(evt.keyCode == 13) {
        $(this).blur();
        $("#product-service-search .search-button").trigger("click");
      }
    });
    $(document).on("click", "#product-service-search .search-button", function(){
      var $searchArea =  $("#product-service-search .answer");
      var urlStr = $(this).siblings("input").val();
      //较验url是否正确.
      var reg=/^(\s*)http:\/\/item.jd.com\/[0-9]{6,12}.html(.*)$/gi;
      if(!reg.test(urlStr)){
        alert("请输入正确的商品详情页的网页地址");
        return false;
      }
      //显示售后政策
      $.ajax({
        type: "get",
        url:'/productService/productService.action?t=' + new Date().getTime(),
        data:{
          "url":urlStr
        },
        success: callSuccess,
        error: callError,
        dataType:"json"
      });
      function callSuccess(data){
        var newAnswer = new AnswerFactory.createAnswer(data.resultType, data.data);
        $searchArea.children(":gt(2)").remove();
        newAnswer.show($searchArea, true, false);
        $(window).trigger("resize");
        return;
      };
      function callError() {
        return false;
      };
    });

    //取消订单、退换货、。。
    $(document).on("click", "#orderListDiv .productBack", function(){
      var orderId = $(this).attr("orderNum");
      var text = $(this).html();
      var actionUrl = "/cancelOrder/cancelOrder.action";
      if(text == '返修/退换货'){
        actionUrl = '/cancelOrder/repairOrder.action';
      }else if(text.indexOf('进度查询') >= 0){
        actionUrl = '/cancelOrder/seeRepairOrder.action';
      }
      $.ajax({
        type: "get",
        url: actionUrl + '?t=' + new Date().getTime(),
        data:{
          "orderNo": orderId
        },
        dataType:"json"
      }).success(function(data) {
        var data = data;
        data.fe = true;
        var newAnswer = new AnswerFactory.createAnswer(data.resultType, data);
        var ele = $("#chatcontent");
        newAnswer.show(ele, true, true);
        setScroll();
        $("#text-in").focus();
      });
    });

    $(document).on("click", "#orderListDiv .intro-bar .book-list a", function(e){
      e.stopPropagation();
    });

    function getQA() {
      var qaArray = {result: []};
      $.ajax({
        type: "get",
        url: '/ask/commonQa.action?__=' + $.cookie('_robotAccess_') + '&source=' + window.jimiSource,
        success: function (data) {
          /*----显示常见问题---*/
          (function () {
            if (data && data.statusCode) {
              var i = 0;
              qaArray = data.obj;
            }
          }());
        },
        complete: function () {
          var newAnswer = new AnswerFactory.createAnswer('buyConsult', qaArray);
          newAnswer.show($("#buyConsultDiv"), false, false);
          $(window.document).trigger("faqAdded");
        },
        dataType: "json"
      });
    }


    function init() {
      //如果是售后默认显示本月订单
      getLastestMonthOrder(adjustTab);
      getQA();

      //增加new，后续删除咯
      $("#grkj").append('<i class="side-nav-new"></i>');

      if (!isCustomerEntrance()) {

        getProductInfo();
        //售后ABTEST：JIMI2显示本月订单，JIMI1显示个人空间
        if(package("v.myspace").isShowMyspace) {
          $("#bydd").hide();
          $("#grkj").show();
        } else {
          $("#bydd").show();
          $("#grkj").hide();
        }
      }else{
          $("#productInfo").hide();
          $("#bydd").trigger("mouseover");
      }

        $(".intro-bar").siblings(".nano").find(".content").each(function (index, el) {
        var item = $(this);
        item.height($("#jRightArea").outerHeight() - $("#sidenav").outerHeight() - $(".intro-bar").size() * $(".intro-bar").outerHeight());
      });
      $(".intro-bar").siblings(".nano").hide();
    }
    exports.init = init;
  }(jQuery, window));
  return exports;
});

/**
 * Created by cdxuxu on 2016/5/5.
 */
package("v.answerHandle", [], function (require, exports, moudle) {
  (function ($, window, document) {
    exports.answerRender=function(data, $replaceMsg){
      var answer;
      var ele = $("#chatcontent");
      answer = AnswerFactory.createAnswer(data.ptype, data.answers);
      //如果传入了替换Msg的ele，则
      if($replaceMsg) {
        $replaceMsg.removeClass().html("");
      }
      //如果传入了callback，在这里执行
      callback && callback(data.answer);
      answer.show($replaceMsg || ele, true, true);
      setScroll();
    }

  }(jQuery, window, document))


  return exports;
})

/**
 * Created by chenzhengguo on 2015/4/17.
 */
/**
 * 我的JIMI
 */
package("v.myjimi", [], function(require, exports, moudle) {
    (function($, window, undefined) {
        /**
         * 公共参数配置
         */
        var config = {
            "gender" : {0 : "male", 1 : "female"},

            "dist_url" : "//static.360buyimg.com/jimi/dist/v20150522/",
            "header_img" : {
                "novice" : {0: "novice-male", 1: "novice-female"},
                "elementary" : {0: "elementary-male", 1: "elementary-female"},
                "middle" : {0: "middle-male", 1: "middle-female"},
                "high" : {0: "high-male", 1: "high-female"},
                "top" : {0: "high-male", 1: "high-female"},
                1 : "self-1", 2 : "self-2", 3 : "self-3", 4 : "self-4", 5 : "self-5"
            }
        };
        exports.config = config;

        exports.levelType = "novice";
        exports.header_class = "novice-male";
        exports.skin_type = 1;
        exports.pic_type = 0;

        exports.nickName = "JIMI";

          /**
           * 主界面
           */
          exports.showIndex = function(adopt_name, event) {
             $("#lyjimi a").text("我的JIMI");

              // $.template('myjimi.index', unescape(package('tmpl.myjimi.index')));
              $.template('myjimi.index', unescape('<div class="myjimi-index-mask-gain"><div class="myjimi-index-gain"><div class="gain-guazi"><i class="gain-pic-guazi"></i> <span class="gain-exp-guazi"></span></div><div class="gain-text"><p id="gain-text-content">瓜子越多，升级越快哦</p></div><div class="gain-btn-confirm"></div></div></div><div class="myjimi-index-mask-lv"><div class="myjimi-index-lv"><div class="lv-bg-round"><div class="lv-bg-header novice-male"><div class="lv-bg-flag"></div></div></div><div class="lv-text-content"><p>完成<span id="task-name"></span>的任务</p><p>获得瓜子奖励</p></div><div class="gain-guazi"><i class="gain-pic-guazi"></i> <span class="gain-exp-guazi"></span></div><div class="lv-btn-confirm"></div></div></div><div class="myjimi-index-mask-sign-in"><div class="myjimi-index-sign-in"><div class="sign-in-btn-confirm"></div></div></div><div class="myjimi-index-mask-adopt-success"><div class="myjimi-index-adopt-success"><div class="text-content"><p>现在开始，<span class="adopt-name"></span></p><p>就是主人的专属秘书啦！</p><p>京东购物有疑问</p><p>找<span class="adopt-name"></span>解决！</p></div><div class="adopt-success-btn-confirm"></div></div></div><div class="myjimi-index-header"><div class="myjimi-index-out"></div><div class="myjimi-index-header-container"><div class="myjimi-index-header-img novice-male"><span id="level-info"></span><div class="myjimi-index-header-flag"><i id="gender-info" class="gender-icon male"></i> <span id="age-info"></span></div></div></div><div class="myjimi-header-name"></div><div class="myjimi-index-title"></div></div><div class="myjimi-index-shake"></div><div class="myjimi-index-content"><i class="exp-icon"></i> <span class="exp-num"></span><div class="exp-progress-primary"><div class="exp-progress-secondary"></div></div><span class="exp-ratio"></span><div class="btn-help">养成帮助</div></div><div class="myjimi-index-task"><div class="task-body"><i class="task-flag"></i> <i class="task-left arrow-left-gray"></i> <i data-value="" class="task-icon" id="task-a"></i> <i data-value="" class="task-icon" id="task-b"></i> <i data-value="" class="task-icon" id="task-c"></i> <i class="task-right arrow-right"></i></div></div><div class="myjimi-index-skill"><div class="skill-body"><i class="skill-flag"></i> <i class="skill-left arrow-left-gray"></i> <i data-value="" class="skill-icon" id="skill-a"></i> <i data-value="" class="skill-icon" id="skill-b"></i> <i data-value="" class="skill-icon" id="skill-c"></i> <i class="skill-right arrow-right"></i></div></div><div class="myjimi-index-tip"><div class="myjimi-tip-text"><p>加油呀主人！升级到<span id="tip-level"></span>级，就有新技能get，</p><p>新皮肤、新任务开启哦！</p></div></div>'));
              $("#myJimi").html($.tmpl('myjimi.index')).show();

              //  绑定主界面事件
              bindIndexEvent();
              //  处理用户信息
              processUserInfo(event);

              if (event == "new") {
                  $(".myjimi-index-mask-adopt-success").show();
                  $(".adopt-name").text(adopt_name);
              }
          };

        var showMaskingGuide1 = function() {
            var $body = $("body");
            var $startHtml = "<div class='masking-guide-1'>\
                <div class='btn-next'></div>\
                <div class='x-close'></div>\
                </div>";
            $("#masterDiv").css({display : 'block', left : 0});
            $body.append($startHtml).show();

            $('#grkj').addClass('current').siblings().removeClass('current');
            $('.js-navc-grkj').show().siblings().hide();

            var $index_header = $(".myjimi-index-header");
            $('.masking-guide-1').css({'left' : $index_header.offset().left - 343,
                'top' : $index_header.offset().top + 93});

            $(".x-close").on('click', function () {
                $('.masking-guide-1').remove();
                $("#masterDiv").hide();
            });

            $(".btn-next").on('click', function () {
                $('.masking-guide-1').remove();
                $("#masterDiv").hide();
                showMaskingGuide2();
            });

        };

        var showMaskingGuide2 = function() {
            var $body = $("body");
            var $startHtml = "<div class='masking-guide-2'>\
                <div class='btn-next'></div>\
                <div class='x-close'></div>\
                </div>";
            $("#masterDiv").css({display : 'block', left : 0});
            $body.append($startHtml).show();

            var $index_task = $(".myjimi-index-task");
            $('.masking-guide-2').css({'left' : $index_task.offset().left - 338,
                'top' : $index_task.offset().top - 30});

            $(".x-close").on('click', function () {
                $('.masking-guide-2').remove();
                $("#masterDiv").hide();
            });

            $(".btn-next").on('click', function () {
                $('.masking-guide-2').remove();
                $("#masterDiv").hide();
                showMaskingGuide3();
            });

        };

        var showMaskingGuide3 = function() {
            var $body = $("body");
            var $startHtml = "<div class='masking-guide-3'>\
                <div class='btn-finish'></div>\
                <div class='x-close'></div>\
                </div>";
            $("#masterDiv").css({display : 'block', left : 0});
            $body.append($startHtml).show();

            var $index_skill = $(".myjimi-index-skill");
            $('.masking-guide-3').css({'left' : $index_skill.offset().left - 333,
                'top' : $index_skill.offset().top - 25});

            $(".x-close").on('click', function () {
                $('.masking-guide-3').remove();
                $("#masterDiv").hide();
            });

            $(".btn-finish").on('click', function () {
                $('.masking-guide-3').remove();
                $("#masterDiv").hide();
            });

        };

        var help_qa = [
            {question : "Q : 瓜子是什么？" , answer : "A : 瓜子是我的JIMI完成任务后给予的奖励。"},
            {question : "Q : 我的JIMI名字可以修改吗？" , answer : "A : 我的JIMI名字一旦提交暂不支持修改。"},
            {question : "Q : 连续的签到会额外增加瓜子吗？" , answer : "A : 我的JIMI每日签到一次可获得对应瓜子数量，漏签后无法补签，一天内连续签到暂时无额外瓜子。"},
            {question : "Q : “出窝”有什么作用？" , answer : "A : 点击“出窝”后可以将我的JIMI放置在任何你想放置的网页位置。"},
            {question : "Q : 怎么点亮徽章？徽章会灭吗？" , answer : "A : 我的JIMI有守时达人、业务达人、娱乐达人等几个徽章；可以通过完成任务来点亮徽章，徽章点亮后不会熄灭。"},
            {question : "Q : 我的JIMI是怎么玩的？ " , answer : "A : 我的JIMI可以邀请好友领养了一起玩，作诗、讲笑话等。"},
            {question : "Q : 我的JIMI都有哪些技能？" , answer : "A : 随着JIMI等级的提高，技能有换肤、今日运程、天气早知道等。"},
            {question : "Q : 新手技能试玩，怎么玩？" , answer : "A : 首先点击我的新手技能试玩，出现第一次玩新技能可以获瓜子提示，选择其中任意一个展示的技能，点击试玩就可以了。"}
        ];

        var bindIndexEvent = function() {

            $("#myJimi")
                .on("click", ".adopt-success-btn-confirm", function(){
                    $(".myjimi-index-mask-adopt-success").hide();
                    package('v.myjimi.service').ajaxServices.isShowGuideFlow()
                        .success(function (resp) {
                            if (resp.code) {
                                if (resp.data.show_guide_flow_flag) {
                                    showMaskingGuide1();
                                }
                            }
                        });
                })
                .on("click", ".myjimi-index-out", function(){
                    if ($(".myjimi-move-wrapper").length != 0) {
                        return;
                    }

                    var $body = $("body");
                    var $moveHtml = "<div class='myjimi-move-wrapper'>\
                        <div class='myjimi-move-body'>\
                        </div>\
                        <div class='myjimi-move-shake'></div>\
                        <div class='myjimi-move-icon clearfix'>\
                        <i class='myjimi-btn-back'></i>\
                        <i class='myjimi-btn-shake'></i>\
                        </div>\
                        </div>";
                    $body.append($moveHtml).show();

                    $(".myjimi-index-header-img").attr('class', "myjimi-index-header-img");
                    $(".myjimi-index-out").attr('class', 'myjimi-index-in');

                    $(".myjimi-move-body").attr('class', 'myjimi-move-body ' + exports.header_class + '-body');

                    package('v.myjimi.skill').shake_pos = "move";
                    move();

                    $(".myjimi-btn-back").on('click', function(){
                        $(".myjimi-index-header-img").attr('class', "myjimi-index-header-img " + exports.header_class);
                        $(".myjimi-index-in").attr('class', 'myjimi-index-out');

                        package('v.myjimi.skill').shake_pos = "index";

                        $(".myjimi-move-wrapper").remove();
                    });
                    $(".myjimi-btn-shake").on('click', function(){
                        if (package('v.myjimi.skill').move_flag) {
                            return ;
                        }
                        package('v.myjimi.service').skillSubmitService('shake', {"pos" : "move"},
                            package('v.myjimi.skill').skillCallback['shake'].submitCallBack);
                    });
                }).on("click", ".myjimi-index-in", function () {
                    $(".myjimi-index-header-img").attr('class', "myjimi-index-header-img " + exports.header_class);
                    $(".myjimi-index-in").attr('class', 'myjimi-index-out');

                    package('v.myjimi.skill').shake_pos = "index";

                    $(".myjimi-move-wrapper").remove();
                });

            $('.btn-help').on('click', function () {
                var $body = $("body");
                var $helpHtml = "<div class='btn-help-content'>\
                    <div class='help-title'>养成帮助</div>\
                    <div class='help-qa'></div>\
                    <div class='btn-help-ok'><div>\
                    </div>";
                $("#masterDiv").css({display : 'block', left : 0});
                $body.append($helpHtml).show();

                $.each(help_qa, function (idx, qa) {
                    var $question = $("<p></p>").attr('class', 'question').text(qa.question);
                    var $answer = $("<p></p>").attr('class', 'answer').text(qa.answer);
                    $(".help-qa").append($question).append($answer).append($("<br/>"));
                });

                $(".btn-help-ok").on('click', function () {
                    $(".btn-help-content").remove();
                    $("#masterDiv").hide();
                });
            });

            $('.exp-progress-primary').on('mouseover', function () {
                var $body = $("body");
                var $progress = $(this);
                var $progressPop = $("<div></div>").attr('class', 'progress-pop').text("其实这是经验槽！")
                    .css({left : $progress.offset().left + 80, top : $progress.offset().top + 25});
                $body.append($progressPop);
                $progressPop.fadeIn(500);
            }).on('mouseout', function () {
                $('.progress-pop').remove();
            });

            $('.myjimi-header-name').on('mouseover', function () {
                var $window = $(window);
                var $body = $("body");
                var $name = $(this);
                var $namePop = $("<div></div>").attr('class', 'name-pop').text("这是小JIMI的名牌！")
                    .css({right : $window.width() - $name.offset().left - $name.width(), top : $name.offset().top + 35});
                $body.append($namePop);
                $namePop.fadeIn(500);
            }).on('mouseout', function () {
                $('.name-pop').remove();
            });

            $('#level-info').on('mouseover', function () {
                var $body = $("body");
                var $level = $(this);
                var $levelPop = $("<div></div>").attr('class', 'level-pop').text("等级太低，主人要努力啊！")
                    .css({left : $level.offset().left + 40, top : $level.offset().top + 20});
                $body.append($levelPop);
                $levelPop.fadeIn(500);
            }).on('mouseout', function () {
                $('.level-pop').remove();
            });

        };

        var move = function() {
            var sd_move = false;
            var sd_x, sd_y;

            $this = $(".myjimi-move-wrapper");
            $this.mousedown(function(e){
                sd_move = true;
                sd_x = e.pageX - $this.position().left;
                sd_y = e.pageY - $this.position().top;
            }).mousemove(function(e){
                if(sd_move){
                    var x = e.pageX - sd_x;
                    var y = e.pageY - sd_y;
                    $this.css({'left' :x, 'top' :y});
                }
            }).mouseup(function(){
                sd_move = false;
            });
        };

          var processUserInfo = function(event) {
              package("v.myjimi.service").ajaxServices.getUserInfo()
                  .success(function(resp) {
                      if (resp.code) {
                          var data = resp.data;

                          if (event != "new") {
                              if (data.adoptDay < 3) {
                                  package('v.myjimi.service').ajaxServices.isShowGuideFlow()
                                      .success(function (resp) {
                                          if (resp.code) {
                                              if (resp.data.show_guide_flow_flag) {
                                                  showMaskingGuide1();
                                              }
                                          }
                                      });
                              }
                          }

                          exports.nickName = data.nickName;

                          //  基本设置
                          $(".myjimi-header-name").text(data.nickName);
                          $(".myjimi-move-name").text(data.nickName);
                          $("#gender-info").attr('class', 'gender-icon ' + config.gender[data.gender]);
                          $("#age-info").text(data.adoptDay + '天');

                          exports.levelType = data.levelType;
                          exports.pic_type = data.picType;
                          exports.skin_type = data.skinType;

                          //  头像图标设置
                          if (exports.pic_type != 0) {
                              exports.header_class = config.header_img[exports.pic_type];
                          } else {
                              exports.header_class = config.header_img[exports.levelType][data.gender];
                          }
                          exports.renderJimiPic();
                          exports.renderPic();

                          //  皮肤样式设置
                          exports.renderSkin();

                          //  等级设置
                          $("#level-info").text("Lv." + data.level);
                          $(".exp-num").text(data.exp);
                          $(".exp-ratio").text(data.exp + "/" + data.expLimit);

                          var primary_progress_width = $(".exp-progress-primary").width();
                          var secondary_progress_width = Math.round(data.exp / data.expLimit * primary_progress_width);
                          $(".exp-progress-secondary").animate({width : secondary_progress_width}, 1000);

                          //  处理任务和技能信息
                          package('v.myjimi.task').handleTaskInfo(data);
                          package('v.myjimi.skill').handleSkillInfo(data);

                          exports.showIndexTip(data.level);
                     }
              });
          };

        exports.showIndexTip = function(level) {
            if (level == 8 || level == 9) {
                $('.myjimi-index-tip').show();
                $("#tip-level").text('10');
            }
            if (level == 18 || level == 19) {
                $('.myjimi-index-tip').show();
                $("#tip-level").text('20');
            }
            if (level == 28 || level == 29) {
                $('.myjimi-index-tip').show();
                $("#tip-level").text('30');
            }
            if (level == 38 || level == 39) {
                $('.myjimi-index-tip').show();
                $("#tip-level").text('40');
            }
        };



          exports.renderJimiPic = function() {
              setTimeout(function(){
                  $.each($(".jimi_lists"), function (idx, e) {
                      $(this).find(".header_img").attr('class', 'header_img fl ' + exports.header_class);
                  });
              }, 500);
              window["jimiHeader"] = exports.header_class;
          };

          exports.renderPic = function() {
              if (package('v.myjimi.skill').shake_pos == "index") {
                  $(".myjimi-index-header-img").attr('class', 'myjimi-index-header-img ' + exports.header_class);
              }
              $(".lv-bg-header").attr('class', 'lv-bg-header ' + exports.header_class);
              $(".myjimi-move-body").attr('class', 'myjimi-move-body ' + exports.header_class + '-body');
          };

          var skinBgConfig = {
                skinBg : {
                    2: 'i/bg-purple.png',
                    3: 'i/bg-green.png',
                    4: 'i/bg-pink.png'
                },
                full_screen_bg : {
                    1: 'full-screen',
                    2: 'full-screen-purple',
                    3: 'full-screen-green',
                    4: 'full-screen-pink'
                },
                full_screen_quit_bg : {
                    1: 'full-screen-quit',
                    2: 'full-screen-quit-purple',
                    3: 'full-screen-quit-green',
                    4: 'full-screen-quit-pink'
                },
                close_screen_bg : {
                    1: 'close-screen',
                    2: 'close-screen-purple',
                    3: 'close-screen-green',
                    4: 'close-screen-pink'
                }
          };
          exports.skinBgConfig = skinBgConfig;

          exports.renderSkin = function() {
              if (exports.skin_type == 1) {
                  $(".header").css('backgroundImage', "");
              } else {
                  $(".header").css('backgroundImage', "url(" + config.dist_url + skinBgConfig.skinBg[exports.skin_type] + ")");
              }

              var $winmax = $("#winmax");
              if ($winmax.attr('class').indexOf('quit') != -1) {
                  $winmax.attr('class', skinBgConfig.full_screen_quit_bg[exports.skin_type]);
              } else {
                  $winmax.attr('class', skinBgConfig.full_screen_bg[exports.skin_type]);
              }
              $("#winclose_top").attr('class', skinBgConfig.close_screen_bg[exports.skin_type]);
          };

    }(jQuery, window, undefined));

    return exports;
});
/**
 *  领养页面逻辑
 */

package("v.myjimi.adopt", [], function(require, exports, module){

    (function($, window, document){
        /**
         * 入口
         */
        exports.init = function(event) {
            //  更换Tab页id属性
//            $("#mySpace").attr("id", "myJimi");
          $("#lyjimi a").text("领养JIMI");
            $('#j_teach').hide();

            package("v.myjimi.service").ajaxServices.isAdopted().success(function(resp){
                if (resp.code) {
                    if (null == resp.data) {
                        exports.showIntro();
                    } else {
                        if (resp.data.adopted) {
                            package('v.myjimi').showIndex();
                        } else {
                            if (event == "adopt") {
                                exports.showAdopt();
                                return;
                            }
                            exports.showIntro();
                            package('v.myjimi.service').ajaxServices.isShowGuide()
                                .success(function (resp) {
                                    if (resp.code) {
                                        if (resp.data.show_guide_flag) {
                                            showMaskingStart();
                                        }
                                    }
                                });
                        }
                    }
                }
            });
        };

        var showMaskingStart = function () {
            var $body = $("body");
            var $startHtml = "<div class='masking-guide-start'>\
                <div class='btn-start'></div>\
                </div>";
            $("#masterDiv").css({display : 'block', left : 0});
            $body.append($startHtml).show();

            var $tab_space = $("#lyjimi a");
            $('.masking-guide-start').css({'left' : $tab_space.offset().left - 300,
                'top' : $tab_space.offset().top + 15});

            $(".btn-start").on('click', function () {
                $('#lyjimi').addClass('current').siblings().removeClass('current');
                $('.tab_arrow').css({"left":"238px"});
                $('.js-navc-lyjimi').show().siblings().hide();
                $('.masking-guide-start').remove();
                $("#masterDiv").hide();


            });
        };

        /**
         * 介绍页面
         */
        exports.showIntro = function() {
            $.template('myjimi.intro', unescape('<div class="myjimi-intro-wrapper"><div class="myjimi-intro-img"><div class="myjimi-intro-flag" id="myjimi-adopt"></div></div></div>'));
            $("#myJimi").html($.tmpl('myjimi.intro')).show();
            initIntroEvent();
        };

        /**
         * 领养页面
         */
        exports.showAdopt = function() {
            $.template('myjimi.adopt', unescape('<div class="myjimi-adopt-wrapper"><div class="myjimi-adopt-avatar male" id="adopt-gender"><div class="myjimi-adopt-flag"></div></div><div class="myjimi-adopt-form"><p class="myjimi-adopt-tips">主人，主人，给我起个名字吧！<br>以后我就是您的专属JIMI啦！</p><div class="myjimi-adopt-name"><input class="myjimi-adopt-name-input" id="adopt-name" maxlength="10" value=""><p class="myjimi-adopt-name-error"></p></div><ul class="myjimi-adopt-gender clearfix"><li class="fl checked" id="adopt-male"><i class="icon-adopt-male"></i><i class="icon-adopt-checked"></i></li><li class="fr" id="adopt-female"><i class="icon-adopt-female"></i><i class="icon-adopt-checked"></i></li></ul></div><div class="myjimi-adopt-submit"><button class="btn btn-default" id="adopt-cancel">改天领养</button> <button class="btn btn-primary" id="adopt-ok">立即领养</button></div></div>'));
            $("#myJimi").html($.tmpl('myjimi.adopt')).show();
            $("#adopt-name").focus();
            initAdoptEvent();
        };

        /**
         *   初始化领养介绍页面事件绑定
         */
        var initIntroEvent = function() {
            $("#myjimi-adopt").on('click', function() {
                package("v.myjimi.service").ajaxServices.isAdopted().success(function(resp){
                    if (resp.code) {
                        if (null == resp.data) {
                            //package('v.login').showLoginDialog();
                            $('.jimi-noLogin-msgTips').find('a').trigger('click');
                        } else {
                            if (resp.data.adopted) {
                                package('v.myjimi').showIndex();
                            } else {
                                exports.showAdopt();
                            }
                        }
                    }
                });
            });
        };

        /**
         *   初始化领养流程事件绑定
        */
        var initAdoptEvent = function() {
            $("#myJimi").on("click", "#adopt-male, #adopt-female", function() {
                var $this = $(this);
                var $adopt_gender = $("#adopt-gender");
                $this.addClass("checked").siblings("li").removeClass("checked");

                if($this.attr("id") == 'adopt-male') {
                    $adopt_gender.removeClass("female").addClass("male");
                } else {
                    $adopt_gender.removeClass("male").addClass("female");
                }
            }).on("click", "#adopt-cancel", function() {
                exports.showIntro();
            }).on("click", "#adopt-ok", function() {
                var adopt_name = $("#adopt-name").val().trim();
                if (adopt_name == "") {
                    $('.myjimi-adopt-name-error').text('主人，给我起个名字吧').show();
                    return ;
                }

                var data = {
                    "nickName": adopt_name,
                    "gender": $("#adopt-male").hasClass("checked") ? 0 : 1,
//                    "invitingUser": $("#invitingUser").val()
                    "invitingUser": window.invitingUser
                };
                package("v.myjimi.service").ajaxServices.adoptJimi(data).success(function(resp) {
                    if(resp.code){
                        if(resp.data.exist){
                            $('.myjimi-adopt-name-error').text('主人，这个名字已经有啦').show();
                        } else{
                            package('v.myjimi').showIndex(adopt_name, "new");
                        }
                    }
                });
            });
        };

    }(jQuery, window, document));

    return exports;
});
/**
 *  公共服务
 */

package("v.myjimi.service", [], function(require, exports, module){

    (function($, window, document){
        exports.ajaxServices = (function() {
            var domain = '//uu-jimi.jd.com';
            var services = {
                "isAdopted": {method: 'POST', url: '/myJimi/isAdopted'},
                "adoptJimi": {method: 'POST', url: '/myJimi/adoptJimi'},
                "getUserInfo": {method: 'POST', url: '/myJimi/getUserInfo'},
                "updateUserSkinAndPic": {method: "POST", url: '/myJimi/updateUserSkinAndPic'},
                "isShowGuide": {method: "POST", url: '/myJimi/isShowGuide'},
                "isShowGuideFlow": {method: "POST", url: '/myJimi/isShowGuideFlow'}
            };


            //  初始化各个服务接口
            $.each(services, function(funcName, request) {
                services[funcName] = function(data) {
                    data = data || {};
                    return $.ajax({
                        method: request.method,
                        url: domain + request.url,
                        cache: false,
                        dataType : 'jsonp',
                        data:  data
                    });
                }
            });
            return services;
        }());

        exports.taskProcessService = function(taskName, callback){
            $.ajax({
                method: 'POST',
                url: '//uu-jimi.jd.com/myJimi/processTask',
                cache: false,
                dataType : 'jsonp',
                data:  {"taskName" : taskName}
            }).success(function (resp) {
                if (resp.code) {
                    typeof callback == "function" && callback(resp.data);
                }
            });
        };

        exports.taskSubmitService = function(taskName, extInfo, callback){
            $.ajax({
                method: 'POST',
                url: '//uu-jimi.jd.com/myJimi/submitTask',
                cache: false,
                dataType : 'jsonp',
                data:  {"taskName" : taskName, "extInfo" : JSON.stringify(extInfo)}
            }).success(function (resp) {
                if (resp.code) {
                    typeof callback == "function" && callback(resp.data, extInfo);
                    if (resp.data.taskResult.expGain != null) {
                        package("v.myjimi.task").showExpGainTip(resp.data, taskName, extInfo);
                    }
                }
            });
        };

        exports.skillProcessService = function(skillName, callback){
            $.ajax({
                method: 'POST',
                url: '//uu-jimi.jd.com/myJimi/processSkill',
                cache: false,
                dataType : 'jsonp',
                data:  {"skillName" : skillName}
            }).success(function (resp) {
                if (resp.code) {
                    typeof callback == "function" && callback(resp.data);
                }
            });
        };

        exports.skillSubmitService = function(skillName, extInfo, callback){
            $.ajax({
                method: 'POST',
                url: '//uu-jimi.jd.com/myJimi/submitSkill',
                cache: false,
                dataType : 'jsonp',
                data:  {"skillName" : skillName, "extInfo" : JSON.stringify(extInfo)}
            }).success(function (resp) {
                if (resp.code) {
                    typeof callback == "function" && callback(resp.data, extInfo);
                } else {
                    typeof callback == "function" && callback(resp.data, null);
                }
            });
        };

    }(jQuery, window, document));

    return exports;
});
/**
 * 我的JIMI任务服务组件
 */

package("v.myjimi.task", [], function (require, exports, moudle) {

    /**
     * 公共参数配置
     */
    var task_config = {
        "title" : {
            "fun_master" : "娱乐达人",
            "time_master" : "守时达人",
            "bussiness_master" : "业务达人",
            "hot_heart" : "热心肠",
            "test_master": "众测达人"
        },

        "task" : {
            "bussiness" : "task-bussiness",
            "invite_friend_adopt" : "task-invite-friend-adopt",
            "invite_friend_wechat" : "task-invite-friend-wechat",
            "sign_in" : "task-sign-in",
            "try_novice" : "task-try-novice",
            "try_high" : "task-try-high",
            "try_middle" : "task-try-middle",
            "try_elementary" : "task-try-elementary",
            "knowledge_qa" : "task-knowledge-qa",
            "talk_qa" : "task-talk-qa"
        },

        "taskName" : {
            "bussiness" : "熟悉JIMI业务",
            "invite_friend_adopt" : "邀请好友领养",
            "invite_friend_wechat" : "邀请好友关注",
            "sign_in" : "每日签到",
            "try_novice" : "新手技能试玩",
            "try_high" : "高级技能试玩",
            "try_middle" : "中级技能试玩",
            "try_elementary" : "初级技能试玩",
            "knowledge_qa" : "知识问答",
            "talk_qa" : "互诉衷肠"
        },

        "taskDesc" : {
            "bussiness" : "熟悉JIMI的业务功能",
            "invite_friend_adopt" : "邀请好友领养JIMI，好友领养成功，主人获得瓜子奖励",
            "sign_in" : "JIMI打卡",
            "try_novice" : "试玩任意新手技能，每天第一次试玩有瓜子奖励",
            "try_high" : "试玩高级技能\"超时空接触\"或者\"人工服务\"，每天第一次试玩有瓜子奖励",
            "try_middle" : "试玩中级技能\"向TA表白\"，每天第一次试玩有瓜子奖励",
            "try_elementary" : "试玩初级技能\"专属教学\"，每天第一次试玩有瓜子奖励",
            "knowledge_qa" : "知识问答",
            "talk_qa" : "互诉衷肠"
        }
    };
    exports.task_config = task_config;

    var taskContainer = {
        "taskName" : [],
        "taskBg" : [],
        "taskSize": 0,
        "taskIdx" : 0
    };
    exports.taskContainer = taskContainer;

    /**
     * 处理任务信息
     */
    exports.handleTaskInfo = function(data) {
        exports.showTitle(data.titleItems);
        exports.showTask(data.taskItems);
        exports.bindTaskEvent();

        if (data.invitedUser != null) {
            package('v.myjimi.task').taskSubmitService('invite_friend_adopt',
                {'invitedUser' : data.invitedUser});
        }
    };

    /**
     * 展示头衔图标
     */
    exports.showTitle = function(titleItems) {
        var $titleBody = $(".myjimi-index-title");
        $titleBody.html("");

        $.each(titleItems, function(idx, item) {
            var titleElem = $("<i></i>");
            if (item.mark) {
                titleElem.attr('class', 'title-icon title_' + item.itemName)
                    .attr('data-value', item.itemName).attr('data-label', item.level);
            } else {
                titleElem.attr('class', 'title-icon title_' + item.itemName + '_gray')
                    .attr('data-value', item.itemName);
            }
            $titleBody.append(titleElem);
        });
    };

    /**
     * 展示任务图标
     */
    exports.showTask = function(taskItems) {
        taskContainer.taskName = [];
        taskContainer.taskBg = [];
        taskContainer.taskSize = 0;
        taskContainer.taskIdx = 0;

        $.each(taskItems, function(idx, item) {
            taskContainer.taskName.push(item.itemName);
            if (item.mark) {
                taskContainer.taskBg.push(task_config.task[item.itemName]);
            } else {
                taskContainer.taskBg.push(task_config.task[item.itemName] + '-gray');
            }
            ++ taskContainer.taskSize;
        });

        if (taskContainer.taskSize < 4) {
            $(".task-right").removeClass('arrow-right').addClass('arrow-right-gray');
        }

        exports.tabTask(taskContainer.taskIdx);
    };

    /**
     * 切换任务
     */
    exports.tabTask = function() {
        var idx = taskContainer.taskIdx;

        var $taskA = $("#task-a");
        var $taskB = $("#task-b");
        var $taskC = $("#task-c");

        $taskA.attr('data-value', taskContainer.taskName[idx]);
        $taskB.attr('data-value', taskContainer.taskName[idx + 1]);
        $taskC.attr('data-value', taskContainer.taskName[idx + 2]);

        $taskA.attr('class', 'task-icon ' + taskContainer.taskBg[idx]);
        $taskB.attr('class', 'task-icon ' + taskContainer.taskBg[idx + 1]);
        $taskC.attr('class', 'task-icon ' + taskContainer.taskBg[idx + 2]);
    };

    /**
     * 绑定任务相关事件
     */
    exports.bindTaskEvent = function() {

        $(".task-left").on('click', function () {
            var idx = taskContainer.taskIdx;

            if (idx == 0) {
                return ;
            }

            if (idx == taskContainer.taskSize - 3) {
                $(".task-right").removeClass('arrow-right-gray').addClass('arrow-right');
            }

            if (idx - 3 < 0) {
                taskContainer.taskIdx = 0;
                $(this).removeClass('arrow-left').addClass('arrow-left-gray');
            } else {
                taskContainer.taskIdx = idx - 3;
            }

            exports.tabTask();
        });

        $(".task-right").on('click', function () {
            var idx = taskContainer.taskIdx;

            if (idx == taskContainer.taskSize - 3) {
                return ;
            }

            if (idx == 0) {
                $(".task-left").removeClass('arrow-left-gray').addClass('arrow-left');
            }

            if (idx + 6 > taskContainer.taskSize - 1) {
                taskContainer.taskIdx = taskContainer.taskSize - 3;
                $(this).removeClass('arrow-right').addClass('arrow-right-gray');
            } else {
                taskContainer.taskIdx = idx + 3;
            }

            exports.tabTask();
        });

        $(".task-flag").on('mouseover', function () {
            var $body = $("body");
            var $taskFlag = $(".task-flag");
            var $taskFlagPop = $("<div></div>").attr('class', 'task-flag-pop').text("做任务获得瓜子，瓜子越多升级越快!")
                .css({left : $taskFlag.offset().left + 45, top : $taskFlag.offset().top + 10});
            $body.append($taskFlagPop);
            $taskFlagPop.fadeIn(500);
        }).on('mouseout', function () {
            $(".task-flag-pop").remove();
        });

        $(".title-icon").on('mouseover', function () {
            var $body = $("body");
            var $title = $(this);
            var titleDesc = "";
            if ($title.attr('class').indexOf('gray') != -1) {
                titleDesc = task_config.title[$title.attr('data-value')];
            } else {
                titleDesc = task_config.title[$title.attr('data-value')] + "  "
                    + $title.attr('data-label') + "级";
            }
            var $titlePop = $("<div></div>").attr('class', 'title-pop').text(titleDesc)
                .css({left : $title.offset().left + 15, top : $title.offset().top - 25});
            $body.append($titlePop);
            $titlePop.fadeIn(500);
        }).on('mouseout', function () {
            $(".title-pop").remove();
        });

        $(".task-icon").on('mouseover', function () {
            var $window = $(window);
            var $body = $("body");
            var $task = $(this);
            var $taskPop = $("<div></div>").attr('class', 'task-pop').text(task_config.taskDesc[$task.attr('data-value')])
                .css({left : $task.offset().left - 30, bottom : $window.height() - $task.offset().top - 5});
            $body.append($taskPop);
            $taskPop.fadeIn(500);
        }).on('mouseout', function () {
            $(".task-pop").remove();
        });

        $(".task-icon").on('click', function() {

            if ($(this).attr('class').indexOf('gray') != -1) {
                return ;
            }

            var taskName = $(this).attr('data-value');

            if (taskName == 'try_novice' || taskName == 'invite_friend_adopt' || taskName == 'try_elementary' ||
                    taskName == 'try_middle' || taskName == 'try_high' || taskName == "knowledge_qa" || taskName == "talk_qa") {
                package('v.myjimi.service').taskProcessService(
                    taskName, taskCallback[taskName].processCallBack);
            } else {
                package('v.myjimi.service').taskSubmitService(
                    taskName, {}, taskCallback[taskName].submitCallBack);
            }
        })
    };

    exports.showExpGainTip = function (data, taskName, extInfo) {
        $.each($(".myjimi-index-title").find("i"), function(idx, e) {
            var $this = $(this);
            if ($this.attr('class').indexOf(data.taskResult.title) != -1 &&
                    $this.attr('class').indexOf('gray') != -1) {
                $this.attr('class', "title-icon title_"+ data.taskResult.title).attr('data-label', 0);
            }
        });

        $(".exp-num").text(data.taskResult.expUpdated);
        $(".exp-ratio").text(data.taskResult.expUpdated + "/" + data.expLimit);
        $("#level-info").text("Lv." + data.level);

        var secondary_progress_width = Math.round(data.taskResult.expUpdated / data.expLimit
            * $(".exp-progress-primary").width());
        $(".exp-progress-secondary").css({width : secondary_progress_width});

        if (data.levelTypeUpdated) {
            if (package('v.myjimi').pic_type == 0) {
                package('v.myjimi').header_class = package('v.myjimi').header_class.replace(
                    package('v.myjimi').levelType, data.levelType);
                package('v.myjimi').renderJimiPic();
                package('v.myjimi').renderPic();
            }
            package('v.myjimi').levelType = data.levelType;
        }

        if (! data.levelUpdated) {
            $(".myjimi-index-mask-gain").show();

            $(".gain-exp-guazi").text("+" + data.taskResult.expGain);
            if (taskName == 'invite_friend_adopt') {
                $("#gain-text-content").text('您的好友已成功领养~~');

            }

            $(".gain-btn-confirm").on('click', function () {
                $(".myjimi-index-mask-gain").hide();
            });
        } else {
            $(".myjimi-index-mask-lv").show();

            $(".lv-bg-flag").text("Lv." + data.level);
            $("#task-name").text(task_config.taskName[taskName]);
            $(".gain-exp-guazi").text("+" + data.taskResult.expGain);

            $(".lv-btn-confirm").on('click', function () {
                if (! data.levelTypeUpdated) {
                    $(".myjimi-index-mask-lv").hide();
                    package('v.myjimi').showIndexTip(data.level);
                } else {
                    $(".myjimi-index-mask-lv").hide();
                    $(".myjimi-index-tip").hide();

                    exports.showTitle(data.titleItems);
                    exports.showTask(data.taskItems);
                    package('v.myjimi.skill').showSkill(data.skillItems);
                }
            });
        }

    };

    var taskCallback = {
        "try_novice" : {
            submitCallBack : function(data, extInfo){},
            processCallBack : function(data){
                var $body = $("body");
                var $maskingHtml = "<div class='try-novice-masking'>\
                    <div class='masking-pop'>\
                    <div class='masking-text'>\
                    <p>每天第一次试玩新手技能</p>\
                    <p>就可以获得瓜子哦</p>\
                    </div>\
                    <div class='masking-btn'>确定</div>\
                    </div>\
                    <div class='masking-circle'></div>\
                    </div>";
                $body.append($maskingHtml).show();

                var $skill_flag = $('.skill-flag');
                $(".try-novice-masking").css({left : $skill_flag.offset().left + 50,
                    top : $skill_flag.offset().top - 110});

                $("#masterDiv").css({display : 'block', left : 0});
                package('v.myjimi.skill').try_novice_flag = true;

                $(".masking-btn").on('click', function() {
                    $(".try-novice-masking").remove();
                    $("#masterDiv").hide();
                });
            }
        },
        "invite_friend_adopt" : {
            submitCallBack : function(data, extInfo){},
            processCallBack : function(data){
                var question = "\"邀请好友领养\"任务怎么做？";
                var answer = "主人将下面的链接复制发送给朋友，邀请朋友来领养<br>" +
                    "JIMI，领养成功主人就可以获得100瓜子的开心值！<br>" +
                    "PS：要在24小时内完成哦<br>" +
                    "//jimi.jd.com/index.action?invitingUser="+ $.cookie('pin');
                showMes("我", question);
                showMes("JIMI", answer);
            }
        },
        "sign_in" : {
            submitCallBack : function(data, extInfo){
                if (! data.taskResult.bussinessData.sign_in_flag) {
                    $(".myjimi-index-mask-sign-in").show();
                    $(".sign-in-btn-confirm").on('click', function(){
                        $(".myjimi-index-mask-sign-in").hide();
                    });
                }
            }
        },
        "bussiness" : {
            submitCallBack : function(data, extInfo){
                var question = data.taskResult.bussinessData;
                if (question) {
                    showMes("我", question);
                    sendRequest(question, 0);
                }
            }
        },
        "try_elementary" : {
            submitCallBack : function(data, extInfo){},
            processCallBack : function(data) {
                package('v.myjimi.skill').try_elementary_flag = true;
            }
        },
        "try_middle" : {
            submitCallBack : function(data, extInfo){},
            processCallBack : function(data) {
                package('v.myjimi.skill').try_middle_flag = true;
            }
        },
        "try_high" : {
            submitCallBack : function(data, extInfo){},
            processCallBack : function(data) {
                package('v.myjimi.skill').try_high_flag = true;
            }
        },
        "knowledge_qa" : {
            submitCallBack : function(data, extInfo){},
            processCallBack : function(data) {
                var $body = $("body");
                var $windowHtml = "<div class='knowledge-window'>\
                <div class='qa-block'>\
                <p id='qa-1'>xx</p>\
                <input type='hidden' id='qa-1-a' value='1'> \
                <input type='radio' id='qa-1-yes' name='qa-1-check' value='1' checked='checked' /><label for='qa-1-yes'>是</label> \
                <input type='radio' id='qa-1-no' name='qa-1-check' value='0' /><label for='qa-1-no'>否</label> \
                <p id='qa-2'>xxx</p>\
                <input type='hidden' id='qa-2-a' value='1'> \
                <input type='radio' id='qa-2-yes' name='qa-2-check' value='1' checked='checked' /><label for='qa-2-yes'>是</label> \
                <input type='radio' id='qa-2-no' name='qa-2-check' value='0' /><label for='qa-2-no'>否</label> \
                <p id='qa-3'>xxx</p>\
                <input type='hidden' id='qa-3-a' value='1'> \
                <input type='radio' id='qa-3-yes' name='qa-3-check' value='1' checked='checked' /><label for='qa-3-yes'>是</label> \
                <input type='radio' id='qa-3-no' name='qa-3-check' value='0' /><label for='qa-3-no'>否</label> \
                </div> \
                <div class='btn-undo'></div> \
                <div class='btn-do'></div> \
                </div>";

                $("#masterDiv").css({display : 'block', left : 0});
                $body.append($windowHtml).show();

                var qa_data = data.taskResult.bussinessData;
                $.each(qa_data, function(idx, item){
                    $("#qa-" + (idx + 1)).text(item.question);
                    $("#qa-" + (idx + 1) + "-a").val(item.answer);
                });

                $(".btn-undo").on('click', function(){
                    $(".knowledge-window").remove();
                    $("#masterDiv").hide();
                });

                $(".btn-do").on('click', function(){
                    var score = 0;
                    if ($("input[name='qa-1-check']:checked").val() == $("#qa-1-a").val()) {
                        score ++;
                    }
                    if ($("input[name='qa-2-check']:checked").val() == $("#qa-2-a").val()) {
                        score ++;
                    }
                    if ($("input[name='qa-3-check']:checked").val() == $("#qa-3-a").val()) {
                        score ++;
                    }

                    $(".knowledge-window").remove();

                    var $body = $("body");
                    var $score_window = "<div class='score-window'>\
                    <div class='score-img high-img'></div>\
                    <div class='score-tip'></div> \
                    <div class='score-text'></div>\
                    <div class='score-confirm'></div> \
                    </div>";

                    $body.append($score_window).show();

                    var score_config = {
                        0 : 0,
                        1 : 33,
                        2 : 66
                    };
                    if (score == 3) {
                        $('.score-tip').text("恭喜主人~~");
                        var $score_text = "<p>主人考了<span>100</span>分，真是太棒了，好开心啊~~~</p>";
                        $('.score-text').html($score_text);
                        package('v.myjimi.service').taskSubmitService('knowledge_qa', null,
                            taskCallback['knowledge_qa'].submitCallBack);
                    } else {
                        $('.score-img').removeClass('high-img').addClass('low-img');
                        $('.score-tip').text("万分遗憾~~");
                        var $score_text = "<p>主人考了<span>" + score_config[score] + "</span>分，真是遗憾啊，再接再厉哦~~~</p>";
                        $('.score-text').html($score_text);
                    }

                    $(".score-confirm").on('click', function(){
                        $(".score-window").remove();
                        $("#masterDiv").hide();
                    });

                });
            }
        },
        "talk_qa" : {
            submitCallBack : function(data, extInfo){},
            processCallBack : function(data) {
                var $body = $("body");
                var $windowHtml = "<div class='talk-window'>\
                <div class='qa-block'>\
                <p id='qa-1'>xx</p>\
                <span class='key' id='qa-1-key' data-value=''></span><input class='qa-input' id='qa-1-input' maxlength='10'/>\
                <p class='alert' id='qa-1-alert'></p>\
                <p id='qa-2'>xxx</p>\
                <span class='key' id='qa-2-key' data-value=''></span><input class='qa-input' id='qa-2-input' maxlength='10'/>\
                <p class='alert' id='qa-2-alert'></p>\
                <p id='qa-3'>xxx</p>\
                <input type='hidden' id='qa-3-key' data-value=''> \
                <input type='radio' id='qa-3-yes' name='qa-3-input' value='是' checked='checked' /><label for='qa-3-yes'>是</label> \
                <input type='radio' id='qa-3-no' name='qa-3-input' value='否' /><label for='qa-3-no'>否</label> \
                </div> \
                <div class='btn-undo'></div> \
                <div class='btn-do'></div> \
                </div>";

                $("#masterDiv").css({display : 'block', left : 0});
                $body.append($windowHtml).show();

                var qa_data = data.taskResult.bussinessData;
                $.each(qa_data, function(idx, item){
                    $("#qa-" + (idx + 1)).text(item.question);
                    if (item.type == 1 || item.type == 2) {
                        $("#qa-" + (idx + 1) + "-key").text(item.key + " : ");
                        $("#qa-" + (idx + 1) + "-key").attr('data-value', item.key);
                        $("#qa-" + (idx + 1) + "-alert").text("主人请填写一下" + item.key + "吧");
                    } else if (item.type == 3) {
                        $("#qa-3-key").attr('data-value', item.key);
                    }
                });

                $('.qa-input').on('focus', function () {
                    $(this).css('border','2px solid #8BC2E8');
                    $('.alert').hide();
                }).on('blur', function () {
                    $(this).css('border','none');
                });

                $(".btn-undo").on('click', function(){
                    $(".talk-window").remove();
                    $("#masterDiv").hide();
                });

                $(".btn-do").on('click', function(){
                    var input1 = $('#qa-1-input').val().trim();
                    if (input1 == "") {
                        $('#qa-1-alert').show();
                        return ;
                    }

                    var input2 = $('#qa-2-input').val().trim();
                    if (input2 == "") {
                        $('#qa-2-alert').show();
                        return ;
                    }

                    var data = {
                        key_1 : $('#qa-1-key').attr('data-value'),
                        answer_1 : input1,
                        key_2 : $('#qa-2-key').attr('data-value'),
                        answer_2 : input2,
                        key_3 : $('#qa-3-key').attr('data-value'),
                        answer_3 : $("input[name=qa-3-input]:checked").val()
                    };

                    package('v.myjimi.service').taskSubmitService('talk_qa', data,
                        taskCallback['talk_qa'].submitCallBack);
                    $(".talk-window").remove();
                    $("#masterDiv").hide();
                });
            }
        }
    };
    exports.taskCallback = taskCallback;

    return exports;
});
/**
 * 我的JIMI技能服务组件
 */

package("v.myjimi.skill", [], function (require, exports, moudle) {

    /**
     * 公共参数配置
     */
    var skill_config = {
        "skill" : {
            "chat" : "skill-chat",
            "fortune" : "skill-fortune",
            "joke" : "skill-joke",
            "poem" : "skill-poem",
            "shake" : "skill-shake",
            "skin" : "skill-skin",
            "teach" : "skill-teach",
            "weather" : "skill-weather",
            "vindicate" : "skill-vindicate",
            "macross_contact" : "skill-macross-contact",
            "manual_service" : "skill-manual-service"
        },

        "skillDesc" : {
            "chat" : "JIMI的身家都告诉你啦",
            "fortune" : "查运势，查星座",
            "joke" : "JIMI和您聊笑话",
            "poem" : "来和JIMI比赛对诗",
            "shake" : "点击有惊喜",
            "skin" : "更换JIMI皮肤，随等级升高，开启新皮肤",
            "teach" : "专属教学，你教我学",
            "weather" : "天气查询",
            "vindicate" : "向TA表白",
            "macross_contact" : "超时空接触",
            "manual_service" : "人工服务"
        }
    };
    exports.skill_config = skill_config;

    var skillContainer = {
        "skillName" : [],
        "skillBg" : [],
        "skillSize" : 0,
        "skillIdx" : 0
    };
    exports.skillContainer = skillContainer;

    /**
     * 技能试玩任务标志
     */
    exports.try_novice_flag = false;
    exports.try_elementary_flag = false;
    exports.try_middle_flag = false;
    exports.try_high_flag = false;

    /**
     * 摇摇乐相关标志
     */
    exports.index_flag = false;
    exports.move_flag = false;
    exports.shake_pos = "index";

    /**
     * 皮肤头像相关配置
     */
    var skinConf = {
        1 : "blue-skin",
        2 : "purple-skin",
        3 : "green-skin",
        4 : "pink-skin"
    };
    var headerConf = {
        1 : "header-1",
        2 : "header-2",
        3 : "header-3",
        4 : "header-4"
    };

    exports.skinConf = skinConf;
    exports.headerConf = headerConf;

    /**
     * 处理技能信息
     */
    exports.handleSkillInfo = function(data) {
        exports.showSkill(data.skillItems);
        exports.bindSkillEvent();
    };


    /**
     * 展示技能图标
     */
    exports.showSkill = function(skillItems) {
        skillContainer.skillName = [];
        skillContainer.skillBg = [];
        skillContainer.skillSize = 0;
        skillContainer.skillIdx = 0;

        $.each(skillItems, function(idx, item) {
            skillContainer.skillName.push(item.itemName);
            if (item.mark) {
                skillContainer.skillBg.push(skill_config.skill[item.itemName]);
            } else {
                skillContainer.skillBg.push(skill_config.skill[item.itemName] + '-gray');
            }
            ++ skillContainer.skillSize;
        });

        exports.tabSkill(skillContainer.skillIdx);
    };

    /**
     * 切换技能
     */
    exports.tabSkill = function() {
        var idx = skillContainer.skillIdx;

        var $skillA = $("#skill-a");
        var $skillB = $("#skill-b");
        var $skillC = $("#skill-c");

        $skillA.attr('data-value', skillContainer.skillName[idx]);
        $skillB.attr('data-value', skillContainer.skillName[idx + 1]);
        $skillC.attr('data-value', skillContainer.skillName[idx + 2]);

        $skillA.attr('class', 'skill-icon icon ' + skillContainer.skillBg[idx]);
        $skillB.attr('class', 'skill-icon icon ' + skillContainer.skillBg[idx + 1]);
        $skillC.attr('class', 'skill-icon icon ' + skillContainer.skillBg[idx + 2]);
    };

    /**
     * 绑定技能相关事件
     */
    exports.bindSkillEvent = function() {

        $(".skill-left").on('click', function () {
            var idx = skillContainer.skillIdx;

            if (idx == 0) {
                return ;
            }

            if (idx == skillContainer.skillSize - 3) {
                $(".skill-right").removeClass('arrow-right-gray').addClass('arrow-right');
            }

            if (idx - 3 < 0) {
                skillContainer.skillIdx = 0;
                $(this).removeClass('arrow-left').addClass('arrow-left-gray');
            } else {
                skillContainer.skillIdx = idx - 3;
            }

            exports.tabSkill();
        });

        $(".skill-right").on('click', function () {
            var idx = skillContainer.skillIdx;

            if (idx == skillContainer.skillSize - 3) {
                return ;
            }

            if (idx == 0) {
                $(".skill-left").removeClass('arrow-left-gray').addClass('arrow-left');
            }

            if (idx + 6 > skillContainer.skillSize - 1) {
                skillContainer.skillIdx = skillContainer.skillSize - 3;
                $(this).removeClass('arrow-right').addClass('arrow-right-gray');
            } else {
                skillContainer.skillIdx = idx + 3;
            }

            exports.tabSkill();
        });

        $(".skill-flag").on('mouseover', function () {
            var $body = $("body");
            var $skillFlag = $(".skill-flag");
            var $skillFlagPop = $("<div></div>").attr('class', 'skill-flag-pop').text("等级越高，技能越多！")
                .css({left : $skillFlag.offset().left + 45, top : $skillFlag.offset().top + 10});
            $body.append($skillFlagPop);
            $skillFlagPop.fadeIn(500);

        }).on('mouseout', function () {
            $(".skill-flag-pop").remove();
        });

        $(".skill-icon").on('mouseover', function () {
            var $window = $(window);
            var $body = $("body");
            var $skill = $(this);
            var $skillPop = $("<div></div>").attr('class', 'skill-pop').text(skill_config.skillDesc[$skill.attr('data-value')])
                .css({left : $skill.offset().left - 30, bottom : $window.height() - $skill.offset().top - 5});
            $body.append($skillPop);
            $skillPop.fadeIn(500);
        }).on('mouseout', function () {
            $(".skill-pop").remove();
        });

        $(".skill-icon").on('click', function() {

            if ($(this).attr('class').indexOf('gray') != -1) {
                return ;
            }

            var skillName = $(this).attr('data-value');

            if (exports.try_novice_flag) {
                exports.try_novice_flag = false;
                package('v.myjimi.service').taskSubmitService('try_novice', {skillName : skillName},
                    package('v.myjimi.task').taskCallback['try_novice'].submitCallBack);
            }

            if (skillName == "teach" && exports.try_elementary_flag) {
                exports.try_elementary_flag = false;
                package('v.myjimi.service').taskSubmitService('try_elementary', {skillName : skillName},
                    package('v.myjimi.task').taskCallback['try_elementary'].submitCallBack);
            }

            if (skillName == "vindicate" && exports.try_middle_flag) {
                exports.try_middle_flag = false;
                package('v.myjimi.service').taskSubmitService('try_middle', {skillName : skillName},
                    package('v.myjimi.task').taskCallback['try_middle'].submitCallBack);
            }

            if ((skillName == "macross_contact" || skillName == "manual_service") && exports.try_high_flag) {
                exports.try_high_flag = false;
                package('v.myjimi.service').taskSubmitService('try_high', {skillName : skillName},
                    package('v.myjimi.task').taskCallback['try_high'].submitCallBack);
            }

            if (skillName == "skin" || skillName == "teach" || skillName == "vindicate" ||
                    skillName == "macross_contact" || skillName == "manual_service") {
                package('v.myjimi.service').skillProcessService(skillName,
                    skillCallback[skillName].processCallBack);
                return ;
            }

            var extInfo = {};
            if (skillName == "shake") {
                if (exports.shake_pos == "move" && exports.move_flag) {
                    return ;
                }
                if (exports.shake_pos == "index" && exports.index_flag) {
                    return ;
                }
                extInfo = {"pos" : exports.shake_pos};
            }

            package('v.myjimi.service').skillSubmitService(skillName, extInfo,
                skillCallback[skillName].submitCallBack);
        })
    };

    var skillCallback = {
        "chat" : {
            submitCallBack : function(data, extInfo){
                var question = data.skillResult.bussinessData;
                if (question) {
                    // showMes("我", question);
                    sendRequest(question, 0);
                }
            }
        },
        "joke" : {
            submitCallBack : function(data, extInfo){
                var question = "笑话";
                showMes("我", question);
                sendRequest(question, 0);
            }
        },
        "poem" : {
            submitCallBack : function(data, extInfo){
            var question = data.skillResult.bussinessData;
                if (question) {
                    showMes("我", question);
                    sendRequest(question, 0);
                }
            }
        },
        "fortune" : {
            submitCallBack : function(data, extInfo){
                var question = "今日运势";
                showMes("我", question);
                sendRequest(question, 0);
            }
        },
        "weather" : {
            submitCallBack : function(data, extInfo){
                var question = "天气";
                showMes("我", question);
                sendRequest(question, 0);
            }
        },
        "skin" : {
            submitCallBack : function(data, extInfo){
                package('v.myjimi.service').ajaxServices.updateUserSkinAndPic(extInfo);
            },
            processCallBack : function(data){
                /**
                 * 皮肤窗口模块构造
                 */
                var $body = $("body");
                var $skinHtml = "<div class='myjimi-skin-window'>\
                <div class='skin-bg-block'>\
                <ul class='clearfix'>\
                <li class='fl skin-bg skin-checked'><i id='blue-skin' class='icon-skin bg-blue'></i>\
                <i class='icon-skin-checked'></i></li>\
                <li class='fl skin-bg'><i id='purple-skin' class='icon-skin bg-purple'></i>\
                <i class='icon-skin-checked'></i></li>\
                <li class='fl skin-bg'><i id='green-skin' class='icon-skin bg-green'></i>\
                <i class='icon-skin-checked'></i></li>\
                <li class='fl skin-bg'><i id='pink-skin' class='icon-skin bg-pink'></i>\
                <i class='icon-skin-checked'></i></li>\
                </ul>\
                </div>\
                <div class='skin-header-block'>\
                <ul class='clearfix'>\
                <li class='fl header-bg'><i id='header-1' class='icon-header header-self-1'></i>\
                <i class='icon-header-checked'></i></li>\
                <li class='fl header-bg'><i id='header-2' class='icon-header header-self-2'></i>\
                <i class='icon-header-checked'></i></li>\
                <li class='fl header-bg'><i id='header-3' class='icon-header header-self-3'></i>\
                <i class='icon-header-checked'></i></li>\
                <li class='fl header-bg'><i id='header-4' class='icon-header header-self-4'></i>\
                <i class='icon-header-checked'></i></li>\
                </ul>\
                </div>\
                <div class='skin-btn-confirm'></div>\
                <div class='skin-btn-cancle'></div>\
                </div>";

                $("#masterDiv").css({display : 'block', left : 0});
                $body.append($skinHtml).show();

                if (package('v.myjimi').levelType == "novice") {
                    $("#green-skin").removeClass('bg-green').addClass('bg-green-gray');
                    $("#pink-skin").removeClass('bg-pink').addClass('bg-pink-gray');
                } else if (package('v.myjimi').levelType == "elementary") {
                    $("#pink-skin").removeClass('bg-pink').addClass('bg-pink-gray');
                }

                $("#" + skinConf[package('v.myjimi').skin_type]).parent()
                    .addClass('skin-checked').siblings('li').removeClass('skin-checked');
                if (package('v.myjimi').pic_type != 0) {
                    $("#" + headerConf[package('v.myjimi').pic_type]).parent()
                        .addClass('header-checked').siblings('li').removeClass('header-checked');
                }

                /**
                 * 皮肤窗口事件绑定
                 */
                $(".skin-bg").on('click', function() {
                    if ($(this).find(".icon-skin").attr('class').indexOf('gray') != -1) {
                        return ;
                    }
                    $(this).addClass('skin-checked').siblings('li').removeClass('skin-checked');
                });
                $(".header-bg").on('click', function() {
                    if ($(this).find(".icon-header").attr('class').indexOf('gray') != -1) {
                        return ;
                    }
                    $(this).addClass('header-checked').siblings('li').removeClass('header-checked');
                });

                $(".skin-btn-confirm").on('click', function () {

                    var update_flag = false;
                    $.each($(".skin-bg"), function(idx, e) {
                        if ($(this).hasClass("skin-checked")) {
                            if (package('v.myjimi').skin_type != idx + 1) {
                                update_flag = true;
                                package('v.myjimi').skin_type = idx + 1;
                                package('v.myjimi').renderSkin();
                            }
                        }
                    });
                    $.each($(".header-bg"), function(idx, e) {
                        if ($(this).hasClass("header-checked")) {
                            if (package('v.myjimi').pic_type != idx + 1) {
                                update_flag = true;
                                package('v.myjimi').pic_type = idx + 1;

                                package('v.myjimi').header_class = package('v.myjimi').config.
                                    header_img[package('v.myjimi').pic_type];
                                package('v.myjimi').renderJimiPic();
                                package('v.myjimi').renderPic();
                            }
                        }
                    });
                    if (update_flag) {
                        package('v.myjimi.service').skillSubmitService('skin', {skinType: package('v.myjimi').skin_type,
                            picType: package('v.myjimi').pic_type}, skillCallback['skin'].submitCallBack);
                    }

                    $(".myjimi-skin-window").remove();
                    $("#masterDiv").hide();
                });
                $(".skin-btn-cancle").on('click', function () {
                    $(".myjimi-skin-window").remove();
                    $("#masterDiv").hide();
                });
            }
        },
        "shake" : {
            submitCallBack : function(data, extInfo){
                if (exports.shake_pos == "move") {
                    exports.move_flag = true;

                    var $move_shake = $(".myjimi-move-shake");
                    var $move_body = $(".myjimi-move-body");
                    var $move_icon = $(".myjimi-move-icon");

                    $move_body.hide();
                    $move_icon.hide();

                    var r_move = Math.floor(Math.random()*5+1);
                    $move_shake.attr('class', 'myjimi-move-shake shake-' + r_move).show();

                    setTimeout(function(){
                        $move_shake.attr('class', 'myjimi-move-shake').hide();
                        $move_body.show();
                        $move_icon.show();

                        exports.move_flag = false;
                    }, 3000);
                }
                if (exports.shake_pos == "index") {
                    exports.index_flag = true;

                    var $index_shake = $(".myjimi-index-shake");
                    var $index_header = $(".myjimi-index-header-img");

                    $index_header.attr('class', "myjimi-index-header-img");

                    var r_index = Math.floor(Math.random()*5+1);
                    $index_shake.attr('class', 'myjimi-index-shake shake-' + r_index)
                        .css({'top': $index_header.offset().top - 82, 'left': $index_header.offset().left - 64}).show();

                    setTimeout(function(){
                        $index_shake.attr('class', 'myjimi-index-shake').hide();
                        $index_header.attr('class', "myjimi-index-header-img " + package('v.myjimi').header_class);

                        exports.index_flag = false;
                    }, 3000);
                }
            }
        },
        "teach" : {
            submitCallBack : function(data, extInfo){
                $("#text-head").find("h3").text("专属教学，你教我学，稍后来考考我吧");

                if (extInfo != null) {
                    $(".suc-tip").show();
                    setTimeout(function () {
                        $(".suc-tip").hide();
                    }
                    , 1000);
                } else {
                    $(".err-tip").show();
                    setTimeout(function () {
                        $(".err-tip").hide();
                    }
                    , 1000);
                }
            },
            processCallBack : function(data){
                $('#j_teach').trigger('click');
                $('.popup-teach').css('z-index', 1600);
            }
        },
        "vindicate" : {
            submitCallBack : function(data, extInfo){},
            processCallBack : function(data){
                var $body = $("body");
                var $vindicateWindow = "<div class='vindicate-window'>\
                <div class='close-btn'></div>\
                <div class='vindicate-intro'>\
                <p>Duang~~~</p>\
                <p><span id='vindicate-name'></span>代替主人向TA表白啦！</p>\
                </div> \
                <div class='check-block'>\
                <p>主人是想匿名呢，还是想直接一点？</p>\
                <input type='radio' name='vindicate-check' value='匿名吧' id='check1' checked='checked'/><label for='check1'>匿名吧</label>\
                <input type='radio' name='vindicate-check' value='记得@我' id='check2' /><label for='check2'>记得@我</label>\
                </div>\
                <div class='weibo-block'>\
                    <p>主人您的微博账户是什么呢？</p>\
                    <input class='weibo-input vindicate-input' maxlength='20' />\
                    <div class='weibo-alert vindicate-alert'>\
                    <i class='btn-alert'></i>\
                    <span>主人填写一下您的微博账户吧</span>\
                    </div>\
                </div>\
                <div class='weibo-ta-block'>\
                    <p>主人TA的微博账户是什么呢？</p>\
                    <input class='weibo-ta-input vindicate-input' maxlength='20' />\
                    <div class='weibo-ta-alert vindicate-alert'>\
                    <i class='btn-alert'></i>\
                    <span>主人填写一下TA的微博账户吧</span>\
                    </div>\
                </div>\
                <div class='word-block'>\
                    <p>主人您想对TA说点什么呢？</p>\
                    <textarea class='word-input vindicate-input' maxlength='30' rows='2' cols='30' placeholder='最多输入30个字哦' />\
                    <div class='word-alert vindicate-alert'>\
                    <i class='btn-alert'></i>\
                    <span>主人您还没留言呢</span>\
                    </div>\
                </div>\
                <div class='vindicate-confirm'></div>\
                </div>";

                $("#masterDiv").css({display : 'block', left : 0});
                $body.append($vindicateWindow).show();

                $('#vindicate-name').text(package('v.myjimi').nickName);

                $('.vindicate-input').on('focus', function () {
                    $(this).css('border','2px solid #8BC2E8');
                    $('.vindicate-alert').hide();
                }).on('blur', function () {
                    $(this).css('border','none');
                });

                $(".close-btn").on('click', function() {
                    $(".vindicate-window").remove();
                    $("#masterDiv").hide();
                });
                $(".vindicate-confirm").on('click', function() {
                    var weibo = $('.weibo-input').val().trim();
                    if (weibo == "") {
                        $('.weibo-alert').show();
                        return ;
                    }

                    var weibo_ta = $('.weibo-ta-input').val().trim();
                    if (weibo_ta == "") {
                        $('.weibo-ta-alert').show();
                        return ;
                    }

                    var word = $('.word-input').val().trim();
                    if (word == "") {
                        $('.word-alert').show();
                        return ;
                    }

                    var data = {
                      "check_item" : $("input[name='vindicate-check']:checked").val(),
                        "weibo" : weibo,
                        "weibo_ta" : weibo_ta,
                        "word" : word
                    };
                    package('v.myjimi.service').skillSubmitService('vindicate', data, skillCallback['vindicate'].submitCallBack);

                    $(".vindicate-window").remove();
                    $("#masterDiv").hide();
                });
            }
        },
        "macross_contact" : {
            submitCallBack : function(data, extInfo){},
            processCallBack : function(data){
                var $body = $("body");
                var $macrossWindow = "<div class='macross-window'>\
                <div class='close-btn'></div>\
                <div class='macross-intro'>\
                <p>将此时此刻的心情保鲜</p>\
                <p>寄给未来的自己~~~</p>\
                </div> \
                <div class='check-block'>\
                <p>请主人选择一下寄信方式呢？</p>\
                <input type='radio' name='macross-check' value='微博私信' id='check1' checked='checked'/><label for='check1'>微博私信</label>\
                <input type='radio' name='macross-check' value='电子邮件' id='check2' /><label for='check2'>电子邮件</label>\
                <input type='radio' name='macross-check' value='微信订阅号' id='check3' /><label for='check3'>微信订阅号</label>\
                </div>\
                <div class='account-block'>\
                    <p>主人的微博/微信/Email账户是啥呢？</p>\
                    <input class='account-input macross-input' maxlength='20' />\
                    <div class='account-alert macross-alert'>\
                    <i class='btn-alert'></i>\
                    <span>主人填写一下您的账户吧</span>\
                    </div>\
                </div>\
                <div class='expect-block'>\
                    <span class='desc'>主人想多久后收到呢？</span>\
                    <input class='expect-input macross-input' maxlength='3' />\
                    <span class='desc'>天</span>\
                    <div class='expect-alert macross-alert'>\
                    <i class='btn-alert'></i>\
                    <span class='alert'>请填写整数</span>\
                    </div>\
                </div>\
                <div class='msg-block'>\
                    <p>留下主人想说的话呢？</p>\
                    <textarea class='msg-input macross-input' maxlength='30' rows='2' cols='30' placeholder='最多输入30个字哦' />\
                    <div class='msg-alert macross-alert'>\
                    <i class='btn-alert'></i>\
                    <span>主人您还没留言呢</span>\
                    </div>\
                </div>\
                <div class='macross-confirm'></div>\
                </div>";

                $("#masterDiv").css({display : 'block', left : 0});
                $body.append($macrossWindow).show();

                $('.expect-alert').hide();

                $('.macross-input').on('focus', function () {
                    $(this).css('border','2px solid #8BC2E8');
                    $('.macross-alert').hide();
                }).on('blur', function () {
                    $(this).css('border','none');
                });

                $(".close-btn").on('click', function() {
                    $(".macross-window").remove();
                    $("#masterDiv").hide();
                });
                $(".macross-confirm").on('click', function() {
                    var account = $('.account-input').val().trim();
                    if (account == "") {
                        $('.account-alert').show();
                        return ;
                    }

                    var expect = $('.expect-input').val().trim();
                    var reg = /^[0-9]*[1-9][0-9]*$/;
                    if (expect == "" || !reg.test(expect)) {
                        $('.expect-alert').show();
                        return ;
                    }

                    var msg = $('.msg-input').val().trim();
                    if (msg == "") {
                        $('.msg-alert').show();
                        return ;
                    }

                    var data = {
                        "check_item" : $("input[name='macross-check']:checked").val(),
                        "account" : account,
                        "expect" : parseInt(expect),
                        "msg" : msg
                    };
                    package('v.myjimi.service').skillSubmitService('macross_contact', data,
                        skillCallback['macross_contact'].submitCallBack);

                    $(".macross-window").remove();
                    $("#masterDiv").hide();
                });
            }
        },
        "manual_service" : {
            submitCallBack : function(data, extInfo){},
            processCallBack : function(data){
                var $body = $("body");
                var $manualWindow = "<div class='manual-window'>\
                <div class='close-btn'></div>\
                <div class='manual-intro'>\
                <p>Duang~~~</p>\
                <p><span id='manual-name'>XXX</span>已经自学了“人工VIP服务”啦！</p>\
                </div> \
                <div class='contact-block'>\
                <p>主人留下方便的联系方式呢</p>\
                <input class='contact-input manual-input' maxlength='20' />\
                <div class='contact-alert manual-alert'>\
                <i class='btn-alert'></i>\
                <span>主人留个联系方式吧</span>\
                </div>\
                </div>\
                <div class='question-block'>\
                <p>主人的购物疑问写一下呢</p>\
                <textarea class='question-input manual-input' maxlength='30' rows='3' cols='30' placeholder='最多输入30个字哦' />\
                <div class='question-alert manual-alert'>\
                <i class='btn-alert'></i>\
                <span>主人您有什么疑问呢</span>\
                </div>\
                </div>\
                <div class='manual-confirm'></div>\
                </div>";

                $("#masterDiv").css({display : 'block', left : 0});
                $body.append($manualWindow).show();

                $('#manual-name').text(package('v.myjimi').nickName);

                $('.manual-input').on('focus', function () {
                    $(this).css('border','2px solid #8BC2E8');
                    $('.manual-alert').hide();
                }).on('blur', function () {
                    $(this).css('border','none');
                });

                $(".close-btn").on('click', function() {
                    $(".manual-window").remove();
                    $("#masterDiv").hide();
                });
                $(".manual-confirm").on('click', function() {
                    var contact = $('.contact-input').val().trim();
                    if (contact == "") {
                        $('.contact-alert').show();
                        return ;
                    }

                    var question = $('.question-input').val().trim();
                    if (question == "") {
                        $('.question-alert').show();
                        return ;
                    }

                    var data = {
                        "contact" : contact,
                        "question" : question
                    };
                    package('v.myjimi.service').skillSubmitService('manual_service', data,
                        skillCallback['manual_service'].submitCallBack);

                    $(".manual-window").remove();
                    $("#masterDiv").hide();
                });
            }
        }
    };
    exports.skillCallback = skillCallback;

    return exports;
});
/**
 * Created by chenzhengguo on 2014/12/25.
 */
/**
 * 页面的一些效果，如开场动画，用户引导等
 *
 * @module view
 * @class v.animate
 * @constructor
 *
 */

package("v.animate", [], function (require, exports, moudle) {
  (function ($, window) {
    //页面引导
    function showPageGuide() {
      //因为base.js里面在调整位置
      setTimeout(function() {
        //判断是够显示模板
        //step1:判断source来源
        var param = window.location.search;
        if(param && param.indexOf("source=onlineOrder")!=-1){
          return;
        }
        //step2：根据是够显示过模板
        $.ajax({
          type : 'get',
          url:'/welcomeMask/index.action',
          dataType:'json',
          success:function(data){
            if(data.welcomeMask){
              var $mask = $("#masterDiv");
              $mask.hide();
              var winH = $(window).height(),
                winW = $(window).width(),
                winPosT = (winH - 200) / 2,
                winPosL = (winW - 330) / 2;
              $mask.show().css({
                //height: winH,
                left: 0
              });
              //
              var satisfyButton = $("#j_satisfy");
              var offset = satisfyButton.offset();
              var top = offset.top;
              var left = offset.left;
              $("#satisfyEvalue").show().css({
                position:'absolute',
                top:top-215,
                left:left-5,
                zIndex: 200
              });
            }
          }
        });
      },500);
      $("#satisfyEvalue").bind("click",function(){
        $(this).hide();
        $("#masterDiv").hide();
      });
    };

    exports.showPageGuide = showPageGuide;
  }(jQuery, window));
  return exports;
});
/**
 * Created by chenzhengguo on 2014/12/25.
 */

/**
 * 转人工相关逻辑，包含转人工的日志
 *
 * @module view
 * @class v.manual
 * @constructor
 *
 */
package("v.manual", [], function (require, exports, moudle) {
  /* 时间格式化*/
  Date.prototype.format = function(format) {
    /*
     * eg:format="YYYY-MM-dd hh:mm:ss";
     */
    var o = {
      "M+" :this.getMonth() + 1, // month
      "d+" :this.getDate(), // day
      "h+" :this.getHours(), // hour
      "m+" :this.getMinutes(), // minute
      "s+" :this.getSeconds(), // second
      "q+" :Math.floor((this.getMonth() + 3) / 3), // quarter
      "S" :this.getMilliseconds()
      // millisecond
    }
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (this.getFullYear() + "")
        .substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
          : ("00" + o[k]).substr(("" + o[k]).length));
      }
    }
    return format;
  };
  (function ($, window) {
    exports.showGuide = function(showanswer) {
    //  var $onlineSerivce = $('#skipToOnlineService');
//      var t=new Date();
//      if(t.format('hh:mm:ss')>='00:00:00'&&t.format('hh:mm:ss')<'09:00:00'){
//        showMes("JIMI", '<p>JIMI没有解决您的问题吗？您可以拨打24小时人工热线400-606-5500咨询。</p> ');
//      }else{
//        if($onlineSerivce.is(":visible")) {
         // var hrefurl = $('#skipToOnlineService').attr('href');
            //showMes("JIMI", 'JIMI发现好像没有解决您的问题，JIMI找个<a class="kefu" href="'+href+'">客服MM</a>帮您解决，如何？ ');
          if(showanswer!=""){
          // showMes("JIMI", showanswer);
            $("#chatcontent").append('<div class="chat-tips"><div class="chat-msg">' +
              '<p class="cont">'+showanswer+'</p>'+
              '<div class="mask"> <span class="tl"></span> <span class="tr"></span>'+
              '<span class="bl"></span><span class="br"></span> </div> </div></div>');
            setScroll();
          }
             $('.kefu').on('click',function(){//绑定客服mm转人工埋点
               //$(this).attr("href",hrefurl);
               changeToManual(1, 3);
             })
            statisticAjaxReq('/userguidefeedback/updataRedis.action?value=1');
//        }
//    }

    };

    exports.bindGuideLog = function($ele) {//聊天信息中有转人工链接，根据isKeFuAnswer为true来触发此方法
      var $links = $ele.find("a");
      $links.each(function() {
        var $this = $(this);
        //如果链接是人工客服的，记录日志
        if(!$this.hasClass('js-msg-to-manual') && /^\/\/chat.*\.jd\.com.*$/.test($this.attr('href'))) {
          $this.removeAttr("target");
          $this.on('click', function(){
            changeToManual(1,2);
          });
        }
      });
    };

    //右上角转人工
    $(".service-online").live("click", function(){
      changeToManual(1, 1);
    });
    $(document).on('click','.imJumpFlag',function(){
        window.open(window.manualUrl,"_blank");
    });
    $(function(){
        var flag = false;
        var initURL;
        var fromIM = window.location.toString().indexOf("from=im") > 0;
        var transformUrl = "//chat.jd.com/jdchat/custom.action";
        $.ajax({
                type : "get",
                url : '/index/jimiToManualUrl.action',
                dataType: "json",
                data : {
                    'source' : window.jimiSource || '',
                    'productId':window.productId||''
                },
                success:function(data){
                    transformUrl = data.URL;
                    flag = true;
                  if(window.entry!=undefined&&window.chatId!=undefined){
                    if(transformUrl.indexOf('?')>-1){ //url带有entry
                      initURL =transformUrl.replace(/(\?entry=[^\"]*)/,'?entry='+window.entry+'&chatId='+window.chatId);
                    }else{
                      initURL = transformUrl + "?entry="+window.entry+"&chatId="+window.chatId;
                    }
                  }else{
                    if(transformUrl.indexOf('?')>-1){
                      initURL = transformUrl ;
                    }else{
                      initURL = transformUrl + (fromIM ? "?from=jimi" : "?from=first");
                    }

                  }
                    $(".service-online").find("a").attr("href", initURL);
                    $('#skipToOnlineService').removeAttr("target");
                    window.manualUrl = initURL || "//chat.jd.com/jdchat/index.action?from=first";
                }
       });
       if(!flag){
           //初始化转人工
         if(window.entry!=undefined&&window.chatId!=undefined){
           initURL = transformUrl + "?entry="+window.entry+"&chatId="+window.chatId;
         }else{
           initURL = transformUrl + (fromIM ? "?from=jimi" : "?from=first");
         }
           $(".service-online").find("a").attr("href", initURL);
           $('#skipToOnlineService').removeAttr("target");
       }
    });

    //消息中的转人工
    $(document).on("click", "a.js-msg-to-manual", function() {
      changeToManual(1, 2);
      var url = $('#skipToOnlineService').attr('href');
      try{
        window.open(url, '_self');
      } catch(e){
        alert("转人工跳转出问题了，请点击右上角“在线客服”跳转");
      };
    });


    /**
     * 转人工统计
     * @param changeType 是否转人工，默认1
     * @param changeSource 转人工来源，1-右上角点击 2-聊天消息中有转人工客服链接（isKeFuAnswer） 3-邀评触发转人工链接（比如骂人），默认1
     */
    function changeToManual(changeType, changeSource){
      $.ajax({
        type : "post",
        url : '/feedback/chageToManual.action',
        data : {
          'changeType' : changeType || 1,
          'changeSource': changeSource || 1,
          'entrance_source': window.jimiSource
        }
      });
    }
  }(jQuery, window));
  return exports;
});
/**
 * 调教相关逻辑
 *
 * @module view
 * @class v.teach
 *
 */
package("v.teach", [], function (require, exports, moudle) {
  (function ($, window) {
    var canComment1 = false;
    var canComment2 = false;

    function showMask() {
      var $mask = $("#masterDiv");
      var winH = $(window).height(),
        winW = $(window).width(),
        winPosT = (winH - 200) / 2,
        winPosL = (winW - 330) / 2;
      $mask.show().css({
        //height: winH,
        left: 0
      });
    }
    function initPopup(){//初始化调教弹框层，当关闭或者取消弹层时将原来的东西初始化
      $("#text-que-restrict").text("您还可以输入50字");
      $("#text-que-restrict").css("color","#b8b8b8");
      $("#text-ans-restrict").text("您还可以输入200字");
      $("#text-ans-restrict").css("color", "#b8b8b8");
      $("#text-que").val("问题: 现在的女生为什么都不会做饭？");
      $("#text-que").css("color", "#b8b8b8");
      $("#text-ans").val("答案: 因为要给男人留一个表现的机会。");
      $("#text-ans").css("color", "#b8b8b8");
    }

    function closeMask() {
      var $mask = $("#masterDiv");
      $mask.hide();
    }

    function questionInput() {
      var text = $("#text-que").val();
      var textLen = text.length;
      if (text == '问题: 现在的女生为什么都不会做饭？') {
        return;
      }
      if (textLen <= 50 && textLen > 0) {
        canComment1 = true;
        $("#text-que-restrict").text("您还可以输入" + (50 - textLen) + "字");
        $("#text-que-restrict").css("color", "#b8b8b8");
      } else if (textLen == 0) {
        canComment1 = false;
        $("#text-que-restrict").text("您还可以输入" + "50" + "字");
        $("#text-que-restrict").css("color", "#b8b8b8");
      } else {
        canComment1 = false;
        $("#text-que-restrict").text("您已超出" + (textLen - 50) + "字");
        $("#text-que-restrict").css("color", "#ef0a2b");
      }
    }

    function answerInput() {
      var text = $("#text-ans").val();
      var textLen = text.length;
      if (text == '答案: 因为要给男人留一个表现的机会。') {
        return;
      }
      if (textLen <= 200 && textLen > 0) {
        canComment2 = true;
        $("#text-ans-restrict").text("您还可以输入" + (200 - textLen) + "字");
        $("#text-ans-restrict").css("color", "#b8b8b8");
      } else if (textLen == 0) {
        canComment2 = false;
        $("#text-ans-restrict").text("您还可以输入" + "200" + "字");
        $("#text-ans-restrict").css("color", "#b8b8b8");
      } else {
        canComment2 = false;
        $("#text-ans-restrict").text("您已超出" + (textLen - 200) + "字");
        $("#text-ans-restrict").css("color", "#ef0a2b");
      }
    }

    function teachSubmitSuccessCallback() {
      $(".suc-tip").show();
      setTimeout(function () {
          $(".suc-tip").hide();
        }
        , 1000);
    }

    function teachSubmitFailCallback() {
      $(".err-tip").show();
      setTimeout(function () {
          $(".err-tip").hide();
        }
        , 1000);
    }

    //统计调教次数，按天统计，不同纬度
    function teachClickAndShareCount(dimension) {
      $.ajax({
        type: "get",
        url: '/teachfeedback/teachFeedbackCount.action?dimension=' + dimension
      });
    }

    function init() {
      $("#j_teach").live("click", function () {
        $(".popup-teach .jimi-header-img").addClass(window["jimiHeader"]);
        if ($(".popup-teach").is(":visible")) {
          $(".popup-teach").hide();

        } else {
          //获取用户头像url--vm改html调教部分
//          var userImageUrl= package("v.login").userImageUrl;
//          $(".teachimg").css(
//            "background","url("+userImageUrl+") no-repeat center"
//          );
          $("#text-head").children("h3").text("哇，这么好玩，我也可以教JIMI说话了");
          showMask();//显示遮罩层
          $(".popup-teach").show().css({
            zIndex: 122
          });
          teachClickAndShareCount(1);//all
          teachClickAndShareCount(2);//session
        }

      });
      $("#teach-cacel").live("click", function () {
        closeMask();//取消遮罩层
        $(".popup-teach").hide();
        initPopup();
      });
      $("#teach-close").live("click", function () {
        closeMask();//取消遮罩层
        $(".popup-teach").hide();
        initPopup();

      });

      $("#text-que").live("cut paste keyup blur focus", function (e) {
        if (e.type == 'cut' || e.type == 'paste') {
          setTimeout(questionInput, 400);
        } else {
          questionInput();
        }
      });

      $("#text-que").live("focus", function () {
        var text = $("#text-que").val();
        if ("问题: 现在的女生为什么都不会做饭？" == text) {
          $("#text-que").val("");
          $("#text-que").css("color", "#000");
        }
        $("#text-head").children("h3").text("哇，这么好玩，我也可以教JIMI说话了");
      });
      $("#text-que").live("blur", function () {
        var text = $("#text-que").val();
        if ("" == text) {
          $("#text-que").val("问题: 现在的女生为什么都不会做饭？");
          $("#text-que").css("color", "");
        }
      });
      $("#text-que-restrict").css("color", "#b8b8b8");

      $("#text-ans").live("cut paste keyup blur focus", function (e) {
        if (e.type == 'cut' || e.type == 'paste') {
          setTimeout(answerInput, 400);
        } else {
          answerInput();
        }
      });

      $("#text-ans").live("focus", function () {
        var text = $("#text-ans").val();
        if ("答案: 因为要给男人留一个表现的机会。" == text) {
          $("#text-ans").val("");
          $("#text-ans").css("color", "#000");
        }
        $("#text-head").children("h3").text("哇，这么好玩，我也可以教JIMI说话了");
      });
      $("#text-ans").live("blur", function () {
        var text = $("#text-ans").val();
        if ("" == text) {
          $("#text-ans").val("答案: 因为要给男人留一个表现的机会。");
          $("#text-ans").css("color", "");
        }
      });
      $("#text-ans-restrict").css("color", "#b8b8b8");

      var $teachok = $("#teach-ok");
      $teachok.live("click", function () {
        if (!canComment1) {
          var text = $("#text-que").val();
          var text1 = text.replace("问题: 现在的女生为什么都不会做饭？", "");
          var textLen = text1.length;
          if (textLen == 0) {
            $("#text-que-restrict").text("您还没有输入问题");
            $("#text-que-restrict").css("color", "#ef0a2b");
          } else {
            $("#text-que-restrict").text("您的问题超过50字");
            $("#text-que-restrict").css("color", "#ef0a2b");
          }
          return;
        }
        if (!canComment2) {
          var text = $("#text-ans").val();
          var text1 = text.replace("答案: 因为要给男人留一个表现的机会。", "");
          var textLen = text1.length;
          if (textLen == 0) {
            $("#text-ans-restrict").text("您还没有输入答案");
            $("#text-ans-restrict").css("color", "#ef0a2b");
          } else {
            $("#text-ans-restrict").text("您的答案超过200字");
            $("#text-ans-restrict").css("color", "#ef0a2b");
          }
          return;
        }
        canComment1 = false;
        canComment2 = false;

        var teachQuestion = $("#text-que").val();
        var teachAnswer = $("#text-ans").val();

          var data = {
              'teachQuestion': teachQuestion,
              'teachAnswer': teachAnswer
          };

          if (isMyJimi) {
              var teachData = {
                  'question': teachQuestion,
                  'answer': teachAnswer
              };
              package('v.myjimi.service').skillSubmitService('teach', teachData,
                  package('v.myjimi.skill').skillCallback['teach'].submitCallBack);
          } else {
              $.ajax({
                  type: "post",
                  url: '/teachfeedback/TeachFeedbackToRedis.action',
                  data: data,
                  success: teachSubmitSuccessCallback,
                  error: teachSubmitFailCallback
              });
          }

        $("#text-que").val("问题: 现在的女生为什么都不会做饭？");
        $("#text-que").css("color", "");
        $("#text-ans").val("答案: 因为要给男人留一个表现的机会。");
        $("#text-ans").css("color", "");
        $("#text-que-restrict").text("您还可以输入50字");
        $("#text-que").css("color", "");
        $("#text-ans-restrict").text("您还可以输入200字");
        $("#text-que").css("color", "");
        $("#text-head").children("h3").text("提交成功，谢谢参与，过两天来考我吧~");
      });


      //统计分享次数开始
      $(".bds_qzone").live("click", function () {
        teachClickAndShareCount(4);
      });

      $(".bds_tsina").live("click", function () {
        teachClickAndShareCount(3);
      });

      $(".bds_tqq").live("click", function () {
        teachClickAndShareCount(7);
      });

      $(".bds_renren").live("click", function () {
        teachClickAndShareCount(5);
      });

      $(".bds_weixin").live("click", function () {
        teachClickAndShareCount(6);
      });
      //统计分享次数结束

      var sina_url = "http://v.t.sina.com.cn/share/share.php?appkey=2445336821&title=";
      $(".icon-sina-blog").live("click", function () {
        window.open(sina_url + "我要发微博", "_blank");
      });
      var yixin_url = "http://open.yixin.im/share?type=webpage&text=";
      $(".icon-tencent-weibo").live("click", function () {
        window.open(yixin_url + "我要发yixin", "_blank");
      });
    }
    exports.init = init;

  }(jQuery, window));

  return exports;
});
/**
 * 数据统计和埋点
 *
 * @module view
 * @class v.statistic
 *
 */
package("v.statistic", [], function (require, exports, moudle) {
  (function ($, window, document) {
    function init() {

      //问题点击次数
      $("#buyConsultDiv .intro-bar").live("click", function () {
        var question = $(this).text();
        var data = {'description': question};
        //  statisticAjaxReq('/data/buyConsultCount.action',data);
        //额外发送埋点
        statisticAjaxReq('/newData/dataAction.action', $.extend(data, {type: 8}));

        sendSpReq({data: '9|' + question});
      });


      //右侧TAB滑动埋点
      $(document).on("mouseover", "#sidenav .side-nav-item", function () {
        var type = $(this).data("type") || 0;
        statisticAjaxReq('/newData/dataAction.action', {type: type});
        var spTypeMap = {
          '46': '1',
          '47': '2|' + (window.isCustomerEntrance() ? '售后' : '售前'),
          '48': '3',
          '45': '4'
        }
        if (type) {
          sendSpReq({data: spTypeMap[type]});
        }
      });

      //个人空间
      $(document).on("click", ".space-btn-group li", function () {
        var spTypeMap = {
          'space-btn-tx': '8|调戏',
          'space-btn-xh': '8|讲笑话',
          'space-btn-ds': '8|对诗'
        }
        var $this = $(this);
        $.each(spTypeMap, function (i) {
          if ($this.hasClass(i)) {
            sendSpReq({data: this});
          }
        })
      });

      //问题预测（前缀）
      $(document).on("click", "#sugguestions .js-send-question a", function () {
        var question = $(this).html();
        sendSpReq({data: '11|' + question});
      });

      //问题预测（下拉）
      $(document).on("click", ".chat-helper-guess-list a", function () {
        var question = $(this).html();
        sendSpReq({data: '10|' + question});
      });

      //推荐商品埋点
      $(document).on("click",".jimi-goods-list .change-btn",function(){//换一组
          statisticAjaxReq("/collectdot/dot.action", {type: 'recommend_changegroup'});

      });
      $(document).on("click",".jimi-goods-list .goods-detail img",function(){//左边图片
        statisticAjaxReq("/collectdot/dot.action", {type: 'recommend_leftimg'});

      });
      $(document).on("click",".jimi-goods-list .goods-title a",function(){//标题
        statisticAjaxReq("/collectdot/dot.action", {type: 'recommend_title'});

      });
      $(document).on("click",".jimi-goods-list .btn-wrap a",function(){
        var $this=$(this);
        if($this.is(".append-btn")){//添加到购物车
          statisticAjaxReq("/collectdot/dot.action", {type:'recommend_shoppingcart'});
        }
        if($this.is(".note-btn")){//加关注
          statisticAjaxReq("/collectdot/dot.action", {type: 'recommend_addattention'});
        }
        if($this.is(".ask-btn")){//问jimi
          statisticAjaxReq("/collectdot/dot.action", {type: 'recommend_askjimi'});
        }
      });

      //新埋点需求
      (function () {

        //终端统计
        var parser = new UAParser();
        var browser = parser.getBrowser();
        var os = parser.getOS();
        var device = parser.getDevice();
        var terminal = "Unknown";
        if (device.type) {
          terminal = device.type + (device.vendor ? "|" + device.vendor : "") + (device.model ? "|" + device.model : "");
        }
        var param = {
          terminal: terminal,
          browser: browser.name + "|" + browser.version,
          os: os.name + "|" + os.version
        }
        statisticAjaxReq('/newData/terminalDataAction.action', param);

        //埋点统计，利用wl格式的埋点
        var getClsQuery = function (clsType) {
          return '[clstag="JIMI|keycount|home2014|' + clsType + '"]';
        };
        var dataActionMap = [
          {cls: 'c4', type: 21}, //最大化聊天
          {cls: 'c5', type: 22}, //正常化聊天
          {cls: 'c2', type: 19}, //底部关闭按钮
          {cls: 'c1', type: 18}, //右上角关闭
          {cls: 'sp1', type: 14}, //商品详情
          {cls: 'sp3', type: 15}, //加入购物车
          {cls: 'sp2', type: 16}, //咨询
          {cls: 'sp4', type: 17}, //关注
          {cls: 'gh1', type: 13}, //关怀中的链接！ 这个要欢哥加一下
          {cls: 'dd1', type: 9}, //返修/退换货
          {cls: 'dd2', type: 10}, //取消订单
          {cls: 'dd3', type: 11}, //订单详情
          {cls: 'dd4', type: 12}, //商品详情
          {cls: 'sp5', type: 34}, //展开商品评测
          {cls: 'dl1', type: 35}, //消息框顶部登录-点击
          {cls: 'dl2', type: 36}, //右侧订单登录-点击
          {cls: 'dl3', type: 37}, //开头语登录-点击
          //type: 38 //消息触发登录-点击
          //type: 39 //消息框顶部登录-成功登录
          //type: 40 //右侧订单登录-成功登录
          //type: 41 //开头语登录-成功登录
          //type: 42 //消息触发登录-成功登录

          {cls: 'dd5', type: 3}, //展开订单
          {cls: 'kj1', type: 1}, //快捷咨询-配送服务
          {cls: 'kj2', type: 2}  //快捷咨询-售后政策
          //type: 8 购买咨询，展开


        ];
        $(dataActionMap).each(function () {
          var query = getClsQuery(this.cls);
          var type = this.type;
          $(document).on('click', query, function () {
            statisticAjaxReq('/newData/dataAction.action', {type: type});
          });
        });

        /*------这里给一些特定标签增加埋点------*/
        //由于有些元素是动态添加的，这里定期尝试添加clstag
        (function () {
          var prefix = "JIMI|keycount|home2014|";
          var addList = [
            {query: "#district-consult-select", cls: "kj1"},
            {query: "#product-service-search .search-button", cls: "kj2"},
            {query: "#orderListDiv .intro-bar", cls: "dd5"}
          ];
          var tryTime = 5000;
          var interval = null;
          interval = setInterval(function () {
            var addDone = true;
            $.each(addList, function () {
              var $dom = $(this.query);
              if ($dom.length) {
                $dom.attr('clstag', prefix + this.cls);
              } else {
                addDone = false;
              }
            });
            if (addDone || tryTime <= 0) {
              clearInterval(interval);
            } else {
              tryTime -= 200;
            }
          }, 200);
        }())
        /*------这里给一些特定标签增加埋点------*/
      }());
    }

    exports.init = init;
  }(jQuery, window, document));
  return exports;
});



(function (Class, $, window, document) {

    if (!Class) {
        throw new Error('Class is necessary');
    }
    // 全局jimiHeader
    window['getJimiHeader'] = function() {
        window['jimiHeader'] = window['jimiHeader'] || 'jimi' + (Math.round(Math.random() * 10) % 4 + 1);
        return window['jimiHeader'];
    };
    var jimiHeader = getJimiHeader();
    var package = window.package || function () {return; };

    var Question = Class.extend({
        // init是构造函数
        shellPre: '<div class="customer_lists clearfix"><div class="header_img ' + jimiHeader + '"  style="background: url(//static.360buyimg.com/jimi/dist/v20140121/i/img1.png) no-repeat center;"><div class="header_img_hover"></div></div><table class="msg" cellspacing="0" cellpadding="0"><tbody><tr><td class="lt"></td><td class="tt"></td><td class="rt"></td></tr><tr><td class="lm"></td><td class="mm">',
        shellPos: '</td><td class="rm"><span></span></td></tr><tr><td class="lb"></td><td class="bm"></td><td class="rb"></td></tr><tr><td></td><td class="time">',
        shellPos2: '</td><td></td></tr></tbody></table></div>',
        init: function(data) {
            this.data = data;
            this.shellPre = '<div class="customer_lists clearfix"><div class="header_img ' + window['jimiHeader'] + '"  style="background: url(//static.360buyimg.com/jimi/dist/v20140121/i/img1.png) no-repeat center;"><div class="header_img_hover"></div></div><table class="msg" cellspacing="0" cellpadding="0"><tbody><tr><td class="lt"></td><td class="tt"></td><td class="rt"></td></tr><tr><td class="lm"></td><td class="mm">';
        },
        getName: function() {
            return 'Question';
        },
        show: function(ele, isAppend, isAddShell) {
            // 这里做答案的展示
            var html = '';
            if (isAddShell) {

                var userImageUrl = package('v.login').userImageUrl;
                if(userImageUrl == '' || userImageUrl === undefined) {
                    html = this.shellPre + this.data + this.shellPos + this.shellPos2;
                }else{
                    var userShellPre = '<div class="customer_lists clearfix"><div class="header_img ' + window['jimiHeader'] + '" style="background: url(' + userImageUrl + ') no-repeat center;"><div class="header_img_hover"></div></div><table class="msg" cellspacing="0" cellpadding="0"><tbody><tr><td class="lt"></td><td class="tt"></td><td class="rt"></td></tr><tr><td class="lm"></td><td class="mm">';
                    html = userShellPre + this.data + this.shellPos + this.shellPos2;
                }
            }
            if(!isAppend) {
                $(ele).html('');
            }
            // 若是输入框
            if($(ele).hasClass('chat-block')) {
                $(document).trigger('questionPreAdd');
                $(html).appendTo('#chatcontent');
                $(document).trigger('questionAdded');
            }else{
                $(html).appendTo($(ele));
            }
            $(ele).show();
        }
    });

    // 答案抽象类
    var AbstractAnswer = Class.extend({

        init: function(data) {
            this.data = data;
        },
        show: function() {}
    });
    // 模板答案类，继承至抽象答案类
    var TemplateAnswer = AbstractAnswer.extend({
        shellPre:'<div class="jimi_lists clearfix"><div class="header_img ' + jimiHeader + ' fl"></div><table class="msg" cellspacing="0" cellpadding="0"><tbody><tr><td class="lt"></td><td class="tt"></td><td class="rt"></td></tr><tr><td class="lm"><span></span></td><td class="mm">',
        shellPos:'</td><td class="rm"></td></tr><tr><td class="lb"></td><td class="bm"></td><td class="rb"></td></tr>',
        shellPos2:'<tr><td></td></tr></tbody></table>',
        init: function(data) {
            this._super(data);
            this.shellPre = '<div class="jimi_lists clearfix"><div class="header_img ' + window['jimiHeader'] + ' fl"></div><table class="msg" cellspacing="0" cellpadding="0"><tbody><tr><td class="lt"></td><td class="tt"></td><td class="rt"></td></tr><tr><td class="lm"><span></span></td><td class="mm">';
        },
        _dealHtml: function(html, ele, isAddShell, isAppend, position) {
            if(html.length <= 0) {
                html = '好累，我答不上了';
            }
            if(isAddShell) {

                html = this.shellPre + html + this.shellPos + this.shellPos2;
            }
            if(!isAppend) {
                $(ele).html('');
            }
            var $html = $(html);
            if($(ele).hasClass('chat-block')) {
                // 如果没有这个字段，直接paint上去，如果有，等商品信息获取到后再paint
                if(!this.data.refreshContent) {
                    $(document).trigger('answerPreAdd');
                    $html.appendTo('#chatcontent');
                }
            }else{
                $html.appendTo($(ele));
            }
            if(position) {
                $(ele).css(position).show();
            }else{
                $(ele).show();
            }

            // 尝试查找里面的open flash chart数据，并生成图表
            package('v.openflashchart').createChartByElement($(html));

            // 尝试获取里面的关注按钮（note-btn），判断是否已经关注
            package('v.follow').getStatus($(ele));

            // 尝试查找消息里面的登录提示，如果已经有登录提示了，只保留最后一个
            package('v.login').delOldMsgTips();

            // 如果有人工客服标记，判断里面的链接，记录跳转日志
            if(this.data.answer_note == 21) {
                package('v.manual').bindGuideLog($html);
            }
            // 商品推荐，jimi会说句话
            // if(this.data.answer_note == 4) {
            //     
            //     showMes('JIMI', this.data.answer_title);
            // }

            // 生成缩略图
            package('v.chatHelper').showThumbnail($html);

            // 判断是否有商品切换，如果有，刷新商品信息
            var data = this.data;
            var ext_property = typeof data.ext_property !== 'undefined' ? data.ext_property : {};
            if($(ele).hasClass('chat-block') && ext_property.switchWare) {

                //  var infoType=this.infoType;
                switchProduct(ext_property.switchWare, ext_property.refreshContent, function() {

                    if(data.answer_title
                        && data.infoType != 'p_fold_answer'
                        && data.infoType != 'p_user_feedback'
                        && ext_property.refreshContent) {

                        showMes('JIMI', data.answer_title);

                    }
                    if($html) {
                        $html.appendTo('#chatcontent');

                    }
                    // 邀评规则触发转人工客服
                    if(ext_property.userGuideFlag) {
                        package('v.manual').showGuide(data.code_answer);
                        // package('v.manual').showGuide();
                    } else {
                        // 新邀评标识
                        if(ext_property.inviteFlag) {
                            package('v.invite').show();
                        }
                    }
                },true);
            }

            // fe标示说明这里是前端直接显示上去的
            if(!this.data.fe) {

                // 点击浏览器关闭时，是否弹提示
                package('v.close').closingFlag = ext_property.closeFlag || false;

                // 12-02关闭时弹窗先用这里
                package('v.invite').showFeedbackWhenClose = ext_property.closeFlag || true;
                // 人工客服用户引导
                if(!this.data.refreshContent) {
                    if(ext_property.userGuideFlag) {
                        package('v.manual').showGuide(this.data.code_answer);
                    }else{
                        if(ext_property.inviteFlag) {
                            package('v.invite').show();
                        }
                    }
                }
            }
            // helpCenterEmbed需要调ansserAdded方法
            if($(ele).hasClass('chat-block')) {
                if(typeof ext_property !== 'undefined') {
                    $(document).trigger('answerAdded', [ext_property.resultType]);
                }
            }
            setScroll();
        }
    });


    // 本地模板
    var LocalTemplateAnswer = TemplateAnswer.extend({
        init: function(data) {
            this._super(data);
            var answer = data.answer;
            if(Object.prototype.toString.call(answer) === '[object Array]') {
                if(Object.prototype.toString.call(answer) === '[object Array]') {
                    this.data.datas = answer;
                }
            }
        },
        show: function(ele, isAppend, isAddShell,position) {
            var userContent = $('#chatcontent').find('.customer_lists:last-child').find('.mm');
            var html = '';
            var _this = this;
            this.data['jimiHeader'] = window['jimiHeader'];
            console.log(this.data);
            $.template('template', unescape(this.tmpl));
            html = $('<div></div>').append($.tmpl('template', this.data)).html();

            if(this.data.answer_note == 4){
                userContent.html(html);
                userContent.closest('.customer_lists').addClass('short_cut_msg');
                setTimeout(function(){showMes('JIMI', _this.data.answer_title);},400);
            } else {
                this._dealHtml(html, ele, isAddShell, isAppend,position);
            }
        }
    });

    var interaction                 = LocalTemplateAnswer.extend({
        tmpl : '<div id="rich-media" class="richMedia" data-propertyname="${answer.attr.attr_name}" data-category="${answer.attr.category}" data-propertyid="${answer.attr.attr_id}"> <p class="richMedia-title">{{html answer_title}}</p><ul class="richMedia-list">{{each(i,v) answer.tabs}}<li><a href="javascript:;" data-valueId="${id}" data-valueName="${name}">${showName}</a></li>{{/each}}</ul></div>',
        getName : function() {
            return 'interaction'
        }
    });
    // 订单列表
    var OrderListAnswer             = LocalTemplateAnswer.extend({
        tmpl:'{{each(i,v) data}}<div class="intro-bar"><ul class="clearfix"><li class="fl">订单编号：</li><li class="fl book-list"><a href="${orderDetailUrl}" target="_blank" clstag="JIMI|keycount|home2014|dd3">${orderId}</a></li><li class="fl">订单状态：</li><li class="fl">${stateMsg}</li></ul>{{if i==0}}<div class="triangle-open"></div>{{else}}<div class="triangle-close"></div>{{/if}}</div>{{if i>0}}<div class="detail" style="display:none"><ul class="book-img-area clearfix">{{each wares}}<li class="fl book-img"><a href="${wareUrl}" target="_blank"><img src="${imgUrl}" alt="${name}" title="${name}" clstag="JIMI|keycount|home2014|dd4"></a></li>{{/each}}</ul>订单金额：<span style="margin-right: 28px">￥${orderPay}</span>收货人：${consignee}<div class="book-opts">{{if stateMsg=="完成"}} {{else stateMsg=="已取消"}} {{else stateMsg==""}} {{else}} <a href="javascript:void(0);" ordernum="${orderId}" class="follow unfinish">全程跟踪<div class="triangle-open"></div></a> <a href="javascript:void(0);" ordernum="${orderId}" class="productBack" clstag="JIMI|keycount|home2014|dd2">取消订单</a> {{/if}} {{if stateFlag == 0}} <a href="javascript:void(0);" ordernum="${orderId}" class="productBack" clstag="JIMI|keycount|home2014|dd1">返修/退换货</a> {{else stateFlag == 1}} <a href="javascript:void(0);" ordernum="${orderId}" class="productBack">返修/退换货进度查询</a> {{else stateFlag == 2}} <a href="javascript:void(0);" ordernum="${orderId}" class="productBack" clstag="JIMI|keycount|home2014|dd1">返修/退换货</a> <a href="javascript:void(0);" ordernum="${orderId}" class="productBack">返修/退换货进度查询</a> {{/if}}</div></div>{{else}}<div class="detail"><ul class="book-img-area clearfix">{{each wares}}<li class="fl book-img"><a href="${wareUrl}" target="_blank"><img src="${imgUrl}" alt="${name}" title="${name}" clstag="JIMI|keycount|home2014|dd4"></a></li>{{/each}}</ul>订单金额：<span style="margin-right: 28px">￥${orderPay}</span>收货人：${consignee}<div class="book-opts">{{if stateMsg=="完成"}} {{else stateMsg=="已取消"}} {{else stateMsg==""}} {{else}} <a href="javascript:void(0);" ordernum="${orderId}" class="follow unfinish">全程跟踪<div class="triangle-open"></div></a> <a href="javascript:void(0);" ordernum="${orderId}" class="productBack" clstag="JIMI|keycount|home2014|dd2">取消订单</a> {{/if}} {{if stateFlag == 0}} <a href="javascript:void(0);" ordernum="${orderId}" class="productBack" clstag="JIMI|keycount|home2014|dd1">返修/退换货</a> {{else stateFlag == 1}} <a href="javascript:void(0);" ordernum="${orderId}" class="productBack">返修/退换货进度查询</a> {{else stateFlag == 2}} <a href="javascript:void(0);" ordernum="${orderId}" class="productBack" clstag="JIMI|keycount|home2014|dd1">返修/退换货</a> <a href="javascript:void(0);" ordernum="${orderId}" class="productBack">返修/退换货进度查询</a> {{/if}}</div></div>{{/if}} {{/each}}',
        getName: function() {
            return 'OrderListlAnswer';
        }
    });
    // 配送服务
    var BuyConsultAnswer            = LocalTemplateAnswer.extend({
        tmpl:'{{if !(isCustomerEntrance())}}<div class="intro-bar">我的地区支持哪些配送服务<div class="triangle-close"></div></div><div class="detail" style="display: none;position: relative;*zoom: 1"><div class="answer"><div>配送到：<div id="district-consult-select" class="customer-address-area fl p-district"><div class="text"><div>请选择</div><b></b></div></div></div><div id="district-result"></div></div></div>{{else}} {{if result[0].robotId && result[0].robotId==1}}<div class="intro-bar">我买的商品售后政策是怎样<div class="triangle-close"></div></div><div class="detail" style="display: none" id="product-service-search"><div class="answer"><p>请输入商品页上方地址栏的链接，如图所示：</p><div class="link-notice"><img alt="链接提示" src="//static.360buyimg.com/jimi/img/product_url.png"></div><div class="search-area"><input type="text" placeholder="请输入商品链接" id="productUrl"><div class="search-button"></div></div></div></div>{{/if}} {{/if}} {{each(i, v) result}}<div class="intro-bar"><span class="question">${v.question}</span><div class="triangle-close"></div></div><div class="detail" style="display:none"><div class="answer">{{html v.answer}}</div></div>{{/each}}',
        getName: function() {
            return 'BuyConsultAnswer';
        }
    });
    // 问题预判
    var PreFaq                      = LocalTemplateAnswer.extend({
        tmpl:'<span>{{if questions}} <a class="pretext">{{html initword}}以下问题是您关心的吗：</a> {{else}} <a class="pretext nopre">{{html initword}}</a> {{/if}} {{each(i,v) questions}}<br><a class="common-question-bg1" onclick="sendData(\'${groupId}\',\'${sid}\',\'${q}\',{{if answer}}\'${answer}\'{{else}}\'0\'{{/if}},this)"><span>${q}</span></a> {{/each}}</span>',
        getName: function() {
            return 'PreFaq';
        }
    });
    // 普通文本
    var PlainText                   = LocalTemplateAnswer.extend({
        tmpl:'<span>{{html answer}}</span>',
        getName: function() {
            return 'PlainText';
        }
    });
    // 推荐问题
    var WithSugguestionsAnswer      = LocalTemplateAnswer.extend({
        tmpl:'<span class="wel">{{html answer}} {{if conjStr}}<br><br>${conjStr}: {{/if}} {{each(i,v) relevantQuestionList}}<br>${i+1}、<a onclick="sendClick(1,\'${id}\',\'${question}\',\'${commandNo}\',\'${sceneNo}\')"><span>${question}</span></a> {{/each}}</span>',
        getName: function() {
            return 'WithSugguestionsAnswer';
        }
    });
    // 订单详情
    var OrderDetailAnswer           = LocalTemplateAnswer.extend({
        tmpl:'<ul class="jimi-orderinfo"><li class="head">订单号：${orderId} &nbsp;&nbsp;订单状态：<label class="status">${orderStateName}</label></li><li class="image">{{each details}} <span><a href="${url}" target="_blank">${name}</a></span><label class="status"><label class="multiply">×</label>${num}</label>{{/each}}</li><li class="info"><p class="title">收货人信息</p><p>收货人：${customerName}</p><p>地址：${address}</p><p>收货人电话：${mobile}</p></li><li class="info"><p class="title">支付与配送方式</p><p>支付方式：${idPaymentTypeName}</p><p>运费：￥${trueTotalFee}</p>{{if expectPickTime}}<p>送货日期：${expectPickTime}</p>{{/if}} </li></ul>',
        getName: function() {
            return 'OrderDetailAnswer';
        }
    });
    // 全程跟踪
    var OrderTrackAnswer            = LocalTemplateAnswer.extend({
        tmpl:'<div class="jimi-order-tracking"><table cellspacing="0" cellpadding="0" width="100%">{{if !data || !data.length}}<tr><td class="time" colspan="2">暂时没有跟踪信息</td></tr>{{else}} {{each data}} {{if $index == 0}}<tr class="receipt">{{else}}</tr><tr>{{/if}}<td class="time">${msgTime}</td><td class="info">${content}</td></tr>{{/each}} {{/if}}</table></div>',
        getName: function() {
            return 'OrderTrackAnswer';
        }
    });
    // 配送服务
    var DeliveryServiceAnswer       = LocalTemplateAnswer.extend({
        tmpl:'tmpl.deliveryservice',
        getName: function() {
            return 'DeliveryServiceAnswer';
        }
    });
    // 商品服务
    var ProductServiceAnswer        = LocalTemplateAnswer.extend({
        tmpl:'<p class="txt-black">您所查询的商品是：</p><div class="search-result clearfix"><div class="search-result-img fl"><a href="${productUrl}" target="_blank"><img src="${absoluteImageUrl}" alt="商品缩略图"></a></div><a href="${productUrl}" target="_blank">${productName}</a></div><p class="txt-black">这款商品的售后服务：</p><div class="search-result-des">{{html asfInfo}}</div>',
        getName: function() {
            return 'ProductServiceAnswer';
        }
    });
    // 商品详情
    var ProductInfoAnswer           = LocalTemplateAnswer.extend({
        tmpl:'<div class="detail"><div class="goods-info clearfix"><div class="goods-img fl"><a target="_blank" href="//item.jd.com/${wareDetailsBean.wid}.html" clstag="JIMI|keycount|home2014|sp1"><img src="${wareDetailsBean.imageurl}" alt="商品缩略图" style="height: 100px; width: 100px"></a></div><p><a href="//item.jd.com/${wareDetailsBean.wid}.html" title="${wareDetailsBean.wname}" target="_blank" clstag="JIMI|keycount|home2014|sp1">${wareDetailsBean.wname}</a></p><p class="txt-red" title="${wareDetailsBean.slogan}">{{html wareDetailsBean.slogan}}</p></div><ul class="goods-des"><li class="clearfix"><div class="fl label">京&nbsp;&nbsp;东&nbsp;&nbsp;价：</div><div class="goods-des-detail"><span class="txt-price">￥${wareDetailsBean.wmeprice}</span></div></li><li class="clearfix"><div class="fl label">促销信息：</div><div class="goods-des-detail">{{html wareDetailsBean.promotion}}</div></li><li class="clearfix"><div class="fl label">库&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;存：</div><div class="goods-des-detail">${wareDetailsBean.stock}</div></li><li class="clearfix"><div class="fl label">商品评分：</div><div class="goods-des-detail"><span class="star-${wareDetailsBean.averageScore} fl"></span><a href="//item.jd.com/${wareDetailsBean.wid}.html#product-detail" target="_blank" class="fl">{{if wareDetailsBean.commentNum}}(${wareDetailsBean.commentNum}条评论){{else}}(评论){{/if}}</a></div></li><li class="clearfix"><div class="fl label">服&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;务：</div><div class="goods-des-detail">{{html wareDetailsBean.service}}</div></li></ul><a href="//gate.jd.com/InitCart.aspx?pid=${wareDetailsBean.wid}&pcount=1&ptype=1" target="_blank" class="opts-buy abtest" clstag="JIMI|keycount|home2014|sp3"></a></div>{{if wareDetailsBean.noStockRecommend && wareDetailsBean.noStockRecommend.length}}<p class="post-title"><strong>{{if wareDetailsBean.recommendType==1}}店长推荐{{else}}为您推荐{{/if}}{{if wareDetailsBean.noStockRecommend.length>3}}</strong><a class="change-btn" href="javascript:;">换一组</a>{{/if}}</p><div class="detail post-goods-info-area"><div class="post-goods-area-wrapper" style="top:0">{{each(i,v) wareDetailsBean.noStockRecommend}}<div class="post-goods-area" title="${wname}"><div class="post-goods-img"><a href="//item.jd.com/${wid}.html" target="_blank" clstag="JIMI|keycount|home2014|sp1"><img src="${imageurl}" alt="商品缩略图"></a></div><p class="post-goods-title"><a target="_blank" href="//item.jd.com/${wid}.html" clstag="JIMI|keycount|home2014|sp1">${wname}</a></p><p class="txt-price">{{if wmeprice}}￥{{/if}}${wmeprice}&nbsp;</p></div>{{/each}}</div></div>{{/if}}',
        getName: function() {
            return 'ProductInfoAnswer';
        }
    });
    // 推荐商品
    var ProductRecommendListAnswer  = LocalTemplateAnswer.extend({
        tmpl:'<span>{{if conjStr}} {{html conjStr}} {{/if}} {{if typeof(conjStr) =="undefined"}} JIMI为您推荐了下面这几款，看您是否中意呢？如果不满意，您还可以告诉我，您想要什<br>么样的，比如“我想要白色的” {{/if}}</span><div class="jimi-goods-list clearfix"><div class="list-panel"><div class="views" style="margin-top: 0">{{each(i,v) data}}<div class="goods-detail clearfix"><a href="//item.jd.com/${wid}.html" target="_blank" clstag="JIMI|keycount|home2014|sp1"><img width="80" height="80" src="${imageurl}"></a><div class="goods-des-area"><p class="goods-title"><a href="//item.jd.com/${wid}.html" target="_blank" title="${wname}" clstag="JIMI|keycount|home2014|sp1">${wname}</a></p><p class="d-price"></p><ul class="goods-des clearfix"><li class="clearfix"><div class="fl label">京&nbsp;&nbsp;东&nbsp;&nbsp;价：</div><div class="goods-des-detail"><span class="txt-price">￥${wmeprice}</span></div></li></ul><div class="btn-wrap clearfix"><a class="note-btn isAddNote" href="javascript:;" productid="${v.wid}" clstag="JIMI|keycount|home2014|sp4">加关注</a> <a class="append-btn abtest" href="//gate.jd.com/InitCart.aspx?pid=${v.wid}&pcount=1&ptype=1" target="_blank" clstag="JIMI|keycount|home2014|sp3">加入购物车</a> <a productid="${wid}" href="javascript:;" class="ask-btn productConsult" clstag="JIMI|keycount|home2014|sp2">问JIMI</a></div></div></div>{{/each}}</div></div>{{if data.length > 2}} <a class="change-btn" href="javascript:;">换一组</a>     {{/if}}</div>',
        getName: function() {
            return 'ProductRecommendListAnswer';
        },
        show: function(ele, isAppend, isAddShell){
            this.shellPre = '<div class="jimi_lists clearfix"><div class="header_img '+window["jimiHeader"]+' fl"></div><table class="msgP" cellspacing="0" cellpadding="0"><tbody><tr><td class="lt"></td><td class="tt"></td><td class="rt"></td></tr><tr><td class="lm"><span></span></td><td class="mm">';
            this._super(ele, this.tmpl, isAppend, isAddShell);
        }
    });
    // 商品属性
    var ProductPropertyAnswer       = LocalTemplateAnswer.extend({
        tmpl:'<div style="max-width: 450px">{{each data}}<div style="float:left"><div class="answer">${textAnswer}</div><div class="jimi-propertys-list">{{each productPropertyInfoList}} {{if propertyName}} <div>&nbsp;&nbsp; ${propertyName} :&nbsp; ${propertyValue}</div>{{else}}<div class="views"><div class="jimi-propertys-view"><div class="goods-image"><a href="${productUrl}" target="_blank"><img src="${imageUrl}"></a></div><div class="goods-price" style="max-width: 100px;overflow: hidden"><label title="${propertyValue}">${propertyValue}</label></div></div></div>{{/if}} {{/each}} </div></div><br>{{/each}}</div>',
        getName: function() {
            return 'ProductPropertyAnswer';
        }
    });
    // 普通类型
    var commonAndRedictAnswer       = LocalTemplateAnswer.extend({
        tmpl:'<span class="wel">{{html answer}} {{if conjStr}}<br><br>${conjStr}: {{/if}} {{each(i,v) relevantQuestionList}}<br>${i+1}、<a onclick="sendClick(1,\'${id}\',\'${question}\',\'${commandNo}\',\'${sceneNo}\')"><span>${question}</span></a> {{/each}}</span>',
        getName: function() {
            //  调用父类的方法
            return 'commonAndRedictAnswer';
        }
    });
    // 非业务
    var ChatAnswer                  = LocalTemplateAnswer.extend({
        tmpl:'<span data-classifyname="${classifyName}" data-requesttext="${requestText}">{{html answer}} {{if showRelationQA}} {{if conjStr}} {{if answer && relevantQuestionList.length}} <i class="common-hr"></i> {{/if}} ${conjStr}： {{/if}} {{each(i,v) relevantQuestionList}}<br><a class="common-question-bg" data-cateid="${cateId}" data-modelname="${modelName}" data-classifyname="${classifyName}" onclick=sendClick({{if commandNo}}1{{else}}0{{/if}},\'${id}{{if !commandNo}}&&&faq{{/if}}\',\'${cleanBr(question)}\',\'${commandNo}\',\'${sceneNo}\',${i+1},this)>${question}</a> {{/each}} {{/if}}</span> {{if resultTypebak =="baiduAnswer"}} <img style="vertical-align:text-top" title="信息来自百度，仅供参考" alt="信息来自百度，仅供参考" src="//static.360buyimg.com/jimi/img/bd_logo_gray_20140410.png"> {{/if}}',
        getName: function() {
            return 'ChatAnswer';
        }
    });
    // 折叠答案
    var FoldAnswer                  = LocalTemplateAnswer.extend({
        tmpl:'<span data-requesttext="${requestText}">{{html answer_title}} {{each(i,v) datas}}<p><a href="javascript:;" data-anwser="${a}" data-id="${id}">${q}</a></p>{{/each}}<p>{{html extra}}</p></span>',
        getName: function() {
            return 'FoldAnswer';
        }
    });
    // 用户反馈
    var UserFeedback                = LocalTemplateAnswer.extend({
        tmpl:'<span data-classifyname="" data-requesttext="${requestText}">${answer_title} {{each(i,v) datas}}'
            +'{{if v.feedbackAnswer || v.feedbackAnswer==""}}'
            +'{{if i == datas.length-1}}'
            +'<br/><span class="common-question-bg">{{html question}}</span>'
            +'{{else}}'
            +'<br><a class="common-question-bg" data-cateid="${cateId}" data-modelname="${modelName}" data-classifyname="${classifyName}" onclick="sendClick(0,\'&&&faq\',\'${cleanBr(question)}\',\'\',\'\',${i+1},this,${type},\'\',\'${cleanBr(feedbackAnswer)}\')">${question}</a>'
            +'{{/if}}'
            +"{{else}}"
            +'<br><a class="common-question-bg" data-cateid="${cateId}" data-modelname="${modelName}" data-classifyname="${classifyName}" onclick="sendClick(0,\'&&&faq\',\'${cleanBr(question)}\',\'\',\'\',${i+1},this,false,false)">${question}</a>'
            +'{{/if}}'
            +'{{/each}}</span>',
        getName: function() {
            return 'UserFeedback';
        }
    });
    // 图片类型
    var ProductData                 = LocalTemplateAnswer.extend({
        tmpl:'{{if answer_note == 4}}{{each(i,v) answer}}<div class="goods-detail clearfix"><a target="_blank" href="//item.jd.com/${wid}.html" clstag="JIMI|keycount|home2014|sp1"><img height="100" width="100" src="${imageurl}" data-bd-imgshare-binded="1"></a><div class="goods-des-area"><p><a target="_blank" href="//item.jd.com/${wid}.html" clstag="JIMI|keycount|home2014|sp1">${wname}</a></p><p class="d-price">{{html slogan}}</p><ul class="goods-des clearfix"><li class="clearfix"><div class="fl label">京&nbsp;&nbsp;东&nbsp;&nbsp;价：</div><div class="goods-des-detail"><span class="txt-price">￥${wmeprice}</span></div></li><li class="clearfix"><div class="fl label">商品评分：</div><div class="goods-des-detail"><span class="star-${averageScore} fl"></span> <a href="//item.jd.com/${wid}.html#product-detail" target="_blank" class="fl">${comments}条评论</a></div></li><li class="clearfix"><div class="fl label">服&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;务：</div><div class="goods-des-detail">{{html providers}}</div></li></ul><div class="btn-wrap clearfix"><a productid="${wid}" href="javascript:;" class="note-btn isAddNote" clstag="JIMI|keycount|home2014|sp4" title="加关注">加关注</a> <a target="_blank" href="//gate.jd.com/InitCart.aspx?pid=${wid}&amp;pcount=1&amp;ptype=1" class="append-btn abtest" clstag="JIMI|keycount|home2014|sp3" title="加入购物车">加入购物车</a></div></div></div><p></p>{{/each}} {{else}} <span data-requesttext="${requestText}">{{html answer_title}}</span><div class="jimi-goods-list clearfix"><div class="list-panel"><div class="views" style="margin-top: 0">{{each(i,v) answer}}<div class="goods-detail clearfix"><a href="//item.jd.com/${wid}.html" target="_blank" clstag="JIMI|keycount|home2014|sp1"><img width="80" height="80" src="${imageurl}"></a><div class="goods-des-area"><p class="goods-title"><a href="//item.jd.com/${wid}.html" target="_blank" title="${wname}" clstag="JIMI|keycount|home2014|sp1">${wname}</a>{{each(j,t) tags}}<span class="goods-tag">${tag}</span>{{/each}}<span class="goods-review">好评率：${goodrate}</span></p><p class="d-price"></p><ul class="goods-des clearfix"><li class="clearfix"><div class="fl label">京&nbsp;&nbsp;东&nbsp;&nbsp;价：</div><div class="goods-des-detail"><span class="txt-price">￥${wmeprice}</span></div></li></ul><div class="btn-wrap clearfix"><a class="note-btn isAddNote" href="javascript:;" productid="${v.wid}" clstag="JIMI|keycount|home2014|sp4">加关注</a> <a class="append-btn abtest" href="//gate.jd.com/InitCart.aspx?pid=${v.wid}&pcount=1&ptype=1" target="_blank" clstag="JIMI|keycount|home2014|sp3">加入购物车</a> <a productid="${wid}" href="javascript:;" class="ask-btn productConsult" clstag="JIMI|keycount|home2014|sp2">问JIMI</a></div></div></div>{{/each}}</div></div>{{if answer.length > 2}} <a class="change-btn" href="javascript:;">换一组</a> {{/if}}</div>{{/if}}',
        getName: function() {
            return 'ProductData';
        }
    });
    // 聊天帮助
    var ChatHelper                  = LocalTemplateAnswer.extend({
        tmpl:'<div class="chat-helper"><div class="chat-helper-guess"><div class="chat-helper-guess-tips">JIMI猜您想问：</div><div class="chat-helper-guess-select"><span>{{if result.length}}${result[0]}{{/if}}</span> <b><i></i></b><ul class="chat-helper-guess-list" style="display: none">{{each(i,v) result}}<li><a title="${v}" href="javascript:;">${v}</a></li>{{/each}}</ul></div></div></div>',
        getName: function() {
            return 'ChatHelper';
        }
    });
    // 问题卡片
    var fristCard                  = LocalTemplateAnswer.extend({
        tmpl:'<div class="f-card" data-id="${answer.id}">' +
             '{{if answer.img}}<ul class="img-lis">{{each(i,an) answer.img}}<li><a class="c-link" data-id="${an.id}"  data-type="0" data-position="${an.position}"  href="${an.href}"  target="_blank"><img src="${an.src}" ></a></li>{{/each}}</ul>{{/if}}' +
             '{{if answer.text}}<p class="text-lis-tip">您是否想咨询：</p><ul class="text-lis">{{each(i,an) answer.text}}<li><a  class="c-link" data-id="${an.id}" href="javascript:;" data-anwser="${an.a}" data-type="1"  data-position="${an.position}">{{html an.q}}</a></li>{{/each}}</ul><p class="bot-note">如果没有，请在下面直接告诉我~</p>{{/if}}' +
             '{{if answer.questiontip}}<p class="text-lis-tip">您是否想咨询：</p><ul class="text-lis">{{each(i,an) answer.questiontip}}<li><a  class="c-link" data-id="${an.questionId}" href="javascript:;" data-send="${an.question}" data-type="1"  data-position="${an.postion}">{{html an.question}}</a></li>{{/each}}</ul><p class="bot-note">如果没有，请在下面直接告诉我~</p>{{/if}}' +
             '</div>',
        getName: function() {
            return 'fristCard';
        }
    });
    // 问题卡片
    var fastEntry                  = LocalTemplateAnswer.extend({
        tmpl:'<div class="fast-entry"><a  href="javascript:;" id="f-e-btn" class="f-e-btn on"></a><div class="f-e-lis">' +
            '{{each(i,an) datas}}{{if an.type == 1}}' +
            '<a class="f-link-a" data-id="${an.id}" target="_blank"  data-position="${an.position}" href="${an.content}" >{{html an.title}}</a>' +
            '{{else}}' +
            '<a class="f-link-a f-send-a" data-id="${an.id}"  data-position="${an.position}" href="javascript:;" data-send="${an.title}" >{{html an.title}}</a>' +
            '{{/if}}{{/each}}</div></div>',
        getName: function() {
            return 'fastEntry';
        }
    });




    // 远程模板答案类，继承至模板答案类
    var RemoteTemplateAnswer = TemplateAnswer.extend({
        tid: '',
        version: '',
        init: function(data) {
            this._super(data);
            this.tid = this.data.ext_property.tid;
            this.version = this.data.ext_property.version;
        }
    });
    // 表单模板答案，继承至远程模板答案
    var FormTemplateAnswer =    RemoteTemplateAnswer.extend({
        nData: {},
        uuid: '',
        paras: {},
        init: function(data) {
            this._super(data);
            var ext_property = typeof data.ext_property !== 'undefined' ? data.ext_property : {};
            if(typeof data.answer === 'string' && /^\{.*\}$/.test(data.answer)) {
                this.nData = $.parseJSON(data.answer);
            }else{
                this.nData = data.answer;
            }
            this.uuid = this.nData.sceneUuid;
            if(typeof this.nData.dataMap != 'undefined') {
                if(typeof this.nData.dataMap[this.tid] != 'undefined') {
                    this.nData['dataMap'] = this.nData.dataMap[this.tid];
                }else{
                    this.paras = {
                        className : this.nData.className,
                        modelName : this.nData.modelName,
                        sceneUuid : this.nData.sceneUuid,
                        formCode : this.tid
                    };
                }
            }

        },
        show: function(ele, isAppend, isAddShell) {
            var that = this;
            var options = {
                uuid: this.uuid,
                data: this.nData,
                tid: this.tid,
                version: this.version
            };
            var scene = new Scence(this.uuid);
            if(scene.getContainer() == null) {
                var $messageBody = $(that.shellPre + that.shellPos + that.shellPos2);
                var $container = $messageBody.find('.mm');
                ele.append($messageBody);
                scene.setContainer($container);
            }
            scene.setForm(this.tid, this.version, this.nData);
            scene.render();
            setScroll();
        }
    });
    // 普通模板答案，继承至远程模板答案
    var GeneralTemplateAnswer = RemoteTemplateAnswer.extend({
        init: function(data) {
            this._super(data);
            var answer = data.answer;
            if(Object.prototype.toString.call(answer) === '[object Array]') {
                this.data.datas = answer;
            }
        },
        show: function(ele, isAppend, isAddShell) {
            var that = this;
            var form = new Form(that.data, that.tid, that.version);
            form.getTemplate(function(html) {
                that._dealHtml(html, ele, isAppend, isAddShell);
            });
        }
    });



    this.AnswerFactory = function() {};

    AnswerFactory.resultType = {
        'orderDetail': OrderDetailAnswer,
        'orderList':OrderListAnswer,
        'orderTrack':OrderTrackAnswer,
        // 配送服务
        'deliveryService':DeliveryServiceAnswer,
        'buyConsult':BuyConsultAnswer,
        // 右侧商品详情
        'productInfo':ProductInfoAnswer,
        // 售后政策
        'productService':ProductServiceAnswer,
        'propertySearch':ProductPropertyAnswer,
        // 一般回答
        'common':WithSugguestionsAnswer,
        // 商品推荐列表展示
        'productRecommendList':ProductRecommendListAnswer,
        // 显示回答且跳转到新的页面的回答
        'cancelOrder1':commonAndRedictAnswer,
        'question':Question,
        // 非业务包含 'chatAccurate','chatSensitive','chatNormal','chatTeach','chatNoAnswer'
        'chat':ChatAnswer,
        'helpCenterFixedAnswer': ChatAnswer,
        // 新答案格式-普通答案
        'p_plain_text_answer':PlainText,
        // 折叠答案
        'p_fold_answer':FoldAnswer,
        // 用户反馈
        'p_user_feedback':UserFeedback,
        'p_product_data':ProductData,
        // 问题预判
        'preFaq':PreFaq,
        'p_img_text_answer':fristCard,
        'p_fast_entry':fastEntry,
        'p_interaction' : interaction
    };

    AnswerFactory.answerType = {
        formTemplateAnswer: FormTemplateAnswer,
        geneTemplateAnswer: GeneralTemplateAnswer,
        localTemplateAnswer: AnswerFactory.resultType
    };

    AnswerFactory.createAnswer = function(infoType, data) {
        var responseAnswers = {};
        var tid;
        var answerType;
        var answer = {};
        if(arguments.length == 2) {
            responseAnswers = data;
            responseAnswers.infoType = infoType;
            answerType = infoType;
        }else if(arguments.length == 1) {
            data = infoType;
            responseAnswers = data.answers;
            responseAnswers.infoType = data.ptype;
            answerType = data.ptype;
            tid = data.tid;
            if(!tid) {
                if(typeof responseAnswers.ext_property !== 'undefined') {
                    tid = responseAnswers.ext_property.tid;
                }
            }
        }
        // 判断答案中是否包含场景ID
        var suid = (responseAnswers.ext_property && responseAnswers.ext_property.interactiveId) || false;
        if(suid !== false && (!answerType || answerType !== 'p_component_answer')) {
            var scence = Scence.HASH[suid];
            if(scence) {
                scence.done();
            }
        }

        if(tid) {
            switch (answerType) {
                // 远程表单答案
                case 'p_component_answer':
                    answer = new AnswerFactory.answerType.formTemplateAnswer(responseAnswers);
                    break;
                // 折叠答案
                case 'p_fold_answer':
                // 用户反馈
                case 'p_user_feedback':
                // 商品信息
                case 'p_product_data':
                    answer = new AnswerFactory.answerType.geneTemplateAnswer(responseAnswers);
                    break;
                default:
                    answer = new AnswerFactory.answerType.localTemplateAnswer[answerType](responseAnswers);
                    break;
            }
        }else{
            answer = new AnswerFactory.answerType.localTemplateAnswer[answerType](responseAnswers);
        }
        return answer;
    };

})(Class, jQuery, window, document);

/**
 * 用户对问题的反馈
 */
(function($, window, document){
	//回答满意
	$(".anwserSatisify").live("click",function(){
		var resultType = $(this).attr('resulttype');
		var answer = $(this).attr('answer');
		var question = $(this).attr('requesttext');
		var html = '';
		
		var teachObj = new Object();
		teachObj.teachQuestion =  question;
		teachObj.teachAnswer = answer;
		teachObj.resultType =  resultType;
		teachObj.SaOrUnsaType = "Satisfied";
		//不满意日志记录日志
		unsatisfiedLog(teachObj);
		
		var td =  $(this).parents("td");
		$(this).parent(".btn-area").remove();
		$(td).attr("class","mm");
		html = '<p align="right"><br/><span>感谢您的反馈！</span></p>';
		$(td).append(html);//新增
	    //setScroll();
		 if(resultType == 'baiduAnswer'){//问题答案入库
			 var data = {
		               'teachQuestion' : question,
		               'teachAnswer' : answer,
		               'teachType':'5'
		        		};
			 $.ajax({
	               type : "post",
	               url : '/teachfeedback/TeachFeedbackToRedis.action',
	               data : data}
			 );
			 
		 }
	});
	//点击满意度，记录日志（供满意度评价用）
	$(".anwserSatisify").live("click",function(){
		 $.ajax({
             	type : "get",
             	url : '/ask/checkSimpleSatisfy.action',
             	dataType:'json',
             	success:function(data){
             		if(data.satisfyFlag){
             			isShowSatisfyModal = true;
             		}
             	}
             }
		 );
	});
	//回答不满意
	$(".anwserUnsatisify").live("click",function(){
		var resultType = $(this).attr('resulttype');
		var answer = $(this).attr('answer');
		var question =  $(this).attr('requestText');
		var td =  $(this).parents("td");
		$(td).attr("class","mm");
		var html = '';
		var teachObj = new Object();
		teachObj.teachQuestion =  question;
		teachObj.teachAnswer = answer;
		teachObj.resultType =  resultType;
		teachObj.SaOrUnsaType = "UnSatisfied";
		//不满意日志记录日志
		unsatisfiedLog(teachObj);
		
		//如果是业务问题
		//闲聊枚举
    	var  chatCategory = ["chatAccurate","chatSensitive","chatNormal","chatTeach"];
		if($.inArray(resultType,chatCategory)==-1 && resultType !='chatNoAnswer' && resultType !='baiduAnswer'){
			$(this).parent(".btn-area").remove();//移除按钮
			html = '<p align="right"><span>感谢您的反馈！我们会尽快修正答案！</span></p>';
			$(td).append(html);//增加提示
			/*teachObj.teachType = 2;
			anwserUnsatisifyTeach(teachObj);*/ //业务回答不满意不调教调教
		}else{//如果是非业务问题
			//删除节点
			var temp = $(this).parents('.jimi_lists');
			var o = new Object();
			o.title = '这个问题JIMI回答的不好，教我回答吧。O(∩_∩)O';
			o.question = question;
			if(resultType == "chatAccurate"){
				o.trainType = 6;
			}else if(resultType == "chatSensitive"){
				o.trainType = 7;
			}else if(resultType == "chatNormal"){
				o.trainType = 8;
			}else if(resultType == "chatTeach"){
				o.trainType = 9;
			}else if(resultType == "baiduAnswer"){
				o.trainType = 10;
			}
			temp.after($("#unsatisifyAndUnknown").tmpl(o));
			temp.remove();
		}
       // setScroll();
	});
	
	function  unsatisfiedLog(data){
			 $.ajax({
             type : "post",
             url : '/teachfeedback/unsatisfiedLog.action',
             data : data,
             dataType : "JSON"
         });     
	}
	function  satisfiedLog(data){
			 $.ajax({
             type : "post",
             url : '/teachfeedback/satisfiedLog.action',
             data : data,
             dataType : "JSON"
         });     
	}
	
	function anwserUnsatisifyTeach(data){
		 $.ajax({
             type : "post",
             url : '/teachfeedback/TeachFeedbackToRedis.action',
             data : data,
             dataType : "JSON"
         });       
	}
	
	//调教点击确定按钮
	$(".answerInputButton").live("click",function(){
		var question = $(this).attr('question');
		var answer = $(this).siblings('input').val();
		var trainType = $(this).attr('trainType');
		var talk = $(this).parents('.jimi_lists');
         var data = {
               'teachQuestion' : question,
               'teachAnswer' : answer,
               'teachType':trainType
           };
         if(answer == ""){
        	 return ;
         }
           $.ajax({
               type : "post",
               url : '/teachfeedback/TeachFeedbackToRedis.action',
               data : data,
               dataType : "JSON",
               success:function(){
      			var html = '<div class="jimi_lists clearfix"><div class="header_img '+window["jimiHeader"]+' fl"></div><table cellspacing="0" cellpadding="0" class="msg"><tbody><tr><td class="lt"></td><td class="tt"></td><td class="rt"></td></tr><tr><td class="lm"><span></span></td><td class="mm"><div class="msg-teach-ok"><p class="msg-teach-title">收到！过几天再来考考我吧。O(∩_∩)O</p></div></td><td class="rm"></td></tr><tr><td class="lb"></td><td class="bm"></td><td class="rb"></td></tr></tbody></table></div>';
      			talk.after(html);
      			talk.remove();
      			//$(html).appendTo("#chatcontent");
      	        //setScroll();
               }
           });       
		
	});
	
	$(".unsatisityAnswerInput").live("cut paste keyup blur focus",function(e){
		unsatisityAnswerInput(this);
	 }
	);
	 $(".unsatisityAnswerInput").live("focus", function(){
		 $(this).attr("placeholder","");
	 });

 	 $(".unsatisityAnswerInput").live("blur", function(){
      var text = $(this).val();
      if ("" == text) {
        $(this).attr("placeholder","这里可以输入答案，点击“确定”。");$("#text-ans").css("color", "");
      }
   });
     
   $(document).on("keydown", ".unsatisityAnswerInput", function(e){
     var keycode = e ? e.which : window.event.keyCode;
     if(keycode == 13) {
       $(this).siblings(".answerInputButton").trigger("click");
     }
   });

    function unsatisityAnswerInput(ele) {
		var answer = $(ele).val();
		if(answer.length > 200){//最长是两百个字
			var newAnswer = answer.substr(0,200);
				$(ele).val(newAnswer);
			}
		}
	//关闭窗口打点
	window.onbeforeunload = function(event){
	    var allNum = $("#chatcontent").find(".customer_lists").length;
	    $.ajax({
	        type : "post",
	        url : "/sessionChatNumRecord.action",
	        data : {
	            chatNum:allNum
	        }
	    });
	   
	};
	
}(jQuery, window, document));


(function($, window, document) {
    setTimeout(function() {
        var defaultTime;
        if(window.idleTime != undefined) {
            defaultTime = window.idleTime;
        } else{
            defaultTime = 1000 * 60 * 2;
        }
        /*-------------------------------------------------------*/
        var socket = package('v.socket');

        if(window.wsSwitch == 1 || window.wsSwitch === 'true') {
            if(!socket.support()) {
                setInterval(pushData, defaultTime);
            } else {
                var userLoginInterval = setInterval(function() {
                    if((window.userState === true || window.userState === 'true') && window.loginRequest === true) {
                        clearInterval(userLoginInterval);
                        $.ajax({
                            type: 'GET',
                            url: '/wsAid.action',
                            dataType: 'JSON',
                            data: {},
                            success: function(result) {
                                if(result.code != 1) {
                                    setInterval(pushData, defaultTime);
                                    return;
                                }
                                var aid = result.context;
                                if(!socket.start(aid)) {
                                    setInterval(pushData, defaultTime);
                                }
                            }
                        });
                    }
                }, 2000);
            }
        } else {
            setInterval(pushData, defaultTime);
        }
        /*-------------------------------------------------------*/
    },900);
    // 定时关怀请求
    function pushData() {
        // 发一个请求到brain
        var commandNo = 'idlePushCommand';
        var data = {
            'commandNo': commandNo,
            'productId': (productId == undefined) ? '' : productId,
            'source':jimiSource || ''
        };
        $.ajax({
            type: 'post',
            url: '/ask/ask.action',
            dataType: 'JSON',
            data: data,
            success: function (ret) {
                var res = JSON.parse(ret.data);
                if(res.answers.answer != '') {
                    var answer;
                    var ele = $('#chatcontent');
                    answer = AnswerFactory.createAnswer(res.ptype, res.answers);
                    // answer = new AnswerFactory1.createAnswer(res.ptype, res.answers);
                    answer.show(ele, true, true);
                    setScroll();
                }
            }
        });
    }


// 点赞后记录点赞的类型就可以了，第一类模板的
// $('.j-dig-tri').delegate('body', 'click', function() {
    $('.j-dig-tri').live('click', function() {
        var target = $(this).parents('.dig-w');
        var isClicked = $(this).attr('isClicked');
        if(isClicked == 1)   {
            return ;
        }
        $(this).attr('isClicked','1');

        var resultType = $(this).attr('resultType');
        var redisNum = $(this).attr('redisNum');

        var Obj = {};
        Obj.resultType = resultType;
        Obj.redisNum = redisNum;

        $.ajax({
            type: 'post',
            url: '/teachfeedback/setDianzanMoban.action',
            dataType: 'JSON',
            data: Obj,
            before: function() {
                target.addClass('loading');
            },
            success: function () {
                var redisNum = target.find('.dig-txt em');

                target.removeClass('loading').addClass('diged');
                redisNum.text(+redisNum.text() + 1);
                target.find('.dig-tri ').text('谢谢！');
            }
        });
    });
}(jQuery, window, document));










/**
 * 商品导购开发
 **/
(function($, window, document){
  //咨询商品
  var eventData = {};
  $(".productConsult").live("click", function(event, notShowJimiTalk, callback){
    var ele = $(this);
    var wid = ele.attr("productId");
    // if(!wid)
//     $.ajax({
//       type : "post",
//       url : '/productConsult/getProductInfo.action?productId='+wid +"&t=" + new Date().getTime(), //这个请求答案格式未改，因此这里不用ext_property.switchWare
//       dataType : "JSON",
//       success:function(data){//回调函数
//         if(data.productName) {
//           var dom = $("#simpleProductInfo").tmpl(data).appendTo("#chatcontent");
//           //尝试获取里面的关注按钮（note-btn），判断是否已经关注
//           package("v.follow").getStatus($(dom));
//         } else {
//             showMes("JIMI", data.answer);
//           //尝试获取里面的关注按钮（note-btn），判断是否已经关注
//           package("v.follow").getStatus($("#chatcontent"));
//         }

//         //判断是否有商品切换，如果有，刷新商品信息
//         if(data.switchWare) {
//           switchProduct(data.switchWare, data.refreshContent)
//         }
//         if(typeof callback == "function") {
//           callback();
//         }

//         //如果带有jimi的问话,显示jimi的问话
//         if(data.jimiTalk && !notShowJimiTalk){
// //          var jimiTalk = new Object();
// //          jimiTalk.answer = data.jimiTalk;
// //          $("#jimiTalkTemplate").tmpl(jimiTalk).appendTo("#chatcontent");
//           /*现vm及html文件中未见id 为jimiTalkTemplate的，为了展示jimiTalk，用下面的方式展示出来*/
//             showMes("JIMI", data.jimiTalk);
//         }
//         setScroll();
//       }
//     });
    //再发ASK.action请求
      var requestText = location.protocol + '//item.jd.com/' + wid + '.html'
      var postData = {
        'requestText' : requestText
      };
      showMes('我', requestText);
      package('v.componentAnswer').sendAsk(postData);
  });

  //点击配件菜单，展示相应的配件
  $(".fittingsRecommendTab").live("mouseover",function(){
    $(this).parent().siblings("li").removeClass("current");
    $(this).parent().addClass("current");
    var index = $($(this).parent()).index();
    var divs = $(this).parents("ul").siblings("div");
    divs.hide();
    $(divs[index]).show();
  });

})(jQuery, window, document);

//切换商品,isAsk标识是否是在ask.action拼装答案时处理switchProduct
var switchProduct = function(switchWare, refreshContent, callback,isAsk) {
  window.productId = switchWare;

  getProductInfo();
  //解决第一次输入 item.jd.com/xx.html不出答案的问题
/*  if(isAsk){
    if(refreshContent) {
    $('<a class="productConsult" productId="'+window.productId+'" style="display: none;"></a>').appendTo("body").trigger("click", [true, callback]).remove();
  }
  }*/
//  if(refreshContent) {
//    $('<a class="productConsult" productId="'+window.productId+'" style="display: none;"></a>').appendTo("body").trigger("click", [true, callback]).remove();
//  }
};
/**
 * Created by chenzhengguo on 2014/12/25.
 */

// 灰度环境全局变量
var isJIMI2 = true;
var isMyJimi = false;
var source1=false;

(function($, window) {
    //原从vm模板中所获参数，现改为从url中解析获取
    var urlParamObj = parseURLParam();
    window.productId=urlParamObj.productId;
    window.jimiSource=urlParamObj.source||"other";
    window.promotionId=urlParamObj.promotionId;
    window.pagetype=urlParamObj.pagetype;
    window.pagevalue=urlParamObj.pagevalue;
    window.venderId=urlParamObj.venderId;
    window.orderId=urlParamObj.orderId;
    window.c3=urlParamObj.c3;
    window.terminal=urlParamObj.terminal;
    window.invitingUser=urlParamObj.invitingUser;
    window.entry=urlParamObj.entry;
    window.chatId=urlParamObj.chatId;
    window.referer=urlParamObj.referer;
    window.isShowSatisfyModal=false;
    window.variables = GetQueryString('variables');
    if(window.productId){
        window.entrance="presale";
    }else{
        window.entrance="customer";
    }
    window.cateId='';//cateId来源何处未知，防止welcome.action报错

    function GetQueryString(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }


    $(function() {
        /*----------------后台概率控制----------------*/
        var package = window.package || (function(){throw new Error('function package is necessary!')})();
        var flowParam = {t: new Date().getTime()};
        window.productId && (flowParam.productId = window.productId);
        window.jimiSource && (flowParam.source = window.jimiSource);
        $.ajax({
            type: "get",
            url: '/welcomeMask/flowControl.action?' + $.param(flowParam),
            dataType: "json",
            success: function(res) {
                var inviteModule = package("v.invite");
                inviteModule.defaultBestSatisfy = (res.templateext == 'selected');
                //12-02先去掉这个概率，在closingFlag的地方判断
                //inviteModule.showFeedbackWhenClose = Math.random() < parseFloat(res.flow);
                inviteModule.setInviteTemplate(res.template, res.evaluatetemplate);
                inviteModule.isFiveFeedback = (res.windowtype == 5);
                inviteModule.feedbackInit();
            }
        });

        //初始显示评价引导，已经下线
        //package("v.animate").showPageGuide();

        //浏览器关闭相关的控制
        package("v.close").bindWindowClose();


        //个人空间和我的JIMI展示
        // package("v.myspace").init();

        //萌宠
        // package("v.myjimi.adopt").init();
        // isMyJimi = true;



        //初始化快捷查询中的货到付款
        package("v.shortcut.Dispatching").init();

        //页面自适应
        package("v.adjustView").adaptHeight();

        //从聊天帮助来获取问题
        package("v.chatHelper").getQuestions();

        //右侧边栏初始化
        package("v.sidebar").init();

        //调教模块
        package("v.teach").init();

        //数据统计&埋点
        package("v.statistic").init();

        //登录逻辑初始化
        package("v.login").init();

        //Fortest
        /*
         showMes("JIMI", '这是测试环境哦<br/>\
         <i class="js-thumbnail" src="general/ddlsjlcx/yiqian.png" title="这是过去的订单的描述"></i>\
         <i class="js-thumbnail" src="general/ddlsjlcx/hdfk.png" title="这是货到付款的描述"></i>\
         <i class="js-thumbnail" src="general/ddlsjlcx/shanchu.png" title="这是删除订单的描述，啦啦啦啦"></i>\
         <i class="js-thumbnail" src="test/image-3.jpg" title="这是过去的订单的描述"></i>\
         <i class="js-thumbnail" src="test/image-5.jpg" title="这是货到付款的描述"></i>\
         <i class="js-thumbnail" src="test/image-6.jpg" title="这是删除订单的描述，啦啦啦啦"></i>\
         <i class="js-thumbnail" src="general/lpkbd/default.jpg" title="这是删除订单的描述，啦啦啦啦"></i>\
         ');
         */


    });
}(jQuery, window));

var defaultInput = defaultInput || $('#text-in').val()||"请简要描述您的问题，如“退换货运费怎么算”";
var oldQuestion = defaultInput;
/* 时间格式化*/
Date.prototype.format = function(format) {
    var o = {
        "M+" :this.getMonth() + 1,
        "d+" :this.getDate(),
        "h+" :this.getHours(),
        "m+" :this.getMinutes(),
        "s+" :this.getSeconds(),
        "q+" :Math.floor((this.getMonth() + 3) / 3), // quarter
        "S" :this.getMilliseconds()
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};


+(function($, window) {
    var textInValue = defaultInput;
    var changeTag="input";

    /*---处理输入框事件---*/
    $(function() {
        //修复自动填充
        $("#text-in")
            .val(defaultInput)
            .css('color', '#999999')
            .focus(function(){
                $(this).css('color', '#000000');
                var input = $(this).val();
                if(input == defaultInput){
                    $(this).val('');
                }
            })
            .blur(function(){
                var input = $(this).val();
                setTimeout(function() {
                    $("#sugguestions").hide();
                }, 250);
                if(input.trim() == ''){
                    $(this).val(defaultInput);
                    $(this).css('color', '#999999');
                }
            })
            .bind('input propertychange', textChange)
            .on("keydown", inputKeyUp);
        //Fix IE9 BUG
        if($.browser.msie && $.browser.version == "9.0") {
            setInterval(textChange, 50);
        }
        //发送按钮点击响应
        $("#winsend").click(add);
    });

    //问题及显
    function textChange() {
        var textIn = $.trim($("#text-in").val());
        if(changeTag != "input"){
            return;
        }
        if (textIn == oldQuestion) {
            return;
        }
        oldQuestion = textIn;
        if(textIn.length > 1000) {
            textIn = textIn.substring(0, 1000);
        }
        var $tip = $("#text-in").next(".input-tips");
        if(textIn.length > 100){
            $("#sugguestions").hide();
            $("#text-in").val(textIn);
            var tips = "最多输入100个字，已超出" + (textIn.length - 100) + "个字";
            if($tip.length) {
                $tip.find("p").html(tips);
            } else {
                $("#text-in").after('<div class="input-tips"><span class="input-tips-l"></span><p>'+tips+'</p><span class="input-tips-r"></span><span class="input-tips-arrow"></span></div>');
            }
            return;
        } else {
            $tip.remove();
        }
        var text = ReplaceTags(textIn);
        //只要文本变化，都有会去掉建议问题，并替换为当前文本。
        if(true || changeTag == "input"){
            $(".suggestion").removeClass("hover");
            textInValue = text;
        }else{
            return;
        }
        if(oldQuestion == defaultInput){
            var reg = defaultInput;
            text = text.replaceAll(reg, "");
        }
        if (text.length == 0 || text == defaultInput) {
            $("#sugguestions").hide();
            return;
        }
        package("v.chatHelper").showSuggestions(text);
        window.inputString=text;
    }

    var changeTag = "input";
    //键盘触发发送事件
    function inputKeyUp(e) {
        var keycode = e ? e.which : window.event.keyCode;
        switch(keycode) {
            case 10:
            case 13:
            { //这里敲击了Enter键
                add();
                changeTag = "input";
                if(window.event) {
                    window.event.returnValue = false;
                    window.event.preventDefault && window.event.preventDefault();
                } else {
                    e.preventDefault();//for firefox
                }
                return false;
                break;
            }
            case 38:
            { //上箭头
                if($("#sugguestions").css("display") == "none") {
                    //break ;
                    return false;
                }
                var sugs = $("#sugguestions .hover");
                if(sugs.length == 0) {
                    $(".suggestion:last").addClass("hover");
                    var text = $(".suggestion:last a").text();
                    changeTag = "select";
                    setTimeout(function() {$("#text-in").focus().val(text)});

                } else {
                    sugs.removeClass("hover");
                    if(sugs.prev(".suggestion").length > 0) {
                        sugs.prev(".suggestion").addClass("hover");
                        var text = sugs.prev(".suggestion").find("a").text();
                        changeTag = "select";
                        setTimeout(function() {$("#text-in").focus().val(text)});

                    } else {
                        changeTag = "input";
                        setTimeout(function() {$("#text-in").focus().val(textInValue)});
                    }
                }
                break;
            }
            case 40:
            { //下箭头
                if($("#sugguestions").css("display") == "none") {
                    break;
                }
                var sugs = $("#sugguestions .hover");
                if(sugs.length == 0) {
                    $(".suggestion:first").addClass("hover");
                    var text = $(".suggestion:first a").text();
                    changeTag = "select";
                    $("#text-in").focus();
                    $('#text-in').val(text);
                } else {
                    sugs.removeClass("hover");
                    if(sugs.next(".suggestion").length > 0) {
                        sugs.next(".suggestion").addClass("hover");
                        var text = sugs.next(".hover").find("a").text();
                        changeTag = "select";
                        $("#text-in").focus();
                        $('#text-in').val(text);
                    } else {
                        changeTag = "input";
                        $("#text-in").focus();
                        $('#text-in').val(textInValue);
                    }
                }
                break;
            }
            default:
            {
                changeTag = "input";
                break;
            }
        }
    };
}(jQuery, window));

//发送输入框里的内容
var voluntarySocket = false;
var voluntaryTimer = null;

function _restartVoluntary() {
    if(voluntarySocket) return;
        if(voluntaryTimer) {
            clearTimeout(voluntaryTimer);
            voluntaryTimer = null;
        }

        voluntaryTimer = setTimeout(function() {
            package('v.socket').voluntary();
            voluntarySocket = true;
        },60*1000);
}
_restartVoluntary();
function add(){
    //没有选中提示框,则是发送输入框内的文字
    var strInput= $.trim($("#text-in").val());

    //在输入框回车时会发送消息,当已经选中了提示框中的一个问题时,优先发送问题的id方式.
    if($("#sugguestions").is(":visible") == true){
        var sugs = $("#sugguestions .hover");
//    if(sugs.length == 1 && $.trim(sugs.find("a").text()) == strInput){          //已选中了一条
        if(sugs.length == 1 ){          //已选中了一条
            sugs.find("a").trigger("click");
            return ;
        }
    }

    if(strInput.length>100) {
        var $tips = $(".input-tips")
        if(!($($tips).is(":animated"))){
            $($tips).animate({"top":"-28px"},120).animate({"top":"-25px"},120)
                .animate({"top":"-28px"},100).animate({"top":"-25px"},100)
        }
        return;
    }
    if(oldQuestion == defaultInput){
        $("#text-in").val(strInput.replaceAll(defaultInput, ""));
    }
    var tempStrInput = strInput.replace(/<.*?>/g, "");
    tempStrInput = replaceSpecialChart(tempStrInput);
    if(tempStrInput.length!=0&&tempStrInput!=defaultInput){
        oldQuestion = "";
        showMes("我", tempStrInput);
        sendRequest(tempStrInput, 0);
    }else{
        $("#text-in").focus();
    }
    $("#sugguestions").hide();
    _restartVoluntary();
    voluntarySocket = true;
}

//发送点击的问题 - 2013-5-24 edited by wanglin cdwanglin1@jd.com
//将显示给用户的信息和发送给服务器的信息进行分离
//showMsg-显示信息， sendMsg-发送信息
//commandNo-命令名, sceneNo-场景名
//faqShowSequence 点击问题的显示顺序
//为了避免函数耦合太大，这里临时定义附加参数，再下一次sendRequest时使用
var affixParam = null;
function sendClick(type, id, showMsg, commandNo, sceneNo,faqShowSequence, ele,feedbackFAQItem, callBack,answer) {

    var $this = $(ele);
    var cateId = $this.data("cateid");
    var classifyName = $this.data("classifyname");
    var modelName=$this.data("modelname");
    var originquestion=$this.parent().data("requesttext");//带多套问题时，向后端传原始问题
    if(cateId || classifyName) {
        var affixQuestions = {};
        var $questions = $this.parent().find(".common-question-bg");
        affixQuestions.index = faqShowSequence - 1;
        var $parent = $this.parent();
        affixQuestions.classifyName = $parent.data("classifyname");
        affixQuestions.question = originquestion;
        affixQuestions.list = [];
        _.each($questions, function(dom) {
            var $dom = $(dom);
//      affixQuestions.list.push({question: $dom.html(), cateId:$dom.data("cateid"), classifyName: $dom.data("classifyname"),modelName:$dom.data("modelname")});
            affixQuestions.list.push({question: $dom.html(), cateId:$dom.data("cateid"), classifyName: $dom.data("classifyname"),modelName:$dom.data("modelname")});
        });
        affixParam = {affixQuestions: msJSON.stringify(affixQuestions)};
    }


    $("#sugguestions").hide();
    $("#text-in").focus();
    $("#text-in").val('');
    var temp = showMsg;
    temp = temp.replaceAll("&lt;", "<");
    temp = temp.replaceAll("&gt;", ">");
    temp = temp.replaceAll("&quot;", "\"");
    temp = temp.replaceAll("&qpos;", "\'");
    temp = temp.replaceAll("&nbsp;", " ");
    oldQuestion = "";
    showMes("我", temp);
    //点击埋点
    if(callBack){
        var content={
            "session_id":package('v.login').sessionId || "",
            "query_click_flag": "1",
            "faq_info":showMsg || "",
            "faq_time":(new Date()).format("yyyy-MM-dd hh:mm:ss"),
            "user_query":window.inputString  || "",
            "create_time":(new Date()).format("yyyy-MM-dd hh:mm:ss")
        };
        $.ajax({
            type: "get",
            url: "//chat-dc.jd.com/sendMsg/send.html?typeCode=JimiSearchStaticMessage&content="+JSON.stringify(content),
            success: {
            }
        });
    }
    if(answer){
        affixParam = null;
        //显示答案
        showMes("JIMI", answer);
        //埋点
        var content={
            "click_ques":temp,
            "answer": answer,
            "sessionid":package('v.login').sessionId || "",
            "messageid":window.messageid || ""
        };
        $.ajax({
            type: "get",
            url: "//chat-dc.jd.com/sendMsg/send.html?typeCode=jimi_faq_feedback&content="+JSON.stringify(content),
            success: {
            }
        });
        return ;
    }

    
    //对没有commandNo的进行特殊处理
    if(!commandNo) {
        var askContent = faqShowSequence + "、" + showMsg + "&&&id=" + id;
        sendRequest(showMsg, type, askContent, commandNo,'','','','',feedbackFAQItem);
        return ;
    }

    if(type && faqShowSequence){
        showMsg = faqShowSequence+"、"+showMsg;
    }
    if(sceneNo){
        sendRequest(id, type, showMsg, commandNo,sceneNo,'','','',feedbackFAQItem);
    }else{
        sendRequest(id, type, showMsg, commandNo,'','','','',feedbackFAQItem);
    };



}
function sendData(groupid,sid,question,answer,a){         //点击预判问题埋点
    $(a).addClass('pchecked');
    var postData={
        groupId:groupid,
        sid:sid
    }
    if(answer!=0){
        postData.answer=answer;
    }
    $.ajax({
        type:"post",
        url:"/preFaq/click.action",
        data:postData,
        success:{

        }
    })
    var temp = question;
    var temp1;
    if(answer!=0){
        var temp1 = answer;
        temp1 = temp1.replaceAll("&lt;", "<");
        temp1 = temp1.replaceAll("&gt;", ">");
        temp1 = temp1.replaceAll("&quot;", "\"");
        temp1 = temp1.replaceAll("&qpos;", "\'");
        temp1 = temp1.replaceAll("&nbsp;", " ");
    }
    temp = temp.replaceAll("&lt;", "<");
    temp = temp.replaceAll("&gt;", ">");
    temp = temp.replaceAll("&quot;", "\"");
    temp = temp.replaceAll("&qpos;", "\'");
    temp = temp.replaceAll("&nbsp;", " ");
    oldQuestion = "";
    showMes("我", temp);
    if(answer!=0){
        setTimeout(function(){showMes("JIMI",temp1);},500);
    }else{
        sendRequest(question,0);
    }
}

//JIMI 反馈答案开始
/**
 * requestText 用户问题, 可能会是一个faqId
 * render      问题是否来自提示框(1), 还是用户输入(0),或者是第一句welcome(2)
 * askContent  当问题来自提示框时, askContent保留问题内容
 * askFrom     问题来源(用户输入, faq提示框, aiml关联推荐, faq推荐, 右侧快捷服务)
 *
 * $replaceMsg 答案返回后被覆盖的消息dom
 */
function sendRequest(requestText, render, showMsg, commandNo, sceneNo,isCon, $replaceMsg, callback,feedbackFAQItem) {
    var text = requestText.toString();
    text = text.replaceAll("&lt;", "<");
    text = text.replaceAll("&gt;", ">");
    text = text.replaceAll("&quot;", "\"");
    text = text.replaceAll("&qpos;", "\'");
    text = text.replaceAll("&nbsp;", " ");
    text = text.replaceAll("&nbsp;", " ");
    text = text.replace(/<\/?.+?>/g, "");
    text = text.replaceAll("<", "&lt;");
    text = text.replaceAll(">", "&gt;");
    var promotionId = $("#promotionId").val();
    var urlParamObj = parseURLParam();
    var testAddress = urlParamObj.testAddress;

    switch(render){
        case 0:{
            var postData = {
                'requestText' : text,
                'askContent':showMsg,
                'commandNo':commandNo,
                'sceneNo':sceneNo,
                'correctUse':isCon,
                'promotionId':promotionId,
                'productId': (productId==undefined)?'':productId,
                'testAddress': testAddress,
                'pagetype':window.pagetype || '',//增加page和pagevalue参数
                'pagevalue':window.pagevalue || '',
                'terminal':window.terminal || '',
                'venderId':window.venderId || '',
                'orderId':window.orderId|| '',
                'c3':window.c3|| '',
                'feedbackFAQItem':feedbackFAQItem,
                'variables':window.variables
            };
            if(Form.formData){
                postData.form = Form.formData;
            }
            if(source1){
                postData.source=source1;
            }else{
                postData.source=jimiSource||"";
            }
            if(affixParam) {
                _.extend(postData, affixParam);
                affixParam = null;
            }
            $.ajax({
                type : "post",
                url : '/ask/ask.action?t=' + new Date().getTime(),
                data : postData,
                success : function(ret){
                    var package = window.package || (function(){throw new Error('the function package is not undefined')})();
                    // 格式化返回的数据
                    var res=JSON.parse(ret.data);
                    res.answers.type=false;
                    window.messageid = ret.msgid;
                    var tid,version;
                    // 判断res对象中是否存在tid
                    if(res.hasOwnProperty('tid')){
                        tid = res.tid;
                    }
                    // 判断是否存在chatinfo以及chatinfo.version
                    if(res.hasOwnProperty('chatinfo') && res.chatinfo.hasOwnProperty('version')){
                        version = res.chatinfo.version;
                    }
                    if(typeof res.data === 'string'){
                        res = JSON.parse(res.data);
                    }
                    // 判断Answer是否为JSON字符串
                    if(/^\{.*\}$/.test(res.answers.answer)){
                        var tempAnswer = JSON.parse(res.answers.answer);
                        res.answers.answer = tempAnswer;
                    }
                    if(!res.answers.hasOwnProperty('ext_property')){
                        res.answers.ext_property = {};
                    }
                    if(tid){
                        res.answers.ext_property.tid = tid;
                    }
                    if(version){
                        res.answers.ext_property.version = version;
                    }
                    res.answers.requestText=text;  //为answer字段添加同级的字段

                    // 判断ext_property字段是否存在，若存在，取出作为单独的变量，方便后续的操作
                    var ext_property = typeof res.answers.ext_property !== 'undefined' ? res.answers.ext_property : {};
                    if(ext_property.inviteFlag){
                        isShowSatisfyModal = true;
                    }


                    //简版web页用户反馈添加标识
                    if(ext_property.feedbackType && ext_property.feedbackType=="openFaq-feedback"){
                        res.answers.type=true;
                        package("v.componentAnswer").callbackSuccess2(res, $replaceMsg);
                        return;
                    }
                    if(ext_property.add_post_answer!=undefined){
                        res.answers.extra=ext_property.add_post_answer;
                    }

                    if(window.entry!=undefined&&window.chatId!=undefined){
                        if(res.answers.answer_note==21){ //答案中有转人工链接
                            res.answers.answer=res.answers.answer.replace(/(\?entry=[^\"]*)/,'?entry='+window.entry+'&chatId='+window.chatId);
                        }else if(res.answers.answer_note==12){ //答案中有链接
                            if(/.*chat.*jd\.com.*/.test(res.answers.answer)){//答案链接中带chat.jd.com
                                res.answers.answer=res.answers.answer.replace(/(\?entry=[^\"]*)/,'?entry='+window.entry+'&chatId='+window.chatId);
                            }
                        }
                    }
                    package("v.componentAnswer").callbackSuccess2(res, $replaceMsg);
//                    if(res.answers.hasOwnProperty('ext_property')){
//                        var backtype = res.answers.ext_property.showUPType;
//                        if (backtype && backtype == 1) {
//                            $("#chatcontent").append('<div class="chat-tips"><div class="chat-msg">' +
//                                '<p class="cont">可以点击输入框菜单选择订单/商品咨询哦~</p>'+
//                                '<div class="mask"> <span class="tl"></span> <span class="tr"></span>'+
//                                '<span class="bl"></span><span class="br"></span> </div> </div></div>');
//                            setScroll();
//                        }
//                    }
                },
                error : errorAlert,
                dataType : "JSON"
            });
            break;
        }
        case 1:{
            var postData = {
                'id' : text,
                'askContent':showMsg,
                'commandNo':commandNo,
                'source':jimiSource || '',
                'productId': (productId==undefined)?'':productId
            };
            if(commandNo == "commandForSearchByFaqId") { //记录输入的input和所有答案
                _.extend(postData, {
                    "input": $("#sugguestions").data("input"),
                    "data": msJSON.stringify($("#sugguestions").data("data"))
                });
            }
            if(sceneNo)  postData.sceneNo = sceneNo;
            $.ajax({
                type : "post",
                url : '/faqAsk/getFaqAnswerByFaqId.action?t=' + new Date().getTime(),
                data : postData,
                success : function(ret){
                    var res=JSON.parse(ret.data);
                    package("v.componentAnswer").callbackSuccess2(res, $replaceMsg);
                },
                error : errorAlert,
                dataType : "JSON"
            });
            break;
        }
        case 2:{
            var urlParamObj = parseURLParam();
            var testAddress = urlParamObj.testAddress;
            $.ajax({
                type : "post",
                url : '/ask/welcome.action?t=' + new Date().getTime(),
                success : function(ret){
                    ret.resultTypebak = ret.resultType;
                    ret.requestText = text;
                    ret.askContent = showMsg;
                    ret.commandNo = sceneNo;
                    ret.sceneNo = sceneNo;
                    ret.source = jimiSource || '';
                    ret.refreshContent = ret.switchWare = false;
                },
                data:{
                    'productId': (productId==undefined)?'':productId,
                    'cateId': (cateId==undefined)?'':cateId,
                    'source':jimiSource || '' ,
                    'commandNo':'greetingCommand',
                    'testAddress':testAddress
                },
                error : errorAlert,
                dataType : "JSON"
            });
            //20151229增加数据统计接口
            $.ajax({
                type: "post",
                url: '/dataStatistic/initDataStatistic.action?t=' + new Date().getTime(),
                dataType : "JSON",
                data:{
                    'productId': (productId==undefined)?'':productId,
                    'source':jimiSource || ''
                },
                success: function (ret) {
                }
            });
            break;
        }
        case 3:{    //根据source展示不同的开头语
            var ele = $("#chatcontent");
            $.ajax({
                type : "post",
                url : '/welcome/openSentence.action' ,
                success : function(data){
                    if(data.code == 1){
                        var ret  = JSON.parse(data.data);
                        // 展示开头语
                        if(ret.answers.open_content){
                            var openRet = {};
                            openRet.ptype = "p_plain_text_answer";
                            openRet.answers = {};
                            openRet.answers.answer = JSON.parse(ret.answers.open_content).content;
                            var openAnswer = AnswerFactory.createAnswer(openRet);
                            openAnswer.show(ele, true, true);
                        }
                        // 存在问题卡片则展示
                        if(ret.answers.answer){
                            // 有问题预判，预判格式需要转换
                            if(ret.answers.answer.questiontip){
                                ret.answers.answer.questiontip = JSON.parse(ret.answers.answer.questiontip);
                                ret.answers.ext_property.type = 1;
                            }else{
                                ret.answers.ext_property.type = 0;
                            }
                            var answer = AnswerFactory.createAnswer(ret);
                            answer.show(ele, true, true);
                            //问题卡片埋点
                            cardPoint(ret.answers.ext_property);
                        }
                    }
                },
                data:{
                    'source':jimiSource || '',
                    'productId':productId || ''
                },
                error : errorAlert,
                dataType : "JSON"
            });
        }
    }
    function errorAlert() {
        $("#text-in").focus();
    }
    if(source1){
        window.jimiSource=source1;
    }
}
function callbackSuccess(data, $replaceMsg) { //新答案格式修改

    if(data.ptype=='p_component_answer'){//组件答案需要单独处理，不走原来的答案组件
        handleCompAnswer(data);
        return ;
    }
    var answer;
    var ele = $("#chatcontent");
    answer = AnswerFactory.createAnswer(data.ptype, data.answers);
    // answer = new AnswerFactory1.createAnswer(data.ptype, data.answers);
    //如果传入了替换Msg的ele，则
    if($replaceMsg) {
        $replaceMsg.removeClass().html("");
    }
    //如果传入了callback，在这里执行
    callback && callback(data.answer);
    answer.show($replaceMsg || ele, true, true);
    setScroll();
}

function handleCompAnswer(data){
    var result1=data.answers.answer;
    var result2=JSON.parse(result1);
    var result3= result2.dataMap;
    var tmpl=result2.html;
    $.template('template', unescape(tmpl));
    var html = $('<div></div>').append($.tmpl('template', result3)).html();
    showMes("JIMI",html);
}
//用户预判方法
function preFaq(result){
    var ele = $("#chatcontent");
    var answer;
    $.ajax({
        type:"GET",
        url: '/preFaq/get.action',
        dataType : "JSON",
        data:{
            'productId': (productId==undefined)?'':productId,
            'source':window.jimiSource||'',
            'orderId':window.orderId|| '',
            'c3':window.c3|| ''
        },
        success:function(data){
            if(data.success && (data.questions && data.questions.length>0))
            {
                _.extend(data,{"initword":result.answer});
                answer = AnswerFactory.createAnswer('preFaq', data);
                answer.show(ele, true, true);
            }else{ //不存在问题预判，不影响开头语展示
                _.extend(data,{"initword":result.answer});
                answer = AnswerFactory.createAnswer('preFaq', data);
                answer.show(ele, true, true);
            }
        },
        error:function(){//不存在问题预判，不影响开头语展示
            var empty={};
            _.extend(empty,{"initword":result.answer});
            answer = AnswerFactory.createAnswer('preFaq', empty);
            answer.show(ele, true, true);
        }

    })
}
//快捷入口
(function fastEntry(){
    var $ele = $("#chatcontent").parent('.nano');
    var answer;
    $.ajax({
        type:"GET",
        url: '/welcome/getShortcutConfig.action',
        dataType : "JSON",
        data:{
            'source':window.jimiSource||''
        },
        success:function(req){
            if(req && req.code == 1 && req.data ){
               var param = {};
               param.ptype = "p_fast_entry";
               param.answers = {};
               param.answers.answer = req.data;
               answer = AnswerFactory.createAnswer(param);
               answer.show($ele, true, false);
               // 快捷入口展示与隐藏
               $ele.on('click','#f-e-btn',function(){
                   var $this = $(this);
                   if($this.hasClass('on')){
                       $this.removeClass('on');
                       $this.siblings('.f-e-lis').hide();
                   }else{
                       $this.addClass('on');
                       $this.siblings('.f-e-lis').show();
                   }
               });
               fastEntryPoint(req);
           }
        }
    });
}());

// 图片式埋点
function triggerLandImg(para,url){
    var pointUrl = url || '//chat-dc.jd.com/sendMsg/send.html';
    var img = new Image();
    var src = pointUrl + '?typeCode=' + para.typeCode + '&content=' + para.content;
    img.src = src;
    img.style.display = 'none';
    document.body.appendChild(img);
}
// 跨域式埋点
function triggerLandfill(para,url) {
    var pointUrl = url || '//chat-dc.jd.com/sendMsg/send.html';
    var src = pointUrl + '?typeCode=' + para.typeCode + '&content=' + para.content;
    $.ajax({
        url : src,
        dataType : 'jsonp'
    },function() {});
}
// 问题卡片埋点
function cardPoint(data) {
    var data = data || {};
    $(".f-card").off().on("click", '.c-link', function () {
        var $q = $(this);
        var parLst = $q.parents('.f-card');
        var param = {};
        var c_content = '';
        param.event_time = new Date().getTime();
        param.event_type = 1;
        // component_type  0/banner 1/问题
        param.component_type = $q.attr('data-type');
        param.component_id = $q.attr('data-id');
        param.component_location = $q.attr('data-position');
        param.card_id = parLst.attr('data-id');
        if (param.component_type == 0) {
            c_content = $q.find('img').attr('src');
        } else {
            c_content = $q.text();
        }
        param.component_content = c_content;

        param.card_type = data.type;
        param.cid = data.sessionId;
        param.user_pin = data.pin;
        param.uuid = data.opensentenceUUID;
        param.source = window.jimiSource;
        param.version = 'jimi-web';

        var dataPara = {
            typeCode: 'jimi_dc_wrkf_2_log_question_cards',
            content: JSON.stringify(param)
        };
        triggerLandImg(dataPara);
    });
}
// 快捷入口埋点
function fastEntryPoint(data) {
    var data = data || {};
    $(".fast-entry").off().on("click", '.f-link-a', function () {
        var $q = $(this);
        var param = {};
        param.event_time = new Date().getTime();
        param.event_type = 1;
        param.entry_type = $q.attr('data-type');
        param.entry_content = $q.text();
        param.location = $q.attr('data-position');

        param.source = window.jimiSource;
        param.version = 'jimi-web';
        param.cid = data.sessionId;
        param.user_pin = data.pin;
        var dataPara = {
            typeCode: 'jimi_dc_wrkf_2_log_quick_entry',
            content: JSON.stringify(param)
        };
        triggerLandImg(dataPara);
    });
}
// 开头语埋点


















/**
 * Created by cdxuxu on 2016/6/3.
 */
package("v.componentAnswer", [], function (require, exports, moudle) {
    (function($){
        /**
         * jimi充值功能
         */
        function chongzhi(){
            $('#chatcontent').on("click",'a.paybtn',function(){
                var List=$('.phoneBillData');
                var data ={};
                $.each(List,function(i,item){
                    var key='parmap.'+item.name;
                    data[key]=item.value;
                })
                var newWindow = window.open();
                $.ajax({
                    type: "get",
                    url: '/event/handleEvent.action?t=' + new Date().getTime(),
                    dataType : "JSON",
                    data:data,
                    success: function (res) {
                        if(res.code==1){
                            var ob=JSON.parse(res.data)
                            if(ob.answers.answer.status==1){
                                //打开一个不被拦截的新窗口

//                $('.content').after('<form id="payform" method="post" target="_blank" action="'+ob.answers.answer.url+'" style="display:none;"></form>');
//                $('#payform').submit();
                                //修改新窗口的url
                                newWindow.location.href = ob.answers.answer.url;
                            }else{
                                showMes('JIMI',ob.answers.answer.message);
                            }
                        }
                    },
                    error:function(){
                        showMes('JIMI',"充值失败，请稍后再试。");
                    }
                })
            })
        }
        chongzhi();

        //获取字符长度
        function  getStringLen(Str){
            var  i,len,code;
            if(Str==null || Str == "")
                return 0;
            len =  Str.length;
            for(i=0;i<Str.length;i++)
            {
                code = Str.charCodeAt(i);
                if(code > 255)
                {len ++;}
            }
            return len;
        }

        //信息确认
        function confirmMess(){
            var strongnameok=false,strongphonenumok=false;
            $('#chatcontent').on('click','.assure .editicon',function(){
                if($(this).hasClass('dis')){
                    return;
                }
                $(this).parent().find('.label').hide();
                $(this).parent().find('.editicon').hide();
                $(this).parent().find('.message').show();
                var hidevalue=$(this).parent().find('strong').text();
                $(this).parent().find('.message').val(hidevalue);

            })

            $('#chatcontent').on('keyup keydown keypress blur','input[name="username"]',function() {
                var val=getStringLen($(this).val());
                var $submit=$(this).parents('.assure').find('.submit');
                if (val > 16) {
                    if($(this).siblings('.errortip').length==0){
                        $(this).after('<span class="errortip">姓名不超过8个字</span>');
                        $submit.removeClass("active");
                    }
                }else{
                    $(this).siblings('.errortip').remove();
                    $(this).parents('.assure').find('.assure').addClass("active");
                    if(val==0){
                        if($(this).siblings('.errortip').length==0){
                            $(this).after('<span class="errortip">姓名不能为空</span>');
                        }
                        $submit.removeClass("active");
                    }else{
                        $(this).siblings('.errortip').remove();
                        $submit.addClass("active");
                    }
                }

            })
            $('#chatcontent').on('blur','input[name="phonenum"]',function(){
                var $submit=$(this).parents('.assure').find('.submit');
//        var mobile = /^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/;
                var mobile =/(^1[3|5|8|7][0-9]\d{8}$)|(^0\d{2}[-_－—]?\d{8}$)|(^0\d{3}[-_－—]?\d{7}$)/;
                if(!mobile.test($(this).val())){
                    if($(this).siblings('.errortip').length==0){
                        $(this).after('<span class="errortip">请输入正确的电话号码</span>');
                        $submit.removeClass("active");

                    }
                }else{
                    $(this).siblings('.errortip').remove();
                    $submit.addClass("active");

                }

            });
            // $('#chatcontent').on('click','.assure .submit',function(){ //确认按钮
            $('#chatcontent').on('click','.assure .submit',function(){ //确认按钮

                if(!$(this).hasClass('active')){
                    return;
                }
                var data={}, widgets=[];
                var availableArray=$(this).parents('.assure').find('[wrStatus="w"]');
                $.each(availableArray,function(i,item){
                    var reg=/^widget_/;
                    if(!reg.test($(item).attr("code"))){
                        var key="form."+$(item).attr("code");
                        data[key]=item.value;
                    }else{
                        var tmpobject={};
                        var tmpvalues=[];
                        tmpobject.widgetCode=$(item).attr("code");
                        if($(item).val()==""){
                            if($(item).siblings().find('input[name=iswrap]:checked').length>0){
                                tmpvalues.push($(item).siblings().find('input[name=iswrap]:checked').val());
                            }else{
                                var value1=$(item).siblings('strong').text();
                                if($(item).is('input[name="username"]')){
                                    if(value1!=""){
                                        strongnameok=true;
                                        $(item).siblings('.editicon').css("visibility","hidden");

                                    }else{
                                        strongnameok=false;
                                        if($(item).siblings('.errortip').length==0){
                                            $(item).siblings('.editicon').after('<span class="errortip">姓名不能为空</span>');
                                            $(item).parents('.assure').find('.submit').removeClass("active");
                                        }
                                    }
                                }
                                if($(item).is('input[name="phonenum"]')){
                                    if(value1!=""){
                                        strongphonenumok=true;
                                        $(item).siblings('.editicon').css("visibility","hidden");
                                    }else{
                                        if($(item).siblings('.errortip').length==0){
                                            $(item).siblings('.editicon').after('<span class="errortip">请输入正确的电话号码</span>');
                                            $(item).parents('.assure').find('.submit').removeClass("active");
                                        }
                                        strongphonenumok=false;
                                    }
                                }
                                tmpvalues.push(value1);
                            }
                        }else{
                            tmpvalues.push($(item).val());
                        }
                        tmpobject.value=tmpvalues;
                        widgets.push(tmpobject);
                    }
                });

                $.each(widgets,function(i,item){
                    var key1='form.widgets['+i+'].widgetCode';
                    data[key1]=item.widgetCode;
                    $.each(item.value,function(k,a){
                        var key2='form.widgets['+i+'].value['+k+']';
                        data[key2]=a;
                    })
                });
                _.extend(data,{
                    requestText:"form submit",
                    source: window.jimiSource
                });
                var $input=$(this).parents('.assure').find('.label');

                var inputname=$input.siblings('input[name=username]').val();
                var inputnum=$input.siblings('input[name=phonenum]').val();
                var $p=$(this).parents('.assure');

                if(inputname!=""){
                    $input.show();
                    $p.find('input[name=username]').siblings('.label').text(inputname);
                    $p.find('.message').hide();
                }
                if(inputnum!=""){
                    $input.show();
                    $p.find('input[name=phonenum]').siblings('.label').text(inputnum);
                    $p.find('.message').hide();
                }

                var flag1=strongnameok&&strongphonenumok;

                var flag2;
                if($(this).parents('.assure').find('.errortip').length==0){
                    flag2=true;
                }else{
                    flag2=false;
                }

                if(flag1||flag2){
                    sendAsk(data);
                    $(this).removeClass("active");
                }else{
                    if($(this).siblings('.errortip').length==0){
                        $(this).before('<span class="errortip">信息不符合规范！</span>');
                    }
                    var self=$(this);
                    setTimeout(function(){
                        self.siblings('.errortip').remove();
                    },2000);
                }
            })
        }
        confirmMess();

        //选择订单
        var compproductId;
        function chooseOrder(){

            $('#chatcontent').on('click','.orderlist .morecheckbox input:checkbox',function(){ //多个商品多选框
                if($(this).prop("checked")){
                    compproductId=$(this).parents('.morecheckbox').find('.ordersku').text();
                    activeBtn($(this))
                    resetBtn($(this));
                    resetCheckbox($(this));
                }else{
                    disableBtn($(this));
                }
            })

            $('#chatcontent').on('click','.orderlist .singlecheckbox input:checkbox',function(){  //单个商品多选框
                if($(this).prop("checked")){
                    compproductId=$(this).parents('.singlecheckbox').find('.ordersku').text();
                    activeBtn($(this))
                    resetBtn($(this));
                    resetCheckbox($(this));
                }else{
                    disableBtn($(this));
                }
            })
            
            $('#chatcontent').on('click', '.richMedia-list a', function() {
                var item = $(this);
                var interaction = item.closest('.richMedia');
                var json = {
                    className : '',
                    modelName : '',
                    sceneUuid : '',
                    category : interaction.attr('data-category'),
                    propertyId : interaction.attr('data-propertyid'),
                    propertyName : interaction.attr('data-propertyname'),
                    valueId : item.attr('data-valueid'),
                    valueName : item.attr('data-valuename')
                }

                var para = {
                    source : window.jimiSource,
                    requestText : item.attr('data-valuename'),
                    clickselect : JSON.stringify(json)
                };
                showMes('我', item.attr('data-valuename'))
                sendAsk(para);
            });

            $('#chatcontent').on('click', '[link_question]', function() {
                var item = $(this);

                var question = item.attr('link_question');
                var askBackSubmitType = item.attr('askBackSubmitType');
                if(!question)  return false;

                var para = {
                    source : window.jimiSource,
                    requestText : question
                };

                if(typeof askBackSubmitType != 'undefined') {
                    para.askBackSubmitType = askBackSubmitType;
                }

                showMes('我', question);
                sendAsk(para);
                return false;
            })

            !function(){
                var pageNum = 2;

                function showNext(btn){
                    var form = btn.closest('.jimi_lists');
                    if(typeof form.data('pageIndex') == 'undefined'){
                        form.data('pageIndex',1);
                    }
                    var pageIndex = form.data('pageIndex');
                    pageIndex ++;
                    form.find('.moreprolist:lt(' + pageNum * pageIndex + ')').removeClass("noshow");
                    scrollTo(form.find('.moreprolist').eq(Math.min(form.find('.moreprolist').length - 1,pageNum*(pageIndex - 1))),form);
                    if(form.find('.moreprolist:hidden').length===0){
                        btn.hide();
                        btn.parent('.btnarea').siblings('.goodtip').show();
                        form.data('pageIndex',1); //重新初始化
                    }else{
                        form.data('pageIndex',pageIndex);
                    }

                }

                $('#chatcontent').on("click",'.orderlist .morebtn',function(){ //查看更多
                    showNext($(this));
                })
            }();

            $('#chatcontent').on('click','.orderlistform .submit',function(){ //提交按钮点击
                if(!$(this).hasClass("active")){
                    return;
                }
                var data={};
                var widgets=[];
                data.form = {};
                var necessaryArray=$(this).parents('.orderlistform').find('[wrStatus="w"]');//必须传的的值
                $.each(necessaryArray,function(i,item){
                    var reg=/^widget_/;
                    if(!reg.test($(item).attr("code"))){
                        data.form[$(item).attr("code")] = item.value;
                    }
                })
                var $checked=$(this).parents('.orderlist').find('input:checkbox:checked');
                if($checked.length==1){ //单个商品订单或者多个商品选择1个
                    var availableArray=$checked.parents('.orderinfo').siblings('.title').find('[wrStatus="w"]');//取被选中元素的orderid
                    if(availableArray.length>0){

                        var tmpwidgets=[];
                        var tmpobject1={};
                        var tmpvalues1={};
                        // 选择orderId 或者 repairId
                        $.each(availableArray,function(k,a){//取多选框的orderid
                            var code = $(a).attr("code");
                            if(typeof tmpobject1[code] === 'undefined') {
                                tmpobject1[code] = {}
                            }
                            tmpobject1[code].widgetCode = $(a).attr("code");
                            if(typeof tmpvalues1[code] === 'undefined') {
                                tmpvalues1[code] = [];
                            }
                            var tempOrderId = $(a).attr("orderid");
                            if(typeof tempOrderId !== 'undefined'){
                                tmpvalues1[code].push(tempOrderId);
                            }
                            tmpobject1[code].value = tmpvalues1[code];

                            // tmpobject1.widgetCode=$(a).attr("code");
                            // var tempOrderId = $(a).attr("orderid");
                            // if(typeof tempOrderId !== 'undefined'){
                            //     tmpvalues1.push(tempOrderId);
                            // }
                            // tmpobject1.value=tmpvalues1;
                        });
                        var availableArray1=$checked.closest('li').find('[wrStatus="w"]');
                        $.each(availableArray1,function(i,item){
                            var tmpobject={};
                            var tmpvalues=[];

                            tmpobject.widgetCode=$(item).attr("code");
                            var values=$(item).text() || $(item).attr("orderid");
                            tmpvalues.push(values);
                            tmpobject.value=tmpvalues;
                            tmpwidgets.push(tmpobject);
                        });
                        for(var code in tmpobject1) {
                            tmpwidgets.push(tmpobject1[code]);
                        }
                        // tmpwidgets.push(tmpobject1);
                        widgets=handledata(tmpwidgets);
                    }
                }else{   //多个商品选择多个
                    var tmpwidgets=[];
                    var tmpobject1={};
                    var tmpvalues1=[];
                    $.each($checked,function(i,item){
                        if(i==0){
                            var availableArray22=$(item).parents('.orderinfo').siblings('.title').find('[wrStatus="w"]');//orderid所在位置
                            if(availableArray22.length>0){
                                $.each(availableArray22,function(k,a){//取多选框的orderid
                                    tmpobject1.widgetCode=$(a).attr("code");
                                    tmpvalues1.push($(a).attr("orderid"));
                                    tmpobject1.value=tmpvalues1;
                                })
                            }
                        }
                        var availableArray33=$(item).closest('li').find('[wrStatus="w"]');
                        $.each(availableArray33,function(i,item){
                            var tmpobject={};
                            var tmpvalues=[];
                            tmpobject.widgetCode=$(item).attr("code");
                            var values=$(item).text() || $(item).attr("orderid");
                            tmpvalues.push(values);
                            tmpobject.value=tmpvalues;
                            tmpwidgets.push(tmpobject);
                        })

                    })
                    tmpwidgets.push(tmpobject1);
                    widgets=handledata(tmpwidgets);
                }
                data.form.widgets = widgets;
                data.form = JSON.stringify(data.form);
                _.extend(data,{
                    requestText:"form submit",
                    source: window.jimiSource
                });
                sendAsk(data);


            })
            /*
             重选订单复原，其中footer1、oper1、noshow1、single1这四个class为了不改变原来的结构而添加的
             */
            $('#chatcontent').on('click','.orderlistform .rechoose',function(){   //点重选按钮
                if($(this).hasClass('dis')){
                    return;
                }
                var $checked=$(this).parents('.orderlistform').find('input:checkbox');
                var $parents=$checked.parents('.moreprolist');
                $checked.parents('.moreprolist').siblings('.moreprolist').removeClass('noshow1');

                var $par=$(this).parents('.orderlistform');

                $par.find('.moreprolist:gt(1)').removeClass('noshow').addClass('noshow');
                $par.find('.morebtn').show();
                $par.find('.goodtip').hide();

                $checked.parents('.orderlistform').find('.rtitle').text("请选择您遇到问题的订单及商品：");


                $parents.find('.footer').show();
                $parents.find('.footer1').remove();
                var $li=$parents.find('.orderinfo >li');
                $li.not($li.has('input:checkbox:checked')).show();
                $parents.find('.mycheckbox').show();
                $.each($checked,function(i,item){
                    $(item).attr("checked",false);
                })
                $parents.find('.p-img').removeClass('single1');

                $parents.siblings('.btnarea').show();
                $parents.find('.oper').show();
                $parents.find('.oper1').remove();
                $checked.attr("checked",false);
            })
            /* $('.moreproview .picList li').die().live('click',function(){   //视图列表
             if($(this).hasClass('on')){
             $(this).removeClass('on');
             }else{
             $(this).addClass('on');
             if($(this).parents('.moreproview').find('input:radio').attr("checked")!='checked'){
             $(this).parents('.moreproview').find('input:radio').attr("checked",true);
             }
             }
             var obj=$(this).closest('.orderlist').find('.submit');
             activeBtn(obj);
             checkRadio();
             })*/
        }
        chooseOrder();

        function handledata(obj){
            var json = {};
            $.each(obj,function(i,n){
                if(!!json[n.widgetCode]){
                    json[n.widgetCode].push(n.value);
                }
                else{
                    json[n.widgetCode] = [n.value];
                }
            });
            var result = [];
            var result1=[];

            for(var a in json){
                var temp = {};
                temp.widgetCode = a;
                temp.values = json[a];
                result.push(temp);
            }

            $.each(result,function(i,item){
                var tmp={};
                tmp.widgetCode=item.widgetCode;
                var tmpvalues=[];
                $.each(item.values,function(k,a){
                    for(var j=0;j <a.length;j++){
                        tmpvalues.push(a[j]);
                    }
                })
                tmp.value=tmpvalues;
                result1.push(tmp);
            })
            return result1;
        }


        function resetBtn(obj){ //多个表单存在时，当前操作的表单的的按钮才处于活动状态
            var curr=obj;
            var otherForm=curr.parents('.jimi_lists ').siblings('.jimi_lists ').find('.orderlist .submit');
            if(otherForm.length>0){
                $.each(otherForm,function(i,item){
                    $(item).removeClass("active");
                });
            }
        }

        function resetCheckbox(obj){  //当前操作单个商品多选框
            var curr=obj;
            var otherForm=curr.parents('.jimi_lists ').siblings('.jimi_lists ').find('.orderlist input:checkbox');//其他表单
            if(otherForm.length>0){
                $.each(otherForm,function(i,item){
                    $(item).attr("checked",false);
                });
            }
            $checked=curr.parents('.moreprolist').siblings().find('input:checked'); //其他订单
            if($checked.length>0){
                $.each($checked,function(i,item){
                    $(item).prop("checked",false);
                })
            }
        }

        function activeBtn(obj){  //激活提交按钮
            var curr=obj;
            var currbtn=curr.parents('.orderlist').find('.submit');
            if(!currbtn.hasClass('active')&&!currbtn.hasClass('noactive')){
                currbtn.addClass('active');
            }
        }
        function disableBtn(obj){
            var curr=obj;
            var more=curr.parents('.morecheckbox');
            var single=curr.parents('.singlecheckbox');
            if(single.length>0){  //当前操作的是只有一个商品的多选框
                var currbtn=curr.parents('.orderlist').find('.submit');
                currbtn.removeClass('active');
            }

            if(more.length>0){  //当前操作的是有多个商品的多选框
                var checked=curr.parents('.orderinfo').find('input:checkbox:checked');//所有选中的多选框
                if(checked.length==0){
                    var currbtn=curr.parents('.orderlist').find('.submit');
                    currbtn.removeClass('active');
                }
            }

        }


        function sendAsk(postdata, callback){  //组件按钮触发ask.action请求
            $.ajax({"type":"post",
                "url":"/ask/ask.action?t="+ new Date().getTime(),
                data:postdata,
                success:function(ret){
                    var res=JSON.parse(ret.data);
                    var tid, version;
                    if(res.tid){
                        tid = res.tid;
                    }
                    if(typeof res.chatinfo === 'object' && res.chatinfo.version){
                        version = res.chatinfo.version;
                    }
                    if(typeof res.data === 'string' && /^\{.*\}$/.test(res.data)){
                        res = JSON.parse(res.data);
                    }
                    if(typeof res.answers === 'string' && /^\{.*\}$/.test(res.answers)){
                        res.answers = JSON.parse(res.answers);
                    }
                    if(typeof res.answers.answer === 'string' && /^\{.*\}$/.test(res.answers.answer)){
                        res.answers.answer = JSON.parse(res.answers.answer);
                    }
                    var $replaceMsg='';
                    var ext_property = typeof res.answers.ext_property !== 'undefined' ? res.answers.ext_property : {};
                    if(!res.answers.hasOwnProperty('ext_property')){
                        res.answers.ext_property = {};
                    }
                    if(tid){
                        res.answers.ext_property.tid = tid;
                    }
                    if(version){
                        res.answers.ext_property.version = version;
                    }
                    if(ext_property.inviteFlag){
                        isShowSatisfyModal = true;
                    }
                    if(/<a class="js-msg-to-manual"/.test(res.answers.answer)){
                        getProduct();
                    }
                    if(ext_property.add_post_answer!=undefined){
                        res.answers.extra=ext_property.add_post_answer;
                    }
                    if(window.entry!=undefined&&window.chatId!=undefined){
                        if(res.answers.answer_note==21){ //答案中有转人工链接
                            res.answers.answer=res.answers.answer.replace(/(\?entry=[^\"]*)/,'?entry='+window.entry+'&chatId='+window.chatId);
                        }else  if(res.answers.answer_note==12){ //答案中有链接
                            if(/.*chat.*jd\.com.*/.test(res.answers.answer)){//答案链接中带chat.jd.com
                                res.answers.answer=res.answers.answer.replace(/(\?entry=[^\"]*)/,'?entry='+window.entry+'&chatId='+window.chatId);
                            }
                        }
                    }
                    exports.callbackSuccess2(res, $replaceMsg, callback);
                },
                error:errorAlert,
                dataType : "JSON"
            });
            function errorAlert() {
                $("#text-in").focus();
            }

        }
        exports.sendAsk = sendAsk;

        exports.callbackSuccess2=function(data, $replaceMsg, callback){

            // Form.uuid = null;
                var ele = $("#chatcontent");
                $replaceMsg && $replaceMsg.removeClass().html("");
                AnswerFactory.createAnswer(data).show($replaceMsg || ele, true, true);
                setScroll();
                callback && callback(data);
            // var ext_property = typeof data.answers.ext_property !== 'undefined' ? data.answers.ext_property : {};
            // if(ext_property.tid) {
            //     AnswerFactory.createAnswer(data.ptype,data.answers).show();
            // }else{
            //     var ele = $("#chatcontent");
            //     $replaceMsg && $replaceMsg.removeClass().html("");
            //     AnswerFactory.createAnswer(data.ptype,data.answers).show($replaceMsg || ele, !0, !0);
            //     setScroll();
            // }

            // function tplAnswer(data,tid,version){
            //     var form = new Form(data,tid,version);
            //     form.getTemplate(function(html){
            //         if(Form.uuid && (typeof Form.histories[Form.uuid] != 'undefined')){
            //             var item = Form.histories[Form.uuid].item;
            //             replaceMsg(html,item);
            //             form.setItem(item);
            //         }
            //         else{
            //             showMes("JIMI", html)
            //             setScroll();
            //             form.setItem($('#chatcontent .jimi_lists:last'));
            //         }
            //
            //     });
            // }
            /*if(data.ptype == 'p_component_answer'){

                var nData,tid,version;
                tid = data.answers.ext_property.tid;
                version = data.answers.ext_property.version;
                nData =$.parseJSON(data.answers.answer);
                Form.paras = {};
                if(typeof nData.dataMap != 'undefined'){
                    if(typeof nData.dataMap[tid] != 'undefined'){
                        nData['dataMap'] = nData.dataMap[tid];
                        Form.uuid = nData.sceneUuid;
                    }
                    else{
                        Form.paras = {
                            className : nData.className,
                            modelName : nData.modelName,
                            sceneUuid : nData.sceneUuid,
                            formCode : tid
                        };
                        Form.uuid = nData.sceneUuid;
                    }
                }
                tplAnswer(nData,tid,version);
            }else{
                if(typeof data.answers.ext_property.tid != 'undefined'){
                    var answer = data.answers.answer;
                    if(Object.prototype.toString.call(answer) === '[object Array]'){
                        answer  = {
                            datas: answer,
                            ptype:data.ptype,
                            title:data.answers.answer_title
                        };
                    }
                    tplAnswer(answer,data.answers.ext_property.tid,data.answers.ext_property.version);
                    return;
                }
                if (void 0 != data.answers.ext_property.formClear && disableCompoment(data),
                    "p_component_answer" == data.ptype)
                    return handleCompAnswer(data),
                        void 0;
                var answer, ele = $("#chatcontent");

                answer = new AnswerFactory.createAnswer(data.ptype,data.answers),
                $replaceMsg && $replaceMsg.removeClass().html(""),
                    answer.show($replaceMsg || ele, !0, !0),
                    setScroll()
            }*/

        };

        /* function callbackSuccess2(data, $replaceMsg) { //新答案格式修改
         if(data.answers.ext_property.formClear!=undefined){
         disableCompoment(data);
         }
         if(data.ptype=='p_component_answer'){//组件答案需要单独处理，不走原来的答案组件
         handleCompAnswer(data);
         return ;
         }
         var answer;
         var ele = $("#chatcontent");
         answer = new AnswerFactory1.createAnswer(data.ptype, data.answers);
         //如果传入了替换Msg的ele，则
         if($replaceMsg) {
         $replaceMsg.removeClass().html("");
         }

         answer.show($replaceMsg || ele, true, true);
         setScroll();

         };*/

        function handleCompAnswer(data){
            var result1=data.answers.answer;
            var result2=JSON.parse(result1);
            var result3= result2.dataMap;
            var tmpl=result2.html;
            $.template('template', unescape(tmpl));

            html = $('<div></div>').append($.tmpl('template', result3)).html();

            showMes("JIMI",html);

        }
        function disableCompoment(data){//根据标识使组件不可点
            var sceneId=data.answers.ext_property.formClear.sceneUuid;
            var fomrCodeArr=data.answers.ext_property.formClear.formCodes;

            $.each(fomrCodeArr,function(i,item){
                var $formcode=$('[formcode='+item+']');
                var $childselector=$formcode.find('[value='+sceneId+']');
                if($childselector.length>0){
                    $.each($childselector,function(k,a){
                        //var $parent=$(a).parent();
                        var $parent= $(a).closest('.jimi_lists');
                        if($parent.find('.assure').length>0){
//              $parent.find('.editicon').addClass('dis');
//              $parent.find(':input').prop("disabled",true);
//              $parent.find('.submit').removeClass('active');
                            $parent.empty();
                            //$parent.remove('.assure');
                        }
                        if($parent.find('.orderlistform').length>0){
//              $parent.find('.rechoose').addClass('dis');
//              $parent.find('.submit').removeClass('active');
//              $parent.find(':input').prop("disabled",true);
                            // $parent.remove('.orderlistform');
                            $parent.empty();
                        }
                    })
                }
            })
        }
        function getProduct(){
            $.ajax({
                type: "get",
                url:'/product/getProductInfo.action?t=' + new Date().getTime(),
                data:{
                    'productId':compproductId
                },
                success: callSuccess,
                dataType:"json"
            });
            function callSuccess(data){
                if(!data || !data.state){
                    return ;
                }
                var newAnswer = new AnswerFactory.createAnswer(data.resultType, data);
                var ele = $("#productDetailDiv");
                newAnswer.show(ele, false, false);

                //根据商品信息修改人工客服链接
                var param = skipImParamBuild(data.wareDetailsBean);
                var skipURL = '//chat.jd.com/index.action?'+param;
                $(".service-online").find("a").attr("href",skipURL);

                //请求im-jsonp接口，看客服是否在线

                $.ajax({
                    type: "get",
                    url:'//chat1.jd.com/api/checkChat?pid='+compproductId,
                    dataType:"jsonp",
                    success:function(data){
                        //urlParamObj.code = data.code;
                        if(data.code!=1 && data.code!=3){//不显示人工客服
                            $(".service-online").hide();
                        } else {
                            $(".service-online").show();
                        }
                    },
                    error: function(data){
                        $(".service-online").hide();
                    }
                });

                $(window).trigger("resize");
            };
        }

    }(jQuery));

    return exports;
});

(function(w,u) {
    var REG = {
        num : /^\d+$/g,
        mail : /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/g,
        date : /^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$/g,
        phonenum : /^1[34578]\d{9}$/g
        
    };
    var illegal = 'illegal';
    function judger(type,value) {
        if(typeof REG[type] == 'undefined') return true;
        return !!value.match(REG[type]);
    }
    
    function validator(form,callback) {
        var items = form.find('[validate]:not([readonly])');
        
        items.each(function(i,n) {
            var item = $(n);
            item.data('isLegal',!0);
            
            item.focus(function() {}).blur(function() {
                var self = $(this);
                var type = self.attr('validate');
                var value = $.trim(self.val());
                
                if(value == '') {
                    self.data('isLegal',!0).removeClass(illegal);
                    return;
                }else{
                    var result = judger(type,value);
                    self.data('isLegal',result);
                    if(result) {
                        self.removeClass(illegal);
                    }else{
                        self.addClass(illegal);
                    }
                }
            });
        });
        
        form.find('.form_button_submit').click(function() {
            var result = !0;
            items.each(function(i,n) {
                if(!$(n).data('isLegal')) result = !1;
            });
            if(result) callback();
        });
    }
    
    function Form(data,tid,version) {
        var that = this;
        
        that.formItem = null;
        that.data = {};
        that.data = data;
        that.tid = tid.replace(/_{2}\d+$/,'');
        that.version = version;
        if(that.data.dataMap) {
            for(var a in that.data.dataMap) {
                if(typeof data.dataMap[a] == 'string') {
                    data.dataMap[a] = data.dataMap[a].replace(/<[^>]+>/g,'');
                }
            }
        }
    }
    
    Form.prototype.evt = function() {
        var that = this;
        
        // commit event
        
        validator(that.formItem,function() {
            var formData = Form.getData(that.formItem);

            Form.paras.widgets  = formData;

            if(typeof Form.feedback == 'function') Form.feedback(JSON.stringify(Form.paras));
          
        });

        
        that.formItem.find('.form_select').each(function(i,n) {
            if($(n).find('select').length == 1) return;
            $(n).find('select:not(:last)').change(function() {
                Form.renderEnum($(this));
            });
        });
        
        that.formItem.find('button.form_button_backward').click(function() {
            Form.lastHTML = null;
            var uuid = $(this).data('uuid');
            var html = Form.histories[uuid].list.shift();
            var item = $(this).closest('.jimi_lists');
        
            replaceMsg(html,item);
            that.setItem(item);
        });
    };
    
    Form.prototype.setItem = function(item) {
        this.formItem = item;
        if(typeof Form.histories[Form.uuid] != 'undefined' && Form.histories[Form.uuid].list.length && item.find('.customize-form-button').length){
            var btn = $('<button class="form_button form_button_backward" value="上一步">上一步</button>');
            console.log(11);
            item.find('.customize-form-button').append(btn.data('uuid',Form.uuid));
            
        }
        Form.item = item;
        this.evt();
    };

    Form.prototype.getTemplate = function(callback) {
        var that = this;
        if(typeof Form.templates[that.tid] == 'string') {
            callback.call(that,Form.templates[that.tid]);
            Form.lastHTML = Form.templates[that.tid];
            Form.store();
            return;
        } 
        $.ajax({
            url : 'http://jimi1.jd.com/template/getTemplate.action',
            data : {
                componentCode : that.tid,
                version : that.version,
                source : jimiSource
            },
            dataType : "text",
            success : function(data){
                data = data.replace(/\t/g,'');
                data = $.parseJSON(data);
                if(data.code == 1){
                    var html = data.template.componentHtml;
                    html = Form.transformation(html).replace(/\&nbsp;/g,'').replace(/\&gt;/g,'>').replace(/\&lt;/g,'<');
                    $.template("template", unescape(html));
                    html = $("<div></div>").append($.tmpl("template", that.data)).html();
                    Form.templates[that.tid] = html;
                    callback.call(that,html);
                    Form.lastHTML = html;
                    Form.store();
                }
            }
        });
    };



    Form.enumAPI = 'http://jimi1.jd.com/template/getComponentEnum.action';
    Form.uuid = null;
    Form.emptyEnum = '<option value="">--请选择--</option>';
    Form.renderEnum = function(item){   
        item.nextAll('select').html(Form.emptyEnum);
        if(item.val() == "") return;

        var enumType = item.closest('.form_select').attr('enum-type');

        
        $.ajax({
            url : Form.enumAPI,
            data : {
                parentId : item.val(),
                enumType : enumType
            },
            dataType : 'json',
            success : function(data){
                if(data.code == '1'){
                    var options = '';
                    var lists = JSON.parse(data.enumList)
                    $.each(lists,function(i,n){
                        options += '<option value="' + n.id + '">' + n.enumName + '</option>';
                    });
                    item.next('select').append($(options));
                }
            }
        });     
    };
    Form.transformation = function(html){
        var div = $('<div>' + html +'</div>');
        
        div.find('.customize-form-body>[class*="form_"]').each(function(i,n){
            var item = $(n);
            if(item.hasClass('form_input')){
                item.find('input').attr('value','${dataMap.' + item.attr('widget-code') +'}');
            }
        });
        return div.html();
    }
    Form.getData = function(item){
        var tmp = [];

        item.find('.customize-form-body>[class*="form_"]').each(function(i,n){
            var item = $(n);
            var cls = item.attr('class');
            var obj = {};
            switch(cls){
                case 'form_input' :
                    if(item.find('input').attr('readonly')) return;
                    var values = [];
                    values.push(item.find('input').val());
                    obj.value = values;
                    obj.widgetCode = item.attr('widget-code');
                    tmp.push(obj);
                    break;
                case 'form_radio' : 
                    var value = item.find('input:radio:checked').val();
                    if(typeof value == 'undefined') return;
                    var values = []
                    values.push(value);
                    obj.value = values;
                    obj.widgetCode = item.attr('widget-code');
                    tmp.push(obj);
                    break;
                case 'form_select' : 
                    var value = [];
                    item.find('select').each(function(){
                        value.push($(this).find('option:selected').text());
                    }); 
                    var values = []
                    values.push(value.join(' '));
                    obj.value = values;
                    obj.widgetCode = item.attr('widget-code');
                    tmp.push(obj);
                    break;
                default : {

                }
            }
        });

        return tmp;
    }
    Form.feedback = function(data){
        Form.formData = data;
        sendRequest('submitform',0);
    }
    w.Form = Form;
    Form.lastHTML = null;
    Form.histories = {};
    Form.templates = {};
    Form.store = function(){
        if(!Form.uuid) return;
        if(typeof Form.histories[Form.uuid] == 'undefined')
            Form.histories[Form.uuid] = {
                list : [],
                item : null
            }
        if(Form.histories[Form.uuid].list.length == 5){
            Form.histories[Form.uuid].list.pop();
        }
        Form.histories[Form.uuid].list.unshift(Form.lastHTML);
        Form.histories[Form.uuid].item = Form.item;
    };
    


})(window,undefined);
/**
 * Created by Administrator on 2016/11/18.
 */
+(function($) {
    var Scene = function(uuid) {
        if(typeof Scene.HASH[uuid] !== 'undefined') {
            return Scene.HASH[uuid];
        }
        this.uuid = uuid;
        this.curForm = null;
        this.$container = null;
        Scene.HASH[uuid] = this;
    };

    // 获取UUID
    Scene.prototype.getUUID = function() {
        return this.uuid;
    };

    // 设置场景的容器
    Scene.prototype.setContainer = function($container) {
        this.$container = $container;
        this.bindEvt();
    };

    Scene.prototype.getContainer = function() {
        return this.$container;
    };

    // 渲染消息
    Scene.prototype.render = function() {
        if(this.$container == null){
            throw new Error('the message container is not define');
        }
        this.$container.html('');
        this.$container.append(this.curForm.getHtml());
        this.curForm.setValidateField();
    };

    // 初始化一个表单对象，并将其赋值给当前场景
    Scene.prototype.setForm = function(tid, version, data) {
        var form = new CustomForm(tid, version, data);
        if(this.curForm != null) {
            this.curForm.setNext(form);
            form.setPrev(this.curForm);
        }
        this.curForm = form;
    };
    Scene.prototype.done = function() {
        this.curForm.submited();
    };

    // 绑定按钮事件
    Scene.prototype.bindEvt = function() {
        var that = this;

        // 取消
        this.$container.on('click', '.form_button_cancel', function() {
            that.curForm.canceled();
        });
        // 上一步
        this.$container.on('click', '.form_button_prev', function() {
            that.curForm = that.curForm.prev;
            that.render();
        });

        // 提交
        this.$container.on('click', '.form_button_submit', function() {
            var postData = that.curForm.getPostData();
            if(postData != false) {
                package('v.componentAnswer').sendAsk(postData);
                // that.curForm.submited();
            }
        });

        // 表单监听获得焦点事件
        this.$container.on('focus','input[type="text"]', function() {
            var $this = $(this);
            var secret = $this.data('secret');
            if(typeof secret === 'undefined' || secret === ''){
                return;
            }
            if(secret == true || secret == "true") {
                $this.data('secret',false);
                $this.val('');
            }
        });

        // 表单监听失去焦点事件
        this.$container.on('blur', 'input[type="text"]', function() {
            var $this = $(this);
            var secret = $this.data('secret');
            var value = ($this.val()).trim();
            var secretValue = $this.data('value');
            var oldValue = $this.data('old');
            if(typeof secret === 'undefined' || secret === '') {
                return;
            }
            if((secret == false || secret == 'false') && value == '' && secretValue && oldValue){
                $this.data('secret',true);
                $this.val(oldValue);
            }
        });
        this.$container.on('click', 'button.price-notice-btn', function() {
            var data = that.curForm.data;
            var noticeData = data.dataMap[0];
            console.log(noticeData);
            var html = '<div class="customize-form"><div class="customize-form-head ui-droppable"><span class="form_text">降价通知</span></div><div class="customize-form-body ui-droppable"><div class="form_input"><span class="form_name">当前价格</span><input type="text" readonly="readonly" name="curPrice"></div><div class="form_input"><span class="form_name">期望价格</span><input type="text" name="hopePrice"></div><div class="form_input"><span class="form_name">手机号码</span><input type="text"  name="phone"></div></div><div class="customize-form-button ui-droppable"><button value="提交" class="form_button form_button_submit price_notice_submit">提交</button><button value="取消" class="form_button form_button_cancel price_notice_cancel">取消</button></div></div>';
            var shellPre = '<div class="jimi_lists clearfix"><div class="header_img ' + window['jimiHeader'] + ' fl"></div><table class="msg" cellspacing="0" cellpadding="0"><tbody><tr><td class="lt"></td><td class="tt"></td><td class="rt"></td></tr><tr><td class="lm"><span></span></td><td class="mm">';
            var shellPos = '</td><td class="rm"></td></tr><tr><td class="lb"></td><td class="bm"></td><td class="rb"></td></tr><tr><td></td></tr></tbody></table>';
            var $answerHtml = $(shellPre + html + shellPos);
            $('#chatcontent').append($answerHtml);
            setScroll();
            $answerHtml.find('input[name="curPrice"]').val('￥' + noticeData.price);
            $answerHtml.find('input[name="curPrice"]').data('cur', noticeData.price);
            $answerHtml.find('input[name="phone"]').val(noticeData.displayPhone);
            $answerHtml.find('input[name="phone"]').data('display', noticeData.displayPhone);
            $answerHtml.find('input[name="phone"]').data('secret', noticeData.secretPhone);
            $answerHtml.on('click', 'button.price_notice_submit', function() {
                var postData = that.curForm.getPostData();
                postData.form = JSON.parse(postData.form);
                var curPrice = $answerHtml.find('input[name="curPrice"]').data('cur');
                curPrice = Number(curPrice);
                var hopePrice = $answerHtml.find('input[name="hopePrice"]').val();
                hopePrice = Number(hopePrice);
                var phone = $answerHtml.find('input[name="phone"]').val();
                var displayPhone = $answerHtml.find('input[name="phone"]').data('display');
                var secret = $answerHtml.find('input[name="phone"]').data('secret');

                if(!(/^\d+$/.test(hopePrice))) {
                    $answerHtml.find('input[name="hopePrice"]').val('');
                    $answerHtml.find('input[name="hopePrice"]').attr('placeholder', '请输入正确格式的价格');
                    $answerHtml.find('input[name="hopePrice"]').addClass('error');
                    return;
                } else {
                    $answerHtml.find('input[name="hopePrice"]').removeClass('error');
                }

                if(hopePrice > curPrice || hopePrice <= 0) {
                    $answerHtml.find('input[name="hopePrice"]').val('');
                    $answerHtml.find('input[name="hopePrice"]').addClass('error');
                    $answerHtml.find('input[name="hopePrice"]').attr('placeholder', '请输入正确的价格');
                    return;
                } else {
                    $answerHtml.find('input[name="hopePrice"]').removeClass('error');
                }

                if(!(/(^1\d{10}$)|(^1\d{2}\*{5}\d{3}$)/.test(phone))) {
                    $answerHtml.find('input[name="phone"]').val('');
                    $answerHtml.find('input[name="phone"]').attr('placeholder', '请输入正确格式的手机号码');
                    $answerHtml.find('input[name="phone"]').addClass('error');
                    return;
                } else {
                    $answerHtml.find('input[name="phone"]').removeClass('error');
                }

                postData.form.widgets.push({
                    widgetCode: 'widget_notify_hope_price',
                    value:[hopePrice]
                });
                if(displayPhone == phone) {
                    var secretData = {
                        widgetCode: 'widget_notify_phone',
                        value: [secret]
                    };
                    var isSecretData = {
                        widgetCode: 'widget_notify_phone_secret',
                        value: ['true']
                    };
                    postData.form.widgets.push(secretData);
                    postData.form.widgets.push(isSecretData);
                } else {
                    var secretData = {
                        widgetCode: 'widget_notify_phone',
                        value: [phone]
                    };
                    var isSecretData = {
                        widgetCode: 'widget_notify_phone_secret',
                        value: ['false']
                    };
                    postData.form.widgets.push(secretData);
                    postData.form.widgets.push(isSecretData);
                }
                postData.form = JSON.stringify(postData.form);
                package('v.componentAnswer').sendAsk(postData);
                $(this).closest('div.jimi_lists').remove();
            });
            $answerHtml.on('click', 'button.price_notice_cancel', function() {
                $(this).closest('div.jimi_lists').remove();
            });
        });
	 // 最近浏览商品
        this.$container.on('click','.J_ViewProduct li', function() {
            var data = that.curForm.data;
            var postData = {
                form: {
                    className: data.className,
                    modelName: data.modelName,
                    formCode: data.templateComponentCode,
                    sceneUuid: data.sceneUuid,
                    widgets: []
                }
            };
            postData.form.widgets = [{
                    'widgetCode':'widget_ware_id',
                    'value':[$(this).attr('pid')]
                  }
            ];
            postData.form = JSON.stringify(postData.form);
            postData.requestText = 'form submit';
            postData.source = window.jimiSource;
            package('v.componentAnswer').sendAsk(postData);
        });
        //优惠券
        this.$container.on('click','.J_Coupon li', function() {
            var $dom = $(this);
              
            // off为已领取状态不允许再次领取            
            if($dom.hasClass('off')) {
                return false;
            }
            var cid = $dom.attr('data-id');
            var data = that.curForm.data;
            var postData = {
                form: {
                    className: data.className,
                    modelName: data.modelName,
                    formCode: data.templateComponentCode,
                    sceneUuid: data.sceneUuid,
                    widgets: [cid]
                }
            };
            postData.form.widgets = [{
                    'widgetCode':'widget_coupon_rule_id',
                    'value':[$dom.attr('data-id')]
                  },{
                    'widgetCode':'widget_coupon_key',
                    'value':[$dom.attr('data-key')]
                  }
            ];
            postData.form = JSON.stringify(postData.form);
            postData.requestText = 'form submit';
            postData.source = window.jimiSource;
            package('v.componentAnswer').sendAsk(postData,function(data){
                  if(data.crmSync == 1){
                          $dom.addClass("off");
                          //存储off已经领取状态
                          var $p = $dom.parent('.J_Coupon');
                          var val = $p.attr('data-off') || '';
                          val = val + cid + ',';
                          $('.J_Coupon').attr('data-off',val);
                          $('.J_Coupon li[data-id="' + cid + '"]').addClass('off');
                  }
            });
        });
    };

    // 使用uuid存储场景
    Scene.HASH = {};
    // 根据UUID销毁场景
    Scene.destroy = function(uuid) {
        if(typeof Scene.HASH[uuid] !== 'undefined'){
            Scene.HASH[uuid] = undefined;
        }
    };

    var CustomForm = function(tid, version, data) {
        // console.log(data);
        this.tid = tid.replace(/_{2}\d+$/,'');
        this.version = version;
        this.data = data;
        this.prev = null;
        this.next = null;
        this.$html = null;
        this.initTemplate();
    };

    // 初始化模板一级模板渲染
    CustomForm.prototype.initTemplate = function() {
        var that = this;
        $.ajax({
            url:'/template/getTemplate.action',
            dataType: 'text',
            data:{
                componentCode : that.tid,
                version : that.version,
                source : window.jimiSource
            },
            async:false
        }).done(function(result) {
            result = JSON.parse(result.replace(/\t/g,''));
            if(result.code != 1){
                return;
            }
            var html = result.template && result.template.componentHtml;
            var $html = $('<div>' + html + '</div>');
            $html.find('.customize-form-body>[class*="form_"]').each(function(i,n){
                var $item = $(n);
                if($item.hasClass('form_input')){
                    $item.find('input').attr('value','${dataMap.' + $item.attr('widget-code') +'.displayValue}');
                    $item.find('input').attr('data-secret', '${dataMap.'+ $item.attr('widget-code')+'.isSecret}');
                    $item.find('input').attr('data-value', '{{if dataMap.'+$item.attr('widget-code')+'.secretValue}}${dataMap.'+ $item.attr('widget-code')+'.secretValue}{{else}}""{{/if}}')
                    $item.find('input').attr('data-old', '${dataMap.' + $item.attr('widget-code') +'.displayValue}');
                }
            });

            html = $html.html().replace(/\&nbsp;/g,'').replace(/\&gt;/g,'>').replace(/\&lt;/g,'<');
            $.template("template", unescape(html));
            $html = $("<div></div>").append($.tmpl("template", that.data));
            that.$html = $html;
            that.bindSelectEvt();
        });
    };

    // 设置当前表单的下一个表单对象
    CustomForm.prototype.setNext = function(next) {
        this.next = next;
        return this;
    };

    // 获取当前表单的下一步表单
    CustomForm.prototype.getNext = function() {
        return this.next;
    };

    // 设置当前表单的上一个表单对象
    CustomForm.prototype.setPrev = function(prev) {
        this.prev = prev;
        // 设置上一步按钮
        var preStepBtn = '<button class="form_button form_button_prev">上一步</button>';
        var btnHtml = this.$html.find('.customize-form-button').html();
        btnHtml = preStepBtn + btnHtml;
        this.$html.find('.customize-form-button').html(btnHtml);
        return this;
    };

    CustomForm.prototype.setValidateField = function() {
        var validateField = '<span class="error-msg"></span>';
        var btnHtml = this.$html.find('.customize-form-button').html();
        this.$html.find('.customize-form-button').html(validateField+btnHtml);
    };

    // 获取当前表单的上一步表单
    CustomForm.prototype.getPrev = function() {
        return this.prev;
    };

    // 获取当前表单html的jQuery对象
    CustomForm.prototype.getHtml = function() {
        return this.$html;
    };

    // 获取当前表单中的数据
    CustomForm.prototype.getPostData = function() {
        var data = this.data;
        var postData = {
            form: {
                className: data.className,
                modelName: data.modelName,
                formCode: data.templateComponentCode,
                sceneUuid: data.sceneUuid,
                widgets: []
            },
            source: window.jimiSource
        };
        var $widgetsContainer = this.$html.find('div[widget-code]');
        for(var i = 0, len = $widgetsContainer.length; i < len; i++) {
            var $item = $($widgetsContainer[i]);
            var inputObj = {};
            inputObj.widgetCode = $item.attr('widget-code');
            inputObj.value = [];
            if($item.find('input[type="text"]').length > 0) {
                var $input = $item.find('input[type="text"]');
                var secret = $input.data('secret');
                var curValue = {};
                if(secret == 'true' || secret == true){
                    curValue.isSecret = true;
                    curValue.displayValue = $input.data('old');
                    curValue.secretValue = $input.data('value');
                }else{
                    if(!this.validate($input)) {
                        return false;
                    }
                    curValue.isSecret = false;
                    curValue.displayValue = $input.val()
                }
                inputObj.value.push(curValue);
            }else if($item.find('input[type="radio"]').length > 0) {
                var $radios = $item.find('input[type="radio"]');
                $radios.each(function(_,i) {
                    var $radio = $(i);
                    if($radio.is(':checked')){
                        inputObj.value.push($radio.val());
                    }
                });
            }else if($item.find('select').length > 0) {
                var $selects = $item.find('select');
                var value = [];
                $selects.each(function(_, i) {
                    var $select = $(i);
                    var selectValue = $select.find('option:selected').html();
                    if(selectValue == '--请选择--'){
                        return;
                    }
                    value.push(selectValue);
                });
                inputObj.value.push(value.join(','));
            }else if($item.find('input[type="checkbox"]').length > 0){
                var $checkboxes = $item.find('input[type="checkbox"]');
                var value = [];
                $checkboxes.each(function(_, i) {
                    var $checkbox = $(i);
                    if($checkbox.is(':checked')) {
                        value.push($checkbox.val());
                    }
                });
                inputObj.value.push(value.join(','));
            }
            postData.form.widgets.push(inputObj);
        }
        postData.form = JSON.stringify(postData.form);
        postData.requestText = 'form submit';
        postData.source = window.jimiSource;
        return postData;
    };
    
    // 验证表单中的数据
    CustomForm.prototype.validate = function($ele) {

        // 判断是否为空
        var textValue = $ele.val();
        if(/^\s*$/.test(textValue)){
            $ele.addClass('error');
            var name = $ele.closest('.form_input').find('.form_name').html();
            this.$html.find('.customize-form-button .error-msg').html(name+'必填');
            return false;
        }else{
            $ele.removeClass('error');
            this.$html.find('.customize-form-button .error-msg').html('');
        }

        // 判断格式是否正确
        if(typeof $ele.attr('validate') !== 'undefined') {
            var validateName = $ele.attr('validate');
            var val = $ele.val();
            if(validateName === 'num' || validateName === 'drop-down-numeral') {
                val = val.replace(/,\s*/g,'');
            }
            var regexObj = CustomForm.REGEX[validateName];
            if(typeof regexObj !== 'undefined') {
                var regex = regexObj.regex;
                if(!regex.test(val)){
                    $ele.addClass('error');
                    this.$html.find('.customize-form-button .error-msg').html(regexObj.msg);
                    return false;
                }else {
                    $ele.removeClass('error');
                    this.$html.find('.customize-form-button .error-msg').html('');
                }
            }
        }
        return true;
    };

    // 更新取消提交表单后状态
    CustomForm.prototype.canceled = function() {
        var $html = this.$html;
        $html.find('input[type="text"]').addClass('disabled');
        $html.find('input').attr('disabled','true');
        $html.find('select').attr('disabled','true');
        $html.find('.form_button_prev').remove();
        $html.find('.form_button_submit').remove();

        $html.find('.form_button_cancel').addClass('disabled');
        $html.find('.form_button_cancel').html('已取消');
    };

    // 绑定下拉框选择事件
    CustomForm.prototype.bindSelectEvt = function() {
        this.$html.find('.form_select').each(function(index, item) {
            var $formSelect = $(item);
            if($formSelect.find('select').length <= 1) {
                return ;
            }
            var enumType = $formSelect.attr('enum-type');
            $formSelect.on('change','select:not(:last)', function() {
                var $curItem = $(this);
                var value = $curItem.find('option:selected').val();
                if(typeof value === 'undefined' || value == '' || value == null){
                    // 后面所有的选择框置为请选择
                    var $next = $curItem;
                    while(true){
                        $next = $next.next('select');
                        if($next.length == 0) {
                            break;
                        }
                        $next.html('<option>--请选择--</option>');
                    }
                    return
                }
                $.ajax({
                    url:'/template/getComponentEnum.action',
                    type:'GET',
                    dataType:'JSON',
                    data:{
                        parentId: value,
                        enumType:enumType
                    }
                }).done(function(result) {
                    if(result.code != 1){
                        return;
                    }
                    var list;
                    if(typeof result.enumList === 'string') {
                        list = JSON.parse(result.enumList);
                    }else{
                        list = result.enumList;
                    }
                    var option = '<option value="">--请选择--</option>';
                    for(var i = 0, len = list.length; i < len; i++) {
                        var l = list[i];
                        option += '<option value="'+l.id+'">'+l.enumName+'</option>';
                    }
                    var $next = $curItem.next('select');
                    $next.html(option);
                    while(true){
                        $next = $next.next('select');
                        if($next.length == 0) {
                            break;
                        }
                        $next.html('<option>--请选择--</option>');
                    }
                });
            });
        });
    };

    // 更新提交表单后状态
    CustomForm.prototype.submited = function() {
        var $html = this.$html;
        $html.find('input[type="text"]').addClass('disabled');
        $html.find('input').attr('disabled','true');
        $html.find('select').attr('disabled','true');
        $html.find('.form_button_cancel').hide();
        $html.find('.form_button_prev').hide();

        $html.find('.form_button_submit').addClass('disabled');
        $html.find('.form_button_submit').html('已提交');
        $html.find('.form_button_submit').attr('disabled', 'true');
    };
    CustomForm.REGEX = {
        num: {
            regex: /^[1-9]\d*(\.\d+)?$/,
            msg: '请输入正确的数字格式'
        },
        "drop-down-numeral": {
            regex: /^[1-9]\d*(\.\d+)?$/,
            msg: '请输入正确的数字格式'
        },
        mail:{
            regex:/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
            msg: '请输入正确的邮件格式'
        },
        "drop-down-mail": {
            regex:/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
            msg: '请输入正确的邮件格式'
        },
        date: {
            regex: /^\d{4}[./-]\d{1,2}[./-]\d{1,2}(\s+\d{1,2}:\d{1,2}:\d{1,2})?$/,
            msg: '请输入正确的日期格式'
        },
        "drop-down-date": {
            regex: /^\d{4}[./-]\d{1,2}[./-]\d{1,2}(\s+\d{1,2}:\d{1,2}:\d{1,2})?$/,
            msg: '请输入正确的日期格式'
        },
        phonenum : {
            regex: /^1[34578]\d{9}$/,
            msg: '请输入正确的手机号码格式'
        },
        "drop-down-phone": {
            regex: /^1[34578]\d{9}$/,
            msg: '请输入正确的手机号码格式'
        }
    };
    window.Scence = Scene;
    window.CustomForm = CustomForm;
})(jQuery);

/**
 * Created by lvchenyang on 2017/3/2.
 */
package('v.socket',[], function(require, exports, moudle) {

    var socket;
    var heartbeatTimer;
    function support() {
        return !!window.WebSocket;
    }
    function start(aid) {
        if(!support()) {
            throw new Error('this browser dose not support WebSocket!');
        }
        if(window.socketObject) {
            socket = window.socketObject;
        } else {
            try{
                var pin = $.cookie('pin');
                var _robotAccess_ = $.cookie('_robotAccess_');
                var clientType = 'web';
                var wsDomain = window.wsDomain;
                var protocol = location.protocol;
                if(protocol === 'http:') {
                    wsDomain = 'ws://' + wsDomain;
                } else if(protocol == 'https:') {
                    wsDomain = 'wss://' + wsDomain;
                }
                socket = new WebSocket(wsDomain + '?pin=' + pin + '&robotAccess=' + _robotAccess_ + '&clientType=' + clientType + '&aid=' + aid);
                socket.onopen    = onOpen;
                socket.onclose   = onClose;
                socket.onmessage = onMessage;
                socket.onerror   = onError;
                window.socketObject = socket;
            } catch (e) {
                return false;
            }
            return true;
        }
    }

    function onOpen() {

        heartbeatTimer && clearInterval(heartbeatTimer);
        heartbeatTimer = setInterval(function() {
            var pack = {
                clientType: 'web',
                pin: $.cookie('pin'),
                robotAccess: $.cookie('_robotAccess_'),
                type: 'HeartBeat'
            };
            pack = JSON.stringify(pack);
            socket.send(pack);
        },10000);

    }

    function voluntary() {
         var pack = {
            clientType : 'web',
            pin : $.cookie('pin'),
            robotAccess : $.cookie('_robotAccess_'),
            type : 'ActivePush',
            data : {
                source : window.jimiSource
            }
        }
        pack = JSON.stringify(pack);
        socket.send(pack);
    }

    function onClose() {
        heartbeatTimer && clearInterval(heartbeatTimer);
        delete window.socketObject;
    }
    function onMessage(event) {
        var data = event.data;
        if(typeof data === 'string') {
            data = JSON.parse(data);
        }
        if(data.type == 'ACK') {
            return;
        }
        data = data.data;
        if(typeof data === 'string') {
            data = JSON.parse(data);
        }
        var answer = data.answers.answer;
        if(answer) {
            answer = AnswerFactory.createAnswer(data.ptype, data.answers);
            answer.show($('#chatcontent'), true, true);
            setScroll();
        }

    }
    function onError() {
        delete window.socketObject;
    }
    function close() {
        socket.close();
    }

    /**
     * 开启socket
     */
    exports.start  = start;
    exports.close   = close;
    exports.support = support;
    exports.voluntary = voluntary;
    return exports;
});
