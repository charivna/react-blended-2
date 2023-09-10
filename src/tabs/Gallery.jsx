import { Component } from 'react';

import * as ImageService from 'service/image-service';
import { Button, SearchForm, Grid, GridItem, Text, CardItem, CustomModal } from 'components';
import { Loader } from 'components/Loader/Loader';

export class Gallery extends Component {
  state = {
    value: '',
    page: 1,
    images: [],
    isEmpty: false,
    isLoadMore: false,
    isError: '',
    isLoading: false,
    modalIsOpen: false,
    src: '',
    alt: '',
  };

  componentDidUpdate(_, prevState) {
    const { value, page } = this.state;
    if (prevState.value !== value || prevState.page !== page) {
      this.setState({
        isLoading: true,
      })
      ImageService.getImages(value, page)
        .then(({ photos, total_results }) => {
          if (!photos.length) {
            alert('Ви лузер!!!');
            this.setState({ isEmpty: true });
            return;
          }
          this.setState(prevState => ({
            images: [...prevState.images, ...photos],
            isLoadMore: page < Math.ceil(total_results / 15),
          }));
        })
        .catch(error => {
          this.setState({ isError: error.message });
        })
        .finally(() => {
          this.setState({
        isLoading: false,
      })
        })
    }
  }

  handleLoadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  onSubmit = value => {
    this.setState({
      value,
      page: 1,
      images: [],
      isEmpty: false,
      isLoadMore: false,
      isError: '',
      isLoading: false,
    });
  };


  openModal = ({src='',alt=''} ={}) => {
    this.setState(prevState => ({
      modalIsOpen: !prevState.modalIsOpen, src, alt
    }))

  }
  render() {
    const { images, isEmpty, isLoadMore, isError,isLoading,modalIsOpen,src,alt } = this.state;
    return (
      <>
        <SearchForm onSubmit={this.onSubmit} />
        <Grid>
          {images.map(({ alt, id, avg_color, src }) => (
            <GridItem key={id}>
              <CardItem color={avg_color}>
                <img src={src.large} alt={alt} onClick={()=> {this.openModal({src:src.large,alt})}}/>
              </CardItem>
            </GridItem>
          ))}
        </Grid>
        {isLoadMore && <Button onClick={this.handleLoadMore}>Load More</Button>}
        {isEmpty && (
          <Text textAlign="center">Sorry. There are no images ... 😭</Text>
        )}
        {isLoading && <Loader />}
        {modalIsOpen && <CustomModal modalIsOpen={modalIsOpen} src={src} alt={alt} closeModal={this.openModal}  />}
        {isError && <Text textAlign="center">Sorry. {isError} ... 😭</Text>}
      </>
    );
  }
}
