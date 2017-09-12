<?php
  $sql_job_name= $_POST["sql_job_name"];
  $sqltest_textarea= $_POST["sqltest_textarea"];
    //SQL接続本体
    $database = "jennandara_testtuidata";//接続SQLデータベース
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
    case 'test1'://未完成
      $table = "tweets";//接続SQLDBテーブル
      $sql = "SELECT `created_at` AS `date`,`tweets_index`".
        "FROM `tweets`";
      $stmt = $dbh->query($sql);
      $n=0;
      foreach ($stmt as $key => $value) {// foreach文で配列の中身を一行ずつ出力
        $n=$value[1];
        $timestamp = strtotime($value[0]);
        $datetime[$n] = date('Y-m-d H:i:s', $timestamp);
      }
      for ($i=0; $i <= $n ; $i++) {
        $sql2 = $sql2.'UPDATE '.$table.' SET created_at_datetime ="'.$datetime[$i].'" WHERE tweets_index = '.$i.";".PHP_EOL;
      }
      echo "<br>".$sql2."<br>";
      $stmt = $dbh->prepare($sql2);
      $stmt->execute($datetime);
      echo('<pre>');
      //var_dump($tui_data_SQLLOAD);//  string(30) "Sat May 06 11:57:17 +0000 2017"
      var_dump($datetime);//  string(19) "2017-05-08 07:04:48"
      echo('</pre>');
      //echo json_encode($tui_data_SQLLOAD,JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
      break;
    default: echo "「post_tweet_type」が不正です。"; break;
  }
  //End:Switch
}
catch (PDOException $e){//エラー表示
  print('Error:'.$e->getMessage()."　　　　･ﾟ･(ﾟ´Д`ﾟ)･ﾟ･");
  die();
}
?>
