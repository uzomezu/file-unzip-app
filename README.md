# file-unzip-app

### File Unzipper w/ Express.js and node-stream-zip

A File Unzipper that will handle most .zip files and place the resulting folder/files onto your local machine. 

### Steps to Run

1. `git clone` the repository using the url

2. `npm install` all the dependencies

3. `npm start` in root of project folder 

4. Open a REST Client (POSTMAN, INSOMNIA) and setup a POST request to the following : http://localhost:8000/api/unzip

    - Body : multipart/form-data; make sure the name of your file is **"zip-file"**
    - Headers: {"Content-Type" : "multipart/form-data"}
    - POST and wait for response, you should get a JSON object with success message and the local path of your unzipped file
    - The unzipped file will be in folder named `./temp/`

    Example : 

```json
{
  "message": "Success! File has been unzipped",
  "path": "C:\\Users\\{SYSTEM_USER}\\{DIRECTORY}\\{SUB_FOLDER}\\{SUB_FOLDER}\\{SUB_FOLDER}\\file-unzip-app\\temp\\Install_rekordbox_x64_6_5_3.exe"
}
```