import React, { useEffect, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Service } from './Service';

dayjs.extend(customParseFormat)

function App() {

  const [tab, setTab] = useState('tab1');
  const [tenants, setTenants] = useState([]);

  // form
  const [isFormVisible, showForm] = useState(false);
  const [name, setName] = useState('');
  const [leaseEndDate, setLeaseEndDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('CURRENT');

  // error and loading states
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


  // sorting
  const [filters, setFilters] = useState({ sortBy: 'name', order: 'asc'})

  function sortBy (option) {

    if (filters.order === 'asc') {
      // if asc then sort by desc
      setTenants([...tenants.sort((a,b) => (a[option] < b[option]) ? 1 : ((b[option] < a[option]) ? -1 : 0))])
      setFilters({ ...filters, order: 'desc'})
    }

    if (filters.order === 'desc') {
      // if asc then sort by desc
      setTenants([...tenants.sort((a,b) => (a[option] > b[option]) ? 1 : ((b[option] > a[option]) ? -1 : 0))])
      setFilters({ ...filters, order: 'asc'})
    }
  }

  function formatDate (date) {
    const datef =  dayjs(date,'YYYY-MM-DDTHH:mm:ss')
    return dayjs(datef).format('DD-MM-YYYY[ ]HH:mm:ss');

  }

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


  const isLessThanMonth = useCallback((date) => {
    const monthAhead = dayjs().add(1, 'month');

    const leaseIsBeforeOneMOnth = dayjs(date).isBefore(monthAhead) && dayjs(date).isAfter(dayjs());
    return leaseIsBeforeOneMOnth;
  }, []);

  if (error && error?.message && error?.type === 'get' && !loading) {
    return <div><h2>{error.message}</h2></div>
  }


  // form values

  function onChangeName (e) {
    const name = e.target.value;
    if (name && name.length <= 25) {
      setName(name);
    }
  }

  function onChangePaymentStatus (e) {

    const paymentStatus = e.target.value;
    if (paymentStatus) {
      setPaymentStatus(paymentStatus);
    }
    
  }

  function onChangeLeaseEndDate (e) {
    const leaseEndDate = e.target.value;
    setLeaseEndDate(leaseEndDate);
  }

  function cleanForm () {
    showForm(false);
    setName('');
    setPaymentStatus('CURRENT');
    setLeaseEndDate('');

  }

  const getLastId  = () => {
    const tenantsCopy = [ ...tenants];
    let id = 0;
    tenantsCopy.map(tenant => {
      if (tenant.id > id) id = tenant.id;
      return tenant;
    });

    return id;
  }

  // Add new tenant
  async function onSubmitNewTenant (e) { 
    e.preventDefault();
    const leaseDate = dayjs(leaseEndDate,'DD-MM-YYYY')

    const newTenant = {
        id: getLastId() + 1,
        name: name,
        paymentStatus: paymentStatus,
        leaseEndDate: dayjs(leaseDate).format('YYYY-MM-DD[T]HH:mm:ss.SSSZ'),

    }

      try {
        const addedTenant = await Service.addTenant(newTenant);
      if (addedTenant) {
        setTenants([ ...tenants, newTenant])
        cleanForm()
        setError(null);
      }
      
    } catch (error) {
      console.error(error);
      setError({ error : error, message: "Could not add the tenant, please try again.", type: 'add'});
      setTimeout(() => {
        setError(null);
      }, 5000);
    }


  }


    // Delete tenant
    async function deleteTenantById (id) {

      try {
        const deletedTenant = await Service.deleteTenant(id);
        if (deletedTenant) {
          setTenants(prevTenant => [ ...prevTenant ].filter(tenant => tenant.id !== id))
          setError(null);
        }
        
      } catch (error) {
        console.error(error);
        setError({ error : error, message: "Could not delete the tenant, please try again.", type: 'delete'});
  
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
  
  
    }

  return (
      <>

       {loading ?
        <div><h3>Loading ...</h3></div>
        :
        <>

        <div className="container">
          <h1>Tenants</h1>

          <ul className="nav nav-tabs">
            <li className="nav-item" onClick={(e) => { e.preventDefault(); setTab("tab1")}}>
              <a className={`nav-link ${tab === 'tab1'? 'active': ''}`} href="/#">All</a>
            </li>
            <li className="nav-item" onClick={(e) => { e.preventDefault(); setTab("tab2")}}>
              <a className={`nav-link ${tab === 'tab2'? 'active': ''}`} href="/#" >Payment is late</a>
            </li>
            <li className="nav-item" onClick={(e) => { e.preventDefault(); setTab("tab3")}}>
              <a className={`nav-link ${tab === 'tab3'? 'active': ''}`} href="/#">Lease ends in less than a month</a>
            </li>
          </ul>

          <table className="table">
            <thead>
              <tr>
                <th style={{ cursor: 'pointer'}} onClick={() => sortBy('id')}>#</th>
                <th style={{ cursor: 'pointer' }} onClick={() => sortBy('name')}>Name</th>
                <th style={{ cursor: 'pointer' }} onClick={() => sortBy('paymentStatus')}>Payment Status</th>
                <th style={{ cursor: 'pointer' }} onClick={() => sortBy('leaseEndDate')}>Lease End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>

              { tab === 'tab1' ?
                tenants.map((tenant) =>
                <tr key={tenant.id}>
                   <th>{tenant.id}</th>
                   <td>{tenant.name}</td>
                   <td>{tenant.paymentStatus}</td>
                   <td>{formatDate(tenant.leaseEndDate)}</td>
                   <td>
                     <button
                       onClick={() => deleteTenantById(tenant.id)}
                       className="btn btn-danger"
                      >Delete</button>
                   </td>
                 </tr>) : null
              }

              { tab === 'tab2' ?
                tenants.filter(tenant => tenant.paymentStatus === 'LATE').map((tenant) =>
                <tr key={tenant.id}>
                   <th>{tenant.id}</th>
                   <td>{tenant.name}</td>
                   <td>{tenant.paymentStatus}</td>
                   <td>{formatDate(tenant.leaseEndDate)}</td>
                   <td>
                     <button                       
                        onClick={() => deleteTenantById(tenant.id)}
                         className="btn btn-danger"
                      >Delete</button>
                   </td>
                 </tr>) : null
              }

              { tab === 'tab3' ?
                tenants.filter(tenant => isLessThanMonth(tenant.paymentStatus)).map((tenant) =>
                <tr key={tenant.id}>
                   <th>{tenant.id}</th>
                   <td>{tenant.name}</td>
                   <td>{tenant.paymentStatus}</td>
                   <td>{formatDate(tenant.leaseEndDate)}</td>
                   <td>
                      <button                       
                        onClick={() => deleteTenantById(tenant.id)}
                         className="btn btn-danger"
                      >Delete</button>
                   </td>
                 </tr>) : null
              }
            </tbody>
          </table>
        </div>
        <div className="container">
          <button 
            className="btn btn-secondary"
            onClick={() => showForm(!isFormVisible)}
          
          >{isFormVisible ? 'Hide form' : 'Add Tenant'}</button>

        </div>

          { isFormVisible ?

            <div className="container">
              <form onSubmit={onSubmitNewTenant}>
                <div className="form-group">
                  <label>Name</label>
                  <input 
                    id="name"
                    onChange={onChangeName} 
                    className="form-control"
                    value={name}
                  />
                </div>
                <div className="form-group">
                  <label>Payment Status</label>
                  <select
                     id='paymentStatus'
                     className="form-control"
                     onChange={onChangePaymentStatus}
                  >
                    <option value='CURRENT'>CURRENT</option>
                    <option value='LATE'>LATE</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Lease End Date</label>
                  <input 
                    id="leaseEndDate"
                    onChange={onChangeLeaseEndDate} 
                    className="form-control"
                    value={leaseEndDate}
                    placeholder={`Type with this format ${dayjs().format('DD-MM-YYYY')}`}
                  />
                </div>
                <button className="btn btn-primary">Save</button>
                <button onClick={() => showForm(false) } className="btn">Cancel</button>
              </form>
            </div> : null }



        </>
       }
      </>
  );
}

export default App;
