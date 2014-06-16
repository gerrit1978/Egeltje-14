Drupal.locale = { 'pluralFormula': function ($n) { return Number(($n!=1)); }, 'strings': {"":{"An AJAX HTTP error occurred.":"Er is een AJAX HTTP fout opgetreden.","HTTP Result Code: !status":"HTTP-resultaatcode: !status","An AJAX HTTP request terminated abnormally.":"Een AJAX HTTP-aanvraag is onverwacht afgebroken","Debugging information follows.":"Debug informatie volgt.","Path: !uri":"Pad: !uri","StatusText: !statusText":"Statustekst: !statusText","ResponseText: !responseText":"Antwoordtekst: !responseText","ReadyState: !readyState":"ReadyState: !readyState","@title dialog":"@title dialoog","Configure":"Instellen","Show shortcuts":"Snelkoppelingen weergeven","Hide shortcuts":"Snelkoppelingen verbergen","Loading":"Laden","(active tab)":"(actieve tabblad)","Please wait...":"Even geduld...","Autocomplete popup":"Popup voor automatisch aanvullen","Searching for matches...":"Zoeken naar overeenkomsten...","Re-order rows by numerical weight instead of dragging.":"Herschik de rijen op basis van gewicht, in plaats van slepen.","Show row weights":"Gewicht van rijen tonen","Hide row weights":"Gewicht van rij verbergen","Drag to re-order":"Slepen om de volgorde te wijzigen","Changes made in this table will not be saved until the form is submitted.":"Wijzigingen in deze tabel worden pas opgeslagen wanneer het formulier wordt ingediend.","+@count":"+@count","-@count":"-@count","Next":"Volgende","Disabled":"Uitgeschakeld","Enabled":"Ingeschakeld","Edit":"Bewerken","Sunday":"zondag","Monday":"maandag","Tuesday":"dinsdag","Wednesday":"woensdag","Thursday":"donderdag","Friday":"vrijdag","Saturday":"zaterdag","Add":"Toevoegen","read more":"lees verder","Done":"Gereed","Prev":"Vorige","Mon":"ma","Tue":"di","Wed":"wo","Thu":"do","Fri":"vr","Sat":"za","Sun":"zo","January":"januari","February":"februari","March":"maart","April":"april","May":"mei","June":"juni","July":"juli","August":"augustus","September":"september","October":"oktober","November":"november","December":"december","Show":"Weergeven","Select all rows in this table":"Selecteer alle regels van deze tabel","Deselect all rows in this table":"De-selecteer alle regels van deze tabel","Today":"Vandaag","Jan":"jan","Feb":"feb","Mar":"mrt","Apr":"apr","Jun":"jun","Jul":"jul","Aug":"aug","Sep":"sep","Oct":"okt","Nov":"nov","Dec":"dec","Su":"zo","Mo":"ma","Tu":"di","We":"wo","Th":"do","Fr":"vr","Sa":"za","Not published":"Niet gepubliceerd","Hide":"Verbergen","mm\/dd\/yy":"mm\/dd\/jj","By @name on @date":"Door @name op @date","By @name":"Door @name","Not in menu":"Niet in een menu","Alias: @alias":"Alias: @alias","No alias":"Geen alias","New revision":"Nieuwe revisie","The changes to these blocks will not be saved until the \u003Cem\u003ESave blocks\u003C\/em\u003E button is clicked.":"Wijzigingen aan de blokken worden pas opgeslagen wanneer u de knop \u003Cem\u003EBlokken opslaan\u003C\/em\u003E aanklikt.","This permission is inherited from the authenticated user role.":"Dit toegangsrecht is ge\u00ebrfd van de rol \u0027geverifieerde gebruiker\u0027.","No revision":"Geen revisie","@number comments per page":"@number reacties per pagina","Not restricted":"Geen beperking","Not customizable":"Niet aanpasbaar","Restricted to certain pages":"Beperkt tot bepaalde pagina\u0027s","The block cannot be placed in this region.":"Het blok kan niet worden geplaatst in dit gebied.","Hide summary":"Samenvatting verbergen","Edit summary":"Samenvatting bewerken","The selected file %filename cannot be uploaded. Only files with the following extensions are allowed: %extensions.":"Het bestand %filename kan niet ge\u00fcpload worden. Alleen bestanden met de volgende extensies zijn toegestaan: %extensions","Automatic alias":"Automatische alias","read less":"lees minder","Show more":"Meer tonen","Show fewer":"Minder tonen","Available tokens":"Beschikbare tokens","Insert this token into your form":"Plaats deze token in uw formulier","First click a text field to insert your tokens into.":"Klik eerst een tekstveld aan om uw tokens in te plaatsen.","Remove group":"Groep verwijderen","Apply (all displays)":"Toepassen (alle weergaven)","Revert to default":"Terugzetten naar standaard","Apply (this display)":"Toepassen (deze weergave)","From @title":"Van @title","To @title":"Aan @title","Created @date":"Aangemaakt op @date","New order":"Nieuwe bestelling","Updated @date":"Aangepast op @date"}} };;
(function($) {
  $.authcache_cookie = function(name, value, lifetime) {
    lifetime = (typeof lifetime === 'undefined') ? Drupal.settings.authcache.cl : lifetime;
    $.cookie(name, value, $.extend(Drupal.settings.authcache.cp, {expires: lifetime}));
  };
}(jQuery));
;
(function ($) {
    
Drupal.behaviors.megamenu = { 
    attach:function(context) {    
    
	var timeout			= Drupal.settings.megamenu.timeout;
	var sizewait		=  Drupal.settings.megamenu.sizewait;
	var hoverwait		=  Drupal.settings.megamenu.hoverwait;
	var hovertimer		= null;
	var sizetimer		= null;
	var closetimer		= null;
	var hoverParent		= null;
	var hoverBin		= null;
	var hoverSlots		= null;
	var megaSlots		= null;
	var megaParents		= null;
	var hideOffset		= -9000;
	var megaParents = $('.megamenu-menu').find('.megamenu-parent');
	var megaParentTitles = $('.megamenu-menu').find('.megamenu-parent-title');
	var megaBins = $('.megamenu-menu').find('.megamenu-bin');
	var oldParentIdx = -1;
	var hoverParentIdx = -2;
	megaBins.css('top', hideOffset);
  var activeParent	 		= megaParents.index($(megaParents).has('.active'));
  if(activeParent != -1)
  {
    megaParents.eq(activeParent).addClass('active');
  }
  
	function megamenu_open(){
		megamenu_canceltimer();

		if ($(this).hasClass('megamenu-parent-title')) {
			hoverParentIdx = megaParentTitles.index($(this));
		}
		else if ($(this).hasClass('megamenu-bin')) {
			hoverParentIdx = megaParents.index($(this).parents('.megamenu-parent'));
		}
    
		hoverParent = megaParents.eq(hoverParentIdx);

		if (hoverParentIdx != oldParentIdx) {
			megamenu_close();
			megamenu_hovertimer();
		} else {
			megamenu_display();
		}
	}

	function megamenu_display() {
		if (hoverParent) {
			// If the display doesn't have hover yet - trigger event
			if (!hoverParent.hasClass('hovering')) {
				hoverParent.trigger('megamenu_open');
			}
			hoverParent.addClass('hovering');
			hoverBin = hoverParent.find('.megamenu-bin');
			/* display position */
			hoverBin.css('top', 'auto');
		/* display position end */
		}
	}

	function megamenu_close(){
		if (hoverParent) {
			oldParentIdx = $('.megamenu-parent').index(hoverParent);
		}
		for ( var i=0 ; i < megaParents.length ; i++ ) {
			megaParents.trigger('megamenu_close');
			megaParents.eq(i).removeClass('hovering');
		}
		if(hoverBin) hoverBin.css('top', hideOffset);
	}

	function megamenu_closeAll(){
		if(hoverBin) hoverBin.css('top', hideOffset);
		for ( var i=0 ; i < megaParents.length ; i++ ) {
			megaParents.trigger('megamenu_close');
			megaParents.eq(i).removeClass('hovering');
		}
		oldParentIdx = -1;
	}

	function megamenu_stopPropagation(event){
		event.stopPropagation();
	}

	function megamenu_timer(){
		megamenu_canceltimer();
		megamenu_cancelhovertimer();
		closetimer = window.setTimeout(megamenu_closeAll, timeout);
	}

	function megamenu_canceltimer(){
		if (closetimer) {
			window.clearTimeout(closetimer);
			closetimer = null;
		}
	}

	function megamenu_hovertimer(){
		megamenu_cancelhovertimer();
		hovertimer = window.setTimeout(megamenu_display, hoverwait);
	}

	function megamenu_cancelhovertimer(){
		if (hovertimer) {
			window.clearTimeout(hovertimer);
			hovertimer = null;
		}
	}

	function megamenu_sizetimer(){
		/* waits to resize on initial call to accomodate browser draw */
		sizetimer = window.setTimeout(megamenu_sizer, sizewait);
	}

	function megamenu_sizer(){

		for ( var k=0 ; k < megaBins.length ; k++ ) {

			/* resets to bin sizes and position before sizing */
			megaBins.eq(k).css('left', 0 + 'px');
			megaBins.eq(k).css('width', 0 + 'px');

			var megaSlots = megaBins.eq(k).find('.megamenu-slot');

			/* auto bin width start */

			var i = 0;

			if(megaBins.eq(k).hasClass('megamenu-slots-columnar')) {
				var slotTotalWidth = 0;
				for ( i=0 ; i < megaSlots.length ; i++ ) {

					slotTotalWidth += megaSlots.eq(i).outerWidth(true);

					if (slotTotalWidth > $(window).width()) {
						slotTotalWidth = 0;
						for (var j=0 ; j < i ; j++) {
							slotTotalWidth += megaSlots.eq(i).outerWidth(true);
						}
						break;
					}
				}
				megaBins.eq(k).css( 'width' , slotTotalWidth);
				megaBins.eq(k).width(slotTotalWidth);
			}
			else {
				/* set bin width for vertical slots */
				megaBins.eq(k).css( 'width' , megaSlots.eq(0).outerWidth(true) );
			}
			/* auto bin width end */

			/* off-page shift start */ 
			var edgeOverlap = ($(window).width() - (megaBins.eq(k).offset().left + megaBins.eq(k).outerWidth(true)));

			if (edgeOverlap < 0) {
				megaBins.eq(k).css('left',(edgeOverlap) + 'px');
			}
		/* off-page shift end */
	
		}
	}

	// Open Mega Menu Function - bound
	function megamenu_open_progress() {
		if ($(this).find('ul.megamenu-bin').get(0)) {
			$(this).find('h2').addClass('megamenu-active');
		}
	}
	function megamenu_close_progress() {
		$(this).find('h2').removeClass('megamenu-active');
	}

	$('.megamenu-parent').bind('megamenu_open', megamenu_open_progress);
	$('.megamenu-parent').bind('megamenu_close', megamenu_close_progress);

	$('.megamenu-parent-title').bind('mouseover', megamenu_open);
	$('.megamenu-parent-title').bind('mouseout', megamenu_timer);

	$('.megamenu-bin').bind('mouseover', megamenu_open);
	$('.megamenu-bin').bind('mouseout', megamenu_timer);

	$("body").bind('click', megamenu_closeAll);
	$(".megamenu-menu").bind('click', megamenu_stopPropagation);

	$(window).bind('resize', megamenu_sizer);
	megamenu_sizetimer();
}
}
})(jQuery);;
/**
 * @file
 * Helper functions for memcache_admin module.
 */

