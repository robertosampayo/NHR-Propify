import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import PropTypes from 'prop-types';
import { Service } from '../../Service';

dayjs.extend(customParseFormat)

function Form({tenants, setTenants, setError}) {

  const [isFormVisible, showForm] = useState(false);

  /// form
  const [name, setName] = useState('');
  const [leaseEndDate, setLeaseEndDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('CURRENT');



  // Valid form
  const [isValidForm, setValidForm] = useState({
    name: false,
    leaseEndDate: false,
    paymentStatus: true,
 
  });

  const enableSave = (form) => {
    return form.name && form.leaseEndDate && form.paymentStatus
  }


  useEffect(() => {
    const isValidDate = dayjs(leaseEndDate, 'DD-MM-YYYY', true).isValid();
    setValidForm(prevState => { return { ...prevState, leaseEndDate: isValidDate }})

  }, [leaseEndDate])

  const getLastId  = () => {
    const tenantsCopy = [ ...tenants];
    let id = 0;
    tenantsCopy.map(tenant => {
      if (tenant.id > id) id = tenant.id;
      return tenant;
    });

    return id;
  }



  // form values
  function onChangeName (e) {
    const name = e.target.value;
    if (name && name.length <= 25) {
      setName(name);
      setValidForm(prevState => { return { ...prevState, name: name !== ""} })
    }
  }

  function onChangePaymentStatus (e) {

    const paymentStatus = e.target.value;
    if (paymentStatus) {
      setPaymentStatus(paymentStatus);
      setValidForm(prevState => { return { ...prevState, paymentStatus: paymentStatus !== ""} })
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


  const isDisabled = useMemo(() => !enableSave(isValidForm), [isValidForm])


  return (
      <>
  
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
                  <label htmlFor='name'>Name</label>
                  <input 
                    id="name"
                    onChange={onChangeName} 
                    className="form-control"
                    value={name}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor='paymentStatus'>Payment Status</label>
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
                  <label htmlFor='leaseEndDate'>Lease End Date</label>
                  <input 
                    id="leaseEndDate"
                    onChange={onChangeLeaseEndDate} 
                    className="form-control"
                    value={leaseEndDate}
                    placeholder={`Type with this format ${dayjs().format('DD-MM-YYYY')}`}
                  />
                </div>
                <button 
                  disabled={isDisabled} 
                  className="btn btn-primary"
                >Save</button>
                
                <button onClick={() => showForm(false) } className="btn">Cancel</button>
              </form>
            </div>
            :
            null

          }
      </>
  );
}

export default React.memo(Form);

Form.propTypes = {
  tenants: PropTypes.array,
  setTenants: PropTypes.func,
  setError: PropTypes.func,
};
