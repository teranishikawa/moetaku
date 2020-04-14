"use strict";

(function($){
  
  /*******
    ダンボール必要数シミュレーター
  ********/
  
  //各フィギュアのポイント
  const FIGURE_POINTS = {
    "prizeS" : 3.3,
    "prizeL" : 10,
    "nendo" : 4,
    "scalefig" : 19,
    "plamodel" : 8
  };
  //各箱サイズの収納ポイント
  const BOX_POINTS = {
    "S" : 10,
    "M" : 20,
    "L" : 130
  };
  //入力最大点数
  const MAX_INPUT_NUM = 300;
  
  
  /*******
    スマホの場合
    selectにoption追加
  ********/
  var $simuDetailNum;
  var simuDetailVal = "";
  var simuEvents = "input";//keyup input change
  var isPC = true;
  
  if( $('.simu-Container .form-Select').length > 0 ) {
    $('.simu-Container .form-Select').each(function(){
      var option = "";
      for( var i = 0; i <= MAX_INPUT_NUM; i++ ) {
        option += '<option value="' + i + '">' + i + '</option>'
      }
      $(this).append(option);
    });
    
    $simuDetailNum = $('.simu-Detail_Container .form-Select');
    simuDetailVal = 0;
    simuEvents = "change";
    isPC = false;
  } else {
    $simuDetailNum = $('.simu-Detail_Container .form-InputText');
  }
  
  /*******
    アコーディオン処理
  ********/
  $('.simu-Btn').on('click', function (e) {
    $(this).siblings('.simu-Container').slideToggle(500, function(){
      if( !isPC ) {
        $('.stageSlide').css({height: $(this).parents('.slideInner').outerHeight() + ($(window).width() * 0.2)});
      }
    });
    
    $(this).toggleClass('open');
  });
  $('.simu-DetailBtn').on('click', function (e) {
    $(this).siblings('.simu-Detail_Container').slideToggle(500, function(){
      if( !isPC ) {
        $('.stageSlide').css({height: $(this).parents('.slideInner').outerHeight() + ($(window).width() * 0.2)});
      }
    });

    $(this).toggleClass('open');
    
    //フィギュア入力は無効化
    var isDetailOpen = $(this).hasClass('open');
    $('#simu-figure').prop('disabled', isDetailOpen);
    $simuDetailNum.prop('disabled', !isDetailOpen);
    outputResult( isDetailOpen );
    
  });
  
  /*******
    計算処理
  ********/
  
  //ざっくり計算
  $('#simu-figure').on(simuEvents, function(e){
    optimizeValue( $(this) );
    outputResult( false );
  });
  
  //もっと詳しく計算
  $simuDetailNum.on(simuEvents, function(e){
    optimizeValue( $(this) );
    outputResult( true );
  });
  
  //入力値を最適化
  function optimizeValue($formItem){
    var figureNum = convertNumber( $formItem.val(), MAX_INPUT_NUM );
    $formItem.val( figureNum || simuDetailVal );
  }
  
  //結果出力
  function outputResult( isDetail ){
    var result;
    var resultText = "";
    
    if( !isDetail ) {
      result = calcBoxNum( $('#simu-figure').val() * FIGURE_POINTS.prizeL, false );
      
    } else {
      var objName;
      var isLarge = false;
      var totalPoints = 0;
      $simuDetailNum.each( function(){
        var val = convertNumber( $(this).val(), MAX_INPUT_NUM );
        if( val !== "" && val !== 0 ) {
          objName = $(this).attr( 'id' ).substr( 5 );
          totalPoints += val * FIGURE_POINTS[objName];
          if( objName === 'scalefig' ){
            isLarge = true;
          }
        }
      });
      result = calcBoxNum( totalPoints, isLarge );
    }
    
    if( result.size !== "" ) {
      resultText = result.size + "<small>サイズ</small>";
    }
    resultText += result.num;
    
    $('#simu-result').html( resultText );
    
    //箱数選択にシミュレーション結果を反映させる
    for( var i=1; i<=3; i++ ){
      var num = result.sizeNo === i ? Math.min(result.num, 20) : 0;
      $('select[name=kitBox'+i+']').val(num);
    }
    $('select[name=kitBox1]').trigger( 'change' );
  }
  
  
  /*******
    収納ポイント(points)から箱数を計算
    大箱フラグ(isLarge)がtrueならすべて大箱での計算
    
    【計算ロジック】
    ①箱のサイズは、複数サイズの組み合わせはなし。「大１、中１」という回答はでない。
    
    ②箱の結果は、「サイズが合う＆箱数が少ないものを優先」される。
    （※フィギュアが合計で「２１ポイント以上場合」はすべて大箱のみの案内になる。）
      合計10以下⇒小1
      合計11～20⇒中1
      合計21以上⇒大**
      
    ③スケールフィギュアが１でもついた場合は、すべて大箱での案内計算になる。
  ********/
  function calcBoxNum( points, isLarge ) {
    var result = {size:'', sizeNo:0, num: 0};
    
    if( points > 0 ) {
      if( isLarge || points > BOX_POINTS.M ) {
        result = {size:'大', sizeNo:1, num: Math.ceil( points / BOX_POINTS.L )};
      } else if( points <= BOX_POINTS.S ) {
        result = {size:'小', sizeNo:3, num: 1};
      } else if( points <= BOX_POINTS.M ) {
        result = {size:'中', sizeNo:2, num: 1};
      }
    }
    
    return result;
  }
  
  
  /*******
    入力値(val)を指定数値(maxNum)以下にまるめる
    （数値以外の入力値は空値、負数は0、小数点以下は切り上げ）
  ********/
  function convertNumber( val, maxNum ) {
    //空白削除
    val = val.replace(/\s+/g, '');
    
    //半角に変換
    var num = val.replace(/[０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
    });

    //数値でなければ空にする
    if( isNaN(num) ) {
      num = '';
    } else {
      //maxNum以上は切り捨て
      if( num > maxNum ) {
        num = maxNum;
      }

      //0以下は切り上げ
      if( num < 0 ) {
        num = 0;
      }

      //小数点は切り捨て
      num = Math.floor( num );
    }
    return num;
  }
  
})(jQuery);
