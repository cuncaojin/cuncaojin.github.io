$(function() {
	$(".tagBall").css({
		top: parseInt($("canvas").first().css("top")) - parseInt($(".tagBall").first().css("height")) / 2 + "px"
	});

	$(".tagBall .tag").click(function() {
		var src = $(this).children("img").first().prop("src");
//		alert("void(0) === src"+(void(0) === src))
		//获得undefined void(0)，保证它没有被重新赋值
		if(void(0) === src) {
//			$(".tagBall").hide();
//			setTimeout(function() {
//				$(".tagBall").show()
//			}, 10 * 1000);
			return;
		}

		if(src.indexOf("map.png") != -1) {
			// $(this).prop("href", "gaode_map.html");
//			$("#page1,#page2").hide();
//			$("#page3").show();
		} else {
			//	src = $(this).children("embed").first().prop("src").replace("400x400/400x400_", "");
			src = src.replace("png/", "").replace("png", "jpg")
//			console.log(src + "=============")
			//			$(this).prop("href", $(this).prop("href") + "?src=" + encodeURI(src))
//			$("#page1,#page3").hide();
//			$("#page2").show();
			showPhoto(src);
		}

		//		location.href="index.html?"
		//		$.get("result_page.html", {
		//			src: encodeURI(newSrc)
		//		});
	});
});

var tagEle = "querySelectorAll" in document ? document.querySelectorAll(".tag") : getClass("tag"),
	paper = "querySelectorAll" in document ? document.querySelector(".tagBall") : getClass("tagBall")[0],
	RADIUS = 120,
	fallLength = 600,
	tags = [],
	angleX = Math.PI / fallLength,
	angleY = Math.PI / fallLength,
	CX = paper.offsetWidth / 2,
	CY = paper.offsetHeight / 2,
	EX = paper.offsetLeft + document.body.scrollLeft + document.documentElement.scrollLeft,
	EY = paper.offsetTop + document.body.scrollTop + document.documentElement.scrollTop;

//var X = RADIUS *4;

function getClass(className) {
	var ele = document.getElementsByTagName("*");
	var classEle = [];
	for(var i = 0; i < ele.length; i++) {
		var cn = ele[i].className;
		if(cn === className) {
			classEle.push(ele[i]);
		}
	}
	return classEle;
}

function init3D() {
	for(var i = 0; i < tagEle.length; i++) {
		var a, b;
		var k = -1 + (2 * (i + 1) - 1) / tagEle.length;
		var a = Math.acos(k);
		var b = a * Math.sqrt(tagEle.length * Math.PI);
		var x = RADIUS * Math.sin(a) * Math.cos(b);
		var y = RADIUS * Math.sin(a) * Math.sin(b);
		var z = RADIUS * Math.cos(a);
		var t = new tag(tagEle[i], x, y, z);
		tagEle[i].style.color = "rgb(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + ")";
		tags.push(t);
		t.move();
	}
}

//Array.prototype.forEach = function(callback) {
//	for(var i = 0; i < this.length; i++) {
//		console.log(this==tags)
//		callback.call(this[i]);
//	}
//}

function animate3D() {
	rotateX();
	rotateY();
	//	tags.forEach(function() {
	//		this.move();
	//	});

	for(var i = 0; i < tags.length; i++) {
		tags[i].move();
	}

	requestAnimationFrame(animate3D);
}

if("addEventListener" in window) {
	paper.addEventListener("mousemove", function(event) {
		var x = event.clientX - EX - CX;
		var y = event.clientY - EY - CY;
		angleY = x * 0.0001;
		angleX = y * 0.0001;
	});
} else {
	paper.attachEvent("onmousemove", function(event) {
		var x = event.clientX - EX - CX;
		var y = event.clientY - EY - CY;
		angleY = x * 0.0001;
		angleX = y * 0.0001;
	});
}

function rotateX() {
	var cos = Math.cos(angleX);
	var sin = Math.sin(angleX);
	//	tags.forEach(function() {
	//		var y1 = this.y * cos - this.z * sin;
	//		var z1 = this.z * cos + this.y * sin;
	//		this.y = y1;
	//		this.z = z1;
	//	})

	for(var i = 0; i < tags.length; i++) {
		var y1 = tags[i].y * cos - tags[i].z * sin;
		var z1 = tags[i].z * cos + tags[i].y * sin;
		tags[i].y = y1;
		//		console.log(tags[i].y + "---|||  " + tags[i].z + "----   " + z1)
		tags[i].z = z1;
	}
}

function rotateY() {
	var cos = Math.cos(angleY);
	var sin = Math.sin(angleY);
	//	tags.forEach(function() {
	//		var x1 = this.x * cos - this.z * sin;
	//		var z1 = this.z * cos + this.x * sin;
	//		this.x = x1;
	//		this.z = z1;
	//	})

	for(var i = 0; i < tags.length; i++) {
		var x1 = tags[i].x * cos - tags[i].z * sin;
		var z1 = tags[i].z * cos + tags[i].x * sin;
		tags[i].x = x1;
		tags[i].z = z1;
	}
}

var tag = function(ele, x, y, z) {
	this.ele = ele;
	this.x = x;
	this.y = y;
	this.z = z;
}

tag.prototype = {
	move: function() {
		//		var scale = fallLength / (fallLength - this.z);
		var scale = Math.abs(this.z + RADIUS) / 2.5 / RADIUS;
		var alpha = (this.z + RADIUS) / (2 * RADIUS);
		var left = this.x + CX - this.ele.offsetWidth / 2 + "px";
		var top = this.y + CY - this.ele.offsetHeight / 2 + "px";
		var transform = 'translate(' + left + ', ' + top + ') scale(' + 1 + ')';
		this.ele.style.opacity = alpha + 0.5;
		//		console.log("===========" + scale + "==============")
		this.ele.style.zIndex = parseInt(scale * 100);
		this.ele.style.transform = transform;
		this.ele.style.webkitTransform = transform;
	}
}
init3D();
animate3D();