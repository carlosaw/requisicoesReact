import { useEffect, useState, useRef } from 'react';
import api from './api';

export default () => {

  const photoField = useRef();

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userName, setUserName] = useState(localStorage.getItem('username'));

  const [newCarBrand, setNewCarBrand] = useState('');
  const [newCarName, setNewCarName] = useState('');
  const [newCarYear, setNewCarYear] = useState('');
  const [newCarPrice, setNewCarPrice] = useState('');

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState('');

  const [rNameField, setRNameField] = useState('');
  const [rEmailField, setREmailField] = useState('');
  const [rPasswordField, setRPasswordField] = useState('');

  const [emailField, setEmailField] = useState('');
  const [passwordField, setPasswordField] = useState('');

  const getCars = async () => {
    setCars([]);
    setLoading(true);

    let json = await api.getCarList(year);

    setLoading(false);
    
    if(json.error === '') {
      setCars( json.cars );
    } else {
      alert( json.error );
    }
  };

  const handleYearChange = (e) => {
    setYear( e.target.value );
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    let json = await api.login(emailField, passwordField);

    if(json.error != '') {
      alert(json.error);
    } else {
      localStorage.setItem('token', json.token);
      localStorage.setItem('username', json.user.name);
      setToken(json.token);
      setUserName(json.user.name);
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    let json = await api.register(rNameField, rEmailField, rPasswordField);

    if(json.error != '') {
      alert(json.error);
    } else {
      localStorage.setItem('token', json.token);
      localStorage.setItem('username', json.user.name);
      setToken(json.token);
      setUserName(json.user.name);
    }
  }

  const handleLogout = () => {
    setToken('');
    setUserName('');
    localStorage.setItem('token', '');
    localStorage.setItem('username', '');
  }

  const handleAddCarSubmit = async (e) => {
    e.preventDefault();

    let photo = null;
    if(photoField.current.files.length > 0) {
      photo = photoField.current.files[0];
    }

    let json = await api.addNewCar(
      newCarBrand,
      newCarName,
      newCarYear,
      newCarPrice,
      photo,
      token
    );

    if(json.error !== '') {
      alert("Ocorreu um erro!");
      console.log(json.error);
    } else {
      alert("Carro adicionado com sucesso!");
      getCars();
      setNewCarBrand('');
      setNewCarName('');
      setNewCarYear('');
      setNewCarPrice('');
    }
  }

  useEffect(()=>{
    getCars();
  }, [year]);

  return (
    <div>

      {!token &&
        <div>
          <div>

            <h2>Faça Login</h2>
            <form onSubmit={handleLoginSubmit}>
              <label>
                E-mail:
                <input type="email" value={emailField} onChange={e=>setEmailField(e.target.value)} />
              </label><br/>

              <label>
                Senha:
                <input type="password" value={passwordField} onChange={e=>setPasswordField(e.target.value)} />
              </label><br/>

              <input type="submit" value="Enviar" />
            </form>
          </div>

          <div>
            <h2>Faça o Cadastro</h2>
            <form onSubmit={handleRegisterSubmit}>
              <label>
                Nome:
                <input type="text" value={rNameField} onChange={e=>setRNameField(e.target.value)} />
              </label><br/>

              <label>
                E-mail:
                <input type="email" value={rEmailField} onChange={e=>setREmailField(e.target.value)} />
              </label><br/>

              <label>
                Senha:
                <input type="password" value={rPasswordField} onChange={e=>setRPasswordField(e.target.value)} />
              </label><br/>

              <input type="submit" value="Enviar" />
            </form>
          </div>
        </div>
      }
      {token &&
        <div>
          <h3>Olá, {userName}</h3>
          <button onClick={handleLogout}>Sair</button>

          <form onSubmit={handleAddCarSubmit}>
            <h4>Adicionar Carro</h4>
            <label>
              Marca do carro:
              <input type="text" value={newCarBrand} onChange={e=>setNewCarBrand(e.target.value)} />
            </label><br/>
            <label>
              Nome do carro:
              <input type="text" value={newCarName} onChange={e=>setNewCarName(e.target.value)} />
            </label><br/>
            <label>
              Ano do carro:
              <input type="text" value={newCarYear} onChange={e=>setNewCarYear(e.target.value)} />
            </label><br/>
            <label>
              Preço:
              <input type="text" value={newCarPrice} onChange={e=>setNewCarPrice(e.target.value)} />
            </label><br/>
            <label>
              Foto:
              <input ref={photoField} type="file" />
            </label><br/>
            <input type="submit" value="Adicionar Carro" />
          </form>
        </div>
      }

      <hr/>

      <h1>Lista de Carros</h1>

      <select onChange={handleYearChange}>
        <option></option>
        <option>2021</option>
        <option>2020</option>
        <option>2019</option>
        <option>2018</option>
        <option>2017</option>
        <option>2016</option>
        <option>2015</option>
        <option>1980</option>
        <option>1977</option>
        <option>1974</option>
      </select>

      <button onClick={getCars}>Atualizar Lista</button>

      <hr/>

      {loading === true &&
        <h2>Carregando os carros...</h2>
      }

      {cars.length === 0 && loading === false &&
        <h2>Nenhum carro encontrado.</h2>
      }

      {cars.map((item, index)=>(
        <div key={index}>
          <img src={item.photo} width="200" />
          <h3>{item.brand} - {item.name}</h3>
          <p>{item.year} - R$ {item.price}</p>
        </div>
      ))}

    </div>
  );
}