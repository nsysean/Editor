const app = require('express')();
const { exec, spawn } = require('child_process');
const fs = require('fs');
const Emitter = require('tiny-emitter');
const emitter = new Emitter();
require('express-ws')(app);
app.ws('/', function(ws, res) {
    let i=0;
    ws.on('message', function(req) {
        i++;
        if(i == 1) {
            const result = [];
            req = JSON.parse(req);
            const arr1 = ['docker', 'run', '-dit', 'cpp']
            const child1 = spawn('sudo', arr1);
            child1.stdout.on('data', function(data) {
                fs.writeFile(`${data.toString().replaceAll('\n', '')}.cpp`, req.Code, function (err) {
                    if (err)
                        throw err;
                });
                exec(`sudo docker cp ${data.toString().replaceAll('\n', '')}.cpp ${data.toString().replaceAll('\n', '')}:/usr/src/app/main.cpp`, function (err) {
                    if (err)
                        throw err;
                });
                exec(`sudo docker exec ${data.toString().replaceAll('\n', '')} g++ main.cpp`, function(err) {
                    if(err) {
                        const ree = err.toString();
                        ws.send(ree.replace(`sudo docker exec ${data.toString().replaceAll('\n', '')} `, '').replace('\"', ''));
                        kill(data.toString().replaceAll('\n', ''));
                    } else {
                        const arr = ['docker', 'exec', '-i', data.toString().replaceAll('\n', ''), './a.out'];
                        const child = spawn('sudo', arr);
                        child.stdout.on('data', function(data) {
                            if(req.Type != "Interactive") result.push(data.toString());
                            else ws.send(data.toString());
                        });
                        child.on('exit', function(code) {
                            if(req.Type != "Interactive") ws.send(result.join(''));
                            ws.send(`Program exited with code ${code}`);
                            kill(data.toString().replaceAll('\n', ''));
                        });
                        emitter.on('msg', function(msg) {
                            child.stdin.write(msg + '\n');
                        });
                    }
                });
            });
        } else {
            emitter.emit('msg', req);
        }
    });
    function kill(id) {
        res.connection.destroy();
        exec(`sudo docker kill ${id}`, function(err) {
            if(err) throw err;
        });
        fs.unlink(`${id}.cpp`, function(err) { if(err) console.log(err) });
    }
});
// 
app.listen(3001);
/*
{ "Type": "Interactive", "Code": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    int n;\n    while (cin >> n) cout << n << '\\n';\n}" }
*/
// sudo docker ps | awk {' print $1 '} | tail -n+2 > tmp.txt; for line in $(cat tmp.txt); do sudo docker kill $line; done; rm tmp.txt
