export const ELEMENTS = {
    pyro :  "火元素", hydro : "水元素", electro : "雷元素", cryo : "冰元素", 
    dendro : "草元素", geo : "岩元素", anemo : "风元素", physical : "物理",
    none : "无",
};
export const REACTIONS = {
    vaporize : "蒸发", melt : "融化", overload : "超载", superconduct : "超导", 
    swirl : "扩散", electrocharged : "感电", shatter : "碎冰", burning : "燃烧", 
    bloom : "绽放", hyperbloom : "超绽放", burgeon : "烈绽放", aggravate : "超激化", 
    spread : "蔓激化", crystallize : "结晶", frozen : "冻结",
    lunarCharged : "月感电", lunarBloom : "月绽放", lunarCrystallize : "月结晶",
    stellarConduct : "星超导", stellarSwirl : "星扩散",
};
export const REACTION_DAMAGES = {
    none : "无",
    vaporize : "蒸发", melt : "融化", overload : "超载", superconduct : "超导", 
    swirl : "扩散", electrocharged : "感电", shatter : "碎冰", burning : "燃烧", 
    bloom : "绽放", hyperbloom : "超绽放", burgeon : "烈绽放", aggravate : "超激化", 
    spread : "蔓激化",
    directLunarCharged : "直伤月感电", directLunarBloom : "直伤月绽放", directLunarCrystallize : "直伤月结晶",
    reactionLunarCharged : "反应月感电", reactionLunarCrystallize : "反应月结晶",
    directStellarConduct : "直伤星超导", directStellarSwirl : "直伤星扩散", 
    reactionStellarSwirl : "反应星扩散",
};

export function get_reaction_damage_element(rxndmg, appliedElement, auraElement){
    switch(rxndmg){
        case "none": {return appliedElement;}
        case "vaporize": {return appliedElement;}
        case "melt": {return appliedElement;}
        case "overload": {return "pyro";}
        case "superconduct": {return "cryo";}
        case "swirl": {return auraElement;}
        case "electrocharged": {return "electro";}
        case "shatter": {return "physical";}
        case "burning": {return "pyro";}
        case "bloom": {return "dendro";}
        case "hyperbloom": {return "dendro";}
        case "burgeon": {return "dendro";}
        case "aggravate": {return "electro";}
        case "spread": {return "dendro";}
        case "directLunarCharged": {return "electro";}
        case "directLunarBloom": {return "dendro";}
        case "directLunarCrystallize": {return "geo";}
        case "reactionLunarCharged": {return "electro";}
        case "reactionLunarCrystallize": {return "geo";}
        case "directStellarConduct": {return "cryo";}
        case "directStellarSwirl": {return appliedElement;}
        case "reactionStellarSwirl": {
            if(appliedElement === "anemo"){return "anemo"}
            else{return "cryo"}
        }
    }
}


export const CATALYZE_SET = new Set(["aggravate", "spread"]); // 激化反应类别
export const TRANSFORMATIVE_SET = new Set(["overload", "superconduct", "swirl", "electrocharged", "shatter", "burning",
                                    "bloom", "hyperbloom", "burgeon"]) // 剧变反应
export const AMPLIFYING_SET = new Set(["vaporize", "melt"]); // 增幅反应
export const LUNAR_SET = new Set(["directLunarCharged", "directLunarBloom", "directLunarCrystallize", 
                            "reactionLunarCharged", "reactionLunarCrystallize"]); // 月曜反应
export const STELLAR_SET = new Set(["directStellarConduct", "directStellarSwirl", "reactionStellarSwirl"]); // 星烁反应

export const DAMAGE_TYPES = new Set(["direct", "amplifying", "transformative", "catalyze", "directLunar", "reactionLunar",
                                "directStellar", "reactionStellar"])

