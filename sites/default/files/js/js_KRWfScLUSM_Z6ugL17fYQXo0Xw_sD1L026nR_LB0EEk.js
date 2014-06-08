(function ($) {
  function displayContainerIfNotEmpty(container) {
    if (!/\S/.test(container.text())) {
      container.hide();
    }
    else {
      container.show();
    }
  }

  var tabs_container, actions_container;
  Drupal.behaviors.authcacheMenuFragments = {
    attach: function (context, settings) {
      if (tabs_container === undefined) {
        tabs_container = $('.tabs');
      }
      displayContainerIfNotEmpty(tabs_container);

      if (actions_container === undefined) {
        actions_container = $('.action-links');
      }
      displayContainerIfNotEmpty(actions_container);
    }
  };
}(jQuery));
;
(function ($) {

/**
 * A progressbar object. Initialized with the given id. Must be inserted into
 * the DOM afterwards through progressBar.element.
 *
 * method is the function which will perform the HTTP request to get the
 * progress bar state. Either "GET" or "POST".
 *
 * e.g. pb = new progressBar('myProgressBar');
 *      some_element.appendChild(pb.element);
 */
Drupal.progressBar = function (id, updateCallback, method, errorCallback) {
  var pb = this;
  this.id = id;
  this.method = method || 'GET';
  this.updateCallback = updateCallback;
  this.errorCallback = errorCallback;

  // The WAI-ARIA setting aria-live="polite" will announce changes after users
  // have completed their current activity and not interrupt the screen reader.
  this.element = $('<div class="progress" aria-live="polite"></div>').attr('id', id);
  this.element.html('<div class="bar"><div class="filled"></div></div>' +
                    '<div class="percentage"></div>' +
                    '<div class="message">&nbsp;</div>');
};

/**
 * Set the percentage and status message for the progressbar.
 */
Drupal.progressBar.prototype.setProgress = function (percentage, message) {
  if (percentage >= 0 && percentage <= 100) {
    $('div.filled', this.element).css('width', percentage + '%');
    $('div.percentage', this.element).html(percentage + '%');
  }
  $('div.message', this.element).html(message);
  if (this.updateCallback) {
    this.updateCallback(percentage, message, this);
  }
};

/**
 * Start monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.startMonitoring = function (uri, delay) {
  this.delay = delay;
  this.uri = uri;
  this.sendPing();
};

/**
 * Stop monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.stopMonitoring = function () {
  clearTimeout(this.timer);
  // This allows monitoring to be stopped from within the callback.
  this.uri = null;
};

/**
 * Request progress data from server.
 */
Drupal.progressBar.prototype.sendPing = function () {
  if (this.timer) {
    clearTimeout(this.timer);
  }
  if (this.uri) {
    var pb = this;
    // When doing a post request, you need non-null data. Otherwise a
    // HTTP 411 or HTTP 406 (with Apache mod_security) error may result.
    $.ajax({
      type: this.method,
      url: this.uri,
      data: '',
      dataType: 'json',
      success: function (progress) {
        // Display errors.
        if (progress.status == 0) {
          pb.displayError(progress.data);
          return;
        }
        // Update display.
        pb.setProgress(progress.percentage, progress.message);
        // Schedule next timer.
        pb.timer = setTimeout(function () { pb.sendPing(); }, pb.delay);
      },
      error: function (xmlhttp) {
        pb.displayError(Drupal.ajaxError(xmlhttp, pb.uri));
      }
    });
  }
};

/**
 * Display errors on the page.
 */
Drupal.progressBar.prototype.displayError = function (string) {
  var error = $('<div class="messages error"></div>').html(string);
  $(this.element).before(error).hide();

  if (this.errorCallback) {
    this.errorCallback(this);
  }
};

})(jQuery);
;
(function ($) {

  // Add a spinner on quantity widget.
  Drupal.behaviors.quantityWidgetSpinner = {
    attach: function ( context, settings ) {
      $('.form-item-quantity input').spinner({
        min: 1,
        max: 9999,
        increment: 'fast'
      });
    }
  }

  // Add 'read more' link on description.
  Drupal.behaviors.bodyReadMore = {
    attach: function ( context, settings ) {
      var readmore = Drupal.t('read more');
      var readless = Drupal.t('read less');
      $('.node-product-type .field-name-body .field-item').expander({
        slicePoint: 200,
        expandPrefix: '...<br />',
        expandText: readmore,
        userCollapseText: readless,
        expandEffect: 'fadeIn',
        expandSpeed: 250,
        collapseEffect: 'fadeOut',
        collapseSpeed: 200
      });
    }
  }
  // Handle cloud zoom on small devices.
  Drupal.behaviors.cloud_zoom = {
    attach: function(context, settings) {
      $('body').bind('responsivelayout', function(e, d) {
        if($(this).hasClass("responsive-layout-mobile")) {
          $('.cloud-zoom-big, .cloud-zoom-lens').hide();
          $('.cloud-zoom-big, .mousetrap, .cloud-zoom-lens').css('display','none');
        }
        else {
          if ($('.cloud-zoom').length) {
            $('.cloud-zoom, .cloud-zoom-gallery').CloudZoom();
            $('body').unbind('responsivelayout');
          }
        }
      });
    }
  }
})(jQuery);
;
