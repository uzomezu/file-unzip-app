(()=>{
    class SendZip {
        constructor(endpoint, method, data){
            this.endpoint = endpoint;
            this.method = method;
            this.data = data;
        }

        sendFormData = async () =>{
            const headers = {
                "Content-Type" : "multipart/form-data",
                "Accepts" : "application/json",
            }

            const res = await fetch(this.endpoint, {
                method : this.method,
                body : this.data,
            });

            if (res.status == 200){
                console.log(await res.json());
                return;
            } else {
                console.log(res.status);
            }
        }
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
        console.log(fileUpload.files[0]);
        formData.append('zip-file',fileUpload.files[0])
        
        const apiQuery = new SendZip('http://localhost:8000/api/unzip', 'POST', formData);
        await apiQuery.sendFormData();
        // console.log(res);
        });
})();