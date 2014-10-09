
var request = '<request><stored-procedure>select TOP 100 * from PROPERTY_TEMPLATES</stored-procedure><provider>DATAPOWER</provider><service>finik2-new</service></request>';


function getStories() {
    var input = {
        method : 'post',
        returnedContentType : 'xml',
        path : '/syncserver/proxy/online.sql',
        body : {
            content: request.toString(),
            contentType: 'text/xml; charset=utf-8'
        }
    };
    
    // Get backend response
    var response = WL.Server.invokeHttp(input);
    WL.Logger.info("Backend response :: ")
    WL.Logger.info(response);
    
    if (response.Response){
    	response = response.Response;
    } else {
    	throw "Failed to parse backend response";
    }
    
    var fields = response.Metadata.Field;
    var dataset = response.Dataset.R;
    
    // Convert to client-convenient format
    var result = [];
    for (var i=0; i<fields.length; i++){
    	result[i] = {
    		name: fields[i].Name,
    		type: fields[i].Type,
    		value: dataset[i].F[3] 
    	};
    }
    
    return {
    	fields: result
    };
    
}


