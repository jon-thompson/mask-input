
(function ($) {
	$.fn.mask = function (options) {
		return this.each(function () {
			var elem = $(this),
				sneak = $('<input type="hidden" />'),				
				timeoutID = 0,
				settings = $.extend({
					'char': '\u25CF',
					'delay': 100
				}, options);

			// move attributes from elem to sneak to allow POSTing
			moveAttributes(elem, sneak, 'id name pattern equals required');

			// delay masking latest character but only allow one character to be unmaksed
			elem.on('keyup', function () {
					timeoutID = setTimeout(doMask, settings.delay);
				})
				.on('keydown', function () {
					clearTimeout(timeoutID);
					doMask();
				});

			elem.after(sneak);

			function doMask() {
				var oldValue = sneak.val(),
					newValue = oldValue,
					enteredValue = elem.val(),
					mask = Array(enteredValue.length + 1).join(settings.char),
					i, c;

				// if the element is unchanged, return
				if (enteredValue === mask && enteredValue.length === oldValue.length) {
					return;
				}

				for (i = 0; i < enteredValue.length; i++) {
					c = enteredValue.charAt(i);

					// skip over any input that matches the mask character
					if (c === settings.char) {
						continue;
					}

					newValue = newValue.substr(0, i) + c + newValue.substr(i);
				}

				if (enteredValue.length < oldValue.length) {
					newValue = newValue.substr(0, enteredValue.length);
				}

				sneak.val(newValue);
				elem.val(mask);
			}

			function moveAttributes(source, dest, attributes) {
				var attributes = attributes.split(' '),
					i, attrName, attrValue;

				for (i = 0; i < attributes.length; i++) {
					attrName = attributes[i];
					attrValue = source.attr(attrName);

					if (attrValue === undefined) {
						continue;
					}

					source.removeAttr(attrName);
					dest.attr(attrName, attrValue);
				}
			}
		}); // end this.each
	} // end $.fn.mask
}(jQuery));
