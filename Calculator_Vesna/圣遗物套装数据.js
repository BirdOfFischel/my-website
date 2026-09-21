// 圣遗物套装数据库：套装类与套装效果函数
// 由原 HTML 内联 script 拆分而来；保持原有全局类名/变量名/函数名不变。
// 依赖关系：本文件需按主 HTML 中的 script 引用顺序加载。
// 圣遗物的效果中可能具有参数 isOnly，表示这个效果全局唯一（即同类圣遗物效果只生效一个）
// 圣遗物尽量不要定义 teamParameters，让角色定义；如果真要定义，请将值都设置成 false （默认不生效）

export function get_artifactSet_ID(artifactSet){// 将角色装备的圣遗物套装组合转化成ID值
  const ID = artifactSet.map(([set, number]) => [set.ID, number.toString()]).flat().join("_");
  return ID;
}
export function get_artifactSet_name(artifactSet){// 角色装备的圣遗物套装组合的中文描述
  const name = artifactSet.map(([set, number]) => `${set.name}${number}件套`).join("+");
  return name;
}
export function get_artifactSet_desc_array(artifactSet){// 角色装备的圣遗物套装组合的效果描述构成的列表
  const allEffects = [];
  for(let set of artifactSet){
    if(set[1] >= 4){allEffects.push(...set[0].setEffects[2], ...set[0].setEffects[4])}
    else if(set[1] >= 2){allEffects.push(...set[0].setEffects[2])};
  };
  const decs_array = allEffects.map(item => item.desc+";");
  return decs_array;
}



export class ArtifactSet_ScarletProof{ // 血红之证
  constructor(ID = "ScarletProof", equipperID=undefined, equipperName=equipperID){
    const self = this;
    this.ID = ID;
    this.name = "血红之证";
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    this.setEffects = {
      2 : [{ID:this.ID+"_Piece_2", condition:{characterIDs:[this.equipperID], }, effect:piece_2_of_ScarletProof,
            isNet : true, isPermanent:true, 
            get desc(){return `血红之证二件套：提升装备者${self.equipperName}18%攻击力`}}],
      4 : [{ID:this.ID+"_Piece_4", condition:{characterIDs:[this.equipperID], isOnfield:true}, effect:piece_4_of_ScarletProof,
            isNet : true, isPermanent:false, 
            get desc(){return `血红之证四件套：提升装备者${self.equipperName}16%暴击率和40%星扩散增伤`}}],
    };
    this.parameters = {}; // 自己效果要用的参数
    this.teamParameters = {}; // 全队吃到自己效果要用的参数
    this.variables = {}; // 自己效果计算时要用的变量
  }
  be_equipped(equipperID, equipperName=equipperID){// 更改装备者，然后将效果中的"equipper"改成对应的装备者ID
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    for(let list of Object.values(this.setEffects)){
      for (const item of list) {
        if (item.condition.characterIDs) {
          item.condition.characterIDs = item.condition.characterIDs.map(id =>
            id == undefined ? equipperID : id
          );
        }
      }
    }
  };
};
function piece_2_of_ScarletProof(teamInitialAttributes, teamNetAttributes, action, activated = false){ return {atkp : 0.18}; };
function piece_4_of_ScarletProof(teamInitialAttributes, teamNetAttributes, action, activated = false){ return {cr : 0.16, stellarSwirlDMG:0.40}; };

export class ArtifactSet_HeartoftheFurnace { // 炉火融炼之心
  constructor(ID = "HeartoftheFurnace", equipperID = undefined, equipperName = equipperID) {
    const self = this;
    this.ID = ID;
    this.name = "炉火融炼之心";
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    this.setEffects = {
      2: [{ID: this.ID+"_Piece_2", condition: {characterIDs: [this.equipperID]}, effect: piece_2_of_HeartoftheFurnace,
          isNet: true, isPermanent: true, 
          get desc() {return `炉火融炼之心二件套：提升装备者${self.equipperName}18%攻击力`}}],
      4: [{ID: this.ID+"_Piece_4_1", condition: {characterIDs: [this.equipperID]}, effect: piece_4_1_of_HeartoftheFurnace,
          isNet: true, isPermanent: false, isOnly:true, // 表示效果唯一
          get desc() {return `炉火融炼之心四件套：提升装备者${self.equipperName}12%攻击力`}},
          {ID: this.ID+"_Piece_4_2", condition: {}, effect: piece_4_2_of_HeartoftheFurnace,
          isNet: true, isPermanent: false,
          desc: "炉火融炼之心四件套：全队星烁反应伤害提升50%"}],
    };
    this.parameters = {}; // 自己效果要用的参数
    this.teamParameters = {}; // 全队吃到自己效果要用的参数
    this.variables = {}; // 自己效果计算时要用的变量
  }
  be_equipped(equipperID, equipperName = equipperID) {
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    for (let list of Object.values(this.setEffects)) {
      for (const item of list) {
        if (item.condition.characterIDs) {
          item.condition.characterIDs = item.condition.characterIDs.map(id =>
            id == undefined ? equipperID : id
          );
        }
      }
    }
  }
}
function piece_2_of_HeartoftheFurnace(teamInitialAttributes, teamNetAttributes, action, activated = false){return {atkp:0.18}};
function piece_4_1_of_HeartoftheFurnace(teamInitialAttributes, teamNetAttributes, action, activated = false){return {atkp:0.12}};
function piece_4_2_of_HeartoftheFurnace(teamInitialAttributes, teamNetAttributes, action, activated = false){return {stellarConductDMG:0.5, stellarSwirlDMG:0.5}};

