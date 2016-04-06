/* shared code for the whole system
 */

$(function() {

    $('body').on('touchmove', function(e) {
        e.preventDefault();
    });
    var page = $(document).find("title").text();

    if (page === "natie plays") { // style main routing page
        $(".selector").height($(".selector").width());
        var remainingHeight = $(".selector").height() - $(".bottom.bar").height() * 2 - $(".navLink").height();
        $(".gameicon").height(remainingHeight * 0.9);
        var gridtop = $(".ui.centered.grid").offset().top;
        var percent = gridtop / 2 / $(window).height() * 100;
        $(".centeredheader").css({ top: percent + "%" });
    }

    var PAGE_HEADLINE = "PLAY THE 80s. YOU DESERVE A BREAK."

    var logoHTML = '<div class="ui large secondary menu"> <a class="ui image item" href="http://natie.com"><img src="https://raw.githubusercontent.com/natieLabs/natie-plays/gh-pages/logo.png" class="logo"></img> </a> <div class="right menu"> <div class="ui item"> <h5>' + PAGE_HEADLINE + '</h5></div> </div> </div>'
    $("body").prepend(logoHTML);

    if (page != "natie plays") { // dont add bottom navs to home page
        createNavButtons();
    }

    function createNavButtons() {
        var navHTML = '<div class="ui nav stackable centered equal width grid container"><div class="nav two wide column home"> <a href="../"> <div class="router home"> <h2> BACK </h2> <div class="bottom bar"></div> </div> </a> </div>';
        var divClose = '</div>';
        var pages = ["pong", "snake", "arkanoid"];

        for (var i = 0; i < pages.length; i++) {

            if (pages[i] == page) {
                continue;
            }
            navHTML += '<div class="nav two wide column ' + pages[i] + '"> <a href="../' + pages[i] + '"> <div class="router ' + pages[i] + '"> <h2>' + pages[i] + '</h2> <div class="bottom bar"></div> </div> </a> </div>';
        }
        navHTML += divClose;
        $("body").append(navHTML);
    }

});

function addGameOver() {
  console.log("adding");
    var gameOverHTML = "<div class='gameover'></div>"
    $("#container").prepend(gameOverHTML);

}
