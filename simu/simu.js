/*

Simu.js system core
Based on ATA.js
By Mustafa ÖZVER

*/

Array.prototype.pushshift = function(nkey) {
	this.push(nkey);
	return this.shift();
};

Array.prototype.total = function(nkey) {
	var i,total_=0;
	for (i=this.length-1;i>=0;i--) total_ += this[i];
	return total_;
};

var Simu = {};

Simu.Name = "Simulate Game System";
Simu.Version = "0.1";

Simu.Players = [];
Simu.Games = [];
Simu.Tables = [];

Simu.Params = {
	"NumofPlayers": 10, // Number of players
	"IMPlayer": false, // Number of players
};

var Player = function() {
	this.ID = "PLAYER_" + (Player._nunofPlayers++);
	this.Params = {};
	this.Arguments = {};
	this.Table = null;
	this.Points = 0;
	this.R = function(){}; // gözlemle
	this.F = function(){}; // hamle nedir, bot
	return this;
};
Player._nunofPlayers=0;

var Game = function() {
	this.H = function(){}; // kim kazandı, who won
	this.F = function(){}; // kim kazandı, who won
	this.W = function(){}; // kazanan mükafat
	this.L = function(){}; // kaybeden ceza
	this.D = function(){}; // berabere
	this.Params = [];
	this.Tables = [];
	return this;
};

var Table = function() {
	this.Players = [];
	return this;
};
Table.MaxPlayer = 0;
Table.Tables = [];

Simu.SetTables = function(nofp, nofr, ros) {
	var totalplayers = this.Players.length;
	var tables = [];
	var copytable = {};
	var forf = function (i_) {
		var j=0;
		var index = 0;
		var comp = Array(nofp).fill(0);
		while(i_ > 0) {
			index = i_ % totalplayers;
			i_ -= index;
			i_ /= totalplayers;
			comp[j] = index;//this.Players[index].ID;
			j++;
		}
		if (!ros) 
			for (var i=0;i<comp.length;i++) 
				for (j=0;j<comp.length;j++) 
					if (i != j && comp[i] == comp[j]) return false;
		comp.sort(function(a,b){return a>b?1:-1});
		if (copytable["_"+comp] == true) {
			return false;
		} copytable["_"+comp] = true;
		return comp.slice();
	};
	var iter=totalplayers**nofp;
	var i,j;
	while (iter-- > 0) {
		var table = forf(iter);
		if (!table) continue;
		var newtable = new Table();
		for (i=0;i<table.length;i++) {
			newtable.Players.push(this.Players[table[i]]);
			this.Players[table[i]].Table = newtable;
		}
		for (i=0;i<nofr;i++) tables.push(newtable);
	}
	return tables;
};

Simu.SetupPlayers = function() {
	while (this.Params["NumofPlayers"] > this.Players.length) this.Players.push(new Player());
	if (this.Params["IMPlayer"]) {
		Simu.Me = this.Players[0];
		this.Players[0].R = function(){};
	}
};

Simu.Loop = function() {
};

///////////////////////////////////////////////////////////////////////
// example


Simu.Params["NumofPlayers"] = 10;
Simu.Params["Els"] = ["T","K","M"];
var TKM = new Game(); // taş kağıt makas oyunu
TKM.F = function() {
	for (var i=0;i<this.Tables.length;i++) {
		this.Tables[i].Players[0].F(this.Tables[i].Players[1].ID);
		this.Tables[i].Players[1].F(this.Tables[i].Players[0].ID);
		this.H(this.Tables[i].Players[0],this.Tables[i].Players[1]);
	}
};

TKM.D = function(player) {
	player.Points -= 0;
};

TKM.W = function(player) {
	player.Points += 1;
};

TKM.L = function(player) {
	player.Points -= 1;
};

