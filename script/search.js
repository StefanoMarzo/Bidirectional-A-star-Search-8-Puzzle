/**
 * the Stack mantains the elements ordered by their cost.
 * it always pops the minimum cost Node with O(1) time
 * it adds new node with O(log_2(n)) time
 */
class Stack{
    constructor(){
        this.stack = [];
    }

    add(el) {
        this.stack.splice(this.sortedIndex(this.stack, el.cost), 0, el);
    }

    getNext() {
        return this.stack.shift();
    }

    getMinCost() {
        let min = this.stack[0].cost;
        let i = 0;
        let j = 0;
        for(i = 0; i < this.stack.length; i++) {
            if(this.stack[i].cost < min){
                 j = i;
            }
        }
        return this.stack.splice(j, 1);
    }

    /**
     * 
     * @param {*} array array to look into
     * @param {*} value new element to insert
     * @returns the index of the array where 
     * insert the new element in O(log_2(n)) time
     * 
     */
    sortedIndex(array, value) {
        let low = 0,
            high = array.length;
        let mid = 0; //bit shifting
        while (low < high) {
            mid = (low + high) >>> 1; //bit shifting
            if (array[mid].cost < value) low = mid + 1;
            else high = mid;
        }
        return low;
    }
    pop(){
        return this.stack.shift();
    }
}

/**
 * HashTable of the states reached
 */
class StateTable{
    constructor(){
        this.states = [];
    }
}

/**
 * Graph Node 
 */
class Node{
    constructor(state, direction, parent, cost, depth){
        this.state = state;
        this.direction = direction;
        this.parent = parent;
        this.cost = cost; //depth + manhattan distance
        this.depth = depth;
    }
}

class BestFirstSolver{
    constructor(randomPuzzle, goalPuzzle, memLimit){
        this.randomPuzzle = randomPuzzle;
        this.dimension = randomPuzzle.size;
        this.stack = new Stack();
        this.solution = [];
        this.stateTable = new StateTable();
        let p = new Puzzle(this.dimension);
        p.generate();
        this.goal = goalPuzzle.cloneState();
        this.nodeCreated = 0;
        this.iterationsCount = 0;
        this.createNode(randomPuzzle.cloneState(), null, null);
        this.memLimit = memLimit;
    }
    createNode(state, direction, parent) {
        if(typeof this.stateTable.states[state] === 'undefined') {
            let cost = 0;
            let depth = 0;
            if(parent != null) {
                cost = parent.depth + this.distance(state);
                depth = parent.depth + 1;
            }
            let node = new Node(state, direction, parent, cost, depth);
            this.stack.add(node);
            //this.stateTable.states[state] = false;
            this.stateTable.states[state] = node;
            this.nodeCreated += 1;
        }
    }
    isGoal(state){
        for(let i in this.goal){
            for(let j in this.goal[i]){
                if(this.goal[i][j] != state[i][j]){
                    return false;
                }
            }
        }
        return true;
    }
    expand(node) {
        if(typeof this.stateTable.states[node.state] !== 'undefined') {
            //this.stateTable.states[node.state] = true;
            let p = new Puzzle(this.dimension);
            p.loadState(node.state);
            let nextPossibleStates = p.getNextPossibleStatesDirections();
            for(let stateDirection of nextPossibleStates) {
                this.createNode(stateDirection.state, stateDirection.direction, node);
            }
        }
    }

    /**
     * 
     * @returns the last node expandend which contains the solution 
     */
    search() {
        let next = this.stack.getNext();
        while(!this.isGoal(next.state)) {
            //console.log(this.iterationsCount);
            this.expand(next);
            next = this.stack.getNext();
            this.iterationsCount+=1;
        }
        return next;
    }

    solve(node) {
        let directions = [];
        while(node.parent != null) {
            directions.push(node.direction);
            node = node.parent;
        }
        return directions;
    }

    calcSolution() {
        this.solution = this.solve(this.search());
    }

    distance(state) {
        let target = this.createCoordsMap(this.goal);
        let current = this.createCoordsMap(state);
        let d = 0;
        for(let i in target) {
            d += Math.abs(target[i].x - current[i].x);
            d += Math.abs(target[i].y - current[i].y);
        }
        //it shall not overestimate
        return d/2;
    }

    createCoordsMap(state) {
        let m = [];
        for(let i = 0; i < Math.pow(this.dimension,2); i++) {
            m[i] = this.getCoord(i, state);
        }
        return m;
    }

