import {
  ELEMENTS,
  REACTIONS,
  REACTION_DAMAGES,
  CATALYZE_SET,
  TRANSFORMATIVE_SET,
  AMPLIFYING_SET,
  LUNAR_SET, STELLAR_SET,
  DAMAGE_TYPES, ATTACK_TYPES,
  STATS, STAT_KEY_SET, TALENT_KEY_SET,
  ARTIFACT_MAIN_STATS,
  ARTIFACT_SUB_STATS,
  ARTIFACT_SLOTS,
  FLAT_STAT_SET,
  get_elemental_resonance_effects,
} from "./基础定义.js";
import {
  get_weapon_desc_array,
  Weapon_BeyondtheChrysalis,
  Weapon_ExaiphanesBlade,
  Weapon_WhitelakeFrostfeather,
  Weapon_HymnoftheMaelstrom,
  Weapon_ThrillingTalesofDragonSlayers,
  Weapon_BreezeborneRefrain,
  Weapon_FavoniusWarbow,
  Weapon_NewBough,
  Weapon_SliverLight,
  Weapon_FinaleoftheDeep,
  Weapon_HereticsMoltenBlade,
} from "./武器数据.js";
import {
  get_artifactSet_ID, get_artifactSet_name, get_artifactSet_desc_array,
  ArtifactSet_ScarletProof,
  ArtifactSet_HeartoftheFurnace,
  ArtifactSet_TenacityoftheMillelith,
  ArtifactSet_NoblesseOblige,
} from "./圣遗物套装数据.js";
import { check_action_condition, get_effect_ineffective_ranges, findAllIndex, merge_actions_by_ineffectiveEffectIDSet,
  assign_details_to_actions_between_timestamps, EPSILON, assign_details_to_action,
  assign_effect_detials_to_actions, sort_actions_by_timestamps, sum, find_action_index_by_smaller_timestamp,
  Vesna, Odette, Vodyanitsa, Faruzan, TravelerCryo } from "./角色数据.js";



// 需要开发者修改的部分
// #region 薇斯纳（Vesna）
// 武器部分
const BeyondtheChrysalis = new Weapon_BeyondtheChrysalis();
const ExaiphanesBlade = new Weapon_ExaiphanesBlade();
const WhitelakeFrostfeather = new Weapon_WhitelakeFrostfeather();
const NewBough = new Weapon_NewBough();
const SliverLight = new Weapon_SliverLight();
const FinaleoftheDeep = new Weapon_FinaleoftheDeep();
const HereticsMoltenBlade = new Weapon_HereticsMoltenBlade();
// 圣遗物
const ScarletProof = new ArtifactSet_ScarletProof();
// 调整参数
Vesna.candidateWeapons = {BeyondtheChrysalis, ExaiphanesBlade, WhitelakeFrostfeather, NewBough, SliverLight, FinaleoftheDeep, HereticsMoltenBlade};
Vesna.weapon = BeyondtheChrysalis;
BeyondtheChrysalis.be_equipped(Vesna.ID, Vesna.name);
Vesna.candidateArtifactSets.ScarletProof_4 = [[ScarletProof, 4]];
Vesna.artifactSet = [[ScarletProof, 4]];
ScarletProof.be_equipped(Vesna.ID, Vesna.name);
// #endregion


// #region 奥黛塔(Odette)
// 武器部分
const ExaiphanesBlade1 = new Weapon_ExaiphanesBlade("ExaiphanesBlade1");
const WhitelakeFrostfeather1 = new Weapon_WhitelakeFrostfeather("WhitelakeFrostfeather1");
const NewBough1 = new Weapon_NewBough("NewBough1");
// 圣遗物
const HeartoftheFurnace = new ArtifactSet_HeartoftheFurnace();
// 赋值
Odette.candidateWeapons = {WhitelakeFrostfeather, ExaiphanesBlade, NewBough1};
Odette.weapon = WhitelakeFrostfeather;
WhitelakeFrostfeather.be_equipped(Odette.ID, Odette.name);
Odette.candidateArtifactSets = {HeartoftheFurnace_4 : [[HeartoftheFurnace, 4]]};
Odette.artifactSet = [[HeartoftheFurnace, 4]];
HeartoftheFurnace.be_equipped(Odette.ID, Odette.name);
// #endregion


// #region 沃雅妮莎(Vodyanitsa)
// 武器
const HymnoftheMaelstrom = new Weapon_HymnoftheMaelstrom();
const ThrillingTalesofDragonSlayers = new Weapon_ThrillingTalesofDragonSlayers();
// 圣遗物套装
const TenacityoftheMillelith = new ArtifactSet_TenacityoftheMillelith();
// 配置
Vodyanitsa.candidateWeapons = {HymnoftheMaelstrom, ThrillingTalesofDragonSlayers};
Vodyanitsa.weapon = HymnoftheMaelstrom;
HymnoftheMaelstrom.be_equipped(Vodyanitsa.ID, Vodyanitsa.name);
Vodyanitsa.candidateArtifactSets = {"TenacityoftheMillelith_4":[[TenacityoftheMillelith, 4]]};
Vodyanitsa.artifactSet = [[TenacityoftheMillelith, 4]];
TenacityoftheMillelith.be_equipped(Vodyanitsa.ID, Vodyanitsa.name);
// #endregion


// #region 珐露珊(Faruzan)
// 武器
const BreezeborneRefrain = new Weapon_BreezeborneRefrain();
const FavoniusWarbow = new Weapon_FavoniusWarbow();
// 圣遗物套装
const NoblesseOblige = new ArtifactSet_NoblesseOblige();
// 配置
Faruzan.candidateWeapons = {BreezeborneRefrain, FavoniusWarbow};
Faruzan.weapon = BreezeborneRefrain;
BreezeborneRefrain.be_equipped(Faruzan.ID, Faruzan.name);
Faruzan.candidateArtifactSets = {NoblesseOblige_4:[[NoblesseOblige, 4]]};
Faruzan.artifactSet = [[NoblesseOblige, 4]];
NoblesseOblige.be_equipped(Faruzan.ID, Faruzan.name);
// #endregion


// #region 旅行者(TravelerCryo)
// 武器部分
const ExaiphanesBlade4 = new Weapon_ExaiphanesBlade("ExaiphanesBlade4");
// 圣遗物
const HeartoftheFurnace4 = new ArtifactSet_HeartoftheFurnace("HeartoftheFurnace4");
const NoblesseOblige4 = new ArtifactSet_NoblesseOblige("NoblesseOblige4");
const TenacityoftheMillelith4 = new ArtifactSet_TenacityoftheMillelith("TenacityoftheMillelith4");
// 赋值
TravelerCryo.candidateWeapons = {ExaiphanesBlade4};
TravelerCryo.weapon = ExaiphanesBlade4;
ExaiphanesBlade4.be_equipped(TravelerCryo.ID, TravelerCryo.name);
TravelerCryo.candidateArtifactSets = {HeartoftheFurnace4_4 : [[HeartoftheFurnace4, 4]], 
                                      NoblesseOblige4_4:[[NoblesseOblige4, 4]],
                                      TenacityoftheMillelith4_4 : [[TenacityoftheMillelith4, 4]]};
TravelerCryo.artifactSet = [[HeartoftheFurnace4, 4]];
HeartoftheFurnace4.be_equipped(TravelerCryo.ID, TravelerCryo.name);


// #endregion



// 角色选择时的参数
const candidateCharacters = {"Odette":Odette, "Faruzan":Faruzan, TravelerCryo, "Vodyanitsa":Vodyanitsa,};  // 候选角色
const selectedCharacters = {};   // 用户选择的角色
const requiredCharacters = {"Vesna":Vesna,};   // 需要的角色，默认在队伍中

function check_character_selection(){// 检查用户选择的角色是否满足要求，比如必须具有哪些属性等
  // 返回 {isPass, text}, isPass bool值表示是否通过检测，text为不通过时的报错
  let isPass = true, text = "";
  if(Object.keys(selectedCharacters).length +  Object.keys(requiredCharacters).length< 4){isPass = false; text = "角色数目小于4"}
  else{
    let mark = false;
    for(let char of Object.values(selectedCharacters)){
      if(char.element == "cryo"){mark = true; break;}
    }
    if(!mark){isPass = false; text = "角色选择中没有冰元素角色"}
  }
  return {isPass, text};
};

function get_configs(characters){
  /* 返回一个object，包含 {start:{}, cycle:{}, end:{}}, start为首轮，cycle为循环轮，end为尾轮  
    每轮对应的对象中包含：
      attrParamsList: [{charID : {具体内容}}], 用于更新 additionalAttributeParams 的对象；
      onfieldActionParamsList : [{charID : {具体params}}]，用于生成角色前台行为的 params 参数
      onfieldActionDetailsList : [{charID : {具体details}}]，用于给角色前台行为附加的 details 参数
      offfieldActionParamsList : [{charID : {segIndex: 具体params,}}]，用于生成角色后台行为的 params 参数, segIndex为具体作用的段索引
      offfieldActionDetailsList : [{charID : {segIndex: 具体details}}]，用于给角色后台行为附加的 details 参数, segIndex为具体作用的段索引
      descList: [描述1, ...]，与 attrParamsList 中元素对应的描述
      totalTimes: [t1, ...]，与 attrParamsList 中元素对应的总耗时
      buttonNames: [name1, ..., ]，与 attrParamsList 中元素对应的按钮名称
      cycleCounts: [次数1，...]，循环次数，表示对应的 attrParams 在整个流程中循环了几次
  */
  // 确认一些参数
  const configs = {start:{} , cycle:{}, end:{}};
  const orders = Object.keys(characters).map(k => initialAdditionalAttributeParams[k].order); // 初始定义的角色切换顺序
  const sortedCharIDs = get_sorted_character_IDs(Object.keys(characters), orders);
  const notOnfieldyetCharIDsDict = {};
  for(let i=0; i<sortedCharIDs.length;i++){
    notOnfieldyetCharIDsDict[sortedCharIDs[i]] = sortedCharIDs.slice(i+1);
  }
  const elementNumbers = Object.fromEntries(Object.keys(ELEMENTS).map(k => [k, 0]));
  for(let char of Object.values(characters)){elementNumbers[char.element] += 1};
  const isDoubleAnemo = (elementNumbers.anemo >= 2), isDoubleCryo = (elementNumbers.cryo >= 2);
  const energyWeaponNameSet = new Set(["蝶变", "白湖冬羽"]);
  let withDragon = false, withEnergyWeapon = false;
  for(let char of Object.values(characters)){
    if(char.weapon.name === "讨龙英杰谭"){withDragon = true;}
    if(char.ID === sortedCharIDs.at(-1) && energyWeaponNameSet.has(char.weapon.name)){withEnergyWeapon = true;}
  }
  const sortedCharNonpermanentEffectIDSets = sortedCharIDs.reduce((results, ID)=>{
    results[ID] = get_character_all_nonpermanent_effect_ID_set(ID);
    return results;
  }, {})

  // #region 起始轮
  const start_attrParamsList = [// 所有角色都不能放大招
    {Vesna: {toCastE:true, toCastQ:false, ThrillingTalesofDragonSlayersTarget:true}, // 首轮卡掉讨龙
     Odette: {toCastE:true, toCastQ:false, isStellarSwirl:false,},
     Vodyanitsa: {toCastE:true, toCastQ:false,},
     Faruzan: {toCastE:true, toCastCharge:true, toCastQ:false,},
     TravelerCryo:{toCastE:true, toCastCharge:false, toCastQ:false,isStellarSwirl:false,}
    }
  ];
  if(isDoubleAnemo){//双风时，奥黛塔第一轮能打星扩散
    start_attrParamsList[0].Odette.isStellarSwirl = true;
  }
  const start_onfieldActionParamsList = [{},];
  if(Object.keys(characters).includes("Odette") && isDoubleAnemo){ // 奥黛塔第一轮手法为 奥->珐->奥->沃，确保第一轮奥打出星扩散，时长+1秒切人
    start_onfieldActionParamsList[0]["Odette"] = {addedDuration:1};
  }
  const start_offfieldActionParamsList = [{}];
  if(!isDoubleAnemo){ // 不是双风，那么只有最后一轮奥黛塔后台才是星扩散伤害
    start_offfieldActionParamsList[0]["Odette"] = {};
    start_offfieldActionParamsList[0]["Odette"].segmentParams = [{}, {}, {}, {isStellarSwirl:true}];
  }
  const start_onfieldActionDetailsList = [{},];
  if(characters["Odette"]?.constellation < 6){
    start_onfieldActionDetailsList[0].Odette = {ineffectiveEffectIDSet: new Set(["Odette_Passive1_2"])};
  }
  const start_offfieldActionDetailsList = [{}];
  const start_descList = ["首轮"];
  const start_totalTimes = [undefined]; // 表示等于计算结果，不额外赋值
  const start_buttonNames = ["首轮"];
  const start_n = start_attrParamsList.length;
  // 对于details，需要考虑首轮中先出场的角色吃不到后出场的角色buff
  const n_seg = sortedCharIDs.length;
  const additionalIneffectiveEffectIDSets = {};
  for(let i=0; i<n_seg; i++){
    let charID = sortedCharIDs[i];
    let sets = notOnfieldyetCharIDsDict[charID].map(ID => get_character_all_nonpermanent_effect_ID_set(ID));
    additionalIneffectiveEffectIDSets[i] = merge_multipler_sets(sets);
  }
  for(let i=0; i<start_n; i++){
    let onfieldDetails = start_onfieldActionDetailsList[i], offfieldDetails = start_offfieldActionDetailsList[i];
    for(let idx in sortedCharIDs){
      let j = Number(idx), charID = sortedCharIDs[j];
      onfieldDetails[charID] = onfieldDetails[charID] || {}; offfieldDetails[charID] = offfieldDetails[charID] || {};
      assign_details_to_action(onfieldDetails[charID], {ineffectiveEffectIDSet:additionalIneffectiveEffectIDSets[j]});
      // 后台行为的 details 按键为段索引，因此对每一段都附加同样的屏蔽集合
      offfieldDetails[charID].segmentDetails = [];
      for(let seg=0; seg<n_seg; seg++){
        offfieldDetails[charID].segmentDetails.push({ineffectiveEffectIDSet: additionalIneffectiveEffectIDSets[seg]});
      }
    } 
  }
  // 赋值
  configs.start = {
    attrParamsList: start_attrParamsList, 
    onfieldActionParamsList: start_onfieldActionParamsList,
    offfieldActionParamsList: start_offfieldActionParamsList,
    onfieldActionDetailsList: start_onfieldActionDetailsList,
    offfieldActionDetailsList: start_offfieldActionDetailsList,
    descList: start_descList,
    totalTimes: start_totalTimes,
    buttonNames : start_buttonNames,
    cycleCounts: [1],
  }
  
  // #endregion


  // #region 循环轮
    // 判断是每轮开大还是两轮一大（由于开局卡掉讨龙，有大轮必有讨龙）
  let cycle_attrParamsList, cycle_descList, cycle_buttonNames;
  if(isDoubleAnemo || withEnergyWeapon){// 有充能武器或者双风则每轮开大
    if(withDragon){// 有讨龙则需要区分
      cycle_attrParamsList = [
        { Vesna: {toCastE:true, toCastQ:true, ThrillingTalesofDragonSlayersTarget:true},
          Odette: {toCastE:true, toCastQ:false,},
          Vodyanitsa: {toCastE:true, toCastQ:false,},
          Faruzan: {toCastE:false, toCastCharge:false, toCastQ:true,},
          TravelerCryo:{toCastE:true, toCastCharge:true, toCastQ:true, currFrostGlow:8, consumedFrostGlow:8},
        },
        { Vesna: {toCastE:true, toCastQ:true, ThrillingTalesofDragonSlayersTarget:false},
          Odette: {toCastE:true, toCastQ:false,},
          Vodyanitsa: {toCastE:true, toCastQ:false,},
          Faruzan: {toCastE:false, toCastCharge:false, toCastQ:true,},
          TravelerCryo:{toCastE:true, toCastCharge:true, toCastQ:true, currFrostGlow:8, consumedFrostGlow:8},
        },
      ];
      cycle_descList = ["有大有讨龙轮", "有大无讨龙轮"];
      cycle_buttonNames = ["有大有讨龙", "有大无讨龙"];
    }
    else{
      cycle_attrParamsList = [
        { Vesna: {toCastE:true, toCastQ:true, ThrillingTalesofDragonSlayersTarget:true},
          Odette: {toCastE:true, toCastQ:false,},
          Vodyanitsa: {toCastE:true, toCastQ:false,},
          Faruzan: {toCastE:false, toCastCharge:false, toCastQ:true,},
          TravelerCryo:{toCastE:true, toCastCharge:true, toCastQ:true, currFrostGlow:8, consumedFrostGlow:8},
        },
      ];
      cycle_descList = ["每轮有大"];
      cycle_buttonNames = ["每轮有大"];
    }
  }
  else{// 两轮一大
    if(withDragon){// 有讨龙则需要区分
      cycle_attrParamsList = [
        { Vesna: {toCastE:true, toCastQ:true, ThrillingTalesofDragonSlayersTarget:true},
          Odette: {toCastE:true, toCastQ:false,},
          Vodyanitsa: {toCastE:true, toCastQ:false,},
          Faruzan: {toCastE:false, toCastCharge:false, toCastQ:true,},
          TravelerCryo:{toCastE:true, toCastCharge:true, toCastQ:true, currFrostGlow:8, consumedFrostGlow:8},
        },
        { Vesna: {toCastE:true, toCastQ:false, ThrillingTalesofDragonSlayersTarget:false},
          Odette: {toCastE:true, toCastQ:false,},
          Vodyanitsa: {toCastE:true, toCastQ:false,},
          Faruzan: {toCastE:false, toCastCharge:false, toCastQ:true,},
          TravelerCryo:{toCastE:true, toCastCharge:true, toCastQ:true, currFrostGlow:8, consumedFrostGlow:8},
        },
      ];
      cycle_descList = ["有大有讨龙轮", "无大无讨龙轮"];
      cycle_buttonNames = ["有大有讨龙", "无大无讨龙"];
    }
    else{
      cycle_attrParamsList = [
        { Vesna: {toCastE:true, toCastQ:true, ThrillingTalesofDragonSlayersTarget:true},
          Odette: {toCastE:true, toCastQ:false,},
          Vodyanitsa: {toCastE:true, toCastQ:false,},
          Faruzan: {toCastE:false, toCastCharge:false, toCastQ:true,},
          TravelerCryo:{toCastE:true, toCastCharge:true, toCastQ:true, currFrostGlow:8, consumedFrostGlow:8},
        },
        { Vesna: {toCastE:true, toCastQ:false, ThrillingTalesofDragonSlayersTarget:true},
          Odette: {toCastE:true, toCastQ:false,},
          Vodyanitsa: {toCastE:true, toCastQ:false,},
          Faruzan: {toCastE:false, toCastCharge:false, toCastQ:true,},
          TravelerCryo:{toCastE:true, toCastCharge:true, toCastQ:true, currFrostGlow:8, consumedFrostGlow:8},
        },
      ];
      cycle_descList = ["有大轮", "无大轮"];
      cycle_buttonNames = ["有大轮", "无大轮"];
    }
  }
  const cycle_n = cycle_attrParamsList.length;
  const cycle_onfieldActionParamsList = cycle_attrParamsList.map(v=>{return {}});
  const cycle_offfieldActionParamsList = cycle_attrParamsList.map(v=>{return {}});
  const cycle_onfieldActionDetailsList = cycle_attrParamsList.map(v=>{return {}});
  const cycle_offfieldActionDetailsList = cycle_attrParamsList.map(v=>{return {}});
  const cycle_totalTimes = cycle_attrParamsList.map(v=>undefined);
  const cycle_cycleCounts = (cycle_n === 1)? [5] : [Math.ceil(5/cycle_n), Math.floor(5/cycle_n)];
  // 赋值
  configs.cycle = {
    attrParamsList: cycle_attrParamsList, 
    onfieldActionParamsList: cycle_onfieldActionParamsList,
    offfieldActionParamsList: cycle_offfieldActionParamsList,
    onfieldActionDetailsList: cycle_onfieldActionDetailsList,
    offfieldActionDetailsList: cycle_offfieldActionDetailsList,
    descList: cycle_descList,
    totalTimes: cycle_totalTimes,
    buttonNames : cycle_buttonNames,
    cycleCounts: cycle_cycleCounts,
  }
  // #endregion



  // #region 尾轮
  const end_attrParamsList = [// 只考虑奥黛塔 eqe 收尾
    {Vesna: {toCastE:true, toCastQ:true, ThrillingTalesofDragonSlayersTarget:true},
     Odette: {toCastE:true, toCastQ:false,},
     Vodyanitsa: {toCastE:true, toCastQ:false,},
     Faruzan: {toCastE:false, toCastCharge:false, toCastQ:true,},
     TravelerCryo:{toCastE:true, toCastCharge:true, toCastQ:true, currFrostGlow:8, consumedFrostGlow:8},
    }
  ];
  const end_onfieldActionParamsList = [{},];
  const end_offfieldActionParamsList = [{}];
  const end_onfieldActionDetailsList = [{},];
  const end_offfieldActionDetailsList = [{}];
  const end_descList = ["尾轮"];
  const end_totalTimes = [undefined]; // 表示等于计算结果，不额外赋值
  const end_buttonNames = ["尾轮"];
  // 赋值
  configs.end = {
    attrParamsList: end_attrParamsList, 
    onfieldActionParamsList: end_onfieldActionParamsList,
    offfieldActionParamsList: end_offfieldActionParamsList,
    onfieldActionDetailsList: end_onfieldActionDetailsList,
    offfieldActionDetailsList: end_offfieldActionDetailsList,
    descList: end_descList,
    totalTimes: end_totalTimes,
    buttonNames : end_buttonNames,
    cycleCounts: [1],
  }


  // #endregion

  return configs;
}




