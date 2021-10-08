/*

Nöron:
 ExBellek
 InBellek
 Tahmin
 Iterasyon
 Fonksiyon

*/

//******** Hazırlık ***********//

var ATA = {};
ATA["Rastgele"] = function(plength,h,trk) {
var keylist = "1234567890";
 if (h == 1 ) {
  keylist += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (trk) {
   keylist += "ÇĞİÖŞÜ";
  }
 } else if (h == 2) {
  keylist += "abcdefghijklmnopqrstuvwxyz";
  if (trk) {
   keylist += "çğıöşü";
  }
 } else if (h == 3) {
  keylist += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  if (trk) {
   keylist += "ÇĞİÖŞÜçğıöşü";
  }
 }
var temp = "";
 for (i=0;i<plength;i++) {
  temp += "" + keylist.charAt(Math.floor(Math.random()*keylist.length)) + "";
 }
return temp;
};

ATA["LOG"] = function(x, y) { //1234567890
 return Math.log(y)/Math.log(x);
};
/////////////////////////////////

ATA["ZekATA"] = {};



ATA["ZekATA"]["Dil İfade"] = {};
ATA["ZekATA"]["Dil İfade"]["Sayısal Adım"] = 1;
ATA["ZekATA"]["Dil İfade"]["0AS_01"] = function(oSay) {return oSay/(this["Sayısal Adım"]+oSay);};
ATA["ZekATA"]["Dil İfade"]["01_0AS"] = function(oSay) {return this["Sayısal Adım"]*oSay/(1-oSay);};
ATA["ZekATA"]["Dil İfade"]["ESAS_01"] = function(oSay) {
 if (oSay < 0) return(0.5-this["0AS_01"](-oSay)/2);
 else return(0.5+this["0AS_01"](oSay)/2);
};
ATA["ZekATA"]["Dil İfade"]["01_ESAS"] = function(oSay) {
 if (oSay < 0.5) return(-this["01_0AS"](1-2*oSay));
 else return(this["01_0AS"](2*oSay-1));
};
ATA["ZekATA"]["Dil İfade"]["01_ESAS2"] = function(oSay) {
 return(ATA["LOG"](Math.E,oSay) - ATA["LOG"](Math.E,1-oSay));
};
ATA["ZekATA"]["Dil İfade"]["ESAS_012"] = function(oSay) {
 return(1/(1+Math.exp(-oSay)));
};
ATA["ZekATA"]["ZekATA"] = ATA["ZekATA"];
ATA["ZekATA"]["ATA"] = ATA;



