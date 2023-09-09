import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    fetch('https://newsapi.org/v2/everything?q=tesla&from=2023-08-09&sortBy=publishedAt&apiKey=bd579e6b29a1415e85006589d6d5846d') // Replace with your backend URL if needed
      .then((response) => response.json())
      .then((data) => {
        setNewsData(data.articles);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="App">
      <h1>News App</h1>
      <div className="news-list">
        {newsData.map((article, index) => (
          <div className="news-item" key={index}>
            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <p>Published at: {new Date(article.publishedAt).toLocaleString()}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              Read more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
