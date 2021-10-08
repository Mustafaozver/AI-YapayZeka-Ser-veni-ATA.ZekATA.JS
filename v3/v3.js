///////////////////////////////////////////////////////////////////////////

/*
ATA Yapay Zeka ZekATA sürüm 3.00
Mustafa ÖZVER Tarafından.
*/

///////////////////////////////////////////////////////////////////////////

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

Function.prototype.clone = function() {
    var that = this;
    var temp = function temporary() { return that.apply(this, arguments); };
    for(var key in this) {
        if (this.hasOwnProperty(key)) {
            temp[key] = this[key];
        }
    }
    return temp;
};

ATA["PID"] = {};
ATA["PID"]["Dizin"] = [];
ATA["PID"]["Oluştur"] = function() {
	var pid = {};
	pid.kmlk = ATA["PID"]["Dizin"].length;
	pid.KP = 2/(Math.sqrt(5) + 1)*0.01; // Altın Oran / 100
	pid.KI = 1e-15; // 10^-15
	pid.KD = 0.000007; // 7x10^-6
	pid.__xe = 0;
	pid.__xt = 0;
	pid.__y = 0;
	pid.F = 1;
	pid.H = function(x) {
		var t_ = (2.1764705054292435*x - this.__y);
		return t_;
	};
	pid.turevAl = function(x) {
		return (x - this.__xe)*this.F;
	};
	pid.integralAl = function(x) {
		this.__xt += x/this.F;
		return this.__xt;
	};
	pid.I = function(x) {
		x = this.H(x);
		this.__y = this.KP*x + this.KD*this.turevAl(x) + this.KI*this.integralAl(x);
		this.__xe = x;
		return this.__y;
	};
	
	ATA["PID"]["Dizin"].push(pid);
	return pid;
};

///////////////////////////////////////////////////////////////////////////
ATA["ZekATA"] = {}; // var nesnesi

ATA["ZekATA"]["Dil İfade"] = {}; // aralık değiştirme
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
ATA["ZekATA"]["Uzay"] = {};
ATA["ZekATA"]["Uzay"]["Tara"] = function(__uzay,n,fonk) {
	var yol = [0];
	while (Array.isArray(eval("__uzay[" + yol.join("][") + "]"))) yol.push(0);
};

ATA["ZekATA"]["Uzay"]["Uzay"] = []; // uzay nesnesi
ATA["ZekATA"]["Uzay"]["Oluştur"] = function(n,fonk) {
	var g_uzay = fonk;
	for (var i=n.length-1;i>=0;i--) {
		var g_uzay_ = [];
		for (var j=0;j<n[i];j++) g_uzay_.push(g_uzay);
		g_uzay = "[" + g_uzay_.join(",") + "]";
	}
	return eval(g_uzay);
};

ATA["ZekATA"]["Uzay"]["Sayısal Oluştur"] = function(n) {
	var g_uzay = 0;
	for (var i=n.length-1;i>=0;i--) {
		var g_uzay_ = [];
		for (var j=0;j<n[i];j++) g_uzay_.push(g_uzay);
		g_uzay = g_uzay_;
	}
	return g_uzay;
};

ATA["ZekATA"]["ÖVEYA"] = function(ora) { // mantıksal işlemler
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
	ora_ = Math.pow(ora_,ora.length);
	return ora_;
};
ATA["ZekATA"]["VEYA"] = function(ora) {
	var ve_ = [];
	for (var i=0;i<ora.length;i++) ve_.push(this["DEĞİL"](ora[i]));
	return this["DEĞİL"](this["VE"](ve_));
};

ATA["ZekATA"]["Aralıklı"] = {}; // aralıklı veri haritası
ATA["ZekATA"]["Aralıklı"]["Aralıklılar"] = {};
ATA["ZekATA"]["Aralıklı"]["Aralıklı Sayısı"] = 0;
ATA["ZekATA"]["Aralıklı"]["Değer Al"] = function(aral, _n) {
	_n *= aral["Ana"].length-0.5;
	var alt0 = Math.floor(_n);
	var ust0 = Math.floor(_n+1);
	//var alt1 = alt0>0?(alt0-1):aral["Ana"].length-1;
	//var ust1 = ust0<(aral["Ana"].length-1)?ust0+1:0;
	//var aci0 = Math.atan((aral["Ana"][ust0]-aral["Ana"][alt1]));
	//var aci1 = Math.atan((aral["Ana"][ust1]-aral["Ana"][alt0]));
	var oran = Math.sin((_n - alt0 - 0.5)*Math.PI)/2+0.5;
	if (ust0 == aral["Ana"].length) ust0 = 0;
	if (alt0 == -1) alt0 = aral["Ana"].length-1;
	var KD = oran*aral["Ana"][ust0] + (1-oran)*aral["Ana"][alt0];
	return KD;
};

