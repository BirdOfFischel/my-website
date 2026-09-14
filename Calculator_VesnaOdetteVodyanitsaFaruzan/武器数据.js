// 武器数据库：武器类与武器效果函数
// 由原 HTML 内联 script 拆分而来；保持原有全局类名/变量名/函数名不变。
// 依赖关系：本文件需按主 HTML 中的 script 引用顺序加载。


// #region 单手剑 
export class Weapon_BeyondtheChrysalis{// 单手剑：蝶变
  constructor(ID = "BeyondtheChrysalis", rank=1, equipperID=undefined, equipperName=equipperID){
    const self = this;
    this.ID = ID;
    this.name = "蝶变";
    this.rarity = 5; // 稀有度, 用来计算金数
    this.batk = 674;
    this.stat = "cd";
    this.statLabel = "暴击伤害";
    this.statValue = 0.441;
    this.rank = rank;
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    this.effects = [
      {ID:this.ID+"_Effect", condition:{characterIDs:[this.equipperID], isOnfield:true}, 
        effect:(teamInitAttr, teamAttr, action, activated = false) => effect_of_weapon_BeyondtheChrysalis(teamInitAttr, teamAttr, action, this, activated),
      isNet : true, isPermanent:false, 
      get desc(){return `蝶变效果：提升装备者${self.equipperName}${42+14*self.rank}%暴击伤害和${27+9*self.rank}%星扩散增伤`;},},
    ]
    this.parameters = {}; // 自己效果要用的参数
    this.teamParameters = {}; // 全队吃到自己效果要用的参数
    this.variables = {}; // 自己效果计算时要用的变量
  };
  be_equipped(equipperID, equipperName=equipperID){// 更改装备者，然后将效果中的"equipper"改成对应的装备者ID
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    for (const item of this.effects) {
      if (item.condition.characterIDs) {
        item.condition.characterIDs = item.condition.characterIDs.map(id =>
          id == undefined ? equipperID : id
        );
      }
    }
  };
}
function effect_of_weapon_BeyondtheChrysalis(teamInitialAttributes, teamNetAttributes, action, weapon, activated = false){ 
  return {cd : 0.42 + 0.14*weapon.rank, stellarSwirlDMG : 0.27+0.09*weapon.rank}; 
};

export class Weapon_ExaiphanesBlade { // 单手剑：星锋剑
  constructor(ID = "ExaiphanesBlade", rank = 1, equipperID = undefined, equipperName=equipperID) {
    const self = this;
    this.ID = ID;
    this.name = "星锋剑";
    this.rarity = 0;
    this.batk = 608;
    this.stat = "cr";
    this.statLabel = "暴击率";
    this.statValue = 0.331;
    this.rank = rank;
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    this.effects = [
      {ID: this.ID + "_Effect", condition: {characterIDs: ["Traveler"]},
      effect: (teamInitAttr, teamAttr, action, activated = false) => effect_of_weapon_ExaiphanesBlade(teamInitAttr, teamAttr, action, this, activated),
      isNet: true, isPermanent: false,
      get desc() {return `星锋剑效果：旅行者装备时，提升${42 * (self.rank > 1)}%暴击伤害和${(ExaiphanesBladeEffectAtkpDict[self.rank] * 100).toFixed(0)}%的攻击力`}},
    ];
    this.parameters = {}; // 自己效果要用的参数
    this.teamParameters = {}; // 全队吃到自己效果要用的参数
    this.variables = {}; // 自己效果计算时要用的变量
  }
  be_equipped(equipperID, equipperName=equipperID){// 更改装备者，然后将效果中的"equipper"改成对应的装备者ID
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    for (const item of this.effects) {
      if (item.condition.characterIDs) {
        item.condition.characterIDs = item.condition.characterIDs.map(id =>
          id == undefined ? equipperID : id
        );
      }
    }
  };
}
const ExaiphanesBladeEffectAtkpDict = {1:0.16, 2:0.2, 3:0.24, 4:0.32, 5:0.4};
function effect_of_weapon_ExaiphanesBlade(teamInitialAttributes, teamNetAttributes, action, weapon, activated = false){ 
  const cd = 0.42 * (weapon.rank > 1);
  return {cd : cd, atkp : ExaiphanesBladeEffectAtkpDict[weapon.rank]}; 
};

