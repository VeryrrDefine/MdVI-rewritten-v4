// format-powiainanum.js by VeryrrDefine
// Code snippets from [format-expantanum.js by cloudytheconqueror]

if (!(this.PowiainaNum)) PowiainaNum = require('../PowiainaNum.js/PowiainaNum.js');
; (function (globalThis) {
	/// FUNCTIONSTART  DONT REMOVE THIS LINE
    "use strict"
    let MAX_LOGP1_REPEATS = 48
    let LOG5E = 0.6213349345596119

	function arraySort(array){
		array.sort(function (a, b) {
                return (function (a, b) {
                    if (typeof a == 'number') {
                        return 
                    } else if (a[3] > b[3]) {
                        return -1
                    } else if (a[3] < b[3]) {
                        return 1
                    }
                    else if (a[2] == "x" && b[2] != "x") {
                        return -1
                    } else if (a[2] != "x" && b[2] == "x") {
                        return 1
                    } else if (a[2] == "x" && b[2] == "x") {
                        return -1
                    } else if (a[2] > b[2]) {
                        return -1
                    } else if (a[2] < b[2]) {
                        return 1
                    } else if (a[0] == "x" && b[0] != "x") {
                        return -1
                    } else if (a[0] != "x" && b[0] == "x") {
                        return 1
                    } else if (a[0] == "x" && b[0] == "x") {
                        return -1
                    }
                    else if (a[0] > b[0]) {
                        return -1
                    }
                    else if (a[0] < b[0]) {
                        return 1
                    } else if (a[1] > b[1]) {
                        return -1
                    } else if (a[1] < b[1]) {
                        return 1
                    }


                    return -1
                })(a, b)
            })

	}
	function arrayMerge(array){
		var elemOffset = 0// a unnegative number
		for (let i = 0; i < array.length - 2; ++i) {
                if (array[i][0] == array[i + 1][0] && array[i][2] == array[i + 1][2] && array[i][3] == array[i + 1][3]) {
                    // same array's merge
                    array[i][1] += array[i + 1][1];
                    array.splice(i + 1, 1);
                    --i;
			elemOffset++
                }

            }
		return elemOffset
	}
	var debug = false;
	function stopFormating(){
		format = function (){return "NaN"}
	}
	function toggle(){
		debug = !debug;
	}
	function myPolarize(array, hasOperationRepeat=true, toArrowVared=false){
		!debug || console.log("input", array);
		let originum = new PowiainaNum(array);
		var arrows = 0;
		var repeation = 1;
		var bottom = 0;
	 	if (array.length==1){
			if (array[0]>=1e10){
				return {arrows: 1,
				repeation: 2, bottom: Math.log10(Math.log10(array[0]))}
			}

			else if (array[0]>=10){
				return {arrows:1, repeation: 1, bottom: Math.log10(array[0])}
			} else return {arrows: 1, repeation: 0, bottom: array[0]}
		}
		hasOperationRepeat = toArrowVared ? 0 : hasOperationRepeat
		arraySort(array)
		arrayMerge(array);
		var ptr = array.length-2;
		var b= ()=>array[array.length-1]
		var c= (x)=>{array[array.length-1]=x}
		var repeatResult = 1000001;
		while (--repeatResult>=0) {
			if (b()>=10){
				let a = Math.log10(b());
				array.push([1,1,1,1]);
				ptr++
				arraySort(array);
				
				let offset = arrayMerge(array);
				ptr-=offset;
				c(a);
				!debug || console.log(">=10 -> <10" ,ptr, array)

			}else {
				if (!toArrowVared && ptr==0 && typeof array[ptr+1] == 'number' && ((hasOperationRepeat)||(!hasOperationRepeat && array[ptr][1]==1))) break;
				if (toArrowVared && ptr==0 && typeof array[ptr+1]=='number' && array[ptr][0]=="x") break;
				if ((toArrowVared&&ptr==0&&array[ptr][1]==1)||(ptr!=0 && typeof array[ptr+1] == 'number' && typeof array[ptr][0]=="number"&&(array[ptr][1]==1)&&(
	array[ptr-1][0]=="x" || array[ptr-1][2]>array[ptr][2] || array[ptr-1][3]>array[ptr][3]
				) && array[ptr][0]>2) && (ptr!=0||array[ptr-1][0] == "x")) /*convert [x,1,1,1] sth to ["x", 1, 1, 1] x+f(base)*/ {
					let arrow_count = array[ptr][0];
					let base= b();
					//x|10 = arrow-1+(log_5 base)/2
					let Jx;
					if (arrow_count==3)
						Jx = base
					else{
						!debug||console.log(arrow_count, base)
					 	   Jx = arrow_count-1+(Math.log(base/2)/Math.log(5))
					}array[ptr][0]="x"
				
					c(Jx);
					arraySort(array);
					let offset=arrayMerge(array);
					ptr-=offset;
					!debug||console.log("arrow x to Jx conv", ptr, array);
			}
				if ((typeof array[ptr+1] == 'number') && (array[ptr][0]=="x") && b()<10 && ptr!=0){ // conver ["x", sth, j, k] sth2 to [1, 1, j+1, k]
					let base = b();
					let JRepeation = array[ptr][1]
					let Kx = JRepeation+Math.log10(base);
					array[ptr][1]=1;
					array[ptr][0]=1;
					array[ptr][2]++;
					c(Kx);

					arraySort(array);
					let offset=arrayMerge(array);
					ptr-=offset;
					!debug||console.log("J...Jx to Kx", ptr, array);
			
				}
				if (((ptr==0 && !hasOperationRepeat && array[ptr][1]!=1)||(ptr!=0))&&array[ptr][0]!="x" && b()<10) {
					
					let goal = ptr==0?array[ptr][0]+1 : array[ptr-1][1]
					// AAAA..{x}..AAA b
					// can be x+log10 b to
					// B(x+log10 b)
					if (b()==1 && ptr > 0 && array[ptr-1][0] > array[ptr][0] && array[ptr][1] == 1){
						!debug || console.log("operator_setgoal",goal)
						array[ptr][0]=array[ptr-1][0]
					} else {
						let right = array[ptr][1]+Math.log10(b());
						array[ptr][0]++
						array[ptr][1] = 1;
						c(right);
					}
					
					arraySort(array);
					let offset=arrayMerge(array);
					ptr-=offset;
					!debug||console.log("operator", ptr, array);
				}
			}
		}
		!debug||console.log("finalresult",array)
	 if (repeatResult<=0) { console.warn("warning: "+JSON.stringify(originum.array)+ "seems took long time to parsing.")}	
		return {bottom: b(), repeation: array[ptr][1], arrows: array[ptr][0], layer1: array[ptr][2], layer2: array[ptr][3] , array: array}

	}
    function getTopJandlayer(num){
        let pol = polarize(num.array, true)
            let layerLess = new PowiainaNum(num)
            let layer = num.getOperator("x", 1, 1)
            layerLess.operator("x", 1, 1, 0)
            let topJ
            if (layerLess.lt("10^^10")) { // Below J2: use Jx = Gx
                // layerLess is equal to (10^)^top bottom here, so calculate x in Gx directly.
                topJ = 1 + Math.log10(Math.log10(pol.bottom) + pol.top)
                layer += 1
            }
            else if (layerLess.lt("10{10}10")) { // J2 ~ J10
                topJ = pol.height + Math.log((Math.log10(pol.bottom) + pol.top) / 2) * LOG5E
                layer += 1
            }
            else { // J10 and above: an extra layer is added, thus becoming JJ1 and above, where Jx = Gx also holds
                let nextToTopJ = pol.height + Math.log((Math.log10(pol.bottom) + pol.top) / 2) * LOG5E
                let bottom = nextToTopJ >= 1e10 ? Math.log10(Math.log10(nextToTopJ)) : Math.log10(nextToTopJ)
                let top = nextToTopJ >= 1e10 ? 2 : 1
                topJ = 1 + Math.log10(Math.log10(bottom) + top)
                layer += 2
            }
            return {topJ, layer}
    }
    function commaFormat(num, precision) {
        if (num === null || num === undefined) return "NaN"
        let zeroCheck = num.array ? num.array[0][1] : num
        if (zeroCheck < 0.001) return (0).toFixed(precision)
        let init = num.toString()
        let portions = init.split(".")
        portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + ",")
        return portions[0]
    }

    function regularFormat(num, precision) {
        if (isNaN(num)) return "NaN"
        let zeroCheck = num.array ? num.array[0][1] : num
        if (zeroCheck < 0.001) return (0).toFixed(precision)
        let fmt = num.toString()
        let f = fmt.split(".")
        if (precision == 0) return commaFormat(num.floor ? num.floor() : Math.floor(num))
        else if (f.length == 1) return fmt + "." + "0".repeat(precision)
        else if (f[1].length < precision) return fmt + "0".repeat(precision - f[1].length)
        else return f[0] + "." + f[1].substring(0, precision)
    }
    function arraySearch(array, height) {
        let i=1;
        for (i = 1; i < array.length; i++) {
            if (array[i][0] == height) return array[i][1]
            else if (array[i][0] > height) break
        }
        return height > 0 ? 0 : 10
    }

    // Search for the value at the requested height of an ExpantaNum array,
    // and set it to zero if it exists.
    // like PowiainaNum method operator(...sth, 0)
    function setToZero(array, height) {
        let i=1;
        for (i = 1; i < array.length; i++) {
            if (array[i][0] == height) break
        }
        if (i < array.length) array[i][1] = 0
    }

    function format(num, precision = 4) {
        if (PowiainaNum.isNaN(num)) return "NaN"
        let precision2 = Math.max(3, precision) // for e
        let precision3 = Math.max(4, precision) // for F, G, H
        let precision4 = Math.max(6, precision) // for J, K
        num = new PowiainaNum(num).normalize()
        let array = num.array
        if (num.abs().lt(1e-308)) return (0).toFixed(precision)
        if (num.sign < 0) return "-" + format(num.neg(), precision)
        if (num.isInfinite()) return "Infinity"
        if (num.lt("0.001")) {
            return "(" + format(num.rec()) + ")e-1"
        }
        else if (num.lt(1)) {
            if (precision == 0) return '0'
            return regularFormat(num, precision + 2)
        }
        else if (num.lt(1000)) return regularFormat(num, precision)
        else if (num.lt(1000000000)) return commaFormat(num)
        else if (num.lt("10^^5")) { // 1e9 ~ 1F5
            let bottom = num.operator(0)
            let rep = num.operator(1) - 1
            if (bottom >= 1e9) {
                bottom = Math.log10(bottom)
                rep += 1
            }
            let m = 10 ** (bottom - Math.floor(bottom))
            let e = Math.floor(bottom)
            let p
            if (bottom < 1000) {
                p = precision2
            } else {
                p = precision2 - Math.log10(bottom) + 3
            }
            p = Math.max(Math.floor(p), 0)
            return "e".repeat(rep) + regularFormat(m, p) + "e" + commaFormat(e)
        }
        else if (num.lt("10^^1000000")) { // 1F5 ~ F1,000,000
            let pol = myPolarize(array,1)
		//return JSON.stringify(pol);
            return regularFormat(pol.bottom, precision3) + "F" + commaFormat(pol.repeation)
        }
        else if (num.lt("10^^^5")) { // F1,000,000 ~ 1G5
            let rep = num.operator(2)
            if (rep >= 1) {
                setToZero(array, 2)
                return "F".repeat(rep) + format(array, precision)
            }
            let n = num.operator(1) + 1
            if (num.gte("10^^" + (n + 1))) n += 1
            return "F" + format(n, precision)
        }
        else if (num.lt("10^^^1000000")) { // 1G5 ~ G1,000,000
            let pol = myPolarize(array,1)
            return regularFormat(pol.bottom, precision3) + "G" + commaFormat(pol.repeation)
        }
        else if (num.lt("10^^^^5")) { // G1,000,000 ~ 1H5
            let rep = num.operator(3)
            if (rep >= 1) {
                setToZero(array, 3)
                return "G".repeat(rep) + format(array, precision)
            }
            let n = num.operator(2) + 1
            if (num.gte("10^^^" + (n + 1))) n += 1
            return "G" + format(n, precision)
        }
        else if (num.lt("10^^^^1000000")) { // 1H5 ~ H1,000,000
            let pol = myPolarize(array,1)
            return regularFormat(pol.bottom, precision3) + "H" + commaFormat(pol.repeation)
        }
        else if (num.lt("10^^^^^5")) { // H1,000,000 ~ 5J4
            let rep = num.operator(4)
            if (rep >= 1) {
                setToZero(array, 4)
                return "H".repeat(rep) + format(array, precision)
            }
            let n = num.operator(3) + 1
            if (num.gte("10^^^^" + (n + 1))) n += 1
            return "H" + format(n, precision)
        }
        else if (num.lt("J1000000")) { // 5J4 ~ J1,000,000
		let t = num.clone()
            let pol = myPolarize(array)
		// arrows|bottom
		// Jx define:
		// For x<2, Jx = Gx
		// Jx = x|10
		// x|10 = (int(x)+1)|2*5^frac(x)
		// a|b
		// int(x) = a-1
		// frac(x) = log_5(b/2)
		//let x = pol.arrows-1 + Math.log(pol.bottom)/Math.log(5)
		return `${regularFormat(Math.log10(pol.bottom)+pol.repeation,precision4)}J${commaFormat(pol.arrows)}`
		
            //return regularFormat(Math.log10(pol.bottom) + pol.top, precision4) + "J" + commaFormat(pol.height)
        }
        else if (num.lt("J^4 10")) { // J1,000,000 ~ 1K5
            let rep = num.getOperator("x", 1, 1)
            if (rep >= 1) {
                num.operator("x", 1, 1, 0)
                return "J".repeat(rep) + format(num, precision)
            }
            let n = array[num.getMaxFirstOperatorIndex(1, 1)][0]
            if (num.gte("J" + (n + 1))) n += 1
            return "J" + format(n, precision)
        }
        else if (num.lt("J^999999 10")) { // 1K5 ~ K1,000,000
            // https://googology.wikia.org/wiki/User_blog:PsiCubed2/Letter_Notation_Part_II
            // PsiCubed2 defined Jx as Gx for x < 2, resulting in J1 = 10 rather than 10^10, to
            // prevent issues when defining K and beyond. Therefore, there should be separate
            // cases for when the "top value" is below 2, and above 2.
            // ExpantaNum.js considers J1 to be equal to 1e10 rather than 10,
            // hence num.lt("J^999999 10") rather than num.lt("J^1000000 1").

            let pol = myPolarize(array)
            /*let layerLess = new PowiainaNum(num)
            let layer = num.getOperator("x", 1, 1)
            layerLess.operator("x", 1, 1, 0)
            let topJ
            if (layerLess.lt("10^^10")) { // Below J2: use Jx = Gx
                // layerLess is equal to (10^)^top bottom here, so calculate x in Gx directly.
                topJ = 1 + Math.log10(Math.log10(pol.bottom) + pol.top)
                layer += 1
            }
            else if (layerLess.lt("10{10}10")) { // J2 ~ J10
                topJ = pol.height + Math.log((Math.log10(pol.bottom) + pol.top) / 2) * LOG5E
                layer += 1
            }
            else { // J10 and above: an extra layer is added, thus becoming JJ1 and above, where Jx = Gx also holds
                let nextToTopJ = pol.height + Math.log((Math.log10(pol.bottom) + pol.top) / 2) * LOG5E
                let bottom = nextToTopJ >= 1e10 ? Math.log10(Math.log10(nextToTopJ)) : Math.log10(nextToTopJ)
                let top = nextToTopJ >= 1e10 ? 2 : 1
                topJ = 1 + Math.log10(Math.log10(bottom) + top)
                layer += 2
            }
            return regularFormat(topJ, precision4) + "K" + commaFormat(layer)
	    */
		
		return `${regularFormat(pol.bottom, precision4)}K${commaFormat(pol.repeation)}`
        } else if (num.lt("l0 s1 a[10,[1,4,2,1]]")) { // K1000000 ~ 1L5

            if (num.lt(`l0 s1 a[10,["x",${Number.MAX_SAFE_INTEGER},1,1]]`)) {
                return "K" + format(num.operator("x") + 1)
            }

            let rep = num.operator(1, 2);
            num.operator(1, 2, 1, 0);
            return "K".repeat(rep) + format(num);
        } else if (num.lt(`l0 s1 a[10000000000,[1,8,1,1],[2,8,1,1],[3,8,1,1],[4,8,1,1],[5,8,1,1],[6,8,1,1],[7,8,1,1],[8,8,1,1],[9,8,1,1],["x",8,1,1],[1,999998,2,1]]`)) { // 1L5 ~ L1,000,000
            // L的UCF形式主要取决于K于J重叠的数量
            let pol = myPolarize(array)
            
		/*
            // 先看一下K重叠了多少
            let K = num.operator(1, 2);

            // 再看一下J重叠了多少
            let J = num.array.findIndex((a)=>{return a[0]=="x"});
            if (J==-1) J =0
            else J=num.array[J][1]
            // OmegaNum数组部分可能还有剩下的,需要把这些剩下的部分处理成Jx形式
            let pol = polarize(num.array, true);
            Jx = pol.height+Math.log10((Math.log10(pol.bottom) + pol.top)/2)
            J = J+1+Math.log10(Jx);
            // 基本上可以组成 K(重复变量K次) K(变量J)
            // 把变量J转换为Kx形式
            if (J > 10){
                

                    // 先转换成Ex形式
                let temp1 = Math.log10(J); // <10
                // 转换成Fx形式
                temp1 = 1+Math.log10(temp1); // < 2
                // 转换成Gx形式， 因为结果一定小于1.30102，又因为x<2时Jx=Gx
                // 转换成Jx形式
                temp1 = 1+Math.log10(temp1); // < 1.30102
                // 转换成Kx形式
                temp1 = 1+Math.log10(temp1);
                L = K+2+temp1
                
            } else{
                L=K+1+Math.log10(Math.max(J,1))
            } */
            let y = pol.repeation
            let x = pol.bottom
            return `${format(x,precision4)}L${commaFormat(y)}`;
            /*
 SSSSSSSS   BBBBBBBBB
S           B        B
 SSSSSSSS   BBBBBBBBB
         S  B        B
 SSSSSSSS   BBBBBBBBB

            */
        }else if (num.lt("l0 s1 a[10,[2,5,2,1]]")){ // 1L5 ~ L^5 10
            if (num.lt(`l0 s1 a[10,[1,${Number.MAX_SAFE_INTEGER},2,1]]`)){
                return "L" + format(num.operator(1,2)+2)
            }
            let rep = num.operator(2,2);
            num.operator(2,2,1,0);
            return "L".repeat(rep) + format(num);
        } else if (num.lt("l0 s1 a[10, [999999, 1, 2, 1]]")){
		let num2 = num.clone();
		let pol = myPolarize(array, 0)
		return `${regularFormat(pol.bottom,precision4)}M${commaFormat(pol.arrows)}`
	}
    }

	format.myPolarize = myPolarize
	format.arraySort = arraySort;
	format.arrayMerge = arrayMerge;
	format.stopFormating = stopFormating;
	format.toggle = toggle;
	/// FUNCTIONEND DONT REMOVE THIS LINE
    
    if (typeof define == 'function' && define.amd) {
        define(function () {
            return format
        })


        // Node and other environments that support module.exports.
    } else if (typeof module != 'undefined' && module.exports) {
        module.exports = format
	
        // Browser
    } else {
        if (!globalThis) {
            globalThis = typeof self != 'undefined' && self && self.self == self
                ? self : Function('return this')();
        }
        globalThis.format = format;
    }
})(this);
