// returns true if the string is empty
function isEmpty(str){
  return (str == null) || (str.length == 0);
}
// returns true if the string is a valid email
function isEmail(str){
  if(isEmpty(str)) return false;
  var re = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i
  return re.test(str);
}
// returns true if the string only contains characters A-Z or a-z
function isAlpha(str){
  var re = /[^a-zA-Z]/g
  if (re.test(str)) return false;
  return true;
}
// returns true if the string only contains characters 0-9
function isNumeric(str){
  var re = /[\D]/g
  if (re.test(str)) return false;
  return true;
}
// returns true if the string only contains characters A-Z, a-z , 0-9 or _
function isAlphaNumeric(str){
  var re = /[^a-zA-Z0-9_]/g
  if (re.test(str)) return false;
  return true;
}
// returns true if the string's length equals "len"
function isLength(str, len){
  return str.length == len;
}
// returns true if the string's length is between "min" and "max"
function isLengthBetween(str, min, max){
  return (str.length >= min)&&(str.length <= max);
}
// returns true if the string is a US phone number formatted as...
// (000)000-0000, (000) 000-0000, 000-000-0000, 000.000.0000, 000 000 0000, 0000000000
function isPhoneNumber(str){
  var re = /^\(?[2-9]\d{2}[\)\.-]?\s?\d{3}[\s\.-]?\d{4}$/
  return re.test(str);
}
// returns true if the string is a valid date formatted as...
// mm dd yyyy, mm/dd/yyyy, mm.dd.yyyy, mm-dd-yyyy
function isDate(str){
  var re = /^(\d{1,2})[\s\.\/-](\d{1,2})[\s\.\/-](\d{4})$/
  if (!re.test(str)) return false;
  var result = str.match(re);
  var m = parseInt(result[1]);
  var d = parseInt(result[2]);
  var y = parseInt(result[3]);
  if(m < 1 || m > 12 || y < 1900 || y > 2100) return false;
  if(m == 2){
          var days = ((y % 4) == 0) ? 29 : 28;
  }else if(m == 4 || m == 6 || m == 9 || m == 11){
          var days = 30;
  }else{
          var days = 31;
  }
  return (d >= 1 && d <= days);
}
// returns true if "str1" is the same as the "str2"
function isMatch(str1, str2){
  return str1 == str2;
}
// returns true if the string contains only whitespace
// cannot check a password type input for whitespace
function isWhitespace(str){ // NOT USED IN FORM VALIDATION
  var re = /[\S]/g
  if (re.test(str)) return false;
  return true;
}
// removes any whitespace from the string and returns the result
// the value of "replacement" will be used to replace the whitespace (optional)
function stripWhitespace(str, replacement){// NOT USED IN FORM VALIDATION
  if (replacement == null) replacement = '';
  var result = str;
  var re = /\s/g
  if(str.search(re) != -1){
    result = str.replace(re, replacement);
  }
  return result;
}
// validate the form
function validateForm(f, preCheck){
  var errors = '';
  if(preCheck != null) errors += preCheck;
  var i,e,t,n,v;
  for(i=0; i < f.elements.length; i++){
    e = f.elements[i];
    if(e.optional) continue;
    t = e.type;
    n = e.name;
    v = e.value;
    if(t == 'text' || t == 'password' || t == 'textarea'){
      if(isEmpty(v)){
        errors += n+' cannot be empty.\n'; continue;
      }
      if(v == e.defaultValue){
        errors += n+' cannot use the default value.\n'; continue;
      }
      if(e.isAlpha){
        if(!isAlpha(v)){
          errors += n+' can only contain characters A-Z a-z.\n'; continue;
        }
      }
      if(e.isNumeric){
        if(!isNumeric(v)){
          errors += n+' can only contain characters 0-9.\n'; continue;
        }
      }
      if(e.isAlphaNumeric){
        if(!isAlphaNumeric(v)){
          errors += n+' can only contain characters A-Z a-z 0-9.\n'; continue;
        }
      }
      if(e.isEmail){
        if(!isEmail(v)){
          errors += v+' is not a valid email.\n'; continue;
        }
      }
      if(e.isLength != null){
        var len = e.isLength;
        if(!isLength(v,len)){
          errors += n+' must contain only '+len+' characters.\n'; continue;
        }
      }
      if(e.isLengthBetween != null){
        var min = e.isLengthBetween[0];
        var max = e.isLengthBetween[1];
        if(!isLengthBetween(v,min,max)){
          errors += n+' cannot contain less than '+min+' or more than '+max+' characters.\n'; continue;
        }
      }
      if(e.isPhoneNumber){
        if(!isPhoneNumber(v)){
          errors += v+' is not a valid US phone number.\n'; continue;
        }
      }
      if(e.isDate){
        if(!isDate(v)){
          errors += v+' is not a valid date.\n'; continue;
        }
      }
      if(e.isMatch != null){
        if(!isMatch(v, e.isMatch)){
          errors += n+' does not match.\n'; continue;
        }
      }
    }
    if(t.indexOf('select') != -1){
      if(isEmpty(e.options[e.selectedIndex].value)){
        errors += n+' needs an option selected.\n'; continue;
      }
    }
    if(t == 'file'){
      if(isEmpty(v)){
        errors += n+' needs a file to upload.\n'; continue;
      }
    }
  }
  if(errors != '') alert(errors);
  return errors == '';
}