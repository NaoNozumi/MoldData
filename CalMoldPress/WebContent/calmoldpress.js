 // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// 初期設定
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
var ten = 10;
var MPa2kg = 10.2;
var kg2MPa = 0.098;
// 型締シリンダ最低動作圧
var mincypressresult = 0.05 * MPa2kg;
/*
 * D/Aカードの設定を外部からの入力方式に変更
 */
var mindigit;
var maxdigit;
var mindigitV;
var maxdigitV;

var maxpress = 0;
var pitch = 0;
var reductionratio1 = 0;
var reductionratio2 = 0;
var efficiency = 0;
var maxtorqueresult = 0;
var maxTorqueT = "\\text{T_{max}[kgfm]}" +
    "=\\frac{" + pitch + "\\text{[mm]}\\times(" + reductionratio1 + "/" + reductionratio2 + ")}{2\\pi\\times" + efficiency + "}\\times" + maxpress + "\\text{[ton]}" +
    "=\\frac{" + pitch + "\\times10^{-3}\\text{[m]}\\times(" + reductionratio1 + "/" + reductionratio2 + ")}{2\\pi\\times" + efficiency + "}\\times" + maxpress + "\\times10^{3}\\text{[kgf]}";

var cyphai = 0;
var rodphai = 0;
var turningradius = 0;
var maxcypressresult = 0;
var maxCYPressureP;

var moldlength = 0;
var moldwidth = 0;
var pressure = 0;
var cypressmpa = 0;
var calCYPressureP;

var voltmin;
var voltmax;
var pressmin;
var pressmax;

