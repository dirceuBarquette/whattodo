jQuery.extend(app,{
   new_question : function (data) {
      app.form_panel({title:'incluir quest&atilde;o',body:data.html,controls:[{val:'Enviar','classes':'save_answer_form_bt'}]}
         ,function(){
            $('#send_data').data('answer_type','free_text');//default answer_type
            $('#question_num').text(app.quiz_config.length + 1);
            app.question_form_controls();
            $('.save_answer_form_bt').bind('click',function(){
               app.save_answer_form_bt();
            });
      });
   },
   validate_num_question : function (question_num,callback) {
      var errors = [];
      if (callback) {callback()}
   },

   save_answer_form_bt : function (callback) {
      //app.validate_inputs_question_config(function(){});

      var answer_type = $('#send_data').data('answer_type');
      app.eval_question_form(answer_type,function(msg){
         if (msg) {
            app.show_dialog(msg.join('<br />'),function(){});
         } else {
            validate_num_question()
         }
         //console.log('msg------>',msg);
      });
      if (callback) {callback()}
   },
   multiple_choice_options_html : {html:'<tr class="option_row"><td><input type="text" class="Label" /></td><td><input type="text" class="Value" /></td><td><span class="option2del">x</span><span class="option2up">up</span><span class="option2down">down</span></td></tr>'},

   fill_new_option : function () {
      $('#label_table').append(app.multiple_choice_options_html.html);
      if($('#with_text_field:checked').size() == 1 ) {
         $('#label_table > tr:last').find('.Value').attr({readonly:"readonly"}).val("texto livre");
      }
   },

   deppendence_row_html : {html:'<tr class="deppendence_row"><td><select class="select_questions"></select></td><td><select class="select_answers"></select></td></tr>'},

   more_dep_question_list : function (selected_dep_question,callback) {
      var to_get = 0;
      to_get += parseInt($('.deppendence_row').size());
      $('#questions_and_answers').append(app.deppendence_row_html.html);
      var row = $('.deppendence_row').get(to_get);//tr class="deppendence_row"
      var row_find = $(row).find('.select_questions');
      $('<option value="">selecione</option>').appendTo(row_find);
      jQuery.each(app.quiz_config,function(k,v){
         var opt_txt = '';
         opt_txt = v.question_num + ' -';
         arr_tmp = '';
         arr_tmp = v.question_text.split(' ');
         jQuery.each(arr_tmp,function(ky,vl){
            opt_txt +=  ky < 4 ? ' '+vl : '';
            opt_txt +=  ky == 5 ? ' (...)' : '';
         });

         var selected = parseInt(selected_dep_question) == parseInt(v.question_num) ? ' selected="selected" ' : '';
         $('<option value="'+v.question_num+'" '+selected+'>'+opt_txt+'</option>').appendTo(row_find);
      });
      callback(row);
   },
   more_dep_answer_list : function (selected_dep_answer,row,question_num) {
      if (question_num != '') {
         app.search_in_quiz_config(question_num,'question_num',app.quiz_config,function(quest_conf){
            var row_find = $(row).find('.select_answers');
            $(row_find).empty();
            if (quest_conf.answer.question_type == 'free_text') {
               $(row_find).append('<option value="filled_question">preenchida</option><option value="question_not_filled">n&atilde;o preenchida</option>');
            } else {
               $(row_find).append('<option value="filled_question">marcada</option><option value="question_not_filled">n&atilde;o marcada</option>');
               jQuery.each(quest_conf.answer.answer_config[0].options,function(k,v) {
                  $(row_find).append('<option value="'+v.value+'" >'+v.label+'</option>');
               });
               jQuery.each($(row_find).find('option'),function(k,v){
                  if ($(this).val() == selected_dep_answer) {
                     $(this).attr({selected:'selected'});
                  }
               });
            }

         });
      } else {
         $(row).find('.select_answers').empty();
      }

   },
   more_dep_button_click : function (obj) {
      var selected_dep_question = obj.selected_dep_question || '';
      var selected_dep_answer = obj.selected_dep_answer || '';
      app.more_dep_question_list(selected_dep_question,function(row){
         if (selected_dep_question != '') {
            app.more_dep_answer_list(selected_dep_answer,row,selected_dep_question  );
         }
         $(row).find('.select_questions').bind('change',function(){
            app.more_dep_answer_list(selected_dep_answer,row,$(this).val());
         });
      });
   },

   fill_question_config_form : function (question_config) {
   //console.log('question_config->',question_config);
      jQuery.each(question_config,function(k,v){
         $('#'+k).val(v);
         if (k == 'answer') {
            $('#send_data').data('answer_type',v.question_type);
            $('#'+v.question_type).css({display:'block'});

            jQuery.each(question_config[k].answer_config[0],function(key,val){
               if (key != 'deppending_on') {
                  if (key != 'options') {
                     $('#'+key).val(val);
                  } else {
                     if (v.question_type == 'multiple_choice') {
                        for (i = 0; i < $(question_config[k].answer_config[0].options).size();i++) {
                           app.fill_new_option();
                        }
                        jQuery.each(question_config[k].answer_config[0].options,function(K,V){
                           var opt = $('.option_row:childs').get(K);
                           $(opt).find('.Label').val(V.label).end().find('.Value').val(V.value);
                        });
                     }
                  }
               } else {
                  jQuery.each(val.question_num,function(idep,valdep) {
                     app.more_dep_button_click({selected_dep_question:valdep,selected_dep_answer:val.answer_num[idep]});
                  });
               }
            });
         }
      })
   },
   edit_question : function (data) {
      if ($('#quiz_area_in_quiz').size() == 1) {
         $('#quiz_area_in_quiz > div')
            .hover(
               function(){$(this).addClass('over');},
               function(){$(this).removeClass('over')})
            .click(function (e) {
               var question_config = $(this).data('question_config');
               app.form_panel({title:'editar quest&atilde;o',body:data.html,controls:[{val:'Enviar','classes':'save_answer_form_bt'}]}
                  ,function(){
                     $('#send_data').data('answer_type','free_text');//default answer_type
                     $('#label_table').html('');
                     app.question_form_controls();
                     app.fill_question_config_form(question_config);
                     $('.save_answer_form_bt').bind('click',function(){
                        var answer_type = $('#send_data').data('answer_type');
                        var msg = [];
                        app.eval_question_form(answer_type,function(msg){
                           app.show_dialog(msg.join('<br />'),function(){});
                           //console.log('msg------>',msg);
                        });
                     });
               });
            });
      }
   },
   input_field_rules_msgs : {
      1:'campo obrigat&oacute;rio',
      2:'S&oacute; pode conter n&uacute;meros',
      3:'possui caractere inv&aacute;lido'
   },
   eval_question_form : function (answer_type,callback) {
      var error_msg = [];

      //evaluating globals
      var globals = ['question_num','question_text','field_name'];
      jQuery.each(globals,function(i,id){
         //error_msg = '';
         var label_for = '';
         label_for = $('.question_form').find('[for='+id+']').text();
         var err_num = 0;
         err_num = app.eval_field($('#'+id).val(),['is_empty']);
         if (err_num == 0) {
            switch (i) {
               case 0 :
                  err_num = app.eval_field($('#'+id).val(),['is_numeric']);
                  console.log ('err_num-------->>>>>',err_num);
               break;
               case 2 :
                  err_num = app.eval_field($('#'+id).val(),['is_valid_field_name']);
               break;
               default :
                  err_num = 0;
            }
            if (err_num > 0) {
               error_msg[error_msg.length] = label_for +': '+app.input_field_rules_msgs[err_num];
            } else {
               //error_msg[error_msg.length] = '';
            }
         } else {
            error_msg[error_msg.length] = label_for +': '+app.input_field_rules_msgs[err_num];
         }
      });
      callback(error_msg)
   },
   multiple_choice_button_click : function () {
      if($('#multiple_choice').is(':visible')){
         $('#multiple_choice').hide();
      } else {
         $('.type_answer_forms').hide();
         $('#multiple_choice').show(function(){
            $('#send_data').data('answer_type','multiple_choice');
         });
      }
   },
   free_text_button_click : function () {
      if($('#free_text').is(':visible')){
         $('#free_text').hide();
      } else {
         $('.type_answer_forms').hide();
         $('#free_text').show(function(){
            $('#send_data').data('answer_type','free_text');
         });
      }
   },
   question_form_controls : function () {
      $('#allow_submit').bind('click',function(e){
         if ($(this).is(':checked')) {
            $(this).val('1');
         } else {
            $(this).val('');
         }
      });
      $('#free_text_button').bind('click',function(e){
         app.free_text_button_click();
      });
      $('#multiple_choice_button').bind('click',function(e){
         app.multiple_choice_button_click();
      });
      $('#fill_options').click(function () {
         app.fill_new_option();
      });
      $('#more_dep').click(function () {
         app.more_dep_button_click({});
      });
      $('.option2del').live('click',function(e){
         $($(this).parents('tr')).empty().remove();
      });

      $('.option2up').live('click',function(e){
         var cur_tr = $(this).parents('tr');
         var cur_tr_index = $('.option_row').index(cur_tr);
         if (cur_tr_index > 0) {
            var prev_tr_index = cur_tr_index - 1;
            var cur_Label = $('.option_row:eq('+cur_tr_index+')').find('.Label').val();
            var cur_Value = $('.option_row:eq('+cur_tr_index+')').find('.Value').val();
            var prev_Label = $('.option_row:eq('+prev_tr_index+')').find('.Label').val();
            var prev_Value = $('.option_row:eq('+prev_tr_index+')').find('.Value').val();

            $('.option_row:eq('+cur_tr_index+')').find('.Label').val(prev_Label);
            $('.option_row:eq('+cur_tr_index+')').find('.Value').val(prev_Value);
            $('.option_row:eq('+prev_tr_index+')').find('.Label').val(cur_Label);
            $('.option_row:eq('+prev_tr_index+')').find('.Value').val(cur_Value);
         }
      });
      $('.option2down').live('click',function(e){
         var cur_tr = $(this).parents('tr');
         var cur_tr_index = $('.option_row').index(cur_tr);
         if (cur_tr_index < $('.option_row').size()) {
            var next_tr_index = cur_tr_index + 1;
            var cur_Label = $('.option_row:eq('+cur_tr_index+')').find('.Label').val();
            var cur_Value = $('.option_row:eq('+cur_tr_index+')').find('.Value').val();
            var next_Label = $('.option_row:eq('+next_tr_index+')').find('.Label').val();
            var next_Value = $('.option_row:eq('+next_tr_index+')').find('.Value').val();

            $('.option_row:eq('+cur_tr_index+')').find('.Label').val(next_Label);
            $('.option_row:eq('+cur_tr_index+')').find('.Value').val(next_Value);
            $('.option_row:eq('+next_tr_index+')').find('.Label').val(cur_Label);
            $('.option_row:eq('+next_tr_index+')').find('.Value').val(cur_Value);
         }
      });
   }
});