const conf = {
  userInfo: null,
  evt: {},
  appid: "haiwai",
  isLogin: false,
  // api: {
  //   verify: "https://gtoken.lilithgame.com/gtoken/auth/v1/dynamic/role/verify",
  //   init: "http://43.143.6.204:8080/api/2022/s/init",
  //   jf: "http://43.143.6.204:8080/api/2022/s/up",
  //   question: "http://43.143.6.204:8080/api/2022/s/question",
  //   task: "http://43.143.6.204:8080/api/2022/s/task",
  //   login: "http://43.143.6.204:8080/api/2022/s/login",
  //   gift: "http://43.143.6.204:8080/api/2022/s/send"
  // },
  api: {
    verify: "https://gtoken.lilithgame.com/gtoken/auth/v1/dynamic/role/verify",
    init: "https://halloween-afk-be.lilith.com/api/2022/s/init",
    jf: "https://halloween-afk-be.lilith.com/api/2022/s/up",
    question: "https://halloween-afk-be.lilith.com/api/2022/s/question",
    task: "https://halloween-afk-be.lilith.com/api/2022/s/task",
    login: "https://halloween-afk-be.lilith.com/api/2022/s/login",
    gift: "https://halloween-afk-be.lilith.com/api/2022/s/send"
  },
  gameId: 1,
  urlParams: null,
  isShowSharePop: false,
  taskScore: {
    1: {
      1: 20 //签到
    },
    2: {
      1: 20 //分享
    },
    3: {
      1: 10 //答题
    },
    4: {
      1: 10, //日活
      2: 10 //抽卡
    },
    5: {
      1: 100, //糖果机 1个相同
      2: 200, //糖果机 2个相同
      3: 400  //糖果机 3个相同
    }
  },
  msg: msg,
  questions: questions
};
dayjs.extend(window.dayjs_plugin_isToday);

function getEvtData(opt) {
  opt = opt || {};
  if (opt.showLoading) {
    showLoading();
  }
  $.ajax({
    url: conf.api.init + "?id=" + conf.userInfo.id,
    type: "GET",
    contentType: "application/json",
    crossDomain: true,
    error: function (msg) {
      console.log(msg);
      hideLoading();
      showMsg();
    },
    success: function (res) {
      hideLoading();
      if (res.data.state) {
        conf.evt = res.data.item;
        handlerData();
        opt.cb && opt.cb();
      } else {
        // showMsg(res.data.msg);
        opt.err && opt.err();
      }
    }
  });
}
function initLogin() {
  getLocalData();
  if (conf.userInfo && conf.userInfo.id) {
    getEvtData({
      cb: () => {
        if (conf.urlParams && conf.urlParams.invite_code) {
          if (conf.evt && conf.evt.isGroup) {
            return showDia("inteam");
          }
          $("#invite_code2").text(conf.urlParams.invite_code);
          showDia("join");
        }
      },
      err: () => {
        clearLocalData();
        if (conf.urlParams && conf.urlParams.invite_code) {
          $("#invite_code2").text(conf.urlParams.invite_code);
          showDia("join");
        } else {
          showDia("bind");
        }
      },
      showLoading: true
    });
  } else {
    if (conf.urlParams) {
      if (conf.urlParams && conf.urlParams.invite_code) {
        if (conf.evt && conf.evt.isGroup) {
          return showDia("inteam");
        }
        $("#invite_code2").text(conf.urlParams.invite_code);
        showDia("join");
      }
    } else {
      // showDia("bind");
    }
  }
}
function clearLocalData() {
  window.localStorage.removeItem("sph5");
}
function getLocalData() {
  let data = window.localStorage.getItem("sph5");
  if (data) {
    data = JSON.parse(data);
    // if (!dayjs().isBefore(dayjs(data.userInfo.date).add(1, "day"))) {
    //   clearLocalData();
    //   return;
    // }
    conf.userInfo = data.userInfo;
    let q = data.q;
    conf.q = q;
    /////
    $(".unlogin").show();
  }
  else {
    $(".unlogin").hide();
  }
}
function setLocalData() {
  let data = {
    userInfo: conf.userInfo,
    q: conf.q || null
  };
  window.localStorage.setItem("sph5", JSON.stringify(data));
}

