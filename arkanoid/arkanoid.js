$(function() {

    var container = $("#container");
    var xmin = container.offset().left;
    var xmax = container.offset().left + container.width();
    var side = container.width();
    var top = container.offset().top;

    $(".buttons").offset({ left: xmax + 10, top: top });

    var lifes = 3;
    var score = 0;

    $("#lifesNode").html(lifes);

    var ball = {
        r: 5,
        bx: 100,
        by: 100,
        dx: -4,
        dy: -4,
        self: $("#ball"),
        row: null,
        col: null,

        init: function() {
            this.self.width(2 * this.r);
            this.self.height(2 * this.r);
            this.row = (ball.by / bricks.outerHeight) | 0;
            this.col = (ball.bx / bricks.widthWithMargin) | 0;
        },

        getRow: function() {
            return (ball.by / bricks.outerHeight) | 0;
        },

        getCol: function() {
            return (ball.bx / bricks.widthWithMargin) | 0;
        },

        update: function() {
            this.bx = (this.bx + this.dx) | 0;
            this.by = (this.by + this.dy) | 0;
            this.row = (ball.by / bricks.outerHeight) | 0;
            this.col = (ball.bx / bricks.widthWithMargin) | 0;


            this.self.css({ left: this.bx, top: this.by });
            // this.put(this.bx, this.by);
            if (this.bx < 0 && this.dx < 0 || this.bx >= side - this.r && this.dx > 0) {
                this.flipx();
            }
            // hits paddle
            if (this.bx >= paddle.px && this.bx <= paddle.px + paddle.width && this.by + 2 * this.r >= paddle.top && this.by < paddle.bottom) {
                this.flipy();
                if (this.bx <= paddle.px + paddle.width / 4) { // hits left half, move left
                    this.dx = -6;
                } else if (this.bx >= paddle.px + paddle.width / 4 * 3) { // hits right half, move right
                    this.dx = 6;
                } else if (Math.abs(this.dx) === 6) { // hits middle, slowdown
                    this.dx = (this.dx * 2 / 3) | 0;
                }
            }

            // hits top
            if (this.by <= 0) { this.dy *= -1; }

            // check game ends
            if (this.by >= side - this.r * 2 && !--lifes) {
                $("#lifesNode").html(lifes);
                addGameOver();
                clearInterval(cycle);
            };

            // hits bottom
            if (this.by + this.r * 2 >= side && lifes) {
                this.dy *= -1;
                $("#lifesNode").html(lifes);
            }
        },

        flipx: function() {
            this.dx *= -1;
        },

        flipy: function() {
            this.dy *= -1;
        }
    }

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
            this.widthWithMargin = side / this.BRICKS_PER_ROW;
            this.width = this.widthWithMargin - this.BRICK_MARGIN * 2;
            $(".brick").width(this.width);
            this.baseline = this.array.last().position().top + this.array.last().height();
            this.outerHeight = this.height + this.BRICK_MARGIN * 2;
        },

        get: function(r, c) {
            var index = r * this.BRICKS_PER_ROW + c;
            return $("#brick" + index);
        },

        isRemoved: function(r, c) {
            return this.get(r, c).hasClass("removed");
        },

        remove: function(r, c) {
            this.get(r, c).addClass("removed");
        },

        update: function(ball) {
            if (ball.by >= 0 && ball.by < bricks.baseline) {

                if (!bricks.isRemoved(ball.row, ball.col)) {
                    ball.dy *= -1;
                    bricks.remove(ball.row, ball.col);

                    // bounces on left and right sides of bricks, flip x direction
                    if (ball.dx < 0 && (ball.bx % bricks.widthWithMargin < ball.r || ball.bx % bricks.widthWithMargin > (ball.r * 2 + 2))) {
                        // console.log("hi");
                        ball.dx *= -1;
                    }
                    if (ball.dx > 0 && ((ball.bx + ball.r * 2) % bricks.widthWithMargin < ball.r || (ball.bx + ball.r * 2) % bricks.widthWithMargin > (ball.r * 2))) {
                        // console.log("hi");
                        ball.dx *= -1;
                    }
                    $("#scoreNode").html(++score);

                    //YOU WIN
                    if (score == bricks.NUM_BRICKS) {
                        addGameOver();
                        clearInterval(cycle);
                    };
                }
            }
        }
    }

    var paddle = {
        px: 129,
        width: null,
        self: $("#paddle"),
        top: null,
        bottom: null,
        height: 8,

        init: function() {
            this.top = this.self.position().top;
            this.bottom = this.top + this.height;
            this.width = side / 5;
            this.self.css({ left: this.px, width: this.width });
        },

        update: function(e) {
            var x = (e.type == "mousemove") ? e.pageX : e.originalEvent.touches[0].pageX;
            var left_bound = xmin + this.width / 2;
            var right_bound = xmax - this.width / 2;
            this.px = (x > left_bound) ? ((x < right_bound) ? x - left_bound : xmax - xmin - this.width) : 0;
            this.self.css({ left: this.px });
        }
    }

    bricks.init(container);
    ball.init();
    paddle.init();

    var cycle = setInterval(function() {
        ball.update();
        bricks.update(ball);

    }, 1000 / 60);

    $(document).bind("mousemove touchmove", function(e) {
        paddle.update(e);
    })

});
