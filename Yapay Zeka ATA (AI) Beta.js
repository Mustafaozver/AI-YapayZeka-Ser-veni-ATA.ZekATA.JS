//******** Haz�rl�k ***********//

var ATA = {};

ATA["Rastgele"] = function(plength,h,trk) {
var keylist = "1234567890";
 if (h == 1 ) {
  keylist += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (trk) {
   keylist += "������";
  }
 } else if (h == 2) {
  keylist += "abcdefghijklmnopqrstuvwxyz";
  if (trk) {
   keylist += "������";
  }
 } else if (h == 3) {
  keylist += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  if (trk) {
   keylist += "������������";
  }
 }
var temp = "";
 for (i=0;i<plength;i++) {
  temp += "" + keylist.charAt(Math.floor(Math.random()*keylist.length)) + "";
 }
return temp;
};

ATA["E� �al��ma"] = {};
ATA["E� �al��ma"]["E� �al��malar"] = {};
ATA["E� �al��ma"]["E� �al��ma Say�s�"] = 0;
ATA["E� �al��ma"]["Olu�tur"] = function(kod, ckod, deg, sure) {
 var esc = {};
 esc["Kimlik"] = "ESC_" + ATA["Rastgele"](11,1,false) + "_" + ATA["E� �al��ma"]["E� �al��ma Say�s�"] + "";
 ATA["E� �al��ma"]["E� �al��ma Say�s�"]++;
 esc["deg"] = {};
 esc["deg"]["De�i�ken"] = deg;
 esc["deg"]["ATA"] = ATA;
 esc["_kod"] = kod?("" + kod + ""):false;
 esc["_ckod"] = ckod?("" + ckod + ""):false;
 esc["Git"] = function(nes) {return this["deg"][nes]};
 esc["_STOf"] = function() {eval("with(ATA[\"E� �al��ma\"][\"E� �al��malar\"][\"" + esc["Kimlik"] + "\"]){" + esc["_kod"] + "};");};
 esc["_SIf"] = function() {eval("with(ATA[\"E� �al��ma\"][\"E� �al��malar\"][\"" + esc["Kimlik"] + "\"]){" + esc["_ckod"] + "};");};
 esc["Kur"] = function(sure_) {
  if (this["_kod"]) this["_STO"] = setTimeout("ATA[\"E� �al��ma\"][\"E� �al��malar\"][\"" + this["Kimlik"] + "\"][\"_STOf\"]();",sure_);
  else this["_STO"] = false;
  if (this["_ckod"]) this["_SI"] = setInterval("ATA[\"E� �al��ma\"][\"E� �al��malar\"][\"" + this["Kimlik"] + "\"][\"_SIf\"]();",sure_);
  else this["_SI"] = false;
 };
 ATA["E� �al��ma"]["E� �al��malar"][esc["Kimlik"]] = esc;
 esc["Kur"](kod, ckod, sure);
 return esc;
};

/////////////////////////////////
//******** Yapay Zeka *********//

