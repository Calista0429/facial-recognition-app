import React, { useState } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [image, setImage] = useState(null);
  const [uploadResultMessage, setUploadResultMessage] = useState('Please upload an image to authenticate.');
  const [imgName, setImgName] = useState('placeholder.png');
  const [isAuth, setAuth] = useState(false);

  async function sendImage(e) {
    e.preventDefault();
    setImgName(image.name);  // 修复拼写错误

    const vistorImageName = uuidv4();

    fetch(`https://c97vflouph.execute-api.ap-northeast-1.amazonaws.com/dev/company-visitors-image/${vistorImageName}.jpeg`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpeg'
      },
      body: image
    }).then(async () => {
      const response = await authenticate(vistorImageName);
      if (response.Message === 'Success') {
        setAuth(true);
        setUploadResultMessage(`Hi ${response.firstname} ${response.lastname}, welcome to the company!`);
      } else {
        setAuth(false);
        setUploadResultMessage('Sorry, we could not find you in our database.');
      }
    }).catch((error) => {
      setAuth(false);
      setUploadResultMessage('There is an error during the authentication process. Please try again.');
      console.error('Error:', error);
    });
  }

  async function authenticate(vistorImageName) {
    const requestUrl = "https://c97vflouph.execute-api.ap-northeast-1.amazonaws.com/dev/employee?" + new URLSearchParams({
      objectKey: `${vistorImageName}.jpeg`,
    });

    return await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => data)
      .catch(error => {
        console.error(error);
        return { Message: 'Error' };
      });
  }

  return (
    <div className="App">
      <h2>Facial Recognition System</h2>
      <form onSubmit={sendImage}>
        <input type="file" name="image" onChange={e => setImage(e.target.files[0])} />
        <button type='submit'>Authenticate</button>
      </form>
      <div className={isAuth ? 'success' : 'failure'}>{uploadResultMessage}</div>
      <img src={require(`./visitors/${imgName}`)} alt="Visitor" height={250} width={250}></img>
    </div>
  );
}

export default App;