TKM.H = function(player1,player2) {
	if (player1.Arguments["E"] == "T") {
		if (player2.Arguments["E"] == "T") {
			this.D(player1);
			this.D(player2);
		} else if (player2.Arguments["E"] == "K") {
			this.L(player1);
			this.W(player2);
		} else if (player2.Arguments["E"] == "M") {
			this.W(player1);
			this.L(player2);
		}
	} else if (player1.Arguments["E"] == "K") {
		if (player2.Arguments["E"] == "T") {
			this.W(player1);
			this.L(player2);
		} else if (player2.Arguments["E"] == "K") {
			this.D(player1);
			this.D(player2);
		} else if (player2.Arguments["E"] == "M") {
			this.L(player1);
			this.W(player2);
		}
	} else if (player1.Arguments["E"] == "M") {
		if (player2.Arguments["E"] == "T") {
			this.L(player1);
			this.W(player2);
		} else if (player2.Arguments["E"] == "K") {
			this.W(player1);
			this.L(player2);
		} else if (player2.Arguments["E"] == "M") {
			this.D(player1);
			this.D(player2);
		}
	}
};

Simu.SetupPlayers();
TKM.Tables = Simu.SetTables(2,1,false);

for (var i=0;i<Simu.Players.length;i++) {
	Simu.Players[i].Arguments["E"] = "";
	Simu.Players[i].F = function () {
		var els = Math.floor(Math.random()*3);
		this.Arguments["E"] = Simu.Params["Els"][els];
		console.log(els);
	};
	Simu.Players[i].F();
}

TKM.F();
console.log(Simu.Players.slice().sort(function(a,b){return -(a.Points>b.Points?1:-1);}));



/*

Simu.Params["NumofPlayers"] = 10;
Simu.Params["Els"] = ["A","H"]; // oyun teorisi
var GameTheory = new Game(); // kumar oyunu
GameTheory.F = function() {
	for (var i=0;i<this.Tables.length;i++) {
		this.Tables[i].Players[0].F(this.Tables[i].Players[1].ID);
		this.Tables[i].Players[1].F(this.Tables[i].Players[0].ID);
		this.H(this.Tables[i].Players[0],this.Tables[i].Players[1]);
	}
};

GameTheory.D = function(player,oppID) {
	player.Points += 1;
	player.Params["P"].pushshift(0.7);
	player.Params["P" + oppID] = 0;
};

GameTheory.W = function(player,oppID) {
	player.Points += 3;
	player.Params["P"].pushshift(2);
	player.Params["P" + oppID] = 1;
};

GameTheory.L = function(player,oppID) {
	player.Points -= 2;
	player.Params["P"].pushshift(-1);
	player.Params["P" + oppID] = -1;
};

GameTheory.H = function(player1,player2) {
	if (player1.Arguments["E"] == "A") {
		if (player2.Arguments["E"] == "A") {
			this.D(player1,player2.ID);
			this.D(player2,player1.ID);
		} else if (player2.Arguments["E"] == "H") {
			this.L(player1,player2.ID);
			this.W(player2,player1.ID);
		}
	} else if (player1.Arguments["E"] == "H") {
		if (player2.Arguments["E"] == "A") {
			this.W(player1,player2.ID);
			this.L(player2,player1.ID);
		} else if (player2.Arguments["E"] == "H") {
			/*this.L(player1,player2.ID);
			this.L(player2,player1.ID);
			this.L(player1,player2.ID);
			this.L(player2,player1.ID);//
		}
	}
};

Simu.SetupPlayers();
GameTheory.Tables = Simu.SetTables(2,1,true);

for (var i=0;i<Simu.Players.length;i++) {
	Simu.Players[i].Params["P"] = [0,0,0,0,0,0,0];
	Simu.Players[i].Arguments["E"] = "";
	Simu.Players[i].F = function (oppID) {
		var els;
		var oP = this.Params["P" + oppID];
		var P = this.Params["P"].total()/this.Params["P"].length;
		if (P > 1) els = 0;
		else if (P > 0.5) els = Math.random()>0.3?0:1;
		else if (P > -0.2) els = Math.random()>0.6?0:1;
		else els = 1;
		if (oP > 0) els = 1 - els;
		this.Arguments["E"] = Simu.Params["Els"][els];
	};
}

GameTheory.F();
console.log(Simu.Players.slice().sort(function(a,b){return -(a.Points>b.Points?1:-1);}));*/



