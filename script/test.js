//test variables

//Test 3*3

//var pState = [[ 8, 5, 2 ],[ 4, 3, 6 ],[ 1, 7, 0 ]];
//p.loadState(pState);



/*
//Test BestFirstSolver
var b = new BestFirstSolver(p, solved);
let solution = b.solve(b.search());
p.getHtml();


for(let i = solution.length-1; i >= 0; i--) {
    //p.move(solution[i]);
    //p.getHtml();
}
*/

//Test BidirectionalBestFirstSolver


//console.log(solution);

class BidirectionalBestFirstSolverTest{

    constructor(dimension, numberOfTestsToRun, memLimit) {
        this.dimension = dimension;
        this.numberOfTestsToRun = numberOfTestsToRun;
        this.memLimit = memLimit;
        this.directSolution = 0;
        this.invertSolution = 0;
        this.solution = 0;
        this.directSolverNodeCreated = 0;
        this.invertSolverNodeCreated = 0;
        this.iterations = 0;
        this.directExpansion = 0;
        this.invertExpansion = 0;
        this.blockedByMemory = 0;
        this.noAdmissibleSolution = 0;
        this.statesHasMet = 0;
        this.solvedWithoutMet = 0;
    }

    updateAnalytics(solution) {
        this.directSolution += solution.directSolution.length;
        this.invertSolution += solution.invertSolution.length;
        this.solution += solution.solution.length;
        this.directSolverNodeCreated += solution.directSolver.nodeCreated;
        this.invertSolverNodeCreated += solution.invertSolver.nodeCreated;
        this.iterations += solution.directSolver.iterationsCount;
        this.directExpansion += solution.directSolver.getAverageExpansion();
        this.invertExpansion += solution.invertSolver.getAverageExpansion();
        if(solution.blockedByMemory) this.blockedByMemory += 1;
        if(solution.noAdmissibleSolution) this.noAdmissibleSolution += 1;
        if(solution.statesHasMet) this.statesHasMet += 1;
        if(this.solvedWithoutMet) this.solvedWithoutMet += 1;
    }

    averageAnalytics() {
        this.directSolution /= this.numberOfTestsToRun;
        this.invertSolution /= this.numberOfTestsToRun;
        this.solution /= this.numberOfTestsToRun;
        this.directSolverNodeCreated /= this.numberOfTestsToRun;
        this.invertSolverNodeCreated /= this.numberOfTestsToRun;
        this.directExpansion /= this.numberOfTestsToRun;
        this.iterations /= this.numberOfTestsToRun;
        this.invertExpansion /= this.numberOfTestsToRun;
        /*this.blockedByMemory /= this.numberOfTestsToRun;
        this.noAdmissibleSolution /= this.numberOfTestsToRun;
        this.statesHasMet /= this.numberOfTestsToRun;
        this.solvedWithoutMet /= this.numberOfTestsToRun;*/
    }

    test() {
        var bbfs, p;
        var solved = new Puzzle(this.dimension);
        for(let i = 0; i < this.numberOfTestsToRun; i++) {
            p = new Puzzle(this.dimension);
            p.shuffle();
            bbfs = new BidirectionalBestFirstSolver(p, solved, this.memLimit);
            bbfs.search();
            //console.log(bbfs.logAnalytics());
            this.updateAnalytics(bbfs);
        }
        this.averageAnalytics();
        console.log(this.logAnalytics());
    }

    logAnalytics() {
        let s = '';
        s += 'direct solution cost: ' + this.directSolution + '\n';
        s += 'invert solution cost: ' + this.invertSolution + '\n';
        s += 'solution cost: ' + this.solution + '\n';
        s += 'direct solver node created: ' + this.directSolverNodeCreated + '\n';
        s += 'direct & invert solver iterations: ' + this.iterations + '\n';
        s += 'invert solver node created: ' + this.invertSolverNodeCreated + '\n';
        s += 'direct solver branching rate: ' + this.directExpansion + '\n';
        s += 'invert solver branching rate: ' + this.invertExpansion + '\n';
        s += 'blocked by memory: ' + this.blockedByMemory + '/' + this.numberOfTestsToRun + '\n';
        s += 'no admissible solution: ' + this.noAdmissibleSolution + '/' + this.numberOfTestsToRun + '\n';
        s += 'states has met in the middle: ' + this.statesHasMet + '/' + this.numberOfTestsToRun + '\n';
        s += 'solved without states met: ' + this.solvedWithoutMet + '/' + this.numberOfTestsToRun + '\n';
        return s;
    }

}

//var b = new BidirectionalBestFirstSolverTest(3, 1)
//b.test();