export class Weapon_WhitelakeFrostfeather {// 单手剑：白湖冬羽
  constructor(ID = "WhitelakeFrostfeather", rank = 1, equipperID = undefined, equipperName=equipperID) {
    const self = this;
    this.ID = ID;
    this.name = "白湖冬羽";
    this.rarity = 5;
    this.batk = 674;
    this.stat = "cr";
    this.statLabel = "暴击率";
    this.statValue = 0.221;
    this.rank = rank;
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    this.effects = [
      {ID: this.ID + "_Effect", condition: {characterIDs: [this.equipperID]},
      effect: (teamInitAttr, teamAttr, action, activated = false) => effect_of_weapon_WhitelakeFrostfeather(teamInitAttr, teamAttr, action, this, activated),
      isNet: true, isPermanent: false,
      get desc() {return `白湖冬羽效果：提升装备者${self.equipperName}${18 + self.rank * 6}%的攻击力和${(WhitelakeFrostfeatherEffectCritDMGDict[self.rank] * 100).toFixed(0)}%的暴击伤害`}},
    ];
    this.parameters = {}; // 自己效果要用的参数
    this.teamParameters = {}; // 全队吃到自己效果要用的参数
    this.variables = {}; // 自己效果计算时要用的变量
  }
  be_equipped(equipperID, equipperName=equipperID){// 更改装备者，然后将效果中的"equipper"改成对应的装备者ID
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    for (const item of this.effects) {
      if (item.condition.characterIDs) {
        item.condition.characterIDs = item.condition.characterIDs.map(id =>
          id == undefined ? equipperID : id
        );
      }
    }
  };
}
const WhitelakeFrostfeatherEffectCritDMGDict = {1:0.5, 2:0.65, 3:0.8, 4:0.95, 5:1.1};
function effect_of_weapon_WhitelakeFrostfeather(teamInitialAttributes, teamNetAttributes, action, weapon, activated = false){
  return {atkp: 0.18+0.06*weapon.rank, cd : WhitelakeFrostfeatherEffectCritDMGDict[weapon.rank]};
}

export class Weapon_NewBough{// 单手剑：新枝
  constructor(ID = "NewBough", rank=5, equipperID=undefined, equipperName=equipperID){
    const self = this;
    this.ID = ID;
    this.name = "新枝";
    this.rarity = 4;
    this.batk = 510;
    this.stat = "cd";
    this.statLabel = "暴击伤害";
    this.statValue = 0.551;
    this.rank = rank;
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    this.effects = [
      {ID: this.ID + "_Effect_1", condition: {characterIDs:[this.equipperID]},
      effect: (teamInitAttr, teamAttr, action, activated = false) => effect_1_of_weapon_NewBough(teamInitAttr, teamAttr, action, this, activated),
      isNet: true, isPermanent: false,
      get desc() {return `新枝效果1：给装备者${self.equipperName}${9+self.rank*3}%攻击力、${45+15*self.rank}元素精通的提升(后台也生效)`}},
      {ID: this.ID + "_Effect_2", condition: {characterIDs:[this.equipperID], check:check_effect_2_of_weapon_NewBough},
      effect: (teamInitAttr, teamAttr, action, activated = false) => effect_2_of_weapon_NewBough(teamInitAttr, teamAttr, action, this, activated),
      isNet: true, isPermanent: false,
      get desc() {return `新枝效果2：当装备者${self.equipperName}处于星烁状态时，攻击额外提升${4.5+1.5*self.rank}%，星烁反应伤害增加${6+2*self.rank}%`}},
    ];
    this.parameters = {};
    this.teamParameters = {isStellarSwirl:false, isStellarConduct:false};
    this.variables = {};
  };
  be_equipped(equipperID, equipperName=equipperID){// 更改装备者，然后将效果中的"equipper"改成对应的装备者ID
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    for (const item of this.effects) {
      if (item.condition.characterIDs) {
        item.condition.characterIDs = item.condition.characterIDs.map(id =>
          id == undefined ? equipperID : id
        );
      }
    }
  };
};
function effect_1_of_weapon_NewBough(teamInitialAttributes, teamNetAttributes, action, weapon, activated = false){
  return {atkp:0.09+0.03*weapon.rank, em:45+15*weapon.rank};
}
function check_effect_2_of_weapon_NewBough(teamInitialAttributes, charID, action){
  let mark = false;
  let result = {};
  const attr = teamInitialAttributes[charID];
  if(attr.isStellarSwirl || attr.isStellarConduct){mark = true};
  return mark;
}
function effect_2_of_weapon_NewBough(teamInitialAttributes, teamNetAttributes, action, weapon, activated = false){
  return {atkp:0.045+0.015*weapon.rank, stellarConductDMG:0.06+0.02*weapon.rank, stellarSwirlDMG:0.06+0.02*weapon.rank};
}


