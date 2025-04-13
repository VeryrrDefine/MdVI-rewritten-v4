// format-powiainanum.js by VeryrrDefine
// Code snippets from [format-expantanum.js by cloudytheconqueror]


; (function (globalThis) {
    "use strict"
    let MAX_LOGP1_REPEATS = 48
    let LOG5E = 0.6213349345596119
    // Set smallTop to true to force the top value in the result below 10
    function polarize(array, smallTop = false, nosearchmax = false, searchStart=1) {
        /*
        polarize
    
        */

        if (array.length == 0) array = [0]

        let bottom = array[0], top = 0, height = 0
        // ExpantaNum: array[0] = [0, y]
        // PowiainaNum: array[0] == y
        let temp = array.findIndex(function (x, index) { return x[0] == "x"&&index>searchStart })
        let searchMax = (temp == -1)||nosearchmax ? array.length-1 : temp - 1

        if (!Number.isFinite(bottom)) { }
        else if (array.length <= 1) {
            var repeatCountLess = 500
            while (repeatCountLess > 0 && (smallTop && bottom >= 10)) {
                bottom = Math.log10(bottom)
                top += 1
                height = 1
                repeatCountLess--
            }
        }
        else {
            let elem = searchStart
            top = array[elem][1]
            height = array[elem][0]
            var repeatCountLess = 500
            while (repeatCountLess > 0 && (bottom >= 10 || elem < searchMax+1 || (smallTop && top >= 10))) {
                if (bottom >= 10) { // Bottom mode: the bottom number "climbs" to the top
                    if (height == 1) {
                        // Apply one increment
                        bottom = Math.log10(bottom)
                        if (bottom >= 10) { // Apply increment again if necessary
                            bottom = Math.log10(bottom)
                            top += 1
                        }
                    }
                    else if (height < MAX_LOGP1_REPEATS) {
                        // Apply the first two increments (one or two logs on first, one log on second)
                        if (bottom >= 1e10) bottom = Math.log10(Math.log10(Math.log10(bottom))) + 2
                        else bottom = Math.log10(Math.log10(bottom)) + 1
                        // Apply the remaining increments
                        for (let i = 2; i < height; i++) bottom = Math.log10(bottom) + 1
                    }
                    else bottom = 1 // The increment result is indistinguishable from 1

                    top += 1
                }
                else { // Top mode: height is increased by one, or until the next nonzero value
                    // Prevent running top mode more times than necessary
                    if (elem == searchMax && array[elem][0] == height && !(smallTop && top >= 10)) break

                        bottom = Math.log10(bottom) + top
                        height += 1
                        if (elem < searchMax+1 && height > array[elem][0]) elem += 1
                        if (elem < searchMax+1) {
                            if (height == array[elem][0]) top = array[elem][1] + 1
                            else if (bottom < 10) { // Apply top mode multiple times
                                let diff = array[elem][0] - height
                                if (diff < MAX_LOGP1_REPEATS) {
                                    for (i = 0; i < diff; i++) bottom = Math.log10(bottom) + 1
                                }
                                else bottom = 1 // The increment result is indistinguishable from 1
                                height = array[elem][0]
                                top = array[elem][1] + 1
                            }
                            else top = 1
                        }
                        else top = 1
                }
                repeatCountLess--
            }
        }
        return { bottom: bottom, top: top, height: height }
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
            let pol = polarize(array)
            return regularFormat(pol.bottom, precision3) + "F" + commaFormat(pol.top)
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
            let pol = polarize(array)
            return regularFormat(pol.bottom, precision3) + "G" + commaFormat(pol.top)
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
            let pol = polarize(array)
            return regularFormat(pol.bottom, precision3) + "H" + commaFormat(pol.top)
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
            let pol = polarize(array, true)
            //(10{9})^8 (10{8})^2 (10{7})^1 (10{4})^4 (10{3})^6 (10{2})^7 (10{1})^186022287184 48571.21153293763
            return regularFormat(Math.log10(pol.bottom) + pol.top, precision4) + "J" + commaFormat(pol.height)
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

            let pol = polarize(array, true)
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
            return regularFormat(topJ, precision4) + "K" + commaFormat(layer)
        } else if (num.lt("l0 s1 a[10,[1,4,2,1]]")) { // K1000000 ~ 1L5

            if (num.lt(`l0 s1 a[10,["x",${Number.MAX_SAFE_INTEGER},1,1]]`)) {
                return "K" + format(num.operator("x") + 1)
            }

            let rep = num.operator(1, 2);
            num.operator(1, 2, 1, 0);
            return "K".repeat(rep) + format(num);
        } else if (num.lt(`l0 s1 a[10000000000,[1,8,1,1],[2,8,1,1],[3,8,1,1],[4,8,1,1],[5,8,1,1],[6,8,1,1],[7,8,1,1],[8,8,1,1],[9,8,1,1],["x",8,1,1],[1,999998,2,1]]`)) { // 1L5 ~ L1,000,000
            // L的UCF形式主要取决于K于J重叠的数量
            
            let L = 0;
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
            } 
            let y = Math.floor(L)
            let x = 10**(L-y)
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
        }
    }

    
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