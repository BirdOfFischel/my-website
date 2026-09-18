// 角色数据库：角色数据、角色效果函数，以及默认武器/圣遗物实例装配
// 由原 HTML 内联 script 拆分而来；保持原有全局类名/变量名/函数名不变。
// 依赖关系：本文件需按主 HTML 中的 script 引用顺序加载。
// 当角色Effect返回的 buff 是羽毛时，需要额外返回五个参数：
//    singleFlatDMG: 单次羽毛的增益，hitnum：技能段数，repetitionCount: 重复次数，consumption：羽毛消耗数（无限次数为null），remaining：剩余次数（无限则为null）
// 角色的 talentMeta 可以有额外变量 constellation，表示命座要求
// 角色中的 parameters 参数和 teamParameters 只在面板初始化时修改（即只受到permanent效果的影响），在计算过程中不改变这个参数；可变参数放在 variables
/* 表示状态的通用 parameters 有：
    1. 技能相关：toCastQ(是否释放大招), toCastE(是否释放元素战技), toCastCharge(是否释放重击), 
    2. 状态相关：isStellarConduct(是否星超导), isStellarSwirl(是否星扩散), isHealed(是否被治愈，特指满血无契), isFrozen(是否冻结)

*/

/* 手法列表，{技能单元，技能单元生效的条件、action不生效时的替换组合、不生效的效果ID集合，不生效的同类效果集合(如多个讨龙都不生效)，
              不生效的效果所属ID集合(包括角色、武器、圣遗物套装)，
              是否结束快照，新反应伤害类型，新元素类型, 补充参数、重数、时间戳} 
  talentMeta, condition, replacements, ineffectiveEffectIDSet, ineffectiveEquivEffectIDSet, ineffectiveEffectOwnerIDSet, 
  isSnapshotEnd, rxndmg, element, parameters, repetitionCount, timestamp
  必须含有的项：talentMeta, 
      当某个元素为剧变反应伤害时，talentMeta需要包括：触发角色ID、伤害属性、反应伤害类型、名称、ID; 如果无触发角色，则ID为null
  condition: 默认为{}，表示无条件执行这个行动; 否则 talentMeta 需要满足 condition 的条件之后才能执行; condition 目前考虑的参数有：
    constellation: 命座限制，只有大于等于这个值的action才被接受；     
    各种状态量(例如 toCastQ, toCastE, isStellarSwirl, isStellarConduct)，此时需要参数完全判等

  replacements: 列表，如果当前action判定不通过，就用这个列表中的 actions 替换原来的单个 action
  parameters: 本次行为进行伤害计算时额外需要的参数，如星超导所需的极星辉域层数
  repetitionCount: 重数，表示为了简化计算时，这个行为在整个流程中重复的次数，默认为1
  timestamp: 这是一个相对值，表示在一个action列表中，以第一个action为0时刻，当前action的大致时刻点，在伤害计算过程无用，用来判断效果在哪里失效
  模板：
  {talentMeta:Vesna.talentMetas.e0, condition:{}, replacement:null, ineffectiveEffectIDSet:new Set(), 
    ineffectiveEquivEffectIDSet: new Set(), ineffectiveEffectOwnerIDSet : new Set(),
    isSnapshotEnd:false, rxndmg:null, 
   element:"pyro", parameters:{}, repetitionCount:1},
*/

/*  关于角色手法返回函数 get_onfield_actionsObject 和 get_offfield_actionsObject
    get_onfield_actionsObject: 返回 {actions, duration}，不存在就是空列表或0，反应部分合并到actions中处理
    get_offfield_actionsObject： 返回 {actions,}，不存在就是空列表，反应部分合并到actions中处理

*/

import {STATS, ELEMENTS} from "./基础定义.js";


const actionSetIDSet = new Set(["ineffectiveEffectIDSet", "ineffectiveEquivEffectIDSet", "ineffectiveEffectOwnerIDSet"]);

export function range(start, end) {// 生成范围，start包括而end不包括
  return Array.from({ length: end - start }, (_, i) => start + i);
}
export const EPSILON = 1e-6;
const minCastingDuration = 0.5; // 最小技能释放时间
const maxCastingDuration = 3; // 最长技能释放时间
export function assign_details_to_action(action, details){// 将对象 details 合并到 action 中，注意其中对象、列表和集合的合并
  for(let [k, v] of Object.entries(details)){
    if(k === "condition" || k === "parameters"){
      if(action[k] == undefined){action[k]={...v}}
      else{Object.assign(action[k], v);}
    }
    else if(k === "replacements"){
      if(action.replacements == undefined){action.replacements = v}
      else{
        // 先取出要穿透的属性（排除 replacements 自身）
        const { replacements, ...restDetails } = details;
        // 递归合并其他属性到每个现有 item
        for (let item of action.replacements) {
          assign_details_to_action(item, restDetails);
        }
        action.replacements.push(...v); 
      }
    }
    else if(actionSetIDSet.has(k)){
      if(action[k] == undefined){action[k] = new Set(v)}
      else{action[k] = new Set([...action[k], ...v])}
    }
    else{action[k] = v} // 其他情况直接赋值
  }
}

