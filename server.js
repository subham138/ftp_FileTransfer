const express = require('express');
const FTPClient = require('ftp');
const port = process.env.port || 3000;
const app = express();
let ftp_client = new FTPClient();
const fs = require("fs");
var Transform = require('stream').Transform;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('welcome');
})

app.get('/transfer', (req, res) => {
    let ftpConfig = {
        host: "103.27.86.49",
        port: 21,
        user: 'ftp_test_user',
        password: 'Ftp_test#user@2022',
    }
    //create a connection to ftp server
    ftp_client.connect(ftpConfig);

    ftp_client.on('ready', function () {
        // console.log('connected');
        let filenames = fs.readdirSync('local');

        // console.log("\nFilenames in directory:");
        // filenames.forEach((file) => {
        //     console.log("File:", file);
        // });
        //////////////////////////////////////// UPLOAD ALL FILES FROM LOCAL ////////////////////////////////////////////////////////
        // filenames.forEach(file => {
        //     ftp_client.put('local/' + file, file, (err) => {
        //         if (err) throw err;
        //         ftp_client.end();
        //     })
        // })
        ////////////////////////////////////////////////////////////////////////////////////////////////        
        // ftp_client.put('local/', 'local_file_share.csv', function (err) {
        //     if (err) throw err;
        //     ftp_client.end();
        // });


        ftp_client.list((err, list) => {
            if (err) throw err;
            list.forEach(e => {
                console.log(e.name);
                let ftp2_config = {
                    host: "103.27.86.49",
                    port: 21,
                    user: 'lrvlFTP',
                    password: 'Maity@123@555$',
                }
                const con2 = new FTPClient();
                con2.connect(ftp2_config);
                con2.on('ready', () => {
                    ftp_client.get(e.name, (err, stream) => {

                    })
                })
            })
            // file_path = list;
            // return list;
            // console.dir(list);
            // console.log('e');
            // ftp_client.end();
            // res.send('File Sended Successfully')
        })
        ////////////////////////////////////////////////////////////////////////////////////////////////
        // ftp_client.get('/lrvlpwa', function (err, stream) {
        //     if (err) throw err;
        //     else console.log(stream);
        //     stream.once('close', function () { ftp_client.end(); console.log('closed'); });
        //     stream.pipe(fs.createWriteStream('ss_local_copy.csv'));
        // });
    });
})


app.get('/test', (req, res) => {
    // SOURCE FTP CONNECTION SETTINGS
    var srcFTP = {

        host: '103.27.86.49',
        port: 21,
        user: 'ftp_test_user',
        password: 'Ftp_test#user@2022'

    }

    // DESTINATION FTP CONNECTION SETTINGS
    var destFTP = {

        host: '103.27.86.49',
        port: 21,
        user: 'lrvlFTP',
        password: 'Maity@123@555$'

    }

    var downloadList = [];

    function passThrough() {
        var passthrough = new Transform();
        passthrough._transform = function (data, encoding, done) {
            console.log(data);
            this.push(data);
            done();
        };
        return passthrough;
    }

    var d = new FTPClient();
    d.on('ready', function () {

        var c = new FTPClient();
        c.on('ready', function () {

            c.list('/', function (err, list) {

                if (err) throw err;

                list.map(function (entry) {
                    // if (entry.name.match(/tar\.gz$/) && entry.name.match(/^filename/)) {
                    downloadList.push(entry.name);
                    // }
                });

                downloadList.map(function (file, index) {
                    console.log(file);
                    // Download remote files and save it to the local file system:
                    c.get(file, function (err, stream) {

                        if (err) throw err;

                        // Upload local files to the server:
                        d.put(stream.pipe(passThrough()), '/lrvlpwa/test/' + file, function (err) {
                            if (err) throw err;
                            if (downloadList.length === index + 1) c.end();
                        });

                    });

                });

            });

        });

        c.on('end', function () {
            d.end();
        });

        c.connect(srcFTP);

    });

    d.connect(destFTP);
})

app.listen(port, (err) => {
    if (err) console.log(err);
    else console.log(`App is running at ${port}`);
})