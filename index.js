const multer = require('multer')
const path = require('path')
const express = require('express')

const app = express()

const storage = multer.diskStorage({
    destination : (req , file , cb) => {
        return cb(null , 'uploads/')
    },
    filename : (req , file , cb) => {
        return cb(null , file.originalname + Date.now())
    }
})

function filterFile(req , file , cb){
    const filter = /png|jpeg/
    const mimetype = filter.test(file.mimetype)
    const extname = filter.test(path.extname(file.originalname).toLowerCase())

    if(mimetype && extname){
        return cb(null , true)
    }
    else return cb(new Error('only image in the png and jpeg please insert'))
}

function fileSizeMB(x){
    return x * 1024 * 1024
}

const upload = multer({
    storage : storage ,
    fileFilter : filterFile,
    limits : {fileSize : fileSizeMB(10)}
})

app.post('/' , upload.single('file') , (req , res) => {
    if(!req.file){
        return res.status(400).send('send the image in the png or jpeg please')
    }
    return res.status(200).send('image saved successfully')
})

function error(err , req , res , next) {
    if(err instanceof multer.MulterError ){
        return (res.status(400).send('for saving the doc please make shur send the send the write doc'))
    }
    else if(err.massage){
        return res.status(404).send(err.massage)
    } 
    else return res.status(500).send('data base problem')
}

app.use(error)

const PORT = process.env.PORT || 3000 ;

app.listen(PORT , () => console.log(`listening on port ${PORT}`))