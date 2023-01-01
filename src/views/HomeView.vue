<script setup>
  import Editor from "../components/Editor.vue";
  import Settings from "../components/Settings.vue";
  import Tabs from "../components/Tabs.vue";
  import _ from "../assets/*.json";
  import Terminal from "../components/Terminal.vue";
  import emitter from 'tiny-emitter/instance'
</script>
<script type="module">
var obj = {};
_['*'].forEach(function(section) {
  section.Content.forEach(function(elm) {
    obj[elm.Name] = localStorage[elm.Name] ? localStorage[elm.Name] : elm.Selections[0];
  });
});
var main = {};
main.obj = obj;
export default {
  data() {
    return main;
  },
  created() {
    var t = this;
    emitter.on('update', function(cat, item) {
      t.obj[cat]=item;
      localStorage.setItem(cat, item);
    });
  }
}
</script>
<template>
  <main onmouseup="endDrag()" onmousemove="onDrag(event)">
    <Tabs />
    <Editor :obj="obj" />
    <Settings :obj="obj"/>
    <div id="bar" style="color: var(--textPreformatforeground); text-align: center; " onmousedown="startDrag()"><i class="fa-solid fa-angle-down"></i></div>
    <Terminal/>
  </main>
</template>
