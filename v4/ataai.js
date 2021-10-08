///////////////////////////////////////////////////////////////////////////

/*
ATA Yapay Zeka ZekATA sürüm 3.01
Mustafa ÖZVER Tarafından.
*/

///////////////////////////////////////////////////////////////////////////

// Thread

function Thread() {
	this.ID = "THREAD_" + Thread._N++;
	this._F = [];
	this._ok = false;
	Thread.Threads[this.ID] = this;
}

Thread.prototype.toString = function() {
	return "[Thread Object]";
};

Thread.prototype.valueOf = function() {
	return this.toString();
};

Thread.prototype.clone = function() {
	var newobj = new Thread();
	newobj._F = this._F.clone();
	return newobj;
};

Thread._N = 0;
Thread.Threads = {};

Thread.prototype.F = function() {
	if (this._F.length == 0) return;
	if (this._F[0].length == 0) return;
	var nf = this._F[0].length;
	for (var j=0;j<nf;j++) {
		for (var i=0;i<this._F.length;i++) {
			if (this._F[i].length > nf) nf = this._F[i].length;
			if (this._F[i][j]) setTimeout("(async function(x,y) {Thread.Threads[\"" + this.ID + "\"].get(" + i + "," + j + ")(x,y);})("+i+","+j+");",0);
		}
	}
};

Thread.prototype.set = function(N0,N1,func) {
	if (this._F.length <= N0) this._F[N0] = [];
	if (this._F[N0].length <= N1) this._F[N0][N1] = null;
	this._F[N0][N1] = func.clone();
};

Thread.prototype.get = function(N0,N1) {
	if (this._F.length <= N0) return false;
	if (this._F[N0].length <= N1) return false;
	return this._F[N0][N1];
};

Thread.prototype.reset = function() {
	this._F = [];
};
 // 12345678902 set multi prototype F bakılacak
Thread.prototype.setMulti = function(N0,N1,func) {
	for (N0--;N0>=0;N0--) for (var i=0;i<N1;i++) this.set(N0,i,func);
};

// Interrupt

function Interrupt() {
	this.Flag = false;
	this._enable = false;
	this.Time = 0;
	this.ID = "INTERRUPT_" + Interrupt._N++;
	this.F = function() {};
	this.Sense = function() {return false;};
	Interrupt.Interrupts[this.ID] = this;
}

Interrupt.prototype.clone = function() {
	var newobj = new Interrupt();
	newobj.F = this.F.clone();
	return newobj;
};

Interrupt.prototype.toString = function() {
	return "[Interrupt Object]";
};

Interrupt.prototype.valueOf = function() {
	return this.toString();
};

Interrupt._time = 200;
Interrupt._N = 0;
Interrupt.Interrupts = {};

Interrupt.prototype.Enable = function() {
	this._enable = true;
	this._F();
};

Interrupt.prototype.Disable = function() {
	this._enable = false;
};

Interrupt.prototype._F = function() {
	if (this.Sense()) {
		this.Flag = true;
		this.F();
	}
	if (this._enable) setTimeout("Interrupt.Interrupts[\"" + this.ID + "\"]._F();",Interrupt._time);
};

// PID

function PID(num,kp,kd,ki,f) {
	this.KP = kp?kp:(2/(Math.sqrt(5) + 1)); // Altın Oran^-1
	this.KI = ki?ki:0.75; // 10^-15
	this.KD = kd?kd:0.1; // 7x10^-6
	this.FB = function(x) {
		return x/2;
	};
	this.__i = 0;
	this.__in = [0];
	this.__xe = 0;
	this.__xt = 0;
	this.__y = num?num:0;
	this.F = f?f:1;
}

PID.prototype.clone = function() {
	var newobj = new PID(this.__y,this.KP,this.KD,this.KI,this.F);
	newobj.FB = this.FB.clone();
	newobj.__i = this.__i;
	newobj.__in = this.__in.clone();
	newobj.__xe = this.__xe;
	newobj.__xt = this.__xt;
	return newobj;
};

PID.prototype.toString = function() {
	return this.__y;
};

PID.prototype.valueOf = function() {
	return this.toString();
};

PID.prototype.H = function() {
	return this.FB(this.__y);
};

PID.prototype.turevAl = function(x) {
	return (x - this.__xe)*this.F;
};

PID.prototype.integralAl = function(x) {
	this.__xt += x/this.F;
	return this.__xt;
};

PID.prototype.I = function(x) {
	this.__xe = x;
	x -= this.H();
	
	this.__i++;
	if (this.__i == this.__in.length) this.__i = 0;
	this.__in[this.__i] = x;
	x = this.__in.applyProcess("ao");
	
	this.__y = this.KP*x + this.KD*this.turevAl(x) + this.KI*this.integralAl(x);
	if (isNaN(this.__xe) || isNaN(this.__xt) || isNaN(this.__y)) return this.reset();
	else return this.__y;
};