ATA["ZekATA"] = {};
ATA["ZekATA"]["ZekATA"] = ATA["ZekATA"];
ATA["ZekATA"]["ATA"] = ATA;
ATA["ZekATA"]["N�ron"] = {};
ATA["ZekATA"]["Uzay"] = {};
ATA["ZekATA"]["Uzay"]["Uzay"] = [];
ATA["ZekATA"]["DE��L"] = function(ora) {
 return (1-ora);
};
ATA["ZekATA"]["�VEYA"] = function(ora) {
 var deg = ora[0] - ora[1];
 return ((deg>0)?deg:-deg);
};
ATA["ZekATA"]["VEYA"] = function(ora) {
 var ve_ = [];
 for (var i=0;i<ora.length;i++) ve_.push(this["DE��L"](ora[i]));
 return this["DE��L"](this["VE"](ve_));
};
ATA["ZekATA"]["VE"] = function(ora) {
 var ora_ = 0;
 for (var i=0;i<ora.length;i++) ora_ += ora[i];
 ora_ *= ora_/ora.length/ora.length;
 return ora_;
};
ATA["ZekATA"]["N�ron"]["Ba�ar�"] = function() {
 return 1;
};
ATA["ZekATA"]["N�ron"]["Hata"] = function() {
 return 0;
};
ATA["ZekATA"]["N�ron"]["N�ronlar"] = {};
ATA["ZekATA"]["N�ron"]["Ana"] = {};
ATA["ZekATA"]["N�ron"]["N�ron Say�s�"] = 0;
ATA["ZekATA"]["N�ron"]["Olu�tur"] = function(deg) { // deg = [...]
 var nor = {};
 nor["Kimlik"] = "NOR_" + ATA["ZekATA"]["N�ron"]["N�ron Say�s�"]; // + ATA["Rastgele"](11,1,false) + "_" + ATA["ZekATA"]["N�ron"]["N�ron Say�s�"] + "";
 // Tablo �gesi olu�tur
 var btn = document.createElement("BUTTON");
 btn.id = "loo_" + nor["Kimlik"];
 btn.innerText = "0";
 btn.style.width = "30px";
 document.body.appendChild(btn);
 
 nor["_A"] = ATA["ZekATA"]["N�ron"]["N�ron Say�s�"]++;
 nor["De�i�ken"] = deg;
 nor["F"] = function(n) {return 0;};
 nor["Ba�ar�"] = this["Ba�ar�"];
 nor["Hata"] = this["Hata"];
 nor["H1"] = 1;
 nor["H2"] = 1;
 nor["Ba�lant�lar"] = [];
 nor["�evrim"] = function() { // iterasyon
  // var deg_1 = this["F"](this["H1"]) - this["H2"]; // Hata hesab�
  /////////////////////////////////////////////
  var n_ = 5; // Mutasyon katsay�s�
  this["H1"] *= 1+((Math.random()<1/n_)?(1/(Math.random()+n_-0.5)):0);
  /////////////////////////////////////////////
  this["H2"] = ATA["ZekATA"]["N�ron"]["N�ronlar"][this["Ba�lant�lar"][Math.floor(this["Ba�lant�lar"].length*Math.random())]]["H1"]; // Kom�ular aras� iterasyon - overcrossing
  ATA["ZekATA"]["N�ron"]["N�ronlar"][this["Ba�lant�lar"][Math.floor(this["Ba�lant�lar"].length*Math.random())]]["H2"] = this["H1"];
  // tabloda g�ster
  eval("document.all.loo_" + this["Kimlik"]).innerText = this["H1"];
  this["_ECF"] = ATA["E� �al��ma"].Olu�tur("ATA[\"ZekATA\"][\"N�ron\"][\"N�ronlar\"][this[\"deg\"][\"De�i�ken\"]][\"�evrim\"]();",false, this["Kimlik"], Math.floor(500000*Math.random()));
 };
 nor["Kal�t�m"] = []; //ATA["ZekATA"]["Uzay"]["Olu�tur"]([10,10],0);
 nor["_ECF"] = false;
 ATA["ZekATA"]["N�ron"]["N�ronlar"][nor["Kimlik"]] = nor;
 return nor;
};
ATA["ZekATA"]["Uzay"]["Nokta"] = null;
ATA["ZekATA"]["Uzay"]["Olu�tur"] = function(n) {
 var g_uzay = 0;
 for (var i=n.length;i>0;i--) {
  var g_uzay_ = [];
  for (var j=0;j<n[i-1];j++) g_uzay_.push(g_uzay);
  g_uzay = g_uzay_;
 }
 return g_uzay;
};
ATA["ZekATA"]["�al��t�r"] = function() {
 var noron_sayisi = 10000;
 var ortalama_bag_sayisi = 8;
 var tabansal_sayi = 10;
 this["Uzay"]["Uzay"] = this["Uzay"]["Olu�tur"]([20,20,20]);
 for(var x0=0;x0<20;x0++) for(var x1=0;x1<20;x1++) for(var x2=0;x2<20;x2++) {
  this["Uzay"]["Uzay"][x0][x1][x2] = Math.random();
 }
 this["N�ron"]["Ana"] = ATA["ZekATA"]["N�ron"]["Olu�tur"]([]);
 for (var i=0;i<noron_sayisi;i++) {
  var nor_ = ATA["ZekATA"]["N�ron"]["Olu�tur"]();
  while (Math.random()<1/(1+ortalama_bag_sayisi)) ATA["ZekATA"]["N�ron"]["N�ronlar"][nor_["Kimlik"]]["Ba�lant�lar"].push("NOR_" + Math.floor(noron_sayisi*Math.random()));
  // while (Math.random()<1/(1+ortalama_bag_sayisi)) ATA["ZekATA"]["N�ron"]["N�ronlar"]["NOR_" + Math.floor(noron_sayisi*Math.random())]["Ba�lant�lar"].push(nor_["Kimlik"]);
  if (ATA["ZekATA"]["N�ron"]["N�ronlar"][nor_["Kimlik"]]["Ba�lant�lar"].length < ortalama_bag_sayisi/2) {
   if (i != noron_sayisi) ATA["ZekATA"]["N�ron"]["N�ronlar"][nor_["Kimlik"]]["Ba�lant�lar"].push("NOR_" + (i+1));
   if (i != 0) ATA["ZekATA"]["N�ron"]["N�ronlar"][nor_["Kimlik"]]["Ba�lant�lar"].push("NOR_" + (i-1));
  }
  this["N�ron"]["Ana"]["Ba�lant�lar"].push(nor_["Kimlik"]);
 }
 while (Math.random() < 1/(1+ortalama_bag_sayisi)) {
  var i__ = i;
  var i__o = noron_sayisi;
  var i__a = [];
  while (i__o > 1) {
   i__a.push(i__%tabansal_sayi);
   i__ -= i__%tabansal_sayi;
   i__ /= tabansal_sayi;
   i__o /= tabansal_sayi;
  }
  var komsu_kimlik = 0;
  for (var j=i__a.length;j>0;j++) {
   komsu_kimlik *= tabansal_sayi;
   var sapma = 0;
   if (i__a[j] == 0) sapma = (Math.random()>0.5)?1:0;
   else if (i__a[j]+1 == tabansal_sayi) sapma = (Math.random()>0.5)?-1:0;
   else sapma = Math.floor(3*(Math.random()-0.5));
   komsu_kimlik += i__a[j] + sapma;
  }
  ATA["ZekATA"]["N�ron"]["N�ronlar"][nor_["Kimlik"]]["Ba�lant�lar"].push("NOR_" + komsu_kimlik);
 }
 
};



