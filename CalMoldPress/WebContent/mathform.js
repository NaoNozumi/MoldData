 // http://www.nn.iij4u.or.jp/~therans/MathForm.html
//	(C) by theR.A.N.S. 2002
//	改訂 2002.6.4
//	改訂 2004.5.20
//	営利目的での配布を禁じます。

MFterm = new Array(32);
BR = "<br>";

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function MFterms(n) {
    ret = "<table><tr><td><td><td>";
    for (var i = 1; i <= n; i++) {
        ret = ret + "<td>" + MFterm[i];
    }
    return (ret + "</table>");
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function MFtermsw(n) {
    document.write(MFterms(n));
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function MFdiv(x, y) {
    mf = "<table><tr><td><center><u>" + x + "</u>";
    mf = mf + "<br>" + y + "</center></table>";
    return (mf);
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function MFsqrt(x, n) {
    mf = "<table><tr><td><br>√<td>";
    for (var ib = 0; ib < n; ib++) mf = mf + "＿";
    mf = mf + "<br>" + x + "</table>";
    return (mf);
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function MFintegrate(f, x, a, b) {
    mf = "<table><tr><td>";
    mf = mf + "∫";
    if (a != "*") mf = mf + "<sub>" + a + "</sub>";
    if (b != "*") mf = mf + "<sup>" + b + "</sup>";
    mf = mf + "<td>" + f + "<td>ｄ" + x + "</table>";
    return (mf);
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function MFsum(f, a, b) {
    mf = "<table><tr><td><center><sub>" + b + "</sub><br>Σ<br><sup>" + a + "</sup></center><td>";
    mf = mf + f + "</table>";
    return (mf);
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function MFproduct(f, a, b) {
    mf = "<table><tr><td><center><sub>" + b + "</sub><br>Π<br><sup>" + a + "</sup></center><td>";
    mf = mf + f + "</table>";
    return (mf);
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function MFlimit(f, a, b) {
    mf = "<table><tr><td><center></sub><br>Ｌｉｍ<br><sup>" + a + "→" + b + "</sup></center><td>";
    mf = mf + f + "</table>";
    return (mf);
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function MF(mf1, mf2, mf3, mf4, mf5) {
    if (mf1 == "／") return (MFdiv(mf2, mf3));
    if (mf1 == "√") return (MFsqrt(mf2, mf3));
    if (mf1 == "∫") return (MFintegrate(mf2, mf3, mf4, mf5));
    if (mf1 == "Σ") return (MFsum(mf2, mf3, mf4));
    if (mf1 == "Π") return (MFproduct(mf2, mf3, mf4));
    if (mf1 == "Ｌ") return (MFlimit(mf2, mf3, mf4));
    return (mf1);
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function MFw(mf1, mf2, mf3, mf4, mf5) {
    document.write(MF(mf1, mf2, mf3, mf4, mf5));
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function BRsetsumei() {
    alert("BR はこのhtml文書内の JavaScript 部で\r　　　　BR = \"<br>\";\rと定義されているもので、\"<br>\"と同じです。\"√\"の項は他の項より1行下に書かれる、つまり BR+ がなければ\r－ｂ±　＿＿＿＿\r　　　　√ｂ2－4ａｃ\rのようになるので、位置を揃えるために BR+ を付けたものです。");
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function BunsuuLine() {
    alert(" \"<u>\"、\"</u>\" は分数線を書くために付けたものです。");
};
