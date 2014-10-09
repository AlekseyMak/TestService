
/* JavaScript content from js/main.js in folder common */
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

function retrieveData(){
	var invocationData = {
			adapter: "german_test", 
			procedure: "getStories",
			parameters: []
	};
	
	WL.Client.invokeProcedure(invocationData, {
		onSuccess: retrieveDataSuccess, 
		onFailure: retrieveDataFailure
	});
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

function retrieveDataSuccess(data){
	console.log(data);
	$("#ResultDiv").html(data.invocationResult.Response.Result);
}

function retrieveDataFailure(data){
	console.error(data);
}

function addEmployeeSuccess(data){
	console.log(data);
	$("#ResultDiv").html("Add result: " + "succes");
}

function addEmployeeFailure(data){
	console.error(data);
}

function getTasksSuccess(data){
	//console.log(data);
	//$("#ResultDiv").html("GetTasks result: " + "succes");
	
	var result = data.invocationResult;
    var fields = result.Response.Metadata.Field;
    var dataset = result.Response.Dataset.R;
    
    //console.log("DATASET goes here ----");
    //console.log(dataset);
    
    var rows = [];
    
    if( Object.prototype.toString.call( dataset ) != '[object Array]' ) {
    	//console.log("SingleObject");
    	var tmp = dataset;
    	dataset = [];
    	dataset[0] = tmp;
    }
  
    for (var i = 0; i < dataset.length; i++){
        //console.log("dataset[i], i = " + i);
        //console.log(dataset[i]);
        
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

//**************************************
//Display feed
//**************************************
function displayFeed(rows, rowid){
	WL.App.resetBackButton();
	var item = rows[rowid];
	curTask = item.id;
	$(document).on('pageinit',$('#FeedContentPage'), function(event) {
		var info = "Номер заявки: " + item.id + "</br>" +
			"Исполнитель: " + item.fio + "</br>" +
			"Описание: " + item.description + "</br>" +
			"Объект: " + item.subjectName + "/" + item.subjectAddress + "</br>" +
			"<b>Статус: " + item.status;
			
	    $("#FeedContent").html(info);
	    // Resize images to max width of 260px
	    $("#FeedContent").find("img").each(function(){
	    	if ($(this).attr("src").indexOf("jpg")>=0){
	    		$(this).width(260);
	    	}
	    });
	    // add target='_blank' attribute to all the links
	    $("#FeedContent a").attr("target","_blank");
	});
	$.mobile.changePage("FeedContentPage.html", {prefetch:"true"});
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

/* var $table = $("<table id='tasklist' border='1'>");

for (var i=0; i<rows.length; i++){
	var row = rows[i];
	var $tableRow1 = $("<tr>");
	var $cell1 = $("<td>").append("ID заявки: " + row.id);
	var $cell2 = $("<td colspan='2'>").append("Исполнитель: " + row.fio);
	var $tableRow2 = $("<tr>");
	var $cell3 = $("<td>").append("Объект: " + row.subjectName);
	var $cell4 = $("<td>").append("Адрес: " + row.subjectAddress);
	var $cell5 = $("<td>").append("Статус: " + row.status);
	var $blankRow = $("<tr class='blankrow'>");
	var $blankcell = $("<td colspan='3'>").append("");
	$tableRow1.append($cell1).append($cell2);
	$tableRow2.append($cell3).append($cell4).append($cell5);
	$blankRow.append($blankcell);
	$table.append($tableRow1).append($tableRow2).append($blankRow);
}

$("#ResultDiv").html($table);
addTableClickListener();*/
/* JavaScript content from js/main.js in folder android */
// This method is invoked after loading the main HTML and successful initialization of the Worklight runtime.
function wlEnvInit(){
    wlCommonInit();
    // Environment initialization code goes here
    WL.TabBar.init();
    
    WL.TabBar.addItem("active", function(){
    	getActiveList(); 
    	},
    	"Активные",
    	{
    		image: "images/List_normal.png",
    		imageSelected : "images/List.png"
    	}
    );
    
    WL.TabBar.addItem("all", function(){ getAllList(); },"Все",{
    	image: "images/Briefcase_normal.png",
    	imageSelected : "images/Briefcase.png"
    });

    WL.TabBar.addItem("settings", function(){ getSettings(); },"Настройки",{
    	image: "images/Machine_normal.png",
    	imageSelected : "images/Machine.png"
    });
    
    WL.TabBar.setVisible(true);
    
    getActiveList();
    $("#getdata_btn").hide();
    $("#addUser").hide();
    $("#getTasks").hide();
    $("#getActiveTasks").hide();
}

function nofunc() {
	//do nothing;
}

function getActiveList() {
	getTasks(true);
}

function getAllList() {
	getTasks(false);
}

function getSettings() {
	$("#ResultDiv").html("<h1>Settings</h1>");
}