<script setup>
  defineProps({
    obj: {
      type: Object,
      required: true
    }
  });
</script>
<script type="module">
import { stdout } from "process";
import data from "../assets/*.json";
import emitter from 'tiny-emitter/instance'

export default {
  data() {
    return {
      hide: true,
      datas: this.obj
    }
  },
  methods: {
    scroll(id) {
      var myElement = document.getElementsByClassName("activee");
      for (var i=0; i<myElement.length; i++) {
        var elm = myElement[i];
        const topPos = elm.offsetTop;
        document.getElementById( data['*'][i > 3 ? 1 : 0]['Content'][i % 4].Name).scrollTop = Math.max(8, topPos - 73);
      }
    },
    thslct(item) {
      var r = document.querySelector(":root");
      fetch(`/themes/${item}.json`)
        .then((res) => res.json())
        .then(function (data) {
          var r = document.querySelector(":root");

          r.style.setProperty("--tabactiveborder", "#1E1E1E");
          r.style.setProperty("--tabactivebackground", "#1E1E1E");
          r.style.setProperty("--tabinactivebackground", "#2D2D2D");
          r.style.setProperty("--tabactiveforeground", "#FFF");
          r.style.setProperty("--tabinactiveforeground", "#969696");
          r.style.setProperty("--editorbackground", "#1E1E1E");
          r.style.setProperty("--textPreformatforeground", "#D4D4D4");
          r.style.setProperty("--scrollbarSliderbackground", "#4F4F4F");
          r.style.setProperty("--active", "#00325F");

          if (data.colors["tab.activeBorder"])
            r.style.setProperty(
              "--tabactiveborder",
              data.colors["tab.activeBorder"]
            );
          if (data.colors["tab.activeBackground"])
            r.style.setProperty(
              "--tabactivebackground",
              data.colors["tab.activeBackground"]
            );
          else if (data.colors["editor.background"])
            r.style.setProperty(
              "--tabactivebackground",
              data.colors["editor.background"]
            );
          if (data.colors["tab.inactiveBackground"])
            r.style.setProperty(
              "--tabinactivebackground",
              data.colors["tab.inactiveBackground"]
            );
          if (data.colors["tab.activeForeground"])
            r.style.setProperty(
              "--tabactiveforeground",
              data.colors["tab.activeForeground"]
            );
          if (data.colors["tab.inactiveForeground"])
            r.style.setProperty(
              "--tabinactiveforeground",
              data.colors["tab.inactiveForeground"]
            );
          if (data.colors["editor.background"])
            r.style.setProperty(
              "--editorbackground",
              data.colors["editor.background"]
            );
          if (data.colors["textPreformat.foreground"])
            r.style.setProperty(
              "--textPreformatforeground",
              data.colors["textPreformat.foreground"]
            );
          if (data.colors["scrollbarSlider.background"])
            r.style.setProperty(
              "--scrollbarSliderbackground",
              data.colors["scrollbarSlider.background"]
            );
          if (data.colors["scrollbarSlider.activeBackground"])
            r.style.setProperty(
              "--active",
              data.colors["scrollbarSlider.activeBackground"]
            );
          emitter.emit('done1');
        });
    },
    select(cat, item) {
      emitter.emit('update', cat, item);
    }
  },
  created() {
    var t = this;
    emitter.on('showSettings', function(bool) {
      document.getElementById('body2').style.display = (bool ? 'block': 'none');
      if(!bool) {
          document.getElementById('body').style.minHeight = '35vh';
      } else {
        document.getElementById('body').style.minHeight = '47.5vh';
        var old = document.getElementById('body').clientHeight;
        document.getElementById('body').style.height = '47.5vh';
        if(old > document.getElementById('body').clientHeight) {
          document.getElementById('body').style.height = old + 'px';
        }
      }
    });
    t.thslct(t.datas['Themes']);
  },
};
</script>
<template>
  <div id="body2">
    <div class="card" v-for="_type in data['*']">
      <div class="card-title">{{ _type.Name }} Settings</div>
      <div class="card-text">
        <div v-for="setting in _type.Content" style="display: inline-block; margin-right: 2%;">
        {{ setting.Name }}: 
        <div class="dropdown">
          <button
            class="dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            @click="scroll(setting.Name)"
            :id="setting"
          >
          {{ datas[setting.Name] }}
          </button>
          <ul class="dropdown-menu" :id="setting.Name">
            <li v-for="item in setting.Selections">
              <a
                :class="(item == obj[setting.Name] ? 'activee' : '') + ' dropdown-item'"
                @click="select(setting.Name, item); (setting.Name == 'Themes' ? thslct(item) : '')"
              >
              {{ item }}
              </a>
            </li>
          </ul>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>
