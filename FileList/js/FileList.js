/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ ファイルリスト生成
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
// ドロップ対象要素
let dropBox = document.getElementById("dropBox");

// https://lab.syncer.jp/Web/API_Interface/Reference/IDL/DataTransfer/effectAllowed/
dropBox.addEventListener('dragstart', function(e) {
	e.dataTransfer.effectAllowed = 'none';
});

// ドロップ対象要素に重なっている
dropBox.addEventListener('dragover', function(e) {
	e.preventDefault(); // ブラウザーでファイルを開かないようにする
	e.dataTransfer.dropEffect = 'copy';
	addClass();
});

// ドロップ対象要素から出た
dropBox.addEventListener('dragleave', function(e) {
	removeClass();
});

// ドロップ
dropBox.addEventListener('drop', function(e) {
	e.preventDefault(); // ブラウザーでファイルを開かないようにする
	removeClass();

	// データ取得後処理
	// 変数宣言
	let eTransfer, eItems, eItem, entry;

	eTransfer = e.dataTransfer;
	eItems = eTransfer.items;
	if (eTransfer && eItems) {
		if (eItems.length === 1) { // 個数チェック
			eItem = eItems[0];

			if (eItem.getAsEntry) { // HTML5標準
				entry = eItem.getAsEntry();
			} else if (eItem.webkitGetAsEntry) { // Webkit実装
				entry = eItem.webkitGetAsEntry();
			}

			// Entryをパース
			traverseEntry(entry);
		} else {
			alert('複数ファイルのドロップは許可していません。');
		};
	}
});

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ Entryのパース
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function traverseEntry(e) {
	let i, len, reader;

	switch (true) {
		case (e.isFile): // ファイルの場合
			console.log(e.fullPath);
			break;
		case (e.isDirectory): // ディレクトリの場合
			reader = e.createReader();

			// ディレクトリ内容の読み取り
			reader.readEntries(
				function(results) { // 読取成功
					// 再帰処理
					len = results.length;
					for (i = 0; i < len; i++) {
						traverseEntry(results[i]);
					}
				},
				function(error) { // 読取失敗
					alert(error);
				}
			);
			break;
	}
}

/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ 見た目変更のためclass追加・削除
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
function addClass() {
	dropBox.classList.add('dropover');
}

function removeClass() {
	dropBox.classList.remove('dropover');
}