PID.prototype.reset = function() {
	this.__xe = 0;
	this.__xt = 0;
	this.__y = 0;
	return 0;
};

// fuzzy

function Fuzzy(deg) {
	if (!deg) this.deger = 0;
	else if (deg > 1) this.deger = 1;
	else if (deg < 0) this.deger = 0;
	else this.deger = deg;
}

Fuzzy.prototype.clone = function() {
	return new Fuzzy(this.deger);
}

Fuzzy.prototype.toString = function() {
	return this.deger;
};

Fuzzy.prototype.valueOf = function() {
	return this.toString();
};

Fuzzy.prototype.set = function(deg) {
	if (!deg) return;
	else if (deg < 0) this.deger = 0;
	else if (deg > 1) this.deger = 0;
	else this.deger = deg;
};

Fuzzy.prototype.get = function() {
	return this.deger;
};

Fuzzy.prototype.toScale = function(omet) {
	omet = omet.toLowerCase();
	if (omet == "01-0as" ||
		omet == "01-esas" ||
		omet == "01-esas2" )
		return this.deger.toScale(omet);
};

// Space

function Space(N,type_) {
	this.N = N?N:[0];
	this._arr = type_?type_:0; // []
	for (var i=this.N.length-1;i>=0;i--) {
		var temp2 = [];
		for (var j=0;j<this.N[i];j++) temp2.push(this._arr.clone());
		this._arr = temp2;
	}
}

Space.prototype.clone = function() {
	var newobj = new Space(this.N);
	newobj._arr = this._arr.clone();
	return newobj;
};

Space.prototype.toString = function() {
	return "[Space Object]";
};

Space.prototype.valueOf = function() {
	return this._arr;
};

Space.prototype.forEach = function(func) {
	this._arr._forEachSpace(func);
};

Space.prototype.getLength = function(i) {
	if (!i) return this._arr.length;
	else if (0 <= i && !isNaN(i)) {
		var tp = "this._arr";
		for (;i>0;i--) {
			tp += "[0]";
		}
		return eval(tp + ".length");
	}
	return 0;
};

Space.prototype.get = function(N) {
	if (!N) return this._arr;
	else if (Array.isArray(N)) {
		if (N.length == 0) return this._arr;
		else return eval("this._arr[" + N.join("][") + "]");
	} else return false;
};

Space.prototype.set = function(N,deg) {
	if (N.length  == 0) return;
	eval("this._arr[" + N.join("][") + "] = " + deg);
};

// MemoryGraph

function MGraph() {
	this._arr = [0];
}

MGraph.prototype.clone = function() {
	var newobj = new MGraph();
	newobj._arr = this._arr.clone();
	return newobj;
}

MGraph.prototype.toString = function() {
	return "[Memory Graph Object]";
};

MGraph.prototype.valueOf = function() {
	return this.toString();
};

MGraph.prototype.get = function(n) {
	n *= this._arr.length-0.5;
	var alt0 = Math.floor(n);
	var ust0 = Math.floor(n+1);
	//var alt1 = alt0>0?(alt0-1):this._arr.length-1;
	//var ust1 = ust0<(this._arr.length-1)?ust0+1:0;
	//var aci0 = Math.atan((this._arr[ust0]-this._arr[alt1]));
	//var aci1 = Math.atan((this._arr[ust1]-this._arr[alt0]));
	var oran = Math.sin((n - alt0 - 0.5)*Math.PI)/2+0.5;
	if (ust0 == this._arr.length) ust0 = 0;
	if (alt0 == -1) alt0 = this._arr.length-1;
	var KD = oran*this._arr[ust0] + (1-oran)*this._arr[alt0];
	return KD;
};

MGraph.prototype.setDimension = function(n) {
	var _arr = [];
	for (var i=0;i<n;i++) _arr.push(this.get(i/n));
	this._arr = _arr;
};

MGraph.prototype.set = function(n,deg) {
	if (n < 0) n = 0;
	else if (n > 0) n = 1;
	n *= this._arr.length-0.5;
	var alt0 = Math.floor(n);
	var ust0 = Math.floor(n+1);
	var oran = n - alt0;
	if (ust0 == this._arr.length) ust0 = 0;
	this._arr[alt0] = oran*this._arr[alt0] + (1 - oran)*deg;
	this._arr[ust0] = (1 - oran)*this._arr[ust0] + oran*deg;
};

// Genetic

function Gen(N) {
	this._Tr = [];
	this.NOTypes = 0;
	this.Numeric = true;
	this.Information = false;
	this._Gens = new Space(N);
	this._Gens_ = null;
}

Gen.prototype.clone = function() {
	var newobj = new Gen();
	newobj._Gens = this._Gens.clone();
	return newobj;
};

Gen.prototype.toString = function() {
	return "[Genetic Object]";
};

