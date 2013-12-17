if(!window.console){
    console.log = function(){};
}
var globalUtil = {
    //{id:'addPage',fn:function(){}}
    backFn: [],
    emptyFn: function(){},
    getParam: function(str){
        var docurl = document.location.href;//$.mobile.getDocumentUrl();
        var search = $.mobile.path.parseUrl(docurl).search;
        if(new RegExp(str+'=([^&]+)').test(search)){
            return RegExp.$1;
        }else{
            return '';
        }
    },
    alert: function(msg){window.alert(msg);},
    confirm: function(msg){window.confirm(msg);},
    formatDate:function(dt,fm){
        if(!dt){
            return '';
        }
        if(!fm){
            fm = 'Y/MM/DD hh:ss';
        }
        if(!isNaN(dt) && !dt.getFullYear){
            dt = new Date(dt);
        }
        var tmp = 0;
        return fm.replace(/Y/,dt.getFullYear())
                .replace(/MM/,( tmp=dt.getMonth() )> 9 ? tmp: '0' + tmp)
                .replace(/DD/,( tmp=dt.getDate() )> 9 ? tmp: '0' + tmp)
                .replace(/hh/,( tmp=dt.getHours() ) > 9 ? tmp: '0' + tmp)
                .replace(/ss/,( tmp=dt.getMinutes() ) > 9 ? tmp: '0' + tmp);

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
    })(),
    fileOnError: function(e){
        var msg = '';
        switch(e.code){
            case FileError.NOT_FOUND_ERR:
                msg = 'NOT_FOUND_ERR';break;
            case FileError.SECURITY_ERR:
                msg = 'SECURITY_ERR';break;                
            case FileError.ABORT_ERR:
                msg = 'ABORT_ERR';break;
            case FileError.NOT_READABLE_ERR:
                msg = 'NOT_READABLE_ERR';break;
            case FileError.ENCODING_ERR:
                msg = 'ENCODING_ERR';break;
            case FileError.NO_MODIFICATION_ALLOWED_ERR:
                msg = 'NO_MODIFICATION_ALLOWED_ERR';break;           
            case FileError.INVALID_STATE_ERR:
                msg = 'INVALID_STATE_ERR';break;
            case FileError.SYNTAX_ERR:
                msg = 'SYNTAX_ERR';break;           
            case FileError.INVALID_MODIFICATION_ERR:
                msg = 'INVALID_MODIFICATION_ERR';break;
            case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'QUOTA_EXCEEDED_ERR';break;              
            case FileError.TYPE_MISMATCH_ERR:
                msg = 'TYPE_MISMATCH_ERR';break;
                
            case FileTransferError.FILE_NOT_FOUND_ERR:
                msg = 'FileTransferError.FILE_NOT_FOUND_ERR';break;           
            case FileTransferError.INVALID_URL_ERR:
                msg = 'FileTransferError.INVALID_URL_ERR';break;
            case FileTransferError.CONNECTION_ERR:
                msg = 'FileTransferError.CONNECTION_ERR';break;              
            case FileTransferError.ABORT_ERR:
                msg = 'FileTransferError.ABORT_ERR';break;
            default:
                msg = e.code;
        }
        alert('error:' + msg);
    },
    SEP: '/'
};
var jqmNote = {
    rootDir: 'shawnApp',
    pwdKey: 'jqmNotePwd',
    pwdValue: null
};
jqmNote.distpach = function(){
    function loadIni(callback){
        var key = localStorage.getItem(jqmNote.pwdKey);
        jqmNote.pwdValue = key;
        callback(key);
    }
    loadIni(function(key){
       
       if(key){
           $.mobile.changePage('login.html',{transition :'none'});
       }else{
           $.mobile.changePage('main.html',{transition :'none'});
       }
    });
};

jqmNote.init = function(pageId){
    //console.log('pageId:' + pageId);
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
            globalUtil.alert('请输入密码。',globalUtil.emptyFn,'提示','确定');
        }else{
            if(pwd != jqmNote.pwdValue){
                globalUtil.alert('密码错误。',globalUtil.emptyFn,'提示','确定');
            }else{
                $.mobile.changePage('main.html');
            }
        }
    },
    
    bindEvent: function(){
        //console.log('loginPage:bind');
        var _this = this;
        this.domEl.on('submit',function(e){
            var pwd = $('#pwd0').val();
            _this.validatePwd(pwd);
            return false;
        });
        
        $('#exitBtn').click(function(){
            navigator.app.exitApp();
        });
    }    
};