function checkLogin() {
  if (conf.isLogin) {
    return true;
  }
  showDia("bind");
  return false;
}
$(".unlogin").click(function () {
  clearLocalData();
  window.location.reload();
});
function getUrlParam() {
  let arrObj = location.href.split("?");
  let params = Object.create(null);
  if (arrObj.length > 1) {
    arrObj = arrObj[1].split("&");
    arrObj.forEach((item) => {
      item = item.split("=");
      params[item[0]] = item[1];
    });
  }
  return params;
}
function showLoading() {
  $(".loading").show();
}
function hideLoading() {
  $(".loading").hide();
}

function showDia(id) {
  showDialog.show({
    id: id,
    bgcolor: "#091724",
    opacity: 90
  });
}
function setStep() {
  let score = conf.evt.groupScore;
  if (conf.evt.cdkRecoreds && conf.evt.cdkRecoreds.length > 0) {
    conf.evt.cdkRecoreds = conf.evt.cdkRecoreds.sort(function (a, b) {
      return parseInt(a.typeId) - parseInt(b.typeId);
    });
  }
  $(".knf0").removeClass("knf1").removeClass("knf2").removeClass("knf3");
  $(".s_gift").removeClass("s1").removeClass("s2").removeClass("s3");
  let percent = 0;
  let step = 0;
  if (score == 0) {
    percent = 0;
    step = 0;
  } else if (score > 0 && score <= 100) {
    percent = ((100 / 100) * score * 8.1) / 100;
    if (score == 100) {
      step = 1;
      conf.evt.cdkRecoreds[0].enable = true;
    }
  } else if (score > 100 && score <= 500) {
    percent = ((100 / 400) * (score - 100) * (48.7 - 8.1)) / 100 + 8.1;
    step = 1;
    conf.evt.cdkRecoreds[0].enable = true;
    if (score == 500) {
      step = 2;
      conf.evt.cdkRecoreds[1].enable = true;
    }
  } else if (score > 500 && score <= 1000) {
    percent = ((100 / 500) * (score - 500) * (89.7 - 48.7)) / 100 + 48.7;
    step = 2;
    conf.evt.cdkRecoreds[0].enable = true;
    conf.evt.cdkRecoreds[1].enable = true;
    if (score == 1000) {
      step = 3;
      conf.evt.cdkRecoreds[2].enable = true;
    }
  } else {
    percent = 100;
    step = 3;
    conf.evt.cdkRecoreds[0].enable = true;
    conf.evt.cdkRecoreds[1].enable = true;
    conf.evt.cdkRecoreds[2].enable = true;
  }
  $(".percenter").css("width", percent + "%");
  $(".s_gift").addClass("s" + step);
  $(".knf0").addClass("knf" + step);
}
$(function () {
  conf.urlParams = getUrlParam();
  initLogin();
  $(".startBtn").click(function () {
    if (!checkLogin()) return;
    $(".startBtn").hide();
  });

  //锻造记录
  $(".logBtn").click(function () {
    if (!checkLogin()) return;
    showLog();
  });

  $(".shareBtn").click(function () {
    if (!checkLogin()) return;
    shareRight();
  });
  function shareRight(){
    showShare();
  }

  //什么是uid
  $(".whatUId").click(function () {
    $("#uid").fadeIn();
  });
  //什么是验证码
  $(".whatYzm").click(function () {
    $("#yzm").fadeIn();
  });
  $(".closebtn2").click(function () {
    $(".what").fadeOut();
  });
  $(".is_no_login").click(function () {
    showDialog.hide();
    if (!checkLogin()) return;
  });
  $(".closebtn3").click(function () {
    showDialog.hide();
    window.location.href = location.href.split("?")[0];
  });

  $("#bind .pop_confirm_btn").click(function () {
    doLogin();
    return false;
  });

  $("#join .pop_confirm_btn").click(function () {
    doLogin2();
    return false;
  });

  $(".partener .has").click(function () {
    if (!checkLogin()) return;
    return false;
  });

  $(".task1 a").click(function () {
    if (!checkLogin()) return;
    if (conf.evt.isAnswer) {
      return showMsg(conf.msg.question.done);
    }
    showQuestion();
  });

  $(".task2 a").click(function () {
    if (!checkLogin()) return;
    if (conf.evt.isFinishTaskActiv && conf.evt.isFinishTaskCard) {
      return showMsg(conf.msg.task.done);
    }
    showInGameTask();
  });
  initGame();
  $(".task3 a").click(function () {
    if (!checkLogin()) return;
    if (conf.evt.isPlayMiniGame>=300) {
      return showMsg(conf.msg.game.done);
    }
    showDia("sgame");
  });

  $(".closebtn,.shareNotice").click(function () {
    showDialog.hide();
  });
});

