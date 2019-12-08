import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';

class Register extends Component {
  emailRef = React.createRef();
  usernameRef = React.createRef();
  passwordRef = React.createRef();

  state = {
    role: this.props.email ? 'instructor' : 'student',
    email: null,
    username: null,
    password: null,
    emailError: null,
    usernameError: null,
    passwordError: null,
    loader: false,
    toggleNewsletter: false,
  }

  componentDidMount() {
    if (this.props.email) {
      this.emailRef.current.value = this.props.email;
      this.usernameRef.current.focus();
    } else {
      this.emailRef.current.focus();
    }
  }

  handleEmailChange = () => {
    this.setState({ email: this.emailRef.current.value });
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

    const urlParams = new URLSearchParams(window.location.search);
    const demo = urlParams.get('demo');

    axios.post('http://localhost:3000/api/user/create', {
      email: this.state.email,
      username: this.state.username,
      password: this.state.password,
    }).then((res) => {
      // Do stuff
      console.log('REGISTER SUCCESSFUL!');
    }).catch((e) => {
      const err = e.response.data;

      if (err.code === 0) {
        this.setState({
          loader: false, emailError: err.message, usernameError: null, passwordError: null,
        });
      } else if (err.code === 1) {
        this.setState({
          loader: false, emailError: null, usernameError: err.message, passwordError: null,
        });
      } else if (err.code === 2) {
        this.setState({
          loader: false, emailError: null, usernameError: null, passwordError: err.message,
        });
      }
    });

    return false;
  }

  toggleNewsletter = () => {
    this.setState({ newsletter: !this.state.newsletter });
  }

  render() {
    let submit = (
      <SubmitButton>
Register
        <i className="material-icons">chevron_right</i>
      </SubmitButton>
    );

    if (this.state.loader) {
      submit = (
        <SubmitButton>
Register
          <Loader className="loader" />
        </SubmitButton>
      );
    }

    return (
      <LoginFormContainer halfScreen={this.props.halfScreen}>
        <LoginFormHeader>Register</LoginFormHeader>
        <LoginFormBody onSubmit={this.handleSubmit}>
          <Input required ref={this.emailRef} onChange={this.handleEmailChange} placeholder="Email" type="text" name="email" />
          <InputError>{this.state.emailError}</InputError>
          <Input required ref={this.usernameRef} onChange={this.handleUsernameChange} placeholder="Username" type="text" name="username" />
          <InputError>{this.state.usernameError}</InputError>
          <Input required ref={this.passwordRef} onChange={this.handlePasswordChange} placeholder="Password" type="password" name="password" />
          <InputError>{this.state.passwordError}</InputError>
          {submit}
        </LoginFormBody>
        <Helper>
          Have an account? <Jump onClick={() => this.props.setRegister(false)}>Log In</Jump>
        </Helper>
      </LoginFormContainer>
    );
  }
}

export default Register;

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
  top: calc(40vh - 110px);
  left: calc(50vw - 180px);
`;

const LoginFormHeader = styled.div`
  display: inline-block;
  width: 100%;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 30px;
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 13px;
`;

const LoginFormBody = styled.form`
  display: inline-block;
  width: 100%;
`;


const RoleSelector = styled.div`
    position: relative;
    display: inline-block;
    width: 100%;
    margin-bottom: 4px;
`;

const Role = styled.div`
    position: relative;
    display: inline-block;
    float: center;
    width: 140px;
    height: 40px;
    margin: 0 10px;
    font-family: 'Noto Sans', sans-serif;
    font-size: 18px;
    padding-top: 2.5px;
    color: #bbb;
    > i {
      display: inline-block;
      margin-top: -2.5px;
      margin-right: 4px;
      vertical-align: middle;
      cursor: pointer;
      color: ${(props) => (props.checked ? '#ccc' : '#ccc')};
    }
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
    :-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px white inset;
        -webkit-text-fill-color: #ccc;
    }
    ::placeholder {
        color: #ccc;
    }
    :focus {
        outline: none;
    }
    :-webkit-autofill,
    :-webkit-autofill:hover,
    :-webkit-autofill:focus,
    :-webkit-autofill:active {
      -webkit-transition: "color 9999s ease-out, background-color 9999s ease-out";
      -webkit-transition-delay: 9999s;
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
  background: #839DFF;
  margin-top: 21px;
  box-shadow: 0 2px 5px 0 #00000030;
  cursor: pointer;
  user-select: none;
  :focus { outline: 0 }
  :hover { background: #6181f9 }
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
