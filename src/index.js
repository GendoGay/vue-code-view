import OutputContainer from "./code-viewer/output-container.vue";
import CodeEditor from "./codemirror/CodeMirror.vue";
import CodeViewer from "./vcv/VCV.vue";
import locale from "./locale";

const install = function (Vue, opts = {}) {
  locale.use(opts.locale);
  locale.i18n(opts.i18n);
  Vue.component(CodeEditor.name, CodeEditor);
  Vue.component(OutputContainer.name, OutputContainer);
  Vue.component(CodeViewer.name, CodeViewer);
};

// CDN 引入
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install,
};
