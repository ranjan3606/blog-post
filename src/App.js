import React, { useState } from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import Home from './views/Home';
import Blog from './views/Blog';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  const navigateTo = (page, blogId = null) => {
    setCurrentPage(page);
    if (blogId) {
      setSelectedBlogId(blogId);
    }
  };

  window.addEventListener('popstate', () => {
    const path = window.location.pathname;
    if (path === '/' || path === '/home') {
      setCurrentPage('home');
    } else if (path.startsWith('/blog/')) {
      const id = path.split('/')[2];
      setCurrentPage('blog');
      setSelectedBlogId(id);
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.href.includes('/blog/')) {
      e.preventDefault();
      const id = e.target.href.split('/blog/')[1];
      navigateTo('blog', id);
      window.history.pushState({}, '', `/blog/${id}`);
    }
  });

  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <h1 onClick={() => {
            navigateTo('home');
            window.history.pushState({}, '', '/');
          }}>Blog App</h1>
        </header>
        <main>
          {currentPage === 'home' && <Home />}
          {currentPage === 'blog' && <Blog id={selectedBlogId} />}
        </main>
      </div>
    </Provider>
  );
}

export default App;
