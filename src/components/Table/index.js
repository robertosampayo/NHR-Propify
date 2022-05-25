import React, { useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Service } from '../../Service';
import PropTypes from 'prop-types';

dayjs.extend(customParseFormat)

function Table({tenants, setTenants, tab, setError}) {



  const [filters, setFilters] = useState({ sortBy: 'name', order: 'asc'});


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

  // Sorting
  function sortBy (option) {

    if (filters.order === 'asc') {
      //if asc then sort by desc
      setTenants( [...tenants.sort((a,b) => (a[option] < b[option]) ? 1 : (( b[option] < a[option]) ? -1 : 0)) ]);
      setFilters({ ...filters, order: 'desc'});
    }

    if (filters.order === 'desc') {
      //if desc then sort by asc
      setTenants( [...tenants.sort((a,b) => (a[option] > b[option]) ? 1 : ((b[option] > a[option]) ? -1 : 0)) ]);
      setFilters({ ...filters, order: 'asc'});
    }

  }

  function formatDate (date) {
    const datef =  dayjs(date,'YYYY-MM-DDTHH:mm:ss')
    return dayjs(datef).format('DD-MM-YYYY[ ]HH:mm:ss');
  }

  function isLessThanMonth (date) {
    const monthAhead = dayjs().add(1, 'month');

    const leaseIsBeforeOneMonth = dayjs(date).isBefore(monthAhead) && dayjs(date).isAfter(dayjs());
    return leaseIsBeforeOneMonth;
  }

  

  const tenatsToDisplay = tab === 'tab2' ? tenants.filter(tenant => tenant.paymentStatus === 'LATE') :
                          tab === 'tab3' ? tenants.filter(tenant => isLessThanMonth(tenant.leaseEndDate)) :
                          tab === 'tab1' ? tenants : [];

  const styles ={
    tbody: {
      position: 'relative',
      height: '20vh',
    },
    noData: {
      position: 'relative',
      textAlign: 'center',
      width: '100%',
      height: '40vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }
  }
  

  


          return tenatsToDisplay && tenatsToDisplay.length > 0 ?
             (<table className="table">
              <thead>
                <tr>
                  <th style={{ cursor: 'pointer' }} onClick={() => sortBy('id')}>#</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => sortBy('name')}>Name</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => sortBy('paymentStatus')}>Payment Status</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => sortBy('leaseEndDate')}>Lease End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>




              

                  <tbody style={styles.tbody}>
                    {tenatsToDisplay.map((tenant) =>
                     <tr key={tenant.id}>
                        <th>{tenant.id}</th>
                        <td>{tenant.name}</td>
                        <td>{tenant.paymentStatus}</td>
                        <td>{formatDate(tenant.leaseEndDate)}</td>
                        <td>
                          <button onClick={() => deleteTenantById(tenant.id)} className="btn btn-danger">Delete</button>
                        </td>
                      </tr>)

                    }


                  </tbody> 





                </table> ) : <div style={styles.noData}><p>No data to display</p></div>

              
              
              

}

export default React.memo(Table);

Table.propTypes = {
  tenants: PropTypes.array,
  setTenants: PropTypes.func,
  tab: PropTypes.string,
  setError: PropTypes.func,
};
