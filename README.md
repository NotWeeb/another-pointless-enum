# another-pointless-enum

### Installation
`npm i another-pointless-enum`

### Usage
```javascript
require('another-pointless-enum')
// Enum is set as a global, sorry not sorry
// will consider changing if reported as issue on repo

const Health = Enum([
	"LOW",
	["MEDIUM", "some custom value"],
	"HIGH"
]);

// returns value of updated key
health.update("LOW", "some new custom value");

// returns the value of set key
health.set("EMPTY");
health.set("EMPTY", "some custom value");
health.set([
	"SAME",
	["AS", "the"],
	"constructor" // note that this will automatically set to uppercase for enums
]);

// this also works by default
health.set(["no_key"])

// returns true or false
health.has("EMPTY"); 

```

### Profit?
Could you even profit from such badly written code :^)