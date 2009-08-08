jQuery.extend(app,{
   open_quiz : function (data) {
      app.form_panel({title:'incluir question&aacute;rio',body:data.html,controls:[{val:'Salvar','classes':'open_quiz_form_bt'}]},function(){
         $('.open_quiz_form_bt').bind('click',function(){
            var ser = $('#send_data').serialize();
            app.ajx({whattodo:'new_quiz_submit',data:ser});
         });
      });
   },
   save_as_quiz : function () {
      if ($('#quiz_area_in_quiz').length == 1) {
         app.ajx({whattodo:'save_quiz_form'},function(data){
            var prompt = new app.prompt({title:'salvar question&aacute;rio como',body:data.html});
            prompt.open('#desktop',function(prompt_id){
               $('#quiz_name').val();
               $('#quiz_area').val();
               $('#send_quiz_form_bt').bind('click',function(){
                  var qc = $.toJSON(app.quiz_config);
                  var ser = '&'+$('#send_data').serialize();

                  ser += '&html='+$('#quiz_area_in_quiz').html()+'&config='+qc;
                  app.ajx({whattodo:'new_quiz_submit',data:ser},function(data){
                     prompt.set_body(data.error.msg);
                  });
               }).val('salvar como');
            });
         });
      }
   },
   save_quiz_form : function () {
      if ($('#quiz_area_in_quiz').length == 1) {
         app.ajx({whattodo:'save_quiz_form'},function(data){
            var prompt = new app.prompt({title:'salvar question&aacute;rio',body:data.html});
            prompt.open('#desktop',function(prompt_id){
               $('#quiz_name').val($('#title_in_quiz').text());
               $('#quiz_area').val($('#area_in_quiz').text());
               $('#send_quiz_form_bt').bind('click',function(){
                  var qc = $.toJSON(app.quiz_config);
                  var ser = '&'+$('#send_data').serialize();
                  ser += '&html='+$('#quiz_area_in_quiz').html()+'&config='+qc;
                  app.ajx({whattodo:'save_quiz_submit',data:ser},function(data){
                     prompt.set_body(data.error.msg);
                  });
               }).val('salvar');
            });
         });
      }
   },
   /*save_quiz_submit : function (data) {
      $('#new_quiz_form,input[type=text]').val('');
      //app.show_dialog(data.error.msg,function(){
         //$(app.create_quiz_area()).appendTo('#desktop');
      //});
   },*/
   new_quiz_form : function () {
      if ($('#quiz_area_in_quiz > *').size() == 0) {
         app.ajx({whattodo:'new_quiz_form'},function(data){
            var prompt = new app.prompt({title:'novo question&aacute;rio',body:data.html});
            prompt.open('#desktop',function(prompt_id){
               $('#send_quiz_form_bt').bind('click',function(){
                  var ser = $('#send_data').serialize();
                  app.ajx({whattodo:'new_quiz_submit',data:ser},function(ret){
                     if (!ret.error.num) {
                        $(app.create_quiz_area()).appendTo('#desktop');
                     }
                  });
               })
            });
         });
      } else {
         app.show_dialog('Existe um question&aacute;rio aberto!');
      }
   },
   create_quiz_area : function (id) {
      id = id || 'quiz_area_in_quiz';
      return $('<div></div>').attr({id:id});
   },
   new_quiz_submit : function (data) {
      $('#new_quiz_form,input[type=text]').val('');
      app.show_dialog(data.error.msg,function(){
         $(app.create_quiz_area()).appendTo('#desktop');
      });
   },
   show_quiz_form : function (data) {
      $('#quiz_area_in_quiz').empty().remove();
      $('#quiz_data').empty().remove();
      $('<div id="quiz_data"><div id="title_in_quiz">'+data.titulo+'</div><div id="area_in_quiz">'+data.area+'</div></div>').appendTo('#desktop');
      $(app.create_quiz_area()).appendTo('#desktop');
      if (data.config) {
         $('#quiz_area_in_quiz').html(data.html);
         app.quiz_config = $.evalJSON(data.config);
         jQuery.each($('#quiz_area_in_quiz > div'),function(k,v){
            $(this).removeData('question_config');
         //console.log('EACH question_num text->',$(this).find('.question_num').text(),'q_conf question_num->',app.quiz_config[k].question_num);
            if ($(this).find('.question_num').text() != app.quiz_config[k].question_num) {
               //console.log('DEU MERDA question_num text->',$(this).find('.question_num').text(),'q_conf question_num->',app.quiz_config[k].question_num);
            } else {
               //console.log('OK question_num text->',$(this).find('.question_num').text(),'q_conf question_num->',app.quiz_config[k].question_num);
            }
            $(this).data('question_config',app.quiz_config[k]);
         });
      }
      //console.log('quiz_config->',app.quiz_config);
   },
   search_quiz_form : function () {
      var prompt = new app.prompt({title:'procurar question&aacute;rio',body:''});
      prompt.open('#desktop',function(prompt_id){
         var columns = [{title:'id'},{title:'t&iacute;tulo'}];
         var row_click = function(row){
            var ser = '&id='+$(row).data('id');
            app.ajx({whattodo:'show_quiz_form',data:ser});
         };
         var table = new app.table({columns:columns,list_name:'quiz_list',row_click:row_click});
         table.open($('#'+prompt_id).find('.prompt_body'),function(){
            table.populate();
         });
      });
   }
});