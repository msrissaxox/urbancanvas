"use client";
import React, { useState } from "react";
import ImageUploading from "react-images-uploading";
import CommentSection from "./CommentSection";
import { BsChat } from "react-icons/bs";


export default function Card(props) {

  const [images, setImages] = useState([]);
  const [submittedImages, setSubmittedImages] = useState([]);
  const [showCommentSection, setShowCommentSection] = useState(false); // State to manage comment section visibility
  const maxNumber = 1; //might have to change later
  const [submitButton, showSubmitButton] = useState(false);
  const [uploadButton, showUploadButton] = useState(true);

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
    const isValid = images.every(
      (image) =>
        image.city && image.state && image.caption && image.data_url
    );
    if (!isValid) {
      alert("Please fill in all fields for each image.");
      return;
    }
    setSubmittedImages([...submittedImages, ...images]);
    setImages([]);
  };

  //This function checks to see if the like button has been clicked.
  // If it has, it will increment the like count by 1.
  // If it hasn't, it will decrement the like count by 1.
  const handleClick = (index) => {

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
<div className="image-item__btn-wrapper flex flex-col justify-center items-center gap-4 mt-2">

{uploadButton && (  
              <button
                className="text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-500 hover:bg-white transition duration-300 w-32 text-center"
                style={isDragging ? { color: "red" } : undefined}
                onClick={() => {
                  onImageUpload();
                  showSubmitButton(true);
                  showUploadButton(false);
                  setTimeout(() => {
                    showUploadButton(true); // Show the Upload button again
                  }, 1000);
                }}
                {...dragProps}
              >
                Click to Upload
              </button>
)}
            
              {imageList.map((props, index) => (
                <div key={index} className="image-item">
                  <img
                    className="w-64 h-64 rounded-lg object-cover" 
                    src={props["data_url"]}
                    alt=""
                  />
                  <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    required={true}
                    value={props.city}
                    onChange={(e) =>
                      handleInputChange(index, "city", e.target.value)}
                    
                  />
                  <input
                    type="text"
                    placeholder="State"
                    required={true}
                    value={props.state}
                    onChange={(e) =>
                      handleInputChange(index, "state", e.target.value)
                    }
                  />
         
                  <input
                    type="text"
                    placeholder="Caption"
                    required={true}
                    value={props.caption}
                    onChange={(e) =>
                      handleInputChange(index, "caption", e.target.value)
                    }
                  />
                    </div>
                  


                  <div className="image-item__btn-wrapper">
                    <button
                      className="text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-500 hover:bg-white transition duration-300 w-32 text-center"
                      onClick={() => onImageUpdate(index)}
                    >
                      Update
                    </button>
                    <button
                      className="text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-500 hover:bg-white transition duration-300 w-32 text-center"
                      onClick={() => onImageRemove(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ImageUploading>

      </div>
      
      <div className="flex justify-center my-4">
  
  {submitButton && (  
  <div className="flex justify-center my-4">  
  
  <button
    className="text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-500 hover:bg-white transition duration-300 w-32 text-center"
    

    onClick={handleSubmit}

    >
    Submit
  </button>
</div>
  )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-5 pb-5 m-5 justify-center items-center">
        {submittedImages.map((image, index) => (
          <div key={index} className="card">
            <img
              className="w-64 h-64 self-center rounded-badge p-2 object-cover"
              src={image["data_url"]}
              alt="Uploaded"
            />

            <div className="p-1">
              {/* Location and Actions Row */}
              <div className="flex flex-col justify-between w-full mb-2">
                {/* Left: Location */}

                <div className="flex items-center justify-center gap-2">
              
                  <span className="text-white">📍</span>
                  <h5 className="text-white text-sm font-bold">
                    {image.city}, {image.state}
                  </h5>
                </div>

                {/* Like*/}
                <div className="flex flex-row justify-between">
                  <div className="flex justify-start items-start mt-2">
                  <svg
                    onClick={() => handleClick(index)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill={image.isLiked ? "red" : "none"}
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
</div>


{/* comment icon*/}
           <div className="flex justify-start items-start mt-2">
                  <button className="text-white" onClick={handleCommentClick}>
                  <BsChat className="text-white size-5 flex items-start" />
                  </button>
              </div>
</div>
              {/* Caption */}
              <p className="text-white text-sm flex items-center text-center justify-center">{image.caption}</p>

              {/* Conditionally Render CommentSection */}
              {showCommentSection && <CommentSection />}
            </div>

          </div>
          </div>
        ))}

      </div>
 </div>
      
  )
}
