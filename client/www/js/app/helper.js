define({
    process_errors: function(data,$form){
        var arr = [];

        if(Object.prototype.toString.call( data ) === '[object Object]' ){
            if(data.message)
                arr.push(data.message)
            else{

                var $el = $form.find(i);
                if($el.length > 0){
                    $el.addClass('has-error');
                }

                for(i in data){
                    if(Object.prototype.toString.call( data[i] ) === '[object Array]' ){
                        for(j in data[i]){
                            if(data[i][j].message)
                                arr.push(data[i][j].message)
                            else
                                arr.push(data[i][j])
                        }
                    }else{
                        if(data[i].message)
                            arr.push(data[i].message)
                        else{
                            arr.push(data[i])
                        }
                    }

                    if($el.length > 0){
                        $el.find('.help-block').text(arr.pop()).show();
                    }
                }
            }
        }else{
            arr.push(data)
        }

        return arr;
    },
    getErrorArrayFromData: function(data){
        var arr = [];

        if(Object.prototype.toString.call( data ) === '[object Object]' ){
            if(data.message)
                arr.push(data.message)
            else{
                for(i in data){
                    if(Object.prototype.toString.call( data[i] ) === '[object Array]' ){
                        for(j in data[i]){
                            if(data[i][j].message)
                                arr.push(data[i][j].message)
                            else
                                arr.push(data[i][j])
                        }
                    }else{
                        if(data[i].message)
                            arr.push(data[i].message)
                        else{
                            arr.push(data[i])
                        }
                    }
                }
            }
        }else{
            arr.push(data)
        }

        return arr;
    },
	getErrorArray: function(jqXHR){
    	var data = JSON.parse(jqXHR.responseText);
    	return getErrorArrayFromData(data);
    },

    getErrorStringInHtml: function(jqXHR){
    	var arr = this.getErrorArray(jqXHR);

    	return _.map(arr, function(x){return '<span>' + x + ' </span>'}).join('');
    },

    getErrorStringInText: function(jqXHR){
    	var arr = this.getErrorArray(jqXHR);
    	return arr.join("\n");
    }
});