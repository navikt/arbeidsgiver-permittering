import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
    <Suspense fallback={<div />}>
        <App />
    </Suspense>,
    document.getElementById('root')
);
