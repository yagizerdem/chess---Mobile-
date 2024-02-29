class Queue {
    constructor() {
      this.items = [];
    }
  
    // Add an element to the queue
    enqueue(element) {
      this.items.push(element);
    }
  
    // Remove an element from the queue
    dequeue() {
      if (this.isEmpty()) {
        return "Underflow";
      }
      return this.items.shift();
    }
  
    // Return the front element of the queue
    front() {
      if (this.isEmpty()) {
        return "No elements in Queue";
      }
      return this.items[0];
    }
  
    // Check if the queue is empty
    isEmpty() {
      return this.items.length === 0;
    }
  
    // Return the size of the queue
    size() {
      return this.items.length;
    }
  
    // Print the elements of the queue
    printQueue() {
      let str = "";
      for (let i = 0; i < this.items.length; i++) {
        str += this.items[i] + " ";
      }
      return str;
    }
  }

module.exports = Queue