/*ATA["ZekATA"]["Aralıklı"]["Değer Al"] = function(aral, _n) {
	_n *= aral["Ana"].length;
	var alt0 = Math.floor(_n);
	var ust0 = Math.floor(_n+1);
	var oran = _n - alt0;
	var orta = 1-2*Math.abs(0.5 - oran);
	if (ust0 == aral["Ana"].length) ust0 = 0;
	if (alt0 == -1) alt0 = aral["Ana"].length-1;
	var KD = oran*aral["Ana"][ust0] + (1-oran)*aral["Ana"][alt0];
	return KD;
};*/

ATA["ZekATA"]["Aralıklı"]["Oluştur"] = function(n) {
	var aral_ = {};
	aral_.Kimlik = "ARAL_" + ATA["ZekATA"]["Aralıklı"]["Aralıklı Sayısı"]++;
	aral_["Ana"] = [];
	for (var i=0;i<n;i++) aral_["Ana"][i] = 0;
	aral_["Değer Al"] = function(_n) {return ATA["ZekATA"]["Aralıklı"]["Değer Al"](this, _n);};
	aral_["Değer Yaz"] = function(_n,deg) {
			_n *= this["Ana"].length-0.5;
			var alt0 = Math.floor(_n);
			var ust0 = Math.floor(_n+1);
			var oran = _n - alt0;
			if (ust0 == this["Ana"].length) ust0 = 0;
			this["Ana"][alt0] = oran*this["Ana"][alt0] + (1 - oran)*deg;
			this["Ana"][ust0] = (1 - oran)*this["Ana"][ust0] + oran*deg;
	};
	ATA["ZekATA"]["Aralıklı"]["Aralıklılar"][aral_.Kimlik] = aral_;
	return aral_;
};

ATA["ZekATA"]["Kalıtım"] = {}; // kalıtım
ATA["ZekATA"]["Kalıtım"]["_Veri Türü"] = {};
ATA["ZekATA"]["Kalıtım"]["_Veri Türü"]["Kalıtsallar"] = {};
ATA["ZekATA"]["Kalıtım"]["_Veri Türü"]["Kalıtsal Sayısı"] = 0;
ATA["ZekATA"]["Kalıtım"]["_Veri Türü"]["Oluştur"] = function(turu) {
	var kalitim = {};
	kalitim.Kimlik = "KALTSAL_" + ATA["ZekATA"]["Kalıtım"]["_Veri Türü"]["Kalıtsal Sayısı"]++;
	kalitim.G = Object.assign({},ATA["ZekATA"]["Kalıtım"]["_Veri Türü"][("" + turu).toUpperCase()].G);
	kalitim.Bozut = ATA["ZekATA"]["Kalıtım"]["_Veri Türü"][("" + turu).toUpperCase()].Bozut.clone();
	kalitim.Yukle = ATA["ZekATA"]["Kalıtım"]["_Veri Türü"][("" + turu).toUpperCase()].Yukle.clone();
	kalitim.TersYukle = ATA["ZekATA"]["Kalıtım"]["_Veri Türü"][("" + turu).toUpperCase()].TersYukle.clone();
	kalitim.Deger = ATA["ZekATA"]["Kalıtım"]["_Veri Türü"][("" + turu).toUpperCase()].Deger;
	kalitim.Basari = ATA["ZekATA"]["Kalıtım"]["_Veri Türü"][("" + turu).toUpperCase()].Basari;
	kalitim.Yon = ATA["ZekATA"]["Kalıtım"]["_Veri Türü"][("" + turu).toUpperCase()].Yon;
	ATA["ZekATA"]["Kalıtım"]["_Veri Türü"]["Kalıtsallar"][kalitim.Kimlik] = kalitim;
	return kalitim;
};

