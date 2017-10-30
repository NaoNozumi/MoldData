// 基数の一覧
var baseList = new Array(2, 8, 10, 16);

// 変換
function convert(base) {
    // バイト数の取得
    var byte;
    if (document.getElementById("unsigned").checked) {
        byte = 0;
    } else {
        byte = 1 + document.getElementById("byte").selectedIndex;
    }

    // 入力値の取得
    var value = document.getElementById("n" + base).value;

    // 入力値が空文字列の場合は、全フィールドをクリアする
    if (value == "") {
        for (var i = 0; i < baseList.length; i++) {
            if (baseList[i] != base) {
                document.getElementById("n" + baseList[i]).value = '';
            }
        }

        return;
    }

    // 入力チェックと、Numオブジェクトの作成
    var num;
    switch (base) {
        case 2:
            if (!value.match(/^[01]*$/)) {
                alert("0か1の数字で入力してください");
                return;
            }

            num = to10(base, value);
            break;

        case 8:
            if (!value.match(/^[0-7]*$/)) {
                alert("0～7の数字で入力してください");
                return;
            }

            num = to10(base, value);
            break;

        case 10:
            try {
                num = new Num(value);
            } catch (e) {
                alert("正しい数値ではありません。");
                return;
            }
            if (num.decimalLen > 0) {
                alert("小数は入力できません。");
                return;
            }
            if (byte == 0 && num.signum() == -1) {
                alert("マイナス値を入力するときはオプションを「符号あり」に設定してください");
                return;
            }
            break;

        case 16:
            if (!value.match(/^[0-9a-fA-F]*$/)) {
                alert("0～9の数字、A～Fの英字で入力してください");
                return;
            }
            num = to10(base, value);
            break;
    }

    var num10 = num;
    var num2 = num;

    // オーバーフローチェック
    if (byte != 0) {

        var max;
        var min;
        var over = new Num(256).power(byte);
        var plusMax = over.divide(2).subtract(1);
        if (base == 10) {
            max = plusMax;
            min = over.divide(2).negate();
        } else {
            max = over.subtract(1);
            min = Num.ZERO;
        }

        if (max.compareTo(num) == -1 || min.compareTo(num) == 1) {
            alert("指定した精度をオーバーフローしました。符号なしに設定するか、精度を大きくしてください");
            return;
        }

        // 10進以外
        if (base != 10) {
            // 正の最大数より大きければマイナス値に変換する
            if (plusMax.compareTo(num) == -1) {
                num10 = over.subtract(num).negate();
            }

            // 10進
        } else {
            if (num.compareTo(Num.ZERO) == -1) {
                num2 = over.add(num);
            }
        }
    }

    for (var i = 0; i < baseList.length; i++) {
        if (baseList[i] != base) {
            if (baseList[i] == 10) {
                document.getElementById("n" + baseList[i]).value = num10;
            } else {
                document.getElementById("n" + baseList[i]).value = from10(baseList[i], num2);
            }
        }
    }
}

function from10(base, value) {
    var result = '';

    while (true) {
        var ans = value.divideAndRemainder(base);
        value = ans[0];
        var digit = Math.abs(ans[1].toNumber());

        var x;
        if (digit < 10) {
            x = digit;
        } else {
            x = String.fromCharCode(digit + "A".charCodeAt(0) - 10);
        }

        result = x + result;
        if (value.equals(Num.ZERO)) {
            break;
        }
    }

    return result;
}

function to10(base, value) {
    var num = new Num();

    for (var i = 0, loop = value.length; i < loop; i++) {
        var digit = value.charAt(i);
        var x;
        if ("0" <= digit && digit <= '9') {
            x = digit.charCodeAt(0) - "0".charCodeAt(0);
        } else if ("a" <= digit && digit <= 'f') {
            x = digit.charCodeAt(0) - "a".charCodeAt(0) + 10;
        } else {
            x = digit.charCodeAt(0) - "A".charCodeAt(0) + 10;
        }

        num = num.multiply(base).add(x);
    }

    return num;
}

function enablePrcision(flag) {
    document.getElementById("byte").disabled = !flag;
}

function init() {
    var appName = navigator.appName.toUpperCase();
    var userAgent = navigator.userAgent.toUpperCase();
    if (appName.indexOf("MICROSOFT") != -1) {
        document.getElementById("n2").style.backgroundImage = "url(images/grid-ie4.gif)";
        document.getElementById("n8").style.backgroundImage = "url(images/grid-ie3.gif)";
        document.getElementById("n10").style.backgroundImage = "url(images/grid-ie3.gif)";
        document.getElementById("n16").style.backgroundImage = "url(images/grid-ie2.gif)";

    } else if (userAgent.indexOf("FIREFOX") != -1 || userAgent.indexOf("OPERA") != -1) {
        document.getElementById("n2").style.backgroundImage = "url(images/grid-ff4.gif)";
        document.getElementById("n8").style.backgroundImage = "url(images/grid-ff3.gif)";
        document.getElementById("n10").style.backgroundImage = "url(images/grid-ff3.gif)";
        document.getElementById("n16").style.backgroundImage = "url(images/grid-ff2.gif)";
    }

    // フォーカスが入力フィールドに与えられたとき、背景色を変えるようイベントを設定
    try {
        // フォームの検索
        for (var i = 0; i < document.forms.length; i++) {

            // フォーム内エレメントの検索
            for (var j = 0; j < document.forms[i].length; j++) {
                var e = document.forms[i][j];

                switch (e.type) {
                    case "text":
                    case "textarea":
                    case "radio":
                    case "checkbox":
                    case "password":
                        if (e.addEventListener) {
                            e.addEventListener("focus", changeColor, false);
                            e.addEventListener("blur", restoreColor, false);
                        } else if (e.attachEvent) {
                            e.attachEvent("onfocus", changeColor);
                            e.attachEvent("onblur", restoreColor);
                        } else {
                            e["onfocus"] = changeColor;
                            e["onblur"] = restoreColor;
                        }
                        break;
                }
            }
        }
    } catch (e) {}

    // 先頭の入力フィールドにフォーカスを与える
    try {
        var f = document.forms[0];

        for (var i = 0; i < f.elements.length; i++) {
            var e = f.elements[i];
            if ((e.tagName == "INPUT" && e.type != "hidden") || (e.tagName == "SELECT") || (e.tagName == "TEXTAREA")) {
                e.focus();
                break;
            }
        }
    } catch (e) {}
}

// 入力フィールドにフォーカスが与えられたときに呼び出されるイベント
function changeColor(event) {
    setColor(event, "#DDFFFF");
    (event.srcElement != null ? event.srcElement : event.target).select();
}

// 入力フィールドがフォーカスを失ったときに呼び出されるイベント
function restoreColor(event) {
    setColor(event, "");
}

// 入力フィールドの色を変える
function setColor(event, color) {
    var e = event.srcElement != null ? event.srcElement : event.target;
    if (e.parentNode.tagName == "LABEL") {
        e = e.parentNode;
    }
    e.style.backgroundColor = color;
}
