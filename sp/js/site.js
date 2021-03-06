"use strict";

(function($){

  // モーダルのデフォルト設定を変更する
  $.fn.modaal.options.overlay_opacity = 0.6;
  $.fn.modaal.options.animation_speed = 100;

  // 複数モーダルのためのイベント処理の修正
  (function(){
    var eventHandlers = [];
    function getHandler(events, eventName) {
      if (typeof events[eventName] === 'undefined') {
        return null;
      }
      for (var i = 0; i < events[eventName].length; i ++) {
        var event = events[eventName][i];
        if (event.namespace === 'Modaal') {
          return event.handler;
        }
      }
      return null;
    }
    $.fn.modaal.options.before_open = function(){
      var events = $._data(this.dom.get(0), "events");
      if (!events) {
        return;
      }
      eventHandlers.push({
        click: getHandler(events, 'click'),
        keyup: getHandler(events, 'keyup'),
        keydown: getHandler(events, 'keydown')
      });
    };
    $.fn.modaal.options.after_close = function() {
      this.dom.off('click.Modaal keyup.Modaal keydown.Modaal');
      if (eventHandlers.length > 0) {
        var handler = eventHandlers.pop();
        if (handler.click) {
          this.dom.on('click.Modaal', handler.click);
        }
        if (handler.keyup) {
          this.dom.on('keyup.Modaal', handler.keyup);
        }
        if (handler.keydown) {
          this.dom.on('keydown.Modaal', handler.keydown);
        }
      }
    };
  })();

  // toggleの解除処理を追加
  $(document).on('change', '[data-toggle="other"]:radio', function(event) {
    var $this = $(this);
    $(':radio[name="' + $this.attr('name') + '"]').not($this).each(function(){
      $(this).parents('label.btn').removeClass('active');
    });
  });

  // result-Containerの表示表示の操作
  $('.result-Detail_Btn').click(function (e) {
    var $hide_content = $('.result-Container');
    // $('.purchase-Container').toggleClass('purchase-Container--active');
    $($hide_content).slideToggle(500);
    if($('i', this).hasClass('fa-chevron-circle-down')){
      $('i', this).removeClass('fa-chevron-circle-down').addClass('fa-times-circle');
    }else{
      $('i', this).addClass('fa-chevron-circle-down').removeClass('fa-times-circle');
    }
  });

  $('.result-Close').click(function (e) {
    var $hide_content = $('.result-Container');
    // $('.purchase-Container').toggleClass('purchase-Container--active');
    $($hide_content).slideToggle(500);
    if($('i', this).hasClass('fa-chevron-circle-down')){
      $('i', this).removeClass('fa-chevron-circle-down').addClass('fa-times-circle');
    }
    if($('i', '.result-Detail_Btn').hasClass('fa-times-circle')){
      $('i', '.result-Detail_Btn').removeClass('fa-times-circle').addClass('fa-chevron-circle-down');
    }
  });

  // collapse処理
  $('.js-collapse').click(function (e) {
    var $hide_content = $($(this).data('collapseTarget'));
    $($hide_content).slideToggle(500);

    if($('i', this).hasClass('fa-chevron-circle-down')){
      $('i', this).removeClass('fa-chevron-circle-down').addClass('fa-times-circle');
    }else{
      $('i', this).addClass('fa-chevron-circle-down').removeClass('fa-times-circle');
    }
  });
  $('.js-collapse-radio').each(function(){
    var $this = $(this);
    var $hide_content = $($this.data('collapseTarget'));
    var $others = $(':radio[name="' + $this.attr('name') + '"]').not($this);

    $this.change(function(){
      $hide_content.slideDown(500);
      $('i', this).removeClass('fa-chevron-circle-down').addClass('fa-times-circle');
    });
    $others.change(function(){
      $hide_content.slideUp(500);
      $('i', this).addClass('fa-chevron-circle-down').removeClass('fa-times-circle');
    });
  });

  $('li.kit-List_Item select').on('change',function(){
    var sumKit = 0;
    $('li.kit-List_Item select').each(function(){
        sumKit += parseInt($(this).val());
    });
    $('.kit-Sum_TotalValue').html(sumKit);
  });

  $.fn.slidePanel = function(action,callback){
    var _this = this;
    var current = this.attr('data-current');
    current = typeof current === "undefined" ? 0 : parseInt(current);
    if(action === 'next'){
      current += 1;
      slide();
    }
    if(action === 'prev'){
      current -= 1;
      slide();
    }
    if(action === 'move'){
      move();
    }
    if(action === 'adjust'){
      slide();
    }
    function slide(){
      $('.slidePrev').hide();
      _this.attr('data-current',current);
      $("html, body").animate({scrollTop:0}, 'fast', 'swing');
      _this.stop().animate({scrollLeft: $(window).width() * current}, 'fast', function(){
        if(typeof callback !== "undefined") callback();
        $(this).css({height: $(this).find('.slidePanel').eq(current).find('.slideInner').outerHeight() + ($(window).width() * 0.2)});
        $(this).find('.slidePanel').eq(current).find('.slidePrev').show();
      });
    }
    function move(){
      $('.slidePrev').hide();
      _this.attr('data-current',current);
      _this.animate({scrollLeft: $(window).width() * current}, 1, function(){
        $(this).css({height: $(this).find('.slidePanel').eq(current).find('.slideInner').outerHeight() + ($(window).width() * 0.2)});
        $(this).find('.slidePanel').eq(current).find('.slidePrev').show();
      });
    }
  }
  var _currentWidth = 0;
  $(window).on('load', function(){
    if($('.stageSlide').length){
      var slideNo = getParam('slide');
      if(slideNo != null){
        if(slideNo > $('.stageSlide .slidePanel').length) slideNo = $('.stageSlide .slidePanel').length;
        $('.stageSlide').attr('data-current',(slideNo -1)).slidePanel('adjust');
        $('.stageSlide').slidePanel('move');
      }else{
        $('.stageSlide').slidePanel('adjust');
      }
    }
    _currentWidth = $(window).width()
    function getParam(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
  });
  $(window).on('resize', function(){
    if(_currentWidth !== $(window).width()){
      if($('.stageSlide').length) $('.stageSlide').slidePanel('adjust');
    }
    _currentWidth = $(window).width()
  });
  var timer = false;
  $(window).on('scroll touchmove',function(){
    $('.slidePrev').addClass('scroll');
    if( timer !== false ){
      clearTimeout( timer );
    }
    timer = setTimeout( function(){
      $('.slidePrev').removeClass('scroll');
    }, 100 );
  });

  //査定理由(.result-Reason_Btn)をmouseover時の処理
  $(function(){

    var resultReason_Btn = $('.result-Reason_Btn');
    var resultReason_Text = $('.result-Reason_Text');
    $(resultReason_Text).hide();

    //buttonをmouseoverしたとき、mouseoutしたときの指定
    $(resultReason_Btn).mouseover(function () {
      var num = $('.result-Reason_Btn').index(this);
      $(resultReason_Text).eq(num).show();
    });

    $(resultReason_Btn).mouseout(function () {
      var num = $('.result-Reason_Btn').index(this);
      $(resultReason_Text).eq(num).hide();
    });
  });

  // js-window-contributionに関して click時、pop_upで別窓表示
  $('.js-window-contribution').click(function (e) {
    window.open('https://www.netoff.co.jp/smile/contribution_popup.html' ,"", "width=420,height=400,scrollbars=yes");
  });

  $.fn.separationPopup = function(bPopstate) {
    if(typeof bPopstate === 'undefined') bPopstate = false;
    $(document).on('click', 'a', function(e) {
      $(window).off("beforeunload");
    });
    $(document).on('submit', function(e) {
      $(window).off("beforeunload");
    });
    var option = {
      type: 'inline',
      content_source: '#modal-Recommend',
      custom_class: 'modal-Recommend'
    };
    var popup = $('<div />').modaal(option);
    $(document).on('click', '.modal-Recommend_Submit button', function(){
      popup.modaal('close');
    });
    $(window).on('beforeunload', function(e){
      if($('.modaal-wrapper').length){
        $('.modaal-wrapper .modaal-close').eq(0).trigger('click');
      }
      if($.cookie('cv-opened') !== 'true') {
        popup.modaal('open');
        $.cookie('cv-opened', 'true', { expires: 90 });
        $(window).off("beforeunload");
      }
      return '売るなら今です！';
    });
    if(bPopstate){
      history.replaceState('beforeunload', null, null);
      history.pushState(null, null, null);
      $(window).on('popstate', function(e){
        if(!e.originalEvent.state){
          return;
        }
        if(e.originalEvent.state == 'beforeunload'){
          if($('.modaal-wrapper').length){
            $('.modaal-wrapper .modaal-close').eq(0).trigger('click');
          }
          if($.cookie('cv-opened') !== 'true') {
            popup.modaal('open');
            $.cookie('cv-opened', 'true', { expires: 90 });
          }
        }
      });
    }
  };
})(jQuery);