ATA["ZekATA"]["Nöron"] = {};
ATA["ZekATA"]["Nöron"]["Yöntemler"] = [];
ATA["ZekATA"]["Nöron"]["Yöntemler"][0] = {}; // sinuzaidal
ATA["ZekATA"]["Nöron"]["Yöntemler"][0]["değişkenler"] = [1,1,0];
ATA["ZekATA"]["Nöron"]["Yöntemler"][0]["Başarı"] = function() {};
ATA["ZekATA"]["Nöron"]["Yöntemler"][0]["işlev"] = function(X) {
 var a = this["değişkenler"];
 return(a[0]*Math.sin(X*a[1] + a[2]));
};
ATA["ZekATA"]["Nöron"]["Şekil Ver"] = function(oTur) {
 switch (oTur) {
  default:
  case 1: // tahayyül nöron - üretici-çekici nöron
   this["Başarı"] = [1];
   this["Kalıtım"] = [];
   this["Çalıştır"] = function() {
    for (var i=this["Kalıtım"].length-1;i>0;i--) {
     this["Kalıtım"][i] = this["Kalıtım"][i-1];
	}
	this["Kalıtım"][0] = Math.random();
   };
   this["Çıktı"] = function() {
    var toplam = 0;
	for (var i=0;i<this["Kalıtım"].length;i++) toplam += this["Kalıtım"][i];
	return toplam/this["Kalıtım"].length;
   };
   this["Çek"] = function(i, deg) {
    this["Kalıtım"][i] = deg;
   };
  break;
  case 2: // tasavvur nöron - seçici-bağlayıcı nöron
   this["Başarı"] = [0];
   this["Yön"] = [1];
   this["XO"] = [0];
   this["Hedef"] = 0;
   this["Sayısal Bellek"] = {}; // Başarısızlık
   this["Sayısal Bellek"]["Başarısızlık"] = [0]; // Başarısızlık
   this["I"] = 0;
   this["Koşul Denetimi"] = function() {return 1;};
   this["F"] = function(X) {return X[0];};
   
   
   
   this["_ÇA0"] = function() {
    this["I"] = (Math.random()<0.5)?Math.floor(Math.random()*this["Başarı"].length):this["I"];
	this.__y = {};
	this.__y.eski_basari = this["Başarı"][this["I"]];
	this.__y.x0 = this["XO"][this["I"]];
	this.__y.x1 = this.__y.x0 + this["Yön"][this["I"]]*(Math.random()*0.8+0.2);
	this.__y.arr_ = this["XO"].slice();
	this.__y.arr_[this["I"]] = this.__y.x1;
   };
   
   
   
   this["_ÇA1"] = function() {
	this.__y.y1 = this["F"](this.__y.arr_);
	this.__y.basari = this["Koşul Denetimi"](this.__y.arr_)*ATA["ZekATA"]["DEĞİL"](ATA["ZekATA"]["ÖVEYA"]([ATA["ZekATA"]["Dil İfade"]["ESAS_01"](this["Hedef"]),ATA["ZekATA"]["Dil İfade"]["ESAS_01"](this.__y.y1)]));
   };
   
   
   this["_ÇA2"] = function() {
   	if (this.__y.basari > this.__y.eski_basari) {
     this["Sayısal Bellek"]["Başarısızlık"][this["I"]] = 0;
     this["Başarı"][this["I"]] = this.__y.basari;
	 this["XO"][this["I"]] = this.__y.x1;
	 if (this.__y.basari == 1) this["Yön"][this["I"]] = 0;
	 else if (this.__y.basari > ATA["ZekATA"]["VE"]([this.__y.eski_basari,1])) this["Yön"][this["I"]] *= 0.99997+ATA["ZekATA"]["Dil İfade"]["ESAS_01"](ATA["ZekATA"]["Dil İfade"]["0AS_01"](this.__y.basari)/ATA["ZekATA"]["Dil İfade"]["ESAS_01"](this.__y.eski_basari))/100;//Math.sqrt(this.__y.basari)*(1 + Math.random()/1000);
	 else if (this.__y.basari > ATA["ZekATA"]["VE"]([this.__y.eski_basari,0.9])) this["Yön"][this["I"]] *= (1 + Math.random()/1000);
	 else if (this.__y.basari > ATA["ZekATA"]["VE"]([this.__y.eski_basari,0.75])) this["Yön"][this["I"]] *= 1.01;
	 else if (this.__y.basari > ATA["ZekATA"]["VEYA"]([this.__y.eski_basari,0.5])) this["Yön"][this["I"]] *= 1.05;
	 else if (this.__y.basari > ATA["ZekATA"]["VEYA"]([this.__y.eski_basari,0.3])) this["Yön"][this["I"]] *= 1.09;
	 else if (this.__y.basari > ATA["ZekATA"]["VEYA"]([this.__y.eski_basari,0.1])) this["Yön"][this["I"]] *= 1.2;
	 else this["Yön"][this["I"]] *= 1.25;
	} else if (this.__y.basari < this.__y.eski_basari) {
     if (this["Sayısal Bellek"]["Başarısızlık"][this["I"]] > 50) this["Yön"][this["I"]] *= 1.123456789*(Math.random()/1000+0.0005);
     this["Sayısal Bellek"]["Başarısızlık"][this["I"]]++;
	 if (this.__y.basari > 0.95) this["Yön"][this["I"]] *= 1.5*Math.sqrt(this.__y.basari);
	 else if (this.__y.basari > 0.5) this["Yön"][this["I"]] *= (0.999975 + (Math.random()-0.54321)/20000);
	} else {
     if (this["Sayısal Bellek"]["Başarısızlık"][this["I"]] > 10) this["Yön"][this["I"]] *= 4/3;
     this["Sayısal Bellek"]["Başarısızlık"][this["I"]] += 1/3;
	 if (this.__y.eski_basari == 1) this["Yön"][this["I"]] = 0;
	 else {
      this["Yön"][this["I"]] *= (0.999975 + (Math.random()-0.54321)/2000);
	  this["Sayısal Bellek"]["Başarısızlık"][this["I"]] += 2;
	 }
	}
	if (Math.abs(this["Yön"][this["I"]]) < Math.abs(this["XO"][this["I"]]/20)) this["Yön"][this["I"]] += this["XO"][this["I"]]/20*(Math.random()-0.5);
	if (Math.abs(this["Yön"][this["I"]]) < Math.abs(this["XO"][this["I"]]/20)) this["Yön"][this["I"]] *= 2*(Math.random()-0.5)+5;
   };
   
   
   
   this["Çalıştır"] = function() {
    this["_ÇA0"]();
    this["_ÇA1"]();
    this["_ÇA2"]();
   };
   this["Çıktı"] = function() {
	return this["XO"];
   };
   this["Değişim"] = function(hedef) {
    this["Hedef"] = hedef;
	for (var i=0;i<this["Başarı"].length;i++) this["Başarı"][i] = 0;
   };
  break;
  case 3: // taakkul nöron - kurallı-sınırlayıcı-fonksiyonel nöron // ve/veya bağlacı
   this["Başarı"] = [0];
   this["Yön"] = [1];
   this["XO"] = [0];
   this["Hedef"] = 0;
  break;
  case 4: // tasdik nöron - geridönütlü-deneyici-yargısal nöron // 0.5 > x => elemeli
  break;
  case 5: // izan nöron - haricigeridönütlü-haricideneyici nöron // ve/veya bağlacı ile en iyi 3
  break;
  case 6: // iltizam nöron - hedefli-amaçlı nöron
  break;
  case 7: // itikat nöron - kendiliğinden-refleskli nöron
  break
 }
};
ATA["ZekATA"]["Nöron"]["Oluştur"] = function(oTur) {
 var nor = {};
 nor["Şekil Ver"] = ATA["ZekATA"]["Nöron"]["Şekil Ver"];
 nor["Şekil Ver"](oTur);
 nor["Şekil Ver"] = false;
 return nor;
};



