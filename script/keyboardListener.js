document.onkeyup = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
        p.move(p.UP);
    }
    else if (e.keyCode == '40') {
        // down arrow
        p.move(p.DOWN);
    }
    else if (e.keyCode == '37') {
        // left arrow
        p.move(p.LEFT);
    }
    else if (e.keyCode == '39') {
        // right arrow
        p.move(p.RIGHT);
    }

}