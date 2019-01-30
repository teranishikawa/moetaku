"use strict";

(function($){

  // モーダルのデフォルト設定を変更する
  $.fn.modaal.options.overlay_opacity = 0.6;

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

  // purchase-Detailの表示・非表示の操作
  $('.purchase-Summary').click(function (e) {
    var $hide_content = $('.purchase-Container');

    // $('.purchase-Container').toggleClass('purchase-Container--active');
    $($hide_content).slideToggle(500);

    if($('i', this).hasClass('fa-chevron-circle-down')){
      $('i', this).removeClass('fa-chevron-circle-down').addClass('fa-times-circle');
    }else{
      $('i', this).addClass('fa-chevron-circle-down').removeClass('fa-times-circle');
    }
  });

  $('.purchase-Close').click(function (e) {
    var $hide_content = $('.purchase-Container');

    // $('.purchase-Container').toggleClass('purchase-Container--active');
    $($hide_content).slideToggle(500);

    if($('i', this).hasClass('fa-chevron-circle-down')){
      $('i', this).removeClass('fa-chevron-circle-down').addClass('fa-times-circle');
    }
    if($('i', '.purchase-Summary').hasClass('fa-times-circle')){
      $('i', '.purchase-Summary').removeClass('fa-times-circle').addClass('fa-chevron-circle-down');
    }
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
      custom_class: 'modal-Recommend',
      width: 540
    };
    var popup = $('<div />').modaal(option);
    var cntBodyon = 0;
    $(document).on('mouseover', 'body', function(){
      cntBodyon += 1;
    });
    $(document).on('mouseleave', '#cv-top, #cv-left', function(){
      if(cntBodyon > 1){
        if($.cookie('cv-opened') !== 'true') {
          if($('.modaal-wrapper').length){
            $('.modaal-wrapper .modaal-close').eq(0).trigger('click');
          }
          popup.modaal('open');
          $.cookie('cv-opened', 'true', { expires: 90 });
        }
      }
    });
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
