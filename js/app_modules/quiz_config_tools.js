jQuery.extend(app,{
   search_in_quiz_config : function (wanted_val,search_by,config,callback) {
      var find = false;
      config = config || app.quiz_config;
      search_by = search_by || 'question_num';
      searched_val = wanted_val || '';
      if (wanted_val != '' && $(config).length > 0) {
         jQuery.each(config,function (index,question){
            switch (search_by)  {
               case 'question_num' :
                  if (wanted_val == question.question_num) {
                     find = config[index];
                     find['index'] = index;
                  }
               break;
               case 'index' :
                  if (config[index]) {
                     find = config[index];
                     find['index'] = index;
                  }
               break;
            }
         });
      }
      callback(find);
   },
   make_dependences_consistent : function (old_question_num,new_question_num,callback) {
      $(app.quiz_config).map(function(k,v){
         jQuery.each(v.answer.answer_config[0].deppending_on.question_num,function (key,val){
            if (parseInt(old_question_num) == parseInt(val)) {
               app.quiz_config.answer.answer_config[0].deppending_on.question_num = new_question_num;
            }
         });

      });
      callback();
   },
   reordering_question_nums : function (from_question_num,reordering_type,callback) {
      //$(app.quiz_config).map(function(k,v){
      jQuery.each(app.quiz_config,function (k,v) {
         if (parseInt(from_question_num) >= parseInt(v.question_num)) {
            switch (reordering_type) {
               case 'one_plus' :
                  app.quiz_config[k].question_num = parseInt(v.question_num) + 1;
               break;
               case 'one_minus' :
                  app.quiz_config[k].question_num = parseInt(v.question_num) - 1;
            }
         }
      });
      callback(app.quiz_config);
   },
   reordering_quiz : function (start_index,quiz_config) {//funfando!
      jQuery.each(quiz_config,function(k,v){
         var change_question_num_to = parseInt(quiz_config[k].question_num) - 1;
         if (k >= start_index) {
            quiz_config[k].question_num = change_question_num_to;
         }
      });
      return quiz_config;
   },
   delete_from_quiz_config : function (index,quiz_config,callback) {//funfando!
      var new_quiz_config = ''
      if (quiz_config.length - 1 == index) {//last
         quiz_config.pop();
         new_quiz_config = quiz_config;
      } else {
         if (index != 0) {
            var left_slice = quiz_config.slice(0,index);
            var right_slice = quiz_config.slice(index + 1);
            new_quiz_config = left_slice.concat(right_slice);
         } else {
            new_quiz_config = quiz_config.slice(1);
         }
      }
      callback(new_quiz_config);
   },
   move_question_into_quiz_config : function (old_index,new_index,quiz_config,callback) {
      var new_quiz_config = '';
      var to_move = quiz_config.splice(old_index,1);
      //console.log('to_move->',to_move);
      quiz_config.splice(new_index,0,to_move[0]);
      new_quiz_config = quiz_config;
      //console.log('new_quiz_config->',new_quiz_config);
      callback(new_quiz_config);
   }
   /*insert_into_quiz_config : function (question_config,inserting_type,index,callback) {
      if ($(app.quiz_config).size() == 0) {
         app.quiz_config[0] = question_config;
      } else {
         switch (inserting_type) {
            case 'after' :
               app.quiz_config.splice(index + 1,0,question_config);
            break;
            case 'before' :
               app.quiz_config.splice(index,0,question_config);
            break;
            case 'replace' :
            default :
               app.quiz_config.splice(index,1,question_config);
         }
      }
      callback(app.quiz_config);
   }*/
});