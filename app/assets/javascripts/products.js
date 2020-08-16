$(function() { 
  //プレビュー用のhtmlを定義
  function buildHTML(index, url) {
    var html = `<div class="preview_image_box" id="preview_image_box__${index}">
                  <div class="upper-box">
                    <img data-index="${index}" src="${url}" alt="preview" width="120px" height="120px" class=""preview_image>
                  </div>
                  <div class="update_box">
                    <div class="js-remove" id="delete_btn_${index}">
                      <span>削除</span>
                    </div>
                  </div>
                </div>`;
    return html;
  }

  // 画像用のinputを生成
  const buildFileField = (num)=> {
    const html = `<div data-index="${num}" class="js-file_group">
                    <input class="js-file" type="file"
                    name="product[images_attributes][${num}][src]"
                    id="product_images_attributes_${num}_src"><br>
                  </div>`;
    return html;
  }

  // image_input_btnのwidth操作
  function setLabel() {
    // プレビューボックスのwidthを取得し、maxから引くことでimage_input_btnのwidthを決定
    var prevContent = $('.image_input_btn').prev();
    labelWidth = (640 - $(prevContent).css('width').replace(/[^0-9]/g, ''));
    $('.image_input_btn').css('width', labelWidth);
  }
  //

  //投稿編集時
  //products/:i/editページへリンクした際のwidth操作
  if (window.location.href.match(/\/products\/\d+\/edit/)) {
    //投稿済み画像のプレビュー表示欄の要素を取得する
    var prevContent = $('.image_input_btn').prev();
    labelWidth = (640 - $(prevContent).css('width').replace(/[^0-9]/g, ''));
    $('.image_input_btn').css('width', labelWidth);
    //プレビューの要素数を取得
    var count = $('.preview_image_box').length;
    //プレビューが５つあるときは、投稿ボックスを消しておく
    if (count == 5) {
      $('.image_input_btn').hide();
    }
  }
  //

  //バリデーションエラーで入力欄に戻った時のwidth操作
  if (window.location.href.match(/\/(products)$/)) {
    //投稿済み画像のプレビュー表示欄の要素を取得する
    var prevContent = $('.image_input_btn').prev();
    labelWidth = (640 - $(prevContent).css('width').replace(/[^0-9]/g, ''));
    $('.image_input_btn').css('width', labelWidth);
    //プレビューの要素数を取得
    var count = $('.preview_image_box').length;
    //プレビューが５つあるときは、投稿ボックスを消しておく
    if (count == 5) {
      $('.image_input_btn').hide();
    }
  }
  //

  // file_fieldのnameに動的なindexをつける為の配列
  let fileIndex = [1,2,3,4,5,6,7,8,9,10];
  // 既に使われているindexを除外
  lastIndex = $('.js-file_group:last').data('index');
  fileIndex.splice(0, lastIndex);
  $('.hidden-destroy').hide();
 
  //画像投稿
  $('#image-box').on('change', '.js-file', function(e) {
    // js-fileのidの数値のみ取得
    var id = $(this).attr('id').replace(/[^0-9]/g, '');
    // image_input_btnのidとforを更新
    $('.image_input_btn').attr({id: `image_input_btn--${id}`, for: `product_images_attributes_${id}_src`});
    // ファイルのブラウザ上でのURLを取得する
    const file = e.target.files[0];
    const blobUrl = window.URL.createObjectURL(file);
    // 該当indexを持つimgがあれば取得して変数imgに入れる(画像変更の処理)
    if (img = $(`img[data-index="${id}"]`)[0]) {
      img.setAttribute('src', blobUrl);
    } else {  // プレビュー追加の処理
      setLabel();
      $('#previews').append(buildHTML(id, blobUrl));
      // fileIndexの先頭の数字を使ってinputを作る
      $('.hidden_post_form').append(buildFileField(fileIndex[0]));
      fileIndex.shift();
      // 末尾の数に1足した数を追加する
      fileIndex.push(fileIndex[fileIndex.length - 1] + 1)
      //image_input_btnのwidth操作
      var count = $('.preview_image_box').length; 
       setLabel();
      //プレビューが5こあったらラベルを隠す
      if (count == 5) {
        $('.image_input_btn').hide();
      }
      // ラベルのオプションを更新する
      $('.image_input_btn').attr({id: `image_input_btn--${fileIndex[0]-1}`, for:`product_images_attributes_${fileIndex[0]-1}_src`});
    }
  });

  //画像の削除
  $('#image-box').on('click', '.js-remove', function() {
    var count = $('.preview_image_box').length;
    setLabel(count);
    //product_images_attributes_${id}_srcのidの数値のみ取得
    var id = $(this).attr('id').replace(/[^0-9]/g, '');
    // 取得したidの該当するプレビューを削除
    $(`#preview_image_box__${id}`).remove();
    // フォームを削除
    $(`#product_images_attributes_${id}__destroy`).prop('checked',true);
    $(`#product_images_attributes_${id}_src`).parent().remove();
    // 画像入力欄が0個にならないようにしておく
    if ($('.js-file').length == 0) $('.hidden_post_form').append(buildFileField(fileIndex[0]));
    // 削除時のラベル操作
    var count = $('.preview_image_box').length;
    // 5個目が消されたらラベルを表示
    if (count == 4) {
      $('.image_input_btn').show();
    }
    //image_input_btnのwidth操作
    setLabel();
  });
});