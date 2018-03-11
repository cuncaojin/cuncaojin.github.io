var time = 0;
var direction = true;
var pn = "18811716119";

$(function() {
	runId = setInterval(run, (time * 20) + 200);
});

function run() {

	if(!direction) {
		// clearInterval(runId);
		console.log(pn);
		$("#phoneNumber").text(pn.substring(0, ((--time - 1) % pn.length + 1)));
	} else {
		$("#phoneNumber").text(pn.substring(0, (time++ % pn.length + 1)));
	}

	if((pn == $("#phoneNumber").text()) || ("" == $("#phoneNumber").text())) {
		direction = !direction;
		console.log(direction + "---");
		if(direction) {
			$("#phoneNumber").removeClass("animated tada");
		} else {
			$("#phoneNumber").addClass("animated tada");
			clearInterval(runId);
		}
	}
}

$("#photo").addClass("animated bounceIn")
$("#phoneNumber").addClass("animated rubberBand")

function copyArticle(event) {
	const range = document.createRange();
	range.selectNode(document.getElementById('phoneNumber'));

	const selection = window.getSelection();
	if(selection.rangeCount > 0) selection.removeAllRanges();
	selection.addRange(range);
	document.execCommand('copy');
	// 屏蔽选择
	selection.removeAllRanges();

	/* 不再添加弹窗及其动画
	$('#alert').addClass("animated flip").show().html("<p class='alert'>手机号码已拷贝</p>");
	setTimeout(function() {
		// $('#alert').removeClass().hide()
		$("#alert").addClass("zoomOutDown").removeClass("flip");
	}, 2000);*/
}
$("#phoneNumber").click(function() {
	copyArticle();
	$(this).prop("href", "tel:18811716119");
})
// document.getElementById('phoneNumber').addEventListener('click', copyArticle, false);