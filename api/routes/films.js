const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const Film = require("../models/film");
const checkAuth = require("../middleware/check-auth")

const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null, "./uploads/");
    },
    filename: function(req,file,cb) {
        cb(null, new Date().toISOString().replace(':','_').replace(':','_') + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
        cb(null, true) 
    }else{
        cb(null, false)
    }

}

const upload = multer({
    storage: storage,
    limits: {fileSize: 1024*1024*5},
    fileFilter: fileFilter
});

router.get("/", checkAuth, (req, res, next)=> {
    Film.find().exec()
    .then(docs=> {
        res.status(200).json(docs);
    })
    .catch(err => res.status(500).json({error: err}));
    
});

router.post("/", checkAuth, upload.single("filmImg"), (req, res, next)=> {
    console.log(req.file);
    const film = new Film({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        filmImg: req.file.path
    });
    film.save()
    .then(result => {
        res.status(200).json({
            message: "Dodano nowa ksiazke",
            createdFilm: film
        });
    })
    .catch(err => res.status(500).json({error: err}));
    
});

router.get("/:filmId", (req, res, next)=> {
    const id = req.params.filmId;
    Film.findById(id).exec()
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => res.status(500).json({error: err}));

    
});

router.patch("/:filmId", checkAuth,upload.single("filmImg"), (req, res, next)=> {
    const id = req.params.filmId;
    console.log(req.file);
    Film.update({_id:id}, { $set: {
        name: req.body.name,
        price: req.body.price,
        filmImg: req.file.path
    }}).exec()
    .then(result=> {
        res.status(200).json({message: "Zmiana ksiazki o numerze " + id});
    })
    .catch(err => res.status(500).json({error: err}));

    
});

router.delete("/:filmId", checkAuth, (req, res, next)=> {
    const id = req.params.filmId;
    Film.remove({_id: id}).exec()
    .then(result=> {
        res.status(200).json({message: "Usunięcie ksiazki o numerze " + id});
    })
    .catch(err => res.status(500).json({error: err}));
    
});

module.exports = router;