function find_action_index_by_larger_timestamp(timestamp, actions){ // 恰好比 timestamp 大的第一个
  let thre = timestamp + EPSILON;
  let leftindex = null, rightindex = null;
  let lefttimestamp = 0, righttimestamp = Infinity;
  for(let i in actions){
    let index = Number(i);
    if(actions[index].timestamp != undefined){
      if(thre >= actions[index].timestamp){leftindex = index; lefttimestamp = actions[index].timestamp;}
      else{rightindex = index; righttimestamp = actions[index].timestamp; break;}
    }
  }
  let startindex = 0;
  if(leftindex == null && rightindex == null){return null} // 不存在时间戳
  else if(leftindex == null){startindex = rightindex;}
  else if(rightindex == null){startindex = leftindex+1;}
  else{startindex = Math.ceil((thre - lefttimestamp)/(righttimestamp - lefttimestamp) * (rightindex - leftindex)) + leftindex;}
  return startindex;
}
function find_action_index_by_smaller_timestamp(timestamp, actions){ // 恰好比 timestamp 小的第一个
  let thre = timestamp - EPSILON;
  let leftindex = null, rightindex = null;
  let lefttimestamp = 0, righttimestamp = Infinity;
  for(let i in actions){
    let index = Number(i);
    if(actions[index].timestamp != undefined){
      if(thre > actions[index].timestamp){leftindex = index; lefttimestamp = actions[index].timestamp;}
      else{rightindex = index; righttimestamp = actions[index].timestamp; break;}
    }
  }
  let startindex = 0;
  if(leftindex == null && rightindex == null){return null} // 不存在时间戳
  else if(leftindex == null){startindex = rightindex-1;}
  else if(rightindex == null){startindex = leftindex;}
  else{startindex = Math.floor((thre - lefttimestamp)/(righttimestamp - lefttimestamp) * (rightindex - leftindex)) + leftindex;}
  return startindex;
}

export function assign_details_to_actions_between_timestamps(actions, details, leftTimestamp=0, rightTimestamp=Infinity){
  const leftIndex = Math.max(find_action_index_by_larger_timestamp(leftTimestamp, actions), 0);
  const rightIndex = Math.min(find_action_index_by_smaller_timestamp(rightTimestamp, actions), actions.length-1);
  for(let i = leftIndex; i<=rightIndex; i++){
    assign_details_to_action(actions[i], details);
  }
}

export function check_action_condition(initialAttributes, action){
  let attr = initialAttributes || {};
  const condition = action.condition || {};
  let toPass = true;
  if(action.talentMeta.constellation > attr.constellation){toPass = false;} // 命座判定不通过
  if(toPass){
    for(let [k, v] of Object.entries(condition)){
      if(k === "constellation"){toPass = toPass && (attr.constellation >= v)}
      else{toPass = toPass && (attr[k] === v || action.talentMeta[k] === v)}
      if(!toPass){break;}
    }
  }
  return toPass;
}

export function get_effect_segment_ineffective_ranges(startTimestamp, effectDuration, onfieldDurations,){ // 获得效果在各个角色在场时段内的失效时段
  // 失效 action 不包括在端点处（默认range的端点处效果依然生效），因此需要设置 EPSILON 来略微延长端点来强制失效
  const n_seg = onfieldDurations.length;
  if(n_seg === 0){return []}; // 空在场时间列表表示队伍中没有角色
  let swapTimestamps = [0];
  for(let i = 0; i<n_seg; i++){
    swapTimestamps.push(swapTimestamps.at(-1) + onfieldDurations[i]);
  }
  let startSegIndex = swapTimestamps.findIndex(x => (x>=startTimestamp));
  const effectIneffectiveRanges = onfieldDurations.map(x => []);
  let s0 = Math.min(swapTimestamps[startSegIndex] - startTimestamp, effectDuration);
  let s = effectDuration - s0; // 还剩下的增益时间
  let endSegIndex = mod(startSegIndex-1, n_seg);
  if(s < EPSILON){ // buff很短，甚至站场都没结束
    effectIneffectiveRanges[endSegIndex] = [[swapTimestamps[endSegIndex]-2*EPSILON, startTimestamp], 
      [startTimestamp+effectDuration, swapTimestamps[startSegIndex]+2*EPSILON]];
    // 其他段都添加 "不生效"
    for(let i = 0; i<n_seg-1; i++){
      let idx = mod(startSegIndex+i, n_seg);
      effectIneffectiveRanges[idx] = [[swapTimestamps[idx]-2*EPSILON, swapTimestamps[idx+1]+2*EPSILON]];
    }
    return effectIneffectiveRanges;
  }
  for(let i=0; i<n_seg; i++){
    let currSegIdx = mod(startSegIndex+i, n_seg);
    if(onfieldDurations[currSegIdx] >= s){ // 当前段比剩余时间长，效果在这段失效
      if(currSegIdx === endSegIndex){// 当前段是判别的最后一段，需要额外考虑开始时候的 s0
        if(s + s0 < onfieldDurations[endSegIndex]){
          effectIneffectiveRanges[endSegIndex].push([swapTimestamps[endSegIndex]+s, startTimestamp]);
        }
      }
      else{
        effectIneffectiveRanges[currSegIdx].push([swapTimestamps[currSegIdx]+s, swapTimestamps[currSegIdx+1]+2*EPSILON]); s=0; 
        // 当效果失效、当前段又不是 endSegIndex 时，需要给从 currSegIdx+1开始、到 endSegIndex 的段都加上失效标记
        for(let j = i+1; j<n_seg; j++){
          let idx = mod(startSegIndex+j, n_seg);
          if(idx === endSegIndex){effectIneffectiveRanges[idx].push([swapTimestamps[endSegIndex]-2*EPSILON, startTimestamp])}
          else{effectIneffectiveRanges[idx].push([swapTimestamps[idx]-2*EPSILON, swapTimestamps[idx+1]+2*EPSILON])}
        }
        break;
      }
    }
    else{
      s -= onfieldDurations[currSegIdx];
    }
  };
  return effectIneffectiveRanges;
}



function isSetEqual(a, b){
  if (!(a instanceof Set) || !(b instanceof Set)) return false;
  if (a.size !== b.size) return false;

  for (const item of a) {
    if (!b.has(item)) return false;
  }
  return true;
}

export function sum(array){
  return array.reduce((acc, cur) => {return acc+cur}, 0);
}

const mod = (n, m) => ((n % m) + m) % m;

function removeByIndicesInPlace(arr, indices) { // 从 arr 中删除 indices 位置的元素
  const removeSet = new Set(indices);
  let write = 0;
  for (let read = 0; read < arr.length; read++) {
    if (!removeSet.has(read)) {
      arr[write++] = arr[read];
    }
  }
  arr.length = write;
  return arr;
}