Gen.prototype.valueOf = function() {
	return this.toString();
};

Gen.prototype.set = function(N,deg) {
	this._Gens.set(N,deg);
};

Gen.prototype.get = function(N) {
	return this._Gens.get(N);
};

Gen.prototype.getLength = function(i) {
	return this._Gens.getLength(i);
};

Gen.prototype.CrossOver = function(N1,N2,odeg) {
	var size = N2 - N1;
	var temp = [];
	for (var i=0;i<size;i++) {
		temp.push(this._Gens.get(i+N1));
		this._Gens.set(i+N1,odeg[i]);
	}
	return temp;
};

Gen.prototype.Mutation = function(met,N,dic) {
	var temp;
	dic = dic?dic:0;
	switch(met.toLowerCase()) {
		case "int":
			var orantisal_deger = new Fuzzy(0.95);
			orantisal_deger = Nouron.Or([orantisal_deger,new Fuzzy(this._Gens.get(N).toScale("ESAS-01"))]).get();
			var bozutma = Math.asin((Math.random()-0.5)*2*orantisal_deger)*2/Math.PI;
			for (var i=0;i<0;i++) bozutma = Math.asin(bozutma)*2/Math.PI;
			var deger0 = this._Gens.get(N)*(orantisal_deger + (1-orantisal_deger)*bozutma)/orantisal_deger;
			var deger1 = this._Gens.get(N)*(1 + bozutma*(Math.random()-0.5));
			temp = this._Gens.get(N);
			this._Gens.set(N,Math.floor(0.5+(deger0 + deger1)/2 + dic*Math.random()));
			break;
		default:
		case "double":
			var orantisal_deger = new Fuzzy(0.95);
			orantisal_deger = Nouron.Or([orantisal_deger,new Fuzzy(this._Gens.get(N).toScale("ESAS-01"))]).get();
			var bozutma = Math.asin((Math.random()-0.5)*2*orantisal_deger)*2/Math.PI;
			for (var i=0;i<0;i++) bozutma = Math.asin(bozutma)*2/Math.PI;
			var deger0 = this._Gens.get(N)*(orantisal_deger + (1-orantisal_deger)*bozutma)/orantisal_deger;
			var deger1 = this._Gens.get(N)*(1 + bozutma*(Math.random()-0.5));
			temp = this._Gens.get(N);
			this._Gens.set(N,(deger0 + deger1)/2 + dic*Math.random());
			break;
	}
	return temp;
};

// nöron

function Nouron(sumtype,sactype) {
	this.IN = [];
	this.OUT = [];
	this.Directions = [];
	this.ID = "N_" + Nouron.N++;
	this.Errors = [];
	this.Successes = [];
	this.SummaryF = [];
	this.SactiveF = new SAcFunction(sactype);
	for (var i=0;i<Nouron.Methods[sactype.toUpperCase()].Params;i++) {
		this.Successes.push(0);
		this.Errors.push(0);
		this.Directions.push((Math.random()>0.5?1:-1)*(Math.random()/2+0.5));
	}
	for (var i=0;i<Nouron.Methods[sactype.toUpperCase()].Arguments;i++) {
		this.SummaryF.push(new SUMFunction(sumtype));
		for (var j=Nouron.Methods[sumtype.toUpperCase()].Params-1;j>=0;j--) {
			this.SummaryF[i].Params.set([j],1);
		}
	}
	this.Verify = new SAcFunction("VERIFY"); // hedefe yakınlık doğrulama
	this.FeedBack = new SAcFunction("PID"); // pid ile dolaşma
	//this.Weight = new Gen([Nouron.Methods[sactype.toUpperCase()].Params,Nouron.Methods[sumtype.toUpperCase()].Params]);
	this.__i = 0;
	this.__tp = {};
	// feed back parametreleri ayarlanıyor // cikti*2.668033988749895 ilk atma x1.6489356881873896
	this.FeedBack.Params.set([0],0.6180339887498948); // KP 1/goldenrate
	this.FeedBack.Params.set([1],0.43); // KI
	this.FeedBack.Params.set([2],0.07); // KD
	this.FeedBack.TF.X.__i = 5;
	// verify parametreleri ayarlanıyor
	this.Verify.Params.set([0],1);
	this.getTarget = function(y0) {
		return Math.sin(y0);
	};
	this._getSuccess = function(y0) { // extend arguments için deneme fonksiyon
		var exit = 1;
		if (this.DefaultTargets.length > 1) for (var i=0;i<this.DefaultTargets.length;i++) exit *= Nouron.ExOr([y0.toScale("ESAS-01"),this.DefaultTargets[i].toScale("ESAS-01")]).get();
		else exit = 0;
		return (1-exit)*(1-Math.abs(y0 - this.getTarget(y0)).toScale("0AS-01"));
	};
	this.DefaultTargets = [];
	this.getSuccess = function(y0) {
		var target = this.getTarget(y0);
		this.FeedBack.Arguments.set([0],y0);
		var feed = this.FeedBack._F()/2;
		this.Verify.Arguments.set([0],feed);
		this.Verify.Params.set([1],target);
		var exit = this.Verify._F();
		ATA.log("Y = " + y0 + " , T = " + target + " , FEED = " + feed + " , E = " + exit + " ;");
		//exit *= Math.abs(target-y0).toScale("0AS-01");
		return exit;
	};
	this.DefaultEscapes = [Infinity,-Infinity];
	this.getError = function(y0) {
		if (isNaN(y0)) return 1;
		var exit = 1;
		for (var i=0;i<this.DefaultEscapes.length;i++) {
			exit *= Nouron.ExOr([y0.toScale("ESAS-01"),this.DefaultEscapes[i].toScale("ESAS_01")]).get();
		}

		return 1-exit;
	};
}

