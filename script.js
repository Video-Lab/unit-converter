class Convertor {
	// A converter takes two units and a function that allows for conversion from unit1 to unit2. The type of conversion (length, date, mass, etc.) is also specified.
	constructor(type, unit1, unit2, convert) {
		this.type = type
		this.unit1 = unit1
		this.unit2 = unit2
		this.convert = convert
	}

	static fromRatio(type, unit1, unit2, ratio) { // Ratio comes in the form "x:y", (x for unit1, y for unit2)
		var nums = ratio.split(":")
		var numRatio = parseFloat(nums[0])/parseFloat(nums[1])
		return constructor(type, unit1, unit2, function(v){return numRatio*v})
	}
}