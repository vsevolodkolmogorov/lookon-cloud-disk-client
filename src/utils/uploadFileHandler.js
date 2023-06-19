import React from 'react';
import axios from 'axios';

const UploadFileHandler = async (e, folder = null, setUploading, prevImages, setImages, multiple = true) => {
    const formData = new FormData();

    if (multiple) {
        const files = e;

        for (let i = 0; i < files.length; i++) {
            formData.append('imagesUp', files[i])
        }
    } else {
        formData.append('imagesUp', e.target.files[0])
    }

    setUploading(true);

    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Folder: folder,
            },
        }

        // const { data } = await axios.post()

        // multiple ? setImages(prevImages.concat(data.data)) : setImages(data.data[0]));
        setUploading(false);
    } catch (error) {
        console.log(error);
        setUploading(false);
    }
};

export default UploadFileHandler;