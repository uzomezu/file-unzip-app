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
    // console.log("TESTING");
    // console.log(req.body,req.file);
    // res.send({message: "testing server, look at console."});
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
                fs.rmSync(location, {recursive: true});
               } 
            }
            zip.extract(null, './temp', (err, count) => {
                console.log(err ? 'Extraction error' : `Extracted ${count} entries`);
                zip.close();
                if (err) {
                    res.sendStatus(400, err)
                } else {
                /// Attatch all of this to req.unzipped object as req = { unzipped : {{pathToDwnLd}} };
                  const pathToDwnLd = path.resolve('./temp');
                  res.json({message: `Check location in temporary folder`, location : pathToDwnLd});
                }
            });
        }
    });
});
router.post("/base64", upload.single('zip-file'), async (req,res)=> {
    const testTemp = fs.readdirSync(path.join(__dirname,'/temp'));

    /**
     * idea is to recursivelly read and then store files in array
       drawbacks : 
       1. hard to keep original folder structure
       2. slower that general unzip
     */
    
})
router.get("/files", (req,res)=>{
    if (fs.existsSync('./temp')){
        res.send({"message" : "Check the Temp Folder" })
    } else {
        res.send({"message" : "No Unzipped files in the folder"});
    }
})

module.exports = router;