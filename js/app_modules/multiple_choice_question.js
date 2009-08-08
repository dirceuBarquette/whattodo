jQuery.extend(app,{
   multiple_choice : function (ids,vals,deps) {
      var opt = [];
      jQuery.each($('.option_row:childs'),function(k,v){
         opt[k] = {
            name:vals[jQuery.inArray('field_name',ids)],
            label:$(v).find('.Label').val(),
            value:$(v).find('.Value').val(),
            with_free_text:$(v).find('.Value').hasClass('free_txt')
         }
      });
      var answer = {
         question_type:'multiple_choice',
         answer_config:[{
            field_name:vals[jQuery.inArray('field_name',ids)],
            field_min_opt:$('#field_min_opt').val(),
            field_max_opt:$('#field_max_opt').val(),
            options:opt,
            depending_on:deps
         }]
      };
      return {
         answer : answer,
         build_html : function () {
            var html = '',opts = '',type_text = '',uncheck = '';
            var a_conf = answer.answer_config[0];
            jQuery.each(a_conf.options,function(k,v) {
               uncheck = '';
               if (parseInt(a_conf.field_max_opt) > 1) {
                  type = 'checkbox';
                  name = a_conf.field_name+'['+k+']';
               } else {
                  type = 'radio';
                  name = a_conf.field_name;
                  uncheck = '<div><input type="button" class="'+a_conf.field_name+' uncheck_radio_group" value="desmarcar" /></div>';
               }
               if(v.with_free_text) {
                  type_text = '<input type="text" id="option_'+a_conf.field_name+'_free_text_o-'+k+'" />';
                  field_name_val = '';//v.label;
               } else {
                  field_name_val = v.value;
                  type_text = '';
               }
               opts += '<div><input type="'+type+'" name="'+name+'" id="'+a_conf.field_name+'-'+k+'" value="'+field_name_val+'" class="'+a_conf.field_name+'" /><label for="'+a_conf.field_name+'-'+k+'">'+v.label+'</label>'+type_text+'</div>';
            });
            html = '<div class="complete_answer multiple_choice_wrapper">'+opts+uncheck+'</div>';//('esfera_organizacao_governamental')
            return html;
         }

      }
   },
   multiple_choice_on_answering_controls : function (a_conf) {
      //console.log('A_CONF->',a_conf);
      $('.uncheck_radio_group:input[class*='+a_conf.answer_config[0].field_name+']')
      .bind('click',function(e){
         $('input[class*='+a_conf.answer_config[0].field_name+']').not('[type=button]').attr({checked:false});
         $(this).parents('div.complete_answer').find('[type=text]').val('');
      });
   },
   multiple_choice_edit : function (data,callback) {
      $('.type_answer_forms').hide();
      app.multiple_choice_button_click(function(){
         var me = data.answer_config[0];
         $('#field_min_opt').val(me.field_min_opt);
         $('#field_max_opt').val(me.field_max_opt);
         for (i = 0; i < $(me.options).size();i++) {
            if (me.options[i].with_free_text) {
               $('#with_text_field').attr({checked:'checked'});
            } else {
               $('#with_text_field').attr({checked:''});
            }
            app.fill_new_option();
         }
         jQuery.each(me.options,function(K,V){
            var opt = $('.option_row:childs').get(K);
            $(opt).find('.Label').val(V.label).end().find('.Value').val(V.value);
         });
         if (callback) {
            callback();
         }
      });
   },
   multiple_choice_validate : function (a_conf) {
      //console.log(a_conf);
      var conf = a_conf.answer_config[0];
      var msg = '',ret = {},options = [],answer = '',ret_a_map = [];

      jQuery.each( $('.'+conf.field_name+':checked'),function(k,v){
         //console.log('k->',k,' v->',v);
         var idx = this.id.split('-')[1];
         if (conf.options[idx].with_free_text) {
            var f_t = '#option_'+conf.field_name+'_free_text_o-'+idx;
            if ($(f_t).val() != '') {
               $(this).val($(f_t).val());
            }/* else {
               msg = app.multiple_choice_i18n[app.language]['text_not_filled'];
            }*/
         }
         ret_a_map[k] = idx;
         options[k] = v.value;
         answer += '&'+conf.field_name+'['+idx+']='+v.value;
      });
      //min
      if (options.length < a_conf.answer_config[0].field_min_opt) {
         msg = options.length == 0 ? app.multiple_choice_i18n[app.language]['question_not_filled'] :
            app.multiple_choice_i18n[app.language]['min_not_riched'];

      }
      //max
      if (options.length > a_conf.answer_config[0].field_max_opt) {
         msg = app.multiple_choice_i18n[app.language]['max_riched'];
      }
      if (msg.length == 0) {
         ret.ret_type = 'success';
         ret.ret_logic = app.multiple_choice_logic.right;
         ret.ret_data = answer;
         ret.ret_a_map = ret_a_map;
      } else {
         ret.ret_type = 'error';
         ret.ret_logic = app.multiple_choice_logic.wrong;
         ret.ret_msg = msg;
         ret.ret_data = '';
      }

      return ret;
   },
   multiple_choice_logic : {right:'filled_question',wrong:'question_not_filled'},
   multiple_choice_i18n : {
      'pt-br':{
         filled_question:'marcada',
         question_not_filled:'não marcada',
         max_riched:'excedeu o número de opções',
         min_not_riched:'não atingiu o mínimo de opções',
         text_not_filled:'texto não preenchido'
      }
   },
   multiple_choice_fill_answer : function (a_conf,answer) {
      //console.log("a_conf->",a_conf," a->",answer);
      var idx = answer.seq;
      var conf = a_conf.answer_config[0];
		if (conf.options[idx]) {
         if (conf.options[idx].with_free_text) {
            var f_t = '#option_'+conf.field_name+'_free_text_o-'+idx;
            $(f_t).val(answer.value);
         }
		}
      $('.'+answer.field_name+':eq('+answer.seq+')').attr({checked:'checked'});
   },
   multiple_choice_options_html : {
      html:'<tr class="option_row"><td><input type="text" class="Label multiple_choice" /></td><td><input type="text" class="Value multiple_choice" /></td><td><div class="manip_buttons"><div class="option2del">&nbsp;</div><div class="option2up">&nbsp;</div><div class="option2down">&nbsp;</div></div></td></tr>'
   },
   fill_new_option : function () {
      $('#label_table').append(app.multiple_choice_options_html.html);
      if($('#with_text_field:checked').size() == 1 ) {
         $('#label_table > tr:last').find('.Value').addClass('free_txt').attr({readonly:"readonly"}).val("texto livre");
      }
   },
   multiple_choice_button_click : function (callback) {
      if($('#multiple_choice').is(':visible')){
         $('#multiple_choice').hide();
      } else {
         $('.type_answer_forms').hide();
         $('#multiple_choice').show(function(){
            $('#send_data').data('answer_type','multiple_choice');
         });
      }
      if (callback) {
         callback();
      }
   },
   multiple_choice_controls : function () {

      $('#fill_options').click(function () {
         app.fill_new_option();
      });
      $('.option2del').die('click');
      $('.option2del').live('click',function(e){
         $($(this).parents('tr')).empty().remove();
      });
      $('.option2up').die('click');
      $('.option2up').live('click',function(e){
         var cur_tr = $(this).parents('tr');
         var cur_tr_index = $('.option_row').index(cur_tr);
         if (cur_tr_index > 0) {
            var prev_tr_index = cur_tr_index - 1;
            var cur_Label = $('.option_row:eq('+cur_tr_index+')').find('.Label').val() ;
            var cur_Value = $('.option_row:eq('+cur_tr_index+')').find('.Value').val();
            var cur_classes = $('.option_row:eq('+cur_tr_index+')').find('.Value').attr('class');
            var cur_ro = $('.option_row:eq('+cur_tr_index+')').find('.Value').attr('readonly');
            var prev_Label = $('.option_row:eq('+prev_tr_index+')').find('.Label').val();
            var prev_Value = $('.option_row:eq('+prev_tr_index+')').find('.Value').val();
            var prev_classes = $('.option_row:eq('+prev_tr_index+')').find('.Value').attr('class');
            var prev_ro = $('.option_row:eq('+prev_tr_index+')').find('.Value').attr('readonly');

            $('.option_row:eq('+cur_tr_index+')').find('.Label').val(prev_Label);
            $('.option_row:eq('+cur_tr_index+')').find('.Value').val(prev_Value).attr({'class':prev_classes,readonly:prev_ro});
            $('.option_row:eq('+prev_tr_index+')').find('.Label').val(cur_Label);
            $('.option_row:eq('+prev_tr_index+')').find('.Value').val(cur_Value).attr({'class':cur_classes,readonly:cur_ro});
         }
      });
      $('.option2down').die('click');
      $('.option2down').live('click',function(e){
         var cur_tr = $(this).parents('tr');
         var cur_tr_index = $('.option_row').index(cur_tr);
         if (cur_tr_index < $('.option_row').size()) {
            var next_tr_index = cur_tr_index + 1;
            var cur_Label = $('.option_row:eq('+cur_tr_index+')').find('.Label').val();
            var cur_Value = $('.option_row:eq('+cur_tr_index+')').find('.Value').val();
            var cur_classes = $('.option_row:eq('+cur_tr_index+')').find('.Value').attr('class');
            var cur_ro = $('.option_row:eq('+cur_tr_index+')').find('.Value').attr('readonly');
            var next_Label = $('.option_row:eq('+next_tr_index+')').find('.Label').val();
            var next_Value = $('.option_row:eq('+next_tr_index+')').find('.Value').val();
            var next_classes = $('.option_row:eq('+next_tr_index+')').find('.Value').attr('class');
            var next_ro = $('.option_row:eq('+next_tr_index+')').find('.Value').attr('readonly');

            $('.option_row:eq('+cur_tr_index+')').find('.Label').val(next_Label);
            $('.option_row:eq('+cur_tr_index+')').find('.Value').val(next_Value).attr({'class':next_classes,readonly:next_ro});
            $('.option_row:eq('+next_tr_index+')').find('.Label').val(cur_Label);
            $('.option_row:eq('+next_tr_index+')').find('.Value').val(cur_Value).attr({'class':cur_classes,readonly:cur_ro});
         }
      });
   }
});