ATA["ZekATA"]["Kalıtım"]["Çaprazla"] = function() {
};

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
function KalitimCesitEkle(turu,bozut,deg,G) {
	var tur = {};
	if (G) tur.G = G;
	if (bozut) tur.Bozut = bozut;
	else tur.Bozut = function() {};
	tur.Yukle = function() {this.Deger = this.Gecici;};
	tur.TersYukle = function() {this.Gecici = this.Deger;};
	tur.Deger = deg;
	tur.Basari = 0;
	tur.Yon = 0;
	tur.Turu = ("" + turu).toUpperCase();
	ATA["ZekATA"]["Kalıtım"]["_Veri Türü"][("" + turu).toUpperCase()] = tur;
}
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

KalitimCesitEkle("TAMSAYI",function() {
	var orantisal_deger = 0.95;
	orantisal_deger = ATA["ZekATA"]["VEYA"]([orantisal_deger,ATA["ZekATA"]["Dil İfade"]["ESAS_01"](this.Deger)]);
	var bozutma = Math.asin((Math.random()-0.5)*2*orantisal_deger)*2/Math.PI;
	for (var i=0;i<0;i++) bozutma = Math.asin(bozutma)*2/Math.PI;
	var deger0 = this.Deger*(orantisal_deger + (1-orantisal_deger)*bozutma)/orantisal_deger;
	var deger1 = this.Deger*(1 + bozutma*(Math.random()-0.5));
	this.Gecici = Math.floor(0.5+(deger0 + deger1)/2 + this.Yon*Math.random());
},0);

KalitimCesitEkle("SAYI",function() {
	var orantisal_deger = 0.95;
	orantisal_deger = ATA["ZekATA"]["VEYA"]([orantisal_deger,ATA["ZekATA"]["Dil İfade"]["ESAS_01"](this.Deger)]);
	var bozutma = Math.asin((Math.random()-0.5)*2*orantisal_deger)*2/Math.PI;
	for (var i=0;i<0;i++) bozutma = Math.asin(bozutma)*2/Math.PI;
	var deger0 = this.Deger*(orantisal_deger + (1-orantisal_deger)*bozutma)/orantisal_deger;
	var deger1 = this.Deger*(1 + bozutma*(Math.random()-0.5));
	this.Gecici = (deger0 + deger1)/2 + this.Yon*Math.random();
},0);


ATA["ZekATA"]["Nöron"] = {}; // nöron işlemleri
ATA["ZekATA"]["Nöron"]["Yöntemler"] = []; // aktivasyon fonksiyonları
///////////////////////////////////////////////////////////////////
function AktivasyonFonksiyonu(fonksiyon,degsay,deg,G) {
	var fonk = {};
	fonk.T = ATA["ZekATA"]["Nöron"]["Yöntemler"].length;
	if (!degsay) degsay = 0;
	if (!deg) deg = 1;
	if (G) fonk.G = G;
	fonk.DEG = [];
	fonk.Girdi = [];
	fonk.Cikti = [];
	for (var i=0;i<degsay;i++) {
		var deg_ = new ATA["ZekATA"]["Kalıtım"]["_Veri Türü"]["Oluştur"]("TAMSAYI");
		deg_.Deger = deg;
		fonk.DEG.push(deg_);
	}
	if (fonksiyon) fonk.F = fonksiyon;
	else fonk.F = function() {return 0};
	fonk.FN = fonk.F.length;
	return fonk;
}
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

