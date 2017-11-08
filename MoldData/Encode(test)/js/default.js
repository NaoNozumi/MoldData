// Copyright (c) BABA (https://so-zou.jp)

(function() {
	var prefix = '';

	var form = document.getElementById('text-form');
	var radioNodes = form.prefix;

	form.onsubmit = function() {
		document.getElementById('result').style.display = '';

		this.submit.nextSibling.style.display = '';
		window.setTimeout(function() {
			form.submit.nextSibling.style.display = 'none';
		}, 100);

		//
		for (var i = 0; i < radioNodes.length; i++) {
			if (radioNodes[i].checked) {
				prefix = radioNodes[i].value;
				break;
			}
		}

		var text = this.text.value;
		SetText('url-encode', text, URL.Encode);
		SetText('url-decode', text, URL.Decode);

		SetText('html-encode1', text, HTML.Encode1);
		SetText('html-encode2', text, HTML.Encode2);
		SetText('html-decode1', text, HTML.Decode1);
		SetText('html-decode2', text, HTML.Decode2);

		SetText('utf8-encode', text, UTF8.Encode);
		SetText('utf8-decode', text, UTF8.Decode);

		SetText('utf16-encode', text, UTF16.Encode);
		SetText('utf16-decode', text, UTF16.Decode);

		SetText('sjis-decode', text, SJIS.Decode);
		return false;
	}

	form.text.select();
	form.text.oninput = function() {
		form.onsubmit();
	}

	for (var i = 0; i < radioNodes.length; i++) {
		radioNodes[i].onchange = function() {
			form.onsubmit();
		}
	}

	var ids = [
		'url-encode', 'url-decode',
		'html-encode1', 'html-encode2',
		'html-decode1', 'html-decode2',
		'utf8-encode', 'utf8-decode',
		'utf16-encode', 'utf16-decode',
		'sjis-decode'
	];

	function SetText(textareaId, originalText, converter) {
		var textarea = document.getElementById(textareaId);
		textarea.value = '';
		textarea.className = '';

		try {
			converter(originalText, function(text) {
				textarea.value = text;
				if (originalText === text) {
					textarea.className = 'nochange';
					textarea.nextSibling.style.visibility = 'hidden';
				} else {
					textarea.className = '';
					//textarea.nextSibling.style.visibility = 'visible';
				}
			});
		} catch (e) {
			textarea.className = 'error';
		}
	}

	function URL() {}
	URL.Encode = function(text, callback) {
		callback(encodeURIComponent(text));
	}
	URL.Decode = function(text, callback) {
		callback(decodeURIComponent(text));
	}

	function HTML() {}
	HTML.Encode1 = function(text, callback) {
		callback(text.escapeHTML());
	}
	HTML.Encode2 = function(text, callback) {
		var result = [];
		for (var i = 0; i < text.length; i++) {
			var codePoint = text.codePointAt(i);
			if (codePoint < 0xd800 || 0xdfff < codePoint) {
				result.push('&#x' + codePoint.toString(16).toUpperCase() + ';');
			}
		}
		callback(result.join(''));
	}
	HTML.Decode1 = function(text, callback) {
		callback(text.unescapeHTML());
	}
	HTML.Decode2 = function(text, callback) {
		var pattern = /(?:&#)(x?(?:[0-9a-f][0-9a-f])+);/gi;

		var result = text.replace(
			pattern,
			function(str, p1) {
				var num;
				if (p1.charAt(0).toLowerCase() == 'x') {
					num = parseInt(p1.slice(1), 16);
				} else {
					num = parseInt(p1, 10);
				}
				return String.fromCodePoint(num);
			});

		callback(result);
	}

	function UTF8() {}
	UTF8.Encode = function(text, callback) {
		var result = [];
		for (var i = 0; i < text.length; i++) {
			var codePoint = text.codePointAt(i);
			if (codePoint < 0xd800 || 0xdfff < codePoint) {
				var bytes = [Number.NaN];
				if (codePoint < 0) {} else if (codePoint < 0x80) {
					bytes = [codePoint];
				} else if (codePoint < 0x800) {
					bytes = [
						(codePoint & 0x7c0) >> 6 | 0xc0,
						(codePoint & 0x3f) | 0x80
					];
				} else if (codePoint < 0x10000) {
					bytes = [
						(codePoint & 0xf000) >> 12 | 0xe0,
						(codePoint & 0xfc0) >> 6 | 0x80,
						(codePoint & 0x3f) | 0x80
					];
				} else if (codePoint < 0x110000) {
					bytes = [
						(codePoint & 0x1c0000) >> 18 | 0xf0,
						(codePoint & 0x3f000) >> 12 | 0x80,
						(codePoint & 0xfc0) >> 6 | 0x80,
						(codePoint & 0x3f) | 0x80
					];
				}

				var hexStr = [];
				for (var k = 0; k < bytes.length; k++) {
					hexStr.push(('00' + bytes[k].toString(16).toUpperCase()).slice(-2));
				}
				result.push(prefix + hexStr.join(''));
			}
		}
		callback(result.join(''));
	}
	UTF8.Decode = function(text, callback) {
		var pattern = /(?:\\[ux]?|u\+)((?:[0-9a-f][0-9a-f]){1,4})/gi;
		if (!pattern.test(text)) {
			text = text.replace(
				/((?:[0-9a-f]){2})\s?/gi,
				function(str, p1) {
					var num = parseInt(p1, 16);
					if ((num >> 6) != 0x02) {
						return '\\' + str;
					}
					return str;
				});
		}

		var result = text.replace(
			pattern,
			function(str, p1) {
				var num = parseInt(p1, 16);

				var codePoint = Number.NaN;
				if (num <= 0xff) {
					codePoint = num;
				} else if (num <= 0xffff) {
					codePoint = num & 0x3f |
						((num >> 2) & 0x7c0);
				} else if (num <= 0xffffff) {
					codePoint = num & 0x3f |
						((num >> 2) & 0xfc0) |
						((num >> 4) & 0xf000);
				} else if (num <= 0xffffffff) {
					codePoint = num & 0x3f |
						((num >> 2) & 0xfc0) |
						((num >> 4) & 0x3f000) |
						((num >> 6) & 0x1c0000);
				}
				return String.fromCodePoint(codePoint);
			});

		callback(result);
	}

	function UTF16() {}
	UTF16.Encode = function(text, callback) {
		var result = [];
		for (var i = 0; i < text.length; i++) {
			var codePoint = text.charCodeAt(i);
			if (0xd800 <= codePoint && codePoint <= 0xdbff && (i + 1 < text.length)) {
				var H = codePoint;
				var L = text.charCodeAt(i + 1);

				result.push(prefix + H.toString(16).toUpperCase());
				result.push(prefix + L.toString(16).toUpperCase());
			} else if (codePoint < 0xd800 || 0xdfff < codePoint) {
				result.push(prefix + ('0000' + codePoint.toString(16).toUpperCase()).slice(-4));
			}
		}
		callback(result.join(''));
	}
	UTF16.Decode = function(text, callback) {
		var pattern = /(?:\\[ux]?|u\+)((?:[0-9a-f][0-9a-f]){1,2})/gi;
		if (!pattern.test(text)) {
			text = text.replace(/(?:[0-9a-f]){4}\s?/gi, '\\$&');
		}

		var result = text.replace(
			pattern,
			function(str, p1) {
				return String.fromCodePoint(parseInt(p1, 16));
			}
		);

		callback(result);
	}

	function SJIS() {}
	SJIS.Decode = function(text, callback) {
		var codes = [];
		var match;

		var pattern = /\\x([0-9a-f][0-9a-f])/gi;
		if (!pattern.test(text)) {
			text = text.replace(/(?:[0-9a-f]){2}\s?/gi, '\\x$&');
		}

		pattern.lastIndex = 0;
		while (match = pattern.exec(text)) {
			var code = parseInt(match[1], 16);
			codes.push(code);
		}

		var binary = new Uint8Array(codes).buffer;
		var blob = new Blob([binary]);

		var reader = new FileReader();
		reader.onerror = function() {
			throw new Error();
		}
		reader.onloadend = function() {
			callback(reader.result);
		}
		reader.readAsText(blob, 'shift_jis');
	}
})();
