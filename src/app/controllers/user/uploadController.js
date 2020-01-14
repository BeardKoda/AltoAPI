const path = require('path')

/* GET actorController. */
let controller = {
    upload:async (req, res) => {
        try {
            if(!req.files) {
                res.send({
                    status: false,
                    message: 'No file uploaded'
                });
            } else {
                //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
                let avatar = req.files.avatar;
                
                //Use the mv() method to place the file in upload directory (i.e. "uploads")
                uploaded = await avatar.mv(`src/public/uploads/` + avatar.name);
                if(!uploaded){
                    console.log('error')
                }

                console.log(uploaded)
                //send response
                res.send({
                    status: true,
                    message: 'File is uploaded',
                    data: {
                        name: avatar.name,
                        mimetype: avatar.mimetype,
                        size: avatar.size
                    }
                });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    }
}

module.exports = controller;