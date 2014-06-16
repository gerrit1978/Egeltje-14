/**
 * Attaches the calendar behavior to all required fields
 */
(function ($) {
Drupal.behaviors.date_popup = {
  attach: function (context) {
  for (var id in Drupal.settings.datePopup) {
    $('#'+ id).bind('focus', Drupal.settings.datePopup[id], function(e) {
      if (!$(this).hasClass('date-popup-init')) {
        var datePopup = e.data;
        // Explicitely filter the methods we accept.
        switch (datePopup.func) {
          case 'datepicker':
            $(this)
              .datepicker(datePopup.settings)
              .addClass('date-popup-init')
            $(this).click(function(){
              $(this).focus();
            });
            break;

          case 'timeEntry':
            $(this)
              .timeEntry(datePopup.settings)
              .addClass('date-popup-init')
            $(this).click(function(){
              $(this).focus();
            });
            break;
          case 'timepicker':
            // Translate the PHP date format into the style the timepicker uses.
            datePopup.settings.timeFormat = datePopup.settings.timeFormat
              // 12-hour, leading zero,
              .replace('h', 'hh')
              // 12-hour, no leading zero.
              .replace('g', 'h')
              // 24-hour, leading zero.
              .replace('H', 'HH')
              // 24-hour, no leading zero.
              .replace('G', 'H')
              // AM/PM.
              .replace('A', 'p')
              // Minutes with leading zero.
              .replace('i', 'mm')
              // Seconds with leading zero.
              .replace('s', 'ss');

            datePopup.settings.startTime = new Date(datePopup.settings.startTime);
            $(this)
              .timepicker(datePopup.settings)
              .addClass('date-popup-init');
            $(this).click(function(){
              $(this).focus();
            });
            break;
        }
      }
    });
  }
  }
};
})(jQuery);
;
(function($){
/**
 * To make a form auto submit, all you have to do is 3 things:
 *
 * ctools_add_js('auto-submit');
 *
 * On gadgets you want to auto-submit when changed, add the ctools-auto-submit
 * class. With FAPI, add:
 * @code
 *  '#attributes' => array('class' => array('ctools-auto-submit')),
 * @endcode
 *
 * If you want to have auto-submit for every form element,
 * add the ctools-auto-submit-full-form to the form. With FAPI, add:
 * @code
 *   '#attributes' => array('class' => array('ctools-auto-submit-full-form')),
 * @endcode
 *
 * If you want to exclude a field from the ctool-auto-submit-full-form auto submission,
 * add the class ctools-auto-submit-exclude to the form element. With FAPI, add:
 * @code
 *   '#attributes' => array('class' => array('ctools-auto-submit-exclude')),
 * @endcode
 *
 * Finally, you have to identify which button you want clicked for autosubmit.
 * The behavior of this button will be honored if it's ajaxy or not:
 * @code
 *  '#attributes' => array('class' => array('ctools-use-ajax', 'ctools-auto-submit-click')),
 * @endcode
 *
 * Currently only 'select', 'radio', 'checkbox' and 'textfield' types are supported. We probably
 * could use additional support for HTML5 input types.
 */

Drupal.behaviors.CToolsAutoSubmit = {
  attach: function(context) {
    // 'this' references the form element
    function triggerSubmit (e) {
      var $this = $(this);
      if (!$this.hasClass('ctools-ajaxing')) {
        $this.find('.ctools-auto-submit-click').click();
      }
    }

    // the change event bubbles so we only need to bind it to the outer form
    $('form.ctools-auto-submit-full-form', context)
      .add('.ctools-auto-submit', context)
      .filter('form, select, input:not(:text, :submit)')
      .once('ctools-auto-submit')
      .change(function (e) {
        // don't trigger on text change for full-form
        if ($(e.target).is(':not(:text, :submit, .ctools-auto-submit-exclude)')) {
          triggerSubmit.call(e.target.form);
        }
      });

    // e.keyCode: key
    var discardKeyCode = [
      16, // shift
      17, // ctrl
      18, // alt
      20, // caps lock
      33, // page up
      34, // page down
      35, // end
      36, // home
      37, // left arrow
      38, // up arrow
      39, // right arrow
      40, // down arrow
       9, // tab
      13, // enter
      27  // esc
    ];
    // Don't wait for change event on textfields
    $('.ctools-auto-submit-full-form input:text, input:text.ctools-auto-submit', context)
      .filter(':not(.ctools-auto-submit-exclude)')
      .once('ctools-auto-submit', function () {
        // each textinput element has his own timeout
        var timeoutID = 0;
        $(this)
          .bind('keydown keyup', function (e) {
            if ($.inArray(e.keyCode, discardKeyCode) === -1) {
              timeoutID && clearTimeout(timeoutID);
            }
          })
          .keyup(function(e) {
            if ($.inArray(e.keyCode, discardKeyCode) === -1) {
              timeoutID = setTimeout($.proxy(triggerSubmit, this.form), 500);
            }
          })
          .bind('change', function (e) {
            if ($.inArray(e.keyCode, discardKeyCode) === -1) {
              timeoutID = setTimeout($.proxy(triggerSubmit, this.form), 500);
            }
          });
      });
  }
}
})(jQuery);
;
/**
 * @file
 *
 * Provides modal-like functionality that opens a "megarow" in a table
 * instead of opening a dialog. Multiple megarows can be open at the same time,
 * each inserted below the triggering (parent) row.
 *
 * Inspired by CTools modal.
 */

