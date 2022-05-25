import dayjs from 'dayjs';
import React, { useEffect, useState, useCallback } from 'react';
import { Service } from './Service';

function App() {

  const [tab, setTab] = useState('tab1');
  const [tenants, setTenants] = useState([]);


  useEffect(() => {

    const fetchTenants = async () => {

      const data = await Service.getTenants();
      console.log(data);
      setTenants(data)

    }

    fetchTenants();
  }, []);


  const isLessThanMonth = useCallback((date) => {
    const monthAhead = dayjs().add(1, 'month');

    const leaseIsBeforeOneMOnth = dayjs(date).isBefore(monthAhead) && dayjs(date).isAfter(dayjs());
    return leaseIsBeforeOneMOnth;
  }, []);

  return (
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
                <th>#</th>
                <th>Name</th>
                <th>Payment Status</th>
                <th>Lease End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
             {/* <tr>
                <th>1</th>
                <td>Mark Otto</td>
                <td>CURRENT</td>
                <td>12/31/2020</td>
                <td>
                  <button className="btn btn-danger">Delete</button>
                </td>
              </tr> */}

              { tab === 'tab1' ?
                tenants.map((tenant) =>
                <tr key={tenant.id}>
                   <th>{tenant.id}</th>
                   <td>{tenant.name}</td>
                   <td>{tenant.paymentStatus}</td>
                   <td>{tenant.leaseEndDate}</td>
                   <td>
                     <button className="btn btn-danger">Delete</button>
                   </td>
                 </tr>) : null
              }

              { tab === 'tab2' ?
                tenants.filter(tenant => tenant.paymentStatus === 'LATE').map((tenant) =>
                <tr key={tenant.id}>
                   <th>{tenant.id}</th>
                   <td>{tenant.name}</td>
                   <td>{tenant.paymentStatus}</td>
                   <td>{tenant.leaseEndDate}</td>
                   <td>
                     <button className="btn btn-danger">Delete</button>
                   </td>
                 </tr>) : null
              }

              { tab === 'tab3' ?
                tenants.filter(tenant => isLessThanMonth(tenant.paymentStatus)).map((tenant) =>
                <tr key={tenant.id}>
                   <th>{tenant.id}</th>
                   <td>{tenant.name}</td>
                   <td>{tenant.paymentStatus}</td>
                   <td>{tenant.leaseEndDate}</td>
                   <td>
                     <button className="btn btn-danger">Delete</button>
                   </td>
                 </tr>) : null
              }
            </tbody>
          </table>
        </div>
        <div className="container">
          <button className="btn btn-secondary">Add Tenant</button>
        </div>
        <div className="container">
          <form>
            <div className="form-group">
              <label>Name</label>
              <input className="form-control"/>
            </div>
            <div className="form-group">
              <label>Payment Status</label>
              <select className="form-control">
                <option>CURRENT</option>
                <option>LATE</option>
              </select>
            </div>
            <div className="form-group">
              <label>Lease End Date</label>
              <input className="form-control"/>
            </div>
            <button className="btn btn-primary">Save</button>
            <button className="btn">Cancel</button>
          </form>
        </div>
      </>
  );
}

export default App;
