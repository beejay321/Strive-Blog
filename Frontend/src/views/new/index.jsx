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
      cover: undefined,
      readTime: {
        value: 1,
        unit: "",
      },
      content: "",
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
        if (this.state.cover !== undefined) {
          const data = await response.json();
          const id = data._id;
          let aResponse = await fetch("http://localhost:3001/blogPosts/" + id, {
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data",
            },
            body: this.state.cover,
          });
          if (aResponse.ok) {
            console.log("File uploaded successfully");
          }
        } else {
          console.log("File was not uploaded!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleChange = (e) => {
    let id = e.target.id;
    this.setState({
      posts: {
        ...this.state.posts,
        [id]: e.target.value,
      },
    });
  };

  selectImage = (e) => {
    e.preventDefault();
    console.log(e.target.files[0]);
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append("cover", file);
    console.log(this.state.cover);
    console.log(formData);
    this.setState({
      cover: formData,
    });
  };

  render() {
    return (
      <Container className="new-blog-container">
        <Form className="mt-5" onSubmit={this.submitPosts}>
          <Form.Group className="mt-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              id="title"
              value={this.state.posts.title}
              onChange={this.handleChange}
              size="lg"
              placeholder="Title"
              type="text"
            />
          </Form.Group>
          <br />

          <Form.Group>
            <Form.Label>Upload Cover</Form.Label>
            <Form.File
              id="cover"
              type="file"
              name="cover"
              onChange={this.selectImage}
            />
          </Form.Group>

          <br />
          {/* <Button>
            <div>
              <form enctype="multipart/form-data" method="post" name="fileinfo">
                <input
                  id="cover"
                  type="file"
                  name="cover"
                  onChange={this.selectImage}
                />
              </form>
            </div>
          </Button> */}

          <Form.Group className="mt-3">
            <Form.Label>Value</Form.Label>
            <Form.Control
              id="value"
              // value={this.state.posts.readTime.value}
              onChange={this.handleChange}
              size="lg"
              as="select"
            >
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Unit</Form.Label>
            <Form.Control
              id="unit"
              // value={this.state.posts.readTime.unit}
              onChange={this.handleChange}
              size="lg"
              type="text"
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              id="category"
              value={this.state.posts.category}
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
          <Form.Group className="mt-3">
            <Form.Label>Blog Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={15}
              id="content"
              value={this.state.posts.content}
              onChange={this.handleChange}
            />
            {/* <ReactQuill
              id="body"
              value={this.state.text}
              onChange={this.handleChange}
              className="new-blog-text"
            /> */}
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
