$(function() {
    setUpPong();
    var CURRENT_GAME = 0;

    $("#switch").on("click", switchGame);

    function switchGame() {
    	clearInterval(interval_id);
    	$("body").unbind("keydown");
        CURRENT_GAME = 1 - CURRENT_GAME;
        d3.selectAll("svg > *").remove();
        if (CURRENT_GAME == 0) {
            setUpPong();
        } else {
            setUpSnake();
        }
    }
});
