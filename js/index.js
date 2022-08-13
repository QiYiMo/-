// 缓存
const storage = {
    set(key, value) {
        value = {
            date: +new Date,
            data: value
        };
        localStorage.setItem(key, JSON.stringify(value));
    },
    get(key, time = 60 * 1000 * 1000) {
        let value = localStorage.getItem(key, time);

        if (!value) return null;
        let { date, data } = JSON.parse(value);
        if (+ new Date - date > time) {
            this.remove(key);
            return null;
        };

        return data;
    },
    remove(key) {
        localStorage.removeItem(key);
    },
};

// 获取数据
const getData = function getData() {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', './json/index.json');
        xhr.onreadystatechange = function () {
            let { status, readyState, responseText } = xhr;
            if (status === 200 && readyState === 4) {
                resolve(JSON.parse(responseText));
            }
        };
        xhr.send();
    });
}

// 元素样式查询
const comput = function comput(ele, attr) {
    return parseFloat(window.getComputedStyle(ele)[attr]);
};

// 登录和账号密码的事件
(function () {
    let [loginImg, loginCode] = Array.from(document.getElementsByClassName('loginWrap')),
        nav = document.querySelector('nav'),
        userBtn = nav.querySelector('.user a'),
        userinfoBtn = document.querySelector('.userinfo input');


    // 账号密码登录
    loginCode.addEventListener("click", function (e) {
        let { target } = e,
            name = target.className;
        // 关闭
        if (name === 'close') {
            this.style.display = 'none';
            return;
        };

        if (target.className === 'code') {
            loginImg.style.display = 'block';
            this.style.display = 'none';
        }

    });
    // 登录
    loginImg.addEventListener("click", function (e) {
        let { target } = e,
            name = target.className;
        // 关闭
        if (name === 'close') {
            this.style.display = 'none';
            return;
        }

        if (name === 'btnOther') {
            loginCode.style.display = 'block';
            this.style.display = 'none';
        }
    });

    // 点击登录
    userBtn.addEventListener('click', function () {
        loginImg.style.display = 'block';
    });

    userinfoBtn.addEventListener('click', function () {
        loginImg.style.display = 'block';
    });

})();

// 轮播图
(function () {
    const scrollCon = document.querySelector('.scrollCon'),
        scrollList = scrollCon.querySelectorAll('.scroll li'),
        paginationList = scrollCon.querySelectorAll('.pagination span'),
        [leftBtn, rightBtn] = Array.from(scrollCon.querySelectorAll('.moveBtn i'));

    let itemr = null,
        count = 0,
        time = 3000,
        length = scrollList.length;

    // 分页器
    const paginationWrap = function paginationWrap() {
        let mun = count === length ? 0 : count;
        paginationList.forEach((item, index) => {
            if (index === mun) {
                item.className = 'active'
            } else {
                item.className = '';
            }
        });
    }

    // 向左移动
    const scrollLeftWrap = function scrollLeftWrap() {
        if (count === length - 1) {
            count = -1;
        }
        count++;
        scrollList[count].style.transition = 'all 0.3s';
        scrollList.forEach((item, index) => {
            if (index === count) {
                item.className = 'avtion';
                scrollCon.style.backgroundImage = `url(./image/bannerBG${count + 1}.jpg)`;
            } else {
                item.className = '';
            }
        })
        paginationWrap()
    };

    // 向右移动
    const scrollRightWrap = function scrollLeftWrap() {
        if (count === 0) {
            count = length;
        }
        count--;
        scrollList[count].style.transition = 'all 0.3s';
        scrollList.forEach((item, index) => {
            if (index === count) {
                item.className = 'avtion';
                scrollCon.style.backgroundImage = `url(./image/bannerBG${count + 1}.jpg)`;
            } else {
                item.className = '';
            }
        });
        paginationWrap();
    };


    itemr = setInterval(scrollLeftWrap, time);

    // 移入后不移动
    scrollCon.addEventListener('mouseenter', function () {
        clearInterval(itemr);
        itemr = null;
    });

    scrollCon.addEventListener('mouseleave', function () {
        itemr = setInterval(scrollRightWrap, time);
    });

    // 左右点击
    scrollCon.addEventListener('click', function (e) {
        let { target } = e;
        if (target === leftBtn) {
            scrollRightWrap();

        };
        if (target === rightBtn) {
            scrollLeftWrap();
        };
        paginationList.forEach((item, index) => {
            if (item === target) {
                count = index - 1;
                scrollLeftWrap();
            }
        });


    });

    // 出页面时不循环
    document.addEventListener('visibilitychange', function (e) {
        if (document.hidden) {
            clearInterval(itemr);
            itemr = null;
            return;
        }
        if (itemr === null) {
            itemr = setInterval(scrollLeftWrap, time);
        }
    })
})();

