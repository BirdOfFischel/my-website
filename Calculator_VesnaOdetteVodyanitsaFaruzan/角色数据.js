// 角色数据库：角色数据、角色效果函数，以及默认武器/圣遗物实例装配
// 由原 HTML 内联 script 拆分而来；保持原有全局类名/变量名/函数名不变。
// 依赖关系：本文件需按主 HTML 中的 script 引用顺序加载。
// 当角色Effect返回的 buff 是羽毛时，需要额外返回五个参数：
//    singleFlatDMG: 单次羽毛的增益，hitnum：技能段数，repetitionCount: 重复次数，consumption：羽毛消耗数（无限次数为null），remaining：剩余次数（无限则为null）
// 角色的 talentMeta 可以有额外变量 constellation，表示命座要求

/* 模板文件
const template = {
  name : "珐露珊",
  rarity: 4,
  ID : "Faruzan",
  element : "anemo",
  level : 90,
  stat: "atkp", // 突破属性词条
  statValue : 0.24, // 突破属性数值
  statLabel : "攻击力%",
  weapon : null,
  candidateWeapons : {},
  artifactSet : [],
  candidateArtifactSets : {},
  artifacts: { // 默认词条：辅助向，优先充能
    flower : {
      mainStat : "hpf",
      subStats : {"cr":2, "cd":1, "atkp":1, "defp":0, "hpp":0, "em":0, "er":4, "atkf":0, "deff":0, "hpf":0},
    },
    plume : {
      mainStat : "atkf",
      subStats : {"cr":2, "cd":1, "atkp":1, "defp":0, "hpp":0, "em":0, "er":4, "atkf":0, "deff":0, "hpf":0},
    },
    sands : {
      mainStat : "er",
      subStats : {"cr":3, "cd":1, "atkp":3, "defp":0, "hpp":0, "em":0, "er":0, "atkf":1, "deff":0, "hpf":0},
    },
    goblet : {
      mainStat : "anemoDMG",
      subStats : {"cr":2, "cd":1, "atkp":1, "defp":0, "hpp":0, "em":0, "er":4, "atkf":0, "deff":0, "hpf":0},
    },
    circlet : {
      mainStat : "cr",
      subStats : {"cr":0, "cd":2, "atkp":1, "defp":0, "hpp":0, "em":0, "er":4, "atkf":1, "deff":0, "hpf":0},
    },
  },
  constellation : 6,
  displayedStats : ["cr", "cd", "atk", "em", "def", "hp", "er", "anemoDMG", "anemoDeRes"],
  effectiveSubStats : {"er":1, "atkp":1, "cr":1, "cd":1, "em":0.5, "atkf":0.33},
  get effectiveSubStatCount(){
    let count = 0;
    for(let slot of Object.keys(this.artifacts)){
      const substats = this.artifacts[slot].subStats;
      for(let stat of Object.keys(substats)){
        count += (this.effectiveSubStats[stat] || 0) * substats[stat];
      }
    }
    return count;
  },
  base : {  
    90 : {atk: 196, def: 628, hp: 9570,},
    95 : {atk: 222, def: 650, hp: 9901,},
    100 : {atk: 247, def: 671, hp: 10232,},
  },
  talentLevels : {A : 10, E : 10, Q : 10, other : 1},
  talentMetas : {
    swap : {ID : "swap", characterID : "Faruzan", name : "切换角色",
            element:null, gauge:0, EACount:0, rxndmg:"none", talent:"other",
            attackType:"swap", isOnfield:true, isSnapshot:false,
            hitnum:0, scaling:null},
    e0 : {ID:"e0", characterID : "Faruzan", name : "非想风天",
          element:"anemo", gauge:1, EACount:1, rxndmg:"none", talent:"E",
          attackType:"skill", isOnfield:true, isSnapshot:false,
          hitnum:1, scaling:{10:{atk:2.6784}, 13:{atk:3.162}}}, // 技能伤害267.84%/316.2%
    q0 : {ID:"q0", characterID : "Faruzan", name : "抟风秘道",
          element:"anemo", gauge:1, EACount:1, rxndmg:"none", talent:"Q",
          attackType:"burst", isOnfield:true, isSnapshot:false,
          hitnum:1, scaling:{10:{atk:6.7968}, 13:{atk:8.024}}}, // 技能伤害679.68%/802.4%
    q_c6_vortex : {ID:"q_c6_vortex", characterID : "Faruzan", name : "6命风压坍陷风涡",
                  element:"anemo", gauge:1, EACount:1, rxndmg:"none", talent:"E", // 风涡伤害视为元素战技伤害
                  attackType:"skill", isOnfield:false, isSnapshot:false,
                  hitnum:1, scaling:{10:{atk:1.944}, 13:{atk:2.295}}, constellation:6}, // 后台伤害194.4%/229.5%
  },
  effects : [
    {ID:"Faruzan_QAnemoDMG", condition:{}, effect:Q_anemo_dmg_effect_of_Faruzan, isNet:true, isPermanent:false,
    get desc(){return `珐露珊Q祈风之赐：为全队提供32.4%(10级Q)或38.3%(13级Q)风元素伤害加成`}},
    {ID:"Faruzan_QDeRes", condition:{}, effect:Q_de_res_effect_of_Faruzan, isNet:true, isPermanent:false,
    desc:"珐露珊Q诡风之祸：烈风波降低敌人30%风元素抗性(简化为全程生效)"},
    {ID:"Faruzan_A4", condition:{elements:["anemo"], isOnfield:true, excludedRxndmgs:["directStellarSwirl", "reactionStellarSwirl"]}, 
    effect:passive_talent_4_of_Faruzan, isNet:false, isPermanent:false,
    desc:"珐露珊固有天赋2：处于祈风之赐下的前台角色造成风元素伤害时，基于珐露珊基础攻击力的32%提高伤害"},
  ],
  constellationEffects : {
    0 : [],
    1 : [],
    2 : [],
    3 : [{ID:"Faruzan_Constellation3", condition:{characterIDs:["Faruzan"]}, effect:()=>({E:3}),
          isNet:true, isPermanent:true, desc:"珐露珊命座3：非想风天的技能等级提高3级"}],
    4 : [],
    5 : [{ID:"Faruzan_Constellation5", condition:{characterIDs:["Faruzan"]}, effect:()=>({Q:3}),
          isNet:true, isPermanent:true, desc:"珐露珊命座5：抟风秘道的技能等级提高3级"}],
    6 : [{ID:"Faruzan_Constellation6", condition:{elements:["anemo"]}, effect:()=>({cd:0.40}),
          isNet:true, isPermanent:false, desc:"珐露珊命座6：处于祈风之赐下的角色造成风元素伤害时，暴击伤害提升40%"}],
  },
  parameters : {},
  teamParameters : {},
  variables : {},
  reset_variables(attributes){Object.keys(this.variables).forEach(key => {attributes[key]=this.variables[key]})},
}
  */