ATA["ZekATA"]["Nöron"]["Yöntem Oluştur"] = function(n) {
	var yeni = {};
	switch (n) {
		default:
			if (ATA["ZekATA"]["Nöron"]["Yöntemler"][n]) yeni.G = Object.assign({},ATA["ZekATA"]["Nöron"]["Yöntemler"][n].G);
			yeni.DEG = ATA["ZekATA"]["Nöron"]["Yöntemler"][n].DEG.slice();
			yeni.Girdi = ATA["ZekATA"]["Nöron"]["Yöntemler"][n].Girdi.slice();
			yeni.Cikti = ATA["ZekATA"]["Nöron"]["Yöntemler"][n].Cikti.slice();
			yeni.F = ATA["ZekATA"]["Nöron"]["Yöntemler"][n].F.clone();
			yeni.FN = ATA["ZekATA"]["Nöron"]["Yöntemler"][n].FN;
			yeni.T = ATA["ZekATA"]["Nöron"]["Yöntemler"][n].T;
			yeni["Hedef"] = 0;
			if (ATA["ZekATA"]["Nöron"]["Yöntemler"][n]["Yenileme"]) {
				yeni["Yenileme"] = ATA["ZekATA"]["Nöron"]["Yöntemler"][n]["Yenileme"];
				yeni["Yenileme"]();
				yeni["Yenileme"] = null;
			}
			return yeni;
		break;
		case "SIRA":
			yeni.G = {};
			yeni.G.A = ATA["ZekATA"]["Aralıklı"]["Oluştur"](20);
			for (var i=0;i<20;i++) yeni.G.A["Ana"][i] = Math.sin(i/10*Math.PI);
			yeni.DEG = [5,0.25,0,0,1,1];
			for (var i=0;i<6;i++) {
				var _deg = yeni.DEG[i];
				yeni.DEG[i] = ATA["ZekATA"]["Kalıtım"]["_Veri Türü"]["Oluştur"]("SAYI");
				yeni.DEG[i].Deger = _deg;
				yeni.DEG[i].Yon = _deg/25 + 0.005;
			}
			yeni.F = function(X) {
				var A = this.DEG[0].Deger*this.DEG[4].Deger;
				var B = this.DEG[1].Deger*this.DEG[5].Deger;
				var C = this.DEG[2].Deger*this.DEG[5].Deger;
				var D = this.DEG[3].Deger*this.DEG[4].Deger;

				X = B*X + C;
				return A*this.G.A["Değer Al"](X<0?(1+X%1):(X%1)) + D;
			};
			return yeni;
		break;
		case "AĞCI":
			yeni.G = {};
			yeni.DEG = [];
			yeni.Deg_S = 0;
			
		break;
	}
};