// 监听top点击事件
(function () {
    let topCon = document.querySelector('.topCon'),
        html = document.documentElement;
    const displayCon = function displayCon() {
        let top = html.scrollTop;
        if (top > 100) {
            topCon.style.opacity = 1;
        } else {
            topCon.style.opacity = 0;
        }
    };

    topCon.addEventListener("click", function () {
        html.scrollTop = 0;
    })

    window.addEventListener("load", displayCon);
    window.addEventListener("scroll", displayCon);
})();

// 新碟上市的轮播图
(function () {
    const newest = document.querySelector('.newest'),
        content = newest.querySelector('.content'),
        context = content.querySelector('.context'),
        contentList = content.querySelectorAll('ul'),
        [leftBtn, rightBtn] = newest.querySelectorAll('.move');

    let count = 0,
        length = contentList.length,
        width = contentList[0].offsetWidth,
        itemr = null,
        time = 5000;

    // 向右移动
    const scrollRightWrap = function scrollRightWrap() {
        if (count === length - 1) {
            count = 0;
            context.style.transition = `none`;
            context.style.transform = `translateX(-${width * count + 'px'})`;
            content.offsetWidth;
        }
        count++;
        context.style.transition = `transform 1s ease-out 0s`;
        context.style.transform = `translateX(-${width * count + 'px'})`;
    };
    // 向左移动
    const scrollLeftWrap = function scrollLeftWrap() {
        if (count === 0) {
            count = length - 1;
            context.style.transition = `none`;
            context.style.transform = `translateX(-${width * count + 'px'})`;
            content.offsetWidth;
        }
        count--;
        context.style.transition = `transform 1s ease-out 0s`;
        context.style.transform = `translateX(-${width * count + 'px'})`;
    };

    itemr = setInterval(scrollRightWrap, time);

    // 移入后不移动
    newest.addEventListener('mouseenter', function () {
        clearInterval(itemr);
        itemr = null;
    });

    newest.addEventListener('mouseleave', function () {
        itemr = setInterval(scrollRightWrap, time);
    });


    // 左右点击
    newest.addEventListener('click', function (e) {
        let { target } = e;
        if (target === leftBtn) {
            scrollLeftWrap();

        };
        if (target === rightBtn) {
            scrollRightWrap();
        };
    });


    // 出页面时不循环
    document.addEventListener('visibilitychange', function (e) {
        if (document.hidden) {
            clearInterval(itemr);
            itemr = null;
            return;
        }
        if (itemr === null) {
            itemr = setInterval(scrollRightWrap, time);
        }
    })

})();

// 音乐播放器的上滑和下滑操作
(function () {
    const playerCon = document.querySelector('.playerCon'),
        lock = playerCon.querySelector('.lock em');

    let key = storage.get('key') ? storage.get('key') : false;
    // 音乐hover
    const move = function move() {
        this.style.bottom = '0';
    }

    // 锁住和未锁住移入的效果
    const lockWrap = function lockWrap() {
        if (!key) {
            playerCon.style.bottom = '-46px';
            playerCon.addEventListener("mousemove", move);
        } else {
            playerCon.style.bottom = '0px';
            playerCon.removeEventListener("mousemove", move);
        }
    }

    // 锁住
    lock.addEventListener("click", function () {
        if (key) {
            key = false;
            this.className = 'unlock';
        } else {
            key = true;
            this.className = 'lockUp';
        }
        storage.set('key', key);
    });
    playerCon.addEventListener("mouseenter", lockWrap);
    playerCon.addEventListener("mouseleave", lockWrap);
    window.addEventListener('load', lockWrap);
})();

