import React, {memo, useRef} from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import {IMAGE_SIZE, Movie, Playlist, getImageUrl} from './api';
import {playlists as playlistData} from './api/data/playlist';
import {useRememberListScroll} from './useRememberListScroll';

const cardStyles = StyleSheet.create({
  image: {
    width: IMAGE_SIZE.width,
    height: IMAGE_SIZE.height,
    borderRadius: 5,
  },
});

const MoviePortrait = memo(({movie}: {movie: Movie}) => {
  return (
    <Image
      source={{uri: getImageUrl(movie.poster_path)}}
      style={cardStyles.image}
    />
  );
});

const MarginBetweenItems = memo(() => <View style={{width: margins.s}} />);

const margins = {
  s: 5,
  m: 10,
  l: 20,
};

const rowStyles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: margins.m,
    marginBottom: margins.s,
  },
  container: {
    minHeight: cardStyles.image.height,
    marginBottom: margins.l,
  },
  listContainer: {
    paddingHorizontal: margins.m,
  },
});

const MovieRow = memo(({playlist}: {playlist: Playlist}) => {
  const movies = playlistData[playlist.id]();
  const listRef = useRef<FlatList<Movie>>(null);

  const {onMomentumScrollBegin, onScroll} = useRememberListScroll(
    listRef,
    playlist.id,
  );

  return (
    <>
      <Text numberOfLines={1} style={rowStyles.title}>
        {playlist.title}
      </Text>
      <View style={rowStyles.container}>
        <FlatList
          contentContainerStyle={rowStyles.listContainer}
          keyExtractor={(movie: Movie) => movie.id.toString()}
          ItemSeparatorComponent={MarginBetweenItems}
          horizontal
          data={movies}
          renderItem={({item}: {item: Movie}) => <MoviePortrait movie={item} />}
          ref={listRef}
          onMomentumScrollBegin={onMomentumScrollBegin}
          onScroll={onScroll}
        />
      </View>
    </>
  );
});

const listStyles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    paddingVertical: margins.m,
  },
});

const App = () => {
  const playlists = require('./api/data/rows.json');

  return (
    <FlatList
      data={playlists}
      keyExtractor={(playlist: Playlist) => playlist.id}
      renderItem={({item: playlist}: {item: Playlist}) => (
        <MovieRow playlist={playlist} />
      )}
      contentContainerStyle={listStyles.container}
    />
  );
};

export default App;
