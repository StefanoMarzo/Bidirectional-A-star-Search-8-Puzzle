const memLimit = 10000;
var p = new Puzzle(3);
p.getHtml();

function resetPuzzle() {
    p.generate();
    p.getHtml();
}

function shufflePuzzle() {
    p.shuffle();
}

function showAnalytics(b) {
    let directSolCost = b.directSolution.length;
    let invertSolCost = b.invertSolution.length;
    let solCost = b.solution.length;
    let directNodeCreated = b.directSolver.nodeCreated;
    let invertNodeCreated = b.invertSolver.nodeCreated;
    let iterations = b.directSolver.iterationsCount;
    let directBranchingRate = (Math.round(b.directSolver.getAverageExpansion() * 100) / 100).toFixed(2);
    let invertBranchingRate = (Math.round(b.invertSolver.getAverageExpansion() * 100) / 100).toFixed(2);
    let admissible = (b.noAdmissibleSolution) ? 'No' : 'Yes';
    let met = (b.statesHasMet) ? 'Yes' : 'No';

    document.getElementById("direct-solution-cost").innerHTML = directSolCost;
    document.getElementById("invert-solution-cost").innerHTML = invertSolCost;
    document.getElementById("solution-cost").innerHTML = solCost;
    document.getElementById("direct-nodes-created").innerHTML = directNodeCreated;
    document.getElementById("invert-nodes-created").innerHTML = invertNodeCreated;
    document.getElementById("tot-iterations").innerHTML = iterations;
    document.getElementById("invert-branching-rate").innerHTML = invertBranchingRate;
    document.getElementById("direct-branching-rate").innerHTML = directBranchingRate;
    document.getElementById("admissible-solution").innerHTML = admissible;
    document.getElementById("solvers-met").innerHTML = met;
    
}

function solvePuzzle() {
    var solved = new Puzzle(3);
    var b = new BidirectionalBestFirstSolver(p, solved, memLimit);
    b.search();
    console.log(b.logAnalytics());
    console.log(b.solution);

    let i = 0;

    function solveStep() {                  //  create a function
        setTimeout(function() {             //  initialize a setTimeout
            p.move(b.solution[i]);          //  execute instructions
            i++;                            //  increment the counter
            if (i < b.solution.length) {    //  recursive if controller 
                solveStep();                //  recursive call 
            }                       
        }, 300)
    }   
    solveStep(); 
    showAnalytics(b);
}