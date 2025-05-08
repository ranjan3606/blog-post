import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, searchPosts } from "../store/BlogReducer";
import { Card, Badge, Spinner } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown,
  faFilter,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const dispatch = useDispatch();
  const { posts, status, error } = useSelector((state) => state.blog);
  const [searchTerm, setSearchTerm] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const filterRef = useRef(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (posts.length > 0) {
      const tagSet = new Set();
      posts.forEach((post) => {
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach((tag) => tagSet.add(tag));
        }
      });
      setAllTags(Array.from(tagSet));
    }
  }, [posts]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setOpenFilter(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);

  if (status === "failed") {
    return <div className="error">Error: {error}</div>;
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

  const handleSearch = (term) => {
    setSearchTerm(term);

    if (term.trim() === "") {
      dispatch(fetchPosts());
    } else if (term.trim().length > 3) {
      dispatch(searchPosts(term));
    }
  };

  const handleFilterToggle = () => {
    setOpenFilter((prev) => !prev);
  };

  const handleTagSelect = (tag) => {
    setSelectedTags((prevTags) => {
      const newTags = prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag];

      if (newTags.length === 0) {
        dispatch(fetchPosts());
      } else {
        updateFilteredPosts(newTags);
      }

      return newTags;
    });
  };

  const updateFilteredPosts = (tagsToUse) => {
    if (tagsToUse.length === 0) {
      dispatch(fetchPosts());
      return;
    }

    const filteredPosts = posts.filter((post) => {
      if (!post.tags || !Array.isArray(post.tags)) return false;

      return tagsToUse.some((tag) => post.tags.includes(tag));
    });

    dispatch({
      type: "blog/filterByTag/fulfilled",
      payload: filteredPosts,
    });
  };

  const handleApplyFilter = () => {
    setOpenFilter(false);
    if (selectedTags.length > 0) {
      updateFilteredPosts(selectedTags);
    } else {
      dispatch(fetchPosts());
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Blog Posts</h2>
        <div className="d-flex align-items-center">
          <div className="search-bar me-3">
            <input
              type="text"
              placeholder="Search..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch(e.target.value);
                }
              }}
            />
          </div>
          <div className="filter-container position-relative" ref={filterRef}>
            <FontAwesomeIcon
              icon={faFilter}
              className="filter-icon p-2"
              onClick={handleFilterToggle}
              style={{
                cursor: "pointer",
                backgroundColor: openFilter ? "#f0f0f0" : "transparent",
                borderRadius: "50%",
                transition: "all 0.2s",
              }}
            />
            {openFilter && (
              <div
                className="filter-dropdown position-absolute"
                style={{
                  top: "100%",
                  right: 0,
                  minWidth: "250px",
                  backgroundColor: "white",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "15px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  zIndex: 1000,
                  marginTop: "5px",
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="m-0">Filter by Tags</h6>
                  <FontAwesomeIcon
                    icon={faTimes}
                    onClick={() => setOpenFilter(false)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <div
                  className="tag-container mb-3"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {allTags.length > 0 ? (
                    <div className="d-flex flex-wrap">
                      {allTags.map((tag) => (
                        <div
                          key={tag}
                          onClick={() => handleTagSelect(tag)}
                          className={`badge ${
                            selectedTags.includes(tag)
                              ? "bg-primary"
                              : "bg-secondary"
                          } m-1`}
                          style={{
                            cursor: "pointer",
                            padding: "8px",
                            fontSize: "0.65rem",
                          }}
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No tags available</p>
                  )}
                </div>
                {selectedTags.length > 0 && (
                  <div className="selected-tags mb-3">
                    <p className="mb-1">Selected Tags:</p>
                    <div className="d-flex flex-wrap">
                      {selectedTags.map((tag) => (
                        <span key={tag} className="badge bg-primary me-1 mb-1">
                          {tag}
                          <span
                            onClick={() => handleTagSelect(tag)}
                            style={{ marginLeft: "5px", cursor: "pointer" }}
                          >
                            ×
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  className="btn btn-primary w-100"
                  onClick={handleApplyFilter}
                >
                  Apply Filter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="row">
        {status === "loading" ? (
          <div className="col-12 text-center py-5">
            <Spinner color="primary" />
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div className="col-md-4 mb-3" key={post.id}>
              <Card className="max-w-md p-1">
                <div className="w-100 mb-2">
                  {post.tags && post.tags.length > 0 && (
                    <div className="d-flex flex-wrap">
                      {post.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          color="primary"
                          className="me-1 mb-1"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <h4 className="mt-1 text-3xl font-extrabold text-[#1a1a1a] leading-tight">
                  {post.title.length > 30
                    ? `${post.title.substring(0, 30)}...`
                    : post.title}
                </h4>
                <img
                  src={
                    post.image ||
                    post.thumbnail ||
                    `https://picsum.photos/seed/${post.id}/300/150`
                  }
                  alt={post.title || "Blog post thumbnail"}
                  className="mt-1 rounded-lg w-full"
                  height="150"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://picsum.photos/seed/${post.id}/300/150`;
                  }}
                />
                <p className="mt-1 mb-0 text-gray-700 text-base leading-relaxed">
                  {post.body.length > 50
                    ? `${post.body.substring(0, 50)}...`
                    : post.body}
                </p>
                {renderReactions(post.reactions)}
                <div className="text-center">
                  {" "}
                  <a
                    className="w-50 btn btn-primary btn-sm text-white mb-1 mt-2"
                    href={`/blog/${post.id}`}
                  >
                    Read More
                  </a>
                </div>
              </Card>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <h4 className="text-muted">No posts available</h4>
            <p className="text-muted">Try different search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
