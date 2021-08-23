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

function showAnalytics(b, bStandard, t, stdT, bSize, sSize) {
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

    let standardNodesCreated = bStandard.nodeCreated;
    let standardBranchingRate = (Math.round(bStandard.getAverageExpansion() * 100) / 100).toFixed(2);
    let standardIterations = bStandard.iterationsCount;
    let standardSolutionCost = bStandard.solution.length;

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
    document.getElementById("bidirectional-time").innerHTML = t + 'ms';
    document.getElementById("bidirectional-byte").innerHTML = bSize;

    document.getElementById("standard-nodes-created").innerHTML = standardNodesCreated;
    document.getElementById("standard-branching-rate").innerHTML = standardBranchingRate;
    document.getElementById("standard-tot-iterations").innerHTML = standardIterations;
    document.getElementById("standard-solution-cost").innerHTML = standardSolutionCost;
    document.getElementById("standard-time").innerHTML = stdT + 'ms';
    document.getElementById("standard-byte").innerHTML = sSize;
    
}

function solvePuzzle() {
    var solved = new Puzzle(3);
    var b = new BidirectionalBestFirstSolver(p, solved, memLimit);
    start = window.performance.now();
    b.search();
    end = window.performance.now();
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

    var bStandard = new BestFirstSolver(p, solved, memLimit);
    stdStart = window.performance.now();
    bStandard.calcSolution();
    stdEnd = window.performance.now();
    bSize = formatByteSize(memorySizeOf(b));
    sSize = formatByteSize(memorySizeOf(bStandard));
    showAnalytics(b, bStandard, end-start, stdEnd-stdStart, bSize, sSize);
}

function memorySizeOf(obj) {
    var bytes = 0;

    function sizeOf(obj) {
        if(obj !== null && obj !== undefined) {
            switch(typeof obj) {
            case 'number':
                bytes += 8;
                break;
            case 'string':
                bytes += obj.length * 2;
                break;
            case 'boolean':
                bytes += 4;
                break;
            case 'object':
                var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                if(objClass === 'Object' || objClass === 'Array') {
                    for(var key in obj) {
                        if(!obj.hasOwnProperty(key)) continue;
                        sizeOf(obj[key]);
                    }
                } else bytes += obj.toString().length * 2;
                break;
            }
        }
        return bytes;
    };
    return sizeOf(obj);
};
function formatByteSize(bytes) {
    if(bytes < 1024) return bytes + " bytes";
    else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KiB";
    else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MiB";
    else return(bytes / 1073741824).toFixed(3) + " GiB";
};

/* Test */
var s = new SearchAlgorithmComparisonTest(3,1000,100000);
//s.test();