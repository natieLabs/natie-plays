/* shared code for the whole system
*/

$(function() {
    $(".selector").height($(".selector").width());
    var remainingHeight = $(".selector").height() - $(".bottom.bar").height() * 2 - $(".navLink").height();
    $(".gameicon").height(remainingHeight * 0.9);

    $('body').on('touchmove', function(e) {
        e.preventDefault();
    });
    var logoHTML = '<div class="ui large secondary menu"> <a class="ui image item" href="http://natie.com"><img src="../logo.png" class="logo"></img> </a> <div class="right menu"> <div class="ui item"> <h5>NATIE/LABS/PAINT</h5></div> </div> </div>'
    $("body").prepend(logoHTML);
  });
