import React from "react";
import Link from "next/link";

const PostCard = ({ post, userReputation, photoIndex }) => {
  return (
    <div
      key={post._id}
      className="col post-card want-rounded d-flex align-items-stretch p-3"
    >
      <div className="card want-rounded divhover w-100">
        {post.photos && post.photos.length > 0 && (
          <div
            id={`carousel-${post._id}`}
            className="carousel slide want-rounded  img-post"
            data-bs-ride="carousel"
            style={{ height: "200px", overflow: "hidden" }}
          >
            <Link href={`post/${post._id}`} className="carousel-inner">
              {post.photos.map((photo, index) => (
                <div
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                  key={index}
                >
                  <Link href={`post/${post._id}`}>
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${photo}`}
                      className="d-block w-100"
                      alt={`Image ${index}`}
                      loading="lazy"
                    />
                  </Link>
                </div>
              ))}
            </Link>
            {post.photos.length > 1 && (
              <>
                <button
                  className="carousel-control-prev custom-slider-button ms-1"
                  type="button"
                  data-bs-target={`#carousel-${post._id}`}
                  data-bs-slide="prev"
                  style={{ bottom: "40px" }}
                  disabled={photoIndex === 0}
                  onClick={() => {
                    photoIndex--;
                  }}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
                <button
                  className="carousel-control-next custom-slider-button me-1"
                  type="button"
                  data-bs-target={`#carousel-${post._id}`}
                  data-bs-slide="next"
                  style={{ bottom: "40px" }}
                  disabled={photoIndex === post.photos.length - 1}
                  onClick={() => {
                    photoIndex++;
                  }}
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </>
            )}
          </div>
        )}
        <Link href={`post/${post._id}`}>
          <div className="card-body p-0 m-0">
            <div className="generic-button post-card-contain">
              <h3 className="text-price m-0 post-title">${post.price.toLocaleString()}</h3>
              <h5 className="card-title post-title p-1">{post.title}</h5>
              <div className="d-flex generic-button generic-button want-rounded p-0">
                <img
                  src={
                    post.createdBy.photo
                      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${post.createdBy.photo}`
                      : "/icons/person-circle.svg"
                  }
                  alt=""
                  className="createdBy-photo p-1"
                />
                <div className="ms-2">
                  <small className="text-muted">{post.createdBy.firstName}</small>
                  <div className="d-flex">
                    <i className="bi bi-star-fill me-1"></i>
                    <small className="text-muted">{userReputation.toFixed(1)}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PostCard;