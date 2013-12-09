var globalUtil = {
    getParam: function(str){
        var search = document.location.search;
        if(new RegExp(str+'=([^&]+)').test(search)){
            return RegExp.$1;
        }else{
            return '';
        }
    }
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
            jqmNote.distpach();
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
    init: function(){
        this.domEl = $('#addPage');
        this.bindEvent();
    
    },
    loadTxt: function(){
        var fid = globalUtil.getParam('id');
        if(fid){
            $('h1').html('编辑笔记');
        }
    },
    saveTxt: function(txt){
        if(txt){
            
        }
        $.mobile.changePage('main.html');
    },
    
    bindEvent: function(){
        console.log('addPage:bind');
        var _this = this;
        this.domEl.on('click','#saveBtn',function(e){
            var txt = $('#noteTextarea').val();
            _this.saveTxt(txt);
        }).on('pagebeforeshow',function(){
            _this.loadTxt();
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
    loadNotes: function(){
        var html = ['<li><a href="add.html?id=f201309091231">',
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


 
$(document).on('pageinit','[data-role="page"]',function(e){
    jqmNote.init(e.target.id);
});
