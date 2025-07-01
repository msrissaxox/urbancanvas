"use client";
import React, { useEffect, useState } from "react";
import ImageUploading from "react-images-uploading";
import {createClient } from "@supabase/supabase-js";  

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Card({accessToken, user}) {
  console.log("Card user prop:", user);
 
  const [images, setImages] = useState([]);
  const [submittedImages, setSubmittedImages] = useState([]);
  const [posts, setPosts] = useState([]); // State to store posts from the database
  const maxNumber = 1; //might have to change later
  const [submitButton, showSubmitButton] = useState(false);
  const [cancelButton, showCancelButton] = useState(false);
  const [uploadButton, showUploadButton] = useState(true);
  
  const [submitting, setSubmitting] = useState(false);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [likeCount, setLikeCount] = useState("");
  const [loading, setLoading] = useState(true);


  const [updatingPostIndex, setUpdatingPostIndex] = useState(null);
const [updateImageList, setUpdateImageList] = useState([]);


  // //Modal for share button
  // const openShareModal = () => setIsShareModalOpen(true);
  // const closeShareModal = () => setIsShareModalOpen(false);


  const handleUpdateInputChange = (imgIdx, field, value) => {
  const updated = [...updateImageList];
  updated[imgIdx] = { ...updated[imgIdx], [field]: value };
  setUpdateImageList(updated);
};

 const fetchPostsandLikesandUsers = async () => {
      setLoading(true);
      try {
        //Get the posts from the database
        // console.log("session.user.id", session.user.id);
        const postResponse = await fetch("/api/posts");
        const postsData = await postResponse.json();

        console.log("postsData", postsData);
        if (!postsData.success) {
          console.error("Failed to fetch posts:", postsData.message);
           setPosts([]);
      setLoading(false);
          return;
        }
        //Get the likes from the database
        const likeResponse = await fetch(`/api/posts/likes`);
        const likesData = await likeResponse.json();
        if (!likesData.success) {
          console.error("Failed to fetch likes:", likesData.message);
               setPosts([]);
      setLoading(false);
          return;
        }

        const userResponse = await fetch("/api/users");
        const usersData = await userResponse.json();



        const mergedPosts = postsData.data.map((post) => {
          let isLiked = false;
          if (user) {
   
            const likeData = likesData.data.find(
              (like) =>
                like.post_id === post.id && like.user_id === user.id
            );
            isLiked = !!likeData;
          }
          const postUser = usersData.data.find(
            (user) => String(user.id) === String(post.user_id)
          );
          return {
            ...post,
            isLiked,
            like: likesData.data.filter((like) => like.post_id === post.id)
              .length,
            //what to put here to get this to populate?
            user: postUser,
          };
        });
        console.log("mergedPosts", mergedPosts);
     

        setPosts(mergedPosts);
      } catch (error) {
        console.error("Error fetching posts and likes:", error);
      }
      setLoading(false);
    };

  //fetch posts from the database
  useEffect(() => {
    fetchPostsandLikesandUsers();
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


  //Handle image Update
  const handleImageUpdate = async (imageList, index) => {
  if (!imageList[0]) return;
  const updatedImage = imageList[0].data_url; // Or handle file upload if using storage
  const city = imageList[0].city;
  const state = imageList[0].state;
  const caption = imageList[0].caption;
  try {
    const response = await fetch(`/api/update/${posts[index].id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: updatedImage,
          city,
        state,
        caption,
      }),
    });
    const data = await response.json();
    if (data.success) {
      const updatedPosts = [...posts];
      updatedPosts[index] = {
        ...updatedPosts[index],
        image_url: updatedImage,
          like: 0,           // Reset likes to 0
       isLiked: false, 
      };
      setPosts(updatedPosts);
      setUpdatingPostIndex(null);
      setUpdateImageList([]);
      
          //fetch posts from the database
  await fetchPostsandLikesandUsers(); // Refresh posts after update
setLikeCount(0); // Reset like count for the updated post
    } else {
      console.error("Failed to update post:", data.message);
    }
  } catch (error) {
    console.error("Error updating post:", error);
  }
};

  //Handle image Remove
  const onImageRemove = async (index) => {

  //   const { data: { user: supaSession } } = await supabase.auth.getSession();
  // const accessToken = supaSession?.access_token;
  if (!accessToken) {
    alert("Could not get Supabase access token.");
    return;
  }
  
    try {
      const response = await fetch(`/api/delete/${posts[index].id}`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}` // Include the session access token 
        },
      });

      const data = await response.json();
      if (data.success) {
        console.log("Deleting post with id:", posts[index].id);
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
      if (submitting) return; // Prevent double submit
  setSubmitting(true);

    const isValid = images.every(
      (image) => image.city && image.state && image.caption && image.data_url
    );
    console.log("images", images);
    if (!isValid) {
      alert("Please fill in all fields for each image.");
      return;
    }

    try {
      console.log("submitting post", images[0]);
      // Send the image data to the backend
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          //this is giving me an error
          user_id: user.id, // Replace with the logged-in user's ID
          // user_id: session?.user?.oauth_id, // Use oauth_id here
          //session?.user.id || this was there before 
          caption: images[0].caption,
          city: images[0].city,
          state: images[0].state,
          image_url: images[0].data_url, // Use the uploaded image URL
          // image_url: images[0].image_url, // Use the uploaded image URL
        }),
      });

      const data = await response.json();
      if (data.success) {

      await fetchPostsandLikesandUsers(); // Refresh posts after submission
        setImages([]); // Clear the images
        setSubmittedImages([]); // Clear submitted images
        showSubmitButton(false); // Hide the submit button
        showCancelButton(false); // Hide the cancel button
      }
      else {
        console.error("Failed to create post:", data.message);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
      setSubmitting(false); // Always re-enable after done

  };

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
      "Authorization": `Bearer ${accessToken}` // Use the prop!
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
  return <div className="text-stone-100 text-center alumniSansPinstripe text-3xl">Loading...</div>;
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
                      } }
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
                        alt="" />
                      <div className="flex flex-col gap-2 pt-2">
                        <input
                                        className="mt-2 mb-2 text-md py-2 w-full rounded"

                          type="text"
                          placeholder="City"
                          required={true}
                          value={props.city}
                          onChange={(e) => handleInputChange(index, "city", e.target.value)} />
                        <input
                                        className="mt-2 mb-2 text-md py-2 w-full rounded"
                          type="text"
                          placeholder="State"
                          required={true}
                          value={props.state}
                          onChange={(e) => handleInputChange(index, "state", e.target.value)} />

                        <input
                                        className="mt-2 mb-2 text-md py-2 w-full rounded"
                          type="text"
                          placeholder="Tell us how this artwork moved you"
                          required={true}
                          maxLength={100}
                          minLength={10}
                          value={props.caption}
                          onChange={(e) => handleInputChange(index, "caption", e.target.value)} />

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
                ) 
}

      {/* Display submitted images below*/}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-5 pb-5 m-5 justify-center items-center">
        {posts.map((post, index) => (
console.log("post.user", post.user?.name ? post.user.name.split(" ")[0] : "Unknown User"),
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

                <div className="flex items-center justify-center gap-1">
                  <span>📍</span>
                  <h5 className="text-stone-100 text-md alumniSansPinstripe font-bold">{post.city},</h5>
                  <h5 className="text-stone-100 text-md alumniSansPinstripe font-bold">{post.state}</h5>
                </div>
                <p
                  className="text-stone-100 text-lg font-bold alumniSansPinstripe flex items-center  text-center justify-center h-20"
                  style={{ lineHeight: "1.5rem" }}
                >
                  {post.caption || "No caption available"}
                </p>
              </div>

              {/* Like & Share */}
              <div className="flex flex-row justify-center items-center gap-2 h-7">
                <div className="flex justify-start items-start mt-2">
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
            onClick={() => onImageRemove(index)}
          >
            REMOVE
          </button>
</>
          )}
{updatingPostIndex === index && (
  <ImageUploading
    value={updateImageList}
    onChange={(imageList) => setUpdateImageList(imageList)}
    maxNumber={1}
    dataURLKey="data_url"
  >
    {({ imageList, onImageUpload, isDragging, dragProps }) => (
      <div className="flex-col items-center gap-2">
        <button
          className="w-full text-2xl font-bold py-3 mb-3 leading-none border rounded text-stone-100 alumniSansPinstripe border-stone-100 hover:border-transparent hover:text-gray-500 hover:bg-stone-100 transition duration-300 text-center"
          style={isDragging ? { color: "red" } : undefined}
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
                onChange={e => handleUpdateInputChange(imgIdx, "city", e.target.value)}
              />
              <input
                className="mt-2 mb-2 text-md py-2 w-full rounded"
                type="text"
                placeholder="State"
                required={true}
                value={img.state || ""}
                onChange={e => handleUpdateInputChange(imgIdx, "state", e.target.value)}
              />
              <input
                type="text"
                className="mt-2 mb-2 text-md py-2 w-full rounded"
                placeholder="Tell us how this artwork moved you"
                required={true}
                maxLength={100}
                minLength={10}
                value={img.caption || ""}
                onChange={e => handleUpdateInputChange(imgIdx, "caption", e.target.value)}
              />
              {img.caption && img.caption.length < 10 && (
                <p className="text-red-500 alumniSansPinstripe text-lg">
                  Caption must be at least 10 characters long.
                </p>
              )}
              {img.caption && img.caption.length > 150 && (
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
            onClick={() => handleImageUpdate(updateImageList, index)}
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
        ))}
      </div>
    </div>
  );
}
