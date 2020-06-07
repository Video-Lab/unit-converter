var typeDropdown = document.querySelector("#type-dropdown")
var unit1Dropdown = document.querySelector("#unit-1-dropdown")
var unit2Dropdown = document.querySelector("#unit-2-dropdown")
var unit1Input = document.querySelector("#unit-1-input")
var unit2Input = document.querySelector("#unit-2-input")
var convertButton = document.querySelector("#convert-button")
var valuesContainer = document.querySelector("#values-container")


class PriorityQueue {
    constructor(){
        this.values = [];
    }
    enqueue(val, priority){
        let newNode = new Node(val, priority);
        this.values.push(newNode);
        this.bubbleUp();
    }
    bubbleUp(){
        let idx = this.values.length - 1;
        const element = this.values[idx];
        while(idx > 0){
            let parentIdx = Math.floor((idx - 1)/2);
            let parent = this.values[parentIdx];
            if(element.priority >= parent.priority) break;
            this.values[parentIdx] = element;
            this.values[idx] = parent;
            idx = parentIdx;
        }
    }
    dequeue(){
        const min = this.values[0];
        const end = this.values.pop();
        if(this.values.length > 0){
            this.values[0] = end;
            this.sinkDown();
        }
        return min;
    }
    sinkDown(){
        let idx = 0;
        const length = this.values.length;
        const element = this.values[0];
        while(true){
            let leftChildIdx = 2 * idx + 1;
            let rightChildIdx = 2 * idx + 2;
            let leftChild,rightChild;
            let swap = null;

            if(leftChildIdx < length){
                leftChild = this.values[leftChildIdx];
                if(leftChild.priority < element.priority) {
                    swap = leftChildIdx;
                }
            }
            if(rightChildIdx < length){
                rightChild = this.values[rightChildIdx];
                if(
                    (swap === null && rightChild.priority < element.priority) || 
                    (swap !== null && rightChild.priority < leftChild.priority)
                ) {
                   swap = rightChildIdx;
                }
            }
            if(swap === null) break;
            this.values[idx] = this.values[swap];
            this.values[swap] = element;
            idx = swap;
        }
    }
}

class Node {
    constructor(val, priority){
        this.val = val;
        this.priority = priority;
    }
}

class Unit {
  constructor(name, input_type='text', unit='', unit_pretty=true) {
    this.name = name;
    this.input_type = input_type;
    this.unit = unit;
    this.pretty_name = this.keyToString(unit=unit_pretty)
  }

  keyToString(unit=true) {
    var str = capitalize(this.name)
    if(unit) str = str + " (" + this.unit + ")"
    return str
  }

}

function capitalize(str) {
  var splitName = str.split(" ")
  for(var i = 0; i < splitName.length; i++) {
    splitName[i] = splitName[i][0].toUpperCase() + splitName[i].slice(1,splitName[i].length)    
  }
  return splitName.join(" ") 
}

class ConversionGraph { 
   constructor() {
    this.adjacencyList = {};
    this.units = [];
  }

  addUnit(name, input_type='text', unit='', unit_pretty=true) {
    this.units.push(new Unit(name, input_type, unit, unit_pretty))
    this.adjacencyList[name] = [];
  }

  doesExist(unit) {
    for(var i = 0; i < this.units.length; i++) {
      if(this.units[i].name === unit) {
        return true;
      }
    }
    return false;
  }

  addConversion(unit1, unit2, conversion) {
  	if(!this.adjacencyList[unit1]) {
      this.adjacencyList[unit1] = [];
      this.units.push(new Unit(unit1))
    }
    this.adjacencyList[unit1].push({val: unit2, convert: conversion})
  }

  addConversionFromRatio(unit1, unit2, ratio, bidir=true) {
  	var ratioNum = parseFloat(ratio.split(":")[1])/parseFloat(ratio.split(":")[0])
    if(!this.adjacencyList[unit1]) {
      this.adjacencyList[unit1] = [];
      this.units.push(new Unit(unit1))
    }
  	this.addConversion(unit1, unit2, v => ratioNum*v)
  	if(bidir) {
      if(!this.adjacencyList[unit2]) {
        this.adjacencyList[unit2] = [];
        this.units.push(new Unit(unit2))
      }
  		this.addConversion(unit2, unit1, v => (1/ratioNum)*v)
  	}
  }



