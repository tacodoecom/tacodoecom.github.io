import '../../public/vendor/css/core.css'
import '../../public/vendor/css/theme-default.css'
import '../../public/vendor/css/pages/page-auth.css'
import {FormEventHandler, useState} from "react";
import {Api} from "../api/api";
import {useNavigate} from "react-router-dom";

export const LoginPage = function (props: { api: Api; }) {
  const api: Api = props.api;
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const navigate = useNavigate()

  const handleLoginButtonClicked: FormEventHandler = async function (e) {
    e.preventDefault();
    const response = await api.login(username, password);
    if (response.ok()) {
      // const token = response.content;
      navigate('/reminder');
    }
  }

  return <div className="container-xxl">
    <div className="authentication-wrapper authentication-basic container-p-y">
      <div className="authentication-inner">
        <div className="card">
          <div className="card-body">
            <div className="app-brand justify-content-center">
              <a href="index.html" className="app-brand-link gap-2">
              </a>
            </div>
            <h4 className="mb-2">Welcome 👋</h4>
            <p className="mb-4">Please sign-in to your account and start the adventure</p>

            <form id="formAuthentication" className="mb-3" action="index.html" method="POST">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email or Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  name="email-username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter your email or username"
                  autoFocus
                />
              </div>
              <div className="mb-3 form-password-toggle">
                <div className="d-flex justify-content-between">
                  <label className="form-label" htmlFor="password">Password</label>
                  <a href="maintenance.html">
                    <small>Forgot Password?</small>
                  </a>
                </div>
                <div className="input-group input-group-merge">
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    name="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                    aria-describedby="password"
                  />
                  <span className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                </div>
              </div>
              <div className="mb-3">
                <div className="form-check">
                  <input className="form-check-input"
                         type="checkbox" id="remember-me"
                         checked={rememberMe}
                         onChange={e => setRememberMe(!rememberMe)}/>
                  <label className="form-check-label" htmlFor="remember-me"> Remember Me </label>
                </div>
              </div>
              <div className="mb-3">
                <button className="btn btn-primary d-grid w-100" onClick={handleLoginButtonClicked}>Sign in</button>
              </div>
            </form>

            <p className="text-center">
              <span>New on our platform?</span>
              <span> </span>
              <a href="maintenance.html">
                <span>Create an account</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
}