function merge_actions_by_ineffectiveEffectIDSet(actions, selections = undefined){// 同一个角色的action靠 ineffectiveEffectIDSet 和技能ID合并
  // selections= {角色ID: new Set([技能ID1, 技能ID2, ...])}，如果这个值存在，那么只合并上述组合的技能
  const check = (action) => {
    if(selections == undefined){return true;}
    let set = selections[action.talentMeta.characterID] || new Set([]);
    return set.has(action.talentMeta.ID);
  }
  let j=0;
  let indices = []; // 被选择融合的元素索引
  while(j < actions.length){
    let currAction = actions[j];
    if(!check(currAction)){j++; continue;} // 先进行 check 判定
    let currSet = currAction.ineffectiveEffectIDSet || new Set([]);
    let k = j+1;
    while(k < actions.length){
      let set = actions[k].ineffectiveEffectIDSet || new Set([]);
      if(currAction.talentMeta.ID === actions[k].talentMeta.ID 
          && currAction.talentMeta.characterID === actions[k].talentMeta.characterID && isSetEqual(currSet, set)){
        currAction.repetitionCount = (currAction.repetitionCount || 1) + (actions[k].repetitionCount || 1);
        currAction.timestamp = (actions[k].timestamp > currAction.timestamp) ? actions[k].timestamp : currAction.timestamp;
        actions.splice(k, 1);
      }
      else{k++};
    }
    indices.push(j);
    j++;
  }
  // 将被融合的这些元素从原来的位置删去，放到最后面
  const mergedActions = indices.map(idx => actions[idx]);
  removeByIndicesInPlace(actions, indices);
  actions.push(...mergedActions);
}

function get_segment_offfield_actions(talentMeta, firstTimestamp, metaInterval, maxCount, index, onfieldDurations, 
  effectSchedules = {}, toMerge = false){
  /* 给定当前角色后台伤害的talentMeta、第一次造成后台伤害的时间戳(0时间戳为当前角色登场时间)、循环时间间隔、最大次数、在队伍中的索引、
     队伍中角色站场时间列表、生效效果对象(key是效果ID，value是一个列表，[起始时间，终止时间, 生效次数]，0时间戳为首个角色登场时间, 生效次数不存在就是没有限制) 
     返回一个列表，列表中的元素为与队伍角色一一对应列表，表示那个角色站场时后台进行的行为，考虑效果无效的情况（引入ineffectiveEquivEffectIDSet）。
     考虑流程是循环的，如果存在的meta的时间超过了 onfieldDurations 的最终时刻，那么会返回到一开始，但是不能进入第二轮 index 的时段。
     toMerge 表示是否要将各段的
     */
  const n_seg = onfieldDurations.length;
  if(n_seg === 0){return []}; // 空在场时间列表表示队伍中没有角色
  let swapTimestamps = [0];
  for(let i = 0; i<n_seg; i++){
    swapTimestamps.push(swapTimestamps.at(-1) + onfieldDurations[i]);
  }
  const totalTime = swapTimestamps.at(-1);
  const count = Math.min(maxCount, Math.floor(totalTime/metaInterval)+1);
  // 获得后台的 actions 初始列表
  let actions = Array.from({length:count}, (_, i)=>{
    return {talentMeta:talentMeta, timestamp:swapTimestamps[index]+firstTimestamp+i*metaInterval};
  });
  actions.sort((a,b)=>a.timestamp - b.timestamp);
  // 开始配置效果
  const effectIDs = Object.keys(effectSchedules);
  const labelsList = Array.from({length:count}, ()=>[]); // 不生效的效果索引组成的列表，和 action 一一对应
  for(let effectID of effectIDs){
    let [start, end, maxEffectiveCount] = effectSchedules[effectID];
    maxEffectiveCount = (maxEffectiveCount == undefined)? Infinity : maxEffectiveCount;
    let currEffectCount = 0, currTS = 0; // 当前已生效的action次数，当前action的时间戳
    for(let j = 0; j<count; j++){
      currTS = actions[j].timestamp ?? currTS;
      if(currTS < start || currTS > end){labelsList[j].push(effectID)}
      else{
        if(currEffectCount >= maxEffectiveCount){labelsList[j].push(effectID)}
        else{currEffectCount++;}
      }
    }
  }
  for(let i = 0; i<count; i++){
    const set = new Set(labelsList[i]);
    actions[i].ineffectiveEffectIDSet = set;
    actions[i].timestamp = actions[i].timestamp % totalTime; // 将超过范围的时间戳压回来
  }
  // 开始给每个 segment 放入 actions
  const actionsList = Array.from({length:n_seg}, ()=>[]);
  let segIndex = 0, i=0;
  while(i<count && segIndex < n_seg){
    if(actions[i].timestamp < swapTimestamps[segIndex+1]){actionsList[segIndex].push(actions[i]); i++;}
    else{segIndex++;}
  }
  // 判断是否将每一段中的同类合并
  if(toMerge){
    for(let i=0; i<n_seg;i++){
      merge_actions_by_ineffectiveEffectIDSet(actionsList[i]);
    }
  }
  // 返回结果
  return actionsList;
}


