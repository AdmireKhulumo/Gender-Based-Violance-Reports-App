import React, {useState, useEffect} from 'react'
import GoogleMap from 'google-map-react';
import Marker from '../components/marker';
import DoneMarker from '../components/doneMarker';
import MyLoc from '@material-ui/icons/MyLocation';
import {db, firebaseApp} from '../firebase';


export default function Dispatch() {
    const [markers, setMarkers] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [center, setCenter] = useState("");
    const [userEmail, setUserEmail]=useState("");
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

    //get current user
    // const user = firebaseApp.auth().currentUser;
    // if (user){
    //     setUserEmail(user.email);
    // };

    //when marker is clicked
    const markerClicked = (id, childProps) =>{
        const marker = {id:id, lat: childProps.lat, lng: childProps.lng};
        //Add to completed array
        setCompleted(prevCompleted =>{
            return [{id:id, lat: childProps.lat, lng: childProps.lng}, ...prevCompleted]
        });
        
        //remove from currently marked array
        setMarkers(prevMarkers =>{
            return prevMarkers.filter(marker => marker.id != id)
        });

        //remove from database
       deleteReport(marker);
    };

    //map options
    const mapOptions = maps=>{
        return{
            styles:[{stylers: [{'visibility':'on'},{ 'lightness': 4 }]}]
        }
    };

    //to delete a report from reports after it has been dealt with
    const deleteReport = ({id, lat, lng}) =>{
        const time = new Date();
        const user = firebaseApp.auth().currentUser;

        //add to completed reports collection
        db.collection('completedReports').doc().set({
            lat: lat,
            lng: lng,
            time: time,
            officer: user.email
        });

        //delete from reports collection
        db.collection('reports').doc(`${id}`).delete();
    };

    //when stuff is not ready
    if (center===""){
        return <h4><i>Getting Your Location...</i></h4>
    };
    if (center!=="" && markers===[]){
        return <h4><i>Pinning reports...</i></h4>
    };

    return (
        <div style = {{height: '100vh', width:'100%'}}>
            {center!=="" &&  <GoogleMap
                bootstrapURLKeys={{key: "AIzaSyDE69V0fCSm3mQWkVSwXd_F7ptJQh9wzAg", libraries:['visualization']}}
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

                {completed!==[] && completed.map(marker=>(
                    <DoneMarker
                        key={marker.id}
                        lat={marker.lat}
                        lng={marker.lng}
                        
                    />
                ))}

            </GoogleMap>}
        </div>
    )
}
