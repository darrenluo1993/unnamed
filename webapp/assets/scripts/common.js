Number.prototype.toFixed = function(scale)  
{  
    var s = this + "";  
    if (!scale) scale = 0;  
    if (s.indexOf(".") == -1) s += ".";  
    s += new Array(scale + 1).join("0");  
    if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (scale + 1) + "})?)\\d*$").test(s))  
    {  
        var s = "0" + RegExp.$2, pm = RegExp.$1, a = RegExp.$3.length, b = true;  
        if (a == scale + 2)  
        {  
            a = s.match(/\d/g);  
            if (parseInt(a[a.length - 1]) > 4)  
            {  
                for (var i = a.length - 2; i >= 0; i--)  
                {  
                    a[i] = parseInt(a[i]) + 1;  
                    if (a[i] == 10)  
                    {  
                        a[i] = 0;  
                        b = i != 1;  
                    }  
                    else  
                        break;  
                }  
            }  
            s = a.join("").replace(new RegExp("(\\d+)(\\d{" + scale + "})\\d$"), "$1.$2");  
        }  
        if (b) s = s.substr(1);  
        return (pm + s).replace(/\.$/, "");  
    }  
    return this + "";  
} 

var dialog = $.widget("ui.dialog", {
	version : "1.11.3",
	options : {
		appendTo : "body",
		autoOpen : true,
		buttons : [],
		closeOnEscape : true,
		closeText : "Close",
		dialogClass : "",
		draggable : true,
		hide : null,
		height : "auto",
		maxHeight : null,
		maxWidth : null,
		minHeight : 150,
		minWidth : 150,
		modal : true,
		position : {
			my : "center",
			at : "center",
			of : window,
			collision : "fit",
			// Ensure the titlebar is always visible
			using : function(pos) {
				var topOffset = $(this).css(pos).offset().top;
				if (topOffset < 0) {
					$(this).css("top", pos.top - topOffset);
				}
			}
		},
		resizable : false,
		show : null,
		title : null,
		width : 300,

		// callbacks
		beforeClose : null,
		close : null,
		drag : null,
		dragStart : null,
		dragStop : null,
		focus : null,
		open : null,
		resize : null,
		resizeStart : null,
		resizeStop : null
	},

	sizeRelatedOptions : {
		buttons : true,
		height : true,
		maxHeight : true,
		maxWidth : true,
		minHeight : true,
		minWidth : true,
		width : true
	},

	resizableRelatedOptions : {
		maxHeight : true,
		maxWidth : true,
		minHeight : true,
		minWidth : true
	},

	_create : function() {
		this.originalCss = {
			display : this.element[0].style.display,
			width : this.element[0].style.width,
			minHeight : this.element[0].style.minHeight,
			maxHeight : this.element[0].style.maxHeight,
			height : this.element[0].style.height
		};
		this.originalPosition = {
			parent : this.element.parent(),
			index : this.element.parent().children().index(this.element)
		};
		this.originalTitle = this.element.attr("title");
		this.options.title = this.options.title || this.originalTitle;

		this._createWrapper();

		this.element.show().removeAttr("title")
				.addClass("ui-dialog-content ui-widget-content")
				.appendTo(this.uiDialog);

		this._createTitlebar();
		this._createButtonPane();

		if (this.options.draggable && $.fn.draggable) {
			this._makeDraggable();
		}
		if (this.options.resizable && $.fn.resizable) {
			this._makeResizable();
		}

		this._isOpen = false;

		this._trackFocus();
	},

	_init : function() {
		if (this.options.autoOpen) {
			this.open();
		}
	},

	_appendTo : function() {
		var element = this.options.appendTo;
		if (element && (element.jquery || element.nodeType)) {
			return $(element);
		}
		return this.document.find(element || "body").eq(0);
	},

	_destroy : function() {
		var next, originalPosition = this.originalPosition;

		this._destroyOverlay();

		this.element.removeUniqueId()
				.removeClass("ui-dialog-content ui-widget-content")
				.css(this.originalCss)
				// Without detaching first, the following becomes really slow
				.detach();

		this.uiDialog.stop(true, true).remove();

		if (this.originalTitle) {
			this.element.attr("title", this.originalTitle);
		}

		next = originalPosition.parent.children().eq(originalPosition.index);
		// Don't try to place the dialog next to itself (#8613)
		if (next.length && next[0] !== this.element[0]) {
			next.before(this.element);
		} else {
			originalPosition.parent.append(this.element);
		}
	},

	widget : function() {
		return this.uiDialog;
	},

	disable : $.noop,
	enable : $.noop,

	close : function(event) {
		var activeElement, that = this;

		if (!this._isOpen || this._trigger("beforeClose", event) === false) {
			return;
		}

		this._isOpen = false;
		this._focusedElement = null;
		this._destroyOverlay();
		this._untrackInstance();

		if (!this.opener.filter(":focusable").focus().length) {

			// support: IE9
			// IE9 throws an "Unspecified error" accessing
			// document.activeElement from an <iframe>
			try {
				activeElement = this.document[0].activeElement;

				// Support: IE9, IE10
				// If the <body> is blurred, IE will switch windows, see #4520
				if (activeElement
						&& activeElement.nodeName.toLowerCase() !== "body") {

					// Hiding a focused element doesn't trigger blur in WebKit
					// so in case we have nothing to focus on, explicitly blur
					// the active element
					// https://bugs.webkit.org/show_bug.cgi?id=47182
					$(activeElement).blur();
				}
			} catch (error) {
			}
		}

		this._hide(this.uiDialog, this.options.hide, function() {
					that._trigger("close", event);
				});
	},

	isOpen : function() {
		return this._isOpen;
	},

	moveToTop : function() {
		this._moveToTop();
	},

	_moveToTop : function(event, silent) {
		var moved = false, zIndicies = this.uiDialog
				.siblings(".ui-front:visible").map(function() {
							return +$(this).css("z-index");
						}).get(), zIndexMax = Math.max.apply(null, zIndicies);

		if (zIndexMax >= +this.uiDialog.css("z-index")) {
			this.uiDialog.css("z-index", zIndexMax + 1);
			moved = true;
		}

		if (moved && !silent) {
			this._trigger("focus", event);
		}
		return moved;
	},

	open : function() {
		var that = this;
		if (this._isOpen) {
			if (this._moveToTop()) {
				this._focusTabbable();
			}
			return;
		}

		this._isOpen = true;
		this.opener = $(this.document[0].activeElement);

		this._size();
		this._position();
		this._createOverlay();
		this._moveToTop(null, true);

		// Ensure the overlay is moved to the top with the dialog, but only when
		// opening. The overlay shouldn't move after the dialog is open so that
		// modeless dialogs opened after the modal dialog stack properly.
		if (this.overlay) {
			this.overlay.css("z-index", this.uiDialog.css("z-index") - 1);
		}

		this._show(this.uiDialog, this.options.show, function() {
					that._focusTabbable();
					that._trigger("focus");
				});

		// Track the dialog immediately upon openening in case a focus event
		// somehow occurs outside of the dialog before an element inside the
		// dialog is focused (#10152)
		this._makeFocusTarget();

		this._trigger("open");
	},

	_focusTabbable : function() {
		// Set focus to the first match:
		// 1. An element that was focused previously
		// 2. First element inside the dialog matching [autofocus]
		// 3. Tabbable element inside the content element
		// 4. Tabbable element inside the buttonpane
		// 5. The close button
		// 6. The dialog itself
		var hasFocus = this._focusedElement;
		if (!hasFocus) {
			hasFocus = this.element.find("[autofocus]");
		}
		if (!hasFocus.length) {
			hasFocus = this.element.find(":tabbable");
		}
		if (!hasFocus.length) {
			hasFocus = this.uiDialogButtonPane.find(":tabbable");
		}
		if (!hasFocus.length) {
			hasFocus = this.uiDialogTitlebarClose.filter(":tabbable");
		}
		if (!hasFocus.length) {
			hasFocus = this.uiDialog;
		}
		hasFocus.eq(0).focus();
	},

	_keepFocus : function(event) {
		function checkFocus() {
			var activeElement = this.document[0].activeElement, isActive = this.uiDialog[0] === activeElement
					|| $.contains(this.uiDialog[0], activeElement);
			if (!isActive) {
				this._focusTabbable();
			}
		}
		event.preventDefault();
		checkFocus.call(this);
		// support: IE
		// IE <= 8 doesn't prevent moving focus even with event.preventDefault()
		// so we check again later
		this._delay(checkFocus);
	},

	_createWrapper : function() {
		this.uiDialog = $("<div>")
				.addClass("ui-dialog ui-widget ui-widget-content ui-corner-all ui-front "
						+ this.options.dialogClass).hide().attr({
							// Setting tabIndex makes the div focusable
							tabIndex : -1,
							role : "dialog"
						}).appendTo(this._appendTo());

		this._on(this.uiDialog, {
			keydown : function(event) {
				if (this.options.closeOnEscape && !event.isDefaultPrevented()
						&& event.keyCode
						&& event.keyCode === $.ui.keyCode.ESCAPE) {
					event.preventDefault();
					this.close(event);
					return;
				}

				// prevent tabbing out of dialogs
				if (event.keyCode !== $.ui.keyCode.TAB
						|| event.isDefaultPrevented()) {
					return;
				}
				var tabbables = this.uiDialog.find(":tabbable"), first = tabbables
						.filter(":first"), last = tabbables.filter(":last");

				if ((event.target === last[0] || event.target === this.uiDialog[0])
						&& !event.shiftKey) {
					this._delay(function() {
								first.focus();
							});
					event.preventDefault();
				} else if ((event.target === first[0] || event.target === this.uiDialog[0])
						&& event.shiftKey) {
					this._delay(function() {
								last.focus();
							});
					event.preventDefault();
				}
			},
			mousedown : function(event) {
				if (this._moveToTop(event)) {
					this._focusTabbable();
				}
			}
		});

		// We assume that any existing aria-describedby attribute means
		// that the dialog content is marked up properly
		// otherwise we brute force the content as the description
		if (!this.element.find("[aria-describedby]").length) {
			this.uiDialog.attr({
						"aria-describedby" : this.element.uniqueId().attr("id")
					});
		}
	},

	_createTitlebar : function() {
		var uiDialogTitle;

		this.uiDialogTitlebar = $("<div>")
				.addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix")
				.prependTo(this.uiDialog);
		this._on(this.uiDialogTitlebar, {
					mousedown : function(event) {
						// Don't prevent click on close button (#8838)
						// Focusing a dialog that is partially scrolled out of
						// view
						// causes the browser to scroll it into view, preventing
						// the click event
						if (!$(event.target)
								.closest(".ui-dialog-titlebar-close")) {
							// Dialog isn't getting focus when dragging (#8063)
							this.uiDialog.focus();
						}
					}
				});

		// support: IE
		// Use type="button" to prevent enter keypresses in textboxes from
		// closing the
		// dialog in IE (#9312)
		this.uiDialogTitlebarClose = $("<button type='button'></button>")
				.button({
							label : this.options.closeText,
							icons : {
								primary : "ui-icon-closethick"
							},
							text : false
						}).addClass("ui-dialog-titlebar-close")
				.appendTo(this.uiDialogTitlebar);
		this._on(this.uiDialogTitlebarClose, {
					click : function(event) {
						event.preventDefault();
						this.close(event);
					}
				});

		uiDialogTitle = $("<span>").uniqueId().addClass("ui-dialog-title")
				.prependTo(this.uiDialogTitlebar);
		this._title(uiDialogTitle);

		this.uiDialog.attr({
					"aria-labelledby" : uiDialogTitle.attr("id")
				});
	},

	_title : function(title) {
		if (!this.options.title) {
			title.html("&#160;");
		}
		title.text(this.options.title);
	},

	_createButtonPane : function() {
		this.uiDialogButtonPane = $("<div>")
				.addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix");

		this.uiButtonSet = $("<div>").addClass("ui-dialog-buttonset")
				.appendTo(this.uiDialogButtonPane);

		this._createButtons();
	},

	_createButtons : function() {
		var that = this, buttons = this.options.buttons;

		// if we already have a button pane, remove it
		this.uiDialogButtonPane.remove();
		this.uiButtonSet.empty();

		if ($.isEmptyObject(buttons) || ($.isArray(buttons) && !buttons.length)) {
			this.uiDialog.removeClass("ui-dialog-buttons");
			return;
		}

		$.each(buttons, function(name, props) {
					var click, buttonOptions;
					props = $.isFunction(props) ? {
						click : props,
						text : name
					} : props;
					// Default to a non-submitting button
					props = $.extend({
								type : "button"
							}, props);
					// Change the context for the click callback to be the main
					// element
					click = props.click;
					props.click = function() {
						click.apply(that.element[0], arguments);
					};
					buttonOptions = {
						icons : props.icons,
						text : props.showText
					};
					delete props.icons;
					delete props.showText;
					$("<button></button>", props).button(buttonOptions)
							.appendTo(that.uiButtonSet);
				});
		this.uiDialog.addClass("ui-dialog-buttons");
		this.uiDialogButtonPane.appendTo(this.uiDialog);
	},

	_makeDraggable : function() {
		var that = this, options = this.options;

		function filteredUi(ui) {
			return {
				position : ui.position,
				offset : ui.offset
			};
		}

		this.uiDialog.draggable({
			cancel : ".ui-dialog-content, .ui-dialog-titlebar-close",
			handle : ".ui-dialog-titlebar",
			containment : "document",
			start : function(event, ui) {
				$(this).addClass("ui-dialog-dragging");
				that._blockFrames();
				that._trigger("dragStart", event, filteredUi(ui));
			},
			drag : function(event, ui) {
				that._trigger("drag", event, filteredUi(ui));
			},
			stop : function(event, ui) {
				var left = ui.offset.left - that.document.scrollLeft(), top = ui.offset.top
						- that.document.scrollTop();

				options.position = {
					my : "left top",
					at : "left" + (left >= 0 ? "+" : "") + left + " " + "top"
							+ (top >= 0 ? "+" : "") + top,
					of : that.window
				};
				$(this).removeClass("ui-dialog-dragging");
				that._unblockFrames();
				that._trigger("dragStop", event, filteredUi(ui));
			}
		});
	},

	_makeResizable : function() {
		var that = this, options = this.options, handles = options.resizable,
		// .ui-resizable has position: relative defined in the stylesheet
		// but dialogs have to use absolute or fixed positioning
		position = this.uiDialog.css("position"), resizeHandles = typeof handles === "string"
				? handles
				: "n,e,s,w,se,sw,ne,nw";

		function filteredUi(ui) {
			return {
				originalPosition : ui.originalPosition,
				originalSize : ui.originalSize,
				position : ui.position,
				size : ui.size
			};
		}

		this.uiDialog.resizable({
			cancel : ".ui-dialog-content",
			containment : "document",
			alsoResize : this.element,
			maxWidth : options.maxWidth,
			maxHeight : options.maxHeight,
			minWidth : options.minWidth,
			minHeight : this._minHeight(),
			handles : resizeHandles,
			start : function(event, ui) {
				$(this).addClass("ui-dialog-resizing");
				that._blockFrames();
				that._trigger("resizeStart", event, filteredUi(ui));
			},
			resize : function(event, ui) {
				that._trigger("resize", event, filteredUi(ui));
			},
			stop : function(event, ui) {
				var offset = that.uiDialog.offset(), left = offset.left
						- that.document.scrollLeft(), top = offset.top
						- that.document.scrollTop();

				options.height = that.uiDialog.height();
				options.width = that.uiDialog.width();
				options.position = {
					my : "left top",
					at : "left" + (left >= 0 ? "+" : "") + left + " " + "top"
							+ (top >= 0 ? "+" : "") + top,
					of : that.window
				};
				$(this).removeClass("ui-dialog-resizing");
				that._unblockFrames();
				that._trigger("resizeStop", event, filteredUi(ui));
			}
		}).css("position", position);
	},

	_trackFocus : function() {
		this._on(this.widget(), {
					focusin : function(event) {
						this._makeFocusTarget();
						this._focusedElement = $(event.target);
					}
				});
	},

	_makeFocusTarget : function() {
		this._untrackInstance();
		this._trackingInstances().unshift(this);
	},

	_untrackInstance : function() {
		var instances = this._trackingInstances(), exists = $.inArray(this,
				instances);
		if (exists !== -1) {
			instances.splice(exists, 1);
		}
	},

	_trackingInstances : function() {
		var instances = this.document.data("ui-dialog-instances");
		if (!instances) {
			instances = [];
			this.document.data("ui-dialog-instances", instances);
		}
		return instances;
	},

	_minHeight : function() {
		var options = this.options;

		return options.height === "auto" ? options.minHeight : Math.min(
				options.minHeight, options.height);
	},

	_position : function() {
		// Need to show the dialog to get the actual offset in the position
		// plugin
		var isVisible = this.uiDialog.is(":visible");
		if (!isVisible) {
			this.uiDialog.show();
		}
		this.uiDialog.position(this.options.position);
		if (!isVisible) {
			this.uiDialog.hide();
		}
	},

	_setOptions : function(options) {
		var that = this, resize = false, resizableOptions = {};

		$.each(options, function(key, value) {
					that._setOption(key, value);

					if (key in that.sizeRelatedOptions) {
						resize = true;
					}
					if (key in that.resizableRelatedOptions) {
						resizableOptions[key] = value;
					}
				});

		if (resize) {
			this._size();
			this._position();
		}
		if (this.uiDialog.is(":data(ui-resizable)")) {
			this.uiDialog.resizable("option", resizableOptions);
		}
	},

	_setOption : function(key, value) {
		var isDraggable, isResizable, uiDialog = this.uiDialog;

		if (key === "dialogClass") {
			uiDialog.removeClass(this.options.dialogClass).addClass(value);
		}

		if (key === "disabled") {
			return;
		}

		this._super(key, value);

		if (key === "appendTo") {
			this.uiDialog.appendTo(this._appendTo());
		}

		if (key === "buttons") {
			this._createButtons();
		}

		if (key === "closeText") {
			this.uiDialogTitlebarClose.button({
						// Ensure that we always pass a string
						label : "" + value
					});
		}

		if (key === "draggable") {
			isDraggable = uiDialog.is(":data(ui-draggable)");
			if (isDraggable && !value) {
				uiDialog.draggable("destroy");
			}

			if (!isDraggable && value) {
				this._makeDraggable();
			}
		}

		if (key === "position") {
			this._position();
		}

		if (key === "resizable") {
			// currently resizable, becoming non-resizable
			isResizable = uiDialog.is(":data(ui-resizable)");
			if (isResizable && !value) {
				uiDialog.resizable("destroy");
			}

			// currently resizable, changing handles
			if (isResizable && typeof value === "string") {
				uiDialog.resizable("option", "handles", value);
			}

			// currently non-resizable, becoming resizable
			if (!isResizable && value !== false) {
				this._makeResizable();
			}
		}

		if (key === "title") {
			this._title(this.uiDialogTitlebar.find(".ui-dialog-title"));
		}
	},

	_size : function() {
		// If the user has resized the dialog, the .ui-dialog and
		// .ui-dialog-content
		// divs will both have width and height set, so we need to reset them
		var nonContentHeight, minContentHeight, maxContentHeight, options = this.options;

		// Reset content sizing
		this.element.show().css({
					width : "auto",
					minHeight : 0,
					maxHeight : "none",
					height : 0
				});

		if (options.minWidth > options.width) {
			options.width = options.minWidth;
		}

		// reset wrapper sizing
		// determine the height of all the non-content elements
		nonContentHeight = this.uiDialog.css({
					height : "auto",
					width : options.width
				}).outerHeight();
		minContentHeight = Math.max(0, options.minHeight - nonContentHeight);
		maxContentHeight = typeof options.maxHeight === "number" ? Math.max(0,
				options.maxHeight - nonContentHeight) : "none";

		if (options.height === "auto") {
			this.element.css({
						minHeight : minContentHeight,
						maxHeight : maxContentHeight,
						height : "auto"
					});
		} else {
			this.element.height(Math.max(0, options.height - nonContentHeight));
		}

		if (this.uiDialog.is(":data(ui-resizable)")) {
			this.uiDialog.resizable("option", "minHeight", this._minHeight());
		}
	},

	_blockFrames : function() {
		this.iframeBlocks = this.document.find("iframe").map(function() {
					var iframe = $(this);

					return $("<div>").css({
								position : "absolute",
								width : iframe.outerWidth(),
								height : iframe.outerHeight()
							}).appendTo(iframe.parent())
							.offset(iframe.offset())[0];
				});
	},

	_unblockFrames : function() {
		if (this.iframeBlocks) {
			this.iframeBlocks.remove();
			delete this.iframeBlocks;
		}
	},

	_allowInteraction : function(event) {
		if ($(event.target).closest(".ui-dialog").length) {
			return true;
		}

		// TODO: Remove hack when datepicker implements
		// the .ui-front logic (#8989)
		return !!$(event.target).closest(".ui-datepicker").length;
	},

	_createOverlay : function() {
		if (!this.options.modal) {
			return;
		}

		// We use a delay in case the overlay is created from an
		// event that we're going to be cancelling (#2804)
		var isOpening = true;
		this._delay(function() {
					isOpening = false;
				});

		if (!this.document.data("ui-dialog-overlays")) {

			// Prevent use of anchors and inputs
			// Using _on() for an event handler shared across many instances is
			// safe because the dialogs stack and must be closed in reverse
			// order
			this._on(this.document, {
						focusin : function(event) {
							if (isOpening) {
								return;
							}

							if (!this._allowInteraction(event)) {
								event.preventDefault();
								// this._trackingInstances()[ 0
								// ]._focusTabbable();
							}
						}
					});
		}

		this.overlay = $("<div>").addClass("ui-widget-overlay ui-front")
				.appendTo(this._appendTo());
		this._on(this.overlay, {
					mousedown : "_keepFocus"
				});
		this.document.data("ui-dialog-overlays", (this.document
						.data("ui-dialog-overlays") || 0)
						+ 1);
	},

	_destroyOverlay : function() {
		if (!this.options.modal) {
			return;
		}

		if (this.overlay) {
			var overlays = this.document.data("ui-dialog-overlays") - 1;

			if (!overlays) {
				this.document.unbind("focusin")
						.removeData("ui-dialog-overlays");
			} else {
				this.document.data("ui-dialog-overlays", overlays);
			}

			this.overlay.remove();
			this.overlay = null;
		}
	}
});