// #region 薇斯纳角色数据
export const Vesna = {
  name : "薇斯纳",  // 角色名称
  rarity: 5, // 稀有度，计算金数用
  ID : "Vesna",  // 角色ID
  element : "anemo",  // 角色属性
  level : 90,  // 角色等级
  stat: "cr", // 角色突破属性词条
  statValue : 0.192, // 角色突破属性数值
  statLabel : "暴击率", // 角色突破属性标签
  weapon : null, // 装备武器，为具体的武器对象，初始为空
  candidateWeapons : {}, // 候选武器，可选择的武器在里面
  artifactSet : [],  // 装备的圣遗物套装，[[具体套装，圣遗物件数]]，初始为默认值
  candidateArtifactSets : {}, // 候选的圣遗物组合
  artifacts: { // 圣遗物词条详情(这里是默认值)
    flower : {
      mainStat : "hpf", // 主词条
      subStats : {"cr":2, "cd":3, "atkp":1, "defp":0, "hpp":0, "em":1, "er":0, "atkf":0, "deff":0, "hpf":0}, // 副词条条数
    },
    plume : {
      mainStat : "atkf", // 主词条
      subStats : {"cr":3, "cd":3, "atkp":1, "defp":0, "hpp":0, "em":1, "er":0, "atkf":0, "deff":0, "hpf":0}, // 副词条条数
    },
    sands : {
      mainStat : "atkp", // 主词条
      subStats : {"cr":2, "cd":3, "atkp":0, "defp":0, "hpp":0, "em":1, "er":2, "atkf":0, "deff":0, "hpf":0}, // 副词条条数
    },
    goblet : {
      mainStat : "atkp", // 主词条
      subStats : {"cr":2, "cd":3, "atkp":1, "defp":0, "hpp":0, "em":0, "er":1, "atkf":0, "deff":0, "hpf":0}, // 副词条条数
    },
    circlet : {
      mainStat : "cr", // 主词条
      subStats : {"cr":0, "cd":3, "atkp":2, "defp":0, "hpp":0, "em":2, "er":1, "atkf":0, "deff":0, "hpf":0}, // 副词条条数
    },
  },
  constellation : 0, // 命座数，默认为0
  displayedStats : ["cr", "cd", "atk", "em", "def", "hp", "er", "stellarSwirlDMG", "anemoDeRes", "stellarSwirlElevation",
                    "flatDMG", "anemoDMG",
                    ], // 需要展示的词条
  effectiveSubStats : {"atkp":1, "cr":1, "cd":1, "em":1, "er":0.5, "atkf":0.33},//推荐的副词条和他的权重
  get effectiveSubStatCount(){ // 有效词条个数
    let count = 0;
    for(let slot of Object.keys(this.artifacts)){
      const substats = this.artifacts[slot].subStats;
      for(let stat of Object.keys(substats)){
        count += (this.effectiveSubStats[stat] || 0) * substats[stat];
      }
    }
    return count;
  },
  base : {  // 角色等级对应的基础属性值，等级分为90，95，100
    90 : {atk: 354, def:730, hp:13262,},
    95 : {atk: 394, def:756, hp:13733,},
    100 : {atk: 434, def:782, hp:14205,},
  },
  talentLevels : {A : 10, E : 10, Q : 10, other : 1},  // 技能等级，A、E、Q表示普攻、战技、爆发，other为其他（如命座附加的伤害）
  talentMetas : {
    /* 技能单元，包括ID、所属角色(char)、中文名称(name)、元素(element)、元素附着量(gauge)、元素附着次数(EACount)、反应伤害类型(rxndmg)、
        技能所属的talent(talent)、技能伤害类型(type)、技能倍率(scaling)、是否在前台释放(isOnfield)、
        是否为快照(isSnapshot)、技能单元对应的攻击段数(hitnum)、技能倍率(scaling)、命座要求(constellation)；
        其中 constellation 可以不存在，表示要求的命座为0
    */
    swap : {ID : "swap", characterID : "Vesna", name : "切换角色",
            element:null, gauge:0, EACount:0, rxndmg:"none", talent:"other",
            attackType:"swap", isOnfield:true, isSnapshot:false, 
            hitnum:0, scaling:null},  // 切换角色
    a1 : {ID : "a1", characterID : "Vesna", name : "普攻1",
          element:"anemo", gauge:1, EACount:1, rxndmg:"none", talent:"A",
          attackType:"attack", isOnfield:true, isSnapshot:false, 
          hitnum:1, scaling:{10:{atk:0.799}, 13:{atk:0.968}}},
    a2 : {ID : "a2", characterID : "Vesna", name : "普攻2",
          element:"anemo", gauge:1, EACount:1, rxndmg:"none", talent:"A",
          attackType:"attack", isOnfield:true, isSnapshot:false, 
          hitnum:1, scaling:{10:{atk:0.962}, 13:{atk:1.166}}},
    e0 : {ID:"e0", characterID : "Vesna",  name : "开启战技",
          element:"anemo", gauge:1, EACount:1, rxndmg:"none", talent:"E",
          attackType:"skill", isOnfield:true, isSnapshot:false, 
          hitnum:1, scaling:{10:{atk:0.72}, 13:{atk:0.85}}},
    e1 : {ID:"e1", characterID : "Vesna",  name : "翔风剑1",
          element:"anemo", gauge:1, EACount:1, rxndmg:"none", talent:"E",
          attackType:"skill", isOnfield:true, isSnapshot:false, 
          hitnum:1, scaling:{10:{atk:0.72}, 13:{atk:0.85}}},
    e2_anemo : {ID:"e2_anemo", characterID : "Vesna",  name : "翔风剑2",
                element:"anemo", gauge:1, EACount:1, rxndmg:"none", talent:"E",
                attackType:"skill", isOnfield:true, isSnapshot:false, 
                hitnum:1, scaling:{10:{atk:1.08}, 13:{atk:1.275}}},
    e2_stellar : {ID:"e2_stellar", characterID : "Vesna",  name : "翔风剑2灵剑",
                  element:"anemo", gauge:0, EACount:0, rxndmg:"directStellarSwirl", talent:"E",
                  attackType:"skill", isOnfield:true, isSnapshot:false, 
                  hitnum:1, scaling:{10:{atk:2.016}, 13:{atk:2.38}}},
    e3_stellar_1 : {ID:"e3_stellar_1", characterID : "Vesna",  name : "翔风剑3灵剑",
                    element:"anemo", gauge:0, EACount:0, rxndmg:"directStellarSwirl", talent:"E",
                    attackType:"skill", isOnfield:true, isSnapshot:false, 
                    hitnum:4, scaling:{10:{atk:3.224}, 13:{atk:3.808}}},
    e3_stellar_2 : {ID:"e3_stellar_2", characterID : "Vesna",  name : "翔风剑3灵剑终段",
                    element:"anemo", gauge:0, EACount:0, rxndmg:"directStellarSwirl", talent:"E",
                    attackType:"skill", isOnfield:true, isSnapshot:false, 
                    hitnum:1, scaling:{10:{atk:2.822}, 13:{atk:3.332}}},
    e_windPinion : {ID:"e_windPinion", characterID : "Vesna",  name : "风翎",
                    element:"anemo", gauge:1, EACount:0, rxndmg:"none", talent:"E",
                    attackType:"skill", isOnfield:true, isSnapshot:false, 
                    hitnum:1, scaling:{10:{atk:0.187}, 13:{atk:0.221}}},
    q : {ID:"q", characterID : "Vesna",  name : "元素爆发",
          element:"anemo", gauge:0, EACount:0, rxndmg:"directStellarSwirl", talent:"Q",
          attackType:"burst", isOnfield:true, isSnapshot:false, 
          hitnum:1, scaling:{10:{atk:4.738}, 13:{atk:5.593}}},
    step_anemo : {ID:"step_anemo", characterID : "Vesna",  name : "变移：风伤",
                  element:"anemo", gauge:1, EACount:1, rxndmg:"none", talent:"other",
                  attackType:"skill", isOnfield:true, isSnapshot:false, 
                  hitnum:1, scaling:{1:{atk:1.5}}, constellation:6}, // 变移:风伤
    step_stellar : {ID:"step_stellar", characterID : "Vesna",  name : "变移：星扩散",
                    element:"anemo", gauge:0, EACount:0, rxndmg:"directStellarSwirl", talent:"other",
                    attackType:"skill", isOnfield:true, isSnapshot:false, 
                    hitnum:1, scaling:{1:{atk:2.0}}, constellation:6}, // 变移:星扩散
  },
  effects : [ // {效果ID、效果条件、效果内容、是否为净效果、是否常驻、效果描述}
              // "是否常驻"为true时，表示这个效果在伤害计算流程开始前就一直生效（如命座3和5的技能等级提升），应该加在初始面板上，这类效果的两个输入都可以为空
              // 效果条件可填的内容有 受益角色、排除角色、受益元素、排除元素、是否前台、反应伤害类型、排除反应伤害类型、技能伤害类型、排除技能伤害类型、技能ID、check函数、其他字段
              // characterIDs, excludedCharacterIDs, elements, excludedElements, isOnfield, rxndmgs, excludedRxndmgs, attackTypes, excludedAttackTypes, talentMetaIDs、check，当为其他字段时，只有attributes中的元素与之匹配才能激活
              // check函数用来处理需要根据参数计算来判定是否生效的函数，是一个输入参数为(团队初始面板, 目标角色ID)的函数对象，当其他条件都匹配，且check存在时，函数返回true则表示通过，false表示不通过
    {ID:"Vesna_Passive1_1", condition:{characterIDs:["Vesna"], isOnfield:true, talentMetaIDs:["q", "e1", "e2_stellar", "e3_stellar_1"],},
      effect:passive_talent_1_1_of_Vesna, isNet:false, isPermanent:false,
      desc:"薇斯纳固有天赋1：通过特定攻击（E和Q）会叠1层\"整肃\"，最多6层"},
    {ID:"Vesna_Passive1_2", condition:{characterIDs:["Vesna"], isOnfield:true, talentMetaIDs:["e2_stellar", "e3_stellar_1", "e3_stellar_2", "q", "step_stellar"],},
      effect:passive_talent_1_2_of_Vesna, isNet:true, isPermanent:false,
      desc:"薇斯纳固有天赋1：灵剑的星扩散直伤变为原来的(1+0.1*整肃层数)的伤害"},
    {ID:"Vesna_Passive2", condition:{characterIDs:["Vesna"], }, effect:passive_talent_2_of_Vesna, isNet : true, isPermanent:false,
      desc:"薇斯纳固有天赋2：队伍中每有一个冰/风元素角色，攻击力上升6%; 每有一个不是上述两个属性的角色，精通上升25"},
    {ID:"Vesna_Passive3", condition:{}, effect:passive_talent_3_of_Vesna, isNet : false, isPermanent:false,
      desc:"薇斯纳固有天赋3：薇斯纳每100点攻击力都将提升全队0.7%星扩散反应的基础伤害，至多通过这种方式提升14%伤害"},
    ],
  constellationEffects : {
    0 : [], // 占位
    1 : [{ID:"Vesna_Constellation1", condition:{characterIDs:["Vesna"], }, effect:constellation_1_of_Vesna,
          isNet : true, isPermanent:true, desc:"薇斯纳命座1：薇斯纳的星扩散伤害增加20%"}],
    2 : [{ID:"Vesna_Constellation2_1", condition:{characterIDs:["Vesna"],}, effect:constellation_2_1_of_Vesna,
          isNet : true, isPermanent:true, desc:"薇斯纳命座2：薇斯纳的初始整肃层数为6"},
          {ID:"Vesna_Constellation2_2", condition:{characterIDs:["Vesna"], isOnfield:true}, effect:constellation_2_2_of_Vesna,
          isNet : true, isPermanent:false, desc:"薇斯纳命座2：薇斯纳的攻击力提升40%"},
        ],
    3 : [{ID:"Vesna_Constellation3", condition:{characterIDs:["Vesna"], }, effect:constellation_3_of_Vesna,
          isNet : true, isPermanent:true, desc:"薇斯纳命座3：薇斯纳的元素战技等级+3"}],
    4 : [{ID:"Vesna_Constellation4", condition:{characterIDs:["Vesna"], }, effect:constellation_4_of_Vesna,
          isNet : true, isPermanent:false, desc:"薇斯纳命座4：固有天赋2的效果变为原来的3倍"}],
    5 : [{ID:"Vesna_Constellation5", condition:{characterIDs:["Vesna"], }, effect:constellation_5_of_Vesna,
          isNet : true, isPermanent:true, desc:"薇斯纳命座5：薇斯纳的元素爆发等级+3"}],
    6 : [{ID:"Vesna_Constellation6", condition:{characterIDs:["Vesna"], }, effect:constellation_6_of_Vesna,
          isNet : true, isPermanent:true, desc:"薇斯纳命座6：薇斯纳的星扩散伤害擢升20%"}],
  },
  /*... 其他需要定义的变量 ...*/
  parameters : {initPoiseStacks : 0, },  // 固有天赋、技能效果、命座效果可能用到的其他参数
  teamParameters : {}, // 自己的效果给队友生效时，队友需要具有的字段
  variables : {addedPoiseStacks : 0, },  // 在后续buff计算中需要用到的全局参数，定义在这里
  /*... 方法 ...*/
  reset_variables(attributes){Object.keys(this.variables).forEach(key => {attributes[key]=this.variables[key]})},


};
// 效果函数, 输入为(初始面板，净面板(计算全buff)/初始面板(计算净面板)/{}(计算永久buff), action(行为，可以为空对象), activated(bool值，是否无条件生效))
function passive_talent_1_1_of_Vesna(teamInitialAttributes, teamNetAttributes, action, activated = false){
  // 效果：通过特定攻击（E和Q）会叠1层"整肃"，最多6层
  if(activated){return {}}   // ← 新增：展示"最大面板"时不叠层
  const attr = teamInitialAttributes["Vesna"];
  attr.addedPoiseStacks = Math.min(6-attr.initPoiseStacks, attr.addedPoiseStacks+1);
  return {}; // 这个效果只改变量，不生成增益
};
function passive_talent_1_2_of_Vesna(teamInitialAttributes, teamNetAttributes, action, activated = false){
  if(activated){return {baseDMGMult:0.6}};
  let addedPoiseStacks = teamInitialAttributes["Vesna"].addedPoiseStacks;
  let initPoiseStacks = teamInitialAttributes["Vesna"].initPoiseStacks;
  let currPoiseStacks = addedPoiseStacks + initPoiseStacks;
  return {baseDMGMult:currPoiseStacks*0.1};
}

