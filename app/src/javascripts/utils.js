export const Utils = {
  // ---------------------------------------
  // minからmaxまでランダム
  // ----------------------------------------
  random: (min, max) => {
    return Math.random() * (max - min) + min;
  },

  // ----------------------------------------
  // minからmaxまでランダム 半分の確率で-をつける
  // ----------------------------------------
  random2: (min, max) => {
    var val = Math.random() * (max - min) + min;
    if(Math.random() > 0.5) {
      val *= -1;
    }
    return val;
  },

  // ----------------------------------------
  // minからmaxまでランダム int
  // ----------------------------------------
  randomInt: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // ----------------------------------------
  // -valからvalまでランダム
  // ----------------------------------------
  range: (val) => {
    return Utils.random(-val, val);
  },


  // ----------------------------------------
  // 配列の中ランダム
  // ----------------------------------------
  randomArr: (arr) => {
    return arr[Utils.randomInt(0, arr.length - 1)]
  },

  // 1 / rangeの確率でtrueを取得
  // -----------------------------------
  // @range : 2以上の分母(int)
  // return : true or false(boolean)
  // -----------------------------------
  hit: (range) => {
    return (Utils.randomInt(0, range - 1) == 0)
  },

  // ----------------------------------------
  // 度からラジアンに変換
  // @val : 度
  // ----------------------------------------
  radian: (val) => {
    return val * Math.PI / 180;
  },

  // ----------------------------------------
  // ラジアンから度に変換
  // @val : ラジアン
  // ----------------------------------------
  degree: (val) => {
    return val * 180 / Math.PI;
  },

  // ----------------------------------------
  // 範囲変換
  // @val     : 変換したい値
  // @toMin   : 変換後の最小値
  // @toMax   : 変換後の最大値
  // @fromMin : 変換前の最小値
  // @fromMax : 変換前の最大値
  // ----------------------------------------
  map: (val, toMin, toMax, fromMin, fromMax) => {
    if(val <= fromMin) {
      return toMin;
    }
    if(val >= fromMax) {
      return toMax;
    }
    const p = (toMax - toMin) / (fromMax - fromMin);
    return ((val - fromMin) * p) + toMin;
  }
}
