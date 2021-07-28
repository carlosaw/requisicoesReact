import { useEffect, useState } from 'react';

export default () => {

  const [cars, setCars] = useState([]);//Pega a lista de carros

  const getCars = () => {
    fetch("https://api.b7web.com.br/carros/api/carros")//Faz a requisição
    .then(function(result) {//Pega resultado
      return result.json();//transforma em json
    })
    .then(function(json){//Pega o json e mostra
      if(json.error === '') {// Se não ocorreu nenhum erro
        setCars( json.cars );// Pego a lista e jogou dentro da state
      } else {
        alert( json.error );
      }
    });
  };

  useEffect(()=>{
    getCars();
  }, []);

  return (
    <div>
      <h1>Lista de Carros</h1>

      <button onClick={getCars}>Atualizar Lista</button>

      <hr/>

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