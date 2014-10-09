function wlCommonInit(){	
}

var curTask = 0;

function setTaskStatus(statusid){
	var invocationData = {
			adapter: "german_test", 
			procedure: "setTaskStatus",
			parameters: [curTask, statusid]
	};
	
	WL.Client.invokeProcedure(invocationData, {
		onSuccess: taskupdateOK, 
		onFailure: taskupdateFAIL
	});
}

function taskupdateOK(data) {
	getTasks(false);
}

function taskupdateFAIL(data) {
	console.error(data);
}

function addEmployee(id, name){
	var invocationData = {
			adapter: "german_test", 
			procedure: "addEmployee",
			parameters: [id, name]
	};
	
	WL.Client.invokeProcedure(invocationData, {
		onSuccess: addEmployeeSuccess, 
		onFailure: addEmployeeFailure
	});
}

function loadFeedsPage() {
	WL.App.overrideBackButton (function(){WL.App.close();});
	$.mobile.changePage("index.html", {prefetch:"true"});	
}

function getTasks(onlyActive){
	var invocationData = {
			adapter: "german_test", 
			procedure: "getTasks",
			parameters: [onlyActive]
	};
	
	loadFeedsPage();
	
	WL.Client.invokeProcedure(invocationData, {
		onSuccess: getTasksSuccess, 
		onFailure: getTasksFailure
	});
}

function addEmployeeSuccess(data){
	console.log(data);
	$("#ResultDiv").html("Add result: " + "succes");
}

function addEmployeeFailure(data){
	console.error(data);
}

function getTasksSuccess(data){
	var result = data.invocationResult;
    var dataset = result.Response.Dataset.R;

    var rows = [];
    
    if( Object.prototype.toString.call( dataset ) != '[object Array]' ) {
    	var tmp = dataset;
    	dataset = [];
    	dataset[0] = tmp;
    }
  
    for (var i = 0; i < dataset.length; i++){
    	rows[i] = {
    		id: dataset[i].F[0],
    		fio: dataset[i].F[1],
    		subjectName: dataset[i].F[2],
    		subjectAddress: dataset[i].F[3],
    		status: dataset[i].F[4],
    		description: dataset[i].F[5]
    	};
    }
       
    $("#FeedsList").empty();
	// Create the list items
	for (var i=0; i < rows.length; i++){
		var dataItem = rows[i];
//		console.log(dataItem);
		var listItem = $("<li class='FeedItem' id='" + i + "'><h3>" 
				+ "Заявка №" + dataItem.id + ", Статус: " + dataItem.status + "</h3><p>"
				+ dataItem.description + "</p></li>");
		$("#FeedsList").append(listItem);
	}
	// Attach a 'click' event handler to each item in the list
	$(".FeedItem").bind("click", function(){
		displayFeed(rows, $(this).attr("id"));
	});
		
	$("#FeedsList").listview('refresh');
	$.mobile.loading('hide');
}

function displayFeed(rows, rowid){
	WL.App.resetBackButton();
	var item = rows[rowid];
	curTask = item.id;
	$(document).on('pageinit',$('#task_page'), function(event) {
		var info = "Номер заявки: " + item.id + "</br>" +
			"Исполнитель: " + item.fio + "</br>" +
			"Описание: " + item.description + "</br>" +
			"Объект: " + item.subjectName + "/" + item.subjectAddress + "</br>" +
			"<b>Статус: " + item.status;
			
	    $("#content").html(info);
	   
	});
	$.mobile.changePage("task_page.html", {prefetch:"true"});
}

function addTableClickListener() {
    var table = document.getElementById("tasklist");
    var rows = table.rows; // or table.getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
        rows[i].onclick = (function() {
            var cnt = i; 
            return function() {
              //alert("row"+cnt+" data="+this.cells[0].innerHTML);
            	
            }    
        })(i);
    }
}

function getTasksFailure(data){
	console.error(data);
}
