var globalUtil = {
    getParam: function(str){
        var docurl = document.location.href;//$.mobile.getDocumentUrl();
        var search = $.mobile.path.parseUrl(docurl).search;
        if(new RegExp(str+'=([^&]+)').test(search)){
            return RegExp.$1;
        }else{
            return '';
        }
    },
    formatDate:function(dt,format){
        if(!dt){
            return '';
        }
        if(!format){
            format = 'Y/MM/DD hh:ss';
        }
        if(!isNaN(dt)){
            dt = new Date(dt);
        }
        var tmp = 0;
        return format.replace(/Y/,dt.getFullYear())
                .relace(/MM/,tmp=dt.getMonth() > 9 ? tmp: '0' + tmp)
                .relace(/DD/,tmp=dt.getDate() > 9 ? tmp: '0' + tmp)
                .relace(/hh/,tmp=dt.getMinutes() > 9 ? tmp: '0' + tmp)
                .relace(/hh/,tmp=dt.getSeconds() > 9 ? tmp: '0' + tmp);
    },
    
    applyTpl : (function(){
        var reg = new RegExp("\\{.+?\\}","g");
        var replaceFn = function(data,key,tpl){
            var value = data,words = key.split(".");
            for(var i=0;i<words.length;i++){
                if(typeof value[words[i]] !== 'undefined'){
                    value = value[words[i]];
                }else{
                    value = '';
                    break;
                }
            }
            return tpl.replace(new RegExp("\\{" + key+"\\}"),value);
        };
        return function(tpl,data){
            if(typeof data == 'undefined'){
                data = '';
            }
            var rs2 = tpl.match(reg);
            for(var i=0;i<rs2.length;i++){
                 tpl = replaceFn(data,rs2[i].substring(1,rs2[i].length-1),tpl);     
            }
            return tpl || '';
        };
    })()
};
var jqmNote = {
    options:{
        pwd:''
    },
    loadFile: function(fid){
        
    }
};
jqmNote.distpach = function(){
    function loadIni(callback){
        setTimeout(callback,2000);
    }
    $(document).one('pageshow',function(){
        $.mobile.loading('show',{text:'程序加载中...',textVisible :true});
    });
    loadIni(function(){
       if(jqmNote.options.pwd){
           document.location.replace('login.html');
       }else{
           document.location.replace('main.html');
       } 
    });
};

jqmNote.init = function(pageId){
    console.log('pageId: ' + pageId);
    switch(pageId){
        case 'loginPage':{
            jqmNote.LoginPage.init();break;
        }
        case 'mainPage':{
            jqmNote.MainPage.init();break;
        }
        case 'addPage':{
            jqmNote.AddPage.init();break;
        }
        case 'optionsPage':{
            jqmNote.OptionsPage.init();break;
        }
        default:{
           // jqmNote.distpach();
            break;
        }
    }        
};

jqmNote.LoginPage = {
    domEl:null,
    init: function(){
        this.domEl = $('#loginForm');
        if(this.domEl.size()){
            this.bindEvent();
        }
    },
    validatePwd: function(pwd){
        if(!pwd){
            alert('请输入密码。');
        }else{
            if(pwd !== jqmNote.options.pwd){
                alert('密码错误。');
            }else{
                // $.mobile.changePage('main.html');
                document.location.replace('main.html');
            }
        }
    },
    
    bindEvent: function(){
        console.log('loginPage:bind');
        var _this = this;
        this.domEl.on('submit',function(e){
            var pwd = $('#pwd0').val();
            _this.validatePwd(pwd);
            return false;
        });
    }    
};

jqmNote.AddPage = {
    domEl:null,
    dirty: false,
    
    init: function(){
        this.domEl = $('#addPage');
        this.bindEvent();
    
    },
    loadTxt: function(){
        var fid = globalUtil.getParam('id');
        if(fid){
            $('h1').html('编辑笔记');
        }
        this.fid = fid;
    },
    saveTxt: function(txt){
        if(txt){
            console.log('this.fid:' + this.fid);
            jqmNote.MainPage.updateItem(this.fid,{
                txt: txt.substring(0,40),
                editTime: globalUtil.formatDate(new Date())
            });
            this.dirty = false;
        }
        //$.mobile.changePage('main.html');
        $('a:jqmData(rel="back")').click();
    },
    
    bindEvent: function(){
        console.log('addPage:bind');
        var _this = this;
        this.domEl.on('click','#saveBtn',function(e){
            var txt = $('#noteTextarea').val();
            _this.saveTxt(txt);
        }).on('pagebeforeshow',function(){
            _this.loadTxt();
        }).one('change','#noteTextarea',function(){
            _this.dirty = true;
        }).on('click',':jqmData(rel="back")',function(e){
            if(_this.dirty){
                alert('dirty');
                return false;
            }
        });
        
    }    
};

jqmNote.OptionsPage = {
    domEl:null,
    init: function(){
        this.domEl = $('#optionsPage');
        if(this.domEl.size()){
            this.bindEvent();
        }
    },
    savePwd: function(pwd){
        
    },
    
    validatePwd: function(txt){
        var pwd0 = $('#pwd0').val(),
            pwd1 = $('#pwd1').val(),
            pwd2 = $('#pwd2').val();
        if(pwd0 !== jqmNote.options.pwd){
            alert('旧密码输入不正确。');
        }else{
            if(pwd1 !== pwd2){
                alert('新密码输入不一致。');
            }
            this.savePwd(pwd1);
            $.mobile.changePage('main.html');
        }
    },
    
    bindEvent: function(){
        console.log('OptionsPage:bind');
        var _this = this;
        $('#pwdForm').on('submit',function(e){
            _this.validatePwd();
            return false;
        });
    }    
};


jqmNote.MainPage = {
    domEl:null,
    init: function(){
        this.domEl = $('#noteList');
        if(this.domEl.size()){
            this.bindEvent();
        }
        this.loadNotes();
    },
    updateItem: function(fid,data){
        var item = this.domEl.find('li:jqmData(id="' + fid + '")');
        if(item.size()){
            item.find('h4').html(data.txt);
            item.find('.noteDate').html(data.editTime);
            this.domEl.listview('refresh');
        }
    },
    loadNotes: function(){
        var html = ['<li data-id="f201309091234"><a href="add.html?id=f201309091234">',
                    '<h4>4这里是一大段的文字这里是一大段的文字这里是一大段的文字这里是一大段的文字这里是一大段的文字这里是一大段的文字这里是一大段的文字4</h4>',
                    '<p class="noteDate">2013/12/05 16:24</p>',
                '</a>',
                '<a href="#" class="del"></a></li>'].join('');
        this.domEl.append(html);
        this.domEl.listview('refresh');
    },
    
    bindEvent: function(){
        console.log('mainPage:bind');
        var _this = this;
        this.domEl.on('click','.del',function(e){
            e.preventDefault();
            if(confirm('是否删除该笔记？')){
                alert('removed');
            }
        });
    }    
};


 
function initApp(){
    $.mobile.defaultPageTransition = 'none';
    $(document).on('pageinit','[data-role="page"]',function(e){
        jqmNote.init(e.target.id);

    });
}
if('deviceready' in document){
    
    document.addEventListener('deviceready', function(){
        initApp();
        function onDeviceReady() {
            // Register the event listener
            document.addEventListener("backbutton", onBackKeyDown, false);
        }
        function onBackKeyDown() {
            alert($.mobile.activePage.attr('id'));
        }
    }, false);
}else{
    initApp();
}
