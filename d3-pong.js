"use strict";

var run;

function setUpPong() {

    var svg = d3.select("svg");
    var w = window.innerWidth;
    var h = window.innerHeight;
    var vmin = Math.min(w, h);

    var parse = function(N) {
        return Number(N.replace("px", ""));
    };

    var margin = {
        top: parse($("svg").css("marginTop")),
        right: parse($("svg").css("marginRight")),
        bottom: parse($("svg").css("marginBottom")),
        left: parse($("svg").css("marginLeft")),
    };

    var currentKeysPressed = [];

    // Add support for movement by keys
    // When a key is pressed, add it to the current keys array for further tracking
    d3.select("body").on("keydown", function() {
        if (currentKeysPressed.indexOf(d3.event.keyCode) != -1) {
            return
        }
        currentKeysPressed.push(d3.event.keyCode);
    });

    // When the key is relased, remove it from the array.
    d3.select("body").on("keyup", function() {
        currentKeysPressed.splice(currentKeysPressed.indexOf(d3.event.keyCode), 1);
    });

    // always returns current SVG dimensions
    var Screen = function() {
        return {
            width: parse(svg.style("width")),
            height: parse(svg.style("height"))
        };
    };
    // generates a paddle, returns function for updating its position
    var Paddle = function(which) {
        var width = 5;

        var area;

        if (which == "left") {
            area = svg.append('rect')
                .style("fill", "transparent")
                .classed('area', true)
                .attr({ width: $("svg").width() / 2 });
        }

        var paddle = svg.append('rect')
            .classed('paddle', true)
            .classed(which + "_paddle", true)
            .attr({ width: 5 });

        function update(x, y) {
            var x = ((which == "left") ? x : margin.left + $("svg").width() - width);
            var height = $("svg").height() * 0.25;
            paddle.attr({
                x: x,
                y: y,
                height: height
            });
            // var x = ((which == "left") ? x : x - $("svg").width() / 2);
            if (which == "left") {
                area.attr({
                    x: x,
                    y: y,
                    height: height
                });
            }

            return update;
        };

        // make paddle draggable
        var drag = d3.behavior.drag()
            .on("drag", function() {
                var y = parse(area.attr("y")),
                    height = $("svg").height() * 0.25;

                update(parse(paddle.attr("x")),
                    Math.max(margin.top,
                        Math.min(parse(paddle.attr("y")) + d3.event.dy,
                            $("svg").height() - margin.bottom - height)));


            })
            .origin(function() {
                return {
                    x: parse(area.attr("x")),
                    y: parse(area.attr("y"))
                };
            });

        if (which == "left") { area.call(drag) };

        return update;
    };
    // generates a score, returns function for updating value and repositioning score
    function Score(x) {
        var value = 0,
            score = svg.append('text')
            .text(value);

        return function f(inc) {
            value += inc;

            score.text(value)
                .attr({
                    x: $("svg").width() * x,
                    y: margin.top + 20
                });
            return f;
        };
    };
    // generates middle line, returns function for updating position
    function Middle() {
        var line = svg.append('line');

        return function f() {
            var screen = Screen();
            line.attr({
                x1: screen.width / 2,
                y1: margin.top,
                x2: screen.width / 2,
                y2: screen.height - margin.bottom
            });
            return f;
        };
    };
    // generates the ball, returns function to perform animation steps
    function Ball() {
        var R = 8,
            ball = svg.append('circle')
            .classed("ball", true)
            .attr({
                r: R,
                cx: Screen().width / 2,
                cy: Screen().height / 2
            }),
            scalex = d3.scale.linear().domain([0, 1]).range([-0.5, 0.5]),
            scaley = d3.scale.linear().domain([0, 1]).range([-0.25, 0.25]),
            vector = {
                x: scalex(Math.random()),
                y: scaley(Math.random())
            },
            speed = 10;

        var hit_paddle = function(y, paddle) {
            return y - R > parse(paddle.attr("y")) && y + R < parse(paddle.attr("y")) + parse(paddle.attr("height"));
        };
        var collisions = function() {
            var x = parse(ball.attr("cx")),
                y = parse(ball.attr("cy")),
                left_p = d3.select(".left_paddle"),
                right_p = d3.select(".right_paddle");

            // collision with top or bottom
            if (y - R < margin.top || y + R > Screen().height - margin.bottom) {
                vector.y = -vector.y;
            }

            // bounce off right paddle or score
            if (x + R > parse(right_p.attr("x"))) {
                if (hit_paddle(y, right_p)) {
                    vector.x = -vector.x;
                } else {
                    return "left";
                }
            }

            // bounce off left paddle or score
            if (x - R <
                parse(left_p.attr("x")) + parse(left_p.attr("width"))) {
                if (hit_paddle(y, left_p)) {
                    vector.x = -vector.x;
                } else {
                    return "right";
                }
            }

            return false;
        };

        return function f(left, right, delta_t) {
            var screen = Screen(),
                // this should pretend we have 100 fps
                fps = delta_t > 0 ? (delta_t / 1000) / 100 : 1;

            ball.attr({
                cx: parse(ball.attr("cx")) + vector.x * speed * fps,
                cy: parse(ball.attr("cy")) + vector.y * speed * fps
            });

            paddleAI(ball);

            var scored = collisions();

            if (scored) {
                if (scored == "left") {
                    left.score(1);
                } else {
                    right.score(1);
                }
                return true;
            }
            return false;
        };
    };


    // generate starting scene
    var left = {
        score: Score(0.25)(0),
        paddle: Paddle("left")(margin.left, $("svg").height() / 2)
    };
    var right = {
        score: Score(0.75)(0),
        paddle: Paddle("right")($("svg").width() - margin.right - 5, $("svg").height() / 2)
    };
    var middle = Middle()();
    var ball = Ball();

    // detect window resize events (also captures orientation changes)
    d3.select(window).on('resize', function() {
        var screen = Screen();

        left.score(0);
        left.paddle(margin.left, $("svg").height() / 2);
        right.score(0);
        right.paddle($("svg").width() - margin.right, $("svg").height() / 2);

        middle();
    });

    // Check if the paddle needs to be moved depending on current key presses
    function movePaddle() {
        for (var i = 0; i < currentKeysPressed.length; i++) {
            var currentKeyPressed = currentKeysPressed[i];

            /*  Key Codes:
             *   87 = W
             *   83 = A
             *   38 = Up Arrow
             *   40 = Down Arrow
             */
            if (currentKeyPressed && [38, 40, 83, 87].indexOf(currentKeyPressed) != -1) {
                // var leftPaddle = [83, 87].indexOf(currentKeyPressed) != -1;
                var directionUp = [38, 87].indexOf(currentKeyPressed) != -1;
                var paddle = d3.select(".left_paddle");
                var paddleDy = 5 * (directionUp ? -1 : 1);
                var newPaddleY = Math.max(margin.top,
                    Math.min(parse(paddle.attr("y")) + paddleDy,
                        Screen().height - margin.bottom - Screen().height * 0.1));
                var paddleInstance = left;
                paddleInstance.paddle(parse(paddle.attr('x')), newPaddleY);
            }
        }
    }

    // move right paddle with dumb AI
    function paddleAI(ball) {
        var y_pos = ball.attr("cy");
        var paddle = d3.select(".right_paddle");
        var diff = -((parse(paddle.attr("y")) + (paddle.attr("height") / 2)) - y_pos);
        if (diff < 0 && diff < -4) { // max speed down
            diff = -0.75;
        } else if (diff > 0 && diff > 4) { // max speed up
            diff = 0.75;
        }
        var currentx = parse(paddle.attr("x"));
        var currenty = parse(paddle.attr("y"));
        // paddle.update(currentx, currenty + diff);

        paddle.attr({
            y: currenty + diff
        });
        // if (y + diff < 0) {
        //     paddle.x = 0;
        // } else if (this.paddle.x + this.paddle.width > 400) {
        //     this.paddle.x = 400 - this.paddle.width;
        // }
    }

    // start animation timer that runs until a player scores
    // then reset ball and start again
    run = function() {
        var last_time = Date.now();
        d3.timer(function() {
            var now = Date.now(),
                scored = ball(left, right, now - last_time),
                last_time = now;

            movePaddle();


            if (scored) {
                d3.select(".ball").remove();
                ball = Ball();
                run();
            }
            return scored;
        }, 500);
    };

    run();

}
// $("body").addEventListener('touchstart', function(e) { e.preventDefault(); });
