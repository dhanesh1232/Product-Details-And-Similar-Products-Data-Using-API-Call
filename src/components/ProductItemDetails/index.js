// Write your code here
import {Component} from 'react'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiUrl = 'https://apis.ccbp.in/products/'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class ProductItemDetails extends Component {
  state = {productDetails: [], count: 1, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getProductDetails()
  }

  // To Get Product Details In API Call
  getSimilarProducts = eachSimilar => ({
    availability: eachSimilar.availability,
    brand: eachSimilar.brand,
    description: eachSimilar.description,
    id: eachSimilar.id,
    imageUrl: eachSimilar.image_url,
    price: eachSimilar.price,
    rating: eachSimilar.rating,
    style: eachSimilar.style,
    title: eachSimilar.title,
    totalReviews: eachSimilar.total_reviews,
  })

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(`${apiUrl}${id}`, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        availability: data.availability,
        id: data.id,
        brand: data.brand,
        description: data.description,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        title: data.title,
        totalReviews: data.total_reviews,
        similarProducts: data.similar_products.map(eachSimilar =>
          this.getSimilarProducts(eachSimilar),
        ),
      }
      this.setState({
        productDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onIncrementCount = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  onDecrementCount = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  getProductDetailsClickedOne = () => {
    const {productDetails} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productDetails
    const {count} = this.state
    return (
      <>
        <div className="main-container-product">
          <img
            src={imageUrl}
            alt={`product ${imageUrl}`}
            className="product-main-img"
          />
          <div className="product-info">
            <h1 className="product-head">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="product-review">
              <div className="star-container">
                <p className="rating-desc">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="review-pro">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <p className="product-available">
              Available: <p className="availability">{availability}</p>
            </p>
            <p className="product-brand">
              Brand: <p className="brand">{brand}</p>
            </p>
            <hr className="separator" />
            <div className="stock-values">
              <button
                type="button"
                className="stock-btn"
                data-testid="minus"
                onClick={this.onDecrementCount}
              >
                <BsDashSquare />
              </button>
              <p className="stock">{count}</p>
              <button
                data-testid="plus"
                type="button"
                className="stock-btn"
                onClick={this.onIncrementCount}
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        {this.renderSimilarProducts()}
      </>
    )
  }

  renderSimilarProducts = () => {
    const {productDetails} = this.state
    const {similarProducts} = productDetails
    return (
      <div className="similar-container">
        <h1 className="similar-head">Similar Products</h1>
        <ul className="similar-products-list">
          {similarProducts.map(eachSimilar => (
            <SimilarProductItem
              similarItem={eachSimilar}
              key={eachSimilar.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  onNavigateToProductsView = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderOnFailureOfProductsDetails = () => (
    <div className="product-not-found-details">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-view-image"
      />
      <h1 className="not-found-heading-products">Product Not Found</h1>
      <button
        type="button"
        className="product-not-found-button-error"
        onClick={this.onNavigateToProductsView}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader" className="loader-view">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderAllProductsLists = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case 'SUCCESS':
        return this.getProductDetailsClickedOne()
      case 'FAILURE':
        return this.renderOnFailureOfProductsDetails()
      case 'IN_PROGRESS':
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {apiStatus} = this.state
    const classNameDisplay =
      apiStatus === 'IN_PROGRESS'
        ? 'loader-view-container'
        : 'product-details-page'
    return (
      <>
        <Header />
        <div className={classNameDisplay}>{this.renderAllProductsLists()}</div>
      </>
    )
  }
}

export default ProductItemDetails
