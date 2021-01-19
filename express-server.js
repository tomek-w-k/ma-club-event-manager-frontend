const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(fileUpload({
    createParentPath: true
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan("dev"));

const publicDir = "/public";

const removeDir = path => {
    if ( fs.existsSync( path ) )
    {
        const files = fs.readdirSync(path);
        if ( files.length > 0 )
        {
            files.forEach(fileName => {
                if ( fs.statSync(path + "/" + fileName).isDirectory() )
                    removeDir(path + "/" + fileName); 
                else fs.unlinkSync(path + "/" + fileName);
            });
            fs.rmdirSync(path);
        }
        else fs.rmdirSync(path);
    }
    else console.log("Directory path not exist.");
}

app.post("/save_temp_picture", (req, res) => {
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
            const {imageDir} = req.body;            
            picture.mv(process.cwd() + publicDir + imageDir + picture.name);
        
            res.send({
                status: true,                
                imageUrl: imageDir + picture.name
            });           
        }
    }
    catch(e) 
    {
        res.status(500).send(e);
    }
});

app.post("/save_picture", (req, res) => {
    try
    {
        if(!req.body)
            res.send({
                status: false,
                message: "No request body"
            });
        else
        {
            const {imageName} = req.body;
            const {imageTempDir} = req.body;
            const {imageTargetDir} = req.body;            
            const targetPath = path.join(process.cwd(), publicDir, imageTargetDir);
            
            if ( imageTempDir != "" )
            {
                console.log("temp dir :: ", imageTempDir);
                removeDir(targetPath);            
                fs.mkdirSync(path.join(process.cwd(), publicDir, imageTargetDir), {recursive: true});
                fs.copyFileSync(path.join(process.cwd(), publicDir, imageTempDir, imageName),
                                path.join(process.cwd(), publicDir, imageTargetDir, imageName));            
            }            
            
            res.send({
                status: true,
                imageUrl: imageTargetDir + imageName
            });
        }
    }
    catch(e)
    {
        res.status(500).send(e);
    }
});

app.delete("/clear_temp_dir", (req, res) => {
    try
    {
        if(!req.body)
        res.send({
            status: false,
            message: "No request body"
        });
        else
        {
            const {userTempDir} = req.body;
            if(fs.existsSync(path.join(process.cwd(), publicDir, userTempDir)))
            {
                removeDir(path.join(process.cwd(), publicDir, userTempDir));
                res.status(200).send("Directory removed successfully.");
            }
            else res.status(200).send("Directory not exist.");                
        }
    }
    catch(e)
    {
        res.status(500).send(e);
    }    
});

const port = 4000;
app.listen(port, () => console.log(`Server is running on port ${port}`));