// 计算音乐时间
const timePlay = function timePlay(time) {
    if (time > 10000) {
        time = time / 1000;
    }
    let mm = Math.floor(time / 60),
        ss = Math.floor(time - mm * 60);

    mm = mm < 10 ? '0' + mm : mm;
    ss = ss < 10 ? '0' + ss : ss;
    return mm + ':' + ss;
};

// 歌单渲染
const renderSheet = function renderSheet() {
    let data = storage.get('cache').slice(0, 8);
    const songSheet = document.querySelector('.songSheet'),
        image = songSheet.querySelectorAll('.image img'),
        title = songSheet.querySelectorAll('p a'),
        playBtn = songSheet.querySelectorAll('.play-pause a'),
        playNum = songSheet.querySelectorAll('.play-left span');
    data.forEach((item, index) => {
        let { album, name, url, quantity } = item,
            { picUrl } = album;

        let img = new Image();
        img.src = picUrl;
        img.onload = function () {
            image[index].src = picUrl;
            image[index].style.opacity = 1;
            title[index].innerHTML = name;
            playBtn[index].setAttribute('data-link', url);
            playNum[index].innerHTML = quantity;
        }
    })
}

// 新碟上市渲染
const renderNewest = function renderNewest() {
    let data = storage.get('cache');
    const songWarp = document.querySelector('.songWarp'),
        context = songWarp.querySelector('.context'),
        image = context.querySelectorAll('.disc img'),
        songName = context.querySelectorAll('.songName'),
        star = context.querySelectorAll('.star a'),
        playBtn = context.querySelectorAll('.disc a');
    data = data.concat(data.slice(0, 5));
    data.forEach((item, index) => {
        let { album, artists, name, url } = item,
            { picUrl } = album;

        let img = new Image();
        img.src = picUrl;
        img.onload = function () {
            image[index].src = picUrl;
            image[index].style.opacity = 1;
            songName[index].innerHTML = name;
            playBtn[index].setAttribute('data-link', url);
            star[index].innerHTML = artists[0].name;
        }
    });
}

// 榜单渲染
const renderList = function renderList() {
    let data = storage.get('cache');
    const listWrap = document.querySelector('.listWrap'),
        content = listWrap.querySelector('.content'),
        songName = content.querySelectorAll('.ulList .aClick'),
        playBtn = content.querySelectorAll('.play');
    data = data.concat(data.slice(), data.slice());
    data.forEach((item, index) => {
        let { name, url } = item;
        songName[index].innerHTML = name;
        playBtn[index].setAttribute('data-link', url);
    });
}

// 歌手介绍
const renderSinger = function renderSinger() {
    let data = storage.get('cache').slice(0, 5);
    const singer = document.querySelector('.singer'),
        singerList = singer.querySelector('.singerList'),
        image = singerList.querySelectorAll('.singerList img'),
        title = singerList.querySelectorAll('.brief h5'),
        brief = singerList.querySelectorAll('.brief p');
    data.forEach((item, index) => {
        let { artists: [{ name, src }] } = item;
        let img = new Image();
        img.src = src;
        img.onload = function () {
            image[index].src = src;
            image[index].style.opacity = 1;
            title[index].innerHTML = name;
            brief[index].innerHTML = '唱作歌手'
        }
    });
};

// 热门主播
const renderAnchor = function renderAnchor() {
    let data = storage.get('cache').slice(4,);
    const anchorList = document.querySelector('.anchorList'),
        image = anchorList.querySelectorAll('.photo img'),
        title = anchorList.querySelectorAll('h5 a'),
        brief = anchorList.querySelectorAll('p a');

    data.forEach((item, index) => {
        let { artists: [{ name, src }] } = item;
        let img = new Image();
        img.src = src;
        img.onload = function () {
            image[index].src = src;
            image[index].style.opacity = 1;
            title[index].innerHTML = name;
            brief[index].innerHTML = '网络红人'
        }
    });
};

// 网页初始化
const render = function render() {
    renderSheet();
    renderNewest();
    renderList();
    renderSinger();
    renderAnchor();
}

