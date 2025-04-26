function getInitialPlayerData() {
	let a = {
		saveCreateTime: Date.now(),
		lastTick: Date.now(),
		currentPage: 1,
		volumes: new PowiainaNum(10),
		
		volumegenerator_energies: new PowiainaNum(0),
		volumegenerator_cooldown: 0,
		offlinedTime: 0,
		offlinePower: 0,
		timeSpeed: 1,
		timeOverpower: 0,
		isOffline: false,
		upgrades: {},
		upgradeClicked: [null, 0],
		energypow2: new PowiainaNum(0),
		version: 4000004,
	}
	let upgradeGroupIds = Object.keys(upgrades);
	for (let i = 0; i<upgradeGroupIds.length; i++) {
		let upgradeGroupObject={}
		upgradeGroup = upgrades[upgradeGroupIds[i]]
		for (let j = 0; j<upgradeGroup.upgrades.length; j++) {
			Object.assign(upgradeGroupObject,{
				[j]: new PowiainaNum(0)
			})
		}
		a.upgrades[upgradeGroupIds[i]]=upgradeGroupObject;
	}

	return a;
}
var player = getInitialPlayerData();
var diff = 0;
var diff1 = 0;
var app = null;
function hardReset(){
	player = getInitialPlayerData();

}
document.addEventListener("DOMContentLoaded", function() {
	var loadplayer = localStorage.getItem("mdvi-v4");
	hardReset();
	var saveloadable = false;
	var temp1;
	if (loadplayer !== null) {
		temp1 = formatsave.deserialize(loadplayer);
		transformToP(temp1);
		if (temp1.version>=4000003) {
			saveloadable=true;
		}
	}
	if (saveloadable){
		deepCopyProps(temp1, player);
	}
	setInterval(gameLoop, 50);
	setInterval(save, 5000);
	loadVue();
});
function loadVue() {
	app = new Vue({
		el: "#app",
		data() {
			return {
				player: player
			}
		},
	});
}
function gameLoop(){
	diff = (Date.now() - player.lastTick) / 1000;
	diff1=diff;
	if (diff>1){
		player.offlinedTime += diff
		diff=0
	}

	updateOffline();
	player.volumegenerator_cooldown = Math.max(0, player.volumegenerator_cooldown - diff1);
	if (player.volumegenerator_energies>0){
		let vg_getted = PowiainaNum.min(player.volumegenerator_energies,PowiainaNum.mul(diff1,VGenergyMax()).div(10));
		player.volumes = player.volumes.add(PowiainaNum.mul(vg_getted, VGpower()));
		player.volumegenerator_energies  = player.volumegenerator_energies.sub(vg_getted);
	}
	if (player.upgrades.mm4[8].gte(1)){ chargeVG(); }

	energypow2("decay");
	player.lastTick = Date.now();
}

function VGenergyMax(){
	let a = new PowiainaNum(10);
	a = a.add(upgEffect('mm4', 1));
	a = a.mul(upgEffect('mm4', 6));
	return a;
}
function cooldownVG(){
	let a = 1;
	if (player.upgrades.mm4[3].gte(1)) a-=0.5
	return a;
}
function energypow2(type, val){
	switch(type){
		case "eff": 
			return player.energypow2.add(1).pow(1.1);
			break;
		case "add":
			let a = player.volumegenerator_energies;
			a = new PowiainaNum(a)
			a = a.mul(upgEffect('mm4', 7))
			return a;
			break;
		case "ope_add":
			player.energypow2 = player.energypow2.add(energypow2("add"));
			player.volumegenerator_energies = new PowiainaNum(0);
			break;
		case "decay":
			player.energypow2 = player.energypow2.mul(PowiainaNum.pow(0.99, diff1))
			break;
	}
}
function VGwillCharge(){
	let a = new PowiainaNum(3);
	a = a.mul(upgEffect('mm4', 5));
	return a;
}
function chargeVG(){
	if (player.volumegenerator_cooldown<=0){
		player.volumegenerator_cooldown = cooldownVG();
		player.volumegenerator_energies = player.volumegenerator_energies.add(VGwillCharge());
		player.volumegenerator_energies = PowiainaNum.min(VGenergyMax(),player.volumegenerator_energies);
	}
}
function VGpower() {
	let a = new PowiainaNum(0)
	a = a.add(upgEffect('mm4',0));
	a = a.mul(energypow2("eff"));
	return a;
}