export class Weapon_SliverLight{// 单手剑：银釭
  constructor(ID = "SliverLight", rank=5, equipperID=undefined, equipperName=equipperID){
    const self = this;
    this.ID = ID;
    this.name = "银釭";
    this.rarity = 4;
    this.batk = 510;
    this.stat = "atkp";
    this.statLabel = "攻击力%";
    this.statValue = 0.413;
    this.rank = rank;
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    this.effects = [
      {ID: this.ID + "_Effect", condition: {characterIDs:[this.equipperID], isOnfield:true},
      effect: (teamInitAttr, teamAttr, action, activated = false) => effect_of_weapon_SliverLight(teamInitAttr, teamAttr, action, this, activated),
      isNet: true, isPermanent: false,
      get desc() {return `银釭效果：装备者${self.equipperName}提升${78+26*self.rank}的元素精通`}},
    ];
    this.parameters = {};
    this.teamParameters = {};
    this.variables = {};
  };
  be_equipped(equipperID, equipperName=equipperID){// 更改装备者，然后将效果中的"equipper"改成对应的装备者ID
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    for (const item of this.effects) {
      if (item.condition.characterIDs) {
        item.condition.characterIDs = item.condition.characterIDs.map(id =>
          id == undefined ? equipperID : id
        );
      }
    }
  };
};
function effect_of_weapon_SliverLight(teamInitialAttributes, teamNetAttributes, action, weapon, activated = false){
  return {em: 78+26*weapon.rank};
}


export class Weapon_FinaleoftheDeep{// 单手剑：海渊终曲
  constructor(ID = "FinaleoftheDeep", rank=5, equipperID=undefined, equipperName=equipperID){
    const self = this;
    this.ID = ID;
    this.name = "海渊终曲";
    this.rarity = 4;
    this.batk = 565;
    this.stat = "atkp";
    this.statLabel = "攻击力%";
    this.statValue = 0.276;
    this.rank = rank;
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    this.effects = [
      {ID: this.ID + "_Effect", condition: {characterIDs:[this.equipperID], isOnfield:true},
      effect: (teamInitAttr, teamAttr, action, activated = false) => effect_1_of_weapon_FinaleoftheDeep(teamInitAttr, teamAttr, action, this, activated),
      isNet: true, isPermanent: false,
      get desc() {return `海渊终曲效果1：装备者${self.equipperName}提升${9+3*self.rank}%的攻击力`}},
      {ID: this.ID + "_Effect", condition: {characterIDs:[this.equipperID], isOnfield:true},
      effect: (teamInitAttr, teamAttr, action, activated = false) => effect_2_of_weapon_FinaleoftheDeep(teamInitAttr, teamAttr, action, this, activated),
      isNet: false, isPermanent: false,
      get desc() {return `海渊终曲效果2：当装备者${self.equipperName}受到治疗清除最大生命值25%的生命之契时，提升清除值${1.8+0.6*self.rank}%的攻击力，
        至多提升${112.5+37.5*self.rank}点攻击力`}},
    ];
    this.parameters = {};
    this.teamParameters = {ishealed:false};
    this.variables = {};
  };
  be_equipped(equipperID, equipperName=equipperID){// 更改装备者，然后将效果中的"equipper"改成对应的装备者ID
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    for (const item of this.effects) {
      if (item.condition.characterIDs) {
        item.condition.characterIDs = item.condition.characterIDs.map(id =>
          id == undefined ? equipperID : id
        );
      }
    }
  };
};
function effect_1_of_weapon_FinaleoftheDeep(teamInitialAttributes, teamNetAttributes, action, weapon, activated = false){
  return {atkp:0.09+0.03*weapon.rank};
}
function effect_2_of_weapon_FinaleoftheDeep(teamInitialAttributes, teamNetAttributes, action, weapon, activated = false){
  const attr = teamNetAttributes[weapon.equipperID];
  const hp = attr.stats.hp;
  return {atkf : Math.max(0, Math.min(112.5+37.5*weapon.rank, (0.018+0.006*weapon.rank)*0.25*hp))};
}


// #endregion


// #region 双手剑

// #endregion


// #region 长柄武器

