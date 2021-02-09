import React from 'react';
import { useQuery, gql } from "@apollo/client";
import PostCard from "./PostCard";
import { Grid } from "semantic-ui-react";

function Home() {
    let posts;
    const { loading, error, data } = useQuery(FETCH_POST_QUERY);
    console.log(data);
    if (error) {
        throw new Error(error);
    }
    if (data) {
        posts = data.getPosts;
    }
    return (
        <Grid columns={3}>
            <Grid.Row className="page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {loading ?
                    (<h1>Loading...</h1>) : (posts && posts.map(post =>
                        <Grid.Column style={{ marginBottom: 20 }} key={post.id}>
                            <PostCard key={post.id} post={post} />
                        </Grid.Column>
                    ))
                }
            </Grid.Row>
        </Grid>
    )
}

const FETCH_POST_QUERY = gql`
    {
        getPosts {
            id
            body
            createdAt
            username
            likeCount
            commentCount
            likes {
                username
            }
        }
    }
`;

export default Home;
