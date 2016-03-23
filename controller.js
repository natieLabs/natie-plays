$(function() {
    setUpPong();
    var CURRENT_GAME = 0;

    $("#switch").on("click", switchGame);
    var svg = d3.select('svg');
    svg.append("rect")
        .attr("class", "border")
        .attr("width", "100%")
        .attr("height", "100%")
        .style("stroke", "gray")
        .style("fill", "transparent")
        .style("border", "4px");

    function switchGame() {
        clearInterval(interval_id);
        $("body").unbind("keydown");
        CURRENT_GAME = 1 - CURRENT_GAME;
        d3.selectAll("svg > *").remove();

        svg.append("rect")
            .attr("class", "border")
            .attr("width", "100%")
            .attr("height", "100%")
            .style("stroke", "gray")
            .style("fill", "transparent")
            .style("border", "4px");

        if (CURRENT_GAME == 0) {
            setUpPong();
        } else {
            setUpSnake();
        }
    }
});