$(document).on('click', '#subimitUpload', function() {
			//alert("进入方法");
			$("#fileLoadForm").submit();
		});

function atoc(numberValue) {
	var negative = false;
	if (numberValue < 0) {
		negative = true;
		numberValue = -numberValue;
	}
	var ov = numberValue;
	var numberValue = new String(Math.floor(numberValue * 100));
	var chineseValue = "";
	var String1 = "零壹贰叁肆伍陆柒捌玖";
	var String2 = "万仟佰拾亿仟佰拾万仟佰拾元角分";
	var len = numberValue.length;
	if (len > 15)
		return ov;
	var Ch1;
	var Ch2;
	var nZero = 0;
	var String3;
	if (numberValue == 0) {
		chineseValue = "零元整";
		return chineseValue;
	}
	String2 = String2.substr(String2.length - len, len);
	for (var i = 0; i < len; i++) {
		String3 = parseInt(numberValue.substr(i, 1), 10);
		if (i != (len - 3) && i != (len - 7) && i != (len - 11)
				&& i != (len - 15)) {
			if (String3 == 0) {
				Ch1 = "";
				Ch2 = "";
				nZero = nZero + 1;
			} else if (String3 != 0 && nZero != 0) {
				Ch1 = "零" + String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			} else {
				Ch1 = String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			}
		} else {
			if (String3 != 0 && nZero != 0) {
				Ch1 = "零" + String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			} else if (String3 != 0 && nZero == 0) {
				Ch1 = String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			} else if (String3 == 0 && nZero >= 3) {
				Ch1 = "";
				Ch2 = "";
				nZero = nZero + 1;
			} else {
				Ch1 = "";
				Ch2 = String2.substr(i, 1);
				nZero = nZero + 1;
			}
			if (i == (len - 11) || i == (len - 3)) {
				Ch2 = String2.substr(i, 1);
			}
		}
		chineseValue = chineseValue + Ch1 + Ch2;
	}
	if (String3 == 0) {
		chineseValue = chineseValue + "整";
	}
	return (negative ? '负' : '') + chineseValue;
}

