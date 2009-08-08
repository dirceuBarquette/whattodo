jQuery.extend(app,{
   free_text : function (ids,vals,deps) {
      var answer = {
         question_type:'free_text',
         answer_config:[{
            field_name:vals[jQuery.inArray('field_name',ids)],
            field_min_car:$('#field_min_car').val(),
            field_max_car:$('#field_max_car').val(),
            field_mask:$('[name=free_text_mask]').val(),
            depending_on:deps
         }]
      };
      return {
         answer : answer,
         build_html : function () {
            var rows = 1,html = '';
            var lines = [0,100,200,300,400,500,600,700,800,900,1000];
            var a_conf = answer.answer_config[0];
            jQuery.each(lines,function(iline,vline){
               if (parseInt(a_conf.field_max_car) > parseInt(vline)) {
                  rows++;
               }
            });
            html = '<div class="complete_answer free_text_wrapper">';
            html += '<textarea id="'+a_conf.field_name+'" name="'+a_conf.field_name+'" cols="50" rows="'+rows+'"></textarea>';

            return html;
         }
      }
   },
   free_text_edit : function (data,callback) {

      app.free_text_button_click(function(){
         var field = data.answer_config[0];
         $('#field_min_car').val(field.field_min_car);
         $('#field_max_car').val(field.field_max_car);
         $('[name=free_text_mask]')
         .find(':option:[value='+field.field_mask+']')
         .attr({selected:'selected'});
         if (callback) {
            callback();
         }
      });
   },
   free_text_validate : function (a_conf) {
      var msg = '';
      var ret = {};

      //min caracteres
      if ($('#'+a_conf.answer_config[0].field_name).val().length < a_conf.answer_config[0].field_min_car) {
         msg = app.free_text_i18n[app.language]['question_not_filled'];
      }

      //max caracteres
      if ($('#'+a_conf.answer_config[0].field_name).val().length > a_conf.answer_config[0].field_max_car) {
         msg = app.free_text_i18n[app.language]['max_riched'];
      }
      if (msg.length == 0) {
         ret.ret_type = 'success';
         ret.ret_logic = app.free_text_logic.right;
         if ($('#'+a_conf.answer_config[0].field_name).val().length > 0) {
            ret.ret_data = $('#'+a_conf.answer_config[0].field_name).serialize();
         } else {
            ret.ret_data = '';
         }
      } else {
         ret.ret_type = 'error';
         ret.ret_logic = app.free_text_logic.wrong;
         ret.ret_msg = msg;
         ret.ret_data = '';
      }
      return ret;

   },
   free_text_logic : {right:'filled_question',wrong:'question_not_filled'},
   free_text_i18n : {
      'pt-br':{
         filled_question:'preenchida',
         question_not_filled:'não preenchida',
         max_riched:'excedeu o número de caracteres;'
      }
   },
   free_text_fill_answer : function (a_conf,answer) {
      //console.log("a->",a);
      $('#'+answer.field_name).val(answer.value);
   },
   free_text_mask_date : function (data) {
      data = data.replace(/\D/g,"");
      mdata = data.replace(/^(\d{2})(\d{2})(\d{4})/g,"$1/$2/$3");
      return mdata;
   },
   free_text_mask_cnpj : function (data) {
      data = data.replace(/\D/g,"");
      mdata = data.replace(/^(\d{3})(\d{3})(\d{3})(\d{4})(\d{2})/g,"$1.$2.$3/$4-$5");
      return mdata;
   },
   free_text_mask_cep : function (data) {
      data = data.replace(/\D/g,"");
      mdata = data.replace(/^(\d{2})(\d{3})(\d{3})/g,"$1$2-$3");
      return mdata;
   },
   free_text_mask_phone_number : function (data) {
      data = data.replace(/\D/g,"");
      mdata = data.replace(/^(\d{2})(\d{4})(\d{4})/g,"$1-$2-$3");
      return mdata;
   },
   free_text_on_answering_controls : function (a_conf) {
      //console.log('A_CONF->',a_conf);
      var me = a_conf.answer_config[0];
      if (me.field_mask && me.field_mask != '') {
         var str = 'free_text_mask_'+me.field_mask;
         $('#'+me.field_name).bind('keyup',function(e){
            $(this).val(app[str](this.value));
         });
      }
   },
   free_text_button_click : function (callback) {
      if($('#free_text').is(':visible')){
         $('#free_text').hide();
      } else {
         $('.type_answer_forms').hide();
         $('#free_text').show(function(){
            $('#send_data').data('answer_type','free_text');
         });
      }
      if (callback) {
         callback();
      }
   },
   free_text_controls : function () {}
});