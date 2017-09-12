<head>
  <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>-child/y-uploaded/y-style.css">
  <script src="<?php echo get_template_directory_uri(); ?>-child/y-uploaded/jquery-3.1.1.min.js"></script>
  <script src="<?php echo get_template_directory_uri(); ?>-child/y-uploaded/y-script.js"></script>
  <!--DatePicker："https://chmln.github.io/flatpickr/" -->
    <link rel="stylesheet" href="https://unpkg.com/flatpickr/dist/flatpickr.min.css">
    <script src="https://unpkg.com/flatpickr"></script>
 </head>
<body>
<div id="pageall">
<div id="header">
  <form class="search-form" id ='keyword_search' method='post' >
    <div class="jogai">
    <input type="text" class="search-textarea" name="search_word" size="30" placeholder="検索ワード" value="" tabindex=11><br>
    除外リスト<br>
      <?php  for ($i=0; $i <= 3 ; $i++) {
        $input_attr_name = 'keyword_exception'.$i;
        $exception_val = array(0 => "文スト", 1 => "モンスト", 2 => "ストラバ", 3 => "白猫",);
        echo '<input class="search-textarea" type="text" class="jogaiwords" name=" '.
              $i.' " id='.$input_attr_name.' size="8" value="'.$exception_val[$i].'">'.PHP_EOL;
      }?>
    </div>
    <div class="jogai">
      <label>全選択<input id ='all_check' type="checkbox" value="全選択" ></label>
      <button type="button" id ='check_reverse' value="チェック反転" >ﾁｪｸ反転</button><br>
      <button type="button" id='user_search' tabindex=13>Usr検索</button>
      <button type="button" id='create_tweetboxes' tabindex=12>TuiBOX生成</button>
    </div>
  </form>
  <form class="search-form" id ='keyword_search'>
    <div class="jogai">
      検索数<input type="text" name="searchcount" size="3" value="100" class="search-textarea" tabindex=14><br>
      ﾙｰﾌﾟ数<input type="text" name="loopcount" size="3" value="1" class="search-textarea"><br>
      ファボ<input type="text" name="min_fave" size="3" value="0" class="search-textarea"><br>
      RT　　<input type="text" name="min_retw" size="3" value="0" class="search-textarea"><br>
    </div>
    <div class="jogai">
      <button type="button" id ='clean_up'>表示削除</button>
      <button type="button" id='show_values'>変数確認</button>
      <button type="button" id='check_texts'>文字検索?</button>
      <button type="button" id ='filtering'>選ﾂｲのみに</button>
    </div>
  </form>
  <div id="buttons_field"><!-- コンテンツ上部コントロールボックス-->
    <div class="control_box">
      <h3>画面操作</h3>
      <div class="control_box_parts">
        <button type="button" id ='filtering'>選択データのみに</button>
        <!--<label>全選択<input id ='all_check' type="checkbox" value="全選択" ></label> -->
        <button type="button" id='tui_changeto_orgbyid'>RT元に変換</button>
        <button type="button" id='tui_changeto_orgbyid2'>RT元をSQL登録</button>
        <button type="button" id ='check_reverse' value="チェック反転" >
          チェック反転</button><br>
      </div>
    </div>
    <div class="control_box">
      <h3>SQL操作</h3>
      <div class="control_box_parts">
        <h5>Table「tweets」<br></h5>
        <button type="button" id='dbadding'>表示ﾂｲDB登録</button>
        <button type="button" id='dbadding_bycheck'>ﾁｪｸﾂｲDB登録</button>
        <button type="button" id='ranking'>ﾗﾝｷﾝｸﾞ</button>
        <button type="button" id='dbdeleting'>選択ﾂｲDB削除</button>
      </div>
      <div class="control_box_parts">
        <h5>≪DB呼出≫</h5>
        <button type="button" id='dbloading'>DBﾂｲ読込</button>
        <form id="db_count"><input type="number" min=0 style="width:100%;" step=100></form>
      </div>
    </div>
    <div class="control_box">
      <h3>Twitter操作</h3>
      <div class="control_box_parts">
        <textarea id="post_text" rows="1" cols="5"></textarea>
        <button type="button" id='list_adding_chckd'>リスト</button>
        <button type="button" id='post_tweet'>ツイート</button>
      </div>
      <div class="control_box_parts">
        <textarea id="RT_post_text" rows="1" cols="5"></textarea>
        <button type="button" id='post_ret_checked'>RTChckd</button>
        <button type="button" id='post_com_retweet'>ComRT</button>
        <button type="button" id='post_com_ret_checked'>ChkCRT</button>
      </div>
    </div>
    <div class="control_box">
      <h3>Twi操作②</h3>
      <button type="button" id='ikkatsu' tabindex=15>
        ﾁｪｯｸ一括<br>
        (DB･RT･ﾘｽﾄ)
      </button>
      <button type="button" id='test_button_datepick' tabindex=15>
        てす
      </button>
    </div>
    <div class="control_box">
      <h3>SQL操作</h3>
      <h5>Table「user_list」<br></h5>
      <h5>※現在停止中※<br></h5>
      <button type="button" id ='SQL_userlist_loading' value="実験" >
        SLQユーザLOAD</button>
      <button type="button" id ='SQL_userlist_adding' value="実験" >
        SLQユーザSAVE</button>
    </div>
    <div class="control_box">
      <div class="control_box_parts">
        <h5>フィールド０<br></h5>
        <p>
          <button type="button" id='post_ajax_postlistload'>Aja記事一覧</button>
          <button type="button" id='post_test_ajax'>ｘ記事PostByAjax</button>
          <button type="button" id='post_test_wppost'>ｘ投稿p-wp経由</button>
        </p>
      </div>
      <div class="control_box_parts">
        <p id="field_navi_next"></p>
        <button type="button" id='before_HTML'>ﾂｲｿｰｽ化</button>
        <button type="button" id='ranking_HTML'>ﾗﾝｸｿｰｽ化</button>
        <input type="date" name="input_date" style="width:60%; font-size:0.8em;" value="<?PHP
         $tomorrow  = mktime(0, 0, 0, date("m")  , date("d"), date("Y"));
         $today = date("Y-n-d",$tomorrow); echo $today;
         ?>">
        <button type="button" id='input_date_reset'>今日</button>
      </div>
    </div>
    <div class="control_box">
      <h5>テストSQL<br></h5>
        <button type="button" id='tui_list_to_HTML'>#TLｿｰｽ</button>
        <button type="button" id='tui_ranking_bydate'>DB週ﾗﾝ</button>
        <button type="button" id='dbloading_bydate'>日付DB読み込み</button>
        <input class="flatpickr flatpickr-input" id="dbloading_startdate" placeholder="Start Date.."
         readonly="readonly" type="text" style="width:60%; font-size:0.8em;" value="<?PHP
          $tomorrow  = mktime(0, 0, 0, date("m")  , date("d")-7, date("Y"));
          $today = date("Y-n-d",$tomorrow); echo $today;
          ?>">
        <input class="flatpickr flatpickr-input" id="dbloading_enddate" placeholder="End Date.."
         readonly="readonly" type="text" style="width:60%; font-size:0.8em;" value="<?PHP
          $tomorrow  = mktime(0, 0, 0, date("m")  , date("d"), date("Y"));
          $today = date("Y-n-d",$tomorrow); echo $today;
          ?>">
    </div>
  </div>
