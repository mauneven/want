import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const PostCard = ({ post, userReputation, photoIndex }) => {

  const router = useRouter();

  return (
    <div
      key={post._id}
      className="col d-flex p-3"
    >
      <div className="card post-card divhover w-100 animate__fadeIn animate__animated">
        {post.photos && post.photos.length > 0 ? (
          <div
            id={`carousel-${post._id}`}
            className="carousel slide img-post"
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
                      alt={post.title}
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
        ) : (
          <div className="d-flex w-100 h-100 align-items-center justify-content-center" onClick={() => router.push(`post/${post._id}`)}>
            <h4 className="text-center p-3">{post.title}</h4>
          </div>
        )}
        <Link href={`post/${post._id}`} className="post-details p-2 ">
          <div className="want-color-generic">
            <div className="">
              <h3 className="post-price">
                ${post.price.toLocaleString()}
              </h3>
              <h5 className="p-1 post-title">{post.title}</h5>
              <div className="d-flex want-rounded p-0">
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
                  <small className="text-muted">
                    {post.createdBy.firstName}
                  </small>
                  <div className="d-flex">
                    <i className="bi bi-star-fill me-1"></i>
                    <small className="text-muted">
                      {userReputation.toFixed(1)}
                    </small>
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