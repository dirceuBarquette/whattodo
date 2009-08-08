jQuery.extend(app,{
   search_quiz_for_answer : function () {
      var prompt = new app.prompt({title:'procurar question&aacute;rio',body:''});
      prompt.open('#desktop',function(prompt_id){
         var columns = [{title:'id'},{title:'t&iacute;tulo'}];
         var row_click = function(row){
            var ser = '&id='+$(row).data('id');
            app.ajx({whattodo:'create_quiz_form',data:ser});
         };
         var table = new app.table({columns:columns,list_name:'quiz_list',row_click:row_click});
         table.open($('#'+prompt_id).find('.prompt_body'),function(){
            table.populate();
         });
      });
   },
   search_answered_quiz : function () {
      var prompt = new app.prompt({title:'procurar grupo',body:''});
      prompt.open('#desktop',function(prompt_id){
         var columns = [{title:'id'},{title:'grupo'},{title:'question&aacute;rio'},{title:'usu&aacute;rio'},{title:'total'},{title:'preenchidas'}];
         var row_click = function(row){
            var ser = '&id='+$(row).data('id');
            app.ajx({whattodo:'get_answered_quiz',data:ser});
         };
         var table = new app.table({columns:columns,list_name:'group_list',row_click:row_click,default_download_list:true});
         table.open($('#'+prompt_id).find('.prompt_body'),function(){
            table.populate();
         });
      });
   },
   get_answered_quiz : function (data) {
      //console.log('get_answered_quiz->',data);
      //$('<div id="quiz_header"><div id="target_name">'+data.target_name+'</div><div class="quiz_name"><label>question&aacute;rio: </label>'+data.titulo+'<span class="quiz_spec"> '+data.area+'</span></div></div>').appendTo('#desktop');
      $('<div id="quiz_header"><div id="target_name">'+data.target_name+'</div></div>').appendTo('#desktop');
      $(app.create_quiz_area('quiz_area_in_target')).appendTo('#desktop');
      $('#quiz_area_in_target').addClass('quiz_area');
      if (data.config) {
         $('#quiz_area_in_target').html(data.html);
         app.quiz_config = $.evalJSON(data.config);
         var answer = [];
         $('#quiz_area_in_target').data('data',{action:'editing',quiz:data.id,titulo:data.titulo,login_resp:data.login_resp});
         jQuery.each($('#quiz_area_in_target > div'),function(k,v){
            $(this).data('question_config',app.quiz_config[k]);
            var a_type = app.quiz_config[k].answer_type+'_on_answering_controls';
            app[a_type](app.quiz_config[k].answer);
            answer[app.quiz_config[k].question_num] = app.quiz_config[k];
         });
         app.ajx({whattodo:'get_answers',data:''},function(data){
            jQuery.each(data.elem,function(k,v){
               var a_type = answer[v.question_num].answer_type+'_fill_answer';
               var q_index = parseInt(v.question_num) - 1;
               //console.log('v-> ',v)
               app[a_type](app.quiz_config[q_index].answer,v);
            });
         });
      }
      //console.log('quiz_config->',app.quiz_config);
   },
   new_target_form : function (data) {
      app.form_panel({title:'incluir grupo',body:data.html,controls:[{val:'salvar','classes':' save'}]},function(){
         jQuery.each(data.elem, function (i, val){
            $('<option value="'+val.id+'">'+val.titulo+'</option>'). appendTo('#quiz_list');
         });
         $('.new_quiz_form_bt').bind('click',function(){
            var ser = $('#send_data').serialize();
            app.ajx({whattodo:'new_target_submit',data:ser});
         });
      });
   },
   new_target_submit : function (data) {
      $('#new_quiz_form,input[type=text]').val('');
      app.show_dialog(data.error.msg,function(){
         //$(app.create_quiz_area()).appendTo('#desktop');
         ser = 'id='+data.quiz_id;
         app.ajx({whattodo:'create_quiz_form',data:ser,hang_on:{target_id:data.target_id,target:data.target}});
      });
   },
   create_quiz_form : function (data) {
      //console.log('data in create_quiz_form->',data);
      //$('<div id="quiz_header"><div id="target_name"></div><div class="quiz_name"><label>question&aacute;rio: </label>'+data.titulo+'<span class="quiz_spec"> '+data.area+'</span></div></div>').appendTo('#desktop');
      $('<div id="quiz_header"><div class="quiz_name">'+data.titulo+'</div></div>').appendTo('#desktop');
      $(app.create_quiz_area('quiz_area_in_target')).appendTo('#desktop');
      $('#quiz_area_in_target').data('data',{titulo:data.titulo}).addClass('quiz_area');
      if (data.config) {
         $('#quiz_area_in_target').html(data.html);
         app.quiz_config = $.evalJSON(data.config);
         jQuery.each($('#quiz_area_in_target > div'),function(k,v){
            $(this).data('question_config',app.quiz_config[k]);
            var a_type = app.quiz_config[k].answer_type+'_on_answering_controls';
            app[a_type](app.quiz_config[k].answer);
         });
      }
      //console.log('quiz_config->',app.quiz_config);
   },
   save_quiz_answered_form : function () {
      //var quiz = [];
      app.ajx({whattodo:'save_quiz_answered_form',data:''},function(data){
         var prompt = new app.prompt({title:'salvar pesquisa',body:data.html});
         prompt.open('#desktop',function(prompt_id){
            $('#target').attr({readonly:true}).val();
            $('#extra_login').val($('#quiz_area_in_target').data('data')['login_resp']);
            $('#quiz_list').val($('.quiz_name').text());
            var question = '';
            /*$('#enable_extra_login').unbind('click');
            $('#enable_extra_login').bind('click',function(e){
               if ($('#enable_extra_login:checked').length == 1) {
                  $('#extra_login').attr('readonly',false);
               } else{
                  $('#extra_login').attr('readonly',true);
               }
            });*/
            $('.save_bt').unbind('click');
            $('.save_bt').bind('click',function(){
               var error = [], quiz = [],answers = '';
               question = '';
               jQuery.each($('#quiz_area_in_target > div'),function(k,v){
                  var q_data = '';
                  var q_conf = $(this).data('question_config');
                  quiz[q_conf.question_num] = '';
                  quiz[q_conf.question_num] = q_conf;

                  var a_type = q_conf.answer_type+'_validate';
                  q_data = app[a_type](q_conf.answer);
                  //console.log('Q_DATA->',q_data);
                  if (q_data.ret_type == 'error') {
                     error[q_conf.question_num] = '<br />'+q_conf.question_num+': '+q_data.ret_msg;
                  } else {
                     if (q_data.ret_data.length > 0) {
                        answers += '&'+q_data.ret_data;
                     }
                  }
                  quiz[q_conf.question_num]['response'] = q_data.ret_type;
                  quiz[q_conf.question_num]['value'] = q_data.ret_data;
                  quiz[q_conf.question_num]['logic'] = q_data.ret_logic;
                  if (q_data.ret_a_map) {
                     quiz[q_conf.question_num]['answer_map'] = q_data.ret_a_map;
                  }
               });
               //console.log('QUIZ->',quiz);
               //dependences
               var deps = '',fatal = '',first_search_key = '';
               for (i = 1;i < quiz.length;i++) {
                  question = quiz[i];
                  //console.log(question);
                  if (question.search_key != '' && question.response == 'error') {
                     fatal = '<br />'+question.question_num +': Preenchimento obrigatório';
                  }
                  if (question.does_not_allow_submit == "1" && question.response == 'error') {
                     fatal = '<br />'+question.question_num +': Preenchimento obrigatório';
                  }
                  if (question.search_key != '' && first_search_key == '') {
                     first_search_key = $('#'+question.field_name).val();//question.value[0];
                  }
                  if (fatal == '') {
                     var deps = '';
                     deps = app.eval_deps(question, quiz);
                     //console.log('deps->',deps);
                     jQuery.each(deps,function(key,val){
                        if (typeof val == 'string') {
                           error[key] = val;
                        }
                     });
                  }
                  //console.log('DEPS->',deps);
               }
               if (fatal.length == 0) {
                  $('#target').val(first_search_key);
                  $('#quiz_list').val($('#quiz_area_in_target').data('data').titulo);
                  $('#msg_header_block').html('Clique novamente no botão "salvar" para enviar o question&aacute;rio');
						if (data.show_excluir_grupo == '1' && $('#quiz_area_in_target').data('data')['action'] == 'editing' ) {
							$('#span_excluir_grupo').show(function(){
                        $('#excluir_grupo').unbind('click');
                        $('#excluir_grupo').bind('click',function(e){
                           if ($('#save_bt').val() == 'salvar') {
                              $('#save_bt').val('excluir');
                              $('#quiz_area_in_target').data('data')['last_action'] = $('#quiz_area_in_target').data('data')['action'];
                              $('#quiz_area_in_target').data('data')['action'] = 'deleting';
                           } else {
                              $('#save_bt').val('salvar');
                              $('#quiz_area_in_target').data('data')['action'] = $('#quiz_area_in_target').data('data')['last_action'];
                           }
                        });
                     });
						}

                  if (error.length > 0) {
                     //console.log('ERROR->',error);
                     var final_error = '';
                     jQuery.each(error,function(k,v){

                        if (k > 0) {
                           if (typeof v == 'string') {
                              //console.log('k->',k,' v->',v,'---',typeof v,' final_error->',final_error);
                              final_error += v;
                           }
                        }

                     });
                     $('#error_block').html(final_error);
                  }
                  $("#print_msgs").unbind('click');
                  $("#print_msgs").bind('click',function(e){
                     var html = $('#target').val() + '<br />' + $('#error_block').html()
                     app.print_div({html:html});
                  }).show();
                  $('.save_bt').unbind('click');
                  $('.save_bt').bind('click',function(e){
                     //console.log('answers->',answers);
                     var ser = $('#target').serialize();
                     //if ($('#extra_login').val() != '') {
                        ser += '&'+'extra_login='+$('#extra_login').val();
                     //}
                     //console.log('extra_login->',$('#extra_login').val());
                     //ser += $('#extra_login').serialize();
                     if ($('#quiz_area_in_target').data('data')) {
                        jQuery.each($('#quiz_area_in_target').data('data'),function(k,v){
                           ser += '&'+k+'='+v;
                        });
                     }
                     app.ajx({whattodo:'send_quiz_form',data:ser+answers},function(data){
                        prompt.set_body(data.html);
                     });
                  });
               } else {
                  $('#form_block').empty().remove();
                  $('#msg_header_block').html(fatal);
               }
               //console.log('QUIZ->',quiz);
            });
         });
      });
   }
});