function passive_talent_2_of_Vesna(teamInitialAttributes, teamNetAttributes, action, activated = false){
  //效果：队伍中每有一个冰/风元素角色，攻击力上升6%; 每有一个不是上述两个属性的角色，精通上升25
  let atkp = 0, em = 0;
  let values = Object.values(teamNetAttributes)
  for(let i=0; i<values.length; i++){
    const attributes = values[i]
    if (attributes.element === "anemo" || attributes.element === "cryo"){ atkp += 0.06; }
    else{ em += 25; };
  };
  return {atkp:atkp, em:em};
};
function passive_talent_3_of_Vesna(teamInitialAttributes, teamNetAttributes, action, activated = false){
  // 效果：基于薇斯纳的攻击力，提升队伍中角色造成的星扩散反应的基础伤害；
  // 每100点攻击力都将提升0.7%星扩散反应的基础伤害，至多通过这种方式提升14%伤害。
  let atk = teamNetAttributes["Vesna"].stats.atk;
  return {stellarSwirlBaseDMG:Math.max(0, Math.min(atk/100*0.007, 0.14))};
};
function constellation_1_of_Vesna(teamInitialAttributes, teamNetAttributes, action, activated = false){return {stellarSwirlDMG : 0.20};};
function constellation_2_1_of_Vesna(teamInitialAttributes, teamNetAttributes, action, activated = false){return {initPoiseStacks : 6};};
function constellation_2_2_of_Vesna(teamInitialAttributes, teamNetAttributes, action, activated = false){ return {atkp : 0.40}; };
function constellation_3_of_Vesna(teamInitialAttributes, teamNetAttributes, action, activated = false){ return {E : 3}; };
function constellation_4_of_Vesna(teamInitialAttributes, teamNetAttributes, action, activated = false){
  //效果：固有天赋2的效果变为原来的三倍
  let atkp = 0, em = 0;
  let values = Object.values(teamNetAttributes)
  for(let i=0; i<values.length; i++){
    const attributes = values[i]
    if (attributes.element === "anemo" || attributes.element === "cryo"){ atkp += 0.12; }
    else{ em += 50; };
  };
  return {atkp:atkp, em:em};
};
function constellation_5_of_Vesna(teamInitialAttributes, teamNetAttributes, action, activated = false){ return {Q : 3}; };
function constellation_6_of_Vesna(teamInitialAttributes, teamNetAttributes, action, activated = false){ return {stellarSwirlElevation : 0.20}; };

// #endregion