DateUtils = {
	addDays : function(date, days) {
		var string = false;
		if (typeof date == 'string') {
			string = true;
			date = new Date(date);
		}
		var time = date.getTime();
		time += (24 * 3600 * 1000) * days;
		date = new Date();
		date.setTime(time);
		return string ? $.format.date(date, 'yyyy-MM-dd') : date;
	},
	getIntervalDays : function(startDate, endDate) {
		if (typeof startDate == 'string')
			startDate = new Date(startDate);
		if (typeof endDate == 'string')
			endDate = new Date(endDate);
		var diff = endDate.getTime() - startDate.getTime();
		return diff / (24 * 3600 * 1000) + 1;
	},

	isLeapYear : function(year) {
		return new Date(year, 1, 29).getMonth() == 1;
	},
	nextLeapDay : function(since) {
		if (typeof since == 'string')
			since = new Date(since);
		var year = since.getFullYear();
		if (DateUtils.isLeapYear(year)) {
			var leapDay = new Date(year, 1, 29);
			if (since.getTime() <= leapDay.getTime())
				return leapDay;
		}
		while (!DateUtils.isLeapYear(++year));
		return new Date(year, 1, 29);
	},

	isSpanLeapDay : function(startDate, endDate) {
		if (typeof startDate == 'string')
			startDate = new Date(startDate);
		if (typeof endDate == 'string')
			endDate = new Date(endDate);
		return endDate.getTime() >= DateUtils.nextLeapDay(startDate).getTime();
	}
}

