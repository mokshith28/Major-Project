import React, { useState } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import PagerView from 'react-native-pager-view';
import { TextDisplayStyles } from '../styles/TextDisplayStyles';

const { width } = Dimensions.get('window');

const ImageGallery = ({ images = [] }) => {
  const [currentPage, setCurrentPage] = useState(0);

  if (!images || images.length === 0) return null;

  // If only one image, use the simple display
  if (images.length === 1) {
    return (
      <View style={TextDisplayStyles.imageContainer}>
        <Image source={{ uri: images[0].uri }} style={TextDisplayStyles.capturedImage} />
      </View>
    );
  }

  return (
    <View style={TextDisplayStyles.imageContainer}>
      <Text style={TextDisplayStyles.galleryCounter}>
        {currentPage + 1} of {images.length} images
      </Text>
      <PagerView
        style={TextDisplayStyles.pagerView}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {images.map((image, index) => (
          <View key={index} style={TextDisplayStyles.imagePageContainer}>
            <Image source={{ uri: image.uri }} style={TextDisplayStyles.capturedImage} />
          </View>
        ))}
      </PagerView>
      <View style={TextDisplayStyles.paginationDots}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              TextDisplayStyles.dot,
              index === currentPage ? TextDisplayStyles.activeDot : TextDisplayStyles.inactiveDot
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default ImageGallery;
