<?php //echo basename($_SERVER['PHP_SELF']) ."<br>";
//参考⇒http://qiita.com/tsunet111/items/9309801cd3e3bcf6e32a
// OAuthライブラリの読み込み
$temp_path="/home/jennandara/nanpa-matome.com/public_html/wp-content/themes/simplicity2-child/y-uploaded/";
require $temp_path."y-twitteroauth/autoload.php";
use Abraham\TwitterOAuth\TwitterOAuth;
$matome = array(
  'CK' => "9AXDcDfAC7gG0HNvadjxfMgky",
  'CS' => "SZzCeYar9iZ1G7NqocZyCcZwyU2APWbldbfPEpRTRulhES4jj5",
  'AT' => "832929024754151428-IxS2SUVxOiYHH7fcgLWzi582gPorhS8",
  'ATS' => "GOnQWKO9nb8oCQf2MNn9VaY00rxDnuPStUimpAH02SOTd",
);
$yana = array(
  'CK' => "S3pNU05G1VEmoXMBk8oUbez1F",
  'CS' => "rjcPnnlGP63bP3PxQXJ0qGBmRFdDf40IF12wYbQW1dZUW7vP8q",
  'AT' => "3979962554-v3GNtURfOXEgitcBrxvOpLK2GQyFKoQiW1kwGY3",
  'ATS' => "3XMQsZWK6QtrNKAbKYF0KgvPhY4iZyZz7L7P7PN3DU11s",
);
// Consumer key
$key = $matome;
$consumerKey = $key["CK"];
// Consumer secret
$consumerSecret = $key["CS"];
// Access token
$accessToken = $key["AT"];
// Access token secret
$accessTokenSecret = $key["ATS"];

/*認証情報４つ
$consumerKey = "XXXXXX";
$consumerSecret = "XXXXXX";
$accessToken = "XXXXXX";
$accessTokenSecret = "XXXXXX";
*/

//接続
$connection = new TwitterOAuth($consumerKey, $consumerSecret, $accessToken, $accessTokenSecret);


?>
