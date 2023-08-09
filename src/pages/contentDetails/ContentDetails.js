import axios from 'axios'

import { useEffect, useRef, useContext, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../../contexts/LoginContextProvider";
import { IsLoadingContext } from '../../contexts/IsLoadingContextProvider'
import { ContentLikedContext } from '../../contexts/ContentLikedContextProvider';
import { useContentDetailsHelper } from "../../hooks/useContentDetailsHelper";
import { useGetDataContentDetails } from "../../services/useGetDataContentDetails";
import { Spinner } from "../../components/spinner/Spinner";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import { HiOutlineChevronLeft } from "react-icons/hi";
import ratingIcon from '../../assets/ratingIcon.svg'
import { BsShareFill } from "react-icons/bs";
import "./ContentDetails.css";

import { WhatsappShareButton } from "react-share";

export const ContentDetails = () => {

  const shareUrl = 'https://www.linkedin.com/in/andres-altamura/'
  const [ isLiked, setIsLiked ] = useState(false)
  const { isLoading, setIsLoading } = useContext(IsLoadingContext); 
  const { token } = useContext(LoginContext);   
  const { contentLiked, setContentLiked } = useContext(ContentLikedContext)
  const {
    setCardContent,
    setTextDescriptionOverflowBehavior,
    titleText,
    releaseYear,
    rating,
    genresText,
    imgSrc,
    description } = useContentDetailsHelper()
  const { getData, content } = useGetDataContentDetails() 
  const { contentType, contentId } = useParams();
  const img = useRef();
  const descriptionTextRef = useRef()
  const history = useNavigate()
  
  const imageErrorHandler = ()=> {   
    img.current.src = "https://i.postimg.cc/BZNQgg6T/noImage.jpg" 
    setIsLoading(false)   
  };

  const onLoadImgHandler = ()=>{
    setIsLoading(false)
  }

  const backButtonOnClick = ()=>{
    history(-1)
  }

  const likeClickHandler = ()=>{ 
    
    
    
    if(contentType === 'tv'){
      const tvSeries = [...contentLiked.contentLiked['tvSeries']]  
      const tvSeriesId = tvSeries.map((tvSerie)=>tvSerie.id)
      const allFavorites = [...contentLiked.contentLiked['allFavorites']] 
      const allFavoritesId = allFavorites.map((content)=>content.id) 

      const isAlreadyLiked = tvSeriesId.includes(content.id)

      if(isAlreadyLiked){
        const tvContentAlreadyLikedIndex = tvSeriesId.findIndex((id)=> id === content.id)
        tvSeries.splice(tvContentAlreadyLikedIndex, 1)
        
        const favoriteContentAlreadyLikedIndex = allFavoritesId.findIndex((id)=> id === content.id)
        allFavorites.splice(favoriteContentAlreadyLikedIndex, 1)
       
        const allFavoritesSorted =  allFavorites.map((favorite, index)=> ({...favorite, 'internalId': index, contentType}))      

        const newContentLikedData = {contentLiked: {'movies': [...contentLiked.contentLiked['movies']], 'tvSeries': tvSeries, 'allFavorites': allFavoritesSorted}}
        localStorage.setItem("contentLiked", JSON.stringify(newContentLikedData))
        setContentLiked(newContentLikedData)
        setIsLiked(false)
      }
      else{
        const newContentLikedData = {contentLiked: {'movies': [...contentLiked.contentLiked['movies']], 'tvSeries': [...contentLiked.contentLiked['tvSeries'], content], 'allFavorites': [...contentLiked.contentLiked['allFavorites'], {...content, 'internalId': contentLiked.contentLiked['allFavorites'].length, contentType}]}}
        localStorage.setItem("contentLiked", JSON.stringify(newContentLikedData))
        setContentLiked(newContentLikedData)
        setIsLiked(true)
      }      
    } 

    if(contentType === 'movie'){      
      const movies = [...contentLiked.contentLiked['movies']] 
      const moviesId = movies.map((movie)=>movie.id) 
      const allFavorites = [...contentLiked.contentLiked['allFavorites']] 
      const allFavoritesId = allFavorites.map((content)=>content.id) 

      const isAlreadyLiked = moviesId.includes(content.id)

      if(isAlreadyLiked){
        const movieAlreadyLikedIndex = moviesId.findIndex((id)=> id === content.id)
        movies.splice(movieAlreadyLikedIndex, 1)

        const favoriteContentAlreadyLikedIndex = allFavoritesId.findIndex((id)=> id === content.id)
        allFavorites.splice(favoriteContentAlreadyLikedIndex, 1)
       
        const allFavoritesSorted =  allFavorites.map((favorite, index)=> ({...favorite, 'internalId': index, contentType}))
        
        const newContentLikedData = {contentLiked: {'movies': movies, 'tvSeries': [...contentLiked.contentLiked['tvSeries']], 'allFavorites': allFavoritesSorted}}

        localStorage.setItem("contentLiked", JSON.stringify(newContentLikedData))
        setContentLiked(newContentLikedData)
        setIsLiked(false)
      }
      else{
        const newContentLikedData = {contentLiked: {'movies': [...contentLiked.contentLiked['movies'], content], 'tvSeries': [...contentLiked.contentLiked['tvSeries']], 'allFavorites': [...contentLiked.contentLiked['allFavorites'], {...content, 'internalId': contentLiked.contentLiked['allFavorites'].length, contentType}]}}
        localStorage.setItem("contentLiked", JSON.stringify(newContentLikedData))
        setContentLiked(newContentLikedData)
        setIsLiked(true)
      }      
    }       

    if(contentType === 'favorites'){      
      const movies = [...contentLiked.contentLiked['movies']] 
      const moviesId = movies.map((movie)=>movie.id) 
      const tvSeries = [...contentLiked.contentLiked['tvSeries']]  
      const tvSeriesId = tvSeries.map((tvSerie)=>tvSerie.id)
      const allFavorites = [...contentLiked.contentLiked['allFavorites']] 
      const allFavoritesId = allFavorites.map((content)=>content.id) 

      const isAlreadyLiked = allFavoritesId.includes(content.id)

      if(isAlreadyLiked){
        
        if(content.contentType === 'movie'){
          const movieAlreadyLikedIndex = moviesId.findIndex((id)=> id === content.id)
          movies.splice(movieAlreadyLikedIndex, 1)
  
          const favoriteContentAlreadyLikedIndex = allFavoritesId.findIndex((id)=> id === content.id)
          allFavorites.splice(favoriteContentAlreadyLikedIndex, 1)
         
          const allFavoritesSorted =  allFavorites.map((favorite, index)=> ({...favorite, 'internalId': index}))
          
          const newContentLikedData = {contentLiked: {'movies': movies, 'tvSeries': [...contentLiked.contentLiked['tvSeries']], 'allFavorites': allFavoritesSorted}}
        
          localStorage.setItem("contentLiked", JSON.stringify(newContentLikedData))
          setContentLiked(newContentLikedData)
          setIsLiked(false)
        }

        if(content.contentType === 'tv'){
          const tvContentAlreadyLikedIndex = tvSeriesId.findIndex((id)=> id === content.id)
          tvSeries.splice(tvContentAlreadyLikedIndex, 1)
  
          const favoriteContentAlreadyLikedIndex = allFavoritesId.findIndex((id)=> id === content.id)
          allFavorites.splice(favoriteContentAlreadyLikedIndex, 1)
         
          const allFavoritesSorted =  allFavorites.map((favorite, index)=> ({...favorite, 'internalId': index}))
          
          const newContentLikedData = {contentLiked: {'movies': [...contentLiked.contentLiked['movies']], 'tvSeries': tvSeries, 'allFavorites': allFavoritesSorted}}
        
          localStorage.setItem("contentLiked", JSON.stringify(newContentLikedData))
          setContentLiked(newContentLikedData)
          setIsLiked(false)
        }       
      }         
    }     
  }

  useEffect(()=>{   
    if(contentLiked !== null){
      if(contentType === 'movie'){        
        const moviesIds = contentLiked.contentLiked['movies'].map(movie=> movie.id)      
        setIsLiked(moviesIds.includes(content.id))
      }
  
      if(contentType === 'tv'){
        const tvSeriesIds = contentLiked.contentLiked['tvSeries'].map(tvSerie=> tvSerie.id)           
        setIsLiked(tvSeriesIds.includes(content.id))
      }   

      if(contentType === 'favorites'){
        const allFavoritesIds = contentLiked.contentLiked['allFavorites'].map(favorite=> favorite.id)           
        setIsLiked(allFavoritesIds.includes(content.id))
      }   
    }    
  })

  useEffect(()=>{
    setCardContent(content, contentType) 
  },[content])

  useEffect(() => {    
    window.scrollTo(0, 0);
    getData(contentType, contentId)      
  }, []);

  useEffect(()=>{       
    setTextDescriptionOverflowBehavior(description, descriptionTextRef.current)    
  })  

  return (
    <>       
      <Spinner />        
          
      <div className={isLoading === true ? "hidden" : "contentDetailsContainer"}>
        <div className="contentDetailsGrid">
          <img
            className="poster"
            ref={img}
            src={imgSrc}
            alt={`Poster of ${titleText}`}
            onError={imageErrorHandler}
            onLoad={onLoadImgHandler}
          />
          
          <h2 className="title">{titleText}</h2>
              
          <div className="yearReleaseAndRating"> 
            <p className="yearReleaseText">{releaseYear}</p>
            <img src={ratingIcon} className="ratingIcon"/>
            <p className="ratingText">{rating}</p>
          </div>
              
          <p className="genres">{genresText}</p>   

          <p className="descriptionText" ref={descriptionTextRef}>{description}</p> 

          {
            token && 
            <>
              {
                isLiked ? <FcLike className="likeContentDetails" onClick={likeClickHandler}/> : <FcLikePlaceholder className="likeContentDetails" onClick={likeClickHandler}/>
              }
            </>
          }

          <WhatsappShareButton className="shareContentDetails"
            url={shareUrl}
            title={"huifoehiowefhioewfhiowefhioewfhioewfhio"}
            separator=":: ">          
              <BsShareFill className="shareContentDetails"/>
          </WhatsappShareButton> 



          {/* <BsShareFill className="shareContentDetails"/>     */}
        </div>
        
        <Link className="backButtonContainer" onClick={backButtonOnClick}>
              <HiOutlineChevronLeft className="backButtonIcon"/>
              <span className="backButtonText">go back</span>
        </Link>
      </div>        
    </>     
  )
}