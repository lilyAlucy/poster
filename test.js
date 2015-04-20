var myScroll,
	pullDownEl, pullDownOffset,
	pullUpEl, pullUpOffset,
	flag = true,
	generatedCount = 2;//当前页

function ajax(cb) {//刷新获取更多数据
	var tmpl = "";
	$.ajax({
		type: "get",
		url: "data.txt",
		data: {currentPage: generatedCount, prePage: 10},
		dataType: "text",
		success: function(m) {
			var max = 3;
			m = JSON.parse(m);
			for(var i in m) {
			tmpl +=	'<div class="row">'
			+		'<h2 class="clearfix"><span>' + m[i].gw + '</span><i class="arrow"></i></h2>'
			+		'<div class="item clearfix">'
			+			'<span>入职日期：'+ m[i].date + '</span>'
			+			'<span>地点：' + m[i].workplace + '</span>'
			+			'<span>人数：' + m[i].num + '</span>'
			+		'</div>'
			+		'<div class="detail">'
			+			'<p>'
			+				'<span>部门：</span>' + m[i].bm
			+			'</p>'
			+			'<p>'
			+				'<span>岗位职责：</span><br />' + m[i].workDetail
			+			'</p>'
			+			'<p>'
			+				'<span>适配岗位：</span><br />' + m[i].other
			+			'</p>'
			+		'</div>'
			+	'</div>';
			};

			if(cb && typeof cb === "function") cb(tmpl, max);

		},
		error: function(m) {
			alert('数据加载失败');
		}
	});

}

function pullDownAction () {
	window.location.reload();
}

function pullUpAction () {

	if(flag) {
		ajax(function(m, total) {
			$('#list').append(m);

			if(generatedCount == total) {//如果当前页是最后一页，则隐藏加载更多，不再发起请求
				$('#pullUp').hide();
				flag = false;
			}
			generatedCount++;

			myScroll.refresh();		// Remember to refresh when contents are loaded (ie: on ajax completion)
		});
		
	}

}

function loaded() {
	pullDownEl = document.getElementById('pullDown');
	pullDownOffset = pullDownEl.offsetHeight;
	pullUpEl = document.getElementById('pullUp');	
	pullUpOffset = pullUpEl.offsetHeight;
	
	myScroll = new iScroll('wrapper', {
		useTransition: true,
		topOffset: pullDownOffset,
		onRefresh: function () {
			if (pullDownEl.className.match('loading')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
			} else if (pullUpEl.className.match('loading')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
			}
		},
		onScrollMove: function () {
                if (this.y > 5 && !pullDownEl.className.match('flip')) {
                        pullDownEl.className = 'flip';
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = '松开来加载上一页数据';
                        this.minScrollY = 0;
                } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                        pullDownEl.className = '';
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉获取上一页数据';
                        this.minScrollY = -pullDownOffset;
                } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                        pullUpEl.className = 'flip';
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = '松开来加载下一页数据';
                        this.maxScrollY = this.maxScrollY;
                } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                        pullUpEl.className = '';
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载下一页数据';
                        this.maxScrollY = pullUpOffset;
                }
        },
		onScrollEnd: function () {
			if (pullDownEl.className.match('flip')) {
				pullDownEl.className = 'loading';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';				
				pullDownAction();	// Execute custom function (ajax call?)
			} else if (pullUpEl.className.match('flip')) {
				pullUpEl.className = 'loading';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';				
				pullUpAction();	// Execute custom function (ajax call?)
			}
		}
	});
	
	setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);

$('#list').on('tap', '.row', function() {
	if(!$(this).hasClass('on')) {
		$(this).addClass('on').find('.detail').slideDown(200);
	}
	else {
		$(this).removeClass('on').find('.detail').slideUp(200);
	}
});