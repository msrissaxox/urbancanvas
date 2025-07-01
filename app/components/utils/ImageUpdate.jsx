export async function handleImageUpdate({
  imageList,
  index,
  posts,
  setPosts,
  setUpdatingPostIndex,
  setUpdateImageList,
  fetchPostsandLikesandUsers,
  setLikeCount,
}) {
  if (!imageList[0]) return;
  const updatedImage = imageList[0].data_url;
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
        like: 0,
        isLiked: false,
      };
      setPosts(updatedPosts);
      setUpdatingPostIndex(null);
      setUpdateImageList([]);
      await fetchPostsandLikesandUsers();
      setLikeCount(0);
    } else {
      console.error("Failed to update post:", data.message);
    }
  } catch (error) {
    console.error("Error updating post:", error);
  }
}