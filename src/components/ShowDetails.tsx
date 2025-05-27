import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getShow } from '../api/Client';
 import { Show } from '../types/show';
 

export default function ShowDetails() {
  const { id } = useParams();
  const [show, setShow] = useState<Show | null>(null);

  useEffect(() => {
    if (id) getShow(id).then(setShow);
  }, [id]);

  if (!show) return <div>Loading...</div>;

  return (
    <div>te
      <img src={show.poster} alt={show.title} width={300} />
      <h1>{show.title}</h1>
      <p>{show.description}</p>
      <h3>Show Times:</h3>
      <ul>
        {show.showTimes.map((time) => (
          <li key={time}>{time}</li>
        ))}
      </ul>
    </div>
  );
}