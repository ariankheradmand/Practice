import React from 'react';
import { useRouter } from 'next/router';

function MovieComponent() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      Movie: {id}
    </div>
  );
}

export default MovieComponent;