var formwidthmin;
var formwidthmax;
var formlengthmin;
var formlengthmax;
var maxFormingPressure;

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// 必要最大トルク
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function caltorque() {
    var i, j;

    // 値取得
    maxpress = document.getElementById("maxpress").value;
    pitch = document.getElementById("pitch").value;
    reductionratio1 = document.getElementById("reductionratio1").value;
    reductionratio2 = document.getElementById("reductionratio2").value;
    efficiency = document.getElementById("efficiency").value;
    // 文字列 → 数字
    maxpress = +maxpress;
    pitch = +pitch;
    reductionratio1 = +reductionratio1;
    reductionratio2 = +reductionratio2;
    efficiency = +efficiency;
    // 必要最大トルク
    i = pitch * (reductionratio1 / reductionratio2);
    j = 2 * Math.PI * efficiency;
    maxtorqueresult = (i / j) * maxpress;
    // 結果表示
    maxTorqueT = "\\text{T_{max}[kgfm]}" +
        "=\\frac{" + pitch + "\\text{[mm]}\\times(" + reductionratio1 + "/" + reductionratio2 + ")}{2\\pi\\times" + efficiency + "}\\times" + maxpress + "\\text{[ton]}" +
        "=\\frac{" + pitch + "\\times10^{-3}\\text{[m]}\\times(" + reductionratio1 + "/" + reductionratio2 + ")}{2\\pi\\times" + efficiency + "}\\times" + maxpress + "\\times10^{3}\\text{[kgf]}";
    eqnarrayFunc("eqnarrayMaxTorque", maxTorqueT);
    document.getElementById("maxtorqueresult").innerHTML = "&#8594; " + ketaround(maxtorqueresult, 3) + " [kgfm]";

    // localStorageへの保存
    if (typeof sessionStorage !== "undefined") {
        torqueSet();
    }
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// 最大型締シリンダ圧力
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function calcypress() {
    var area;
    var i;
    //
    caltorque();

    // 値取得
    cyphai = document.getElementById("cyphai").value;
    rodphai = document.getElementById("rodphai").value;
    turningradius = document.getElementById("turningradius").value;
    // 文字列 → 数字
    cyphai = +cyphai;
    rodphai = +rodphai;
    turningradius = +turningradius;
    // mm → cm
    cyphai = cyphai / ten;
    rodphai = rodphai / ten;
    turningradius = turningradius / ten;
    // 最大型締シリンダ圧力
    area = ((cyphai / 2) * (cyphai / 2) * Math.PI) - ((rodphai / 2) * (rodphai / 2) * Math.PI);
    i = area * turningradius;
    maxcypressresult = (maxtorqueresult * ten * ten) / i;
    // 結果表示
    maxCYPressureP = "\\text{P_{max}[kg/cm^{2}]}" +
        "=\\frac{" + ketaround(maxtorqueresult, 3) + "\\times10^{2}\\text{[kgfcm]}}{" + ketaround(area, 3) + "\\text{[cm^{2}]}\\times" + turningradius + "\\text{[cm]}}";
    eqnarrayFunc("eqnarrayMaxCYPressure", maxCYPressureP);
    //plotGraph(maxpress, maxcypressresult * kg2MPa);
    document.getElementById("maxcypressresult").innerHTML = "&#8594; " + ketaround(maxcypressresult, 3) + " [kg/cm<sup>2</sup>]<br />" +
        "&#8594; " + ketaround(maxcypressresult * kg2MPa, 3) + " [MPa]";

    // localStorageへの保存
    if (typeof sessionStorage !== "undefined") {
        cypressSet();
    }
    cyPress2tonSet();
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// 型締シリンダ圧力
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function calcypressure() {
    var cypress;
    //
    calcypress();

    // 値取得
    moldlength = document.getElementById("moldlength").value;
    moldwidth = document.getElementById("moldwidth").value;
    pressure = document.getElementById("pressure").value;
    formwidthmin = document.getElementById("formwidthmin").value;
    formwidthmax = document.getElementById("formwidthmax").value;
    formlengthmin = document.getElementById("formlengthmin").value;
    formlengthmax = document.getElementById("formlengthmax").value;
    maxFormingPressure = document.getElementById("maxFormingPressure").value;

    // 文字列 → 数字
    moldlength = +moldlength;
    moldwidth = +moldwidth;
    pressure = +pressure;
    formwidthmin = +formwidthmin;
    formwidthmax = +formwidthmax;
    formlengthmin = +formlengthmin;
    formlengthmax = +formlengthmax;
    maxFormingPressure = +maxFormingPressure;
    // 単位変換
    moldlength = moldlength / ten;
    moldwidth = moldwidth / ten;
    pressure = pressure * MPa2kg;
    // 型締シリンダ圧力
    cypress = (moldlength * moldwidth * pressure / 1000) * (maxcypressresult / maxpress);
    cypressmpa = cypress * kg2MPa;
    // 結果表示
    // "&#8594; " + cypress + " [kg/cm^2]<br />" +
    calCYPressureP = "\\text{P[MPa]}" +
        //					"=\\frac{\\text{F[ton]}}{" + maxpress + "\\text{[ton]}}\\times" + ketaround(maxcypressresult, 3) + "\\text{[kg/cm^{2}]}\\times0.098" +
        "=\\frac{" + moldlength + "\\text{[cm]}\\times" + moldwidth + "\\text{[cm]}" + "\\times" + pressure + "\\text{[kg/cm^{2}]}\\times10^{-3}}{" + maxpress + "\\text{[ton]}}\\times" + ketaround(maxcypressresult, 3) + "\\text{[kg/cm^{2}]}\\times0.098";
    eqnarrayFunc("eqnarrayCYPressure", calCYPressureP);
    document.getElementById("cypressresult").innerHTML = "&#8594; " + ketaround(cypressmpa, 3) + " [MPa]<br />";

    // localStorageへの保存
    if (typeof sessionStorage !== "undefined") {
        moldpressSet();
    }
    cyPressSet();
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// 電空ハイレグ弁への出力
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function calhyregpressure() {
    var i, j;
    var volt;
    var digit;
    //
    calcypressure();

    // 値取得
    voltmin = document.getElementById("voltmin").value;
    voltmax = document.getElementById("voltmax").value;
    pressmin = document.getElementById("pressmin").value;
    pressmax = document.getElementById("pressmax").value;
    mindigit = document.getElementById("digitmin").value;
    maxdigit = document.getElementById("digitmax").value;
    mindigitV = document.getElementById("outvoltmin").value;
    maxdigitV = document.getElementById("outvoltmax").value;
    // 文字列 → 数字
    voltmin = +voltmin;
    voltmax = +voltmax;
    pressmin = +pressmin;
    pressmax = +pressmax;
    mindigit = +mindigit;
    maxdigit = +maxdigit;
    mindigitV = +mindigitV;
    maxdigitV = +maxdigitV;
    // 電空ハイレグ弁への出力
    i = (voltmax - voltmin) / (pressmax - pressmin);
    j = voltmax - i * pressmax;
    volt = i * cypressmpa + j;
    i = (maxdigit - mindigit) / (maxdigitV - mindigitV);
    j = maxdigit - i * maxdigitV;
    digit = i * volt + j;
    var vScale = d3.scale.linear()
        .domain([pressmin, pressmax])
        .range([voltmin, voltmax]);
    var dScale = d3.scale.linear()
        .domain([mindigitV, maxdigitV])
        .range([mindigit, maxdigit]);
    var k = vScale(mincypressresult * kg2MPa);
    var l = vScale(maxcypressresult * kg2MPa);
    var m = Math.round(dScale(k));
    var n = Math.round(dScale(l));
    // 結果表示
    document.getElementById("voldresult").innerHTML = "&#8594; " + ketaround(volt, 3) + " [V]<br />" +
        "&#8594; " + Math.round(digit) + " [digit]";
    //
    document.getElementById("hyregSpecification").innerHTML = "電空ハイレグ弁電圧範囲：" + ketaround(k, 3) + "〜" + ketaround(l, 3) + "[V]<br />" +
        "D/Aカードデジタル値範囲：" + m + "〜" + n + "[digit]";

    // localStorageへの保存
    if (typeof sessionStorage !== "undefined") {
        hyregpressSet();
    }
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// 四捨五入
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function ketaround(num, keta) {
    var i, j;
    var kai = 1;
    // 文字列 → 数字
    num = +num;
    keta = +keta;
    // 桁数
    for (j = 0; j < keta; j++) {
        kai = kai * 10;
    }
    // 四捨五入
    i = num * kai;
    i = Math.round(i);
    i = i / kai;

    return (i);
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Google Chart API
// http://archiva.jp/web/tool/google_chart_api.html
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function eqnarrayFunc(id, funcParam) {
    var imgObj = document.getElementById(id);
    var param = encodeURIComponent(funcParam);
    var requestURI = "http://chart.apis.google.com/chart?" +
        "cht=tx&chs=1x0&chf=bg,s,FFFFFF00&chco=000000" +
        "&chl=" + param;

    imgObj.setAttribute("src", requestURI);
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// http://handasse.blogspot.com/2009/07/google-app-engine.html
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function plotGraph(xmax, ymax) {
    var imgObj = document.getElementById("plotMPa2ton");
    //var param = encodeURIComponent;
    var requestURI = "http://chart.apis.google.com/chart?" +
        "&chs=360x360&cht=lxy&chxt=x,y" +
        "&chds=0,40,0,0.5" +
        "&chd=t:0," + xmax + "|0," + ymax +
        "&chxl=0:|0|10|20|30|40|1:|0|0.1|0.2|0.3|0.4|0.5" +
        "&chg=12.5,10,1,5" +
        "&chtt=型締力-型締シリンダ圧力|横軸+型締力[ton]/縦軸+型締シリンダ圧[MPa]";

    imgObj.setAttribute("src", requestURI);
};

// URL Encode (UTF-8)
function encodeURL(str) {
    var character = '';
    var unicode = '';
    var string = '';
    var i = 0;

    for (i = 0; i < str.length; i++) {
        character = str.charAt(i);
        unicode = str.charCodeAt(i);
        if (character == ' ') {
            string += '+';
        } else {
            if (unicode == 0x2a || unicode == 0x2d || unicode == 0x2e || unicode == 0x5f || ((unicode >= 0x30) && (unicode <= 0x39)) || ((unicode >= 0x41) && (unicode <= 0x5a)) || ((unicode >= 0x61) && (unicode <= 0x7a))) {
                string = string + character;
            } else {
                if ((unicode >= 0x0) && (unicode <= 0x7f)) {
                    character = '0' + unicode.toString(16);
                    string += '%' + character.substr(character.length - 2);
                } else if (unicode > 0x1fffff) {
                    string += '%' + (oxf0 + ((unicode & 0x1c0000) >> 18)).toString(16);
                    string += '%' + (0x80 + ((unicode & 0x3f000) >> 12)).toString(16);
                    string += '%' + (0x80 + ((unicode & 0xfc0) >> 6)).toString(16);
                    string += '%' + (0x80 + (unicode & 0x3f)).toString(16);
                } else if (unicode > 0x7ff) {
                    string += '%' + (0xe0 + ((unicode & 0xf000) >> 12)).toString(16);
                    string += '%' + (0x80 + ((unicode & 0xfc0) >> 6)).toString(16);
                    string += '%' + (0x80 + (unicode & 0x3f)).toString(16);
                } else {
                    string += '%' + (0xc0 + ((unicode & 0x7c0) >> 6)).toString(16);
                    string += '%' + (0x80 + (unicode & 0x3f)).toString(16);
                }
            }
        }
    }
    return string;
};
