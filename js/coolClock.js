onresize = function() {
	window.location.reload()
}
var numData = [
	"1111/1001/1001/1001/1001/1001/1111", //0
	"0001/0001/0001/0001/0001/0001/0001", //1
	"1111/0001/0001/1111/1000/1000/1111", //2
	"1111/0001/0001/1111/0001/0001/1111", //3
	"1001/1001/1001/1111/0001/0001/0001", //4
	"1111/1000/1000/1111/0001/0001/1111", //5
	"1111/1000/1000/1111/1001/1001/1111", //6
	"1111/0001/0001/0001/0001/0001/0001", //7
	"1111/1001/1001/1111/1001/1001/1111", //8
	"1111/1001/1001/1111/0001/0001/1111", //9
	"0000/0000/0010/0000/0010/0000/0000" //:
];

var canvas = document.getElementById("cas"),
	bgcanvas = document.getElementById("bgcas"),
	ctx = canvas.getContext('2d'),
	bgctx = bgcanvas.getContext("2d");

///////////////////////////////////    设置  start   ///////////////////////////////////
// 时分秒数字颜色
var HOUR_COLOR = "#279548";
var MINUTE_COLOR = "#D65050";
var SECOND_COLOR = "#797C17";
var BACKGROUND_COLOR ="#444444";
//var BACKGROUND_COLOR ="FFF";

// 重力加速度
var Gravity = 9.8;

// 全局比例
var GLOBAL_RATIO = 1;

reInit();

//球行数
var BALL_ROW_NUM = numData[0].split("/").length;
//单个数字字符占球的列数
var BALL_COLUM_NUM_SINGLE_CHAR = numData[0].split("/")[0].length;
//所有哦数字字符占球的列数
var BALL_COLUM_NUM_ALL = BALL_COLUM_NUM_SINGLE_CHAR * 8;

// 时钟相对画布预留宽度
var RESERVE_WIDTH = 100 * 2;
//设置时钟距离画布底部的留白高度
var BOTTOM_SPACE = 0; //有問題，沒有适配画布其他尺寸，0 —— 暂时不用

//时钟画布最小尺寸
var minWidth = RESERVE_WIDTH + BALL_SPACE_X * (BALL_COLUM_NUM_SINGLE_CHAR - 1) * 8 + 7 * NUM_CHAR_SPACE + BALL_COLUM_NUM_ALL * P_radius * 2;
var minHeight = BALL_SPACE_Y * (BALL_ROW_NUM - 1) + P_radius * 2 * BALL_ROW_NUM;

//文档宽高
var width = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
var height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

var ratio1 = 1;
if(width < minWidth) {
	ratio1 = GLOBAL_RATIO = width / minWidth;
	reInit();
	bgcanvas.width = canvas.width = width;
}

if(canvas.height < minHeight) {
	GLOBAL_RATIO = canvas.height / minHeight;
	if(GLOBAL_RATIO < ratio1) {
		reInit();
		bgcanvas.height = canvas.height = minHeight;
		bgcanvas.width = canvas.width = width;
	}
}

function reInit() {
	// yg: 改变了原作者意思，暂时先这样，有时间再优化... 虽然太需要优化了
	BALL_SPACE_X = GLOBAL_RATIO * 10; //yg: x方向球间隙宽度
	BALL_SPACE_Y = GLOBAL_RATIO * 20; //yg: 每一栏上下空白间隔距离！存在bug，如20改为10
	NUM_CHAR_SPACE = GLOBAL_RATIO * 40; //yg：各个时间数字之间的水平空白间隔距离
	// 球半径 
	P_radius = GLOBAL_RATIO * 6;
}

// 定位到页面底部
var t = height - canvas.height;
canvas.style.top = t + "px";
bgcanvas.style.top = t + "px";

///////////////////////////////////    设置   end  ///////////////////////////////////

var Particle = function() {
	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;
	this.color = "";
	this.visible = false;
	this.drop = false;
}
var lastColor;
Particle.prototype = {
	//yg  constructors: Particle,
	paint: function() { //绘制自身
		if(lastColor !== this.color) {
			ctx.fillStyle = lastColor = this.color;
		}
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.fill();
	},
	reset: function(x, y, color) { //重置
		this.x = x;
		this.y = y;
		this.vx = 0;
		this.vy = 0;
		this.color = color;
		this.visible = true;
		this.drop = false;
		this.radius = 0;
	},
	isDrop: function() { //落下
		this.drop = true;
		var vx = Math.random() * 15 + 10
		var vy = -Math.random() * 50 + 10;
		this.vx = Math.random() >= 0.5 ? -vx : vx;
		this.vy = vy;
	},
	update: function(time) { //每一帧的动作
		if(this.drop) {
			this.x += this.vx * time;
			this.y += this.vy * time;

			var vy = this.vy + Gravity * time;

			if(this.y >= canvas.height - P_radius) {
				this.y = canvas.height - P_radius;
				//							console.log(canvas.height + "------3--------P_radius：" + P_radius)
				vy = -vy * 0.8;
			}

			this.vy = vy;

			if(this.x < -P_radius || this.x > canvas.width + P_radius || this.y > canvas.height + P_radius) {
				this.visible = false;
			}
		}

		if(this.radius < P_radius) {
			this.radius += 0.5;
		}
	}
}

