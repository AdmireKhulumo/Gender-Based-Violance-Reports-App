import React from 'react';
import Map from '../components/map';
import Navbar from '../components/navbar';

export default function dispatch() {
    return (
        <div>
            <Navbar title='Dispatch GBV Reports' redirect='/' btn='HEATMAP'/>
            <Map />
        </div>
    )
}
