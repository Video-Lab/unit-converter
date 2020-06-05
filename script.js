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


class ConversionGraph { 
   constructor() {
    this.adjacencyList = {};
  }

  addConversion(unit1, unit2, conversion) {
  	if(!this.adjacencyList[unit1]) this.adjacencyList[unit1] = [];
    this.adjacencyList[unit1].push({val: unit2, convert: conversion})
  }

  addConversionFromRatio(unit1, unit2, ratio, bidir=true) {
  	var ratioNum = parseFloat(ratio.split(":")[1])/parseFloat(ratio.split(":")[0])
  	if(!this.adjacencyList[unit1]) this.adjacencyList[unit1] = [];
  	this.addConversion(unit1, unit2, v => ratioNum*v)
  	if(bidir) {
  		if(!this.adjacencyList[unit2]) this.adjacencyList[unit2] = [];
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