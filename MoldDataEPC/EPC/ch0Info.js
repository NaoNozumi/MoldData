/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/ ch0情報
/ 機種名
/ 型データ範囲(EPCのラダーの最初の方に書いてある型データ範囲を表すパラメータ)
/ *.ch0のファイル名
/ これらをセットで書いてね
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
const ch0Info = {
	FLC: {
		moldDataRange: ["CW0@1024", "CW1120@170"],
		ch0: "Flc001o.ch0"
	},
	FLS: {
		moldDataRange: ["CW0@1024", "CW1120@170"],
		ch0: "Flc001o.ch0"
	},
	FLD: {
		moldDataRange: ["CW0@944", "CW1030@260"],
		ch0: "Fld010.ch0"
	},
	FLCD: {
		moldDataRange: ["CW0@512", "CW512@236"],
		ch0: "Fcd010.ch0"
	},
	FKS: {
		moldDataRange: ["CW0@608", "CW1100@100"],
		ch0: "Fks010.ch0"
	},
	CLS: {
		moldDataRange: ["CW0@350"],
		ch0: "Cls001j.ch0"
	},
	FLTP: {
		moldDataRange: ["CW0@800", "CW800@145"],
		ch0: "FLTP512.ch0"
	},
	OTHERS: {
		molDataRange: [],
		ch0: ""
	}
};
