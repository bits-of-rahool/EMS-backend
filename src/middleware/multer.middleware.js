import multer from "multer";
const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,"./public/temp")
    },
    filename:function(req,file,cb){
        const suffix = Math.round(Math.random() * 1E9);
        cb(null,suffix+"-"+file.originalname)
    }
})

const upload=multer({
    storage,
})

export {
    upload
}