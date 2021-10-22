const express = require('express');
const router = express.Router();
const multer = require('multer');
const nodeStreamZip = require('node-stream-zip');
const path = require('path');
const fs = require('fs');
const { resolve } = require('path');

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
        // console.log("Entries: ", zip.entries());
    });

    zip.on("entry", (entry)=>{
        let pathname = path.resolve('./temp', entry.name);
        // From Stack Overflow
        if (/\.\./.test(path.relative('./temp', pathname))) {
            console.warn("[zip warn]: ignoring maliciously crafted paths in zip file:", entry.name);
            return;
        }
      
        if ('/' === entry.name[entry.name.length - 1]) {
          console.log('[DIR]', entry.name);
          return;
        }
      
        console.log('[FILE]', entry.name);

        console.log("PathName: ", pathname);


        zip.stream(entry.name, (err, stream)=>{
            if (err) {console.error("Error!: ", err.toString()); return;}

            stream.on('error', (err)=>{console.error("[ERROR] : ", err); return;})

            // No errors 
            fs.mkdir(
                path.dirname(pathname),
                {recursive: true},
                function (err) {
                    stream.pipe(fs.createWriteStream(pathname));
                    res.send({"message" : "Success! File has been unzipped", "path" : pathname})
                    }
            )
            
        })
        
       
    })
});

router.get("/files", (req,res)=>{
    if (fs.existsSync('./temp')){
        res.send({"message" : "Check the Temp Folder" })
    } else {
        res.send({"message" : "No Unzipped files in the folder"});
    }
})

module.exports = router;