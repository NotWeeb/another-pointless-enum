const { EnumCreator } = require("./dist/EnumCreator");
const { OldEnum } = require("./src__old/EnumCreator");

// for those who want to keep using the old version (god knows why you would)
EnumCreator.OldEnum = OldEnum;

module.exports = EnumCreator;
