/* controller for the whole system
currently switches between the two games onclick
*/

$(function() {
  $(".selector").height($(".selector").width());
  var remainingHeight = $(".selector").height()-$(".bottom.bar").height()*2-$(".navLink").height();
  $(".gameicon").height(remainingHeight*0.9);
});
