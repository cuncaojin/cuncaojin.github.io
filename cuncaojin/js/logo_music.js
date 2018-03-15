audiojs.events.ready(function() {
	var as = audiojs.createAll();
});

var audio = document.getElementById('music');
var beforeLogo = document.getElementById("beforeLogo");
var backLogo = document.getElementById("backLogo");

beforeLogo.addEventListener("animationstart", function(e) {
	alert(beforeLogo.style.class)
})

beforeLogo.addEventListener("animationend", function() {})

//当音乐播放完停止时，自动停止图片旋转
audio.addEventListener("ended", function(event) {
	$("#photo").css("animationPlayState", "paused");
}, false);

$("#photo").click(function() {
	play();
})

function play() {
	if(audio !== null) {
		if(audio.paused) {
			audio.play();
			$("#photo").css({
				animationPlayState: "running",
				animation: "rotate 8s linear 2s infinite normal"
			});
		} else {
			audio.pause();
			$("#photo").css({
				animationPlayState: "paused"
			});
		}
	}
}