$(function() {

    // object for set of bricks
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
            var rainbow = new Rainbow();
            var rows = ~~(this.NUM_BRICKS / this.BRICKS_PER_ROW);
            rainbow.setNumberRange(1, rows);
            rainbow.setSpectrum("#2d1d25", "#ff1d25")

            for (var i = 0; i < this.NUM_BRICKS; i++) {
                var row = ~~(i / this.BRICKS_PER_ROW);
                container.append('<div class="brick" id="brick' + i + '" style="background-color: #' + rainbow.colourAt(row) + '"></div>')
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

    // var ball = {
    //     R: 5,
    //     bx: 0,
    //     by: 0,
    //     dx: -4,
    //     dy: -4,
    //     self: $("#ball"),

    //     init: function() {
    //       self.width(2*r);
    //       self.height(2*r);
    //     },

    //     put: function(x, y){
    //       // self.position().top;
    //       ball.css({ left: x, top: y });
    //       this.bx = x;
    //       thix.by = y;
    //     }

    //     update: function(){
    //       this.bx = (this.bx + dx) | 0;
    //       this.by = (this.by + dy) | 0;
    //       put(this.bx, this.by);
    //     }
    // }

    var container = $("#container");
    var xmin = container.offset().left;
    var xmax = container.offset().left + container.width();
    var side = container.width();
    var top = container.offset().top;

    $(".buttons").offset({ left: xmax + 10, top: top })

    var px = 129,
        dx = -4,
        dy = -4,
        lifes = 3,
        score = 0,
        bx = by = 0;

    $("#lifesNode").html(lifes);
    var paddle = $("#paddle");
    var ball = $("#ball");

    const r = 5;
    const PADDLE_WIDTH = side / 5;
    const PADDLE_TOP = paddle.position().top;
    const PADDLE_BOTTOM = PADDLE_TOP + paddle.height();

    bricks.init(container);

    ball.width(2 * r);
    ball.height(2 * r);
    paddle.width(PADDLE_WIDTH);

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
        if (bx >= px && bx <= px + PADDLE_WIDTH && by + 2 * r >= PADDLE_TOP && by < PADDLE_BOTTOM) {
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
        if (by >= side - r * 2 && !--lifes) {
            $("#lifesNode").html(lifes);
            addGameOver();
            clearInterval(cycle);
        };

        // hits bottom
        if (by + r * 2 >= side && lifes) {
            dy *= -1;
            $("#lifesNode").html(lifes);
        }

        // remove bricks
        if (by >= 0 && by < bricks.baseline) {

            var isRemoved = bricks.get(row, col).hasClass("removed");
            if (!isRemoved) {
                dy *= -1;
                bricks.get(row, col).addClass('removed');

                // bounces on left and right sides of bricks, flip x direction
                if (dx < 0 && (bx % bricks.widthWithMargin < r || bx % bricks.widthWithMargin > (r * 2 + 2))) {
                    dx *= -1;
                }
                if (dx > 0 && ((bx + r * 2) % bricks.widthWithMargin < r || (bx + r * 2) % bricks.widthWithMargin > (r * 2))) {
                    dx *= -1;
                }
                $("#scoreNode").html(++score);

                //YOU WIN
                if (score == bricks.NUM_BRICKS) {
                    addGameOver();
                    clearInterval(cycle);
                };
            }
        }
    }, 1000 / 60);

    $(document).bind("mousemove touchmove", function(e) {
        handleMove(e);
    })

    function handleMove(e) {
        var x = (e.type == "mousemove") ? e.pageX : e.originalEvent.touches[0].pageX;
        var left_bound = xmin + $("#paddle").width() / 2;
        var right_bound = xmax - $("#paddle").width() / 2;
        px = (x > left_bound) ? ((x < right_bound) ? x - left_bound : xmax - xmin - $("#paddle").width()) : 0;
        $("#paddle").css({ left: px });
    }


});