    getCoord(num, state) {
        for(let i = 0; i < this.dimension; i++) {
            for(let j = 0; j < this.dimension; j++) {
                if(state[i][j] == num) return {x: i, y: j};
            }
        }
    }

    /**
     * @returns the average number of branches expanded
     */
    getAverageExpansion() {
        return this.nodeCreated/this.iterationsCount;
    }

}

class BidirectionalBestFirstSolver{
    constructor(puzzle, goal, memLimit) {
        this.puzzle = puzzle;
        this.goal = goal;
        this.memLimit = memLimit;
        this.directSolver = new BestFirstSolver(puzzle, goal, memLimit);
        this.invertSolver = new BestFirstSolver(goal, puzzle, memLimit);
        this.directSolution = [];
        this.invertSolution = [];
        this.solution = [];
        //analytics
        this.blockedByMemory = false;
        this.noAdmissibleSolution = false;
        this.statesHasMet = false;
        this.solvedWithoutMet = false;
    } 

    search() {
        let nextD = this.directSolver.stack.getNext();
        let nextI = this.invertSolver.stack.getNext();
        while(!this.directSolver.isGoal(nextD.state) && !this.invertSolver.isGoal(nextI.state)) {
            this.directSolver.expand(nextD);
            this.invertSolver.expand(nextI);
            nextD = this.directSolver.stack.getNext();
            nextI = this.invertSolver.stack.getNext();
            this.directSolver.iterationsCount+=1;
            this.invertSolver.iterationsCount+=1;
            if(this.directSolver.iterationsCount > this.memLimit) {
                // search blocked manually to avoid long waits
                this.blockedByMemory = true;
                return;
            }
            if(this.statesMet(nextD, nextI)) {
                // direct and invert solutions are combined
                this.statesHasMet = true;
                return;
            }

            if(typeof nextD === 'undefined' && typeof nextI == 'undefined'){
                // no admissible solution 
                this.noAdmissibleSolution = true;
                return;
            }
        }
        //solved without states meeting
        this.solvedWithoutMet = true;
        return;
    }

    combineSolution(node) {
        let direct = this.directSolver.stateTable.states[node.state];
        let invert = this.invertSolver.stateTable.states[node.state];
        
        while(invert.direction != null) {
            this.invertSolution.push(invert.direction);
            invert = invert.parent;
        }

        while(direct.direction != null) {
            this.directSolution.push(direct.direction);
            direct = direct.parent;
        }

        for(let i = this.directSolution.length-1; i >= 0; i--) {
            this.solution.push(this.directSolution[i]);
        }
        for(let i = 0; i < this.invertSolution.length; i++) {
            this.solution.push(this.puzzle.getOppositeDirection(this.invertSolution[i]));
        }
         
    }

    statesMet(nodeD, nodeI) {
        let d = typeof this.directSolver.stateTable.states[nodeI.state] !== 'undefined';
        let i = typeof this.invertSolver.stateTable.states[nodeD.state] !== 'undefined';
        if(d) {
            //console.log('Invert state found in direct');
            this.combineSolution(nodeI);
            return true;
        } else if(i) {
            //console.log('Direct state found in invert');
            this.combineSolution(nodeD);
            return true;
        } else return false;
    }

    logAnalytics() {
        let s = '';
        s += 'direct solution cost: ' + this.directSolution.length + '\n';
        s += 'invert solution cost: ' + this.invertSolution.length + '\n';
        s += 'solution cost: ' + this.solution.length + '\n';
        s += 'direct solver node created: ' + this.directSolver.nodeCreated + '\n';
        s += 'direct & invert solver iterations: ' + this.directSolver.iterationsCount + '\n';
        s += 'invert solver node created: ' + this.invertSolver.nodeCreated + '\n';
        s += 'direct solver branching rate: ' + this.directSolver.getAverageExpansion() + '\n';
        s += 'invert solver branching rate: ' + this.invertSolver.getAverageExpansion() + '\n';
        s += 'blocked by memory: ' + this.blockedByMemory + '\n';
        s += 'no admissible solution: ' + this.noAdmissibleSolution + '\n';
        s += 'states has met in the middle: ' + this.statesHasMet + '\n';
        s += 'solved without states met: ' + this.solvedWithoutMet;
        return s;
    }
}
