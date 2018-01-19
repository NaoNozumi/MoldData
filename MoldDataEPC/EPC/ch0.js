/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/
/ 初期化
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
let xhrCh0 = new XMLHttpRequest();

// 初期化
loadCh0("Flc001o.ch0"); // *.ch0読込

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 選択機種に従ってデータを拾う(*.ch0)
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
/* *.ch0ファイルを開こうとするとHTTPエラー404.3が発生するかもしれない
// http://itp.blog.so-net.ne.jp/2013-05-23
/ https://developer.mozilla.org/ja/docs/Web/HTTP/Basics_of_HTTP/MIME_types */
function loadCh0(e) {
	xhrCh0.onreadystatechange = function() {
		if (xhrCh0.readyState == 4) {
			if (xhrCh0.status == 200 || xhrCh0.status == 304) {
				let result = xhrCh0.responseText.split("\r\n");

				// コメントリスト
				makech0List(result);
			} else {
				alert("*.ch0読込失敗");
			}
			xhrCh0.abort(); // リクエスト中止
		}
	}

	xhrCh0.open("GET", "./EPC/" + e, true); // ファイルを非同期通信でオープンする
	// https://qiita.com/nbjiao/items/9be484793ff545bace32
	xhrCh0.overrideMimeType("text/plain; charset=Shift_JIS");
	xhrCh0.send(null); // リクエストを発行
}
