import React from 'react';
import Redirect from './Redirect';
import { BrowserRouter } from 'react-router-dom';

const App = () => {
    return (
        <BrowserRouter>
            <Redirect />
        </BrowserRouter>
    );
};

export default App;