function showShare() {
  conf.isShowSharePop = true;
  if (!conf.evt.isShare) {
    postJF(
      {
        category: 2, //游戏类别。（每日签到 = 1,分享 = 2,    每日答题 = 3,内部游戏 = 4,小游戏 = 5）
        level: 1 //成绩级别。（0是未完成，1是好(日活是1，抽卡是2)，2是完美）
      },
      () => {
        showDia("share1");
      }
    );
  } else {
    showDia("share1");
  }
}

function setShareTimer() {
  setTimeout(() => {
    if (conf.isShowSharePop || conf.evt.isShare) return;
    $("#shareNotice").show();
    $("#shareNotice").click(function () {
      $(this).hide();
    });
    conf.isShowSharePop = true;
  }, 10 * 1000);
}

function showMsg(msg) {
  $(".pop_text6").html(msg || conf.msg.err.net);
  showDia("msg");
}

function initJF() {
  let status = conf.evt.cdkRecoreds;
  let $s = $(".s_gift li");
  $s.each(function (index) {
    let giftStatus = status[index];
    if (giftStatus.isSend) {
      $(this).find(".geted").show();
    } else {
      $(this)
        .find("i")
        .unbind("click")
        .click(function () {
          if (giftStatus.enable) {
            getGift(giftStatus.typeId, () => {
              $s.eq(index).find(".geted").show();
              status[index] = true;
            });
          } else {
            showMsg(conf.msg.gift.notEnough);
          }
        });
    }
  });
  // $(".s_gift i").click(function () {
  //   showDia("step_gift");
  // });
}
function d2b(n) {
  return ("0000" + n.toString(2)).slice(-4);
}
function getGift(n, cb) {
  showLoading();
  let ctype = d2b(parseInt(n));
  $.ajax({
    url: conf.api.gift + "?id=" + conf.userInfo.id + "&ctype=" + ctype,
    type: "GET",
    contentType: "application/json",
    crossDomain: true,
    error: function (msg) {
      console.log(msg);
      hideLoading();
      showMsg();
    },
    success: function (res) {
      console.log(res);
      hideLoading();
      if (res.data.state) {
        showMsg(conf.msg.gift.got);
        cb && cb();
      } else {
        return errCode(res);
      }
    }
  });
}
/////
var reg = /^\d{3,}$/;
var reg_yzm = /^\d{6}$/;
function doLogin() {
  let role_id = $("#role_id").val();
  let code = $("#code").val();
  let region_id = $("#region_id").val();
  if (!role_id) {
    return alert(conf.msg.val.uid);
  }
  if (!reg.test(role_id)) {
    return alert(conf.msg.val.uid_zz);
  }
  if (!code) {
    return alert(conf.msg.val.code);
  }
  if (!reg_yzm.test(code)) {
    return alert(conf.msg.val.code_zz);
  }
  if (!region_id) {
    return alert(conf.msg.val.region);
  }
  postLogin({
    player: {
      openid: conf.appid,
      role_id,
      app_id: "",
      code,
      region_id
    }
  });
}
function postLogin(data) {
  showLoading();
  $.ajax({
    url: conf.api.login,
    data: JSON.stringify(data),
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    error: function (msg) {
      console.log(msg);
      hideLoading();
      showMsg();
    },
    success: function (res) {
      console.log(res);
      hideLoading();
      if (res.data.state) {
        conf.evt = res.data.item;
        conf.userInfo = {
          id: conf.evt.playerId,
          uid: data.player.role_id,
          date: new Date()
        };
        setLocalData();
        showDialog.hide();
        handlerData();
        $(".unlogin").show();
      } else {
        // alert(res.data.msg);
        if (res.data.code == 161) {
          if(conf.urlParams.invite_code != conf.evt.inviteCode){
            return showDia("inteam");
          }
          else {
            window.location.href = location.href.split("?")[0];
          }
        } else if (res.data.code == 162) {
          return showMsg(conf.msg.team.err_code);
        } else if (res.data.code == 163) {
          // console.log(conf.urlParams.invite_code,conf.evt.inviteCode)
          if(conf.urlParams.invite_code != conf.evt.inviteCode){
            return showDia("full");
          } 
        }
        return errCode(res);
      }
      history.pushState("", "", window.location.origin + window.location.pathname);
      // window.location.href = "/"
    }
  });
}
function errCode(res) {
  if (res && res.data && res.data.msg) {
    let msg = conf.msg.err[res.data.msg.toLowerCase()];
    if (msg) {
      return showMsg(msg);
    }
  }
  showMsg();
}
function doLogin2() {
  let role_id2 = $("#role_id2").val();
  let code2 = $("#code2").val();
  let region_id2 = $("#region_id2").val();
  let invite_code2 = conf.urlParams.invite_code;
  if (!role_id2) {
    return alert(conf.msg.val.uid);
  }
  if (!reg.test(role_id2)) {
    return alert(conf.msg.val.uid_zz);
  }
  if (!code2) {
    return alert(conf.msg.val.code);
  }
  if (!reg_yzm.test(code2)) {
    return alert(conf.msg.val.code_zz);
  }
  if (!region_id2) {
    return alert(conf.msg.val.region);
  }
  postLogin({
    player: {
      openid: conf.appid,
      role_id: role_id2,
      app_id: "",
      code: code2,
      region_id: region_id2
    },
    inviterCode: invite_code2
  });
}
function handlerData() {
  console.log("handlerData");
  conf.isLogin = true;
  if (!conf.evt.isShare) {
    setShareTimer();
  }
  setStep();
  showMembers();
  //积分奖励
  initJF();
  $(".startBtn").hide();
}

