module.exports = (req,res) => {
    if(req.file){
        console.log(req.file.path)
    }

    res.send({"message" : "Callback Function Response for Uploading" , "file" : req.file.path });
}