const characters = {"Vesna":Vesna, "Odette":Odette, "Vodyanitsa":Vodyanitsa, "Faruzan":Faruzan,}; // 队伍中的具体角色角色，一般有四个元素
const mainCarryID = "Vesna";


function get_sorted_character_IDs(characterIDs, orders){
  let n = orders.length;
  let orderTocharID = Object.fromEntries(Array.from({length:n}, (_, i) => {return [orders[i], characterIDs[i]]}));
  let sortedOrders = orders.filter(v=>(typeof v === "number")).sort((a,b)=>a-b);
  const sortedCharIDs = sortedOrders.map(o => orderTocharID[o]);
  return sortedCharIDs;
}

function get_swapTimeStamps(onfieldDurations){
  let swapTimeStamps = [0];
  for(let duration of onfieldDurations){
    swapTimeStamps.push(swapTimeStamps.at(-1) + duration);
  }
  return swapTimeStamps;
}

function get_action_array(teamInitialAttributes, characters, presetTotalTime=undefined, fixedTotalTime=undefined,
  isCyclic = true, params={isFirstCycle:false, isLastCycle:false}, 
  onfieldActionParams={}, onfieldActionDetails={}, offfieldActionParams={}, offfieldActionDetails={}){
  // 给定参与角色及其配置，返回对应的手法列表和总耗时
  // 先按照 order 排序，如果没有 order，说明此轮手法中这个角色不参加
  // offfieldActionParams = {charID : {params, segmentParams}}, offfieldActionDetails = {charID: {details, segmentDetails}}, separators就是swapTimeStamps
  const characterIDs = Object.keys(characters), orders = characterIDs.map(k => teamInitialAttributes[k].order);
  const sortedCharIDs = get_sorted_character_IDs(characterIDs, orders);
  let n_chars = sortedCharIDs.length;
  const onfieldActions = [];
  let swapTimeStamps = [0];
  const onfieldDurations = [];
  const maxCDs = [];
  /* 更新：行为列表本来应该是一个整体，按照角色轮换强硬分段并不明智，会让模型的泛用性降低；更合理的方法是在截断处用角色的 swap 来实现，
     不要拆分行为列表，这样后续进行判别拓展也更容易一些。
  */
  let currTS = 0;
  for(let charID of sortedCharIDs){// 前台
    const tempparams = {...onfieldActionParams[charID], ...params}, details = onfieldActionDetails[charID];
    const actionsObject = characters[charID].get_onfield_actionsObject(teamInitialAttributes[charID], tempparams, details);
    // 先加入这个角色的切换
    onfieldActions.push({talentMeta:characters[charID].talentMetas.swap, timestamp:currTS});
    // 校正生成的行为列表的时间戳
    let actions = actionsObject.actions; 
    for(let action of actions){action.timestamp = (typeof action.timestamp === "number")? action.timestamp+currTS : undefined};
    // 添加进全列表，并更新 "交换时间戳" 和当前时间戳
    onfieldActions.push(...actions); currTS += actionsObject.duration;
    onfieldDurations.push(actionsObject.duration);
    swapTimeStamps.push(currTS);
    maxCDs.push(characters[charID].get_max_CD(teamInitialAttributes[charID]));
  }
  // 如果 fixedTotalTime 给定，则将 totalTime 设为这个值，然后从 onfieldActions 中删去时间戳比这个值大的action
  let totalTime, origOnfieldDurations, isTruncated = false;
  if(fixedTotalTime >= swapTimeStamps.at(-1)){ // 固定时长不短于手法自然时长：无需裁剪，多余时间加在最后一段（空转）
    totalTime = fixedTotalTime;
    origOnfieldDurations = [...onfieldDurations];
    onfieldDurations[n_chars-1] += fixedTotalTime - swapTimeStamps.at(-1);
    swapTimeStamps = get_swapTimeStamps(onfieldDurations);
  }
  else if(fixedTotalTime > 0){
    let segIndex = swapTimeStamps.findIndex(x => (x >= fixedTotalTime)) - 1;
    maxCDs.splice(segIndex+1); // 将比 segIndex 大的段全部去除
    sortedCharIDs.splice(segIndex+1);
    onfieldDurations.splice(segIndex+1);
    // 将 onfieldActions 中时间戳大于 fixedTotalTime 的都删除
    let actionIndex = find_action_index_by_smaller_timestamp(fixedTotalTime, onfieldActions);
    onfieldActions.splice(actionIndex+1);
    // 重新计算参数
    onfieldDurations[segIndex] = fixedTotalTime - sum(onfieldDurations.slice(0, segIndex));
    swapTimeStamps = get_swapTimeStamps(onfieldDurations);
    n_chars = sortedCharIDs.length;
    totalTime = fixedTotalTime;
    origOnfieldDurations = [...onfieldDurations];
    isTruncated = true;
  }
  else{
    if(isCyclic){totalTime = Math.max(Math.max(...maxCDs), swapTimeStamps.at(-1), (presetTotalTime ?? 0));}
    else{totalTime = Math.max(swapTimeStamps.at(-1), (presetTotalTime ?? 0));}// 非循环轮不用管CD
    origOnfieldDurations = [...onfieldDurations];
    onfieldDurations[n_chars-1] += totalTime - swapTimeStamps.at(-1); // 如果冷却时间长，就把多出来的站场时间给最后一段
    swapTimeStamps = get_swapTimeStamps(onfieldDurations);
  }
  // 后台行为列表
  const offfieldActions = [];
  for(let idx in sortedCharIDs){
    let i = Number(idx), charID = sortedCharIDs[i];
    let char = characters[charID];
    let params = offfieldActionParams[charID]?.params, segmentParams = offfieldActionParams[charID]?.segmentParams;
    let details = offfieldActionDetails[charID]?.details, segmentDetails = offfieldActionDetails[charID]?.segmentDetails;
    const charOfffieldObject = char.get_offfield_actionsObject(teamInitialAttributes[charID], swapTimeStamps[i], totalTime,
                                                               isCyclic, params, details, segmentParams, segmentDetails, swapTimeStamps);
    offfieldActions.push(...charOfffieldObject.actions);
  }
  offfieldActions.sort((a,b) => a.timestamp - b.timestamp);

  // #region 根据触发条件判断本轮效果是否存在
  for(let idx in sortedCharIDs){
    let i = Number(idx), charID = sortedCharIDs[i];
    if(derive_effect_origID(get_artifactSet_ID(characters[charID].artifactSet)) === "HeartoftheFurnace_4"){
      let isStellarConduct = teamInitialAttributes[charID].isStellarConduct;
      let isStellarSwirl = teamInitialAttributes[charID].isStellarSwirl;
      if(!isStellarConduct && !isStellarSwirl){// 效果不触发
        for(let effect of characters[charID].artifactSet[0][0].setEffects[4]){
          let details = {ineffectiveEffectIDSet: new Set([effect.ID])};
          for(let action of onfieldActions){assign_details_to_action(action, details)};
          for(let action of offfieldActions){assign_details_to_action(action, details)};
        }
      }
    }
  }

  // #endregion

  // #region 根据效果的持续时间来判定失效行为
  /* {效果ID：[[失效范围1], ...]}, {效果ID：[效果生效的角色ID]}
  */
  let effectIneffectiveRanges = {}, effectTargets = {};
  for(let idx in sortedCharIDs){
    let i = Number(idx), charID = sortedCharIDs[i];
    if(characters[charID].weapon.name === "讨龙英杰谭"){// 讨龙
      // 看看是不是第一轮，是的话要开局卡讨龙，讨龙角色 -> 主C -> 开局角色，再次切回主C时剩余时间为 10-1-swapTimeStamps[i+1]
      let buffDuration = 10;
      if(params.isFirstCycle){
        buffDuration = Math.max(0, buffDuration - (1 + swapTimeStamps[i+1]));
      }
      for(let effect of characters[charID].weapon.effects){
        effectIneffectiveRanges[effect.ID] = get_effect_ineffective_ranges([swapTimeStamps[i+1]], buffDuration, totalTime, isCyclic);
        let nextCharID = sortedCharIDs[(i+1)%n_chars];
        if(teamInitialAttributes[nextCharID].ThrillingTalesofDragonSlayersTarget === true){
          effectTargets[effect.ID] = [nextCharID];
        }
        else{effectTargets[effect.ID] = []};
      }
    };
    if(derive_effect_origID(get_artifactSet_ID(characters[charID].artifactSet)) === "NoblesseOblige_4" && teamInitialAttributes[charID].toCastQ===true){
      // 宗室, 先找到角色释放大招的时间戳，以此为起始点
      let indices = findAllIndex(onfieldActions, (action)=>{
        return action.talentMeta.attackType === "burst" && action.timestamp != undefined && action.talentMeta.characterID === charID
                && action.talentMeta.isOnfield === true;
      });
      let startTSs = indices.map(idx => (onfieldActions[idx].timestamp));
      if(startTSs.length === 0){startTSs = [swapTimeStamps[i+1]];} // 空的话就用下一个角色的登场时间为起始
      for(let effect of characters[charID].artifactSet[0][0].setEffects[4]){
        effectIneffectiveRanges[effect.ID] = get_effect_ineffective_ranges(startTSs, 12, totalTime, isCyclic);
        effectTargets[effect.ID] = sortedCharIDs;
      }
    };

    if(derive_effect_origID(get_artifactSet_ID(characters[charID].artifactSet)) === "TenacityoftheMillelith_4" && teamInitialAttributes[charID].toCastE===true){
      // 千岩，找到角色放战技的时间戳为起始点，以后台战技持续时间+3为效果持续时间
      let indices = findAllIndex(onfieldActions, (action)=>{
        return action.talentMeta.attackType === "skill" && action.timestamp != undefined && action.talentMeta.characterID === charID
                && action.talentMeta.isOnfield === true;
      });
      let startTSs = indices.map(idx => (onfieldActions[idx].timestamp));
      const durationDict = {Vodyanitsa:16+3, TravelerCryo:3 + (teamInitialAttributes["TravelerCryo"]?.constellation >= 4? 15:12)}
      let duration = durationDict[charID]; //效果持续时间
      if(startTSs.length === 0){startTSs = [swapTimeStamps[i+1]];} // 空的话就用下一个角色的登场时间为起始
      for(let effect of characters[charID].artifactSet[0][0].setEffects[4]){
        effectIneffectiveRanges[effect.ID] = get_effect_ineffective_ranges(startTSs, duration, totalTime, isCyclic);
        effectTargets[effect.ID] = sortedCharIDs;
      }
    };
  }
  /* 给前台和后台actions 附加细节 */
  for(let effectID of Object.keys(effectIneffectiveRanges)){
    const selectedCharIDSet = new Set(effectTargets[effectID]);
    const set = new Set([effectID]);
    for(let [leftTS, rightTS] of effectIneffectiveRanges[effectID]){
      assign_details_to_actions_between_timestamps(onfieldActions, {ineffectiveEffectIDSet:set}, leftTS, rightTS, selectedCharIDSet);
      assign_details_to_actions_between_timestamps(offfieldActions, {ineffectiveEffectIDSet:set}, leftTS, rightTS, selectedCharIDSet);
    }
  }
  // #endregion


  // #region 根据效果的生效次数来判定失效行为
  /* 单独处理沃雅妮莎的领唱和重唱效果 */
  let actionIndices = findAllIndex(onfieldActions, (action)=>{return (action.talentMeta.characterID==="Vodyanitsa" && action.talentMeta.ID==="e0")});
  let startTSs = actionIndices.map(idx => onfieldActions[idx].timestamp);
  let effectActivatedTimestamps = {}, effectMaxTriggerCounts = {}, effects = {};
  effectIneffectiveRanges = {};
  // 沃雅妮莎的领唱效果
  let soloMark = false, soloEffect = Vodyanitsa.effects[1];
  for(let idx in sortedCharIDs){
    let i = Number(idx), charID = sortedCharIDs[i];
    if(charID === "Vodyanitsa"){ // 因为羽毛很快就消耗完，这里对沃雅妮莎的效果做限制
      let effect = soloEffect;
      effects[effect.ID] = effect;
      effectMaxTriggerCounts[effect.ID] = 25;
      effectActivatedTimestamps[effect.ID] = [startTSs[0]] ?? [swapTimeStamps[i] + 1];
      effectIneffectiveRanges[effect.ID] = get_effect_ineffective_ranges(startTSs, 20, totalTime, isCyclic);
      soloMark = true;
    }
  }
  if(soloMark){
    assign_effect_detials_to_actions(onfieldActions, teamInitialAttributes, totalTime, effects, effectActivatedTimestamps, 
          effectIneffectiveRanges, effectMaxTriggerCounts, isCyclic);
  }
  else if(isTruncated && Object.keys(characters).includes("Vodyanitsa")){// 因为截断导致的沃雅妮莎不登场，这时候无条件排除
    for(let action of onfieldActions){assign_details_to_action(action, {ineffectiveEffectIDSet:new Set([soloEffect.ID])})};
  }
  
  // 沃雅妮莎的重唱效果
  effectActivatedTimestamps = {}, effectMaxTriggerCounts = {}, effects = {}, effectIneffectiveRanges = {};
  let ensembleMark = false, ensembleEffect = Vodyanitsa.effects[3];
  for(let idx in sortedCharIDs){
    let i = Number(idx), charID = sortedCharIDs[i];
    if(charID === "Vodyanitsa"){ // 因为羽毛很快就消耗完，这里对沃雅妮莎的效果做限制
      let effect = ensembleEffect;
      effects[effect.ID] = effect;
      effectMaxTriggerCounts[effect.ID] = 10;
      effectActivatedTimestamps[effect.ID] = [startTSs[0]] ?? [swapTimeStamps[i] + 1];
      effectIneffectiveRanges[effect.ID] = get_effect_ineffective_ranges(startTSs, 20, totalTime, isCyclic);
      ensembleMark = true;
    }
  }
  if(ensembleMark){
    assign_effect_detials_to_actions(offfieldActions, teamInitialAttributes, totalTime, effects, effectActivatedTimestamps, 
          effectIneffectiveRanges, effectMaxTriggerCounts, isCyclic);
  }
  else if(isTruncated && Object.keys(characters).includes("Vodyanitsa")){
    for(let action of offfieldActions){assign_details_to_action(action, {ineffectiveEffectIDSet:new Set([ensembleEffect.ID])})};
  }
  
  // #endregion

  // #region 根据效果实际触发的时间来设置初始参数
/*   if(isCyclic){
    // 循环时，冰旅行者的寒辉层数一开始不是0，从第一次放Q的位置开始计算，到循环结尾的层数为初始层数
    if(sortedCharIDs.includes("TravelerCryo")){
      let QIndex = onfieldActions.findIndex(x => (x.talentMeta?.characterID==="TravelerCryo" && x.talentMeta?.attackType==="burst" 
                                              && x.talentMeta?.isOnfield === true
                                            ));
      let startTS = (QIndex < 0)? 0 : onfieldActions[QIndex].timestamp + EPSILON;
      let eOffIndices = findAllIndex(offfieldActions, (x) => (x.talentMeta?.characterID==="TravelerCryo" && x.talentMeta?.ID === "eOff_ice_crystal" 
                                                                && x.timestamp > startTS));
      let count = eOffIndices.length;
      teamInitialAttributes["TravelerCryo"].currFrostGlow = count;
    }
  } */
  // #endregion

  // 聚合
  merge_actions_by_ineffectiveEffectIDSet(offfieldActions);
  // 拼接
  const actions = [...onfieldActions, ...offfieldActions];
  return [actions, totalTime];
};





// 不需要开发者修改的部分
const initialAdditionalAttributeParams = {
    Vesna : {ThrillingTalesofDragonSlayersTarget:true, toCastE:true, toCastQ:true, isStellarSwirl:true,
       isStellarConduct:false, order:10000}, // order为角色登场顺序
    Odette : {toCastE:true, toCastQ:false, isStellarSwirl:true, isStellarConduct:false, order:1},
    Vodyanitsa : {toCastE:true, toCastQ:false, isStellarSwirl:true, isStellarConduct:false, order:999},
    Faruzan : {toCastE:true, toCastQ:true, isStellarSwirl:true, isStellarConduct:false, order:100},
    TravelerCryo : {toCastE:true, toCastQ:true, toCastCharge:true, isStellarSwirl:true, isStellarConduct:false, order:50},
};

const additionalAttributeParams = {
    Vesna : {}, // order为角色登场顺序
    Odette : {},
    Vodyanitsa : {},
    Faruzan : {},
}; // 额外面板参数，会附加给对应角色的初始面板
function initialize_additionalAttributeParams(){
  for(let charID of Object.keys(initialAdditionalAttributeParams)){
    additionalAttributeParams[charID] = {...initialAdditionalAttributeParams[charID]};
  }
}
initialize_additionalAttributeParams();


