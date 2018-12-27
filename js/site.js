"use strict";

(function($){

  // モーダルのデフォルト設定を変更する
  $.fn.modaal.options.overlay_opacity = 0.6;


  // toggleの解除処理を追加
  $(document).on('change', '[data-toggle="other"]:radio', function(event) {
    var $this = $(this);
    $(':radio[name="' + $this.attr('name') + '"]').not($this).each(function(){
      $(this).parents('label.btn').removeClass('active');
    });
  });

  // purchase-Detailの表示表示の操作
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

  $.fn.separationPopup = function(bPopstate = false) {
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
