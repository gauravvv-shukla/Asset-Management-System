import React from 'react';
import axios from 'axios';
import UpdateImage from './UpdateImage';

const  Image = (props) => {

    async function deleteAsset(){
        const res = await axios.post('/api/delete', {
            asset : props.id
        })
    }

    return (
        <div>
        <img src ={props.assetURL}  height="100" width= "100" margin-top="50px" margin-bottom="50px"/>
        <br/>
        <br/>
        <button onClick={deleteAsset}> Delete </button>
        <br/>
        <br/>
        <UpdateImage assetID = {props.id}/>
        <br/>
        </div>
    )
}

export default Image;