ATA["ZekATA"]["Nöron"]["Parametreler"] = {};
ATA["ZekATA"]["Nöron"]["Parametreler"]["Bağ Sayısı"] = 10;
ATA["ZekATA"]["Nöron"]["Parametreler"]["Genel Girdi"] = "NOR_1";
ATA["ZekATA"]["Nöron"]["Parametreler"]["Genel Çıktı"] = "NOR_0";
ATA["ZekATA"]["Nöron"]["Nöronlar"] = {};
ATA["ZekATA"]["Nöron"]["Nöron Sayısı"] = 0;
ATA["ZekATA"]["Nöron"]["Oluştur"] = function (n,ofunc) {
	var nor = new this["Yöntem Oluştur"](n);
	nor.Kimlik = "NOR_" + ATA["ZekATA"]["Nöron"]["Nöron Sayısı"]++;
	nor.Bozut_i = function(i) {
		this.DEG[i].Bozut();
	};
	nor["I"] = 0;
	nor["Başarı"] = [];
	nor["Durak"] = 0;
	nor["_PIDG"] = ATA["PID"]["Oluştur"]();
	nor["Hedef"] = function() {
		if (this.Girdi.length == 0) return false;
		var toplam = 0;
		var i,j=0;
		for (i=0;i<this.Girdi.length;i++){
			var noronKimlik = this.Cikti[i];
			if (ATA["ZekATA"]["Nöron"]["Nöronlar"][noronKimlik]) toplam += ATA["ZekATA"]["Nöron"]["Nöronlar"][noronKimlik]["Durak"];
			else j++;
		}
		if (i == j) i = 1;
		else i -= j;
		return this["_PIDG"].I(toplam/i);
	};
	nor["Y0"] = 0;
	for (var i=0;i<nor.DEG.length;i++) {
		nor["Başarı"].push(0);
	}
	nor["Koşul Denetimi"] = function() { return 1;};
	nor["Bağla"] = function(yon,noron) {
		if (yon == "<") {
			if (this.Girdi.length >= ATA["ZekATA"]["Nöron"]["Parametreler"]["Bağ Sayısı"]) return;
			if (this.Girdi.length >= this.FN) return;
			if (this.Girdi.indexOf(noron) != -1) return;
			if (noron != ATA["ZekATA"]["Nöron"]["Parametreler"]["Genel Girdi"]) ATA["ZekATA"]["Nöron"]["Nöronlar"][noron].Cikti.push(this.Kimlik);
			this.Girdi.push(noron);
			
		} else if (yon == ">") {
			if (ATA["ZekATA"]["Nöron"]["Nöronlar"][noron].Girdi.length >= ATA["ZekATA"]["Nöron"]["Parametreler"]["Bağ Sayısı"]) return;
			if (ATA["ZekATA"]["Nöron"]["Nöronlar"][noron].Girdi.length >= ATA["ZekATA"]["Nöron"]["Nöronlar"][noron].FN) return;
			if (ATA["ZekATA"]["Nöron"]["Nöronlar"][noron].Girdi.indexOf(this.Kimlik) != -1) return;
			if (noron != ATA["ZekATA"]["Nöron"]["Parametreler"]["Genel Çıktı"]) ATA["ZekATA"]["Nöron"]["Nöronlar"][noron].Girdi.push(this.Kimlik);
			this.Cikti.push(noron);
		}
	};
	nor["Çalıştır_0"] = function() { // x0, x1 parametreleri hazırlanıyor
		this["I"] = (Math.random()<0.5)?Math.floor(Math.random()*this.DEG.length):this["I"];
		this.__y = {};
		this.__y.eski_basari = this["Başarı"][this["I"]];
		this.__y.x0 = this.DEG[this["I"]].Deger;
		this.Bozut_i(this["I"]);
		this.__y.x1 = this.DEG[this["I"]].Deger;
	};
	nor["Çalıştır_1"] = function() { // nöron çalışıyor ve sonuc aktarılıyor
		//if (Math.random() < 0.1 && !this.Cikti[ATA["ZekATA"]["Nöron"]["Parametreler"]["Genel Girdi"]]) this.Cikti.push(ATA["ZekATA"]["Nöron"]["Parametreler"]["Genel Girdi"]);
		if (Math.random() < 0.1 && this.Girdi.indexOf(ATA["ZekATA"]["Nöron"]["Parametreler"]["Genel Çıktı"]) == -1) this.Girdi.push(ATA["ZekATA"]["Nöron"]["Parametreler"]["Genel Çıktı"]);
		if (this.Girdi.length == 0)	this["Bağla"]("<","NOR_" + Math.floor(ATA["ZekATA"]["Nöron"]["Nöron Sayısı"]*Math.random()));
		if ((this.Girdi.length + this.Cikti.length) < 2*ATA["ZekATA"]["Nöron"]["Parametreler"]["Bağ Sayısı"]) if (Math.random()<0.5) this["Bağla"]((Math.random()<0.5)?">":"<","NOR_" + Math.floor(ATA["ZekATA"]["Nöron"]["Nöron Sayısı"]*Math.random()));
		
		this.__y.y1 = this.F.call(this, this.Oku());
		if (isNaN(this.__y.y1)) this.__y.y1 = 0;
		if (!isFinite(this.__y.y1)) this.__y.y1 = 0;
	};
	nor["Çalıştır_2"] = function() { // sonuc için başarı hesaplanıyor
		var _hedef = this["Hedef"]();
		if (!_hedef) return;
		this.__y.basari = this["Koşul Denetimi"]()*ATA["ZekATA"]["DEĞİL"](ATA["ZekATA"]["ÖVEYA"]([ATA["ZekATA"]["Dil İfade"]["ESAS_01"](_hedef),ATA["ZekATA"]["Dil İfade"]["ESAS_01"](this.__y.y1)]));
		if (this.__y.basari > this.__y.eski_basari) {
			this.DEG[this["I"]].Yukle();
			this["Başarı"][this["I"]] = this.__y.basari;
			this["Y0"] = this.__y.y1;
			if (this.__y.basari == 1) this.DEG[this["I"]]["Yon"] = 0;
			else if (this.__y.basari > ATA["ZekATA"]["VE"]([this.__y.eski_basari,1])) this.DEG[this["I"]]["Yon"] *= 0.99995;
			else this.DEG[this["I"]]["Yon"] *= 1.005;
		} else {
			if (this.__y.basari > 0.95) this.DEG[this["I"]]["Yon"] *= 0.99;
			else this.DEG[this["I"]]["Yon"] *= 1.0001;
		}
	};
	if (!nor.Oku) {
		if (ofunc) nor.Oku = eval(ofunc);
		else nor.Oku = function(){
			var arr_ = [];
			for (var i=0;i<this.Girdi.length;i++) arr_.push(ATA["ZekATA"]["Nöron"]["Nöronlar"][this.Girdi[i]]["Y0"]);
			return arr_;
		};
	}
	
	ATA["ZekATA"]["Nöron"]["Nöronlar"][nor.Kimlik] = nor;
	return nor;
};

