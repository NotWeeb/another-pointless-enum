const Enum = require("../.."); // require("another-pointless-enum")

const enumSettings = {
	strict: true,
	allowDuplicateValues: false,
	editableEnums: false
};

const enums = [
	"GRASS",
	[
		"DIRT",
		"STONE",
		[
			"WATER",
			"LAVA",
			"MEME",
			"gamers",
			"lmao"
		]
	]
];

module.exports = new Enum(enumSettings, enums);