export const ATTACK_TYPES = {
    swap : "切换角色",
    attack : "普通攻击",
    charge : "重击",
    skill : "元素战技",
    burst : "元素爆发",
    plunge : "下落攻击",
};
export const STATS = {
    atk : "攻击力", def : "防御力", hp : "最大生命值",
    batk : "基础攻击力", bdef : "基础防御力", bhp : "基础最大生命",
    atkp : "攻击力%", defp : "防御力%", hpp : "生命值%",
    atkf : "固定攻击力", deff : "固定防御力", hpf : "固定生命值",
    cr : "暴击率", cd : "暴击伤害", em : "元素精通", er : "元素充能",
    heal : "治疗加成", ss : "护盾强效",
    // 元素增伤部分
    pyroDMG:"火元素增伤", hydroDMG: "水元素增伤", electroDMG: "雷元素增伤",
    cryoDMG: "冰元素增伤", dendroDMG: "草元素增伤", geoDMG: "岩元素增伤",
    anemoDMG: "风元素增伤", physicalDMG: "物理增伤",
    // 技能增伤部分
    attackDMG:"普攻增伤", chargeDMG:"重击增伤", plungeDMG:"下落攻击增伤", skillDMG:"元素战技增伤", burstDMG:"元素爆发增伤",
    // 减抗部分
    pyroDeRes: "火元素减抗", hydroDeRes: "水元素减抗", electroDeRes: "雷元素减抗",
    cryoDeRes: "冰元素减抗", dendroDeRes: "草元素减抗", geoDeRes: "岩元素减抗",
    anemoDeRes: "风元素减抗", physicalDeRes: "物理减抗",
    // 无视防御和减防
    defIgnore : "无视防御", defReduction : "减防",
    // 反应增伤（如莫娜提供的蒸发反应加成）
    reactionDMG : "反应增伤",
    // 异化剧变反应增伤
    lunarChargedDMG : "月感电增伤", lunarBloomDMG : "月绽放增伤", lunarCrystallizeDMG : "月结晶增伤",
    stellarConductDMG : "星超导增伤", stellarSwirlDMG : "星扩散增伤",
    // 异化剧变反应基础伤害
    lunarChargedBaseDMG : "月感电基础增伤", lunarBloomBaseDMG : "月绽放基础增伤", lunarCrystallizeBaseDMG : "月结晶基础增伤",
    stellarConductBaseDMG : "星超导基础增伤", stellarSwirlBaseDMG : "星扩散基础增伤",
    // 异化剧变反应擢升
    lunarChargedElevation : "月感电擢升", lunarBloomElevation : "月绽放擢升", lunarCrystallizeElevation : "月结晶擢升",
    stellarConductElevation : "星超导擢升", stellarSwirlElevation : "星扩散擢升",
    // 额外伤害加成（羽毛）和倍率乘数（大权）
    flatDMG : "额外伤害加成", baseDMGMult: "倍率乘数", 
    // 剧变反应伤害基数(等级系数)
    levelMult : "等级系数",
    // 其他：包括减CD
    CDReduction : "减CD",
}
export const STAT_KEY_SET = new Set(Object.keys(STATS)); // 词条的key，需要扣除atk、def和hp三个
["atk", "def", "hp"].forEach(item => STAT_KEY_SET.delete(item));

export const TALENT_KEY_SET = new Set(["A", "E", "Q"]);

export const ARTIFACT_MAIN_STATS = {
    flower: {hpf: { value: 4780, label: "固定生命值" },},
    plume: {atkf: { value: 311, label: "固定攻击力" },},
    sands: {
        atkp: { value: 0.466, label: "攻击力%" },
        hpp: { value: 0.466, label: "生命值%" },
        defp: { value: 0.583, label: "防御力%" },
        em: { value: 187, label: "元素精通" },
        er: { value: 0.518, label: "元素充能效率" }
    },
    goblet: {
        atkp: { value: 0.466, label: "攻击力%" },
        hpp: { value: 0.466, label: "生命值%" },
        defp: { value: 0.583, label: "防御力%" },
        em: { value: 187, label: "元素精通" },
        pyroDMG: { value: 0.466, label: "火元素伤害加成" },
        hydroDMG: { value: 0.466, label: "水元素伤害加成" },
        electroDMG: { value: 0.466, label: "雷元素伤害加成" },
        cryoDMG: { value: 0.466, label: "冰元素伤害加成" },
        dendroDMG: { value: 0.466, label: "草元素伤害加成" },
        geoDMG: { value: 0.466, label: "岩元素伤害加成" },
        anemoDMG: { value: 0.466, label: "风元素伤害加成" },
        physicalDMG: { value: 0.583, label: "物理伤害加成" }
    },
    circlet: {
        atkp: { value: 0.466, label: "攻击力%" },
        hpp: { value: 0.466, label: "生命值%" },
        defp: { value: 0.583, label: "防御力%" },
        em: { value: 187, label: "元素精通" },
        cr: { value: 0.311, label: "暴击率" },
        cd: { value: 0.622, label: "暴击伤害" },
        heal: { value: 0.359, label: "治疗加成" }
    }
};
export const ARTIFACT_SUB_STATS = { // 圣遗物副词条，词条 : {label:词条名, avg:词条值平均}
    cr:   { label: "暴击率", avg: 3.305e-2 },
    cd:   { label: "暴击伤害",   avg: 6.605e-2 },
    atkp: { label: "攻击力%",  avg: 4.955e-2 },
    hpp:  { label: "生命值%", avg:4.955e-2},
    defp: { label: "防御力%", avg:6.195e-2},
    em:   { label: "元素精通",   avg: 19.815 },
    er:   { label: "元素充能效率", avg:5.505e-2},
    atkf: { label: "固定攻击力", avg:16.535},
    deff: { label: "固定防御力", avg:19.675},
    hpf:  { label: "固定生命值", avg:253.94},
};
export const ARTIFACT_SLOTS = { // 圣遗物部件
    flower:"生之花", plume:"死之羽", sands:"时之沙", goblet:"空之杯", circlet:"理之冠",
}
export const FLAT_STAT_SET = new Set(["em", "atkf", "deff", "hpf", "atk", "def", "hp", "batk", "bdef", "bhp",
                                     "levelMult", "flatDMG"]);