Initialization.app = function(container) {
	$(window).on('keydown', function(ev) {
				var keyCode = ev.which;
				if (keyCode == 27) {
					return false;
				}
			});

	// -----------------------------------------------------
	// 只能输入数字0-9校验，用于银行资金账号，银行卡号类输入域如000002342
	$(document).on('keyup change mouseover', 'input.digit', function(ev) {
		this.value = this.value.replace(/\D/g, '');
			// return true;
		});

	$(document).on('afterpaste', 'input.digit', function(ev) {
		this.value = this.value.replace(/\D/g, '');
			// return true;
		});
	$(document).on('paste', 'input.digit', function(ev) {
		this.change();
			// return true;
		});

	// -----------------------------------------------------
	// 只能输入英文数字校验，用于合同编号交易编号类输入域如TsdsD234242,234Tdfd
	$(document).on('keyup change mouseover paste  afterpaste', 'input.isstr',
			function(ev) {
				var valuefirst = this.value.substring(0, 1);
				if (!valuefirst || isNaN(valuefirst)) {
					this.value = this.value.replace(/[^\d|chun]/g, '');
				} else {
					this.value = this.value.replace(/[^\w\.\/]/ig, '');
				}
				// return true;
		});

	// ----------------------------------------------------- 用于价格校验如元/百元
	// ，不带千分符，自动校验数字合法
	$(document).on('mouseover', 'input.price', function(ev) {
		var t = $(this);
		var tempAmount = moneyDecoder(t.val());
		var fuhao = "";
		if (tempAmount.length > 0) {
			if (tempAmount.substring(0, 1) == "-") {
				fuhao = "-";
			}
		}
		tempAmount = tempAmount.replace(/[^\d.]/g, '');
		// if(tempAmount=="00"){
		// tempAmount="0";
		// }
		// if(tempAmount.substring(0,1)=="0"){
		// if(tempAmount.substring(1,2)!="."){
		// tempAmount="0.";
		// }
		// }
		t.val(tempAmount);
		if (fuhao == "-"
				&& ($(this).attr("readonly")||$(this).hasClass("allowNegative") || $(this).attr("disabled"))) {
			t.val("-" + t.val());
		}
		return true;
	});
	$(document).on('paste', 'input.price', function(ev) {
				if ($(this).hasClass("allowPaste")) {
					return true;
				} else {
					return false;
				}
			});
	$(document).on('keydown', 'input.price', function(ev) {
				var t = $(this);
				var keyCode = ev.which;
				// 回车
				if (keyCode == 13) {
					$(this).blur();
					$(this).change();
					return true;
				}
				if ($(this).hasClass("allowPaste")) {
					if (keyCode == 67 || keyCode == 86) {
						return true;
					}
				}
				if (keyCode == 190 || keyCode == 110 || keyCode == 8) {
					var temp = t.val() + "";
					if (keyCode == 8 || temp.indexOf(".") < 0) {
						return true;
					} else {
						return false;
					}
				}
				if ((keyCode >= 65 && keyCode <= 90)) {
					return false;
				}
				return true;
			});

	$(document).on('keyup change', 'input.price', function(ev) {
		var t = $(this);
		temp = t.val() + "";
		if (temp.indexOf(".") == 0) {
			t.val("");
			return true;
		}
		var tempAmount = moneyDecoder(t.val());
		var fuhao = "";
		if (tempAmount.length > 0) {
			if (tempAmount.substring(0, 1) == "-") {
				fuhao = "-";
			}
		}
		tempAmount = tempAmount.replace(/[^\d.]/g, '');
		if (tempAmount == "00") {
			tempAmount = "0";
		}
		if (tempAmount.substring(0, 1) == "0") {
			if (tempAmount.substring(1, 2) != ".") {
				tempAmount = "0.";
			}
		}
		t.val(tempAmount);
		if (fuhao == "-"
				&& ($(this).attr("readonly") ||$(this).hasClass("allowNegative")|| $(this).attr("disabled"))) {
			t.val("-" + t.val());
		}
		return true;
	});

	// -----------------------------------------------------
	// 用于利率校验，不带千分符，自动校验数字合法
	$(document).on('mouseover', 'input.percent', function(ev) {
		var t = $(this);
		var tempAmount = moneyDecoder(t.val());
		var fuhao = "";
		if (tempAmount.length > 0) {
			if (tempAmount.substring(0, 1) == "-") {
				fuhao = "-";
			}
		}
		tempAmount = tempAmount.replace(/[^\d.]/g, '');
		// if(tempAmount=="00"){
		// tempAmount="0";
		// }
		// if(tempAmount.substring(0,1)=="0"){
		// if(tempAmount.length>1&&tempAmount.substring(1,2)!="."){
		// tempAmount="0."+tempAmount.substring(1);
		// }
		// }
		t.val(tempAmount);
		if (fuhao == "-") {
			t.val("-" + t.val());
		}
		return true;
	});
	$(document).on('paste', 'input.percent', function(ev) {
				if ($(this).hasClass("allowPaste")) {
					return true;
				} else {
					return false;
				}
			});
	$(document).on('keydown', 'input.percent', function(ev) {
				var t = $(this);
				var keyCode = ev.which;
				// 回车
				if (keyCode == 13) {
					$(this).blur();
					$(this).change();
					return true;
				}
				if ($(this).hasClass("allowPaste")) {
					if (keyCode == 67 || keyCode == 86) {
						return true;
					}
				}
				if (keyCode == 190 || keyCode == 110 || keyCode == 8) {
					var temp = t.val() + "";
					if (keyCode == 8 || temp.indexOf(".") < 0) {
						return true;
					} else {
						return false;
					}
				}
				if ((keyCode >= 65 && keyCode <= 90)) {
					return false;
				}
				return true;
			});

	$(document).on('keyup change', 'input.percent', function(ev) {
		var t = $(this);
		temp = t.val() + "";
		if (temp.indexOf(".") == 0) {
			t.val("");
			return true;
		}
		var tempAmount = moneyDecoder(t.val());
		var fuhao = "";
		if (tempAmount.length > 0) {
			if (tempAmount.substring(0, 1) == "-") {
				fuhao = "-";
			}
		}
		tempAmount = tempAmount.replace(/[^\d.]/g, '');
		if (tempAmount == "00") {
			tempAmount = "0";
		}
		if (tempAmount.substring(0, 1) == "0") {
			if (tempAmount.length > 1 && tempAmount.substring(1, 2) != ".") {
				tempAmount = "0." + tempAmount.substring(1);
			}
		}
		t.val(tempAmount);
		if (fuhao == "-") {
			t.val("-" + t.val());
		}
		return true;
	});

	// -----------------------------------------------------
	$(document).on('mouseover', 'input.amount', function(ev) {
		var t = $(this);
		var tempAmount = moneyDecoder(t.val());
		var fuhao = "";
		if (tempAmount.length > 0) {
			if (tempAmount.substring(0, 1) == "-") {
				fuhao = "-";
			}
		}
		tempAmount = tempAmount.replace(/[^\d.]/g, '');
		t.val(moneyEncoder(tempAmount));
		// t.val(tempAmount);
		if (fuhao == "-"
				&& ($(this).attr("readonly")||$(this).hasClass("allowNegative") || $(this).attr("disabled"))) {
			t.val("-" + t.val());
		}
		return true;
	});
	$(document).on('paste', 'input.amount', function(ev) {
				if ($(this).hasClass("allowPaste")) {
					return true;
				} else {
					return false;
				}
			});
	$(document).on('keydown', 'input.amount', function(ev) {
				var t = $(this);
				var keyCode = ev.which;
				// 回车
				if (keyCode == 13) {
					$(this).blur();
					$(this).change();
					return true;
				}
				if ($(this).hasClass("allowPaste")) {
					if (keyCode == 67 || keyCode == 86) {
						return true;
					}
				}
				if (keyCode == 190 || keyCode == 110 || keyCode == 8) {
					var temp = t.val() + "";
					if (keyCode == 8 || temp.indexOf(".") < 0) {
						return true;
					} else {
						return false;
					}
				}
				if ((keyCode >= 65 && keyCode <= 90)) {
					return false;
				}
				if (keyCode == 109 || keyCode == 229) {
					return false;
				}
				return true;
			});

	$(document).on('keyup change', 'input.amount', function(ev) {
		var t = $(this);
		temp = t.val() + "";
		if (temp.indexOf(".") == 0) {
			t.val("");
			return true;
		}
		var tempAmount = moneyDecoder(t.val());
		var fuhao = "";
		if (tempAmount.length > 0) {
			if (tempAmount.substring(0, 1) == "-") {
				fuhao = "-";
			}
		}
		tempAmount = tempAmount.replace(/[^\d.]/g, '');
		t.val(moneyEncoder(tempAmount));
		if (fuhao == "-"
				&& ($(this).attr("readonly")||$(this).hasClass("allowNegative") || $(this).attr("disabled"))) {
			t.val("-" + t.val());
		}
		return true;
	});
	// IE浏览器触发
	var _ua = navigator.userAgent.toLowerCase();
	$("input.autoChange").each(function(){
		if(_ua && _ua.indexOf("msie") > -1 || (_ua.indexOf("trident") > -1 && _ua.indexOf("rv"))){			
			var obj = this;
			var name = 'value';
			var handler = function(){
				if(document.activeElement.name == this.name || document.activeElement.id == this.id) return false; 
				$(this).change();
				return true;
			};
			if ('watch' in obj) {
				obj.watch(name, handler);
			} else if ('onpropertychange' in obj) {
				name= name.toLowerCase();
				obj.onpropertychange= function() {
					if (window.event.propertyName.toLowerCase()===name)
						handler.call(obj);
				};
			} else {
				var o= obj[name];
				setInterval(function() {
					var n= obj[name];
					if (o!==n) {
						var ret = handler.call(obj);
						if(ret) o = n;
					}
				}, 200);
			}
		}
	});

	var oldFieldValue = $.fieldValue;
	if (oldFieldValue) {
		$.fieldValue = function(el, successful) {
			var value = oldFieldValue(el, successful);
			if ($(el).hasClass('amount')) {
				if (value) {
					value = getMoneyValue(value);
					// XXX 取原来数值的小数位 返回值的时候继续保留同样的小数位
					var valueList = (value + "").split(".");
					var decimals = valueList.length > 1
							? valueList[1].length
							: 0;
					if ($(el).hasClass('tenthousand')) {
						return (value * 10000).toFixed(decimals);
					} else if ($(el).hasClass('hundredmillion')) {
						return (value * 100000000).toFixed(decimals);
					}
				}
			}
			return value;
		};
	}
}

