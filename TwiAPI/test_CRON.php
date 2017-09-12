<?PHP
//require_once "ytesu-loadtwitteroauth.php";
  $y_directory="/home/jennandara/nanpa-matome.com/public_html/wp-content/themes/simplicity2-child/y-uploaded/";
  $filename = $y_directory."y_log/log_cron.php";
  $now = date('Y/m/d H:i:s');
  $data = $now."：CRONを使ってfile_put_contentsしてます。CRONポストテスト\n\r".PHP_EOL;
  file_put_contents ( $filename , $data , FILE_APPEND | LOCK_EX);
  echo $data;

  $sql_job_name= "test3";
    //SQL接続本体
    $database = "jennandara_tuidata";//接続SQLデータベース
    //$database = "jennandara_tuidata";//接続SQLデータベース
    $host="mysql2104.xserver.jp";
    $dsn = 'mysql:dbname='.$database.';host='.$host.';charset=utf8';
    $user = 'jennandara_tui';
    $password = 'matome2017';
  try{
    //dbhは、データベースハンドラ。SQL通信用関数(PDO)で接続するオブジェクト？
    $dbh = new PDO($dsn, $user, $password);
    //デバック設定：「ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION」エラーレポート
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    switch($sql_job_name) {
      case 'test2':
        $table = "tweets";//接続SQLDBテーブル
        $sql = "SELECT COUNT(DISTINCT media_url) FROM ".$table;
          $stmt = $dbh->query($sql);
          foreach ($stmt as $key => $value) {
            $count_stmt[$key]=$value;
          }
          $result = $stmt ->fetch();
          var_dump($count_stmt);

        for ($i=0; $i < 10 ; $i++) {
          //~~~
          $n=0;
          $ransu = rand(1,$count_stmt[0][0]);
          $sql2 = "SELECT `tweet_id`,`screen_name` FROM ".$table." GROUP BY media_url";
          $stmt = $dbh->query($sql2);
            foreach ($stmt as $key => $value) {// foreach文で配列の中身を一行ずつ出力
             $n=$n+1;
             $tui_data_SQLLOAD[$n]= array(
               'tweet_id'=>$value['tweet_id'],
               'screen_name'=>$value['screen_name'],
             );
             if ($n == (int) $ransu) {
               $tuidata_rand[]=$tui_data_SHOW[$n];
               echo "一致！";
             }
           }
          echo "<br><pre>";
          var_dump($tuidata_rand);
          var_dump($tui_data_SQLLOAD);
          echo "</pre>";
          require_once "ytesu-loadtwitteroauth.php";
          $url= 'https://twitter.com/'.$tui_data_SQLLOAD[1]["screen_name"].
          '/status/'.$tui_data_SQLLOAD[1]["tweet_id"];
          $quote = '<a href="'.$url.'">'.$url.'</a>';
          $text ="【過去の即報".($i+1)."】";
          /*
          $res = $connection->post( 'statuses/update', array(
            'status' => $text.$url,
            'trim_user' => true
          ) );
          */
          echo $text.$quote;
        }
        break;
      case 'test3':
        $table = "tweets";//接続SQLDBテーブル
        $sql = "SELECT COUNT(*) FROM ".$table;
          $stmt = $dbh->query($sql);
          foreach ($stmt as $key => $value) {
            $count_stmt[$key]=$value;
          }
          $result = $stmt ->fetch();
          var_dump($count_stmt);

        for ($i=0; $i < 3 ; $i++) {
          //~~~
          $n=0;
          $ransu = rand(1,$count_stmt[0][0]);
          $sql2 = "SELECT `tweet_id`,`tweets_index`,`screen_name` FROM ".$table.
          " WHERE `tweets_index` = ".$ransu;
          $stmt = $dbh->query($sql2);
            foreach ($stmt as $key => $value) {// foreach文で配列の中身を一行ずつ出力
             $n=$n+1;
             $tui_data_SQLLOAD[$n]= array(
               'tweet_id'=>$value['tweet_id'],
               'tweets_index'=>$value['tweets_index'],
               'screen_name'=>$value['screen_name'],
             );
           }
          echo "<br><pre>";
          var_dump($tui_data_SQLLOAD);
          echo "</pre>";
          require_once "ytesu-loadtwitteroauth.php";
          $url= 'https://twitter.com/'.$tui_data_SQLLOAD[1]["screen_name"].
          '/status/'.$tui_data_SQLLOAD[1]["tweet_id"];
          $quote = '<a href="'.$url.'">'.$url.'</a>';
          $text ="【過去の即報".($i+1)."】";
          $res = $connection->post( 'statuses/update', array(
            'status' => $text.$url,
            'trim_user' => true
          ) );

          echo $text.$quote;
        }
        break;
      case 'tuilist_loading':
        break;
      default: echo "「post_tweet_type」が不正です。"; break;
    }
  }catch (PDOException $e){//エラー表示
    print('Error:'.$e->getMessage()."　　　　･ﾟ･(ﾟ´Д`ﾟ)･ﾟ･");
    die();
  }
?>
