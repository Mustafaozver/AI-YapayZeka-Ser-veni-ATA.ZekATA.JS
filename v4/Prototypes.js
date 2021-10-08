///////////////////////////////////////////////////////////////////////////

/*
ATA Prototypes sürüm 1.0
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

ATA.logger = false;
ATA.log = function(mes) {
	if (!this.logger) return;
	console.log(mes);
};

ATA.Math = {};
ATA.Math.GoldenRate = Math.sqrt(5)/2;

///////////////////////////////////////////////////////////////////////////

// Array

Array.prototype.standardDeviation = function(usePopulation = false) {
	var avar = this.avarage();
	var tot = 0;
	for (var i=0;i<this.length;i++) tot += Math.abs(avar - this[i]);
	return tot/this.length;
	
	const mean = this.reduce((acc, val) => acc + val, 0) / this.length;
	return Math.sqrt(this.reduce(function(acc, val) {
		return acc.concat((val-mean)**2)
	}, []).reduce(function(acc, val) {
		return acc + val
	},0)/(this.length - (usePopulation ? 0 : 1)));
};

Array.prototype.correlation = function(arr) {
	var prom_x = this.avarage();
	var prom_y = arr.avarage();
	return (this.map(function(e, i, r){
		return r = {x:e, y:arr[i]};
	}).reduce(function(s, a){
		return s + a.x * a.y;
	},0)-this.length*prom_x*prom_y)/((Math.sqrt(this.reduce(function(s, a){
		return(s + a * a)
	},0)-this.length*prom_x*prom_x))*(Math.sqrt(arr.reduce(function(s, a){
		return(s + a * a)
	},0)-this.length*prom_y*prom_y)));
};

Array.prototype._forEachSpace = function(func) { // for Spaces // 1234567890
	if (this.length == 0) return;
	else if (Array.isArray(this[0])) for (var i=0;i<this.length;i++) this[i] = this[i]._forEachSpace(func);
	else {
		var temp = [];
		for (var i=0;i<this.length;i++) temp.push(func(this[i]));
		return temp;
	}
};

Array.prototype.addStepNum = function(step,inc,lim,func) {
	func = func?func:(function(x){return x;});
	for (;step<=lim;step+=inc) this.push(func(step));
	return this;
};

Array.prototype._forEachSpace = function(func) { // for Spaces // 1234567890
	if (this.length == 0) return;
	else if (Array.isArray(this[0])) for (var i=0;i<this.length;i++) this[i] = this[i].map(func);
	else {
		var temp = this.map(func);
		for (var i=0;i<this.length;i++) this[i] = func(this[i]);
	}
};

Array.prototype.applyProcess = function(met,func) {
	if (!func) func = function(x) {return x;};
	var sonuc;
	switch(met.toLowerCase()) {
		default:
		case "+":
			sonuc = 0;
			for (var i=0;i<this.length;i++) sonuc += func(this[i]);
			return sonuc;
		case "*":
			sonuc = 1;
			for (var i=0;i<this.length;i++) sonuc *= func(this[i]);
			return sonuc;
		case "ao":
			return this.applyProcess("+")/this.length;
	}
};

Array.prototype.get = function(N) {
	return this[N[0]];
};

Array.prototype.clone = function() {
	var newobj = [];
	for (var i=0;i<this.length;i++) newobj.push(this[i].clone());
	return newobj;
};

// Keyer

function Keyer(name,func,oObj) {
	this.id = "_" + name;
	this._sym = Symbol(name);
	this[this._sym] = {};
	this[this._sym]._sym = this._sym;
	this[this._sym][this._sym] = oObj.clone();
	this[this._sym][this._sym].F = func?func:(function() {});
	Keyer.Keys[this._sym] = {};
	Keyer.Keys[this._sym][this.id] = this;
}

Keyer = Keyer.clone();

Keyer.Keys = {};
Keyer.getKeyer = function(sym, name) {
	if (this.Keys[sym]) {
		if (this.Keys[sym]["_" + name]) return this.Keys[sym]["_" + name];
		else return false;
	} else return false;
};

Keyer.getKeyer = Keyer.getKeyer.clone();

Keyer.prototype.F = function(key1) {
	var key2;
	if (!key1) key1 = this._sym;
	if (!this[key1]) return false;
	if (!(key2 = this[key1]._sym)) return false;
	if (!Keyer.Keys[key1]) return false;
	if (!Keyer.Keys[key1][this.id]) return false;
	var thatkeyer = Keyer.Keys[key1][this.id];
	if (!thatkeyer[key1]) return false;
	var thatkey = thatkeyer[key1]._sym;
	if (!Keyer.Keys[key1][this.id][key2]) return false;
	return Keyer.Keys[thatkey][this.id][key1][key2].F();
};

Keyer.prototype.F = Keyer.prototype.F.clone();

Keyer.prototype.getKey = function(name) {
	return Keyer.Keys[this._sym]["_" + name]._sym;
};
Keyer.prototype.getKey = Keyer.prototype.getKey.clone();

Keyer.prototype.set = function(name, value, key1) {
	var key2;
	if (!key1) key1 = this._sym;
	if (!this[key1]) return false;
	if (!(key2 = this[key1]._sym)) return false;
	if (!Keyer.Keys[key1]) return false;
	if (!Keyer.Keys[key1][this.id]) return false;
	var thatkeyer = Keyer.Keys[key1][this.id];
	if (!thatkeyer[key1]) return false;
	var thatkey = thatkeyer[key1]._sym;
	if (!Keyer.Keys[key1][this.id][key2]) return false;
	return !!(Keyer.Keys[thatkey][this.id][key1][key2][""+name] = value.clone());
};
Keyer.prototype.set = Keyer.prototype.set.clone();

Keyer.prototype.get = function(name, key1) {
	var key2;
	if (!key1) key1 = this._sym;
	if (!this[key1]) return false;
	if (!(key2 = this[key1]._sym)) return false;
	if (!Keyer.Keys[key1]) return false;
	if (!Keyer.Keys[key1][this.id]) return false;
	var thatkeyer = Keyer.Keys[key1][this.id];
	if (!thatkeyer[key1]) return false;
	var thatkey = thatkeyer[key1]._sym;
	if (!Keyer.Keys[key1][this.id][key2]) return false;
	return Keyer.Keys[thatkey][this.id][key1][key2][""+name];
};
Keyer.prototype.get = Keyer.prototype.get.clone();

Keyer.prototype.Lock = function() {
	if(this._sym = null);
	else return false;
};

Keyer.prototype.UnLock = function(key1) {
	var key2;
	if (!key1) key1 = this._sym;
	if (!this[key1]) return false;
	if (!(key2 = this[key1]._sym)) return false;
	if (!Keyer.Keys[key1]) return false;
	if (!Keyer.Keys[key1][this.id]) return false;
	var thatkeyer = Keyer.Keys[key1][this.id];
	if (!thatkeyer[key1]) return false;
	var thatkey = thatkeyer[key1]._sym;
	if (!Keyer.Keys[key1][this.id][key2]) return false;
	return !!(Keyer.Keys[thatkey][this.id]._sym = key1);
};
Keyer.prototype.UnLock = Keyer.prototype.UnLock.clone();

/*
var keyer_str = "keyer";
var nkeyer1 = new Keyer(keyer_str,function() {alert(this.x);},{x:1});
var nkeyer2 = new Keyer(keyer_str,function() {alert(this.y);},{y:2});

var nkey1 = nkeyer1.getKey(keyer_str); // keyer_str needed to get the key
var nkey2 = nkeyer2.getKey(keyer_str);

nkeyer1.F(); // without nkeyers, F does not work
nkeyer2.F();

nkeyer1.Lock();
nkeyer2.Lock();

nkeyer1.F(nkey1); // nkeys required to execute it
nkeyer2.F(nkey2);

var nkeyer1 = null;
var nkeyer2 = null;

var nkeyer1 = Keyer.getKeyer(nkey1, keyer_str);
var nkeyer2 = Keyer.getKeyer(nkey2, keyer_str);

*/