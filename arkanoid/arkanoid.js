$(function() {

    var container = $("#container");
    var xmin = container.offset().left;
    var xmax = container.offset().left + container.width();
    var side = container.width();

    var px = 129,
        dx = -4,
        dy = -4,
        lifes = 3,
        score = 0,
        bx = by = 0;

    var paddle = $("#paddle");
    var ball = $("#ball");

    const r = 10;
    const PADDLE_WIDTH = 60;
    const PADDLE_TOP = paddle.position().top;
    const PADDLE_BOTTOM = PADDLE_TOP + paddle.height();
    const NUM_BRICKS = 50;
    const BRICKS_PER_ROW = 10;

    ball.width(r);
    ball.height(r);
    paddle.width(PADDLE_WIDTH);

    var i = 1;
    for (i = 1; i <= NUM_BRICKS; i++) {
        container.append('<div class="brick"></div>')
    }
    var bricks = $(".brick");
    var brickWidthWithMargin = ~~(side / BRICKS_PER_ROW);
    bricks.width(brickWidthWithMargin - 2);

    var cycle = setInterval(function() {
        bx = (ball.position().left + dx) | 0;
        by = (ball.position().top + dy) | 0;
        var row = ((by - 30) / 14) | 0;
        var col = (bx / 32) | 0;

        // update ball location
        ball.css({ left: bx, top: by });

        // hits left right sides, reverse x direction
        if (bx < 0 && dx < 0 || bx >= side - r && dx > 0) {
            dx *= -1;
        }
        // hits paddle
        if (bx + r >= px && bx <= px + PADDLE_WIDTH && by >= PADDLE_TOP - 2 && by <= PADDLE_BOTTOM - 2) {
            dy *= -1;
            if (bx <= px + PADDLE_WIDTH / 4) { // hits left half, move left
                dx = -6;
            } else if (bx >= px + PADDLE_WIDTH / 4 * 3) { // hits right half, move right
                dx = 6;
            } else if (Math.abs(dx) === 6) { // hits middle, slowdown
                dx = (dx * 2 / 3) | 0;
            }
        }

        // hits top
        if (by <= 0) { dy *= -1; }

        // check game ends
        if (by >= side - r && !--lifes) {
            lifesNode.innerHTML = lifes;
            clearInterval(cycle);
            // alert('Game over!');
        };

        // hits bottom
        if (by >= side - r && lifes) {
            dy *= -1;
            $("#lifesNode").innerHTML = lifes;
        }

        // remove bricks
        var brickbaseline = bricks.last().position().top + bricks.last().height();

        if (by >= 0 && by <= brickbaseline && container.children()[row * BRICKS_PER_ROW + col].className != 'removed') {
            dy *= -1, container.children()[row * BRICKS_PER_ROW + col].className = 'removed';
            if (dx < 0 && (bx % brickWidthWithMargin < 10 || bx % brickWidthWithMargin > 22)) {
                dx *= -1;
            }
            if (dx > 0 && ((bx + 12) % 32 < 10 || (bx + 12) % 32 > 22)) {
                dx *= -1;
            }
            $("#scoreNode").innerHTML = ++score;
            if (score == NUM_BRICKS) {
                clearInterval(cycle);
                // alert('Victory!');
            };
        }
    }, 1000 / 60);

    document.addEventListener('mousemove', function(e) {
        px = (e.pageX > xmin + $("#paddle").width() / 2) ? ((e.pageX < xmax) ? e.pageX - xmin - $("#paddle").width() / 2 : xmax - xmin - $("#paddle").width()) : 0;
        $("#paddle").css({ left: px });
    }, false);
});
