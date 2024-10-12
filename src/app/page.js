'use client';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Menu, Select, Input, Pagination } from 'antd';
import NewsChart from './components/NewsChart';
import './style.css';
import { FacebookFilled, TwitterOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const { Option } = Select;

const News = () => {
  const [news, setNews] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [query, setQuery] = useState('all');
  const [language, setLanguage] = useState('en');
  const [sources, setSources] = useState([]);
  const [filteredSources, setFilteredSources] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [topHeadlines, setTopHeadlines] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(8);
  const [sortBy, setSortBy] = useState('publishedAt');
  const newsGridRef = useRef(null);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = news.slice(indexOfFirstArticle, indexOfLastArticle);


  const fetchNews = async () => {
    try {
      const sourcesQuery = selectedSources.length > 0 ? `&sources=${selectedSources.join(',')}` : '';
      const response = await axios.get(`https://newsapi.org/v2/everything?q=${query}&language=${language}&sortBy=${sortBy}${sourcesQuery}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`);

      const articlesMap = {};
      response.data.articles.forEach(article => {
        if (!(article.content === "[Removed]" || article.content === "" || article.description === "[Removed]" || article.description === "")) {
          const contentKey = article.content;

          if (!articlesMap[contentKey]) {
            articlesMap[contentKey] = article;
          } else {
            const existingArticleDate = new Date(articlesMap[contentKey].publishedAt);
            const newArticleDate = new Date(article.publishedAt);

            if (newArticleDate < existingArticleDate) {
              articlesMap[contentKey] = article;
            }
          }
        }
      });

      const filteredArticles = Object.values(articlesMap);



      setNews(filteredArticles);

      if (filteredArticles.length === 0) {
        toast.error("No news found.");
      }


      const activeHours = {};
      filteredArticles.forEach(article => {
        const date = new Date(article.publishedAt);
        const hourKey = `${date.getHours()}:00`;

        if (activeHours[hourKey]) {
          activeHours[hourKey].count++;
          activeHours[hourKey].sources.add(article.source.name);
        } else {
          activeHours[hourKey] = { count: 1, sources: new Set([article.source.name]) };
        }
      });

      const hourData = Object.keys(activeHours).map(hour => ({
        hour,
        count: activeHours[hour].count,
        sources: Array.from(activeHours[hour].sources)
      })).sort((a, b) => parseInt(a.hour.split(':')[0], 10) - parseInt(b.hour.split(':')[0], 10));

      setNewsData(hourData);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        toast.error("Limit reached. Please try again later.", { autoClose: 5000 });
      } else {
        console.error('Error fetching news:', error);
        toast.error("An error occurred while fetching news.", { autoClose: 5000 });
      }
    }
  };

  useEffect(() => {
    fetchNews();
  }, [query, language, selectedSources, sortBy]);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await axios.get(`https://newsapi.org/v2/sources?language=${language}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`);
        setSources(response.data.sources);
        setFilteredSources(response.data.sources);
      } catch (error) {
        console.error('Error fetching sources:', error);
        toast.error("An error occurred while fetching sources.", { autoClose: 5000 });
      }
    };

    fetchSources();
  }, [language]);


  useEffect(() => {
    const fetchTopHeadlines = async () => {
      try {
        const response = await axios.get(`https://newsapi.org/v2/top-headlines/sources?language=${language}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`);
        setTopHeadlines(response.data.sources.slice(0, 4));
      } catch (error) {
        console.error('Error fetching top headlines:', error);
        toast.error("An error occurred while fetching top headlines.", { autoClose: 5000 });
      }
    };

    fetchTopHeadlines();
  }, [language]);


  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.style.setProperty('--bg-color', darkMode ? '#f5f5f5' : '#121212');
    document.documentElement.style.setProperty('--text-color', darkMode ? '#333' : '#f5f5f5');
    document.documentElement.style.setProperty('--news-bg', darkMode ? '#fff' : '#1e1e1e');
  };
  return (
    <div className="news-container">
      <ToastContainer position="top-center" />
      <div className="navbar">
        <Image
          src="/assets/img/lightningnewslogo.png"
          alt="LightningNews"
          width={100}
          height={60}
        />
        <div className='rightnavbar'>
          <Select
            defaultValue="en"
            style={{ width: 100, marginLeft: 10 }}
            onChange={(value) => setLanguage(value)}
          >
            <Option value="en">English</Option>
            <Option value="es">Spanish</Option>
            <Option value="it">Italian</Option>
            <Option value="nl">Dutch</Option>
            <Option value="fr">French</Option>
            <Option value="de">German</Option>
            <Option value="ru">Russian</Option>

          </Select>
          <button className="toggle-mode" onClick={toggleDarkMode}>
            {darkMode ? '🌞' : '🌙'}
          </button>
        </div>
      </div>

      <Menu mode="horizontal" selectedKeys={[query]} onClick={(e) => setQuery(e.key)}>
        <Menu.Item key="all">All News</Menu.Item>
        <Menu.Item key="technology">Technology</Menu.Item>
        <Menu.Item key="sports">Sports</Menu.Item>
        <Menu.Item key="business">Business</Menu.Item>
        <Menu.Item key="health">Health</Menu.Item>
        <Menu.Item key="fun">Entertainment</Menu.Item>
        <Menu.Item key="science">Science</Menu.Item>
        <Menu.Item key="weather">Weather</Menu.Item>
        <Menu.Item key="automotive">Automotive</Menu.Item>
        <Menu.Item key="culture">Culture and Arts</Menu.Item>
        <Menu.Item key="education">Education</Menu.Item>
        <Menu.Item key="local">Local News</Menu.Item>
        <Menu.Item key="finance">Finance</Menu.Item>
        <Menu.Item key="social-media">Social Media</Menu.Item>
        <Menu.Item key="reviews">Reviews</Menu.Item>
      </Menu>
      <div className='titlefirst'>
        <h2> Lightning News</h2>

        <h4> No fluff, no delays—just the facts that shape your world.</h4>
      </div>
      <div className="search-bar">
        <Input
          placeholder="Search News..."
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: '60%', borderRadius: '20px' }}
        />
      </div>

      <div className="select-container">
        <Select
          mode="multiple"
          style={{ width: 300 }}
          placeholder="Select Sources"
          onChange={(value) => setSelectedSources(value)}
        >
          {filteredSources.map((source) => (
            <Option key={source.id} value={source.id}>{source.name}</Option>
          ))}
        </Select>
      </div>


      <div className="charts-and-headlines">
        <div className="chart-container modern-chart">
          {news.length > 0 && <NewsChart data={newsData} />}
        </div>

        {topHeadlines.length > 0 && (
          <div className="top-headlines modern-headlines">
            <h2>Top News</h2>
            <div className="headline-grid">
              {topHeadlines.map((article, index) => (
                <div className="headline-card" key={index}>

                  <div className="headline-title">{article.title}</div>
                  <div className="headline-description">{article.description || 'Açıklama yok.'}</div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="headline-link"
                  >
                    Read the news...
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className='newsheader'>
        <h1 ref={newsGridRef}> News</h1>
        <Select
          defaultValue={sortBy}
          style={{ width: 150, marginBottom: 20 }}
          onChange={(value) => setSortBy(value)}
        >
          <Option value="publishedAt">By Newest</Option>
          <Option value="popularity">By Popularity</Option>


        </Select>
      </div>
      <div className="news-grid">
        {currentArticles.length > 0 ? (
          currentArticles
            .slice()
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .map((article, index) => (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="news-card"
                key={index}
              >
                <img
                  className="news-image"
                  src={article.urlToImage || '/assets/img/lightningnewslogo.png'}
                  alt={article.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/img/lightningnewslogo.png';
                  }}
                />


                <div className="news-content">
                  <div className="news-title">{article.title}</div>
                  <div className="news-description">{article.description}</div>

                  <div className="news-card-footer">
                    <span className="read-time">
                      Reading Time: 1 min
                    </span>


                    <div className="news-footer">
                      <span>
                        {new Date(article.publishedAt).toLocaleString('en-GB', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })}
                      </span>


                      <span>{article.source.name}</span>

                    </div>
                    <div className="social-share-buttons">
                      <a
                        href={`https://twitter.com/share?text=${article.title}&url=${article.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <TwitterOutlined />
                      </a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${article.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FacebookFilled />
                      </a>
                    </div>
                  </div>


                </div>
              </a>
            ))
        ) : (
          <div>No news available.</div>
        )}
      </div>
      <div className='pagination'>
        <Pagination
          showSizeChanger={true}
          responsive={true}
          current={currentPage}
          pageSize={articlesPerPage}
          total={news.length}
          onChange={(page) => {
            setCurrentPage(page);
            newsGridRef.current.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </div>
      <footer className="footer">
        <p>&copy; 2024 LightningNews. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default News;
