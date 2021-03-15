class MovingElevator {
    constructor(elevatorId){
        this.moving = false;
        this.floor = 0;
        this.carId = elevatorId;
    }

    setFloor(floor){
        this.floor = floor;
    }

    setMoving(move){
        this.moving = move;
    }
    getFloor(){
        return this.floor;
    }
    isOccupied(){
        return this.moving;
    }
}

class Queue {
    constructor(){
        this.items = [];
    }

    isEmpty(){
        return this.items.length == 0;
    }

    enqueue(item){
        this.items.push(item);
    }
    
    dequeue(){
        if(!this.isEmpty()){
            return this.items.shift();
        }
        return null;
    }
}

class ElevatorDing{
    constructor(src){
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    }
    play(){
      this.sound.play();
    }
}

// function to change the state of the button the either disabled or not and change the color accordingly.
function changeButtonState(buttonId, color){
    document.getElementById(buttonId).style.backgroundColor=color;
    color == 'red' ? document.getElementById(buttonId).disabled = true : document.getElementById(buttonId).disabled = false;
}

// function that checks for nearest elevator.
function findNearestAvailableElevator(floorNumber){
    // both are occupied need to add this floor to the queue.
    if (firstElevator.isOccupied() && secondElevator.isOccupied()){
        return null;
    }
    // one is occupied and the other isn't return the unoccupied one.
    if (!firstElevator.isOccupied() && secondElevator.isOccupied()){
        firstElevator.setMoving(true);
        return firstElevator;
    } else if (!secondElevator.isOccupied() && firstElevator.isOccupied()){
        secondElevator.setMoving(true);
        return secondElevator;
    }
    // both are available, check for the nearest one.
    if (Math.abs((floorNumber - firstElevator.getFloor())) <= Math.abs((floorNumber - secondElevator.getFloor()))){
        firstElevator.setMoving(true);
        return firstElevator;
    } else {
        secondElevator.setMoving(true);
        return secondElevator;
    }
}

var firstElevator = new MovingElevator("car1");
var secondElevator = new MovingElevator("car2");
var queue = new Queue();
var startTimeQueue = new Queue();

function buttonClicked(floorNumber, buttonId, timeId, time){
    var start = null;
    // get the start time, if it was in the queue we will get the original start time.
    time == null ? start = new Date().getTime() : start = time;
    changeButtonState(buttonId, 'red');
    var nearestElevator = null;
    // elevators are unavailable. 
    if ((nearestElevator = findNearestAvailableElevator(floorNumber)) == null){
        // save the floor number and the time of calling.
        queue.enqueue(floorNumber);
        startTimeQueue.enqueue(start);
        return;
    }
    // check if needs to go up or down.
    var up = nearestElevator.getFloor() < floorNumber ? true : false;
    var elem = document.getElementById(nearestElevator.carId);
    var pos = elem.offsetTop;
    var startPos = pos;
    var endPos = startPos;
    // calculate the Y axis position that the elevator needs to get to.
    if (up){
        endPos = startPos - 45*(Math.abs(floorNumber) - nearestElevator.getFloor());
    } else {
        endPos = startPos - 45*(Math.abs(floorNumber) - nearestElevator.getFloor());
    }
    var id = setInterval(frame, 10);
    function frame(){
        // instead of 6 need to check floor number and whether it needs to go up or down.
        if (pos == endPos){
            var end = new Date().getTime();
            new ElevatorDing("ding.mp3").play();
            clearInterval(id);
            // set the amount of time the elevator took to arrive.
            document.getElementById(timeId).innerHTML = ((end-start)/1000 + "sec");
            // changing button back to available.
            changeButtonState(buttonId, '#00ff15');
            // wait on floor for 2 seconds then erase the time and unoccupy the elevator.
            setTimeout(() => {
                document.getElementById(timeId).innerHTML = "";
                nearestElevator.setMoving(false);
                nearestElevator.setFloor(floorNumber);
                // the elevator is now available and we need to pull from the queue should there be something.
                if (!queue.isEmpty()){
                    var flrNumber = queue.dequeue();
                    var originalStartTime = startTimeQueue.dequeue();
                    buttonClicked(flrNumber, "floor"+flrNumber, "time"+flrNumber, originalStartTime)
                }}, 2000);
        } else if(up){
            pos--;
            elem.style.top = pos + "px";
        } else {
            pos++;
            elem.style.top = pos + "px";
        }

    }
}