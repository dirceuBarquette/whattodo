jQuery.extend(app,{
   new_question : function (data) {
      if ($('#quiz_area_in_quiz').length == 1) {
         app.ajx({whattodo:'new_question'},function(data){
            var prompt = new app.prompt({title:'incluir quest&atilde;o',body:data.html});
            prompt.open('#desktop',function(prompt_id){
               $('#send_data').data('answer_type','free_text');//default answer_type
               var question_num = app.quiz_config.length + 1;
               $('#question_num').text(question_num);
               app.question_form_controls();

               $('.save_answer_form_bt').bind('click',function(){
                  var msgs = '';
                  var a_type = $('#send_data').data('answer_type');
                  var config = [{id:'answer_type',val:a_type}];
                  jQuery.each(
                     $($('#send_data').find('.global')
                     ),function(k,v){
                        var id = $(v).attr('id');
                        config[config.length] = {id:id,val:$(v).val()
                     };
                  });
                  msgs = app.eval_question_form(config);
                  if (msgs.length > 0) {
                     app.show_dialog(msgs.join('<br />'),function(){});
                  } else {
                     var question_config = app.mount_question_config(config,a_type,question_num);
                     var q = question_config.question;
                     $('<div></div>').attr({id:'complete_question-'+q.question_num})
                     .addClass('complete_question')
                     .appendTo('#quiz_area_in_quiz');
                     $('<div></div>').attr({id:'complete_question_num_plus_text-'+q.question_num})
                     .addClass('complete_question_num_plus_text')
                     .appendTo('#complete_question-'+q.question_num)

                     $('<span></span>').attr({id:'complete_question_num-'+q.question_num})
                     .text(q.question_num).addClass('question_num')
                     .appendTo('#complete_question_num_plus_text-'+q.question_num);
                     $('<span></span>').attr({id:'complete_question_text-'+q.question_num})
                     .text(q.question_text).addClass('question_text')
                     .appendTo('#complete_question_num_plus_text-'+q.question_num);

                     $('<div></div>').attr({id:'complete_question_answer-'+q.question_num})
                     .appendTo('#complete_question-'+q.question_num);
                     $('#complete_question_answer-'+q.question_num).html(question_config.answer_config.build_html());
                     $(this).hide();
                  }
               });
            });
         });
      } else {
         app.show_dialog('Existe um question&aacute;rio aberto!');
      }
   },
   edit_question : function () {
      if ($('#quiz_area_in_quiz').size() == 1) {
         $('#quiz_area_in_quiz > *').removeClass('[class*=over]');
         $('#quiz_area_in_quiz > div')
         .unbind('click')
         .hover(
            function(){
               if (!app.app_locked) {
                  $(this).addClass('over_editing');
               }
            },
            function(){
                  $(this).removeClass('over_editing')
            }
         )
         .click(function (e) {
            if (!app.app_locked) {
               $('#quiz_area_in_quiz > div').removeClass('over_editing');
               var index = $('#quiz_area_in_quiz > div').index(this);
               var question_config = $(this).data('question_config');
               var q_div_id = this.id;
               //debug(question_config);
               var question_num = question_config.question_num;
               app.ajx({whattodo:'edit_question'},function(data){
                  var prompt = new app.prompt({title:'editar quest&atilde;o',body:data.html});
                  prompt.open('#desktop',function(prompt_id){
                     $('#send_data').data('answer_type','free_text');//default answer_type
                     $('#label_table').html('');
                     $('#question_num').text(question_num);
                     app.question_form_controls();
                     app.fill_question_config_form(question_config);

                     $('.save_answer_form_bt').bind('click',function(){
                        $('#quiz_area_in_quiz > div').removeClass('over_editing');
                        var msgs = '';
                        var a_type = $('#send_data').data('answer_type')
                        var config = [{id:'answer_type',val:a_type}];
                        jQuery.each($($('#send_data').find('.global')),function(k,v){
                           var id = $(v).attr('id');
                           //console.log('QCONFIG-------->',question_config);
                           config[config.length] = {id:id,val:$(v).val()};
                        });
                        msgs = app.eval_question_form(config);
                        if (msgs.length > 0) {
                           app.show_dialog(msgs.join('<br />'),function(){});
                        } else {
                           $('#quiz_area_in_quiz > div').removeClass('over');
                           //console.log('index-> ',index,' config-> ',config);
                           var question_config = app.mount_question_config(config,a_type,question_num,index);
                           var q = question_config.question;
                           $('#'+q_div_id +'> *').empty().remove();//removing question body
                           $('<div></div>').attr({id:'complete_question_num_plus_text-'+q.question_num})
                           .addClass('complete_question_num_plus_text')
                           .appendTo('#complete_question-'+q.question_num)

                           $('<span></span>').attr({id:'complete_question_num-'+q.question_num})
                           .text(q.question_num).addClass('question_num')
                           .appendTo('#complete_question_num_plus_text-'+q.question_num);
                           $('<span></span>').attr({id:'complete_question_text-'+q.question_num})
                           .text(q.question_text).addClass('question_text')
                           .appendTo('#complete_question_num_plus_text-'+q.question_num);

                           $('<div></div>').attr({id:'complete_question_answer-'+q.question_num})
                           .appendTo('#complete_question-'+q.question_num);
                           $('#complete_question_answer-'+q.question_num).html(question_config.answer_config.build_html());
                           $(this).hide();
                        }
                     });
                  });
               });
            }
         });
      } else {
         app.show_dialog('Não existe um question&aacute;rio aberto!');
      }
   },
   reorder_question : function (data) {
      if ($('#quiz_area_in_quiz').length == 1) {
         $('#quiz_area_in_quiz > *').removeClass('[class*=over]');
         $('#quiz_area_in_quiz > div')
         .unbind('click')
         .hover(
            function(){
               if (!app.app_locked) {
                  $(this).addClass('over_reordering');
               }
            },
            function(){$(this).removeClass('over_reordering')}
         )
         .click(function (e) {
            if (!app.app_locked) {
               $('#quiz_area_in_quiz > div').removeClass('over_reordering');
               var index = $('#quiz_area_in_quiz > div').index(this);
               var question_config = $(this).data('question_config');
               app.ajx({whattodo:'reorder_question'},function(data){
                  var prompt = new app.prompt({title:'renumerar quest&atilde;o',body:data.html});
                  prompt.open('#desktop',function(prompt_id){
                     var cur_question_num = parseInt(question_config.question_num);
                     $('.form_panel_body_content').find('.question_num').text(cur_question_num);
                     $('.form_panel_body_content').find('#new_question_num').text(cur_question_num);
                     $('#question_num2down').bind('click',function(e){
                        if (cur_question_num > 1) {
                           $('.form_panel_body_content').find('#new_question_num').text(--cur_question_num);
                        }
                     });
                     $('#question_num2up').bind('click',function(e){
                        if (cur_question_num < app.quiz_config.length) {
                           $('.form_panel_body_content').find('#new_question_num').text(++cur_question_num);
                        }
                     });
                     $('#reorder_question_form_bt').bind('click',function(e){
                        var quiz_config = app.quiz_config;
                        var to_question = parseInt($('#new_question_num').text());
                        var new_index = to_question - 1;
                        var quiz_config = app.quiz_config;
                        app.move_question_into_quiz_config(index,new_index,quiz_config,function(new_quiz_config){
                           //console.log('new_quiz_config->',new_quiz_config);
                           jQuery.each(new_quiz_config,function(k,v){
                              new_quiz_config[k].question_num = k + 1;
                           });
                           //moving html
                           $('#quiz_area_in_quiz > div:eq('+index+')').insertBefore('#complete_question-'+to_question);

                           app.quiz_config = '';
                           app.quiz_config = new_quiz_config;
                           //console.log('APP.QUIZ_CONFIG----->',app.quiz_config,' new_quiz_config->',new_quiz_config);
                           jQuery.each($('#quiz_area_in_quiz > div'),function(k,v){
                              var question = app.quiz_config[k];
                              var q_num2change = $(this).find('.question_num').text();
                              $(this).data('question_config',question);
                              $(this).find('.question_num').text(question.question_num);
                              jQuery.each($(this).find('[id*=-'+q_num2change+']'),function(k,v){
                                 var splt = this.id.split('-');
                                 $(this).attr({id:splt[0]+'-'+question.question_num})
                                 //console.log(this.id)
                              });
                              $(this).attr({id:'complete_question-'+question.question_num});

                           });
                        });
                        $(this).hide();
                     });
                  });
               });
            }
         });
      } else {
         app.show_dialog('Não existe um question&aacute;rio aberto!');
      }
   },
   remove_question : function (data) {
      if ($('#quiz_area_in_quiz').size() == 1) {
         $('#quiz_area_in_quiz > *').removeClass('[class*=over]');
         $('#quiz_area_in_quiz > div')
         .unbind('click')
         .hover(
            function(){
               if (!app.app_locked) {
                  $(this).addClass('over_removing');
               }
            },
            function(){$(this).removeClass('over_removing')}
         )
         .click(function (e) {
            if (!app.app_locked) {
               $('#quiz_area_in_quiz > div').removeClass('over_editing');
               var index = $('#quiz_area_in_quiz > div').index(this);
               var question_config = $(this).data('question_config');
               app.ajx({whattodo:'remove_question'},function(data){
                  var prompt = new app.prompt({title:'excluir quest&atilde;o',body:data.html});
                  prompt.open('#desktop',function(prompt_id){
                     $('.form_panel_body_content').find('.question_num').text(question_config.question_num);
                     $('#remove_answer_form_bt').bind('click',function(e){
                        $('.complete_question:eq('+index+')').empty().remove();
                        var quiz_config = app.quiz_config;
                        app.delete_from_quiz_config(index,quiz_config,function(new_quiz_config){
                           if (index < new_quiz_config.length) {
                              new_quiz_config = app.reordering_quiz(index,new_quiz_config);

                           }
                           app.quiz_config = '';
                           app.quiz_config = new_quiz_config;
                           jQuery.each($('#quiz_area_in_quiz > div'),function(k,v){
                              var question = app.quiz_config[k];
                              $(this).data('question_config',question);
                              var id_to_change = $(this).find('.question_num').text();
                              $(this).find('.question_num').text(question.question_num);
                              jQuery.each($(this).find('[id*=-'+id_to_change+']'),function(k,v){
                                 var splt = this.id.split('-');
                                 $(this).attr({id:splt[0]+'-'+question.question_num})
                                 //console.log(this.id)
                              });
                              $(this).attr({id:'complete_question-'+question.question_num});

                           });
                        });
                        $(this).hide();
                     });
                  });
               });
            }
         });
      } else {
         app.show_dialog('Não existe um question&aacute;rio aberto!');
      }
   },
   mount_question_config : function (config,a_type,question_num,index) {
      //console.log(config,a_type,question_num,index);
      var idx = app.quiz_config.length;
      if (index >= 0) {
         idx = index;
         app.quiz_config[idx] = '';
      }
      //var idx = index || app.quiz_config.length;
      var ids = jQuery.map(config,function(elem,index){
         return elem.id;
      });
      var vals = jQuery.map(config,function(elem,index){
         return elem.val;
      });
      var deps = [];
      jQuery.each($('.dependence_row:childs'),function(k,v){
         if (vals[jQuery.inArray('select_questions-'+k,ids)]) {
            deps[k] = {
               question_num:vals[jQuery.inArray('select_questions-'+k,ids)],
               answer_num:vals[jQuery.inArray('select_answers-'+k,ids)]
            };
         }
      });
      //console.log('ids-> ',ids,' vals-> ',vals);
      var answer_config = app[a_type](ids,vals,deps);
      var question = {
         question_num:question_num,
         search_key: vals[jQuery.inArray('search_key',ids)],
         question_text:vals[jQuery.inArray('question_text',ids)],
         answer_type:vals[jQuery.inArray('answer_type',ids)],
         field_name:vals[jQuery.inArray('field_name',ids)],
         does_not_allow_submit:$('#does_not_allow_submit:checked').size(),
         answer:answer_config.answer,
         depending_on:deps
      };
      //console.log('idx depois da bagunça->',idx,' quiz_config->',app.quiz_config);
      app.quiz_config[idx] = question;
      //console.log('quiz_config--->',app.quiz_config,' a_conf->',answer_config,' question-> ',question);
      return {
         question : question,
         answer_config : answer_config
      };
   }
});
