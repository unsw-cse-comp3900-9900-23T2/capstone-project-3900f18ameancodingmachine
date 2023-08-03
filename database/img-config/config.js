import multer from "multer"
import path from 'path'

/**
 * image is stored in public/uploads file on the database directory
*/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      // generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

/**
 * filter images so that it only accepts image file extension such as
 * jpeg, jpg, png, and gif
 */
const imageFilter = (req, file, cb) => {
    // Check if the uploaded file is an image
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Only image files with file extension .jpeg/.jpg/.png/.gif are allowed!');
    }
  };

// middleware to handle multipart/form-data
const upload = multer({ storage: storage, fileFilter: imageFilter })

export default upload