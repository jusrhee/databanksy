import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';

class Login extends Component {
  usernameRef = React.createRef();

  passwordRef = React.createRef();

  state = {
    username: null,
    password: null,
    usernameError: null,
    passwordError: null,
    loader: false,
  }

  componentDidMount() {
    this.usernameRef.current.focus();
  }

  handleUsernameChange = () => {
    this.setState({ username: this.usernameRef.current.value });
  }

  handlePasswordChange = () => {
    this.setState({ password: this.passwordRef.current.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.setState({ loader: true });

    axios.post('/api/user/login', {
      username: this.state.username,
      password: this.state.password,
    }).then(() => {
      window.location.href = '/app';
    }).catch((e) => {
      const err = e.response.data;

      if (err.code === 0) {
        this.setState({ loader: false, usernameError: err.message, passwordError: null });
      } else if (err.code === 1) {
        this.setState({ loader: false, usernameError: null, passwordError: err.message });
      }
    });

    return false;
  }

  render() {
    let submit = (
      <SubmitButton>
Log In
        <i className="material-icons">chevron_right</i>
      </SubmitButton>
    );

    if (this.state.loader) {
      submit = (
        <SubmitButton>
Log In
          <Loader className="loader" />
        </SubmitButton>
      );
    }


    return (
      <LoginFormContainer>
        <LoginFormHeader>Log In</LoginFormHeader>
        <LoginFormBody onSubmit={this.handleSubmit}>
          <Input required ref={this.usernameRef} onChange={this.handleUsernameChange} placeholder="Username" type="text" name="username" />
          <InputError>{this.state.usernameError}</InputError>
          <Input required ref={this.passwordRef} onChange={this.handlePasswordChange} placeholder="Password" type="password" name="password" />
          <InputError>{this.state.passwordError}</InputError>
          {submit}
        </LoginFormBody>
        <Helper>
          Need an account? <Jump onClick={() => this.props.setRegister(true)}>Sign Up</Jump>
        </Helper>
      </LoginFormContainer>
    );
  }
}

export default Login;

const Jump = styled.div`
  display: inline;
  color: white;
  cursor: pointer;
`;

const Helper = styled.div`
  color: #ffffff88;
  font-family: 'Source Sans Pro', sans-serif;
  margin-top: 25px;
`;

const LoginFormContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  margin: 0 auto;
  top: calc(40vh - 80px);
  left: calc(50vw - 180px);
`;

const LoginFormHeader = styled.div`
  display: inline-block;
  width: 100%;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 30px;
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 20px;
`;

const LoginFormBody = styled.form`
  display: inline-block;
  width: 100%;
`;

const Input = styled.input`
    position: relative;
    display: block;
    width: 300px;
    color: #ccc;
    font-family: 'Noto Sans', sans-serif;
    font-size: 16px;
    height: 34px;
    border: none;
    border-bottom: 1px solid #ddd;
    padding-bottom: 5px;
    background: transparent;
    :focus{
        outline: 0;
    }
    :-webkit-autofill,
    :-webkit-autofill:hover,
    :-webkit-autofill:focus,
    :-webkit-autofill:active {
      -webkit-transition: "color 9999s ease-out, background-color 9999s ease-out";
      -webkit-transition-delay: 9999s;
    }
    ::placeholder {
        color: #ccc;
    }
    :focus {
        outline: none;
    }
`;

const InputError = styled.div`
    box-sizing: border-box;
    position: relative;
    display: block;
    width: 300px;
    text-align: right;
    min-height: 14px;
    font-size: 12px;
    font-family: 'Noto Sans', sans-serif;
    margin-bottom: 0px;
    color: #ccc;
`;

const LoginFormFooter = styled.div`
    position: relative;
    display: inline-block;
    width: 100%;
    font-family: 'Noto Sans', sans-serif;
    font-size: 18px;
    color: #777;
    margin-top: 6px;
    margin-bottom: 34px;
    > a {
      display: inline-block;
      margin-left: 16px;
      text-decoration: none;
      color: #6F9FFF;
    }
`;

const SubmitButton = styled.button`
  position: relative;
  display: inline-block;
  margin-top: 6px;
  width: 150px;
  height: 54px;
  font-size: 17px;
  font-weight: bold;
  font-family: 'Work Sans', sans-serif;
  color: white;
  padding: 9px 10px 8px 20px;
  text-align: left;
  border: 0;
  border-radius: 5px;
  background: #515569;
  margin-top: 21px;
  box-shadow: 0 2px 5px 0 #00000030;
  cursor: pointer;
  user-select: none;
  :focus { outline: 0 }
  :hover { background: #343745 }
  > i {
    display: inline-block;
    float: right;
    margin-top: -1px;
  }
  > img {
    display: inline-block;
    float: right;
    margin-top: -1px;
  }
`;

const Loader = styled.div`
    border-radius: 50%;
    width: 1.5em;
    height: 1.5em;
    &:after {
        border-radius: 50%;
        width: 1.5em;
        height: 1.5em;
    }
    margin: 0;
    font-size: 10px;
    position: inline-block;
    float: right;
    text-indent: -9999em;
    border-top: 0.3em solid rgba(255, 255, 255, 0.2);
    border-right: 0.3em solid rgba(255, 255, 255, 0.2);
    border-bottom: 0.3em solid rgba(255, 255, 255, 0.2);
    border-left: 0.3em solid #ffffff;
    transform: translateZ(0);
    animation: load 0.5s infinite linear;
    @keyframes load {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
`;
