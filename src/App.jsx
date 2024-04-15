import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Form, Button, Card, Image, CardHeader, CardBody, CardFooter, Alert } from 'react-bootstrap';
import PriceFeed from './artifacts/contracts/PriceFeed.sol/PriceFeed.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

function App() {
  const [storedPrice, setStoredPrice] = useState('');
  const [item, setItem] = useState({ pairs: '' });
  const [clickedRadioButtonId, setClickedRadioButtonId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const { pairs } = item;

  const contractAddress = '0xF117e95f6BB1738aC7848768595537E8FdE25253';
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, PriceFeed.abi, provider);

  const getPair = async () => {
    if (!provider) {
      console.error('Ethereum provider not found');
      return;
    }

    if(clickedRadioButtonId==='') {
      setShowAlert(true);
      return;
    }

    setLoading(true); 
    try {
      const contractWithSigner = contract.connect(provider.getSigner());
      const contractPrice = await contractWithSigner.updatePrice(clickedRadioButtonId);
      await contractPrice.wait();
      const latestFetchedPrice = await contract.getLastFetchedPrice(clickedRadioButtonId);
      
      setStoredPrice('$' + (parseInt(latestFetchedPrice) / 100000000).toLocaleString());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setStoredPrice('');
    setItem((prevState) => ({
      ...prevState,
      pairs: e.target.value,
    }));

    setClickedRadioButtonId(e.target.id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className='container-fluid mt-5'>
      <div className='d-flex justify-content-center align-items-center'>
        <Card  className='mt-2 shadow bg-body rounded' style={{ width: '32rem' }}>
          <CardHeader as='h5' className='text-center'>
            <Image src='https://seeklogo.com/images/C/chainlink-logo-B072B6B9FE-seeklogo.com.png' width={170} height={55} fluid className='mt-5' />
            <hr></hr>
            Conversion Pair
          </CardHeader>
          <CardBody>
            <div className='d-flex justify-content-center'>
              <form onSubmit={handleSubmit}>
                <Form.Group controlId='pairs'>
                  <Form.Check
                    id='1'
                    value='BTC/USD'
                    type='radio'
                    aria-label='radio 1'
                    label='BTC/USD'
                    onChange={handleChange}
                    checked={pairs === 'BTC/USD'}
                  />
                  <Form.Check
                    id='2'
                    value='ETH/USD'
                    type='radio'
                    aria-label='radio 2'
                    label='ETH/USD'
                    onChange={handleChange}
                    checked={pairs === 'ETH/USD'}
                  />
                  <Form.Check
                    id='3'
                    value='LINK/USD'
                    type='radio'
                    aria-label='radio 3'
                    label='LINK/USD'
                    onChange={handleChange}
                    checked={pairs === 'LINK/USD'}
                  />
                  <Form.Check
                    id='4'
                    value='BTC/ETH'
                    type='radio'
                    aria-label='radio 4'
                    label='BTC/ETH'
                    onChange={handleChange}
                    checked={pairs === 'BTC/ETH'}
                  />
                </Form.Group>
              </form>
            </div>
            <div className='mt-4 d-flex justify-content-center'>
              <Button variant='outline-primary' size='sm' type='submit' onClick={getPair}>
                Submit
              </Button>
            </div>
          </CardBody>
          <CardFooter>
          <Alert className='mt-2' variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                  Please select a conversion pair.
          </Alert>  
          { loading ? (
            <div className='spinner-border text-primary' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
          ) : storedPrice !== '' ? (
            <div className='d-flex justify-content-center'>
              <h5>{pairs} ➡ {storedPrice}</h5>
            </div>
            ) : (
              <div style={{ height: '20px' }}></div>
          )}
          </CardFooter>
        </Card>
      </div> 
    </div>
  );
}

export default App;