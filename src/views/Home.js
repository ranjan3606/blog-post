import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, searchPosts } from "../store/BlogReducer";
import { Spinner } from "reactstrap";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import Icon from "../components/Icon";
import BlogCard from "../components/BlogCard";
import { FilterDropdown } from "../components/FilterTag";

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
            <Icon 
              icon={faFilter}
              className="filter-icon p-2"
              onClick={handleFilterToggle}
              style={{
                backgroundColor: openFilter ? "#f0f0f0" : "transparent",
                borderRadius: "50%",
                transition: "all 0.2s",
              }}
            />
            <FilterDropdown
              open={openFilter}
              allTags={allTags}
              selectedTags={selectedTags}
              onTagSelect={handleTagSelect}
              onClose={() => setOpenFilter(false)}
              onApply={handleApplyFilter}
            />
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
              <BlogCard post={post} />
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
