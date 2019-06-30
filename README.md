# another-pointless-enum

### Installation
`npm i another-pointless-enum`

### Usage
```javascript

// we now require the package like other normal packages
const Enum = require("another-pointless-enum");

// (NOT RECOMMENDED) and if you're ever so inclined, you can mess with the old enum creator
const { OldEnum } = require("another-pointless-enum");
// note: OldEnum is documented in an old version of this package, view that for reference, this readme does not apply to the old versions

// arguments for the Enum class are flexible and handled within the class
const Games = new Enum(
	{
	    // throws errors when you try to do stuff you shouldn't or cant do
		strict: true,
		// allow the ability to create multiple enums with the same values
		allowDuplicateValues: false,
		// allows for editing of the enums (WIP)
		editableEnums: false
	},
	
	// a single string/enum that will be automatically provided a value
	"A",
	// defining an enum that will be given a value of your choosing
	["B", "custom value"],
	// you can also do this but why would you do this?
	["C"],
	
	// a prime example of nested arrays
	[
		["E", "customize me E"],
		["F", "customize me F"],
		[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[["why_am_i_like_this"]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
	]
	
);


Games.has("H"); // returns a boolean

// the ability to set enums outside of the class' constructor
Games.set("I", "more custom values");

```

### Profit?
Could you even profit from such badly written code :^)