function showQuestion() {
  console.log("showQuestion");
  if (conf.q && dayjs(conf.q.date).isToday()) {
    setQuestion();
  } else {
    getQuestion(setQuestion);
  }
}
function getQuestion(cb) {
  showLoading();
  $.ajax({
    url: conf.api.question + "?id=" + conf.userInfo.id,
    type: "GET",
    contentType: "application/json",
    crossDomain: true,
    error: function (msg) {
      console.log(msg);
      hideLoading();
      showMsg();
    },
    success: function (res) {
      hideLoading();
      if (res.data.state) {
        let q = res.data.item;
        q = Object.assign({}, q, conf.questions[q.id]);
        conf.q = q;
        setLocalData();
        cb && cb();
      } else {
        return errCode(res);
      }
    }
  });
}
function setQuestion() {
  // let q = conf.q
  let q = conf.q;
  $(".question_name").text(q.question);
  let aListDom = "";
  let aLetter = ["A", "B", "C"];
  for (let i = 0; i < 30; i++) {
    let qNum = "op" + (i + 1);
    let isAnswer = qNum == q.isRight;
    aListDom += `<li data-a="${isAnswer}"><span>${aLetter[i]}.</span>${q["op" + (i + 1)]}</li>`;
  }
  $(".anslist").html(aListDom);
  $(".anslist li").each(function () {
    $(this)
      .unbind("click")
      .click(function () {
        if (conf.evt.isAnswer) return;
        let isAnswer = $(this).data("a");
        if (isAnswer) {
          $(this).addClass("yes");
        } else {
          $(this).addClass("no");
        }
        postJF(
          {
            category: 3, //游戏类别。（每日签到 = 1,分享 = 2,    每日答题 = 3,内部游戏 = 4,小游戏 = 5）
            level: isAnswer ? 1 : 0, //成绩级别。（0是未完成，1是好(日活是1，抽卡是2)，2是完美）
            questionId: q.id, //只有是答题游戏才填（用户的题目id）
            querstionAnswer: "string" //只有是答题游戏才填（用户的回答-后台不判断，只记录）
          },
          () => {
            if (!isAnswer) {
              showMsg(conf.msg.question.wrang);
            }
          }
        );
      });
  });
  showDia("question");
}

function showMembers() {
  let membersDom = "";
  for (let i = 0; i < 2; i++) {
    let member = conf.evt.members[i];
    if (member) {
      membersDom += `<li><i><img src="${member.gameHeadImg}" alt=""></i>
                        <span>${member.gameNick}</span></li>`;
    } else {
      membersDom += `<li>
                        <i class="has"></i>
                        <span></span>
                    </li>`;
    }
  }
  $(".partener ul").html(membersDom);
  $(".partener .has")
    .unbind("click")
    .click(function () {
      showInvite();
      return false;
    });
}