Nouron.prototype.clone = function() {
	var newobj = new Nouron();
	//
};

Nouron.prototype.toString = function() {
	return "[Nouron Object]";
};

Nouron.prototype.valueOf = function() {
	return this.toString();
};

Nouron.prototype.F = function() {
	this.Fn(0); // x0, x1 parametreleri hazırlanıyor
	this.Fn(1); // nöron çalışıyor ve sonuc aktarılıyor
	this.Fn(2); // sonuc için başarı hesaplanıyor
};

Nouron.prototype.Fn = function(n,ins) {
	switch(n) {
		default:
		case 0:
			this.__ie = this.__i;
			this.__tp.extendsucc = [];
			if (Math.random()*3 < 1) this.__i = Math.floor(Math.random()*this.Successes.length);
			if (ins > Math.random()) this.__tp.ax0 = this.SactiveF.Params.Mutation("double",[this.__i],this.Directions[this.__i]);
			else this.__tp.ax0 = this.SactiveF.Params.get([this.__i]);
			this.__tp.ax1 = this.SactiveF.Params.get([this.__i]);
			return this.__tp.clone();
		break;
		case 1:
			this.__tp.y = 0;
			this.__tp.ins = ins.clone();
			for (var i=0;i<this.SummaryF.length;i++) { // arguments al
				for (var j=Nouron.Methods[this.SummaryF[i].Type].Arguments-1;j>=0;j--) this.SummaryF[i].Arguments.set([j],ins[i][j]);
				this.SactiveF.Arguments.set([i],this.SummaryF[i].F());
			}
			this.__tp.y = this.SactiveF.F();
			var extendedArg = Nouron.DefaultExtendArgumentsF(this.SactiveF.Arguments);
			if (this.SummaryF.length == 0) this.__tp.extendsucc = [1];
			else for (var i=0;i<extendedArg.length;i++) { // arguments genişlet
				for (var j=Nouron.Methods[this.SummaryF[0].Type].Arguments-1;j>=0;j--) {
					this.SactiveF.Arguments.set([j],extendedArg[i][j]);
				}
				this.__tp.extendsucc.push(this._getSuccess(this.SactiveF.F()));
			};
			return this.__tp.clone();
		break;
		case 2:
			var xi = [0.977, 0.75, 0.685, 0.57];
			this.__tp.succ = Nouron.And(this.__tp.extendsucc)*Math.asin((this.getSuccess(this.__tp.y,this.__tp.ins)*0.8 + 0.2*(1 - this.getError(this.__tp.y)))*2 - 1)/Math.PI+0.5;
			if (this.__tp.succ == 1 && this.Successes[this.__i] == 1) {
				this.Directions[this.__i] *= -1e-5;
				if (Math.random() < 0.02) this.Successes[this.__i] = 1 - 1e-5;
			} else if (this.__tp.succ > Nouron.And(this.Successes).get() && this.__tp.succ > this.Successes[this.__i] && this.__tp.succ > this.Successes[this.__ie]) {
				if (this.__tp.succ == 1) this.Directions[this.__i] *= -1e-5;
				else if (this.__tp.succ > xi[0]) this.Directions[this.__i] *= 1 - Math.random()*1e-3;
				else if (this.__tp.succ > xi[1]) this.Directions[this.__i] *= 1;
				else if (this.__tp.succ > xi[2]) this.Directions[this.__i] *= 1 - Math.random()*1e-7;
				else this.Directions[this.__i] *= 1 + 0.00002*Math.random();
				this.Successes[this.__i] = this.__tp.succ;
				//return 1;
			} else if (this.__tp.succ >= this.Successes[this.__i]) {
				if (this.__tp.succ > 0.975) this.Directions[this.__i] *= 0.99;
				else this.Directions[this.__i] *= 1 - 0.1*this.__tp.succ;
				this.__i = this.__ie;
				//return 1;
			} else if (this.__tp.succ == this.Successes[this.__i]) {
				this.Directions[this.__i] *= -1;
				this.__i = this.__ie;
				//return 0;
			} else if (this.__tp.succ >= this.Successes[this.__ie]) {
				this.SactiveF.Params.set([this.__i],this.__tp.ax0);
				this.__tp.y = this.SactiveF.F();
				this.Successes[this.__i] *= 1 - 1e-4; // unutma
				if (this.__tp.succ == 1) this.Directions[this.__i] *= -1e-5;
				else if (this.__tp.succ > xi[0]) this.Directions[this.__i] *= 1 - Math.random()*1e-3;
				else if (this.__tp.succ > xi[1]) this.Directions[this.__i] *= 1 - Math.random()*1e-2;
				else if (this.__tp.succ > xi[2]) this.Directions[this.__i] *= 1 - Math.random()*1e-1;
				else if (this.__tp.succ > xi[3]) this.Directions[this.__i] *= 1 + Math.random()*1e-14;
				else this.Directions[this.__i] *= 1 + Math.random()*1e-5;
				//return 0;
			} else {
				this.SactiveF.Params.set([this.__i],this.__tp.ax0);
				this.__tp.y = this.SactiveF.F();
				this.Successes[this.__i] *= 1 - 1e-3; // unutma
				if (this.__tp.succ == 1) this.Directions[this.__i] *= 0.75;
				else this.Directions[this.__i] *= -1;
				//return 0;
			}
			var neww = this.__tp.clone();
			this.__tp = {};
			return neww;//Nouron.And(this.Successes);
		break;
	}
};