ATA["ZekATA"]["Uzay"] = {};
ATA["ZekATA"]["Uzay"]["Tara"] = function(n) {
 ;
};
ATA["ZekATA"]["Uzay"]["Uzay"] = [];
ATA["ZekATA"]["Uzay"]["Oluştur"] = function(n,fonk) {
 var g_uzay = fonk;
 for (var i=n.length;i>0;i--) {
  var g_uzay_ = [];
  for (var j=0;j<n[i-1];j++) g_uzay_.push(g_uzay);
  g_uzay = "[" + g_uzay_.join(",") + "]";
 }
 return eval(g_uzay);
};

ATA["ZekATA"]["Uzay"]["Sayısal Oluştur"] = function(n) {
 var g_uzay = 0;
 for (var i=n.length;i>0;i--) {
  var g_uzay_ = [];
  for (var j=0;j<n[i-1];j++) g_uzay_.push(g_uzay);
  g_uzay = g_uzay_;
 }
 return g_uzay;
};

ATA["ZekATA"]["ÖVEYA"] = function(ora) {
 var deg = ora[0] - ora[1];
 return ((deg>0)?deg:-deg);
};
ATA["ZekATA"]["DEĞİL"] = function(ora) {
 return (1-ora);
};
ATA["ZekATA"]["VE"] = function(ora) {
 var ora_ = 0;
 for (var i=0;i<ora.length;i++) ora_ += Math.pow(ora[i],1/ora.length);//ora[i];
 ora_ /= ora.length;
 ora_ = Math.pow(ora_,ora.length); //ora_ *= ora_;
 return ora_;
};
ATA["ZekATA"]["VEYA"] = function(ora) {
 var ve_ = [];
 for (var i=0;i<ora.length;i++) ve_.push(this["DEĞİL"](ora[i]));
 return this["DEĞİL"](this["VE"](ve_));
};



