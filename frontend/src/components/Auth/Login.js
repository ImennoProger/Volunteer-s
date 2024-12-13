import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useAuth } from './AuthContext';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

function Login() {
  const [username, setUsername] = useState(''); //username - email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const navigate = useNavigate();

  const validateForm = () => {
    if (!username || !password) {
      setError('email and password are required');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    const formDetails = new URLSearchParams();
    formDetails.append('username', username);
    formDetails.append('password', password);

    try {
      const response = await fetch(`${apiBaseUrl}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDetails,
      });

      setLoading(false);

      if (response.ok) {

        const data = await response.json();
        login(data.access_token);
        navigate('/');
        window.location.reload();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Authentication failed!');
      }
    } catch (error) {
      setLoading(false);
      setError('An error occurred. Please try again later.');
    }
  };


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="login-container">
          <div className="card-container">
            <div className="card">
              <span className="card-title">Авторизация</span>
              <div className="card-content">
                <div className="login-input-field">
                  <div className="floating-label">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    <label>Электронная почта:</label>
                  </div>
                </div>
                <div className="login-input-field">
                  <div className="floating-label">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <label>Пароль:</label>
                  </div>
                </div>
                <Link to="/reset-password" className="forgot-password">Забыли пароль?</Link>
                <button className="btn waves-effect waves-light btn-login" type="submit" disabled={loading}>
                  {loading ? 'Вход...' : 'Войти'}
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;