function showLog() {
  let logDom = "";
  if (conf.evt.forgeRecords) {
    conf.evt.forgeRecords.forEach((log) => {
      logDom += `<li>
                        <span class="dz">${conf.msg.game.unit}+${log.score}</span>
                        <i><img src="${log.gameHeadImg}" alt=""></i>
                        <p>
                            <span class="name">${log.gameNick}</span>
                            <span class="time">${dayjs(log.createDate).format("MM-DD HH:mm")}</span>
                        </p>
                    </li>`;
    });
  }
  $(".build_log").html(logDom);
  showDia("log");
}
let isPlayGame = false;
function initGame() {
  if (isPlayGame) {
    return showMsg(conf.msg.game.done);
  }
  var rotateDd = $('.rotate_box dd');
    var ddHei = rotateDd.height();
    rotateDd.css('backgroundSize', '100% ' + 3 * ddHei + 'px');
    $('.startBtn2').click(function () {
      if (conf.evt.isPlayMiniGame>=300) {
        return showMsg(conf.msg.game.done);
      }
      var _this = $(this);
      if (!_this.hasClass('act')) {
          !_this.addClass('act');
          // methods.star_animate.call(this);
          $('.rotate_box dd').rotate(methods.getRandom(30))
      }
    })
    $.fn.extend({
        rotate: function (num, callback) {
            var zjNum = num;
            console.log(zjNum);
            $(this).each(function (index) {
                var f = $(this);
                setTimeout(function () {
                    f.animate({
                        backgroundPositionY: -(ddHei * 3 * 5 + zjNum[index] * ddHei)
                    }, {
                        duration: 3000 + index * 1000,
                        easing: 'easeInOutCirc',
                        complete: function () {
                            if (index === 2) {
                                $('.startBtn2').removeClass('act');
                                if (callback) {
                                    setTimeout(function () {
                                        callback();
                                    }, 1000)
                                }
                            }
                            f.css('backgroundPositionY', -(zjNum[index] * ddHei))
                        }
                    });
                }, index * 1000)
            })
            setTimeout(function(){
              repeat(zjNum);
              ///////
              if (conf.evt.isPlayMiniGame>=300) {
                isPlayGame = true;
              }
              ////////
            },7000)
        }
    })
    var methods = {
        getRandom: function (num) {
            var arr = [],
                _num = num;
            do {
                var val = Math.floor(Math.random() * num);
                // if (arr.indexOf(val) < 0) {
                //     arr.push(val);
                //     _num--
                // }
                arr.push(val);
                _num--
            }
            while (_num > 0);
            return arr
        }
    }
}
function repeat(array) {
  let a ={}
  let max = 1;
  for (let i=0;i<array.length;i++){
      a[array[i]] == undefined ? a[array[i]] = 1 : a[array[i]]++;
      if(a[array[i]] > max){
          max = a[array[i]];
      }
  }
  console.log(max);
  let jfReq = {
    category: 5,
    level: 200
  };
  if (max == 0) {
    jfReq.level = 200;
  } else if (max == 0) {
    jfReq.level = 200;
  } else if(max > 0){
    jfReq.level = 300;
  }
  postJF(jfReq, () => {
    // if (jfReq.level == 0) {
    //   showMsg(conf.msg.game.fail);
    // }
  });
}
function getIngameTask(cb) {
  showLoading();
  $.ajax({
    url: conf.api.task + "?id=" + conf.userInfo.id,
    type: "GET",
    contentType: "application/json",
    crossDomain: true,
    error: function (msg) {
      console.log(msg);
      hideLoading();
      showMsg();
    },
    success: function (res) {
      hideLoading();
      if (res.data.state) {
        conf.ingameTaskInfo = res.data.item;
        cb && cb();
      } else {
        showMsg(conf.msg.task.err_default);
      }
    }
  });
}
function setIngameTask() {
  // let result = '{"ret":0,"info":{"daily_activie_points":1000,"draw_card_times":0}}';
  // result = JSON.parse(result);
  let info = conf.ingameTaskInfo;
  if (conf.evt.isFinishTaskActiv) {
    $(".ingameTask1").removeClass("tocomplete").removeClass("complete").removeClass("completed").addClass("completed");
  } else {
    if (info.daily_activie_points >= 100) {
      $(".ingameTask1").removeClass("tocomplete").removeClass("complete").removeClass("completed").addClass("complete");
    } else {
      $(".ingameTask1").removeClass("tocomplete").removeClass("complete").removeClass("completed").addClass("tocomplete");
    }
  }
  $(".ingameTask1")
    .unbind("click")
    .bind("click", function () {
      if ($(this).hasClass("completed")) {
        return false;
      }
      if ($(this).hasClass("tocomplete")) {
        gotoGame();
      }
      if ($(this).hasClass("complete")) {
        postJF(
          {
            category: 4,
            level: 1
          },
          () => {
            $(this).removeClass("complete").addClass("completed");
          }
        );
      }
    });

  if (conf.evt.isFinishTaskCard) {
    $(".ingameTask2").removeClass("tocomplete").removeClass("complete").removeClass("completed").addClass("completed");
  } else {
    if (info.draw_card_times >= 5) {
      $(".ingameTask2").removeClass("tocomplete").removeClass("complete").removeClass("completed").addClass("complete");
    } else {
      $(".ingameTask2").removeClass("tocomplete").removeClass("complete").removeClass("completed").addClass("tocomplete");
    }
  }
  $(".ingameTask2")
    .unbind("click")
    .bind("click", function () {
      if ($(this).hasClass("completed")) {
        return false;
      }
      if ($(this).hasClass("tocomplete")) {
        gotoGame2();
      }
      if ($(this).hasClass("complete")) {
        postJF(
          {
            category: 4,
            level: 2
          },
          () => {
            $(this).removeClass("complete").addClass("completed");
          }
        );
      }
    });
  showDia("ingame");
}
function showInGameTask() {
  getIngameTask(setIngameTask);
}

