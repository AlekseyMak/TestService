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