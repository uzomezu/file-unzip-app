const express = require('express');
const router = express.Router();
const multer = require('multer');
const nodeStreamZip = require('node-stream-zip');
const path = require('path');
const fs = require('fs');
const { resolve } = require('path');
const { async } = require('node-stream-zip');
const { Console,log,error } = require('console');

// Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + ".zip")
    }
  })
   
const upload = multer({storage});

//
router.post('/', upload.single('zip-file'), (req,res)=>{
    const zip = new nodeStreamZip({
        file : req.file.path,
        storeEntries : true
    })
    // handle errors
    zip.on('error', (err)=>{console.error(`Error!: ${err}`); res.send({"Error" : err})});

    zip.on('ready', ()=>{
        console.log("Entries Count: ", zip.entriesCount)
        if(zip.entriesCount){
            const folder = fs.readdirSync('./temp');
            if (folder.entriesCount != 0) {
               for(const file of folder) {
                let location = path.join('./temp',file);
                console.log(location);
                let status = fs.statSync(location);
                if (status.isFile()){
                    fs.rmSync(location);
                } else if (status.isDirectory()){
                    fs.rmdirSync(location);
                }
               } 
            }
            zip.extract(null, './temp', (err, count) => {
                console.log(err ? 'Extract error' : `Extracted ${count} entries`);
                zip.close();
                if (err) {
                    res.sendStatus(400, err)
                } else {
                  const pathToDwnLd = path.resolve('./temp');
                  let array = new BigInt64Array(0);
                  let buffer = Buffer.from(array.buffer);

                  fs.createWriteStream(pathToDwnLd).write(buffer);

                  res.json({message : "Successful Unzip of files!", unzip : buffer});
                }
            });
        }
    });

    // if(zip.entriesCount <= 1) {
    //     zip.on("entry", (entry)=>{
    //         let pathname = path.resolve('./temp', entry.name);
    //         // From Stack Overflow
    //         if (/\.\./.test(path.relative('./temp', pathname))) {
    //             console.warn("[zip warn]: ignoring maliciously crafted paths in zip file:", entry.name);
    //             return;
    //         }
          
    //         if ('/' === entry.name[entry.name.length - 1]) {
    //           console.log('[DIR]', entry.name);
    //           return;
    //         }
          
    //         console.log('[FILE]', entry.name);
    
    //         console.log("PathName: ", pathname);
    
    
    //         zip.stream(entry.name, (err, stream)=>{
    //             if (err) {console.error("Error!: ", err.toString()); return;}
    
    //             stream.on('error', (err)=>{console.error("[ERROR] : ", err); return;})
    
    //             // No errors 
    //             fs.mkdir(
    //                 path.dirname(pathname),
    //                 {recursive: true},
    //                 function () {
    //                     try{
    //                         stream.pipe(fs.createWriteStream(pathname));
    //                         stream.on("end", ()=>{
    //                         zip.close();
    //                     })
    //                     } catch(err){
    //                         throw err;
    //                     }
    //                     }
    //             )   
    //         })
          
         
    //     })
    // }
    // let pathname = path.resolve('./temp');
    // let files = fs.readdirSync(pathname);
    // if(zip.entriesCount == files.length){
    //     const data = "All Files have been unzipped!";
    //     console.log(files.length);
    //     return res.send({"message": data});            
    // } else {
    //     const errMessage = "Files Not unzipped";
    //     return res.send({message : errMessage});
    // }
});

router.get("/files", (req,res)=>{
    if (fs.existsSync('./temp')){
        res.send({"message" : "Check the Temp Folder" })
    } else {
        res.send({"message" : "No Unzipped files in the folder"});
    }
})

module.exports = router;