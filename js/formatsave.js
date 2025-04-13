var formatsave = {
	serialize(s) {
		/**
		 * Serialize a object to string
		 */
		return this.steps.reduce((x,f) => f[0](x), s)
	},
	deserialize(s) {
		return this.steps.reduceRight((x,f) => f[1](x), s)
	},
	steps: [
		/*
		 * Steps with [serialize, deserialize]
		 * **/
		[(x) => JSON.stringify(x), (x)=>JSON.parse(x)],
		[(x) => btoa(x), (x) => atob(x)]
	]
}
function save() {
		localStorage.setItem("mdvi-v4", formatsave.serialize(player))
	}

var blackListProperties = []
function deepCopyProps(source,target) {
    for (let key in source) {  
        if (source.hasOwnProperty(key)) {  
            // 如果源对象的属性是对象或数组，则递归复制  
            if ((typeof source[key] === 'object' && !(source[key] instanceof PowiainaNum)) && source[key] !== null) {  
                // 如果目标对象没有这个属性，或者属性是null，则创建一个新的  
                if (!target.hasOwnProperty(key) || target[key] == null || Array.isArray(source[key]) !== Array.isArray(target[key])) {  
                    target[key] = Array.isArray(source[key]) ? [] : {};  
                }  
                // 递归复制属性  
                deepCopyProps(source[key], target[key]);  
            } else {  
                // 如果属性不是对象或数组，则直接复制  
                target[key] = source[key];  
            }  
        }  
    }  
}

function transformToP(object) {
    for(let key in object) {
        if (blackListProperties.includes(key)){
            continue;
        }
        if(typeof object[key] === "string" && !PowiainaNum.isNaN(object[key])) {
            object[key] = new PowiainaNum(object[key]);
        }
        if(typeof object[key] === "object") {
            transformToP(object[key]);
        }
    }
}

function exportCopy() {
    return copyToClipboard(formatsave.serialize(player))
}
  
function exportFile() {
    let str = formatsave.serialize(player)
    let file = new Blob([str], {
        type: "text/plain"
    })
    window.URL = window.URL || window.webkitURL;
    let a = document.createElement("a")
    a.href = window.URL.createObjectURL(file)
    a.download = "Mdv Incremental Save - " + getCurrentBeijingTime() + ".txt"
    a.click()
}
async function importText(){
    let save2 = prompt("输入存档");
    let a = ssf[0](save2);

    if (a) {
        a();
    }
    else{
        importing_player = formatsave.deserialize(save2)
        hardReset();
        transformToO(importing_player);
        deepCopyProps(importing_player, player)
        save()

        location.href = location.href;
    }
}
function formattedHardReset() {
    confirms = 3
    for(let i = 1; i < 3; i++) {
        let promption = prompt(`请输入${i}以进行第${i}/${confirms}次确认，此操作无法还原!`)
        if(promption != String(i)) return
    }
    let promption = prompt(`请输入${confirms}以进行最后一次确认，此操作无法还原!`)
    if(promption != String(confirms)) return
    hardReset()
    save()
    location.reload()
}

function importFile() {
    let a = document.createElement("input")
    a.setAttribute("type", "file")
    a.click()
    a.onchange = () => {
        let fr = new FileReader();
        fr.onload = function () {
            let save = fr.result
            importing_player = formatsave.deserialize(save)
            hardReset();
            transformToO(importing_player);
            deepCopyProps(importing_player, player)
            
            save();
            console.clear()
            location.href = location.href;
        }
        fr.readAsText(a.files[0]);
    }
}

// 复制文本内容方法
function copyToClipboard(textToCopy) {
    if(document.execCommand('copy')) {
        // 创建textarea
        var textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        // 使textarea不在viewport，同时设置不可见
        textArea.style.position = "fixed";
        textArea.style.opacity = 0;
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
            // 执行复制命令并移除文本框
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
        });
    } else if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      // navigator clipboard 向剪贴板写文本
        return navigator.clipboard.writeText(textToCopy);
    }
   // addNotify("复制失败")
}
function copyToFile(str,name) {
    let file = new Blob([str], {
        type: "text/plain"
    })
    window.URL = window.URL || window.webkitURL;
    let a = document.createElement("a")
    a.href = window.URL.createObjectURL(file)
    a.download = name + ".txt"
    a.click()
}
function getCurrentBeijingTime() {
    const t = new Date,
        e = t.getUTCFullYear(),
        r = String(t.getUTCMonth() + 1).padStart(2, "0"),
        a = String(t.getUTCDate()).padStart(2, "0"),
        n = t.getUTCHours(),
        g = t.getUTCMinutes(),
        i = t.getUTCSeconds(),
        S = t.getUTCMilliseconds();
    let o = (n + 8) % 24;
    return o < 0 && (t.setUTCDate(t.getUTCDate() + 1), o += 24), `${e}-${r}-${a} ${o.toString().padStart(2,"0")}:${g.toString().padStart(2,"0")}:${i.toString().padStart(2,"0")}.${S.toString().padStart(3,"0")}`
}
  

function findNaN(object,node=["player"]) {
    let nanNodes = [];
    for(let key in object) {
        if (object[key]=="NaN"){
            nanNodes.push([...node,key])
        }
        if(typeof object[key] === "object") {
            if (object[key] instanceof PowiainaNum){
                if (object[key].isNaN()){
                    nanNodes.push([...node,key])
                }
            } else{
                nanNodes.push(...findNaN(object[key], [...node,key]))

            }
        }
    }
    return nanNodes;
}
