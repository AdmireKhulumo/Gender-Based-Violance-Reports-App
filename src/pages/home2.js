import React, {useState, useEffect} from 'react'
import GoogleMap from 'google-map-react';
import Marker from '../components/marker';
import DoneMarker from '../components/doneMarker';
import MyLoc from '@material-ui/icons/MyLocation';
import {db, firebaseApp} from '../firebase';

export default function Dispatch() {
    const [markers, setMarkers] = useState([]);
    const [center, setCenter] = useState("");
    const [zoom, setZoom]=useState(12);
    const [gradient, setGradient]=useState([
        "rgba(0, 255, 255, 0)",
        "rgba(0, 255, 255, 1)",
        "rgba(255, 248, 209, 1)",
        "rgba(255, 199, 69, 1)",
        "rgba(255, 140, 69, 1)",
        "rgba(255, 115, 28, 1)",
        "rgba(255, 109, 18, 1)",
        "rgba(255, 108, 79, 1)",
        "rgba(255, 91, 59, 1)",
        "rgba(255, 79, 43, 1)",
        "rgba(127, 55, 13, 1)",
        "rgba(255, 42, 0, 1)",
        "rgba(255, 0, 0, 1)",
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
				setMarkers({
                    positions:data,
                    options:{
                        radius: 20,
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
            styles:[{stylers: [{'visibility':'on'}]}]
        }
    };

    //when stuff is not ready
    if (center===""){
        return <h4><i>Getting Your Location...</i></h4>
    };
    if (center!=="" && markers===[]){
        return <h4><i>Setting Map...</i></h4>
    };



    return (
        <div style = {{height: '100vh', width:'100%'}}>
            {center!=="" &&  <GoogleMap
                bootstrapURLKeys={{key: "AIzaSyDE69V0fCSm3mQWkVSwXd_F7ptJQh9wzAg"}}
                defaultCenter = {center}
                defaultZoom = {zoom}
                options={mapOptions}
                heatmapLibrary={true}
                heatmap = {markers}
            >
                {center!==[] && markers && 
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

            </GoogleMap>}
        </div>
    )
}
