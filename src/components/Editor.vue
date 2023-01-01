<script setup>
  defineProps({
    obj: {
      type: Object,
      required: true
    }
  });
</script>
<script type="module">
import { loadWASM } from "onigasm";
import { Registry } from "monaco-textmate";
import { wireTmGrammars } from "monaco-editor-textmate";
import loader from "@monaco-editor/loader";
import emitter from 'tiny-emitter/instance'
import py from '../grammars/python.json';
import cpp from '../grammars/cpp.tmLanguage.json';
import kotlin from '../grammars/kt.json';
import pascal from '../grammars/pascal.json';
import themes from "../assets/*.json";
const init = async function () {
  await loadWASM(`/onigasm/lib/onigasm.wasm`);
  const registry = new Registry({
    getGrammarDefinition: async (scopeName) => {
      if(scopeName == 'source.cpp') {
        return {
          format: "json",
          content: cpp,
        };                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
      } else if(scopeName == 'source.python') {
        return {
          format: "json",
          content: py,
        }
      } else if(scopeName == 'source.kotlin') {
        return {
          format: "json",
          content: kotlin,
        }
      } else {
        return {
          format: "json",
          content: pascal,
        }
      }
    },
  });

  const grammars = new Map();
  grammars.set("cpp", "source.cpp");
  grammars.set("python", "source.python");
  grammars.set("kotlin", "source.kotlin");
  grammars.set("pascal", "source.pascal");

  var themelist = themes['*'][0]['Content'].find(elm => elm.Name == 'Themes').Selections;

  loader.init().then(async function (monaco) {
    for (var i = 0; i < themelist.length; i++) {
      let item = themelist[i];
      fetch(`/themes/${item}.json`)
        .then((res) => res.json())
        .then(function (data) {
          monaco.editor.defineTheme(item, data);
          if (item == "XcodeDark") {
            window.editor = monaco.editor.create(
              document.getElementById("container"),
              {
                value: localStorage.code ? localStorage.getItem('code') : `#include <bits/stdc++.h>
using namespace std;
int main() {
  cout << "Hello World\\n";
  return 0;
}`,
                minimap: {
                  enabled: false,
                },
                theme: localStorage.Themes ? localStorage.getItem('Themes') : 'vs-dark'
              }
            );
          }
        });
    }

    await wireTmGrammars(monaco, registry, grammars, window.editor);

    window.thing = monaco.editor;
  });
};
init();

export default {
  data() {
    return {
      hide: false,
      st: null,
      datas: this.obj
    }
  },
  mounted() {
    var t = this;
    let keep = setInterval(function() {
      if(window.editor && window.thing) {
        t.editor();
        clearInterval(keep);
      }
    }, 1);
    emitter.on('showSettings', function(bool) {
      document.getElementById('container').style.display = (bool ? 'none': '');
      t.editor();
      window.editor.layout();
    });
    emitter.on('save', function() {
      console.log(JSON.stringify(window.editor.getValue()))
      localStorage.setItem('code', window.editor.getValue());
    });
  },
  methods: {
    editor() {
      window.thing.setTheme(this.datas.Themes);
      window.editor.getModel().updateOptions({ tabSize: parseInt(this.datas.TabSize) });
      var cn;
      if(this.datas.Languages == 'C++14' || this.datas.Languages == 'C++17') cn = 'cpp';
      else if(this.datas.Languages == 'Python') cn = 'python';
      else if(this.datas.Languages == 'Kotlin') cn = 'kotlin';
      else cn = 'pascal';
      window.thing.setModelLanguage(window.editor.getModel(), cn);
      window.editor.updateOptions({ cursorStyle: this.datas.CursorStyle });
      if(this.datas.Animations == 'Smooth') {
        window.editor.updateOptions({
          cursorSmoothCaretAnimation: true,
          cursorBlinking: 'smooth',
          smoothScrolling: true
        });
      } else {
        window.editor.updateOptions({
          cursorSmoothCaretAnimation: false,
          cursorBlinking: 'blink',
          smoothScrolling: false
        });
      }
      idk();
    }
  },
  watch: {
      $data: {
        handler() {
          this.editor();
        },
        deep: true,
      },
    },
}
</script>
<template>
  <div id="body" style="display: flex; width: 100%; ">
    <div id="container" class="container-fluid"></div>
  </div>

</template>
