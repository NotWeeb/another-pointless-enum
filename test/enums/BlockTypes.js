const Enum = require("../.."); // require("another-pointless-enum")

const enumSettings = {
	strict: true,
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
			{"lmao": 2}
		]
	]
];

module.exports = new Enum(enumSettings, enums);