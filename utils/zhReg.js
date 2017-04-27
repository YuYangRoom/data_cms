exports.getzhReg = function(str){
	var flag=0;
	for(var i=0;i<str.length;i++){
		if(/^[\u4e00-\u9fa5]*$/.test(str[i]))
		{
			flag+=1;
		}
	}
	var checkflag=flag/str.length;

	return checkflag;
}   