  getConversionPath(unit1, unit2) {
    var distances = {}
    var nodes = new PriorityQueue();
    var previous = {};
    var returnPath = [];

    var node;

    for(var vertex in this.adjacencyList) {
        previous[vertex] = null;
        if(vertex === unit1){
          distances[vertex] = 0;
        } 
        else {
          distances[vertex] = Infinity;
        }
        nodes.enqueue(vertex, distances[vertex])
      }

    while(nodes.values.length){
      node = nodes.dequeue().val;

        if(node === unit2) { 
          var prevNode = unit2; 
          while(previous[prevNode]){
            returnPath.push(prevNode)
            prevNode = previous[prevNode];
          }
          returnPath.push(unit1)
          break;
        }

      if(node || distances[node] !== Infinity) {
        for(var neighborIndex in this.adjacencyList[node]){
         var neighbor = this.adjacencyList[node][neighborIndex]
         var newDist = distances[node] + 1;

         if(newDist < distances[neighbor.val]) {
          distances[neighbor.val] = newDist;
          previous[neighbor.val] = node;
          nodes.enqueue(neighbor.val, newDist)
         }  
        }        
      }
    }
    return returnPath.reverse()
  }

  convert(unit1, unit2, val) {
  	var path = this.getConversionPath(unit1, unit2, val)
  	var convertedVal = val;
  	for(var i = 0; i < path.length; i++) {
  		if(path[i] == unit2) return convertedVal;

  		for(var j = 0; j < this.adjacencyList[path[i]].length; j++) {
  			var neighbor = this.adjacencyList[path[i]][j]
  			if(neighbor.val == path[i+1]){
  				convertedVal = neighbor.convert(convertedVal)
  			} 
  		}
  	}
  }

}

Date.prototype.addHours = function(hours) {
  this.setTime(this.getTime() + (hours*60*60*1000));
  return this;
}

Number.prototype.countDecimals = function () {
  if(Math.floor(this.valueOf()) === this.valueOf()) {
    return 0;
  }
  return this.toString().split(".")[1].length || 0; 
}

function reverseObject(obj) {
  var reverseObj = {};
  for(var k in obj) {
    reverseObj[obj[k].toString()] = k;
  }
  return reverseObj;
}

function setupPage() {
  populateTypes()
  clearInputs()
  valuesContainer.style.display = 'none';
  populateInputs(typeDropdown.value)

}

function clearInputs() {
  unit1Input.value = '';
  unit1Dropdown.innerHTML = '';
  unit2Input.value = '';
  unit2Dropdown.innerHTML = '';
}

function populateTypes() {
  for(var type in UNIT_RELATIONS) {
    var typeEl = document.createElement("OPTION")
    typeEl.setAttribute("value", type)
    typeEl.innerText = capitalize(type)
    typeDropdown.appendChild(typeEl)
  }
}

function populateInputs(type) {
  clearInputs()
  for(var i = 0; i < CONVERSIONS[type].units.length; i++) {
    var unit = CONVERSIONS[type].units[i];
    var unitEl = document.createElement("OPTION")
    unitEl.setAttribute("value", unit.name)
    unitEl.innerText = capitalize(unit.name)
    unit1Dropdown.appendChild(unitEl)
  }

  unit2Dropdown.innerHTML = unit1Dropdown.innerHTML
  unit2Dropdown.value = unit2Dropdown.children[1].value
  modifyInput(unit1Dropdown.value, unit1Input)
  modifyInput(unit2Dropdown.value, unit2Input)
  valuesContainer.style.display = "block";

}

function modifyInput(inputKey, inputEl) {
  var unit;
  for(var i = 0; i < CONVERSIONS[typeDropdown.value].units.length; i++) {
    if(CONVERSIONS[typeDropdown.value].units[i].name === inputKey) {
      unit = CONVERSIONS[typeDropdown.value].units[i]
    }
  }

  inputEl.setAttribute("type", unit.input_type)
  inputEl.setAttribute("placeholder", unit.pretty_name)
  if(inputEl.value != "") {
    if(inputEl.getAttribute("id") === "unit-1-input") {
      runConversion("up")
    } else {
      runConversion("down")
    }
  }
}

function runConversion(direction) {
  var unit1Val = unit1Input.value
  var unit2Val = unit2Input.value
  var unit1Name = unit1Dropdown.value
  var unit2Name = unit2Dropdown.value
  var converted;
  if(direction === "up") {
    converted = CONVERSIONS[typeDropdown.value].convert(unit2Name, unit1Name, unit2Val)
    if(typeof converted === "number") {
      if(converted.countDecimals() > 0) {
        converted = converted.toFixed(5)
      }
    }
    if(converted !== undefined) unit1Input.value = converted
  } else if(direction === "down") {
    converted = CONVERSIONS[typeDropdown.value].convert(unit1Name, unit2Name, unit1Val)
    if(typeof converted === "number") {
      if(converted.countDecimals() > 0) {
        converted = converted.toFixed(5)
      }
    }
    if(converted !== undefined) unit2Input.value = converted
  }

}

