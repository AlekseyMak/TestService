/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/**
 *  WL.Server.invokeHttp(parameters) accepts the following json object as an argument:
 *  
 *  {
 *  	// Mandatory 
 *  	method : 'get' , 'post', 'delete' , 'put' or 'head' 
 *  	path: value,
 *  	
 *  	// Optional 
 *  	returnedContentType: any known mime-type or one of "json", "css", "csv", "javascript", "plain", "xml", "html"  
 *  	returnedContentEncoding : 'encoding', 
 *  	parameters: {name1: value1, ... }, 
 *  	headers: {name1: value1, ... }, 
 *  	cookies: {name1: value1, ... }, 
 *  	body: { 
 *  		contentType: 'text/xml; charset=utf-8' or similar value, 
 *  		content: stringValue 
 *  	}, 
 *  	transformation: { 
 *  		type: 'default', or 'xslFile', 
 *  		xslFile: fileName 
 *  	} 
 *  } 
 */

function getTasks(onlyActive) {
	var getTasksQuery = "SELECT t.ID, e.FIO, su.Name, su.Address, st.Name, t.Description  " +
	"FROM Tasks t " +
	"left outer join Employees e on e.ID = t.AssigneeID " +
	"left outer join Subjects su on su.ID = t.SubjectID " +
	"left outer join Statuses st on st.ID = t.StatusID";
	
	if (onlyActive) {
		getTasksQuery = getTasksQuery.concat(" where t.StatusID = 2"); 
	}
	
	return sendQuery(getTasksQuery);
}

function sendQuery(query) {
	 var req = '<request><stored-procedure>' + query +
	 	'</stored-procedure><provider>DISPATCHER</provider>' +
	 	'<alpha-db-host>db-connect1</alpha-db-host></request>';
	 
     WL.Logger.info("Sending query :: ")
     WL.Logger.info(req.toString());     
	 var input = {
		        method : 'post',
		        returnedContentType : 'xml',
		        path : '/proxyserver/proxy/online.sql',
		        body : {
		            content: req.toString(),
		            contentType: 'text/xml; charset=utf-8'
		        }
		    };	
	 
	 var response = WL.Server.invokeHttp(input);
     WL.Logger.info("Backend response from sendQuery :: ")
     WL.Logger.info(response);
	 return response;
}

function setTaskStatus(taskid, status) {
	var updQuery = 'UPDATE Tasks SET StatusID=' + status + ' where ID=' + taskid;
	return sendQuery(updQuery);
}


