$(document).ready(function(){
    //making the sliding action faster
  $('#mycarousel').carousel({interval: 2000});
  $("#mycarousel").carousel('cycle');
    //activating the pause button
    //when the user clicks the pause button activate this action
  $('#carouselButton').click(function(){
      //this indicates that if there is span class in the children and that span child has a class fa-pause
        if($('#carouselButton').children('span').hasClass('fa-pause')){
          $('#mycarousel').carousel('pause');
          //then remove the pause class and add the fa-play class to it
          $('#carouselButton').children('span').removeClass('fa-pause')
          $('#carouselButton').children('span').addClass('fa-play')
        }
        else if($('#carouselButton').children('span').hasClass('fa-play')){
          $('#mycarousel').carousel('cycle');
          $('#carouselButton').children('span').removeClass('fa-play')
          $('#carouselButton').children('span').addClass('fa-pause')
        }
    });
  })

$('#reserveButton').click(function(){
  $('#reserveModal').modal('show');
})

$('#loginButton').click(function(){
  $('#loginModal').modal('show');
})