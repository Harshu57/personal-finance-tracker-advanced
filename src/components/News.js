import React, { useEffect, useState } from "react";
import { Card, Spin, Alert, Typography, Tabs, Button, Modal, Input, Skeleton, Tooltip, Tag, Statistic } from "antd";
import { 
  StockOutlined, 
  DollarOutlined, 
  GoldOutlined, 
  RocketOutlined, 
  ReloadOutlined, 
  SearchOutlined, 
  GlobalOutlined,
  RiseOutlined,
  FallOutlined,
  LineChartOutlined,
  StarOutlined,
  StarFilled
} from "@ant-design/icons";
import "./News.css";

const { Title, Paragraph, Link: AntLink } = Typography;
const { TabPane } = Tabs;

// API Keys
const FINNHUB_API_KEY = process.env.REACT_APP_FINNHUB_API_KEY || "YOUR_FINNHUB_API_KEY";
const ALPHA_VANTAGE_API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY || "YOUR_ALPHA_VANTAGE_API_KEY";
const NEWSAPI_KEY = process.env.REACT_APP_NEWS_API_KEY || "YOUR_NEWS_API_KEY";

const CATEGORY_CONFIG = [
  { key: "market", label: "Market Overview", icon: <LineChartOutlined /> },
  { key: "stocks", label: "Stocks", icon: <StockOutlined /> },
  { key: "crypto", label: "Crypto", icon: <RocketOutlined /> },
  { key: "forex", label: "Forex", icon: <GlobalOutlined /> },
  { key: "commodities", label: "Commodities", icon: <GoldOutlined /> },
];

// Stock symbols with company names
const WATCHLIST_SYMBOLS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' }
];

const CRYPTO_SYMBOLS = ['BTC', 'ETH', 'BNB', 'XRP', 'ADA'];
const FOREX_PAIRS = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/INR', 'USD/CNY'];
const COMMODITIES = ['GOLD', 'SILVER', 'CRUDE OIL', 'NATURAL GAS'];

