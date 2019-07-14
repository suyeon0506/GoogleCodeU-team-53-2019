import React from 'react';
import { Input } from 'antd';
import { CREATE_COMMENT } from 'constants/links.js';
import { addParamToUrl } from 'helpers/FetchServer.js';
import axios from 'axios';

const { Search } = Input;

class CommentBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      curIndex: 0,
      value: '',
    }
    this.handleShowMoreComment = this.handleShowMoreComment.bind(this);
    this.writeNewComment = this.writeNewComment.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
  }

  componentDidMount = () => {
    this.loadMoreComment();
  }

  handleShowMoreComment = () => {
    this.loadMoreComment();
  }

  handleChangeInput = (event) => {
    this.setState({value: event.target.value});
  }

  writeNewComment = (value) => {
    const { post } = this.props;
    if (!(value == null || value === '')) {
      let url = CREATE_COMMENT;
      url = addParamToUrl(url, 'postId', post.id);
      url = addParamToUrl(url, 'commentText', value);
      axios
        .post(url, {})
        .then(response => {
          const { data } = response;
          if (data.id != null) {
            this.props.onChangePost(1, false);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    this.setState({value: ''})
  }

  loadMoreComment = () => {
    const { comments } = this.props.post;
    if (Array.isArray(comments)) {
      let newItems = []
      const { curIndex } = this.state;
      const lastIndex = Math.min(comments.length, curIndex + 10);
      for (let index = 0; index < lastIndex; index++) {
        let comment = comments[index];
        newItems.push(<div className="Post__Comments__Author" key={comment.id + '-author'}>
          {comment.author.username}
        </div>);
        newItems.push(<div className="Post__Comments__Comment" key={comment.id + '-comment'}>
          {comment.text}
        </div>)
        if (curIndex !== lastIndex) {
          this.setState({ curIndex: lastIndex });
          this.setState({ items: newItems });
        }
      }
    }
  }

  render() {
    let showMoreComent = false;
    const { comments } = this.props.post;
    if (Array.isArray(comments)) {
      if (comments.length > this.state.curIndex)
        showMoreComent = true;
    }

    return (
      <div className="Post__Comments">
        {this.state.items}
        {(showMoreComent) &&
          <div
            className="Post__Comments__ShowMore"
            onClick={this.handleShowMoreComment}
          >
            Show more comments
        </div>
        }
        <Search
          placeholder="Enter your comment here!"
          enterButton="Post"
          value={this.state.value}
          onChange={this.handleChangeInput}
          onSearch={this.writeNewComment}
        />
      </div>
    );
  }
}

export default CommentBar;