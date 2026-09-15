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
  get_elemental_resonance_effects,
} from "./基础定义.js";
import {
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
  ArtifactSet_ScarletProof,
  ArtifactSet_HeartoftheFurnace,
  ArtifactSet_TenacityoftheMillelith,
  ArtifactSet_NoblesseOblige,
} from "./圣遗物套装数据.js";
import { Vesna, Odette, Vodyanitsa, Faruzan } from "./角色数据.js";






const BeyondtheChrysalis = new Weapon_BeyondtheChrysalis();
const ExaiphanesBlade1 = new Weapon_ExaiphanesBlade("ExaiphanesBlade1");
const WhitelakeFrostfeather1 = new Weapon_WhitelakeFrostfeather("WhitelakeFrostfeather1");
const NewBough = new Weapon_NewBough();
const SliverLight = new Weapon_SliverLight();
const FinaleoftheDeep = new Weapon_FinaleoftheDeep();
const HereticsMoltenBlade = new Weapon_HereticsMoltenBlade();
const ScarletProof = new ArtifactSet_ScarletProof();

Vesna.candidateWeapons = {BeyondtheChrysalis, ExaiphanesBlade1, WhitelakeFrostfeather1, NewBough, SliverLight, FinaleoftheDeep, HereticsMoltenBlade};
Vesna.weapon = BeyondtheChrysalis;
BeyondtheChrysalis.be_equipped(Vesna.ID, Vesna.name);
Vesna.candidateArtifactSets.ScarletProof_4 = [[ScarletProof, 4]];
Vesna.artifactSet = [[ScarletProof, 4]];
ScarletProof.be_equipped(Vesna.ID, Vesna.name);





const ExaiphanesBlade = new Weapon_ExaiphanesBlade();
const WhitelakeFrostfeather = new Weapon_WhitelakeFrostfeather();
const NewBough1 = new Weapon_NewBough("NewBough1");

const HeartoftheFurnace = new ArtifactSet_HeartoftheFurnace();

Odette.candidateWeapons = {WhitelakeFrostfeather, ExaiphanesBlade, NewBough1};
Odette.weapon = WhitelakeFrostfeather;
WhitelakeFrostfeather.be_equipped(Odette.ID, Odette.name);
Odette.candidateArtifactSets = {HeartoftheFurnace_4 : [[HeartoftheFurnace, 4]]};
Odette.artifactSet = [[HeartoftheFurnace, 4]];
HeartoftheFurnace.be_equipped(Odette.ID, Odette.name);





const HymnoftheMaelstrom = new Weapon_HymnoftheMaelstrom();
const ThrillingTalesofDragonSlayers = new Weapon_ThrillingTalesofDragonSlayers();

const TenacityoftheMillelith = new ArtifactSet_TenacityoftheMillelith();

Vodyanitsa.candidateWeapons = {HymnoftheMaelstrom, ThrillingTalesofDragonSlayers};
Vodyanitsa.weapon = HymnoftheMaelstrom;
HymnoftheMaelstrom.be_equipped(Vodyanitsa.ID, Vodyanitsa.name);
Vodyanitsa.candidateArtifactSets = {"TenacityoftheMillelith_4":[[TenacityoftheMillelith, 4]]};
Vodyanitsa.artifactSet = [[TenacityoftheMillelith, 4]];
TenacityoftheMillelith.be_equipped(Vodyanitsa.ID, Vodyanitsa.name);





const BreezeborneRefrain = new Weapon_BreezeborneRefrain();
const FavoniusWarbow = new Weapon_FavoniusWarbow();

const NoblesseOblige = new ArtifactSet_NoblesseOblige();

Faruzan.candidateWeapons = {BreezeborneRefrain, FavoniusWarbow};
Faruzan.weapon = BreezeborneRefrain;
BreezeborneRefrain.be_equipped(Faruzan.ID, Faruzan.name);
Faruzan.candidateArtifactSets = {NoblesseOblige_4:[[NoblesseOblige, 4]]};
Faruzan.artifactSet = [[NoblesseOblige, 4]];
NoblesseOblige.be_equipped(Faruzan.ID, Faruzan.name);



const candidateCharacters = {"Odette":Odette, "Faruzan":Faruzan,};  
const selectedCharacters = {};   
const requiredCharacters = {"Vesna":Vesna, "Vodyanitsa":Vodyanitsa, };   

