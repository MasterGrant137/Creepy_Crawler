import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { readUserSettings } from '../../store/settings_store';
import '../Main.css';
import './Search_Page.css';

const SearchResultsPage = ({ style }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);

    let isUser;
    if (user && !user.errors) isUser = true;
    else isUser = false;

    useEffect(() => {
        if (isUser) dispatch(readUserSettings());
        return null;
    }, [dispatch]);

    return (
        <div>
            <p style={{ color: style.font_color }}>I live!</p>
        </div>
    );
};

export default SearchResultsPage;
