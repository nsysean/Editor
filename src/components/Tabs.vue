<script>
import emitter from 'tiny-emitter/instance'

export default {
  data() {
    return {
      first: true
    }
  },
  methods: {
    call(bool) {
      if(bool == false || document.getElementsByTagName('a')[0].innerHTML != '<i class="fa-solid fa-stop" style="vertical-align: middle"></i>') {
        emitter.emit('showSettings', bool);
        this.first = !bool;
      } 
      window.editor.layout();
    },
    call2() {
      emitter.emit('save');
      const toastLiveExample = document.getElementById('liveToast')
    const toast = new bootstrap.Toast(toastLiveExample)

    toast.show()
    },
    call3() {
      if(document.getElementsByTagName('a')[0].innerHTML.search('fa-play') != -1) {
        emitter.emit('startrun');
      } else emitter.emit('endrun');
      this.call(false);
      console.log(document.getElementsByTagName('a')[0].innerHTML, document.getElementsByTagName('a')[0].innerHTML.search('fa-play'));
      document.getElementsByTagName('a')[0].innerHTML = (
      document.getElementsByTagName('a')[0].innerHTML.search('fa-play') != -1
      ? '<i class="fa-solid fa-stop" style="vertical-align: middle"></i>'
      : '<i class="fa-solid fa-play" style="vertical-align: middle"></i>'
      )

    }
  },
  mounted() {
    var t = this;
    emitter.on('boop', function() {
      t.call3();
    })
  }
}
</script>
<template>
  <div class="container-fluid nav navbar">
    <div>
      <button 
      type="button"
      :class="first == true ? 'active' : ''"
      @click="call(false);"
    >
      <i class="devicon-cplusplus-plain"></i> main.cpp
    </button>
    <button
      type="button"
      :class="first == false ? 'active' : ''"
      @click="call(true)"
    >
      <i class="fa-solid fa-gear"></i> settings
    </button>
    </div>

    <div style="color: var(--textPreformatforeground); display: table-cell">
      <a style="margin-inline: 10px;" @click="call3">
        <i class="fa-solid fa-play" style="vertical-align: middle"></i>
      </a>
      <a style="margin-inline: 10px;" @click="call2">
        <i class="fa-solid fa-floppy-disk" style="vertical-align: middle"></i>
      </a>
    </div>
  </div>

</template>