UNIT_TABLE = {
	"pounds": "lb",
	"kilograms": "kg",
	"stone": "s",
	"inches": "in",
	"yards": "yd",
	"centimeters": "cm",
	"meters": "m",
  "grams": "g",
	"kilometers": "km",
	"miles per hour": "mph",
	"kilometers per hour": "kph",
	"knots": "kt",
	"farenheit": "F",
	"celsius": "C",
	"kelvin": "K",
	"AED": "AED",
	"GBP": "GBP",
	"USD": "USD",
	"gregorian calendar": "gregorian",
	"julian calendar": "julian"
}

CONVERSIONS = {
	mass: new ConversionGraph(),
	length: new ConversionGraph(),
	speed: new ConversionGraph(),
	temperature: new ConversionGraph(),
	currency: new ConversionGraph(),
	date: new ConversionGraph(),
}

UNIT_RELATIONS = {
  'mass': ["kilograms", "grams", "stone", "pounds"],
  'length': ["inches", "centimeters", "meters", "yards", "miles", "kilometers"],
  'speed': ["miles per hour", "kilometers per hour", "knots"],
  'temperature': ["celsius", "farenheit", "kelvin"],
  'currency': ["aed", "usd", "gbp"],
  'date': ["gregorian calendar", "julian calendar"]
}

for(var k in UNIT_RELATIONS) {
  if(k !== "date") {
  for(var i = 0; i < UNIT_RELATIONS[k].length; i++) {
      CONVERSIONS[k].addUnit(UNIT_RELATIONS[k][i], 'text', UNIT_TABLE[UNIT_RELATIONS[k][i]])
    }
  } else {
    CONVERSIONS.date.addUnit("gregorian calendar", "date", unit=new Date().toISOString().split("T")[0], unit_pretty=false)
    CONVERSIONS.date.addUnit("julian calendar", "text", unit=UNIT_TABLE["julian calendar"], unit_pretty=false)
  }
}

CONVERSIONS.mass.addConversionFromRatio("kilograms", "pounds", "1:2.20462")
CONVERSIONS.mass.addConversionFromRatio("grams", "kilograms", "1000:1")
CONVERSIONS.mass.addConversionFromRatio("kilograms", "stone", "1:0.157473")

CONVERSIONS.length.addConversionFromRatio("inches", "centimeters", "0.393701:1")
CONVERSIONS.length.addConversionFromRatio("centimeters", "meters", "100:1")
CONVERSIONS.length.addConversionFromRatio("meters", "yards", "1:1.09361")
CONVERSIONS.length.addConversionFromRatio("meters", "miles", "1:0.000621371")
CONVERSIONS.length.addConversionFromRatio("meters", "kilometers", "1000:1")

CONVERSIONS.speed.addConversionFromRatio("miles per hour", "kilometers per hour", "1:1.60934")
CONVERSIONS.speed.addConversionFromRatio("knots", "kilometers per hour", "1:1.852")

CONVERSIONS.temperature.addConversion("celsius", "farenheit", v => (1.8*parseFloat(v))+32)
CONVERSIONS.temperature.addConversion("farenheit", "celsius", v => (parseFloat(v)-32)/1.8)
CONVERSIONS.temperature.addConversion("celsius", "kelvin", v => parseFloat(v)-273)
CONVERSIONS.temperature.addConversion("kelvin", "celsius", v => parseFloat(v)+273)

CONVERSIONS.currency.addConversionFromRatio("aed", "usd", "3.67:1")
CONVERSIONS.currency.addConversionFromRatio("usd", "gbp", "1:0.79")

CONVERSIONS.date.addConversion("gregorian calendar", "julian calendar", function(date){
	return Math.floor( new Date(date).addHours(12) / 86400000 + 2440587.5)

})

CONVERSIONS.date.addConversion("julian calendar", "gregorian calendar", function(jd){
	return new Date(Math.round((jd - 2440587.5) * 86400000)).toISOString().split("T")[0]
})

setupPage()

typeDropdown.addEventListener("change", function(){
  clearInputs()
  populateInputs(typeDropdown.value)
})

unit1Dropdown.addEventListener("change", function(){
  modifyInput(unit1Dropdown.value, unit1Input)
})

unit2Dropdown.addEventListener("change", function(){
  modifyInput(unit2Dropdown.value, unit2Input)
})

unit1Input.addEventListener("input", function(){
  runConversion("down")
})

unit2Input.addEventListener("input", function(){
  runConversion("up")
})
