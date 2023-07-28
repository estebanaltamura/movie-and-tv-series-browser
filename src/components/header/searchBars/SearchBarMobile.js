import { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiX } from "react-icons/fi";
import "./SearchBarMobile.css";

export const SearchBarMobile = () => {  
  const [ contentType, setContentType ] = useState("")
  const [ placeHoldertext, setPlaceholderText ] = useState("")
  const inputElement = useRef(null);
  const history = useNavigate();
  const url = useLocation()
 

  const searchSubmitHandler = (e) => {
    e.preventDefault();   
    const query = inputElement.current.value  
    history(`/searchResults/${contentType}/${query}`) 

    inputElement.current.value = "";  
    inputElement.current.blur()
  };  

  useEffect(()=>{
    const urlInParts = url.pathname.split("/")
    
    if((urlInParts.includes("searchResults") && urlInParts.includes("movie")) || urlInParts.includes("movies")){      
        setContentType("movie")
        setPlaceholderText("Search movies") 
    } 

    if((urlInParts.includes("searchResults") && urlInParts.includes("tv")) || urlInParts.includes("tvSeries")){
        setContentType("tv")
        setPlaceholderText("Search tv-series")
    }        
  },[url])
 

  return (
    <div className="seachBarMobileContainer">
      <form onSubmit={searchSubmitHandler} autoComplete="off" className="form">
        <input
          name="input"
          ref={inputElement}
          placeholder={placeHoldertext}
          className="searchInputMobile"
        ></input>
      </form>
      <div className="closeButtonSearchBarMobileContainer" id="closeButtonSearchBarMobileContainer">
        <FiX
          className="closeSearchIconMobile" id="closeSearchIcon"      
        />
      </div>
    </div>
  );
};
