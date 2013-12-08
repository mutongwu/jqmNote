var jqmNote = {
    options:{
        pwd:false
    }
};
jqmNote.distpach = function(){
    function loadOptions(callback){
        callback();
    }
    
    loadOptions(function(){
       if(jqmNote.options.pwd){
           $.mobile.changePage('login.html'); 
       }else{
           $.mobile.changePage('main.html');
       } 
    });
};

jqmNote.init = function(){
    console.log('init');
    var urlProp = $.mobile.path.parseUrl($.mobile.getDocumentUrl());
    switch(urlProp.filename){
        case '':
        case 'index.html':{
            jqmNote.distpach();
            break;
        }
        case 'login.html':{
            jqmNote.LoginPage.init();
            break;}
        case 'main.html':{
            jqmNote.MainPage.init();
            break;
        }
        case 'add.html':{break;}
        case 'options.html':{break;}
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
                $.mobile.changePage('main.html');
            }
        }
    },
    
    bindEvent: function(){
        var _this = this;
        this.domEl.on('submit',function(e){
            var pwd = $('#pwd0').val();
            _this.validatePwd(pwd);
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
    },
    loadNotes: function(){
        
    },
    
    bindEvent: function(){
        console.log('bind');
        var _this = this;
        this.domEl.on('click','.del',function(e){
            e.preventDefault();
            if(confirm('是否删除该笔记？')){
                alert('removed');
            }
        });
    }    
};


$(document).on('pageinit',function(){
   jqmNote.init();    
});