jqmNote.AddPage = {
    domEl:null,
    dirty: false,
    fid: null,
    
    init: function(){
        this.domEl = $('#addPage');
        this.bindEvent();
    },
    loadTxt: function(){
        var fid = sessionStorage.getItem('fid');
        //console.log('fid :' + fid);
        if(fid){
            sessionStorage.removeItem('fid');
            //alert('fid:' + fid);
            $('#addTitle').html('编辑笔记');
            
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 1*1024*1024, function(fs){
                 fs.root.getFile(jqmNote.rootDir + globalUtil.SEP + fid, 
                     {create: false, exclusive: false},function(fileEntry){
                         fileEntry.file(function(file){
                             var reader = new FileReader();
                             reader.onload = function(e){
                                 $('#noteTextarea').val(e.target.result);
                             };
                             reader.onerror = globalUtil.fileOnError;
                             reader.readAsText(file); 
                         }, globalUtil.fileOnError);
                 },globalUtil.fileOnError);
            },globalUtil.fileOnError);
        }else{
            $('#addTitle').html('新建笔记');
            $('#noteTextarea').val('');
        }
        this.fid = fid;
    },
    saveTxt: function(){
        
        var _this = this,
            txt = $('#noteTextarea').val();
        if(txt){
            $.mobile.loading( "show", {
                text: '保存中...',
                textVisible: true
            });
            var now =  new Date().getTime(),
                fileName = this.fid || ('f' + now);
            
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 1*1024*1024, function(fs){
                 fs.root.getFile(jqmNote.rootDir + globalUtil.SEP + fileName, {create: true, exclusive: false},function(fileEntry){
                     fileEntry.createWriter(function(writer){
                         writer.onwrite = function(){
                             _this.back();
                             //更新页面显示
                             jqmNote.MainPage.beforeshowFn.push(function(){
                                 jqmNote.MainPage.updateItem({
                                    name: fileName,
                                    txt: txt.substring(0,40),
                                    dt: globalUtil.formatDate(now)
                                 });
                             });
                             
                         };
                         writer.onerror = globalUtil.fileOnError;
                         writer.write(txt); 
                     }, globalUtil.fileOnError);
                 }
                 ,globalUtil.fileOnError);
            },globalUtil.fileOnError);
        }else{
            this.back();    
        }
    },
    back: function(){
        this.dirty = false;
        $.mobile.loading("hide");
        $('a:jqmData(rel="back")').click();
    },
    bindEvent: function(){
        //console.log('addPage:bind');
        var _this = this;
        this.domEl.on('click','#saveBtn',function(e){
            e.preventDefault();
            _this.saveTxt();
        }).on('pagebeforeshow',function(){
            _this.dirty = false;
            _this.loadTxt();
        }).on('click',':jqmData(rel="back")',function(e){
            if(_this.dirty){
                globalUtil.confirm('是否保存修改的内容？',function(btnIdx){
                    //TODO idx是按照下方的顺序取值(1,2...)，但是文本显示的顺序却是相反的。-_-
                    btnIdx == 1 ? _this.saveTxt(): _this.back();
                },'提示','是,否');
                return false;
            }
        });
        $('#noteTextarea').on('change',function(){
            _this.dirty = true;
        });
        
        globalUtil.backFn.push({
            'id': 'addPage',
            'fn':function(){
                $('#noteTextarea').blur();
                if(this.dirty){
                    this.saveTxt();
                    return false;
                }
            },
            scope: this
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
        $('#pwdForm')[0].reset();
    },
    savePwd: function(pwd){
        jqmNote.pwdValue = pwd;
        localStorage.setItem(jqmNote.pwdKey,pwd);
    },
    back: function(){
        $.mobile.loading("hide");
        $('a:jqmData(rel="back")').click();
    },
    validatePwd: function(txt){
        var pwd0 = $('#pwd0').val(),
            pwd1 = $('#pwd1').val(),
            pwd2 = $('#pwd2').val();
        if(pwd0 !== jqmNote.pwdValue){
            globalUtil.alert('旧密码输入不正确。',globalUtil.emptyFn,'提示','确定');
        }else{
            if(pwd1 !== pwd2){
                globalUtil.alert('新密码输入不一致。',globalUtil.emptyFn,'提示','确定');
            }else{
                this.savePwd(pwd1);
                globalUtil.alert('密码设置成功，下次启动生效！',globalUtil.emptyFn,'提示','确定');
                this.back();
            }
        }
    },
    
    bindEvent: function(){
        //console.log('OptionsPage:bind');
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
        this.bindEvent();
        this.loadNotes();
    },
    beforeshowFn:[],
    
    tpl: ['<li data-id="{name}"><a href="add.html" class="addLink">',
            '<h4>{txt}</h4>',
            '<p class="noteDate">{dt}</p>',
        '</a>',
        '<a href="#" class="del"></a></li>'
    ].join(''),
    
    updateItem: function(data){
        var item = this.domEl.find('li:jqmData(id="' + data.name + '")');
        if(item.size()){
            item = item.detach();
            item.find('h4').html(data.txt);
            item.find('.noteDate').html(data.dt);
        }else{
            item = globalUtil.applyTpl(this.tpl,data);
        }
        this.domEl.prepend($(item));
        //this.domEl.listview('refresh');
    },
    delItem: function(fileName){
        var _this = this;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
             fs.root.getFile(jqmNote.rootDir + globalUtil.SEP + fileName, {create: false, exclusive: false},function(fileEntry){
                 fileEntry.remove(function(){
                     _this.domEl.find('li:jqmData(id="' + fileName + '")').remove();
                     _this.domEl.listview('refresh');
                 }, globalUtil.fileOnError);
             }
             ,globalUtil.fileOnError);
        },globalUtil.fileOnError);
    },
    
    sortArr: function(arr){
        arr.sort(function(a,b){
            return  b.dt - a.dt;
        });
    },
    createDom: function(arr){
        this.sortArr(arr);
        var _html = '';
        for(var i=0; i < arr.length; i++){
            arr[i].dt = globalUtil.formatDate(arr[i].dt);
            _html += globalUtil.applyTpl(this.tpl,arr[i]);
        }
        
        this.domEl.html(_html);
        this.domEl.listview('refresh');
    },
    loadNotes: function(){
        var _this = this,
            arr = [];
        
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 1*1024*1024, function(fs){
             fs.root.getDirectory(jqmNote.rootDir,{create:true,exclusive:false},function(dirEntry){
                 dirEntry.createReader().readEntries(function(entries){
                     if(!entries.length){
                         _this.createDom(arr);
                     }else{
                         for(var i=0; i < entries.length; i++){
                             (function(i){
                                 arr[i] = {};
                                 if(entries[i].isFile){
                                     entries[i].getMetadata(function(meta){
                                         arr[i].dt = meta.modificationTime;
                                     },globalUtil.fileOnError);
                                     
                                     arr[i].name = entries[i].name;
                                      
                                     entries[i].file(function(file){
                                         var reader = new FileReader();
                                         reader.onloadend = function (evt) {
                                             arr[i].txt = evt.target.result.substring(0,40);
                                             
                                             //加载完成
                                             if(i === entries.length-1){
                                                 _this.createDom(arr);
                                             }
                                         };
                                        reader.readAsText(file);
                                     },globalUtil.fileOnError);
                                 }
                             })(i);
                         }
                     }
                     
                 },globalUtil.fileOnError);
             },globalUtil.fileOnError);
        }, globalUtil.fileOnError);

    },
    
    bindEvent: function(){
        //console.log('mainPage:bind');
        var _this = this;
        this.domEl.on('click','.del',function(e){
            e.preventDefault();
            var fid = $(this).closest('li').attr('data-id');
            globalUtil.confirm('是否删除该笔记？',function(btnIdx){
                //TODO idx是按照下方的顺序，但是文本显示的顺序确实相反的。-_-
                btnIdx == 1 ? _this.delItem(fid): _this.back();
            },'提示','是,否');
        }).on('click','.addLink',function(e){
            sessionStorage.setItem('fid',$(this).closest('li').attr('data-id'));
        });
    
        $('#mainPage').on('pagebeforeshow',function(){
            while(_this.beforeshowFn.length > 0){
                (_this.beforeshowFn.shift())();
            }
            _this.domEl.listview('refresh');    
        });
    }    
};



