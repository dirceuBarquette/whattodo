jQuery.extend(app,{

   search_user : function () {
      var prompt = new app.prompt({title:'procurar usu&aacute;rio',body:''});
      prompt.open('#desktop',function(prompt_id){
         var columns = [{title:'id'},{title:'login'},{title:'area'},{title:'tipo'}];
         var row_click = function(row){
            var ser = '&id='+$(row).data('id');
            app.ajx({whattodo:'show_user_data',data:ser});
         };
         var table = new app.table({columns:columns,list_name:'user_list',row_click:row_click});
         table.open($('#'+prompt_id).find('.prompt_body'),function(){
            table.populate();
         });
      });
   },
   edit_user_form : function (data) {
      if ($('.generic_desktop_wrapper').data('user')) {
         var user_data =  $('.generic_desktop_wrapper').data('user');
         var ser = '&id='+user_data.id;
         app.ajx({whattodo:'edit_user_form',data:ser},function(dt){
            var prompt = new app.prompt({title:'alterar usu&aacute;rio',body:dt.html});
            prompt.open('#desktop',function(prompt_id){
               $('#usu').val(dt.usu);
               $('#area').val(dt.area);
               var cmp = '';
               jQuery.each(dt.elem, function (i, val){
                  cmp = val.id == dt.selected_index ? ' selected="selected" ' : '';
                  $('<option value="'+val.id+'" '+cmp+'>'+val.tipo+'</option>'). appendTo('#list_tipo_usu');
               });
               $('#send_user_form_bt').bind('click',function(){
                  var ser = $('#send_data').serialize();
                  app.ajx({whattodo:'edit_user_submit',data:ser},function(ret){
							prompt.set_body(ret.error.msg);
                     /*if (!ret.error.num) {
                        ser = '&id='+ret.error.id;
                        app.ajx({whattodo:'show_user_data',data:ser});
                     }*/
                  });
               }).val('Alterar');
            });
         });
      }
   },
   change_user_password_form : function () {
      if ($('.generic_desktop_wrapper').data('user')) {
         var user_data =  $('.generic_desktop_wrapper').data('user');
         var ser = '&id='+user_data.id;
         app.ajx({whattodo:'change_user_password_form',data:ser},function(dt){
            var prompt = new app.prompt({title:'alterar senha',body:dt.html});
            prompt.open('#desktop',function(prompt_id){
               $('#login').val(dt.login);
               $('#send_user_form_bt').bind('click',function(){
                  var ser = $('#send_data').serialize();
                  app.ajx({whattodo:'change_user_password_submit',data:ser},function(ret){
                     if (!ret.error.num) {
                        ser = '&id='+ret.error.id;
                        app.ajx({whattodo:'show_user_data',data:ser});
                     }
                  });
               }).val('Alterar');
            });
         });
      }
   },
   new_user_form : function () {
      app.ajx({whattodo:'new_user_form'},function(data){
         var prompt = new app.prompt({title:'incluir usu&aacute;rio',body:data.html});
         prompt.open('#desktop',function(prompt_id){
            jQuery.each(data.elem, function (i, val){
               $('<option value="'+val.id+'">'+val.tipo+'</option>'). appendTo('#list_tipo_usu');
            });
            $('#send_user_form_bt').bind('click',function(){
               var ser = $('#send_data').serialize();
               app.ajx({whattodo:'new_user_submit',data:ser},function(ret){
						prompt.set_body(ret.error.msg);
                  //if (!ret.error.num) {
                     //ser = '&id='+ret.error.id;
                     //app.ajx({whattodo:'show_user_data',data:ser});
                  //}
               });
            })
         });
      });
   },
   close_user_data : function () {
      $('.generic_desktop_wrapper').empty().remove();
   },
   show_user_data : function (data) {
      $('.generic_desktop_wrapper').empty().remove();
      $('<div class="generic_desktop_wrapper">'+data.html+'</div>').appendTo('#desktop');
      $('.generic_desktop_wrapper').data('user',data);
      $('#usu_data').text(data.usu);
      $('#area_data').text(data.area);

      jQuery.each(data.elem, function (i, val){
         if (val.id == data.selected_index) {
            $('#list_tipo_usu_data').text(val.tipo);
         }
      });
   }
});
