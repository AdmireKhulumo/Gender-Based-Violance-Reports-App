import React, {useState, useEffect} from 'react'
import GoogleMap from 'google-map-react';
import Marker from '../components/marker';
import MyLoc from '@material-ui/icons/MyLocation';
import {db} from '../firebase';

export default function Dispatch() {
    const [markers, setMarkers] = useState([]);
    const [center, setCenter] = useState("");
    const [zoom, setZoom]=useState(12);

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
				setMarkers(data);
			})
			.catch((err) => console.log(err));
    }, []);

    if (center===""){
        return <h4><i>Getting Your Location...</i></h4>
    };
    if (center!=="" && markers===[]){
        return <h4><i>Pinning reports...</i></h4>
    };

    //when marker is clicked
    const markerClicked = (id, childProps) =>{
        console.log(id);
    };

    //map options
    const mapOptions = maps=>{
        return{
            styles:[{stylers: [{'visibility':'on'}]}]
        }
    };


    return (
        <div style = {{height: '100vh', width:'100%'}}>
            {center!=="" &&  <GoogleMap
                bootstrapURLKeys={{key: "AIzaSyDE69V0fCSm3mQWkVSwXd_F7ptJQh9wzAg"}}
                defaultCenter = {center}
                defaultZoom = {zoom}
                options={mapOptions}
                onChildClick={markerClicked}
            >
                {center!==[] && 
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

                {markers!==[] && markers.map(marker=>(
                    <Marker
                        key={marker.id}
                        lat={marker.lat}
                        lng={marker.lng}
                        
                    />
                ))}

            </GoogleMap>}
        </div>
    )
}
