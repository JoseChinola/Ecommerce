import uploadImageClodinary from "../utils/uploadImageClodinary.js"

const UploadImageController = async (req, res) => {
    try {
        const file = req.file

        const uploadImage = await uploadImageClodinary(file)

        return res.json({
            message: "upload done",
            data: uploadImage,
            success: true,
            error: false
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        })
    }
}

export default UploadImageController