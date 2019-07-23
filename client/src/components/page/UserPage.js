import React, { Component } from 'react';
import NewFeedWrapper from 'components/NewFeedWrapper';
import { withRouter } from 'react-router-dom';
import { fetchPosts } from 'helpers/LoadPost';
import { fetchUser } from 'helpers/LoadUser';
import Page404 from 'components/Result/Page404';

class UserPage extends Component {
  constructor(props) {
    super(props);
    const date = new Date();
    const timestamp = date.getTime(); //current time
    const { userStatus } = this.props;
    this.state = {
      userStatus: {
        userEmail: userStatus.userEmail,
        userId: userStatus.userId,
      },
      posts: [],
      userIdParam: this.props.match.params.userId,
      thisUserEmail: '',
      minTimestamp: timestamp,
    }
    this.loadMorePost = this.loadMorePost.bind(this);
  }

  componentDidMount = async () => {
    // get user email
    const user = await fetchUser(this.state.userIdParam);
    if (user === null)
      return;
    this.setState({ thisUserEmail: user.username });
    // get Posts
    const date = new Date();
    const timestamp = date.getTime(); //current time
    const newPosts = await fetchPosts(timestamp, 10, '', this.state.userIdParam, '')
    if (newPosts != null) {
      let newMinTimestamp = this.state.minTimestamp;
      this.setState({ posts: newPosts });
      newPosts.forEach(post => {
        newMinTimestamp = Math.min(newMinTimestamp, post.creationTime);
      });
      this.setState({ minTimestamp: newMinTimestamp - 1 });
    }
  }

  componentDidUpdate = async () => {
    const { userStatus } = this.props;
    if (userStatus !== this.state.userStatus) {
      this.setState({ userStatus: userStatus });
    }
    if (this.state.userIdParam !== this.props.match.params.userId) {
      this.setState({ userIdParam: this.props.match.params.userId });
      const date = new Date();
      const timestamp = date.getTime(); //current time
      const newPosts = await fetchPosts(timestamp, 10, '', this.props.match.params.userId, '')
      if (newPosts != null) {
        let newMinTimestamp = timestamp;
        this.setState({ posts: newPosts });
        newPosts.forEach(post => {
          newMinTimestamp = Math.min(newMinTimestamp, post.creationTime);
        });
        this.setState({ minTimestamp: newMinTimestamp - 1 });
      }
    }
  }

  loadMorePost = async () => {
    const morePosts = await fetchPosts(this.state.minTimestamp, 10, '', this.state.userIdParam, '');
    if (morePosts != null) {
      if (morePosts.length > 0) {
        let newMinTimestamp = this.state.minTimestamp;
        morePosts.forEach(post => {
          newMinTimestamp = Math.min(newMinTimestamp, post.creationTime);
        });
        this.setState({ minTimestamp: newMinTimestamp - 1 });
        let newPosts = [...this.state.posts];
        newPosts.push(...morePosts);
        this.setState({ posts: newPosts });
        return true;
      }
    }
    return false;
  }

  render() {
    return (
      <div className='container pt-2'>
        {this.state.thisUserEmail ? (
          <div>
            <h1 className='center'>{this.state.thisUserEmail} Page</h1>
            <NewFeedWrapper
              userStatus={this.state.userStatus}
              posts={this.state.posts}
              handleLoadMorePost={this.loadMorePost}
            />
          </div>
        ) : (
            <Page404 />
          )}
      </div>
    );
  }
}

export default withRouter(UserPage);
