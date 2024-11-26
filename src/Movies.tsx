import React, {useEffect, useRef} from 'react';
import {Image, LogBox, StyleSheet, Text, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {IMAGE_SIZE, Movie, Playlist, getImageUrl} from './api';
import {playlists as playlistData} from './api/data/playlist';
import {useRememberListScroll} from './useRememberListScroll';
import {LegendList} from '@legendapp/list';

const cardStyles = StyleSheet.create({
  image: {
    width: IMAGE_SIZE.width,
    height: IMAGE_SIZE.height,
    borderRadius: 5,
  },
});

LogBox.ignoreAllLogs();

// let itemCount = 0;

const USE_LEGEND = true;
const ListComponent = USE_LEGEND ? LegendList : FlashList;
const DRAW_DISTANCE = USE_LEGEND ? 250 : 125;
const DRAW_DISTANCE_ROW = USE_LEGEND ? 500 : 250;

const MoviePortrait = ({movie}: {movie: Movie}) => {
  //   useEffect(() => {
  //     itemCount++;
  //     console.log('itemCount', itemCount);
  //   }, []);

  return (
    <Image
      source={{uri: getImageUrl(movie.poster_path)}}
      style={cardStyles.image}
      fadeDuration={0}
    />
  );
};

const MarginBetweenItems = () => <View style={{width: margins.s}} />;

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

// let rowCount = 0;

const MovieRow = ({playlist}: {playlist: Playlist}) => {
  const movies = playlistData[playlist.id]();
  const listRef = useRef<FlashList<Movie>>(null);

  //   const {onMomentumScrollBegin, onScroll} = useRememberListScroll(
  //     listRef,
  //     playlist.id,
  //   );

  //   useEffect(() => {
  //     rowCount++;
  //     console.log('rowCount', rowCount);
  //   }, []);

  return (
    <>
      <Text numberOfLines={1} style={rowStyles.title}>
        {playlist.title}
      </Text>
      <View style={rowStyles.container}>
        <ListComponent
          contentContainerStyle={rowStyles.listContainer}
          // See https://shopify.github.io/flash-list/docs/fundamentals/performant-components/#remove-key-prop
          keyExtractor={(movie: Movie, index: number) => index.toString()}
          ItemSeparatorComponent={MarginBetweenItems}
          horizontal
          estimatedItemSize={cardStyles.image.width}
          data={movies}
          renderItem={({item}: {item: Movie}) => <MoviePortrait movie={item} />}
          ref={listRef}
          //   onMomentumScrollBegin={onMomentumScrollBegin}
          //   onScroll={onScroll}
          drawDistance={DRAW_DISTANCE_ROW}
        />
      </View>
    </>
  );
};

const listStyles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    paddingVertical: margins.m,
  },
});

const App = () => {
  const playlists = require('./api/data/rows.json');

  console.log('is legend', USE_LEGEND);

  return (
    <ListComponent
      data={playlists}
      keyExtractor={(playlist: Playlist) => playlist.id}
      estimatedItemSize={cardStyles.image.height + 50}
      renderItem={({item: playlist}: {item: Playlist}) => (
        <MovieRow playlist={playlist} />
      )}
      contentContainerStyle={listStyles.container}
      drawDistance={DRAW_DISTANCE}
      recycleItems
    />
  );
};

export default App;