// #endregion


// #region 法器

export class Weapon_HymnoftheMaelstrom {// 法器：漩流颂歌
  constructor(ID = "HymnoftheMaelstrom", rank = 1, equipperID = undefined, equipperName=equipperID) {
    const self = this;
    this.ID = ID;
    this.name = "漩流颂歌";
    this.rarity = 5;
    this.batk = 542;
    this.stat = "hpp";
    this.statLabel = "生命值%";
    this.statValue = 0.662;
    this.rank = rank;
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    this.effects = [
      {ID: this.ID + "_Effect_1", condition: {characterIDs: [this.equipperID]},
        effect: (teamInitAttr, teamAttr, action, activated = false) => effect_1_of_weapon_HymnoftheMaelstrom(teamInitAttr, teamAttr, action, this, activated),
        isNet: true, isPermanent: false,
        get desc() {return `漩流颂歌效果1：提升装备者${self.equipperName}${3 + self.rank * 1}%的治疗加成和${3 + self.rank * 1}%的生命值加成，
                          触发冻结反应或星扩散反应时生命值加成效果额外提高75%`}},
      {ID: this.ID + "_Effect_2", condition: {isOnfield:true},
        effect: (teamInitAttr, teamAttr, action, activated = false) => effect_2_of_weapon_HymnoftheMaelstrom(teamInitAttr, teamAttr, action, this, activated),
        isNet: false, isPermanent: false,
        get desc() {return `漩流颂歌效果2：装备者${self.equipperName}生命值超过40000的部分，每1000点提升场上角色${0.9 + self.rank * 0.3}%
                            的攻击力加成，至多${18+6*self.rank}%，触发冻结反应或星扩散反应时效果额外提高75%`}},
    ];
    this.parameters = {}; // 自己效果要用的参数
    this.teamParameters = {isStellarSwirl:true, isFrozen:true}; // 全队吃到自己效果要用的参数
    this.variables = {}; // 自己效果计算时要用的变量
  }
  be_equipped(equipperID, equipperName=equipperID){// 更改装备者，然后将效果中的"equipper"改成对应的装备者ID
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    for (const item of this.effects) {
      if (item.condition.characterIDs) {
        item.condition.characterIDs = item.condition.characterIDs.map(id =>
          id == undefined ? equipperID : id
        );
      }
    }
  };
}
function effect_1_of_weapon_HymnoftheMaelstrom(teamInitialAttributes, teamNetAttributes, action, weapon, activated = false){
  let mult = (teamNetAttributes[weapon.equipperID].isStellarSwirl || teamNetAttributes[weapon.equipperID].isFrozen || false) ? 1.75 : 1;
  return {heal:0.03+0.01*weapon.rank, hpp:(0.03+0.01*weapon.rank)*mult};
};
function effect_2_of_weapon_HymnoftheMaelstrom(teamInitialAttributes, teamNetAttributes, action, weapon, activated = false){
  let hp = teamNetAttributes[weapon.equipperID].stats.hp;
  let atkpBonus = (0.003 + 0.001*weapon.rank) * Math.max(0, Math.min(20, (hp-40000)/1000)) * 3;
  let mult = (teamNetAttributes[weapon.equipperID].isStellarSwirl || teamNetAttributes[weapon.equipperID].isFrozen || false) ? 1.75 : 1;
  return {atkp:atkpBonus*mult};
}

export class Weapon_ThrillingTalesofDragonSlayers{ // 法器：讨龙英杰谭
  constructor(ID = "ThrillingTalesofDragonSlayers", rank = 5, equipperID = undefined, equipperName=equipperID) {
    const self = this;
    this.ID = ID;
    this.name = "讨龙英杰谭";
    this.rarity = 3;
    this.batk = 401;
    this.stat = "hpp";
    this.statLabel = "生命值%";
    this.statValue = 0.352;
    this.rank = rank;
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    this.effects = [
      {ID: this.ID + "_Effect", condition: {check:check_effect_of_weapon_ThrillingTalesofDragonSlayers},
      effect: (teamInitAttr, teamAttr, action, activated = false) => effect_of_weapon_ThrillingTalesofDragonSlayers(teamInitAttr, teamAttr, action, this, activated),
      isNet: true, isPermanent: false,
      get desc() {return `讨龙英杰谭效果：切换角色时，提升下一个登场角色${18 + self.rank * 6}%的攻击力`}},
    ];
    this.parameters = {}; // 自己效果要用的参数
    this.teamParameters = {ThrillingTalesofDragonSlayersTarget:false}; // 全队吃到自己效果要用的参数
    this.variables = {}; // 自己效果计算时要用的变量
  }
  be_equipped(equipperID, equipperName=equipperID){// 更改装备者，然后将效果中的"equipper"改成对应的装备者ID
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    for (const item of this.effects) {
      if (item.condition.characterIDs) {
        item.condition.characterIDs = item.condition.characterIDs.map(id =>
          id == undefined ? equipperID : id
        );
      }
    }
  };
}
function check_effect_of_weapon_ThrillingTalesofDragonSlayers(teamInitialAttributes, charID, action){
  return teamInitialAttributes[charID].ThrillingTalesofDragonSlayersTarget ? true : false;
}
function effect_of_weapon_ThrillingTalesofDragonSlayers(teamInitialAttributes, teamNetAttributes, action, weapon, activated = false){return {atkp:0.48}};

