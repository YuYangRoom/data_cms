/**
 * Created by Administrator on 2015/11/2.
 */
/*
 * zxxFile.js ����HTML5 �ļ��ϴ��ĺ��Ľű� http://www.zhangxinxu.com/wordpress/?p=1923
 * by zhangxinxu 2011-09-12
 */

var ZXXMENU = {
    fileInput: null,				//html file�ؼ�
    dragDrop: null,					//��ק��������
    upButton: null,					//�ύ��ť
    menuButton:null,				//�ύ�˵���ť
    url: "",						//ajax��ַ
    fileFilter: [],                 //���˺���ļ�
    type: "",                       //�����ĵ����ͣ�������menu��������actrraction
    filter: function(files) {		//ѡ���ļ���Ĺ��˷���
        return files;
    },
    descFilter:function(files){
        return files;
    },
    onSelect: function() {},		//�ļ�ѡ���
    onDelete: function() {},		//�ļ�ɾ����
    onDragOver: function() {},		//�ļ���ק����������ʱ
    onDragLeave: function() {},	//�ļ��뿪����������ʱ
    onProgress: function() {},		//�ļ��ϴ�����
    onSuccess: function() {},		//�ļ��ϴ��ɹ�ʱ
    onFailure: function() {},		//�ļ��ϴ�ʧ��ʱ,
    onComplete: function() {},		//�ļ�ȫ���ϴ����ʱ

    /* �������������÷����ֽ��� */

    //�ļ��Ϸ�
    funDragHover: function(e) {
        e.stopPropagation();
        e.preventDefault();
        this[e.type === "dragover"? "onDragOver": "onDragLeave"].call(e.target);
        return this;
    },
    //��ȡѡ���ļ���file�ؼ����Ϸ�
    funGetFiles: function(e) {
        // ȡ����꾭����ʽ
        this.funDragHover(e);

        // ��ȡ�ļ��б����
        var files = e.target.files || e.dataTransfer.files;
        //��������ļ�
        this.fileFilter = this.fileFilter.concat(this.filter(files));
        this.funDealFiles();
        return this;
    },

    //ѡ���ļ��Ĵ�����ص�
    funDealFiles: function() {
        for (var i = 0, file; file = this.fileFilter[i]; i++) {
            //����Ψһ����ֵ
            file.index = i;
        }
        //ִ��ѡ��ص�
        this.onSelect(this.fileFilter);
        return this;
    },

    //ɾ����Ӧ���ļ�
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
            if(this.type=="menu"||this.type=="attr"){
                var desc=$('#uploadDesc_'+i).val();
                if(desc==""){
                    alert('������"' + file.name + '"ͼƬ��������Ϊ��');
                    return true;
                }
                file.desc=desc;
            }
            if (this.type=="attr"){
                var title=$('#uploadTitle_'+i).val();
                if(title==""){
                    alert('������"' + file.name + '"ͼƬ��Ŀ����Ϊ��');
                    return true;
                }
                file.title=title;
            }


        }
        return false;
    },
    funUploadMenu: function() {
        var self = this;
        if (location.host.indexOf("sitepointstatic") >= 0) {
            //��վ�������������
            return;
        }
        var zxx_id = $('#zxx_id_menu').val(); //�����Լ����ID
        var _type = $('#_type_menu').val();
        var flag=this.type;
        if(this.funCheck())return;
        for (var i = 0, file; file = this.fileFilter[i]; i++) {
            (function(file) {
                var xhr = new XMLHttpRequest();
                if (xhr.upload) {
                    // �ϴ���
                    xhr.upload.addEventListener("progress", function(e) {
                        self.onProgress(file, e.loaded, e.total);
                    }, false);

                    // �ļ��ϴ��ɹ�����ʧ��
                    xhr.onreadystatechange = function(e) {
                        if (xhr.readyState == 4) {
                            if (xhr.status == 200) {
                                self.onSuccess(file, xhr.responseText);
                                self.funDeleteFile(file);
                                console.log('one onComplete');
                                if (!self.fileFilter.length) {
                                    //ȫ�����
                                    self.onComplete();
                                }
                            } else {
                                self.onFailure(file, xhr.responseText);
                            }
                        }
                    };

                    // ��ʼ�ϴ�
                    // xhr.open("POST", self.url, true);
                    // xhr.setRequestHeader("X_FILENAME", file.name);
                    // xhr.send(file);
                    //����Ϊ���·�ʽ

                    xhr.open("POST", self.url, true);
                    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                    var fd = new FormData();
                    fd.append('file',file);
                    fd.append('_type',_type);
                    fd.append('_id',zxx_id);
                    if(flag=='attr'){
                        fd.append('_desc',file.desc);
                        fd.append('_title',file.title);
                        fd.append('_flag','attr');
                    }else if(flag=='menu'){
                        fd.append('_desc',file.desc);
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

        //�ļ�ѡ��ؼ�ѡ��
        if (this.fileInput) {
            this.fileInput.addEventListener("change", function(e) { self.funGetFiles(e); }, false);
        }

        //�ϴ���ť�ύ
        if (this.menuButton) {
            this.menuButton.addEventListener("click", function(e) { self.funUploadMenu(e); }, false);
        }
    }
};
