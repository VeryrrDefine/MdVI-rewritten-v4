!(function() {
    var textslength;
    var texts = [
        {
            text: "这是一条新闻"
        },
        {
            text: "史上平衡最差的增量游戏是什么？IMR和IDR算什么，WSC才是真神"
        },
        {
            text: "All miracl... 抱歉走错了"
        },
        {
            text: "通关了？如过？超级过关了？如超？究极过关了？F1.797e308"
        },
        {
            text: "Darkest night, I'll confront you here"
        },
        {
            text: "科技已经这么发达了吗，都有K65路公交车了，比葛立恒数还大！",
        },
        {
            text: "别以为100下少，底数是3有ω^ω+1不止呢"
        },
        {
            text: "红鲨在坐车回家的路上，因为速度(受软上限限制)、超级折算|路程，迟迟到不了家"
        },
        {
            text: "因为受上限限制，加上有上有硬上限封顶，导致信息无法超光速传播"
        },
        {
            text: "1+1 = 1.414213562373095048(受软上限限制)"
        },
        {
            text: "比赛时的成绩往往比不过平时的，是因为（处于挑战之中）"
        },
        {
            text: "在马拉松中你的路程受软上限限制，因为你现在有一个疲劳的buff。"
        },
        {
            text: "粒子物理学家Pollux用加速器证明了相对论是错误的，因为光速并不是一个硬上限，而是一个很硬的软上限。"
        },
        {
            text: "伪物(Nisemono)无法被消灭，因为它构建于素数的序列(A058009)之上"
        },
        {
            text: "5小时后更新"
        },
        {
            text: "刚刚复习完的你正在玩游戏休息，突然你脑中出现一道信息： 遗忘度 超过 记忆度 ，进行一次无奖励的 知识重置"
        },
        {
            text: `去超市购物，采购的差不多五百多块的东西，结果结账发现：原价500｜折算^0.9（笑点解析：超市正在打“折”）`
        },
        {
            text: "你有10.000e19728风之微粒，就是这记数法怎么有点奇怪"
        },
        {
            text: "孩子们，这是真的, 我在制作游戏时留了后门, 玩游戏时只需按下alt+f4, 就可以到达Endgame, 快去试吧！" 
            // 改编 from B站 益达笑出 with bluearchive avatar
        },
        {
            get text(){
                let temp = "";
                let arr = ["ω","ω2","ω<sup>2</sup>","ω<sup>ω</sup>","ε<sub>0</sub>", "φ(3,0)", "φ(1,0,0)", "φ(1,0,0,0)","SVO","LVO","BHO","BO"]/*ωεζηφΓψΩ*/
                for (let i =1;i<50;i++){
                    temp = temp.concat("")
                    temp = temp.concat(i.toString())
                    temp = temp.concat("倍大扩散点")
                    if (i!= 49){
                        temp = temp.concat("，")
                    }
                }
                temp = temp.concat("...")
                for (let i =0;i<arr.length;i++){
                    temp = temp.concat("")
                    temp = temp.concat(arr[i])
                    temp = temp.concat("倍大扩散点")
                    if (i!= arr.length-1){
                        temp = temp.concat("...")
                    }
                }
                return temp
            }
        },
        {
            get text(){
                let temp = "仙境由于能量过多，坍塌了。";
                for (let i = 1; i<20; i++){
                    temp = temp.concat("多".repeat(i))
                    temp = temp.concat("元仙境由于能量过多，")
                    temp = temp.concat("又".repeat(i))
                    temp = temp.concat("坍塌了。")
                }
                return temp
            }
        },
        { 
            text: "看似永不停息的时间，却和活动的画面组成影像一般，game speed is altered，0.000, game speed is altered, -3.1536e7"
        },
        {
            text: "本游戏使用了PowiainaNum.js。 啥？你说PowiainaNum.js是Naruyoko的幻想吗？"
        },
        {
            text: "Isolation, I don't want to, sit on the softcap tree"
        },
        {
            text: "再说就砍"
        },
        {
            text: "I wonder how, I wonder why, Yesterday you told me about the blue blue sky"
        },
        {
            text: '我是三四，我要神盘你。 我去这个三四，台可怕了'
        },
        {
            text: "给它一个互联网，它能墙掉全世界 它就是中国顶尖技术长城防火墙 美国五星将军麦克阿瑟曾表示:如果中国利用好这项技术，可以将世界互联网一分为二 长城防火墙就是这么厉害，正当ChatGPT中国用户正在为注册成功沾沾自喜的时候，仅仅1分钟，大陆就失去了ChatGPT的访问权限 长城防火墙究竟是何等技术 大型纪录片长城防火墙持续为您播出"
        },
        {
            text: "我在一个小游戏开挂被误封了"
        },
        {
            text: "中国玩家遇到的第一道墙： <span style=\"color: rgb(28,253,253)\">Anti</span><span style=\"color: rgb(255,255,9)\">matter</span> Dimensions, The <span style=\"color: rgb(11,96,14)\">Reality</span> Update"
        },
        {
            text: "Phigros联动无穷了！！！！！！！！！以后打歌前要开启无穷无尽，刷100000大嘎吱次数，存储1.79e308复制人，买321个穷尽升级，打8次我明白了，刷1e308网络地址，还要没完没了的重置！！"
        },
        {
            text: "Phigros联动reality！！！！！！！！！以后打歌前要reality，刷10000 realities，获得100 ra levels，填埋5 celestial，打60次lai teia，刷1e17 iM，还要皮肤重置！！"
        },
        {
            text: "Phigros联动反问题尺寸了！！！！！！！！！以后打歌前要开皮肤，刷1e9e15反问题，获得999999999星系，填埋5个裂缝，打60次永久质疑，刷1e4000永久指画，还要皮肤重置！！"
        },
        {
            text: "Phigros联动永恒了！！！！！！！！！以后打歌前要开启永恒，刷100000永恒次数，存储20850419的无限次数，买100个时间之理，打50次EC，刷1e4000EP，还要进入实际！！"
        },
        {
            text: "Phigros联动天体了！！！！！！！！！以后打歌前要进入有一个的实际，刷100个eff字型，存储1天的现实时间，买100个空间之理，挂100级天体记忆，刷1e40个奇点，还要预订实际！！"
        },
        {
            text: "我昨天吃了1.79e308g海苔，今天一看里面有2.912e310g是钠伪装的"
        },
        {
            text: "【UP猪】你【？！～！】的操作，很【抢】啊，不仅【几树】不错，外挂也用的【步厝】，所以，能不能【彡脸】换置顶【链接已屏蔽】？？！"
        },
        {
            text: "我长这么大，从来没有见过这么乖的狗，你一摸它，它就笑，来，摸摸嗯摸摸嗯，看到了吗？他笑的多开心，一摸它它就笑，一摸它它就笑，好乖的狗呀，"
        },
        {
            text: '为什么没有第九维度?',
        },
        {
            text: '距离下一次更新只有114514小时了！',
        },
        {
            text: '什么?你问我维度提升在哪里?<del>在历史的垃圾堆里</del>就在下面啊'
        },
        {
            text: '你制造了1 mm<sup>4</sup>4维体积！！你知道这意味着什么吗?'
        },
        {
            text: "| '0'''''1'''''2'''''3'''''4'''''4'''''4'''''4'''''4'''''4'''''4 | 是的，这是一把尺子，但<span style='color:red'>(受硬上限限制)</span>"
        },
        {
            text: "到底要不要购买最大，这是一个问题"
        },
        {
            text: `玩序数增量玩的 ————eferygrt`
        },
        {
            text: `新闻播放顺序完全随机，你可能会一次看到两个一样的新闻`
        },
        {
            text: `这条新闻是由第一新闻维度生产的`
        },
        {
            text: `如何评价 ————eferygrt`
        },
        {
            text: `这个游戏没有任何错误，它们是另类的成功`
        },
        {
            text: `<a href="https://b23.tv/BV1GJ411x7h7" target="_blank">点我立即到达Endgame</a>`
        },
        {
            text: `大型纪录片《质量增量重制版 0.8天价虫洞卖出了1024 archverses(ee1.7177e6 gramm of mass)》给他一个时间速度加成，他敢把价格卖到<del>11
4514 lodeverses(f114,516 gramm of mass)</del>114514 archs-metaverse(6.2349f4 gramm of mass). 近日有网友表示，在某增量游戏新闻播放器上看到一则重要到有时间旅行者提醒的新闻，
由于虫洞质量不断扩大，粒子物理学研究员Pollux和粒子超理学研究员天才俱乐部#83黑塔通过虫洞在反物质宇宙相遇，物理学家建议创造更大的虫洞
。某一数学家兼物理学家利用伽罗瓦理论庞加莱猜想的庞加莱回归定理和伽马函数算出了天价虫洞已经来到了1024 archverses(ee1.7177e6 gramm of mass)，不过我们还是不知道
他们两个是怎么掉进这么大的虫洞的，可能是被自动幽灵一脚踢进虫洞。据研究员Pollux报告，他先前由于某个由于机密不能披露的异常影响导致视觉
能力严重下降，来到反物质宇宙后因为反物质的时间效应迅速恢复，他表示以后天体物理学研究要加紧研究虫洞。为此五星上将麦克阿瑟表示，要是我有
这么大的虫洞，我当年的军衔一定不止五星，至少也得有50星，就连SCP-CN-1630都表示，这43年来，我天天被人注射记忆删除药剂，没得睡过一次好
觉，要是我有这么大的虫洞一定得进去放个C类通道，然后在里面睡一觉，不仅可以体验相对论时间膨胀，还可以带薪休假。大型纪录片之《质量增量重制
版 0.8天价虫洞卖出了1024 archverses(ee1.7177e6 gramm of mass)》持续为您播放`
        },
        {
            text: `0+0是宇宙万法的那个源头`
        },
        {
            text: `削一下维度提升，谢谢`
        },
        {
            text: `点击此新闻后什么也不会发生`
        },
        {
            text: '你看到这条新闻的概率是其它新闻的概率的1%',
            get unlocked() {
                return (Math.random() < 0.01)
            }
        },
        {
            text: 'Uncaught ReferenceError: Cheater is not defined'
        },
        {
            text: '更新进度：0/{10, 9e15, 1, 1, 1, 2}小时'
        },
        {
            text: '错误404：未找到新闻'
        },
        {
            text: '当你看这条新闻时，你就看过这条新闻了'
        },
        {
            text: '这是一条无意义的新闻'
        },
        {
            get text() {
                return `你说得对，但是我也不知道谁说的对`
            }
        },
        {
            text: '请添加这一条新闻'
        },
        {
            text: '什么bug? 这不是特性吗'
        },
        {
            text: '增量的反义词是减魖'
        },
        {
            get text(){
                let a = Math.floor(Math.random()*10)
                let b = Math.floor(Math.random()*10)
                let c = a+b+Math.floor(Math.random()*10)+1
                return `${a}+${b}=${c}，这显然是错误的`
            }
        },
        {
            text: "<span style='background: yellow;color: black'>要警惕新黄色新闻</span>"
        },
        {
            text: "16-9，6-9不够，借一当十，16-9"
        },
        {
            text: "最新的break_reality.js已在f<sub>Ω<sub>0</sub></sub>(114514)年发行，可以表示大小为BB(1.798e308)那么大的数字"
        },
        {
            text: "这不是一条非滚动新闻"
        },
        {
            text: "谁问你了?"
        },
        {
            text: "这一切有什么意义？没有什么意义？没有没什么意义？"
        },
        {
            text: "汉化版打开游戏就能找到句号。"
        },
        {
            text: '游戏有bug怎么办?只有我们把代码删完，就没有bug了'
        },
        {
            text: '可以搞个bug增量'
        },
        {
            text: 'ExpantaNum最大支持10{{1}}9e15那么大的数，本游戏使用了Expant...不对， 本游戏使用了PowiainaNum.js，那么本游戏的数值上限为{10,1e40,1,1,1,2}也很正常吧'
        },
        {
            text: "曾经有一位流浪者在后室误入<a href=\"https://backrooms.fandom.com/zh/wiki/User:VeryRRDefine/Level_ZH_736\">Level ZH 736</a>，3月27日晚上9点左右Level ZH 736突然毁灭，原因不明，流浪者推测已死亡"
        },
        {
            text: "授人以鱼，不如授人以渔，不如授人以氵渔，不如授人以氵氵渔，不如授人以氵氵氵渔，不如授人以氵氵氵氵渔，不如授人以氵氵氵氵氵渔，…………"
        },
        {
            text: "如果你想达到Endgame拍拍手！ （啪）（啪） （咚咚 咚咚咚 C#~ D#~ G# D#~ F~ G#F#FC# C#~ D#~ G#~）"
        },
        {
            text: "Pelle偷走了重要的Infinity Points x2 Multiplier"
        },
	    
	    {
	    	text: "以下几个图片你最害怕哪个呢？ 1: 醒来打开游戏发现只有10反物质  2: 打开手机发现一个冒着红色感叹号的安， 😱😱😱😱😱😱"
	    },
	    {
		text: "fastboot oem unlock"
	    },
	    {
		text: "vim index.html  :wq"
	    }
    ];
    textslength = texts.length;
    let rand;
    var updatenews = function () {
        let e = document.getElementById("newsText")
        /*  */
        //if (!player.options.showNewsTicker) return
        do {
            rand = Math.floor(Math.random() * textslength)
        } while(checkRand(rand))
        /*if (typeof dev != "undefined") {
            if (dev.devmode) rand = textslength-1
        }if (rand == 56 && repeatN56times == 0) repeatN56times = Math.round(3+Math.random()*(5-2))
        if (repeatN56times > 0) repeatN56times--
        if (repeatN56times > 0) rand = 56*/
        let msg = texts[rand].text;
        e.innerHTML = msg
        let textWidth = e.clientWidth;
        let parentWidth = e.parentElement.clientWidth;
        e.style.transition = '';
        e.style.transform = 'translateX(' + (parentWidth + 10) + 'px)';
        let dist = parentWidth + e.clientWidth
        let rate = 150;
        let transformDuration = dist / rate;
        e.style.transition = 'transform ' + transformDuration + 's linear';
        e.style.transform = 'translateX(-' + (textWidth) + 'px)';
        e.addEventListener('transitionend', onNewsEnd)
    }
    var onNewsEnd = function () {
        let e = document.getElementById("newsText");
        e.removeEventListener('transitionend', onNewsEnd)
        setTimeout(updatenews, 1000)
    }
    Vue.component("newsticker",{
        get template() {
            return `<div id="news"><p id="newsText"></p></div>`
        },
        mounted() {
            updatenews();
        },
    })
    function checkRand(rand) {
        if(texts[rand].unlocked === undefined) return false
        else if(texts[rand].unlocked) return false
        else return true
    }
})()
