import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../Main.css';
import './User.css';

function User() {
    const [user, setUser] = useState({});
    const { userID } = useParams();

    useEffect(() => {
        if (!userID) {
            return;
        }
        (async () => {
            const response = await fetch(`/creepycrawler/users/${userID}`);
            const data = await response.json();
            setUser(data);
        })();
    }, [userID]);

    if (!user) {
        return null;
    }

    return (
        <ul>
            <li>
                <strong>User Id</strong> {userID}
            </li>
            <li>
                <strong>Username</strong> {user.username}
            </li>
            <li>
                <strong>Email</strong> {user.email}
            </li>
        </ul>
    );
}
export default User;
