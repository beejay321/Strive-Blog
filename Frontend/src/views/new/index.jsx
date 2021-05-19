import React, { Component } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Container, Form, Button } from "react-bootstrap";
import "./styles.css";

export default class NewBlogPost extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = { text: "" };
  //   this.handleChange = this.handleChange.bind(this);
  // }
  state = {
    posts: {
      title: "",
      category: "",
      text: "",
    },
  };

  submitPosts = async (e) => {
    e.preventDefault();
    console.log(this.state.posts);
    try {
      let response = await fetch("http://localhost:3001/blogPosts", {
        method: "POST",
        body: JSON.stringify(this.state.posts),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("your post has been saved correctly");
        this.setState({
          posts: {
            title: "",
            category: "",
            text: "",
          },
        });
      } else {
        alert("something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // handleChange(value) {
  //   this.setState({ text: value });
  // }

  handleChange = (e) => {
    let id = e.target.id;

    this.setState({
      posts: {
        ...this.state.posts,
        [id]: e.target.value,
      },
    });
  };

  render() {
    return (
      <Container className="new-blog-container">
        <Form className="mt-5" onSubmit={this.submitPosts}>
          <Form.Group controlId="blog-form" className="mt-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              id="title"
              value={this.state.title}
              onChange={this.handleChange}
              size="lg"
              placeholder="Title"
            />
          </Form.Group>
          <Form.Group controlId="blog-category" className="mt-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              id="category"
              value={this.state.category}
              onChange={this.handleChange}
              size="lg"
              as="select"
            >
              <option>Category1</option>
              <option>Category2</option>
              <option>Category3</option>
              <option>Category4</option>
              <option>Category5</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="blog-content" className="mt-3">
            <Form.Label>Blog Content</Form.Label>
            <ReactQuill
              id="body"
              value={this.state.text}
              onChange={this.handleChange}
              className="new-blog-content"
            />
          </Form.Group>
          <Form.Group className="d-flex mt-3 justify-content-end">
            <Button type="reset" size="lg" variant="outline-dark">
              Reset
            </Button>
            <Button
              type="submit"
              size="lg"
              variant="dark"
              style={{ marginLeft: "1em" }}
            >
              Submit
            </Button>
          </Form.Group>
        </Form>
      </Container>
    );
  }
}
