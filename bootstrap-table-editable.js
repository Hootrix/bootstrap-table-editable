/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 * extensions: https://github.com/vitalets/x-editable
 * @Modifier https://github.com/hootrix
 */

(function($) {

    'use strict';

    $.extend($.fn.bootstrapTable.defaults, {
        editable: true,
        onEditableInit: function() {
            return false;
        },
        onEditableSave: function(field, row, oldValue, $el) {
            return false;
        },
        onEditableShown: function(field, row, $el, editable) {
            return false;
        },
        onEditableHidden: function(field, row, $el, reason) {
            return false;
        }
    });

    $.extend($.fn.bootstrapTable.Constructor.EVENTS, {
        'editable-init.bs.table': 'onEditableInit',
        'editable-save.bs.table': 'onEditableSave',
        'editable-shown.bs.table': 'onEditableShown',
        'editable-hidden.bs.table': 'onEditableHidden'
    });

    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _initTable = BootstrapTable.prototype.initTable,
        _initBody = BootstrapTable.prototype.initBody;

    BootstrapTable.prototype.initTable = function() {
        var that = this;
        _initTable.apply(this, Array.prototype.slice.apply(arguments));

        if (!this.options.editable) {
            return;
        }

        $.each(this.columns, function(i, column) {
            if (!column.editable) {
                return;
            }

            var editableOptions = {},
                editableDataMarkup = [],
                editableDataPrefix = 'editable-';

            var processDataOptions = function(key, value) {
                // Replace camel case with dashes.
                var dashKey = key.replace(/([A-Z])/g, function($1) {
                    return "-" + $1.toLowerCase();
                });
                if (dashKey.slice(0, editableDataPrefix.length) == editableDataPrefix) {
                    var dataKey = dashKey.replace(editableDataPrefix, 'data-');
                    editableOptions[dataKey] = value;
                }
            };

            $.each(that.options, processDataOptions);

            column.formatter = column.formatter || function(value, row, index) {
                    return value;
                };
            column._formatter = column._formatter ? column._formatter : column.formatter;
            column.formatter = function(value, row, index) {
                if(typeof column._formatter === 'string') column._formatter = window[column._formatter];//pang 修改.bug：启用编辑editable之后与自带的formatter不兼容
                var result = column._formatter ? column._formatter(value, row, index) : value;

                $.each(column, processDataOptions);

                $.each(editableOptions, function(key, value) {
                    editableDataMarkup.push(' ' + key + '="' + value + '"');
                });

                var _dont_edit_formatter = false;
                if (column.editable.hasOwnProperty('noeditFormatter')) {
                    _dont_edit_formatter = column.editable.noeditFormatter(value, row, index);
                }

                if (_dont_edit_formatter === false) {
                    if(!!column._formatter.name){//有自定义的formatter
                        //pang 修改 bug
                        //启用编辑editable之后与自带的formatter不兼容

                        return ['<a href="javascript:void(0)"',
                            ' data-name="' + column.field + '"',//data-name必须设置 否则x-editable无法监听到
                            ' data-pk="' + row[that.options.idField] + '"',
                            // ' data-value="' + result + '"',
                            editableDataMarkup.join(''),
                            '>' +result+ '</a>'
                        ].join('');
                    }

                    return ['<a href="javascript:void(0)"',
                        ' data-name="' + column.field + '"',
                        ' data-pk="' + row[that.options.idField] + '"',
                        ' data-value="' + result + '"',
                        editableDataMarkup.join(''),
                        '>' + '</a>'
                    ].join('');
                } else {
                    return _dont_edit_formatter;
                }

            };
        });
    };

    BootstrapTable.prototype.initBody = function() {
        var that = this;
        _initBody.apply(this, Array.prototype.slice.apply(arguments));

        if (!this.options.editable) {
            return;
        }

        $.each(this.columns, function(i, column) {
            if (!column.editable) {
                return;
            }
            var editableOptionDefault = {
                emptytext: '空数据',
                // type: 'text',
                // title: '部门',
                // source:[
                //     {value:"1",text:"研发部"},
                //     {value:"2",text:"销售部"},
                //     {value:"3",text:"行政部"}
                //     ]
            };
            var c = !!column.editablePangCustomEditableOptionFunction?window[column.editablePangCustomEditableOptionFunction](that.getData()):false;
            var editableOption = !!c?$.extend(editableOptionDefault,c):column.editable;
            that.$body.find('a[data-name="' + column.field + '"]').editable(editableOption)//修改.editable(column.editable)
                .off('save').on('save', function(e, params) {
                var data = that.getData(),
                    index = $(this).parents('tr[data-index]').data('index'),
                    row = data[index],
                    oldValue = row[column.field];

                $(this).data('value', params.submitValue);
                row[column.field] = params.submitValue;
                that.trigger('editable-save', column.field, row, oldValue, $(this));
                that.resetFooter();
            });
            that.$body.find('a[data-name="' + column.field + '"]').editable(editableOption)//修改.editable(column.editable)
                .off('shown').on('shown', function(e, editable) {
                var data = that.getData(),
                    index = $(this).parents('tr[data-index]').data('index'),
                    row = data[index];

                that.trigger('editable-shown', column.field, row, $(this), editable);
            });
            that.$body.find('a[data-name="' + column.field + '"]').editable(editableOption)//修改.editable(column.editable)
                .off('hidden').on('hidden', function(e, reason) {
                var data = that.getData(),
                    index = $(this).parents('tr[data-index]').data('index'),
                    row = data[index];

                that.trigger('editable-hidden', column.field, row, $(this), reason);
            });
        });
        this.trigger('editable-init');
    };

})(jQuery);
