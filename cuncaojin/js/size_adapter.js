//用img将div填充满，裁剪
function(img, w, h) {
	var destWidth, destHeight;

	//文档宽高
	//	var w = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
	//	var h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

	var iw = img.style.width;
	var ih = img.style.height;

	if(iw / ih < w / h) {
		var ratio = w / iw;
		destWidth = ratio*
	}
	img.style.width = destWidth;
	img.style.height = destHeight;
}