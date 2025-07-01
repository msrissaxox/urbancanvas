"use client";
import React, { useEffect, useState } from "react";
import ImageUploading from "react-images-uploading";
import { createClient } from "@supabase/supabase-js";

import { onImageRemove } from "./utils/ImageRemoval";
import { handleImageUpdate } from "./utils/ImageUpdate";
import { fetchPostsandLikesandUsers } from "./utils/FetchPostsandLikesandUsers";
import { handleSubmitUtil } from "./utils/HandleSubmit";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Card({ accessToken, user }) {
  console.log("Card user prop:", user);

  const [images, setImages] = useState([]);
  const [submittedImages, setSubmittedImages] = useState([]);
  const [posts, setPosts] = useState([]); // State to store posts from the database
  const maxNumber = 1; //might have to change later
  const [submitButton, showSubmitButton] = useState(false);
  const [cancelButton, showCancelButton] = useState(false);
  const [uploadButton, showUploadButton] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [likeCount, setLikeCount] = useState("");
  const [loading, setLoading] = useState(true);

  const [updatingPostIndex, setUpdatingPostIndex] = useState(null);
  const [updateImageList, setUpdateImageList] = useState([]);

  const handleUpdateInputChange = (imgIdx, field, value) => {
    const updated = [...updateImageList];
    updated[imgIdx] = { ...updated[imgIdx], [field]: value };
    setUpdateImageList(updated);
  };

  const onUpdate = (imageList, index) =>
    handleImageUpdate({
      imageList,
      index,
      posts,
      setPosts,
      setUpdatingPostIndex,
      setUpdateImageList,
      fetchPostsandLikesandUsers,
      setLikeCount,
    });

  //fetch posts from the database
  useEffect(() => {
    fetchPostsandLikesandUsers({ user, setPosts, setLoading });
  }, [user]);

  const onChange = (imageList) => {
    const updatedList = imageList.map((props, index) => ({
      ...images[index], // Preserve existing city, state, and caption if already set
      ...props,
      userName: user?.name || "",
      city: images[index]?.city || "",
      state: images[index]?.state || "",
      caption: images[index]?.caption || "",
      isLiked: images[index]?.isLiked || false,
      like: images[index]?.like,
    }));
    setImages(updatedList);
  };

  // Update Input Fields (City, State, Caption)
  const handleInputChange = (index, field, value) => {
    const updatedImages = [...images];
    updatedImages[index] = { ...updatedImages[index], [field]: value };
    setImages(updatedImages);
  };


  // const handleSubmit = async () => {
  //   if (submitting) return;
  //   setSubmitting(true);

  //   const isValid = images.every(
  //     (image) => image.city && image.state && image.caption && image.data_url
  //   );
  //   if (!isValid) {
  //     alert("Please fill in all fields for each image.");
  //     setSubmitting(false);
  //     return;
  //   }

  //   try {
  //     const response = await fetch("/api/posts", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         user_id: user.id,
  //         caption: images[0].caption,
  //         city: images[0].city,
  //         state: images[0].state,
  //         image_url: images[0].data_url,
  //       }),
  //     });

  //     // Check for network errors
  //     if (!response.ok) {
  //       const text = await response.text();
  //       alert(`Network/API error: ${response.status} - ${text}`);
  //       setSubmitting(false);
  //       return;
  //     }

  //     const data = await response.json();
  //     if (data.success) {
  //       await fetchPostsandLikesandUsers();
  //       setImages([]);
  //       setSubmittedImages([]);
  //       showSubmitButton(false);
  //       showCancelButton(false);
  //     } else {
  //       alert("Failed to create post: " + (data.message || "Unknown error"));
  //       setImages([]);
  //       setSubmittedImages([]);
  //       showSubmitButton(false);
  //       showCancelButton(false);
  //       setSubmitting(false);
  //       return;
  //     }
  //   } catch (error) {
  //     alert("Error creating post: " + error.message);
  //     setSubmitting(false);
  //     return;
  //   }
  //   setSubmitting(false);
  // };

const handleSubmit = (e) => {
  e.preventDefault?.(); // Only if used in a form

  handleSubmitUtil({
    images,
    user,
    setSubmitting,
    submitting,
    setImages,
    setSubmittedImages,
    showSubmitButton,
    showCancelButton,
    fetchPostsandLikesandUsers,
  })
}

  //This function checks to see if the like button has been clicked.
  // If it has, it will increment the like count by 1.
  // If it hasn't, it will decrement the like count by 1.
  const handleClick = async (index) => {
    if (!user) {
      alert("Please log in to like an image.");
      return;
    }
    if (!accessToken) {
      alert("Could not get Supabase access token.");
      return;
    }
    const updatedPosts = [...posts];
    const post = updatedPosts[index];

    // Toggle the like state
    const isLiked = !post.isLiked;
    const newLikeCount = isLiked ? post.like + 1 : post.like - 1;
    setLikeCount(newLikeCount);

    updatedPosts[index] = { ...post, isLiked, like: newLikeCount };
    setPosts(updatedPosts);
    try {
      const response = await fetch(`/api/posts/likes/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Use the prop!
        },
        body: JSON.stringify({ isLiked }),
      });

      if (!response.ok) {
        console.error("Request failed:", response.url, response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!data.success) {
        console.error("Failed to update like count:", data.message);
        updatedPosts[index] = { ...post, like: data.data.like };
        setPosts(updatedPosts);
      }
    } catch (error) {
      console.error("Error updating like count:", error);
      updatedPosts[index] = { ...post };
      setPosts(updatedPosts);
    }
  };

  if (loading) {
    return (
      <div className="text-stone-100 text-center alumniSansPinstripe text-3xl">
        Loading...
      </div>
    );
  }
  console.log("user:", user);
  return (
    <div className="App">
      {user && (
        <ImageUploading
          multiple
          value={images}
          onChange={onChange}
          maxNumber={maxNumber}
          // dataURLKey="data_url"
          dataURLKey="data_url"
        >
          {({ imageList, onImageUpload, isDragging, dragProps }) => (
            // my UI
            <>
              <div className="image-item__btn-wrapper flex flex-col justify-center items-center gap-4 mt-2">
                {user && uploadButton && (
                  <button
                    className="text-2xl font-bold py-3 mt-4 leading-none border rounded text-stone-100 alumniSansPinstripe border-stone-100 hover:border-transparent hover:text-gray-500 hover:bg-stone-100 transition duration-300 w-32 text-center"
                    style={isDragging ? { color: "red" } : undefined}
                    onClick={() => {
                      onImageUpload();
                      showSubmitButton(true);
                      showCancelButton(true); // Show the Cancel button
                      showUploadButton(false);
                      setTimeout(() => {
                        showUploadButton(true); // Show the Upload button again
                      }, 1000);
                    }}
                    {...dragProps}
                  >
                    UPLOAD
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
                        className="mt-2 mb-2 text-md py-2 w-full rounded"
                        type="text"
                        placeholder="City"
                        required={true}
                        value={props.city}
                        onChange={(e) =>
                          handleInputChange(index, "city", e.target.value)
                        }
                      />
                      <input
                        className="mt-2 mb-2 text-md py-2 w-full rounded"
                        type="text"
                        placeholder="State"
                        required={true}
                        value={props.state}
                        onChange={(e) =>
                          handleInputChange(index, "state", e.target.value)
                        }
                      />

                      <input
                        className="mt-2 mb-2 text-md py-2 w-full rounded"
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
                        <p className="text-red-500 alumniSansPinstripe text-lg">
                          Caption must be at least 10 characters long.
                        </p>
                      )}

                      {props.caption && props.caption.length > 150 && (
                        <p className="text-red-500 alumniSansPinstripe text-lg">
                          Caption cannot exceed 150 characters.
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center my-2">
                {submitButton && user && (
                  <div className="flex justify-center my-4">
                    <button
                      className="text-2xl font-bold px-4 py-2 leading-none border rounded alumniSansPinstripe text-stone-100 border-stone-100 hover:border-transparent hover:text-gray-500 hover:bg-stone-100 transition duration-300 w-32 text-center"
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      {submitting ? "Submitting..." : "SUBMIT"}
                    </button>
                  </div>
                )}
              </div>
              <div>
                {cancelButton && user && (
                  <div className="flex justify-center my-4">
                    <button
                      className="text-2xl font-bold px-4 py-2 leading-none border rounded alumniSansPinstripe text-stone-100 border-stone-100 hover:border-transparent hover:text-gray-500 hover:bg-stone-100 transition duration-300 w-32 text-center"
                      onClick={() => {
                        setImages([]);
                        setSubmittedImages([]);
                        showSubmitButton(false);
                        showCancelButton(false);
                      }}
                    >
                      CANCEL
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </ImageUploading>
      )}

      {/* Display submitted images below*/}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-5 pb-5 m-5 justify-center items-center">
        {posts.map(
          (post, index) => (
            console.log(
              "post.user",
              post.user?.name ? post.user.name.split(" ")[0] : "Unknown User"
            ),
            (
              <div key={index} className="card">
                <img
                  className="w-64 h-64 self-center rounded-badge p-2 object-cover"
                  src={post.image_url}
                  alt="Uploaded"
                />
                <span className="text-stone-100 alumniSansPinstripe text-xl font-semibold flex items-center justify-center">
                  {post.user
                    ? (() => {
                        const parts = post.user.name.trim().split(" ");
                        if (parts.length === 1) return parts[0];
                        return `${parts[0]} ${parts[1][0]}.`;
                      })()
                    : "Unknown User"}
                </span>

                <div className="p-1">
                  {/* Location and Actions Row */}
                  <div className="flex flex-col justify-between w-full mb-2">
                    {/*Location */}

                    <div className="flex items-center justify-center gap-1 mb-6">
                      <span>📍</span>
                      <h5 className="text-stone-100  text-sm  alumniSansPinstripe font-bold">
                        {post.city},
                      </h5>
                      <h5 className="text-stone-100 text-sm alumniSansPinstripe font-bold">
                        {post.state}
                      </h5>
                    </div>

                    <p
                      className="text-stone-100 text-md font-bold alumniSansPinstripe flex items-start text-center justify-center h-10 md:h-20"
                      style={{ lineHeight: "1.1rem" }}
                    >
                      {post.caption || "No caption available"}
                    </p>
                  </div>

                  {/* Like & Share */}
                  <div className="flex flex-row justify-center h-7 pb-10 mb-10 md:pb-10">
                    <div className="flex justify-start items-start">
                      <svg
                        onClick={() => handleClick(index)}
                        xmlns="http://www.w3.org/2000/svg"
                        fill={post.isLiked ? "red" : "none"}
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 cursor-pointer text-stone-100"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                        />
                      </svg>

                      {post.like > 0 && (
                        <span className="text-stone-100 ">{post.like}</span>
                      )}
                    </div>
                  </div>

                  {user && post.user_id === user.id && (
                    <div className="image-item__btn-wrapper mt-4 flex flex-col gap-2">
                      {updatingPostIndex !== index && (
                        <>
                          <button
                            className="text-2xl font-bold px-4 flex-1 py-2 border rounded alumniSansPinstripe text-stone-100 border-stone-100 hover:border-transparent hover:text-gray-500 hover:bg-stone-100 transition duration-300"
                            onClick={() => setUpdatingPostIndex(index)}
                          >
                            UPDATE
                          </button>
                          <button
                            className="text-2xl font-bold px-4 flex-1 py-2 border rounded alumniSansPinstripe text-stone-100 border-stone-100 hover:border-transparent hover:text-gray-500 hover:bg-stone-100 transition duration-300"
                            onClick={() =>
                              onImageRemove(index, posts, setPosts, accessToken)
                            }
                          >
                            REMOVE
                          </button>
                        </>
                      )}
                      {updatingPostIndex === index && (
                        <ImageUploading
                          value={updateImageList}
                          onChange={(imageList) =>
                            setUpdateImageList(imageList)
                          }
                          maxNumber={1}
                          dataURLKey="data_url"
                        >
                          {({
                            imageList,
                            onImageUpload,
                            isDragging,
                            dragProps,
                          }) => (
                            <div className="flex-col items-center gap-2">
                              <button
                                className="w-full text-2xl font-bold py-3 mb-3 leading-none border rounded text-stone-100 alumniSansPinstripe border-stone-100 hover:border-transparent hover:text-gray-500 hover:bg-stone-100 transition duration-300 text-center"
                                style={
                                  isDragging ? { color: "red" } : undefined
                                }
                                onClick={onImageUpload}
                                {...dragProps}
                              >
                                CHOOSE IMAGE
                              </button>
                              {imageList.map((img, imgIdx) => (
                                <div key={imgIdx} className="image-item">
                                  <img
                                    className="w-64 h-64 rounded-lg object-cover"
                                    src={img["data_url"]}
                                    alt=""
                                  />
                                  <div className="flex flex-col gap-2 pt-2">
                                    <input
                                      className="mt-2 mb-2 text-md py-2 w-full rounded"
                                      type="text"
                                      placeholder="City"
                                      required={true}
                                      value={img.city || ""}
                                      onChange={(e) =>
                                        handleUpdateInputChange(
                                          imgIdx,
                                          "city",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <input
                                      className="mt-2 mb-2 text-md py-2 w-full rounded"
                                      type="text"
                                      placeholder="State"
                                      required={true}
                                      value={img.state || ""}
                                      onChange={(e) =>
                                        handleUpdateInputChange(
                                          imgIdx,
                                          "state",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <input
                                      type="text"
                                      className="mt-2 mb-2 text-md py-2 w-full rounded"
                                      placeholder="Tell us how this artwork moved you"
                                      required={true}
                                      maxLength={100}
                                      minLength={10}
                                      value={img.caption || ""}
                                      onChange={(e) =>
                                        handleUpdateInputChange(
                                          imgIdx,
                                          "caption",
                                          e.target.value
                                        )
                                      }
                                    />
                                    {img.caption && img.caption.length < 10 && (
                                      <p className="text-red-500 alumniSansPinstripe text-lg">
                                        Caption must be at least 10 characters
                                        long.
                                      </p>
                                    )}
                                    {img.caption &&
                                      img.caption.length > 150 && (
                                        <p className="text-red-500 alumniSansPinstripe text-lg">
                                          Caption cannot exceed 150 characters.
                                        </p>
                                      )}
                                  </div>
                                </div>
                              ))}
                              <div className="flex gap-2 w-full">
                                <button
                                  className="px-4 py-2 flex-1 bg-green-900 alumniSansPinstripe text-xl text-white rounded hover:border-transparent hover:text-white hover:bg-green-700 transition duration-300"
                                  onClick={() =>
                                    onUpdate(updateImageList, index)
                                  }
                                >
                                  SAVE
                                </button>
                                <button
                                  className="px-4 py-2 flex-1  bg-gray-600 alumniSansPinstripe text-xl text-white rounded hover:border-transparent hover:text-white hover:bg-gray-700 transition duration-300"
                                  onClick={() => {
                                    setUpdatingPostIndex(null);
                                    setUpdateImageList([]);
                                  }}
                                >
                                  CANCEL
                                </button>
                              </div>
                            </div>
                          )}
                        </ImageUploading>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}
