import React, {useState, useEffect, Fragment} from 'react';
import Map, {Marker, Popup} from 'react-map-gl';
import { Room, Star } from "@material-ui/icons";
import axios from 'axios';
import {format} from 'timeago.js';
import "./mappage.css";
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import {ErrorBoundary} from 'react-error-boundary';
import ErrorHandler from './ErrorHandler';


function MapPage() {
  const [profile, setProfile] = useState("");
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState(0);
  const [viewport, setViewport] = useState({
    latitude: 45,
    longitude: 15,
    zoom: 4,
  });


  const navigate = useNavigate();
 
  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handleAddClick = (e) => {
    try {
    const [long, lat] = e.lngLat;
    setNewPlace({
      lat,
      long,
    });
  } catch (err) {
    console.log(`this is the error: ${err}`);
    
    console.log(newPlace);
    console.log(e.lngLat);
  }
  };

  const handleSubmit = async (e) => {
    console.log(`this is my username: ${profile.username}`)
    e.preventDefault();
    const newPin = {
      username: profile.username,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post("/api/createpin", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getPins = async ()=> {
      try {
        const res = await axios.get("/api/getpins");
        setPins(res.data);
      } catch (err) {
        console.log(err)
      }
    };
      getPins();
  }, []);

  useEffect(()=>{
    fetch('/api/getme')
    .then(res => {
      return res.json()
    })
    .then(result=>{
      console.log(result);
      setProfile(result.user);
    })
    .catch(error => {
      console.log(error);
    })
},[]);

  const logOut = () => {
    axios.get('/api/logout')
    .then(result=> {
      toast.success('Logged out successfully');
      localStorage.removeItem('token');
      navigate("/login");
    })
    .catch(error => {
      console.log(error);
    })
} 




  
  return (
  <div className="wholeMap" style={{ height: "100vh", width: "100%"}}>
  <Map
  /* this next line of code causes map to not zoom or move */
  {...viewport}
  mapboxAccessToken={process.env.REACT_APP_MAPBOX}
  width="100%"
  height="100%"
  transitionDuration="200"
  mapStyle="mapbox://styles/mapbox/streets-v9"
  onViewportChange={(viewport) => setViewport(viewport)}
  scrollZoom="true"
  onDblClick={handleAddClick}
  >
  {pins.map((p)=>(
  <Fragment>
  
  <Marker
  latitude={p.lat}
  longitude={p.long}
  offsetLeft={-3.5 * viewport.zoom}
  offsetTop={-7 * viewport.zoom}
  >

  <Room style={{ fontsize: viewport.zoom * 7, color: "slateblue", cursor: "pointer" }}
  onClick={()=>handleMarkerClick(p._id, p.lat,p.long)}
  />

  </Marker>

  {p.id === currentPlaceId && (
 
  <Popup 
         key={p._id}
         latitude={p.lat}
         longitude={p.long}
         closeButton={true}
         closeOnClick={false}
         anchor="left"
         onClose={()=>setCurrentPlaceId(null)}
         >
        <div className='card'>
        <label>Place</label>
        <h4 className='place'>{p.title}</h4>
        <label>Review</label>
        <p className="desc">{p.desc}</p>
        <label>Rating</label>
        <div className="stars">
        {Array(p.rating).fill(<Star className="star"/>)}
        </div>
        <label>Information</label>
        <span className="username">Created by <b>{p.username}</b></span>
        <span className="date">{format(p.createdAt)}</span>
        </div>
  </Popup>

  )}
  </Fragment>
  ))}
  {newPlace && (
  <Fragment>
  
  <Marker
  latitude={newPlace.lat}
  longitude={newPlace.long}
  offsetLeft={-3.5 * viewport.zoom}
  offsetTop={-7 * viewport.zoom}
>
  <Room
    style={{
      fontSize: 7 * viewport.zoom,
      color: "tomato",
      cursor: "pointer",
    }}
  />
</Marker>


  <Popup 
  latitude={newPlace.lat}
  longitude={newPlace.long}
  closeButton={true}
  closeOnClick={false}
  onClose={()=>setNewPlace(null)}
  anchor="left"
  >
  <div>
                <form>
                  <label>Title</label>
                  <input
                    placeholder="Enter a title"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Description</label>
                  <textarea
                    placeholder="Say us something about this place."
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <label>Rating</label>
                  <select onChange={(e) => setStar(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button className="submitButton" onClick={handleSubmit}>
                    Add Pin
                  </button>
                  <button className='logout' onClick={logOut}>Logout</button>
                </form>
              </div>
  </Popup>

  </Fragment>
  )}
  </Map>
  </div>
  );
  }

export default MapPage;