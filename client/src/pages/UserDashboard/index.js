import React from 'react';
import { Header, Message } from "semantic-ui-react";
import { useSelector } from "react-redux";
import ImageOperations from './ImageOperations';

export const UserDashboard = () => {
    // access to the currentUser property from the auth reducer state
    const user = useSelector(state => state.auth.currentUser);
    return (
        <>
            <Message className="message-container" size="huge" secondary="true">
                <Header size="huge"> Asset Dashboard </Header>
                <p>Welcome {user ? user.email : ""}</p>
            </Message>
            <div className='container'>
            <ImageOperations />
            </div>
        </>
    )
}

export default UserDashboard;