</div>

<div id="content">
  <div id="container">
    <ul id="latest-posts">ul latest-posts<br><!-- post_test_ajax参照先-->
    </ul>
    「Container」<br>
    <div id="search_result"></div>
    <div id="tui_list">
    </div>
    <textarea id='souce_text'></textarea>
  </div>
  <div class="right_column">
    <p id="twitter_links">
      <a class="twitter-timeline" data-lang="ja" data-width="300" data-height="350" data-theme="dark"
       data-link-color="#E95F28" href="https://twitter.com/puapot" target="_blank">Tweets by puapot</a>
      <!-- <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>  -->
    </p>
    <p id="wp_post-form">
      タイトル<br>
      <input type="text" id="post_title">
      本文<br>
      <textarea id="y-wp_post_text"></textarea>
      <button id="y-wp_post_button">投稿</button>
    </p>
    <p id="user_joho">
      <h4>ユーザーリスト</h4>
      <div id="user_list"></div>
    </p>
    <p><?php
       $examplePost = get_post();
       echo "Post ID：".$examplePost->ID; // 投稿 ID を出力
       echo "<br>TemplateDir：".get_template_directory_uri();
       echo "<br>SiteURL：".site_url();
       echo "<br>FileName：".basename(__FILE__);
       echo "<br>FileDir：".dirname(__FILE__);
       echo "<br>File：".__FILE__;
       echo "<br>ABSPATH：".ABSPATH;

    ?></p>
  </div>
  <div class="right_column">
    <div  id="response">
      <h4  style="">「ログ表示」</h4>
        <ul class="return_log" id="return_log">log1<br></ul>
        <ul class="return_log" id="return_log2">log2<br></ul>
        <ul class="return_log" id="return_log3">log3<br></ul>
        <ul class="return_log" id="return_log4">log4<br></ul>
        <ul class="return_log" id="return_log5">log5<br></ul>
    </div>
  </div>
</div>


</body>
