(()=>{
    class SendZip {
        
    }
    var heading = document.getElementById("header");

    heading.innerHTML = "Hello World(from src/index.js)";

    const myForm = document.forms[0];
    const fileUpload = document.querySelector("#file-input");
    const formData = new FormData();
    /**
     * 
     */
    myForm.addEventListener('submit', async (e)=>{
        e.preventDefault();
        // console.log(fileUpload.files);
        for (const file in fileUpload.files){
            formData.append("zip-file",file);
        }
        

        })
})();