export class ArtifactSet_TenacityoftheMillelith{// 千岩牢固
  constructor(ID = "TenacityoftheMillelith", equipperID = undefined, equipperName = equipperID) {
    const self = this;
    this.ID = ID;
    this.name = "千岩牢固";
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    this.setEffects = {
      2: [{ID: this.ID+"_Piece_2", condition: {characterIDs: [this.equipperID]}, effect: piece_2_of_TenacityoftheMillelith,
          isNet: true, isPermanent: true,
          get desc() {return `千岩牢固二件套：提升装备者${self.equipperName}20%的最大生命值`}}],
      4: [{ID: this.ID+"_Piece_4", 
          condition: {check:(teamInitialAttributes, charID, action)=>check_piece_4_of_TenacityoftheMillelith(teamInitialAttributes, charID, action, this)}, 
          effect: piece_4_of_TenacityoftheMillelith,
          isNet: true, isPermanent: false, isOnly:true,
          get desc() {return `千岩牢固四件套：提升全体角色20%攻击力和30%护盾强效`}},
          ],
    };
    this.parameters = {}; // 自己效果要用的参数
    this.teamParameters = {}; // 全队吃到自己效果要用的参数
    this.variables = {}; // 自己效果计算时要用的变量
  }
  be_equipped(equipperID, equipperName = equipperID) {
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    for (let list of Object.values(this.setEffects)) {
      for (const item of list) {
        if (item.condition.characterIDs) {
          item.condition.characterIDs = item.condition.characterIDs.map(id =>
            id == undefined ? equipperID : id
          );
        }
      }
    }
  }
}
function check_piece_4_of_TenacityoftheMillelith(teamInitialAttributes, charID, action, artifactSet){
  return teamInitialAttributes[artifactSet.equipperID]?.toCastE === true ? true : false;
}
function piece_2_of_TenacityoftheMillelith(teamInitialAttributes, teamNetAttributes, action, activated = false){return {hpp:0.2}};
function piece_4_of_TenacityoftheMillelith(teamInitialAttributes, teamNetAttributes, action, activated = false){return {atkp:0.2, ss:0.3}}


export class ArtifactSet_NoblesseOblige{// 昔日宗室之仪
  constructor(ID = "NoblesseOblige", equipperID = undefined, equipperName = equipperID){
    const self = this;
    this.ID = ID;
    this.name = "昔日宗室之仪";
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    this.setEffects = {
      2 : [{ID:this.ID+"_Piece_2", condition:{characterIDs:[this.equipperID], attackTypes:["burst"]}, effect:piece_2_of_NoblesseOblige,
            isNet : true, isPermanent:false,
            get desc(){return `昔日宗室之仪二件套：提升装备者${self.equipperName}20%元素爆发伤害`}}],
      4 : [{ID:this.ID+"_Piece_4", 
            condition:{check:(teamInitialAttributes, charID, action)=>check_piece_4_of_NoblesseOblige(teamInitialAttributes, charID, action, this)}, 
            effect:piece_4_of_NoblesseOblige,
            isNet : true, isPermanent:false, isOnly:true,
            desc:"昔日宗室之仪四件套：施放元素爆发后，队伍中所有角色攻击力提升20%，持续12秒"}],
    };
    this.parameters = {};
    this.teamParameters = {};
    this.variables = {};
  };
  be_equipped(equipperID, equipperName=equipperID){// 更改装备者，然后将效果中的"equipper"改成对应的装备者ID
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    for(let list of Object.values(this.setEffects)){
      for (const item of list) {
        if (item.condition.characterIDs) {
          item.condition.characterIDs = item.condition.characterIDs.map(id =>
            id == undefined ? equipperID : id
          );
        }
      }
    }
  };
};
function check_piece_4_of_NoblesseOblige(teamInitialAttributes, charID, action, artifactSet){
  return teamInitialAttributes[artifactSet.equipperID]?.toCastQ === true ? true : false;
}
function piece_2_of_NoblesseOblige(teamInitialAttributes, teamNetAttributes, action, activated = false){
    return {burstDMG:0.2}; 
};
function piece_4_of_NoblesseOblige(teamInitialAttributes, teamNetAttributes, action, activated = false){ return {atkp : 0.20}; };