export function sort_actions_by_timestamps(actions){
  actions.sort((a,b) => {
    let aTS = (typeof a.timestamp === "number")? a.timestamp : null;
    let bTS = (typeof b.timestamp === "number")? b.timestamp : null;
    if(aTS == null || bTS == null){return 0}
    else{return aTS - bTS};
  })
}
export function assign_detials_to_segment_actions(actionsList, swapTimeStamps, teamInitialAttributes, effectDetails = {}, toMerge=false){
  /* effectDetails = {effectID: {effectSchedules:[开始时间，结束时间，次数限制], effect:具体效果对象} }*/
  const totalTime = swapTimeStamps.at(-1);
  const n_seg = actionsList.length;
  const addIneffectiveID = (action, effectID) => {
    if(action.ineffectiveEffectIDSet == undefined){action.ineffectiveEffectIDSet = new Set([effectID])}
    else{action.ineffectiveEffectIDSet.add(effectID)};
  }
  // 开始配置效果
  const effectIDs = Object.keys(effectDetails);
  for(let effectID of effectIDs){
    let [start, end, maxEffectiveCount] = effectDetails[effectID].effectSchedules;
    let effect = effectDetails[effectID].effect;
    let restEffectiveCount = (maxEffectiveCount == undefined)? Infinity : maxEffectiveCount;
    // 因为 actionsList 是循环的，如果 end 超出 totalTime，就额外生成一个从0开始的区域
    let schedulesList = [];
    if(end <= totalTime){schedulesList.push([start, end])}
    else{schedulesList.push([start, totalTime], [0, end-totalTime])};
    let startSegIdx = mod(swapTimeStamps.findIndex(x => (x > start))-1, n_seg);
    // 开始处理
    let currTS = 0; // 当前action的时间戳
    for(let i = 0; i < n_seg; i++){
      let currSegIdx = mod(startSegIdx+i, n_seg);
      currTS = swapTimeStamps[currSegIdx];
      let actions = actionsList[currSegIdx];
      for(let idx in actions){
        let j = Number(idx), action = actions[j];
        currTS = action.timestamp ?? currTS;
        let isEffective = false;
        for(let rg of schedulesList){
          if(currTS >= rg[0] && currTS <= rg[1]){isEffective = true; break;}
        }
        if(isEffective){
          if(restEffectiveCount > 0){
            if(effect != undefined){isEffective = isEffective && check_effect(effect, teamInitialAttributes, action)};
            if(isEffective){
              let repetitionCount = action.repetitionCount || 1;
              let hitnum = action.talentMeta.hitnum || 1;
              restEffectiveCount -= Math.min(restEffectiveCount, repetitionCount*hitnum);
            }
            else{addIneffectiveID(action, effectID);}
          }
          else{addIneffectiveID(action, effectID);}
        }
        else{addIneffectiveID(action, effectID);}
      }
    }
  }
  if(toMerge){
    for(let i=0; i<n_seg;i++){
      merge_actions_by_ineffectiveEffectIDSet(actionsList[i]);
    }
  }
}

