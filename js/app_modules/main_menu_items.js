jQuery.extend(app,{
    get_main_menu_items: function(data){
        app.clean_desktop();
        jQuery.each(data.elem, function (i, val) {
            $('<div id="'+val.whattodo+'" class="main_menu_button"></div>')
            .text(val.label)
            .bind('click',function (e){
                app.quiz_config = [];
                if (!app.app_locked) {
                    if ($(this).hasClass('button_pressed_mm')) {
                        $(this).removeClass('button_pressed_mm');
                    } else {
                        $('.main_menu_button').removeClass('button_pressed_mm');
                        $(this).addClass('button_pressed_mm');
                    }
                    if (data.cyp != '1') {
                        app.ajx({whattodo:'get_option_menu_items',data:'mm='+val.id});
                    } else {
                        if (val.whattodo != 'usuarios') {
                            $('#desktop').html('É necessário alterar sua senha a partir do menu "Usuários!"');
                            $('#optionmenu').empty();
                        } else {
                            app.ajx({whattodo:'get_option_menu_items',data:'mm='+val.id});
                        }
                    }
                }
            })
            .appendTo('#mainmenu');
        });

        $('<div id="exit" class=""><a href="index.php?whattodo=exit">sair</a></div>')
        .appendTo('#mainmenu');
    }
});