const News = () => {
  const [marketNews, setMarketNews] = useState([]);
  const [stockPrices, setStockPrices] = useState({});
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [forexRates, setForexRates] = useState({});
  const [commodityPrices, setCommodityPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("market");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalNews, setModalNews] = useState(null);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [watchlist, setWatchlist] = useState(
    JSON.parse(localStorage.getItem('watchlist')) || []
  );

  // Fetch stock prices with proper error handling
  const fetchStockPrices = async () => {
    const prices = {};
    try {
      if (!FINNHUB_API_KEY || FINNHUB_API_KEY === "YOUR_FINNHUB_API_KEY") {
        console.error("Invalid Finnhub API key. Please set REACT_APP_FINNHUB_API_KEY in your .env file");
        return {
          AAPL: { name: 'Apple Inc.', currentPrice: 180.25, change: 2.5, percentChange: 1.4 },
          MSFT: { name: 'Microsoft Corp.', currentPrice: 375.80, change: 3.2, percentChange: 0.9 },
          GOOGL: { name: 'Alphabet Inc.', currentPrice: 140.50, change: -1.2, percentChange: -0.8 },
          AMZN: { name: 'Amazon.com Inc.', currentPrice: 145.20, change: 1.8, percentChange: 1.2 },
          TSLA: { name: 'Tesla Inc.', currentPrice: 238.45, change: -3.5, percentChange: -1.5 }
        };
      }

      for (const { symbol, name } of WATCHLIST_SYMBOLS) {
        try {
          const response = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
          );
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          
          // Validate the data
          if (data && typeof data.c === 'number') {
            prices[symbol] = {
              name,
              currentPrice: data.c,
              change: data.d,
              percentChange: data.dp,
              high: data.h,
              low: data.l,
              open: data.o,
              previousClose: data.pc,
              timestamp: new Date().toISOString()
            };
          } else {
            console.warn(`Invalid data for ${symbol}:`, data);
            // Provide fallback data
            prices[symbol] = {
              name,
              currentPrice: 0,
              change: 0,
              percentChange: 0,
              high: 0,
              low: 0,
              open: 0,
              previousClose: 0,
              timestamp: new Date().toISOString()
            };
          }
        } catch (err) {
          console.error(`Error fetching ${symbol}:`, err);
          // Provide fallback data
          prices[symbol] = {
            name,
            currentPrice: 0,
            change: 0,
            percentChange: 0,
            high: 0,
            low: 0,
            open: 0,
            previousClose: 0,
            timestamp: new Date().toISOString()
          };
        }
      }
      
      return prices;
    } catch (error) {
      console.error("Error fetching stock prices:", error);
      setError("Failed to fetch stock prices. Please try again later.");
      return {};
    }
  };

  // Fetch market news
  const fetchMarketNews = async () => {
    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`
      );
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching market news:", error);
      return [];
    }
  };

  // Fetch crypto prices
  const fetchCryptoPrices = async () => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,ripple,cardano&vs_currencies=usd&include_24hr_change=true`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching crypto prices:", error);
      return {};
    }
  };

  // Fetch forex rates
  const fetchForexRates = async () => {
    try {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/USD`
      );
      const data = await response.json();
      return data.rates;
    } catch (error) {
      console.error("Error fetching forex rates:", error);
      return {};
    }
  };

  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [news, stocks, crypto, forex] = await Promise.all([
        fetchMarketNews(),
        fetchStockPrices(),
        fetchCryptoPrices(),
        fetchForexRates(),
      ]);

      setMarketNews(news);
      setStockPrices(stocks);
      setCryptoPrices(crypto);
      setForexRates(forex);
    } catch (err) {
      setError(
        "Failed to fetch market data. Please check your internet connection or try again later."
      );
    }
    setLoading(false);
    setRefreshing(false);
  };

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Save watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (symbol) => {
    setWatchlist(prev => 
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const renderMarketOverview = () => (
    <div className="market-overview">
      <div className="market-section">
        <Title level={4}>Major Indices</Title>
        <div className="price-grid">
          {Object.entries(stockPrices).map(([symbol, data]) => (
            <Card key={symbol} className="price-card">
              <div className="price-header">
                <div className="symbol-container">
                  <span className="symbol">{symbol}</span>
                  <span className="company-name">{data?.name}</span>
                </div>
                <Button
                  type="text"
                  icon={watchlist.includes(symbol) ? <StarFilled /> : <StarOutlined />}
                  onClick={() => toggleWatchlist(symbol)}
                />
              </div>
              <Statistic
                value={data?.currentPrice}
                precision={2}
                prefix="$"
                valueStyle={{ 
                  color: (data?.change || 0) > 0 ? 'var(--success)' : 'var(--danger)',
                  fontSize: '1.5rem'
                }}
              />
              <div className="price-change">
                <Tag color={(data?.change || 0) > 0 ? 'success' : 'error'}>
                  {(data?.change || 0) > 0 ? <RiseOutlined /> : <FallOutlined />}
                  {(data?.percentChange || 0).toFixed(2)}%
                </Tag>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="market-section">
        <Title level={4}>Cryptocurrency</Title>
        <div className="price-grid">
          {Object.entries(cryptoPrices).map(([coin, data]) => (
            <Card key={coin} className="price-card">
              <div className="price-header">
                <span className="symbol">{coin.toUpperCase()}</span>
                <Button
                  type="text"
                  icon={watchlist.includes(coin) ? <StarFilled /> : <StarOutlined />}
                  onClick={() => toggleWatchlist(coin)}
                />
              </div>
              <Statistic
                value={data?.usd || 0}
                precision={2}
                prefix="$"
                valueStyle={{ 
                  color: (data?.usd_24h_change || 0) > 0 ? 'var(--success)' : 'var(--danger)' 
                }}
              />
              <div className="price-change">
                <Tag color={(data?.usd_24h_change || 0) > 0 ? 'success' : 'error'}>
                  {(data?.usd_24h_change || 0) > 0 ? <RiseOutlined /> : <FallOutlined />}
                  {(data?.usd_24h_change || 0).toFixed(2)}%
                </Tag>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="market-section">
        <Title level={4}>Latest Market News</Title>
        <div className="news-grid">
          {marketNews.slice(0, 6).map((item, idx) => (
            <Card
              key={idx}
              className="news-card"
              onClick={() => {
                setModalNews(item);
                setModalVisible(true);
              }}
            >
              {item?.image && (
                <img src={item.image} alt={item.headline} className="news-image" />
              )}
              <div className="news-content">
                <h3>{item?.headline || 'No headline available'}</h3>
                <p>{item?.summary || 'No summary available'}</p>
                <div className="news-meta">
                  <Tag>{item?.category || 'General'}</Tag>
                  <span>{item?.datetime ? new Date(item.datetime * 1000).toLocaleString() : 'No date available'}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="news-section">
      <div className="news-header-row">
        <Title level={2} style={{ marginBottom: 0 }}>
          <StockOutlined /> Investment & Market News
        </Title>
        <div style={{ display: "flex", gap: 8 }}>
          <Input
            placeholder="Search news..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Tooltip title="Refresh data">
            <Button 
              icon={<ReloadOutlined spin={refreshing} />} 
              onClick={() => {
                setRefreshing(true);
                fetchAllData();
              }}
            />
          </Tooltip>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="market-tabs"
      >
        {CATEGORY_CONFIG.map(cat => (
          <TabPane
            tab={<span>{cat.icon} {cat.label}</span>}
            key={cat.key}
          >
            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
                <p>Loading market data...</p>
              </div>
            ) : error ? (
              <Alert type="error" message={error} showIcon />
            ) : (
              activeTab === "market" ? renderMarketOverview() : null
              // Add other tab content handlers here
            )}
          </TabPane>
        ))}
      </Tabs>

      <Modal
        title={modalNews?.headline}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="read"
            type="primary"
            href={modalNews?.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read Full Article
          </Button>
        ]}
        width={800}
      >
        {modalNews?.image && (
          <img
            src={modalNews.image}
            alt={modalNews.headline}
            style={{ width: '100%', marginBottom: 16 }}
          />
        )}
        <Paragraph>{modalNews?.summary}</Paragraph>
        <div className="modal-meta">
          <Tag>{modalNews?.category}</Tag>
          <span>{modalNews?.source}</span>
          <span>{new Date(modalNews?.datetime * 1000).toLocaleString()}</span>
        </div>
      </Modal>
    </div>
  );
};

export default News; 