// #endregion


// #region 弓
export class Weapon_BreezeborneRefrain{ // 弓：柔风游弦
  constructor(ID = "BreezeborneRefrain", rank = 5, equipperID = undefined, equipperName=equipperID) {
    const self = this;
    this.ID = ID;
    this.name = "柔风游弦";
    this.rarity = 4;
    this.batk = 510;
    this.stat = "atkp";
    this.statLabel = "攻击力%";
    this.statValue = 0.276;
    this.rank = rank;
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    this.effects = [
      {ID: this.ID + "_Effect_1", condition: {characterIDs:[this.equipperID]},
      effect: (teamInitAttr, teamAttr, action, activated = false) => effect_1_of_weapon_BreezeborneRefrain(teamInitAttr, teamAttr, action, this, activated),
      isNet: true, isPermanent: false,
      get desc() {return `柔风游弦效果1：给装备者${self.equipperName}${15 + self.rank * 5}%的元素充能效率提升`}},
      {ID: this.ID + "_Effect_2", condition: {},
      effect: (teamInitAttr, teamAttr, action, activated = false) => effect_2_of_weapon_BreezeborneRefrain(teamInitAttr, teamAttr, action, this, activated),
      isNet: true, isPermanent: false,
      get desc() {return `柔风游弦效果2：给全队${18 + self.rank * 6}%的星烁反应伤害加成`}},
    ];
    this.parameters = {}; // 自己效果要用的参数
    this.teamParameters = {ThrillingTalesofDragonSlayersTarget:false}; // 全队吃到自己效果要用的参数
    this.variables = {}; // 自己效果计算时要用的变量
  }
  be_equipped(equipperID, equipperName=equipperID){// 更改装备者，然后将效果中的"equipper"改成对应的装备者ID
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    for (const item of this.effects) {
      if (item.condition.characterIDs) {
        item.condition.characterIDs = item.condition.characterIDs.map(id =>
          id == undefined ? equipperID : id
        );
      }
    }
  };
}
function effect_1_of_weapon_BreezeborneRefrain(teamInitialAttributes, teamNetAttributes, action, weapon, activated = false){
  return {er : 0.15 + 0.05*weapon.rank};
}
function effect_2_of_weapon_BreezeborneRefrain(teamInitialAttributes, teamNetAttributes, action, weapon, activated = false){
  let value = 0.18 + 0.06*weapon.rank;
  return {stellarConductDMG : value, stellarSwirlDMG : value};
}


export class Weapon_FavoniusWarbow{// 弓：西风猎弓
  constructor(ID = "FavoniusWarbow", rank=5, equipperID=undefined, equipperName=equipperID){
    const self = this;
    this.ID = ID;
    this.name = "西风猎弓";
    this.rarity = 4;
    this.batk = 454;
    this.stat = "er";
    this.statLabel = "元素充能效率";
    this.statValue = 0.613;
    this.rank = rank;
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    this.effects = [];
    this.parameters = {};
    this.teamParameters = {};
    this.variables = {};
  };
  be_equipped(equipperID, equipperName=equipperID){// 更改装备者，然后将效果中的"equipper"改成对应的装备者ID
    this.equipperID = equipperID;
    this.equipperName = equipperName;
    for (const item of this.effects) {
      if (item.condition.characterIDs) {
        item.condition.characterIDs = item.condition.characterIDs.map(id =>
          id == undefined ? equipperID : id
        );
      }
    }
  };
};

// #endregion







