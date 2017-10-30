// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// 初期設定
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
var teethA;
var teethB;
var teethC;
var chainlength;
var ratio;
var maxspeed;
var encpls;

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// サーボパラメータ算出
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function calservoparam(){
	// 値取得
	teethA = document.getElementById("teethA").value;
	teethB = document.getElementById("teethB").value;
	teethC = document.getElementById("teethC").value;
	chainlength = document.getElementById("chainlength").value;
	ratio = document.getElementById("ratio").value;
	ratioNumer = document.getElementById("ratioNumer").value;
	maxspeed = document.getElementById("maxspeed").value;
	encpls = document.getElementById("encpls").value;
	// 文字列 → 数字
	teethA = +teethA;
	teethB = +teethB;
	teethC = +teethC;
	chainlength = +chainlength;
	ratio = +ratio;
	ratioNumer = +ratioNumer;
	maxspeed = +maxspeed;
	encpls = +encpls;

	// 図に表示
	motor.text("モータ");
	motorRatio.text("減速比" + ratioNumer + "/" + ratio);
	textA.text("A:" + teethA + "丁");
	textB.text("B:" + teethB + "丁");
	textC.text("C:" + teethC + "丁");
	textChain.text("(チェーン:" + chainlength + "[mm])");
	// ひたすら表示
	var ii = gcd(teethB * ratio, teethA * ratioNumer);
	var i_1;var j_1;var k_1;var l_1;
	i_1 = teethB * ratio / ii;
	j_1 = teethA * ratioNumer / ii;
	k_1 = chainlength * j_1 * teethC;
	document.getElementById("1_1").innerHTML = i_1;
	document.getElementById("1_2").innerHTML = j_1;
	document.getElementById("1_3").innerHTML = j_1;
	document.getElementById("1_4").innerHTML = teethC;
	document.getElementById("1_5").innerHTML = j_1;
	document.getElementById("1_6").innerHTML = j_1 * teethC;
	document.getElementById("1_7").innerHTML = "";
	document.getElementById("1_8").innerHTML = chainlength;
	document.getElementById("1_9").innerHTML = i_1;
	document.getElementById("1_10").innerHTML = chainlength;
	document.getElementById("1_11").innerHTML = j_1 * teethC;
	document.getElementById("1_12").innerHTML = k_1;
	document.getElementById("1_13").innerHTML = j_1 * teethC;
	document.getElementById("1_14").innerHTML = k_1;
	document.getElementById("1_15").innerHTML = j_1 * teethC;
	document.getElementById("1_16").innerHTML = k_1;

	var i = gcd(360, k_1);
	var j = 360 / i;
	var k = k_1 / i;
	document.getElementById("2_1").innerHTML = 360;
	document.getElementById("2_2").innerHTML = k_1;
	document.getElementById("2_3").innerHTML = j;
	document.getElementById("2_4").innerHTML = k;
	document.getElementById("2_5").innerHTML = k_1;
	document.getElementById("2_6").innerHTML = 360;
	document.getElementById("2_7").innerHTML = k;
	document.getElementById("2_8").innerHTML = j;

	i = gcd(360, encpls * i_1);
	l_1 = (encpls * i_1) / i;
	document.getElementById("3_1").innerHTML = i_1;
	document.getElementById("3_2").innerHTML = encpls;
	document.getElementById("3_3").innerHTML = encpls;
	document.getElementById("3_4").innerHTML = i_1;
	document.getElementById("3_5").innerHTML = l_1;
	document.getElementById("3_6").innerHTML = 360 / i;

	document.getElementById("4_1").innerHTML = encpls;
	document.getElementById("4_2").innerHTML = encpls;
	document.getElementById("4_3").innerHTML = 360 / i;
	document.getElementById("4_4").innerHTML = l_1;
	document.getElementById("4_5").innerHTML = maxspeed;
	document.getElementById("4_6").innerHTML = maxspeed;
	document.getElementById("4_7").innerHTML = encpls * (360 / i) / l_1;

	var l = maxspeed * encpls * (360 / i) / l_1;
	document.getElementById("4_8").innerHTML = ketaround(l, 3);
	l = l / 60 * k / j;
	document.getElementById("4_9").innerHTML = ketaround(l, 3);

	// localStorageへの保存
	if(typeof sessionStorage !== "undefined"){
		paramSet();
	}
};

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// 四捨五入
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function ketaround(num, keta){
	var i,j;
	var kai = 1;
//文字列 → 数字
	num = +num;
	keta = +keta;
//桁数
	for(j = 0; j < keta; j++){
		kai = kai * 10;
	}
//四捨五入
	i = num * kai;
	i = Math.round(i);
	i = i / kai;

	return(i);
};

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// ユークリッドの互除法
// http://blog.livedoor.jp/dankogai/archives/50966150.html
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function gcd(m, n){
	if(m < n) return gcd(n, m);	// 常に m > n にしておく
	var r = m % n;				// 余りrが....
	if(r == 0) return n;		// 0 なら n がGCD
	return gcd(n, r);			// でなければnとrのGCD
};