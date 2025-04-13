function getInitialPlayerData() {
	let a = {
		saveCreateTime: Date.now(),
		lastTick: Date.now(),
		currentPage: 1,
		volumes: new PowiainaNum(10),
		
		volumegenerator_energies: 0,
		volumegenerator_cooldown: 0,
		offlinedTime: 0,
		offlinePower: 0,
		timeSpeed: 1,
		timeOverpower: 0,
		isOffline: false,
		upgrades: {},
		upgradeClicked: [null, 0],
	
		version: 4000002,
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
		if (temp1.version>=4000002) {
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
		let vg_getted = Math.min(player.volumegenerator_energies,diff1*VGenergyMax()/10);
		player.volumes = player.volumes.add(PowiainaNum.mul(vg_getted, VGpower()));
		player.volumegenerator_energies -= vg_getted;
	}	
	player.lastTick = Date.now();
}

function VGenergyMax(){
	return 10;
}
function chargeVG(){
	if (player.volumegenerator_cooldown<=0){
		player.volumegenerator_cooldown = 1;
		player.volumegenerator_energies += 3;
		player.volumegenerator_energies = Math.min(VGenergyMax(),player.volumegenerator_energies);
	}
}
function VGpower() {
	let a = new PowiainaNum(0)
	a = a.add(upgEffect('mm4',0));
	return a;
}