function onDeviceReady(){
    function onBackKeyDown(e) {
        var rtn = true;
        if($.mobile.activePage.is('#mainPage') || 
            $.mobile.activePage.is('#loginPage')){
            navigator.app.exitApp();
        }else{
            $.each(globalUtil.backFn,function(i,item){
                if($.mobile.activePage.is('#' + item.id)){
                    rtn = item.fn.call(item.scope) ;
                    if(rtn !== false){
                        navigator.app.backHistory();   
                    };
                }
            });
            rtn && navigator.app.backHistory(); 
        }
    }
    window.globalUtil.alert = navigator.notification.alert;
    window.globalUtil.confirm = navigator.notification.confirm;
     
    document.addEventListener("backbutton", onBackKeyDown, false);
}
function initApp(){
    
        //device ready 
        document.addEventListener('deviceready', function(){
            onDeviceReady();
            
            $.mobile.defaultPageTransition = 'none';
            $.mobile.transitionFallbacks.slideout = "none";
            $.mobile.transitionFallbacks.slidein = "none";
            
            $(document).on('pageinit','[data-role="page"]',function(e){
                jqmNote.init(e.target.id);
            });   
            jqmNote.init();
        }, false);     
}

try{
    //start app.
    initApp();
}catch(e){
    alert(e);
}

