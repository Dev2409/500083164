import React, { useEffect, useState } from 'react';
import './App.css';

function TrainList({ trainData, onTrainSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sortType, setSortType] = useState('');

  useEffect(() => {
    const results = trainData.filter((train) =>
      train.trainNumber.includes(searchTerm)
    );
    setSearchResults(results);
  }, [searchTerm, trainData]);

  const handleSearch = () => {
    // Perform the search 
  };

  const sortTrains = (sortField) => {
    let sortedTrains = [...searchResults];
    if (sortField === 'price-asc') {
      sortedTrains.sort((a, b) => {
        const totalPriceA = a.price.sleeper + a.price.AC;
        const totalPriceB = b.price.sleeper + b.price.AC;
        return totalPriceA - totalPriceB;
      });
    } else if (sortField === 'price-desc') {
      sortedTrains.sort((a, b) => {
        const totalPriceA = a.price.sleeper + a.price.AC;
        const totalPriceB = b.price.sleeper + b.price.AC;
        return totalPriceB - totalPriceA;
      });
    } else if (sortField === 'departure-desc') {
      sortedTrains.sort((a, b) => {
        const departureTimeA = a.departureTime.Seconds + a.delayedBy * 60;
        const departureTimeB = b.departureTime.Seconds + b.delayedBy * 60;
        return departureTimeB - departureTimeA;
      });
    }
    setSearchResults(sortedTrains);
    setSortType(sortField);
  };

  return (
    <div className="container">
      <h1 className="mt-4">Train Schedule</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Train Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleSearch}>
          Search
        </button>
        <button
          className={`btn btn-primary mt-2 ms-2 ${sortType === 'price-asc' && 'active'}`}
          onClick={() => sortTrains('price-asc')}
        >
          Sort by Price (Ascending)
        </button>
        <button
          className={`btn btn-primary mt-2 ms-2 ${sortType === 'price-desc' && 'active'}`}
          onClick={() => sortTrains('price-desc')}
        >
          Sort by Price (Descending)
        </button>
        <button
          className={`btn btn-primary mt-2 ms-2 ${sortType === 'departure-desc' && 'active'}`}
          onClick={() => sortTrains('departure-desc')}
        >
          Sort by Departure Time (Descending)
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Train Name</th>
            <th>Train Number</th>
            <th>Departure Time</th>
            <th>Seats Available</th>
            <th>Price</th>
            <th>Delayed By</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((train, index) => (
            <tr key={index}>
              <td>{train.trainName}</td>
              <td>{train.trainNumber}</td>
              <td>
                {`${train.departureTime.Hours}:${train.departureTime.Minutes}:${train.departureTime.Seconds}`}
              </td>
              <td>{`Sleeper: ${train.seatsAvailable.sleeper}, AC: ${train.seatsAvailable.AC}`}</td>
              <td>{`Sleeper: ${train.price.sleeper}, AC: ${train.price.AC}`}</td>
              <td>{train.delayedBy} minutes</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => onTrainSelect(train)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TrainDetail({ train }) {
  return (
    <div className="container">
      <h1 className="mt-4">Train Details</h1>
      <p>Train Name: {train.trainName}</p>
      <p>Train Number: {train.trainNumber}</p>
      <p>
        Departure Time:{' '}
        {`${train.departureTime.Hours}:${train.departureTime.Minutes}:${train.departureTime.Seconds}`}
      </p>
      <p>
        Seats Available (Sleeper / AC):{' '}
        {`Sleeper: ${train.seatsAvailable.sleeper}, AC: ${train.seatsAvailable.AC}`}
      </p>
      <p>
        Price (Sleeper / AC):{' '}
        {`Sleeper: ${train.price.sleeper}, AC: ${train.price.AC}`}</p>
      <p>Delayed By: {train.delayedBy} minutes</p>
    </div>
  );
}

function App() {
  const [trainData, setTrainData] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);

  useEffect(() => {
    fetch('train-data.json') 
      .then((response) => response.json())
      .then((data) => setTrainData(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="App">
      {selectedTrain ? (
        <TrainDetail train={selectedTrain} />
      ) : (
        <TrainList
          trainData={trainData}
          onTrainSelect={(train) => setSelectedTrain(train)}
        />
      )}
    </div>
  );
}

export default App;
