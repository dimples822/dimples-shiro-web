/**
 * 获取当前文件的所在目录
 *
 * eg: http://localhost:63342/dimples-shiro-web/static/modules/
 */
window.rootPath = (function (src) {
    src = document.scripts[document.scripts.length - 1].src;
    console.log("window.rootPath: " + src.substring(0, src.lastIndexOf("/") + 1));
    return src.substring(0, src.lastIndexOf("/") + 1);
})();

layui.config({
    base: rootPath + "lay-modules/",
    version: true
}).extend({
    dimples: "dimples/dimples",
    notice: 'notice/notice',
    iconPicker: 'iconPicker/iconPicker',
    tinymce: 'tinymce/tinymce',
    tableSelect: 'tableSelect/tableSelect',
    treetable: 'treetable/treetable',
    tag: 'tag/tag',
    formSelects: 'formSelects/formSelects-v4',
    dtree: 'dtree/dtree'
});