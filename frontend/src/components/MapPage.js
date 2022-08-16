import React, {useState, useEffect, Fragment} from 'react';
import Map, {Marker, Popup} from 'react-map-gl';
import { Room, Star } from "@mui/icons-material";
import {format} from 'timeago.js';
import "./mappage.css";
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';


function MapPage() {
  const [profile, setProfile] = useState("");
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState(0);
  const [viewport, setViewport] = useState({
  });


  const navigate = useNavigate();
 
  //handles popup click
  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    console.log("click being called.", lat, long);
    setViewport({ ...viewport, latitude: lat, longitude: long });
    console.log(viewport);
  };

  const handleDoubleClick = (e) => {
    try {
    const [long, lat] = e.lngLat.toArray();
    setNewPlace({
      lat,
      long
    });
  } catch (err) {
    console.log(`this is the error: ${err}`);
    //gives me lat and long coordinates
    console.log(e.lngLat);
    console.log(e);
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
      const res = await axios.post(process.env.REACT_APP_CREATE, newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getPins = async ()=> {
      try {
        const res = await axios.get(process.env.REACT_APP_ALL);
        setPins(res.data);
      } catch (err) {
        console.log(err)
      }
    };
      getPins();
  }, []);

  // const getMe = async () => {
  //   const res = await axios.get(process.env.REACT_APP);
  //   axios.defaults.withCredentials = true
  //   setData(res);
  // }

  useEffect(() => {
      fetch(process.env.REACT_APP)
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
    axios.get(process.env.REACT_APP_LOGOUT)
    .then(result => {
      localStorage.removeItem('token');
      toast.success('Logged out successfully');
      navigate('/');
    })
    .catch(error => {
      toast.message('Failure to logout');
      console.log(error);
    })
} 




  
  return (
  <div className='App' style={{ height: "100vh", width: "100%" }}>
  <Map
  /* this next line of code causes map to not zoom or move */
  mapboxAccessToken={process.env.REACT_APP_MAPBOX}
  width="100%"
  height="100%"
  transitionDuration="200"
  mapStyle="mapbox://styles/mapcake/cl6qub4s4000414oex2k1b2zn"
  onViewportChange={(viewport) => setViewport(viewport)}
  onDblClick={handleDoubleClick}
  >
  {pins.map((p)=>(
  <Fragment>
  
  <Marker
  latitude={p.lat}
  longitude={p.long}
  onDrag={false}
  offsetLeft={-3.5 * viewport.zoom}
  offsetTop={-7 * viewport.zoom}
  >

  <Room style={{ 
    fontsize: 7 * viewport.zoom, 
    color: profile.username === p.username ? 'red' : 'cyan',
    cursor: "pointer"
}}
  onClick={()=>handleMarkerClick(p._id, p.lat,p.long)}
  />

  </Marker>

  {p._id === currentPlaceId && (
 
  <Popup 
         key={p._id}
         latitude={p.lat}
         longitude={p.long}
         //when close markers move
         closeButton={true}
         closeOnClick={false}
         onClose={()=>setCurrentPlaceId(null)}
         anchor="left"
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
  onDrag={false}
  offsetLeft={-3.5 * viewport.zoom}
  offsetTop={-7 * viewport.zoom}
>
  <Room
    style={{
      fontSize: viewport.zoom * 7,
      color: "red",
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
                </form>
              </div>
  </Popup>

  </Fragment>
  )}
  <button className='logout' onClick={logOut}>Logout</button>
  </Map>
  </div>
  );
  }

export default MapPage;