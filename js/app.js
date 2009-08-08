app = {
    language : 'pt-br',
    eval_deps : function (cur_question,quiz) {
        //console.log('cur_question->',cur_question);
        var deps = [],msg = false,cur = cur_question;
        jQuery.each(cur.depending_on,function(key,val){
            if (parseInt(val.question_num) > 0) {
                var q_index_dep = parseInt(val.question_num);
                var dep = quiz[q_index_dep];
                if (dep) {
                    //console.log('cur.question_num->',cur.question_num,' key->',key,' val->',val,' dep->',dep);
                    var same_question = [],tmp_question = '';
                    jQuery.each(cur.depending_on,function(q_key,q_val){
                        if (q_val.question_num == val.question_num) {
                            same_question[q_key] = q_val.answer_num;
                        }
                    });
                    var cross_dep = false;
                    jQuery.each(dep.depending_on,function(dep_key,dep_val){
                        if (cur.question_num == dep_val.question_num) {
                            cross_dep = true;
                        }
                    });
                    var a_type_dep = dep.answer_type+'_i18n';
                    var end = '';
                    if (cross_dep) {
                        if (cur.response == 'success' && dep.response == 'success') {
                            end = app[a_type_dep][app.language][val.answer_num];
                            deps[cur.question_num] = '<br />'+cur.question_num + ': depende da questão '+val.question_num+' '+end;
                        }
                        if (cur.response == 'success' && dep.response == 'error') {
                            deps[dep.question_num] = '';
                        }
                    } else {
                        if (cur.response == 'success' && cur.value != '') {
                            if (dep.response == 'error') {
                                end = app[a_type_dep][app.language][val.answer_num];
                                deps[cur.question_num] = '<br />'+cur.question_num + ': depende da questão '+val.question_num+' '+end;
                            } else {
                                var dep_logic = dep.answer_type+'_logic';
                                //console.log('val.answer_num->',val.answer_num,' dep.answer_map->',dep.answer_map);
                                var logics = [app[dep_logic]['right'],app[dep_logic]['wrong']];
                                //console.log('LOGICS',logics);
                                if (jQuery.inArray(val.answer_num,logics) < 0) {
                                    if (dep.answer_map) {
                                        if (same_question.length == 0) {
                                            if (jQuery.inArray(val.answer_num,dep.answer_map) < 0) {
                                                end = ' com a resposta '+val.answer_num +' '+app[a_type_dep][app.language][app[dep_logic]['right']];
                                                deps[cur.question_num] = '<br />'+cur.question_num + ': depende da questão '+val.question_num+' '+end;
                                            }
                                        } else {
                                            var dep_solved = false;
                                            //console.log('cur.question_num->',cur.question_num,' SAME_QUESTION---->',same_question);
                                            jQuery.each(same_question,function(sq_key,sq_val){
                                                if (!dep_solved) {
                                                    if (jQuery.inArray(sq_val,dep.answer_map) >= 0) {
                                                        //console.log('dep_solved->',dep_solved,' sq_key->',sq_key,' sq_val->',sq_val);
                                                        dep_solved = true;
                                                    }
                                                }
                                            });
                                            //console.log('dep_solved->',dep_solved);
                                            if (!dep_solved) {
                                                end = ' com a resposta '+same_question.toString() +' '+app[a_type_dep][app.language][app[dep_logic]['right']];
                                                deps[cur.question_num] = '<br />'+cur.question_num + ': depende da questão '+val.question_num+' '+end;
                                            }
                                        }
                                    }
                                } else {
                                    if (val.answer_num != dep.logic) {
                                        end = app[a_type_dep][app.language][val.answer_num];
                                        deps[cur.question_num] = '<br />'+cur.question_num + ': depende da questão '+val.question_num+' '+end;
                                    }
                                }
                            }
                        }
                        if (cur.response == 'error') {
                            if (dep.response == 'error') {
                                deps[cur.question_num] = '';
                            } else {
                                if (dep.answer_map) {
                                    if (same_question.length == 0) {
                                        if (jQuery.inArray(val.answer_num,dep.answer_map) < 0) {
                                            deps[cur.question_num] = '';
                                        }
                                    } else {
                                        var dep_solved = false;
                                        jQuery.each(same_question,function(sq_key,sq_val){
                                            if (!dep_solved) {
                                                if (jQuery.inArray(sq_val,dep.answer_map) >= 0) {
                                                    dep_solved = true;
                                                }
                                            }
                                        });
                                        if (!dep_solved) {
                                            deps[cur.question_num] = '';
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        return deps;
    },
    table : function (obj) {
        this.config = {
            id : obj.id || 'list_table',
            columns : obj.columns || {},
            list_name : obj.list_name,
            default_page : '1',
            row_click : obj.row_click,
            default_download_list : obj.default_download_list || false
        };
        var id = '#'+this.config.id;
        var open = function (append_to,callback) {
            $('.template').filter('.table_list')
            .clone()
            .attr({'id':this.config.id})
            .removeClass('template')
            .css({display:'block'})
            .appendTo(append_to);

            var tr_thead = '';
            jQuery.each($(this.config.columns),function(k,v){
                tr_thead += '<th>'+v.title+'</th>'
            });
            $(tr_thead).appendTo($(id+' .table_list_tr_thead'));
            $(id+' .table_list_td_tfoot').attr({colspan:$(this.config.columns).size()});

            activate_controls(this.config);

            if (callback) {
                callback();
            }
        };
        var serialize = function () {
            return $(id).find('.table_param').serialize();
        }
        var download_list = function () {
            obj = obj || this.config;
            var list_name = obj.list_name;
            ser = '?whattodo='+list_name+'&per_page=all&page=1&download=1';
            window.open('index.php'+ser);
        }
        var populate = function (obj) {
            obj = obj || this.config;
            var list_name = obj.list_name;
            var ser = serialize();
            ser += '&page='+$(id+' .page').text();//forcing...
            app.ajx({whattodo:list_name,data:ser},function(data){
                //console.log('DATA TABLE->',data);
                $('tr.table_row').empty().remove();
                $(id+' .total').text(data.total);
                jQuery.each(data.elem,function(k,v){
                    var tr = '';
                    var row_id = '';
                    var idx = 0;
                    jQuery.each(data.elem[k],function(K,V){
                        if (idx == 0) {
                            row_id =  V;
                        }
                        idx++;
                        tr += '<td>'+V+'</td>';
                    });
                    $('<tr class="table_row">'+tr+'</tr>').appendTo($(id+' .table_list_tbody'));
                    $(id+' .table_list_tbody tr:last').data('id',row_id);
                    //console.log('row_id->',row_id,' .table_row:last.data->', $(id+' .table_list_tbody tr:last').data('id'));
                });

                $('#'+id+' .table_row')
                .bind('click',function(e){
                    if (typeof obj.row_click == 'function') {
                        //this.index = $(id+' .table_row').index(this);
                        obj.row_click(this);
                    } else {
                        alert($(id+' .table_row').index(this));
                    }
                })
                .hover(
                    function(){
                        $(this).addClass('list_row');
                    },
                    function(){
                        $(this).removeClass('list_row');
                    }
                );
            });
        };
        var activate_controls = function (obj) {
            var selector = '#'+obj.id || '#list_table';
            var page = $(selector).find('.page').text();
            jQuery.each($(selector +' .start'),function(k,v){
                $(this).bind('click',function(e){
                    var cur_page = $(selector).find('.page').text();
                    var classes = $(this).attr('class');
                    var params = {per_page:'',page:cur_page,total:'',action:''};
                    params['per_page'] = parseInt($(selector).find('.per_page').val());
                    params['page'] = parseInt($(selector).find('.page').text());
                    params['total'] = parseInt($(selector).find('.total').text());
                    params['action'] = classes.match(/[a-z]*_page/)[0];

                    var new_page = parseInt(change_page_val(params));
                    if (new_page != parseInt(cur_page)) {
                        $(selector +' .page').text(new_page);
                        populate(obj);
                    }
                });
            });

            if (obj.default_download_list) {
                $(selector).find('.total').css({cursor:'pointer'}).bind('click',function (e){
                    download_list();
                });
            }

            $(selector).find('.close').bind('click',function (e){
                $(selector).empty().remove();
            });

            $(selector).find('.table_list_search_button').bind('click',function (e){
                $(selector +' .page').text('1');
                populate(obj);

            });
            $(selector).find('.per_page').bind('change',function (e){
                $(selector +' .page').text('1');
                populate(obj);
            });
        };
        var change_page_val = function (obj) {
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
        return {
            config : this.config,
            open : open,
            populate : populate
        };
    },
    prompt : function (obj) {
        this.config = {
            id : obj.id || 'prompt',
            title : obj.title || 'prompt title',
            body : obj.body || '',
            footer : obj.footer || '<p>prompt footer</p>',
            add_class : obj.add_class || ''
        };
        var id = this.config.id;
        this.open = function (append_to,callback) {
            app.lock_app();
            var pos = app.get_elem_position(append_to);

            $('.template').filter('.prompt')
            .clone()
            .attr({'id':id})
            .removeClass('template')
            .css({display:'none'})
            .appendTo(append_to);
            $('#'+id).css({position:'absolute',top:pos.top,left:pos.left,'z-index':'10'});
            $('#'+id).show(1000);
            $('#'+id+' .prompt_title_text').html(this.config.title);
            this.set_body(this.config.body);
            $('#'+id+' .prompt_close').unbind('click');
            $('#'+id+' .prompt_close_icon').bind('click',function(e){
                $('#'+id).empty().remove();
                app.unlock_app();
            });
            if (callback) {
                callback(this.config.id);
            }
        };
        this.set_body = function (htm) {
            $('#'+id+' .prompt_body').html('');
            $('#'+id+' .prompt_body').html(htm);
        };
        return {
            config : this.config,
            open : this.open,
            set_body: this.set_body
        };
    },
    load_modules : function(modules, callback) {
        var completed = 0;
        jQuery.each(modules, function(){
            $.getScript('./js/app_modules/' + this + '.js', function(data){
                if (++completed == modules.length){
                    completed = 0;
                    callback();
                }
            });
        });
    },
    buttons_locked : false,
    app_locked : false,

    make_mayonese : function (callback) {
        /*$('#logo_header_img').css({width:'400px',height:'100px'});
        $('#logo_header_div').appendTo('#header');
        $('#mainmenu').show();
        $('#optionmenu').show();
        $('#desktop').show(function(){
            $('<img id="loading" src="./imgs/loading.gif" alt="loading" />')
            .appendTo('#mainmenu');
        });*/


        /*$('#logo_header_div').show(2000,function(){
            $(this).slideUp(1000,function(){
                $('#logo_header_img').css({width:'400px',height:'100px'});
                $('#top_div').animate({width:'90%',opacity:1},{duration:'slow',queue:false});
                $(this).appendTo('#header').show(2000,function(){
                    $('#wrapper_left_bord').show();
                    $('#mainmenu').show(1000);
                    $('#optionmenu').show(1000,function(){
                        $('#desktop').show(1500,function(){
                            $('<img id="loading" src="./imgs/loading.gif" alt="loading" />')
                            .appendTo('#desktop');
                        });

                    });
                });
            });
        });*/
        callback();
    },
    quiz_config : [],
    ajx : function(obj,callback) {
        //var p = {wtd,data,type,url,dataType,options,hang_on}
        var options = obj.options || '';
        var hanging_on = obj.hang_on || {hang_on:[]};
        //console.log('hanging_on in ajx->',hanging_on);
        $.ajax({
            url : obj.url || 'index.php',
            type: obj.type || 'POST',
            data: "whattodo=" + obj.whattodo + "&" + obj.data,
            dataType: obj.dataType || 'json',
            beforeSend:function() {
                $('#loading').show();
            },
            success: function (data) {
                $('#loading').hide();
                try {
                    if (callback) {
                        callback(data);
                    } else {
                        data['hanged_on'] = hanging_on;
                        app[obj.whattodo](data);
                    }
                } catch (e) {
                    if (window.console && window.console.log) {
                        window.console.log('error : ',e);
                    } else {
                        alert('erro! '+ e);
                    }
                }
            }
        });
    }
}
