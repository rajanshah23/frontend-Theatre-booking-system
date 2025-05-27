import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getShows } from '../api/Client';
import { Show } from '../types/show';

export default function Home() {
  const [shows, setShows] = useState<Show[]>([]);

  useEffect(() => {
    getShows().then(setShows);
  }, []);

  return (
    <div>
      <h1>Now Showing</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {shows.map((show) => (
          <Link key={show.id} to={`/shows/${show.id}`}>
            <img src={show.poster} alt={show.title} width={200} />
            <h3>{show.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
