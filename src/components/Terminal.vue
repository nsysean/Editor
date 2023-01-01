<script type="module">

import { FitAddon } from 'xterm-addon-fit';
import emitter from 'tiny-emitter/instance'
import { LocalEchoAddon } from "@gytx/xterm-local-echo";
import { emit } from 'process';
import { io } from "https://cdn.socket.io/4.5.4/socket.io.esm.min.js";

export default {
    mounted() {
        var t = this, stuff = "";
        var keep1 = setInterval(function() {
            if(document.readyState == 'complete') {
                t.loadFakeEditor(0, stuff);
                clearInterval(keep1);
            }
        });
        emitter.on('done1', function() {
            t.loadFakeEditor(0, stuff);
        });
        emitter.on('startrun', function() {
            stuff="";
            t.loadEditor(0, stuff);
            let socket = new WebSocket("ws://localhost:3001/");
            window.socket = socket;
            socket.onopen = function() {
                socket.send(JSON.stringify({
                    Type: localStorage.Mode ? localStorage.getItem('Mode') : 'Interactive',
                    Code: window.editor.getValue()
                }));
            }
            socket.onmessage = function(event) {
                stuff += event.data.replaceAll('\n', '\r\n');
                window.term.println(event.data);
            };
            socket.onclose = function() {
                emitter.emit('boop');
            }
        });
        emitter.on('endrun', function() {
            t.loadFakeEditor(0, stuff);
        });
        emitter.on('stuff', function(data){stuff+=data+'\r\n';});
    },
    methods: {
        loadEditor(time) {
            setTimeout(function() {
                document.getElementById('main').innerHTML = '';
                var style = getComputedStyle(document.body);
                var term = new Terminal({
                    theme: {
                        background: style.getPropertyValue('--editorbackground'),
                        foreground: style.getPropertyValue('--textPreformatforeground'),
                        cursorAccent: style.getPropertyValue('--textPreformatforeground')
                    }
                });
                window.fitAddon = new FitAddon();
                term.loadAddon(window.fitAddon);
                term.open(document.getElementById('main'));
                window.fitAddon.fit();
                // 
                const localEcho = new LocalEchoAddon();
                term.loadAddon(localEcho);
                const prompt = "";
                const readLine = async () => {
                    const input = await localEcho.read(prompt);
                    window.socket.send(input);
                    window.term = localEcho;
                    emitter.emit('stuff', input);
                    readLine();
                };
                readLine();
            }, time);
        },
        loadFakeEditor(time = 0, stuff) {
            setTimeout(function() {
                document.getElementById('main').innerHTML = '';
                var style = getComputedStyle(document.body);
                var term = new Terminal({
                    theme: {
                        background: style.getPropertyValue('--editorbackground'),
                        foreground: style.getPropertyValue('--textPreformatforeground'),
                        cursorAccent: style.getPropertyValue('--textPreformatforeground')
                    }
                });
                window.fitAddon = new FitAddon();
                term.loadAddon(window.fitAddon);
                term.open(document.getElementById('main'));
                window.fitAddon.fit();
                term.write(stuff.replaceAll('\n', '\r\n'));
            }, time);
        }
    }
}
</script>
<template>
            <div id="main">

            </div>



</template>