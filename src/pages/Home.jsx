import React, { useEffect, useState } from 'react';
import { fetchCryptos } from '../api/coinGecko';
import CryptoCard from '../components/CryptoCard'

const Home = () => {
  const [cryptoList, setCryptoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("market_cap_rank");
  const [filteredList, setFilteredList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCryptoData();
  }, [])

  useEffect(() => {
    filterAndSort();
  }, [sortBy, cryptoList,searchQuery]);


  const fetchCryptoData = async () => {
    try {
      const data = await fetchCryptos();
      console.log(data);
      setCryptoList(data);

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  const filterAndSort = () => {
    const filtered = cryptoList.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );


    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.current_price - b.current_price;
        case "price_desc":
          return b.current_price - a.current_price;
        case "change":
          return a.price_change_percentage_24h - b.price_change_percentage_24h;
        case "market_cap":
          return a.market_cap - b.market_cap;
        default:
          return a.market_cap_rank - b.market_cap_rank;
      }
    });

    setFilteredList(filtered);
  };

  return (
    <div className='app'>
      <header>
        <div className='header-content'>
          <div className='logo-section'>
            <h1>Crypto Tracker</h1>
            <p>Real-Time Cryptocurrency Prices and Market Data</p>
          </div>

          <div className='search-section'>
            <input type="text"
              placeholder='search cryptos'
              className='search-input'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>
      <div className='controls'>
        <div className='filter-group'>
          <label>Sort by:</label>

          <select value={sortBy} onChange={(e) => { setSortBy(e.target.value) }} >
            <option value="market_cap_rank">Rank</option>
            <option value="name">Name</option>
            <option value="price">Price (Low to High)</option>
            <option value="price_desc">Price (High to Low)</option>
            <option value="change">24h Change</option>
            <option value="market_cap">Market Cap</option>
          </select>

          <div className='view-toggle'>
            <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => { setViewMode('grid') }} >Grid</button>
            <button className={viewMode === 'list' ? 'active' : ''} onClick={() => { setViewMode('list') }} >List</button>
          </div>
        </div>
      </div>

      {isLoading ?
        (<div className='loading'>
          <div className='spinner'></div>
          <p>Loading Crypto Data ....</p>
        </div>)
        : <div className={`crypto-container ${viewMode}`}>
          {filteredList.map((crypto, key) => (
            <CryptoCard crypto={crypto} key={key} />
          ))}
        </div>}
    </div>
  )
}

export default Home