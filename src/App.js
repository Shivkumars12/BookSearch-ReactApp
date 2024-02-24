// Updated App.js

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./App.css";
import { FcGoogle } from "react-icons/fc";
import { FaSearch } from "react-icons/fa";
import { MdBookmarkAdded } from "react-icons/md";
import { IoReload } from "react-icons/io5";

function Book({ book, onBookmark }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Function to handle bookmarking a book
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked); // Toggle bookmark state
    onBookmark(book); // Call parent function to handle bookmark action
  };

  return (
    <div className={`book ${isBookmarked ? "book-bookmarked" : ""}`}>
      <img
        src={book.volumeInfo.imageLinks?.thumbnail || ""}
        alt={book.volumeInfo.title}
      />
      <div className="book-details">
        <h3>{book.volumeInfo.title}</h3>
        <p>Author: {book.volumeInfo.authors?.join(", ")}</p>
      </div>
      <input
        type="checkbox"
        className="bookmark-checkbox"
        checked={isBookmarked}
        onChange={handleBookmark}
      />
    </div>
  );
}

Book.propTypes = {
  book: PropTypes.object.isRequired,
  onBookmark: PropTypes.func.isRequired,
};

function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);

  // Function to fetch books from Google Books API
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=10`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setBooks((prevBooks) => [...prevBooks, ...data.items]);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Function to handle search for books
  const handleSearch = () => {
    setBooks([]); // Clear existing books
    setStartIndex(0); // Reset start index
    fetchBooks(); // Fetch new books
  };

  // Function to handle loading more books
  const handleLoadMore = () => {
    setStartIndex((prevIndex) => prevIndex + 10); // Increment start index
  };

  // Function to handle bookmarking a book
  const handleBookmark = (book) => {
    const isBookmarked = bookmarks.some((b) => b.id === book.id);
    if (!isBookmarked) {
      setBookmarks((prevBookmarks) => [...prevBookmarks, book]);
    } else {
      setBookmarks((prevBookmarks) =>
        prevBookmarks.filter((b) => b.id !== book.id)
      );
    }
  };

  // Effect to fetch books when query or startIndex changes
  useEffect(() => {
    if (query.trim() === "") return; // Skip fetching if query is empty
    fetchBooks();
  }, [query, startIndex]);

  return (
    <div className="parent">
      <div className="App">
        <header>
          <h1>
            Book Search Using <FcGoogle style={{ fontSize: 25 }} /> Google-API
          </h1>
          <div className="search-bar">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for books..."
            />
            <button onClick={handleSearch}>Search<FaSearch style={{marginLeft: 5}} />
</button>
          </div>
        </header>
        <div className="book-list">
          {books.map((book) => (
            <Book key={book.id} book={book} onBookmark={handleBookmark} />
          ))}
        </div>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <button onClick={handleLoadMore} disabled={loading}>
            Load More <IoReload />
          </button>
        )}
        <div className="side-panel">
          <h2>Bookmarks<MdBookmarkAdded style={{ fontSize: 25 }}/> </h2>
          <ul>
            {bookmarks.map((book) => (
              <li key={book.id}>
                <img
                  src={book.volumeInfo.imageLinks?.thumbnail || ""}
                  alt={book.volumeInfo.title}
                />
                <div className="book-details">
                  <h3>{book.volumeInfo.title}</h3>
                  <p>Author: {book.volumeInfo.authors?.join(", ")}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
