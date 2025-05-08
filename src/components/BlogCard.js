import React from 'react';
import { Card, Badge } from "reactstrap";
import Icon from './Icon';
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";

const BlogCard = ({ post }) => {
  const renderReactions = (reactions) => {
    if (typeof reactions === "object" && reactions !== null) {
      return (
        <div className="d-flex align-items-center mt-2">
          <div className="me-3 d-flex align-items-center">
            <Icon icon={faThumbsUp} className="text-primary me-1" />
            <span>{reactions.likes || 0}</span>
          </div>
          <div className="d-flex align-items-center">
            <Icon icon={faThumbsDown} className="text-danger me-1" />
            <span>{reactions.dislikes || 0}</span>
          </div>
        </div>
      );
    }
    return (
      <div className="d-flex align-items-center mt-2">
        <div className="me-3 d-flex align-items-center">
          <Icon icon={faThumbsUp} className="text-primary me-1" />
          <span>{reactions || 0}</span>
        </div>
      </div>
    );
  };

  return (
    <Card className="max-w-md p-1">
      <div className="w-100 mb-2">
        {post.tags && post.tags.length > 0 && (
          <div className="d-flex flex-wrap">
            {post.tags.map((tag, index) => (
              <Badge
                key={index}
                color="primary"
                className="me-1 mb-1"
                style={{ fontSize: "0.7rem" }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <h4 className="font-extrabold text-[#1a1a1a] leading-tight">
        {post.title.length > 25
          ? `${post.title.substring(0, 25)}...`
          : post.title}
      </h4>
      <img
        src={
          post.image ||
          post.thumbnail ||
          `https://picsum.photos/seed/${post.id}/300/150`
        }
        alt={post.title || "Blog post thumbnail"}
        className="mt-1 rounded-lg w-full"
        height="150"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://picsum.photos/seed/${post.id}/300/150`;
        }}
      />
      <p className="mt-1 mb-0 text-gray-700 text-base leading-relaxed">
        {post.body.length > 50
          ? `${post.body.substring(0, 50)}...`
          : post.body}
      </p>
      {renderReactions(post.reactions)}
      <div className="text-center">
        <a
          className="w-50 btn btn-primary btn-sm text-white mb-1 mt-2"
          href={`/blog/${post.id}`}
        >
          Read More
        </a>
      </div>
    </Card>
  );
};

export default BlogCard;