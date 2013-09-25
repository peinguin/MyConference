define({
	getErrorArray: function(jqXHR){
    	var data = JSON.parse(jqXHR.responseText);
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

    getErrorStringInHtml: function(jqXHR){
    	var arr = this.getErrorArray(jqXHR);

    	return _.map(arr, function(x){return '<span>' + x + ' </span>'}).join('');
    },

    getErrorStringInText: function(jqXHR){
    	var arr = this.getErrorArray(jqXHR);
    	return arr.join("\n");
    }
});