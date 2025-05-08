import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostById, clearSelectedPost, fetchPostComments } from '../store/BlogReducer';
import Button from '../components/Button';
import { Badge, Card } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown, faThumbsUp, faComment, faUser } from '@fortawesome/free-solid-svg-icons';

const Blog = ({ id }) => {
  const dispatch = useDispatch();
  const { selectedPost, status, error } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(fetchPostById(id));
    dispatch(fetchPostComments(id));
    return () => {
      dispatch(clearSelectedPost());
    };
  }, [dispatch, id]);

  const handleBackClick = () => {
    // Navigate to home page
    window.history.pushState({}, '', '/');
    // Get the App component to update its state
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (status === 'loading') {
    return <div className="loading">Loading post...</div>;
  }

  if (status === 'failed') {
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
              <FontAwesomeIcon icon={faThumbsUp} className="text-primary me-1" />
              <span>{reactions.likes || 0}</span>
            </div>
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faThumbsDown} className="text-danger me-1" />
              <span>{reactions.dislikes || 0}</span>
            </div>
          </div>
        );
      }
      return (
        <div className="d-flex align-items-center mt-2">
          <div className="me-3 d-flex align-items-center">
            <FontAwesomeIcon icon={faThumbsUp} className="text-primary me-1" />
            <span>{reactions || 0}</span>
          </div>
        </div>
      );
    };

  return (
    <div className="blog-post-container">
      <Button onClick={handleBackClick} className="btn-sm">Back</Button>
      <Card className='p-4 mb-3 mt-2'>
        <h1>{selectedPost.title}</h1>
        <div className="d-flex justify-content-between align-items-center">        
          <div>
            {selectedPost.tags?.map((tag, index) => (
              <Badge color='primary' key={index} className="me-1">{tag}</Badge>
            ))}
          </div>
          <p>{renderReactions(selectedPost.reactions)}</p>
        </div>
        <div className="post-content">
          <p>{selectedPost.body}</p>
        </div>
      </Card>
      
      {/* Comments section */}
      <Card className='p-4 mb-3'>
        <h3 className="mb-3">
          <FontAwesomeIcon icon={faComment} className="me-2" />
          Comments
        </h3>
        
        {selectedPost.comments && selectedPost.comments.length > 0 ? (
          <div className="comments-list">
            {selectedPost.comments.map(comment => (
              <div key={comment.id} className="comment mb-3 p-3" style={{borderBottom: '1px solid #eee'}}>
                <div className="d-flex align-items-center mb-2">
                  <FontAwesomeIcon icon={faUser} className="me-2 text-secondary" />
                  <strong>{comment.user?.username || 'Anonymous'}</strong>
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
      <Card className='p-4'>
        <h4 className="mb-3">Add a Comment</h4>
        <div className="mb-3">
          <textarea 
            className="form-control" 
            rows="3" 
            placeholder="Write your comment here..."
          ></textarea>
        </div>
        <Button>Submit Comment</Button>
      </Card>
    </div>
  );
};

export default Blog;