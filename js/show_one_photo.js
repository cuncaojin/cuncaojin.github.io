// 根据result_page.html中修改
//文档宽高
var w = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
var h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
////当前请求的url的参数部分
//var para = decodeURI(String(window.location.search));
////根据参数部分和参数名来获取参数值  
//function getQueryString(paraPart, name) {
//	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
//	var r = paraPart.substr(1).match(reg);
//	if(r != null) return unescape(r[2]);
//	return null;
//}
//var imageUrl = getQueryString(para, "src");

function showPhoto(imageUrl) {

	// 为了获取图片的真实尺寸
	var image = new Image();
	image.src = imageUrl;
	image.onload = function() {
		// 	console.log(image.width + "-----" + image.height)
		var resultWidth, resultHeight, ratio;

		// 缩放方案
		if(image.width / image.height > w / h) {
			resultWidth = w;
			ratio = image.width / w;
			resultHeight = parseInt(image.height / ratio);
			$("#imgDiv").css({
				width: resultWidth,
				height: resultHeight,
				background: "url(" + imageUrl + ") no-repeat center center",
				backgroundSize: resultWidth + "px " + "auto",
			});
		} else {
			resultHeight = h;
			ratio = image.height / h;
			resultWidth = parseInt(image.width / ratio);
			// 	console.log(resultHeight + "--" + resultWidth)
			$("#imgDiv").css({
				width: resultWidth,
				height: resultHeight,
				background: "url(" + imageUrl + ") no-repeat center center",
				backgroundSize: resultWidth + "px auto",
			});
		}
		// 	console.log("image.width " + image.width + "   image.height " + image.height + "   w:" + w + "   h:" + h)

		//重点！！！水平垂直居中
		$("#imgDiv").css("margin-top", (h - parseInt($("#imgDiv").css("height"))) / 2 + "px");
		$("#imgDiv").css("margin-left", (w - parseInt($("#imgDiv").css("width"))) / 2 + "px");

		$("#loading").css("display", "none");
	}
}
// 		loadImage(
// 			imageUrl,
// 			function(img) {
// 				if(img.type === "error") {
// 					console.log("Error loading image " + imageUrl);
// 				} else {
// 					document.body.appendChild(img);
// 					//重点！！！水平垂直居中
// 					$(img).css("margin-top",(h-$(img).prop("height"))/2+"px");
// 					$(img).css("margin-left",(w-$(img).prop("width"))/2+"px")
// 				}
// 			}, {
// 				maxWidth: w,
// 				maxHeight: h,
// 				minWidth: 400,
// 				minHeight: 200,
// 				canvas: true,
// 			}
// 		);
//
//onresize = function() {
//	window.location.reload();
//}