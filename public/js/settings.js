var settings = (function(){
	return {
		setName:function(value){
			localStorage["user-name"] = value;
		},
		getName:function(){
			return localStorage["user-name"] || "Anonymous";
		},
		set:function(key,value){
			localStorage[key] = value;
		},
		get:function(key){
			if (localStorage[key]=="true") return true;
			return false;
		},
		setChatBoxMessageLimit:function(value){
			localStorage["message-limit"] = value;
		},
		getChatBoxMessageLimit:function(){
			return localStorage["message-limit"] || 10;
		}
	};
})();