// ---------------------------------------//日期间隔计算
function calculateDays(startDate, endDate) {
	// 将年月日格式转成月日年再转成Date类型 通过毫秒数差来计算日期间隔
	var indexDate, oDate1, oDate2, days;
	indexDate = startDate.split("-");
	oDate1 = new Date(indexDate[1] + "-" + indexDate[2] + "-" + indexDate[0]);
	indexDate = endDate.split("-");
	oDate2 = new Date(indexDate[1] + "-" + indexDate[2] + "-" + indexDate[0]);
	days = parseInt((oDate2 - oDate1) / 1000 / 60 / 60 / 24);
	return days;
}
// ---------------------------------------//假日顺延天数
function getPostponeDays(srcDate) {
	var result = 0;
	$.ajax({
		type : "post",
		global : false,
		async : false,
		url : '/cpms/linkus/capital/system/holiday/getNonHoliday?srcDate=' + srcDate,
		dataType : "json",
		success : function(data) {
			if (data != null) {
				result = parseInt(data.delayDays);

			}
		},
		error : function() {
			doTheAlert('提示', errorTip);
		}
	});
	return result;
}
// ---------------------日期加 ？ 天
function addDay(date1, num) {
	var indexDate, oDate1;
	indexDate = date1.split("-");
	oDate1 = new Date(indexDate[1] + "-" + indexDate[2] + "-" + indexDate[0]);
	oDate1.setTime(oDate1.getTime() + 1000 * 60 * 60 * 24 * num);
	return oDate1.getFullYear()
			+ "-"
			+ ((oDate1.getMonth() + 1) < 10
					? "0" + (oDate1.getMonth() + 1)
					: (oDate1.getMonth() + 1))
			+ "-"
			+ (oDate1.getDate() < 10 ? "0" + oDate1.getDate() : oDate1
					.getDate());
}

