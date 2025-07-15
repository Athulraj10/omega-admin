const { default: axios } = require("axios");
module.exports = {
  AppName: "Omega",

  toUpperCase: (str) => {
    if (str?.length > 0) {
      const newStr = str
        .toLowerCase()
        .replace(/_([a-z])/, (m) => m.toUpperCase())
        .replace(/_/, "");
      return str.charAt(0).toUpperCase() + newStr.slice(1);
    }
    return "";
  },

  makeRandomNumber: async (length = 5) => {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  },
}