Nouron.DefaultExtendArgumentsF = function(arg) {
	var arr_ = [];
	var j_ = arg.getLength([0]);
	for (var argE in Nouron.ExtendArguments) {
		if (argE == "clone") continue;
		arr_.push([]);
		for (var i=0;i<j_;i++) arr_[arr_.length-1].push(Nouron.ExtendArguments[argE](arg.get([i])));
	}
	return arr_;
};

Nouron.ExtendArguments = {};
Nouron.ExtendArguments["DA0"] = function() { return 0; };
Nouron.ExtendArguments["DA_+1"] = function() { return 1; };
Nouron.ExtendArguments["DA_-1"] = function() { return -1; };
Nouron.ExtendArguments["DAR"] = function() { return (Math.random()/Math.random())*(Math.random()-0.5); };
Nouron.ExtendArguments["DAN"] = function(x) { return -x; };
Nouron.ExtendArguments["DA+1"] = function(x) { return x+1; };
Nouron.ExtendArguments["DA-1"] = function(x) { return x-1; };
Nouron.ExtendArguments["DA+0.5"] = function(x) { return x+0.5; };
Nouron.ExtendArguments["DA-0.5"] = function(x) { return x-0.5; };
Nouron.ExtendArguments["DA*1.01"] = function(x) { return x*1.01; };
Nouron.ExtendArguments["DA/1.01"] = function(x) { return x/1.01; };
Nouron.ExtendArguments["DA*2"] = function(x) { return x*2; };
Nouron.ExtendArguments["DA/2"] = function(x) { return x/2; };
Nouron.ExtendArguments["DA*R"] = function(x) { return x*Math.random(); };
Nouron.ExtendArguments["DA/R"] = function(x) { return x/Math.random(); };

Nouron.ExOr = function(ora) { // mantıksal işlemler
	var deg = ora[0].get() - ora[1].get();
	return new Fuzzy((deg>0)?deg:-deg);
};

Nouron.Not = function(ora) {
	return new Fuzzy(1 - ora.get());
};

Nouron.And = function(ora) {
	var ora_ = 0;
	for (var i=0;i<ora.length;i++) ora_ += Math.pow(ora[i].get(),1/ora.length);//ora[i];
	ora_ /= ora.length;
	ora_ = Math.pow(ora_,ora.length);
	return new Fuzzy(ora_);
};

Nouron.Or = function(ora) {
	var ve_ = [];
	for (var i=0;i<ora.length;i++) ve_.push(Nouron.Not(ora[i]));
	return Nouron.Not(Nouron.And(ve_));
};

Nouron.N = 0;

Nouron.prototype.addInput = function(con) {
	this.IN.push(con.ID);
};

Nouron.prototype.addOutput = function(con) {
	this.OUT.push(con.ID);
};

Nouron.Methods = {};
Nouron.Methods["TIME"] = {
	F: function() { // zaman
		var A = this.Params.get([0])*this.Params.get([2]);
		var B = this.Params.get([1])*this.Params.get([2]);
		var C = this.Params.get([3])*this.Params.get([2]);
		return A*((new Date()).getTime()%B) + C;
	},
	Params: 4,
	Arguments: 0
};

