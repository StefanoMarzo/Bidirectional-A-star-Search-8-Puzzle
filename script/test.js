class BestFirstSolverTest{
    constructor(dimension, numberOfTestsToRun, memLimit) {
        this.dimension = dimension;
        this.numberOfTestsToRun = numberOfTestsToRun;
        this.memLimit = memLimit;
        this.solution = [];
        this.nodeCreated = [];
        this.iterations = [];
        this.expansion = [];
        this.blockedByMemory = [];
        this.noAdmissibleSolution = [];
        this.timeConsumed = [];
        this.spaceConsumed = [];
    }
    updateAnalytics(solver, time) {
        this.solution.push(solver.solution.length);
        this.nodeCreated.push(solver.nodeCreated);
        this.iterations.push(solver.iterationsCount);
        this.expansion.push(solver.getAverageExpansion());
        this.blockedByMemory.push((solver.blockedByMemory) ? 1 : 0);
        this.noAdmissibleSolution.push((solver.noAdmissibleSolution) ? 1 : 0);
        this.timeConsumed.push(time);
        this.spaceConsumed.push(memorySizeOf(solver));
    }
    logAnalytics() {
        let s = 'TEST: A* Search, number of executions: ' + this.numberOfTestsToRun + '\n';
        s += 'solution cost: ' + this.avg(this.solution).toFixed(2) + '\n';
        s += 'node created: ' + this.avg(this.nodeCreated).toFixed(2) + '\n';
        s += 'iterations: ' + this.avg(this.iterations).toFixed(2) + '\n';
        s += 'branching factor: ' + this.avg(this.expansion).toFixed(3) + '\n';
        s += 'computational time: ' + this.avg(this.timeConsumed).toFixed(2) + '\n';
        s += 'computational space: ' + formatByteSize(this.avg(this.spaceConsumed)) + '\n';
        return s;
    }
    avg(list) {
        let sum = 0;
        for(let el of list) sum += el;
        return sum/this.numberOfTestsToRun;
    }
    test(puzzle, solved) {
        let bfs = new BestFirstSolver(puzzle, solved, this.memLimit);
        let start = performance.now();
        bfs.calcSolution();
        let end = performance.now();
        this.updateAnalytics(bfs, end-start);
        //console.log(this.logAnalytics());
    }
}

class BidirectionalBestFirstSolverTest{

    constructor(dimension, numberOfTestsToRun, memLimit) {
        this.dimension = dimension;
        this.numberOfTestsToRun = numberOfTestsToRun;
        this.memLimit = memLimit;
        this.directSolution = [];
        this.invertSolution = [];
        this.solution = [];
        this.directSolverNodeCreated = [];
        this.invertSolverNodeCreated = [];
        this.iterations = [];
        this.directExpansion = [];
        this.invertExpansion = [];
        this.statesHasMet = [];
        this.timeConsumed = [];
        this.spaceConsumed = [];
    }

    updateAnalytics(solver, time) {
        this.directSolution.push(solver.directSolution.length);
        this.invertSolution.push(solver.invertSolution.length);
        this.solution.push(solver.solution.length);
        this.directSolverNodeCreated.push(solver.directSolver.nodeCreated);
        this.invertSolverNodeCreated.push(solver.invertSolver.nodeCreated);
        this.iterations.push(solver.directSolver.iterationsCount);
        this.directExpansion.push(solver.directSolver.getAverageExpansion());
        this.invertExpansion.push(solver.invertSolver.getAverageExpansion());
        this.statesHasMet.push((solver.statesHasMet) ? 1 : 0);
        this.timeConsumed.push(time);
        this.spaceConsumed.push(memorySizeOf(solver));
    }
    avg(list) {
        let sum = 0;
        for(let el of list) sum += Number(el);
        return sum/list.length;
    }
    test(puzzle, solved) {
        var bbfs = new BidirectionalBestFirstSolver(puzzle, solved, this.memLimit);
        let start = performance.now();
        bbfs.search();
        let end = performance.now();
        this.updateAnalytics(bbfs, end-start);
        //console.log(this.logAnalytics());
    }

    logAnalytics() {
        let dSol = this.avg(this.directSolution).toFixed(2);
        let iSol = this.avg(this.invertSolution).toFixed(2);
        let dNodes = this.avg(this.directSolverNodeCreated);
        let iNodes = this.avg(this.invertSolverNodeCreated);
        let dBranch = this.avg(this.directExpansion).toFixed(3);
        let iBranch = this.avg(this.invertExpansion).toFixed(3);
        let s = 'TEST: Bidirectional A* Search, number of executions: ' + this.numberOfTestsToRun + '\n';
        s += 'solution cost (d + i): ' + this.avg(this.solution).toFixed(2) + 
                ' (' + dSol + ' + ' + iSol + ') ' + '\n';
        s += 'node created (d + i): ' + (Number(dNodes) + Number(iNodes)) + 
                ' (' + dNodes +  ' + ' + iNodes +') ' + '\n';
        s += 'iterations (d + i): ' + this.avg(this.iterations).toFixed(2)*2 + 
                ' (' + this.avg(this.iterations).toFixed(2) + ' * 2)' + '\n';
        s += 'average branching factor (d + i): ' + this.avg([dBranch, iBranch]).toFixed(3)
                + ' avg(' + dBranch + ', ' + iBranch + ')\n';
        s += 'states has met in the middle: ' + (this.avg(this.statesHasMet)*100).toFixed(1) + '%\n';
        s += 'computational time: ' + this.avg(this.timeConsumed).toFixed(2) + '\n';
        s += 'computational space: ' + formatByteSize(this.avg(this.spaceConsumed)) + '\n';
        return s;
    }

}

class SearchAlgorithmComparisonTest{
    constructor(dimension, numberOfTestsToRun, memLimit) {
        this.dimension = dimension;
        this.numberOfTestsToRun = numberOfTestsToRun;
        this.memLimit = memLimit;
    }

    test() {
        let b = new BestFirstSolverTest(this.dimension, this.numberOfTestsToRun, this.memLimit);
        let bb = new BidirectionalBestFirstSolverTest(this.dimension, this.numberOfTestsToRun, this.memLimit);
        let s = new Puzzle(this.dimension);
        for(let i = 0; i < this.numberOfTestsToRun; i++) {
            let p = new Puzzle(this.dimension);
            p.shuffle();
            b.test(p, s);
            bb.test(p, s);
        }
        console.log(b.logAnalytics());
        console.log(bb.logAnalytics());
    }

}

