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

Drupal.behaviors.facetapi = {
  attach: function(context, settings) {
    // Iterates over facet settings, applies functionality like the "Show more"
    // links for block realm facets.
    // @todo We need some sort of JS API so we don't have to make decisions
    // based on the realm.
    if (settings.facetapi) {
      for (var index in settings.facetapi.facets) {
        if (null != settings.facetapi.facets[index].makeCheckboxes) {
          // Find all checkbox facet links and give them a checkbox.
          $('#' + settings.facetapi.facets[index].id + ' a.facetapi-checkbox', context).each(Drupal.facetapi.makeCheckbox);
        }
        if (null != settings.facetapi.facets[index].limit) {
          // Applies soft limit to the list.
          Drupal.facetapi.applyLimit(settings.facetapi.facets[index]);
        }
      }
    }
  }
}

/**
 * Class containing functionality for Facet API.
 */
Drupal.facetapi = {}

/**
 * Applies the soft limit to facets in the block realm.
 */
Drupal.facetapi.applyLimit = function(settings) {
  if (settings.limit > 0 && !$('ul#' + settings.id).hasClass('facetapi-processed')) {
    // Only process this code once per page load.
    $('ul#' + settings.id).addClass('facetapi-processed');

    // Ensures our limit is zero-based, hides facets over the limit.
    var limit = settings.limit - 1;
    $('ul#' + settings.id).find('li:gt(' + limit + ')').hide();

    // Adds "Show more" / "Show fewer" links as appropriate.
    $('ul#' + settings.id).filter(function() {
      return $(this).find('li').length > settings.limit;
    }).each(function() {
      $('<a href="#" class="facetapi-limit-link"></a>').text(Drupal.t('Show more')).click(function() {
        if ($(this).prev().find('li:hidden').length > 0) {
          $(this).prev().find('li:gt(' + limit + ')').slideDown();
          $(this).addClass('open').text(Drupal.t('Show fewer'));
        }
        else {
          $(this).prev().find('li:gt(' + limit + ')').slideUp();
          $(this).removeClass('open').text(Drupal.t('Show more'));
        }
        return false;
      }).insertAfter($(this));
    });
  }
}

/**
 * Constructor for the facetapi redirect class.
 */
Drupal.facetapi.Redirect = function(href) {
  this.href = href;
}

/**
 * Method to redirect to the stored href.
 */
Drupal.facetapi.Redirect.prototype.gotoHref = function() {
  window.location.href = this.href;
}

/**
 * Replace an unclick link with a checked checkbox.
 */
Drupal.facetapi.makeCheckbox = function() {
  var $link = $(this);
  if (!$link.hasClass('facetapi-checkbox-processed')) {
    var active;
    if ($link.hasClass('facetapi-inactive')) {
      active = false;
    }
    else if ($link.hasClass('facetapi-active')) {
      active = true;
    }
    else {
      // Not a facet link.
      return;
    }
    // Derive an ID and label for the checkbox based on the associated link.
    // The label is required for accessibility, but it duplicates information
    // in the link itself, so it should only be shown to screen reader users.
    var id = this.id + '--checkbox';
    var description = $link.find('.element-invisible').html();
    var label = $('<label class="element-invisible" for="' + id + '">' + description + '</label>');
    var checkbox = active ? $('<input type="checkbox" class="facetapi-checkbox" id="' + id + '" checked="true" />') : $('<input type="checkbox" class="facetapi-checkbox" id="' + id + '" />');
    // Get the href of the link that is this DOM object.
    var href = $link.attr('href');
    redirect = new Drupal.facetapi.Redirect(href);
    checkbox.click($.proxy(redirect, 'gotoHref'));
    if (active) {
      // Add the checkbox and label, hide the link.
      $link.before(label).before(checkbox).hide();
    }
    else {
      $link.before(label).before(checkbox);
    }
    $link.removeClass('facetapi-checkbox').addClass('facetapi-checkbox-processed');
  }
}

})(jQuery);
;
(function($) {
  Drupal.behaviors.chosen = {
    attach: function(context, settings) {
      settings.chosen = settings.chosen || Drupal.settings.chosen;

      // Prepare selector and add unwantend selectors.
      var selector = settings.chosen.selector;

      // Function to prepare all the options together for the chosen() call.
      var getElementOptions = function (element) {
        var options = $.extend({}, settings.chosen.options);

        // The width default option is considered the minimum width, so this
        // must be evaluated for every option.
        if ($(element).width() < settings.chosen.minimum_width) {
          options.width = settings.chosen.minimum_width + 'px';
        }
        else {
          options.width = $(element).width() + 'px';
        }

        // Some field widgets have cardinality, so we must respect that.
        // @see chosen_pre_render_select()
        if ($(element).attr('multiple') && $(element).data('cardinality')) {
          options.max_selected_options = $(element).data('cardinality');
        }

        return options;
      };

      // Process elements that have opted-in for Chosen.
      // @todo Remove support for the deprecated chosen-widget class.
      $('select.chosen-enable, select.chosen-widget', context).once('chosen', function() {
        options = getElementOptions(this);
        $(this).chosen(options);
      });

      $(selector, context)
        // Disabled on:
        // - Field UI
        // - WYSIWYG elements
        // - Tabledrag weights
        // - Elements that have opted-out of Chosen
        // - Elements already processed by Chosen
        .not('#field-ui-field-overview-form select, #field-ui-display-overview-form select, .wysiwyg, .draggable select[name$="[weight]"], .draggable select[name$="[position]"], .chosen-disable, .chosen-processed')
        .filter(function() {
          // Filter out select widgets that do not meet the minimum number of
          // options.
          var minOptions = $(this).attr('multiple') ? settings.chosen.minimum_multiple : settings.chosen.minimum_single;
          if (!minOptions) {
            // Zero value means no minimum.
            return true;
          }
          else {
            return $(this).find('option').length >= minOptions;
          }
        })
        .once('chosen', function() {
          options = getElementOptions(this);
          $(this).chosen(options);
        });
    }
  };
})(jQuery);
;
