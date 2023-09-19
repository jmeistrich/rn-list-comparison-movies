import fs from 'fs';

const API_KEY = '';

const generateTuples = (n: number): [number, number][] => {
  const tuples: [number, number][] = [];

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      tuples.push([i, j]);
    }
  }

  return tuples;
};

interface Genre {
  id: number;
  name: string;
}

const fetchGenres = async () => {
  // const response = await fetch(
  //   `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`,
  // );
  // const {genres} = await response.json();

  return require('./genres.json').genres;
};

const RANDOM_INDEXES = [
  109, 15, 116, 80, 22, 1, 155, 12, 87, 86, 108, 64, 115, 151, 153, 159, 84,
  139, 103, 60, 128, 170, 48, 90, 54, 51, 69, 111, 144, 35, 76, 41, 14, 93, 82,
  79, 146, 113, 63, 39, 57, 17, 3, 134, 19, 168, 56, 29, 47, 5, 157, 137, 156,
  149, 104, 4, 121, 100, 6, 67, 164, 160, 114, 26, 152, 27, 130, 102, 8,
];

const copyRowsFromAPI = async () => {
  const genres = await fetchGenres();
  const tuples = generateTuples(genres.length);
  const genreTuples: [Genre, Genre][] = RANDOM_INDEXES.map(i => [
    genres[tuples[i][0]],
    genres[tuples[i][1]],
  ]);

  fs.writeFileSync(
    `${__dirname}/rows.json`,
    JSON.stringify(
      genreTuples.map(tuple => ({
        id: `${tuple[0].id}-${tuple[1].id}`,
        title: `${tuple[0].name} & ${tuple[1].name}`,
      })),
    ),
  );
};

const copyMoviesFromAPI = async () => {
  const rows = require('./rows.json');

  for (const row of rows) {
    const movies = await fetchRowData(row.id.split('-').map(Number));

    fs.writeFileSync(
      `${__dirname}/playlist/${row.id}.json`,
      JSON.stringify(movies),
    );
  }
};

const fetchRowData = async (genreIds: number[]) => {
  const pages = await Promise.all(
    Array(5)
      .fill(null)
      .map(async (_, i) => {
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?with_genres=${genreIds.join(
            ',',
          )}&api_key=${API_KEY}&page=${i + 1}`,
        );
        return response.json();
      }),
  );

  return pages.map(page => page.results).flat();
};

copyRowsFromAPI();