// Global Killswitch
if (Drupal.jsEnabled) {
  $(document).ready(function() {
    $("body").append($("#memcache-devel"));
  });
}
;
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
/**
 * @file
 * Some basic behaviors and utility functions for Views.
 */
(function ($) {

Drupal.Views = {};

/**
 * jQuery UI tabs, Views integration component
 */
Drupal.behaviors.viewsTabs = {
  attach: function (context) {
    if ($.viewsUi && $.viewsUi.tabs) {
      $('#views-tabset').once('views-processed').viewsTabs({
        selectedClass: 'active'
      });
    }

    $('a.views-remove-link').once('views-processed').click(function(event) {
      var id = $(this).attr('id').replace('views-remove-link-', '');
      $('#views-row-' + id).hide();
      $('#views-removed-' + id).attr('checked', true);
      event.preventDefault();
   });
  /**
    * Here is to handle display deletion
    * (checking in the hidden checkbox and hiding out the row)
    */
  $('a.display-remove-link')
    .addClass('display-processed')
    .click(function() {
      var id = $(this).attr('id').replace('display-remove-link-', '');
      $('#display-row-' + id).hide();
      $('#display-removed-' + id).attr('checked', true);
      return false;
  });
  }
};

/**
 * Helper function to parse a querystring.
 */
Drupal.Views.parseQueryString = function (query) {
  var args = {};
  var pos = query.indexOf('?');
  if (pos != -1) {
    query = query.substring(pos + 1);
  }
  var pairs = query.split('&');
  for(var i in pairs) {
    if (typeof(pairs[i]) == 'string') {
      var pair = pairs[i].split('=');
      // Ignore the 'q' path argument, if present.
      if (pair[0] != 'q' && pair[1]) {
        args[decodeURIComponent(pair[0].replace(/\+/g, ' '))] = decodeURIComponent(pair[1].replace(/\+/g, ' '));
      }
    }
  }
  return args;
};

/**
 * Helper function to return a view's arguments based on a path.
 */
Drupal.Views.parseViewArgs = function (href, viewPath) {
  var returnObj = {};
  var path = Drupal.Views.getPath(href);
  // Ensure we have a correct path.
  if (viewPath && path.substring(0, viewPath.length + 1) == viewPath + '/') {
    var args = decodeURIComponent(path.substring(viewPath.length + 1, path.length));
    returnObj.view_args = args;
    returnObj.view_path = path;
  }
  return returnObj;
};

/**
 * Strip off the protocol plus domain from an href.
 */
Drupal.Views.pathPortion = function (href) {
  // Remove e.g. http://example.com if present.
  var protocol = window.location.protocol;
  if (href.substring(0, protocol.length) == protocol) {
    // 2 is the length of the '//' that normally follows the protocol
    href = href.substring(href.indexOf('/', protocol.length + 2));
  }
  return href;
};

/**
 * Return the Drupal path portion of an href.
 */
Drupal.Views.getPath = function (href) {
  href = Drupal.Views.pathPortion(href);
  href = href.substring(Drupal.settings.basePath.length, href.length);
  // 3 is the length of the '?q=' added to the url without clean urls.
  if (href.substring(0, 3) == '?q=') {
    href = href.substring(3, href.length);
  }
  var chars = ['#', '?', '&'];
  for (i in chars) {
    if (href.indexOf(chars[i]) > -1) {
      href = href.substr(0, href.indexOf(chars[i]));
    }
  }
  return href;
};

})(jQuery);
;
/**
 * @file
 * Implement a simple, clickable dropbutton menu.
 *
 * See dropbutton.theme.inc for primary documentation.
 *
 * The javascript relies on four classes:
 * - The dropbutton must be fully contained in a div with the class
 *   ctools-dropbutton. It must also contain the class ctools-no-js
 *   which will be immediately removed by the javascript; this allows for
 *   graceful degradation.
 * - The trigger that opens the dropbutton must be an a tag wit hthe class
 *   ctools-dropbutton-link. The href should just be '#' as this will never
 *   be allowed to complete.
 * - The part of the dropbutton that will appear when the link is clicked must
 *   be a div with class ctools-dropbutton-container.
 * - Finally, ctools-dropbutton-hover will be placed on any link that is being
 *   hovered over, so that the browser can restyle the links.
 *
 * This tool isn't meant to replace click-tips or anything, it is specifically
 * meant to work well presenting menus.
 */

(function ($) {
  Drupal.behaviors.CToolsDropbutton = {
    attach: function() {
      // Process buttons. All dropbuttons are buttons.
      $('.ctools-button')
        .once('ctools-button')
        .removeClass('ctools-no-js');

      // Process dropbuttons. Not all buttons are dropbuttons.
      $('.ctools-dropbutton').once('ctools-dropbutton', function() {
        var $dropbutton = $(this);
        var $button = $('.ctools-content', $dropbutton);
        var $secondaryActions = $('li', $button).not(':first');
        var $twisty = $(".ctools-link", $dropbutton);
        var open = false;
        var hovering = false;
        var timerID = 0;

        var toggle = function(close) {
          // if it's open or we're told to close it, close it.
          if (open || close) {
            // If we're just toggling it, close it immediately.
            if (!close) {
              open = false;
              $secondaryActions.slideUp(100);
              $dropbutton.removeClass('open');
            }
            else {
              // If we were told to close it, wait half a second to make
              // sure that's what the user wanted.
              // Clear any previous timer we were using.
              if (timerID) {
                clearTimeout(timerID);
              }
              timerID = setTimeout(function() {
                if (!hovering) {
                  open = false;
                  $secondaryActions.slideUp(100);
                  $dropbutton.removeClass('open');
                }}, 500);
            }
          }
          else {
            // open it.
            open = true;
            $secondaryActions.animate({height: "show", opacity: "show"}, 100);
            $dropbutton.addClass('open');
          }
        }
        // Hide the secondary actions initially.
        $secondaryActions.hide();

        $twisty.click(function() {
            toggle();
            return false;
          });

        $dropbutton.hover(
          function() {
            hovering = true;
          }, // hover in
          function() { // hover out
            hovering = false;
            toggle(true);
            return false;
          }
        );
      });
    }
  }
})(jQuery);
;
/**
 * @file
 * Handles AJAX fetching of views, including filter submission and response.
 */
