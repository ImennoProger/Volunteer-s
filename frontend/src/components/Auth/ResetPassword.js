import React from 'react';
import './ResetPassword.css'; 

const ResetPassword = () => {
  return (
    <div className="row">
      <div className="card">
        <h2>Сброс пароля</h2>
        <form>
          <div className="input-field">
            <input id="email" type="email" className="validate" />
            <label htmlFor="email">Электронная почта</label>
          </div>
          <button className="btn waves-effect waves-light btn-reset" type="submit" name="action">
            Сбросить пароль
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
