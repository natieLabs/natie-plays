$(function() {
    var bricks = {
        NUM_BRICKS: 50,
        BRICKS_PER_ROW: 10,
        array: null,
        widthWithMargin: null,
        width: null,
        height: 10,
        outerHeight: null,
        BRICK_MARGIN: 1,
        baseline: null,

        init: function() {
            for (var i = 0; i < this.NUM_BRICKS; i++) {
                container.append('<div class="brick" id="brick' + i + '"></div>')
            }
            this.side = container.width();
            this.array = container.children(".brick");
            this.widthWithMargin = ~~(side / this.BRICKS_PER_ROW);
            this.width = this.widthWithMargin - this.BRICK_MARGIN * 2;
            $(".brick").width(this.width);
            this.baseline = this.array.last().position().top + this.array.last().height();
            this.outerHeight = this.height + this.BRICK_MARGIN * 2;
        },

        get: function(r, c) {
            var index = r * this.BRICKS_PER_ROW + c;
            return $("#brick" + index);
        },

    }

    function collision($div1, $div2) {
        var x1 = $div1.offset().left;
        var y1 = $div1.offset().top;
        var h1 = $div1.outerHeight(true);
        var w1 = $div1.outerWidth(true);
        var b1 = y1 + h1;
        var r1 = x1 + w1;
        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;

        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
        return true;
    }

    var container = null;


    container = $("#container");
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

    const r = 5;
    const PADDLE_WIDTH = 60;
    const PADDLE_TOP = paddle.position().top;
    const PADDLE_BOTTOM = PADDLE_TOP + paddle.height();

    bricks.init(container);

    ball.width(2 * r);
    ball.height(2 * r);
    paddle.width(PADDLE_WIDTH);

    // $(".brick").click(function(e) {
    //     container = $("#container");
    //     var clickx = e.pageX - container.offset().left;
    //     var clicky = e.pageY - container.offset().top;
    //     var row = ( (clicky - 10) / bricks.outerHeight) | 0;
    //     var col = ~~(clickx / bricks.widthWithMargin);
    //     console.log(clickx, clicky, row, col);
    //     bricks.get(row, col).addClass('removed');
    // })

    var cycle = setInterval(function() {
        bx = (ball.position().left + dx) | 0;
        by = (ball.position().top + dy) | 0;

        var row = (by / bricks.outerHeight) | 0;
        var col = (bx / bricks.widthWithMargin) | 0;

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
            $("#lifesNode").html(lifes);
            clearInterval(cycle);
            // alert('Game over!');
        };

        // hits bottom
        if (by >= side - r && lifes) {
            dy *= -1;
            $("#lifesNode").html(lifes);
        }

        // remove bricks
        if (by >= 0 && by < bricks.baseline) {

            var isRemoved = bricks.get(row, col).hasClass("removed");
            // console.log(bricks.get(row, col), isRemoved);
            if (!isRemoved) {
                dy *= -1;
                bricks.get(row, col).addClass('removed');

                // bounces on left and right walls, flip x direction
                if (dx < 0 && (bx % bricks.widthWithMargin < r || bx % bricks.widthWithMargin > (r * 2 + 2))) {
                    dx *= -1;
                }
                if (dx > 0 && ((bx + r + 2) % bricks.widthWithMargin < r || (bx + r + 2) % bricks.widthWithMargin > (r * 2 + 2))) {
                    dx *= -1;
                }
                $("#scoreNode").innerHTML = ++score;
                if (score == bricks.NUM_BRICKS) {
                    clearInterval(cycle);
                    // alert('Victory!');
                };
            }

        }
    }, 1000 / 60);

    document.addEventListener('mousemove', function(e) {
        px = (e.pageX > xmin + $("#paddle").width() / 2) ? ((e.pageX < xmax) ? e.pageX - xmin - $("#paddle").width() / 2 : xmax - xmin - $("#paddle").width()) : 0;
        $("#paddle").css({ left: px });
    }, false);

});