// #region 奥黛塔角色数据
export const Odette = {
  name : "奥黛塔",  // 角色名称
  rarity: 5,
  ID : "Odette",  // 角色ID
  element : "cryo",  // 角色属性
  level : 90,  // 角色等级
  stat: "cd", // 角色突破属性词条
  statValue : 0.384, // 角色突破属性数值
  statLabel : "暴击伤害", // 角色突破属性标签
  weapon : null, // 装备武器，为具体的武器对象，初始为空
  candidateWeapons : {}, // 候选武器，可选择的武器在里面
  artifactSet : [],  // 装备的圣遗物套装，[[具体套装，圣遗物件数]]，初始为默认值
  candidateArtifactSets : {}, // 候选的圣遗物组合
  artifacts: { // 圣遗物词条详情(这里是默认值)
    flower : {
      mainStat : "hpf", // 主词条
      subStats : {"cr":2, "cd":4, "atkp":1, "defp":0, "hpp":0, "em":1, "er":0, "atkf":0, "deff":0, "hpf":0}, // 副词条条数
    },
    plume : {
      mainStat : "atkf", // 主词条
      subStats : {"cr":3, "cd":3, "atkp":1, "defp":0, "hpp":0, "em":1, "er":0, "atkf":0, "deff":0, "hpf":0}, // 副词条条数
    },
    sands : {
      mainStat : "atkp", // 主词条
      subStats : {"cr":2, "cd":4, "atkp":0, "defp":0, "hpp":0, "em":1, "er":1, "atkf":0, "deff":0, "hpf":0}, // 副词条条数
    },
    goblet : {
      mainStat : "atkp", // 主词条
      subStats : {"cr":3, "cd":3, "atkp":0, "defp":0, "hpp":0, "em":1, "er":1, "atkf":0, "deff":0, "hpf":0}, // 副词条条数
    },
    circlet : {
      mainStat : "cr", // 主词条
      subStats : {"cr":0, "cd":3, "atkp":2, "defp":0, "hpp":0, "em":1, "er":2, "atkf":0, "deff":0, "hpf":0}, // 副词条条数
    },
  },
  constellation : 0, // 命座数，默认为0
  displayedStats : ["cr", "cd", "atk", "em", "def", "hp", "er", "stellarSwirlDMG", "cryoDeRes", "stellarSwirlElevation"], // 需要展示的词条
  effectiveSubStats : {"atkp":1, "cr":1, "cd":1, "em":1, "atkf":0.33},//推荐的副词条和他的权重
  get effectiveSubStatCount(){ // 有效词条个数
    let count = 0;
    for(let slot of Object.keys(this.artifacts)){
      const substats = this.artifacts[slot].subStats;
      for(let stat of Object.keys(substats)){
        count += (this.effectiveSubStats[stat] || 0) * substats[stat];
      }
    }
    return count;
  },
  base : {  // 角色等级对应的基础属性值，等级分为90，95，100
    90 : {atk: 335, def:787, hp:12981,},
    95 : {atk: 373, def:815, hp:13441,},
    100 : {atk: 410, def:843, hp:13903,},
  },
  talentLevels : {A : 10, E : 10, Q : 10, other : 1},  // 技能等级，A、E、Q表示普攻、战技、爆发，other为其他（如命座附加的伤害）
  talentMetas : {
    /* 技能单元，包括ID、所属角色(char)、中文名称(name)、元素(element)、元素附着量(gauge)、元素附着次数(EACount)、反应伤害类型(rxndmg)、
        技能所属的talent(talent)、技能伤害类型(type)、技能倍率(scaling)、是否在前台释放(isOnfield)、
        是否为快照(isSnapshot)、技能单元对应的攻击段数(hitnum)、技能倍率(scaling)、命座要求(constellation)；
        其中 constellation 可以不存在，表示要求的命座为0
    */
    swap : {ID : "swap", characterID : "Odette", name : "切换角色",
            element:null, gauge:0, EACount:0, rxndmg:"none", talent:"other",
            attackType:"swap", isOnfield:true, isSnapshot:false, 
            hitnum:0, scaling:null},  // 切换角色
    e0 : {ID : "e0", characterID : "Odette", name : "开启战技",
          element:"cryo", gauge:1, EACount:1, rxndmg:"none", talent:"E",
          attackType:"skill", isOnfield:true, isSnapshot:false, 
          hitnum:1, scaling:{10:{atk:1.945}, 13:{atk:2.297}}},
    e1_cryo : {ID : "e1_cryo", characterID : "Odette", name : "破晓终奏持续伤害",
                element:"cryo", gauge:1, EACount:1, rxndmg:"none", talent:"E",
                attackType:"skill", isOnfield:true, isSnapshot:false, 
                hitnum:3, scaling:{10:{atk:1.725}, 13:{atk:2.037}}}, 
    e2_swirl: {ID : "e2_swirl", characterID : "Odette", name : "破晓终奏星扩散",
                element:"cryo", gauge:0, EACount:0, rxndmg:"directStellarSwirl", talent:"E",
                attackType:"skill", isOnfield:true, isSnapshot:false, 
                hitnum:1, scaling:{10:{atk:8.256}, 13:{atk:9.746}}}, 
    e2_conduct: {ID : "e2_conduct", characterID : "Odette", name : "破晓终奏星超导",
                  element:"cryo", gauge:0, EACount:0, rxndmg:"directStellarConduct", talent:"E",
                  attackType:"skill", isOnfield:true, isSnapshot:false, 
                  hitnum:1, scaling:{10:{atk:5.504}, 13:{atk:6.497}}}, 
    e_off1_cryo:{ID : "e_off1_cryo", characterID : "Odette", name : "拂羽舞步",
                  element:"cryo", gauge:1, EACount:1, rxndmg:"none", talent:"E",
                  attackType:"skill", isOnfield:false, isSnapshot:false, 
                  hitnum:1, scaling:{10:{atk:0.775}, 13:{atk:0.915}}}, 
    e_off1_swirl:{ID : "e_off1_swirl", characterID : "Odette", name : "拂羽舞步星扩散",
                  element:"cryo", gauge:0, EACount:0, rxndmg:"directStellarSwirl", talent:"E",
                  attackType:"skill", isOnfield:false, isSnapshot:false, 
                  hitnum:1, scaling:{10:{atk:0.73}, 13:{atk:0.861}}},
    e_off1_conduct:{ID : "e_off1_conduct", characterID : "Odette", name : "拂羽舞步星超导",
                    element:"cryo", gauge:0, EACount:0, rxndmg:"directStellarConduct", talent:"E",
                    attackType:"skill", isOnfield:false, isSnapshot:false, 
                    hitnum:1, scaling:{10:{atk:0.486}, 13:{atk:0.574}}},
    e_off2_cryo:{ID : "e_off2_cryo", characterID : "Odette", name : "旋翼舞步",
                  element:"cryo", gauge:1, EACount:1, rxndmg:"none", talent:"E",
                  attackType:"skill", isOnfield:false, isSnapshot:false, 
                  hitnum:1, scaling:{10:{atk:0.926}, 13:{atk:1.094}}}, 
    e_off2_swirl:{ID : "e_off2_swirl", characterID : "Odette", name : "旋翼舞步星扩散",
                  element:"cryo", gauge:0, EACount:0, rxndmg:"directStellarSwirl", talent:"E",
                  attackType:"skill", isOnfield:false, isSnapshot:false, 
                  hitnum:1, scaling:{10:{atk:0.872}, 13:{atk:1.03}}},
    e_off2_conduct:{ID : "e_off2_conduct", characterID : "Odette", name : "旋翼舞步星超导",
                    element:"cryo", gauge:0, EACount:0, rxndmg:"directStellarConduct", talent:"E",
                    attackType:"skill", isOnfield:false, isSnapshot:false, 
                    hitnum:1, scaling:{10:{atk:0.582}, 13:{atk:0.687}}},
    q1 : {ID : "q1", characterID : "Odette", name : "元素爆发斩击",
          element:"cryo", gauge:1, EACount:1, rxndmg:"none", talent:"Q",
          attackType:"burst", isOnfield:true, isSnapshot:false, 
          hitnum:3, scaling:{10:{atk:5.949}, 13:{atk:7.023}}},
    q2 : {ID : "q2", characterID : "Odette", name : "元素爆发终段",
          element:"cryo", gauge:1, EACount:1, rxndmg:"none", talent:"Q",
          attackType:"burst", isOnfield:true, isSnapshot:false, 
          hitnum:3, scaling:{10:{atk:3.065}, 13:{atk:3.618}}},
    e2_special_swirl: {ID : "e2_special_swirl", characterID : "Odette", name : "1命额外星扩散",
                        element:"cryo", gauge:0, EACount:0, rxndmg:"directStellarSwirl", talent:"other",
                        attackType:"skill", isOnfield:true, isSnapshot:false, 
                        hitnum:1, scaling:{1:{atk:4.50}}, constellation:1}, 
    e2_special_conduct: {ID : "e2_special_conduct", characterID : "Odette", name : "1命额外星超导",
                          element:"cryo", gauge:0, EACount:0, rxndmg:"directStellarConduct", talent:"other",
                          attackType:"skill", isOnfield:true, isSnapshot:false, 
                          hitnum:1, scaling:{1:{atk:3}}, constellation:1}, 
    e_off_special_swirl: {ID : "e_off_special_swirl", characterID : "Odette", name : "4命额外星扩散",
                          element:"cryo", gauge:0, EACount:0, rxndmg:"directStellarSwirl", talent:"other",
                          attackType:"skill", isOnfield:true, isSnapshot:false, 
                          hitnum:1, scaling:{1:{atk:0.99}}, constellation:4}, 
    e_off_special_conduct: {ID : "e_off_special_conduct", characterID : "Odette", name : "4命额外星超导",
                            element:"cryo", gauge:0, EACount:0, rxndmg:"directStellarConduct", talent:"other",
                            attackType:"skill", isOnfield:true, isSnapshot:false, 
                            hitnum:1, scaling:{1:{atk:0.66}}, constellation:4}, 
  },
  effects : [ // {效果ID、效果条件、效果内容、是否为净效果、是否常驻、效果描述}
              // "是否常驻"为true时，表示这个效果在伤害计算流程开始前就一直生效（如命座3和5的技能等级提升），应该加在初始面板上，这类效果的两个输入都可以为空
              // 效果条件可填的内容有 受益角色、排除角色、受益元素、排除元素、是否前台、反应伤害类型、排除反应伤害类型、技能伤害类型、排除技能伤害类型、技能ID、check函数、其他字段
              // characterIDs, excludedCharacterIDs, elements, excludedElements, isOnfield, rxndmgs, excludedRxndmgs, attackTypes, excludedAttackTypes, talentMetaIDs、check，当为其他字段时，只有attributes中的元素与之匹配才能激活
              // check函数用来处理需要根据参数计算来判定是否生效的函数，是一个输入参数为(团队初始面板, 目标角色ID)的函数对象，当其他条件都匹配，且check存在时，函数返回true则表示通过，false表示不通过
    {ID:"Odette_Passive1_1", condition:{excludedCharacterIDs:["Odette"],},
      effect:passive_talent_1_1_of_Odette, isNet:true, isPermanent:false,
      desc:"奥黛塔固有天赋1：提供4层华彩，给除自己之外的角色提供60%的星烁反应伤害加成"},
    {ID:"Odette_Passive1_2", condition:{characterIDs:["Odette"], isOnfield:true},
      effect:passive_talent_1_2_of_Odette, isNet:true, isPermanent:false,
      desc:"奥黛塔固有天赋1：提供4层华彩，当奥黛塔站场时，给自己提供60%的星烁反应伤害加成(简化版本)"},
    {ID:"Odette_Passive2", condition:{characterIDs:["Odette"], rxndmgs:["directStellarConduct", "directStellarSwirl"]},
      effect:passive_talent_2_of_Odette, isNet:false, isPermanent:false,
      desc:"奥黛塔固有天赋2：攻击力超过1000的部分，每100点都使奥黛塔星烁反应伤害额外造成原来的1.5%，至多30%"},
    {ID:"Odette_Passive3", condition:{},
      effect:passive_talent_3_of_Odette, isNet:false, isPermanent:false,
      desc:"奥黛塔固有天赋3：在星烁反应状态时，奥黛塔每100点攻击力都将提升全队0.7%对应星烁反应的基础伤害，至多通过这种方式提升14%伤害"},
    {ID:"Odette_QEffect", condition:{characterIDs:["Odette"], toCastOdetteQ:true},
      effect:Q_effect_of_Odette, isNet:true, isPermanent:false,
      get desc(){return `奥黛塔Q效果：给自身${Odette.talentLevels.Q === 10 ? 50:62}%星烁反应伤害加成`}},
    ],
  constellationEffects : {
    0 : [], // 占位
    1 : [{ID:"Odette_Constellation1", condition:{}, effect:constellation_1_of_Odette,
          isNet : true, isPermanent:false, desc:"奥黛塔命座1：额外提供2层华彩"}],
    2 : [{ID:"Odette_Constellation2", condition:{}, effect:constellation_2_of_Odette,
          isNet : true, isPermanent:false, desc:"奥黛塔命座2：每层华彩还会使角色的攻击力提升7%；在星烁反应状态时，敌人的对应抗性降低20%"},
        ],
    3 : [{ID:"Odette_Constellation3", condition:{characterIDs:["Odette"], }, effect:constellation_3_of_Odette,
          isNet : true, isPermanent:true, desc:"奥黛塔命座3：奥黛塔的元素战技等级+3"}],
    4 : [{ID:"Odette_Constellation4", condition:{excludedCharacterIDs:["Odette"], toCastOdetteQ:true}, effect:constellation_4_of_Odette,
          isNet : true, isPermanent:false, desc:"奥黛塔命座4：队友能吃到奥黛塔Q的效果的50%"}],
    5 : [{ID:"Odette_Constellation5", condition:{characterIDs:["Odette"], }, effect:constellation_5_of_Odette,
          isNet : true, isPermanent:true, desc:"奥黛塔命座5：奥黛塔的元素爆发等级+3"}],
    6 : [{ID:"Odette_Constellation6_1", condition:{characterIDs:["Odette"], isOnfield:false}, effect:constellation_6_1_of_Odette,
          isNet : true, isPermanent:false, desc:"奥黛塔命座6：奥黛塔自身的华彩不会减少(在后台也能吃到增益)"},
          {ID:"Odette_Constellation6_2", condition:{characterIDs:["Odette"], }, effect:constellation_6_2_of_Odette,
          isNet : true, isPermanent:false, desc:"奥黛塔命座6：奥黛塔自己星烁反应伤害擢升45%"},
          {ID:"Odette_Constellation6_3", condition:{excludedCharacterIDs:["Odette"], }, effect:constellation_6_3_of_Odette,
          isNet : true, isPermanent:false, desc:"奥黛塔命座6：队友的星烁反应伤害擢升25%"},
        ],
  },
  /*... 其他需要定义的变量 ...*/
  parameters : {isStellarSwirl:true, isStellarConduct:false, maxBrilliance:4,
                QBonus:0.5, brillianceAtkp:0,
                },  // 固有天赋、技能效果、命座效果可能用到的其他参数
  teamParameters : {toCastOdetteQ:false, }, // 自己的效果给队友生效时，队友需要具有的字段
  variables : {},  // 在后续buff计算中需要用到的全局参数，定义在这里
  /*... 方法 ...*/
  reset_variables(attributes){Object.keys(this.variables).forEach(key => {attributes[key]=this.variables[key]})},
};
// 效果函数
function passive_talent_1_1_of_Odette(teamInitialAttributes, teamNetAttributes, action, activated = false){
  let maxBrilliance = teamNetAttributes["Odette"].maxBrilliance;
  let brillianceAtkp = teamNetAttributes["Odette"].brillianceAtkp;
  return {stellarConductDMG:0.15*maxBrilliance, stellarSwirlDMG:0.15*maxBrilliance, atkp:brillianceAtkp*maxBrilliance};
};
function passive_talent_1_2_of_Odette(teamInitialAttributes, teamNetAttributes, action, activated = false){
  let maxBrilliance = teamNetAttributes["Odette"].maxBrilliance;
  let brillianceAtkp = teamNetAttributes["Odette"].brillianceAtkp;
  return {stellarConductDMG:0.15*maxBrilliance, stellarSwirlDMG:0.15*maxBrilliance, atkp:brillianceAtkp*maxBrilliance};
};
function passive_talent_2_of_Odette(teamInitialAttributes, teamNetAttributes, action, activated = false){
  const atk = teamNetAttributes["Odette"].stats.atk;
  return {baseDMGMult:Math.max(0, Math.min(0.3, (atk-1000)/100*0.015))}
};
function passive_talent_3_of_Odette(teamInitialAttributes, teamNetAttributes, action, activated = false){
  const attributes = teamNetAttributes["Odette"], atk = attributes.stats.atk;
  let result = {}, value = Math.min(0.14, atk/100*0.007);
  if(attributes.isStellarConduct){result.stellarConductBaseDMG = value};
  if(attributes.isStellarSwirl){result.stellarSwirlBaseDMG = value};
  return result;
};
function Q_effect_of_Odette(teamInitialAttributes, teamNetAttributes, action, activated = false){
  const QBonus = teamNetAttributes["Odette"].QBonus;
  return {stellarConductDMG:QBonus, stellarSwirlDMG:QBonus}
};
// 命座效果
function constellation_1_of_Odette(teamInitialAttributes, teamNetAttributes, action, activated = false){return {maxBrilliance:6}};
function constellation_2_of_Odette(teamInitialAttributes, teamNetAttributes, action, activated = false){
  const attr = teamInitialAttributes["Odette"];
  let result = {brillianceAtkp: 0.07};
  if(attr.isStellarConduct){result.cryoDeRes = 0.2; result.electroDeRes=0.2;}
  if(attr.isStellarSwirl){result.cryoDeRes = 0.2; result.anemoDeRes=0.2;}
  return result;
}
function constellation_3_of_Odette(teamInitialAttributes, teamNetAttributes, action, activated = false){return {"E":3}};
function constellation_4_of_Odette(teamInitialAttributes, teamNetAttributes, action, activated = false){
  const QBonus = teamNetAttributes["Odette"].QBonus;
  return {stellarConductDMG:QBonus*0.5, stellarSwirlDMG:QBonus*0.5}
};
function constellation_5_of_Odette(teamInitialAttributes, teamNetAttributes, action, activated = false){return {"Q":3, "QBonus":0.62}};
function constellation_6_1_of_Odette(teamInitialAttributes, teamNetAttributes, action, activated = false){
  let maxBrilliance = teamNetAttributes["Odette"].maxBrilliance;
  return {stellarConductDMG:0.15*maxBrilliance, stellarSwirlDMG:0.15*maxBrilliance, atkp:0.07*maxBrilliance};
};
function constellation_6_2_of_Odette(teamInitialAttributes, teamNetAttributes, action, activated = false){return {stellarConductElevation:0.45, stellarSwirlElevation:0.45}};
function constellation_6_3_of_Odette(teamInitialAttributes, teamNetAttributes, action, activated = false){return {stellarConductElevation:0.25, stellarSwirlElevation:0.25}};



