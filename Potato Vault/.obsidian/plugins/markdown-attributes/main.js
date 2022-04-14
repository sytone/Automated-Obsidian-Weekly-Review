/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/main.ts
__export(exports, {
  default: () => MarkdownAttributes
});
var import_obsidian = __toModule(require("obsidian"));

// src/processor.ts
var _Processor = class {
  constructor(topLevelElement) {
    this.topLevelElement = topLevelElement;
  }
  static parse(el) {
    return new _Processor(el).recurseAndParseElements(el);
  }
  getTopLevelText(el) {
    const texts = [];
    for (let child of Array.from(el.childNodes)) {
      if (child.nodeType == Node.TEXT_NODE) {
        texts.push(child.data);
      }
    }
    return texts.join("");
  }
  getAttrs(str) {
    const trys = (str != null ? str : "").split(/\s(?=(?:[^'"`]*(['"`])[^'"`]*\1)*[^'"`]*$)/).map((t) => t && t.trim()).filter((t) => t && t !== '"' && t !== "'" && t.length);
    if (!trys || !trys.length)
      return;
    const allowedKeyChars = /[^\t\n\f />"'=]/;
    const keySeparator = "=";
    const classChar = ".";
    const attrs = [];
    for (let pair of trys) {
      if (!pair || !pair.length)
        continue;
      if (pair.charAt(0) === classChar) {
        attrs.push(["class", pair.slice(1)]);
        continue;
      }
      if (new RegExp(keySeparator).test(pair) && allowedKeyChars.test(pair.slice(0, pair.indexOf(keySeparator)))) {
        attrs.push([...pair.split(keySeparator, 2)]);
        continue;
      }
      attrs.push([pair, null]);
    }
    return attrs;
  }
  recurseAndParseElements(el) {
    var _a, _b, _c;
    const elements = [];
    const text = this.getTopLevelText(el);
    if (_Processor.BLOCK_RE.test(text)) {
      let element = el;
      if (el instanceof HTMLLIElement || (el == null ? void 0 : el.parentElement) instanceof HTMLQuoteElement) {
        element = el.parentElement;
      }
      let [original, attribute_string] = (_a = text.match(_Processor.BLOCK_RE)) != null ? _a : [];
      const toAdd = {
        element,
        attributes: this.getAttrs(attribute_string),
        text: attribute_string
      };
      elements.push(toAdd);
      el.innerHTML = this.tryToReplace(toAdd.element, el.innerHTML, toAdd.attributes, original);
      if (el instanceof HTMLLIElement) {
        elements.push(...this.recurseAndParseElements(el));
      }
    } else if (_Processor.BASE_RE.test(text)) {
      let textNode = Array.from(el.childNodes).find((node) => node.nodeType == Node.TEXT_NODE && _Processor.BASE_RE.test(text));
      let sibling = (_b = Array.from(el.children).find((node) => node.nextSibling == textNode)) != null ? _b : el;
      if (sibling && sibling.hasClass("collapse-indicator")) {
        sibling = sibling.parentElement;
      }
      if (sibling && sibling instanceof HTMLBRElement) {
        sibling = sibling.parentElement;
      }
      let [original, attribute_string] = (_c = text.match(_Processor.BASE_RE)) != null ? _c : [];
      const toAdd = {
        element: sibling,
        attributes: this.getAttrs(attribute_string),
        text: attribute_string
      };
      elements.push(toAdd);
      textNode.textContent = this.tryToReplace(toAdd.element, textNode.textContent, toAdd.attributes, original);
    }
    for (let child of Array.from(el.children)) {
      if (!(child instanceof HTMLElement))
        continue;
      if (child instanceof HTMLPreElement || child.tagName.toLowerCase() === "code")
        continue;
      elements.push(...this.recurseAndParseElements(child));
    }
    return elements;
  }
  tryToReplace(element, content, attributes, original) {
    if (!attributes || !attributes.length) {
      return content;
    }
    for (let [key, value] of attributes) {
      if (!key)
        continue;
      if (value)
        value = value.replace(/("|')/g, "");
      try {
        if (key === "class") {
          element.addClasses(value.split(" "));
        } else if (!value) {
          element.setAttr(key, true);
        } else {
          element.setAttr(key, value);
        }
      } catch (e) {
        console.log(`Markdown Attributes: ${key} is not a valid attribute.`);
        return content;
      }
    }
    return content.replace(original, "");
  }
};
var Processor = _Processor;
Processor.BASE_RE = /\{\:?[ ]*([^\}\n ][^\}\n]*)[ ]*\}/;
Processor.ONLY_RE = /^\{\:?[ ]*([^\}\n ][^\}\n]*)[ ]*\}$/;
Processor.BLOCK_RE = /\n[ ]*\{\:?[ ]*([^\}\n ][^\}\n]*)[ ]*\}[ ]*$/;

// src/main.ts
var MarkdownAttributes = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.parsing = /* @__PURE__ */ new Map();
  }
  onload() {
    return __async(this, null, function* () {
      console.log(`Markdown Attributes v${this.manifest.version} loaded.`);
      this.registerMarkdownPostProcessor(this.postprocessor.bind(this));
    });
  }
  postprocessor(topElement, ctx) {
    return __async(this, null, function* () {
      var _a, _b, _c;
      const child = topElement.firstElementChild;
      if (!child)
        return;
      let str;
      if (child instanceof HTMLPreElement) {
        if (!ctx.getSectionInfo(topElement))
          return;
        const { lineStart } = ctx.getSectionInfo(topElement);
        const file = this.app.vault.getAbstractFileByPath(ctx.sourcePath);
        if (!(file instanceof import_obsidian.TFile))
          return;
        const text = yield this.app.vault.cachedRead(file);
        let source = text.split("\n").slice(lineStart, lineStart + 1);
        str = source.join("\n");
        if (!Processor.BASE_RE.test(str))
          return;
        let [attribute_string] = (_a = str.match(Processor.BASE_RE)) != null ? _a : [];
        child.prepend(new Text(attribute_string));
      }
      if (child instanceof HTMLTableElement || child.hasClass("math") && child.hasClass("math-block")) {
        if (!ctx.getSectionInfo(topElement))
          return;
        const { text, lineEnd } = ctx.getSectionInfo(topElement);
        let source = ((_b = text.split("\n").slice(lineEnd + 1, lineEnd + 2)) != null ? _b : []).shift();
        if (source && source.length && Processor.ONLY_RE.test(source.trim())) {
          let [attribute_string] = (_c = source.match(Processor.ONLY_RE)) != null ? _c : [];
          child.prepend(new Text(attribute_string));
          str = topElement.innerText;
        }
      }
      if (child instanceof HTMLParagraphElement && !child.childElementCount) {
        if (Processor.ONLY_RE.test(child.innerText.trim())) {
          child.detach();
          return;
        }
      }
      if (!Processor.BASE_RE.test(str != null ? str : topElement.innerText))
        return;
      if (!(child instanceof HTMLElement))
        return;
      Processor.parse(child);
    });
  }
  onunload() {
    return __async(this, null, function* () {
      console.log("Markdown Attributes unloaded");
    });
  }
};