import { Component } from 'react';

import * as ImageService from 'service/image-service';
import { Button, SearchForm, Grid, GridItem, Text, CardItem } from 'components';

export class Gallery extends Component {
  state = {
    value: '',
    page: 1,
    images: [],
    isEmpty: false,
    isLoadMore: false,
    isError: '',
  };

  componentDidUpdate(_, prevState) {
    const { value, page } = this.state;
    if (prevState.value !== value || prevState.page !== page) {
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
        });
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
    });
  };
  render() {
    const { images, isEmpty, isLoadMore, isError } = this.state;
    return (
      <>
        <SearchForm onSubmit={this.onSubmit} />
        <Grid>
          {images.map(({ alt, id, avg_color, src }) => (
            <GridItem key={id}>
              <CardItem color={avg_color}>
                <img src={src.large} alt={alt} />
              </CardItem>
            </GridItem>
          ))}
        </Grid>
        {isLoadMore && <Button onClick={this.handleLoadMore}>Load More</Button>}
        {isEmpty && (
          <Text textAlign="center">Sorry. There are no images ... 😭</Text>
        )}
        {isError && <Text textAlign="center">Sorry. {isError} ... 😭</Text>}
      </>
    );
  }
}
