'use client'
import React, {useState} from "react"
import ImageUploading from 'react-images-uploading';
import CommentSection from "./CommentSection";

export default function Card(props){
// const [like, setLike] = useState('');
// const [isLiked, setIsLiked] = useState(false);
const [images, setImages] = useState([]);
const [submittedImages, setSubmittedImages] = useState([]);
const [showCommentSection, setShowCommentSection] = useState(false); // State to manage comment section visibility
const maxNumber = 5; //might have to change later

const onChange = (imageList) => {
    const updatedList = imageList.map((props, index) => ({
      ...images[index], // Preserve existing city, state, and caption if already set
      ...props, 
      city: images[index]?.city || "", 
      state: images[index]?.state || "",
      caption: images[index]?.caption || "",
      isLiked: images[index]?.isLiked || false,
      like: images[index]?.like || 0,
    }));
    setImages(updatedList);
  };

  const handleCommentClick = () => {
    setShowCommentSection(!showCommentSection); // Toggle comment section visibility
  };

    // Update Input Fields (City, State, Caption)
    const handleInputChange = (index, field, value) => {
        const updatedImages = [...images];
        updatedImages[index] = { ...updatedImages[index], [field]: value };
        setImages(updatedImages);
      };

      //handle submit button
      const handleSubmit = () => {
        setSubmittedImages([...submittedImages, ...images]);
        setImages([]);
      };

//This function checks to see if the like button has been clicked. 
// If it has, it will increment the like count by 1. 
// If it hasn't, it will decrement the like count by 1.
const handleClick = (index) => {
//   if (isLiked) {
//     setLike(Number(like - 1))
//     setIsLiked(false);
//   } else {
//     setLike(Number(like + 1))
//     setIsLiked(true);
//   }
//   console.log("I was clicked");
// };
const updatedImages = [...submittedImages];
if (updatedImages[index]) {
    if (updatedImages[index].isLiked) {
    updatedImages[index].like -= 1;
  updatedImages[index].isLiked = false;
} else {
  updatedImages[index].like += 1;
  updatedImages[index].isLiked = true;
}
setSubmittedImages(updatedImages);
}
};

return (
<div>
<div className="App">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <button className="bg-stone-600 text-white font-bold text-xs py-1 px-1 rounded"
              style={isDragging ? { color: 'red' } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click to Upload
            </button>

            {imageList.map((props, index) => (
              <div key={index} className="image-item">
                <img className="w-full rounded-lg" src={props['data_url']} alt="" />
                <input type="text" placeholder="City" value={props.city} onChange={(e) => handleInputChange(index, 'city', e.target.value)} />
                  <input type="text" placeholder="State" value={props.state} onChange={(e) => handleInputChange(index, 'state', e.target.value)} />
                  <input type="text" placeholder="Caption" value={props.caption} onChange={(e) => handleInputChange(index, 'caption', e.target.value)} />
                
                <div className="image-item__btn-wrapper">
                  <button className="bg-stone-600 text-white font-bold text-xs py-1 px-1 rounded" onClick={() => onImageUpdate(index)}>Update</button>
                  <button className="bg-stone-600 text-white font-bold text-xs py-1 px-1 rounded" onClick={() => onImageRemove(index)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    </div>       
    <button className="bg-stone-600 text-white font-bold text-xs py-1 px-1 rounded" onClick={handleSubmit}>Submit</button>
           
<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 pb-5">
  {submittedImages.map((image, index) => (
    <div key={index} className="card">
      <img className="w-full h-50 rounded-lg" src={image['data_url']} alt="Uploaded" />

      <div className="p-6">
        {/* Location and Actions Row */}
        <div className="flex items-center justify-between w-full mb-2">
          {/* Left: Location */}
          <div className="flex items-center gap-2">
            <span className="text-white">📍</span> 
            <h5 className="text-xl text-white font-medium">{image.city}, {image.state}</h5>
          </div>

          {/* Right: Like & Comment */}
          <div className="flex items-center gap-3">
            <svg 
              onClick={()=> handleClick(index)} 
              xmlns="http://www.w3.org/2000/svg" 
              fill={image.isLiked ? 'red' : 'none'} 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="size-6 cursor-pointer text-white"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" 
              />
            </svg>
            <span className="text-white">{image.like}</span>
            <button className="text-white" onClick={handleCommentClick}>Comment</button>
          
          </div>
        </div>

        {/* Caption */}
        <p className="text-base text-white">{image.caption}</p>

         {/* Conditionally Render CommentSection */}
        {showCommentSection && <CommentSection />}

      </div>
    </div>
  ))}
</div>


    </div>)};
