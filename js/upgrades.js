var upgrades = {
	"mm4": {
		getCurr() {return player.volumes},
		setCurr(x) {player.volumes = new PowiainaNum(x);},
		upgrades: [
			{
				rebuyable: true,
				desc: "4维体积发生器每1能量产出增加",
				effect(x) {
					/* x=购买数 */
					return PowiainaNum.pow(x,2)
				},
				effectDesc(x) {
					/* x=效果*/
					return `+${format(x)} mm<sup>4</sup>`
				},
				unlock() {
					return true;
				},
				cost(x){
					/**
					 *	x=current upgrade count
					 */
					return PowiainaNum.pow(2, x).mul(10)
				},
				anticost(x) {
					/**
					 * cost to upgrade count y=(2^x*10), x=log_2(y/10)
					 */
					return PowiainaNum.logBase(PowiainaNum.div(x,10),2)
				}
			}
		]
	}
}


function upgradesList(x){
	/**
	 * @param x upgrades group ID
	 * @return a list for vue using
	 * */
	
	let upgGroup = upgrades[x]
	let result = []
	if (!upgGroup) return [];
	
	for (let i = 0; i < upgGroup.upgrades.length; i++) {
		let upg = upgGroup.upgrades[i]
		let upgDisplayObject = {
			canBuy: false,
			bought: false,
			id: i
		}
		if (!upg.unlock || upg.unlock()) {			upg.canBuy = upgCanbuy(upgGroup, i)
			upg.bought = !(upg.rebuyable) && player.upgrades[groupId][upgId].gte(1)
			result.push(upgDisplayObject)
		}
	}

	return result;
}

function upgCost(groupId, upgId){
	let upgGroup=upgrades[groupId]
	if (!upgGroup) return false;
	let upg = upgGroup.upgrades[upgId]
	if (!upg) return false;
	if (upg.rebuyable) return upg.cost(player.upgrades[groupId][upgId]);
	else return upg.cost;

}
function upgCanAfford(groupId, upgId) {
	let upgGroup=upgrades[groupId]
	if (!upgGroup) return false;
	let upg = upgGroup.upgrades[upgId]
	if (!upg) return false;
	return true;	
}
function upgCanbuy(groupId, upgId){
	let upgGroup=upgrades[groupId]
	if (!upgGroup) return false;
	let upg = upgGroup.upgrades[upgId]
	if (!upg) return false;
	
	return (((!(upg.unlock))||upg.unlock()) && upgCanAfford(groupId, upgId) && upgGroup.getCurr().gte(upgCost(groupId, upgId))); 
}
function upgBought(groupId, upgId) {
	let upgGroup=upgrades[groupId]
	if (!upgGroup) return new PowiainaNum(0);
	let upg = upgGroup.upgrades[upgId]
	if (!upg) return new PowiainaNum(0);
	return player.upgrades[groupId][upgId];
}
function upgClick(groupId, upgId) {
	let upgGroup=upgrades[groupId]
	if (!upgGroup) return false;
	let upg = upgGroup.upgrades[upgId]
	if (!upg) return false;
	if ((player.upgradeClicked[0]==groupId)&&(player.upgradeClicked[1]==upgId) && upgCanbuy(groupId,upgId)){
		if (upg.rebuyable){
			let bought=upg.anticost(upgGroup.getCurr()).ceil().max(1);

			upgGroup.setCurr(upgGroup.getCurr().sub(upg.cost(bought.sub(1))));
			player.upgrades[groupId][upgId] = bought;
		} else {
			upgGroup.setCurr(upgGroup.getCurr().sub(upg.cost));
			player.upgrades[groupId][upgId] = new PowiainaNum(1);
		}
	}
	player.upgradeClicked = [groupId,upgId];
	return true;
}

function displayUpgDesc(){
	let groupId = player.upgradeClicked[0]
	let upgId = player.upgradeClicked[1]
	let upgGroup=upgrades[groupId]
	if (!upgGroup) return "";
	let upg = upgGroup.upgrades[upgId]
	if (!upg) return "";
	
	let a = `升级[${upgId}]`
	let b = `<br>${upg.desc}><br>价格: ${format(upgCost(groupId,upgId))}`
	let c = "";
	let d = "";
	if (upg.rebuyable){
		d = `(${format(upgBought(groupId,upgId))})`
	}
	if (upg.effectDesc){
		c = `<br>效果: ${upg.effectDesc(upg.effect(upgBought(groupId,upgId)))}`
	}
	return a+d+b+c

}
function upgEffect(groupId,upgId){
	let upgGroup=upgrades[groupId]
	if (!upgGroup) return "";
	let upg = upgGroup.upgrades[upgId]
	if (!upg) return "";
	

	return upg.effect(upgBought(groupId,upgId))	
}
