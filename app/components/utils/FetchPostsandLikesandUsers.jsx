export async function fetchPostsandLikesandUsers({ user, setPosts, setLoading }) {
  setLoading(true);
  try {
    const postResponse = await fetch("/api/posts");
    const postsData = await postResponse.json();

    if (!postsData.success) {
      console.error("Failed to fetch posts:", postsData.message);
      setPosts([]);
      setLoading(false);
      return;
    }

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
          (like) => like.post_id === post.id && like.user_id === user.id
        );
        isLiked = !!likeData;
      }
      const postUser = usersData.data.find(
        (u) => String(u.id) === String(post.user_id)
      );
      return {
        ...post,
        isLiked,
        like: likesData.data.filter((like) => like.post_id === post.id).length,
        user: postUser,
      };
    });

    setPosts(mergedPosts);
  } catch (error) {
    console.error("Error fetching posts and likes:", error);
  }
  setLoading(false);
}