Nouron.Methods["SUM"] = {
	F: function() { // Toplama
		var A = this.Params.get([0])*this.Params.get([2]);
		var B = this.Params.get([1])*this.Params.get([2]);
		var C = this.Params.get([3])*this.Params.get([2]);
		return A*this.Arguments.get([0]) + B*this.Arguments.get([1]) + C;
	},
	Params:4,
	Arguments:2
};

Nouron.Methods["MULTI"] = {
	F: function() { // Çarpma
		var A = this.Params.get([0])*this.Params.get([2]);
		var B = this.Params.get([1])*this.Params.get([2]);
		var C = this.Params.get([3])*this.Params.get([5]);
		var D = this.Params.get([4])*this.Params.get([5]);
		return D*(this.Arguments.get([0])**A)*(this.Arguments.get([1])**B) + C;
	},
	Params:6,
	Arguments:2
};

Nouron.Methods["SIN"] = {
	F: function () { // sinüzaidal
		var A = this.Params.get([0])*this.Params.get([4]);
		var B = this.Params.get([1])*this.Params.get([5]);
		var C = this.Params.get([2])*this.Params.get([5]);
		var D = this.Params.get([3])*this.Params.get([4]);
		return A*Math.sin(B*this.Arguments.get([0]) + C) + D;
	},
	Params:6,
	Arguments:1
};

Nouron.Methods["SQUARE"] = {
	F: function () { // kare
		var A = this.Params.get([0])*this.Params.get([4]);
		var B = this.Params.get([1])*this.Params.get([5]);
		var C = this.Params.get([2])*this.Params.get([5]);
		var D = this.Params.get([3])*this.Params.get([4]);
		var X = B*this.Arguments.get([0]) + C;
		return A*(((X<0)?(1+X%1):(X%1))<0.5?1:-1) + D;
	},
	Params:6,
	Arguments:1
};

Nouron.Methods["TRIANGEL"] = {
	F: function () { // üçgen
		var A = this.Params.get([0])*this.Params.get([4]);
		var B = this.Params.get([1])*this.Params.get([5]);
		var C = this.Params.get([2])*this.Params.get([5]);
		var D = this.Params.get([3])*this.Params.get([4]);
		var X = C + this.Arguments.get([0]);
		var t = X<0?Math.abs(X%B+B):Math.abs(X%B);
		return 2*(t<(B/2)?t:B-t)*A/B - A/2 + D;
	},
	Params:6,
	Arguments:1
};

Nouron.Methods["EXP"] = {
	F: function () { // üstel
		var A = this.Params.get([0]);
		var B = this.Params.get([1]);
		return A*(this.Arguments.get([0])**B);
	},
	Params:2,
	Arguments:1
};

Nouron.Methods["LOG"] = {
	F: function () { // logaritmik
		var A = this.Params.get([0]);
		var B = this.Params.get([1])*this.Params.get([3]);
		var C = this.Params.get([2])*this.Params.get([3]);
		return A*ATA["LOG"](B*this.Arguments.get([0]),C*this.Arguments.get([1]));
	},
	Params:4,
	Arguments:2
};

Nouron.Methods["NOISE"] = {
	F: function () { // gürültü
		var A = this.Params.get([0]);
		var B = this.Params.get([1]);
		var C = this.Params.get([2]);
		var D = this.Params.get([3]);
		if (this.TF.X >= D) this.TF.X -= Math.random()*C;
		else if (this.TF.X < (-D)) this.TF.X += Math.random()*C;
		else this.TF.X += (Math.random()-0.5)*C;
		return A*this.TF.X + B;
	},
	Params:4,
	Arguments:0,
	TF : {X:0}
};

Nouron.Methods["NOISE2"] = {
	F: function () { // gürültü 2
		var top = 0;
		if (this.TF._i >= this.TF.X.length - 1) this.TF._i = 0;
		else this.TF._i++;
		var A = this.Params.get([0]);
		var B = this.Params.get([1]);
		var C = this.Params.get([2]);
		var D = this.Params.get([3]);
		if (this.TF.X[this.TF._i] >= D) this.TF.X[this.TF._i] -= Math.random()*C;
		else if (this.TF.X[this.TF._i] < (-D)) this.TF.X[this.TF._i] += Math.random()*C;
		else this.TF.X[this.TF._i] += (Math.random()-0.5)*C;
		for (var i=0;i<this.TF.X.length;i++) top += this.TF.X[i];
		return A*top + B;
	},
	Params:4,
	Arguments:0,
	TF : {X:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],_i:0}
};

Nouron.Methods["DERIVATIVE"] = {
	F: function () { // türev
		var A = this.Params.get([0]);
		var t = this.Arguments.get([0])-this.TF.X;
		this.TF.X = this.Arguments.get([0]);
		return A*t;
	},
	Params:1,
	Arguments:1,
	TF : {X:0}
};

Nouron.Methods["INTEGRAL"] = {
	F: function () { // integral
		var A = this.Params.get([0]);
		this.TF.X += A*this.Arguments.get([0]);
		return this.TF.X;
	},
	Params:1,
	Arguments:1,
	TF : {X:0}
};

