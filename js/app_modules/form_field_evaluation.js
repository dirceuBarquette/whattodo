jQuery.extend(app,{
   eval_field : function (val,rules) {
      var error_num = 0;

      var input_field_rules = {
         //if the string only contains characters 0-9
         is_numeric : function (val){
            var rgxp = /[\D]/g;
            //console.log ('val->',val,'rgxp.test(val)->',rgxp.test(val));
            if (rgxp.test(val)) {
               //error_num[error_num.length] = 2;
               error_num = 2;
            }
         },
         //if the string is empty
         is_empty : function (val){
            if ((val == null) || (val.length == 0)) {
               error_num = 1;
            }
         },
         //if the string (#field_name) only contains characters A-Z, a-z , 0-9 or _
         is_valid_field_name : function(val){
            var rgxp = /[^a-zA-Z0-9_]/g;
            if (rgxp.test(val)) {
               error_num = 3;
            }
         }
      }

      jQuery.each(rules,function(i, rule){
         input_field_rules[rule](val);
      });

      return error_num;
   },
   input_field_rules_msgs : {
      1:'campo obrigat&oacute;rio',
      2:'S&oacute; pode conter n&uacute;meros',
      3:'possui caractere inv&aacute;lido',
      1000:'naaaaaaaaaaao'
   }
});