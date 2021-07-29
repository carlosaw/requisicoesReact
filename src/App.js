import { useEffect, useState } from 'react';

export default () => {

  const [token, setToken] = useState(localStorage.getItem('token'));
  const[userName, setUserName] = useState(localStorage.getItem('username'));

  const [cars, setCars] = useState([]);//Pega a lista de carros
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState('');

  const [formType, setFormType] = useState('login'); // login | register
  const [nameField, setNameField] = useState('');
  const [emailField, setEmailField] = useState('');
  const [passwordField, setPasswordField] = useState('');

  const getCars = async () => {
    setCars([]);// Limpa a lista de carros
    setLoading(true);// Seta loading como true antes da requisicao

    let result = await fetch(`https://api.b7web.com.br/carros/api/carros?ano=${year}`);
    let json = await result.json();// armazena resultado em json

    setLoading(false);// Tira loading

    if(json.error === '') {// Se não ocorreu nenhum erro
      setCars( json.cars );// Pego a lista e jogou dentro da state
    } else {
      alert( json.error );
    }
  };

  // Para pegar carros ano escolhido no select  
  const handleYearChange = (e) => {
    setYear( e.target.value );
  }
  // Fazer login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    let url = `https://api.b7web.com.br/carros/api/auth/${formType}`;

    let body = {// Corpo do form
      email: emailField,
      password: passwordField
    };

    if(formType === 'register') {// form register adiciona o nome
      body.name = nameField;
    }

    let result = await fetch(url, {// Pega resultado
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    let json = await result.json();// Espera o resultado

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

  useEffect(()=>{
    getCars();
  }, [year]);

  return (
    <div>
      <label>
        <input defaultChecked type="radio" name="formtype" onClick={()=>setFormType('login')} />
        Login
      </label><br/>

      <label>
        <input type="radio" name="formtype" onClick={()=>setFormType('register')} />
        Cadastro
      </label>

      {formType === 'login' && !token &&
        <h2>Faça Login</h2>
      }
      {token &&
      <>
        <div>
          <h3>Olá, {userName}</h3>
        </div>
        <button onClick={handleLogout}>Sair</button>
      </>
      }

      {formType === 'register' &&
        <h2>Faça o Cadastro</h2>
      }

      <form onSubmit={handleLoginSubmit}>

        {formType === 'register' &&
          <>
            <label>
              Nome:
              <input type="text" value={nameField} onChange={e=>setNameField(e.target.value)} />
            </label><br/>
          </>
        }
        
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
      </select>

      <button onClick={getCars}>Atualizar Lista</button>

      <hr/>

      {loading === true &&
        <h2>Caregando os carros...</h2>
      }

      {cars.length === 0 && loading === false &&
        <h2>Nenhum carro encontrado!</h2>
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