jQuery.extend(app,{
   combo : function (ids,vals,deps) {
      var answer = {
         question_type:'combo',
         answer_config:[{
            field_name:vals[jQuery.inArray('field_name',ids)],
            table_name_combo:$('[name=table_name_combo]').val(),
            search_dep_val_in_question:$('#search_dep_val_in_question').val(),
            required:$('#required_combo:checked').size(),
            depending_on:deps
         }]
      };
      return {
         answer : answer,
         build_html : function () {
            var html = '',select = '';
            var a_conf = answer.answer_config[0];
            select = '<select name="'+a_conf.field_name+'" id="'+a_conf.field_name+'" class="'+a_conf.field_name+'"><option value="">selecione</option></select>';
            html = '<div class="complete_answer combo_wrapper">'+select+'</div>';
            return html;
         }
      }
   },
   combo_edit : function (data,callback) {
      //debug(data);
      app.combo_button_click(function(){
         var me = data.answer_config[0];
         if (me.required == "1") {
            $('#required_combo').attr({checked:'checked'});
         }
         $('[name=table_name_combo]')
         .find(':option:[value='+me.table_name_combo+']')
         .attr({selected:'selected'});
         $('#search_dep_val_in_question').val(me.search_dep_val_in_question);
         if (callback) {
            callback();
         }
      });
   },
   combo_validate : function (a_conf) {
      var msg = '',ret = {};

      /*jQuery.each( $('#'+a_conf.answer_config[0].field_name+':selected'),function(k,v){
         options[k] = v.value;
      });*/
      //required
      if (a_conf.answer_config[0].required == "1" && $('#'+a_conf.answer_config[0].field_name).val() == '') {
         msg = app.combo_i18n[app.language]['question_not_filled'];
      }

      if (msg.length == 0) {
         ret.ret_type = 'success';
         ret.ret_logic = app.combo_logic.right;
         if ($('#'+a_conf.answer_config[0].field_name).val() != '') {
            ret.ret_data = $('#'+a_conf.answer_config[0].field_name).serialize();
         } else {
            ret.ret_data = '';
         }
      } else {
         ret.ret_type = 'error';
         ret.ret_logic = app.combo_logic.wrong;
         ret.ret_msg = msg;
         ret.ret_data = '';
      }
      //ret.ret_a_map = [];

      return ret;
   },

   combo_logic : {right:'filled_question',wrong:'question_not_filled'},
   combo_i18n : {
      'pt-br':{
         filled_question:'marcada',
         question_not_filled:'não marcada',
         cols_dep:'dependências não satisfeitas'
      }
   },
   combo_fill_answer : function (a_conf,answer) {
      //console.log("a->",a);
      var conf = a_conf.answer_config[0];
      if (conf.search_dep_val_in_question.length > 0) {
         var dep_index = parseInt(conf.search_dep_val_in_question) - 1;
         var dep_q = app.quiz_config[dep_index].field_name;
         var me = $('#'+answer.field_name);
         if ($('#'+dep_q).data('val')) {
            $(me).data('dep_val',$('#'+dep_q).data('val'));
            param = $(me).data('dep_val');
            app.combo_get_data_from_db({table_name:conf.table_name_combo,param:param},function(data){
               //console.log('DATA--->',data);
               jQuery.each(data.elem,function(idx,c){
                  var label = conf.table_name_combo == 'uf' ? c.uf : c.nome;
                  var selected = c.id == parseInt(answer.value) ? 'selected="selected"' : '';
                  $('<option value="'+c.id+'" '+selected+'>'+label+'</option>').appendTo('#'+conf.field_name);
               });
            });
            $('#'+dep_q).bind('change',function(){
               $('#'+conf.field_name).find('option:not([text=selecione])').empty().remove();
            });
         }
      } else {
         $('#'+answer.field_name).data('val',answer.value);
         $('#'+answer.field_name).find(':option:[value='+answer.value+']').attr({selected:'selected'});
      }
   },
   combo_on_answering_controls : function (conf) {
      //console.log('A_CONF->',conf);
      var param = '';
      var a_conf = conf.answer_config[0];
      if (a_conf.search_dep_val_in_question == '') {
         app.combo_get_data_from_db({table_name:a_conf.table_name_combo,param:param},function(data){
            //console.log('DATA--->',data);
            jQuery.each(data.elem,function(idx,c){
               var label = a_conf.table_name_combo == 'uf' ? c.uf : c.nome;
               $('<option value="'+c.id+'">'+label+'</option>').appendTo('#'+a_conf.field_name);
            });
         });
         $('#'+a_conf.field_name).bind('change',function(e){
            $(this).data('val',$(this).val());
            //console.log('E->',e,' the_row data',$(the_row).data('val'));
         });
      } else {
         $('#'+a_conf.field_name).bind('click',function(e){
            var dep_index = parseInt(a_conf.search_dep_val_in_question) - 1;
            var dep_q = app.quiz_config[dep_index].field_name;
            if ($('#'+dep_q).data('val')) {
               if (!$(this).data('dep_val')) {
                  $(this).data('dep_val',$('#'+dep_q).data('val'));
                  param = $(this).data('dep_val');
                  app.combo_get_data_from_db({table_name:a_conf.table_name_combo,param:param},function(data){
                     //console.log('DATA--->',data);
                     jQuery.each(data.elem,function(idx,c){
                        var label = a_conf.table_name_combo == 'uf' ? c.uf : c.nome;
                           $('<option value="'+c.id+'">'+label+'</option>').appendTo('#'+a_conf.field_name);
                     });
                  });
                  $('#'+dep_q).bind('change',function(){
                     $('#'+a_conf.field_name).find('option:not([text=selecione])').empty().remove();
                  });
               } else {
                  //console.log($(the_col).data('dep_val'),$(the_row).data('col-'+dep_col_idx));
                  if ($(this).data('dep_val') != $('#'+dep_q).data('val')) {
                     $(this).find('option:not([text=selecione])').empty().remove();
                     $(this).data('dep_val',$('#'+dep_q).data('val'));
                     param = $(this).data('dep_val');
                     app.combo_get_data_from_db({table_name:a_conf.table_name_combo,param:param},function(data){
                        //console.log('DATA--->',data);
                        //console.log($(the_col).data('dep_val'),$(the_row).data('col-'+dep_col_idx));
                        jQuery.each(data.elem,function(idx,c){
                           var label = a_conf.table_name_combo == 'uf' ? c.uf : c.nome;
                              $('<option value="'+c.id+'">'+label+'</option>').appendTo('#'+a_conf.field_name);
                        });
                     });
                  }
               }
            }
         });
      }
   },
   combo_get_data_from_db : function (obj,callback) {
      app.ajx({whattodo:'get_ajax_table',data:'table='+obj.table_name+'&param='+obj.param},
      function(data){
         //console.log('DATA->',data);
         callback(data);
      });
   },
   combo_button_click : function (callback) {
      if($('#combo').is(':visible')){
         $('#combo').hide();
      } else {
         $('.type_answer_forms').hide();
         $('#combo').show(function(){
            $('#send_data').data('answer_type','combo');
         });
      }
      if (callback) {
         callback();
      }
   },
   combo_controls : function () {}
});