import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from './Image';

const ImageOperations = () => {
    const [Images, setImages] = useState([]);

    async function getAsset() {
        const response = await axios.get('/api/read');
        console.log(response.data.response);
        setImages(response.data.response);
    }

    useEffect( () => {
        getAsset();
        }, []);

    return (
        <div>
        { Images.map( (image) => 
        <Image assetURL={image.assetURL} key ={image._id} id = {image._id} />
        )}
        </div>
    ) 
}


export default ImageOperations;