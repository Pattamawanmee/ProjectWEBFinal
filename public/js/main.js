window.onload = pageLoad;

function getCookie(name){
	var value = "";
	try{
		value = document.cookie.split("; ").find(row => row.startsWith(name)).split('=')[1]
		return value
	}catch(err){
		return false
	} 
}

function pageLoad(){

	var username = document.getElementById("name");

	
    username.innerHTML = getCookie("name") //เปลี่ยนหน้าindexให้ตรงกับที่ล็อคอินเข้ามา
	readPost();
}