"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ImageUploading from "react-images-uploading";
import { IoShareSocialOutline } from "react-icons/io5";
import SocialShareMedia from "./ui/SocialShareMedia";
import ClickAwayListener from "@mui/material/ClickAwayListener";

export default function Card(props) {
  const { data: session } = useSession(); //This gets the session data from next-auth
  const [images, setImages] = useState([]);
  const [submittedImages, setSubmittedImages] = useState([]);
  const [posts, setPosts] = useState([]); // State to store posts from the database
  const maxNumber = 1; //might have to change later
  const [submitButton, showSubmitButton] = useState(false);
  const [uploadButton, showUploadButton] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const openShareModal = () => setIsShareModalOpen(true);
  const closeShareModal = () => setIsShareModalOpen(false);

  //fetch posts from the database
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        console.log("API Response:", data);
        if (data.success) {
          console.log("Fetched posts:", data.data); // Add this line
          setPosts(data.data);
        } else {
          console.error(
            "Failed to fetch posts:",
            data.message || "No error message"
          );
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

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
  //Handle image Update
  const onImageUpdate = async (index) => {
    const updatedImage = prompt(
      "Enter a new image URL:",
      posts[index].image_url
    );
    if (updatedImage) {
      try {
        const response = await fetch(`/api/posts/${posts[index].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_url: updatedImage,
          }),
        });
        const data = await response.json();
        if (data.success) {
          const updatedPosts = [...posts];
          updatedPosts[index] = {
            ...updatedPosts[index],
            image_url: updatedImage,
          };
          setPosts(updatedPosts);
        } else {
          console.error("Failed to update post:", data.message);
        }
      } catch (error) {
        console.error("Error updating post:", error);
      }
    }
  };

  //Handle image Remove
  const onImageRemove = async (index) => {
    try {
      const response = await fetch(`/api/posts/${posts[index].id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (data.success) {
        const updatedPosts = posts.filter((_, i) => i !== index);
        setPosts(updatedPosts);
      } else {
        console.error("Failed to delete post:", data.message);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
    // const updatedImages = submittedImages.filter((_, i) => i !== index);
    // setSubmittedImages(updatedImages);
  };

  // Update Input Fields (City, State, Caption)
  const handleInputChange = (index, field, value) => {
    const updatedImages = [...images];
    updatedImages[index] = { ...updatedImages[index], [field]: value };
    setImages(updatedImages);
  };

  //handle submit button
  const handleSubmit = async () => {
    const isValid = images.every(
      (image) => image.city && image.state && image.caption && image.data_url
    );
    if (!isValid) {
      alert("Please fill in all fields for each image.");
      return;
    }
    //   setSubmittedImages([...submittedImages, ...images]);
    //   setImages([]);
    // };
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: session?.user?.id, // Replace with the logged-in user's ID
          caption: images[0].caption, // Example: Use caption as the title
          content: `${images[0].city}, ${images[0].state}`, // Example: Use city and state as content
          image_url: images[0].data_url, // Use the uploaded image URL
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPosts((prev) => [data.data, ...prev]); // Add the new post to the list
        setImages([]); // Clear the images
        setSubmittedImages([]); // Clear submitted images
        showSubmitButton(false); // Hide the submit button
      } else {
        console.error("Failed to create post:", data.message);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  //This function checks to see if the like button has been clicked.
  // If it has, it will increment the like count by 1.
  // If it hasn't, it will decrement the like count by 1.
  const handleClick = async (index) => {
    if (!session) {
      alert("Please log in to like an image.");
      return;
    }

    const updatedPosts = [...posts];
    const post = updatedPosts[index];

    // Toggle the like state
    const isLiked = !post.isLiked;


    updatedPosts[index] = { ...post, isLiked };
    setPosts(updatedPosts);


    try {
      // Send the updated like count to the backend
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isLiked, user_id: session.user.id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Check the response from the backend
      const data = await response.json();
      if (!data.success) {
        console.error("Failed to update like count:", data.message);
        // Revert the like state if the backend update fails
        updatedPosts[index] = { ...post, like: data.data.like };
        setPosts(updatedPosts);
      }
    } catch (error) {
      console.error("Error updating like count:", error);
      // Revert the like state if the request fails
      updatedPosts[index] = { ...post };
      setPosts(updatedPosts);
    }
  };



  return (
    <div>
      <div className="App">
        {session ? (
          <ImageUploading
            multiple
            value={images}
            onChange={onChange}
            maxNumber={maxNumber}
            dataURLKey="data_url"
          >
            {({ imageList, onImageUpload, isDragging, dragProps }) => (
              // my UI
              <div className="image-item__btn-wrapper flex flex-col justify-center items-center gap-4 mt-2">
                {uploadButton && (
                  <button
                    className="text-sm py-3 mt-4 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-500 hover:bg-white transition duration-300 w-32 text-center"
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
                    <div className="flex flex-col gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="City"
                        required={true}
                        value={props.city}
                        onChange={(e) =>
                          handleInputChange(index, "city", e.target.value)
                        }
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
                        placeholder="Tell us how this artwork moved you"
                        required={true}
                        maxLength={100}
                        minLength={10}
                        value={props.caption}
                        onChange={(e) =>
                          handleInputChange(index, "caption", e.target.value)
                        }
                      />

                      {props.caption && props.caption.length < 10 && (
                        <p className="text-red-500 text-sm">
                          Caption must be at least 10 characters long.
                        </p>
                      )}

                      {props.caption && props.caption.length > 150 && (
                        <p className="text-red-500 text-sm">
                          Caption cannot exceed 150 characters.
                        </p>
                      )}
                    </div>

                    <div className="image-item__btn-wrapper mt-4">
                      {session && (
                        <>
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
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ImageUploading>
        ) : (
          <></>
        )}
      </div>

      <div className="flex justify-center my-2">
        {submitButton && session && (
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

      {/* Display submitted images below*/}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-5 pb-5 m-5 justify-center items-center">
        {posts.map((post, index) => (
          <div key={index} className="card">
            <img
              className="w-64 h-64 self-center rounded-badge p-2 object-cover"
              src={post.image_url}
              alt="Uploaded"
            />

            <div className="p-1">
              {/* Location and Actions Row */}
              <div className="flex flex-col justify-between w-full mb-2">
                {/*Location */}

                <div className="flex items-center justify-center gap-2">
                  <span className="text-white">📍</span>
                  <h5 className="text-white text-sm font-bold">{post.city},</h5>
                  <h5 className="text-white text-sm font-bold">{post.state}</h5>
                </div>
                <p
                  className="text-white text-sm flex items-center text-center justify-center h-20"
                  style={{ lineHeight: "1.5rem" }}
                >
                  {post.caption || "No caption available"}
                </p>
              </div>

              {/* Like & Share */}
              <div className="flex flex-row justify-center items-center gap-2 h-8 pb-2">
                <div className="flex justify-start items-start mt-2">
                  <svg
                    onClick={() => handleClick(index)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill={post.isLiked ? "red" : "none"}
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

                  {post.like > 0 && (
                    <span className="text-white">{post.like}</span>
                  )}
                </div>

                {/* share icon*/}
                <div className="flex justify-start items-start mt-2">
                  <IoShareSocialOutline
                    className="text-white size-5 cursor-pointer"
                    onClick={openShareModal}
                  />
                  <ClickAwayListener
                    mouseEvent="onMouseDown"
                    touchEvent="onTouchStart"
                    onClickAway={closeShareModal}
                  >
                    {/* This SocialShareMedia icon is a modal that opens when the share icon is clicked */}
                    {/* It contains the share options for the image */}

                    <SocialShareMedia
                      isOpen={isShareModalOpen}
                      onClose={closeShareModal}
                    />
                  </ClickAwayListener>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// }
