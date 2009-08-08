jQuery.extend(app,{
   table_list : function () {
      var table_id_num = table_id_num > 1 ? table_id_num : 1;
      var table_id = 'table_cloned-'+table_id_num;
      var tbody_id = '#table_list_tbody-'+table_id_num;
      var  cloned = $('[class=template table_list]').clone();
      token = function () {
         return table_id_num;
      };
      return {
         get_table : function () {
            return $(cloned).attr({id:table_id}).css({display:'block'});
         },
         get_token : token(),
         activate : function (obj,callback) {
            app.table_list_controls(obj);
            if (callback) {
               callback();
            }
         },
         populate : function (obj) {
            app.populate_table_list(obj);
         },
         serialize: function (obj) {
            var selector = '#table_cloned-'+obj.token;
            var ser = $(selector).find('.table_param').serialize();
            return ser;
         }
      }
   },
   populate_table_list : function(obj,columns,callback) {
      var selector = '#table_cloned-'+obj.hanged_on.token;
      $(selector).find('.table_list_tr_thead').empty();
      $(selector).find('.table_list_tbody').empty();
      $(selector).find('[class=total]').text(obj.total);
      $(selector).find('.table_list_td_tfoot').attr({colspan:$(columns).size()});
      var rows = [];
      var row_identifier = [];
      var theads = '';
      jQuery.each(columns,function(key,val){
         theads += '<th>'+val.thead_text+'</th>';
         jQuery.each(obj.elem,function(row,col){
            if (!(rows[row])) {
               rows[row] = '';
            };
            var td_text = col[val.field_name] || '&nbsp;'
            if (val.row_identifier) {
               row_identifier[row] = 'table_'+obj.hanged_on.token+'_'+val.field_name+'-'+td_text;
            }
            rows[row] += '<td>'+td_text+'</td>';
         });
      });
      $(theads).appendTo($(selector).find('.table_list_tr_thead'));
      var row_class = '';
      jQuery.each(rows,function(k,v){
         var the_row = '';
         row_class = 'row_table_'+obj.hanged_on.token;
         the_row = '<tr id="'+row_identifier[k]+'" class="'+row_class+' Link">'+v+'</tr>';
         $(the_row).appendTo($(selector).find('.table_list_tbody'));
      });
      app.table_list_hover(selector);

      if (callback) { callback(row_class);}
   },
   table_list_hover : function (selector) {
      $(selector).find('.table_list_tbody tr').hover(function(){
         $(this).addClass('list_row')},function(){$(this).removeClass('list_row')});
   },
   table_list_controls : function (obj) {
      //console.log('obj in table_list_controls->',obj);
      var whattodo = obj.whattodo;

      var selector = '#table_cloned-'+obj.table_id;

      $(selector).find('.clickable').unbind('click');
      $(selector).find('.table_list_search_button').bind('click',function (e){
         var ser = $(selector).find('.table_param').serialize();
         $(selector).find('.page').text(1);
         app.ajx({'whattodo':whattodo,data:ser+'&page=1',hang_on:{'table':obj.table,token:obj.table_id,click_row:obj.click_row}});
      });
      $(selector).find('.per_page').bind('change',function (e){
         var ser = $(selector).find('.table_param').serialize();
         $('#page').text(1);
         app.ajx({'whattodo':whattodo,data:ser+'&page=1',hang_on:{token:obj.table_id,click_row:obj.click_row}});
      });
      $(selector).find('.close').bind('click',function (e){
         $(selector).empty().remove();
      });
      $(selector).find('.start').bind('click',function (e){
         var ser = $(selector).find('.table_param').serialize();
         var params = {per_page:'',page:1,total:'',action:''};
         params['per_page'] = parseInt($(selector).find('.per_page').val());
         params['page'] = parseInt($(selector).find('.page').text());
         params['total'] = parseInt($(selector).find('.total').text());
         var command = this;
         jQuery.each(['first_page','next_page','prev_page','last_page'],function (k,v) {
            if ($(command).hasClass(v)) {
               params.action = v;
            }
         });
         var new_page = parseInt(app.change_page_val(params));
         var page = parseInt($(selector).find('.page').text());
         if (new_page != page) {
            $(selector).find('.page').text(new_page);
            app.ajx({'whattodo':whattodo,data:ser+'&page='+new_page,hang_on:{'table':obj.table,token:obj.table_id,click_row:obj.click_row}});
         }
      });
   },
   change_page_val : function (obj) {
      var per_page = obj.per_page;
      var page = obj.page;
      var total = obj.total;
      var index = total / per_page;
      var to_floor = total % per_page;
      var pages = to_floor > 0 ? Math.floor(index) + 1 : index;
      var new_page = 1;
      switch (obj.action) {
         case 'first_page' :
            new_page = 1;
         break;
         case 'prev_page' :
            if (page > 1) {
               new_page = page - 1;
            }
         break;
         case 'next_page' :
            if (page < pages) {
               new_page = page + 1;
            } else {
               new_page = pages;
            }
         break;
         case 'last_page' :
            new_page = pages;
         break;
      }
      return new_page;
   }
});