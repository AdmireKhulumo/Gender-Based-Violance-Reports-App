import React, {useState, useEffect} from 'react'
import GoogleMapReact from 'google-map-react';
import MyLoc from '@material-ui/icons/MyLocation';
import {db, firebaseApp} from '../firebase';

export default function Dispatch() {
    const [heatData, setHeatData] = useState();
    const [reports, setReports] = useState([]);
    const [completedReports, setCompletedReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [center, setCenter] = useState("");
    const [zoom, setZoom]=useState(12);

    useEffect( () => {
        //get user's current location, position map to focus there
        navigator.geolocation.getCurrentPosition((position)=>{
            setCenter({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })
        });

        async function getData(){
            //get reports from databse
            const reportsdb = await db.collection("reports").get();
            let reportsArray = [];
            reportsdb.docs.map(report=>{
                reportsArray.push({
                    lat: report.data().lat,
                    lng: report.data().lng
                })
            });
            setReports(reportsArray);

            const compRep =  await db.collection("completedReports").get();
            let creportsArray = [];
            compRep.docs.map(report=>{
                creportsArray.push({
                    lat: Number(report.data().lat),
                    lng: Number(report.data().lng)
                })
            });
            setCompletedReports(creportsArray);
            setLoading(false);

            // //get reports from databse
            // db.collection("completedReports")
            // .get()
            // .then(function (querySnapshot) {
            //     let data = [];
            //     querySnapshot.forEach(function (doc) {
            //         data.push({
            //             lng: doc.data().lng,
            //             lat: doc.data().lat,
            //         });
            //     });
            //     return data;
            // })
            // .then((data) => {
            //     setCompletedReports(data);
            //     console.log(loading);
            //     setLoading(false);
            //     console.log(loading);
            // })
            // .catch((err) => console.log(err));
        };

        getData();
        createData();

    }, []);

        //create the heatmap data
        const createData=()=>{
            //join both datasets into a single array
            var positionsArray = [...reports, ...completedReports];

            //create map data
            let data = {
                positions:[positionsArray],
                options:{
                    radius: 20,
                    opacity: 0.6
                }
            };

            setHeatData(data);
            console.log(heatData);
        };
        

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
    if (center!=="" && heatData===[]){
        return <h4><i>Getting Heat Map Data...</i></h4>
    };

    //

    return (
        <div style = {{height: '100vh', width:'100%'}}>
            
            {!heatData && (
                <h5>Getting heat data...</h5>
            )}

            {center!=="" && heatData.positions.lenth > 0  &&  <GoogleMapReact
                bootstrapURLKeys={{key: "AIzaSyDE69V0fCSm3mQWkVSwXd_F7ptJQh9wzAg"}}
                defaultCenter = {center}
                defaultZoom = {zoom}
                options={mapOptions}
                heatmapLibrary={true}
                heatmap = {heatData}
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

                {console.log(heatData)}



            </GoogleMapReact>}
        </div>
    )
}
