const fs = require('fs');
const unzip = require('unzip');
const pdf = require('html-pdf');
const path = require('path');
const AWS = require('aws-sdk');
const s3 = require('aws-sdk/clients/s3');
const s3Client = new s3();
const table = require('table-builder')

module.exports.handler = (event, context, cb) => {
    let params = {
        Bucket: "value-capture-us-east-1-285453578300",
        Key: event.templateName
    };
    let base64Pdf='';
    s3Client.getObject(params,   (err,data) => {
        if(err){
            throw err
        }else{
            fs.writeFileSync('/tmp/compresed.zip',data.Body);
            fs.createReadStream('/tmp/compresed.zip').pipe(unzip.Extract({path: '/tmp'})).on('close', () => {

                const remplacer = require('/tmp/htmlRemplacer.js');
                console.log('file uncompresed');

                remplacer(event.data,null,table);
                console.log('remplacer finished')

                let html = fs.readFileSync('/tmp/index.html', 'utf8')
                let options = {
                    base: 'file://' + path.resolve('/tmp/index.html'),timeout:"29000","border": {
                        "top": "20mm",
                        "bottom": "20mm"}
                };
                console.log('starting creating pdf file')
                pdf.create(html, options).toFile('/tmp/something.pdf', function (err, res) {
                    if (err) throw err
                    base64Pdf=fs.readFileSync('/tmp/something.pdf').toString('base64');
                    cb(null,base64Pdf)
                })

            });

        }
    });
};