// 获得元素共鸣效果
export function get_elemental_resonance_effects(characters){
    let element_numbers = {pyro:0, hydro:0, electro:0, cryo:0, dendro:0, geo:0, anemo:0};
    let effects = [];
    Object.values(characters).forEach(item => {element_numbers[item.element] += 1});
    if(element_numbers.pyro >=2){effects.push({
        ID:"Resonance_FerventFlames", condition:{}, effect:resonance_effect_of_FerventFlames,
        isNet : true, isPermanent:true, desc:"双火共鸣：全队攻击力提升25%"
    })};
    if(element_numbers.hydro >=2){effects.push({
        ID:"Resonance_SoothingWater", condition:{}, effect:resonance_effect_of_SoothingWater,
        isNet : true, isPermanent:true, desc:"双水共鸣：全队最大生命提升25%"
    })};
    if(element_numbers.cryo >=2){effects.push({
        ID:"Resonance_ShatteringIce", condition:{isOnfield:true}, effect:resonance_effect_of_ShatteringIce,
        isNet : true, isPermanent:false, desc:"双冰共鸣：前台角色的暴击率提升15%(简化)"
    })};
    if(element_numbers.geo >=2){effects.push({
        ID:"Resonance_EnduringRock", condition:{isOnfield:true}, effect:resonance_effect_of_EnduringRock,
        isNet : true, isPermanent:false, desc:"双岩共鸣：前台元素增伤15%，岩元素减抗20%(简化)"
    })};
    if(element_numbers.anemo >= 2){effects.push({
        ID:"Resonance_ImpetuousWinds", condition:{}, effect:resonance_effect_of_ImpetuousWinds,
        isNet : true, isPermanent:true, desc:"双风共鸣：减少所有角色5%的冷却时间"
    })}
    if(element_numbers.dendro >=2){effects.push({
        ID:"Resonance_SprawlingGreenery", condition:{}, effect:resonance_effect_of_SprawlingGreenery,
        isNet : true, isPermanent:true, desc:"双草共鸣：全队元素精通提升50"},
    )};
    return effects;
};
function resonance_effect_of_FerventFlames(teamInitialAttributes, teamNetAttributes, action, activated = false){return {atkp:0.25};};
function resonance_effect_of_SoothingWater(teamInitialAttributes, teamNetAttributes, action, activated = false){return {hpp:0.25};};
function resonance_effect_of_ShatteringIce(teamInitialAttributes, teamNetAttributes, action, activated = false){return {cr:0.15};};
function resonance_effect_of_EnduringRock(teamInitialAttributes, teamNetAttributes, action, activated = false){
    return {pyroDMG:0.15, hydroDMG:0.15, electroDMG:0.15, cryoDMG:0.15, dendroDMG:0.15, geoDMG:0.15, anemoDMG:0.15, physicalDMG:0.15, geoDeRes:0.2};
};
function resonance_effect_of_SprawlingGreenery(teamInitialAttributes, teamNetAttributes, action, activated = false){return {em:50};};  //双草共鸣效果还和反应相关，后续要用再改

function resonance_effect_of_ImpetuousWinds(teamInitialAttributes, teamNetAttributes, action, activated = false){return {CDReduction:0.05}};