ATA["ZekATA"]["Nöron"]["Yöntemler"].push(AktivasyonFonksiyonu(function () { // zaman
	var A = this.DEG[0].Deger*this.DEG[2].Deger;
	var B = this.DEG[1].Deger*this.DEG[2].Deger;
	var C = this.DEG[3].Deger*this.DEG[2].Deger;

	return A*((new Date()).getTime()%B) + C;
},4,1)); // 0
ATA["ZekATA"]["Nöron"]["Yöntemler"].push(AktivasyonFonksiyonu(function (X,Y) { // Toplama
	var A = this.DEG[0].Deger*this.DEG[2].Deger;
	var B = this.DEG[1].Deger*this.DEG[2].Deger;
	var C = this.DEG[3].Deger*this.DEG[2].Deger;

	return A*X + B*Y + C;
},4,1)); // 1
ATA["ZekATA"]["Nöron"]["Yöntemler"].push(AktivasyonFonksiyonu(function (X,Y) { // Çarpma
	var A = this.DEG[0].Deger*this.DEG[2].Deger;
	var B = this.DEG[1].Deger*this.DEG[2].Deger;
	var C = this.DEG[3].Deger*this.DEG[5].Deger;
	var D = this.DEG[4].Deger*this.DEG[5].Deger;

	return D*(X**A)*(Y**B) + C;
},6,1)); // 2
ATA["ZekATA"]["Nöron"]["Yöntemler"].push(AktivasyonFonksiyonu(function (X) { // sinüzaidal
	var A = this.DEG[0].Deger*this.DEG[4].Deger;
	var B = this.DEG[1].Deger*this.DEG[5].Deger;
	var C = this.DEG[2].Deger*this.DEG[5].Deger;
	var D = this.DEG[3].Deger*this.DEG[4].Deger;

	return A*Math.sin(B*X + C) + D;
},6,1)); // 3
ATA["ZekATA"]["Nöron"]["Yöntemler"].push(AktivasyonFonksiyonu(function (X) { // kare
	var A = this.DEG[0].Deger*this.DEG[4].Deger;
	var B = this.DEG[1].Deger*this.DEG[5].Deger;
	var C = this.DEG[2].Deger*this.DEG[5].Deger;
	var D = this.DEG[3].Deger*this.DEG[4].Deger;

	X = B*X + C;
	return A*(((X<0)?(1+X%1):(X%1))<0.5?1:-1) + D;
},6,1)); // 4
ATA["ZekATA"]["Nöron"]["Yöntemler"].push(AktivasyonFonksiyonu(function (X) { // üçgen
	var A = this.DEG[0].Deger*this.DEG[4].Deger;
	var B = this.DEG[1].Deger*this.DEG[5].Deger;
	var C = this.DEG[2].Deger*this.DEG[5].Deger;
	var D = this.DEG[3].Deger*this.DEG[4].Deger;

	X += C;
	var t = X<0?Math.abs(X%B+B):Math.abs(X%B);
	return 2*(t<(B/2)?t:B-t)*A/B - A/2 + D;
},6,1)); // 5
ATA["ZekATA"]["Nöron"]["Yöntemler"].push(AktivasyonFonksiyonu(function (X) { // üstel
	var A = this.DEG[0].Deger;
	var B = this.DEG[1].Deger;

	return A*(X**B);
},2,1)); // 6
ATA["ZekATA"]["Nöron"]["Yöntemler"].push(AktivasyonFonksiyonu(function (X,Y) { // logaritmik
	var A = this.DEG[0].Deger;
	var B = this.DEG[1].Deger*this.DEG[3].Deger;
	var C = this.DEG[2].Deger*this.DEG[3].Deger;

	return A*ATA["LOG"](B*X,C*Y);
},4,1)); // 7
ATA["ZekATA"]["Nöron"]["Yöntemler"].push(AktivasyonFonksiyonu(function () { // gürültü
	var A = this.DEG[0].Deger;
	var B = this.DEG[1].Deger;
	var C = this.DEG[2].Deger;
	var D = this.DEG[3].Deger;

	if (this.G.X >= D) this.G.X -= Math.random()*C;
	else if (this.G.X < (-D)) this.G.X += Math.random()*C;
	else this.G.X += (Math.random()-0.5)*C;
	return A*this.G.X + B;
},4,0.1,{X:0})); // 8
ATA["ZekATA"]["Nöron"]["Yöntemler"].push(AktivasyonFonksiyonu(function (X) { // türev
	var A = this.DEG[0].Deger;

	var t = X-this.G.X;
	this.G.X = X;
	return A*t;
},1,1,{X:0})); // 9
ATA["ZekATA"]["Nöron"]["Yöntemler"].push(AktivasyonFonksiyonu(function (X) { // integral
	var A = this.DEG[0].Deger;

	this.G.X += X*A;
	return this.G.X;
},1,1,{X:0})); // 10
ATA["ZekATA"]["Nöron"]["Yöntemler"].push(AktivasyonFonksiyonu(function (X0,X1,X2,X3) { // toplayıcı
	var K0 = this.DEG[0].Deger;
	var K1 = this.DEG[1].Deger;
	var K2 = this.DEG[2].Deger;
	var K3 = this.DEG[3].Deger;

	return K0*X0 + K1*X1 + K2*X2 + K3*X3;
},4,1)); // 11
ATA["ZekATA"]["Nöron"]["Yöntemler"].push(AktivasyonFonksiyonu(function (X0,X1,X2,X3) { // çarpıcı
	var A = this.DEG[0].Deger;

	return A*X0*X1*X2*X3;
},1,1)); // 12
// Bilinen aktivasyonlar
ATA["ZekATA"]["Nöron"]["Yöntemler"].push(AktivasyonFonksiyonu(function (X) { // step
	var A = this.DEG[0].Deger;
	var B = this.DEG[1].Deger;
	var C = this.DEG[2].Deger;

	return X>A?B:C;
},3,1)); // 13
ATA["ZekATA"]["Nöron"]["Yöntemler"].push(AktivasyonFonksiyonu(function (X) { // sigmoid
	var A = this.DEG[0].Deger;
	
	return A/(1+Math.exp(X));
},1,1)); // 14
ATA["ZekATA"]["Nöron"]["Yöntemler"].push(AktivasyonFonksiyonu(function (X) { // tanh
	var A = this.DEG[0].Deger;
	
	return A*(Math.exp(X) - Math.exp(-X))/(Math.exp(X) + Math.exp(-X));
},1,1)); // 15
ATA["ZekATA"]["Nöron"]["Yöntemler"].push(AktivasyonFonksiyonu(function (X) { // gaussian
	var A = this.DEG[0].Deger;
	
	return A*Math.exp(-X*X);
},1,1)); // 16
ATA["ZekATA"]["Nöron"]["Yöntemler"].push(AktivasyonFonksiyonu(function (X) { // gaussian türevi
	var A = this.DEG[0].Deger;
	
	return A*Math.exp(-X*X)*X;
},1,1)); // 17
ATA["ZekATA"]["Nöron"]["Yöntemler"].push(AktivasyonFonksiyonu(function (X) { // hedef yakınsama
	var A = this.DEG[0].Deger;
	var B = this.DEG[1].Deger;
	
	return A*ATA["ZekATA"]["DEĞİL"](ATA["ZekATA"]["ÖVEYA"]([ATA["ZekATA"]["Dil İfade"]["ESAS_01"](B),ATA["ZekATA"]["Dil İfade"]["ESAS_01"](X)]));
},2,1)); // 18

ATA["ZekATA"]["Ağ"] = {};

/*

var norA = [];
for (var i=0;i<100;i++) norA.push(ATA["ZekATA"]["Nöron"]["Oluştur"](Math.floor(ATA["ZekATA"]["Nöron"]["Yöntemler"].length*Math.random())));

for (var i=0;i<100;i++) {
 for (var j=0;j<norA[i].DEG.length;j++) {
  norA[i].DEG[j].Deger *= 1 + Math.random()/20;
 }
}
for (var p=0;p<20;p++) {
 for (var y=0;y<10;y++) for (var i =0;i<norA.length;i++) norA[i].Çalıştır_0();
 for (var y=0;y<10;y++) for (var i =0;i<norA.length;i++) norA[i].Çalıştır_1();
 for (var y=0;y<10;y++) for (var i =0;i<norA.length;i++) norA[i].Çalıştır_2();
}


























*/