const audio = document.createElement('audio');
// 渲染音乐播放器
const playerRender = function playerRender() {
    let data = storage.get('playLink');
    if (!data) return;

    const player = document.querySelector('.player'),
        imgBox = player.querySelector('.playImg img'),
        title = player.querySelector('a.title'),
        singer = player.querySelector('a.singer'),
        end = player.querySelector('.end');

    let { album: { name, picUrl }, artists: [artists], duration, url } = data;

    const image = new Image();
    image.src = picUrl;
    image.onload = function () {
        // 渲染数据
        imgBox.src = picUrl;
        imgBox.style.opacity = 1;
        end.innerHTML = timePlay(duration);
        title.innerHTML = name;
        singer.innerHTML = artists.name;
        audio.src = url;
    }
};

// 音量大小
(function () {
    const rulesWrap = document.querySelector('.rulesWrap'),
        volumeBox = rulesWrap.querySelector('.volumeBox'),
        spot = rulesWrap.querySelector('.spot'),
        changeCon = rulesWrap.querySelector('.changeCon'),
        change = rulesWrap.querySelector('.change');

    const move = function move(e) {
        let { clientY } = e;

        let { bottom } = volumeBox.getBoundingClientRect(),
            maxh = changeCon.clientHeight,
            spotB = comput(changeCon, 'bottom');

        let resultY = bottom - clientY;

        resultY = resultY >= maxh ? maxh : (resultY <= spotB ? spotB : resultY);
        change.style.height = resultY + 'px';
        spot.style.bottom = resultY - 5 + 'px';

        audio.volume = (resultY - 10) / (maxh - 10);

    };

    document.addEventListener("mousedown", function (e) {
        let { target } = e;
        if (target !== spot) return;
        document.addEventListener('mousemove', move);
    });

    document.addEventListener("mouseup", function (e) {
        document.removeEventListener('mousemove', move);
    })
})();


// 音乐循环点击事件
(function () {
    const rulesWrap = document.querySelector('.rulesWrap'),
        single = rulesWrap.querySelector('.switch');
    single.addEventListener('click', function () {
        let key = single.getAttribute('data-key');
        audio.loop = true;
        switch (key) {
            case 'loop':
                single.className = key;
                single.setAttribute('data-key', 'random');
                return;
            case 'random':
                single.className = key;
                single.setAttribute('data-key', 'single');
                return;
            case 'single':
                single.className = key;
                single.setAttribute('data-key', 'loop');
                return;
        }
    });
})();

// 播放列表渲染事件
const listRender = function listRender() {
    const data = storage.get('playLink'),
        listSong = document.querySelector('.listBotton .listSong'),
        songName = document.querySelector('.playListWrap .songName');
    let { name, artists, duration } = data,
        str = '',
        nameList;

    str += `
        <li>
            <!-- 播放图标 -->
            <i class="playIcon"></i>
            <!-- 歌名 -->
            <h5 class="name">${name}</h5>
            <div class="btnList">
                <!-- 收藏 -->
                <i class="collection"></i>
                <!-- 分享 -->
                <i class="share"></i>
                <!-- 下载 -->
                <i class="download"></i>
                <!-- 删除 -->
                <i class="close"></i>
            </div>
            `;

    nameList = artists.map(item => {
        let { name } = item;
        return name;
    });

    str += `
    <!-- 歌手 -->
        <div class="singerIcon" title="${nameList.join('/')}">${nameList.join('/')}</div>
        <!-- 时间 -->
        <div class="time">${timePlay(duration)}</div>
        <a href="javascript:;" class="sheet"></a>
    </li>`;
    listSong.innerHTML = str;
    songName.innerHTML = name;

};

// 播放列表渲染
(function () {
    const playList = document.querySelector('.playList a'),
        playListWrap = document.querySelector('.playListWrap');

    document.addEventListener("click", function (e) {
        let { target } = e,
            key = playListWrap.style.display;
        if (target.className === "close") {
            playListWrap.style.display = 'none';
            return;
        }
        if (target !== playList) return;

        if (key === "none") {
            playListWrap.style.display = 'flex';
        } else {
            playListWrap.style.display = 'none';
        }
    });
})()


// 异步任务 
if (!storage.get('cache')) {
    (async () => {
        let data = await getData();
        storage.set('cache', data);
        render();
        playerRender();
        listRender();
    })();
} else {
    render();
    playerRender();
    listRender();
};

