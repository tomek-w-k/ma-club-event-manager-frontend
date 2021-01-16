const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(fileUpload({
    createParentPath: true
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan("dev"));

app.post("/picture", (req, res) => {
    try 
    {
        if(!req.files)
            res.send({
                status: false,
                message: "No files"
            })        
        else 
        {            
            const {picture} = req.files;
            const {imageUrl} = req.body;
            picture.mv(imageUrl + picture.name);
        
            res.send({
                status: true,                
                imageUrl: imageUrl + picture.name
            });           
        }
    }
    catch(e) 
    {
        res.status(500).send(e);
    }
});

const port = 4000;
app.listen(port, () => console.log(`Server is running on port ${port}`));