window.RAF = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

var timeCount_0 = 0,
	timeCount_1 = 0,
	particles = [];

function initAnimate() {
	for(var i = 0; i < 200; i++) {
		var p = new Particle();
		particles.push(p);
	}

	timeCount_0 = new Date();
	//				timeCount_1 = new Date();

	drawBg();

	setTime(timeCount_0);
	animate();
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	var timeCount_2 = new Date();

	if(timeCount_1 - timeCount_0 >= 1000) {
		setTime(timeCount_1);
		timeCount_0 = timeCount_1;
	}

	// 绘制小球，注意：此时的小球很小！！！
	particles.forEach(function(p) {
		if(p.visible) {
			p.update(16 / 70);
			p.paint();
		}
	});

	timeCount_1 = timeCount_2;
	//
	RAF(animate)
}

//var BALL_SPACE_X = 10;       //圆点间距
//var NUM_CHAR_SPACE = 20;       //各个字母之间的距离
//var BALL_SPACE_Y = 22;       //每一栏上下距离
function drawBg() {
	var tx = (canvas.width - ((P_radius * 2 * 4 + 3 * BALL_SPACE_X) * 8 + 7 * NUM_CHAR_SPACE)) / 2 + P_radius;
	for(var i = 0; i < 8; i++) {
		var ty = (canvas.height - (P_radius * 2 * 7 + BALL_SPACE_Y * 6)) / 2 + P_radius;
		for(var j = 0; j < numData[0].length; j++) {
			var tt = numData[0].charAt(j);
			if(tt === "/") {
				ty += BALL_SPACE_Y + 2 * P_radius - BOTTOM_SPACE / 7;
			} else if(tt == 1 || tt == 0) {
				var x = tx + j % 5 * (P_radius * 2 + BALL_SPACE_X),
					y = ty;
				bgctx.beginPath();
				bgctx.arc(x, y, P_radius, 0, 2 * Math.PI);
				bgctx.fillStyle = BACKGROUND_COLOR;
				bgctx.fill();
			}
		}
		tx += NUM_CHAR_SPACE + 4 * P_radius * 2 + 3 * BALL_SPACE_X;
	}
}

var lastDate;

//yg：设置点的time时的状态
function setTime(time) {
	var h = time.getHours() + "",
		m = time.getMinutes() + "",
		s = time.getSeconds() + "";
	h = h.length === 1 ? "0" + h : h;
	m = m.length === 1 ? "0" + m : m;
	s = s.length === 1 ? "0" + s : s;

	var nowdate = h + ":" + m + ":" + s;

	var color = "";
	var i = 0;

	//        跟上一次的时间进行比较，获取改变的字符点
	if(lastDate) {
		for(var k = 0; k < nowdate.length; k++) {
			if(lastDate.charAt(k) !== nowdate.charAt(k)) {
				i = k;
				break;
			}
		}
	}
	lastDate = nowdate;

	//  var tx = (canvas.width - ((P_radius * 2 + BALL_SPACE_X) * 4 * 8 + 7 * NUM_CHAR_SPACE)) / 2; //计算时间的x轴值
	var tx = (canvas.width - ((P_radius * 2 * 4 + 3 * BALL_SPACE_X) * 8 + 7 * NUM_CHAR_SPACE)) / 2 + P_radius;
	//  var ty = (canvas.height - ((P_radius + BALL_SPACE_Y) * 6)) / 2;  //计算时间的y轴值
	var ty = (canvas.height - (P_radius * 2 * 7 + BALL_SPACE_Y * 6)) / 2 + P_radius;
	//        遍历时间字符
	for(; i < nowdate.length; i++) {
		var charX = tx + i * (NUM_CHAR_SPACE + 4 * P_radius * 2 + 3 * BALL_SPACE_X); //计算该字符的X轴值
		var charY = ty;

		var timeChar = nowdate.charAt(i);
		// 如："1111/1001/1001/1001/1001/1001/1111", //0
		var text = numData[timeChar === ":" ? 10 : +timeChar];

		if(i < 3) {
			//      color = "#279548";
			color = HOUR_COLOR;
		} else if(i < 6) {
			//      color = "#D65050";
			color = MINUTE_COLOR;
		} else {
			//      color = "#797C17";
			color = SECOND_COLOR;
		}

		for(var j = 0; j < text.length; j++) {
			var tt = text.charAt(j);
			if(tt === "/") {
				charY += BALL_SPACE_Y + 2 * P_radius - BOTTOM_SPACE / 7;
			} else {
				var x = charX + j % 5 * (P_radius * 2 + BALL_SPACE_X);
				var y = charY;
				var pp = null;
				var usefullp = null;

				for(var ref = 0; ref < particles.length; ref++) {
					var p = particles[ref];
					if(p.visible && p.x === x && p.y === y) {
						pp = p;
					} else if(!p.visible && !usefullp) {
						usefullp = p;
					}
				}

				if(pp && tt == 0) { //需要落下的
					pp.isDrop();
				} else if(!pp && tt == 1) { //需要添加的
					usefullp.reset(x, y, color);
				}
			}
		}
	}
}

initAnimate()