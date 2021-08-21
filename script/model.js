class Puzzle{
    constructor(size) {
        this.size = size;
        this.cell = [];
        this.BLANK = 0;
        this.LEFT = 'LEFT';
        this.RIGHT = 'RIGHT';
        this.UP = 'UP';
        this.DOWN = 'DOWN';
        this.generate();
    }
    generate(){
        this.cell = [];
        for(let i = 0; i < this.size; i++) {
            let row = [];
            for(let j = 0; j < this.size; j++) {
                row.push((this.size*i)+(j+1));
            }
            this.cell.push(row);
        }
        this.cell[this.size-1][this.size-1] = this.BLANK;
    }
    shuffle() {
        let reachedStates = [];
        reachedStates[this.getState()] = true;
        for(let i = 0; i < Math.pow(this.size,4); i++){
            let moves = this.getPossibleRawDirections();
            let r = Math.round(Math.random() * (moves.length-1));
            let move = moves[r];
            while(reachedStates[this.getNextState(move)] == true) {
                moves.splice(r, 1);
                if(moves.length == 0) {
                    return;
                }
                r = Math.round(Math.random() * (moves.length-1));
                move = moves[r];
            }
            this.move(move);
            reachedStates[this.getState()] = true;
        }
    }
    printStateConsole(){
        let s = '';
        for(let i in this.cell) {
            for(let j in this.cell[i]){
                s+=this.cell[i][j];
            }
            s+="<br>";
        }
        console.log(s);
    }
    getHtml(){
        let s = '';
        for(let i in this.cell) {
            for(let j in this.cell[i]){
                if(this.cell[i][j] == 0){
                    s+='<span class="puzzle-cell">&middot;</span>';
                } else{
                    s+='<span class="puzzle-cell">'+this.cell[i][j]+'</span>';
                }
            }
             s+= '<br>';
        }
        document.getElementById('puzzle').innerHTML = s;
    }

    getCell(x, y) {
        return this.cell[x][y];
    }

    swap(x1, y1, x2, y2) {
        let tempCell = this.getCell(x1, y1);
        this.cell[x1][y1] = this.getCell(x2, y2);
        this.cell[x2][y2] = tempCell;
    }

    getBlankCell() {
        for(let i in this.cell){
            for(let j in this.cell[i]) {
                if(this.getCell(i,j) == this.BLANK) 
                    return {x:Number(i), y:Number(j)};
            }
        }
    }

    isPossibleMove(x, y) {
        let blankCoords = this.getBlankCell();
        let distX = Math.abs(x-blankCoords.x);
        let distY = Math.abs(y-blankCoords.y);
        let dist = distX + distY;
        return (dist == 1 && this.inRange(x) && this.inRange(y));
    }

    inRange(n) {
        return n >= 0 && n < this.size;
    }

    getPossibleMoves() {
        let moves = [];
        for(let i in this.cell) {
            for(let j in this.cell[i]) {
                if(this.isPossibleMove(i,j)) {
                    moves.push({x: Number(i), y: Number(j)});
                }
            }
        }
        return moves;
    }

    getDirection(x1, y1, x2, y2){
        let distX = x1 - x2;
        let distY = y1 - y2;
        if(distX == 1) return this.UP;
        if(distX == -1) return this.DOWN;
        if(distY == 1) return this.LEFT;
        if(distY == -1) return this.RIGHT;
    }

    getPossibleDirections() {
        let moves = this.getPossibleMoves();
        let blankCoords = this.getBlankCell();
        let directionList = [];
        for(let move of moves) {
            directionList[this.getDirection(blankCoords.x, blankCoords.y,move.x, move.y)] = move;
        }
        return directionList;
    }

    getPossibleRawDirections() {
        let moves = this.getPossibleMoves();
        let blankCoords = this.getBlankCell();
        let directionList = [];
        for(let move of moves) {
            directionList.push(this.getDirection(blankCoords.x, blankCoords.y,move.x, move.y));
        }
        return directionList;
    }

    move(direction) {
        this.moveWithoutTemplate(direction);
        this.getHtml();
    }

    moveWithoutTemplate(direction) {
        let directions = this.getPossibleDirections();
        let move = directions[direction];
        if(typeof move !== 'undefined') {
            let blankCell = this.getBlankCell();
            this.swap(blankCell.x, blankCell.y, move.x, move.y);
        }
    }

    getState(){
        return this.cell;
    }

    cloneState(){
        let l = [];
        for(let i in this.cell) {
            let s = [];
            for(let j in this.cell[i]){
                s.push(this.cell[i][j]);
            }
            l.push(s);
        }
        return l;
    }

    getNextState(direction) {
        let puzzle = new Puzzle(this.size);
        puzzle.cell = this.cloneState();
        puzzle.moveWithoutTemplate(direction);
        return puzzle.getState();
    }

    loadState(state) {
        for(let i in this.cell) {
            for(let j in this.cell[i]){
                this.cell[i][j] = state[i][j];
            }
        }
    }

    getNextPossibleStatesDirections(){
        let directions = this.getPossibleDirections();
        let statesDirections = [];
        if(typeof directions[this.LEFT] != 'undefined'){
            statesDirections.push({
                state: this.getNextState(this.LEFT), 
                direction: this.LEFT
            });
        }
        if(typeof directions[this.RIGHT] != 'undefined'){
            statesDirections.push({
                state: this.getNextState(this.RIGHT), 
                direction: this.RIGHT
            });
        }
        if(typeof directions[this.UP] != 'undefined'){
            statesDirections.push({
                state: this.getNextState(this.UP), 
                direction: this.UP
            });
        }
        if(typeof directions[this.DOWN] != 'undefined'){
            statesDirections.push({
                state: this.getNextState(this.DOWN), 
                direction: this.DOWN
            });
        }
        return statesDirections;
    }

    getOppositeDirection(direction) {
        if(direction == this.LEFT) return this.RIGHT;
        if(direction == this.RIGHT) return this.LEFT;
        if(direction == this.DOWN) return this.UP;
        if(direction == this.UP) return this.DOWN;
    }
}
