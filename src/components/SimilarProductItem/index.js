// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarItem} = props
  const {brand, title, price, rating, imageUrl} = similarItem
  return (
    <li className="similar-list">
      <img
        src={imageUrl}
        alt={`similar product ${imageUrl}`}
        className="similar-image"
      />
      <h1 className="similar-product-head">{title}</h1>
      <p className="similar-product-brand">by {brand}</p>
      <div className="similar-product-footer">
        <p className="price-similar-product">Rs {price}/-</p>
        <div className="similar-products-ratings">
          <p className="rating-similar-products">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="similar-product-star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