(function ($) {

/**
 * Attaches the AJAX behavior to Views exposed filter forms and key View links.
 */
Drupal.behaviors.ViewsAjaxView = {};
Drupal.behaviors.ViewsAjaxView.attach = function() {
  if (Drupal.settings && Drupal.settings.views && Drupal.settings.views.ajaxViews) {
    $.each(Drupal.settings.views.ajaxViews, function(i, settings) {
      Drupal.views.instances[i] = new Drupal.views.ajaxView(settings);
    });
  }
};

Drupal.views = {};
Drupal.views.instances = {};

/**
 * Javascript object for a certain view.
 */
Drupal.views.ajaxView = function(settings) {
  var selector = '.view-dom-id-' + settings.view_dom_id;
  this.$view = $(selector);

  // Retrieve the path to use for views' ajax.
  var ajax_path = Drupal.settings.views.ajax_path;

  // If there are multiple views this might've ended up showing up multiple times.
  if (ajax_path.constructor.toString().indexOf("Array") != -1) {
    ajax_path = ajax_path[0];
  }

  // Check if there are any GET parameters to send to views.
  var queryString = window.location.search || '';
  if (queryString !== '') {
    // Remove the question mark and Drupal path component if any.
    var queryString = queryString.slice(1).replace(/q=[^&]+&?|&?render=[^&]+/, '');
    if (queryString !== '') {
      // If there is a '?' in ajax_path, clean url are on and & should be used to add parameters.
      queryString = ((/\?/.test(ajax_path)) ? '&' : '?') + queryString;
    }
  }

  this.element_settings = {
    url: ajax_path + queryString,
    submit: settings,
    setClick: true,
    event: 'click',
    selector: selector,
    progress: { type: 'throbber' }
  };

  this.settings = settings;

  // Add the ajax to exposed forms.
  this.$exposed_form = $('form#views-exposed-form-'+ settings.view_name.replace(/_/g, '-') + '-' + settings.view_display_id.replace(/_/g, '-'));
  this.$exposed_form.once(jQuery.proxy(this.attachExposedFormAjax, this));

  // Add the ajax to pagers.
  this.$view
    // Don't attach to nested views. Doing so would attach multiple behaviors
    // to a given element.
    .filter(jQuery.proxy(this.filterNestedViews, this))
    .once(jQuery.proxy(this.attachPagerAjax, this));

  // Add a trigger to update this view specifically.
  var self_settings = this.element_settings;
  self_settings.event = 'RefreshView';
  this.refreshViewAjax = new Drupal.ajax(this.selector, this.$view, self_settings);
};

Drupal.views.ajaxView.prototype.attachExposedFormAjax = function() {
  var button = $('input[type=submit], button[type=submit], input[type=image]', this.$exposed_form);
  button = button[0];

  this.exposedFormAjax = new Drupal.ajax($(button).attr('id'), button, this.element_settings);
};

Drupal.views.ajaxView.prototype.filterNestedViews= function() {
  // If there is at least one parent with a view class, this view
  // is nested (e.g., an attachment). Bail.
  return !this.$view.parents('.view').size();
};

/**
 * Attach the ajax behavior to each link.
 */
Drupal.views.ajaxView.prototype.attachPagerAjax = function() {
  this.$view.find('ul.pager > li > a, th.views-field a, .attachment .views-summary a')
  .each(jQuery.proxy(this.attachPagerLinkAjax, this));
};

/**
 * Attach the ajax behavior to a singe link.
 */
Drupal.views.ajaxView.prototype.attachPagerLinkAjax = function(id, link) {
  var $link = $(link);
  var viewData = {};
  var href = $link.attr('href');
  // Construct an object using the settings defaults and then overriding
  // with data specific to the link.
  $.extend(
    viewData,
    this.settings,
    Drupal.Views.parseQueryString(href),
    // Extract argument data from the URL.
    Drupal.Views.parseViewArgs(href, this.settings.view_base_path)
  );

  // For anchor tags, these will go to the target of the anchor rather
  // than the usual location.
  $.extend(viewData, Drupal.Views.parseViewArgs(href, this.settings.view_base_path));

  this.element_settings.submit = viewData;
  this.pagerAjax = new Drupal.ajax(false, $link, this.element_settings);
};

Drupal.ajax.prototype.commands.viewsScrollTop = function (ajax, response, status) {
  // Scroll to the top of the view. This will allow users
  // to browse newly loaded content after e.g. clicking a pager
  // link.
  var offset = $(response.selector).offset();
  // We can't guarantee that the scrollable object should be
  // the body, as the view could be embedded in something
  // more complex such as a modal popup. Recurse up the DOM
  // and scroll the first element that has a non-zero top.
  var scrollTarget = response.selector;
  while ($(scrollTarget).scrollTop() == 0 && $(scrollTarget).parent()) {
    scrollTarget = $(scrollTarget).parent();
  }
  // Only scroll upward
  if (offset.top - 10 < $(scrollTarget).scrollTop()) {
    $(scrollTarget).animate({scrollTop: (offset.top - 10)}, 500);
  }
};

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
(function(){var e,h=this,k=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b},m=function(a){return"array"==k(a)},aa=function(a){var b=k(a);return"array"==b||"object"==b&&"number"==typeof a.length},n=function(a){return"string"==typeof a},ba=function(a){return"boolean"==typeof a},p=function(a){return"number"==typeof a},ca=function(a,b,c){return a.call.apply(a.bind,arguments)},da=function(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=
Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}},ea=function(a,b,c){ea=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ca:da;return ea.apply(null,arguments)},fa=function(a,b){function c(){}c.prototype=b.prototype;a.S=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.R=function(a,c,f){return b.prototype[c].apply(a,Array.prototype.slice.call(arguments,2))}};var q=function(a,b){var c=parseFloat(a);return isNaN(c)||1<c||0>c?b:c},ga=function(a,b){var c=parseInt(a,10);return isNaN(c)?b:c},ha=/^([\w-]+\.)*([\w-]{2,})(\:[0-9]+)?$/,ia=function(a,b){if(!a)return b;var c=a.match(ha);return c?c[0]:b};var ja=q("0.02",0),ka=q("1",0),la=q("",0);var ma=q("0.005",0),na=q("0.01",0),oa=q("0.001",0),pa=ga("1500",1500),qa=q("0.01",0),ra=q("1.0",0),sa=q("0.5",0),ta=q("0.01",0),ua=ga("1500",1500),va=ga("1500",
1500),wa=q("",.001),xa=ga("",200);var ya=/^true$/.test("false")?!0:!1;var za=function(a){return/^[\s\xa0]*$/.test(a)},Aa=function(a,b){return a<b?-1:a>b?1:0};var r=function(a,b,c){for(var d in a)Object.prototype.hasOwnProperty.call(a,d)&&b.call(c,a[d],d,a)};var s=function(){return h.googletag||(h.googletag={})},t=function(a,b,c){var d=s();a in d&&!c||(d[a]=b)},Ba=function(a,b){a.addEventListener?a.addEventListener("load",b,!1):a.attachEvent&&a.attachEvent("onload",b)};var u={};u[1]=ia("","pagead2.googlesyndication.com");u[2]=ia("","pubads.g.doubleclick.net");u[3]=ia("","securepubads.g.doubleclick.net");u[4]=ia("","partner.googleadservices.com");u[5]="http://pagead2.googlesyndication.com/pagead/show_ads.js";u[6]=ya;u[7]=ja;u[8]=ka;u[10]=na;u[11]=oa;u[12]=ma;u[13]=pa;u[16]=qa;u[17]=ra;u[18]=sa;u[19]=ta;u[20]=la;u[21]=ua;u[22]=va;u[23]=wa;u[24]=xa;t("_vars_",u);var v=function(a,b){this.b=a;this.a=b||[]};v.prototype.getMessageId=function(){return this.b};v.prototype.getMessageArgs=function(){return this.a};var Ca=function(a,b,c,d,g){this.b=new Date;this.g=d||null;this.f=c||null;this.c=a;this.d=b;this.a=g||null};e=Ca.prototype;e.getSlot=function(){return this.g};e.getService=function(){return this.f};e.getLevel=function(){return this.c};e.getTimestamp=function(){return this.b};e.getMessage=function(){return this.d};e.getReference=function(){return this.a};var Da=["Debug","Info","Warning","Error","Fatal"];
Ca.prototype.toString=function(){var a=this.b.toTimeString()+": "+Da[this.c]+": "+this.d;this.a&&(a+=" Duration: "+(this.b.getTime()-this.a.getTimestamp().getTime())+"ms.");return a};var x=function(){this.a=[]};x.prototype.getAllEvents=function(){return this.a};x.prototype.getEventsByService=function(a){return Ea(this,function(b){return b.getService()===a})};x.prototype.getEventsBySlot=function(a){return Ea(this,function(b){return b.getSlot()===a})};x.prototype.getEventsByLevel=function(a){return Ea(this,function(b){return b.getLevel()>=a})};var Ea=function(a,b){for(var c=[],d=0;d<a.a.length;++d)b(a.a[d])&&c.push(a.a[d]);return c};
x.prototype.log=function(a,b,c,d,g){a=new Ca(a,b,c,d,g);this.a.push(a);return a};var z=function(a,b,c,d,g){return a.log(1,b,c,d,g)},A=function(a,b,c,d){a.log(2,b,c,d,void 0)},B=function(a,b,c,d){a.log(3,b,c,d,void 0)},C=function(){var a=s();return a.debug_log||(a.debug_log=new x)};t("getEventLog",C);var D=function(a){return function(){return new v(a,[])}},G=function(a){return function(b){return new v(a,[b])}},H=function(a){return function(b,c){return new v(a,[b,c])}},J=function(a){return function(b,c,d){return new v(a,[b,c,d])}},Fa=D(1),Ga=G(2),Ha=G(3),Ia=G(4),Ja=G(5),Ka=G(6),La=D(8),Ma=J(9),Na=J(10),Oa=J(11),Pa=H(12),Qa=G(13),Ra=G(14),Sa=D(15),Ta=D(16),Ua=J(17),Va=J(18),Wa=D(19),Xa=G(20),Ya=G(21),Za=H(22),$a=H(23),ab=G(26),bb=G(27),cb=G(28),db=J(29),eb=G(30),fb=H(31),gb=G(32),hb=G(33),ib=D(34),
jb=G(35),kb=J(36),lb=J(37),mb=D(38),nb=G(39),ob=H(40),pb=D(42),qb=H(43),rb=D(44),sb=D(45),tb=G(46),ub=G(47),vb=G(48),wb=D(49),xb=D(50),yb=D(52),zb=H(53),Ab=H(54),Bb=G(55),Cb=G(56),Db=H(57),Eb=J(58),Fb=G(59),Gb=G(60),Hb=H(61),Ib=H(62),Jb=G(63),Kb=H(64),Lb=G(65),Mb=D(66),Nb=D(67),Ob=D(68),Pb=D(69),Qb=D(70),Rb=D(71),Sb=D(72),Tb=G(73),Ub=G(74),K=G(75),Vb=J(77),Wb=G(78),Xb=D(79),Yb=G(80),Zb=H(82),$b=H(83),ac=H(84),bc=G(85),cc=D(86),dc=D(87),ec=J(88),fc=J(89),gc=G(90),hc=D(91),ic=G(92),jc=G(93),kc=G(94),
lc=G(95);var mc=function(){this.b=this.a=0};mc.prototype.push=function(a){for(var b=C(),c=0;c<arguments.length;++c)try{"function"==k(arguments[c])&&(arguments[c](),this.a++)}catch(d){this.b++,B(b,eb(String(d.message)))}z(b,fb(String(this.a),String(this.b)));return this.a};(function(){function a(a){this.t={};this.tick=function(a,b,c){this.t[a]=[void 0!=c?c:(new Date).getTime(),b];if(void 0==c)try{window.console.timeStamp("CSI/"+a)}catch(d){}};this.tick("start",null,a)}var b;window.performance&&(b=window.performance.timing);var c=b?new a(b.responseStart):new a;window.GPT_jstiming={Timer:a,load:c};if(b){var d=b.navigationStart,g=b.responseStart;0<d&&g>=d&&(window.GPT_jstiming.srt=g-d)}if(b){var f=window.GPT_jstiming.load;0<d&&g>=d&&(f.tick("_wtsrt",void 0,d),f.tick("wtsrt_",
"_wtsrt",g),f.tick("tbsd_","wtsrt_"))}try{b=null,window.chrome&&window.chrome.csi&&(b=Math.floor(window.chrome.csi().pageT),f&&0<d&&(f.tick("_tbnd",void 0,window.chrome.csi().startE),f.tick("tbnd_","_tbnd",d))),null==b&&window.gtbExternal&&(b=window.gtbExternal.pageT()),null==b&&window.external&&(b=window.external.pageT,f&&0<d&&(f.tick("_tbnd",void 0,window.external.startE),f.tick("tbnd_","_tbnd",d))),b&&(window.GPT_jstiming.pt=b)}catch(l){}})();if(window.GPT_jstiming){window.GPT_jstiming.P={};window.GPT_jstiming.Q=1;var nc=function(a,b,c){var d=a.t[b],g=a.t.start;if(d&&(g||c))return d=a.t[b][0],void 0!=c?g=c:g=g[0],d-g},oc=function(a,b,c){var d="";window.GPT_jstiming.srt&&(d+="&srt="+window.GPT_jstiming.srt,delete window.GPT_jstiming.srt);window.GPT_jstiming.pt&&(d+="&tbsrt="+window.GPT_jstiming.pt,delete window.GPT_jstiming.pt);try{window.external&&window.external.tran?d+="&tran="+window.external.tran:window.gtbExternal&&window.gtbExternal.tran?
d+="&tran="+window.gtbExternal.tran():window.chrome&&window.chrome.csi&&(d+="&tran="+window.chrome.csi().tran)}catch(g){}var f=window.chrome;if(f&&(f=f.loadTimes)){f().wasFetchedViaSpdy&&(d+="&p=s");if(f().wasNpnNegotiated){var d=d+"&npn=1",l=f().npnNegotiatedProtocol;l&&(d+="&npnv="+(encodeURIComponent||escape)(l))}f().wasAlternateProtocolAvailable&&(d+="&apa=1")}var w=a.t,E=w.start,f=[],l=[],y;for(y in w)if("start"!=y&&0!=y.indexOf("_")){var F=w[y][1];F?w[F]&&l.push(y+"."+nc(a,y,w[F][0])):E&&f.push(y+
"."+nc(a,y))}delete w.start;if(b)for(var I in b)d+="&"+I+"="+b[I];(b=c)||(b="https:"==document.location.protocol?"https://csi.gstatic.com/csi":"http://csi.gstatic.com/csi");return[b,"?v=3","&s="+(window.GPT_jstiming.sn||"gpt")+"&action=",a.name,l.length?"&it="+l.join(","):"",d,"&rt=",f.join(",")].join("")},pc=function(a,b,c){a=oc(a,b,c);if(!a)return"";b=new Image;var d=window.GPT_jstiming.Q++;window.GPT_jstiming.P[d]=b;b.onload=b.onerror=function(){window.GPT_jstiming&&delete window.GPT_jstiming.P[d]};
b.src=a;b=null;return a};window.GPT_jstiming.report=function(a,b,c){if("prerender"==document.webkitVisibilityState){var d=!1,g=function(){if(!d){b?b.prerender="1":b={prerender:"1"};var f;"prerender"==document.webkitVisibilityState?f=!1:(pc(a,b,c),f=!0);f&&(d=!0,document.removeEventListener("webkitvisibilitychange",g,!1))}};document.addEventListener("webkitvisibilitychange",g,!1);return""}return pc(a,b,c)}};var L=Array.prototype,qc=L.indexOf?function(a,b,c){return L.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(n(a))return n(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},rc=L.forEach?function(a,b,c){L.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,g=n(a)?a.split(""):a,f=0;f<d;f++)f in g&&b.call(c,g[f],f,a)},sc=L.map?function(a,b,c){return L.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,g=Array(d),f=n(a)?a.split(""):
a,l=0;l<d;l++)l in f&&(g[l]=b.call(c,f[l],l,a));return g},tc=L.every?function(a,b,c){return L.every.call(a,b,c)}:function(a,b,c){for(var d=a.length,g=n(a)?a.split(""):a,f=0;f<d;f++)if(f in g&&!b.call(c,g[f],f,a))return!1;return!0},uc=function(a,b){var c;t:{c=a.length;for(var d=n(a)?a.split(""):a,g=0;g<c;g++)if(g in d&&b.call(void 0,d[g],g,a)){c=g;break t}c=-1}return 0>c?null:n(a)?a.charAt(c):a[c]},vc=function(a){var b=a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];return c}return[]},xc=
function(a,b){a.sort(b||wc)},zc=function(a){for(var b=yc,c=0;c<a.length;c++)a[c]={index:c,value:a[c]};var d=b||wc;xc(a,function(a,b){return d(a.value,b.value)||a.index-b.index});for(c=0;c<a.length;c++)a[c]=a[c].value},wc=function(a,b){return a>b?1:a<b?-1:0};var Ac=function(a,b){for(var c in a)if(b.call(void 0,a[c],c,a))return!0;return!1},Bc=function(a,b){for(var c in a)if(a[c]==b)return!0;return!1};var M=function(a,b){this.b=a;this.a=b};M.prototype.ceil=function(){this.b=Math.ceil(this.b);this.a=Math.ceil(this.a);return this};M.prototype.floor=function(){this.b=Math.floor(this.b);this.a=Math.floor(this.a);return this};M.prototype.round=function(){this.b=Math.round(this.b);this.a=Math.round(this.a);return this};var N;t:{var Cc=h.navigator;if(Cc){var Dc=Cc.userAgent;if(Dc){N=Dc;break t}}N=""}var O=function(a){return-1!=N.indexOf(a)};var Ec=O("Opera")||O("OPR"),P=O("Trident")||O("MSIE"),Fc=O("Gecko")&&-1==N.toLowerCase().indexOf("webkit")&&!(O("Trident")||O("MSIE")),Gc=-1!=N.toLowerCase().indexOf("webkit"),Hc=function(){var a=h.document;return a?a.documentMode:void 0},Ic=function(){var a="",b;if(Ec&&h.opera)return a=h.opera.version,"function"==k(a)?a():a;Fc?b=/rv\:([^\);]+)(\)|;)/:P?b=/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/:Gc&&(b=/WebKit\/(\S+)/);b&&(a=(a=b.exec(N))?a[1]:"");return P&&(b=Hc(),b>parseFloat(a))?String(b):a}(),Jc={},
Kc=function(a){if(!Jc[a]){for(var b=0,c=String(Ic).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),d=String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),g=Math.max(c.length,d.length),f=0;0==b&&f<g;f++){var l=c[f]||"",w=d[f]||"",E=RegExp("(\\d*)(\\D*)","g"),y=RegExp("(\\d*)(\\D*)","g");do{var F=E.exec(l)||["","",""],I=y.exec(w)||["","",""];if(0==F[0].length&&0==I[0].length)break;b=Aa(0==F[1].length?0:parseInt(F[1],10),0==I[1].length?0:parseInt(I[1],10))||Aa(0==F[2].length,0==I[2].length)||Aa(F[2],
I[2])}while(0==b)}Jc[a]=0<=b}},Lc=h.document,Mc=Lc&&P?Hc()||("CSS1Compat"==Lc.compatMode?parseInt(Ic,10):5):void 0;var Nc;if(!(Nc=!Fc&&!P)){var Oc;if(Oc=P)Oc=P&&9<=Mc;Nc=Oc}Nc||Fc&&Kc("1.9.1");P&&Kc("9");var Q=function(a){return p(a)&&isFinite(a)&&0==a%1&&0<=a},Pc=function(a){return a.replace(/[^a-zA-Z0-9]/g,function(a){return"&#"+a.charCodeAt()+";"})},Qc=function(){var a=null,b=window,c=null;try{for(;null!=b&&b!==a;){c=b.location.protocol;if("https:"===c)break;else if("http:"===c||"file:"===c)return"http:";a=b;b=b.parent}}catch(d){}return"https:"};var Rc=function(a){return m(a)&&2==a.length&&Q(a[0])&&Q(a[1])},Sc=function(a){return m(a)&&1<a.length&&p(a[0])&&p(a[1])};var Tc=function(a,b){this.b=a;this.a=b};Tc.prototype.getWidth=function(){return this.b};Tc.prototype.getHeight=function(){return this.a};var Uc=function(a){var b=[];if(m(a))if(Sc(a))b.push(new Tc(a[0],a[1]));else for(var c=0;c<a.length;++c){var d=a[c];Sc(d)&&b.push(new Tc(d[0],d[1]))}return b};var Vc=function(a,b,c){this.b=a;this.c=p(b)?b:0;this.a=this.b+"_"+this.c;this.d=c||"gpt_unit_"+this.a};e=Vc.prototype;e.getId=function(){return this.a};e.getName=function(){return this.b};e.getInstance=function(){return this.c};e.toString=Vc.prototype.getId;e.getDomId=function(){return this.d};var Wc={T:"slotRenderEnded"},Xc=function(a,b){this.slot=a;this.isEmpty=!1;this.lineItemId=this.creativeId=this.size=null;this.serviceName=b};var R=function(a,b){this.name=a;this.b=b?b:new h.GPT_jstiming.Timer;this.b.name=a;this.a=[]};R.prototype.tick=function(a,b){this.b.tick(a,b)};R.prototype.M=function(a){a&&this.a.push(a)};R.prototype.report=function(){var a="https:"==h.location.protocol?"https://www.google.com/csi":"http://csi.gstatic.com/csi",b={};this.a.length&&(b.e=this.a.join());return h.GPT_jstiming.report(this.b,b,a)};R.prototype.c=function(a){Ba(window,function(){setTimeout(a,10)})};var S=function(a){this.name=a};fa(S,R);
S.prototype.tick=function(){};S.prototype.M=function(){};S.prototype.report=function(){return null};S.prototype.c=function(){};var Yc=function(){var a=h.GPT_jstiming.load,b,c=.01;void 0==c&&(c=.01);h.GPT_jstiming&&h.GPT_jstiming.load&&("http:"==h.location.protocol||"https:"==h.location.protocol)&&Math.random()<c?b=new R("global",a):b=new S("global");return b};(function(){if(!s()._gpt_timer_&&h.GPT_jstiming){var a=Yc();a.c(function(){a.tick("load");a.report()});t("_gpt_timer_",a)}return s()._gpt_timer_})();var T=function(){this.N=[];this.O={};this.b=!1;this.o={};this.log=C();z(this.log,jb(this.getName()),this)};e=T.prototype;e.getName=function(){return"unknown"};e.getVersion=function(){return"unversioned"};e.getSlots=function(){return this.N};e.getSlotIdMap=function(){return this.O};e.enable=function(){if(this.b)z(this.log,mb(),this);else{this.b=!0;try{this.C()}catch(a){B(this.log,nb(String(a)),this)}}};
e.B=function(a){this.N.push(a);this.O[a.getSlotId().getId()]=a;z(this.log,ob(this.getName(),a.getName()),this,a)};e.addEventListener=function(a,b){if("function"!=k(b))return A(this.log,hc(),this),this;if(!Bc(Wc,a))return A(this.log,jc(a),this),this;m(this.o[a])||(this.o[a]=[]);this.o[a].push(b);return this};
var Zc=function(a,b){var c=a.o.slotRenderEnded;m(c)&&rc(c,function(a){try{a(b)}catch(c){a=c&&n(c.name)?c.name:null;var f=c&&n(c.message)?c.message:null,l="";a&&f?l=a+": "+f:a?l=a:f&&(l=f);A(this.log,ic(l),this)}},a)};var $c=function(){this.a={};this.b=!1;this.c=C();this.f=z(this.c,La());Ba(window,ea($c.prototype.d,this))},ad=function(a,b){var c=null;b in a.a&&(c=a.a[b]);return c},bd=function(){var a=U();r(a.a,function(a,c){a.enable();var d=s()._gpt_timer_;d&&d.M(c)})};$c.prototype.d=function(){this.b=!0;z(this.c,Fa(),null,null,this.f)};var U=function(){var a=s();return a.service_manager_instance||(a.service_manager_instance=new $c)};t("enableServices",function(){bd()});var cd=function(a,b){this.a=a;this.b=b};var dd=function(a){this.a=a},ed=function(a,b){var c=uc(a.a,function(a){a=a.a;return a.b<=b.b&&a.a<=b.a});return null==c?null:c.b},fd=function(a){if(!m(a)||2!=a.length)throw Error("Each mapping entry has to be an array of size 2");var b;b=a[0];if(!Rc(b))throw Error("Size has to be an array of two non-negative integers");b=new M(b[0],b[1]);if(m(a[1])&&0==a[1].length)a=[];else if(a=Uc(a[1]),0==a.length)throw Error("At least one slot size must be present");return new cd(b,a)};var gd=function(a,b,c,d){this.h=a;this.v=Uc(c);this.n=null;this.b=new Vc(a,b,d);this.c=[];this.f={};this.k=null;this.a=C();z(this.a,Ga(this.b.toString()),null,this);this.g=this.i=null;this.u=this.r="";this.j=!0;this.d={};this.o=[];this.s=!1;this.q=this.p=null;this.l=0;this.m=-1};e=gd.prototype;
e.set=function(a,b){var c=this.getName();(a=a||"")&&n(a)&&b?(this.f[a]=b,this.i||this.g?A(this.a,Na(a,String(b),c),null,this):z(this.a,Ma(a,String(b),c),null,this)):A(this.a,Oa(String(a),String(b),c),null,this);return this};e.get=function(a){return a in this.f?this.f[a]:null};e.getAttributeKeys=function(){var a=[];r(this.f,function(b,c){a.push(c)});return a};
e.addService=function(a){var b=U();if(!Bc(b.a,a))return A(this.a,kc(this.b.toString()),null,this),this;for(b=0;b<this.c.length;++b)if(a==this.c[b])return A(this.a,Pa(a.getName(),this.b.toString()),a,this),this;this.c.push(a);a.B(this);return this};e.getName=function(){return this.h};e.getAdUnitPath=function(){return this.h};e.getSlotId=function(){return this.b};e.getServices=function(){return this.c};e.getSizes=function(a,b){return p(a)&&p(b)&&this.n?ed(this.n,new M(a,b)):this.v};
e.defineSizeMapping=function(a){try{if(!m(a))throw Error("Size mapping has to be an array");var b=sc(a,fd);this.n=new dd(b)}catch(c){A(this.a,Qa(c.message),null,this)}return this};e.hasWrapperDiv=function(){return!!document.getElementById(this.b.getDomId())};e.setClickUrl=function(a){this.u=a;return this};e.getClickUrl=function(){return this.u};
e.setCategoryExclusion=function(a){if(n(a)&&!za(null==a?"":String(a))){var b=this.o;0<=qc(b,a)||b.push(a);z(this.a,Ra(a),null,this)}else A(this.a,Sa(),null,this);return this};e.clearCategoryExclusions=function(){z(this.a,Ta(),null,this);this.o=[];return this};e.getCategoryExclusions=function(){return vc(this.o)};
e.setTargeting=function(a,b){var c=[];m(b)?c=b:b&&c.push(b.toString());a&&n(a)?(z(this.a,Ua(a,c.join(),this.getName()),null,this),this.d[a]=c):A(this.a,Va(String(a),c.join(),this.getName()),null,this);return this};e.clearTargeting=function(){z(this.a,Wa(),null,this);this.d={};return this};e.getTargetingMap=function(){var a=this.d,b={},c;for(c in a)b[c]=a[c];return b};e.getTargeting=function(a){return a in this.d?vc(this.d[a]):[]};
e.getTargetingKeys=function(){var a=[];r(this.d,function(b,c){a.push(c)});return a};e.getOutOfPage=function(){return this.s};e.getAudExtId=function(){return this.l};e.setTagForChildDirectedTreatment=function(a){if(0===a||1===a)this.m=a};e.gtfcd=function(){return this.m};e.setCollapseEmptyDiv=function(a,b){this.q=(this.p=a)&&Boolean(b);b&&!a&&A(this.a,Xa(this.b.toString()),null,this);return this};e.getCollapseEmptyDiv=function(){return this.p};e.getDivStartsCollapsed=function(){return this.q};
var hd=function(a,b){if(!a.hasWrapperDiv())return B(a.a,Ya(a.b.toString()),null,a),!1;var c=h.document,d=a.b.getDomId(),c=c&&c.getElementById(d);if(!c)return B(a.a,Za(d,a.b.toString()),null,a),!1;d=a.k;return n(d)&&0<d.length?(a.renderStarted(),c.innerHTML=d,a.renderEnded(b),!0):!1};e=gd.prototype;e.fetchStarted=function(a){this.i=z(this.a,Ha(this.getName()),null,this);this.r=a};e.getContentUrl=function(){return this.r};e.fetchEnded=function(){z(this.a,Ia(this.getName()),null,this,this.i)};
e.renderStarted=function(){this.g=z(this.a,Ja(this.getName()),null,this)};e.renderEnded=function(a){z(this.a,Ka(this.getName()),null,this,this.g);rc(this.c,function(b){Zc(b,a)})};var id=function(){this.a={};this.b={};this.c=C()},jd=function(a,b,c,d){if(!n(b)||0>=b.length||!c)return null;b in a.a||(a.a[b]=[]);c=new gd(b,a.a[b].length,c,d);d=c.getSlotId().getDomId();if(a.b[d])return B(a.c,cb(d)),null;a.a[b].push(c);return a.b[c.getSlotId().getDomId()]=c};id.prototype.d=function(a,b){var c=b||0,d=n(a)&&this.a[a]||[];return 0<=c&&c<d.length&&(d=d[c],d.getSlotId().getInstance()==c)?d:null};
var kd=function(a,b){return Ac(a.a,function(a){return 0<=qc(a,b)})},V=function(){var a=s();return a.slot_manager_instance||(a.slot_manager_instance=new id)},W=function(a,b,c){var d=V();return d&&jd(d,a,b,c)};t("defineOutOfPageSlot",function(a,b){var c=V();return c?(c=jd(c,a,[1,1],b))?(c.s=!0,c):null:null});t("defineSlot",W);t("defineUnit",W);id.prototype.find=id.prototype.d;id.getInstance=V;var ld=function(a){var b=C();if(n(a)){var c;c=V();if(c=c.b[a]?c.b[a]:null)if(c.j&&!c.hasWrapperDiv())A(c.a,$a(c.h,c.b.getDomId()),null,c);else for(a=0;a<c.c.length;++a)c.c[a].b&&c.c[a].n(c);else B(b,bb(String(a)))}else B(b,ab(String(a)))};t("display",ld,!0);var md=null,nd=Fc||Gc||Ec||"function"==typeof h.atob;var od=/#|$/,pd=function(a,b){var c=a.search(od),d;t:{d=0;for(var g=b.length;0<=(d=a.indexOf(b,d))&&d<c;){var f=a.charCodeAt(d-1);if(38==f||63==f)if(f=a.charCodeAt(d+g),!f||61==f||38==f||35==f)break t;d+=g+1}d=-1}if(0>d)return null;g=a.indexOf("&",d);if(0>g||g>c)g=c;d+=b.length+1;return decodeURIComponent(a.substr(d,g-d).replace(/\+/g," "))};var rd=function(a,b,c){if(!n(a)||0>=a.length||!Boolean(b)||!c)B(C(),db(String(a),String(b),String(c)));else{var d=qd++;this.a=new gd(a,d,b);this.a.addService(c);this.b=c}},qd=1;e=rd.prototype;e.setClickUrl=function(a){this.a.setClickUrl(a);return this};e.setTargeting=function(a,b){this.a.setTargeting(a,b);return this};e.setAudExtId=function(a){Q(a)&&(this.a.l=a);return this};e.setTagForChildDirectedTreatment=function(a){this.a.setTagForChildDirectedTreatment(a);return this};
e.display=function(){sd(this.b,this.a)};var X=function(){T.call(this);this.f=!1;this.a=null;this.F=0;this.l=-1;this.m={};this.k={};this.v=[];this.D=this.s="";this.J=!1;this.H=!0;this.g=this.G=!1;this.c=!0;this.p=this.h=this.I=!1;this.d=[];this.i=[];this.j=[];this.w=!1;this.A={};this.r=!1;this.u=-1;this.K=this.L="";this.q=[];null!==pd(window.location.href,"google_force_safeframe_image")&&this.q.push("108809020")};fa(X,T);
var td={adsense_ad_format:"google_ad_format",adsense_ad_types:"google_ad_type",adsense_allow_expandable_ads:"google_allow_expandable_ads",adsense_background_color:"google_color_bg",adsense_bid:"google_bid",adsense_border_color:"google_color_border",adsense_channel_ids:"google_ad_channel",adsense_content_section:"google_ad_section",adsense_cpm:"google_cpm",adsense_ed:"google_ed",adsense_encoding:"google_encoding",adsense_family_safe:"google_safe",adsense_feedback:"google_feedback",adsense_flash_version:"google_flash_version",
adsense_font_face:"google_font_face",adsense_font_size:"google_font_size",adsense_hints:"google_hints",adsense_host:"google_ad_host",adsense_host_channel:"google_ad_host_channel",adsense_host_tier_id:"google_ad_host_tier_id",adsense_keyword_type:"google_kw_type",adsense_keywords:"google_kw",adsense_line_color:"google_line_color",adsense_link_color:"google_color_link",adsense_relevant_content:"google_contents",adsense_reuse_colors:"google_reuse_colors",adsense_targeting:"google_targeting",adsense_targeting_types:"google_targeting",
adsense_test_mode:"google_adtest",adsense_text_color:"google_color_text",adsense_ui_features:"google_ui_features",adsense_ui_version:"google_ui_version",adsense_url_color:"google_color_url",alternate_ad_iframe_color:"google_alternate_color",alternate_ad_url:"google_alternate_ad_url",demographic_age:"google_cust_age",demographic_ch:"google_cust_ch",demographic_gender:"google_cust_gender",demographic_interests:"google_cust_interests",demographic_job:"google_cust_job",demographic_l:"google_cust_l",demographic_lh:"google_cust_lh",
demographic_u_url:"google_cust_u_url",demographic_unique_id:"google_cust_id",document_language:"google_language",geography_override_city:"google_city",geography_override_country:"google_country",geography_override_region:"google_region",page_url:"google_page_url"};e=X.prototype;e.set=function(a,b){n(a)&&0<a.length?(this.m[a]=b,z(this.log,kb(a,String(b),this.getName()),this,null)):A(this.log,lb(String(a),String(b),this.getName()),this,null);return this};e.get=function(a){return this.m[a]};
e.getAttributeKeys=function(){var a=[];r(this.m,function(b,c){a.push(c)});return a};e.display=function(a,b,c,d){this.enable();a=c?W(a,b,c):W(a,b);a.addService(this);d&&a.setClickUrl(d);ld(a.getSlotId().getDomId())};
e.C=function(){if(this.c){if(!this.f){var a=document,b=a.createElement("script");U();b.async=!0;b.type="text/javascript";b.src=ud();(a=a.getElementsByTagName("head")[0]||a.getElementsByTagName("body")[0])?(z(this.log,tb("GPT PubAds"),this),a.appendChild(b),this.f=!0):B(this.log,ub("GPT PubAds"),this)}}else vd(this)};e.getName=function(){return"publisher_ads"};
var ud=function(){return Qc()+"//partner.googleadservices.com/gpt/pubads_impl_40.js"},vd=function(a){var b=U();a.f||b.b||(b=document,a.f=!0,b.write('<script type="text/javascript" src="'+Pc(ud())+'">\x3c/script>'))};
X.prototype.fillSlot=function(a){z(this.log,xb());this.a.fillSlot(a);this.A[a.getName()]=!0;if(this.a)if(this.w)(a=this.getSlots()[0])&&a.getName()in this.A&&(this.refresh(),this.w=!1);else for(a=0;a<this.j.length;a++){var b=this.j[a];b[0].getName()in this.A&&(this.refresh(b),L.splice.call(this.j,a,1),a--)}else B(this.log,wb(),this)};
X.prototype.onGoogleAdsJsLoad=function(a){this.a=a;z(this.log,vb("GPT"),this);this.a.setCookieOptions(this.F);this.a.setTagForChildDirectedTreatment(this.l);this.a.setCenterAds(this.I);this.H||this.a.disableFetch();this.h&&this.a.collapseEmptyDivs(this.p);if(this.g){this.c?this.a.enableAsyncSingleRequest():this.a.enableSingleRequest();wd(this);a=this.getSlots();for(var b=0;b<a.length;++b)xd(this,a[b])}else this.c&&this.a.enableAsyncRendering();this.G&&this.a.disableInitialLoad();yd(this);zd(this);
if(0<this.d.length)for(b=0;b<this.d.length;++b)this.n(this.d[b]);if(0<this.i.length)for(b=0;b<this.i.length;++b)sd(this,this.i[b])};X.prototype.B=function(a){this.c||(a.j=!1);T.prototype.B.call(this,a)};
X.prototype.n=function(a){if(U().b&&!this.c)B(this.log,yb(),this);else if(this.a)wd(this),xd(this,a)&&this.fillSlot(a);else if(this.c||this.f&&0==this.d.length){for(var b=!1,c=0;c<this.d.length;++c)a===this.d[c]&&(b=!0);b||(z(this.log,zb(a.getName(),"GPT"),this,a),this.d.push(a))}else B(this.log,Bb(a.getName()),this,a)};
var xd=function(a,b){if(a.a&&null==a.a.addSlot(b))return B(a.log,Cb(b.getName()),a,b),!1;for(var c=b.getAttributeKeys(),d=0;d<c.length;++d)c[d]in td?a.a.addAdSenseSlotAttribute(b,td[c[d]],String(b.get(c[d]))):A(a.log,Eb(String(c[d]),String(b.get(c[d])),b.getName()),a,b);return!0},wd=function(a){if(!a.J){a.J=!0;for(var b=a.getAttributeKeys(),c=0;c<b.length;++c)b[c]in td?a.a.addAdSensePageAttribute(td[b[c]],String(a.get(b[c]))):A(a.log,Db(String(b[c]),String(a.get(b[c]))),a);a.a.addAdSensePageAttribute("google_tag_info",
"v2");r(a.k,function(a,b){if(m(a))for(var c=0;c<a.length;++c)this.a.addAttribute(b,a[c])},a);rc(a.v,function(a){this.a.addPageCategoryExclusion(a)},a);a.a.setPublisherProvidedId(a.D);a.s&&a.a.setLocation(a.s);rc(a.q,function(a){this.a.setApiExperiment(a)},a)}};e=X.prototype;e.setCookieOptions=function(a){if(!Q(a))return A(this.log,Fb(String(a)),this),this;this.F=a;this.a&&this.a.setCookieOptions(a);return this};
e.setTagForChildDirectedTreatment=function(a){if(0!==a&&1!==a)return A(this.log,gc(String(a)),this),this;this.l=a;this.a&&this.a.setTagForChildDirectedTreatment(a);return this};e.clearTagForChildDirectedTreatment=function(){this.l=-1;this.a&&this.a.setTagForChildDirectedTreatment(-1);return this};
e.setTargeting=function(a,b){var c=null;n(b)?c=[b]:m(b)?c=b:aa(b)&&(c=vc(b));var d=c?c.join():String(b);if(!n(a)||za(null==a?"":String(a))||!c)return A(this.log,fc(String(a),d,this.getName()),this),this;this.k[a]=c;z(this.log,ec(a,d,this.getName()),this);if(this.a)for(this.a.clearAttribute(a),d=0;d<c.length;++d)this.a.addAttribute(a,c[d]);return this};
e.clearTargeting=function(a){if(!n(a)||za(null==a?"":String(a)))return A(this.log,$b(String(a),this.getName()),this),this;if(!this.k[a])return A(this.log,ac(a,this.getName()),this),this;delete this.k[a];z(this.log,Zb(a,this.getName()),this);this.a&&this.a.clearAttribute(a);return this};e.setCategoryExclusion=function(a){if(!n(a)||za(null==a?"":String(a)))return A(this.log,cc(),this),this;var b=this.v;0<=qc(b,a)||b.push(a);z(this.log,bc(a),this);this.a&&this.a.addPageCategoryExclusion(a);return this};
e.clearCategoryExclusions=function(){this.v=[];z(this.log,dc(),this);this.a&&this.a.clearPageCategoryExclusions();return this};e.noFetch=function(){this.a?A(this.log,Hb("noFetch","pubads"),this):this.H=!1};e.disableInitialLoad=function(){this.a?A(this.log,Hb("disableInitialLoad","pubads"),this):this.G=!0};e.enableSingleRequest=function(){this.b&&!this.g?A(this.log,Gb("enableSingleRequest"),this):(z(this.log,Jb("single request"),this),this.g=!0);return this.g};
e.enableAsyncRendering=function(){this.b&&!this.c?A(this.log,Gb("enableAsyncRendering"),this):(z(this.log,Jb("asynchronous rendering"),this),this.c=!0);return this.c};e.enableSyncRendering=function(){if(this.b&&this.c)A(this.log,Gb("enableSyncRendering"),this);else{z(this.log,Jb("synchronous rendering"),this);this.c=!1;for(var a=this.getSlots(),b=0;b<a.length;++b)a[b].j=!1}return!this.c};e.setCentering=function(a){z(this.log,Kb("centering",String(a)),this);this.I=a};
e.setPublisherProvidedId=function(a){this.b?A(this.log,Ib("setPublisherProvidedId",a),this):(z(this.log,Kb("PPID",a),this),this.D=a);return this};e.definePassback=function(a,b){return new rd(a,b,this)};var sd=function(a,b){vd(a);a.a?a.a.passback(b):(z(a.log,Ab(b.getName(),"GPT"),a,b),a.i.push(b))};e=X.prototype;
e.refresh=function(a){if(a&&!m(a))A(this.log,Tb("Slots to refresh"),this);else{var b=null;if(a&&(b=Ad(this,a),!b.length)){B(this.log,Lb("Refresh"),this);return}this.a?(z(this.log,Qb(),this),this.a.refresh(b)):this.g?(z(this.log,Pb(),this),b?(a=this.j,0<=qc(a,b)||a.push(b)):this.w=!0):A(this.log,Mb(),this)}};
e.videoRefresh=function(a,b,c,d,g,f){if(a&&!m(a))A(this.log,Tb("Slot list"),this);else if(b&&!p(b))A(this.log,K("Correlator"),this);else if(c&&!p(c))A(this.log,K("Pod number"),this);else if(d&&!p(d))A(this.log,K("Pod position"),this);else if(g&&!ba(g))A(this.log,Ub("Persistent roadblocks only"),this);else if(f&&!ba(f))A(this.log,Ub("Clear unfilled slots"),this);else if(this.a){var l=null;if(a&&(l=Ad(this,a),!l.length)){B(this.log,Lb("refresh"),this);return}z(this.log,Qb(),this);this.a.refresh(l,b,
c,d,g,f)}else A(this.log,Mb(),this)};e.enableVideoAds=function(){this.r=!0;yd(this)};e.setVideoContent=function(a,b){this.r=!0;this.L=a;this.K=b;yd(this)};e.getVideoContent=function(){return this.a?this.a.getVideoContentInformation():null};var yd=function(a){a.r&&a.a&&a.a.setVideoContentInformation(a.L,a.K)},zd=function(a){a.a&&a.a.setCorrelator(-1==a.u?void 0:a.u)};e=X.prototype;e.getCorrelator=function(){return 0==this.getSlots().length?"not_available":this.a?this.a.getCorrelator():"not_loaded"};
e.setCorrelator=function(a){if(!Q(a)||0===a)return A(this.log,lc(String(a)),this),this;this.u=a;zd(this);return this};e.getVideoStreamCorrelator=function(){if(!this.a)return 0;var a=this.a.getVideoStreamCorrelator();return isNaN(a)?0:a};e.isAdRequestFinished=function(){return this.a?this.a.isAdRequestFinished():!1};e.isSlotAPersistentRoadblock=function(a){return this.a?this.a.isSlotAPersistentRoadblock(a):!1};
e.collapseEmptyDivs=function(a){this.h?A(this.log,Xb(),this):this.b?A(this.log,Gb("collapseEmptyDivs"),this):(this.p=Boolean(a),z(this.log,Wb(String(this.p)),this),this.h=!0);return this.h};e.clear=function(a){if(!this.a)return A(this.log,Ob(),this),!1;var b=null;if(a&&(b=Ad(this,a),0==b.length))return B(this.log,Lb("Clear"),this),!1;z(this.log,Rb(),this);return this.a.clearSlotContents(b)};
e.clearNoRefreshState=function(){this.a?(z(this.log,Sb(),this),this.a.clearNoRefreshState()):A(this.log,Nb(),this)};
e.setLocation=function(a,b,c){var d="role:1 producer:12";if(void 0!==b){if(!p(a))return A(this.log,K("Latitude")),this;if(!p(b))return A(this.log,K("Longitude")),this;d+=" latlng{ latitude_e7: "+Math.round(1E7*a)+" longitude_e7: "+Math.round(1E7*b)+"}";if(void 0!==c){if(isNaN(c))return A(this.log,K("Radius")),this;d+=" radius:"+Math.round(c)}}else 50<a.length&&(b=a.substring(0,50),A(this.log,Vb(String(a),"50",b)),a=b),d+=' loc:"'+a+'"';if(nd)d=h.btoa(d);else{a=d;d=[];for(c=b=0;c<a.length;c++){for(var g=
a.charCodeAt(c);255<g;)d[b++]=g&255,g>>=8;d[b++]=g}if(!aa(d))throw Error("encodeByteArray takes an array as a parameter");if(!md)for(md={},a=0;65>a;a++)md[a]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a);a=md;b=[];for(c=0;c<d.length;c+=3){var f=d[c],l=(g=c+1<d.length)?d[c+1]:0,w=c+2<d.length,E=w?d[c+2]:0,y=f>>2,f=(f&3)<<4|l>>4,l=(l&15)<<2|E>>6,E=E&63;w||(E=64,g||(l=64));b.push(a[y],a[f],a[l],a[E])}d=b.join("")}this.s="a "+d;return this};
e.getVersion=function(){return this.a?this.a.getVersion():void 0};e.forceExperiment=function(a){this.b?A(this.log,Ib("forceExperiment",a),this):this.q.push(a)};var Y=function(){var a=U(),b=ad(a,"publisher_ads");if(!b){var c=b=new X;a.a[c.getName()]=c}return b},Ad=function(a,b){for(var c=[],d=0;d<b.length;++d){var g=b[d];g instanceof gd?c.push(g):A(a.log,Yb(String(d)),a)}return c};t("pubads",Y);var Z=function(){T.call(this);this.m=!0;this.f=this.k=!1;this.h=0;this.j=this.i=void 0;this.l=this.g=!1;this.d={};this.a=!1;this.c={}};fa(Z,T);e=Z.prototype;e.set=function(a,b){n(a)&&0<a.length?(this.c[a]=b,z(this.log,kb(a,String(b),this.getName()),this,null)):A(this.log,lb(String(a),String(b),this.getName()),this,null);return this};e.get=function(a){return this.c[a]};e.getAttributeKeys=function(){var a=[];r(this.c,function(b,c){a.push(c)});return a};
e.display=function(a,b,c,d){this.enable();a=c?W(a,b,c):W(a,b);a.addService(this);d&&a.setClickUrl(d);ld(a.getSlotId().getDomId())};
e.C=function(){if(this.m){if(!this.l){var a=document,b=document.createElement("script");b.async=!0;b.type="text/javascript";b.src=Bd();try{var c=a.getElementsByTagName("script")[0];z(this.log,tb("GPT CompanionAds"),this);this.l=!0;c.parentNode&&c.parentNode.insertBefore(b,c)}catch(d){B(this.log,ub("GPT CompanionAds"),this)}}}else this.g||(h.document.write('<script type="text/javascript" src="'+Pc(Bd())+'">\x3c/script>'),this.g=!0)};e.enableSyncLoading=function(){this.m=!1};
e.setRefreshUnfilledSlots=function(a){ba(a)&&(this.k=a)};e.setClearUnfilledSlots=function(a){ba(a)&&(this.f=a)};e.notifyUnfilledSlots=function(a){if(this.k)Cd(this,Dd(this,a));else if(this.f){a=Dd(this,a);var b=Y();b.b?b.clear(a):B(this.log,qb("PubAds","clear"))}};e.isRoadblockingSupported=function(){var a=Y();if(!a.b)return!1;var a=a.getSlots(),b=this.getSlots();if(a.length!=b.length)return!1;for(var c=0;c<b.length;++c){for(var d=!1,g=0;g<a.length;++g)if(b[c]===a[g]){d=!0;break}if(!d)return!1}return!0};
e.refreshAllSlots=function(){this.k&&Cd(this,null)};e.setVideoSessionInfo=function(a,b,c,d,g,f,l){this.a=!1;this.h=0;this.j=this.i=void 0;this.h=a;void 0!==g&&(this.i=g);void 0!==f&&(this.j=f);void 0!==l&&(this.a=l)};e.setVideoSession=function(a,b,c,d){this.setVideoSessionInfo(a,"","","",b,c,d)};e.getDisplayAdsCorrelator=function(){return Y().getCorrelator()};e.getVideoStreamCorrelator=function(){return Y().getVideoStreamCorrelator()};
var Cd=function(a,b){var c=Y();if(c.b){if(a.a){if(!a.isRoadblockingSupported()){A(a.log,pb());return}c.clearNoRefreshState();c.clear()}c.videoRefresh(b,a.h,a.i,a.j,a.a,a.f)}else B(a.log,qb("PubAds","refresh"))};Z.prototype.isSlotAPersistentRoadblock=function(a){var b=Y();if(b.b&&kd(V(),a))return b.isSlotAPersistentRoadblock(a);B(this.log,rb());return!1};var Dd=function(a,b){for(var c=a.getSlotIdMap(),d=[],g=0;g<b.length;++g){var f=b[g];f in c?d.push(c[f]):A(a.log,sb(),a)}return d};
Z.prototype.getName=function(){return"companion_ads"};var Bd=function(){return Qc()+"//pagead2.googlesyndication.com/pagead/show_companion_ad.js"};Z.prototype.onImplementationLoaded=function(){z(this.log,vb("GPT CompanionAds"),this);this.g=!0};var Ed=function(a,b){var c=b&&b.getSlotId().getId();return c&&c in a.d&&b.hasWrapperDiv()&&a.b&&!a.isSlotAPersistentRoadblock(b)?(b.k=a.d[c],c=new Xc(b,a.getName()),hd(b,c)):!1};Z.prototype.n=function(a){Ed(this,a)};
Z.prototype.fillSlot=function(a,b){return kd(V(),a)&&n(b)&&0<b.length?(this.d[a.getSlotId().toString()]=b,Ed(this,a)):!1};t("companionAds",function(){var a=U(),b=ad(a,"companion_ads");if(!b){var c=b=new Z;a.a[c.getName()]=c}return b});var $=function(){T.call(this);this.a={};this.c={}};fa($,T);e=$.prototype;e.getName=function(){return"content"};e.set=function(a,b){n(a)&&0<a.length?(this.a[a]=b,z(this.log,kb(a,String(b),this.getName()),this,null)):A(this.log,lb(String(a),String(b),this.getName()),this,null);return this};e.get=function(a){return this.a[a]};e.getAttributeKeys=function(){var a=[];r(this.a,function(b,c){a.push(c)});return a};
e.display=function(a,b,c,d){this.enable();a=c?W(a,b,c):W(a,b);a.addService(this);d&&a.setClickUrl(d);ld(a.getSlotId().getDomId())};var Fd=function(a,b){var c=b&&b.getSlotId().getId();c in a.c&&a.b&&b.hasWrapperDiv()&&!b.g&&(b.k=a.c[c],c=new Xc(b,a.getName()),hd(b,c))};$.prototype.C=function(){for(var a=this.getSlots(),b=0;b<a.length;++b)Fd(this,a[b])};$.prototype.n=function(a){Fd(this,a)};$.prototype.setContent=function(a,b){kd(V(),a)&&n(b)&&0<b.length&&(this.c[a.getSlotId().getId()]=b,Fd(this,a))};
t("content",function(){var a=U(),b=ad(a,"content");if(!b){var c=b=new $;a.a[c.getName()]=c}return b});var Gd=function(){var a=window,b=document;if(s()._pubconsole_disable_)return!1;var c;c=document.cookie.split("google_pubconsole=");if(c=2==c.length?c[1].split(";")[0]:"")if(c=c.split("|"),0<c.length&&("1"==c[0]||"0"==c[0]))return!0;U();c=!1;try{c=a.top.document.URL===b.URL}catch(d){}a=c?b.URL:b.referrer;return null!==pd(a,"google_debug")||null!==pd(a,"google_console")||null!==pd(a,"google_force_console")||null!==pd(a,"googfc")},Hd=function(){if(Gd()){var a=document,b=a.createElement("script");b.type=
"text/javascript";b.src=Qc()+"//publisherconsole.appspot.com/js/loader.js";b.async=!0;(a=a.getElementsByTagName("script")[0])&&a.parentNode&&a.parentNode.insertBefore(b,a)}};"complete"===document.readyState?Hd():Ba(window,Hd);t("disablePublisherConsole",function(){s()._pubconsole_disable_=!0});var Id=function(){this.c=[];this.b=!1;this.a=C()};Id.prototype.addSize=function(a,b){if(!Rc(a))return this.b=!0,A(this.a,hb(String(a))),this;var c;if(c=!Rc(b))c=!(m(b)&&tc(b,Rc));if(c)return this.b=!0,A(this.a,gb(String(b))),this;this.c.push([a,b]);return this};Id.prototype.build=function(){if(this.b)return A(this.a,ib()),null;zc(this.c);return this.c};
var yc=function(a,b){var c;t:{c=b[0];for(var d=a[0],g=wc,f=Math.min(c.length,d.length),l=0;l<f;l++){var w=g(c[l],d[l]);if(0!=w){c=w;break t}}c=wc(c.length,d.length)}return c};t("sizeMapping",function(){return new Id});t("getVersion",function(){return"40"});var Jd=s().cmd;if(!Jd||m(Jd)){var Kd=s().cmd=new mc;Jd&&0<Jd.length&&Kd.push.apply(Kd,Jd)}(function(){var a=document.getElementsByTagName("script");0<a.length&&(a=a[a.length-1],a.src&&0<=a.src.indexOf("/tag/js/gpt.js")&&a.innerHTML&&!a.googletag_executed&&(a.googletag_executed=!0,eval(a.innerHTML)))})();})()
;
(function ($) {
  Drupal.behaviors.commerceKickstartDfpAdmin = {
    attach: function (context, settings) {
      // Setting the variables from dfp_settings array.
      var dfpSelector = Drupal.settings.dfp.dfp_selector;
      var dfpClass = Drupal.settings.dfp.dfp_class;
      var dfpPosition = Drupal.settings.dfp.dfp_position;
      var dfpHeight = parseInt(Drupal.settings.dfp.dfp_height);
      var dfpWidth = parseInt(Drupal.settings.dfp.dfp_width);
      var dfpId = Drupal.settings.dfp.dfp_id;
      var dfpUnit = Drupal.settings.dfp.dfp_unit;

      // Wrapping titles for header placement consistency between standard and overlay.
      $('.page-admin-commerce-orders h1:not(#overlay-content h1, #page h1, #title-wrapper h1)').wrap('<div id="title-wrapper" />');
      $('.page-admin-commerce-products h1:not(#overlay-content h1, #page h1, #title-wrapper h1)').wrap('<div id="title-wrapper" />');
      $('.page-admin-commerce-customer-profiles h1:not(#overlay-content h1, #page h1, #title-wrapper h1)').wrap('<div id="title-wrapper" />');

      // DFP placement script.
      $(dfpSelector, context).once('commerce-kickstart-dfp', function () {
        if (typeof googletag != 'undefined') {
          var slot = $('<div id="dfp-wrapper"><div id="' + dfpId + '" class="dfp-unit ' + dfpClass.join(' ') + '"></div></div>');
          if (dfpPosition == 'before') {
            $(this).prepend(slot);
          } else {
            $(this).append(slot);
          }
          googletag.cmd.push(function() {
            googletag.defineSlot('/17601239/' + dfpUnit, [dfpWidth, dfpHeight], dfpId).addService(googletag.pubads());
            googletag.pubads().enableSingleRequest();
            googletag.enableServices();
          });
          googletag.display(dfpId);
        }
      });
    }
  };
})(jQuery);
;
(function ($) {

Drupal.toolbar = Drupal.toolbar || {};

/**
 * Attach toggling behavior and notify the overlay of the toolbar.
 */
Drupal.behaviors.toolbar = {
  attach: function(context) {

    // Set the initial state of the toolbar.
    $('#toolbar', context).once('toolbar', Drupal.toolbar.init);

    // Toggling toolbar drawer.
    $('#toolbar a.toggle', context).once('toolbar-toggle').click(function(e) {
      Drupal.toolbar.toggle();
      // Allow resize event handlers to recalculate sizes/positions.
      $(window).triggerHandler('resize');
      return false;
    });
  }
};

/**
 * Retrieve last saved cookie settings and set up the initial toolbar state.
 */
Drupal.toolbar.init = function() {
  // Retrieve the collapsed status from a stored cookie.
  var collapsed = $.cookie('Drupal.toolbar.collapsed');

  // Expand or collapse the toolbar based on the cookie value.
  if (collapsed == 1) {
    Drupal.toolbar.collapse();
  }
  else {
    Drupal.toolbar.expand();
  }
};

/**
 * Collapse the toolbar.
 */
Drupal.toolbar.collapse = function() {
  var toggle_text = Drupal.t('Show shortcuts');
  $('#toolbar div.toolbar-drawer').addClass('collapsed');
  $('#toolbar a.toggle')
    .removeClass('toggle-active')
    .attr('title',  toggle_text)
    .html(toggle_text);
  $('body').removeClass('toolbar-drawer').css('paddingTop', Drupal.toolbar.height());
  $.cookie(
    'Drupal.toolbar.collapsed',
    1,
    {
      path: Drupal.settings.basePath,
      // The cookie should "never" expire.
      expires: 36500
    }
  );
};

/**
 * Expand the toolbar.
 */
Drupal.toolbar.expand = function() {
  var toggle_text = Drupal.t('Hide shortcuts');
  $('#toolbar div.toolbar-drawer').removeClass('collapsed');
  $('#toolbar a.toggle')
    .addClass('toggle-active')
    .attr('title',  toggle_text)
    .html(toggle_text);
  $('body').addClass('toolbar-drawer').css('paddingTop', Drupal.toolbar.height());
  $.cookie(
    'Drupal.toolbar.collapsed',
    0,
    {
      path: Drupal.settings.basePath,
      // The cookie should "never" expire.
      expires: 36500
    }
  );
};

/**
 * Toggle the toolbar.
 */
Drupal.toolbar.toggle = function() {
  if ($('#toolbar div.toolbar-drawer').hasClass('collapsed')) {
    Drupal.toolbar.expand();
  }
  else {
    Drupal.toolbar.collapse();
  }
};

Drupal.toolbar.height = function() {
  var $toolbar = $('#toolbar');
  var height = $toolbar.outerHeight();
  // In modern browsers (including IE9), when box-shadow is defined, use the
  // normal height.
  var cssBoxShadowValue = $toolbar.css('box-shadow');
  var boxShadow = (typeof cssBoxShadowValue !== 'undefined' && cssBoxShadowValue !== 'none');
  // In IE8 and below, we use the shadow filter to apply box-shadow styles to
  // the toolbar. It adds some extra height that we need to remove.
  if (!boxShadow && /DXImageTransform\.Microsoft\.Shadow/.test($toolbar.css('filter'))) {
    height -= $toolbar[0].filters.item("DXImageTransform.Microsoft.Shadow").strength;
  }
  return height;
};

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