const availableCharIDSet = new Set(Object.keys(initialAdditionalAttributeParams));
function update_additionalAttributeParams(newAttrParams){
  initialize_additionalAttributeParams();
  for(let charID of Object.keys(newAttrParams)){
    if(availableCharIDSet.has(charID)){Object.assign(additionalAttributeParams[charID], newAttrParams[charID])};
  }
}

function merge_multipler_sets(setList){
  const merged = new Set();
  for (const set of setList) {
    for (const item of set) {
      merged.add(item);
    }
  }
  return merged;
}


let characterEffects = {}; // 每个角色的效果
function initialize_characterEffects(){
  characterEffects = Object.keys(characters).reduce((result, obj) => {
    result[obj] = {toUpdate:true, dynamic:[], net:[], permanent:[]}; // toUpdate: 当用户修改对应角色配置时置为true，表示需要更新，更新后置为false
    return result;
  }, {});
}
initialize_characterEffects();

const teamEffects = [], teamNetEffects = [], teamPermanentEffects = [];  // 队伍效果（剔除永久）、队伍净效果（剔除永久）、队伍永久效果
let toUpdateTeamEffects = true;  // 当涉及到角色圣遗物套装变换、武器变化、命座变化时，这个值被置为true，表示队伍效果需要更新
let teamTotalParameters = {}; // 汇总全队的 teamParameters
function initialize_teamTotalParameters(){
  teamTotalParameters = {};
  for(let char of Object.values(characters)){// 按角色顺序汇总 teamParameters
    Object.assign(teamTotalParameters, char.weapon.teamParameters);
    Object.assign(teamTotalParameters, char.artifactSet.teamParameters);
    Object.assign(teamTotalParameters, char.teamParameters);
  }
}
initialize_teamTotalParameters();

const teamInitialAttributes = {}, teamNetAttributes = {}, teamSnapshotAttributes = {}, 
      teamCurrentAttributes = {};
const teamMaxNetAttributes= {}, teamMaxCurrentAttributes = {};
let toUpdateAttributes = {}; // 当角色的配置被修改时，需要修改初始面板，在这里表示
function initialize_toUpdateAttributes(){
  toUpdateAttributes = Object.keys(characters).reduce((result, ID) => {result[ID]=true; return result;}, {});
}
initialize_toUpdateAttributes();


// #region 角色面板和效果计算相关
let onfieldCharacterID = null;  // 前台角色的ID
let teamCost = 0; // 全队的金数
function update_team_cost(){
  teamCost = 0;
  for(let char of Object.values(characters)){
    if(char.rarity == 5){teamCost += char.constellation+1};
    if(char.weapon.rarity == 5){teamCost += char.weapon.rank};
  }
}
function clearObject(obj){
  Object.keys(obj).forEach(key => {delete obj[key];});
}
function update_characters(){// 当角色选择开启时使用，根据选择结果更新
  clearObject(teamInitialAttributes);
  clearObject(teamNetAttributes);
  clearObject(teamCurrentAttributes);
  clearObject(teamMaxNetAttributes);
  clearObject(teamMaxCurrentAttributes);
  clearObject(characters);
  toUpdateTeamEffects = true;
  Object.assign(characters, {...requiredCharacters, ...selectedCharacters});
  onfieldCharacterID = null;
  update_team_cost();
  initialize_characterEffects();
  initialize_teamTotalParameters();
  initialize_toUpdateAttributes();
}

function get_constellation_desc_array(charID, constellation){// 给定角色和命座值，返回对应效果描述构成的列表
  const char = characters[charID];
  const allEffects = [];
  for(let i=0; i<=constellation; i++){
    allEffects.push(...char.constellationEffects[i]);
  }
  return allEffects.map(item => item.desc+";");
}
function get_effective_substat_count_desc(charID){
  const char = characters[charID];
  let string = `有效词条个数为${(char.effectiveSubStatCount).toFixed(2)}, 其中有效词条为`;
  string += Object.keys(char.effectiveSubStats).map(stat => STATS[stat]).join("、") + ", ";
  string += "词条的权值分别为" + Object.values(char.effectiveSubStats).map(value=>value.toString()).join("、")
  return string;
};


function update_character_effects(){ // 更新所有角色的角色效果
  // 角色效果，包括技能效果、固有天赋、武器效果、圣遗物效果
  for(let [key, char] of Object.entries(characters)){
    if(characterEffects[key].toUpdate){
      let dynamic = [], net = [], permanent = [];
      // 先凑齐所有效果
      let allEffects = [...char.effects];
      if(char.weapon !== null){allEffects.push(...char.weapon.effects)};
      for(let set of char.artifactSet){
        if(set[1] >= 4){allEffects.push(...set[0].setEffects[2], ...set[0].setEffects[4])}
        else if(set[1] >= 2){allEffects.push(...set[0].setEffects[2])};
      };
      for(let j = 0; j <= char.constellation; j++){allEffects.push(...char.constellationEffects[j])};
      // 分类
      for (let effect of allEffects){
        if(effect.isPermanent){permanent.push(effect)}
        else{
          dynamic.push(effect);
          if(effect.isNet){net.push(effect)};
        };
      };
      // 赋值
      characterEffects[key].dynamic = dynamic;
      characterEffects[key].net = net;
      characterEffects[key].permanent = permanent;
      characterEffects[key].toUpdate = false;
    }
  }
}
function update_team_effects(){
  // 用户修改的配置将作用在 characters 的元素上，此函数根据 characters 更新所有的效果列表
  if(toUpdateTeamEffects){
    teamEffects.length = 0;
    teamNetEffects.length = 0;
    teamPermanentEffects.length = 0;
    // 先获得共鸣效果
    let resonance_effects = get_elemental_resonance_effects(characters);
    for (let effect of resonance_effects){
      if(effect.isPermanent){teamPermanentEffects.push(effect)}
      else{
        teamEffects.push(effect)
        if(effect.isNet){teamNetEffects.push(effect)};
      };
    };
    // 更新角色效果，并将角色效果添加到队伍效果中
    update_character_effects();
    for(let [ID, details] of Object.entries(characterEffects)){
      teamPermanentEffects.push(...details.permanent);
      teamEffects.push(...details.dynamic);
      teamNetEffects.push(...details.net);
    }
    // 修改指示器
    toUpdateTeamEffects = false;
  }
}
function combine_buffs(buffs){
  // 将所有增益字典合成一个字典
  return buffs.reduce((result, obj) => {
      for (let [key, value] of Object.entries(obj)) {
        if(typeof value === "number" && (result[key] === undefined || typeof result[key] === "number")){
          result[key] = (result[key] || 0) + value;
        }
        else{result[key] = value;}  // 布尔开关等直接覆盖
      }
      return result;
  }, {});
}
function get_stat_buff_detail_value_string(stat, value){ // 增益详情中词条值的字符串形式：固定值词条保留两位小数，百分比词条按百分比保留一位小数
  return FLAT_STAT_SET.has(stat) ? value.toFixed(2)+"" : (value*100).toFixed(1)+"%";
}
function merge_stat_buff_details(statBuffDetails, desc, effectBuff){
  // 将单个效果给予的词条增益记录到 statBuffDetails 中，用对象记录，包含{name(效果名称), stat, value, 其他需要的参数}
  // 效果名称为效果描述 desc 按照字符"：" split 之后的第一个元素
  let effectName = (desc || "").split("：")[0];
  for(let [k, v] of Object.entries(effectBuff)){
    if(STAT_KEY_SET.has(k)){ // 只记录词条增益，技能等级、其他参数等不记录
      if(statBuffDetails[k] === undefined){statBuffDetails[k] = []};
      let item = {name:effectName, stat:k, value:v, };
      if(k === "flatDMG"){ // 对于羽毛增益，需要记录其他参数
        item.singleFlatDMG = effectBuff.singleFlatDMG || v;
        item.hitnum = effectBuff.hitnum || 1;
        item.repetitionCount = effectBuff.repetitionCount || 1;
        item.consumption = effectBuff.consumption ?? null;
        item.remaining = effectBuff.remaining ?? null;
      }
      statBuffDetails[k].push(item);
    }
  }
}

function derive_effect_origID(IDText){// 获得武器或圣遗物套装效果的原本ID
  // 武器和圣遗物可能存在多个同类实例，它们的ID命名规则为 名称+可能的数字，将数字去除后就是武器或圣遗物的原始ID；
  // 将它们效果ID中的"_"分割的第一个元素的数字去掉，就是效果的原始ID
  const list = IDText.split("_");
  const index = list[0].search(/\d/); // 查找第一个数字 0-9
  if(index >= 0){list[0] = list[0].slice(0, index);}
  const origID = list.join("_");
  return origID;
};

function derive_total_buff_from_effects(characterID, effects, teamInitialAttributes, teamNetAttributes, action, 
  isOnfield = action.talentMeta?.isOnfield ?? (characterID === onfieldCharacterID)){
  // 获得 characterID 对应角色当前 effects 扣除 ineffectiveEffectIDSet 之后对应的增益
  // 其中角色净面板为 teamNetAttributes(字典)，行为为 action(字典)
  // 返回值为列表，第一个元素为合并的buff，第二个元素为buff描述组成的列表，第三个元素为词条增益详情 statBuffDetails
  // 效果需要考虑 isOnly 参数，如果有，那么只生效一个 
  let temp_buffs = [], buffDescs = [], statBuffDetails = {};
  let ineffectiveEffectIDSet = action.ineffectiveEffectIDSet || new Set([]);
  let ineffectiveEffectOwnerIDSet = action.ineffectiveEffectOwnerIDSet || new Set([]);
  const onlyEffectIDSet = new Set([]);
  for(let effect of effects){
    let isEffective = true;
    if(ineffectiveEffectIDSet.has(effect.ID) || ineffectiveEffectOwnerIDSet.has((effect.ID).split("_")[0])){isEffective = false;}
    if(action.ineffectiveEquivEffectIDSet){
      let origID = derive_effect_origID(effect.ID);
      if(action.ineffectiveEquivEffectIDSet.has(origID)){isEffective = false};
    }
    if(isEffective){
      let mark = true;
      for(let [key, value] of Object.entries(effect.condition)){
        if(key === "characterIDs"){mark = mark && (value.includes(characterID))}
        else if(key === "excludedCharacterIDs"){mark = mark && (!value.includes(characterID))}
        else if(key === "elements"){mark = mark && (value.includes(action.talentMeta.element))}
        else if(key === "excludedElements"){mark = mark && (!value.includes(action.talentMeta.element))}
        else if(key === "isOnfield"){mark = mark && (value === isOnfield)}
        else if(key === "rxndmgs"){mark = mark && (value.includes(action.talentMeta.rxndmg))}
        else if(key === "excludedRxndmgs"){mark = mark && (!value.includes(action.talentMeta.rxndmg))}
        else if(key === "attackTypes"){mark = mark && (value.includes(action.talentMeta.attackType))}
        else if(key === "excludedAttackTypes"){mark = mark && (!value.includes(action.talentMeta.attackType))}
        else if(key === "talentMetaIDs"){mark = mark && (value.includes(action.talentMeta.ID))}
        else if(key === "check"){mark = mark && value(teamInitialAttributes, characterID, action)}
        else{
          let attr = teamInitialAttributes[characterID];
          if(attr == undefined){mark = false}
          else{mark = mark && (attr[key] === value)};
        }; // 此时必须字段匹配
        if(mark === false){break;};
      }
      if(mark){
        let toWork = true;
        if(effect.isOnly){// 检测唯一性
          let origID = derive_effect_origID(effect.ID);
          if(onlyEffectIDSet.has(origID)){toWork = false;}
          else{onlyEffectIDSet.add(origID);}
        }
        if(toWork){
          let effectBuff = effect.effect(teamInitialAttributes, teamNetAttributes, action);
          temp_buffs.push(effectBuff);
          buffDescs.push(effect.desc);
          merge_stat_buff_details(statBuffDetails, effect.desc, effectBuff);
        }
      };
    }
  }
  let buff = combine_buffs(temp_buffs);
  return [buff, buffDescs, statBuffDetails];
};
function calculate_bonus_stats(stats){
  // 计算受到百分比增益和固定值增益后的攻击、防御、生命数值
  stats.atk = stats.batk * (1 + stats.atkp) + stats.atkf;
  stats.def = stats.bdef * (1 + stats.defp) + stats.deff;
  stats.hp = stats.bhp * (1 + stats.hpp) + stats.hpf;
}
function derive_buffed_character_attributes(initialAttributes, buff, buffDescs, statBuffDetails = {}, inplace = false){
  // initialAttributes 为角色的初始面板，buff为总增益字典，得到增益后的面板，inplace表示要不要在初始面板上修改
  // statBuffDetails 为词条增益详情，会被合并进生成面板的 statBuffDetails 中
  let attributes;
  if(inplace){attributes = initialAttributes}
  else{attributes = structuredClone(initialAttributes)};
  for(let [k, v] of Object.entries(buff)){
    if(STAT_KEY_SET.has(k)){attributes.stats[k] += v} // 当前增益是词条增益
    else if(TALENT_KEY_SET.has(k)){attributes.talentLevels[k] += v} // 当前是技能等级提升
    else{ // 此时是效果需要的其他参数，直接覆盖原来的值
      if(attributes[k] !== undefined){attributes[k] = v};
    };
  };
  calculate_bonus_stats(attributes.stats);
  attributes.buffDescs.push(...buffDescs);
  for(let [k, detailList] of Object.entries(statBuffDetails)){ // 合并词条增益详情
    if(attributes.statBuffDetails[k] === undefined){attributes.statBuffDetails[k] = []};
    attributes.statBuffDetails[k].push(...detailList);
  }
  return attributes;
};
function convert_buff_from_artifacts(artifacts){
  // 将圣遗物词条给的增益转化为buff形式处理
  let buff = {};
  for(let [key, meta] of Object.entries(artifacts)){
    buff[meta.mainStat] = (buff[meta.mainStat] || 0) + ARTIFACT_MAIN_STATS[key][meta.mainStat].value;
    for(let [substat, number] of Object.entries(meta.subStats)){
      buff[substat] = (buff[substat] || 0) + number * ARTIFACT_SUB_STATS[substat].avg;
    }
  };
  return buff;
};
function convert_buff_from_weapon(weapon){
  // 将武器的白值和主词条转化为buff形式处理
  let buff = {batk : weapon.batk};
  buff[weapon.stat] = weapon.statValue;
  return buff;
};

function get_character_all_nonpermanent_effect_ID_set(charID){
  update_character_effects();
  const nonpermanentEffectIDs = [...characterEffects[charID].dynamic.map(effect => effect.ID), ...characterEffects[charID].net.map(effect => effect.ID)];
  return new Set(nonpermanentEffectIDs);
}


function initialize_all_attributes(){ // 初始化 toUpdateAttributes 中为true的角色的所有面板
  update_team_effects();
  let characterIDs = Object.keys(toUpdateAttributes).filter(key => toUpdateAttributes[key]);
  for(let key of characterIDs){
    /* 初始面板，角色基础值 + 圣遗物词条收益 + 武器收益 + 永久效果收益 */
    let char = characters[key];
    teamInitialAttributes[char.ID] = {
      ID: char.ID,
      element: char.element,
      level : char.level,
      constellation: char.constellation,
      talentLevels: {...char.talentLevels},
      buffDescs : [], // 受到增益buff的描述列表
      statBuffDetails : {}, // 各词条受到的增益效果详情，key为词条ID，value为显示增益详情的列表
      statBaseDetails : {}, // 各词条的基础数值详情(角色基础数值、武器、突破属性、圣遗物词条)，key为词条ID，value为{name, value, cls}组成的列表
    };
    // 构建面板基础数值详情，用于词条详情弹窗展示
    let statBaseDetails = {};
    const addBaseDetail = (k, name, value, cls) => {
      if(statBaseDetails[k] === undefined){statBaseDetails[k] = []};
      statBaseDetails[k].push({name, value, cls});
    };
    addBaseDetail("batk", "角色基础攻击", char.base[char.level].atk, "v-red"); // 角色基础数值，红色
    addBaseDetail("bdef", "角色基础防御", char.base[char.level].def, "v-red");
    addBaseDetail("bhp", "角色基础生命", char.base[char.level].hp, "v-red");
    addBaseDetail("batk", char.weapon.name, char.weapon.batk, "v-red"); // 武器基础攻击力，红色
    addBaseDetail("cr", "角色初始暴击率", 0.05, "v-red"); // 角色初始暴击率，红色
    addBaseDetail("cd", "角色初始暴击伤害", 0.5, "v-red"); // 角色初始暴击伤害，红色
    addBaseDetail(char.stat, "突破属性", char.statValue, "v-blue"); // 角色突破属性，蓝色
    addBaseDetail(char.weapon.stat, char.weapon.name, char.weapon.statValue, "v-blue"); // 武器主词条，蓝色
    // 圣遗物主词条、副词条分别按词条求和，金色
    let artifactMainSum = {}, artifactSubSum = {};
    for(let [slot, meta] of Object.entries(char.artifacts)){
      artifactMainSum[meta.mainStat] = (artifactMainSum[meta.mainStat] || 0) + ARTIFACT_MAIN_STATS[slot][meta.mainStat].value;
      for(let [substat, number] of Object.entries(meta.subStats)){
        artifactSubSum[substat] = (artifactSubSum[substat] || 0) + number * ARTIFACT_SUB_STATS[substat].avg;
      }
    }
    for(let [k, v] of Object.entries(artifactMainSum)){if(v !== 0){addBaseDetail(k, "圣遗物主词条", v, "v-gold")}};
    for(let [k, v] of Object.entries(artifactSubSum)){if(v !== 0){addBaseDetail(k, "圣遗物副词条", v, "v-gold")}};
    teamInitialAttributes[char.ID].statBaseDetails = statBaseDetails;
    let temp_stats = Object.fromEntries((Object.keys(STATS)).map(k => [k, 0]));
    temp_stats.batk = char.base[char.level].atk;
    temp_stats.bdef = char.base[char.level].def;
    temp_stats.bhp = char.base[char.level].hp;
    [temp_stats.cr, temp_stats.cd] = [0.05,0.50];
    temp_stats[char.stat] += char.statValue;
    temp_stats.levelMult = get_levelMult(char.level);
    temp_stats.er = 1.0;
    temp_stats.baseDMGMult = 1.0;
    teamInitialAttributes[char.ID]["stats"] = temp_stats;
    Object.assign(teamInitialAttributes[char.ID], char.weapon.parameters);
    Object.assign(teamInitialAttributes[char.ID], char.weapon.variables);
    Object.assign(teamInitialAttributes[char.ID], char.artifactSet.parameters);
    Object.assign(teamInitialAttributes[char.ID], char.artifactSet.variables);
    Object.assign(teamInitialAttributes[char.ID], char.parameters);
    Object.assign(teamInitialAttributes[char.ID], char.variables);
    Object.assign(teamInitialAttributes[char.ID], teamTotalParameters);
    Object.assign(teamInitialAttributes[char.ID], additionalAttributeParams[char.ID]); // 附加额外参数, 优先级最高
    // 圣遗物词条收益
    let artifact_buff = convert_buff_from_artifacts(char.artifacts);
    // 武器收益
    let weapon_buff = convert_buff_from_weapon(char.weapon);
    // 永久效果收益
    let [permanent_buff, buffDescs, statBuffDetails] = derive_total_buff_from_effects(char.ID, teamPermanentEffects, {}, {}, {});
    // 叠加buff，并作用在基础值上
    let buff = combine_buffs([artifact_buff, weapon_buff, permanent_buff]);
    derive_buffed_character_attributes(teamInitialAttributes[char.ID], buff, buffDescs, statBuffDetails, true);

    // 其他面板，初始化都是 undefined
    teamNetAttributes[char.ID] = undefined;
    teamSnapshotAttributes[char.ID] = undefined;
    teamCurrentAttributes[char.ID] = undefined;
    teamMaxNetAttributes[char.ID] = undefined;
    teamMaxCurrentAttributes[char.ID] = undefined;

    toUpdateAttributes[key] = false;
  };
  return characterIDs;
};