// #endregion


// #region 沃雅妮莎角色数据
export const Vodyanitsa = {
  name : "沃雅妮莎",  // 角色名称
  rarity: 5,
  ID : "Vodyanitsa",  // 角色ID
  element : "hydro",  // 角色属性
  level : 90,  // 角色等级
  stat: "hpp", // 角色突破属性词条
  statValue : 0.288, // 角色突破属性数值
  statLabel : "生命值%", // 角色突破属性标签
  weapon : null, // 装备武器，为具体的武器对象，初始为空
  candidateWeapons : {}, // 候选武器，可选择的武器在里面
  artifactSet : [],  // 装备的圣遗物套装，[[具体套装，圣遗物件数]]，初始为默认值
  candidateArtifactSets : {}, // 候选的圣遗物组合
  artifacts: { // 圣遗物词条详情(这里是默认值)
    flower : {
      mainStat : "hpf", // 主词条
      subStats : {"cr":2, "cd":1, "atkp":0, "defp":0, "hpp":4, "em":1, "er":0, "atkf":0, "deff":0, "hpf":0}, // 副词条条数
    },
    plume : {
      mainStat : "atkf", // 主词条
      subStats : {"cr":2, "cd":1, "atkp":0, "defp":0, "hpp":4, "em":0, "er":0, "atkf":0, "deff":0, "hpf":1}, // 副词条条数
    },
    sands : {
      mainStat : "hpp", // 主词条
      subStats : {"cr":2, "cd":1, "atkp":0, "defp":0, "hpp":0, "em":1, "er":0, "atkf":0, "deff":0, "hpf":4}, // 副词条条数
    },
    goblet : {
      mainStat : "hpp", // 主词条
      subStats : {"cr":2, "cd":1, "atkp":0, "defp":0, "hpp":0, "em":1, "er":0, "atkf":0, "deff":0, "hpf":4}, // 副词条条数
    },
    circlet : {
      mainStat : "hpp", // 主词条
      subStats : {"cr":2, "cd":1, "atkp":0, "defp":0, "hpp":0, "em":1, "er":0, "atkf":0, "deff":0, "hpf":4}, // 副词条条数
    },
  },
  constellation : 0, // 命座数，默认为0
  displayedStats : ["cr", "cd", "atk", "em", "def", "hp", "er", "anemoDeRes", "cryoDeRes", "stellarSwirlElevation"], // 需要展示的词条
  effectiveSubStats : {"hpp":1, "hpf":0.33, },//推荐的副词条和他的权重
  get effectiveSubStatCount(){ // 有效词条个数
    let count = 0;
    for(let slot of Object.keys(this.artifacts)){
      const substats = this.artifacts[slot].subStats;
      for(let stat of Object.keys(substats)){
        count += (this.effectiveSubStats[stat] || 0) * substats[stat];
      }
    }
    return count;
  },
  base : {  // 角色等级对应的基础属性值，等级分为90，95，100
    90 : {atk: 108, def:484, hp:14818,},
    95 : {atk: 120, def:501, hp:15344,},
    100 : {atk: 132, def:519, hp:15871,},
  },
  talentLevels : {A : 10, E : 10, Q : 10, other : 1},  // 技能等级，A、E、Q表示普攻、战技、爆发，other为其他（如命座附加的伤害）
  talentMetas : {
    /* 技能单元，包括ID、所属角色(char)、中文名称(name)、元素(element)、元素附着量(gauge)、元素附着次数(EACount)、反应伤害类型(rxndmg)、
        技能所属的talent(talent)、技能伤害类型(type)、技能倍率(scaling)、是否在前台释放(isOnfield)、
        是否为快照(isSnapshot)、技能单元对应的攻击段数(hitnum)、技能倍率(scaling)、命座要求(constellation)；
        其中 constellation 可以不存在，表示要求的命座为0
    */
    swap : {ID : "swap", characterID : "Vodyanitsa", name : "切换角色",
            element:null, gauge:0, EACount:0, rxndmg:"none", talent:"other",
            attackType:"swap", isOnfield:true, isSnapshot:false, 
            hitnum:0, scaling:null},  // 切换角色
    e0 : {ID : "e0", characterID : "Vodyanitsa", name : "开启战技",
          element:"hydro", gauge:1, EACount:1, rxndmg:"none", talent:"E",
          attackType:"skill", isOnfield:true, isSnapshot:false, 
          hitnum:1, scaling:{10:{hp:0.0589}, 13:{hp:0.0695}}},
    e_off : {ID : "e_off", characterID : "Vodyanitsa", name : "唤春角笛后台",
              element:"hydro", gauge:1, EACount:1, rxndmg:"none", talent:"E",
              attackType:"skill", isOnfield:false, isSnapshot:false, 
              hitnum:1, scaling:{10:{hp:0.0589}, 13:{hp:0.0695}}},
  },
  effects : [ // {效果ID、效果条件、效果内容、是否为净效果、是否常驻、效果描述}
              // "是否常驻"为true时，表示这个效果在伤害计算流程开始前就一直生效（如命座3和5的技能等级提升），应该加在初始面板上，这类效果的两个输入都可以为空
              // 效果条件可填的内容有 受益角色、排除角色、受益元素、排除元素、是否前台、反应伤害类型、排除反应伤害类型、技能伤害类型、排除技能伤害类型、技能ID、check函数、其他字段
              // characterIDs, excludedCharacterIDs, elements, excludedElements, isOnfield, rxndmgs, excludedRxndmgs, attackTypes, excludedAttackTypes, talentMetaIDs、check，当为其他字段时，只有attributes中的元素与之匹配才能激活
              // check函数用来处理需要根据参数计算来判定是否生效的函数，是一个输入参数为(团队初始面板, 目标角色ID)的函数对象，当其他条件都匹配，且check存在时，函数返回true则表示通过，false表示不通过
    {ID:"Vodyanitsa_Passive1", condition:{},
      effect:passive_talent_1_of_Vodyanitsa, isNet:true, isPermanent:false,
      desc:"沃雅妮莎固有天赋1：星扩散状态下，减风抗35%"},
    {ID:"Vodyanitsa_Passive2_1", condition:{isOnfield:true, isStellarSwirl:true, rxndmgs:["directStellarSwirl", "reactionStellarSwirl"], check:check_solo_of_Vodyanitsa},
      effect:passive_talent_2_1_of_Vodyanitsa, isNet:false, isPermanent:false,
      desc:"沃雅妮莎固有天赋2领唱：提供25层领唱，对于前台角色，基于生命值上限超过40000的部分，每1000点能使星扩散状态下的星扩散反应伤害提升260点(上限6500)"},
    {ID:"Vodyanitsa_Passive2_2", condition:{isOnfield:true, isStellarSwirl:false, elements:["hydro", "cryo"], check:check_solo_of_Vodyanitsa},
      effect:passive_talent_2_2_of_Vodyanitsa, isNet:false, isPermanent:false,
      desc:"沃雅妮莎固有天赋2领唱：提供25层领唱，对于前台角色，基于生命值上限超过40000的部分，每1000点能使非星扩散状态下的水、冰元素伤害提升140点(上限3500)"},
    {ID:"Vodyanitsa_Passive2_3", condition:{isOnfield:false, isStellarSwirl:true, rxndmgs:["directStellarSwirl", "reactionStellarSwirl"], check:check_ensemble_of_Vodyanitsa},
      effect:passive_talent_2_3_of_Vodyanitsa, isNet:false, isPermanent:false,
      desc:"沃雅妮莎固有天赋2重唱：提供10层重唱，对于后台角色，基于生命值上限超过40000的部分，每1000点能使星扩散状态下的星扩散反应伤害提升260点(上限6500)"},
    {ID:"Vodyanitsa_Passive2_4", condition:{isOnfield:false, isStellarSwirl:false, elements:["hydro", "cryo"], check:check_ensemble_of_Vodyanitsa},
      effect:passive_talent_2_4_of_Vodyanitsa, isNet:false, isPermanent:false,
      desc:"沃雅妮莎固有天赋2重唱：提供10层重唱，对于后台角色，基于生命值上限超过40000的部分，每1000点能使非星扩散状态下的水、冰元素伤害提升140点(上限3500)"},
    {ID:"Vodyanitsa_EEffect", condition:{},
      effect:E_effect_of_Vodyanitsa, isNet:true, isPermanent:false,
      get desc(){return `沃雅妮莎E效果：给敌人30%(10级E)或35.4%(13级E)的水、冰元素抗性降低`}},
    ],
  constellationEffects : {
    0 : [], // 占位
    1 : [{ID:"Vodyanitsa_Constellation1", condition:{}, effect:constellation_1_of_Vodyanitsa,
          isNet : true, isPermanent:false, desc:"沃雅妮莎命座1：全队获得沃雅妮莎自身生命值上限0.8%的固定攻击力加成"}],
    2 : [{ID:"Vodyanitsa_Constellation2_1", condition:{isOnfield:true, rxndmgs:["directStellarSwirl", "reactionStellarSwirl"], isStellarSwirl:true, VodyanitsaC2Onfield:true}, 
          effect:constellation_2_1_of_Vodyanitsa, isNet : true, isPermanent:false, 
          desc:"沃雅妮莎命座2：处于星扩散状态时，当前场上角色的星扩散反应伤害的暴击伤害提升60%"},
          {ID:"Vodyanitsa_Constellation2_2", condition:{isOnfield:true, elements:["hydro", "cryo"], isStellarSwirl:false, VodyanitsaC2Onfield:true}, 
          effect:constellation_2_2_of_Vodyanitsa, isNet : true, isPermanent:false, 
          desc:"沃雅妮莎命座2：不处于星扩散状态时，当前场上角色的水、冰元素伤害的暴击伤害提升50%"},
        ],
    3 : [{ID:"Vodyanitsa_Constellation3", condition:{characterIDs:["Vodyanitsa"], }, effect:constellation_3_of_Vodyanitsa,
          isNet : true, isPermanent:true, desc:"沃雅妮莎命座3：沃雅妮莎的元素战技等级+3"}],
    4 : [{ID:"Vodyanitsa_Constellation4", condition:{characterIDs:["Vodyanitsa"], }, effect:constellation_4_of_Vodyanitsa,
          isNet : true, isPermanent:false, desc:"沃雅妮莎命座4：沃雅妮莎生命值上限提升60%(简化)"}],
    5 : [{ID:"Vodyanitsa_Constellation5", condition:{characterIDs:["Vodyanitsa"], }, effect:constellation_5_of_Vodyanitsa,
          isNet : true, isPermanent:true, desc:"沃雅妮莎命座5：沃雅妮莎的元素爆发等级+3"}],
    6 : [{ID:"Vodyanitsa_Constellation6_1", condition:{}, effect:constellation_6_1_of_Vodyanitsa,
          isNet : true, isPermanent:true, desc:"沃雅妮莎命座6：沃雅妮莎2命效果可以作用于全队"},
          {ID:"Vodyanitsa_Constellation6_2", condition:{rxndmgs:["directStellarSwirl", "reactionStellarSwirl"], elements:["cryo", "anemo"], isStellarSwirl:true, VodyanitsaC2Onfield:false}, 
          effect:constellation_6_2_of_Vodyanitsa, isNet : true, isPermanent:false, 
          desc:"沃雅妮莎命座6：处于星扩散状态时，全队角色的星扩散反应伤害的暴击伤害提升60%"},
          {ID:"Vodyanitsa_Constellation6_3", condition:{elements:["hydro", "cryo"], isStellarSwirl:false, VodyanitsaC2Onfield:false}, 
          effect:constellation_6_3_of_Vodyanitsa, isNet : true, isPermanent:false, 
          desc:"沃雅妮莎命座6：不处于星扩散状态时，全队角色的水、冰元素伤害的暴击伤害提升50%"},
          {ID:"Vodyanitsa_Constellation6_4", condition:{}, effect:constellation_6_4_of_Vodyanitsa,
          isNet : true, isPermanent:false, desc:"沃雅妮莎命座6：全队星扩散反应伤害擢升25%，冰、水元素伤害增伤60%"},
        ],
  },
  /*... 其他需要定义的变量 ...*/
  parameters : {EDeRes:0.3, maxSolo:25, maxEnsemble:10, },  // 固有天赋、技能效果、命座效果可能用到的其他参数
  teamParameters : {VodyanitsaC2Onfield:true, isStellarSwirl:true, ishealed:true},
  variables : {currSolo:25, currEnsemble:10, isSoloExhaust:false, isEnsembleExhaust:false},  // 在后续buff计算中需要用到的全局参数，定义在这里
  /*... 方法 ...*/
  reset_variables(attributes){Object.keys(this.variables).forEach(key => {attributes[key]=this.variables[key]})},
};
// 角色效果
function check_solo_of_Vodyanitsa(teamInitialAttributes, charID, action){
  // 检查action是否是前台角色触发，以及领唱是否消耗完毕
  let actionCharID = (action.talentMeta != undefined) ? action.talentMeta.characterID : null;
  let isOnfield = (action.talentMeta != undefined) ? action.talentMeta.isOnfield : false;
  let result = true;
  if(actionCharID !== charID || isOnfield !== true){result = false;}
  else{result = teamInitialAttributes["Vodyanitsa"].isSoloExhaust ? false : true;}
  return result
};
function check_ensemble_of_Vodyanitsa(teamInitialAttributes, charID, action){
  // 检查action是否是后台角色触发，以及重唱是否消耗完毕
  let actionCharID = (action.talentMeta != undefined) ? action.talentMeta.characterID : null;
  let isOnfield = (action.talentMeta != undefined) ? action.talentMeta.isOnfield : null;
  let result = true;
  if(actionCharID !== charID || isOnfield !== false){result = false;}
  else{result = teamInitialAttributes["Vodyanitsa"].isEnsembleExhaust ? false : true;}
  return result
};
function passive_talent_1_of_Vodyanitsa(teamInitialAttributes, teamNetAttributes, action, activated = false){return {anemoDeRes:0.35}};
function passive_talent_2_1_of_Vodyanitsa(teamInitialAttributes, teamNetAttributes, action, activated = false){
  // 能执行这个函数，说明领唱还没消耗完
  const attr = teamNetAttributes["Vodyanitsa"];
  let hp = attr.stats.hp;
  let unitValue = 260, maxValue = 6500;
  let flatDMG = Math.max(0, Math.min(maxValue, unitValue*(hp-40000)/1000));
  if(activated && action.talentMeta == undefined){return {flatDMG}};
  let hitnum = action.talentMeta.hitnum || 1, repetitionCount = action.repetitionCount || 1;
  let currSolo = teamInitialAttributes["Vodyanitsa"].currSolo;
  let times = Math.min(currSolo, hitnum*repetitionCount);
  teamInitialAttributes["Vodyanitsa"].currSolo -= times;
  const result = {flatDMG: flatDMG*times, singleFlatDMG:flatDMG, hitnum, repetitionCount, 
                  consumption:times, remaining:teamInitialAttributes["Vodyanitsa"].currSolo};
  if(teamInitialAttributes["Vodyanitsa"].currSolo === 0){teamInitialAttributes["Vodyanitsa"].isSoloExhaust = true};
  return result;
};
function passive_talent_2_2_of_Vodyanitsa(teamInitialAttributes, teamNetAttributes, action, activated = false){
  // 能执行这个函数，说明领唱还没消耗完
  const attr = teamNetAttributes["Vodyanitsa"];
  let hp = attr.stats.hp;
  let unitValue = 140, maxValue = 3500;
  let flatDMG = Math.max(0, Math.min(maxValue, unitValue*(hp-40000)/1000));
  if(activated && action.talentMeta == undefined){return {flatDMG}};
  let hitnum = action.talentMeta.hitnum || 1, repetitionCount = action.repetitionCount || 1;
  let currSolo = teamInitialAttributes["Vodyanitsa"].currSolo;
  let times = Math.min(currSolo, hitnum*repetitionCount);
  teamInitialAttributes["Vodyanitsa"].currSolo -= times;
  const result = {flatDMG: flatDMG*times, singleFlatDMG:flatDMG, hitnum, repetitionCount, 
                  consumption:times, remaining:teamInitialAttributes["Vodyanitsa"].currSolo};
  if(teamInitialAttributes["Vodyanitsa"].currSolo === 0){teamInitialAttributes["Vodyanitsa"].isSoloExhaust = true};
  return result;
};
function passive_talent_2_3_of_Vodyanitsa(teamInitialAttributes, teamNetAttributes, action, activated = false){
  // 能执行这个函数，说明重唱还没消耗完
  const attr = teamNetAttributes["Vodyanitsa"];
  let hp = attr.stats.hp;
  let unitValue = 260, maxValue = 6500;
  let flatDMG = Math.max(0, Math.min(maxValue, unitValue*(hp-40000)/1000));
  if(activated && action.talentMeta == undefined){return {flatDMG}};
  let hitnum = action.talentMeta.hitnum || 1, repetitionCount = action.repetitionCount || 1;
  let currEnsemble = teamInitialAttributes["Vodyanitsa"].currEnsemble;
  let times = Math.min(currEnsemble, hitnum*repetitionCount);
  teamInitialAttributes["Vodyanitsa"].currEnsemble -= times;
  const result = {flatDMG: flatDMG*times, singleFlatDMG:flatDMG, hitnum, repetitionCount, 
                  consumption:times, remaining:teamInitialAttributes["Vodyanitsa"].currEnsemble};
  if(teamInitialAttributes["Vodyanitsa"].currEnsemble === 0){teamInitialAttributes["Vodyanitsa"].isEnsembleExhaust = true};
  return result;
};
function passive_talent_2_4_of_Vodyanitsa(teamInitialAttributes, teamNetAttributes, action, activated = false){
  // 能执行这个函数，说明重唱还没消耗完
  const attr = teamNetAttributes["Vodyanitsa"];
  let hp = attr.stats.hp;
  let unitValue = 140, maxValue = 3500;
  let flatDMG = Math.max(0, Math.min(maxValue, unitValue*(hp-40000)/1000));
  if(activated && action.talentMeta == undefined){return {flatDMG}};
  let hitnum = action.talentMeta.hitnum || 1, repetitionCount = action.repetitionCount || 1;
  let currEnsemble = teamInitialAttributes["Vodyanitsa"].currEnsemble;
  let times = Math.min(currEnsemble, hitnum*repetitionCount);
  teamInitialAttributes["Vodyanitsa"].currEnsemble -= times;
  const result = {flatDMG: flatDMG*times, singleFlatDMG:flatDMG, hitnum, repetitionCount, 
                  consumption:times, remaining:teamInitialAttributes["Vodyanitsa"].currEnsemble};
  if(teamInitialAttributes["Vodyanitsa"].currEnsemble === 0){teamInitialAttributes["Vodyanitsa"].isEnsembleExhaust = true};
  return result;
};
function E_effect_of_Vodyanitsa(teamInitialAttributes, teamNetAttributes, action, activated = false){
  const deRes = teamInitialAttributes["Vodyanitsa"].EDeRes;
  return {hydroDeRes : deRes, cryoDeRes : deRes};
};
// 命座效果
function constellation_1_of_Vodyanitsa(teamInitialAttributes, teamNetAttributes, action, activated = false){
  let hp = teamNetAttributes["Vodyanitsa"].stats.hp;
  return {atkf: hp*0.008};
}
function constellation_2_1_of_Vodyanitsa(teamInitialAttributes, teamNetAttributes, action, activated = false){return {cd:0.6}};
function constellation_2_2_of_Vodyanitsa(teamInitialAttributes, teamNetAttributes, action, activated = false){return {cd:0.5}};
function constellation_3_of_Vodyanitsa(teamInitialAttributes, teamNetAttributes, action, activated = false){return{E:3, EDeRes:0.354}};
function constellation_4_of_Vodyanitsa(teamInitialAttributes, teamNetAttributes, action, activated = false){return{hpp:0.6}};
function constellation_5_of_Vodyanitsa(teamInitialAttributes, teamNetAttributes, action, activated = false){return{Q:3}};
function constellation_6_1_of_Vodyanitsa(teamInitialAttributes, teamNetAttributes, action, activated = false){return {VodyanitsaC2Onfield:false}};
function constellation_6_2_of_Vodyanitsa(teamInitialAttributes, teamNetAttributes, action, activated = false){return {cd:0.6}};
function constellation_6_3_of_Vodyanitsa(teamInitialAttributes, teamNetAttributes, action, activated = false){return {cd:0.5}};
function constellation_6_4_of_Vodyanitsa(teamInitialAttributes, teamNetAttributes, action, activated = false){return {stellarSwirlElevation:0.25, cryoDMG:0.6, hydroDMG:0.6}};


  // #endregion