Observation.app = function(container) {
	$('input.amount', container).each(function() {
		var t = $(this);
		var tenthousand = t.hasClass('tenthousand');
		var hundredmillion = t.hasClass('hundredmillion');
		if (!t.parent('.input-append').length) {
			// 加了noatoc的类不显示中文提示，单位自行加上 此处只给需要带单位的加上万元/亿元/元
			if (!t.hasClass('noatoc')) {
				t.wrap('<span class="input-append"></span>')
						.after('<span class="add-on">'
								+ (tenthousand ? '万' : (hundredmillion
										? '亿'
										: '')) + '元</span>');
			}

			if (tenthousand) {
				var scale = parseInt(t.data('scale'));
				if (scale)
					t.data('scale', scale + 4);
				var step = parseFloat(t.attr('step'));
				if (step)
					t.attr('step', step / 10000);
				if (t.val())
					t.val((parseFloat(t.val()) / 10000).toFixed(scale));
			}
			if (hundredmillion) {
				var scale = parseInt(t.data('scale'));
				if (scale)
					t.data('scale', scale + 8);
				var step = parseFloat(t.attr('step'));
				if (step)
					t.attr('step', step / 100000000);
				if (t.val())
					t.val((parseFloat(t.val()) / 100000000).toFixed(scale));
			}
			t.val(moneyEncoder(t.val()));
		}

	});
	$('input.percent', container).each(function() {
		var t = $(this);
		if (!t.parent('.input-append').length) {
			var scale = parseInt(t.data('scale'));
			if (scale)
				t.data('scale', scale - 2);
			if (!t.hasClass('hidden')) {
				if (!t.hasClass('rate-ordinary')) {
					t.wrap('<span class="input-append"></span>')
							.after('<span class="add-on">'
									+ (t.hasClass('price') ? '元/百元' : '%')
									+ '</span>');
				}
			}
		}
	});

	$('input.year', container).each(function() {
		var t = $(this);
		if (t.hasClass('year')) {
			t.wrap('<span class="input-append"></span>')
					.after('<span class="add-on">' + '年' + '</span>');
		}
	});

	$('input.days', container).each(function() {
		var t = $(this);
		if (t.hasClass('days')) {
			t.wrap('<span class="input-append"></span>')
					.after('<span class="add-on">' + '天' + '</span>');
		}
	});

	$('form.verify', container).each(function() {
		var f = $(this);
		var inputs = $(':input[disabled][type!="hidden"]', f);
		$('textarea[name="verifyResult"],input[name="verifyPassed"]', f).each(
				function() {
					$(this).closest('.control-group').hide();
				});
		inputs.each(function() {
			var t = $(this);
			var input = t;
			if (!t.closest('.control-group').is(':visible'))
				return;
			var name = t.attr('name');
			if (name == 'amount' || name == 'faceAmount'
					|| name == 'interestRate') {
				$('.label', t.closest('.controls')).text('');
				if (t.parent('.input-append').length) {
					t = t.parent('.input-append').hide();
					t = t.clone().insertAfter(t).show().find(':input');
				} else {
					t.hide();
					t = t.clone().after(t).show();
				}
				input.data('clone', t);
				t.prop('disabled', false).removeAttr('id').removeAttr('name')
						.val('');
			} else {
				$('<span class="pull-right" style="margin-left:20px;">是否相符: <input type="checkbox" class="verified custom"/></span>')
						.appendTo(t.closest('.controls'));
			}
		})

		f.submit(function() {
			var passed = true;
			var result = [];
			inputs.each(function() {
				var t = $(this);
				if (!t.closest('.control-group').is(':visible'))
					return;
				var name = t.attr('name');
				var verified = false;
				if (name == 'amount' || name == 'faceAmount'
						|| name == 'interestRate') {
					verified = parseFloat(t.val()) == parseFloat(t
							.data('clone').val());
				} else {
					verified = $('input.verified[type="checkbox"]',
							t.closest('.controls')).prop('checked');
				}
				if (!verified) {
					var label = $('.control-label', t.closest('.control-group'))
							.text();
					result.push(label + '不相符');
					passed = false;
				}
			})
			if (!passed) {
				$('textarea[name="verifyResult"]', f).val(result.join('\n'));
				$('input[name="verifyPassed"][value="false"]', f).prop(
						'checked', true);
			} else {
				$('textarea[name="verifyResult"]', f).val('核对相符');
				$('input[name="verifyPassed"][value="true"]', f).prop(
						'checked', true);
			}
		});
	});

	$('form.account [name="accountingNumber"]', container).each(function() {
		var t = $(this);
		var number = t.val();
		if (number) {
			t.closest('.control-group').addClass('text').find('.control-label')
					.hide();
			t.replaceWith('<a class="btn" target="_blank" href="'
					+ "" + '/accounting/view/' + number
					+ '">会计分录</a>');
		}
	});

	$('#confirmDueBusiness_confirm').each(function() {
		var t = $(this);
		var businessType = $('[name="businessType"]', t);
		var contractNo = $('[name="contractNo"]', t);
		$.get(	"" + '/' + businessType.val() + '/view/'
						+ contractNo.val(), function(data) {
					var html = data.replace(/<script(.|\s)*?\/script>/g, '');
					var div = $('<div/>').html(html);
					var formactions = t.find('.form-actions');
					div.find('.control-group').each(function() {
						$(this).insertBefore(formactions).find('.controls')
								.addClass('text');
					});
					businessType.closest('.controls').addClass('text');
					businessType.replaceWith('<span>'
							+ businessType.find('option:selected').text()
							+ '</span>');
					contractNo.closest('.control-group').hide();
				});
	});

	// 点击底部按钮“收起”
	$('ul.toolbarBottom li.last').unbind('click').click(function() {
				$('ul.toolbarBottom').stop().animate({
							'margin-left' : '100%'
						}, 1000);
				$('ul.toolbarBottom2').addClass('active');
			});
	// 点击底部按钮“展开”
	$('ul.toolbarBottom2').unbind('click').click(function() {
				$('ul.toolbarBottom').stop().animate({
							'margin-left' : '0'
						}, 1000);
				$('ul.toolbarBottom2').removeClass('active');
			});
	// 点击底部按钮“关闭”
	$('#closePanel').unbind('click').click(function() {
				getTheMessager().confirm('确认', '确定要关闭当前窗口吗？', function(flag) {
							if (flag) {
								closeThePanel();
							}
						});
			});
	// 经过底部按钮时显示提示信息
	$('ul.toolbarBottom li').mouseover(function() {
		var index = $(this).index();
		$('ul.toolbarBottomTips li').eq(index).addClass('active').siblings()
				.removeClass('active');
	});
	$('ul.toolbarBottom li').mouseout(function() {
				$('ul.toolbarBottomTips li').removeClass('active');
			});

	$('ul.toolbarBottom2 li').hover(function() {
				$('ul.toolbarBottomTips2 li').addClass('active');
			}, function() {
				$('ul.toolbarBottomTips2 li').removeClass('active');
			});

}

