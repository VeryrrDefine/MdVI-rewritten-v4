var tabShow = {
    inPrimaryTab(primaryTab) {
        let subtabIDList = [];
        for (const key in this[primaryTab]){
            if (key === "text" || key === "class" || key === "unlocked" || key === "firstTabID" || key === "style"){
                
            }else{
                subtabIDList.push(this[primaryTab][key].id)
            }
        }
        return subtabIDList.includes(player.currentPage) || player.currentPage == this[primaryTab].firstTabID
    },
    inSecondaryTab(primaryTab, secondaryTab) {
        return player.currentPage == this[primaryTab][secondaryTab].id
    },
    main: {
        volume_generator: {
            id: 1,
            text: "4维体积发生器",
            unlocked() {
                return true;
            },
        },
        offline: {
		id:5,
            text: "离线时间",
            unlocked() {
                return true;
            }
        },
        text: "主要",
        firstTabID: 1
    },
    reset: {
        text: "重置",
        firstTabID: 9,
        faketab: {
            unlocked(){return false},
            id: 9
        },
    },
    settings: {
        text: "选项",
        firstTabID: 2,
        save: {
            id: 2,
            text: "保存",
        },
        about: {
            id: 3,
            text: "关于"
        },
        backgroundSettings: {
            id: 11,
            text: "概要"
        },
        achievements:{
            id: 20,
            text: "成就"
        },
        stats: {
            id: 1898180914,
            text: "统计"
        }
    },
    test: {
        text: "1187",
        firstTabID: 11870903,
        test: {
            id: 11870903,
            text: "测试"
        },
        elementTest: {
            id: 11870904,
            text: "elementtest"
        },
        unlocked(){
            return location.host.includes("127.0.0.1")
        }
    },

};
function primaryTabSort() {
    let result = [];
    for (const key in tabShow){
        if (key === "inPrimaryTab" || key === "inSecondaryTab"){
            continue;
        }else{
            let showThisTab = false;
            if (tabShow[key].unlocked === void 0){
                showThisTab = true
            }else{
                showThisTab = tabShow[key].unlocked()
            }
            if (showThisTab){
                result.push(
                    {
                        style: (tabShow[key].style || ""),
                        text:  tabShow[key].text,
                        name: key,
                        id: tabShow[key].firstTabID
                    }
                )
            }
        }
    }
    return result;
}
function secondaryTabSort() {
    let result = [];
    for (const key in tabShow){
        if (tabShow.inPrimaryTab(key)){
            for (const subtabKey in tabShow[key]){
                if (subtabKey === "firstTabID" || subtabKey === "text" || subtabKey==="unlocked" || subtabKey === "class"|| subtabKey === "style"){continue;}else{
                    let showThisSubTab = true;
                    if (tabShow[key][subtabKey].unlocked === void 0){
                        showThisSubTab = true;
                    }else{
                        showThisSubTab = tabShow[key][subtabKey].unlocked()
                    }
                    if (showThisSubTab){
                        result.push(
                            {
                                id: tabShow[key][subtabKey].id,
                                style: (tabShow[key][subtabKey].style || ""),
                                text:  tabShow[key][subtabKey].text,
                                name: subtabKey,
                                parentTab: key
                            }
                        )
                    }
                }
            }
        }
    }
    return result;
}
function getTabClass(tabname) {
    return "btn "+tabShow[tabname].class || ""
}
function getSubTabClass(parentTab,subTabName) {
    return "btn "+tabShow[parentTab][subTabName].class || ""
}
