/* shared code for the whole system
 */

$(function() {
    $(".selector").height($(".selector").width());
    var remainingHeight = $(".selector").height() - $(".bottom.bar").height() * 2 - $(".navLink").height();
    $(".gameicon").height(remainingHeight * 0.9);

    $('body').on('touchmove', function(e) {
        e.preventDefault();
    });
    var logoHTML = '<div class="ui large secondary menu"> <a class="ui image item" href="http://natie.com"><img src="https://raw.githubusercontent.com/natieLabs/natie-plays/gh-pages/logo.png" class="logo"></img> </a> <div class="right menu"> <div class="ui item"> <h5>NATIE/LABS/PLAY</h5></div> </div> </div>'
    $("body").prepend(logoHTML);

    var navHTML = '<div class="ui nav stackable centered equal width grid container"><div class="nav two wide column home"> <a href="/index.html"> <div class="router home"> <h2> BACK </h2> <div class="bottom bar"></div> </div> </a> </div>';
    var divClose = '</div>';
    var page = $(document).find("title").text();
    var pages = ["pong", "snake", "arkanoid"];

    if (page != "natie plays") { // dont add bottom navs to home page
        console.log(page);
        for (var i = 0; i < pages.length; i++) {

            if (pages[i] == page) {
                continue;
            }
            navHTML += '<div class="nav two wide column ' + pages[i] + '"> <a href="/' + pages[i] + '"> <div class="router ' + pages[i] + '"> <h2>' + pages[i] + '</h2> <div class="bottom bar"></div> </div> </a> </div>';
            console.log($(".ui.uav"));
            // $(".ui.uav").append(navButtonHTML);
        }
        navHTML += divClose;
        $("body").append(navHTML);
    }

});
