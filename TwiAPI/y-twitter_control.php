<?php
  require_once "ytesu-loadtwitteroauth.php";
  foreach ($_POST as $key => $value) {
    ${$key} = $value;
  }
  $homepage=" http://nanpa-matome.com/";
  function modify_tuidata_fromAPIres($tweets_obj){
    global $tui_data;
    //var_dump($tweets_obj);
    foreach ($tweets_obj as $key => $value) {
      if (isset($tweets_obj[$key]->entities->media[0]->media_url)){
        $media_url=$tweets_obj[$key]->entities->media[0]->media_url;
      }else{
        $media_url="";
      }
      $order   = array("\r\n", "\n", "\r");
      $tui_data[$key]= array(
        'created_at'=> $tweets_obj[$key]->created_at,
        'text'=>str_replace($order,"",$tweets_obj[$key]->text),
        'user_id'=>(string)($tweets_obj[$key]->user->id),
        'tweet_id' => (string)($tweets_obj[$key]->id),
        'user_name'=>$tweets_obj[$key]->user->name,
        'screen_name'=>$tweets_obj[$key]->user->screen_name,
        'icon_url'=>$tweets_obj[$key]->user->profile_image_url,
        'updated'=>date('Y/m/d H:i', strtotime($tweets_obj[$key]->created_at)),
        'url'=>'https://twitter.com/' . $tweets_obj[$key]->user->screen_name . '/status/' . $tweets_obj[$key]->id_str,
        'media_url' => $media_url,
      );
    }
    $aaa= json_encode($tui_data,JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    echo $aaa;
  }
  switch ($post_tweet_type) {
    case 'search_tweets':
      $search_word_plus= $search_word.$search_except
        ." min_retweets:".$search_min_retw." min_faves:".$search_min_fave;
      $params = array(
        "count" => $searchcount,
        //"include_rts" => "false",
        'since_id' => 1,
        'q'=>$search_word_plus,
        'max_id' => $max_id,
        'until' => $date_until,
      );
      $temp = $connection->get('search/tweets', $params);
      $tweets_obj = $temp ->statuses;
      modify_tuidata_fromAPIres($tweets_obj);
      break;
    case 'search_users':
      $params = array(
        "q" => $q,
        "page" => $i,
        "count" => $searchcount,
      );
      $temp = $connection->get("users/search", $params);
      if(isset($temp->errors) ){var_dump($temp->errors);echo '検索エラーです。';  exit;}
      $tweets_obj = $temp;
      $tui_user_data = json_decode(json_encode($tweets_obj), true);
      echo json_encode($tui_user_data,JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
      break;
    case 'text':
      $text = $_POST["text"];
      //$res = $connection->post("statuses/update", array("status" => $text.$homepage));
      echo $text;
      break;
    case 'ret_checked':
      $return="";
      $n=0;
      foreach ($ids as $key => $value) {
        $n++;
        $res = $connection->post("statuses/retweet", ['id' => $value]);
        $return = $return."[".$n."：".$res->name."] ->".$value.", <br>";
      }
      echo $return;
      //var_dump($res);
      break;
    case 'com_retweet':
      $res = $connection->post( 'statuses/update', array(
        'status' => '???? https://twitter.com/suiseinanpa/status/843423038737596416',
        'trim_user' => true
      ) );
      break;
    case 'com_retweet2':
      $ids = $_POST["ids"];
      $screen_names = $_POST["screen_names"];
      $text = $_POST["text"];
      foreach ($ids as $key => $value) {
        $res = $connection->post( 'statuses/update', array(
          'status' => $text.' https://twitter.com/'.$screen_names[$key].'/status/'.$ids[$key],
          'trim_user' => true
        ));
      }
      break;
    case 'list_adding'://Twitterリスト機能にメンバー登録
      $user_id=$_POST['ids'];
      foreach ($user_id as $key => $value) {
          $res = $connection-> post('lists/members/create', array('list_id' => "847036027998941184", 'user_id'=>$value));//「847036027998941184」は自アカのまとめリストのID
          echo $key."=>".$value."<br>";
      }
      break;
    case 'timeline_search':
      $tweets_obj = $connection-> get('statuses/user_timeline', array('screen_name' => $screen_name, 'max_id'=>$max_id, 'count'=>$searchcount, 'exclude_replies'=>true,));
      modify_tuidata_fromAPIres($tweets_obj);
      break;
    case 'tui_lookup':  //TweetIDから複数のツイート取得
      $id = implode(",",$id_arr);
      /*        foreach ($id_arr as $key => $value) {
          $res = $connection->get('statuses/show',array("id"=>value));
          var_dump($value);
          var_dump($res);
          $tweets_obj[$key]=(object)$res->retweeted_status;
        }      */
      $res = $connection->get('statuses/lookup', array('id' => $id));
      foreach ($res as $key => $object) {
        /*
          if ($tweets_obj[$key]=="") {
            $tweets_obj[$key]=$id_arr[$key];
          }
        */
        $tweets_obj[$key]=(object)NULL;
        $tweets_obj[$key]=(object)$res[$key]->retweeted_status;
      }
      modify_tuidata_fromAPIres($tweets_obj);
      break;
    case 'check_texts':
      $rem_num="";
      foreach ($tui_data_SHOW as $key => $value) {
        $pos = strpos($value["text"], "テスト");
        if ($pos==! false) {
          $rem_num= $key.", ".$rem_num;
        }
      }
      echo $rem_num;
      break;
    default:
      echo "「post_tweet_type」が不正です。";
      break;
  }
?>