ATA["ZekATA"]["Aralıklı"] = {};
ATA["ZekATA"]["Aralıklı"]["Değer Al"] = function(aral, _n) {
	_n *= aral["Ana"].length;
	var aral0as = [];for (var i=0;i<aral["Ana"].length;i++) ATA["ZekATA"]["Dil İfade"]["ESAS_01"](aral["Ana"][i]);
	var alt0 = Math.floor(_n);
	var ust0 = Math.floor(_n+1);
	if (ust0 == aral["Ana"].length) {
		ust0 = 0;
	}
	var oran = _n - alt0;
	return ATA["ZekATA"]["Dil İfade"]["01_ESAS"](ATA["ZekATA"]["VEYA"]([ATA["ZekATA"]["VE"](aral0as),ATA["ZekATA"]["Dil İfade"]["ESAS_01"](aral["Ana"][ust0]*oran+aral["Ana"][alt0]*(1-oran)),ATA["ZekATA"]["Dil İfade"]["ESAS_01"]((aral["Ana"][ust0]*oran*oran+aral["Ana"][alt0]*(1-oran)*(1-oran))/(oran*oran + (1-oran)*(1-oran)))/*,ATA["ZekATA"]["Dil İfade"]["ESAS_01"]((oran>0.5)?aral["Ana"][ust0]:aral["Ana"][alt0])*/]));
};/*
	var deg = 0;
 _n *= aral["Ana"].length;
 var _nn = Math.floor(_n);
 var oran = (_n - _nn);
 deg += aral["Ana"][_nn]*oran;
 if (_n < 1) _n += aral["Ana"].length;
 _n += 1;
 deg += aral["Ana"][Math.floor(_n)]*(1 - oran);
 return deg;
};*/
ATA["ZekATA"]["Aralıklı"]["Değer Al2"] = function(aral, _n) {
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
ATA["ZekATA"]["Aralıklı"]["Aralıklılar"] = {};
ATA["ZekATA"]["Aralıklı"]["Aralıklı Sayısı"] = 0;
ATA["ZekATA"]["Aralıklı"]["Oluştur"] = function(n) {
 var aral_ = {};
 aral_["Ana"] = [];
 for (var i=0;i<n;i++) aral_["Ana"][i] = 0;
 aral_["Değer Al"] = function(_n) {return ATA["ZekATA"]["Aralıklı"]["Değer Al"](this, _n);};
 return aral_;
};


ATA["ZekATA"]["Kalıtım"] = {};
ATA["ZekATA"]["Kalıtım"]["_Veri Türü"] = {};
ATA["ZekATA"]["Kalıtım"]["_Veri Türü"]["SAYI"] = function(oVeri) {
 var nesne_ = {};
 nesne_["Veri"] = 0;
 nesne_["Ata"] = function(oVerii) {
  this["Veri"] = oVerii;
 };
 nesne_["Oku"] = function(oVerii) {
  return this["Veri"];
 };
 nesne_["Bozutma"] = function(oY) {
  var _bz = 0;
  while(_bz == 0 || _bz == 1) _bz = Math.random();
  switch((""+oY).toUpperCase()) {
   case "0AS": // 0+S arası mutasyon
    while(_bz > this["Veri"] || _bz == 0 || _bz == 1) _bz = Math.random();
   case "ESAS": // -s+s arası mutasyon
	this["Veri"] += (Math.random()-0.5)*2*_bz;
	break;
   case "N": // sayısal doğrusal mutasyon
    this["Veri"] += + ((_bz>(2/3))?1:0) - ((_bz<(1/3))?1:0) + ((_bz>(9/10))?1:0) - ((_bz<(1/10))?1:0);
	break;
   case "0Y":
   default:
    if (oY>1) {
     this["Veri"] += (Math.random()-0.5)*2*_bz/oY;
	}
    break;
  }
 };
 nesne_["Bozutma2"] = function(oY,oKs) {
  var oKs = (oKs)?oKs:0.1;
  var _bz = 0;
  var __bz = ATA["ZekATA"]["Dil İfade"]["01_0AS"](this["Veri"]);
  while(_bz == 0 || _bz == 1 || __bz < _bz) _bz = Math.random()*oKs;
  switch(oY.toUpperCase()) {
   default:
   case "1Y":
    this["Veri"] = ATA["ZekATA"]["Dil İfade"]["0AS_01"](__bz + _bz);
	break;
   case "0Y":
    this["Veri"] = ATA["ZekATA"]["Dil İfade"]["0AS_01"](__bz - _bz);
	break;
  }
 };
 nesne_["Çaprazla"] = function(oNes) { // 1234567890
  if (Math.random() < 0.1) {
   var v = this["Veri"];
   this["Veri"] = oNes["Oku"]();
   oNes["Ata"](v);
   return 1;
  } else return 0;
 };
 return nesne_;
};
ATA["ZekATA"]["Kalıtım"]["_Veri Türü"]["YAZI"] = function(oVeri) {
 var nesne_ = {};
 nesne_["Veri"] = "";
 nesne_["Ata"] = function(oVerii) {
  this["Veri"] = ""+oVerii;
 };
 nesne_["Oku"] = function(oVerii) {
  return this["Veri"];
 };
 nesne_["Bozutma"] = function(oY) {
  var _bz = Math.floor(Math.random()*this["Veri"].length);
  var __bz = Math.random();
  __bz = ((__bz>(2/3))?1:0) - ((__bz<(1/3))?1:0) + ((__bz>(9/10))?1:0) - ((__bz<(1/10))?1:0);
  this["Veri"] = this["Veri"].substr(0,_bz) + String.fromCharCode(this["Veri"].charCodeAt(_bz+__bz)) + this["Veri"].substr(_bz+1,this["Veri"].length);
 };
 nesne_["Çaprazla"] = function(oNes, oYon) { // 1234567890
  if (Math.random() < 0.1) {
   switch((""+oYon).toLowerCase()) {
    default:
    case "tüm":
    case "tum":
     var v = this["Veri"];
     this["Veri"] = oNes["Oku"]();
     oNes["Ata"](v);
     return 1;
	 break;
	case "harf":
	 var _bz = (this["Veri"].length>oNes["Oku"]().length)?oNes["Oku"]().length:this["Veri"].length;
	 _bz = Math.floor(Math.random()*_bz);
     var va = this["Veri"].substr(0,_bz) + this["Veri"].charAt(_bz) + this["Veri"].substr(_bz+1,this["Veri"].length);
	 var vb = oNes["Oku"]().substr(0,_bz) + oNes["Oku"]().charAt(_bz) + oNes["Oku"]().substr(_bz+1,oNes["Oku"]().length);
	 this["Veri"] = va;
	 oNes["Ata"](vb);
   }
  } else return 0;
 };
 return nesne_;
};
ATA["ZekATA"]["Kalıtım"]["Oluştur"] = function() {
 var kal = {};
 kal["Genler"] = {};
 kal["Ekle"] = function(oAd,oTur,oVeri) {
  this["Genler"]["_"+oAd] = ATA["ZekATA"]["Kalıtım"]["_Veri Türü"][""+oTur.toUpperCase()](oVeri);
 };
 return kal;
};







ATA["ZekATA"]["Çalıştır"] = function() {
 var noron_sayisi = 10000;
 var ortalama_bag_sayisi = 8;
 for (var i=0;i<noron_sayisi;i++) {
  ATA["ZekATA"]["Nöron"]["Oluştur"](i);
 }
};
