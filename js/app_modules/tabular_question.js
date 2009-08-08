jQuery.extend(app,{
   tabular : function (ids,vals,deps) {
      var col = [];
      jQuery.each($('#column_params_div fieldset'),function(k,v){
         //console.log('k->',k,' v->',v);
         var col_extra_params = [];
         var fs = this.id;
         switch ($(v).data('col_type')) {
            case 'from_table_database' :
               col_extra_params = {
                 required_field_tabular:$(v).find('[name=required_field_tabular]:checked').size(),
                 table_name:$(v).find('[name=table_name_tabular]').val()
               }
            break;
            case 'manual'  :
               var opt = [];
               jQuery.each($('#'+fs+' .option_row_tab:childs'),function(key,val){
                  opt[key] = {
                     label:$(val).find('.Label_tab').val(),
                     value:$(val).find('.Value_tab').val()
                  };
               });
               col_extra_params = {
                  required_field_tabular:$('#'+fs).find('[name=required_field_tabular]:checked').size(),
                  options:opt
               }
            break;
            case 'free_hand' :
               col_extra_params = {
                  min_car:$(v).find('[name=field_min_car_tabular]').val(),
                  max_car:$(v).find('[name=field_max_car_tabular]').val()
               }
            default :
         }
         col[k] = {
            col_type:$(v).data('col_type'),
            col_header:$(v).find('[name=col_header]').val(),
            col_dep:$(v).find('[name=col_dep]').val(),
            col_extra_params:col_extra_params
         }

      });
      var answer = {
         question_type:'tabular',
         answer_config:[{
            field_name:vals[jQuery.inArray('field_name',ids)],
            min_lines:$('#min_lines').val(),
            max_lines:$('#max_lines').val(),
            columns:col,
            depending_on:deps
         }]
      };
      return {
         answer : answer,
         build_html : function () {
            var a_conf = answer.answer_config[0];
            //console.log('a_conf->',a_conf);
            var header = '', cols = 1,rows = '',cels = '',html = '',input_type = '';
            for (i = 0;i < parseInt(a_conf.max_lines);i++) {
               cels = '';
               if (header == '') {
                  cols = 0;
                  jQuery.each(a_conf.columns,function(k,v){

                     header += '<th>'+v.col_header+'</th>';
                     cols++;
                  });
               }
               //console.log('a_conf->',a_conf,' cols->',cols);
               for (j = 0;j < cols;j++) {
                  if (jQuery.inArray(a_conf.columns[j].col_type,['from_table_database','manual']) >= 0) {
                     var options = ''
                     if (a_conf.columns[j].col_type == 'manual') {
                        jQuery.each(a_conf.columns[j].col_extra_params.options,function(key,val){
                           options += '<option value="'+val.value+'">'+val.label+'</option>';
                        });
                     }
                     input_type = '<select name="col-'+j+'"><option value="">selecione</option>'+options+'</select>';
                  } else {
                     input_type = '<input type="text" name="col-'+j+'" />';
                  }
                  cels += '<td>'+input_type+'</td>';
               }
               rows += '<tr>'+cels+'</tr>';
            }
            html = '<table class="'+a_conf.field_name+'" border="1"><thead><tr>'+header+'</tr></thead><tbody>'+rows+'</tbody><tfoot></tfoot></table>';

            return html;
         }
      }
   },
   tabular_edit : function (data,callback) {
      //debug(data);
      app.tabular_button_click(function(){
         var me = data.answer_config[0];
         $('#min_lines').val(me.min_lines);
         $('#max_lines').val(me.max_lines);
         var col_type = 'free_hand';
         jQuery.each(me.columns,function(k,v){
            if (typeof k == 'number') {
               //var col_id = 'fs_column_params_cloned-' + k;
               col_type = v.col_type;
               app.tabular_new_column(col_type,function(){
                  $('#fs_column_params_cloned-'+k+' input:[name=col_header]').val(v.col_header);
                  $('#fs_column_params_cloned-'+k+' input:[name=col_dep]').val(v.col_dep);
                  switch (col_type) {
                     case 'manual' :
                        if (v.col_extra_params.required_field_tabular == 1) {
                           $('#fs_column_params_cloned-'+k+' input:[name=required_field_tabular]').attr({checked:'checked'});
                        }
                        jQuery.each(v.col_extra_params.options,function(K,V){
                           app.tabular_fill_new_manual_option('fs_column_params_cloned-'+k,function(){
                              $('#fs_column_params_cloned-'+k+' .label_manual_table')
                              .find('.Label_tab:eq('+K+')')
                              .val(V.label);
                              $('#fs_column_params_cloned-'+k+' .label_manual_table')
                              .find('.Value_tab:eq('+K+')')
                              .val(V.value);
                           });

                        });
                     break;
                     case 'from_table_database' :
                        if (v.col_extra_params.required_field_tabular == 1) {
                           $('#fs_column_params_cloned-'+k+' input:[name=required_field_tabular]').attr({checked:'checked'});
                        }
                        $('#fs_column_params_cloned-'+k+' [name=table_name_tabular]')
                        .find(':option:[value='+v.col_extra_params.table_name+']')
                        .attr({selected:'selected'});
                     break;
                     case 'free_hand' ://field_min_car_tabular
                     default :
                        $('#fs_column_params_cloned-'+k+' input:[name=field_min_car_tabular]').val(v.col_extra_params.min_car);
                        $('#fs_column_params_cloned-'+k+' input:[name=field_max_car_tabular]').val(v.col_extra_params.max_car);
                     break;
                  }
               });
            }
         });
         if (callback) {
            callback();
         }
      });
   },
   tabular_validate : function (a_conf) {
      var msg = '',ret = {},rows = [],right_rows = 0,rows_ok = 0;
      jQuery.each($('.'+a_conf.answer_config[0].field_name + ' tbody tr'),function(k,v){
         rows[k] = [];
         jQuery.each($(v).find('select,input'),function(key,val){
            rows[k][key] = val.value;
         });
      });
      var cel_data = '';
      jQuery.each(rows,function(row,cols){
         var empty_col = 0,cols_length = cols.length;
         var column_conf =a_conf.answer_config[0].columns;
         jQuery.each(cols,function(col,val){
            var col_conf = column_conf[col];
            switch (col_conf.col_type) {
               case 'manual' :
               case 'from_table_database' :
                  if (val.length == 0) {
                     if (col_conf.col_extra_params.required_field_tabular == 1) {
                        msg = app.tabular_i18n[app.language]['question_not_filled'];
                        empty_col++;
                     } else {
                        cols_length--;
                     }
                  }
               break;
               case 'free_hand' :
                  //min caracteres
                  if (val.length < parseInt(col_conf.col_extra_params.min_car)) {
                     msg = app.tabular_i18n[app.language]['partial_filled'];
                     empty_col++;
                  }
                  if (val.length == 0) {
                     if (parseInt(col_conf.col_extra_params.min_car) > 0) {
                        msg = app.tabular_i18n[app.language]['question_not_filled'];
                     } else {
                        cols_length--;
                     }
                  }
                  //max caracteres
                  if (val.length > col_conf.col_extra_params.max_car) {
                     msg = app.tabular_i18n[app.language]['max_riched'];
                  }
               break;
            }
            //serializing
            if (val != '' && msg == '') {
               cel_data += '&'+a_conf.answer_config[0].field_name+'['+row+']['+col+']='+val;
            }
         });
         if (empty_col < cols_length) {
            if (msg.length  == 0) {
               rows_ok++;
            }
         } else {
            msg = '';
         }
      });
      if (rows_ok < parseInt(a_conf.answer_config[0].min_lines)) {
         msg = app.tabular_i18n[app.language]['question_not_filled'];
      }
      if (msg.length == 0) {
         ret.ret_type = 'success';
         ret.ret_logic = app.tabular_logic.right;
         ret.ret_data = cel_data;
      } else {
         ret.ret_type = 'error';
         ret.ret_logic = app.tabular_logic.wrong;
         ret.ret_msg = msg;
         ret.ret_data = '';
      }

      return ret;
   },
   tabular_logic : {right:'filled_question',wrong:'question_not_filled'},
   tabular_i18n : {
      'pt-br':{
         filled_question:'preenchida',
         question_not_filled:'não preenchida',
         free_hand:'texto livre',
         from_table_database:'a partir do bd',
         manual:'manual',
         cols_dep:'dependências não satisfeitas',
         partial_filled:'não possui o mínimo de caracteres'
      }
   },
   tabular_from_table_database_cache : [],
   tabular_fill_answer : function (a_conf,answer) {
      //console.log("a_conf->",a_conf,' answer->',answer);
      var row = answer.seq.split('-')[0];
      var col = answer.seq.split('-')[1];
      var conf = a_conf.answer_config[0];
      var col_conf = conf.columns[col];
      var me = $('.'+answer.field_name).find('[name=col-'+col+']:eq('+row+')');
      switch (col_conf.col_type) {
         case 'from_table_database' :
            var the_row = $(me).parents('tr');
            if (col_conf.col_dep == '') {
               $(the_row).data('col-'+col,answer.value,answer.value);
               var sel = $(me).find('option:[value='+answer.value+']').text();
               $(me).val(sel);
            } else {
               var dep_col_idx = parseInt(col_conf.col_dep) - 1;
               if ($(the_row).data('col-'+dep_col_idx)) {
                  $(me).data('dep_val',$(the_row).data('col-'+dep_col_idx));
                  param = $('[name=col-'+col+']:eq('+row+')').data('dep_val');
                  app.tabular_get_data_from_db({table_name:col_conf.col_extra_params.table_name,param:param},function(data){
                     jQuery.each(data.elem,function(idx,c){
                        var label = col_conf.col_extra_params.table_name == 'uf' ? c.uf : c.nome;
                        var selected = c.id == parseInt(answer.value) ? 'selected="selected"' : '';
                        $('<option value="'+c.id+'" '+selected+'>'+label+'</option>').appendTo(me);
                     });
                  });
                  $(the_row).find('[name=col-'+dep_col_idx+']').bind('change',function(){
                     $(me).find('option:not([text=selecione])').empty().remove();
                  });
               }
            }
         break;
         case 'manual' :
            var sel = $(me).find('option:[value='+answer.value+']').text();
            $(me).val(sel);
         break;
         case 'free_hand' :
            $(me).val(answer.value);
         break;
      }
   },
   tabular_on_answering_controls : function (a_conf) {
      //console.log('A_CONF->',a_conf);
      jQuery.each(a_conf.answer_config[0].columns,function(k,v){
         //console.log('k->',k,'v->',v);
         var param = '';
         switch (v.col_type) {
            case 'from_table_database' :
               var col = 'col-'+k, the_row = '';
               var selector = $('.'+a_conf.answer_config[0].field_name+'').find('[name='+col+']');
               if (v.col_dep == '') {
                  app.tabular_get_data_from_db({table_name:v.col_extra_params.table_name,param:param},function(data){
                     //console.log('DATA--->',data);
                     jQuery.each(data.elem,function(idx,c){
                        var label = v.col_extra_params.table_name == 'uf' ? c.uf : c.nome;
                        //$('<option value="'+c.id+'">'+label+'</option>').appendTo('[name='+col+']');
                        $('<option value="'+c.id+'">'+label+'</option>').appendTo(selector);
                     });
                  });
                  //$('[name='+col+']').bind('change',function(e){
                  $(selector).bind('change',function(e){
                     the_row = $(this).parents('tr');
                     $(the_row).data(col,$(this).val());
                     //console.log('E->',e,' the_row data',$(the_row).data(col));
                  });
               } else {
                  $(selector).bind('click',function(e){
                  //$('[name='+col+']').bind('click',function(e){
                     the_row = $(this).parents('tr');
                     var dep_col_idx = parseInt(v.col_dep) - 1;
                     var the_col = $(this);
                     var better = $(the_col).data('dep_val')
                     if (!$(the_col).data('dep_val')) {
                        if ($(the_row).data('col-'+dep_col_idx) && parseInt($(the_row).data('col-'+dep_col_idx)) > 0) {
                           $(the_col).data('dep_val',$(the_row).data('col-'+dep_col_idx));
                           param = $(this).data('dep_val');
                           app.tabular_get_data_from_db({table_name:v.col_extra_params.table_name,param:param},function(data){
                              //console.log('DATA--->',data);
                              jQuery.each(data.elem,function(idx,c){
                                 var label = v.col_extra_params.table_name == 'uf' ? c.uf : c.nome;
                                    $('<option value="'+c.id+'">'+label+'</option>').appendTo(the_col);
                              });
                           });
                           $(the_row).find('[name=col-'+dep_col_idx+']').bind('change',function(){
                              $(the_col).find('option:not([text=selecione])').empty().remove();
                           });
                        }
                     } else {
                        //console.log($(the_col).data('dep_val'),$(the_row).data('col-'+dep_col_idx));
                        if ($(the_col).data('dep_val') != $(the_row).data('col-'+dep_col_idx)) {
                           $(the_col).find('option:not([text=selecione])').empty().remove();
                           $(the_col).data('dep_val',$(the_row).data('col-'+dep_col_idx));
                           param = $(this).data('dep_val');
                           if (param != '') {
                              app.tabular_get_data_from_db({table_name:v.col_extra_params.table_name,param:param},function(data){
                                 //console.log('DATA--->',data);
                                 //console.log($(the_col).data('dep_val'),$(the_row).data('col-'+dep_col_idx));
                                 jQuery.each(data.elem,function(idx,c){
                                    var label = v.col_extra_params.table_name == 'uf' ? c.uf : c.nome;
                                       $('<option value="'+c.id+'">'+label+'</option>').appendTo(the_col);
                                 });
                              });
                           }
                        }
                     }

                  });
               }
            break;
            case 'manual' :
            break;
            case 'free_hand' :
            default :

            break;
         }
      });
   },
   tabular_get_data_from_db : function (obj,callback) {
      app.ajx({whattodo:'get_ajax_table',data:'table='+obj.table_name+'&param='+obj.param},
      function(data){
         //console.log('DATA->',data);
         callback(data);
      });
   },
   tabular_new_column : function (col_type,callback) {

      var col_index = $('.fs_column_params_cloned').length;
      var col_id = 'fs_column_params_cloned-'+col_index;
      $('.fs_column_params').clone().attr({'id': col_id})
      .css({display:'block'})
      .addClass('fs_column_params_cloned')
      .data('col_type',col_type)
      .appendTo('#column_params_div');
      $('#'+col_id).removeClass('template fs_column_params');

      $('#fs_column_params_cloned-'+col_index+' .tabular_num_column').text(col_index + 1);
      //$('#fs_column_params_cloned-'+k+' .column_type').text(app.tabular_i18n[col_type]);

      var params_id = col_type+'-params-'+col_index;
      $('.'+col_type+'_params').clone().attr({'id':params_id})
      .css({display:'block'})
      .addClass(col_type+'-params_cloned')
      .appendTo('#'+col_id);
      $('#'+params_id).removeClass(col_type+'_params'+' template');

      $('#'+params_id).find('.fill_new_manual_option_tabular').click(function (e) {
         app.tabular_fill_new_manual_option(col_id);
      });
      if (callback) {
         callback();
      }
   },
   tabular_manual_option_html : {
      html:'<tr class="option_row_tab"><td><input type="text" class="Label_tab tabular" /></td><td><input type="text" class="Value_tab tabular" /></td><td><div class="manip_buttons"><div class="option2del">&nbsp;</div><div class="option2up">&nbsp;</div><div class="option2down">&nbsp;</div></div></td></tr>'
   },
   tabular_fill_new_manual_option : function (col,callback) {
      $('#'+col).find('.label_manual_table').append(app.tabular_manual_option_html.html);
      if (callback) {
         callback();
      }
   },
   tabular_button_click : function (callback) {
      if($('#tabular').is(':visible')){
         $('#tabular').hide();
      } else {
         $('.type_answer_forms').hide();
         $('#tabular').show(function(){
            $('#send_data').data('answer_type','tabular');
         });
      }
      if (callback) {
         callback();
      }
   },
   tabular_controls : function () {
      $('#new_column').unbind('click')
      $('#new_column').bind('click',function(e){
         app.tabular_new_column($('.new_column_type:checked').val());
      });
      $('.tabular_option2del').die('click');
      $('.tabular_option2del').live('click',function(e){
         $($(this).parents('fieldset')).empty().remove();
         jQuery.each($('#column_params_div > fieldset'),function(k,v){
            $(this).attr({id:'fs_column_params_cloned-'+k});
            $(this).find('.tabular_num_column').text(k + 1);
            var this_params_column = $(this).find('[id*=-params-]').attr('id');
            var x_this_params = '/'+this_params_column.split('-')[2]+'/g';
            $(this).find('.params').attr({id:this_params_column.replace(eval(x_this_params),k)});
         });
      });
      $('.tabular_option2up').die('click');
      $('.tabular_option2up').live('click',function(e){
         var cur_fs = $(this).parents('fieldset');
         var cur_fs_index = $('#column_params_div > fieldset').index(cur_fs);
         var cur_params_column = $(cur_fs).find('[id*=-params-]').attr('id');
         if (cur_fs_index > 0) {
            var prev_fs_index = cur_fs_index - 1;
            var prev_fs = $('#column_params_div > fieldset:eq('+prev_fs_index+')');
            var prev_params_column = $(prev_fs).find('[id*=-params-]').attr('id');

            $(cur_fs).insertBefore(prev_fs);

            $(prev_fs).find('.tabular_num_column').text(cur_fs_index + 1);
            $(cur_fs).find('.tabular_num_column').text(cur_fs_index);

            var x_prev_params = '/'+prev_fs_index+'/g';
            var x_cur_params = '/'+cur_fs_index+'/g';
            $(prev_fs).find('.params').attr({id:prev_params_column.replace(eval(x_prev_params),cur_fs_index)});
            $(cur_fs).find('.params').attr({id:cur_params_column.replace(eval(x_cur_params),prev_fs_index)});

            $(cur_fs).attr({id:'fs_column_params_cloned-'+prev_fs_index});
            $(prev_fs).attr({id:'fs_column_params_cloned-'+cur_fs_index});


         }
      });
      $('.tabular_option2down').die('click');
      $('.tabular_option2down').live('click',function(e){
         var cur_fs = $(this).parents('fieldset');
         var cur_fs_index = $('#column_params_div > fieldset').index(cur_fs);
         var cur_params_column = $(cur_fs).find('[id*=-params-]').attr('id');
         if (cur_fs_index < $('#column_params_div > fieldset').size()) {
            var next_fs_index = cur_fs_index + 1;
            var next_fs = $('#column_params_div > fieldset:eq('+next_fs_index+')');
            var next_params_column = $(next_fs).find('[id*=-params-]').attr('id');

            $(cur_fs).insertAfter(next_fs);

            $(next_fs).find('.tabular_num_column').text(cur_fs_index + 1);
            $(cur_fs).find('.tabular_num_column').text(next_fs_index + 1);

            var x_next_params = '/'+next_fs_index+'/g';
            var x_cur_params = '/'+cur_fs_index+'/g';
            $(next_fs).find('.params').attr({id:next_params_column.replace(eval(x_next_params),cur_fs_index)});
            $(cur_fs).find('.params').attr({id:cur_params_column.replace(eval(x_cur_params),next_fs_index)});

            $(cur_fs).attr({id:'fs_column_params_cloned-'+next_fs_index});
            $(next_fs).attr({id:'fs_column_params_cloned-'+cur_fs_index});
         }
      });
   }
});