$(document).ready(function(){
  //０：プラグイン系
    //flatpickr(日付入力)
      $(".flatpickr").flatpickr( );

  //①＜＜＜初期設定＆グローバル変数定義
    var today = new Date();
    var tui_data_SHOW=[];
    var checked_tui_data_key = "";
    var tui_data_CHECKED = [];
    var max_id="999999999999999999";
    function shokika(){
      $("#user_list").text("");
      $("#tui_list").text("");
      $("#return_log").text("");
      $("#return_log2").text("");
      $("#search_result").text("");
      $('input[type="checkbox"]').prop('checked',false);
      tui_data_SHOW=[];
      checked_tui_data_key = "";
      tui_data_CHECKED = [];
      max_id="999999999999999999";
    }
    upload_directory="http://nanpa-matome.com/wp-content/themes/simplicity2-child/y-uploaded/";
    root_directory= "http://nanpa-matome.com/wp-content/themes/simplicity2-child/";
    shokika();
    function make_navi(){
      $("#field_navi_next").html("<button type='button' id ='navi_next'>続きを読み込む</button>");
    }
    $(document).on('click','button#navi_next',function(){
        console.log(max_id);
        get_tweets();
      });
    $('button#clean_up').click(function(){
        shokika();
      });
    $('button#check_texts').click(function(){//作りかけ。Tuidataのテキスト部抽出？
      var post_tweet_type = "check_texts";
      $.post(upload_directory+"/y-twitter_control.php",{tui_data_SHOW, post_tweet_type},function(data){
        $("#search_result").prepend("投稿内容「<br>"+data+"<bR>」");
        var tempArray = data.split(", ");
        console.log(tempArray);
      });
    });
  //HTML化の試作
  //日付の部分
    $('button#input_date_reset').click(function(){
      var yyyy_mm_dd = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
      $('input[name=input_date]').val(yyyy_mm_dd);
    });
  //ソース生成
    $('.accordion').click(function() {
      // メニュー表示/非表示
      console.log("aaaaa");
      $(this).next('ul').slideToggle('fast');
    });
  //ツイート機能
    function list_adding_chckd(){
      var post_tweet_type = "list_adding";
      var checked_tui_data_key = $('.tui_check:checked').map(function() {return $(this).val();}).get();
      var ids =[];
      var n=0;
      $.each(checked_tui_data_key,function(idx,obj){
        ids[n] = tui_data_SHOW[obj]["user_id"];
        console.log(tui_data_SHOW[obj]["user_id"]);
        n++;
      });
      $.post(upload_directory+"/y-twitter_control.php",{ids, post_tweet_type},function(data){
        $("#return_log4").prepend("[追加UserID]<p style='margin: 2 8px;''>"+data+"</p><br>");
      });
    }
    $('button#list_adding_chckd').click(function(){//Twitterのリストに追加
      list_adding_chckd();
    });
    $('button#post_tweet').click(function(){
        var post_tweet_type = "text";
        var text = $("textarea#post_text").val();
        $("#search_result").append("PUAPOTから投稿");
        $.post(upload_directory+"/y-twitter_control.php",{text, post_tweet_type},function(data){
          $("#return_log").prepend("[投稿内容]"+data+"");
        });
      });
    function post_ret_checked(){
      var post_tweet_type = "ret_checked";
      var checked_tui_data_key = $('.tui_check:checked').map(function() {return $(this).val();}).get();
      var ids=[];
      var name=[];
      $.each(checked_tui_data_key,function(idx,obj){
        ids[idx] = tui_data_SHOW[obj]["tweet_id"];
        name[idx] = tui_data_SHOW[obj]["user_name"].slice(0,6);
      });
      $.post(upload_directory+"/y-twitter_control.php",{name, ids, post_tweet_type},function(data){
        $("#return_log2").prepend("[RTしたID]<p style='margin: 2 8px;''>"+data+"</p>");
      });
    };
    $('button#post_ret_checked').click(function(){
      post_ret_checked();
    });
    $('button#post_com_retweet').click(function(){//未完成
      var post_tweet_type = "com_retweet";
      var text = $("textarea#post_text").val();
      $.post(upload_directory+"/y-twitter_control.php",{text, post_tweet_type},function(data){
        $("#return_log").prepend("リツイ「添え文"+$("textarea#post_text").val()+"　ツイートID："+data+"」");
      });
    });
    $('button#post_com_ret_checked').click(function(){//未完成
      var post_tweet_type = "com_retweet2";
      var text = $("textarea#RT_post_text").val();
      tui_data_reconstruct_by_checkbox(tui_data_SHOW);
      var ids=[];
      var screen_names=[];
      $.each(tui_data_CHECKED,function(idx,obj){
        ids[idx] = tui_data_CHECKED[idx]["tweet_id"];
        screen_names[idx] = tui_data_CHECKED[idx]["screen_name"];
      });
      $.post(upload_directory+"/y-twitter_control.php",{text, ids, screen_names, post_tweet_type},function(data){
        $("#tui_list").append("リツイ「添え文"+$("textarea#post_text").val()+"　ツイートID："+data+"」");
      });

    });
  //SQLボタン
    $('button#dbdeleting').click(function(){
      //SQLテーブルにtui_data登録(y-tuilist_adding.php)
        var checked_tui_data_key = $('.tui_check:checked').map(function() {return $(this).val();}).get();
      var sql_job_name ="tuilist_deleting";
      var ids = [];
      var n =0;
      var text =";";
      $.each(checked_tui_data_key,function(idx,obj){
        ids[n] = tui_data_SHOW[obj]["tweet_id"];
        text= text + tui_data_SHOW[obj]["user_name"].substr(0,(15))+"："
        +tui_data_SHOW[obj]["text"].substr(0,(15))+"\n";
        n = n+1;
      });
      console.log(ids);
      if(!confirm('本当に削除しますか？\n'+text)){
        /* キャンセルの時の処理 */
        return false;
      }else{
          /*　OKの時の処理 */
          $.post(upload_directory+"/y-SQL.php",{ids, sql_job_name},function(data){
            $("#return_log").prepend("削除："+data);
        });
      }
    });
    $('button#dbadding').click(function(){
      //SQLテーブルにtui_data登録(y-tuilist_adding.php)
      var tui_data = tui_data_SHOW;
      dbadding(tui_data);
    });
    function dbadding_bycheck(){
      //SQLテーブルにtui_data登録(y-tuilist_adding.php)
      $.when(
        tui_data_reconstruct_by_checkbox(tui_data_SHOW)
      ).done(function(){
        dbadding(tui_data_CHECKED)
      });
    }
    $('button#dbadding_bycheck').click(function(){
      dbadding_bycheck();
    });
    function dbadding(tui_data){
      var sql_job_name ="tuilist_adding";
      $.post(upload_directory+"/y-SQL.php",{tui_data, sql_job_name},function(data){
        $("#return_log3").prepend(data);
      });
    }
    $('button#dbloading').click(function(){
      //SQLテーブルにtui_data登録(y-tuilist_adding.php)
      var sql_job_name = 'tuilist_loading';
      var num = $("#db_count").val();
      $("#db_count").val(parseInt(num)+100);
      console.log(num);
      $("#return_log").prepend("DBloading開始 =>");
      $.post(upload_directory+"/y-SQL.php",{sql_job_name, num },function(data){
        console.log(data);
        tuidata_callback_func(data);
      });
    });
    $('button#dbloading_bydate').click(function(){
      //SQLテーブルにtui_data登録(y-tuilist_adding.php)
      var sql_job_name = 'tuilist_loading_bydate';
      var date_start = $('#dbloading_startdate').val();
      var date_end=$('#dbloading_enddate').val();
      console.log(date_end+date_start);
      $("#return_log").prepend("DBloading開始 =>");
      $.post(upload_directory+"/y-SQL.php",{sql_job_name,date_end,date_start },function(data){
        console.log(data);
        tuidata_callback_func(data);
      });
    });
    $('button#ranking_HTML').click(function(){
      //SQLテーブルにtui_data登録(y-tuilist_adding.php)
      var sql_job_name = 'tui_ranking';
      $.post(upload_directory+"/y-SQL.php",{sql_job_name },function(data){
        var rank_data =data;
        rank_data = JSON.parse(rank_data);
        var table_html ='<table class="ranking-list"><form>'+'<tr><th>No</th><th>ID</th><th>名前</th><th>ユーザID</th></tr>';
        $.each(rank_data, function(idx, obj){
          var row ='<tr><th>'+idx+'<input type="checkbox"'
          +'value=""></th><th>'+obj.tui_count
          +'</th><th>'+obj.user_name+'</th>'
          +'<th><a  href="https://twitter.com/'+obj.screen_name
          +'" target="_blank">'+obj.screen_name+'</a>'
          +'</th></tr>';
          table_html = table_html + row;
        });
        table_html=table_html + '</form></table>';
        $("#souce_text").text("");
        $("#tui_list").append(table_html);
        $("#souce_text").text(table_html);
        $("#souce_text").prepend("ソース<br>");
        $("#return_log").prepend("ランキング表示<br>");
      });
    });
    $('button#ranking').click(function(){
      //SQLテーブルにtui_data登録(y-tuilist_adding.php)
      var sql_job_name = 'tui_ranking';
      $.post(upload_directory+"/y-SQL.php",{sql_job_name },function(data){
        var rank_data =data;
        rank_data = JSON.parse(rank_data);
        var table_html ='<table class="ranking-list"><form>'+'<tr><th>No</th><th>ID</th><th>名前</th><th>ユーザID</th></tr>';
        $.each(rank_data, function(idx, obj){
          var row ='<tr><th>'+idx+'<input type="checkbox"'
          +'value=""></th><th>'+obj.tui_count
          +'</th><th><a class="userdata_to_tuilist" href="" name="'+obj.screen_name+'">'
          +'[TL表示]'+'</a>：'+obj.user_name+'</th>'
          +'<th><a  href="https://twitter.com/'+obj.screen_name
          +'" target="_blank">'+obj.screen_name+'</a>'
          +'</th></tr>';
          table_html = table_html + row;
        });
        table_html=table_html + '</form></table>';
        $("#tui_list").text("");
        $("#tui_list").append(table_html);
        $("#return_log").prepend("ランキング表示<br>");
      });
    });
    $('button#tui_ranking_bydate').click(function(){
      //SQLテーブルにtui_data登録(y-tuilist_adding.php)
      var sql_job_name = 'tui_ranking_bydate';
      var date_end = $('#dbloading_startdate').val();
      var date_start=$('#dbloading_enddate').val();
      $.post(upload_directory+"/y-SQL.php",{sql_job_name, date_end, date_start },function(data){
        var rank_data =data;
        rank_data = JSON.parse(rank_data);
        var table_html ='<table class="ranking-list"><form>'+'<tr><th>No</th><th>ID</th><th>名前</th><th>ユーザID</th></tr>';
        $.each(rank_data, function(idx, obj){
          var row ='<tr><th>'+idx+'</th><th>'+obj.tui_count
          +'</th><th>'+obj.user_name +'</th>'
          +'<th><a  href="https://twitter.com/'+obj.screen_name
          +'" target="_blank">'+obj.screen_name+'</a>'
          +'</th></tr>';
          table_html = table_html + row;
        });
        table_html=table_html + '</form></table>';
        $("#tui_list").text("");
        $("#tui_list").append(table_html);
        $("#return_log").prepend("ランキング表示<br>");
        var aaa = $("#tui_list").html();
        $("#souce_text").text(aaa);
        console.log(aaa);
        console.log($("#souce_text").text());
      });
    });
  //ユーザ(tui_user_data)生成・検索
    $('button#user_search').click(function(){
      shokika();
      var q = $('input:text[name="search_word"]').val();
      var post_tweet_type = "search_users";
      var loopcount=$('input:text[name="loopcount"]').val();
      var searchcount=$('input:text[name="searchcount"]').val();
      $("#search_result").text("");
      $("#search_result").append("検索ワード："+q+"/検索数："+searchcount*loopcount+"("+searchcount+"×"+loopcount+")<br>");
      $("#tui_list").text("");
      for (var i = 1; i <= loopcount ; i++) {
        $.post(upload_directory+"/y-twitter_control.php",{searchcount, loopcount, i,q, post_tweet_type},userdata_callback_func);//function(data){console.log(data);});
      }
    });
    function userdata_callback_func(userJSON){
      console.log("戻りuserJSON");
      console.log(userJSON);
      var array = JSON.parse(userJSON);   //$("#tui_list").append(tui_data_JSON);
      make_userbox(array);
    }
    $(document).on("click", 'a.userdata_to_tuilist',function(e){//UsrSrch⇒UsrTL //UserBox⇒UserTL
      e.preventDefault();
      var screen_name=$(this).attr("name")
      //console.log(screen_name);
      $("#tui_list").text("");
      get_timeline(screen_name,max_id);
    });
    function make_userbox(tui_user_data){
      var n = Object.keys(tui_user_data).length;//tui_dataの総数
      $.each(tui_user_data,function(idx,obj){
        var userbox_obj=[];
        userbox_obj[idx]=
        '<div class="m-tubox" style="background-image: url('+obj.profile_banner_url+');">'
          +'<div class="m-tubox-main">'
            +'<a href="https://twitter.com/'+obj.screen_name+'" target="_blank">'
              +'<div class="m-tubox-thumb" style="background-image: url('+obj.profile_image_url+');"></div>'
            +'</a>'
            +'<div class="m-tubox-info">'
              +'<h3>'+obj.name+'</h3>'+'<a class="userdata_to_tuilist" href="" name="'+obj.screen_name+'">'
              +obj.screen_name+'</a>'
            +'</div>'
            +'<div class="m-tubox-prof_desc">'
              +'<p>'+obj.description+'</p>'
            +'</div>'
          +'</div>'
        +'</div>';
        $("#tui_list").append(userbox_obj[idx]);
        $("#return_log").prepend("「"+obj.name+"」、");
      });
    }
  //②ツイート(tui_list/tweetbox)生成・検索
    //０
      $('button#create_tweetboxes').click(function(){//get_tweets=>tuidata_callback_func=>make_tweetbox
        shokika();
        get_tweets();//グローバル変数tui_dataでtui_listを生成
      });
      function get_tweets(){    //APIからツイートデータ取得⇒戻り値：tui_data(JSON)
        var post_tweet_type="search_tweets";
        var searchcount=$('input:text[name="searchcount"]').val();
        var loopcount=$('input:text[name="loopcount"]').val();
        var search_min_fave=$('input:text[name="min_fave"]').val();
        var search_min_retw=$('input:text[name="min_retw"]').val();
        var search_word =$('input:text[name="search_word"]').val();
        var search_except="";
        var date_until = $('input[name=input_date]').val();
        $('input:text.jogaiwords').each(function(){
          if ($(this).val()!=="") {
            search_except += " -"+$(this).val();
          }
        });
        $("#search_result").text("");
        $("#search_result").append("検索ワード："+search_word+" (除外："+search_except+")<br>");
        $("#search_result").append("検索総計："+searchcount*loopcount+" (検索数："+searchcount+"/ループ数："+loopcount+")");
        for (var i = 0; i < loopcount; i++) {
          console.log("MAX-ID="+max_id);
          $.post(upload_directory+"/y-twitter_control.php",
          {search_word,search_except, post_tweet_type, searchcount,loopcount,search_min_fave,
            search_min_retw, max_id, date_until},function(data){
              tuidata_callback_func(data);
            });
        }
        }
      function tuidata_callback_func(tuiJSON){
        //$("#tui_list").append(data);//  make_tweetbox(tui_data_ARRAY);
        console.log("戻りtuiJSON");
        //console.log(tuiJSON);
        tui_data = tuiJSON;//PHPから受けたJSON構造の文字列tui_dataを「tui_data_JSON」に格納！！！
        tui_data = JSON.parse(tui_data);   //$("#tui_list").append(tui_data_JSON);
        if (tui_data==null) {
          console.log("nullです。");
          $("#return_log").prepend("検索結果がありませんでした。");
          return false;
        }
        var tui_max = Object.keys(tui_data).length;
        console.log("要素数は"+tui_max);
        max_id = tui_data[tui_max-1].tweet_id
        make_tweetbox(tui_data);
        create_userlist(tui_data);
        $("#return_log").prepend("CallBack終了=>");
      }
      function make_tweetbox_HTML(tui_data){
        var tuiboxHTML_array=[];
        $.each(tui_data_SHOW,function(idx,obj){
          console.log(idx); console.log(obj); console.log(obj.text);
          tweetbox_index = idx ;
          tuiboxHTML_array[idx]= '<div class="m-tweetbox" id="' + tweetbox_index +'" style="background-image: url('+obj.media_url +');">'+
            '  <div class="mp-teetbox-thumb"><img alt="" src=" '+obj.icon_url  +' "></div>'+
            '  <div class="mp-tweetbox-meta">'+
            '    <li>「' +tweetbox_index+ '」' +obj.user_name +'@'+obj.screen_name  +'</li>'+
            '    <li ><a target="_blank" href="'+obj.url  +'">    '+obj.updated  +'</a></li>'+
            '    <li>Tweet ID:'+obj.tweet_id  +'</li>'+
            '    <li>User ID:'+obj.user_id  +'</li>'+
            '  </div>'+
            '  <div class="mp-tweetbox-tweet">'+
            '  <label>'+tweetbox_index+'<input class="tui_check" name="check[]" '+
            '  type="checkbox" value="'+ tweetbox_index +'" checkbox="" tabindex=" '+100 + parseInt(tweetbox_index)+' "></label>'+
            '    '+obj.text  +
            '  </div>'+
            '</div>';
        });
        return tuiboxHTML_array;
      }
      function make_tweetbox(tui_data){
        $("#tui_list").text("");
        var n = Object.keys(tui_data_SHOW).length;//tui_dataの総数
        var m = n;
        $.each(tui_data,function(idx,obj){
          console.log(idx);
          console.log(obj);
          tui_data_SHOW.push(obj);
          //tui_data_SHOW[m]=obj;
          m++;
        });
        //tui_data_SHOW = tui_data_SHOW.concat(tui_data);
        console.log(tui_data_SHOW);
        $("#tui_list").prepend(n+"個<br>");
        var tuiboxHTML_array=make_tweetbox_HTML(tui_data_SHOW);
        $.each(tuiboxHTML_array,function(idx, obj){
          $("#tui_list").append(obj);
          $("#return_log").prepend("「"+obj.user_name+"」、");
        });
        $("#return_log").prepend("MkTwiBox終了<br>");
        make_navi();
      }
    //１TimeLine表示系
      $(document).on("click", 'a.userdata_to_tuilist2',function(e){//UsrSrch⇒UsrTL　//上部・次のページへ
        e.preventDefault();
        var screen_name=$(this).attr("name")
        var max_id=$(this).attr("href")
        get_timeline(screen_name, max_id);
      });
      $(document).on("click", 'a.userdata_to_tuilist3',function(e){//UsrSrch⇒UsrTL　//下部・続き読み込み
        e.preventDefault();
        var screen_name=$(this).attr("name")
        var max_id=$(this).attr("href")
        //console.log(screen_name);
        $("#tui_list").text("");
        get_timeline(screen_name, max_id);
      });
      function get_timeline(screen_name, max_id){//TL取得＆TL表示生成
        //[Set_searching_methods]
          var post_tweet_type = "timeline_search";
          var search_name = screen_name;
          var searchcount=$('input:text[name="searchcount"]').val();
        //Posting&Get_TWEETS
          $.post(upload_directory+"/y-twitter_control.php",
          {max_id,screen_name,post_tweet_type, searchcount},
          function(data){
            tui_data = data;
            console.log(data);
            tui_data = JSON.parse(tui_data);
            console.log(tui_data);
            var count_SHOW = Object.keys(tui_data_SHOW).length; //元のSHOW数
            var count_tuidata = Object.keys(tui_data).length; //元のtui_data数
          //[Contain tui_data-->tui_data_SHOW]
          //[Making BOXES by SHOW]
            for (var i = 0; i < count_tuidata; i++) {
                var box_n = count_SHOW+i;
                tui_data_SHOW[box_n]=tui_data[i];
                $("#tui_list").append(''+
                '<div class="m-usertlbox" id="'
                + box_n +'" style="background-image: url('+tui_data_SHOW[box_n]['media_url'] +');">'+
                '  <div class="mp-usertlbox-meta">'+
                '    <li>「' +box_n+ '」'
                  +'<a target="_blank" href="'+tui_data_SHOW[box_n]['url']  +'">'+tui_data_SHOW[box_n]['updated']  +'</a></li>'+
                '    <li>Tweet ID:'+tui_data_SHOW[box_n]['tweet_id']  +'</li>'+
                '  </div>'+
                '  <div class="mp-usertlbox-tweet">'+
                '    <label>'+i+'<input class="tui_check" name="check[]" '+
                '    type="checkbox" value="'+ box_n +'" checkbox="" tabindex=" '+100 + parseInt(box_n)+' "></label>'+
              '    '+tui_data_SHOW[box_n]['text']  +
                '  </div>'+
                '</div>'+
                '');
              max_id =tui_data_SHOW[box_n]['tweet_id'];
            };
            $("#search_result").text( tui_data_SHOW[1]['user_name']+"～"+tui_data_SHOW[1]['screen_name']+"～<br>"+ count_SHOW+"個(トータル："+count_SHOW+")<br>");
            $(".userdata_to_tuilist2").remove();
            $(".userdata_to_tuilist3").remove();
            $("#tui_list").append('<br><a class="userdata_to_tuilist2" href="'+max_id+'" name="'+screen_name+'">[続きを読み込み]</a>   ');
            $("#search_result").append('<br><a class="userdata_to_tuilist3" href="'+max_id+'" name="'+screen_name+'">[次のページへ]</a>');
            console.log("Box数："+count_SHOW);
          });
        }
    //２「生成byチェック」：tui_listチェック状態取得⇒tui_data再構⇒tui_list生成
      $('button#filtering').click(function(){
        //tui_dataとcheckを元に、tui_listを更新。
        $.when(
          tui_data_reconstruct_by_checkbox(tui_data_SHOW),
          //tui_data再構成＋make_tweetboxに接続
        ).done(function(){
          tui_data_SHOW=[];
          console.log(tui_data_CHECKED);
          make_tweetbox(tui_data_CHECKED);//tui_list再生成
        });
      });
      function tui_data_reconstruct_by_checkbox(tui_data){
        //tui_listのチェック状態を格納
          var checked_tui_data_key = $('.tui_check:checked').map(function() {return $(this).val();}).get();
        var n =0;
        console.log(checked_tui_data_key);
        $.each(checked_tui_data_key, function(idx_idx, idx_obj){
          $.each(tui_data, function(arr_idx, arr_obj){
            if(arr_idx == idx_obj){
              tui_data_CHECKED[n]=tui_data[arr_idx];
              n = n+1;
            }
          });
        });
        console.log(tui_data_CHECKED);
        $("#return_log").prepend("CheckReconstructCallBack終了=>");
        //return tui_data_CHECKED;
      }
    //３RT操作
      $('button#tui_changeto_orgbyid').click(function(){
        var post_tweet_type ="tui_lookup"
        var id_arr=[], id ="";
        var checked_tui_data_key = $('.tui_check:checked').map(function() {return $(this).val();}).get();
        $.each(checked_tui_data_key, function(idx, obj){
          id=id+', '+tui_data_SHOW[obj]['tweet_id'];
          id_arr[idx]=tui_data_SHOW[obj]['tweet_id'];
        });
        console.log(id_arr);
        $.post(upload_directory+"/y-twitter_control.php",
          {post_tweet_type, id_arr},
          function(data){
            console.log(data);
            tui_data_SHOW=[];
            tuidata_callback_func(data);
        });
      });
      $('button#tui_changeto_orgbyid2').click(function(){
        var post_tweet_type ="tui_lookup"
        var id_arr=[], id ="";
        var checked_tui_data_key = $('.tui_check:checked').map(function() {return $(this).val();}).get();
        $.each(checked_tui_data_key, function(idx, obj){
          id=id+', '+tui_data_SHOW[obj]['tweet_id'];
          id_arr[idx]=tui_data_SHOW[obj]['tweet_id'];
        });
        console.log(id_arr);
        $.post(upload_directory+"/y-twitter_control.php",
          {post_tweet_type, id_arr},
          function(data){
            console.log(data);
            //$("#tui_list").append(tui_data_JSON);
            tui_data = JSON.parse(data);
            //make_tweetbox(tui_data);
            //SQLadding
            var sql_job_name ="tuilist_adding";
            $.post(upload_directory+"/y-SQL.php",{tui_data, sql_job_name},function(data){
              $("#return_log").prepend(data);
              console.log("#SQLに登録しました。");
            });
        });
      });
  //③tui_listチェックボックス操作
    $('input#all_check').click(function(){//チェックボックスの全選択・全解除
      if(this.checked){
        $('.tui_check').attr('checked','checked');
      }else{
        $('.tui_check').removeAttr('checked');
      }
    });
    $('button#check_reverse').click(function(){//チェックの反転
      $('.tui_check').prop('checked', function( index, prop ){return !prop;});
    });
  //④右サイドカラム操作
    function create_userlist(tui_data){
      var table_html ='<table class="id-name-list"><form>'+'<tr><th>No</th><th>ID</th><th>名前</th></tr>';
      $("#user_list").text("");
      $.each(tui_data, function(idx, obj){
        var row ='<tr><th>'+idx+'<input type="checkbox" value=""></th><th>'+obj.user_id+'</th><th>'+obj.user_name+'</th></tr>';
        table_html = table_html + row;
      });
      table_html=table_html + '</form></table>';
      $("#user_list").append(table_html);
    }
/*【全コード終】*/
  $('button#ikkatsu').click(function(){//SQL登録、Twitterリスト登録、RTの３つ同時実行
    post_ret_checked();
    dbadding_bycheck();
    list_adding_chckd();
  });
  $('button#post_ajax_postlistload').click(function(){
    var url = 'http://nanpa-matome.com/wp-json/wp/v2/posts';
    var n;
    $.ajax({
      url: url,
      dataType: 'json',
      type: 'get',
      cache: false,
      success: function(dataarr) {
        $.each(dataarr, function(idx, data){
          n++;
          console.log(data);
          var li = $('<li class="kiji" id="kiji' + n + '">');
          li.append('<h2>').text(data.title.rendered);
          li.append(data.content.rendered);
          $('ul#latest-posts').append(li);
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  });

//ajaxによるWQ-APIでの新規投稿
/////////////////////////////////
  $('button#tui_list_to_HTML').click(function(){
    var aaa = $("#tui_list").html();
    console.log(aaa);
    $('textarea#y-wp_post_text').val(aaa);
  });
/////////////////////////////////
$('button#post_test_ajax').click(function(){//xxxxxxユーザ権限なしでリジェクト
  var url = 'http://nanpa-matome.com/wp-json/wp/v2/posts';
  var n;
  var post_title = 'My post';
  var post_content = 'This is my post.';
  var post_status = 'publish';
  var post_author = 1;
  //var post_category = array(8,39);
  $.ajax({
    url: url,
    dataType: 'json',
    data: {        'title' : post_title,        'content' : post_content,        'status' : post_status,        'author' : post_author,        //'category' : post_category
  },
    type: 'post',
    cache: false,
  }).done(function(data){ //ajaxの通信に成功した場合
    alert("success!");
    $("ul#latest-posts").html(data);
  }).fail(function(data){ //ajaxの通信に失敗した場合
    alert("error!");
    console.error(url);
    console.error(status);
    console.error(data.toString());
    console.log(data);
    console.log(data.responseText);
    console.log(data.responseJSON.message);
  }).always(function(data, textStatus, returnedObject){
    alert(textStatus);
  });
});
$('button#post_test_wppost').click(function(){//xxxxxx0616解決！投稿可能！WP関数の読み込みできずエラー
  var wp_job_name = "test1";
  $.post(root_directory+"page-wp_function.php", {wp_job_name},function(data){
    console.log(data);
    $("#return_log5").prepend(data);
  });
});

////////////////////////////////////////////////////////////////////////////////////////////
  $('button#y-wp_post_button').click(function(){
    console.log("aaaaaa");
    var post_title =  $('#post_title').val();
    var post_text =  $('textarea#y-wp_post_text').val();
    var wp_job_name = "test1";
    $.post(root_directory+"page-wp_function.php", {wp_job_name, post_text, post_title},function(data){
      console.log(data);
      $("#latest-posts").html(data);
      $("#return_log5").prepend(data);
    });
  });
  $('button#test_button_datepick').click(function(){
    console.log("aaaaaaa");
    var temp_start_dates = $('#dbloading_startdate').val();
      var temp_start_year = temp_start_dates.slice(0,4);
      var temp_start_month =temp_start_dates.slice(5,7);
      var temp_start_date =temp_start_dates.slice(-2);
    var temp_end_dates = $('#dbloading_enddate').val();
      var temp_end_year = temp_end_dates.slice(0,4);
      var temp_end_month =temp_end_dates.slice(5,7);
      var temp_end_date =temp_end_dates.slice(-2);
    var post_title_seisei = temp_start_year+"年"+temp_start_month+"月"+temp_start_date+"日～"+temp_end_month+"月"+temp_end_date+"日の即報まとめ";
    $('#post_title').val(post_title_seisei);
    console.log(post_title_seisei);
  });
});
