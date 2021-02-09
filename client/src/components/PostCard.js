import React from 'react';
import { Card, Image, Button, Icon, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from 'moment';

function PostCard({ post: { body, createdAt, id, username, likeCount, commentCount, likes } }) {
    
    const likePost = () => {
        console.log('Like Post');
    }
    const commentOnPost = () => {
        console.log('Comment');
    }

    return (
      <Card fluid>
        <Card.Content>
          <Image
            floated="right"
            size="mini"
            src="https://blog.cpanel.com/wp-content/uploads/2019/08/user-01.png"
          />
          <Card.Header>{username}</Card.Header>
          <Card.Meta as={Link} to={`/posts/${id}`}>
            {moment(createdAt).fromNow()}
          </Card.Meta>
          <Card.Description>{body}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button as='div' onClick={likePost} labelPosition="right">
            <Button basic color="teal">
              <Icon name="heart" />
              Like
            </Button>
            <Label as='a' basic color="teal" pointing="left">
              { likeCount }
            </Label>
          </Button>
          <Button as='div' onClick={commentOnPost} labelPosition="right">
            <Button basic color="blue">
              <Icon name="comments" />
              Comment
            </Button>
            <Label as='a' basic color="blue" pointing="left">
              { commentCount }
            </Label>
          </Button>
        </Card.Content>
      </Card>
    );
}

export default PostCard;
