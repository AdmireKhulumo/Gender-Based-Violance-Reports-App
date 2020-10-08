import React, {useState, useEffect} from 'react'
import GoogleMapReact from 'google-map-react';
import MyLoc from '@material-ui/icons/MyLocation';
import Navbar from '../components/navbar';
import {db, firebaseApp} from '../firebase';

export default function Dispatch() {
    const [heat, setHeat] = useState([]);
    const [center, setCenter] = useState("");
    const [zoom, setZoom]=useState(12);
    const [gradient, setGradient]=useState([
    //    "rgba(0, 255, 255, 0)",//cyan
    //    "rgba(0, 255, 255, 0)",//cyan opaque
        //"rgba(200, 255, 166, 0)",//light green
       //"rgba(188, 247, 124, 1)",//opaqueish light green
        "rgba(243, 247, 124, 0)",//light yellow
        "rgba(243, 247, 124, 1)",//light yellow
        "rgba(255, 247, 0, 1)",//bright yellow
        "rgba(255, 199, 69, 1)",//light gold
        "rgba(255, 140, 69, 1)",//peach
       // "rgba(255, 115, 28, 1)",//strong peach
        "rgba(255, 109, 18, 1)",//orange
       // "rgba(255, 108, 79, 1)",//salmon red
        "rgba(255, 91, 59, 1)",//strong salmon red
        "rgba(255, 79, 43, 1)",//strong red orange
        //"rgba(127, 55, 13, 1)",//brown
        "rgba(255, 42, 0, 1)",//strong red
        "rgba(255, 0, 0, 1)",//cherry red
        "rgba(117, 0, 0, 1)",//dark maroon
        //"rgba(79, 0, 0, 1)",//deep maroon brown
        //"rgba(0, 0, 0, 1)",//black

          ]);

    useEffect(() => {
        //get user's current location, position map to focus there
        navigator.geolocation.getCurrentPosition((position)=>{
            setCenter({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })
        });

        //get reports from databse
		db.collection("reports")
			.get()
			.then(function (querySnapshot) {
				let data = [];
				querySnapshot.forEach(function (doc) {
					data.push({
						id: doc.id,
						lng: doc.data().lng,
						lat: doc.data().lat,
					});
				});
				return data;
			})
			.then((data) => {
				setHeat({
                    positions:data,
                    options:{
                        radius: 40,
                        opacity: 0.6,
                        gradient: gradient
                    }
                });
			})
			.catch((err) => console.log(err));
    }, []);


    //map options
    const mapOptions = maps=>{
        return{
            styles:[{stylers: [{'visibility':'on'},{ 'lightness': 4 }]}]
        }
    };

    //when stuff is not ready
    if (center===""){
        return <h4><i>Getting Your Location...</i></h4>
    };
    if (center!=="" && heat===[]){
        return <h4><i>Setting Map...</i></h4>
    };



    return (
        <div>
            <Navbar redirect='/dispatch' title='Danger Zones' btn='GO TO DISPATCH' />
            <div style = {{height: '100vh', width:'100%'}}>
                {center!=="" &&  heat && <GoogleMapReact
                    bootstrapURLKeys={{key: "AIzaSyDE69V0fCSm3mQWkVSwXd_F7ptJQh9wzAg", libraries:['visualization']}}
                    defaultCenter = {center}
                    defaultZoom = {zoom}
                    options={mapOptions}
                    heatmap = {heat}
                    heatmapLibrary={true}
                    visibility={true}
                >
                    {center!==[] && heat && 
                        <div 
                            style={{width:'25px', height:'25px'}} 
                            lat={center.lat}
                            lng={center.lng}>

                            <h5><i>YOU</i></h5>
                            <MyLoc 
                                style={{color: '#94e5ff'}}
                            />
                        </div>
                    }

                </GoogleMapReact>}

            </div>
        </div>

    )
}
