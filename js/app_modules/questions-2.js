jQuery.extend(app,{
   dependence_row_html : {
      html:'<tr class="dependence_row"><td><select class="global select_questions"></select></td><td><select class="global select_answers"></select></td></tr>'
   },

   more_dep_question_list : function (selected_dep_question,callback) {
      var to_get = 0;
      to_get += parseInt($('.dependence_row').size());
      $('#questions_and_answers').append(app.dependence_row_html.html);
      var row = $('.dependence_row').get(to_get);//tr class="dependence_row"
      var question_td = $(row).find('.select_questions');
      var answer_td = $(row).find('.select_answers');
      $(question_td).attr({id:'select_questions-'+to_get});
      $(answer_td).attr({id:'select_answers-'+to_get});
      $('<option value="">selecione</option>').appendTo(question_td);
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
         $('<option value="'+v.question_num+'" '+selected+'>'+opt_txt+'</option>').appendTo(question_td);
      });
      callback(row);
   },
   more_dep_answer_list : function (selected_dep_answer,row,question_num) {
      if (question_num != '') {
         app.search_in_quiz_config(question_num,'question_num',app.quiz_config,function(quest_conf){
            var row_find = $(row).find('.select_answers');
            $(row_find).empty();
            var fn_logic = quest_conf.answer.question_type+'_logic';
            var logic = app[fn_logic];
            var fn_i18n = quest_conf.answer.question_type+'_i18n';
            var i18n = app[fn_i18n][app.language];
            $(row_find).append('<option value="'+logic.right+'">'+i18n[logic.right]+'</option><option value="'+logic.wrong+'">'+i18n[logic.wrong]+'</option>');

            if (quest_conf.answer.question_type == 'multiple_choice') {
               jQuery.each(quest_conf.answer.answer_config[0].options,function(k,v) {
                  //var opt = '<option value="'+v.value+'">'+v.label+'</option>';
                  var opt = '<option value="'+k+'">'+v.label+'</option>';
                  $(row_find).append(opt);
               });
            }
            jQuery.each($(row_find).find('option'),function(key,val){
               //console.log('$(this).val()->',$(this).val(),' selected_dep_answer->',selected_dep_answer);
               if ($(this).val() == selected_dep_answer) {
                  $(this).attr({selected:'selected'});
               }
            });
         });
      } else {
         $(row).find('.select_answers').empty();
      }
   },
   more_dep_button_click : function (obj) {
      var selected_dep_question = obj.selected_dep_question || '';
      var selected_dep_answer = obj.selected_dep_answer || '';
      app.more_dep_question_list(selected_dep_question,function(row){
         if (selected_dep_question != '' && app.quiz_config[selected_dep_question]) {
            app.more_dep_answer_list(selected_dep_answer,row,selected_dep_question  );
         }
         $(row).find('.select_questions').bind('change',function(){
            app.more_dep_answer_list(selected_dep_answer,row,$(this).val());
         });
      });
   },
   fill_question_config_form : function (question_config) {
      $('#search_key').val(question_config.search_key);
      $('#question_text').val(question_config.question_text);
      $('#field_name').val(question_config.field_name);

      //dependences
      if (question_config.does_not_allow_submit == 1) {
         $('#does_not_allow_submit').attr({checked:'checked'});
      }
      jQuery.each(question_config.depending_on,function(k,v){
         app.more_dep_button_click({selected_dep_question:v.question_num,selected_dep_answer:v.answer_num});
      });

      var a_type = question_config.answer_type;
      var action = a_type+'_edit';
      app[action](question_config.answer,function(){
         //alert('blah');
      });
      //debug(a_html);
   },
   eval_question_form : function (form_data,callback) {
      var msg = [];
      jQuery.each(form_data,function(i,field){
         var error_num = 0;
         var empty = 0;
         var label_for = '';
         label_for = $('.question_form').find('[for='+field.id+']').text() + ': ';
         switch (field.id) {
            case 'field_name' :
               empty = app.eval_field(field.val,['is_empty']);
               if (empty == 0) {
                  error_num = app.eval_field(field.val,['is_valid_field_name']);
               } else {
                  error_num = 1;
               }
            break;
            case 'question_text' :
               error_num = app.eval_field(field.val,['is_empty']);
            break;
            default :
               error_num = 0;
         }
         //console.log('error_num---->',error_num);
         if (error_num > 0) {
            msg[msg.length] = label_for + app.input_field_rules_msgs[error_num];
         }
      });
      return msg;
   },
   question_form_controls : function () {

      jQuery.each($('.min_max_img img'),function(k,v){
         var wtd = $(this).attr('class');
         $('#'+wtd.split('-')[1]).hide();
         $(this).bind('click',function(e){
            if (wtd.split('-')[0] == 'min') {
               $('#'+wtd.split('-')[1]).hide();
            } else {
               $('#'+wtd.split('-')[1]).show();
            }
         });
      });
      $('#more_dep').click(function () {
         app.more_dep_button_click({});
      });

      $('#free_text_button').bind('click',function(e){
         app.free_text_button_click();
      });
      app.free_text_controls();
      $('#tabular_button').bind('click',function(e){
         app.tabular_button_click();
      });
      app.tabular_controls();
      $('#multiple_choice_button').bind('click',function(e){
         app.multiple_choice_button_click();
      });
      app.multiple_choice_controls();
      $('#combo_button').bind('click',function(e){
         app.combo_button_click();
      });
      app.combo_controls();
   }
});