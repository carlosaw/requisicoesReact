import { useEffect, useState, useRef } from 'react';

export default () => {

  const photoField = useRef();

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userName, setUserName] = useState(localStorage.getItem('username'));

  const [newCarBrand, setNewCarBrand] = useState('');// Marca
  const [newCarName, setNewCarName] = useState('');// Modelo
  const [newCarYear, setNewCarYear] = useState('');// Ano
  const [newCarPrice, setNewCarPrice] = useState('');// Preço

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

    // Upload de fotos
  const handleAddCarSubmit = async (e) => {// Adiciona Carro
    e.preventDefault();

    // Montar requisição
    let body = new FormData();
    // Pega informações para enviar
    body.append('brand', newCarBrand);
    body.append('name', newCarName);
    body.append('year', newCarYear);
    body.append('price', newCarPrice);
    // Verifica se usuario enviou foto
    if(photoField.current.files.length > 0) {
      body.append('photo', photoField.current.files[0]);
    }

    let result = await fetch('https://api.b7web.com.br/carros/api/carro', {
      method: 'POST',
      headers:{
        'Authorization': `Bearer ${token}`
      },
      body
    });
    // Pega o resultado
    let json = await result.json();

    if(json.error !== '') {
      alert("Ocorreu um erro!");
      console.log(json.error);
    } else {
      alert("Carro adicionado com sucesso!");
      getCars();// Recarrega os carros
      setNewCarBrand('');// Limpa os campos
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
        <>
          <label>
            <input defaultChecked type="radio" name="formtype" onClick={()=>setFormType('login')} />
            Login
          </label><br/>

          <label>
            <input type="radio" name="formtype" onClick={()=>setFormType('register')} />
            Cadastro
          </label>
        
          {formType === 'login' &&
            <h2>Faça Login</h2>
          }
        </>
      }

      {formType === 'register' && !token &&
        <h2>Faça o Cadastro</h2>
      }

      {token &&
      <>
        <div>
          <h3>Olá, {userName}</h3>
        </div>
        <button onClick={handleLogout}>Sair</button>

        <form onSubmit={handleAddCarSubmit}>
          <h4>Adicionar Carro</h4>
          <label>
            Marca do Carro:
            <input type="text" value={newCarBrand} onChange={e=>setNewCarBrand(e.target.value)} />
          </label><br/>
          <label>
            Nome do Carro:
            <input type="text"  value={newCarName} onChange={e=>setNewCarName(e.target.value)}/>
          </label>
          <label><br/>
            Ano do Carro:
            <input type="text" value={newCarYear} onChange={e=>setNewCarYear(e.target.value)} />
          </label><br/>
          <label>
            Preço do Carro:
            <input type="text" value={newCarPrice} onChange={e=>setNewCarPrice(e.target.value)} />
          </label><br/>
          <label>
            Foto do Carro:
            <input ref={photoField} type="file" />
          </label><br/>
          <input type="submit" value="Enviar" />
        </form>
      </>
      }

      {!token &&
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
        <option>1977</option>
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