import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostById,
  clearSelectedPost,
  fetchPostComments,
} from "../store/BlogReducer";
import Button from "../components/Button";
import { Badge, Card } from "reactstrap";
import Icon from "../components/Icon";
import {
  faThumbsDown,
  faThumbsUp,
  faComment,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Blog = ({ id }) => {
  const dispatch = useDispatch();
  const { selectedPost, status, error } = useSelector((state) => state.blog);
  const [newComment, setNewComment] = useState("");
  const [localComments, setLocalComments] = useState([]);

  useEffect(() => {
    dispatch(fetchPostById(id));
    dispatch(fetchPostComments(id));

    loadLocalComments();

    return () => {
      dispatch(clearSelectedPost());
    };
  }, [dispatch, id]);

  const loadLocalComments = () => {
    const storedComments = localStorage.getItem(`post-${id}-comments`);
    if (storedComments) {
      setLocalComments(JSON.parse(storedComments));
    }
  };

  const saveComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      body: newComment,
      user: {
        username: "You",
      },
      timestamp: new Date().toISOString(),
    };

    const updatedComments = [...localComments, comment];
    setLocalComments(updatedComments);
    localStorage.setItem(
      `post-${id}-comments`,
      JSON.stringify(updatedComments)
    );
    setNewComment("");
  };

  const handleBackClick = () => {
    // Navigate to home page
    window.history.pushState({}, "", "/");
    // Get the App component to update its state
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  // Handle input change for new comment
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // Handle submit comment
  const handleSubmitComment = () => {
    saveComment();
  };

  if (status === "loading") {
    return <div className="loading">Loading post...</div>;
  }

  if (status === "failed") {
    return <div className="error">Error: {error}</div>;
  }

  if (!selectedPost) {
    return <div>Post not found</div>;
  }

  const renderReactions = (reactions) => {
    if (typeof reactions === "object" && reactions !== null) {
      return (
        <div className="d-flex align-items-center mt-2">
          <div className="me-3 d-flex align-items-center">
            <Icon icon={faThumbsUp} className="text-primary me-1" />
            <span>{reactions.likes || 0}</span>
          </div>
          <div className="d-flex align-items-center">
            <Icon icon={faThumbsDown} className="text-danger me-1" />
            <span>{reactions.dislikes || 0}</span>
          </div>
        </div>
      );
    }
    return (
      <div className="d-flex align-items-center mt-2">
        <div className="me-3 d-flex align-items-center">
          <Icon icon={faThumbsUp} className="text-primary me-1" />
          <span>{reactions || 0}</span>
        </div>
      </div>
    );
  };

  // Combine API comments and local comments
  const allComments = [...(selectedPost.comments || []), ...localComments];

  return (
    <div className="blog-post-container">
      <Button onClick={handleBackClick} className="btn-sm">
        Back
      </Button>
      <Card className="p-1 mb-3 mt-2">
        <img
          src={
            selectedPost.image ||
            selectedPost.thumbnail ||
            `https://picsum.photos/seed/${selectedPost.id}/300/350`
          }
          alt={selectedPost.title || "Blog post thumbnail"}
          className="mt-1 w-full"
          height="400"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://picsum.photos/seed/${selectedPost.id}/300/350`;
          }}
        />
        <h3>{selectedPost.title}</h3>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            {selectedPost.tags?.map((tag, index) => (
              <Badge color="primary" key={index} className="me-1">
                {tag}
              </Badge>
            ))}
          </div>
          <p>{renderReactions(selectedPost.reactions)}</p>
        </div>
        <div className="post-content">
          <p>{selectedPost.body}</p>
        </div>
      </Card>

      {/* Comments section */}
      <Card className="p-4 mb-3">
        <h3 className="mb-3">
          <Icon icon={faComment} className="me-2" />
          Comments
        </h3>

        {allComments && allComments.length > 0 ? (
          <div className="comments-list">
            {allComments.map((comment) => (
              <div
                key={comment.id}
                className="comment mb-3 p-3"
                style={{ borderBottom: "1px solid #eee" }}
              >
                <div className="d-flex align-items-center mb-2">
                  <Icon icon={faUser} className="me-2 text-secondary" />
                  <strong>{comment.user?.username || "Anonymous"}</strong>
                  {comment.timestamp && (
                    <small className="text-muted ms-2">
                      {new Date(comment.timestamp).toLocaleString()}
                    </small>
                  )}
                </div>
                <p className="mb-0">{comment.body}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No comments yet.</p>
        )}
      </Card>

      {/* Add comment section */}
      <Card className="p-4">
        <h4 className="mb-3">Add a Comment</h4>
        <div className="mb-3">
          <textarea
            className="form-control"
            rows="3"
            placeholder="Write your comment here..."
            value={newComment}
            onChange={handleCommentChange}
          ></textarea>
        </div>
        <Button onClick={handleSubmitComment}>Submit Comment</Button>
      </Card>
    </div>
  );
};

export default Blog;