// Number.prototype.toFixed=function(s){
// return
// (parseInt((this*Math.pow(10,s+1)+5)/Math.pow(10,1))/Math.pow(10,s)).toString();
// }

function doTheAlert(str1, str2) {
	getTheMessager().alert(str1, str2);
	// $(".messager-window").last().find('messager-button').focus();
}

function getTheMessager() {
	var $messager;
	if ($.messager)
		$messager = $.messager;
	else
		$messager = parent.$.messager;
	return $messager;
}

function round(val, point) {
	if (isNaN(val))
		return null;
	point = Math.pow(10, point + 1);
	val = val * point;
	if (val === +val) {
		return parseInt((val + 5) / 10) / point * 10;
	} else {
		return +val;
	}
}

// 关闭窗口
function closePage() {
	$('.ui-dialog:visible').last().find('.ui-dialog-titlebar-close').click();
}
// 关闭标签页
function closeThePanel() {
	var contractNo=window.parent.$(".tabs-panels").children(":visible").find("input[name='contractNo']").val();
	var subtitle = window.parent.$('.tabs-wrap ul.tabs>li.tabs-selected a span.tabs-title').text();
	if(subtitle.split("_")[0]=="待办") {
		$.ajax({
			type : "post",
			global : false,
			async : false,
			url : '/cpms/linkus/capital/workflow/taskProcess/unLock?contractNo='+contractNo,
			dataType : "json",
			success : function(data) {
			},
			error:function(){
			}
		});			
	}
	
	
	parent.$('#tt').tabs('close', subtitle);
}

function closeApprovalList(flag) {
	closePage();
	if (!flag) {
		pageHandle();
	}
}

function moneyEncoder(num) {
	// 传入的不是数字或者为空 返回原值
	if (isNaN(num) || !num)
		return num;
	var str;
	// 如果传入的是小数 直接拆分
	num = num.toString();
	if (num.indexOf('.') != -1) {
		if (num.length <= 3) {
			return num;
		}
		str = num.split(".");
	} else {
		// 传入的是整数 防止return时str[1]下标越界 默认给两位小数
		str = parseFloat(num).toFixed(2).split(".");
	}
	// 零宽断言 如果某个字段是1~3位数字 并且它后面的数字个数是3的倍数 则给这个字段后加一个千分符
	str[0] = str[0].replace(/\d{1,3}(?=(\d{3})+$)/g, function(s) {
				return s + ','
			});
	if (num.indexOf('.') != -1)
		return str[0] + "." + str[1];
	else
		return str[0]
}

function getMoneyValue(value) {
	var value = value.toString().replace(new RegExp(",", 'g'), "");
	if (!value || isNaN(value)) {
		// alert("非法数字!");
		return value;
	} else {
		return value;
	}
	return parseFloat(value).toFixed(2);
}

function moneyDecoder(num) {
	// 用replace+正则的形式完成replaceAll的功能
	var returnNum = num.toString().replace(new RegExp(",", 'g'), "");
	// 传入的值为空或者解析后不是数字 则返回原值
	if (!num || isNaN(returnNum)) {
		return num;
	} else {
		if (returnNum.indexOf(".") > -1) {
			returnNum;
		}
	}

	return returnNum;
}

// ---------------------------------------//假日顺延
function getNonHoliday(srcDate) {
	var descDate = "";
	$.ajax({
				type : "post",
				global : false,
				async : false,
				url : '/cpms/linkus/capital/system/holiday/getNonHoliday',
				data : {
					"srcDate" : srcDate
				},
				dataType : "json",
				success : function(data) {
					if (data != null)
						descDate = data.descDate;
				},
				error : function() {
					doTheAlert('提示', errorTip);
				}
			});
	return descDate;
}

$(document).on('click', '.gotoClass', function() {
	var gotoid = $(this).attr('gotoid');
	var gotoform = $(this).attr('gotoform');
	var test = '#' + gotoform + " [name=\'" + gotoid + "\']";
	$('#' + gotoform + " [name=\'" + gotoid + "\']").focus();
	$(this).parent().parent().parent().find(".eydialog-button.messager-button")
			.find('a').click();
});