// #region  珐露珊角色数据
  export const Faruzan = {
    name : "珐露珊",
    rarity: 4,
    ID : "Faruzan",
    element : "anemo",
    level : 90,
    stat: "atkp", // 突破属性词条
    statValue : 0.24, // 突破属性数值
    statLabel : "攻击力%",
    weapon : null,
    candidateWeapons : {},
    artifactSet : [],
    candidateArtifactSets : {},
    artifacts: { // 默认词条：辅助向，优先充能
      flower : {
        mainStat : "hpf",
        subStats : {"cr":2, "cd":1, "atkp":1, "defp":0, "hpp":0, "em":0, "er":4, "atkf":0, "deff":0, "hpf":0},
      },
      plume : {
        mainStat : "atkf",
        subStats : {"cr":2, "cd":1, "atkp":1, "defp":0, "hpp":0, "em":0, "er":4, "atkf":0, "deff":0, "hpf":0},
      },
      sands : {
        mainStat : "er",
        subStats : {"cr":3, "cd":1, "atkp":3, "defp":0, "hpp":0, "em":0, "er":0, "atkf":1, "deff":0, "hpf":0},
      },
      goblet : {
        mainStat : "anemoDMG",
        subStats : {"cr":2, "cd":1, "atkp":1, "defp":0, "hpp":0, "em":0, "er":4, "atkf":0, "deff":0, "hpf":0},
      },
      circlet : {
        mainStat : "cr",
        subStats : {"cr":0, "cd":2, "atkp":1, "defp":0, "hpp":0, "em":0, "er":4, "atkf":1, "deff":0, "hpf":0},
      },
    },
    constellation : 6,
    displayedStats : ["cr", "cd", "atk", "em", "def", "hp", "er", "anemoDMG", "anemoDeRes"],
    effectiveSubStats : {"er":1, "atkp":1, "cr":1, "cd":1, "em":0.5, "atkf":0.33},
    get effectiveSubStatCount(){
      let count = 0;
      for(let slot of Object.keys(this.artifacts)){
        const substats = this.artifacts[slot].subStats;
        for(let stat of Object.keys(substats)){
          count += (this.effectiveSubStats[stat] || 0) * substats[stat];
        }
      }
      return count;
    },
    base : {  
      90 : {atk: 196, def: 628, hp: 9570,},
      95 : {atk: 222, def: 650, hp: 9901,},
      100 : {atk: 247, def: 671, hp: 10232,},
    },
    talentLevels : {A : 10, E : 10, Q : 10, other : 1},
    talentMetas : {
      swap : {ID : "swap", characterID : "Faruzan", name : "切换角色",
              element:null, gauge:0, EACount:0, rxndmg:"none", talent:"other",
              attackType:"swap", isOnfield:true, isSnapshot:false,
              hitnum:0, scaling:null},
      e0 : {ID:"e0", characterID : "Faruzan", name : "非想风天",
            element:"anemo", gauge:1, EACount:1, rxndmg:"none", talent:"E",
            attackType:"skill", isOnfield:true, isSnapshot:false,
            hitnum:1, scaling:{10:{atk:2.6784}, 13:{atk:3.162}}}, // 技能伤害267.84%/316.2%
      q0 : {ID:"q0", characterID : "Faruzan", name : "抟风秘道",
            element:"anemo", gauge:1, EACount:1, rxndmg:"none", talent:"Q",
            attackType:"burst", isOnfield:true, isSnapshot:false,
            hitnum:1, scaling:{10:{atk:6.7968}, 13:{atk:8.024}}}, // 技能伤害679.68%/802.4%
      q_c6_vortex : {ID:"q_c6_vortex", characterID : "Faruzan", name : "6命风压坍陷风涡",
                    element:"anemo", gauge:1, EACount:1, rxndmg:"none", talent:"E", // 风涡伤害视为元素战技伤害
                    attackType:"skill", isOnfield:false, isSnapshot:false,
                    hitnum:1, scaling:{10:{atk:1.944}, 13:{atk:2.295}}, constellation:6}, // 后台伤害194.4%/229.5%
    },
    effects : [
      {ID:"Faruzan_QAnemoDMG", condition:{}, effect:Q_anemo_dmg_effect_of_Faruzan, isNet:true, isPermanent:false,
      get desc(){return `珐露珊Q祈风之赐：为全队提供32.4%(10级Q)或38.3%(13级Q)风元素伤害加成`}},
      {ID:"Faruzan_QDeRes", condition:{}, effect:Q_de_res_effect_of_Faruzan, isNet:true, isPermanent:false,
      desc:"珐露珊Q诡风之祸：烈风波降低敌人30%风元素抗性(简化为全程生效)"},
      {ID:"Faruzan_Passive2", condition:{elements:["anemo"], isOnfield:true, excludedRxndmgs:["directStellarSwirl", "reactionStellarSwirl"]}, 
      effect:passive_talent_2_of_Faruzan, isNet:false, isPermanent:false,
      desc:"珐露珊固有天赋2：处于祈风之赐下的前台角色造成风元素伤害时，基于珐露珊基础攻击力的32%提高伤害"},
    ],
    constellationEffects : {
      0 : [],
      1 : [],
      2 : [],
      3 : [{ID:"Faruzan_Constellation3", condition:{characterIDs:["Faruzan"]}, effect:()=>({E:3}),
            isNet:true, isPermanent:true, desc:"珐露珊命座3：非想风天的技能等级提高3级"}],
      4 : [],
      5 : [{ID:"Faruzan_Constellation5", condition:{characterIDs:["Faruzan"]}, effect:()=>({Q:3}),
            isNet:true, isPermanent:true, desc:"珐露珊命座5：抟风秘道的技能等级提高3级"}],
      6 : [{ID:"Faruzan_Constellation6", condition:{elements:["anemo"]}, effect:()=>({cd:0.40}),
            isNet:true, isPermanent:false, desc:"珐露珊命座6：处于祈风之赐下的角色造成风元素伤害时，暴击伤害提升40%"}],
    },
    parameters : {},
    teamParameters : {},
    variables : {},
    reset_variables(attributes){Object.keys(this.variables).forEach(key => {attributes[key]=this.variables[key]})},
  };
  // 效果函数, 输入为(初始面板，净面板/初始面板/{}(计算永久buff), action, activated)
  const Faruzan_QAnemoDMGDict = {1:0.18, 2:0.1935, 3:0.207, 4:0.225, 5:0.2385, 6:0.252, 7:0.27, 8:0.288, 9:0.306, 10:0.324, 11:0.342, 12:0.36, 13:0.3825, 14:0.405, 15:0.4275};
  function Q_anemo_dmg_effect_of_Faruzan(teamInitialAttributes, teamNetAttributes, action, activated = false){
    // 祈风之赐：全队获得基于大招等级的风元素伤害加成
    const QLevel = teamInitialAttributes["Faruzan"].talentLevels.Q;
    return {anemoDMG : Faruzan_QAnemoDMGDict[QLevel]};
  };
  function Q_de_res_effect_of_Faruzan(teamInitialAttributes, teamNetAttributes, action, activated = false){
    // 诡风之祸：烈风波命中后降低敌人30%风抗(本模板简化为全程生效)
    return {anemoDeRes : 0.30};
  };
  function passive_talent_2_of_Faruzan(teamInitialAttributes, teamNetAttributes, action, activated = false){
    // 七窟遗智：基于珐露珊基础攻击力的32%提高前台角色风元素伤害(固定值加成); 所有固定值加成都要考虑talentMeta的攻击段数 hitnum 和action的重数 repetitionCount
    const batk = teamNetAttributes["Faruzan"].stats.batk;
    const hitnum = (action.talentMeta != undefined) ? action.talentMeta.hitnum||1 : 1;
    const repetitionCount = action.repetitionCount || 1;
    const singleFlatDMG = batk * 0.32;
    return {flatDMG : singleFlatDMG * repetitionCount * hitnum, singleFlatDMG, hitnum, repetitionCount, 
            consumption:null, remaining:null};
  };
  
  // #endregion


