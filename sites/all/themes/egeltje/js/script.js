/**
 * @file
 * A JavaScript file for the theme.
 *
 * In order for this JavaScript to be loaded on pages, see the instructions in
 * the README.txt next to this file.
 */

// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - https://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
(function ($, Drupal, window, document, undefined) {


// To understand behaviors, see https://drupal.org/node/756722#behaviors
Drupal.behaviors.carrousel = {
  attach: function(context, settings) {
    $('.view-carrousel').flexslider({
      controlNav: false
    });
  }
}

Drupal.behaviors.smartphonemenu = {
  attach: function(context, settings) {
    $('a#smartphone-link', context).click(function(e) {
      var height = $('#block-menu-secondary-navigation ul.menu').height();
      if (height < 40) {
        $('#block-menu-secondary-navigation ul.menu').css('height', 'auto');
      } else {
        $('#block-menu-secondary-navigation ul.menu').css('height', '38px');      
      }
      e.preventDefault();
      return false;
    });
  }
}



})(jQuery, Drupal, this, this.document);
