import React,{ useState, useEffect }  from 'react';
import { Routes, Route } from "react-router-dom";
import Products from '../HomePage';

const RoutePage = () => {
    return(
        <>
        <Routes>
            <Route exact path ="/" element = {<Products/>} />
        </Routes>
        </>
    )
};
export default RoutePage
