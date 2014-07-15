/**
 * @file
 * JavaScript integration between Google Charts and Drupal.
 */
(function ($) {

Drupal.behaviors.chartsGoogle = {};
Drupal.behaviors.chartsGoogle.attach = function(context, settings) {
  // First time loading in Views preview may not work because the Google JS
  // API may not yet be loaded.
  if (typeof google !== 'undefined') {
    google.load('visualization', '1', { callback: renderCharts });
  }

  // Redraw charts on window resize.
  var debounce;
  $(window).resize(function() {
    clearTimeout(debounce);
    debounce = setTimeout(function() {
      $('.charts-google').each(function() {
        var wrap = $(this).data('chartsGoogleWrapper');
        if (wrap) {
          wrap.draw(this);
        }
      });
    }, 75);
  });

  function renderCharts() {
    $('.charts-google').once('charts-google', function() {
      if ($(this).attr('data-chart')) {
        var config = $.parseJSON($(this).attr('data-chart'));
        var wrap = new google.visualization.ChartWrapper();
        wrap.setChartType(config.visualization);
        wrap.setDataTable(config.data);
        wrap.setOptions(config.options);

        // Apply data formatters. This only affects tooltips. The same format is
        // already applied via the hAxis/vAxis.format option.
        var dataTable = wrap.getDataTable();
        if (config.options.series) {
          for (var n = 0; n < config.options.series.length; n++) {
            if (config.options.series[n]['_format']) {
              var format = config.options.series[n]['_format'];
              if (format['dateFormat']) {
                var formatter = new google.visualization.DateFormat({ pattern: format['dateFormat'] });
              }
              else {
                var formatter = new google.visualization.NumberFormat({ pattern: format['format'] });
              }
              formatter.format(dataTable, n + 1);
            }
          }
        }

        // Apply individual point properties, by adding additional "role"
        // columns to the data table. So far this only applies "tooltip"
        // properties to individual cells. Ideally, this would support "color"
        // also. Feature request:
        // https://code.google.com/p/google-visualization-api-issues/issues/detail?id=1267
        var columnsToAdd = {};
        var rowCount = dataTable.getNumberOfRows();
        var columnCount = dataTable.getNumberOfColumns();
        for (var rowIndex in config._data) {
          if (config._data.hasOwnProperty(rowIndex)) {
            for (var columnIndex in config._data[rowIndex]) {
              if (config._data[rowIndex].hasOwnProperty(columnIndex)) {
                for (var role in config._data[rowIndex][columnIndex]) {
                  if (config._data[rowIndex][columnIndex].hasOwnProperty(role)) {
                    if (!columnsToAdd[columnIndex]) {
                      columnsToAdd[columnIndex] = {};
                    }
                    if (!columnsToAdd[columnIndex][role]) {
                      columnsToAdd[columnIndex][role] = new Array(rowCount);
                    }
                    columnsToAdd[columnIndex][role][rowIndex] = config._data[rowIndex][columnIndex][role];
                  }
                }
              }
            }
          }
        }
        // Add columns from the right-most position.
        for (var columnIndex = columnCount; columnIndex >= 0; columnIndex--) {
          if (columnsToAdd[columnIndex]) {
            for (var role in columnsToAdd[columnIndex]) {
              if (columnsToAdd[columnIndex].hasOwnProperty(role)) {
                dataTable.insertColumn(columnIndex + 1, {
                  type: 'string',
                  role: role,
                });
                for (var rowIndex in columnsToAdd[columnIndex][role]) {
                  dataTable.setCell(parseInt(rowIndex) - 1, columnIndex + 1, columnsToAdd[columnIndex][role][rowIndex]);
                }
              }
            }
          }
        }

        wrap.draw(this);
        $(this).data('chartsGoogleWrapper', wrap);
      }
    });
  }
};

})(jQuery);
;
/**
 * @file
 * Attaches behaviors for the Contextual module.
 */

(function ($) {

Drupal.contextualLinks = Drupal.contextualLinks || {};

/**
 * Attaches outline behavior for regions associated with contextual links.
 */
Drupal.behaviors.contextualLinks = {
  attach: function (context) {
    $('div.contextual-links-wrapper', context).once('contextual-links', function () {
      var $wrapper = $(this);
      var $region = $wrapper.closest('.contextual-links-region');
      var $links = $wrapper.find('ul.contextual-links');
      var $trigger = $('<a class="contextual-links-trigger" href="#" />').text(Drupal.t('Configure')).click(
        function () {
          $links.stop(true, true).slideToggle(100);
          $wrapper.toggleClass('contextual-links-active');
          return false;
        }
      );
      // Attach hover behavior to trigger and ul.contextual-links.
      $trigger.add($links).hover(
        function () { $region.addClass('contextual-links-region-active'); },
        function () { $region.removeClass('contextual-links-region-active'); }
      );
      // Hide the contextual links when user clicks a link or rolls out of the .contextual-links-region.
      $region.bind('mouseleave click', Drupal.contextualLinks.mouseleave);
      $region.hover(
        function() { $trigger.addClass('contextual-links-trigger-active'); },
        function() { $trigger.removeClass('contextual-links-trigger-active'); }
      );
      // Prepend the trigger.
      $wrapper.prepend($trigger);
    });
  }
};

/**
 * Disables outline for the region contextual links are associated with.
 */
Drupal.contextualLinks.mouseleave = function () {
  $(this)
    .find('.contextual-links-active').removeClass('contextual-links-active')
    .find('ul.contextual-links').hide();
};

})(jQuery);
;
