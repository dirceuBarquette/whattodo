jQuery.extend(app,{
    get_option_menu_items: function(data){
        app.clean_desktop();
        $('#optionmenu').empty();
        jQuery.each(data.elem, function (i, val) {
            var sub_items = val.sub_items || [];
            var whattodo = val.whattodo != 'get_sub_items' ? val.whattodo : val.whattodo + '-' + i;
            $('<div id="'+whattodo+'" class="option_menu_button"></div>')
            .text(val.label)
            .bind('click',function(e){
                if (!app.app_locked) {
                    if ($(this).hasClass('button_pressed_om')) {
                        $(this).removeClass('button_pressed_om');
                    } else {
                        $('.option_menu_button').removeClass('button_pressed_om');
                        $(this).addClass('button_pressed_om');
                    }
                    if (data.cyp != '1') {
                        app.whattodo_or_sub_items({'sub_items':sub_items,'whattodo':whattodo,'title':val.label});
                    } else {
                        if (val.whattodo != 'get_sub_items') {
                            $('#desktop').html('É necessário alterar sua senha a partir do menu "Usuários!"');
                            $('#optionmenu').empty();
                        } else {
                            app.whattodo_or_sub_items({sub_items:val.sub_items,'whattodo':whattodo});
                        }
                    }
                }
            })
            .appendTo('#optionmenu');
        });
    },
    whattodo_or_sub_items : function (obj) {
        if (obj.sub_items.length > 0) {
            var sub_items_div_id = '#sub_items-'+obj.whattodo;
            if ($(sub_items_div_id).length == 0) {
                $('<div id="sub_items-'+obj.whattodo+'" class="option_menu_parent_div '+obj.whattodo+'"></div>')
                .appendTo('#desktop').show(500);
                jQuery.each(obj.sub_items,function(k,v){
                    /*var meta = [];
                    if (v.meta) {
                        meta = $.evalJSON(v.meta);
                    }*/
                    $('<div id="'+v.whattodo+'" class="sub_item_option_menu_button"></div>')
                    .text(v.label)
                    /*.bind('click',function(e){
                        $('.option_menu_parent_div').hide();
                        app.ajx({whattodo:v.whattodo,hang_on:meta});
                    })*/
                    .appendTo(sub_items_div_id);
                    $('#'+v.whattodo).unbind('click');
                    $('#'+v.whattodo).bind('click',function(e){
                        $('.option_menu_parent_div').hide();
                        //app.ajx({whattodo:v.whattodo,hang_on:meta});
                        var whattodo = v.whattodo;
                        app[whattodo]();
                    })
                });

                var dims = app.get_sub_items_wrapper_len($('#sub_items-'+obj.whattodo+' > .sub_item_option_menu_button '));
                var p = app.get_sub_items_wrapper_pos($('#'+obj.whattodo));

                $(sub_items_div_id).css({'height':dims.height,'position':'absolute','top':p.top,'left':p.left});
                app.sub_item_div_behavior(sub_items_div_id);
            } else {
                app.sub_item_div_behavior(sub_items_div_id);
            }
        } else {
            $('.option_menu_parent_div').hide();
            app.ajx({whattodo:obj.whattodo});
        }
    },
    get_sub_items_wrapper_len : function (obj) {
        var items = obj.length;
        var bt = $('.sub_item_option_menu_button');
        var dims = app.get_elem_len(bt[0]);
        jQuery.each(dims,function(k,v){
            if (k == 'height') {
                dims[k] = items * v;
                dims[k] += 'px'
            }
            else {
                dims[k] = v + 'px';
            }
        })
        return dims;
    },
    get_sub_items_wrapper_pos : function (elem) {
        var a_pos = app.get_elem_position(elem);
        var dims = app.get_elem_len(elem);
        var top = a_pos['top'] + dims.height + 1;
        var left = a_pos['left'] + 10;
        var wrapper_pos = {'top':top + 'px','left':left + 'px'};
        return wrapper_pos;
    },
    sub_item_div_behavior : function (id) {
        if ($(id).is(':visible')) {
            $('.option_menu_parent_div').hide();
        } else {
            $('.option_menu_parent_div:visible').hide();
            $(id).show();
        }
    }
});