// #region 冰旅行者数据
const TravelerCryo = {
  name : "旅行者·冰",
  rarity: 0,
  ID : "TravelerCryo",
  element : "cryo",
  level : 90,
  stat: "atkp", // 突破属性词条
  statValue : 0.24, // 突破属性数值
  statLabel : "攻击力%",
  weapon : null,
  candidateWeapons : {},
  artifactSet : [],
  candidateArtifactSets : {},
  artifacts: { // 默认词条：辅助向，优先充能
    flower : {
      mainStat : "hpf",
      subStats : {"cr":2, "cd":3, "atkp":2, "defp":0, "hpp":0, "em":0, "er":1, "atkf":0, "deff":0, "hpf":0},
    },
    plume : {
      mainStat : "atkf",
      subStats : {"cr":2, "cd":3, "atkp":2, "defp":0, "hpp":0, "em":0, "er":1, "atkf":0, "deff":0, "hpf":0},
    },
    sands : {
      mainStat : "atkp",
      subStats : {"cr":3, "cd":3, "atkp":0, "defp":0, "hpp":0, "em":0, "er":1, "atkf":1, "deff":0, "hpf":0},
    },
    goblet : {
      mainStat : "atkp",
      subStats : {"cr":2, "cd":3, "atkp":0, "defp":0, "hpp":0, "em":2, "er":1, "atkf":0, "deff":0, "hpf":0},
    },
    circlet : {
      mainStat : "cr",
      subStats : {"cr":0, "cd":4, "atkp":2, "defp":0, "hpp":0, "em":0, "er":1, "atkf":1, "deff":0, "hpf":0},
    },
  },
  constellation : 6,
  displayedStats : ["cr", "cd", "atk", "em", "def", "hp", "er", "stellarConductDMG", "stellarSwirlDMG"],
  effectiveSubStats : {"atkp":1, "cr":1, "cd":1, "em":0.5, "er":0.5, "atkf":0.33},
  get effectiveSubStatCount(){
    let count = 0;
    for(let slot of Object.keys(this.artifacts)){
      const substats = this.artifacts[slot].subStats;
      for(let stat of Object.keys(substats)){
        count += (this.effectiveSubStats[stat] || 0) * substats[stat];
      }
    }
    return count;
  },
  base : {  
    90 : {atk: 212, def: 683, hp: 10875,},
    95 : {atk: 239, def: 706, hp: 11251,},
    100 : {atk: 267, def: 730, hp: 11627,},
  },
  talentLevels : {A : 10, E : 10, Q : 10, other : 1},
  talentMetas : {
    swap : {ID : "swap", characterID : "Traveler", name : "切换角色",
            element:null, gauge:0, EACount:0, rxndmg:"none", talent:"other",
            attackType:"swap", isOnfield:true, isSnapshot:false,
            hitnum:0, scaling:null},
    a1_cryo : {ID : "swap", characterID : "Traveler", name : "普通攻击1·冰",
               element:"cryo", gauge:1, EACount:1, rxndmg:"none", talent:"other",
               attackType:"attack", isOnfield:true, isSnapshot:false,
               hitnum:1, scaling:{10:{atk:0.876}, 13:{atk:1.065}}},
  },
  effects : [
    {ID:"Traveler_Passive1", condition:{}, effect:"", isNet:true, isPermanent:false,
    get desc(){return ``}},
  ],
  constellationEffects : {
    0 : [],
    1 : [],
    2 : [],
    3 : [{ID:"Traveler_Constellation3", condition:{characterIDs:["Faruzan"]}, effect:()=>({E:3}),
          isNet:true, isPermanent:true, desc:""}],
    4 : [],
    5 : [{ID:"Traveler_Constellation5", condition:{characterIDs:["Faruzan"]}, effect:()=>({Q:3}),
          isNet:true, isPermanent:true, desc:""}],
    6 : [{ID:"Traveler_Constellation6", condition:{elements:["anemo"]}, effect:()=>({cd:0.40}),
          isNet:true, isPermanent:false, desc:""}],
  },
  parameters : {},
  teamParameters : {},
  variables : {},
  reset_variables(attributes){Object.keys(this.variables).forEach(key => {attributes[key]=this.variables[key]})},
}




// #endregion




