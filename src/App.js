import React, { useEffect, useState } from 'react';
import { Service } from './Service';
import Form from './components/Form'
import Table from './components/Table'
import Tabs from './components/Tabs'

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat)

function App() {

  const [tab, setTab] = useState('tab1');
  const [error, setError] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);




  useEffect(() => {

    const fetchTenants = async () => {

      try {
        setLoading(true);
        const data = await Service.getTenants();
        setTenants(data);
        setError(null);
        setLoading(false);
      } catch(error) {
        setLoading(false);
        setTenants([]);
        console.error(error);
        setError({ error : error, message: "There was an error loading the data, please reload the page.", type: 'get'});

        
      }

    }

    fetchTenants();
  }, []);

  const styles = {
    error: {
      display: 'flex',
      textAlign: 'center',
      width: '100%',
      margin: '0 auto',
      justifyContent: 'center',
      color: 'red',
    },
    errorData: {
      display: 'flex',
      textAlign: 'center',
      width: '100%',
      margin: '50px 0 0 0',
      justifyContent: 'center',
      color: 'red',
    },
    h3: {
      fontSize: '18px',
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      height: '50vh',
      alignItems: 'center',
    }
  }




  //if (!tenants && tenants?.length <= 0) return <h1>The data is empty</h1>;

  if (error && error?.message && error?.type === 'get' && !loading) {
    return <div style={styles.errorData}><h2>{error.message}</h2></div>
  }



  return (
      <>
  
          <div className="container">
            <h1>Tenants</h1>

            {loading ? 

              <div style={styles.loading}><h3 styles={styles.h3}>Loading data ...</h3></div>
              :
              <>
              
                <Tabs tab={tab} setTab={setTab} />
    
                <Table 
                  tenants={tenants} 
                  tab={tab}
                  setTenants={setTenants} 
                  setError={setError}
                />
              </>
            }
          </div>
      { error && error?.message && error?.type !== 'get' ?
        <div style={styles.error}>
          <h3 style={styles.h3}>{error.message}</h3>

        </div>
        :
        null

      }
          
          
      {!loading &&

          <Form 
            tenants={tenants} 
            setTenants={setTenants} 
            setError={setError}
          />
      }
      </>
  );
}

export default App;
