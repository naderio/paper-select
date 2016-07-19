'use strict';

Polymer({

  is: 'paper-select',

  behaviors: [
    Polymer.IronFormElementBehavior,
    Polymer.PaperInputBehavior,
    Polymer.IronControlState,
  ],

  hostAttributes: {
    role: 'button'
  },

  _defaultValue: null,

  properties: {

    _input: {
      type: Object,
      value: function () {
        return this.$.input;
      },
    },

    /**
     * Items set to select from
     */
    options: {
      type: Array,
      value: function () {
        return [];
      },
    },

    /**
     * Input's search text
     */
    input: {
      type: String,
      value: '',
      notify
: true,
      observer: '_inputChanged',
    },

    /**
     * Element's selected value
     */
    bindValue: {
      type: Object,
      value: null,
      notify: true,
    },

    /**
     * Multuple selection mode, tags-like 
     */
    multiple: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
    },

    /**
     * Selection uniqueness constraint
     */
    unique: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
    },

    /**
     * Unique value field name for unique value select
     */
    uniqueField : {
      type: String,
      value : 'name'
    },

    /**
     * Select non-matching search text
     */
    nonmatching: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
    },

    /**
     * Select search text on blur
     */
    selectOnBlur: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
    },

    /**
     * Keep search text on blur
     */
    keepOnBlur: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
    },

    /**
     * Field to used for display
     */
    labelField: {
      type: String,
      value: null,
      reflectToAttribute: true,
    },

    /**
     * Field to use for value
     */
    valueField: {
      type: String,
      value: null,
      reflectToAttribute: true,
    },

    _showInput: {
      computed: '_computeShowInput(multiple, bindValue)'
    },

    _showOptions: {
      computed: '_computeShowOptions(options, _showAddAction)'
    },

    _showAddAction: {
      computed: '_computeShowAddAction(nonmatching, input)'
    },

  },

  observers: [
    '_valueChanged(bindValue.*)'
  ],

  listeners: {
    // 'blur': '_onBlur',
    // 'keydown': '_onKeyDown',
    'input.bind-value-changed': '_stopPropagation'
  },

  // Element Lifecycle

  created: function () {
    this.toggleClass('paper-input-input', true);
  },

  ready: function () {

    var self = this;
    this.$.input.validate = function (value) {
      return !self.required || !!self.bindValue;
    };

    // var _template;

    // _template = Polymer.dom(this).querySelector('template[selected-item]');
    // console.log(_template, this.root)
    // if (_template) {
    //   var t = document.createElement('template');
    //   t.id = 'paper-select-selected-item-template';
    //   t.innerHTML = _template.innerHTML;
    //   Polymer.dom(this.root).replaceChild(t, this.$['paper-select-selected-item-template']);
    // }

    // _template = this.querySelector('template[option-item]');
    // if (_template) {
    //   var t = document.createElement('template');
    //   t.id = 'paper-select-option-item-template';
    //   t.innerHTML = _template.innerHTML;
    //   Polymer.dom(this).replaceChild(t, this.$['paper-select-option-item-template']);
    // }

  },

  attached: function () {
    this.options = this.options || null;
    this.set('bindValue', this.bindValue || this.value || this._defaultValue);
    this.input = this.input || '';
  },

  // Element Behavior

  _inputChanged: function () {
    // console.log('_inputChanged', arguments);    this._fixLabelState();
  },

  _valueChanged: function () {
    // console.log('_valueChanged', this, arguments);
    if (this.multiple)
      this.value = this.bindValue ? this.bindValue.map(this._formValueOf.bind(this)).join(',') : '';
    else
      this.value = this.bindValue ? this._formValueOf(this.bindValue) : '';
    this.$.inputContainer._handleValue(this.$.input);
    this._fixLabelState();
  },

  _computeShowInput: function (multiple, bindValue) {
    return multiple || !bindValue;
  },

  _computeShowOptions: function (options, _showAddAction) {
    return options && options.length || _showAddAction;
  },

  _computeShowAddAction: function (nonmatching, input) {
    return nonmatching && input.trim();
  },

  _wrap: function (item) {
    return {
      item: item
    };
  },

  /**
   * Resets component.
   */
  reset: function () {
    this.set('bindValue', this._defaultValue);
    this.clear();
  },

  /**
   * Resets component's input.
   */
  clear: function () {
    this.input = '';
    this.options = null;
    this.$.optionsMenu.selected = null;
  },

  /**
   * Prepares select/option item's display.
   *
   * @param {object} Select item data.
   * @return {string} Label.
   */
  _labelOf: function (obj) {
    // console.log('_labelOf', this.labelField, this.valueField, obj)
    if (this.labelField === null && this.valueField === null)
      return obj || '';
    return typeof obj === 'object' && obj ? obj[this.labelField || this.valueField] : obj || '';
  },

  _valueOf: function (obj) {
    // console.log('_valueOf', this.labelField, this.valueField, obj)
    if (this.valueField === null)
      return obj || '';
    return typeof obj === 'object' && obj ? obj[this.valueField] : obj || '';
  },

  _formValueOf: function (obj) {
    // console.log('_formValueOf', this.labelField, this.valueField, obj)
    if (this.valueField === null && this.labelField === null)
      return obj || '';
    return typeof obj === 'object' && obj ? obj[this.valueField || this.labelField] : obj || '';
  },

  _highlight: function (label) {
    return label.substr(0, this.input.length);
  },

  _highlightAfter: function (label) {
    return label.substr(this.input.length);
  },

  _focus: function () {
    this.$.input.focus();
  },

  _fixLabelState: function () {
    // console.log('_fixLabelState')
    this.$.inputContainer._inputHasContent = !!this.bindValue || !!this.input;
  },

  _onBlur: function () {
    // if (this.nonmatching && this.input && this.selectOnBlur)
    //   this._addItem();
    // if (!this.keepOnBlur)
    //   this.async(this.clear.bind(this), 100);
  },

  _onKeyDown: function (event, detail) {
    switch (event.keyCode) {
    case 38: // up arrow
    case 40: // down arrow
      event.preventDefault();
      event.stopPropagation();
      break;
    }
  },

  _cancelEvent: function (event, detail) {
    event.preventDefault();
    event.stopPropagation();
  },

  _preventDefault: function (event) {
    event.preventDefault();
  },

  _stopPropagation: function (event) {
    event.stopPropagation();
  },

  _cancelKeyboardEventScroll: function (event, detail) {
    detail.keyboardEvent.preventDefault();

    // detail.keyboardEvent.stopPropagation();
  },

  _elementTapped: function (event, detail) {
    this._focus();
  },

  _removeSelectedItemTapped: function (event, detail) {
    if (this.multiple) {
      // var value = Polymer.dom(event).rootTarget.parentElement.value;
      var index = this.bindValue.indexOf(event.model.item);
      if (this.bindValue.length === 1) {
        this.set('bindValue', this._defaultValue);
      } else {
        this.splice('bindValue', index, 1);
      }
    } else {
      this.set('bindValue', this._defaultValue);
    }
    this.async(this.clear.bind(this));
    this.async(this._focus.bind(this));
  },

  _onInputKeyDown: function (event, detail) {
    switch (event.keyCode) {
          case 8: // backspace
      if (this.multiple && this.input.length === 0 && this.bindValue && this.bindValue.length > 0) {
        this.pop('bindValue');
      }

      break;
    case 188: // comma
      if (this.nonmatching && this.input.trim()) {
        event.preventDefault();
      }

      break;
    }
  },

  _onInputKeyÛp: function (event, detail) {
    // console.log('_onInputKeyÛp', event, event.keyCode);
    switch (event.keyCode) {
    case 188: // comma
    case 13: // enter
      if (this.nonmatching && this.input.trim()) {
        this._addItem();
      }

      break;

      // case 27: // escape
      //   this.clear();
      //   break;
      // case 40: // down arrow
      //   this.$.optionsMenu.focus();
      //   this.$.optionsMenu.selected = 0;
      //   break;
    }
  },

  // _removeSelectedItemPressed: function(event, detail) {
  //   if (this.multiple && this.input.length === 0 && this.bindValue && this.bindValue.length > 0) {
  //     this.pop('bindValue');
  //   }
  // },

  // _addItemPressed: function(event, detail) {
  //   if (this.nonmatching && this.input.trim()) {
  //     detail.keyboardEvent.preventDefault();
  //     this._addItem();
  //   }
  // },

  _focusOnOptionsPressed: function (event, detail) {
    this.$.optionsMenu.focus();
  },

  _optionItemTapped: function (event, detail) {
    this.selectItem(event.model.item);
  },

  _optionItemKeyUp: function (event, detail) {
    if (event.keyCode === 13) { // enter
      this.selectItem(event.model.item);
    }
  },

  _addItem: function () {
    var input = this.input.trim();
    if (!input)
      return;
    var detail = {
      value: input
    };
    this.fire('adding-item', detail);
    this.async(function () {
      this.selectItem(detail.value);
    });
  },

  _addItemOnEnter: function (event, detail) {
    if (event.keyCode === 13) {
      if (this.nonmatching && this.input.trim()) {
        this._addItem();
      }
    }
  },

  selectItem: function (item) {
    if (this.multiple) {
      if (!this.bindValue)
        this.set('bindValue', [item]);
      else {
        if(this.unique) {
          var self = this;
          var existItems = this.bindValue.filter(function(addedItem) {
            if(!addedItem[self.uniqueField] && !item[self.uniqueField])
              return false;
            return addedItem[self.uniqueField].toLowerCase().indexOf(item[self.uniqueField]) === 0;
          });
          if(existItems.length == 0)
            this.push('bindValue', item);
        } else
          this.push('bindValue', item);
      }
    } else {
      this.set('bindValue', item);
    }
    this.async(this.clear.bind(this));
    if (this.multiple)
      this.async(this._focus.bind(this));
  },

  /**
   * The `adding-item` event is fired whenever an item is added.
   *
   * @event adding-item
   * @detail {{value: String}}
   */

});
