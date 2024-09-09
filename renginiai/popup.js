$(document).ready(function() {
    $('.popup-button').click(function(e) {
      $('.wrapper').fadeIn(500);
      $('.popup-box').removeClass('transform-out').addClass('transform-in');
  
      e.preventDefault();
    });
  
    $('.popup-close').click(function(e) {
      $('.wrapper').fadeOut(500);
      $('.popup-box').removeClass('transform-in').addClass('transform-out');
  
      e.preventDefault();
    });
  });