function derive_max_total_buff_from_effects(characterID, effects, teamInitialAttributes, teamMaxNetAttributes, isOnfield){
  // 获得给定角色的最大可能buff，即考虑 获益角色ID、排除角色ID、是否前台、角色属性、其他字段、check。
  // 返回值为列表，第一个元素为合并的buff，第二个元素为buff描述组成的列表，第三个元素为词条增益详情 statBuffDetails
  let temp_buffs = [], buffDescs = [], statBuffDetails = {};
  const onlyEffectIDSet = new Set([]);
  for(let effect of effects){
    let mark = true;
    for(let [key, value] of Object.entries(effect.condition)){
      if(key === "characterIDs"){mark = mark && (value.includes(characterID))}
      else if(key === "excludedCharacterIDs"){mark = mark && (!value.includes(characterID))}
      else if(key === "isOnfield"){mark = mark && (value === isOnfield)}
      else if(key === "elements"){mark = mark && value.includes(teamInitialAttributes[characterID].element)}// 对比角色属性代替伤害的属性
      else if(key === "excludedElements"){mark = mark && !value.includes(teamInitialAttributes[characterID].element)}
      else if(key === "rxndmgs" || key === "excludedRxndmgs" || key === "attackTypes" || key === "excludedAttackTypes" 
              || key === "talentMetaIDs"){}//什么都不做，静默处理
      else if(key === "check"){mark = mark && value(teamInitialAttributes, characterID, {talentMeta:{}})}
      else{
        let attr = teamInitialAttributes[characterID];
        if(attr == undefined){mark = false}
        else{mark = mark && (attr[key] === value)};
      }; // 此时必须字段匹配
      if(mark === false){break;};
    }
    if(mark){
      let toWork = true;
      if(effect.isOnly){// 检测唯一性
        let origID = derive_effect_origID(effect.ID);
        if(onlyEffectIDSet.has(origID)){toWork = false;}
        else{onlyEffectIDSet.add(origID);}
      }
      if(toWork){
        let effectBuff = effect.effect(teamInitialAttributes, teamMaxNetAttributes, {}, true);
        temp_buffs.push(effectBuff);
        buffDescs.push(effect.desc);
        merge_stat_buff_details(statBuffDetails, effect.desc, effectBuff);
      }
    };
  }
  let buff = combine_buffs(temp_buffs);
  return [buff, buffDescs, statBuffDetails];
}
function get_displayed_character_attributes(characterID, isOnfield){ // 得到被展示角色的面板，区分前后台
  initialize_all_attributes(); // 初始化
  let mark = false;
  let checkValue = null;
  switch(characterDisplayAttributeType[onDisplayCharacterID]){
    case "initial":
      checkValue = null;
      break;
    case "onField":
      checkValue = true;
      break;
    case "offField":
      checkValue = false;
      break;
  }
  let isNotMatched = isOnfield !== checkValue;
  for(let charID of Object.keys(characters)){ // 净面板更新
    if(teamMaxNetAttributes[charID] == undefined || isNotMatched){
      let [netBuff, buffDescs, netStatBuffDetails] = derive_max_total_buff_from_effects(charID, teamNetEffects, teamInitialAttributes, teamInitialAttributes, isOnfield);
      teamMaxNetAttributes[charID] = derive_buffed_character_attributes(teamInitialAttributes[charID], netBuff, buffDescs, netStatBuffDetails);
      mark = true;
    }
  }
  if(mark || teamMaxCurrentAttributes[characterID] == undefined){// 需要更新当前角色最大可能面板
    let [buff, buffDescs, statBuffDetails] = derive_max_total_buff_from_effects(characterID, teamEffects, teamInitialAttributes, teamMaxNetAttributes, isOnfield);
    teamMaxCurrentAttributes[characterID] = derive_buffed_character_attributes(teamInitialAttributes[characterID], buff, buffDescs, statBuffDetails);
  }
  return teamMaxCurrentAttributes[characterID];
}

// #endregion


/*伤害计算函数部分*/


const enemyLevel = 110, enemyRes = {pyro:0.10, hydro:0.10, electro:0.10, cryo:0.10, dendro:0.10, geo:0.10, anemo:0.10};
function get_resistance_multiplier(stats, element){
  // 计算抗性系数
  let resistance = (enemyRes[element] - stats[element + "DeRes"]);
  if(resistance < 0){return 1-0.5*resistance}
  else if(resistance < 0.75){return 1 - resistance}
  else{return 1/(4*resistance+1)}
};
function get_defence_multiplier(stats, level){
  // 计算防御系数
  return (level + 100) / (level+100 + (enemyLevel+100)*(Math.max(1-stats.defReduction, 0.1)*(Math.max(1-stats.defIgnore, 0))));
};
function get_crit_multiplier(stats){
  // 计算暴击乘区（期望）
  let cr = Math.max(0, Math.min(stats.cr, 1)), cd = stats.cd;
  return 1 + cr * cd;
};
function get_elemental_mastery_factor(stats, rxndmg){
  // 获得当前反应伤害类型的精通因子
  if(CATALYZE_SET.has(rxndmg)){return 5*stats.em/(stats.em+1200)}
  else if(TRANSFORMATIVE_SET.has(rxndmg)){return 16*stats.em/(stats.em + 2000)}
  else if(AMPLIFYING_SET.has(rxndmg)){return 2.78*stats.em/(stats.em+1400)}
  else if(LUNAR_SET.has(rxndmg) || STELLAR_SET.has(rxndmg)){return 6*stats.em/(stats.em+2000)}
  else {return 0};
};
function get_reaction_multiplier(element, rxndmg, parameters = {}){
  // 给定伤害的元素和反应伤害类型，返回反应乘区
  switch(rxndmg){
    case "none":
      return 1.0;
      break;
    case "vaporize":
      if(element === "hydro"){return 2.0}
      else if(element === "pyro"){return 1.5}
      else {return 1.0};
      break;
    case "melt":
      if(element === "pyro"){return 2.0}
      else if(element === "cryo"){return 1.5}
      else {return 1.0};
      break;
    case "overload":
      return 2.75;
      break;
    case "superconduct":
      return 1.5;
      break;
    case "swirl":
      return 0.6;
      break;
    case "electrocharged":
      return 2.0;
      break;
    case "shatter":
      return 3.0;
      break;
    case "burning":
      return 0.25;
      break;
    case "bloom":
      return 2.0;
      break;
    case "hyperbloom":
      return 3.0;
      break;
    case "burgeon":
      return 3.0;
      break;
    case "aggravate":
      return 1.15;
      break;
    case "spread":
      return 1.25;
      break;
    case "directLunarCharged":
      return 3.0;
      break;
    case "directLunarBloom":
      return 1.0;
      break;
    case "directLunarCrystallize":
      return 1.6;
      break;
    case "reactionLunarCharged":
      return 1.8;
      break;
    case "reactionLunarCrystallize":
      return 0.96;
      break;
    case "directStellarConduct": // 星超导的反应乘区值看层数确定
      let stacks = (parameters.stacks || 0);
      let dict = {0:1, 1:1.45, 2:1.5, 3:1.54, 4:1.6, 5:1.64, 6:1.7, 7:1.75, 8:1.79, 9:1.85, 10:1.89, 11:1.95, 12:2};
      return dict[stacks];
      break;
    case "directStellarSwirl":
      return 1.0;
      break;
    case "reactionStellarSwirl":
      if(element === "anemo"){return 0.75}
      else if(element === "cryo"){
        let stacks = (parameters.stacks || 1);
        if(stacks <= 2){return 2.0}
        else {return 3.0};
      }
      else {return 1.0};
      break;
    default:
      return 1.0;
      break;
  }
}
function get_levelMult(level){
  switch(level){
    case 90:
      return 1446.85;
      break;
    case 95:
      return 1561.46;
      break;
    case 100:
      return 1674.81;
      break;
    default:
      return 1446.85;
  }
};

function dot(array1, array2){
  let sum = 0;
  for (let i = 0; i < array1.length; i++) {
    sum += array1[i] * array2[i];
  }
  return sum;
}

const MULTIPLIERS = {// 乘区名
  levelMult : "等级乘区",  critMult : "暴击乘区",  rxnMult : "反应系数",  rxnBonusMult : "反应系数提升乘区",
  rxnBaseDMGMult : "反应基础提升乘区",  dmgBonusMult : "增伤乘区",  resMult : "抗性乘区",  elevationMult : "擢升乘区",
  defMult : "防御乘区",  baseMult : "基础乘区", flatDMG : "额外伤害", catalyzeMult : "额外激化伤害",
  baseDMGMult : "大权乘数", repetitionCount:"重复次数", flatMult:"额外伤害乘区", "DMG":"计算过程伤害值",
  totalDMG: "总伤害", 
};
const INT_TERM_SET = new Set(["baseMult", "flatDMG", "catalyzeMult", "repetitionCount", "flatMult", 
  "DMG", "totalDMG", "atk", "hp", "def", "hitnum", "stacks", "consumption", "remaining", "singleFlatDMG" // 数字为整数的乘区或词条ID集合
]); 

function calculate_damage(teamCurrentAttributes, action, snapshotAttributes = undefined){
  /* 给定所有角色的当前面板和当前的行为（技能），计算对应的伤害值，返回伤害值和乘区信息
   返回一个字典，包含{伤害结果，元素，技能名称, 反应伤害类型，伤害类型(不同伤害类型的乘区不一样)，伤害细节(记录乘区结果), 重数, 元素附着次数}
   {dmg, element, talentMetaName, rxndmg, dmgType, details, repetitionCount, EACount}
   伤害细节 = {角色ID : {具体的各个乘区, buff描述(buffDescs)，角色词条面板(stats, 吃快照的取快照，吃当前的取当前)}};
   伤害需要考虑重数 repetitionCount
  */
  if(action.talentMeta.ID === "swap"){return {dmg:0, rxndmg:null, dmgType:null, details:{}, repetitionCount:0}}; // 切换角色不用处理
  let details = {};
  let ID = action.talentMeta.characterID, element = action.talentMeta.element;
  let rxndmg = (action.rxndmg || action.talentMeta.rxndmg);
  let talentMetaName = action.talentMeta.name || "——";
  let attributes = (ID == null) ? teamCurrentAttributes[onfieldCharacterID] : teamCurrentAttributes[ID];
  let stats = attributes.stats;
  let attackType = action.talentMeta.attackType;
  const repetitionCount = action.repetitionCount || 1;
  const EACount = (action.talentMeta != undefined) ? action.talentMeta.EACount||0 : 0;

  let resMult = get_resistance_multiplier(stats, element);
  if(action.talentMeta.scaling == undefined ){// 此时为剧变反应伤害
    if(LUNAR_SET.has(rxndmg)){ // 月曜反应伤害，全队参与
      // 先确定哪些人参加了反应（考虑所有参与反应的元素）
      let tempKey = rxndmg.replace(/^(direct|reaction)/, "");
      tempKey = tempKey.charAt(0).toLowerCase() + tempKey.slice(1);
      let contributors = [], participation = new Set(["hydro"]);
      if(tempKey === "lunarCharged"){participation.add("electro")}
      else if(tempKey === "lunarCrystallize"){participation.add("geo")}
      else {throw new Error("月曜反应伤害类型中不存在" + rxndmg)};
      for(let [tempID, tempAttr] of Object.entries(teamCurrentAttributes)){
        if(participation.has(tempAttr.element)){contributors.push(tempID)};
      };
      let weights = [1, 1/2, 1/12, 1/12].slice(0, contributors.length);
      let rxnMult = get_reaction_multiplier(element, rxndmg);
      let team_damages = {};
      for(let tempID of contributors){
        let tempAttr = teamCurrentAttributes[tempID];
        let tempStats = tempAttr.stats;
        let emFactor = get_elemental_mastery_factor(tempStats, rxndmg);
        let critMult = get_crit_multiplier(tempStats), levelMult = tempStats.levelMult;
        let dmgBonus = tempStats[tempKey + "DMG"], elevationMult = 1+tempStats[tempKey + "Elevation"];
        let rxnBonusMult = 1 + dmgBonus + emFactor;
        let rxnBaseDMGMult = 1 + tempStats[tempKey+"BaseDMG"];
        let dmg = levelMult*rxnMult*rxnBaseDMGMult*rxnBonusMult*resMult*critMult*elevationMult;
        team_damages[tempID] = dmg;
        details[tempID] = {levelMult, rxnMult, rxnBaseDMGMult, rxnBonusMult, resMult, critMult, elevationMult, 
                            dmg, buffDescs:tempAttr.buffDescs, stats:tempStats, statBuffDetails:tempAttr.statBuffDetails, 
                            statBaseDetails:tempAttr.statBaseDetails, repetitionCount};
      }
      // 加权和，并考虑羽毛的影响
      let sortedDMGs = Object.values(team_damages).sort((a,b) => b-a);
      let weightedDMG = dot(sortedDMGs, weights);
      let finalDMG = weightedDMG * repetitionCount;
      let flatMult = 0;
      if(ID !== null && ID !== undefined){  // 计算羽毛
        flatMult = stats.flatDMG * details[ID].resMult * details[ID].critMult * details[ID].elevationMult;
        finalDMG += flatMult;
        details[ID].flatDMG = stats.flatDMG;
      }
      return {dmg:finalDMG, element, talentMetaName, rxndmg, dmgType:"reactionLunar", details, repetitionCount, EACount, weightedDMG, flatMult};
    }
    else if(STELLAR_SET.has(rxndmg)){ // 星烁反应伤害，全队参与
      // 先确定哪些人参加了反应（考虑所有参与反应的元素）
      let tempKey = rxndmg.replace(/^(direct|reaction)/, "");
      tempKey = tempKey.charAt(0).toLowerCase() + tempKey.slice(1);
      let contributors = [], participation = new Set(["cryo"]);
      if(tempKey === "stellarSwirl"){participation.add("anemo")}
      else {throw new Error("星烁反应伤害类型中不存在" + rxndmg)};
      for(let [tempID, tempAttr] of Object.entries(teamCurrentAttributes)){
        if(participation.has(tempAttr.element)){contributors.push(tempID)};
      };
      let weights = [3/5, 3/10, 1/20, 1/20].slice(0, contributors.length);
      let rxnMult = get_reaction_multiplier(element, rxndmg, action.parameters);
      let team_damages = {};
      for(let tempID of contributors){
        let tempAttr = teamCurrentAttributes[tempID];
        let tempStats = tempAttr.stats;
        let emFactor = get_elemental_mastery_factor(tempStats, rxndmg);
        let critMult = get_crit_multiplier(tempStats), levelMult = tempStats.levelMult;
        let dmgBonus = tempStats[tempKey + "DMG"], elevationMult = 1 + tempStats[tempKey + "Elevation"];
        let rxnBonusMult = 1 + dmgBonus + emFactor;
        let rxnBaseDMGMult = 1 + tempStats[tempKey+"BaseDMG"];
        let dmg = levelMult*rxnMult*rxnBaseDMGMult*rxnBonusMult*resMult*critMult*elevationMult;
        team_damages[tempID] = dmg;
        details[tempID] = {levelMult, rxnMult, rxnBaseDMGMult, rxnBonusMult, resMult, critMult, elevationMult, dmg,
                            buffDescs:tempAttr.buffDescs, stats:tempStats, statBuffDetails:tempAttr.statBuffDetails, 
                            statBaseDetails:tempAttr.statBaseDetails, repetitionCount};
      }
      // 加权和
      let sortedDMGs = Object.values(team_damages).sort((a,b) => b-a);
      let weightedDMG = dot(sortedDMGs, weights);
      let finalDMG = weightedDMG * repetitionCount;
      let flatMult = 0;
      if(ID != undefined){  // 计算羽毛
        flatMult = stats.flatDMG * details[ID].resMult * details[ID].critMult * details[ID].elevationMult;
        finalDMG += flatMult;
        details[ID].flatDMG = stats.flatDMG;
      }
      return {dmg:finalDMG, element, talentMetaName, rxndmg, dmgType:"reactionStellar", details, repetitionCount, EACount, weightedDMG, flatMult};
    }
    else{ // 普通的剧变反应伤害
      let rxnMult = get_reaction_multiplier(element, rxndmg);
      let levelMult = stats.levelMult;
      let emFactor = get_elemental_mastery_factor(stats, rxndmg);
      let rxnBonusMult = 1 + emFactor + stats.reactionDMG;
      let flatDMG = stats.flatDMG;
      let dmg = (levelMult*rxnMult*rxnBonusMult*repetitionCount + flatDMG) * resMult;
      details[ID] = {levelMult, rxnMult, rxnBonusMult, flatDMG, resMult, buffDescs:attributes.buffDescs, stats:stats, 
                      statBuffDetails:attributes.statBuffDetails, statBaseDetails:attributes.statBaseDetails, repetitionCount};
      return {dmg, element, talentMetaName, rxndmg, dmgType:"transformative", details, repetitionCount, EACount};
    }
  }
  else{ 
    // 此时为直伤、增幅反应、异化剧变反应直伤、激化反应
    // 这部分需要处理快照面板，快照机制按如下处理：攻击、防御、最大生命、暴击、暴伤、各类元素伤害加成是锁的，在增幅反应中精通是锁的，其他按照当前面板数据计算；
    // 默认伤害都是快照的，当 snapshotAttributes = undefined 时，则令 snapshotAttributes = teamCurrentAttributes[当前角色ID]，同样逻辑处理
    const snapshot_attributes = snapshotAttributes || attributes;
    const snapshotStats = snapshot_attributes.stats;
    let outputStats = structuredClone(stats); // 最后输出的角色面板，将其中需要快照的部分替换成 snapshotStats 对应的值
    const snapshotKeys = ["atk", "def", "hp", "cr", "cd", "batk", "bdef", "bhp", "atkp", "defp", "hpp", "atkf", 
                          "deff", "hpf", "pyroDMG", "hydroDMG", "electroDMG", "cryoDMG", "dendroDMG", "geoDMG",
                          "anemoDMG", "physicalDMG"];
    if(AMPLIFYING_SET.has(rxndmg)){snapshotKeys.push("em")}; // 增幅反应锁精通
    snapshotKeys.forEach(key => {outputStats[key] = snapshotStats[key]});
    // 输出的词条增益详情：快照词条继承快照面板的 statBuffDetails，非快照词条继承当前面板的 statBuffDetails
    const outputStatBuffDetails = {};
    const currStatBuffDetails = attributes.statBuffDetails || {};
    const snapshotStatBuffDetails = snapshot_attributes.statBuffDetails || {};
    for(let k of new Set([...Object.keys(currStatBuffDetails), ...Object.keys(snapshotStatBuffDetails)])){
      outputStatBuffDetails[k] = snapshotKeys.includes(k) ? (snapshotStatBuffDetails[k] || []) : (currStatBuffDetails[k] || []);
    }

    let scaling = action.talentMeta.scaling[attributes.talentLevels[action.talentMeta.talent]];
    let base = Object.fromEntries(Object.keys(scaling).map(key => [key, snapshotStats[key]||0]));
    let baseMult = dot(Object.values(base), Object.values(scaling));
    let critMult = get_crit_multiplier(snapshotStats);
    if(rxndmg === "none"){// 直伤
      let defMult = get_defence_multiplier(stats, attributes.level);
      let dmgBonusMult = 1 + snapshotStats[element + "DMG"] + stats[attackType + "DMG"], flatDMG = stats.flatDMG;
      let baseDMGMult = stats.baseDMGMult;
      let dmg = (baseMult*baseDMGMult*repetitionCount + flatDMG) * dmgBonusMult * critMult * resMult * defMult;
      details[ID] = {base, scaling, baseMult, flatDMG, dmgBonusMult, critMult, resMult, defMult, 
                      baseDMGMult, buffDescs:attributes.buffDescs, stats:outputStats, statBuffDetails:outputStatBuffDetails, 
                      statBaseDetails:attributes.statBaseDetails, repetitionCount};
      return {dmg, element, talentMetaName, rxndmg, dmgType:"direct", details, repetitionCount, EACount};
    }
    else if(AMPLIFYING_SET.has(rxndmg)){// 增幅反应
      let defMult = get_defence_multiplier(stats, attributes.level);
      let dmgBonusMult = 1 + snapshotStats[element + "DMG"] + stats[attackType + "DMG"], flatDMG = stats.flatDMG;
      let rxnMult = get_reaction_multiplier(element, rxndmg);
      let emFactor = get_elemental_mastery_factor(snapshotStats, rxndmg);
      let rxnBonusMult = 1 + emFactor + stats.reactionDMG;
      let baseDMGMult = stats.baseDMGMult;
      let dmg = (baseMult*baseDMGMult*repetitionCount + flatDMG) * rxnMult * rxnBonusMult * dmgBonusMult * critMult * resMult * defMult;
      details[ID] = {base, scaling, baseMult, flatDMG, rxnMult, rxnBonusMult, dmgBonusMult, critMult, 
                      resMult, defMult, baseDMGMult, buffDescs:attributes.buffDescs, stats:outputStats, statBuffDetails:outputStatBuffDetails, 
                      statBaseDetails:attributes.statBaseDetails, repetitionCount};
      return {dmg, element, talentMetaName, rxndmg, dmgType:"amplifying", details, repetitionCount, EACount};
    }
    else if(LUNAR_SET.has(rxndmg) || STELLAR_SET.has(rxndmg)){// 月曜或者星烁直伤
      let tempKey = rxndmg.charAt(6).toLowerCase() + rxndmg.slice(7);
      let dmgType = LUNAR_SET.has(rxndmg) ? "lunar" : "stellar";
      let rxnMult = get_reaction_multiplier(element, rxndmg);
      let emFactor = get_elemental_mastery_factor(stats, rxndmg);
      let rxnBonusMult = 1 + stats[tempKey + "DMG"] + emFactor, flatDMG = stats.flatDMG;
      let rxnBaseDMGMult = 1 + stats[tempKey + "BaseDMG"];
      let elevationMult = 1+stats[tempKey + "Elevation"];
      let baseDMGMult = stats.baseDMGMult;
      let dmg = (baseMult*rxnMult*rxnBaseDMGMult*rxnBonusMult*baseDMGMult*repetitionCount + flatDMG)*critMult*resMult*elevationMult;
      details[ID] = {base, scaling, baseMult, flatDMG, rxnMult, rxnBonusMult, rxnBaseDMGMult, critMult, resMult, elevationMult, 
                      baseDMGMult, buffDescs:attributes.buffDescs, stats:outputStats, statBuffDetails:outputStatBuffDetails, 
                      statBaseDetails:attributes.statBaseDetails, repetitionCount};
      return {dmg, element, talentMetaName, rxndmg, dmgType, details, repetitionCount, EACount};
    }
    else if(CATALYZE_SET.has(rxndmg)){// 激化反应
      let defMult = get_defence_multiplier(stats, attributes.level);
      let dmgBonusMult = 1 + snapshotStats[element + "DMG"] + stats[attackType + "DMG"], flatDMG = stats.flatDMG, levelMult = stats.levelMult;
      let rxnMult = get_reaction_multiplier(element, rxndmg);
      let emFactor = get_elemental_mastery_factor(stats, rxndmg);
      let rxnBonusMult = 1 + emFactor + stats.reactionDMG;
      let catalyzeMult = levelMult * rxnMult * rxnBonusMult * EACount;
      let baseDMGMult = stats.baseDMGMult;
      let dmg = (baseMult*baseDMGMult*repetitionCount + flatDMG + catalyzeMult*repetitionCount) * dmgBonusMult * critMult * resMult * defMult;
      details[ID] = {base, scaling, baseMult, flatDMG, catalyzeMult, rxnMult, rxnBonusMult, dmgBonusMult, critMult, resMult, 
                      defMult, baseDMGMult, buffDescs:attributes.buffDescs, stats:outputStats, statBuffDetails:outputStatBuffDetails, 
                      statBaseDetails:attributes.statBaseDetails, repetitionCount};
      return {dmg, element, talentMetaName, rxndmg, dmgType:"catalyze", details, EACount};
    }
    else{
      throw new Error("输入的反应伤害类型" + rxndmg + "不支持。");
    }
  }
};

