import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Create async thunk for fetching posts
export const fetchPosts = createAsyncThunk(
  'blog/fetchPosts',
  async () => {
    const response = await fetch('https://dummyjson.com/posts');
    const data = await response.json();
    return data.posts;
  }
);

// Create async thunk for fetching a single post
export const fetchPostById = createAsyncThunk(
  'blog/fetchPostById',
  async (id) => {
    const response = await fetch(`https://dummyjson.com/posts/${id}`);
    const data = await response.json();
    return data;
  }
);

export const fetchPostComments = createAsyncThunk(
  'blog/fetchPostComments',
  async (id) => {
    const response = await fetch(`https://dummyjson.com/posts/${id}/comments`);
    const data = await response.json();
    return data.comments;
  }
);

// Search posts by title
export const searchPosts = createAsyncThunk(
  'blog/search',
  async (searchTerm) => {
    const response = await fetch(`https://dummyjson.com/posts/search?q=${searchTerm}`);
    const data = await response.json();
    return data.posts;
  }
)

// filter by tag 
export const filterPostsByTag = createAsyncThunk(
  'blog/filterByTag',
  async (tag) => {
    const response = await fetch(`https://dummyjson.com/posts/tag/${tag}`);
    const data = await response.json();
    return data.posts;
  }
)

const initialState = {
  posts: [],
  selectedPost: null,
  status: 'idle',
  error: null,
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearSelectedPost(state) {
      state.selectedPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchPostById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(searchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchPostComments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPostComments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (state.selectedPost) {
          state.selectedPost.comments = action.payload;
        }
      })
      .addCase(fetchPostComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(filterPostsByTag.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(filterPostsByTag.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(filterPostsByTag.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
export const { clearSelectedPost } = blogSlice.actions;
export default blogSlice.reducer;