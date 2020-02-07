/**
 *
 */
layui.define(["element", "jquery", "layer", "form"], function (exports) {
    let
        element = layui.element,
        $ = layui.$,
        layer = layui.layer;

    // 判断是否在web容器中打开
    if (!/http(s*):\/\//.test(location.href)) {
        return layer.alert("请先将项目部署至web容器（Apache/Tomcat/Nginx/IIS/等），否则部分数据将无法显示");
    }
    let dimples = new function () {
        /**
         *  系统配置
         * @param name
         * @returns {{BgColorDefault: number, urlSuffixDefault: boolean}|*}
         */
        let config = {
            multileTab: true,
            homeInfo: 'views/console.html',
            menuInfo: 'api/menu.json',
            BgColorDefault: 2,
            menuType: true,
            showFooter: false,
            // 默认的首页 id
            homeId: 1
        };
        this.config = function (name) {
            if (name === undefined || name === 'undefined') {
                return config;
            } else {
                return config[name];
            }
        };
        this.setConfig = function (b) {
            config.multileTab = b;
        };
        this.setConfig = function (name, value) {
            config[name] = value;
        };
        /**
         *  页面初始化
         * @param option 参数
         */
        this.init = function (option) {
            //在所有初始化之前,提前构建主题颜色
            dimples.initBgColor();
            dimples.setConfig("menuType", option.menuType);
            console.log("menuType (菜单模式,true:多系统菜单 false:单系统菜单模式) : " + option.menuType);
            if (option.menuType) {
                dimples.initMenuPlus(option.menuInfo);
            } else {
                dimples.initMenu(option.menuInfo);
            }
            dimples.initHome(option.homeInfo);
            dimples.initTab(option.multileTab);
            dimples.initFooter(option.showFooter);
            let className;
            if (option.tabType === 1) {
                className = "layui-tab-button";
            } else if (option.tabType === 2) {
                className = "layui-tab-topline";
            } else if (option.tabType === 3) {
                className = "layui-tab-circular";
            }
            let layUiTab = $(".layui-tab");
            layUiTab.removeClass("layui-tab-button");
            layUiTab.removeClass("layui-tab-topline");
            layUiTab.removeClass("layui-tab-circular");
            layUiTab.addClass(className);

        };
        /**
         * 侧菜单渲染
         */
        this.initMenu = function (url) {
            $(".modules-pe").html("");
            $(".layui-side #menuEnd").html("");
            $(".layui-header #topMenu").html("");
            let leftHtml = '<ul class="layui-nav layui-nav-tree" id="menu" lay-filter="test">';
            $.ajaxSettings.async = false;
            $.get(url, function (result) {
                $.each(result, function (i, item) {
                    let content = '<li class="layui-nav-item" >';
                    // 判断菜单数类型，0 属于父菜单，可以点击打开 1 属于子菜单，链接页面 （数据库保存为字符串）
                    if (item.type === '0') {
                        content += '<a  href="javascript:void(0)" href="javascript:void(0)"><i class="' + item.icon
                            + '"></i><span>' + item.title + '</span></a>';
                    } else if (item.type === '1') {
                        content += "<a class='site-demo-active' data-url='" + item.href + "' data-id='" + item.id +
                            "' data-title='" + item.title + "' href='javascript:void(0)' href='javascript:void(0)'><i class='"
                            + item.icon + "'></i><span>" + item.title + "</span></a>";
                    }
                    //这里是添加所有的子菜单
                    content += dimples.loadChild(item);
                    content += '</li>';
                    leftHtml += content;

                });
                leftHtml += "</ul>";
                $("#menuEnd").append(leftHtml);
                element.init();
                dimples.initTab(dimples.config('multileTab'));
            });
            $.ajaxSettings.async = true;
        };
        this.initMenuPlus = function (url) {
            let leftHtml = "";
            $(".layui-side #menuEnd").html("");
            $(".layui-header #topMenu").html("");
            $(".layui-header-mini-menu").html("");
            $(".modules-pe").html("");
            $.ajaxSettings.async = false;
            $.get(url, function (result) {
                //每一个菜单
                let leftMenuEnd = '<ul class="layui-nav layui-nav-tree leftMenu" id="leftMenu" lay-filter="test">';

                let headerMobileMenuHtml =
                    ' <li class="layui-nav-item"> <a href="javascript:void(0)"><i class="layui-icon">&#xe656;</i>&nbsp;&nbsp;选择模块</a><dl class="layui-nav-child layui-header-mini-menu">';
                //遍历第一层,既顶部菜单
                $.each(result, function (i, item) {
                    //设置每一个菜单的唯一值
                    leftMenuEnd = '<ul  class="layui-nav layui-nav-tree leftMenu" id="lay-' + item.id + '" lay-filter="test">';

                    headerMobileMenuHtml += '<dd><a href="javascript:void(0)" id="lay-' + item.id + '" data-menu="' + item.id +
                        '"><i class="' + item.icon + '"></i> ' + item.title + '</a></dd>\n';

                    let content = '<li class="layui-nav-item" id="lay-' + item.id + '">';
                    if (item.type === "0") {
                        content += '<a  href="javascript:void(0)" href="javascript:void(0)"><i class="' + item.icon +
                            '"></i>&nbsp;&nbsp;<span>' + item.title + '</span></a>';
                    } else if (item.type === "1") {
                        content += '<a class="site-demo-active" data-url="' + item.href + '" data-id="' + item.id +
                            '" data-title="' + item.title + '" href="javascript:void(0)" href="javascript:void(0)"><i class="' + item.icon +
                            '"></i>&nbsp;&nbsp;<span>' + item.title + '</span></a>';
                    }
                    //这里是添加所有的子菜单
                    /* content+=dimples.loadchild(item); */
                    //遍历基本的左侧菜单
                    $.each(item.children, function (j, item1) {
                        let leftMenu = '<li class="layui-nav-item">';
                        if (item1.type === "0") {
                            leftMenu += '<a  href="javascript:void(0)" href="javascript:void(0)"><i class="' + item1.icon + '"></i><span>' +
                                item1.title + '</span></a>';
                        } else if (item1.type === "1") {
                            leftMenu += '<a class="site-demo-active" data-url="' + item1.href + '" data-id="' + item1.id +
                                '" data-title="' + item1.title + '" href="javascript:void(0)" href="javascript:void(0)"><i class="' + item1.icon +
                                '"></i><span>' + item1.title + '</span></a>';
                        }
                        leftMenu += dimples.loadChild(item1);
                        leftMenu += '</li>';
                        leftMenuEnd += leftMenu;
                    });
                    leftMenuEnd += '</ul>';
                    //将每一个菜单拼接到总的
                    leftHtml += leftMenuEnd;
                    content += '</li>';
                    $("#topMenu").append(content);
                    $("#topMenu li").on("click", (function () {
                        let menuId = $(this).attr("id");
                        let sideLeftMenu = $(".layui-side .leftMenu");
                        let sideMenuId = $(".layui-side #" + menuId);
                        sideLeftMenu.addClass("layui-hide");
                        sideLeftMenu.removeClass("layui-show");
                        sideMenuId.addClass("layui-show");
                        sideMenuId.removeClass("layui-hide");
                    }));
                });
                headerMobileMenuHtml += '</dl></li>';

                $(".modules-pe").append(headerMobileMenuHtml);

                $(".layui-header-mini-menu dd a").on("click", function () {
                    let menuId = $(this).attr("id");
                    let sideLeftMenu = $(".layui-side .leftMenu");
                    let sideMenuId = $(".layui-side #" + menuId);
                    sideLeftMenu.addClass("layui-hide");
                    sideLeftMenu.removeClass("layui-show");
                    sideMenuId.addClass("layui-show");
                    sideMenuId.removeClass("layui-hide");
                    // 移动端切换模块展示左侧菜单
                    if ($(window).width() <= 768) {
                        $('.modules-pe').blur();
                        dimples.showMenu(true);
                    }
                });
                $("#menuEnd").append(leftHtml);
                element.init();
                dimples.initTab(dimples.config('multileTab'));
                $("#topMenu li:first-child").addClass("layui-this");
                $(".layui-side .leftMenu").addClass("layui-hide");
                let menuEnd = $("#menuEnd ul:first-child");
                menuEnd.addClass("layui-show");
                menuEnd.removeClass("layui-hide");

            });
            $.ajaxSettings.async = true;
        };
        this.loadChild = function (obj) {
            if (obj == null) {
                return;
            }

            let content = '';
            if (obj.children != null && obj.children.length > 0) {
                content += '<dl class="layui-nav-child">';
            } else {
                content += '<dl>';
            }

            if (obj.children != null && obj.children.length > 0) {
                $.each(obj.children, function (i, note) {
                    content += '<dd>';

                    if (note.type === "0") {

                        content += '<a  href="javascript:void(0)"><i class="' + note.icon + '"></i><span>' + note.title + '</span></a>';
                    } else if (note.type === "1") {
                        content += '<a class="site-demo-active" data-url="' + note.href + '" data-id="' + note.id +
                            '" data-title="' + note.title + '" data-icon="' + note.icon + '" href="javascript:void(0)"><i class="' + note.icon +
                            '"></i><span>' + note.title + '</span></a>';
                    }
                    if (note.children == null) {
                        return;
                    }
                    content += dimples.loadChild(note);
                    content += '</dd>';
                });

                content += '</dl>';
            }

            return content;
        };
        /**
         * Footer 页脚 渲染
         * @param b 参数
         */
        this.initFooter = function (b) {
            if (!b) {
                $(".dimples-layout").addClass("dimples-hide-footer");
            } else {
                $(".dimples-layout").removeClass("dimples-hide-footer");
            }
        };
        /**
         * 初始化背景色
         */
        this.initBgColor = function () {
            let bgColorId = sessionStorage.getItem('dimplesBgcolorId');
            if (bgColorId === null || bgColorId === undefined || bgColorId === '') {
                bgColorId = dimples.config('BgColorDefault');
            }
            let bgColorData = dimples.bgColorConfig(bgColorId);
            let styleHtml = '.layui-layout-admin .layui-header{background-color:' + bgColorData.headerRight + '!important;}\n' +
                '.layui-header>#topMenu>.layui-nav-item.layui-this,.dimples-tool i:hover{background-color:'
                + bgColorData.headerRightThis + '!important;}\n' +
                '.layui-layout-admin .layui-logo {background-color:' + bgColorData.headerLogo + '!important;}\n' +
                '.layui-side.layui-bg-black,.layui-side .layui-nav,.layui-side.layui-bg-black>.layui-left-menu>ul{background-color:'
                + bgColorData.menuLeft + '!important;}\n' +
                '.layui-left-menu .layui-nav .layui-nav-child a:hover:not(.layui-this) {background-color:'
                + bgColorData.menuLeftHover + ';}\n' +
                '.layui-layout-admin .layui-nav-tree .layui-this, .layui-layout-admin .layui-nav-tree .layui-this>a,' +
                ' .layui-layout-admin .layui-nav-tree .layui-nav-child dd.layui-this,.layui-nav-tree .layui-nav-bar,' +
                '.layui-layout-admin .layui-nav-tree .layui-nav-child dd.layui-this a {\n' + 'background-color: '
                + bgColorData.menuLeftThis + ' !important;}\n .layui-layout-admin .layui-header .layui-nav .layui-nav-item>a{color:'
                + bgColorData.headerColor + '!important;}\n .layui-header .layui-nav-bar,#topMenu .layui-this:after {background-color:'
                + bgColorData.headerHover + '!important;}\n .layui-tab-title .layui-this,.layui-tab-title li:hover{color:'
                + bgColorData.tabThis + '!important;}}';
            $('#dimples-bg-color').html(styleHtml);
        };
        this.initTab = function (b) {
            dimples.setConfig("multileTab", b);
            /**初始化Tab页*/
            if (b) {
                $("#oneTab").hide();
                $("#multileTab").show();
                //当点击有site-demo-active属性的标签时，即左侧菜单栏中内容 ，触发点击事件
                $('.site-demo-active').on('click', function () {
                    let dataId = $(this);
                    let title = dataId.attr("data-title");
                    let url = dataId.attr("data-url");
                    let id = dataId.attr("data-id");
                    //这时会判断右侧.layui-tab-title属性下的有lay-id属性的li的数目，即已经打开的tab项数目
                    let tab = $(".layui-tab-title li[lay-id]");
                    if (tab.length <= 0) {
                        //如果比零小，则直接打开新的tab项
                        dimples.tabAdd(url, id, title);
                    } else {
                        //否则判断该tab项是否以及存在
                        let isData = false; //初始化一个标志，为false说明未打开该tab项 为true则说明已有
                        $.each(tab, function () {
                            //如果点击左侧菜单栏所传入的id 在右侧tab项中的lay-id属性可以找到，则说明该tab项已经打开
                            if ($(this).attr("lay-id") === dataId.attr("data-id")) {
                                isData = true;
                            }
                        });
                        if (isData === false) {
                            //标志为false 新增一个tab项
                            let title = '<i class="' + dataId.attr("data-icon") + '"></i>&nbsp;&nbsp;<span>' + dataId.attr(
                                "data-title") + '</span>';
                            dimples.tabAdd(dataId.attr("data-url"), dataId.attr("data-id"), title);
                        }
                    }
                    //最后不管是否新增tab，最后都转到要打开的选项页面上
                    dimples.tabChange(dataId.attr("data-id"));
                });
                // 绑定下拉菜单事件
                // 下拉菜单中的删除标签页，再删除前先判断是否是编号为1的标签，如果是，则不会删除编号为1 的标签
                // 关闭当前标签页
                $("#closeThisTabs").off("click").on("click", function () {
                    let currentTabId = $(".dimples-layout .layui-body .layui-tab-title .layui-this").attr("lay-id");
                    if (currentTabId !== "1") {
                        dimples.tabDelete(currentTabId);
                    }
                });
                // 关闭其他标签页
                $("#closeOtherTabs").on("click", function () {
                    let currentTabId = $(".dimples-layout .layui-body .layui-tab-title .layui-this").attr("lay-id");
                    let tabTitle = $(".layui-tab-title li");
                    $.each(tabTitle, function () {
                        if ($(this).attr("lay-id") !== currentTabId && $(this).attr("lay-id") !== "1") {
                            dimples.tabDelete($(this).attr("lay-id"))
                        }
                    })
                });
                // 关闭所有标签页
                $("#closeAllTabs").on("click", function () {
                    let tabTitle = $(".layui-tab-title li");
                    $.each(tabTitle, function () {
                        let tabLayId = $(this).attr("lay-id");
                        if (tabLayId !== "1") {
                            dimples.tabDelete(tabLayId)
                        }
                    })
                });

                $("#leftPage").on("click", function () {
                    dimples.leftPage();
                });

                $("#rightPage").on("click", function () {
                    dimples.rightPage();
                });
                dimples.initHome(dimples.config('homeInfo'));
            } else {
                //标签页菜单单击监听
                $('.site-demo-active').on('click', function () {
                    let loading = layer.load();
                    let url = $(this).attr("data-url");
                    $("#oneTab-title").html("<i class='layui-icon layui-icon-console'></i>&nbsp;&nbsp;<span>" + $(this).attr(
                        "data-title") + "</span>");
                    $("#mainFrame").attr("src", url);
                    layer.close(loading);
                });
                $("#oneTab").show();
                $("#multileTab").hide();
                dimples.initHome(dimples.config('homeInfo'));
            }
        };
        this.initHome = function (url) {
            //初始化首页信息
            if (dimples.config('multileTab')) {
                //清空tab信息来初始化首页
                $(".dimples-layout .layui-body .layui-tab-title").html("");
                $(".dimples-layout .layui-body .layui-tab-content").html("");
                dimples.tabAdd(url, config.homeId, "<i class='layui-icon layui-icon-home'></i>");
                dimples.tabChange(config.homeId);
            } else {
                $("#mainFrame").attr("src", url);
            }
        };
        this.tabAdd = function (url, id, name) {
            let loading;
            //查询该编号是否存在,如果存在进行相应替换
            if (id !== "1") {
                loading = layer.load();
            }
            element.tabAdd('mainFrame', {
                title: name,
                content: '<iframe data-frameid="' + id +
                    '" frameborder="no" border="0" marginwidth="0" marginheight="0" style="width: 100%;height: 100%;" src="' +
                    url + '" ></iframe>',
                id: id
            });
            element.render('tab');
            layer.close(loading);
        };
        this.tabChange = function (id) {
            //切换到指定Tab项
            element.tabChange('mainFrame', id); //根据传入的id传入到指定的tab项
        };
        // 删除tab标签页
        this.tabDelete = function (id) {
            element.tabDelete("mainFrame", id); //删除
        };
        // tab 标签页的滑动
        this.rollPage = function (d) {
            let $tabTitle = $('.layui-body .layui-tab .layui-tab-title');
            let left = $tabTitle.scrollLeft();
            console.log("left: " + left);
            if ('left' === d) {
                $tabTitle.animate({
                    scrollLeft: left - 450
                }, 400);
            } else if ('auto' === d) {
                let autoLeft = 0;
                $tabTitle.children("li").each(function () {
                    if ($(this).hasClass('layui-this')) {
                        return false;
                    } else {
                        autoLeft += $(this).outerWidth();
                    }
                });
                $tabTitle.animate({
                    scrollLeft: left - 47
                }, 400);
            } else {
                $tabTitle.animate({
                    scrollLeft: left + 450
                }, 400);
            }
        };
        // 左滑动tab
        this.leftPage = function () {
            dimples.rollPage("left");
        };
        // 右滑动tab
        this.rightPage = function () {
            dimples.rollPage();
        };
        /**
         * 配色方案配置项(默认选中第一个方案)
         * @param bgColorId 背景id
         */
        this.bgColorConfig = function (bgColorId) {
            let bgColorConfig = [{
                headerRight: '#1aa094', //头部背景色
                headerRightThis: '#197971', //头部选中色
                headerLogo: '#20222A', //图标背景色
                menuLeft: '#20222A', //左侧菜单背景
                menuLeftThis: '#1aa094', //左侧菜单选中色
                menuLeftHover: '#3b3f4b', //左侧菜单焦点色
                headerColor: 'white', //头部背景色
                headerHover: 'white', //头部焦点色
                tabThis: '#1aa094', //选项卡选中色
            },
                {
                    headerRight: '#AA3130',
                    headerRightThis: '',
                    headerLogo: '#28333E',
                    menuLeft: '#28333E',
                    menuLeftThis: '#AA3130',
                    menuLeftHover: '#3b3f4b',
                    headerColor: 'white',
                    headerHover: 'white',
                    tabThis: 'black',
                },
                {
                    headerRight: 'white',
                    headerRightThis: '',
                    headerLogo: '#344058',
                    menuLeft: '#344058',
                    menuLeftThis: '#1890ff',
                    menuLeftHover: '#1f1f1f',
                    headerColor: 'black',
                    headerHover: 'black',
                    tabThis: '#409EFF',
                },
                {
                    headerRight: '#409EFF',
                    headerRightThis: '',
                    headerLogo: '#344058',
                    menuLeft: '#344058',
                    menuLeftThis: '#409EFF',
                    menuLeftHover: '#3b3f4b',
                    headerColor: 'white',
                    headerHover: 'white',
                    tabThis: '#409EFF',
                },
                {
                    headerRight: '#F78400',
                    headerRightThis: '',
                    headerLogo: '#F78400',
                    menuLeft: '#28333E',
                    menuLeftThis: '#F78400',
                    menuLeftHover: '#F78400',
                    headerColor: 'white',
                    headerHover: '#F78400',
                    tabThis: '#F78400',
                },
                {
                    headerRight: 'white',
                    headerRightThis: '',
                    headerLogo: '#28333E',
                    menuLeft: '#28333E',
                    menuLeftThis: '#1aa094',
                    menuLeftHover: '#1aa094',
                    headerColor: 'black',
                    headerHover: '#1aa094',
                    tabThis: '#1aa094',
                }
            ];

            if (bgColorId === "undefined" || bgColorId === undefined || bgColorId === 'undefined') {
                return bgColorConfig;
            } else {
                return bgColorConfig[bgColorId];
            }
        };
        this.isPc = function () {
            return !/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
        };
        //显示隐藏左侧菜单
        this.showMenu = function (flag) {
            let $body = $('body');
            $body.toggleClass("show-menu");
            let zoomTool = $('.zoom-tool');
            if (flag === true) {
                $('.dimples-layout .layui-side .layui-nav-item').off('mouseenter').unbind('mouseleave');
                $('.dimples-layout .layui-side dd').off('mouseenter').unbind('mouseleave');
                $body.removeClass('dimples-mini');
                zoomTool.attr("show-data", 1);
                //切换图标
                zoomTool.removeClass('layui-icon-spread-left');
                zoomTool.addClass('layui-icon-shrink-right');
            } else {
                $(".layui-side .layui-nav-item").hover(function () {
                    $(this).children(".layui-nav-child").addClass("dimples-menu-hover");
                    let top = $(this).offset().top;
                    let css = {
                        top: top + 'px'
                    };
                    $(this).children(".layui-nav-child").css(css);

                }, function () {
                    $(this).children(".layui-nav-child").removeClass("dimples-menu-hover");
                    let css = {
                        top: '0px'
                    };
                    $(this).children(".layui-nav-child").css(css);
                });
                $(".layui-side dd").hover(function () {
                    $(this).children(".layui-nav-child").addClass("dimples-menu-hover");
                    let top = $(this).offset().top;
                    let left = $(this).offset().left + 121;
                    let bodyHeight = document.documentElement.clientHeight;
                    let endHeight = top + $(this).children(".layui-nav-child").height() + 60;

                    if (endHeight > bodyHeight) {
                        top = bodyHeight - $(this).children(".layui-nav-child").height() - 60;
                    }
                    let css = {
                        top: top + 'px'
                    };
                    let css1 = {
                        left: left + 'px'
                    };
                    $(this).children(".layui-nav-child").css(css);
                    $(this).children(".layui-nav-child").css(css1);

                }, function () {

                    $(this).children(".layui-nav-child").removeClass("dimples-menu-hover");
                    let css = {
                        top: '0px'
                    };
                    let css1 = {
                        left: '0px'
                    };
                    $(this).children(".layui-nav-child").css(css);
                    $(this).children(".layui-nav-child").css(css1);
                });
                $(".dimples-layout .layui-side .layui-nav-itemed").removeClass("layui-nav-itemed");
                $body.addClass("dimples-mini");
                $body.removeClass("show-menu");
                //切换图标
                zoomTool.removeClass('layui-icon-shrink-right');
                zoomTool.addClass('layui-icon-spread-left');
                zoomTool.attr("show-data", 0);
            }
        };
    };

    $('body').on('click', '[data-select-bgcolor]', function () {
        let bgcolorId = $(this).attr('data-select-bgcolor');
        $('.dimples-color .color-content ul .layui-this').attr('class', '');
        $(this).attr('class', 'layui-this');
        sessionStorage.setItem('dimplesBgcolorId', bgcolorId);
        parent.dimples.initBgColor();
    });

    /**
     * 页面刷新
     */
    $("body").on("click", ".dimples-refresh", function () {

        if (!($(this).hasClass("refreshThis"))) {
            $(this).addClass("refreshThis");
            let loading = layer.load();
            //兼容单标签页
            if (dimples.config("multileTab")) {
                console.log("多标签刷新");
                $(".dimples-layout .layui-tab-content .layui-show").find("iframe")[0].contentWindow.location.reload(true);
                layer.close(loading);
            } else {
                console.log("单页面刷新");
                $("#oneTab").find("iframe")[0].contentWindow.location.reload(true);
                layer.close(loading);
            }

            setTimeout(function () {
                $(".dimples-refresh").removeClass("refreshThis");
            }, 2000)
        } else {
            layer.msg("客官！我会反应不过来的");
        }
    });

    /**
     * 菜单栏隐藏
     * */
    $(".zoom-tool").on("click", function () {
        if ($(this).attr("show-data") === "0") {
            dimples.showMenu(true);
        } else {
            dimples.showMenu(false);
        }
    });

    /**
     * 设置主题按钮点击事件
     */
    $(".setTheme").on("click", (function () {
        layer.open({
            type: 2,
            title: false,
            closeBtn: false, //不显示关闭按钮
            shade: [0],
            shadeClose: true,
            area: ['350px', 'calc(100% - 90px)'],
            offset: 'rb', //右下角弹出
            time: 0, //2秒后自动关闭
            anim: -1,
            skin: 'layer-anim-07',
            content: 'views/system/theme.html',
            cancel: function (index) {
                let $layero = $('#layui-layer' + index);
                $layero.animate({
                    left: $layero.offset().left + $layero.width()
                }, 300, function () {
                    layer.close(index);
                });
                return false;
            }
        });
    }));

    /**
     * 构建背景颜色选择
     * @returns {string}
     */
    this.buildBgColorHtml = function () {
        let html = '';
        let bgColorId = sessionStorage.getItem('dimplesBgColorId');
        if (bgColorId === null || bgColorId === "undefined" || bgColorId === "") {
            bgColorId = 0;
        }
        let bgColorConfig = dimples.bgColorConfig();
        $.each(bgColorConfig, function (key, val) {
            if (key === bgColorId) {
                html += '<li class="layui-this" data-select-bgcolor="' + key + '">\n';
            } else {
                html += '<li  data-select-bgcolor="' + key + '">\n';
            }
            html += '<a href="javascript:;" data-skin="skin-blue" style="" class="clearfix full-opacity-hover">\n' +
                '<div><span style="display:block; width: 20%; float: left; height: 12px; background: ' + val.headerLogo +
                ';"></span><span style="display:block; width: 80%; float: left; height: 12px; background: ' + val.headerRight +
                ';"></span></div>\n' +
                '<div><span style="display:block; width: 20%; float: left; height: 40px; background: ' + val.menuLeft +
                ';"></span><span style="display:block; width: 80%; float: left; height: 40px; background: #f4f5f7;"></span></div>\n' +
                '</a>\n' +
                '</li>';
        });
        return html;
    };

    /**
     * 关键函数
     * 渲染iframe所用
     */
    element.on('tab(mainFrame)', function (data) {
        if (data.elem.context.attributes !== undefined) {
            let id = data.elem.context.attributes[0].nodeValue;
            layui.each($(".layui-side"), function () {
                $(this).find(".layui-this").removeClass("layui-this");
            });
            $("[data-id='" + id + "']").attr("class", "layui-this");
        }
    });

    let laySide = $(".layui-side");
    laySide.on("click", ".layui-nav-item>a", function () {
        if ($(".zoom-tool").attr("show-data") === "1") {
            if (!$(this).attr("lay-id")) {
                //当前
                let superEle = $(this).parent();
                let ele = $(this).next('.layui-nav-child');
                let height = ele.height();
                /* ele.css({"display": "block"}); */
                // 是否是展开状态
                if (superEle.is(".layui-nav-itemed")) {
                    $(".dimples-layout .layui-side .layui-nav-item").removeClass("layui-nav-itemed");
                    $(".dimples-layout .layui-side .layui-nav-item dd").removeClass("layui-nav-itemed");
                    superEle.addClass("layui-nav-itemed");
                    ele.height(0);
                    ele.animate({
                        height: height + "px"
                    }, function () {
                        ele.css({
                            height: "auto"
                        });
                    });
                } else {
                    ele.animate({
                        height: 0
                    }, function () {
                        ele.removeAttr("style");
                    });
                }
            }
        }
    });
    laySide.on("click", ".layui-nav-item dd>.site-demo-active", function () {
        if ($(".zoom-tool").attr("show-data") === "1") {
            if (!$(this).attr("lay-id")) {
                //当前
                let superEle = $(this).parent();
                let ele = $(this).next('.layui-nav-child');
                let height = ele.height();
                /* ele.css({"display": "block"}); */
                // 是否是展开状态
                if (superEle.is(".layui-nav-itemed")) {
                    superEle.siblings().removeClass("layui-nav-itemed");
                    superEle.addClass("layui-nav-itemed");
                    ele.height(0);
                    ele.animate({
                        height: height + "px"
                    }, function () {
                        ele.css({
                            height: "auto"
                        });
                    });
                } else {
                    ele.animate({
                        height: 0
                    }, function () {
                        ele.removeAttr("style");
                    });
                }
            }

            //移动端点击后隐藏左侧菜单
            if ($(window).width() <= 768) {
                dimples.showMenu(false);
            }
        }
    });

    // 移动设备适配
    let mobileWidth = 768;
    if (!dimples.isPc() || ($(window).width() <= mobileWidth)) {
        dimples.showMenu(false);
    }
    $(window).on('resize', function () {
        if ($(window).width() <= mobileWidth) {
            dimples.showMenu(false);
        }
    });
    //移动端跳转链接先把导航关闭
    $(window).on('hashchange', function () {
        if ($(window).width() < mobileWidth) {
            dimples.showMenu(false);
        }
    });

    // 移动设备遮罩层
    let siteShadeDom = '.dimples-layout .site-mobile-shade';
    if ($(siteShadeDom).length <= 0) {
        $('.dimples-layout').append('<div class="site-mobile-shade"></div>');
    }
    $(siteShadeDom).on("click", function () {
        if ($(".zoom-tool").attr("show-data") === "1") {
            dimples.showMenu(false);
        }
    });

    /**
     * 定义输出外部引用
     */
    exports("dimples", dimples);
});