function update_net_attributes(action, characterIDs = Object.keys(characters)){ // 用净效果列表获得增益，计算净面板
  for(let charID of characterIDs){
    let [netBuff, buffDescs, netStatBuffDetails] = derive_total_buff_from_effects(charID, teamNetEffects, teamInitialAttributes, teamInitialAttributes, action);
    teamNetAttributes[charID] = derive_buffed_character_attributes(teamInitialAttributes[charID], netBuff, buffDescs, netStatBuffDetails);
  }
}
function update_dynamic_attributes(action, characterIDs = Object.keys(characters)){// 基于净效果计算全效果增益，计算全面板
  for(let charID of characterIDs){
    let [buff, buffDescs, statBuffDetails] = derive_total_buff_from_effects(charID, teamEffects, teamInitialAttributes, teamNetAttributes, action);
    teamCurrentAttributes[charID] = derive_buffed_character_attributes(teamInitialAttributes[charID], buff, buffDescs, statBuffDetails);
  }
}
function get_character_snapshot_attributes(characterID, action){// 获得指定角色的快照面板（就是当前的全面板）
  let [buff, buffDescs, statBuffDetails] = derive_total_buff_from_effects(characterID, teamEffects, teamInitialAttributes, teamNetAttributes, action);
  return derive_buffed_character_attributes(teamInitialAttributes[characterID], buff, buffDescs, statBuffDetails);
}
function simulate(actionArray, totalTime){// 序贯处理 actionArray
  // 初始化
  update_team_cost();
  update_team_effects();
  onfieldCharacterID = null;
  initialize_toUpdateAttributes();
  initialize_all_attributes();
  const tempActionArray = [...actionArray]; // 不要修改原来的数组
  let n_actions = tempActionArray.length;
  const results = []; // 包含{calculate_damage的输出, characterID, onfieldCharacterID}
  const damages = [];
  // 开始
  let i = 0;
  while(i < n_actions){
    let action = {...tempActionArray[i]};
    let characterID = action.talentMeta.characterID;
    let hitnum = action.talentMeta.hitnum || 1;
    let char = characterID ? characters[characterID] : {constellation:-1};
    let initAttr = characterID? teamInitialAttributes[characterID] : undefined;
    let condition = action.condition || {};
    let toPass = true;
    // 反应判定：若 rxndmg 存在，则将 talentMeta 中的反应换成这个
    if(action.rxndmg){
      action.talentMeta = structuredClone(tempActionArray[i].talentMeta);
      action.talentMeta.rxndmg = action.rxndmg;
    }
    // 元素判定：若 element 存在，则将 talentMeta 中的元素换成这个
    if(action.element){
      action.talentMeta = structuredClone(tempActionArray[i].talentMeta);
      action.talentMeta.element = action.element;
    }
    // 可行性判定：看看有没有命座需求，还有condition的条件(主要是字段判定)
    toPass = toPass && check_action_condition(initAttr, action);
    if(!toPass){
      if(action.replacements){
        let n_replacements = action.replacements.length;
        n_actions += n_replacements - 1;
        tempActionArray.splice(i, 1, ...action.replacements);
        continue;
      }
      else{i++; continue;}
    }
    if(action.talentMeta.ID === "swap" || action.talentMeta.ID === "wait"){
      onfieldCharacterID = characterID;
      i++;
      continue; // 跳过切换角色和等待
    }
    else{
      //先判断场上角色
      if(action.talentMeta.isOnfield && action.talentMeta.characterID != null ){
        onfieldCharacterID = action.talentMeta.characterID;
      }
      let isOnfield = action.talentMeta?.isOnfield ?? (characterID === onfieldCharacterID);
      const curr_result = {hitnum, characterID, onfieldCharacterID, isOnfield, timestamp:action.timestamp};
      update_net_attributes(action);
      update_dynamic_attributes(action);
      // 判断当前伤害是不是快照
      if(action.talentMeta.isSnapshot === true){
        // 判断要不要更新快照面板
        if(teamSnapshotAttributes[characterID] == null){// 更新快照面板
          teamSnapshotAttributes[characterID] = get_character_snapshot_attributes(characterID, action);
        }
        // 计算伤害
        Object.assign(curr_result, calculate_damage(teamCurrentAttributes, action, teamSnapshotAttributes[characterID]));
        results.push(curr_result);
        damages.push(curr_result.dmg);
        // 判断快照是否结束
        if(action.isSnapshotEnd){teamSnapshotAttributes[characterID] = null};
      }
      else{
        // 计算伤害
        Object.assign(curr_result, calculate_damage(teamCurrentAttributes, action));
        results.push(curr_result);
        damages.push(curr_result.dmg);
      }
    }
    i++;
  }
  const totalDMG = damages.reduce((acc, cur) => acc+cur, 0); // 求数组的和
  const dps = totalDMG / totalTime;
  return {results, damages, totalDMG, totalTime, dps};
}










/* 用户交互部分的函数 */

function get_stat_value_string(stat, value){ // 获得词条值的字符串形式
  return FLAT_STAT_SET.has(stat) ?  value.toFixed(0)+"": (value*100).toFixed(1)+"%";
}

const COMPOSITE_STAT_MAP = { // 复合展示词条与其组成词条的对应关系，展示详情时把组成词条的增益一并列出
  atk: ["batk", "atkp", "atkf"],
  def: ["bdef", "defp", "deff"],
  hp:  ["bhp", "hpp", "hpf"],
}; 
function convert_numberText_to_number(valueText){// 将之前的"数值=>字符串"的过程逆回来
  if(valueText.at(-1) === "%"){return Number(valueText.slice(0, -1)) / 100}
  else{return Number(valueText)}
}
// 角色选择相关
function create_character_selection_part(characterSelectionDivId){
  const maindiv = document.getElementById(characterSelectionDivId); maindiv.replaceChildren();
  maindiv.classList.remove("hidden");
  const subtitle = document.createElement("span"); subtitle.className = "subtitle"; subtitle.style["margin-bottom"] = "20px";
  subtitle.textContent = "角色选择";
  maindiv.append(subtitle);
  // 主要部分
  const submainDiv = document.createElement("div"); submainDiv.className = "char-select-part";
  const candidateDiv = document.createElement("div"); candidateDiv.className = "card";
  const selectedDiv = document.createElement("div"); selectedDiv.className = "card";
  const selectedDiv1 = document.createElement("div"); selectedDiv1.className = "char-select-result"; 
  submainDiv.append(candidateDiv, selectedDiv);
  maindiv.append(submainDiv);
  // 左侧：候选角色
  const candidateDiv_h1 = document.createElement("h1"); candidateDiv_h1.textContent = "候选角色";
  const candidateDiv_container = document.createElement("div"); candidateDiv_container.className = "char-select-candidate";
  for(let charID of Object.keys(candidateCharacters)){
    const box = document.createElement('div'); box.className = "charbox"; box.textContent = candidateCharacters[charID].name;
    box.dataset.charID = charID; box.dataset.isSelected = false;
    candidateDiv_container.append(box);
    if(Object.keys(selectedCharacters).includes(charID)){box.classList.add("selected"); box.dataset.isSelected = true;} // 当角色被选中时，需要切换box的类
  }
  candidateDiv.append(candidateDiv_h1, candidateDiv_container); // 监听事件放在后面定义
  // 右侧：选择结果
  const selectedDiv_item1 = document.createElement("div"); selectedDiv_item1.className = "char-select-h1-row"; // 必须角色
  const selectedDiv_item2 = document.createElement("div"); selectedDiv_item2.className = "char-select-h1-row"; // 选择角色
  const selectedDiv_item1_h1 = document.createElement("h1"); selectedDiv_item1_h1.textContent = "必需角色";
  const selectedDiv_item2_h1 = document.createElement("h1"); selectedDiv_item2_h1.textContent = "已选择角色";
  selectedDiv_item1.append(selectedDiv_item1_h1); selectedDiv_item2.append(selectedDiv_item2_h1);
  const selectedDiv_item1_row = document.createElement("div"); selectedDiv_item1_row.className = "char-select-row";
  const selectedDiv_item2_row = document.createElement("div"); selectedDiv_item2_row.className = "char-select-row";
  const update_character_row = function(wrap, chars){
    wrap.replaceChildren();
    for(let key of Object.keys(chars)){
      const box = document.createElement('div'); box.className = "charbox2"; box.textContent = chars[key].name;
      wrap.appendChild(box);
    }
  }
  update_character_row(selectedDiv_item1_row, requiredCharacters);
  update_character_row(selectedDiv_item2_row, selectedCharacters);
  selectedDiv_item1.append(selectedDiv_item1_row); selectedDiv_item2.append(selectedDiv_item2_row);
  const selectedDiv_item3 = document.createElement("div"); selectedDiv_item3.className = "errdesc-btn";
  const selectedDiv_item3_1 = document.createElement("div"); selectedDiv_item3_1.style["text-align"] = "left";
  selectedDiv_item3_1.style["align-items"] = "center";
  const selectedDiv_item3_1_span = document.createElement("span"); selectedDiv_item3_1_span.className = "error-text";
  selectedDiv_item3_1.append(selectedDiv_item3_1_span);
  const selectedDiv_item3_2 = document.createElement("div"); selectedDiv_item3.style["text-align"] = "right"; // 用来装载一个按钮
  const selectedDiv_btn = document.createElement("button"); selectedDiv_btn.className = "btn"; selectedDiv_btn.style["width"] = "150pt";
  selectedDiv_btn.textContent = "确认角色选择";
  selectedDiv_btn.onclick = function(){
    let checkResults = check_character_selection();
    if(checkResults.isPass){
      update_characters();
      create_character_build_part(characterBuildPartId);
      selectedDiv.style["border"] = "";
      selectedDiv_item3_1_span.textContent = "";
    }
    else{
      selectedDiv_item3_1_span.textContent = checkResults.text;
      selectedDiv.style["border"] = "2px solid #610101";
    }
  }
  selectedDiv_item3_2.appendChild(selectedDiv_btn);
  selectedDiv_item3.append(selectedDiv_item3_1, selectedDiv_item3_2);
  selectedDiv1.append(selectedDiv_item1, selectedDiv_item2);
  selectedDiv.append(selectedDiv1, selectedDiv_item3)
  // 定义之前没定义的监听事件
  candidateDiv_container.addEventListener('click', (e) => {
    const box = e.target.closest('.charbox');
    if (!box) return;
    selectedDiv.style["border"] = "";
    selectedDiv_item3_1_span.textContent = "";
    if(box.dataset.isSelected === "true"){ // 角色之前被选中，现在要从 selectedCharacters 中删去
      delete selectedCharacters[box.dataset.charID];
      box.classList.toggle('selected');// 切换选中状态
      box.dataset.isSelected = false;
      update_character_row(selectedDiv_item2_row, selectedCharacters);
    }
    else{
      if(Object.keys(selectedCharacters).length + Object.keys(requiredCharacters).length == 4){return;}// 角色选满了
      selectedCharacters[box.dataset.charID] = candidateCharacters[box.dataset.charID];
      box.classList.toggle('selected');// 切换选中状态
      box.dataset.isSelected = true;
      update_character_row(selectedDiv_item2_row, selectedCharacters);
    }
  });
  
}




// 角色配置和展示
function build_stat_detail_lines(statBaseDetails, statBuffDetails, statID){
  // 生成详情弹窗的行列表：先列基础数值(角色基础、武器、突破属性、圣遗物词条)，再列效果增益
  // 复合词条(攻击力、防御力、最大生命值)会聚合其组成词条的详情
  // 每行形式为 {name: 名称, valueText: 数值文本, cls: 数值颜色类, stat:词条名, value:具体值}
  let keys = [statID, ...(COMPOSITE_STAT_MAP[statID] || [])];
  let lines = [];
  for(let k of keys){
    for(let item of ((statBaseDetails || {})[k] || [])){
      lines.push({name: item.name, valueText: get_stat_buff_detail_value_string(k, item.value), cls: item.cls, 
                  stat:k, value:item.value});
    }
  }
  for(let k of keys){
    for(let detail of ((statBuffDetails || {})[k] || [])){ // detail 为对象{stat, value, name, 其他参数}
      lines.push({name: detail.name, valueText: get_stat_buff_detail_value_string(k, detail.value), cls: "buff-value", 
                  stat:k, value:detail.value});
    }
  }
  return lines;
}

function show_stat_buff_detail_popup(statName, lines){ // 弹出词条详情弹窗，每条占一行，名称为白色，数值颜色由行的 cls 决定
  const old = document.querySelector(".stat-detail-modal-overlay");
  if(old){old.remove()}; // 保证同时只有一个弹窗
  const overlay = document.createElement("div");
  overlay.className = "stat-detail-modal-overlay";
  const modal = document.createElement("div");
  modal.className = "stat-detail-modal";
  const title = document.createElement("h2");
  title.textContent = `${statName} · 增益详情`;
  const closeBtn = document.createElement("button");
  closeBtn.className = "modal-close";
  closeBtn.textContent = "✕";
  closeBtn.onclick = function(){overlay.remove()};
  title.appendChild(closeBtn);
  modal.appendChild(title);
  if(lines.length === 0){
    const empty = document.createElement("div");
    empty.className = "modal-empty";
    empty.textContent = "当前没有与该词条相关的增益效果。";
    modal.appendChild(empty);
  }
  else{ // 每个贡献占一行，最后一行进行汇总
    const summary = {}; // stat : value的和
    for(let line of lines){
      const p = document.createElement("p");
      const nameSpan = document.createElement("span");
      nameSpan.className = "buff-name";
      nameSpan.textContent = line.name + "：";
      const valueSpan = document.createElement("span");
      valueSpan.className = line.cls;
      valueSpan.textContent = line.valueText;
      p.append(nameSpan, valueSpan);
      modal.appendChild(p);
      summary[line.stat] = (summary[line.stat] || 0) + line.value;
    }
    const p = document.createElement("p"); p.className = "buff-name"; p.style.color = "var(--good)"
    let strings = [];
    for(let stat of Object.keys(summary)){
      strings.push(STATS[stat] + " " + get_stat_buff_detail_value_string(stat, summary[stat]));
    }
    p.textContent = "汇总：" + strings.join(", ");
    modal.appendChild(p);
  }
  overlay.appendChild(modal);
  overlay.onclick = function(){overlay.remove()}; // 点击弹窗外部关闭
  modal.onclick = function(e){e.stopPropagation()};
  document.body.appendChild(overlay);
}

