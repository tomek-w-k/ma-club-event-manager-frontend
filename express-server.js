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

app.post("/save_rt_picture", (req, res) => {
    try
    {
        if(!req.body || !req.files)
            res.send({
                status: false,
                message: "No request content"
            });
        else
        {
            const {picture} = req.files;            
            const {imageTargetDir} = req.body;
            const targetPath = path.join(process.cwd(), publicDir, imageTargetDir);
            
            picture.mv(path.join(targetPath + picture.name));
        
            res.send({
                status: true,                
                imageUrl: imageTargetDir + picture.name
            });    
        }
    }
    catch(e) { res.status(500).send(e) }
});

app.post("/save_event_picture", (req, res) => {
    try
    {
        if(!req.body || !req.files)
            res.send({
                status: false,
                message: "No request content"
            });
        else
        {
            const {picture} = req.files;            
            const {imageTargetDir} = req.body;
            const targetPath = path.join(process.cwd(), publicDir, imageTargetDir);
            
            if(fs.existsSync(targetPath))            
                removeDir(targetPath);

            picture.mv(path.join(targetPath + picture.name));
        
            res.send({
                status: true,                
                imageUrl: imageTargetDir + picture.name
            });    
        }
    }
    catch(e) { res.status(500).send(e) }
});


app.get("/get_rt_picture/:tournamentId/:imageName", (req, res) => {       
    try
    {        
        const targetPath = path.join(process.cwd(), publicDir, "images/tournaments", req.params.tournamentId, "room_types_pictures", req.params.imageName  );                
        res.sendFile(targetPath);
    }
    catch(e) { res.status(500).send(e) }
});

app.get("/get_tournament_picture/:tournamentId/:imageName", (req, res) => {       
    try
    {        
        const targetPath = path.join(process.cwd(), publicDir, "images/tournaments", req.params.tournamentId, "event_picture", req.params.imageName  );                
        res.sendFile(targetPath);
    }
    catch(e) { res.status(500).send(e) }
});

app.delete("/clear_rt_dir", (req, res) => {
    try
    {
        if(!req.body)
        res.send({
            status: false,
            message: "No request body"
        });
        else
        {
            const {imageTargetDir} = req.body;
            const targetPath = path.join(process.cwd(), publicDir, imageTargetDir);

            if(fs.existsSync(targetPath))
            {
                removeDir(targetPath);
                res.status(200).send("Directory removed successfully.");
            }
            else res.status(200).send("Directory not exist.");                
        } 
    }
    catch(e) { res.status(500).send(e) }    
});

app.delete("/clear_dir", (req, res) => {
    try
    {
        if(!req.body)
        res.send({
            status: false,
            message: "No request body"
        });
        else
        {
            const {dir} = req.body;
            if(fs.existsSync(path.join(process.cwd(), publicDir, dir)))
            {
                removeDir(path.join(process.cwd(), publicDir, dir));
                res.status(200).send("Directory removed successfully.");
            }
            else res.status(200).send("Directory not exist.");                
        } 
    }
    catch(e) { res.status(500).send(e) }    
});

app.post("/save_club_document", (req, res) => {
    try
    {
        if(!req.body || !req.files)
            res.send({
                status: false,
                message: "No request content"
            });
        else
        {
            const {clubDocument} = req.files;            
            const {clubDocumentTargetDir} = req.body;
            const targetPath = path.join(process.cwd(), publicDir, clubDocumentTargetDir);            
    
            if(fs.existsSync(targetPath))            
                removeDir(targetPath);

            clubDocument.mv(path.join(targetPath + "/" + clubDocument.name));
            console.log(path.join(targetPath + "/" + clubDocument.name))   
            res.send({
                status: true,                
                clubDocumentName: clubDocument.name
            });    
        }
    }
    catch(e) { res.status(500).send(e) }
});

app.get("/get_club_document/:documentId/:clubDocumentName", (req, res) => {       
    try
    {        
        const targetPath = path.join(process.cwd(), publicDir, "club_documents", req.params.documentId, req.params.clubDocumentName );                
        res.download(targetPath);
    }
    catch(e) { res.status(500).send(e) }
});

const port = 4000;
app.listen(port, () => console.log(`Server is running on port ${port}`));