function pubCheck(formName) {
	// formName="";
	var msg = "";
	$(":input", $('#' + formName)).each(function(e) {
		var input = this;
		var gotoid = this.name;
		if (this.type.indexOf("select") > -1) {
			var input = this;
			var gotoid = this.name;
			if ($(this).hasClass('required')) {
				if (!$(this).val()) {
					var label = "";
					if ($(this).attr('title') && $(this).attr('title') != "") {
						label = $(this).attr('title');
					} else {
						label = $(this).parents().parents().find('label')
								.text();
					}
					msg = msg + "<A class='gotoClass' gotoform=" + formName
							+ " gotoid=" + gotoid + ">" + label + this.value
							+ "不能为空！" + "</A>" + "<br>";
				}
			}
		} else {
			if (this.type != "hidden") {
				if ($(this).hasClass('amount')) {
					var number = getMoneyValue(this.value);
					if (this.value == "") {
						// 为空不校验
					} else {
						if (!number || isNaN(number)) {
							var label = "";
							if ($(this).attr('title')
									&& $(this).attr('title') != "") {
								label = $(this).attr('title');
							} else {
								label = $(this).parents(".controls").prev()
										.text();
							}
							msg = msg + "<A class='gotoClass' gotoform="
									+ formName + " gotoid=" + gotoid + ">"
									+ label + this.value + "非法数字！" + "</A>"
									+ "<br>";
						}
					}
				}
				if ($(this).hasClass('required')) {
					if (!$(this).val()) {
						var label = "";
						if ($(this).attr('title')
								&& $(this).attr('title') != "") {
							label = $(this).attr('title');
						} else {
							label = $(this).parents(".controls").prev().text();
						}
						msg = msg + "<A class='gotoClass' gotoform=" + formName
								+ " gotoid=" + gotoid + ">" + label
								+ this.value + "不能为空！" + "</A>" + "<br>";
					}
				}
			}
		}

	});

	if (msg == "") {
		return true;
	} else {
		doTheAlert("提示", msg);
		return false;
	}

}

// ajax error提示
var errorTip = "连接超时，请刷新页面重新操作。";

// 若设置了对页面的操作 按Esc触发该操作
$(document).keydown(function(event) {
			if (event.keyCode == 27) {
				if ($("body").attr("pageHandleName")) {
					pageHandle();
				}
			}
		})
// 设置对页面的操作 close---关闭 reload---刷新
function setPageHandleName(pageHandleName) {
	$("body").attr("pageHandleName", pageHandleName);
}

// 根据设置的操作 关闭/刷新页面
function pageHandle() {
	var pageHandleName = $("body").attr("pageHandleName");
	if (pageHandleName == "close") {
		closeThePanel();
	} else if (pageHandleName == "reload") {
		location.reload();
	}
}

// 设置禁止点击的标志
function setForbiddenClickFlag_true() {
	showDiv();
	$("body").attr("clickFlag", "forbidden");
}
// 设置解除禁止的标志
function setForbiddenClickFlag_false() {
	closeDiv();
	$("body").removeAttr("clickFlag");
}
// 获取点击标志
function getForbiddenClickFlag() {
	return $("body").attr("clickFlag") ? true : false;
}
// 多次点击的提示
function warnOfForbiddenClick() {
	doTheAlert("提示", "系统正在处理数据，请稍候操作。");
}

// 校验是否禁止点击
function checkForbiddenClickFlag() {
	if (getForbiddenClickFlag()) {
		warnOfForbiddenClick();
		return true;
	} else {
		setForbiddenClickFlag_true();
		return false;
	}
}

function selectAll(allBox, tableid) {
	var allBox = allBox.checked;
	var length = $("#" + tableid + " tbody tr").length;
	for (var i = 0; i < length; i++) {
		var select = $("#" + tableid + " tbody tr").eq(i).children().eq(0)
				.children().children().eq(0);
		if (allBox == true) {
			select[0].checked = true;
			$("#" + tableid + " tbody tr").eq(i).children().css("backgroundColor","#ffcc80");
		} else {
			select[0].checked = false;
			$("#" + tableid + " tbody tr").eq(i).children().css("backgroundColor","");
		}
	}
}

function selectedCheckBox(checkBox){
	//var box=checkBox.checked;
	if(checkBox.checked==true){
		$(checkBox).parents('tr').children().css("backgroundColor","#ffcc80");
	}else{
		$(checkBox).parents('tr').children().css("backgroundColor","");
	}
	
}

function batchPrint(tableid) {
	var href = "/cpms/linkus/capital/report/ptPrintTask/printBatch";
	var length = $("#" + tableid + " tbody tr").length;
	var selectLength = 0;
	var batchParms = "";
	for (var i = 0; i < length; i++) {
		var select = $("#" + tableid + " tbody tr").eq(i).children().eq(0)
				.children().children().eq(0);
		if (select[0].checked == true) {
			selectLength++;
			var itemTemp="";
			itemTemp=itemTemp+$("#" + tableid + " tbody tr").eq(i).children().eq(3).text()+"-"+$("#" + tableid + " tbody tr").eq(i).children().eq(6).text();
			batchParms = batchParms+ itemTemp + ",";
		}
	}

	// 校验如果selectLength=0则表示没选中一行，如果selectLength>1表示选中了多行
	if (selectLength < 1) {
		doTheAlert("提示", "请表格中勾选中一条记录才能批量打印！");
		return false;
	}
	if (batchParms.length > 0) {
		batchParms = batchParms.substring(0, batchParms.length - 1);
	}
	href = href + "?constractnoList=" + batchParms + "&templatename="
			+ $('#id_querytemplatename').val() + "&busitype="
			+ $('#id_querybusitype').val() + "&printtype="
			+ encodeURI(encodeURI($('#id_queryprinttype').val()));
	window._open(href);
}

function showDiv() {
	$("#id_processingpanel", window.parent.document).css({
				width : '200px',
				height : '200px',
				top : '50%',
				marginTop : '-100px'
			});
	var loading_left = ($('.layout-panel-center', window.parent.document)
			.width() - $('#id_processingpanel', window.parent.document).width())
			/ 2 + $('.layout-panel-west', window.parent.document).width();
	$("#id_processingpanel", window.parent.document).css({
				left : loading_left + 'px'
			});
	$("#id_processingspan", window.parent.document).attr("style",
			"display:block");

}
function closeDiv() {
	$("#id_processingpanel", window.parent.document).attr("style",
			"display:none");
	$("#id_processingpanel", window.parent.document).attr("style",
			"width: 1px;height:1px; left: 0px; top: 0;");
}

/**
 * 判断值是否为空
 * @param value 值
 * @returns
 */
function ifNull(value) {
	if (value == '' || value == null || typeof(value) == 'undefined') {
		return true;
	}
	return false;
}

/**
 * 正则校验
 * @param value 需校验的值
 * @param regex 正则表达式
 * @param message 校验不通过提示
 * @returns
 */
function checkRegex(value, regex, message) {
	if (regex.test(value)) {
		return true;
	} else {
		if (!ifNull(message)) {
			doTheAlert('提示', message);
		}
		return false;
	}
}

/**
 * 校验ip地址
 * @param ip
 * @param message 校验不通过提示
 * @returns
 */
function checkIpAddress(ip, message) {
	var regex = /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$/;
	return checkRegex(ip, regex, message);
}