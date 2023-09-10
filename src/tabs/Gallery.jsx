import { useEffect, useState } from 'react';

import * as ImageService from 'service/image-service';
import {
  Button,
  SearchForm,
  Grid,
  GridItem,
  Text,
  CardItem,
  CustomModal,
} from 'components';
import { Loader } from 'components/Loader/Loader';

export const Gallery = () => {
  const [value, setValue] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [isError, setIsError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [image, setImage] = useState({ src: '', alt: '' });

  useEffect(() => {
    if (!value) return;
    setIsLoading(true);
    ImageService.getImages(value, page)
      .then(({ photos, total_results }) => {
        if (!photos.length) {
          alert('Ви лузер!!!');
          setIsEmpty(true);
          return;
        }
        setImages(prevState => [...prevState, ...photos]);
        setIsLoadMore(page < Math.ceil(total_results / 15));
      })
      .catch(error => {
        setIsError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [value, page]);

  const handleLoadMore = () => {
    setPage(prevState => prevState + 1);
  };

  const onSubmit = value => {
    setValue(value);
    setPage(1);
    setImages([]);
    setIsEmpty(false);
    setIsLoadMore(false);
    setIsError('');
    setIsLoading(false);
  };

  const openModal = ({ src = '', alt = '' } = {}) => {
    setModalIsOpen(prevState => !prevState);
    setImage({ src, alt });
  };

  return (
    <>
      <SearchForm onSubmit={onSubmit} />
      <Grid>
        {images.map(({ alt, id, avg_color, src }) => (
          <GridItem key={id}>
            <CardItem color={avg_color}>
              <img
                src={src.large}
                alt={alt}
                onClick={() => {
                  openModal({ src: src.large, alt });
                }}
              />
            </CardItem>
          </GridItem>
        ))}
      </Grid>
      {isLoadMore && <Button onClick={handleLoadMore}>Load More</Button>}
      {isEmpty && (
        <Text textAlign="center">Sorry. There are no images ... 😭</Text>
      )}
      {isLoading && <Loader />}
      {modalIsOpen && (
        <CustomModal
          modalIsOpen={modalIsOpen}
          src={image.src}
          alt={image.alt}
          closeModal={openModal}
        />
      )}
      {isError && <Text textAlign="center">Sorry. {isError} ... 😭</Text>}
    </>
  );
};
