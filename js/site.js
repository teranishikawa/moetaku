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


  // form-Button_Chara-nene1
  $($('.form-Button_Chara-nene1').children("button")).click(function (e) {
    var $hide_content = $('.form-Button_CharaNene1-list');
    $($hide_content).slideToggle(500);

    if($('i', this).hasClass('fa-chevron-circle-down')){
      $('i', this).removeClass('fa-chevron-circle-down').addClass('fa-times-circle');
    }else{
      $('i', this).addClass('fa-chevron-circle-down').removeClass('fa-times-circle');
    }
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

  $.fn.separationPopup = function() {
    var option = {
      type: 'inline',
      content_source: '#modal-Recommend',
      custom_class: 'modal-Recommend',
      width: 540
    };
    var popup = $('<div />').modaal(option);
    var opened = false;
    var opened2 = false;
    $(document).on('mouseleave', 'body', function(){
      if (!opened2) {
        popup.modaal('open');
        opened2 = true;
      }
    });
    $(document).on('click', '.modal-Recommend_Submit button', function(){
      popup.modaal('close');
    });
    $(window).on('beforeunload', function(e){
      popup.modaal('open');
//      opened = true;
      return '売るなら今です！';
    });
    history.replaceState('beforeunload', null, null);
    history.pushState(null, null, null);
    $(window).on('popstate', function(e){
      if(!e.originalEvent.state){
        return;
      }
      if(e.originalEvent.state == 'beforeunload'){
        if (!opened) {
          popup.modaal('open');
//          opened = true;
        }
      }
    });
  };
})(jQuery);