function postJF(r, cb) {
  showLoading();
  let req = {
    id: conf.userInfo.id
  };
  req = Object.assign({}, req, r);
  $.ajax({
    url: conf.api.jf,
    data: JSON.stringify(req),
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    error: function (msg) {
      hideLoading();
      showMsg();
    },
    success: function (res) {
      console.log(res);
      hideLoading();
      if (res.data.state) {
        showAddScore(req.category, req.level);
        getEvtData();
        cb && cb();
      } else {
        return errCode(res);
      }
    }
  });
}

function showAddScore(category, level) {
  if (level == 0) return;
  addScore(conf.taskScore[category][level]);
}

function addScore(i) {
  $(".scoreflash").show();
  $(".scoreflash span").text(conf.msg.score.txt + " +" + i);
  setTimeout(function () {
    $(".scoreflash").hide();
  }, 2000);
}

function gotoGame() {
  // alert("gotoGame");
  var u = navigator.userAgent;
  var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; // android终端
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
  if (isAndroid) {
    window.location.href = "afkarena://sh.lilithgames.afkarena?action=task";
  } else if (isiOS) {
    window.location.href = "https://yvy5.adj.st/?action=task";
  }
}
function gotoGame2() {
  // alert("gotoGame");
  var u = navigator.userAgent;
  var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; // android终端
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
  if (isAndroid) {
    window.location.href = "afkarena://sh.lilithgames.afkarena?action=tavern";
  } else if (isiOS) {
    window.location.href = "https://yvy5.adj.st/?action=tavern";
  }
}
function showInvite() {
  showDia("share2");
  $("#invite_share").text(conf.evt.inviteCode);
  //////
  let url = window.location.href;
  if (url.indexOf("?") > -1) {
    url += "&invite_code=" + conf.evt.inviteCode;
  } else {
    url += "?invite_code=" + conf.evt.inviteCode;
  }
}

$(".shareToTW").click(function () {
  var txt = "Join the AFK Arena Halloween Night with Your Friends to Get Free Rewards!";
  var page_url = window.location.href + "?invite_code=" + conf.evt.inviteCode;
  window.location.href = "https://twitter.com/intent/tweet?text=" + txt + "&url=" + page_url;
});
$(".shareToFB").click(function () {
  var txt = "Join the AFK Arena Halloween Night with Your Friends to Get Free Rewards!";
  var page_url = window.location.href + "?invite_code=" + conf.evt.inviteCode;
  window.location.href = "https://www.facebook.com/sharer/sharer.php?quote="+ txt +"&u=" + decodeURIComponent(page_url);
});
$(".downloadBtn,.pop_download_btn").click(function(){
  var u = navigator.userAgent;
  var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; // android终端
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
  if (isAndroid) {
    window.location.href = "https://app.adjust.com/z1lw6tn";
  } else if (isiOS) {
    window.location.href = "https://app.adjust.com/x766e6m";
  }
})