function show_damage_detail_popup(result){ // 弹出伤害详情弹窗，内容复用 display_damage_details
  const old = document.querySelector(".dmg-detail-modal-overlay");
  if(old){old.remove()}; // 保证同时只有一个伤害详情弹窗
  const overlay = document.createElement("div");
  overlay.className = "dmg-detail-modal-overlay";
  const modal = document.createElement("div");
  modal.className = "dmg-detail-modal";
  display_damage_details(modal, result); // 在弹窗内构建伤害表达式与面板细节
  const title = document.createElement("span"); title.className = "subtitle";
  title.textContent = "具体项细节";
  const closeBtn = document.createElement("button");
  closeBtn.className = "modal-close";
  closeBtn.textContent = "✕";
  closeBtn.onclick = function(){overlay.remove()};
  title.appendChild(closeBtn);
  modal.insertBefore(title, modal.firstChild); // 标题置顶
  overlay.appendChild(modal);
  overlay.onclick = function(){overlay.remove()}; // 点击弹窗外部关闭
  modal.onclick = function(e){e.stopPropagation()};
  document.body.appendChild(overlay);
}

function create_paragraphs_from_strings(wrap, strings){// 在wrap(不是id，是实体)下建立多个<p>，每个对应 strings (列表)的一个元素
  for(let desc of strings){
    const p = document.createElement("p");
    p.textContent = desc;
    wrap.appendChild(p);
  }
};

function create_buttons_for_displaying_build(id){// 建立多个按钮，用来控制哪些角色的配置需要设置和展示
  const wrap = document.getElementById(id);
  const div = document.createElement("div");
  div.style.marginBottom = "8px";
  // 定义具体的按钮对象
  for(let charID of Object.keys(characters)){
    const button = document.createElement("button");
    button.className = "btn";
    button.textContent = characters[charID].name;
    button.onclick = function(){
      const displayDivId = characterBuildDivIds[charID];
      if(displayDivId === onDisplayCharacterBuildDivId) return; // 点击当前角色，直接返回
      const displayDiv = document.getElementById(displayDivId);
      displayDiv.classList.remove("hidden");
      const currDisplayDiv = document.getElementById(onDisplayCharacterBuildDivId);
      currDisplayDiv.classList.add("hidden");
      onDisplayCharacterBuildDivId = displayDivId;
      onDisplayCharacterID = charID;
    }
    div.appendChild(button);
  }
  wrap.appendChild(div);
}


const characterBuildDivIds = Object.fromEntries(Object.keys(characters).map(ID => [ID, ID + "_characterBuildDiv"]));// 用来记录每个角色的角色配置Div块的id，控制显示
let onDisplayCharacterBuildDivId = Object.keys(characters)[0] + "_characterBuildDiv"; // 正在展示的div的id
let onDisplayCharacterID = Object.keys(characters)[0]; // 应当展示的角色的ID（面板调整的角色的ID）
function create_character_build_part(buildId){// 建立若干个div区域用来填写角色配置，每个区域对应一个角色，这些区域挂靠在一个id div区域下
  const maindiv = document.getElementById(buildId); // 父div的id
  maindiv.replaceChildren(); // 删除原有残留
  const maindiv_subtitleBtn = document.createElement("div");
  maindiv_subtitleBtn.className = "subtitle_btn";
  const maindiv_subtitleBtn_span = document.createElement("span");
  maindiv_subtitleBtn_span.className = "subtitle";
  maindiv_subtitleBtn_span.textContent = "角色配置设置";
  const maindiv_subtitleBtn_btn = document.createElement("button");
  maindiv_subtitleBtn_btn.className = "btn";
  maindiv_subtitleBtn_btn.textContent = "计算面板";
  maindiv_subtitleBtn_btn.onclick = function(){
    characterDisplayAttributeType[onDisplayCharacterID] = "initial";
    initialize_all_attributes();
    display_attributes(teamInitialAttributes[onDisplayCharacterID]);
  };
  maindiv_subtitleBtn.append(maindiv_subtitleBtn_span, maindiv_subtitleBtn_btn);
  maindiv.appendChild(maindiv_subtitleBtn);
  create_buttons_for_displaying_build(buildId);
  for(let [charID, char] of Object.entries(characters)){
    const div = document.createElement("div"); // 每个角色所属的块
    div.className = "card";
    div.id = characterBuildDivIds[charID];
    if(div.id !== onDisplayCharacterBuildDivId){// 不是展示的div块时，附加 hidden 类
      div.classList.add("hidden");
    }
    const title = document.createElement("h1"); // 写标题，包括角色名和角色属性
    title.textContent = `${char.name}(${ELEMENTS[char.element].charAt(0)})`;
    div.appendChild(title);
    // #region 角色等级选择
    const levelDiv = document.createElement("div");
    levelDiv.className = "name_input_desc";
    // 子标题
    const levelSubDiv1 = document.createElement("div");
    const levelSubDiv1_h2 = document.createElement("h2");
    levelSubDiv1_h2.textContent = "等级选择";
    levelSubDiv1.appendChild(levelSubDiv1_h2);
    // 描述(因为描述内容跟着选择内容改变，因此放前面定义)
    const levelSubDiv3 = document.createElement("div");
    const levelSubDiv3_span = document.createElement("span");
    levelSubDiv3_span.className = "desc";
    levelSubDiv3_span.textContent = "基础值:" + Object.entries(char.base[char.level]).map(([statID, value]) =>`
                                      ${STATS[statID]} ${value}`).join(", ");
    levelSubDiv3.appendChild(levelSubDiv3_span);
    // 选择界面
    const levelSubDiv2 = document.createElement("div");
    const levelSubDiv2_select = document.createElement("select");
    levelSubDiv2_select.id = charID + "_levelSelection";
    const update_level_desc = function(){
      const level = char.level;
      const desc = "基础值:" + Object.entries(char.base[level]).map(([statID, value]) =>`
          ${STATS[statID]} ${value}`).join(", ");
      levelSubDiv3_span.textContent = desc;
    }
    levelSubDiv2_select.onchange = function(){char.level = Number(this.value); toUpdateAttributes[charID] = true; update_level_desc();};
    for(let level of Object.keys(char.base)){ // 从角色基础数值对象中获得候选等级
      let levelSubDiv2_select_option = document.createElement("option");
      levelSubDiv2_select_option.value = Number(level);
      levelSubDiv2_select_option.textContent = level;
      if(Number(level) == char.level){
        levelSubDiv2_select_option.selected = true;
      }
      levelSubDiv2_select.appendChild(levelSubDiv2_select_option);
    }
    levelSubDiv2.appendChild(levelSubDiv2_select);
    levelDiv.append(levelSubDiv1, levelSubDiv2, levelSubDiv3);
    div.appendChild(levelDiv);
    // #endregion

    // #region 角色命座选择
    const constellationDiv = document.createElement("div");
    constellationDiv.className = "name_input_desc";
    // 子标题
    const constellationSubDiv1 = document.createElement("div");
    const constellationSubDiv1_h2 = document.createElement("h2");
    constellationSubDiv1_h2.textContent = "命座选择";
    constellationSubDiv1.appendChild(constellationSubDiv1_h2);
    // 描述(因为描述内容跟着选择内容改变，因此放前面定义)
    const constellationSubDiv3 = document.createElement("div");
    constellationSubDiv3.className = "desc-box";
    create_paragraphs_from_strings(constellationSubDiv3, get_constellation_desc_array(charID, char.constellation));
    // 选择界面
    const constellationSubDiv2 = document.createElement("div");
    const constellationSubDiv2_select = document.createElement("select");
    constellationSubDiv2_select.id = charID + "_constellationSelection";
    const update_constellation_desc = function(){
      const constellation = char.constellation;
      constellationSubDiv3.replaceChildren(); // 清空原有的子节点(<p>)
      create_paragraphs_from_strings(constellationSubDiv3, get_constellation_desc_array(charID, constellation));
    }
    constellationSubDiv2_select.onchange = function(){char.constellation = Number(this.value); initialize_toUpdateAttributes(); 
                                                      toUpdateTeamEffects = true; characterEffects[charID].toUpdate = true;
                                                      update_constellation_desc();};
    for(let constellation of Object.keys(char.constellationEffects)){ // 从角色基础数值对象中获得候选命座
      let constellationSubDiv2_select_option = document.createElement("option");
      constellationSubDiv2_select_option.value = Number(constellation);
      constellationSubDiv2_select_option.textContent = constellation;
      if(Number(constellation) == char.constellation){
        constellationSubDiv2_select_option.selected = true;
      }
      constellationSubDiv2_select.appendChild(constellationSubDiv2_select_option);
    }
    constellationSubDiv2.appendChild(constellationSubDiv2_select);
    constellationDiv.append(constellationSubDiv1, constellationSubDiv2, constellationSubDiv3);
    div.appendChild(constellationDiv);
    // #endregion

    // #region 角色武器选择
    const weaponDiv = document.createElement("div");
    weaponDiv.className = "name_input2_desc";
    // 子标题
    const weaponSubDiv1 = document.createElement("div");
    const weaponSubDiv1_h2 = document.createElement("h2");
    weaponSubDiv1_h2.textContent = "武器选择";
    weaponSubDiv1.appendChild(weaponSubDiv1_h2);
    // 描述(因为描述内容跟着选择内容改变，因此放前面定义)
    const weaponSubDiv4 = document.createElement("div");
    weaponSubDiv4.className = "desc-box";
    create_paragraphs_from_strings(weaponSubDiv4, get_weapon_desc_array(char.weapon));
    // 武器选择界面
    const weaponSubDiv2 = document.createElement("div"); // 武器选择
    const weaponSubDiv3 = document.createElement("div"); // 精炼选择
    const weaponSubDiv2_select = document.createElement("select");
    const weaponSubDiv3_select = document.createElement("select");
    weaponSubDiv2_select.id = charID + "_weaponSelection";
    weaponSubDiv3_select.id = charID + "_weaponRankSelection";
    const update_weapon_desc = function(){
      const weapon = char.weapon;
      weaponSubDiv4.replaceChildren();
      create_paragraphs_from_strings(weaponSubDiv4, get_weapon_desc_array(weapon));
    }
    const candidateWeaponIDs = Object.keys(char.candidateWeapons);
    let defaultRank = char.weapon.rank || 1;
    const rankOptions = {};
    for(let i=1; i<6; i++){ // 获得精炼候选的option
      let weaponSubDiv3_select_option = document.createElement("option");
      weaponSubDiv3_select_option.value = i;
      weaponSubDiv3_select_option.textContent = `精炼${i}阶`;
      if(i === defaultRank){weaponSubDiv3_select_option.selected = true;}
      weaponSubDiv3_select.appendChild(weaponSubDiv3_select_option);
      rankOptions[i] = weaponSubDiv3_select_option;
    }
    let defaultID = char.weapon.ID || candidateWeaponIDs[0];
    for(let weaponID of candidateWeaponIDs){ // 从角色基础数值对象中获得候选武器
      let weaponSubDiv2_select_option = document.createElement("option");
      weaponSubDiv2_select_option.value = weaponID;
      weaponSubDiv2_select_option.textContent = char.candidateWeapons[weaponID].name;
      if(weaponID === defaultID){
        weaponSubDiv2_select_option.selected = true;
      }
      weaponSubDiv2_select.appendChild(weaponSubDiv2_select_option);
    }
    weaponSubDiv2_select.onchange = function(){// 武器选择
      char.weapon = char.candidateWeapons[this.value]; 
      char.weapon.be_equipped(charID, char.name);
      toUpdateAttributes[charID] = true; 
      toUpdateTeamEffects = true; 
      characterEffects[charID].toUpdate = true;
      update_weapon_desc();
      Object.keys(rankOptions).forEach(rank => {
        if(char.weapon.rank == Number(rank)){rankOptions[rank].selected = true}
        else{rankOptions[rank].selected = false};
      })
    };
    weaponSubDiv3_select.onchange = function(){// 精炼选择
      char.weapon.rank = Number(this.value);
      toUpdateAttributes[charID] = true; 
      toUpdateTeamEffects = true; 
      characterEffects[charID].toUpdate = true;
      update_weapon_desc();
    }
    weaponSubDiv2.appendChild(weaponSubDiv2_select);
    weaponSubDiv3.appendChild(weaponSubDiv3_select);
    weaponDiv.append(weaponSubDiv1, weaponSubDiv2, weaponSubDiv3, weaponSubDiv4);
    div.appendChild(weaponDiv);
    // #endregion

    // #region 角色圣遗物套装选择
    const artifactSetDiv = document.createElement("div");
    artifactSetDiv.className = "name_input_desc";
    artifactSetDiv.style["grid-template-columns"] = "110px 0.35fr 0.65fr";
    // 子标题
    const artifactSetSubDiv1 = document.createElement("div");
    const artifactSetSubDiv1_h2 = document.createElement("h2");
    artifactSetSubDiv1_h2.textContent = "圣遗物套装";
    artifactSetSubDiv1.appendChild(artifactSetSubDiv1_h2);
    // 描述(因为描述内容跟着选择内容改变，因此放前面定义)
    const artifactSetSubDiv3 = document.createElement("div");
    artifactSetSubDiv3.className = "desc-box";
    create_paragraphs_from_strings(artifactSetSubDiv3, get_artifactSet_desc_array(char.artifactSet));
    // 选择界面
    const artifactSetSubDiv2 = document.createElement("div");
    const artifactSetSubDiv2_select = document.createElement("select");
    artifactSetSubDiv2_select.id = charID + "_artifactSetSelection";
    const update_artifactSet_desc = function(){
      artifactSetSubDiv3.replaceChildren();
      create_paragraphs_from_strings(artifactSetSubDiv3, get_artifactSet_desc_array(char.artifactSet));
    }
    artifactSetSubDiv2_select.onchange = function(){
      char.artifactSet = char.candidateArtifactSets[this.value]; 
      // 需要对套装组合中的每一个套装设置装备角色
      for(let [set, number] of char.artifactSet){
        set.be_equipped(charID, char.name);
      }
      toUpdateAttributes[charID] = true; 
      toUpdateTeamEffects = true; 
      characterEffects[charID].toUpdate = true;
      update_artifactSet_desc();
    };
    const candidateArtifactSetIDs = Object.keys(char.candidateArtifactSets);
    defaultID = candidateArtifactSetIDs[0];
    for(let artifactSetID of candidateArtifactSetIDs){ // 从角色基础数值对象中获得候选武器
      let artifactSetSubDiv2_select_option = document.createElement("option");
      artifactSetSubDiv2_select_option.value = artifactSetID;
      artifactSetSubDiv2_select_option.textContent = get_artifactSet_name(char.candidateArtifactSets[artifactSetID]);
      if(artifactSetID === defaultID){
        artifactSetSubDiv2_select_option.selected = true;
      }
      artifactSetSubDiv2_select.appendChild(artifactSetSubDiv2_select_option);
    }
    artifactSetSubDiv2.appendChild(artifactSetSubDiv2_select);
    artifactSetDiv.append(artifactSetSubDiv1, artifactSetSubDiv2, artifactSetSubDiv3);
    div.appendChild(artifactSetDiv);
    // #endregion

    // #region 圣遗物词条相关选择/输入
    const artifactMainStatDiv = document.createElement("div");
    const artifactSubStatDiv = document.createElement("div");
    div.appendChild(artifactMainStatDiv);
    div.appendChild(artifactSubStatDiv);

      // #region 角色圣遗物副词条数输入
    const substatElemenets = Object.fromEntries(Object.keys(ARTIFACT_SLOTS).map(k=>[k, {}])); // 构建圣遗物单件ID => 圣遗物副词条ID => HTML单元的映射
    artifactSubStatDiv.className = "ally";
    // 子标题
    const artifactSubStatDiv_h2 = document.createElement("h2");
    artifactSubStatDiv_h2.textContent = "圣遗物副词条条数（每部位 0–6 条，按均值计算）";
    artifactSubStatDiv.appendChild(artifactSubStatDiv_h2);
    // 添加一行小字，说明有效副词条数
    const effective_desc = document.createElement("p");
    effective_desc.style["margin-top"] = "10px";
    effective_desc.className = "desc";
    effective_desc.textContent = get_effective_substat_count_desc(charID);
    // 数值输入
    for(let [slot, cn] of Object.entries(ARTIFACT_SLOTS)){
      let substats = char.artifacts[slot].subStats;
      let substatKeys = Object.keys(substats);
      let artifactSubStatSubDiv = document.createElement("div"); // 每行一个<div class="slot">的块，slot为左右两部分，左边是标题，右边是若干个输入框
      artifactSubStatSubDiv.className = "slot";
      let span = document.createElement("span"); // 标题
      span.className = "name";
      span.textContent = `${cn}`;
      let subdiv = document.createElement("div"); // 子div，用来承载输入
      subdiv.className = "substats";
      for(let statID of substatKeys){
        substatElemenets[slot][statID] = {};
        let subspan = document.createElement("span"); // 副词条名称
        subspan.textContent = `${STATS[statID]}`;
        let input = document.createElement("input");
        input.type = "number";
        input.min = 0;
        input.max = 6;
        input.value = substats[statID];
        if(substats[statID] > 0){subspan.style["color"] = "var(--good)"}
        input.onchange = function(){
          const num = Number(this.value);
          char.artifacts[slot].subStats[statID] = Math.max(0, Math.min(6, num||0));
          toUpdateAttributes[charID] = true; 
          effective_desc.textContent = get_effective_substat_count_desc(charID);
          if(num > 0){subspan.style["color"] = "var(--good)"}
          else{subspan.style["color"] = "var(--dim)"}
        };
        subspan.append(input);
        subdiv.append(subspan);
        substatElemenets[slot][statID].span = subspan;
        substatElemenets[slot][statID].input = input;
      }
      artifactSubStatSubDiv.append(span, subdiv);
      artifactSubStatDiv.appendChild(artifactSubStatSubDiv); 
    }
    artifactSubStatDiv.appendChild(effective_desc); 
    
    // #endregion

      // #region 角色圣遗物主词条选择
    artifactMainStatDiv.className = "ally";
    // 子标题
    const artifactMainStatDiv_h2 = document.createElement("h2");
    artifactMainStatDiv_h2.textContent = "圣遗物配置（5★ 20级）";
    artifactMainStatDiv.appendChild(artifactMainStatDiv_h2);
    // 选项
    for(let slotID of Object.keys(ARTIFACT_SLOTS)){
      let artifactMainStatSubDiv = document.createElement("div");
      artifactMainStatSubDiv.className = "slot";
      let artifactMainStatSubDiv_span = document.createElement("span");
      artifactMainStatSubDiv_span.className = "name";
      artifactMainStatSubDiv_span.textContent = ARTIFACT_SLOTS[slotID];
      let artifactMainStatSubDiv_select = document.createElement("select");
      artifactMainStatSubDiv_select.id = charID + "_artifactMainStatSelection_" + slotID;
      artifactMainStatSubDiv_select.onchange = function(){
        const mainstat = this.value;
        const prevstat = char.artifacts[slotID].mainStat;
        char.artifacts[slotID].mainStat = mainstat;
        toUpdateAttributes[charID] = true;
        // 对应副词条必须为0
        substatElemenets[slotID][prevstat].input.max = 6;
        substatElemenets[slotID][prevstat].span.style["color"] = "var(--dim)";
        substatElemenets[slotID][mainstat].input.value = 0;
        substatElemenets[slotID][mainstat].input.max = 0;
        substatElemenets[slotID][mainstat].span.style["color"] = "var(--dropped)";
        char.artifacts[slotID].subStats[mainstat] = 0;
      }
      for (const [key, data] of Object.entries(ARTIFACT_MAIN_STATS[slotID])) {
        let valueText = get_stat_value_string(key, data.value);
        let option = document.createElement("option");
        option.value = key;
        option.textContent = `${data.label} +${valueText}`;
        if (key === char.artifacts[slotID].mainStat) {
          option.selected = true;  // 设置默认选中
          // 设置对应副词条格式
          if(Object.keys(ARTIFACT_SUB_STATS).includes(key)){
            substatElemenets[slotID][key].input.value = 0;
            substatElemenets[slotID][key].input.max = 0;
            substatElemenets[slotID][key].span.style["color"] = "var(--dropped)";
            char.artifacts[slotID].subStats[key] = 0;
          }
        }
        artifactMainStatSubDiv_select.appendChild(option);
      }
      artifactMainStatSubDiv.append(artifactMainStatSubDiv_span, artifactMainStatSubDiv_select);
      artifactMainStatDiv.appendChild(artifactMainStatSubDiv);
    }
    // #endregion

    
    // #endregion
    maindiv.appendChild(div);
  }
}

