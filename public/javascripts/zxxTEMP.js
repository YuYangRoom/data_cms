/**
 * Created by Administrator on 2015/11/13.
 */
/**
 * Created by Administrator on 2015/11/2.
 */
/*
 * zxxFile.js 基于HTML5 文件上传的核心脚本 http://www.zhangxinxu.com/wordpress/?p=1923
 * by zhangxinxu 2011-09-12
 */

var ZXXTEMP = {
    fileInput: null,				//html file控件
    dragDrop: null,					//拖拽敏感区域
    upButton: null,					//提交按钮
    menuButton:null,				//提交菜单按钮
    url: "",						//ajax地址
    fileFilter: [],                 //过滤后的文件
    type: "",                       //保存文档类型，可能是menu，可能是actrraction
    filter: function(files) {		//选择文件组的过滤方法
        return files;
    },
    descFilter:function(files){
        return files;
    },
    onSelect: function() {},		//文件选择后
    onDelete: function() {},		//文件删除后
    onDragOver: function() {},		//文件拖拽到敏感区域时
    onDragLeave: function() {},	//文件离开到敏感区域时
    onProgress: function() {},		//文件上传进度
    onSuccess: function() {},		//文件上传成功时
    onFailure: function() {},		//文件上传失败时,
    onComplete: function() {},		//文件全部上传完毕时

    /* 开发参数和内置方法分界线 */

    //文件拖放
    funDragHover: function(e) {
        e.stopPropagation();
        e.preventDefault();
        this[e.type === "dragover"? "onDragOver": "onDragLeave"].call(e.target);
        return this;
    },
    //获取选择文件，file控件或拖放
    funGetFiles: function(e) {
        // 取消鼠标经过样式
        this.funDragHover(e);

        // 获取文件列表对象
        var files = e.target.files || e.dataTransfer.files;
        //继续添加文件
        this.fileFilter = this.fileFilter.concat(this.filter(files));
        this.funDealFiles();
        return this;
    },

    //选中文件的处理与回调
    funDealFiles: function() {
        for (var i = 0, file; file = this.fileFilter[i]; i++) {
            //增加唯一索引值
            file.index = i;
        }
        //执行选择回调
        this.onSelect(this.fileFilter);
        return this;
    },

    //删除对应的文件
    funDeleteFile: function(fileDelete) {
        var arrFile = [];
        for (var i = 0, file; file = this.fileFilter[i]; i++) {
            if (file != fileDelete) {
                arrFile.push(file);
            } else {
                this.onDelete(fileDelete);
            }
        }
        this.fileFilter = arrFile;
        return this;
    },
    funCheck: function(){
        for (var i = 0, file; file = this.fileFilter[i]; i++) {
            if(this.type=="menu"||this.type=="attr"|| this.type=="people_picture"){
                var desc=$('#uploadDesc_'+i).val();
                var advice=$('#uploadAdvice_'+i).val();
                var p_desc=$('#uploadP_desc'+i).val();
                var image_desc=$('#uploadImage_desc'+i).val();
                var p_title=$('#uploadP_title'+i).val();
                var image_title=$('#image_title'+i).val();
                //news
                var newsInfo_title=$('#newsInfo_title'+i).val();
                var newsInfo_url=$('#newsInfo_url'+i).val();
                var newsInfo_text=$('#newsInfo_text'+i).val();
                var newsInfo_source=$('#newsInfo_source'+i).val();
                var newsInfo_date=$('#newsInfo_date'+i).val();
                var newsInfo_image_desc=$('#newsInfo_image_desc'+i).val();
                //news
                var p_PGC_Id=$('#uploadp_pgc_Id'+i).val();
                if(desc==""){
                    alert('您这张"' + file.name + '"图片描述不能为空');
                    return true;
                }
                file.desc=desc;
                file.p_desc=p_desc;
                file.image_desc=image_desc;
                file.p_title=p_title;
                file.image_title=image_title;
                //news
                file.newsInfo_title=newsInfo_title;
                file.newsInfo_url=newsInfo_url;
                file.newsInfo_text=newsInfo_text;
                file.newsInfo_source=newsInfo_source;
                file.newsInfo_date=newsInfo_date;
                file.newsInfo_image_desc=newsInfo_image_desc;
                //news
                file.p_PGC_Id=p_PGC_Id;
                file.advice=advice;
            }
            if (this.type=="attr"){
                var title=$('#uploadTitle_'+i).val();
                if(title==""){
                    alert('您这张"' + file.name + '"图片题目不能为空');
                    return true;
                }
                file.title=title;
                file.advice=advice;
            }


        }
        return false;
    },
    funUploadMenu: function() {
        var self = this;
        if (location.host.indexOf("sitepointstatic") >= 0) {
            //非站点服务器上运行
            return;
        }
        var zxx_id = $('#zxx_id_Temp').val(); //这里自己添加ID
        var _type = $('#_type_Temp').val();
        var flag=this.type;
        if(this.funCheck())return;
        for (var i = 0, file; file = this.fileFilter[i]; i++) {
            (function(file) {
                var xhr = new XMLHttpRequest();
                if (xhr.upload) {
                    // 上传中
                    xhr.upload.addEventListener("progress", function(e) {
                        self.onProgress(file, e.loaded, e.total);
                    }, false);

                    // 文件上传成功或是失败
                    xhr.onreadystatechange = function(e) {
                        if (xhr.readyState == 4) {
                            if (xhr.status == 200) {
                                self.onSuccess(file, xhr.responseText);
                                self.funDeleteFile(file);
                                console.log('one onComplete');
                                if (!self.fileFilter.length) {
                                    //全部完毕
                                    self.onComplete();
                                }
                            } else {
                                self.onFailure(file, xhr.responseText);
                            }
                        }
                    };

                    // 开始上传
                    // xhr.open("POST", self.url, true);
                    // xhr.setRequestHeader("X_FILENAME", file.name);
                    // xhr.send(file);
                    //修正为以下方式

                    xhr.open("POST", self.url, true);
                    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                    var fd = new FormData();
                    fd.append('file',file);
                    fd.append('_type',_type);
                    fd.append('_id',zxx_id);
                    if(flag=='attr'){
                        fd.append('_desc',file.desc);
                        fd.append('_title',file.title);
                        fd.append('_advice',file.advice);
                        fd.append('_flag','attr');
                    }else if(flag=='menu'||flag=='people_picture'){
                        fd.append('_desc',file.desc);
                        fd.append('_advice',file.advice);
                        fd.append('p_desc',file.p_desc);
                        fd.append('image_desc',file.image_desc);
                        fd.append('p_title',file.p_title);
                        fd.append('image_title',file.image_title);
                        //news
                        fd.append('newsInfo_title',file.newsInfo_title);
                        fd.append('newsInfo_url',file.newsInfo_url);
                        fd.append('newsInfo_text',file.newsInfo_text);
                        fd.append('newsInfo_source',file.newsInfo_source);
                        fd.append('newsInfo_date',file.newsInfo_date);
                        fd.append('newsInfo_image_desc',file.newsInfo_image_desc);
                        //news
                        fd.append('p_PGC_Id',file.p_PGC_Id);
                        fd.append('_flag','menu');
                    }
                    xhr.send(fd);
                }
            })(file);
        }

    },
    init: function() {
        var self = this;

        if (this.dragDrop) {
            this.dragDrop.addEventListener("dragover", function(e) { self.funDragHover(e); }, false);
            this.dragDrop.addEventListener("dragleave", function(e) { self.funDragHover(e); }, false);
            this.dragDrop.addEventListener("drop", function(e) { self.funGetFiles(e); }, false);
        }

        //文件选择控件选择
        if (this.fileInput) {
            this.fileInput.addEventListener("change", function(e) { self.funGetFiles(e); }, false);
        }

        //上传按钮提交
        if (this.menuButton) {
            this.menuButton.addEventListener("click", function(e) { self.funUploadMenu(e); }, false);
        }
    }
};
