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
(function ($) {
   Drupal.behaviors.ws_gpo = {
    scriptadded: false,

    attach: function (context, settings) {
      $('a.service-links-google-plus-one', context).once(function(){
        var g_text = document.createElement('g:plusone');

        g_text.setAttribute('href', $(this).attr('href'));
        g_text.setAttribute('width', Drupal.settings.ws_gpo.width);

        if (Drupal.settings.ws_gpo.size != '') {
          g_text.setAttribute('size', Drupal.settings.ws_gpo.size);
        }
        if (Drupal.settings.ws_gpo.annotation != '') {
          g_text.setAttribute('annotation', Drupal.settings.ws_gpo.annotation);
        }
        if (Drupal.settings.ws_gpo.callback) {
          g_text.setAttribute('callback', Drupal.settings.ws_gpo.callback);
        }

        $(this).replaceWith(g_text);
      });

      if (this.scriptadded) {
        gapi.plusone.go();
      } else {
        var params = { parsetags: "explicit" };

        if (Drupal.settings.ws_gpo.lang != '') {
          params.lang = Drupal.settings.ws_gpo.lang;
        }

        window.___gcfg = params

        $.ajax({
          url: "https://apis.google.com/js/plusone.js",
          dataType: "script",
          cache: true,
          success: function () {
            this.scriptadded = true;
            gapi.plusone.go();
          }
        });
      }
    }  
  }
})(jQuery);
;
(function ($) {
  Drupal.behaviors.ws_tb ={
    scriptadded: false,

    attach: function(context, settings) {
      if (this.scriptadded) {
        twttr.widgets.load();
      } else {
        $('a.service-links-twitter-widget', context).each(function(){
          $(this).attr('href', $(this).attr('href').replace(/((?:counturl\=|^))http[s]*\%3A\/\//g, "$1"));
        });
        $.getScript(window.location.protocol + '//platform.twitter.com/widgets.js', function () {
          this.scriptadded = true;
        });
      }
    }
  }
})(jQuery);
;
(function ($) {
  Drupal.behaviors.ws_fl = {
    attach: function (context, settings) {
      $('a.service-links-facebook-like', context).each(function(){
        var iframe = document.createElement('iframe');

        iframe.src = $(this).attr('href').replace('http://', '//');
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('frameborder', 0);
        iframe.setAttribute('allowTransparency', 'true');

        $(iframe).css({
          'border': 'none',
          'overflow': 'hidden',
          'width': Drupal.settings.ws_fl.width + 'px',
          'height': Drupal.settings.ws_fl.height + 'px',
        });
       
        $(iframe).addClass($(this).attr('class'));

        $(this).replaceWith(iframe);
      });
    }
  }
})(jQuery);
;
/*
 *
 * Copyright (c) 2006-2011 Sam Collett (http://www.texotela.co.uk)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * 
 * Version 1.3
 * Demo: http://www.texotela.co.uk/code/jquery/numeric/
 *
 */
(function($) {
  /*
 * Allows only valid characters to be entered into input boxes.
 * Note: fixes value when pasting via Ctrl+V, but not when using the mouse to paste
  *      side-effect: Ctrl+A does not work, though you can still use the mouse to select (or double-click to select all)
 *
 * @name     numeric
 * @param    config      { decimal : "." , negative : true }
 * @param    callback     A function that runs if the number is not valid (fires onblur)
 * @author   Sam Collett (http://www.texotela.co.uk)
 * @example  $(".numeric").numeric();
 * @example  $(".numeric").numeric(","); // use , as separater
 * @example  $(".numeric").numeric({ decimal : "," }); // use , as separator
 * @example  $(".numeric").numeric({ negative : false }); // do not allow negative values
 * @example  $(".numeric").numeric(null, callback); // use default values, pass on the 'callback' function
 *
 */
  $.fn.numeric = function(config, callback)
  {
    if(typeof config === 'boolean')
    {
      config = {
        decimal: config
      };
    }
    config = config || {};
    // if config.negative undefined, set to true (default is to allow negative numbers)
    if(typeof config.negative == "undefined") config.negative = true;
    // set decimal point
    var decimal = (config.decimal === false) ? "" : config.decimal || ".";
    // allow negatives
    var negative = (config.negative === true) ? true : false;
    // callback function
    callback = (typeof callback == "function") ? callback : function(){};
    // set data and methods
    return this.data("numeric.decimal", decimal).data("numeric.negative", negative).data("numeric.callback", callback).keypress($.fn.numeric.keypress).keyup($.fn.numeric.keyup).blur($.fn.numeric.blur);
  }

  $.fn.numeric.keypress = function(e)
  {
    // get decimal character and determine if negatives are allowed
    var decimal = $.data(this, "numeric.decimal");
    var negative = $.data(this, "numeric.negative");
    // get the key that was pressed
    var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
    // allow enter/return key (only when in an input box)
    if(key == 13 && this.nodeName.toLowerCase() == "input")
    {
      return true;
    }
    else if(key == 13)
    {
      return false;
    }
    var allow = false;
    // allow Ctrl+A
    if((e.ctrlKey && key == 97 /* firefox */) || (e.ctrlKey && key == 65) /* opera */) return true;
    // allow Ctrl+X (cut)
    if((e.ctrlKey && key == 120 /* firefox */) || (e.ctrlKey && key == 88) /* opera */) return true;
    // allow Ctrl+C (copy)
    if((e.ctrlKey && key == 99 /* firefox */) || (e.ctrlKey && key == 67) /* opera */) return true;
    // allow Ctrl+Z (undo)
    if((e.ctrlKey && key == 122 /* firefox */) || (e.ctrlKey && key == 90) /* opera */) return true;
    // allow or deny Ctrl+V (paste), Shift+Ins
    if((e.ctrlKey && key == 118 /* firefox */) || (e.ctrlKey && key == 86) /* opera */
      || (e.shiftKey && key == 45)) return true;
    // if a number was not pressed
    if(key < 48 || key > 57)
    {
      /* '-' only allowed at start and if negative numbers allowed */
      if(this.value.indexOf("-") != 0 && negative && key == 45 && 
        (this.value.length == 0 || ($.fn.getSelectionStart(this)) == 0)) return true;
      /* only one decimal separator allowed */
      if(decimal && key == decimal.charCodeAt(0) && this.value.indexOf(decimal) != -1)
      {
        allow = false;
      }
      // check for other keys that have special purposes
      if(
        key != 8 /* backspace */ &&
        key != 9 /* tab */ &&
        key != 13 /* enter */ &&
        key != 35 /* end */ &&
        key != 36 /* home */ &&
        key != 37 /* left */ &&
        key != 39 /* right */ &&
        key != 46 /* del */
        )
        {
        allow = false;
      }
      else
      {
        // for detecting special keys (listed above)
        // IE does not support 'charCode' and ignores them in keypress anyway
        if(typeof e.charCode != "undefined")
        {
          // special keys have 'keyCode' and 'which' the same (e.g. backspace)
          if(e.keyCode == e.which && e.which != 0)
          {
            allow = true;
            // . and delete share the same code, don't allow.
            // (will be set to true later if it is the decimal point)
            if(e.which == 46) allow = false;
          }
          // or keyCode != 0 and 'charCode'/'which' = 0
          else if(e.keyCode != 0 && e.charCode == 0 && e.which == 0)
          {
            allow = true;
          }
        }
      }
      // if key pressed is the decimal and it is not already in the field
      if(decimal && key == decimal.charCodeAt(0))
      {
        if(this.value.indexOf(decimal) == -1)
        {
          allow = true;
        }
        else
        {
          allow = false;
        }
      }
    }
    else
    {
      allow = true;
    }
    return allow;
  }

  $.fn.numeric.keyup = function(e)
  {
    var val = this.value;
    if(val.length > 0)
    {
      // get carat (cursor) position
      var carat = $.fn.getSelectionStart(this);
      // get decimal character and determine if negatives are allowed
      var decimal = $.data(this, "numeric.decimal");
      var negative = $.data(this, "numeric.negative");
		
      // prepend a 0 if necessary
      if(decimal != "")
      {
        // find decimal point
        var dot = val.indexOf(decimal);
        // if dot at start, add 0 before
        if(dot == 0)
        {
          this.value = "0" + val;
        }
        // if dot at position 1, check if there is a - symbol before it
        if(dot == 1 && val.charAt(0) == "-")
        {
          this.value = "-0" + val.substring(1);
        }
        val = this.value;
      }
		
      // if pasted in, only allow the following characters
      var validChars = [0,1,2,3,4,5,6,7,8,9,'-',decimal];
      // get length of the value (to loop through)
      var length = val.length;
      // loop backwards (to prevent going out of bounds)
      for(var i = length - 1; i >= 0; i--)
      {
        var ch = val.charAt(i);
        // remove '-' if it is in the wrong place
        if(i != 0 && ch == "-")
        {
          val = val.substring(0, i) + val.substring(i + 1);
        }
        // remove character if it is at the start
        // a '-' and negatives aren't allowed
        else if(i == 0 && !negative && ch == "-")
        {
          val = val.substring(1);
        }
        var validChar = false;
        // loop through validChars
        for(var j = 0; j < validChars.length; j++)
        {
          // if it is valid, break out the loop
          if(ch == validChars[j])
          {
            validChar = true;
            break;
          }
        }
        // if not a valid character, or a space, remove
        if(!validChar || ch == " ")
        {
          val = val.substring(0, i) + val.substring(i + 1);
        }
      }
      // remove extra decimal characters
      var firstDecimal = val.indexOf(decimal);
      if(firstDecimal > 0)
      {
        for(var i = length - 1; i > firstDecimal; i--)
        {
          var ch = val.charAt(i);
          // remove decimal character
          if(ch == decimal)
          {
            val = val.substring(0, i) + val.substring(i + 1);
          }
        }
      }
      // set the value and prevent the cursor moving to the end
      this.value = val;
      $.fn.setSelection(this, carat);
    }
  }

  $.fn.numeric.blur = function()
  {
    var decimal = $.data(this, "numeric.decimal");
    var callback = $.data(this, "numeric.callback");
    var val = this.value;
    if(val != "")
    {
      var re = new RegExp("^\\d+$|\\d*" + decimal + "\\d+");
      if(!re.exec(val))
      {
        callback.apply(this);
      }
    }
  }

  $.fn.removeNumeric = function()
  {
    return this.data("numeric.decimal", null).data("numeric.negative", null).data("numeric.callback", null).unbind("keypress", $.fn.numeric.keypress).unbind("blur", $.fn.numeric.blur);
  }

  // Based on code from http://javascript.nwbox.com/cursor_position/
  // (Diego Perini <dperini@nwbox.com>)
  $.fn.getSelectionStart = function(o)
  {
    if (o.createTextRange)
    {
      var r = document.selection.createRange().duplicate();
      r.moveEnd('character', o.value.length);
      if (r.text == '') return o.value.length;
      return o.value.lastIndexOf(r.text);
    } else return o.selectionStart;
  }

  // set the selection
  // o is the object (input)
  // p is the position ([start, end] or just start)
  $.fn.setSelection = function(o, p)
  {
    // if p is number, start and end are the same
    if(typeof p == "number") p = [p, p];
    // only set if p is an array of length 2
    if(p && p.constructor == Array && p.length == 2)
    {
      if (o.createTextRange)
      {
        var r = o.createTextRange();
        r.collapse(true);
        r.moveStart('character', p[0]);
        r.moveEnd('character', p[1]);
        r.select();
      }
      else if(o.setSelectionRange)
      {
        o.focus();
        o.setSelectionRange(p[0], p[1]);
      }
    }
  }

})(jQuery);;
(function($) {
  Drupal.behaviors.search_api_ranges = {
    attach: function(context, settings) {

      var submitTimeout = '';

      $('div.search-api-ranges-widget').each(function() {

        var widget = $(this);
        var slider = widget.find('div.range-slider');
        var rangeMin = widget.find('input[name=range-min]');
        var rangeMax = widget.find('input[name=range-max]');
        var rangeFrom = widget.find('input[name=range-from]');
        var rangeTo = widget.find('input[name=range-to]');

        slider.slider({
          range: true,
          animate: true,
          step: 1,
          min: parseInt(rangeMin.val()),
          max: parseInt(rangeMax.val()),
          values: [parseInt(rangeFrom.val()), parseInt(rangeTo.val())],

          // on change: when clicking somewhere in the bar
          change: function(event, ui) {
            widget.find('input[name=range-from]').val(ui.values[0]);
            widget.find('input[name=range-to]').val(ui.values[1]);
          },

          // on slide: when sliding with the controls
          slide: function(event, ui) {
            widget.find('input[name=range-from]').val(ui.values[0]);
            widget.find('input[name=range-to]').val(ui.values[1]);
          }
        });

        // submit once user stops changing values
        slider.bind('slidestop', function(event, ui) {
          clearTimeout(submitTimeout);
          delaySubmit(widget);
        });

        rangeFrom.numeric();
        rangeFrom.bind('keyup', function() {
          clearTimeout(submitTimeout);
          if (!isNaN(rangeFrom.val()) && rangeFrom.val() !== '') {
            var value = parseInt(rangeFrom.val());
            if (value > parseInt(rangeTo.val())) {
              value = parseInt(rangeTo.val());
            }
            slider.slider("option", "values", [value, parseInt(rangeTo.val())]);
            delaySubmit(widget);
          }
        });

        rangeTo.numeric();
        rangeTo.bind('keyup', function() {
          clearTimeout(submitTimeout);
          if (!isNaN(rangeTo.val()) && rangeTo.val() !== '') {
            var value = parseInt(rangeTo.val());
            if (value < parseInt(rangeFrom.val())) {
              value = parseInt(rangeFrom.val());
            }
            slider.slider("option", "values", [parseInt(rangeFrom.val()), value]);
            delaySubmit(widget);
          }
        });
      });

      function delaySubmit(widget) {
        var autoSubmitDelay = widget.find('input[name=delay]').val();
        if (autoSubmitDelay != undefined && autoSubmitDelay != 0) {
          submitTimeout = setTimeout(function() {
            widget.find('form').submit();
          }, autoSubmitDelay);
        }
      };
    }
  };
})(jQuery);
;
(function ($) {

$(document).ready(function() {

  // Expression to check for absolute internal links.
  var isInternal = new RegExp("^(https?):\/\/" + window.location.host, "i");

  // Attach onclick event to document only and catch clicks on all elements.
  $(document.body).click(function(event) {
    // Catch the closest surrounding link of a clicked element.
    $(event.target).closest("a,area").each(function() {

      var ga = Drupal.settings.googleanalytics;
      // Expression to check for special links like gotwo.module /go/* links.
      var isInternalSpecial = new RegExp("(\/go\/.*)$", "i");
      // Expression to check for download links.
      var isDownload = new RegExp("\\.(" + ga.trackDownloadExtensions + ")$", "i");

      // Is the clicked URL internal?
      if (isInternal.test(this.href)) {
        // Skip 'click' tracking, if custom tracking events are bound.
        if ($(this).is('.colorbox')) {
          // Do nothing here. The custom event will handle all tracking.
        }
        // Is download tracking activated and the file extension configured for download tracking?
        else if (ga.trackDownload && isDownload.test(this.href)) {
          // Download link clicked.
          var extension = isDownload.exec(this.href);
          _gaq.push(["_trackEvent", "Downloads", extension[1].toUpperCase(), this.href.replace(isInternal, '')]);
        }
        else if (isInternalSpecial.test(this.href)) {
          // Keep the internal URL for Google Analytics website overlay intact.
          _gaq.push(["_trackPageview", this.href.replace(isInternal, '')]);
        }
      }
      else {
        if (ga.trackMailto && $(this).is("a[href^='mailto:'],area[href^='mailto:']")) {
          // Mailto link clicked.
          _gaq.push(["_trackEvent", "Mails", "Click", this.href.substring(7)]);
        }
        else if (ga.trackOutbound && this.href.match(/^\w+:\/\//i)) {
          if (ga.trackDomainMode == 2 && isCrossDomain(this.hostname, ga.trackCrossDomains)) {
            // Top-level cross domain clicked. document.location is handled by _link internally.
            event.preventDefault();
            _gaq.push(["_link", this.href]);
          }
          else {
            // External link clicked.
            _gaq.push(["_trackEvent", "Outbound links", "Click", this.href]);
          }
        }
      }
    });
  });

  // Colorbox: This event triggers when the transition has completed and the
  // newly loaded content has been revealed.
  $(document).bind("cbox_complete", function() {
    var href = $.colorbox.element().attr("href");
    if (href) {
      _gaq.push(["_trackPageview", href.replace(isInternal, '')]);
    }
  });

});

/**
 * Check whether the hostname is part of the cross domains or not.
 *
 * @param string hostname
 *   The hostname of the clicked URL.
 * @param array crossDomains
 *   All cross domain hostnames as JS array.
 *
 * @return boolean
 */
function isCrossDomain(hostname, crossDomains) {
  /**
   * jQuery < 1.6.3 bug: $.inArray crushes IE6 and Chrome if second argument is
   * `null` or `undefined`, http://bugs.jquery.com/ticket/10076,
   * https://github.com/jquery/jquery/commit/a839af034db2bd934e4d4fa6758a3fed8de74174
   *
   * @todo: Remove/Refactor in D8
   */
  if (!crossDomains) {
    return false;
  }
  else {
    return $.inArray(hostname, crossDomains) > -1 ? true : false;
  }
}

})(jQuery);
;