const displayButtons = {initial:"初始面板", onField:"前台面板", offField:"后台面板"};
const characterDisplayAttributeType = Object.fromEntries(Object.keys(characters).map(ID => [ID, "initial"])); // 角色具体展示什么面板，有初始、前台、后台选项
const displayRegionId = "displayRegion"; // 在这个id对应的区域内展示数据
function get_stat_note(attributes, statID){ // 获得词条 statID 在展示时需要的额外说明
  const stats = attributes.stats;
  switch(statID){
    case "atk":
      return `  白值${(stats.batk).toFixed(0)}, 绿值${(stats.atk - stats.batk).toFixed(0)}`;
    case "def":
      return `  白值${(stats.bdef).toFixed(0)}, 绿值${(stats.def - stats.bdef).toFixed(0)}`;
    case "hp":
      return `  白值${(stats.bhp).toFixed(0)}, 绿值${(stats.hp - stats.bhp).toFixed(0)}`;
    default:
      return "";
  }
}

function display_attributes(attributes){ // 在给定区域内展示角色数据和效果
  const wrap = document.getElementById(displayRegionId);
  wrap.replaceChildren(); // 清空
  const wrap_h1_1 = document.createElement("h1");
  wrap_h1_1.textContent = "角色数据";
  wrap.appendChild(wrap_h1_1);
  const statDiv = document.createElement("div");
  statDiv.className = "stat-grid";

  // 角色数据展示
  const displayStats = characters[attributes.ID].displayedStats;
  for(let statID of displayStats){
    const stats = attributes.stats;
    const subdiv = document.createElement("div");
    subdiv.className = "stat";
    const subdiv_statNameDiv = document.createElement("div");
    subdiv_statNameDiv.className = "statName";
    subdiv_statNameDiv.append(`${STATS[statID]}`); // 先插入文字
    const subdiv_statNameDiv_detailbtn = document.createElement("button"); // 详情显示
    subdiv_statNameDiv_detailbtn.className = "detailCell";
    subdiv_statNameDiv_detailbtn.textContent = "详情";
    subdiv_statNameDiv_detailbtn.onclick = function(){ // 弹出该词条相关的增益效果详情
      show_stat_buff_detail_popup(STATS[statID], build_stat_detail_lines(attributes.statBaseDetails, attributes.statBuffDetails, statID));
    };
    subdiv_statNameDiv.append(subdiv_statNameDiv_detailbtn);

    const subdiv_statValueDiv = document.createElement("div");
    subdiv_statValueDiv.className = "statValue";
    subdiv_statValueDiv.append(`${get_stat_value_string(statID, stats[statID])}`);
    const subdiv_statValueDiv_small = document.createElement("small");
    subdiv_statValueDiv_small.textContent = get_stat_note(attributes, statID);
    subdiv_statValueDiv.append(subdiv_statValueDiv_small);

    subdiv.append(subdiv_statNameDiv, subdiv_statValueDiv);
    statDiv.append(subdiv);
  }
  wrap.append(statDiv);

  // 角色吃到的效果展示
  const effectDiv = document.createElement("div");
  effectDiv.className = "ally";
  const effectDiv_h1 = document.createElement("h1");
  effectDiv_h1.textContent = "生效效果";
  effectDiv.appendChild(effectDiv_h1);
  const descBox = document.createElement("div");
  descBox.className = "desc-box";
  descBox.style["max-height"] = "600px";
  create_paragraphs_from_strings(descBox, attributes.buffDescs);
  effectDiv.appendChild(descBox);
  wrap.append(effectDiv);
}

function create_display_part(displayId){ // 设置展示区
  const maindiv = document.getElementById(displayId);
  const maindiv_subtitle = document.createElement("span");
  maindiv_subtitle.className = "subtitle";
  maindiv_subtitle.textContent = `面板展示: ${displayButtons[characterDisplayAttributeType[onDisplayCharacterID]]}`;
  maindiv.appendChild(maindiv_subtitle);
  // 三个按钮，控制展示什么面板
  const btndiv = document.createElement("div");
  btndiv.style["margin-top"] = "10px";
  btndiv.style["margin-bottom"] = "10px";
  for(let btnID of Object.keys(displayButtons)){
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = displayButtons[btnID];
    switch(btnID){
      case "initial":
        btn.onclick = function(){
          initialize_all_attributes();
          display_attributes(teamInitialAttributes[onDisplayCharacterID]);
          characterDisplayAttributeType[onDisplayCharacterID] = "initial";
          maindiv_subtitle.textContent = `面板展示: ${displayButtons[characterDisplayAttributeType[onDisplayCharacterID]]}`;
        };
        break;
      case "onField":
        btn.onclick = function(){
          const attributes = get_displayed_character_attributes(onDisplayCharacterID, true);
          display_attributes(attributes);
          characterDisplayAttributeType[onDisplayCharacterID] = "onField";
          maindiv_subtitle.textContent = `面板展示: ${displayButtons[characterDisplayAttributeType[onDisplayCharacterID]]}`;
        };
        break;
      case "offField":
        btn.onclick = function(){
          const attributes = get_displayed_character_attributes(onDisplayCharacterID, false);
          display_attributes(attributes);
          characterDisplayAttributeType[onDisplayCharacterID] = "offField";
          maindiv_subtitle.textContent = `面板展示: ${displayButtons[characterDisplayAttributeType[onDisplayCharacterID]]}`;
        };
        break;
    }
    btndiv.appendChild(btn);
  }
  maindiv.appendChild(btndiv);
  // 角色面板展示区域
  const region = document.createElement("div");
  region.className = "card";
  region.id = displayRegionId;
  maindiv.appendChild(region);
}

// 展示伤害细节
const damageComputationDivId = "damageComputationDiv";
function create_damage_table(wrapComputation, solve, desc = "计算表格"){// 基于计算结果 solve 在 wrapComputation 中画表格，wrapDetail中展示细节
  // 整理数据
  const results = solve.results;
  const dataNum = results.length;
  // 画图
  const wrapComputation_h1 = document.createElement("h1");
  wrapComputation_h1.textContent = desc + `(总耗时${solve.totalTime.toFixed(2)}秒)`;
  wrapComputation.appendChild(wrapComputation_h1);
  // #region 画表格
  const table = document.createElement("table");
    // #region 表头部分
  const tableHead = document.createElement("thead"); 
  let tr = document.createElement("tr");
  let th = document.createElement("th");
  th.textContent = "序号";
  tr.appendChild(th);
  for(let i=0; i<dataNum; i++){
    let th = document.createElement("th");
    th.textContent = i+1;
    th.classList.add("clickableth");
    th.dataset.col = i;
    tr.appendChild(th);
  }
  tr.addEventListener("click", function(e){
    const th = e.target.closest("th");
    if (!th || th.dataset.col == null) return;   // 序号列没有 data-col，忽略
    show_damage_detail_popup(results[Number(th.dataset.col)]);
    // debug
    // console.log(results[Number(th.dataset.col)].onfieldCharacterID);
  });
  tableHead.append(tr);
  // #endregion

    // #region 表体部分
  const tableBody = document.createElement("tbody"); // result 包含{dmg, element, talentMetaName, rxndmg, dmgType, details, repetitionCount, EACount, characterID, onfieldCharacterID}
  const data = {"角色名称": results.map(item => (item.characterID != null) ? characters[item.characterID].name : "——"),
    "角色位置": results.map(item => (item.characterID == null) ? "——" : ((item.isOnfield)? "前台":"后台")),
    "技能名称": results.map(item => (item.talentMetaName != null) ? item.talentMetaName : "——"),
    "攻击属性": results.map(item => ELEMENTS[item.element]), 
    "伤害反应类型": results.map(item => REACTION_DAMAGES[item.rxndmg]),
    "总倍率" : results.map(item => {
        const d = (item.characterID != null) ? item.details[item.characterID] : undefined;
        let scaling = (d == undefined || d.scaling == undefined) ? null : d.scaling;
        if(scaling == null){return "——"}
        else{
          let str = Object.entries(scaling).map(([k, v]) => {return (v*100).toFixed(1)+"%"+STATS[k]}).join(", ");
          return str;
        }
        }),
    "技能段数": results.map(item => item.hitnum||1),
    "重复次数": results.map(item => item.repetitionCount||1),
    // "时间戳" : results.map(item => {if(typeof item.timestamp === "number"){return item.timestamp.toFixed(2)}else{return "——"}}),
    "伤害值": results.map(item => (item.dmg).toFixed(0)),
  }
  for(let [key, list] of Object.entries(data)){
    tr = document.createElement("tr");
    th = document.createElement("th");
    th.textContent = key;
    th.className = "lbl";
    tr.appendChild(th);
    for(let i=0; i<dataNum; i++){
      let td = document.createElement("td");
      td.textContent = list[i];
      tr.appendChild(td);
    }
    tableBody.appendChild(tr);
  }
  // #endregion
  table.append(tableHead, tableBody);
  table.className = "dmg";
  const tableWrap = document.createElement("div");
  tableWrap.className = "table-wrap";   // 套用现成的外框样式
  tableWrap.appendChild(table);
  wrapComputation.appendChild(tableWrap);
  const displayWrap = document.createElement("div");
  displayWrap.className = "result-display";
  const text1 = document.createElement("span"); text1.textContent = "总伤害";
  const box1 = document.createElement("div"); box1.className = "result-display-box";
  box1.textContent = `${solve.totalDMG.toFixed(0)}`;
  const text2 = document.createElement("span"); text2.textContent = "DPS";
  const box2 = document.createElement("div"); box2.className = "result-display-box";
  box2.textContent = `${solve.dps.toFixed(0)}`;
  
  displayWrap.append(text1, box1, text2, box2);
  wrapComputation.appendChild(displayWrap);
  // #endregion
  return [wrapComputation_h1, tableWrap, displayWrap];
} 



const fmtExprValue = (k, v) => (v == undefined || isNaN(v)) ? "?" : (INT_TERM_SET.has(k) ? Number(v).toFixed(0) : Number(v).toFixed(3));
// 各伤害类型的乘区顺序："m"=乘区框（值从 details[ID] 取，名称从 MULTIPLIERS 取），其余为运算符
const EXPR_TERMS = {
  direct:        [["(", "txt"], ["baseMult","m"], ["×","op"], ["baseDMGMult","m"], ["×","op"], ["repetitionCount","m"], ["+","op"], ["flatDMG","m"], [")×","op"], ["dmgBonusMult","m"], ["×","op"], ["critMult","m"], ["×","op"], ["resMult","m"], ["×","op"], ["defMult","m"]],
  amplifying:    [["(", "txt"], ["baseMult","m"], ["×","op"], ["baseDMGMult","m"], ["×","op"], ["repetitionCount","m"], ["+","op"], ["flatDMG","m"], [")×","op"], ["rxnMult","m"], ["×","op"], ["rxnBonusMult","m"], ["×","op"], ["dmgBonusMult","m"], ["×","op"], ["critMult","m"], ["×","op"], ["resMult","m"], ["×","op"], ["defMult","m"]],
  catalyze:      [["(", "txt"], ["baseMult","m"], ["×","op"], ["baseDMGMult","m"], ["×","op"], ["repetitionCount","m"], ["+","op"], ["flatDMG","m"], ["+","op"], ["catalyzeMult","m"], ["×","op"], ["repetitionCount","m"], [")×","op"], ["dmgBonusMult","m"], ["×","op"], ["critMult","m"], ["×","op"], ["resMult","m"], ["×","op"], ["defMult","m"]],
  lunar:         [["(", "txt"], ["baseMult","m"], ["×","op"], ["rxnMult","m"], ["×","op"], ["rxnBaseDMGMult","m"], ["×","op"], ["rxnBonusMult","m"], ["×","op"], ["baseDMGMult","m"], ["×","op"], ["repetitionCount","m"], ["+","op"], ["flatDMG","m"], [")×","op"], ["critMult","m"], ["×","op"], ["resMult","m"], ["×","op"], ["elevationMult","m"]],
  stellar:       [["(", "txt"], ["baseMult","m"], ["×","op"], ["rxnMult","m"], ["×","op"], ["rxnBaseDMGMult","m"], ["×","op"], ["rxnBonusMult","m"], ["×","op"], ["baseDMGMult","m"], ["×","op"], ["repetitionCount","m"], ["+","op"], ["flatDMG","m"], [")×","op"], ["critMult","m"], ["×","op"], ["resMult","m"], ["×","op"], ["elevationMult","m"]],
  transformative:[["(", "txt"], ["levelMult","m"], ["×","op"], ["rxnMult","m"], ["×","op"], ["rxnBonusMult","m"], ["×","op"], ["repetitionCount","m"], ["+","op"], ["flatDMG","m"], [")×","op"], ["resMult","m"]],
  reactionLunar: [["levelMult","m"], ["×","op"], ["rxnMult","m"], ["×","op"], ["rxnBaseDMGMult","m"], ["×","op"], ["rxnBonusMult","m"], ["×","op"], ["resMult","m"], ["×","op"], ["critMult","m"], ["×","op"], ["elevationMult","m"]],
  reactionStellar:[["levelMult","m"], ["×","op"], ["rxnMult","m"], ["×","op"], ["rxnBaseDMGMult","m"], ["×","op"], ["rxnBonusMult","m"], ["×","op"], ["resMult","m"], ["×","op"], ["critMult","m"], ["×","op"], ["elevationMult","m"]],
};

function makeExprRow(terms, values, totalDMG){ // 生成一行表达式：terms 为 token 列表，values 为乘区值字典，totalDMG 为等号右侧总伤害
  const row = document.createElement("div");
  row.className = "expr-row";
  for(let [tok, type] of terms){
    if(type === "m"){
      const item = document.createElement("div"); item.className = "expr-item";
      const box = document.createElement("div"); box.className = "expr-box";
      box.textContent = fmtExprValue(tok, values[tok]);
      const name = document.createElement("div"); name.className = "expr-name";
      name.textContent = MULTIPLIERS[tok] || tok;
      item.append(box, name);
      row.appendChild(item);
    } else {
      const op = document.createElement("span");
      op.className = "expr-op"; op.textContent = tok;
      row.appendChild(op);
    }
  }
  const eq = document.createElement("span"); eq.className = "expr-op"; eq.textContent = "=";
  const item = document.createElement("div"); item.className = "expr-item";
  const box = document.createElement("div"); box.className = "expr-box expr-dmg";
  box.textContent = Number(totalDMG).toFixed(0);
  const name = document.createElement("div"); name.className = "expr-name"; name.textContent = "最终伤害";
  item.append(box, name);
  row.append(eq, item);
  return row;
}
const mkExprBox = (v, n, k="", cls = "") => {
  const item = document.createElement("div"); item.className = "expr-item";
  const box = document.createElement("div"); box.className = "expr-box " + cls;
  box.textContent = INT_TERM_SET.has(k) ? Number(v).toFixed(0) : Number(v).toFixed(3);
  const name = document.createElement("div"); name.className = "expr-name"; name.textContent = n;
  item.append(box, name); return item;
};
const mkExprOp = (t) => { const s = document.createElement("span"); s.className = "expr-op"; s.textContent = t; return s; };

