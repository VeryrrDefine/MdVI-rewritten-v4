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
					return PowiainaNum.pow(x,2).mul(upgEffect("mm4", 2)).mul(upgEffect("mm4", 9))
				},
				effectDesc(x) {
					/* x=效果*/
					return `+${format(x)} mm<sup>4</sup>`
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
			},
			{
				rebuyable: true,
				desc: "增加能量条上限",
				effect(x) {
					return PowiainaNum.mul(x,2)
				},
				effectDesc(x) {
					/* x=效果*/
					return `+${format(x)} mm<sup>4</sup>`
				},
				unlock() {
					return player.upgrades.mm4[0].gte(7);
				},
				cost(x){
					/**
					 *	x=current upgrade count
					 */
					return PowiainaNum.pow(1.5, x).mul(1000)
				},
				anticost(x) {
					return PowiainaNum.logBase(PowiainaNum.div(x,1000),1.5)
				}
			},
			{
				rebuyable: true,
				desc: "升级0的效果更好",
				effect(x) {
					
					return PowiainaNum.pow(x.add(1),0.5)
				},
				effectDesc(x) {
					
					return `*${format(x)}`
				},
				unlock() {
					return player.upgrades.mm4[0].gte(7);
				},
				cost(x){
					/**
					 *	x=current upgrade count
					 */
					return PowiainaNum.pow(2, x).mul(100)
				},
				anticost(x) {
					/**
					 * cost to upgrade count y=(2^x*10), x=log_2(y/10)
					 */
					return PowiainaNum.logBase(PowiainaNum.div(x,100),2)
				}
			},
			{
				rebuyable:false,
				desc: "充能冷却时间减少0.5",
				cost: new PowiainaNum(5000),
				unlock(){
					return player.upgrades.mm4[0].gte(10)
				}
			},
			{
				rebuyable: false,
				desc: "解锁 充能^2",
				cost: new PowiainaNum(40000),
				unlock() {
					return player.upgrades.mm4[0].gte(13)
				}
			},{
				rebuyable: true,
				desc: "充能的能量增加",
				effect(x) {
					
					return PowiainaNum.pow(x.add(1),1.05)
				},
				effectDesc(x) {
					
					return `*${format(x)}`
				},
				unlock() {
					return player.upgrades.mm4[0].gte(17);
				},
				cost(x){
					/**
					 *	x=current upgrade count
					 */
					return PowiainaNum.pow(2, x).mul(1000)
				},
				anticost(x) {
					/**
					 * cost to upgrade count y=(2^x*10), x=log_2(y/10)
					 */
					return PowiainaNum.logBase(PowiainaNum.div(x,1000),2)
				}
			},
			{
				rebuyable: false,
				desc: "能量^2增加能量上限",
				cost: new PowiainaNum(5000000001),
				effect(x) {
					
					if (x.lt(1)) return PowiainaNum.ONE.clone();
											return PowiainaNum.pow(player.energypow2.add(10).log10(),1.3)	
				},
				effectDesc(x) {
					return `*${format(x)}`
				},
				unlock(){
					return player.upgrades.mm4[5].gte(22)
				}
			},
			{
				rebuyable: false,
				desc: "能量^2获取基于4维体积增加",
				unlock() {
					return player.upgrades.mm4[0].gte(31);
				},
				effect(x) {
					if (x.lt(1)) return PowiainaNum.ONE.clone();
					return player.volumes.max(10).log10().pow(0.5)
				},
				effectDesc(x) {
					return `*${format(x)}`
				},
				cost: new PowiainaNum(100000000000)
			},
			{
				rebuyable: false,
				desc: "自动充能",
				cost: new PowiainaNum(3e11),
				unlock(){
					return player.upgrades.mm4[7].gte(1)
				}
			},
			{
				rebuyable: true,
				desc: "4维体积发生器效率增加",
				cost(x) {
					return PowiainaNum.pow(10,x).mul(1e6)
				},
				anticost(x){
				
					return PowiainaNum.logBase(PowiainaNum.div(x,1e6),10)
				},
				effect(x){
					return PowiainaNum.pow(x,4)
				},
				effectDesc(x){
					return `*${format(x)}`
				},
				unlock() {
					return player.upgrades.mm4[0].gte(37)
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
	let rowCounts = Math.min(Math.floor(document.body.clientWidth / 50 * 0.8), 12);
	let upgradesPlaced = 0;
	let currentrow_upg = [];
	let rows = 0;
	for (let i = 0; i < upgGroup.upgrades.length; i++) {
		let upg = upgGroup.upgrades[i]
		let upgDisplayObject = {
			canBuy: false,
			bought: false,
			id: i
		}
		if (!upg.unlock || upg.unlock()) {			upg.canBuy = upgCanbuy(upgGroup, i)
			upg.bought = !(upg.rebuyable) && player.upgrades[x][i].gte(1)
			currentrow_upg.push(upgDisplayObject);
			upgradesPlaced++
			

		}
		if (upgradesPlaced>=rowCounts || i== upgGroup.upgrades.length-1){
			result[rows] = [];
			deepCopyProps(currentrow_upg, result[rows]);
			currentrow_upg = [];
			upgradesPlaced=0;
			rows++
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
		} else if (player.upgrades[groupId][upgId].lt(1)){
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
	let b = `<br>${upg.desc}<br>价格: ${format(upgCost(groupId,upgId))}`
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