Nouron.Methods["PID"] = {
	F: function () { // pid
		this.TF.X.KP = this.Params.get([0]);
		this.TF.X.KI = this.Params.get([1]);
		this.TF.X.KD = this.Params.get([2]);
		var A = this.TF.X.I(this.Arguments.get([0]));
		return A;
	},
	Params:3,
	Arguments:1,
	TF : {X:(function(){var pid=new PID(0,0.61803398874989480,0.75,0.1,1);pid.__i = 10;return pid;})()}
};

Nouron.Methods["MSUM"] = {
	F: function() { // çoklu toplam
		var total = 0;
		for (var i=this.Arguments.getLength(0)-1;i>=0;i--) {
			total += this.Params.get([i])*this.Arguments.get([i]);
		}
		return total;
	},
	Params:4,
	Arguments:4
};

Nouron.Methods["MMULTI"] = {
	F: function() { // çoklu çarpım
		var mmulti = this.Params.get([0]);
		for (var i=this.Arguments.getLength(0)-1;i>=0;i--) {
			mmulti *= this.Arguments.get([i]);
		}
		return mmulti;
	},
	Params:1,
	Arguments:4
};

Nouron.Methods["STEP"] = {
	F: function () { // step
		var A = this.Params.get([0]);
		var B = this.Params.get([1]);
		var C = this.Params.get([2]);
		return this.Arguments.get([0])>A?B:C;
	},
	Params:3,
	Arguments:1
};

Nouron.Methods["SIGMOID"] = {
	F: function () { // sigmoid
		var A = this.Params.get([0]);
		return A/(1+Math.exp(this.Arguments.get([0])));
	},
	Params:1,
	Arguments:1
};

Nouron.Methods["TANH"] = {
	F: function () { // tanh
		var A = this.Params.get([0]);
		var X = this.Arguments.get([0]);
		return A*(Math.exp(X) - Math.exp(-X))/(Math.exp(X) + Math.exp(-X));
	},
	Params:1,
	Arguments:1
};

Nouron.Methods["GAUSS"] = {
	F: function () { // gaussian
		var A = this.Params.get([0]);
		var X = this.Arguments.get([0]);
		return A*Math.exp(-X*X);
	},
	Params:1,
	Arguments:1
};

Nouron.Methods["GAUSSDX"] = {
	F: function () { // gaussian türevi
		var A = this.Params.get([0]);
		var X = this.Arguments.get([0]);
		return A*Math.exp(-X*X/2)*X/**Math.sqrt(Math.E)*/;
	},
	Params:1,
	Arguments:1
};

Nouron.Methods["VERIFY"] = {
	F: function () { // hedef doğrulama
		var A = this.Params.get([0]);
		var B = this.Params.get([1]);
		return A*(Nouron.ExOr([this.Arguments.get([0]).toScale("ESAS-01"), B.toScale("ESAS-01")])).get(); //1234567890
		//return A*(1-Math.abs(this.Arguments.get([0]) - B).toScale("0AS-01"));
	},
	Params:2,
	Arguments:1
};

Nouron.Methods["MAX"] = {
	F: function() { // max
		var XA = this.Params.get([0]);
		var XB = this.Params.get([0]);
		var X0 = this.Arguments.get([0]);
		var X1 = this.Arguments.get([1]);
		var X2 = this.Arguments.get([2]);
		var X3 = this.Arguments.get([3]);
		if (XA%1 < 0.5) return XB*Math.max(X0,X1,X2,X3);
		else return XB*Math.min(X0,X1,X2,X3);
	},
	Params:4,
	Arguments:4
};

Nouron.Methods["RELU"] = {
	F: function () { // relu
		var A = this.Params.get([0])*this.Params.get([4]);
		var B = this.Params.get([1])*this.Params.get([5]);
		var C = this.Params.get([2])*this.Params.get([5]);
		var D = this.Params.get([3])*this.Params.get([4]);
		var E = this.Params.get([6]);
		var F = this.Params.get([7]);
		var X = this.Arguments.get([0])*B + C;
		return A*(X>E?X:F) + D;
	},
	Params:8,
	Arguments:1
};

Nouron.Methods["MODUL"] = {
	F: function () { // modulasyon
		var A = this.Params.get([0])*this.Params.get([4]);
		var A0 = this.Params.get([1]);
		var A1 = this.Params.get([2]);
		var D = this.Params.get([3])*this.Params.get([4]);
		var B0 = this.Params.get([5])*this.Params.get([9])*this.Params.get([12]);
		var B1 = this.Params.get([6])*this.Params.get([11])*this.Params.get([12]);
		var C0 = this.Params.get([7])*this.Params.get([9])*this.Params.get([10]);
		var C1 = this.Params.get([8])*this.Params.get([11])*this.Params.get([10]);
		var x = this.Arguments.get([0]);
		var cosa = Math.cos(B0*x + C0);
		var cosb = Math.cos(B1*x + C1);
		var sina = Math.sin(B0*x + C0);
		var sinb = Math.sin(B1*x + C1);
		return A*(A0*cosa*sinb + A1*sina*cosb) + D;
	},
	Params:13,
	Arguments:1
};