(function ($) {
  // Add a help to scroll to the closed item
  // We scroll to a padding above the selected item due to the potential admin bar,
  // shortcuts and potential sticky table headers.
  // The value of the padding is defined in the view style settings.
  $.fn.viewsMegarowGoTo = function (scrollPadding) {
    $('html, body').animate({
      scrollTop: ($(this).offset().top - scrollPadding) + 'px'
    }, 'fast');
    return this;

  }
  Drupal.ViewsMegarow = Drupal.ViewsMegarow || {};

  /**
   * Display the megarow.
   */
  Drupal.ViewsMegarow.open = function(entityId, target) {
    // If there's already a megarow opened for this entity, abort.
    var row_parent_megarow = $(target).parents('tr').next('tr.megarow');
    if (row_parent_megarow != undefined && row_parent_megarow.length > 0) {
      return;
    }

    var defaults = {
      megarowTheme: 'ViewsMegarowDialog',
      throbberTheme: 'ViewsMegarowThrobber',
      animation: 'show',
      animationSpeed: 'fast'
    };
    var settings = {};
    $.extend(true, settings, defaults, Drupal.settings.ViewsMegarow);
    Drupal.ViewsMegarow.currentSettings = settings;

    // Get the megarow HTML, add the "Loading" title and animation.
    var megarowContent = $(Drupal.theme(settings.megarowTheme, entityId));
    $('.megarow-title', megarowContent).html(Drupal.ViewsMegarow.currentSettings.loadingText);
    $('.megarow-content', megarowContent).html(Drupal.theme(settings.throbberTheme));
    megarowContent.hide();

    // Extract the width of the megarow.
    var views_table = target.parents('.views-table');
    var nbcols = 1;
    var arr_classes = views_table.attr('class').split(' ');
    for (var i = 0 ; i < arr_classes.length ; i++) {
      result = arr_classes[i].substr(0, 5);
      if (result == 'cols-') {
        nbcols = arr_classes[i].substr(5);
      }
    }

    // Create our megarow.
    var wrapper_html = '';
    wrapper_html += '<tr class="megarow">';
    wrapper_html += '  <td colspan="' + nbcols + '">';
    wrapper_html += '  <div class="views-megarow-content views-megarow-content-' + entityId + '">';
    wrapper_html +=      $(megarowContent).html();
    wrapper_html += '   </div>';
    wrapper_html += '  </td>';
    wrapper_html += '</tr>;'
    $('tr.item-' + entityId, views_table).after(wrapper_html);

    // Mark the parent row as active.
    $('tr.item-' + entityId, views_table).addClass('views-row-active');

    // Get the megarow from the DOM, now that it's been inserted.
    var megarow = views_table.find('.views-megarow-content-' + entityId, views_table);

    // Bind a click for closing the megarow.
    $('.close', megarow).bind('click', { entityId: entityId }, function(event) {
      Drupal.ViewsMegarow.close(event.data.entityId, event.target);
      event.preventDefault();
    });
  };

  /**
   * Close the megarow.
   */
  Drupal.ViewsMegarow.close = function(entityId, target) {
    // Target the megarow of the triggering element
    // (submit button or close link).
    var megarow = $(target).parents('.views-megarow-content');
    if (Drupal.ViewsMegarow.currentSettings.scrollEnabled) {
      $(megarow).viewsMegarowGoTo(Drupal.ViewsMegarow.currentSettings.scrollPadding);
    }
    // Unbind the events.
    $(document).trigger('CToolsDetachBehaviors', megarow);

    // Set our animation parameters and use them.
    var animation = Drupal.ViewsMegarow.currentSettings.animation;
    if (animation == 'fadeIn') {
      animation = 'fadeOut';
    }
    else if (animation == 'slideDown') {
      animation = 'slideUp';
    }
    else {
      animation = 'hide';
    }

    // Close and remove the megarow.
    $(megarow).hide()[animation](Drupal.ViewsMegarow.currentSettings.animationSpeed);
    $(megarow).parents('tr').remove();

    // Mark the parent row as inactive.
    $('tr.item-' + entityId).removeClass('views-row-active');
  }

  /**
   * Provide the HTML to create the megarow.
   */
  Drupal.theme.prototype.ViewsMegarowDialog = function (entityId) {
    var html = '';
    html += '<div>'; // This div doesn't get inserted into a DOM.
    html += '  <div class="megarow-header clearfix">';
    html += '    <span class="megarow-title"></span>';
    html += '      <a class="close" href="#">' + Drupal.ViewsMegarow.currentSettings.close + '</a>';
    html += '    </div>';
    html += '   <div class="megarow-content"></div>';
    html += '</div>';
    return html;
  }

  /**
   * Provide the HTML to create the throbber.
   */
  Drupal.theme.prototype.ViewsMegarowThrobber = function () {
    var html = '';
    html += '  <div class="megarow-throbber">';
    html += '    <div class="megarow-throbber-wrapper">';
    html +=        Drupal.ViewsMegarow.currentSettings.throbber;
    html += '    </div>';
    html += '  </div>';

    return html;
  };

  /**
   * Handler to prepare the megarow for the response
   */
  Drupal.ViewsMegarow.clickAjaxLink = function () {
    var target = $(this);
    var entityId = target.parents('tr').attr('data-entity-id');
    Drupal.ViewsMegarow.open(entityId, target);

    return false;
  };

  /**
   * Bind links that will open megarows to the appropriate function.
   */
  Drupal.behaviors.ViewsMegarow = {
    attach: function(context) {
      // Bind links
      // Note that doing so in this order means that the two classes can be
      // used together safely.
      $('a.views-megarow-open:not(.views-megarow-open-processed)', context)
        .addClass('views-megarow-open-processed')
        .click(Drupal.ViewsMegarow.clickAjaxLink)
        .each(function () {
          // Create a drupal ajax object
          var elementSettings = {};
          if ($(this).attr('href')) {
            elementSettings.url = $(this).attr('href');
            elementSettings.event = 'click';
            elementSettings.progress = { type: 'throbber' };
          }
          var base = $(this).attr('href');
          Drupal.ajax[base] = new Drupal.ajax(base, this, elementSettings);
        }
      );

      // Bind our custom event to the form submit
      $('.megarow-content form:not(.views-megarow-open-processed)')
        .addClass('views-megarow-open-processed')
        .each(function() {
          var elementSettings = {};
          elementSettings.url = $(this).attr('action');
          elementSettings.event = 'submit';
          elementSettings.progress = { 'type': 'throbber' }
          var base = $(this).attr('id');

          Drupal.ajax[base] = new Drupal.ajax(base, this, elementSettings);
          Drupal.ajax[base].form = $(this);

          $('input[type=submit], button', this).click(function() {
            Drupal.ajax[base].element = this;
            this.form.clk = this;
          });
        });
    }
  };

  /**
   * AJAX command to place HTML within the megarow.
   */
  Drupal.ViewsMegarow.megarow_display = function(ajax, response, status) {
    var target = $(ajax.element).parents('.views-table');
    var megarow = $('.views-megarow-content-' + response.entity_id, target);

    // Update the megarow content.
    $('.megarow-title', megarow).html(response.title);
    // .html strips off <form> tag for version Jquery 1.7, using append instead.
    $('.megarow-content', megarow).html('');
    $('.megarow-content', megarow).append(response.output);
    Drupal.attachBehaviors();
  }

  /**
   * AJAX command to dismiss the megarow.
   */
  Drupal.ViewsMegarow.megarow_dismiss = function(ajax, response, status) {
    // Close the megarow of the calling element
    // (form submit button or close link).
    Drupal.ViewsMegarow.close(response.entity_id, ajax.element);
  }

  /**
   * AJAX command to refresh the parent row of a megarow.
   */
  Drupal.ViewsMegarow.megarow_refresh_parent = function(ajax, response, status) {
    // No row found, nothing to update.
    if ($('tr.item-' + response.entity_id).length == 0) {
      return;
    }

    // Fetch the current page using ajax, and extract the relevant data.
    var table = $('tr.item-' + response.entity_id).parents('table');
    var viewName = table.attr('data-view-name');
    var display = Drupal.settings.ViewsMegarow.display_id;
    if (display === undefined) display = table.attr('data-view-display');

    var url = Drupal.settings.basePath + 'views_megarow/refresh/' + viewName + '/' + display + '/' + response.entity_id;

    $.get(url, function(data) {
      $('tr.item-' + response.entity_id + ' td', data).each(function(index) {
        // Ignore cells that contain form elements.
        if ($('input', this).length == 0 && $('select', this).length == 0) {
          var targetElement = $('tr.item-' + response.entity_id + ' td:eq(' + index + ')');
          var newContent = $(this).html();
          targetElement.html(newContent);
          Drupal.attachBehaviors(targetElement);
        }
      });
    });
  }

  $(function() {
    Drupal.ajax.prototype.commands.megarow_display = Drupal.ViewsMegarow.megarow_display;
    Drupal.ajax.prototype.commands.megarow_dismiss = Drupal.ViewsMegarow.megarow_dismiss;
    Drupal.ajax.prototype.commands.megarow_refresh_parent = Drupal.ViewsMegarow.megarow_refresh_parent;
  });
})(jQuery);
;
(function ($) {
  Drupal.behaviors.vbo = {
    attach: function(context) {
      $('.vbo-views-form', context).each(function() {
        Drupal.vbo.initTableBehaviors(this);
        Drupal.vbo.initGenericBehaviors(this);
      });
    }
  }

  Drupal.vbo = Drupal.vbo || {};
  Drupal.vbo.initTableBehaviors = function(form) {
    // If the table is not grouped, "Select all on this page / all pages"
    // markup gets inserted below the table header.
    var selectAllMarkup = $('.vbo-table-select-all-markup', form);
    if (selectAllMarkup.length) {
      $('.views-table > tbody', form).prepend('<tr class="views-table-row-select-all even">></tr>');
      var colspan = $('table th', form).length;
      $('.views-table-row-select-all', form).html('<td colspan="' + colspan + '">' + selectAllMarkup.html() + '</td>');

      $('.vbo-table-select-all-pages', form).click(function() {
        Drupal.vbo.tableSelectAllPages(form);
        return false;
      });
      $('.vbo-table-select-this-page', form).click(function() {
        Drupal.vbo.tableSelectThisPage(form);
        return false;
      });
    }

    $('.vbo-table-select-all', form).show();
    // This is the "select all" checkbox in (each) table header.
    $('.vbo-table-select-all', form).click(function() {
      var table = $(this).closest('table')[0];
      $('input[id^="edit-views-bulk-operations"]:not(:disabled)', table).attr('checked', this.checked);

      // Toggle the visibility of the "select all" row (if any).
      if (this.checked) {
        $('.views-table-row-select-all', table).show();
      }
      else {
        $('.views-table-row-select-all', table).hide();
        // Disable "select all across pages".
        Drupal.vbo.tableSelectThisPage(form);
      }
    });

    // Set up the ability to click anywhere on the row to select it.
    $('.views-table tbody tr', form).click(function(event) {
      if (event.target.tagName.toLowerCase() != 'input' && event.target.tagName.toLowerCase() != 'a') {
        $('input[id^="edit-views-bulk-operations"]:not(:disabled)', this).each(function() {
          var checked = this.checked;
          // trigger() toggles the checkmark *after* the event is set,
          // whereas manually clicking the checkbox toggles it *beforehand*.
          // that's why we manually set the checkmark first, then trigger the
          // event (so that listeners get notified), then re-set the checkmark
          // which the trigger will have toggled. yuck!
          this.checked = !checked;
          $(this).trigger('click');
          this.checked = !checked;
        });
      }
    });
  }

  Drupal.vbo.tableSelectAllPages = function(form) {
    $('.vbo-table-this-page', form).hide();
    $('.vbo-table-all-pages', form).show();
    // Modify the value of the hidden form field.
    $('.select-all-rows', form).val('1');
  }
  Drupal.vbo.tableSelectThisPage = function(form) {
    $('.vbo-table-all-pages', form).hide();
    $('.vbo-table-this-page', form).show();
    // Modify the value of the hidden form field.
    $('.select-all-rows', form).val('0');
  }

  Drupal.vbo.initGenericBehaviors = function(form) {
    // Show the "select all" fieldset.
    $('.vbo-select-all-markup', form).show();

    $('.vbo-select-this-page', form).click(function() {
      $('input[id^="edit-views-bulk-operations"]', form).attr('checked', this.checked);
      $('.vbo-select-all-pages', form).attr('checked', false);

      // Toggle the "select all" checkbox in grouped tables (if any).
      $('.vbo-table-select-all', form).attr('checked', this.checked);
    });
    $('.vbo-select-all-pages', form).click(function() {
      $('input[id^="edit-views-bulk-operations"]', form).attr('checked', this.checked);
      $('.vbo-select-this-page', form).attr('checked', false);

      // Toggle the "select all" checkbox in grouped tables (if any).
      $('.vbo-table-select-all', form).attr('checked', this.checked);

      // Modify the value of the hidden form field.
      $('.select-all-rows', form).val(this.checked);
    });

    $('.vbo-select', form).click(function() {
      // If a checkbox was deselected, uncheck any "select all" checkboxes.
      if (!this.checked) {
        $('.vbo-select-this-page', form).attr('checked', false);
        $('.vbo-select-all-pages', form).attr('checked', false);
        // Modify the value of the hidden form field.
        $('.select-all-rows', form).val('0')

        var table = $(this).closest('table')[0];
        if (table) {
          // Uncheck the "select all" checkbox in the table header.
          $('.vbo-table-select-all', table).attr('checked', false);

          // If there's a "select all" row, hide it.
          if ($('.vbo-table-select-this-page', table).length) {
            $('.views-table-row-select-all', table).hide();
            // Disable "select all across pages".
            Drupal.vbo.tableSelectThisPage(form);
          }
        }
      }
    });
  }

})(jQuery);
;
