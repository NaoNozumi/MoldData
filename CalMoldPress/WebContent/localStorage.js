 // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// 初期設定
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
var storage = localStorage;
window.onload = function() {
    if (typeof sessionStorage !== "undefined") {
        loadStorage();
    } else {}
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// localStorage読込
// http://forse.hatenablog.com/entry/2014/06/23/123042
// http://perutago.seesaa.net/article/206013819.html
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function loadStorage() {
    for (var i = 0; i < storage.length; i++) {
        var key = storage.key(i);
        var element = document.getElementById(key);

        if (element) {
            element.value = storage.getItem(key);
        }
    }
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// 必要最大トルク
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function torqueSet() {
    var inputValue = [0, 0, 0, 0, 0];

    // 値取得
    inputValue[0] = document.getElementById("maxpress").value;
    inputValue[1] = document.getElementById("pitch").value;
    inputValue[2] = document.getElementById("reductionratio1").value;
    inputValue[3] = document.getElementById("reductionratio2").value;
    inputValue[4] = document.getElementById("efficiency").value;

    // localStorageに保存
    storage.setItem("maxpress", inputValue[0]);
    storage.setItem("pitch", inputValue[1]);
    storage.setItem("reductionratio1", inputValue[2]);
    storage.setItem("reductionratio2", inputValue[3]);
    storage.setItem("efficiency", inputValue[4]);
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// 最大型締シリンダ圧力
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function cypressSet() {
    var inputValue = [0, 0, 0];

    // 値取得
    inputValue[0] = document.getElementById("cyphai").value;
    inputValue[1] = document.getElementById("rodphai").value;
    inputValue[2] = document.getElementById("turningradius").value;

    // localStorageに保存
    storage.setItem("cyphai", inputValue[0]);
    storage.setItem("rodphai", inputValue[1]);
    storage.setItem("turningradius", inputValue[2]);
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// 型締シリンダ圧力
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function moldpressSet() {
    var inputValue = [0, 0, 0, 0, 0, 0, 0, 0];

    // 値取得
    inputValue[0] = document.getElementById("moldlength").value;
    inputValue[1] = document.getElementById("moldwidth").value;
    inputValue[2] = document.getElementById("pressure").value;

    inputValue[3] = document.getElementById("formwidthmin").value;
    inputValue[4] = document.getElementById("formwidthmax").value;
    inputValue[5] = document.getElementById("formlengthmin").value;
    inputValue[6] = document.getElementById("formlengthmax").value;
    inputValue[7] = document.getElementById("maxFormingPressure").value;

    // localStorageに保存
    storage.setItem("moldlength", inputValue[0]);
    storage.setItem("moldwidth", inputValue[1]);
    storage.setItem("pressure", inputValue[2]);

    storage.setItem("formwidthmin", inputValue[3]);
    storage.setItem("formwidthmax", inputValue[4]);
    storage.setItem("formlengthmin", inputValue[5]);
    storage.setItem("formlengthmax", inputValue[6]);
    storage.setItem("maxFormingPressure", inputValue[7]);
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// 電空ハイレグ弁への出力
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function hyregpressSet() {
    var inputValue = [0, 0, 0, 0, 0, 0, 0, 0];

    // 値取得
    inputValue[0] = document.getElementById("voltmin").value;
    inputValue[1] = document.getElementById("voltmax").value;
    inputValue[2] = document.getElementById("pressmin").value;
    inputValue[3] = document.getElementById("pressmax").value;
    inputValue[4] = document.getElementById("digitmin").value;
    inputValue[5] = document.getElementById("digitmax").value;
    inputValue[6] = document.getElementById("outvoltmin").value;
    inputValue[7] = document.getElementById("outvoltmax").value;

    // localStorageに保存
    storage.setItem("voltmin", inputValue[0]);
    storage.setItem("voltmax", inputValue[1]);
    storage.setItem("pressmin", inputValue[2]);
    storage.setItem("pressmax", inputValue[3]);
    storage.setItem("digitmin", inputValue[4]);
    storage.setItem("digitmax", inputValue[5]);
    storage.setItem("outvoltmin", inputValue[6]);
    storage.setItem("outvoltmax", inputValue[7]);
};