function check_character_selection(){
  
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

const additionalAttributeParams = {
    Vesna : {ThrillingTalesofDragonSlayersTarget:true, toCastE:true, toCastQ:true},
    Odette : {toCastE:true, toCastQ:false},
    Vodyanitsa : {toCastE:true, toCastQ:false},
    Faruzan : {toCastE:true, toCastQ:true},
}; 

const characters = {"Vesna":Vesna, "Odette":Odette, "Vodyanitsa":Vodyanitsa, "Faruzan":Faruzan,}; 










let characterEffects = {}; 
function initialize_characterEffects(){
  characterEffects = Object.keys(characters).reduce((result, obj) => {
    result[obj] = {toUpdate:true, dynamic:[], net:[], permanent:[]}; 
    return result;
  }, {});
}
initialize_characterEffects();

const teamEffects = [], teamNetEffects = [], teamPermanentEffects = [];  
let toUpdateTeamEffects = true;  
let teamTotalParameters = {}; 
function initialize_teamTotalParameters(){
  teamTotalParameters = {};
  for(let char of Object.values(characters)){
    Object.assign(teamTotalParameters, char.weapon.teamParameters);
    Object.assign(teamTotalParameters, char.artifactSet.teamParameters);
    Object.assign(teamTotalParameters, char.teamParameters);
  }
}
initialize_teamTotalParameters();

const teamInitialAttributes = {}, teamNetAttributes = {}, teamSnapshotAttributes = {}, 
      teamCurrentAttributes = {};
const teamMaxNetAttributes= {}, teamMaxCurrentAttributes = {};
let toUpdateAttributes = {}; 
function initialize_toUpdateAttributes(){
  toUpdateAttributes = Object.keys(characters).reduce((result, ID) => {result[ID]=true; return result;}, {});
}
initialize_toUpdateAttributes();



let onfieldCharacterID = null;  
let teamCost = 0; 
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
function update_characters(){
  clearObject(teamInitialAttributes);
  clearObject(teamNetAttributes);
  clearObject(teamCurrentAttributes);
  clearObject(teamMaxNetAttributes);
  clearObject(teamMaxCurrentAttributes);
  clearObject(characters);
  Object.assign(characters, {...requiredCharacters, ...selectedCharacters});
  onfieldCharacterID = null;
  update_team_cost();
  initialize_characterEffects();
  initialize_teamTotalParameters();
  initialize_toUpdateAttributes();
}


function get_artifactSet_ID(artifactSet){
  const ID = artifactSet.map(([set, number]) => [set.ID, number.toString()]).flat().join("_");
  return ID;
}
function get_artifactSet_name(artifactSet){
  const name = artifactSet.map(([set, number]) => `${set.name}${number}件套`).join("+");
  return name;
}
function get_artifactSet_desc_array(artifactSet){
  const allEffects = [];
  for(let set of artifactSet){
    if(set[1] >= 4){allEffects.push(...set[0].setEffects[2], ...set[0].setEffects[4])}
    else if(set[1] >= 2){allEffects.push(...set[0].setEffects[2])};
  };
  const decs_array = allEffects.map(item => item.desc+";");
  return decs_array;
}
function get_constellation_desc_array(charID, constellation){
  const char = characters[charID];
  const allEffects = [];
  for(let i=0; i<=constellation; i++){
    allEffects.push(...char.constellationEffects[i]);
  }
  return allEffects.map(item => item.desc+";");
}
function get_weapon_desc_array(weapon){
  const allEffects = [];
  allEffects.push(...weapon.effects);
  const valueText = get_stat_value_string(weapon.stat, weapon.statValue);
  const decs_array = [`提供${weapon.batk}白值、${valueText}${weapon.statLabel}; `];
  decs_array.push(...allEffects.map(item => item.desc+";"))
  return decs_array;
}
function get_effective_substat_count_desc(charID){
  const char = characters[charID];
  let string = `有效词条个数为${(char.effectiveSubStatCount).toFixed(2)}, 其中有效词条为`;
  string += Object.keys(char.effectiveSubStats).map(stat => STATS[stat]).join("、") + ", ";
  string += "词条的权值分别为" + Object.values(char.effectiveSubStats).map(value=>value.toString()).join("、")
  return string;
};


function update_character_effects(){ 
  
  for(let [key, char] of Object.entries(characters)){
    if(characterEffects[key].toUpdate){
      let dynamic = [], net = [], permanent = [];
      
      let allEffects = [...char.effects];
      if(char.weapon !== null){allEffects.push(...char.weapon.effects)};
      for(let set of char.artifactSet){
        if(set[1] >= 4){allEffects.push(...set[0].setEffects[2], ...set[0].setEffects[4])}
        else if(set[1] >= 2){allEffects.push(...set[0].setEffects[2])};
      };
      for(let j = 0; j <= char.constellation; j++){allEffects.push(...char.constellationEffects[j])};
      
      for (let effect of allEffects){
        if(effect.isPermanent){permanent.push(effect)}
        else{
          dynamic.push(effect);
          if(effect.isNet){net.push(effect)};
        };
      };
      
      characterEffects[key].dynamic = dynamic;
      characterEffects[key].net = net;
      characterEffects[key].permanent = permanent;
      characterEffects[key].toUpdate = false;
    }
  }
}
function update_team_effects(){
  
  if(toUpdateTeamEffects){
    teamEffects.length = 0;
    teamNetEffects.length = 0;
    teamPermanentEffects.length = 0;
    
    let resonance_effects = get_elemental_resonance_effects(characters);
    for (let effect of resonance_effects){
      if(effect.isPermanent){teamPermanentEffects.push(effect)}
      else{
        teamEffects.push(effect)
        if(effect.isNet){teamNetEffects.push(effect)};
      };
    };
    
    update_character_effects();
    for(let [ID, details] of Object.entries(characterEffects)){
      teamPermanentEffects.push(...details.permanent);
      teamEffects.push(...details.dynamic);
      teamNetEffects.push(...details.net);
    }
    
    toUpdateTeamEffects = false;
  }
}
function combine_buffs(buffs){
  return buffs.reduce((result, obj) => {
      for (let [key, value] of Object.entries(obj)) {
        if(typeof value === "number" && (result[key] === undefined || typeof result[key] === "number")){
          result[key] = (result[key] || 0) + value;
        }
        else{result[key] = value;}
      }
      return result;
  }, {});
}
function get_stat_buff_detail_value_string(stat, value){ 
  return FLAT_STAT_SET.has(stat) ? value.toFixed(2)+"" : (value*100).toFixed(1)+"%";
}
function merge_stat_buff_details(statBuffDetails, desc, effectBuff){
  
  
  let effectName = (desc || "").split("：")[0];
  for(let [k, v] of Object.entries(effectBuff)){
    if(STAT_KEY_SET.has(k)){ 
      if(statBuffDetails[k] === undefined){statBuffDetails[k] = []};
      let item = {name:effectName, stat:k, value:v, };
      if(k === "flatDMG"){ 
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

function derive_effect_origID(IDText){
  
  
  const list = IDText.split("_");
  const index = list[0].search(/\d/); 
  list[0] = list[0].slice(0, index);
  const origID = list.join("_");
  return origID;
};

function derive_total_buff_from_effects(characterID, effects, teamInitialAttributes, teamNetAttributes, action, 
                                        isOnfield = characterID === onfieldCharacterID){
  
  
  
  
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
          let attr = teamNetAttributes[characterID];
          if(attr == undefined){mark = false}
          else{mark = mark && (attr[key] === value)};
        }; 
        if(mark === false){break;};
      }
      if(mark){
        let toWork = true;
        if(effect.isOnly){
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
  
  stats.atk = stats.batk * (1 + stats.atkp) + stats.atkf;
  stats.def = stats.bdef * (1 + stats.defp) + stats.deff;
  stats.hp = stats.bhp * (1 + stats.hpp) + stats.hpf;
}
function derive_buffed_character_attributes(initialAttributes, buff, buffDescs, statBuffDetails = {}, inplace = false){
  
  
  let attributes;
  if(inplace){attributes = initialAttributes}
  else{attributes = structuredClone(initialAttributes)};
  for(let [k, v] of Object.entries(buff)){
    if(STAT_KEY_SET.has(k)){attributes.stats[k] += v} 
    else if(TALENT_KEY_SET.has(k)){attributes.talentLevels[k] += v} 
    else{ 
      if(attributes[k] !== undefined){attributes[k] = v};
    };
  };
  calculate_bonus_stats(attributes.stats);
  attributes.buffDescs.push(...buffDescs);
  for(let [k, detailList] of Object.entries(statBuffDetails)){ 
    if(attributes.statBuffDetails[k] === undefined){attributes.statBuffDetails[k] = []};
    attributes.statBuffDetails[k].push(...detailList);
  }
  return attributes;
};
function convert_buff_from_artifacts(artifacts){
  
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
  
  let buff = {batk : weapon.batk};
  buff[weapon.stat] = weapon.statValue;
  return buff;
};


function initialize_all_attributes(){ 
  update_team_effects();
  let characterIDs = Object.keys(toUpdateAttributes).filter(key => toUpdateAttributes[key]);
  for(let key of characterIDs){
    
    let char = characters[key];
    teamInitialAttributes[char.ID] = {
      ID: char.ID,
      element: char.element,
      level : char.level,
      constellation: char.constellation,
      talentLevels: {...char.talentLevels},
      buffDescs : [], 
      statBuffDetails : {}, 
      statBaseDetails : {}, 
    };
    
    let statBaseDetails = {};
    const addBaseDetail = (k, name, value, cls) => {
      if(statBaseDetails[k] === undefined){statBaseDetails[k] = []};
      statBaseDetails[k].push({name, value, cls});
    };
    addBaseDetail("batk", "角色基础攻击", char.base[char.level].atk, "v-red"); 
    addBaseDetail("bdef", "角色基础防御", char.base[char.level].def, "v-red");
    addBaseDetail("bhp", "角色基础生命", char.base[char.level].hp, "v-red");
    addBaseDetail("batk", char.weapon.name, char.weapon.batk, "v-red"); 
    addBaseDetail("cr", "角色初始暴击率", 0.05, "v-red"); 
    addBaseDetail("cd", "角色初始暴击伤害", 0.5, "v-red"); 
    addBaseDetail(char.stat, "突破属性", char.statValue, "v-blue"); 
    addBaseDetail(char.weapon.stat, char.weapon.name, char.weapon.statValue, "v-blue"); 
    
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
    Object.assign(teamInitialAttributes[char.ID], additionalAttributeParams[char.ID]); 
    
    let artifact_buff = convert_buff_from_artifacts(char.artifacts);
    
    let weapon_buff = convert_buff_from_weapon(char.weapon);
    
    let [permanent_buff, buffDescs, statBuffDetails] = derive_total_buff_from_effects(char.ID, teamPermanentEffects, {}, {}, {});
    
    let buff = combine_buffs([artifact_buff, weapon_buff, permanent_buff]);
    derive_buffed_character_attributes(teamInitialAttributes[char.ID], buff, buffDescs, statBuffDetails, true);

    
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
  
  
  let temp_buffs = [], buffDescs = [], statBuffDetails = {};
  const onlyEffectIDSet = new Set([]);
  for(let effect of effects){
    let mark = true;
    for(let [key, value] of Object.entries(effect.condition)){
      if(key === "characterIDs"){mark = mark && (value.includes(characterID))}
      else if(key === "excludedCharacterIDs"){mark = mark && (!value.includes(characterID))}
      else if(key === "isOnfield"){mark = mark && (value === isOnfield)}
      else if(key === "elements"){mark = mark && value.includes(teamInitialAttributes[characterID].element)}
      else if(key === "excludedElements"){mark = mark && !value.includes(teamInitialAttributes[characterID].element)}
      else if(key === "rxndmgs" || key === "excludedRxndmgs" || key === "attackTypes" || key === "excludedAttackTypes" 
              || key === "talentMetaIDs"){}
      else if(key === "check"){mark = mark && value(teamInitialAttributes, characterID, {talentMeta:{}})}
      else{
        let attr = teamMaxNetAttributes[characterID];
        if(attr == undefined){mark = false}
        else{mark = mark && (attr[key] === value)};
      }; 
      if(mark === false){break;};
    }
    if(mark){
      let toWork = true;
      if(effect.isOnly){
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
function get_displayed_character_attributes(characterID, isOnfield){ 
  initialize_all_attributes(); 
  let mark = false;
  for(let charID of Object.keys(characters)){ 
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
    if(teamMaxNetAttributes[charID] == undefined || isNotMatched){
      let [netBuff, buffDescs, netStatBuffDetails] = derive_max_total_buff_from_effects(charID, teamNetEffects, teamInitialAttributes, teamInitialAttributes, isOnfield);
      teamMaxNetAttributes[charID] = derive_buffed_character_attributes(teamInitialAttributes[charID], netBuff, buffDescs, netStatBuffDetails);
      mark = true;
    }
  }
  if(mark || teamMaxCurrentAttributes[characterID] == undefined){
    let [buff, buffDescs, statBuffDetails] = derive_max_total_buff_from_effects(characterID, teamEffects, teamInitialAttributes, teamMaxNetAttributes, isOnfield);
    teamMaxCurrentAttributes[characterID] = derive_buffed_character_attributes(teamInitialAttributes[characterID], buff, buffDescs, statBuffDetails);
  }
  return teamMaxCurrentAttributes[characterID];
}





















function get_action_array(characters){
  
  
  
  
  const baseIneffective = new Set(["NoblesseOblige_Piece_4", "ThrillingTalesofDragonSlayers_Effect"]);
  const baseIneffective2 = new Set(["NoblesseOblige_Piece_4", "ThrillingTalesofDragonSlayers_Effect", 
                                    "Vodyanitsa_Passive2_1",
                                   ]);
  const reactionStellarSwirlAnemoOnfieldTalentMeta = {characterID: "Vesna", element:"anemo", rxndmg:"reactionStellarSwirl", 
                                                ID:"reactionStellarSwirlAnemo", name:"反应星扩散:风", isOnfield:true};
  const reactionStellarSwirlAnemoOfffieldTalentMeta = {characterID: "Faruzan", element:"anemo", rxndmg:"reactionStellarSwirl", 
                                                       ID:"reactionStellarSwirlAnemo", name:"反应星扩散:风", isOnfield:false};
  const reactionStellarSwirlCryoTalentMeta = {characterID: null, element:"cryo", rxndmg:"reactionStellarSwirl",
                                              ID:"reactionStellarSwirlCryo", name:"反应星扩散:冰"};
  const beginingActions = [
    {talentMeta:Odette.talentMetas.e0, ineffectiveEffectIDSet:baseIneffective},
    {talentMeta:Odette.talentMetas.e1_cryo, ineffectiveEffectIDSet:baseIneffective},
    {talentMeta:Odette.talentMetas.e2_swirl, ineffectiveEffectIDSet:baseIneffective2,},
    {talentMeta:Faruzan.talentMetas.e0, ineffectiveEffectIDSet:baseIneffective},
    {talentMeta:Faruzan.talentMetas.q0, ineffectiveEffectIDSet:baseIneffective},
    {talentMeta:Vodyanitsa.talentMetas.e0, ineffectiveEffectIDSet:new Set(["ThrillingTalesofDragonSlayers_Effect"])},
    {talentMeta:Faruzan.talentMetas.q_c6_vortex, repetitionCount:6, ineffectiveEffectIDSet:baseIneffective},
    {talentMeta:Odette.talentMetas.e_off1_swirl, repetitionCount:5,  ineffectiveEffectIDSet:baseIneffective},
    {talentMeta:Odette.talentMetas.e_off1_cryo, repetitionCount:5,  ineffectiveEffectIDSet:baseIneffective},
    {talentMeta:Odette.talentMetas.e_off2_swirl, repetitionCount:4,  ineffectiveEffectIDSet:baseIneffective},
    {talentMeta:Odette.talentMetas.e_off2_cryo, repetitionCount:4,  ineffectiveEffectIDSet:baseIneffective},
    {talentMeta:Vesna.talentMetas.swap, },
    {talentMeta:Vodyanitsa.talentMetas.e_off, repetitionCount:6, ineffectiveEffectIDSet:baseIneffective},
  ];
  if(Odette.constellation >= 1){beginingActions.push(
    {talentMeta:Odette.talentMetas.e2_special_swirl, ineffectiveEffectIDSet:baseIneffective},
  )}
  if(Odette.constellation >= 4){beginingActions.push(
    {talentMeta:Odette.talentMetas.e_off_special_swirl, repetitionCount:5,  ineffectiveEffectIDSet:baseIneffective},
  )}
  const VesnaActionsC0 = [
    {talentMeta:Vesna.talentMetas.e0},
    {talentMeta:Vesna.talentMetas.a1},
    {talentMeta:Vesna.talentMetas.a2},
    {talentMeta:Vesna.talentMetas.e1},
    {talentMeta:Vesna.talentMetas.e2_anemo},
    {talentMeta:Vesna.talentMetas.e2_stellar},
    {talentMeta:Vesna.talentMetas.e3_stellar_1},
    {talentMeta:Vesna.talentMetas.e3_stellar_2},
    {talentMeta:Vesna.talentMetas.q},
    {talentMeta:Vesna.talentMetas.e3_stellar_1},
    {talentMeta:Vesna.talentMetas.e3_stellar_2},
    {talentMeta:Vesna.talentMetas.a1},
    {talentMeta:Vesna.talentMetas.a2},
    {talentMeta:Vesna.talentMetas.e_windPinion, repetitionCount:4},
    {talentMeta:reactionStellarSwirlAnemoOnfieldTalentMeta, repetitionCount:15,},
    {talentMeta:reactionStellarSwirlAnemoOfffieldTalentMeta, repetitionCount:6,},
    {talentMeta:reactionStellarSwirlCryoTalentMeta, repetitionCount:5, parameters:{stacks:3}},
    {talentMeta:Vesna.talentMetas.e3_stellar_1, ineffectiveEffectIDSet:baseIneffective},
    {talentMeta:Vesna.talentMetas.e3_stellar_2, ineffectiveEffectIDSet:baseIneffective},
    {talentMeta:Vesna.talentMetas.e_windPinion, ineffectiveEffectIDSet:baseIneffective},
  ];
  const VesnaActionsC1 = [
    {talentMeta:Vesna.talentMetas.e0},
    {talentMeta:Vesna.talentMetas.e1},
    {talentMeta:Vesna.talentMetas.e2_anemo},
    {talentMeta:Vesna.talentMetas.e2_stellar},
    {talentMeta:Vesna.talentMetas.e3_stellar_1},
    {talentMeta:Vesna.talentMetas.e3_stellar_2},
    {talentMeta:Vesna.talentMetas.q},
    {talentMeta:Vesna.talentMetas.e3_stellar_1},
    {talentMeta:Vesna.talentMetas.e3_stellar_2},
    {talentMeta:Vesna.talentMetas.a1},
    {talentMeta:Vesna.talentMetas.a2},
    {talentMeta:Vesna.talentMetas.e3_stellar_1},
    {talentMeta:Vesna.talentMetas.e3_stellar_2},
    {talentMeta:Vesna.talentMetas.e_windPinion, repetitionCount:5},
    {talentMeta:reactionStellarSwirlAnemoOnfieldTalentMeta, repetitionCount:15,},
    {talentMeta:reactionStellarSwirlAnemoOfffieldTalentMeta, repetitionCount:6,},
    {talentMeta:reactionStellarSwirlCryoTalentMeta, repetitionCount:5, parameters:{stacks:3}},
    {talentMeta:Vesna.talentMetas.a1, ineffectiveEffectIDSet:baseIneffective},
    {talentMeta:Vesna.talentMetas.a2, ineffectiveEffectIDSet:baseIneffective},
    {talentMeta:Vesna.talentMetas.e3_stellar_1, ineffectiveEffectIDSet:baseIneffective},
    {talentMeta:Vesna.talentMetas.e3_stellar_2, ineffectiveEffectIDSet:baseIneffective},
    {talentMeta:Vesna.talentMetas.e_windPinion, ineffectiveEffectIDSet:baseIneffective},
  ]
  const VesnaActionsC6 = [
    {talentMeta:Vesna.talentMetas.e0},
    {talentMeta:Vesna.talentMetas.e1},
    {talentMeta:Vesna.talentMetas.e2_anemo},
    {talentMeta:Vesna.talentMetas.e2_stellar},
    {talentMeta:Vesna.talentMetas.e3_stellar_1},
    {talentMeta:Vesna.talentMetas.e3_stellar_2},
    {talentMeta:Vesna.talentMetas.step_anemo},
    {talentMeta:Vesna.talentMetas.step_stellar},
    {talentMeta:Vesna.talentMetas.q},
    {talentMeta:Vesna.talentMetas.e3_stellar_1},
    {talentMeta:Vesna.talentMetas.e3_stellar_2},
    {talentMeta:Vesna.talentMetas.step_anemo},
    {talentMeta:Vesna.talentMetas.step_stellar},
    {talentMeta:Vesna.talentMetas.e3_stellar_1},
    {talentMeta:Vesna.talentMetas.e3_stellar_2},
    {talentMeta:Vesna.talentMetas.e_windPinion, repetitionCount:7},
    {talentMeta:reactionStellarSwirlAnemoOnfieldTalentMeta, repetitionCount:15,},
    {talentMeta:reactionStellarSwirlAnemoOfffieldTalentMeta, repetitionCount:6,},
    {talentMeta:reactionStellarSwirlCryoTalentMeta, repetitionCount:5, parameters:{stacks:3}},
    {talentMeta:Vesna.talentMetas.step_anemo, ineffectiveEffectIDSet:baseIneffective},
    {talentMeta:Vesna.talentMetas.step_stellar, ineffectiveEffectIDSet:baseIneffective},
    {talentMeta:Vesna.talentMetas.e3_stellar_1, ineffectiveEffectIDSet:baseIneffective},
    {talentMeta:Vesna.talentMetas.e3_stellar_2, ineffectiveEffectIDSet:baseIneffective},
    {talentMeta:Vesna.talentMetas.step_anemo, ineffectiveEffectIDSet:baseIneffective},
    {talentMeta:Vesna.talentMetas.step_stellar, ineffectiveEffectIDSet:baseIneffective},
    {talentMeta:Vesna.talentMetas.e_windPinion, repetitionCount:3, ineffectiveEffectIDSet:baseIneffective},
  ];
  switch(Number(characters.Vesna.constellation)){
    case 0:
      return [[...beginingActions, ...VesnaActionsC0], 19];
    case 6:
      return [[...beginingActions, ...VesnaActionsC6], 19.5];
    default:
      return [[...beginingActions, ...VesnaActionsC1], 19];
  };
};




const enemyLevel = 110, enemyRes = {pyro:0.10, hydro:0.10, electro:0.10, cryo:0.10, dendro:0.10, geo:0.10, anemo:0.10};
function get_resistance_multiplier(stats, element){
  
  let resistance = (enemyRes[element] - stats[element + "DeRes"]);
  if(resistance < 0){return 1-0.5*resistance}
  else if(resistance < 0.75){return 1 - resistance}
  else{return 1/(4*resistance+1)}
};
function get_defence_multiplier(stats, level){
  
  return (level + 100) / (level+100 + (enemyLevel+100)*(Math.max(1-stats.defReduction, 0.1)*(Math.max(1-stats.defIgnore, 0))));
};
function get_crit_multiplier(stats){
  
  let cr = Math.max(0, Math.min(stats.cr, 1)), cd = stats.cd;
  return 1 + cr * cd;
};
function get_elemental_mastery_factor(stats, rxndmg){
  
  if(CATALYZE_SET.has(rxndmg)){return 5*stats.em/(stats.em+1200)}
  else if(TRANSFORMATIVE_SET.has(rxndmg)){return 16*stats.em/(stats.em + 2000)}
  else if(AMPLIFYING_SET.has(rxndmg)){return 2.78*stats.em/(stats.em+1400)}
  else if(LUNAR_SET.has(rxndmg) || STELLAR_SET.has(rxndmg)){return 6*stats.em/(stats.em+2000)}
  else {return 0};
};
function get_reaction_multiplier(element, rxndmg, parameters = {}){
  
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
    case "directStellarConduct": 
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

const MULTIPLIERS = {
  levelMult : "等级乘区",  critMult : "暴击乘区",  rxnMult : "反应系数",  rxnBonusMult : "反应系数提升乘区",
  rxnBaseDMGMult : "反应基础提升乘区",  dmgBonusMult : "增伤乘区",  resMult : "抗性乘区",  elevationMult : "擢升乘区",
  defMult : "防御乘区",  baseMult : "基础乘区", flatDMG : "额外伤害", catalyzeMult : "额外激化伤害",
  baseDMGMult : "大权乘数", repetitionCount:"重复次数", flatMult:"额外伤害乘区", "DMG":"计算过程伤害值",
  totalDMG: "总伤害", 
};
const INT_TERM_SET = new Set(["baseMult", "flatDMG", "catalyzeMult", "repetitionCount", "flatMult", 
  "DMG", "totalDMG", "atk", "hp", "def", "hitnum", "stacks", "consumption", "remaining", "singleFlatDMG" 
]); 

function calculate_damage(teamCurrentAttributes, action, snapshotAttributes = undefined){
  
  
  
  
  
  if(action.talentMeta.ID === "swap"){return {dmg:0, rxndmg:null, dmgType:null, details:{}, repetitionCount:0}}; 
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
  if(action.talentMeta.scaling == undefined ){
    if(LUNAR_SET.has(rxndmg)){ 
      
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
      
      let sortedDMGs = Object.values(team_damages).sort((a,b) => b-a);
      let weightedDMG = dot(sortedDMGs, weights);
      let finalDMG = weightedDMG * repetitionCount;
      let flatMult = 0;
      if(ID !== null && ID !== undefined){  
        flatMult = stats.flatDMG * details[ID].resMult * details[ID].critMult * details[ID].elevationMult;
        finalDMG += flatMult;
        details[ID].flatDMG = stats.flatDMG;
      }
      return {dmg:finalDMG, element, talentMetaName, rxndmg, dmgType:"reactionLunar", details, repetitionCount, EACount, weightedDMG, flatMult};
    }
    else if(STELLAR_SET.has(rxndmg)){ 
      
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
      
      let sortedDMGs = Object.values(team_damages).sort((a,b) => b-a);
      let weightedDMG = dot(sortedDMGs, weights);
      let finalDMG = weightedDMG * repetitionCount;
      let flatMult = 0;
      if(ID != undefined){  
        flatMult = stats.flatDMG * details[ID].resMult * details[ID].critMult * details[ID].elevationMult;
        finalDMG += flatMult;
        details[ID].flatDMG = stats.flatDMG;
      }
      return {dmg:finalDMG, element, talentMetaName, rxndmg, dmgType:"reactionStellar", details, repetitionCount, EACount, weightedDMG, flatMult};
    }
    else{ 
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
      
      
    const snapshot_attributes = snapshotAttributes || attributes;
    const snapshotStats = snapshot_attributes.stats;
    let outputStats = structuredClone(stats); 
    const snapshotKeys = ["atk", "def", "hp", "cr", "cd", "batk", "bdef", "bhp", "atkp", "defp", "hpp", "atkf", 
                          "deff", "hpf", "pyroDMG", "hydroDMG", "electroDMG", "cryoDMG", "dendroDMG", "geoDMG",
                          "anemoDMG", "physicalDMG"];
    if(AMPLIFYING_SET.has(rxndmg)){snapshotKeys.push("em")}; 
    snapshotKeys.forEach(key => {outputStats[key] = snapshotStats[key]});
    
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
    if(rxndmg === "none"){
      let defMult = get_defence_multiplier(stats, attributes.level);
      let dmgBonusMult = 1 + snapshotStats[element + "DMG"] + stats[attackType + "DMG"], flatDMG = stats.flatDMG;
      let baseDMGMult = stats.baseDMGMult;
      let dmg = (baseMult*baseDMGMult*repetitionCount + flatDMG) * dmgBonusMult * critMult * resMult * defMult;
      details[ID] = {base, scaling, baseMult, flatDMG, dmgBonusMult, critMult, resMult, defMult, 
                      baseDMGMult, buffDescs:attributes.buffDescs, stats:outputStats, statBuffDetails:outputStatBuffDetails, 
                      statBaseDetails:attributes.statBaseDetails, repetitionCount};
      return {dmg, element, talentMetaName, rxndmg, dmgType:"direct", details, repetitionCount, EACount};
    }
    else if(AMPLIFYING_SET.has(rxndmg)){
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
    else if(LUNAR_SET.has(rxndmg) || STELLAR_SET.has(rxndmg)){
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
    else if(CATALYZE_SET.has(rxndmg)){
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

function update_net_attributes(action, characterIDs = Object.keys(characters)){ 
  for(let charID of characterIDs){
    let [netBuff, buffDescs, netStatBuffDetails] = derive_total_buff_from_effects(charID, teamNetEffects, teamInitialAttributes, teamInitialAttributes, action);
    teamNetAttributes[charID] = derive_buffed_character_attributes(teamInitialAttributes[charID], netBuff, buffDescs, netStatBuffDetails);
  }
}
function update_dynamic_attributes(action, characterIDs = Object.keys(characters)){
  for(let charID of characterIDs){
    let [buff, buffDescs, statBuffDetails] = derive_total_buff_from_effects(charID, teamEffects, teamInitialAttributes, teamNetAttributes, action);
    teamCurrentAttributes[charID] = derive_buffed_character_attributes(teamInitialAttributes[charID], buff, buffDescs, statBuffDetails);
  }
}
function get_character_snapshot_attributes(characterID, action){
  let [buff, buffDescs, statBuffDetails] = derive_total_buff_from_effects(characterID, teamEffects, teamInitialAttributes, teamNetAttributes, action);
  return derive_buffed_character_attributes(teamInitialAttributes[characterID], buff, buffDescs, statBuffDetails);
}
function simulate(actionArray, totalTime){
  update_team_cost();
  update_team_effects();
  initialize_toUpdateAttributes();
  onfieldCharacterID = null;
  initialize_all_attributes();
  let n_action = actionArray.length;
  const results = []; 
  const damages = [];
  
  for(let i = 0; i<n_action; i++){
    let action = {...actionArray[i]};
    let characterID = action.talentMeta.characterID;
    let hitnum = action.talentMeta.hitnum || 1;
    let char = characterID ? characters[characterID] : {constellation:-1};
    let condition = action.condition || {};
    let toPass = true;
    
    if(action.rxndmg){
      action.talentMeta = structuredClone(actionArray[i].talentMeta);
      action.talentMeta.rxndmg = action.rxndmg;
    }
    
    if(action.talentMeta.constellation && action.talentMeta.constellation > char.constellation){toPass = false;} 
      
    if(!toPass){
      if(action.replacement){action.talentMeta = action.replacement}
      else{continue;}
    }
    if(action.talentMeta.ID === "swap"){
      onfieldCharacterID = characterID;
      continue; 
    }
    else{
      
      if(action.talentMeta.isOnfield && action.talentMeta.characterID != null ){
        onfieldCharacterID = action.talentMeta.characterID;
      }
      const curr_result = {hitnum, characterID, onfieldCharacterID};
      update_net_attributes(action);
      update_dynamic_attributes(action);
      
      if(action.talentMeta.isSnapshot === true){
        
        if(teamSnapshotAttributes[characterID] == null){
          teamSnapshotAttributes[characterID] = get_character_snapshot_attributes(characterID, action);
        }
        
        Object.assign(curr_result, calculate_damage(teamCurrentAttributes, action, teamSnapshotAttributes[characterID]));
        results.push(curr_result);
        damages.push(curr_result.dmg);
        
        if(action.isSnapshotEnd){teamSnapshotAttributes[characterID] = null};
      }
      else{
        
        Object.assign(curr_result, calculate_damage(teamCurrentAttributes, action));
        results.push(curr_result);
        damages.push(curr_result.dmg);
      }
    }
  }
  const totalDMG = damages.reduce((acc, cur) => acc+cur, 0); 
  const dps = totalDMG / totalTime;
  return {results, damages, totalDMG, totalTime, dps};
}











const FLAT_STAT_SET = new Set(["em", "atkf", "deff", "hpf", "atk", "def", "hp", "batk", "bdef", "bhp",
                                "levelMult", "flatDMG"]);
function get_stat_value_string(stat, value){ 
  return FLAT_STAT_SET.has(stat) ?  value.toFixed(0)+"": (value*100).toFixed(1)+"%";
}

const COMPOSITE_STAT_MAP = { 
  atk: ["batk", "atkp", "atkf"],
  def: ["bdef", "defp", "deff"],
  hp:  ["bhp", "hpp", "hpf"],
}; 
function convert_numberText_to_number(valueText){
  if(valueText.at(-1) === "%"){return Number(valueText.slice(0, -1)) / 100}
  else{return Number(valueText)}
}

function create_character_selection_part(characterSelectionDivId){
  const maindiv = document.getElementById(characterSelectionDivId); maindiv.replaceChildren();
  maindiv.classList.remove("hidden");
  const subtitle = document.createElement("span"); subtitle.className = "subtitle"; subtitle.style["margin-bottom"] = "20px";
  subtitle.textContent = "角色选择";
  maindiv.append(subtitle);
  
  const submainDiv = document.createElement("div"); submainDiv.className = "char-select-part";
  const candidateDiv = document.createElement("div"); candidateDiv.className = "card";
  const selectedDiv = document.createElement("div"); selectedDiv.className = "card";
  const selectedDiv1 = document.createElement("div"); selectedDiv1.className = "char-select-result"; 
  submainDiv.append(candidateDiv, selectedDiv);
  maindiv.append(submainDiv);
  
  const candidateDiv_h1 = document.createElement("h1"); candidateDiv_h1.textContent = "候选角色";
  const candidateDiv_container = document.createElement("div"); candidateDiv_container.className = "char-select-candidate";
  for(let charID of Object.keys(candidateCharacters)){
    const box = document.createElement('div'); box.className = "charbox"; box.textContent = candidateCharacters[charID].name;
    box.dataset.charID = charID; box.dataset.isSelected = false;
    candidateDiv_container.append(box);
    if(Object.keys(selectedCharacters).includes(charID)){box.classList.add("selected"); box.dataset.isSelected = true;} 
  }
  candidateDiv.append(candidateDiv_h1, candidateDiv_container); 
  
  const selectedDiv_item1 = document.createElement("div"); selectedDiv_item1.className = "char-select-h1-row"; 
  const selectedDiv_item2 = document.createElement("div"); selectedDiv_item2.className = "char-select-h1-row"; 
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
  const selectedDiv_item3_2 = document.createElement("div"); selectedDiv_item3.style["text-align"] = "right"; 
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
  
  candidateDiv_container.addEventListener('click', (e) => {
    const box = e.target.closest('.charbox');
    if (!box) return;
    selectedDiv.style["border"] = "";
    selectedDiv_item3_1_span.textContent = "";
    if(box.dataset.isSelected === "true"){ 
      delete selectedCharacters[box.dataset.charID];
      box.classList.toggle('selected');
      box.dataset.isSelected = false;
      update_character_row(selectedDiv_item2_row, selectedCharacters);
    }
    else{
      if(Object.keys(selectedCharacters).length + Object.keys(requiredCharacters).length == 4){return;}
      selectedCharacters[box.dataset.charID] = candidateCharacters[box.dataset.charID];
      box.classList.toggle('selected');
      box.dataset.isSelected = true;
      update_character_row(selectedDiv_item2_row, selectedCharacters);
    }
  });
  
}





function build_stat_detail_lines(statBaseDetails, statBuffDetails, statID){
  let keys = [statID, ...(COMPOSITE_STAT_MAP[statID] || [])];
  let lines = [];
  for(let k of keys){
    for(let item of ((statBaseDetails || {})[k] || [])){
      lines.push({name: item.name, valueText: get_stat_buff_detail_value_string(k, item.value), cls: item.cls, 
                  stat:k, value:item.value});
    }
  }
  for(let k of keys){
    for(let detail of ((statBuffDetails || {})[k] || [])){ 
      lines.push({name: detail.name, valueText: get_stat_buff_detail_value_string(k, detail.value), cls: "buff-value", 
                  stat:k, value:detail.value});
    }
  }
  return lines;
}

function show_stat_buff_detail_popup(statName, lines){ 
  const old = document.querySelector(".stat-detail-modal-overlay");
  if(old){old.remove()}; 
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
  else{ 
    const summary = {}; 
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
  overlay.onclick = function(){overlay.remove()}; 
  modal.onclick = function(e){e.stopPropagation()};
  document.body.appendChild(overlay);
}

function create_paragraphs_from_strings(wrap, strings){
  for(let desc of strings){
    const p = document.createElement("p");
    p.textContent = desc;
    wrap.appendChild(p);
  }
};

function create_buttons_for_displaying_build(id){
  const wrap = document.getElementById(id);
  const div = document.createElement("div");
  div.style.marginBottom = "8px";
  
  for(let charID of Object.keys(characters)){
    const button = document.createElement("button");
    button.className = "btn";
    button.textContent = characters[charID].name;
    button.onclick = function(){
      const displayDivId = characterBuildDivIds[charID];
      if(displayDivId === onDisplayCharacterBuildDivId) return; 
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


const characterBuildDivIds = Object.fromEntries(Object.keys(characters).map(ID => [ID, ID + "_characterBuildDiv"]));
let onDisplayCharacterBuildDivId = Object.keys(characters)[0] + "_characterBuildDiv"; 
let onDisplayCharacterID = Object.keys(characters)[0]; 
function create_character_build_part(buildId){
  const maindiv = document.getElementById(buildId); 
  maindiv.replaceChildren(); 
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
    const div = document.createElement("div"); 
    div.className = "card";
    div.id = characterBuildDivIds[charID];
    if(div.id !== onDisplayCharacterBuildDivId){
      div.classList.add("hidden");
    }
    const title = document.createElement("h1"); 
    title.textContent = `${char.name}(${ELEMENTS[char.element].charAt(0)})`;
    div.appendChild(title);
    
    const levelDiv = document.createElement("div");
    levelDiv.className = "name_input_desc";
    
    const levelSubDiv1 = document.createElement("div");
    const levelSubDiv1_h2 = document.createElement("h2");
    levelSubDiv1_h2.textContent = "等级选择";
    levelSubDiv1.appendChild(levelSubDiv1_h2);
    
    const levelSubDiv3 = document.createElement("div");
    const levelSubDiv3_span = document.createElement("span");
    levelSubDiv3_span.className = "desc";
    levelSubDiv3_span.textContent = "基础值:" + Object.entries(char.base[char.level]).map(([statID, value]) =>`
                                      ${STATS[statID]} ${value}`).join(", ");
    levelSubDiv3.appendChild(levelSubDiv3_span);
    
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
    for(let level of Object.keys(char.base)){ 
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
    

    
    const constellationDiv = document.createElement("div");
    constellationDiv.className = "name_input_desc";
    
    const constellationSubDiv1 = document.createElement("div");
    const constellationSubDiv1_h2 = document.createElement("h2");
    constellationSubDiv1_h2.textContent = "命座选择";
    constellationSubDiv1.appendChild(constellationSubDiv1_h2);
    
    const constellationSubDiv3 = document.createElement("div");
    constellationSubDiv3.className = "desc-box";
    create_paragraphs_from_strings(constellationSubDiv3, get_constellation_desc_array(charID, char.constellation));
    
    const constellationSubDiv2 = document.createElement("div");
    const constellationSubDiv2_select = document.createElement("select");
    constellationSubDiv2_select.id = charID + "_constellationSelection";
    const update_constellation_desc = function(){
      const constellation = char.constellation;
      constellationSubDiv3.replaceChildren(); 
      create_paragraphs_from_strings(constellationSubDiv3, get_constellation_desc_array(charID, constellation));
    }
    constellationSubDiv2_select.onchange = function(){char.constellation = Number(this.value); initialize_toUpdateAttributes(); 
                                                      toUpdateTeamEffects = true; characterEffects[charID].toUpdate = true;
                                                      update_constellation_desc();};
    for(let constellation of Object.keys(char.constellationEffects)){ 
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
    

    
    const weaponDiv = document.createElement("div");
    weaponDiv.className = "name_input2_desc";
    
    const weaponSubDiv1 = document.createElement("div");
    const weaponSubDiv1_h2 = document.createElement("h2");
    weaponSubDiv1_h2.textContent = "武器选择";
    weaponSubDiv1.appendChild(weaponSubDiv1_h2);
    
    const weaponSubDiv4 = document.createElement("div");
    weaponSubDiv4.className = "desc-box";
    create_paragraphs_from_strings(weaponSubDiv4, get_weapon_desc_array(char.weapon));
    
    const weaponSubDiv2 = document.createElement("div"); 
    const weaponSubDiv3 = document.createElement("div"); 
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
    for(let i=1; i<6; i++){ 
      let weaponSubDiv3_select_option = document.createElement("option");
      weaponSubDiv3_select_option.value = i;
      weaponSubDiv3_select_option.textContent = `精炼${i}阶`;
      if(i === defaultRank){weaponSubDiv3_select_option.selected = true;}
      weaponSubDiv3_select.appendChild(weaponSubDiv3_select_option);
      rankOptions[i] = weaponSubDiv3_select_option;
    }
    let defaultID = char.weapon.ID || candidateWeaponIDs[0];
    for(let weaponID of candidateWeaponIDs){ 
      let weaponSubDiv2_select_option = document.createElement("option");
      weaponSubDiv2_select_option.value = weaponID;
      weaponSubDiv2_select_option.textContent = char.candidateWeapons[weaponID].name;
      if(weaponID === defaultID){
        weaponSubDiv2_select_option.selected = true;
      }
      weaponSubDiv2_select.appendChild(weaponSubDiv2_select_option);
    }
    weaponSubDiv2_select.onchange = function(){
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
    weaponSubDiv3_select.onchange = function(){
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
    

    
    const artifactSetDiv = document.createElement("div");
    artifactSetDiv.className = "name_input_desc";
    artifactSetDiv.style["grid-template-columns"] = "110px 0.35fr 0.65fr";
    
    const artifactSetSubDiv1 = document.createElement("div");
    const artifactSetSubDiv1_h2 = document.createElement("h2");
    artifactSetSubDiv1_h2.textContent = "圣遗物套装";
    artifactSetSubDiv1.appendChild(artifactSetSubDiv1_h2);
    
    const artifactSetSubDiv3 = document.createElement("div");
    artifactSetSubDiv3.className = "desc-box";
    create_paragraphs_from_strings(artifactSetSubDiv3, get_artifactSet_desc_array(char.artifactSet));
    
    const artifactSetSubDiv2 = document.createElement("div");
    const artifactSetSubDiv2_select = document.createElement("select");
    artifactSetSubDiv2_select.id = charID + "_artifactSetSelection";
    const update_artifactSet_desc = function(){
      artifactSetSubDiv3.replaceChildren();
      create_paragraphs_from_strings(artifactSetSubDiv3, get_artifactSet_desc_array(char.artifactSet));
    }
    artifactSetSubDiv2_select.onchange = function(){
      char.artifactSet = char.candidateArtifactSets[this.value]; 
      
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
    for(let artifactSetID of candidateArtifactSetIDs){ 
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
    

    
    const artifactMainStatDiv = document.createElement("div");
    const artifactSubStatDiv = document.createElement("div");
    div.appendChild(artifactMainStatDiv);
    div.appendChild(artifactSubStatDiv);

      
    const substatElemenets = Object.fromEntries(Object.keys(ARTIFACT_SLOTS).map(k=>[k, {}])); 
    artifactSubStatDiv.className = "ally";
    
    const artifactSubStatDiv_h2 = document.createElement("h2");
    artifactSubStatDiv_h2.textContent = "圣遗物副词条条数（每部位 0–6 条，按均值计算）";
    artifactSubStatDiv.appendChild(artifactSubStatDiv_h2);
    
    const effective_desc = document.createElement("p");
    effective_desc.style["margin-top"] = "10px";
    effective_desc.className = "desc";
    effective_desc.textContent = get_effective_substat_count_desc(charID);
    
    for(let [slot, cn] of Object.entries(ARTIFACT_SLOTS)){
      let substats = char.artifacts[slot].subStats;
      let substatKeys = Object.keys(substats);
      let artifactSubStatSubDiv = document.createElement("div"); 
      artifactSubStatSubDiv.className = "slot";
      let span = document.createElement("span"); 
      span.className = "name";
      span.textContent = `${cn}`;
      let subdiv = document.createElement("div"); 
      subdiv.className = "substats";
      for(let statID of substatKeys){
        substatElemenets[slot][statID] = {};
        let subspan = document.createElement("span"); 
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
    
    

      
    artifactMainStatDiv.className = "ally";
    
    const artifactMainStatDiv_h2 = document.createElement("h2");
    artifactMainStatDiv_h2.textContent = "圣遗物配置（5★ 20级）";
    artifactMainStatDiv.appendChild(artifactMainStatDiv_h2);
    
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
          option.selected = true;  
          
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
    

    
    
    maindiv.appendChild(div);
  }
}

const displayButtons = {initial:"初始面板", onField:"前台面板", offField:"后台面板"};
const characterDisplayAttributeType = Object.fromEntries(Object.keys(characters).map(ID => [ID, "initial"])); 
const displayRegionId = "displayRegion"; 
function get_stat_note(attributes, statID){ 
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

function display_attributes(attributes){ 
  const wrap = document.getElementById(displayRegionId);
  wrap.replaceChildren(); 
  const wrap_h1_1 = document.createElement("h1");
  wrap_h1_1.textContent = "角色数据";
  wrap.appendChild(wrap_h1_1);
  const statDiv = document.createElement("div");
  statDiv.className = "stat-grid";

  
  const displayStats = characters[attributes.ID].displayedStats;
  for(let statID of displayStats){
    const stats = attributes.stats;
    const subdiv = document.createElement("div");
    subdiv.className = "stat";
    const subdiv_statNameDiv = document.createElement("div");
    subdiv_statNameDiv.className = "statName";
    subdiv_statNameDiv.append(`${STATS[statID]}`); 
    const subdiv_statNameDiv_detailbtn = document.createElement("button"); 
    subdiv_statNameDiv_detailbtn.className = "detailCell";
    subdiv_statNameDiv_detailbtn.textContent = "详情";
    subdiv_statNameDiv_detailbtn.onclick = function(){ 
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

function create_display_part(displayId){ 
  const maindiv = document.getElementById(displayId);
  const maindiv_subtitle = document.createElement("span");
  maindiv_subtitle.className = "subtitle";
  maindiv_subtitle.textContent = `面板展示: ${displayButtons[characterDisplayAttributeType[onDisplayCharacterID]]}`;
  maindiv.appendChild(maindiv_subtitle);
  
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
  
  const region = document.createElement("div");
  region.className = "card";
  region.id = displayRegionId;
  maindiv.appendChild(region);
}


const damageComputationDivId = "damageComputationDiv", damageDetailDivId = "damageDetailDiv";
function create_damage_table(wrapComputation, wrapDetail, solve){
  
  const results = solve.results;
  const dataNum = results.length;
  
  wrapComputation.replaceChildren();
  const wrapComputation_h1 = document.createElement("h1");
  wrapComputation_h1.textContent = `计算表格: 总耗时${solve.totalTime}秒`;
  wrapComputation.appendChild(wrapComputation_h1);
  
  const table = document.createElement("table");
    
  const tableHead = document.createElement("thead"); 
  let tr = document.createElement("tr");
  let th = document.createElement("th");
  th.textContent = "序号";
  tr.appendChild(th);
  for(let i=0; i<dataNum; i++){
    let th = document.createElement("th");
    th.textContent = i+1;
    th.classList.add("clickableth");
    th.addEventListener("click", function() {
      display_damage_details(wrapDetail, results[i]);
    });
    tr.appendChild(th);
  }
  tableHead.append(tr);
  

    
  const tableBody = document.createElement("tbody"); 
  const data = {"角色名称": results.map(item => (item.characterID != null) ? characters[item.characterID].name : "——"),
    "角色位置": results.map(item => (item.characterID == null) ? "——" : ((item.characterID === item.onfieldCharacterID)? "前台":"后台")),
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
  
  table.append(tableHead, tableBody);
  table.className = "dmg";
  const tableWrap = document.createElement("div");
  tableWrap.className = "table-wrap";   
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
  
}

const fmtExprValue = (k, v) => (v == undefined || isNaN(v)) ? "?" : (INT_TERM_SET.has(k) ? Number(v).toFixed(0) : Number(v).toFixed(3));

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

function makeExprRow(terms, values, totalDMG){ 
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
  
  const maindiv = document.createElement("div");
  maindiv.className = "detail-grid";
  const expressionDiv = document.createElement("div"); 
  const detailDiv = document.createElement("div"); 
    
  const exprTitle = document.createElement("h2");
  exprTitle.textContent = "伤害表达式";
  expressionDiv.appendChild(exprTitle);
  const exprScroll = document.createElement("div");
  exprScroll.className = "expr-scroll";
  const dmgType = result.dmgType;
  if(dmgType === "reactionLunar" || dmgType === "reactionStellar"){
    
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
    let flatDMGRow = null; 
    let flatDMGRemainingRow = null; 
    if(tid != null && result.details[tid] && result.details[tid].flatDMG != undefined){
      const d = result.details[tid];
      sumRow.append(mkExprBox(d.flatDMG, MULTIPLIERS["flatDMG"], "flatDMG"), mkExprOp("×"),
                    mkExprBox(d.resMult, MULTIPLIERS["resMult"], "resMult"), mkExprOp("×"),
                    mkExprBox(d.critMult, MULTIPLIERS["critMult"], "critMult"), mkExprOp("×"),
                    mkExprBox(d.elevationMult, MULTIPLIERS["elevationMult"], "elevationMult"),
                    );
      
      flatDMGRow = document.createElement("div"); flatDMGRow.className = "expr-row";
      let flatDMGBuffdetails = d.statBuffDetails["flatDMG"];
      flatDMGRow.append(mkExprBox(d.flatDMG, MULTIPLIERS["flatDMG"], "flatDMG"), mkExprOp("="));
      for(let i in flatDMGBuffdetails){
        let detail = flatDMGBuffdetails[i];
        let origRemaining = (detail.consumption != null && detail.remaining != null) ? detail.consumption + detail.remaining : null;
        flatDMGRow.append(mkExprBox(detail.singleFlatDMG, "单次额外伤害", "singleFlatDMG"), mkExprOp("×"));
        if(origRemaining != null){
          flatDMGRow.append(mkExprOp("min("), mkExprBox(origRemaining, "触发前剩余次数", "remaining"), mkExprOp(", "),
                            mkExprBox(detail.hitnum, "技能段数", "hitnum"), mkExprOp("×"), 
                            mkExprBox(detail.repetitionCount, "重复次数", "repetitionCount"), mkExprOp(")"))
          if(!flatDMGRemainingRow){flatDMGRemainingRow = document.createElement("div"); flatDMGRemainingRow.className = "expr-row";}
          flatDMGRemainingRow.append(mkExprOp(detail.name + ": "), mkExprBox(detail.consumption, "消耗次数", "consumption"),
                                     mkExprOp(", "), mkExprBox(detail.remaining, "剩余次数", "remaining"), mkExprOp("; "))
        }
        else{
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
    
    const ID = (result.characterID != null) ? result.characterID : Object.keys(result.details)[0];
    exprScroll.appendChild(makeExprRow(EXPR_TERMS[dmgType] || [], result.details[ID] || {}, result.dmg));
    
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
    
    if(mainDetail){
      let flatDMG = mainDetail.flatDMG > 0 ? mainDetail.flatDMG : null;
      let flatDMGRow = null; 
      let flatDMGRemainingRow = null; 
      if(flatDMG){
        flatDMGRow = document.createElement("div"); flatDMGRow.className = "expr-row";
        let flatDMGBuffdetails = mainDetail.statBuffDetails["flatDMG"];
        flatDMGRow.append(mkExprBox(mainDetail.flatDMG, MULTIPLIERS["flatDMG"], "flatDMG"), mkExprOp("="));
        for(let i in flatDMGBuffdetails){
          let detail = flatDMGBuffdetails[i];
          let origRemaining = (detail.consumption != null && detail.remaining != null) ? detail.consumption + detail.remaining : null;
          flatDMGRow.append(mkExprBox(detail.singleFlatDMG, "单次额外伤害", "singleFlatDMG"), mkExprOp("×"));
          if(origRemaining != null){
            flatDMGRow.append(mkExprOp("min("), mkExprBox(origRemaining, "触发前剩余次数", "remaining"), mkExprOp(", "),
                              mkExprBox(detail.hitnum, "技能段数", "hitnum"), mkExprOp("×"), 
                              mkExprBox(detail.repetitionCount, "重复次数", "repetitionCount"), mkExprOp(")"))
            if(!flatDMGRemainingRow){flatDMGRemainingRow = document.createElement("div"); flatDMGRemainingRow.className = "expr-row";}
            flatDMGRemainingRow.append(mkExprOp(detail.name + ": "), mkExprBox(detail.consumption, "消耗次数", "consumption"),
                                      mkExprOp(", "), mkExprBox(detail.remaining, "剩余次数", "remaining"), mkExprOp("; "))
          }
          else{
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
  

    
  const panelID = (result.characterID != null) ? result.characterID : result.onfieldCharacterID;
  const panelChar = characters[panelID];
  const panelDetail = result.details[panelID] || {};
  const panelStats = panelDetail.stats;
  const buffDescs = panelDetail.buffDescs || [];

  const panelTitle = document.createElement("h2");
  panelTitle.textContent = `角色面板：${panelChar ? panelChar.name : panelID}`;
  detailDiv.appendChild(panelTitle);

  
  const panelGrid = document.createElement("div");
  panelGrid.className = "panel-grid";
  const statsWrap = document.createElement("div");    
  const effectsWrap = document.createElement("div");  

  if(panelStats && panelChar){
    const panelStatBuffDetails = panelDetail.statBuffDetails || {};
    const statDiv = document.createElement("div");
    statDiv.className = "stat-grid";
    for(let statID of panelChar.displayedStats){
      const subdiv = document.createElement("div"); subdiv.className = "stat";
      const nameDiv = document.createElement("div"); nameDiv.className = "statName"; nameDiv.textContent = STATS[statID];
      const detailBtn = document.createElement("button"); 
      detailBtn.className = "detailCell";
      detailBtn.textContent = "详情";
      detailBtn.onclick = function(){ 
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

  
  
  maindiv.append(expressionDiv, detailDiv);
  wrapDetail.appendChild(maindiv);
}

function create_damage_display_part(damageId){
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
  
  const partSubDiv1 = document.createElement("div");
  partSubDiv1.className = "card";
  partSubDiv1.style["margin-top"] = "10px";
  partSubDiv1.id = damageComputationDivId;
  part.appendChild(partSubDiv1);
  const partSubDiv1_h1 = document.createElement("h1");
  partSubDiv1_h1.textContent = `计算表格`;
  partSubDiv1.appendChild(partSubDiv1_h1);
  
  const partSubDiv2 = document.createElement("div");
  partSubDiv2.className = "card";
  partSubDiv2.id = damageDetailDivId;
  part.appendChild(partSubDiv2);
  const partSubDiv2_h1 = document.createElement("h1");
  partSubDiv2_h1.textContent = `具体项细节`;
  partSubDiv2.appendChild(partSubDiv2_h1);

  beginBtn.onclick = function(){
    const [actionArray, totalTime] = get_action_array(characters);
    const solve = simulate(actionArray, totalTime);
    subtitle.textContent = `伤害展示区(总金数${teamCost.toFixed(0)})`;
    create_damage_table(partSubDiv1, partSubDiv2, solve);
  }
  

}


const characterSelectionPartId = "character_selection_part";
const characterBuildPartId = "character_build_part";
const characterDisplayPartId = "character_display_part";
const damageDisplayPartId = "damage_display_part";



create_character_build_part(characterBuildPartId);
create_display_part(characterDisplayPartId);
create_damage_display_part(damageDisplayPartId);

