import './App.css';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function GenSpot() {
    const [selectedArtist, setSelectedArtist] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [topSongs, setTopSongs] = useState([]);

    useEffect(() => {
        var authParameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials&client_id=318ca743a1a54effa4240c69afd98168&client_secret=2d24a48406fe40dbbca35718b7d00f1b'
        }

        fetch('https://accounts.spotify.com/api/token', authParameters)
            .then(result => result.json())
            .then(data => setAccessToken(data.access_token))
            .catch(error => console.error('Error fetching access token:', error));
    }, [])

    const handleFetchTopSongs = async () => {
        try {

            if (!accessToken) {
                console.error('Access token not available.');
                return;
            }

            var searchParameters = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            }

            var artistID = await fetch('https://api.spotify.com/v1/search?q=' + selectedArtist + '&type=artist', searchParameters)
                .then(response => response.json())
                .then(data => {
                    return data.artists.items[0]?.id;
                });

            var topTracks = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/top-tracks?market=ES', searchParameters)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    return data.tracks;
                });

            setTopSongs(topTracks);

        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const handleLogin = () => {
        // Redirect to the Spotify login endpoint
        window.location.href = 'http://localhost:3000/login'; // Change the port if your backend is running on a different port
    };

    return (
        <div className="container mt-4">
            <h1>Gen Spot Application</h1>
            <div>
                <button className="btn btn-success" onClick={handleLogin}>Login with Spotify</button>
            </div>
            <br />
            <select className="form-control" value={selectedArtist} onChange={(e) => setSelectedArtist(e.target.value)}>
                <option value="">Select an Artist!</option>
                <option value="Taylor Swift">Taylor Swift</option>
                <option value="Justin Bieber">Justin Bieber</option>
                <option value="Ariana Grande">Ariana Grande</option>
                <option value="sza">SZA</option>
            </select>
            <br />
            <button className="btn btn-primary" onClick={handleFetchTopSongs}>Get Top Tracks</button>
            <br />
            <h2>Top Songs:</h2>
            <div className="row">
                {topSongs?.map((song, index) => (
                    <div className="col-md-4 mb-4" key={index}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{song.name}</h5>
                                <p className="card-text">Popularity: {song.popularity}</p>
                                <a href={song.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
                                    Listen on Spotify
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};