function check_effect(effect, teamInitialAttributes, action){// 检测effect是否生效，其中角色ID就是action的ID（受益人和施加人是同一个）
  let characterID = action.talentMeta.characterID, isOnfield = action.talentMeta.isOnfield;
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
  return mark;
}







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
    a3 : {ID : "a3", characterID : "Vesna", name : "普攻3",
          element:"anemo", gauge:1, EACount:1, rxndmg:"none", talent:"A",
          attackType:"attack", isOnfield:true, isSnapshot:false, 
          hitnum:2, scaling:{10:{atk:1.11}, 13:{atk:1.346}}},
    a4 : {ID : "a4", characterID : "Vesna", name : "普攻4",
          element:"anemo", gauge:1, EACount:1, rxndmg:"none", talent:"A",
          attackType:"attack", isOnfield:true, isSnapshot:false, 
          hitnum:1, scaling:{10:{atk:1.17}, 13:{atk:1.417}}},
    a5 : {ID : "a5", characterID : "Vesna", name : "普攻5",
          element:"anemo", gauge:1, EACount:1, rxndmg:"none", talent:"A",
          attackType:"attack", isOnfield:true, isSnapshot:false, 
          hitnum:1, scaling:{10:{atk:1.234}, 13:{atk:1.496}}},
    a6 : {ID : "a6", characterID : "Vesna", name : "普攻6",
          element:"anemo", gauge:1, EACount:1, rxndmg:"none", talent:"A",
          attackType:"attack", isOnfield:true, isSnapshot:false, 
          hitnum:1, scaling:{10:{atk:1.428}, 13:{atk:1.73}}},
    z : {ID : "z", characterID : "Vesna", name : "重击",
          element:"anemo", gauge:1, EACount:1, rxndmg:"none", talent:"A",
          attackType:"charge", isOnfield:true, isSnapshot:false, 
          hitnum:1, scaling:{10:{atk:2.63}, 13:{atk:3.187}}},

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
  parameters : {initPoiseStacks : 0, toCastE:true, toCastQ:true,},  // 固有天赋、技能效果、命座效果可能用到的其他参数
  teamParameters : {}, // 自己的效果给队友生效时，队友需要具有的字段
  variables : {addedPoiseStacks : 0, },  // 在后续buff计算中需要用到的全局参数，定义在这里
  /*... 方法 ...*/
  reset_variables(attributes){Object.keys(this.variables).forEach(key => {attributes[key]=this.variables[key]})},
  get_max_CD(attributes){return 18*(1-attributes.stats.CDReduction)}, // 角色技能循环的最大CD
  get_onfield_actionsObject(attributes, params={}, actionDetails={}){// 获得角色站场时的actions，为对象 {actions, reactions, duration}
    const reactionStellarSwirlAnemoOnfieldTalentMeta = {characterID: "Vesna", element:"anemo", rxndmg:"reactionStellarSwirl", 
                                                        ID:"reactionStellarSwirlAnemo", name:"反应星扩散:风", isOnfield:true};
    const reactionStellarSwirlCryoTalentMeta = {characterID: "Vesna", element:"cryo", rxndmg:"reactionStellarSwirl",
                                                ID:"reactionStellarSwirlCryo", name:"反应星扩散:冰"};
    /*时间设置：e0:0.7, e1:0.4s, e2:0.7s, e3:1.33s, a1:0.5s, a2:0.5s, a3:0.75s, a4:0.5s, a5:0.6s, a6:0.6s, q:2.5s, z:1.5s
    */
    const talentTimeDict = {a1:0.5, a2:0.5, a3:0.75, a4:0.5, a5:0.6, a6:0.6, q:2.5, z:1.5, step:1, e0:0.7, e1:0.4, e2:0.7, e3:1.33};
    let Qdrt = attributes.toCastQ ? 2.5 : 0;
    let delta = attributes.toCastQ ? 1 : 0;
    const applyTimestamps = (actions) => {
      let availableKeySet = new Set(Object.keys(talentTimeDict));
      let prevTalentID = null, currTS = 0;
      for(let action of actions){
        let ID = action.talentMeta.ID.split("_")[0];
        if(availableKeySet.has(ID) && ID !== prevTalentID){currTS += talentTimeDict[ID]; action.timestamp=currTS; prevTalentID=ID;}
        else{action.timestamp=currTS;}//附加伤害，比如e3有两类伤害，认为同时生效
      }
    }
    let results = {};
    switch(attributes.constellation){
      case 0: {
        let actions;
        if(attributes.toCastQ){
          actions = [
            {talentMeta:Vesna.talentMetas.e0},
            {talentMeta:Vesna.talentMetas.e1,},
            {talentMeta:Vesna.talentMetas.e2_anemo,},
            {talentMeta:Vesna.talentMetas.e2_stellar,},
            {talentMeta:Vesna.talentMetas.q,},
            {talentMeta:Vesna.talentMetas.e3_stellar_1,},
            {talentMeta:Vesna.talentMetas.e3_stellar_2,},
            {talentMeta:Vesna.talentMetas.a1},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a2,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a3,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a4,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.e3_stellar_1,},
            {talentMeta:Vesna.talentMetas.e3_stellar_2,},
            {talentMeta:Vesna.talentMetas.a1},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a2,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a3,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a4,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.e3_stellar_1,},
            {talentMeta:Vesna.talentMetas.e3_stellar_2,},
          ]
        }
        else{
          actions = [
            {talentMeta:Vesna.talentMetas.e0},
            {talentMeta:Vesna.talentMetas.e1,},
            {talentMeta:Vesna.talentMetas.e2_anemo,},
            {talentMeta:Vesna.talentMetas.e2_stellar,},
            {talentMeta:Vesna.talentMetas.a1},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a2,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a3,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a4,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a5,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a6,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.e3_stellar_1,},
            {talentMeta:Vesna.talentMetas.e3_stellar_2,},
            {talentMeta:Vesna.talentMetas.a1},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a2,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a3,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a4,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a5,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a6,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.e3_stellar_1,},
            {talentMeta:Vesna.talentMetas.e3_stellar_2,},
            {talentMeta:Vesna.talentMetas.e3_stellar_1,},
            {talentMeta:Vesna.talentMetas.e3_stellar_2,},
          ]
        }
        applyTimestamps(actions);
        const duration = actions.at(-1).timestamp + 10*EPSILON;
        results.actions = actions; results.duration = duration;
        break;
      }
      case 6: {
        const actions = [
          {talentMeta:Vesna.talentMetas.e0,},
          {talentMeta:Vesna.talentMetas.e1,},
          {talentMeta:Vesna.talentMetas.e2_anemo,},
          {talentMeta:Vesna.talentMetas.e2_stellar,},
          {talentMeta:Vesna.talentMetas.e3_stellar_1,},
          {talentMeta:Vesna.talentMetas.e3_stellar_2,},
          {talentMeta:Vesna.talentMetas.step_anemo,},
          {talentMeta:Vesna.talentMetas.step_stellar,},
          {talentMeta:Vesna.talentMetas.e_windPinion,},
          ...(attributes.toCastQ ? [{talentMeta:Vesna.talentMetas.q,}] : []),
          {talentMeta:Vesna.talentMetas.e3_stellar_1,},
          {talentMeta:Vesna.talentMetas.e3_stellar_2,},
          {talentMeta:Vesna.talentMetas.step_anemo,},
          {talentMeta:Vesna.talentMetas.step_stellar,},
          {talentMeta:Vesna.talentMetas.e_windPinion,},
          {talentMeta:Vesna.talentMetas.e3_stellar_1,},
          {talentMeta:Vesna.talentMetas.e3_stellar_2,},
          {talentMeta:Vesna.talentMetas.step_anemo,},
          {talentMeta:Vesna.talentMetas.step_stellar,},
          {talentMeta:Vesna.talentMetas.e_windPinion,},
          {talentMeta:Vesna.talentMetas.e3_stellar_1,},
          {talentMeta:Vesna.talentMetas.e3_stellar_2,},
          {talentMeta:Vesna.talentMetas.step_anemo,},
          {talentMeta:Vesna.talentMetas.step_stellar,},
          {talentMeta:Vesna.talentMetas.e_windPinion,},
        ];
        applyTimestamps(actions);
        const duration = actions.at(-1).timestamp + 10*EPSILON;
        results.actions = actions; results.duration = duration;
        break;
      }
      default: {
        let actions;
        if(attributes.toCastQ){
          actions = [
            {talentMeta:Vesna.talentMetas.e0},
            {talentMeta:Vesna.talentMetas.e1,},
            {talentMeta:Vesna.talentMetas.e2_anemo,},
            {talentMeta:Vesna.talentMetas.e2_stellar,},
            {talentMeta:Vesna.talentMetas.a1},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a2,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.e3_stellar_1,},
            {talentMeta:Vesna.talentMetas.e3_stellar_2,},
            {talentMeta:Vesna.talentMetas.a1},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a2,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.q,},
            {talentMeta:Vesna.talentMetas.e3_stellar_1,},
            {talentMeta:Vesna.talentMetas.e3_stellar_2,},
            {talentMeta:Vesna.talentMetas.a1},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a2,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.e3_stellar_1,},
            {talentMeta:Vesna.talentMetas.e3_stellar_2,},
            {talentMeta:Vesna.talentMetas.a1},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a2,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.e3_stellar_1,},
            {talentMeta:Vesna.talentMetas.e3_stellar_2,},
          ]
        }
        else{
          actions = [
            {talentMeta:Vesna.talentMetas.e0},
            {talentMeta:Vesna.talentMetas.a1},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a2,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.e1,},
            {talentMeta:Vesna.talentMetas.a1},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a2,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.e2_anemo,},
            {talentMeta:Vesna.talentMetas.e2_stellar,},
            {talentMeta:Vesna.talentMetas.a1},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a2,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.e3_stellar_1,},
            {talentMeta:Vesna.talentMetas.e3_stellar_2,},
            {talentMeta:Vesna.talentMetas.a1},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a2,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.e3_stellar_1,},
            {talentMeta:Vesna.talentMetas.e3_stellar_2,},
            {talentMeta:Vesna.talentMetas.a1},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a2,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.e3_stellar_1,},
            {talentMeta:Vesna.talentMetas.e3_stellar_2,},
            {talentMeta:Vesna.talentMetas.a1},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.a2,},
            {talentMeta:Vesna.talentMetas.e_windPinion,},
            {talentMeta:Vesna.talentMetas.e3_stellar_1,},
            {talentMeta:Vesna.talentMetas.e3_stellar_2,},
          ]
        }
        applyTimestamps(actions);
        const duration = actions.at(-1).timestamp + 10*EPSILON;
        results.actions = actions; results.duration = duration;
        break;
      }
    }
    const reactions = [
        {talentMeta:reactionStellarSwirlAnemoOnfieldTalentMeta, repetitionCount:10, timestamp:results.duration},
        {talentMeta:reactionStellarSwirlCryoTalentMeta, repetitionCount:5, parameters:{stacks:3}, timestamp:results.duration},
      ];
    results.actions.push(...reactions);
    // 给actions中所有的元素赋值 details
    for(let action of results.actions){assign_details_to_action(action, actionDetails)};
    return results;
  },
  get_offfield_actionsObject(attributes, charIndex, onfieldDurations, effectSchedules={}, toMerge=false, params={}, actionDetails={}){// 获得角色后台时的actions，为数组
    return {};
  },
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
          hitnum:1, scaling:{10:{atk:3.065}, 13:{atk:3.618}}},
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
    {ID:"Odette_QEffect", condition:{characterIDs:["Odette"], toCastQ:true},
      effect:Q_effect_of_Odette, isNet:true, isPermanent:false,
      get desc(){return `奥黛塔Q效果：给自身${Odette.constellation >= 5 ? 62:50}%星烁反应伤害加成`}},
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
    4 : [{ID:"Odette_Constellation4", condition:{excludedCharacterIDs:["Odette"], check:check_constellation_4_of_Odette}, 
          effect:constellation_4_of_Odette,
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
                QBonus:0.5, brillianceAtkp:0, toCastE:true, toCastQ:false,
                },  // 固有天赋、技能效果、命座效果可能用到的其他参数
  teamParameters : {}, // 自己的效果给队友生效时，队友需要具有的字段
  variables : {},  // 在后续buff计算中需要用到的全局参数，定义在这里
  /*... 方法 ...*/
  reset_variables(attributes){Object.keys(this.variables).forEach(key => {attributes[key]=this.variables[key]})},
  get_max_CD(attributes){return 15*(1-attributes.stats.CDReduction)}, // 角色技能循环的最大CD
  get_onfield_actionsObject(attributes, params={stacks:0, addedDuration:0, isStellarSwirl:undefined, isStellarConduct:undefined}, 
                            actionDetails={}){
    const isStellarSwirl = (params.isStellarSwirl ?? attributes.isStellarSwirl) ?? false;
    const isStellarConduct = (params.isStellarConduct ?? attributes.isStellarConduct) ?? false;
    const talentTimeDict = {e0:1, e1:1, e2:0.5, q1:1.5, q2:0.5}
    const applyTimestamps = (actions) => {
      let availableKeySet = new Set(Object.keys(talentTimeDict));
      let prevTalentID = null, currTS = 0;
      for(let action of actions){
        let ID = action.talentMeta.ID.split("_")[0];
        if(availableKeySet.has(ID) && ID !== prevTalentID){currTS += talentTimeDict[ID]; action.timestamp=currTS; prevTalentID=ID;}
        else{action.timestamp=currTS;}//附加伤害，比如e3有两类伤害，认为同时生效
      }
    }
    const actions = [
      {talentMeta:Odette.talentMetas.e0,},
    ];
    if(attributes.toCastQ){
      actions.push({talentMeta:Odette.talentMetas.q1,}, {talentMeta:Odette.talentMetas.q2,});
    }
    actions.push({talentMeta:Odette.talentMetas.e1_cryo,});
    if(isStellarSwirl === true && !isStellarConduct){actions.push({talentMeta:Odette.talentMetas.e2_swirl,})}
    else{actions.push({talentMeta:Odette.talentMetas.e2_conduct, parameters:{stacks:params.stacks || 0}})};
    applyTimestamps(actions);
    const duration = actions.at(-1).timestamp + 10*EPSILON + params.addedDuration;
    // 给actions中所有的元素赋值 details
    for(let action of actions){assign_details_to_action(action, actionDetails)};
    return {actions, duration};
  },
  get_offfield_actionsObject(attributes, charIndex, onfieldDurations, effectSchedules={}, toMerge=false, 
            params={isStellarSwirl:undefined, isStellarConduct:undefined, segIndices:[]}, actionDetails={}){
    const isStellarSwirl = (params.isStellarSwirl ?? attributes.isStellarSwirl) ?? false;
    const isStellarConduct = (params.isStellarConduct ?? attributes.isStellarConduct) ?? false;
    const meta1Rep = (isStellarSwirl && !isStellarConduct) ? Odette.talentMetas.e_off1_swirl : Odette.talentMetas.e_off1_conduct;
    const meta2Rep = (isStellarSwirl && !isStellarConduct) ? Odette.talentMetas.e_off2_swirl : Odette.talentMetas.e_off2_conduct;         

    const meta1 = (attributes.isStellarSwirl && !attributes.isStellarConduct) ? Odette.talentMetas.e_off1_swirl : Odette.talentMetas.e_off1_conduct;
    const meta2 = (attributes.isStellarSwirl && !attributes.isStellarConduct) ? Odette.talentMetas.e_off2_swirl : Odette.talentMetas.e_off2_conduct;
    const maxCount = 5, metaInterval = 4; // 每一种伤害都是间隔4秒一次，初始时间不一样
    const firstTS1 = 2, firstTS2 = 4;
    // 获得每种伤害对应的列表
    const candidateMetas = [meta1, Odette.talentMetas.e_off1_cryo, meta2, Odette.talentMetas.e_off2_cryo];
    const firstTSList = [firstTS1, firstTS1, firstTS2, firstTS2];
    const actionsListArray = [];
    for(let idx in candidateMetas){
      let i = Number(idx), meta = candidateMetas[i], firstTS = firstTSList[i];
      const actionsList = get_segment_offfield_actions(meta, firstTS, metaInterval, maxCount, charIndex, onfieldDurations, effectSchedules);
      actionsListArray.push(actionsList);
    }
    // 合并, 当 params.segIndices 非空时，将其中的 meta1 换成 meta1Rep, meta2 换成 meta2Rep
    const actionsList = [];
    for(let i=0;i<onfieldDurations.length;i++){
      let actions = actionsListArray.reduce((list, cur) => {list.push(...cur[i]); return list}, []);
      // 排序
      sort_actions_by_timestamps(actions);
      if(params.segIndices.includes(i)){// 替换
        for(let action of actions){
          if(action.talentMeta.ID === meta1.ID){action.talentMeta = meta1Rep;}
          else if(action.talentMeta.ID === meta2.ID){action.talentMeta = meta2Rep;}
        }
      }
      if(toMerge){merge_actions_by_ineffectiveEffectIDSet(actions);}
      actionsList.push(actions);
    }
    return {actionsList};
  },
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
function check_constellation_4_of_Odette(teamInitialAttributes, charID, action){
  const attr =  teamInitialAttributes["Odette"] ? teamInitialAttributes["Odette"] : {};
  return attr.toCastQ ? true : false;
}
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
    q : {ID : "q", characterID : "Vodyanitsa", name : "元素爆发",
          element:"hydro", gauge:1, EACount:1, rxndmg:"none", talent:"Q",
          attackType:"burst", isOnfield:true, isSnapshot:false, 
          hitnum:1, scaling:{10:{hp:0.822}, 13:{hp:0.971}}},
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
    {ID:"Vodyanitsa_E_Effect_1", condition:{},
      effect:E_effect_1_of_Vodyanitsa, isNet:true, isPermanent:false,
      get desc(){return `沃雅妮莎E效果：给敌人30%(10级E)或35.4%(13级E)的水、冰元素抗性降低`}},
    {ID:"Vodyanitsa_E_Effect_2", condition:{characterIDs:["Vodyanitsa"], isOnfield:true, talentMetaIDs:["q"]},
      effect:E_effect_2_of_Vodyanitsa, isNet:true, isPermanent:false,
      get desc(){return `沃雅妮莎E效果：给自己元素爆发伤害加成86.4%(10级E)或102%(13级E)`}},
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
  parameters : {EDeRes:0.3, VodyanitsaQBonus:0.864, maxSolo:25, maxEnsemble:10, toCastE:true, toCastQ:false,},  // 固有天赋、技能效果、命座效果可能用到的其他参数
  teamParameters : {VodyanitsaC2Onfield:true, isStellarSwirl:true, ishealed:true},
  variables : {currSolo:25, currEnsemble:10, isSoloExhaust:false, isEnsembleExhaust:false},  // 在后续buff计算中需要用到的全局参数，定义在这里
  /*... 方法 ...*/
  reset_variables(attributes){Object.keys(this.variables).forEach(key => {attributes[key]=this.variables[key]})},
  get_max_CD(attributes){return 16*(1-attributes.stats.CDReduction)}, // 角色技能循环的最大CD
  get_onfield_actionsObject(attributes, params={}, actionDetails={}){
    let Qdrt = attributes.toCastQ ? 2 : 0;
    const actions = [{talentMeta:Vodyanitsa.talentMetas.e0, timestamp:1}];
    if(attributes.toCastQ){actions.push({talentMeta:Vodyanitsa.talentMetas.q, condition:{toCastQ:true}, timestamp:1+Qdrt})};
    // 给actions中所有的元素赋值 details
    for(let action of actions){assign_details_to_action(action, actionDetails)};
    return {actions, duration : 1+Qdrt+10*EPSILON,}
  },
  get_offfield_actionsObject(attributes, charIndex, onfieldDurations, effectSchedules={}, toMerge=false, params={}, actionDetails={}){
    const maxCount = 6, metaInterval=3, meta = Vodyanitsa.talentMetas.e_off, firstTS=3;
    const actionsList = get_segment_offfield_actions(meta, firstTS, metaInterval, maxCount, charIndex, onfieldDurations, effectSchedules, toMerge);
    return {actionsList};
  },
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
function E_effect_1_of_Vodyanitsa(teamInitialAttributes, teamNetAttributes, action, activated = false){
  const deRes = teamInitialAttributes["Vodyanitsa"].EDeRes;
  return {hydroDeRes : deRes, cryoDeRes : deRes};
};
function E_effect_2_of_Vodyanitsa(teamInitialAttributes, teamNetAttributes, action, activated = false){
  return {burstDMG:teamInitialAttributes["Vodyanitsa"].VodyanitsaQBonus}
}
// 命座效果
function constellation_1_of_Vodyanitsa(teamInitialAttributes, teamNetAttributes, action, activated = false){
  let hp = teamNetAttributes["Vodyanitsa"].stats.hp;
  return {atkf: hp*0.008};
}
function constellation_2_1_of_Vodyanitsa(teamInitialAttributes, teamNetAttributes, action, activated = false){return {cd:0.6}};
function constellation_2_2_of_Vodyanitsa(teamInitialAttributes, teamNetAttributes, action, activated = false){return {cd:0.5}};
function constellation_3_of_Vodyanitsa(teamInitialAttributes, teamNetAttributes, action, activated = false){return{E:3, EDeRes:0.354}};
function constellation_4_of_Vodyanitsa(teamInitialAttributes, teamNetAttributes, action, activated = false){return{hpp:0.6}};
function constellation_5_of_Vodyanitsa(teamInitialAttributes, teamNetAttributes, action, activated = false){return{Q:3, VodyanitsaQBonus:1.02}};
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
    z_special : {ID:"z_special", characterID:"Faruzan", name : "飓烈箭",
          element:"anemo", gauge:1, EACount:1, rxndmg:"none", talent:"E",
          attackType:"skill", isOnfield:true, isSnapshot:false,
          hitnum:1, scaling:{10:{atk:1.944}, 13:{atk:2.295}}
      },
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
  parameters : {toCastE:true, toCastQ:true, toCastCharge:false},
  teamParameters : {},
  variables : {},
  reset_variables(attributes){Object.keys(this.variables).forEach(key => {attributes[key]=this.variables[key]})},
  get_max_CD(attributes){// 角色技能循环的最大CD
    return attributes.toCastQ ? 20*(1-attributes.stats.CDReduction) : 6*(1-attributes.stats.CDReduction);
  }, 
  get_onfield_actionsObject(attributes, params={}, actionDetails={}){
    let chargedrt = attributes.toCastCharge ? 1 : 0;
    let Qdrt = attributes.toCastQ ? 1 : 0;
    const actions = [{talentMeta:Faruzan.talentMetas.e0, timestamp:0.7},];
    if(attributes.toCastCharge){actions.push({talentMeta:Faruzan.talentMetas.charge_special, timestamp:0.7+chargedrt})}
    if(attributes.toCastQ){actions.push({talentMeta:Faruzan.talentMetas.q0, timestamp:0.7+chargedrt+Qdrt},)}
    let duration = Math.max(1, actions.at(-1).timestamp) + 10*EPSILON;
    // 给actions中所有的元素赋值 details
    for(let action of actions){assign_details_to_action(action, actionDetails)};
    return {actions, duration};
  },
  get_offfield_actionsObject(attributes, charIndex, onfieldDurations, effectSchedules={}, toMerge=false, params = {element:"cryo"}){
    const c = attributes.constellation;
    const maxCount = Math.floor((12 + ((c >= 2)?6:0)) / 3), metaInterval=3, meta=Faruzan.talentMetas.q_c6_vortex;
    const firstTS = onfieldDurations[charIndex]+3;
    const actionsList = get_segment_offfield_actions(meta, firstTS, metaInterval, maxCount, charIndex, onfieldDurations, effectSchedules);
    // 反应部分
    let rxnMeta = null;
    if(attributes.isStellarSwirl && params.element=="cryo"){
      rxnMeta = {characterID: "Faruzan", element:"anemo", rxndmg:"reactionStellarSwirl", 
                  ID:"reactionStellarSwirlAnemo", name:"反应星扩散:风", isOnfield:false};
    }
    else if(params.element != null && params.element !== "none"){
      rxnMeta = {characterID: "Faruzan", element:params.element, rxndmg:"swirl", 
                  ID:"reactionSwirl" + params.element.at(0).toUpperCase() + params.element.slice(1),
                  name:ELEMENTS[params.element]+"扩散", isOnfield:false};
    }
    if(rxnMeta != null){
      for(let actions of actionsList){
        let i = 0;
        while(i < actions.length){// 每一次后台风伤一次扩散，效果同样继承
          let action = actions[i];
          let reaction = {talentMeta:rxnMeta, repetitionCount:action.repetitionCount,
                          ineffectiveEffectIDSet:structuredClone(action.ineffectiveEffectIDSet), timestamp:action.timestamp};
          actions.splice(i+1, 0, reaction) // 在当前后台伤害的下一个位置插入反应
          i += 2;
        }
      }
    }
    if(toMerge){
      for(let actions of actionsList){merge_actions_by_ineffectiveEffectIDSet(actions);}
    }
    return {actionsList,};
  },
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
    a1_cryo : {ID : "a1_cryo", characterID : "Traveler", name : "普通攻击1·冰",
               element:"cryo", gauge:1, EACount:1, rxndmg:"none", talent:"other",
               attackType:"attack", isOnfield:true, isSnapshot:false,
               hitnum:1, scaling:{10:{atk:0.876}, 13:{atk:1.065}}},

    a2_cryo : {ID : "swap", characterID : "Traveler", name : "普通攻击1·冰",
               element:"cryo", gauge:1, EACount:1, rxndmg:"none", talent:"other",
               attackType:"attack", isOnfield:true, isSnapshot:false,
               hitnum:1, scaling:{10:{atk:0.876}, 13:{atk:1.065}}},
    e : {ID : "swap", characterID : "Traveler", name : "普通攻击1·冰",
               element:"cryo", gauge:1, EACount:1, rxndmg:"none", talent:"other",
               attackType:"attack", isOnfield:true, isSnapshot:false,
               hitnum:1, scaling:{10:{atk:0.876}, 13:{atk:1.065}}},
    e_ice_crystal : {ID : "swap", characterID : "Traveler", name : "普通攻击1·冰",
                     element:"cryo", gauge:1, EACount:1, rxndmg:"none", talent:"other",
                     attackType:"attack", isOnfield:true, isSnapshot:false,
                     hitnum:1, scaling:{10:{atk:0.876}, 13:{atk:1.065}}},
    q_full : {ID : "swap", characterID : "Traveler", name : "普通攻击1·冰",
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
  parameters : {toCastE:true, toCastQ:true, toCastCharge:false, isStellarSwirl:true, },
  teamParameters : {},
  variables : {},
  reset_variables(attributes){Object.keys(this.variables).forEach(key => {attributes[key]=this.variables[key]})},
  get_max_CD(attributes){return 15*(1-attributes.stats.CDReduction)}, // 角色技能循环的最大CD
  get_onfield_actionsObject(attributes, params={}, actionDetails={}){},
  get_offfield_actionsObject(attributes, params={}, actionDetails={}){},
}




// #endregion




