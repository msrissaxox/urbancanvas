export async function handleSubmitUtil ({
    setSubmitting,
    submitting,
    showCancelButton,
    showSubmitButton,
    setSubmittedImages,
    setImages,
    images,
    user, 
    fetchPostsandLikesandUsers
}){
 if (submitting) return;
    setSubmitting(true);

    const isValid = images.every(
      (image) => image.city && image.state && image.caption && image.data_url
    );
    if (!isValid) {
      alert("Please fill in all fields for each image.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          caption: images[0].caption,
          city: images[0].city,
          state: images[0].state,
          image_url: images[0].data_url,
        }),
      });

      // Check for network errors
      if (!response.ok) {
        const text = await response.text();
        alert(`Network/API error: ${response.status} - ${text}`);
        setSubmitting(false);
        return;
      }

      const data = await response.json();
      if (data.success) {
        await fetchPostsandLikesandUsers();
        setImages([]);
        setSubmittedImages([]);
        showSubmitButton(false);
        showCancelButton(false);
      } else {
        alert("Failed to create post: " + (data.message || "Unknown error"));
        setImages([]);
        setSubmittedImages([]);
        showSubmitButton(false);
        showCancelButton(false);
        setSubmitting(false);
        return;
      }
    } catch (error) {
      alert("Error creating post: " + error.message);
      setSubmitting(false);
      return;
    }
    setSubmitting(false);

}