// 歌曲播放事件
(function () {
    // 重置进度条
    const reset = function reset() {
        const stripWrap = document.querySelector('.stripWrap'),
            spot = stripWrap.querySelector('.spot'),
            change = stripWrap.querySelector('.change');

        spot.style.transform = 'none';
        change.style.width = '0';

    };

    /* 播放音乐 以及拉动进度条 */
    // 播放音乐DOM
    const player = document.querySelector('.player'),
        [leftbtn, playbtn, rightbtn] = Array.from(player.querySelectorAll('.playButton a')),
        imgBox = player.querySelector('.playImg img');
    const progressBar = player.querySelector('.progressBar'),
        end = progressBar.querySelector('.end'),
        start = progressBar.querySelector('.start');

    // 拉动进度条DOM
    const spot = progressBar.querySelector('.spot'),
        change = progressBar.querySelector('.change'),
        stripWrap = progressBar.querySelector('.stripWrap');

    let itemr = null;

    // 自动推动进度条
    const moveWrap = function moveWrap(duration) {

        let time = audio.currentTime;
        if (!duration) return;
        console.log(audio.ended, duration);

        if (audio.ended) {
            clearInterval(itemr);
            itemr = null;
            // 重置进度条
            reset();
            audio.loop = true;
            audio.currentTime = 0;
            itemr = setInterval(moveWrap, 1000, duration);
        };
        let maxw = stripWrap.clientWidth;
        let munC = +(maxw / (duration / 1000)),
            munS = munC;

        change.style.width = `${munC * time}px`;
        spot.style.transform = `translateX(${munS * time}px)`;
        start.innerHTML = timePlay(audio.currentTime);
    };

    // docuemnt的点击事件
    document.addEventListener('click', function (e) {
        const volumeBox = document.querySelector('.volumeBox');
        let { target } = e,
            name = target.className;
        let { duration } = storage.get('playLink');
        if (!name) return (volumeBox.style.display = 'none');
        if (name !== 'playbtn' && name !== 'suspend' && name !== "volume") return;
        if (!audio.src) return;

        // 播放音乐
        if (target.className === 'playbtn') {
            audio.play();
            target.className = 'suspend';
            // 清空进度条并播放音乐
            itemr = setInterval(moveWrap, 1000, duration);
            return;
        }
        if (target.className === 'suspend') {
            target.className = 'playbtn';
            audio.pause();
            clearInterval(itemr);
            itemr = null;
        }
        // 音量大小
        if (target.className === 'volume') {
            let next = target.nextElementSibling;
            let style = next.style.display;
            if (style === 'none') {
                next.style.display = 'block';
            } else {
                target.key = false;
                next.style.display = 'none';
            }
        }
    });

    // 拖动进度条
    const move = function move(e) {
        let { clientX } = e,
            maxw = stripWrap.offsetWidth,
            scrollX = clientX - stripWrap.offsetLeft;
        let startTime = storage.get('playLink').duration / 1000;
        // 最大的范围
        scrollX = scrollX > maxw ? maxw : (scrollX < 0 ? 0 : scrollX);
        spot.style.transform = `translateX(${scrollX}px)`;
        change.style.width = scrollX + 'px';
        // 当前播放的时间
        startTime = Math.round(scrollX / maxw * startTime);
        audio.currentTime = startTime;
        start.innerHTML = timePlay(startTime);
    };

    document.addEventListener("mousedown", function (e) {
        let { target } = e;
        if (target !== spot) return;
        audio.pause();
        document.addEventListener("mousemove", move);
    });

    document.addEventListener("mouseup", function (e) {
        let { target } = e;
        if (target !== spot) return;
        document.removeEventListener("mousemove", move);
        audio.play();
    });

    // 点击网页上任意一个播放按钮
    document.addEventListener("click", function (e) {
        let { target } = e, link, play, data;
        if (target.className !== "play") return;
        link = target.getAttribute('data-link');
        data = storage.get('cache');
        play = data.find(item => {
            return item.url === link;
        });
        if (audio.src) {
            audio.pause();
            audio.src = '';
            reset();
        }

        if (!play) return;
        storage.set('playLink', play);
        // 刷新内容
        playerRender();
        listRender();
        // 渲染完数据后才能播放音乐
        audio.autoplay = true;
        audio.play();
        playbtn.className = 'suspend';
        itemr = setInterval(moveWrap, 1000, play.duration);
    });
})()