ATA["ZekATA"]["N�ron"]["_kU"] = function(_ku, theta, _r) {
 var iht_ = _r*Math.cos(theta); // 
 return(1/(iht_ + Math.random()))>0.5?_ku:(1-_ku);
};

ATA["ZekATA"]["Aral�kl�"] = {};
ATA["ZekATA"]["Aral�kl�"]["De�er Al2"] = function(aral, _n) {
 _n *= aral["Ana"].length;
 var deg = 0;
 if (_n < 0) _n += aral["Ana"].length;
 var deg = 0;
 for (var i=0;i<aral["Ana"].length;i++) {
  var _nn = i%aral["Ana"].length; if (_nn < 0) _nn += aral["Ana"].length;
  var uzaklik = _nn - _n; if (uzaklik < 0) uzaklik *= -1;
  deg += aral["Ana"][i]/(1+uzaklik);
 }
 return deg*2/aral["Ana"].length/(aral["Ana"].length+1);
};
ATA["ZekATA"]["Aral�kl�"]["De�er Al"] = function(aral, _n) { // 0<=_n<=1 
 var deg = 0;
 _n *= aral["Ana"].length;
 var _nn = Math.floor(_n);
 var oran = (_n - _nn);
 deg += aral["Ana"][_nn]*oran;
 if (_n < 1) _n += aral["Ana"].length;
 _n += 1;
 deg += aral["Ana"][Math.floor(_n)]*(1 - oran);
 return deg;
};
ATA["ZekATA"]["Aral�kl�"]["Aral�kl�lar"] = {};
ATA["ZekATA"]["Aral�kl�"]["Aral�kl� Say�s�"] = 0;
ATA["ZekATA"]["Aral�kl�"]["Olu�tur"] = function(n) {
 var aral_ = {};
 aral_["Ana"] = [];
 for (var i=0;i<n;i++) aral_["Ana"][i] = 0;
 aral_["De�er Al"] = function(_n) {return ATA["ZekATA"]["Aral�kl�"]["De�er Al"](this, _n);};
 return aral_;
};

/*
N�ron:
 ExBellek
 InBellek
 Tahmin
 Iterasyon
 Fonksiyon
*/