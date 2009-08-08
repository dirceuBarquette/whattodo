(function(){

   whattodoo = this.whattodoo = this.doo = function (project) {
      return new whattodoo(project);
   };
   whattodoo = whattodoo.prototype = {
      init : function (project) {
         console.log('project in init',project)
         this.project = project || 'test';
      }
   };

})();
//(function(){ funfando
//   //var doo = whattodoo;
//   //console.log('this->',this,'$(this)',$(this));
//   //var
//   //win = this;
//
//   whattodoo = this.whattodoo = this.doo = function (project) {
//      return new whattodoo(project);
//   };
//   //console.log('win->',win);
//   /*whattodoo = whattodoo.prototype = {
//      init : function (project) {
//         console.log('project in init',project)
//         project = project || 'test';
//         return project;
//      }
//   };*/
//   whattodoo = whattodoo.prototype = {
//      init : function (project) {
//         console.log('project in init',project)
//         this.project = project || 'test';
//      }
//   };
//
//})();
//jQuery.extend(whattodoo,{
//   project : {name:'new project',version:'0.1'},
//   set_project : function (o) {
//      project = o;
//   }
//});
//whattodoo.set_project ({name:'cepp',version:'1'});
//var a = whattodoo('cepp');
//alert(a);
//console.log('whattodoo->',whattodoo);
//var a = whattodoo('cepp');
//alert (a);
//console.log('this -> ',this);
//console.log('whattodoo->',whattodoo());