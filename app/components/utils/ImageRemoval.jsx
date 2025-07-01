//Handle image Remove
export async function onImageRemove (index, posts, setPosts, accessToken){

    if (!accessToken) {
      alert("Could not get Supabase access token.");
      return;
    }

    try {
      const response = await fetch(`/api/delete/${posts[index].id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Include the session access token
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
}

