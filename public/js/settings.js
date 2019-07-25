var settings={setName:function(e){localStorage["user-name"]=e},getName:function(){return localStorage["user-name"]||"Anonymous"},set:function(e,t){localStorage[e]=t},get:function(e){return"true"==localStorage[e]},setChatBoxMessageLimit:function(e){localStorage["message-limit"]=e},getChatBoxMessageLimit:function(){return localStorage["message-limit"]||10}};
// var settings = (function(){
// 	return {
// 		setName:function(value){
// 			localStorage["user-name"] = value;
// 		},
// 		getName:function(){
// 			return localStorage["user-name"] || "Anonymous";
// 		},
// 		set:function(key,value){
// 			localStorage[key] = value;
// 		},
// 		get:function(key){
// 			if (localStorage[key]=="true") return true;
// 			return false;
// 		},
// 		setChatBoxMessageLimit:function(value){
// 			localStorage["message-limit"] = value;
// 		},
// 		getChatBoxMessageLimit:function(){
// 			return localStorage["message-limit"] || 10;
// 		}
// 	};
// })();