function display_damage_details(wrapDetail, result){
  wrapDetail.replaceChildren();
  const wrapDetail_h1 = document.createElement("h1");
  wrapDetail_h1.textContent = `具体项细节: ${result.characterID? characters[result.characterID].name:""}
                                ${result.characterID? result.characterID === result.onfieldCharacterID?"前台":"后台" : ""}
                                ${result.talentMetaName || ""}`;
  wrapDetail.appendChild(wrapDetail_h1);
  // #region 开始填写细节
  const maindiv = document.createElement("div");
  maindiv.className = "detail-grid";
  const expressionDiv = document.createElement("div"); // 用来写伤害计算表达式的区域
  const detailDiv = document.createElement("div"); // 用来写角色部分面板详情和吃到的效果（可以参考“展示区”的写法）
    // #region ---------- 1. expressionDiv：伤害表达式 ----------
  const exprTitle = document.createElement("h2");
  exprTitle.textContent = "伤害表达式";
  expressionDiv.appendChild(exprTitle);
  const exprScroll = document.createElement("div");
  exprScroll.className = "expr-scroll";
  const dmgType = result.dmgType;
  if(dmgType === "reactionLunar" || dmgType === "reactionStellar"){
    // 全队参与的反应伤害：每个贡献者一行表达式，最后一行加权汇总
    const totalWeights = (dmgType === "reactionLunar") ? [1, 1/2, 1/12, 1/12] : [3/5, 3/10, 1/20, 1/20];
    const get_contribDmg = (cid) => { const d = result.details[cid];
        return d.dmg || d.levelMult * d.rxnMult * d.rxnBaseDMGMult * d.rxnBonusMult * d.resMult * d.critMult * d.elevationMult; };
    const contribDmgs = Object.keys(result.details).map(ID => get_contribDmg(ID));
    const sortedIDs = Object.keys(result.details).sort((a, b) => get_contribDmg(b) - get_contribDmg(a));
    const sortedContribDmgs = sortedIDs.map(ID => get_contribDmg(ID));
    const nContributors = contribDmgs.length;
    const weights = totalWeights.slice(0, nContributors);
    sortedIDs.forEach((cid, idx) => {
      const label = document.createElement("p"); label.className = "note";
      label.textContent = `贡献者：${characters[cid] ? characters[cid].name : cid}(权重 ${weights[idx]})`;
      label.style["color"] = "var(--txt)";
      exprScroll.appendChild(label);
      exprScroll.appendChild(makeExprRow(EXPR_TERMS[dmgType], result.details[cid], get_contribDmg(cid)));
    });

    const sumLabel = document.createElement("p"); sumLabel.className = "note"; sumLabel.textContent = "加权汇总"; sumLabel.style["color"] = "var(--txt)";
    exprScroll.appendChild(sumLabel);
    const sumRow = document.createElement("div"); sumRow.className = "expr-row";
    sumRow.append(mkExprOp("("));
    for(let i=0; i<nContributors; i++){
      sumRow.append(mkExprBox(sortedContribDmgs[i], characters[sortedIDs[i]].name+"伤害部分", "DMG"), mkExprOp("×"), mkExprBox(weights[i], "权重"));
      if(i < nContributors-1){sumRow.append(mkExprOp("+"))};
    }
    sumRow.append(mkExprOp(")"), mkExprOp("×"), mkExprBox(result.repetitionCount, MULTIPLIERS["repetitionCount"], "repetitionCount"), 
                  mkExprOp("+"));
    const tid = result.characterID;
    let flatDMGRow = null; // 如果羽毛增益存在，额外添加一行展示羽毛
    let flatDMGRemainingRow = null; // 羽毛的剩余次数展示
    if(tid != null && result.details[tid] && result.details[tid].flatDMG > 0){
      const d = result.details[tid];
      sumRow.append(mkExprBox(d.flatDMG, MULTIPLIERS["flatDMG"], "flatDMG"), mkExprOp("×"),
                    mkExprBox(d.resMult, MULTIPLIERS["resMult"], "resMult"), mkExprOp("×"),
                    mkExprBox(d.critMult, MULTIPLIERS["critMult"], "critMult"), mkExprOp("×"),
                    mkExprBox(d.elevationMult, MULTIPLIERS["elevationMult"], "elevationMult"),
                    );
      // 羽毛部分
      flatDMGRow = document.createElement("div"); flatDMGRow.className = "expr-row";
      let flatDMGBuffdetails = d.statBuffDetails["flatDMG"];
      flatDMGRow.append(mkExprBox(d.flatDMG, MULTIPLIERS["flatDMG"], "flatDMG"), mkExprOp("="));
      for(let idx in flatDMGBuffdetails){
        let i = Number(idx);
        let detail = flatDMGBuffdetails[i];
        let origRemaining = (detail.consumption != null && detail.remaining != null) ? detail.consumption + detail.remaining : null;
        flatDMGRow.append(mkExprBox(detail.singleFlatDMG, "单次额外伤害", "singleFlatDMG"), mkExprOp("×"));
        if(origRemaining != null){// 如果羽毛有次数限制，那么展示消耗次数计算过程
          flatDMGRow.append(mkExprOp("min("), mkExprBox(origRemaining, "触发前剩余次数", "remaining"), mkExprOp(", "),
                            mkExprBox(detail.hitnum, "技能段数", "hitnum"), mkExprOp("×"), 
                            mkExprBox(detail.repetitionCount, "重复次数", "repetitionCount"), mkExprOp(")"))
          if(!flatDMGRemainingRow){flatDMGRemainingRow = document.createElement("div"); flatDMGRemainingRow.className = "expr-row";}
          flatDMGRemainingRow.append(mkExprOp(detail.name + ": "), mkExprBox(detail.consumption, "消耗次数", "consumption"),
                                     mkExprOp(", "), mkExprBox(detail.remaining, "剩余次数", "remaining"), mkExprOp("; "))
        }
        else{//没有次数限制，直接等于 技能段数x重复次数
          flatDMGRow.append(mkExprBox(detail.hitnum, "技能段数", "hitnum"), mkExprOp("×"), 
                            mkExprBox(detail.repetitionCount, "重复次数", "repetitionCount"),)
        }
        if(i < flatDMGBuffdetails.length-1){flatDMGRow.append(mkExprOp("+"))};
      }
    }
    else{sumRow.append(mkExprBox(0, MULTIPLIERS["flatMult"], "flatMult"))};
    sumRow.append(mkExprOp("="), mkExprBox(result.dmg, "总伤害", "totalDMG", "expr-dmg"));
    exprScroll.appendChild(sumRow);
    if(flatDMGRow){exprScroll.appendChild(flatDMGRow)};
    if(flatDMGRemainingRow){exprScroll.appendChild(flatDMGRemainingRow)};
  } else {
    // 单人伤害：details 以角色ID为键；无触发角色(如反应星扩散:冰)时取第一个键
    const ID = (result.characterID != null) ? result.characterID : Object.keys(result.details)[0];
    exprScroll.appendChild(makeExprRow(EXPR_TERMS[dmgType] || [], result.details[ID] || {}, result.dmg));
    // 当scaling存在时，额外输出一个基础乘区的计算表达式
    const mainDetail = result.details[ID] ? result.details[ID] : null;
    const scaling = mainDetail ? (mainDetail.scaling ? mainDetail.scaling:null) : null;
    if(scaling){
      const stats = mainDetail.stats;
      const scalingKeys = Object.keys(scaling);
      const scalingRow = document.createElement("div"); scalingRow.className = "expr-row";
      exprScroll.appendChild(scalingRow);
      scalingRow.append(mkExprBox(mainDetail.baseMult, MULTIPLIERS["baseMult"], "baseMult"), mkExprOp("="));
      for(let k of scalingKeys){
        scalingRow.append(mkExprBox(scaling[k], "倍率"), mkExprOp("×"), mkExprBox(stats[k], STATS[k], k));
        if(k !== scalingKeys.at(-1)){
          scalingRow.appendChild(mkExprOp("+"));
        }
      }
    }
    // 当羽毛增益存在时，额外输出羽毛计算表达式
    if(mainDetail){
      let flatDMG = mainDetail.flatDMG > 0 ? mainDetail.flatDMG : null;
      let flatDMGRow = null; // 如果羽毛增益存在，额外添加一行展示羽毛
      let flatDMGRemainingRow = null; // 羽毛的剩余次数展示
      if(flatDMG){
        flatDMGRow = document.createElement("div"); flatDMGRow.className = "expr-row";
        let flatDMGBuffdetails = mainDetail.statBuffDetails["flatDMG"];
        flatDMGRow.append(mkExprBox(mainDetail.flatDMG, MULTIPLIERS["flatDMG"], "flatDMG"), mkExprOp("="));
        for(let idx in flatDMGBuffdetails){
          let i = Number(idx);
          let detail = flatDMGBuffdetails[i];
          let origRemaining = (detail.consumption != null && detail.remaining != null) ? detail.consumption + detail.remaining : null;
          flatDMGRow.append(mkExprBox(detail.singleFlatDMG, "单次额外伤害", "singleFlatDMG"), mkExprOp("×"));
          if(origRemaining != null){// 如果羽毛有次数限制，那么展示消耗次数计算过程
            flatDMGRow.append(mkExprOp("min("), mkExprBox(origRemaining, "触发前剩余次数", "remaining"), mkExprOp(", "),
                              mkExprBox(detail.hitnum, "技能段数", "hitnum"), mkExprOp("×"), 
                              mkExprBox(detail.repetitionCount, "重复次数", "repetitionCount"), mkExprOp(")"))
            if(!flatDMGRemainingRow){flatDMGRemainingRow = document.createElement("div"); flatDMGRemainingRow.className = "expr-row";}
            flatDMGRemainingRow.append(mkExprOp(detail.name + ": "), mkExprBox(detail.consumption, "消耗次数", "consumption"),
                                      mkExprOp(", "), mkExprBox(detail.remaining, "剩余次数", "remaining"), mkExprOp("; "))
          }
          else{//没有次数限制，直接等于 技能段数x重复次数
            flatDMGRow.append(mkExprBox(detail.hitnum, "技能段数", "hitnum"), mkExprOp("×"), 
                              mkExprBox(detail.repetitionCount, "重复次数", "repetitionCount"),)
          }
          if(i < flatDMGBuffdetails.length-1){flatDMGRow.append(mkExprOp("+"))};
        }
        exprScroll.append(flatDMGRow);
        if(flatDMGRemainingRow){exprScroll.append(flatDMGRemainingRow);}
      }
    } 
  }
  expressionDiv.appendChild(exprScroll);
  // #endregion

    // #region ---------- 2. detailDiv：角色面板 + 生效效果（写法同"展示区"） ----------
  const panelID = (result.characterID != null) ? result.characterID : result.onfieldCharacterID;
  const panelChar = characters[panelID];
  const panelDetail = result.details[panelID] || {};
  const panelStats = panelDetail.stats;
  const buffDescs = panelDetail.buffDescs || [];

  const panelTitle = document.createElement("h2");
  panelTitle.textContent = `角色面板：${panelChar ? panelChar.name : panelID}`;
  detailDiv.appendChild(panelTitle);

  // 新增：数值与效果左右排版的容器
  const panelGrid = document.createElement("div");
  panelGrid.className = "panel-grid";
  const statsWrap = document.createElement("div");    // 左：数值
  const effectsWrap = document.createElement("div");  // 右：生效效果

  if(panelStats && panelChar){
    const panelStatBuffDetails = panelDetail.statBuffDetails || {};
    const statDiv = document.createElement("div");
    statDiv.className = "stat-grid";
    for(let statID of panelChar.displayedStats){
      const subdiv = document.createElement("div"); subdiv.className = "stat";
      const nameDiv = document.createElement("div"); nameDiv.className = "statName"; nameDiv.textContent = STATS[statID];
      const detailBtn = document.createElement("button"); // 详情显示
      detailBtn.className = "detailCell";
      detailBtn.textContent = "详情";
      detailBtn.onclick = function(){ // 弹出该词条相关的增益效果详情
        show_stat_buff_detail_popup(STATS[statID], build_stat_detail_lines(panelDetail.statBaseDetails, panelStatBuffDetails, statID));
      };
      nameDiv.appendChild(detailBtn);
      const valueDiv = document.createElement("div"); valueDiv.className = "statValue";
      valueDiv.textContent = get_stat_value_string(statID, panelStats[statID] || 0);
      const small = document.createElement("small");
      small.textContent = get_stat_note({stats: panelStats}, statID);
      valueDiv.appendChild(small);
      subdiv.append(nameDiv, valueDiv);
      statDiv.appendChild(subdiv);
    }
    statsWrap.appendChild(statDiv);
  }
  const effectTitle = document.createElement("h2");
  effectTitle.textContent = "生效效果";
  const descBox = document.createElement("div");
  descBox.className = "desc-box"; descBox.style["max-height"] = "400px";
  create_paragraphs_from_strings(descBox, buffDescs);
  effectsWrap.append(effectTitle, descBox);

  panelGrid.append(statsWrap, effectsWrap);
  detailDiv.appendChild(panelGrid);

  // #endregion
  // ---------- 3. 挂载 ----------
  maindiv.append(expressionDiv, detailDiv);
  wrapDetail.appendChild(maindiv);
}

function create_damage_display_part(damageId){// 设置伤害展示区
  const part = document.getElementById(damageId);
  update_team_cost();
  const partSubDiv0 = document.createElement("div");
  partSubDiv0.className = "subtitle_btn";
  part.appendChild(partSubDiv0);
  const partSubDiv0_subtitleDiv = document.createElement("div");
  const partSubDiv0_btnDiv = document.createElement("div");
  const subtitle = document.createElement("span");
  subtitle.className = "subtitle";
  subtitle.textContent = `伤害展示区(总金数${teamCost.toFixed(0)})`;
  partSubDiv0_subtitleDiv.append(subtitle);
  const beginBtn = document.createElement("button");
  beginBtn.className = "btn";
  beginBtn.style.width = "160px";
  beginBtn.textContent = "开始计算";
  partSubDiv0_btnDiv.appendChild(beginBtn);
  partSubDiv0.append(partSubDiv0_subtitleDiv, partSubDiv0_btnDiv);
  // 计算区
  const partSubDiv1 = document.createElement("div");
  partSubDiv1.className = "card";
  partSubDiv1.style["margin-top"] = "10px";
  partSubDiv1.id = damageComputationDivId;
  part.appendChild(partSubDiv1);
  const partSubDiv1_h1 = document.createElement("h1");
  partSubDiv1_h1.textContent = `计算表格`;
  partSubDiv1.appendChild(partSubDiv1_h1);

  beginBtn.onclick = function(){
    update_team_cost();
    subtitle.textContent = `伤害展示区(总金数${teamCost.toFixed(0)})`;
    partSubDiv1.replaceChildren();
    // 第一步：获得 configs，拆解并画按钮
    const configs = get_configs(characters);
    const tableElementsList = [], btnList = [];
    const attrParamsList = [], onfieldActionParamsList=[], onfieldActionDetailsList=[], offfieldActionParamsList=[];
    const offfieldActionDetailsList=[], descList = [], cycleCounts = [], presetTotalTimes=[], labels = []; 
    const buttonSpan = document.createElement("h1"); 
    partSubDiv1.appendChild(buttonSpan);
    for(let key of Object.keys(configs)){
      const n = configs[key].attrParamsList.length;
      const buttonNames = configs[key].buttonNames;
      attrParamsList.push(...configs[key].attrParamsList);
      onfieldActionParamsList.push(...configs[key].onfieldActionParamsList);
      onfieldActionDetailsList.push(...configs[key].onfieldActionDetailsList);
      offfieldActionParamsList.push(...configs[key].offfieldActionParamsList);
      offfieldActionDetailsList.push(...configs[key].offfieldActionDetailsList);
      descList.push(...configs[key].descList);
      cycleCounts.push(...configs[key].cycleCounts);
      presetTotalTimes.push(...configs[key].totalTimes);
      const btns = Array.from({length:n}, (_,i)=>{return document.createElement("button")});
      btnList.push(...btns);
      if(key === "start"){
        buttonSpan.append("首轮：(\u00A0");
        labels.push(...buttonNames.map(v => "start"));
      }
      else if(key === "cycle"){
        buttonSpan.append("循环轮：(\u00A0");
        labels.push(...buttonNames.map(v => "cycle"));
      }
      else if(key === "end"){
        buttonSpan.append("尾轮：(\u00A0");
        labels.push(...buttonNames.map(v => "end"));
      }
      for(let idx in btns){
        let i = Number(idx), btn = btns[i];
        btn.className = "btn"; btn.textContent = buttonNames[i];
        buttonSpan.append(btn, `×${configs[key].cycleCounts[i].toFixed(0)}`);
        if(i !== n-1){buttonSpan.append(",\u00A0")}
        else{buttonSpan.append("\u00A0);\u00A0\u00A0")}
      }
    }

    // 第二步：计算伤害，并绘制表格（隐藏），存储表格对象
    let n = attrParamsList.length;
    let totalDMGs = [], totalTimes = [], cumulatedTime = 0, cumulatedDMG = 0;
    for(let i=0; i<n; i++){
      update_additionalAttributeParams(attrParamsList[i]);
      initialize_toUpdateAttributes();
      initialize_all_attributes();
      let fixedTotalTime = (labels[i] === "end") ? 120-cumulatedTime : undefined;
      let isCyclic = (labels[i] === "cycle") ? true : false;
      let params = {};
      params.isFirstCycle = (labels[i] === "start") ? true : false;
      params.isLastCycle = (labels[i] === "end") ? true : false;
      const [actionArray, totalTime] = get_action_array(teamInitialAttributes, characters, presetTotalTimes[i], fixedTotalTime,
            isCyclic, params, onfieldActionParamsList[i], onfieldActionDetailsList[i], offfieldActionParamsList[i], offfieldActionDetailsList[i]);
      const solve = simulate(actionArray, totalTime);
      const tableElements = create_damage_table(partSubDiv1, solve, descList[i]);
      if(i !== 0){// 默认显示第一个，后续的全部隐藏
        for(let element of tableElements){
          element.classList.add("hidden");
        }
      }
      tableElementsList.push(tableElements);
      totalDMGs.push(solve.totalDMG);
      totalTimes.push(solve.totalTime);
      cumulatedTime += solve.totalTime * cycleCounts[i];
      cumulatedDMG += solve.totalDMG * cycleCounts[i];
    }
    // 设置按钮的效果：切换表格的隐藏
    for(let i = 0; i < n; i++){
      btnList[i].onclick = function(){
        for(let element of tableElementsList[i]){element.classList.remove("hidden");}
        for(let j = 0; j<n; j++){
          if(j !== i){for(let element of tableElementsList[j]){element.classList.add("hidden");}}
        }
      }
    }
    if(n>1){
      // 建立分割线
      const separator = document.createElement("hr"); separator.className = "separator-line";
      partSubDiv1.append(separator);
      // 循环论总伤和DPS
      let cycleDMG = sum(totalDMGs.filter((_, idx)=>(labels[idx] === "cycle")));
      let cycleTime = sum(totalTimes.filter((_, idx)=>(labels[idx] === "cycle")));
      let cycleDPS = cycleDMG / cycleTime;
      const displayWrap1 = document.createElement("div"); displayWrap1.className = "result-display";
      const text1_1 = document.createElement("span"); text1_1.textContent = "一轮循环总伤害";
      const box1_1 = document.createElement("div"); box1_1.className = "result-display-box";
      box1_1.textContent = `${cycleDMG.toFixed(0)}`;
      const text1_2 = document.createElement("span"); text1_2.textContent = '\u00A0\u00A0\u00A0' + "一轮循环总耗时";
      const box1_2 = document.createElement("div"); box1_2.className = "result-display-box";
      box1_2.textContent = `${cycleTime.toFixed(2)}`;
      const text1_3 = document.createElement("span"); text1_3.textContent = '\u00A0\u00A0\u00A0' + "一轮循环DPS";
      const box1_3 = document.createElement("div"); box1_3.className = "result-display-box";
      box1_3.textContent = `${cycleDPS.toFixed(0)}`;
      displayWrap1.append(text1_1, box1_1, text1_2, box1_2, text1_3, box1_3);
      partSubDiv1.append(displayWrap1);

      const separator2 = document.createElement("hr"); separator2.className = "separator-line";
      partSubDiv1.append(separator2);

      // 120秒总伤和DPS
      let cumulatedDPS = cumulatedDMG / cumulatedTime;
      const displayWrap2 = document.createElement("div");
      displayWrap2.className = "result-display";
      const text2_1 = document.createElement("span"); text2_1.textContent = "120秒流程总伤害";
      const box2_1 = document.createElement("div"); box2_1.className = "result-display-box";
      box2_1.textContent = `${cumulatedDMG.toFixed(0)}`;
      const text2_2 = document.createElement("span"); text2_2.textContent = '\u00A0\u00A0\u00A0' + "流程总耗时";
      const box2_2 = document.createElement("div"); box2_2.className = "result-display-box";
      box2_2.textContent = `${cumulatedTime.toFixed(2)}`;
      const text2_3 = document.createElement("span"); text2_3.textContent = '\u00A0\u00A0\u00A0' + "流程DPS";
      const box2_3 = document.createElement("div"); box2_3.className = "result-display-box";
      box2_3.textContent = `${cumulatedDPS.toFixed(0)}`;
      displayWrap2.append(text2_1, box2_1, text2_2, box2_2, text2_3, box2_3);
      partSubDiv1.append(displayWrap2);
    }
  }
  

}


const characterSelectionPartId = "character_selection_part";
const characterBuildPartId = "character_build_part";
const characterDisplayPartId = "character_display_part";
const damageDisplayPartId = "damage_display_part";


create_character_selection_part(characterSelectionPartId);
create_character_build_part(characterBuildPartId);
create_display_part(characterDisplayPartId);
create_damage_display_part(damageDisplayPartId);

