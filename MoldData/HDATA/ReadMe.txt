各機種毎の設定ファイルを収めます。
下記のような構造となります。
誤動作の原因ともなりますので、他のファイルを入れないで下さい。(特に*.jsファイルは厳禁)

comment.txtファイルのフォーマット
デバイスNo.[tab]コメント[tab][tab]小数点以下桁数[tab]単位

\HDATA
 |- \0000(製造番号)
 |  |-init.js
 |  |-ratioArray.js
 |  |-comment.txt(文字コード:UTF-8 改行:CR+LF)
 |-\0001
    |-init.js
    |-ratioArray.js
    |-comment.txt
