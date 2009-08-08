jQuery.extend(app,{
   form_panel : function (obj,callback) {
      //debug(obj);
      $('.panel_cloned').empty().remove();
      var panel_id_num = panel_id_num > 1 ? panel_id_num : 1;
      var panel_id = 'form_panel_cloned-'+panel_id_num;
      var body = obj.body || '';
      var controls = obj.controls ? obj.controls : [];
      app.lock_elem({elems:['#wrapper'],id:'wrapper_locked'});
      var pos = app.get_elem_position('#desktop');
      var close_panel = function (p) {
         $('#'+p).empty().remove();
         app.unlock_elem({elems:['#wrapper']});
      };
      $('.form_panel').clone().attr({'id':panel_id})
      .css({'position':'absolute','top':pos.top,'left':pos.left})
      .addClass('panel_cloned')
      .appendTo('.locked_element');
      $('#'+panel_id).removeClass('template');
      $('[id='+panel_id+'] > [class=form_panel_title]').html('<p class="form_panel_title_text">'+obj.title+'</p>');
      $('[id='+panel_id+'] > [class=form_panel_body]').html(body);
      $('[id='+panel_id+'] > [class=form_panel_buttons]').attr({id:'form_panel_buttons-'+panel_id_num});

      $('#'+panel_id).show(1000,function(){
         $(this).css({'border-style':'solid outset outset solid','border-width':'1px 6px 6px 1px'});
         $('[id='+panel_id+'] > [class=form_panel_buttons]').find('.close').bind('click',function(e){
            close_panel(panel_id);
         });
         jQuery.each(controls,function (k,v){
            $('<input type="button" value="'+v.val+'" />')
            .addClass('new_quiz_form_bt '+v.classes)
            .appendTo('#form_panel_buttons-'+panel_id_num);
            $('#form_panel_buttons-'+panel_id_num +',input[value='+v.val+']' ).wrap('<div></div>');
         });
         if (callback) {
            callback(panel_id);
         }
      });
      return {
         close : function (p) {
            close_panel(p);
         }
      }
   },
   show_form_panel_message : function (err) {
      $('#form_panel_cloned > [class=form_panel_body]').empty();
      $('<div id="f_p_msg_box"></div>').addClass('form_panel_msg_box').appendTo('#form_panel_cloned > [class=form_panel_body]');
      $('<p class="f_p_msg"></p>').text(err.msg).appendTo('#f_p_msg_box');
      if (err.num > 0) {
         $('.f_p_msg').addClass('f_p_msg_error');
      }
   },
   show_dialog : function (msg,callback) {

      var pos = app.get_elem_position('#form_panel_cloned');app.lock_elem({elems:['body'],id:'form_panel_locked'});
      $('.dialog_panel').clone().attr({'id':'dialog_panel_cloned'})
      .css({'position':'absolute','top':pos.top,'left':pos.left})
      .appendTo('#form_panel_locked');
      $('#dialog_panel_cloned').show(1000,function(){
         $('#dialog_panel_cloned > [class=dlg_form]').html(msg);
         $('.dlg_button').filter('.close').bind('click',function(e){
            app.unlock_elem({elems:['body']})
            $('#dialog_panel_cloned').remove();
            $('#form_panel_locked').remove();
         });
      });
      if (callback) {
         callback();
      }
   }
});