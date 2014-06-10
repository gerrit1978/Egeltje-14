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
  // Simple Ajax fragment
  Drupal.behaviors.authcacheP13nAjaxFragments = {
    attach: function (context, settings) {
      $('span.authcache-ajax-frag', context).once('authcache-ajax-frag', function() {
        var $target = $(this);
        $.ajax({
          url: $target.data('authcache-ajax-src'),
          data: {v: $.cookie('aucp13n')},
          // Custom header to help prevent cross-site forgery requests
          // and to flag caching bootstrap that Ajax request is being made
          beforeSend: function(xhr) {
            xhr.setRequestHeader('X-Authcache','1');
          },
          success: function(data, status, xhr) {
            $target.authcacheP13nReplaceWith(data);
          }
        });
      });
    }
  };

  // Ajax settings
  Drupal.behaviors.authcacheP13nAjaxSettings = {
    attach: function (context, settings) {
      if (settings.authcacheP13nAjaxSettings) {
        $.each(settings.authcacheP13nAjaxSettings, function() {
          var url = this;

          $.ajax({
            url: url,
            data: {v: $.cookie('aucp13n')},
            dataType: 'json',
            // Custom header to help prevent cross-site forgery requests
            // and to flag caching bootstrap that Ajax request is being made
            beforeSend: function(xhr) {
              xhr.setRequestHeader('X-Authcache','1');
            },
            success: function(data, status, xhr) {
              $.authcacheP13nMergeSetting(data);
            }
          });
        });

        // Remove the urls we processed
        settings.authcacheP13nAjaxSettings = [];
      }
    }
  };

  // Ajax fragment assembly
  Drupal.behaviors.authcacheP13nAjaxAssemblies = {
    attach: function (context, settings) {
      if (settings.authcacheP13nAjaxAssemblies) {
        $.each(settings.authcacheP13nAjaxAssemblies, function(selector) {
          var targets = $(selector, context);
          var url = this;

          if (targets.length) {
            $.ajax({
              url: url,
              data: {v: $.cookie('aucp13n')},
              dataType: 'json',
              // Custom header to help prevent cross-site forgery requests
              // and to flag caching bootstrap that Ajax request is being made
              beforeSend: function(xhr) {
                xhr.setRequestHeader('X-Authcache','1');
              },
              success: function(data, status, xhr) {
                var response = {};
                response[selector] = data;

                $(context).authcacheP13nEachElementInSettings(response, function(markup) {
                  $(this).authcacheP13nReplaceWith(markup);
                });
              }
            });
          }
        });
      }
    }
  };
}(jQuery));
;
(function ($) {
  /**
   * Replace context nodes with given markup and call Drupal.detachBehaviors
   * and Drupal.attachBehaviors for old and new content respectively.
   */
  $.fn.authcacheP13nReplaceWith = function(markup) {
    return this.each(function() {
      if ($.type(markup) == 'array') {
        markup = Drupal.theme.apply({}, markup);
      }

      // The function jQuery.parseHTML is not yet present in v1.4.4. Also
      // parsing markup by feeding it directly into the jQuery function (e.g.
      // $(markup)) is impossible here, because if the input does not contain
      // any tags, jQuery will interpret it as selector. In order to work
      // around this problem, a dummy-element is created and then replaced
      // using the .html() function.
      var elem = $('<span>dummy</span>').html(markup).contents();

      $.each($(this).get(), function() {
        Drupal.detachBehaviors(this);
      });

      var old = $(this).replaceWith(elem);

      $.each(elem.get(), function() {
        Drupal.attachBehaviors(this);
      });
    });
  };

  /**
   * Merge new data into Drupal.settings and trigger the attach-behavior.
   */
  $.authcacheP13nMergeSetting = function(data) {
    $.extend(Drupal.settings, data);
    Drupal.attachBehaviors();
  };

  /**
   * Loop through settings structure and find referenced placeholder elements.
   * Invoke the callback with the context set to each element found.
   */
  $.fn.authcacheP13nEachElementInSettings = function(settings, callback) {
    // Fix integer keys introduced by array merge deep.
    $.each(settings || {}, function(selector) {
      $.each(this, function(fragment) {
        var group = this;
        if ($.type(group) == 'array') {
          newgroup = {};
          $.each(this, function(wrongkey) {
            var realkey = group[wrongkey]['param'];
            newgroup[realkey] = group[wrongkey];
          });
          settings[selector][fragment] = newgroup;
        }
      });
    });

    return this.each(function() {
      var context = this;
      $.each(settings || {}, function(selector) {
        var fragsettings = this;

        $(selector, context).each(function() {
          var frag = $(this).data('p13n-frag');
          var param = $(this).data('p13n-param');

          if (fragsettings[frag] && fragsettings[frag][param]) {
            callback.call(this, fragsettings[frag][param], param, frag, selector, settings);
          }
        });
      });
    });
  };

  Drupal.behaviors.authcacheP13nFragments = {
    attach: function (context, settings) {
      $(context).authcacheP13nEachElementInSettings(settings.authcacheP13nFragments, function(markup) {
        $(this).authcacheP13nReplaceWith(markup);
      });
    }
  };
}(jQuery));
;