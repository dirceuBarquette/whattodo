jQuery.extend(app,{
   clean_desktop : function () {
      $('#desktop > *[id!=loading]').remove();
   },
   get_elem_position : function (elem) {
      var p = $(elem);
      var position = p.position();
      return position;
   },
   get_elem_len : function (elem) {
      var l = $(elem);
      var len = {'width':l.outerWidth(true),'height':l.outerHeight(true)};
      return len;
   },
   lock_app : function () {
      //$('#quiz_area_in_quiz select').hide();//IE bug...
      app.app_locked = true;
   },
   unlock_app : function () {
      app.app_locked = false;
      //$('#quiz_area_in_quiz select').show();
   },
   lock_elem : function (obj) {
      app.buttons_locked = true;
      jQuery.each(obj.elems,function(k,v){
         var pos = app.get_elem_position(v);
         var len = app.get_elem_len(v);
         $('<div id="'+obj.id+'">&nbsp;</div>')
         .css({position:'absolute',top:pos.top,left:pos.left,'width':len.width,'height':len.height,display:'block'})
         .addClass('locked_element')
         .appendTo(v);
      });
   },
   unlock_elem : function (obj) {
      app.buttons_locked = false;
      jQuery.each(obj.elems,function(k,v){
         $(v).find('[class=locked_element]').remove();
      });
   },
   print_div : function (obj){
      var html = '<html><head></head><body></body><div id="msg">'+obj.html+'</div></html>';
      var opened = window.open("","CEPP - imprimir mensagens");
      opened.document.write(html);
      opened.document.close();
   }

});