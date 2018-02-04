function onDataDrop(event) {
	event.preventDefault();

	var dataTransfer = event.dataTransfer;
	// DataTransferオブジェクトからDataTransferItemListを参照
	if (dataTransfer && dataTransfer.items) {
		var items = dataTransfer.items,
			len = items.length;
		// ドロップされたファイルが一つかチェック
		if (len === 1) {
			var item = items[0],
				entry;
			// HTML5標準
			if (item.getAsEntry) {
				entry = item.getAsEntry();
				// Webkit実装
			} else if (item.webkitGetAsEntry * 1) {
				entry = item.webkitGetAsEntry();
			}

			// Entryをパース
			traverseEntry(entry);
		} else {
			alert("フォルダを1つだけドロップしてください！");
		}
	}
}
