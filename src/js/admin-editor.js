/**
 *  umeditor完整配置项
 *  可以在这里配置整个编辑器的特性
 */
/**************************提示********************************
 * 所有被注释的配置项均为UEditor默认值。
 * 修改默认配置请首先确保已经完全明确该参数的真实用途。
 * 主要有两种修改方案，一种是取消此处注释，然后修改成对应参数；另一种是在实例化编辑器时传入对应参数。
 * 当升级编辑器时，可直接使用旧版配置文件替换新版配置文件,不用担心旧版配置文件中因缺少新功能所需的参数而导致脚本报错。
 **************************提示********************************/


(function () {
    /**
     * 编辑器资源文件根路径。它所表示的含义是：以编辑器实例化页面为当前路径，指向编辑器资源文件（即dialog等文件夹）的路径。
     * 鉴于很多同学在使用编辑器的时候出现的种种路径问题，此处强烈建议大家使用"相对于网站根目录的相对路径"进行配置。
     * "相对于网站根目录的相对路径"也就是以斜杠开头的形如"/myProject/umeditor/"这样的路径。
     * 如果站点中有多个不在同一层级的页面需要实例化编辑器，且引用了同一UEditor的时候，此处的URL可能不适用于每个页面的编辑器。
     * 因此，UEditor提供了针对不同页面的编辑器可单独配置的根路径，具体来说，在需要实例化编辑器的页面最顶部写上如下代码即可。当然，需要令此处的URL等于对应的配置。
     * window.UMEDITOR_HOME_URL = "/xxxx/xxxx/";
     */
    var URL = window.UMEDITOR_HOME_URL || (function(){

        function PathStack() {

            this.documentURL = self.document.URL || self.location.href;

            this.separator = '/';
            this.separatorPattern = /\\|\//g;
            this.currentDir = './';
            this.currentDirPattern = /^[.]\/]/;

            this.path = this.documentURL;
            this.stack = [];

            this.push( this.documentURL );

        }

        PathStack.isParentPath = function( path ){
            return path === '..';
        };

        PathStack.hasProtocol = function( path ){
            return !!PathStack.getProtocol( path );
        };

        PathStack.getProtocol = function( path ){

            var protocol = /^[^:]*:\/*/.exec( path );

            return protocol ? protocol[0] : null;

        };

        PathStack.prototype = {
            push: function( path ){

                this.path = path;

                update.call( this );
                parse.call( this );

                return this;

            },
            getPath: function(){
                return this + "";
            },
            toString: function(){
                return this.protocol + ( this.stack.concat( [''] ) ).join( this.separator );
            }
        };

        function update() {

            var protocol = PathStack.getProtocol( this.path || '' );

            if( protocol ) {

                //根协议
                this.protocol = protocol;

                //local
                this.localSeparator = /\\|\//.exec( this.path.replace( protocol, '' ) )[0];

                this.stack = [];
            } else {
                protocol = /\\|\//.exec( this.path );
                protocol && (this.localSeparator = protocol[0]);
            }

        }

        function parse(){

            var parsedStack = this.path.replace( this.currentDirPattern, '' );

            if( PathStack.hasProtocol( this.path ) ) {
                parsedStack = parsedStack.replace( this.protocol , '');
            }

            parsedStack = parsedStack.split( this.localSeparator );
            parsedStack.length = parsedStack.length - 1;

            for(var i= 0,tempPath,l=parsedStack.length,root = this.stack;i<l;i++){
                tempPath = parsedStack[i];
                if(tempPath){
                    if( PathStack.isParentPath( tempPath ) ) {
                        root.pop();
                    } else {
                        root.push( tempPath );
                    }
                }

            }


        }

        var currentPath = document.getElementsByTagName('script');

        currentPath = currentPath[ currentPath.length -1 ].src;

        return new PathStack().push( currentPath ) + "";


    })();

    /**
     * 配置项主体。注意，此处所有涉及到路径的配置别遗漏URL变量。
     */
    window.UMEDITOR_CONFIG = {

        //为编辑器实例添加一个路径，这个不能被注释
        UMEDITOR_HOME_URL : URL

        //图片上传配置区
        ,imageUrl: "/api/imageAction!imageUpload.action"             //图片上传提交地址
        ,imagePath: ''                     //图片修正地址，引用了fixedImagePath,如有特殊需求，可自行配置
        ,imageFieldName:"image"                   //图片数据的key,若此处修改，需要在后台对应文件修改对应参数


        //工具栏上的所有的功能按钮和下拉框，可以在new编辑器的实例时选择自己需要的从新定义
        ,toolbar:[
            'source | undo redo | bold italic underline strikethrough | superscript subscript | forecolor backcolor | removeformat |',
            'insertorderedlist insertunorderedlist | selectall cleardoc paragraph | fontfamily fontsize' ,
            '| justifyleft justifycenter justifyright justifyjustify |',
            'link unlink | emotion image  | map',
            '| horizontal print preview fullscreen', 'drafts'
        ]

        //语言配置项,默认是zh-cn。有需要的话也可以使用如下这样的方式来自动多语言切换，当然，前提条件是lang文件夹下存在对应的语言文件：
        //lang值也可以通过自动获取 (navigator.language||navigator.browserLanguage ||navigator.userLanguage).toLowerCase()
        //,lang:"zh-cn"
        //,langPath:URL +"lang/"

        //ie下的链接自动监测
        //,autourldetectinie:false

        //主题配置项,默认是default。有需要的话也可以使用如下这样的方式来自动多主题切换，当然，前提条件是themes文件夹下存在对应的主题文件：
        //现有如下皮肤:default
        //,theme:'default'
        //,themePath:URL +"themes/"



        //针对getAllHtml方法，会在对应的head标签中增加该编码设置。
        //,charset:"utf-8"

        //常用配置项目
        //,isShow : true    //默认显示编辑器

        //,initialContent:'欢迎使用UMEDITOR!'    //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子

        //,initialFrameWidth:500 //初始化编辑器宽度,默认500
        //,initialFrameHeight:500  //初始化编辑器高度,默认500

        //,autoClearinitialContent:true //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了

        //,textarea:'editorValue' // 提交表单时，服务器获取编辑器提交内容的所用的参数，多实例时可以给容器name属性，会将name给定的值最为每个实例的键值，不用每次实例化的时候都设置这个值

        //,focus:false //初始化时，是否让编辑器获得焦点true或false

        //,autoClearEmptyNode : true //getContent时，是否删除空的inlineElement节点（包括嵌套的情况）

        //,fullscreen : false //是否开启初始化时即全屏，默认关闭

        //,readonly : false //编辑器初始化结束后,编辑区域是否是只读的，默认是false

        //,zIndex : 900     //编辑器层级的基数,默认是900

        //如果自定义，最好给p标签如下的行高，要不输入中文时，会有跳动感
        //注意这里添加的样式，最好放在.edui-editor-body .edui-body-container这两个的下边，防止跟页面上css冲突
        //,initialStyle:'.edui-editor-body .edui-body-container p{line-height:1em}'

        //,autoSyncData:true //自动同步编辑器要提交的数据

        //,emotionLocalization:false //是否开启表情本地化，默认关闭。若要开启请确保emotion文件夹下包含官网提供的images表情文件夹

        //,allHtmlEnabled:false //提交到后台的数据是否包含整个html字符串

        //fontfamily
        //字体设置
//        ,'fontfamily':[
//              { name: 'songti', val: '宋体,SimSun'},
//          ]

        //fontsize
        //字号
        //,'fontsize':[10, 11, 12, 14, 16, 18, 20, 24, 36]

        //paragraph
        //段落格式 值留空时支持多语言自动识别，若配置，则以配置值为准
        //,'paragraph':{'p':'', 'h1':'', 'h2':'', 'h3':'', 'h4':'', 'h5':'', 'h6':''}

        //undo
        //可以最多回退的次数,默认20
        //,maxUndoCount:20
        //当输入的字符数超过该值时，保存一次现场
        //,maxInputCount:1

        //imageScaleEnabled
        // 是否允许点击文件拖拽改变大小,默认true
        //,imageScaleEnabled:true

        //dropFileEnabled
        // 是否允许拖放图片到编辑区域，上传并插入,默认true
        //,dropFileEnabled:true

        //pasteImageEnabled
        // 是否允许粘贴QQ截屏，上传并插入,默认true
        //,pasteImageEnabled:true

        //autoHeightEnabled
        // 是否自动长高,默认true
        //,autoHeightEnabled:true

        //autoFloatEnabled
        //是否保持toolbar的位置不动,默认true
        //,autoFloatEnabled:true

        //浮动时工具栏距离浏览器顶部的高度，用于某些具有固定头部的页面
        //,topOffset:30

        //填写过滤规则
        //,filterRules: {}
    };
})();
/**
 * 中文语言包
 */
UM.I18N['zh-cn'] = {
    'labelMap':{
        'anchor':'锚点', 'undo':'撤销', 'redo':'重做', 'bold':'加粗', 'indent':'首行缩进', 'snapscreen':'截图',
        'italic':'斜体', 'underline':'下划线', 'strikethrough':'删除线', 'subscript':'下标','fontborder':'字符边框',
        'superscript':'上标', 'formatmatch':'格式刷', 'source':'源代码', 'blockquote':'引用',
        'pasteplain':'纯文本粘贴模式', 'selectall':'全选', 'print':'打印', 'preview':'预览',
        'horizontal':'分隔线', 'removeformat':'清除格式', 'time':'时间', 'date':'日期',
        'unlink':'取消链接', 'insertrow':'前插入行', 'insertcol':'前插入列', 'mergeright':'右合并单元格', 'mergedown':'下合并单元格',
        'deleterow':'删除行', 'deletecol':'删除列', 'splittorows':'拆分成行', 'splittocols':'拆分成列', 'splittocells':'完全拆分单元格',
        'mergecells':'合并多个单元格', 'deletetable':'删除表格', 'cleardoc':'清空文档','insertparagraphbeforetable':"表格前插入行",'insertcode':'代码语言','fontfamily':'字体', 'fontsize':'字号', 'paragraph':'段落格式', 'image':'图片',
        'edittable':'表格属性','edittd':'单元格属性', 'link':'超链接','emotion':'表情', 'spechars':'特殊字符', 'searchreplace':'查询替换', 'map':'百度地图', 'gmap':'Google地图',
        'video':'视频', 'help':'帮助', 'justifyleft':'居左对齐', 'justifyright':'居右对齐', 'justifycenter':'居中对齐',
        'justifyjustify':'两端对齐', 'forecolor':'字体颜色', 'backcolor':'背景色', 'insertorderedlist':'有序列表',
        'insertunorderedlist':'无序列表', 'fullscreen':'全屏', 'directionalityltr':'从左向右输入', 'directionalityrtl':'从右向左输入',
        'rowspacingtop':'段前距', 'rowspacingbottom':'段后距', 'highlightcode':'插入代码', 'pagebreak':'分页', 'insertframe':'插入Iframe', 'imagenone':'默认',
        'imageleft':'左浮动', 'imageright':'右浮动', 'attachment':'附件', 'imagecenter':'居中', 'wordimage':'图片转存',
        'lineheight':'行间距','edittip' :'编辑提示','customstyle':'自定义标题', 'autotypeset':'自动排版', 'webapp':'百度应用',
        'touppercase':'字母大写', 'tolowercase':'字母小写','background':'背景','template':'模板','scrawl':'涂鸦','music':'音乐','inserttable':'插入表格',
        'drafts': '草稿箱', 'formula':'数学公式'


    },
    'paragraph':{'p':'段落', 'h1':'标题 1', 'h2':'标题 2', 'h3':'标题 3', 'h4':'标题 4', 'h5':'标题 5', 'h6':'标题 6'},
    'fontfamily':{
        'songti':'宋体',
        'kaiti':'楷体',
        'heiti':'黑体',
        'lishu':'隶书',
        'yahei':'微软雅黑',
        'andaleMono':'andale mono',
        'arial': 'arial',
        'arialBlack':'arial black',
        'comicSansMs':'comic sans ms',
        'impact':'impact',
        'timesNewRoman':'times new roman'
    },
    'ok':"确认",
    'cancel':"取消",
    'closeDialog':"关闭对话框",
    'tableDrag':"表格拖动必须引入uiUtils.js文件！",
    'autofloatMsg':"工具栏浮动依赖编辑器UI，您首先需要引入UI文件!",
    'anthorMsg':"链接",
    'clearColor':'清空颜色',
    'standardColor':'标准颜色',
    'themeColor':'主题颜色',
    'property':'属性',
    'default':'默认',
    'modify':'修改',
    'justifyleft':'左对齐',
    'justifyright':'右对齐',
    'justifycenter':'居中',
    'justify':'默认',
    'clear':'清除',
    'anchorMsg':'锚点',
    'delete':'删除',
    'clickToUpload':"点击上传",
    'unset':'尚未设置语言文件',
    't_row':'行',
    't_col':'列',
    'more':'更多',
    'pasteOpt':'粘贴选项',
    'pasteSourceFormat':"保留源格式",
    'tagFormat':'只保留标签',
    'pasteTextFormat':'只保留文本',

    //===============dialog i18N=======================
    'image':{
        'static':{
            'lang_tab_local':"本地上传",
            'lang_tab_imgSearch':"网络图片",
            'lang_input_dragTip':"支持图片拖拽上传",
            'lang_btn_add':"添加"
        },
        'uploadError': '上传出错'
    },
    'emotion':{
        'static':{
            'lang_input_choice':'精选',
            'lang_input_Tuzki':'兔斯基',
            'lang_input_BOBO':'BOBO',
            'lang_input_lvdouwa':'绿豆蛙',
            'lang_input_babyCat':'baby猫',
            'lang_input_bubble':'泡泡',
            'lang_input_youa':'有啊'
        }
    },
    'gmap':{
        'static':{
            'lang_input_address':'地址',
            'lang_input_search':'搜索',
            'address':{'value':"北京"}
        },
        'searchError':'无法定位到该地址!'
    },
    'link':{
        'static':{
            'lang_input_text':'文本内容：',
            'lang_input_url':'链接地址：',
            'lang_input_title':'标题：',
            'lang_input_target':'是否在新窗口打开：'
        },
        'validLink':'只支持选中一个链接时生效',
        'httpPrompt':'您输入的超链接中不包含http等协议名称，默认将为您添加http://前缀'
    },
    'map':{
        'static':{
            'lang_city':"城市",
            'lang_address':"地址",
            'city':{'value':"北京"},
            'lang_search':"搜索",
            'lang_dynamicmap':"插入动态地图"
        },
        'cityMsg':"请选择城市",
        'errorMsg':"抱歉，找不到该位置！"
    },
    'video':{
        'static':{
            'lang_tab_insertV':"插入视频",
            'lang_video_url':"视频网址",
            'lang_video_size':"视频尺寸",
            'lang_videoW':"宽度",
            'lang_videoH':"高度",
            'lang_alignment':"对齐方式",
            'videoSearchTxt':{'value':"请输入搜索关键字！"},
            'videoType':{'options':["全部", "热门", "娱乐", "搞笑", "体育", "科技", "综艺"]},
            'videoSearchBtn':{'value':"百度一下"},
            'videoSearchReset':{'value':"清空结果"}
        },
        'numError':"请输入正确的数值，如123,400",
        'floatLeft':"左浮动",
        'floatRight':"右浮动",
        'default':"默认",
        'block':"独占一行",
        'urlError':"输入的视频地址有误，请检查后再试！",
        'loading':" &nbsp;视频加载中，请等待……",
        'clickToSelect':"点击选中",
        'goToSource':'访问源视频',
        'noVideo':" &nbsp; &nbsp;抱歉，找不到对应的视频，请重试！"
    },
    'formula':{
        'static':{
            'lang_tab_common':'常用公式',
            'lang_tab_symbol':'符号',
            'lang_tab_letter':'字母'
        }
    }
};