Nouron.Methods["RMSUM"] = {
	F: function() { // çoklu rastgele toplam
		var t = 0;
		this.TF.F();
		for (var i=0;i<4;i++) t += this.Params.get([i])*Information.Informations[this.TF.X[i]].get();
		return t;
	},
	Params:4,
	Arguments:0,
	TF : {
		X:(function(){var e=[],i=4;for(var k in Information.Informations){if((--i)<0)break;e.push(k);}return e;})(),
		Mutation: 0.05,
		F: function() {
			if (Math.random() < this.Mutation) {
				var rtep = Math.floor(Math.random()*4);
				var rwir = Math.floor(Math.random()*Information.N);
				for (var key in Information.Informations) {
					if(--rwir > 0) continue;
					rwir = key;
					break;
				}
				this.X[rtep] = Information.Informations[rwir].ID;
			}
		}
	}
};

Nouron.Methods["RMMULTI"] = {
	F: function() { // çoklu rastgele çarpım
		var t = this.Params.get([0]);
		this.TF.F();
		for (var i=0;i<this.TF.X.length;i++) t *= Information.Informations[this.TF.X[i]].get();
		return t;
	},
	Params:1,
	Arguments:0,
	TF : {
		X:(function(){var e=[],i=4;for(var k in Information.Informations){if((--i)<0)break;e.push(k);}return e;})(),
		Mutation: 0.05,
		F: function() {
			if (Math.random() < this.Mutation) {
				var rtep = Math.floor(Math.random()*this.X.length);
				var rwir = Math.floor(Math.random()*Information.N);
				for (var key in Information.Informations) {
					if(--rwir > 0) continue;
					rwir = key;
					break;
				}
				this.X[rtep] = Information.Informations[rwir].ID;
			}
		}
	}
};

Nouron.Methods["SINGLE"] = {
	F: function() { // tekli
		return this.Params.get([0])*this.Arguments.get([0]);
	},
	Params:1,
	Arguments:1
};

Nouron.GetMethods = function() {
	var arr_ = [];
	for (var key in Nouron.Methods) arr_.push(key);
	return key;
};

// nouron connection

function Information(sid) {
	this.deg = 0;
	this.Error = new Fuzzy(1);
	this.Successes = new Fuzzy(0);
	this.__Conn = [];
	this.ID = "C_" + Information.N++;
	this.SID = "" + sid;
	this.onChange = function() {
		
	};
	Information.Informations[this.ID] = this;
}

Information.prototype.toString = function() {
	return this.deg;
};

Information.prototype.valueOf = function() {
	return this.toString();
};

Information.prototype.set = function(deg,sid) {
	if (this.SID == sid) {
		this.deg = deg;
		this.onChange();
		for (var i=0;i<this.__Conn.length;i++) {
			this.__Conn[i]();
		}
	} else return false;
};

Information.prototype.get = function() {
	return this.deg;
};


Information.Informations = {};
Information.N = 0;

// special activation functions

function SAcFunction(type) {
	if (!Nouron.Methods[type.toUpperCase()]) type = "SIGMOID";
	this.Type = type.toUpperCase();
	this._F = Nouron.Methods[this.Type].F.clone();
	this.Params = new Gen([Nouron.Methods[this.Type].Params]); // 1234567890
	this.Arguments = new Gen([Nouron.Methods[this.Type].Arguments]);
	if (Nouron.Methods[this.Type].TF) this.TF = Nouron.Methods[this.Type].TF.clone();
}

SAcFunction.prototype.F = function() {
	return this._F.apply(this);
};

// Summary functions

function SUMFunction(type) {
	switch (type.toUpperCase()) {
		default:type = "MSUM";
		case "SINGLE":
		case "MSUM":
		case "MMULTI":
		case "RMSUM":
		case "RMMULTI":
		case "MAX":
			this.Type = type.toUpperCase();
			this._F = Nouron.Methods[this.Type].F;
			this.Params = new Gen([Nouron.Methods[this.Type].Params]);
			this.Arguments = new Gen([Nouron.Methods[this.Type].Arguments]);
			if (Nouron.Methods[this.Type].TF) this.TF = Nouron.Methods[this.Type].TF.clone();
		break;
	}
	switch (type.toUpperCase()) {
		case "MSUM":
		case "SINGLE":
		case "MSUM":
		case "MMULTI":
		case "RMSUM":
		case "RMMULTI":
		case "MAX":
	}
}

SUMFunction.prototype.F = function() {
	return this._F.apply(this);
};